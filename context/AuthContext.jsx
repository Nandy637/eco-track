'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { USERS, ROLE_PERMISSIONS } from '@/lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(USERS.admin)
  const [role, setRole] = useState('admin')
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Initialize session on mount (from cookie / localStorage / API)
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('ecotrack_active_role')
      if (savedRole && USERS[savedRole]) {
        setCurrentUser(USERS[savedRole])
        setRole(savedRole)
      }
    } catch {
      // Local storage unavailable, keep default
    }

    // Ping /api/auth/session to retrieve server-side verified token
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          // If we had a locally chosen role, ensure server aligns
          const savedRole = localStorage.getItem('ecotrack_active_role')
          if (!savedRole && data.user.role) {
            setCurrentUser(data.user)
            setRole(data.user.role)
          }
        }
      })
      .catch((err) => console.warn('Auth session check skipped:', err.message))
      .finally(() => setIsLoading(false))
  }, [])

  // Fast Persona / Role Switcher for live presentations and stakeholder evaluation
  const switchRole = useCallback(async (newRoleKey) => {
    if (!USERS[newRoleKey]) return

    const targetUser = USERS[newRoleKey]
    setCurrentUser(targetUser)
    setRole(newRoleKey)

    try {
      localStorage.setItem('ecotrack_active_role', newRoleKey)
    } catch (e) {
      console.warn('Storage sync skipped')
    }

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRoleKey }),
      })
      const data = await res.json()
      if (data.token) setToken(data.token)
    } catch (err) {
      console.warn('Server role switch sync failed, client state maintained.', err.message)
    }
  }, [])

  // Custom login function
  const login = useCallback(async ({ role: selectedRole, email }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, email }),
      })
      const data = await res.json()
      if (data.success && data.user) {
        setCurrentUser(data.user)
        setRole(data.user.role)
        if (data.token) setToken(data.token)
        try {
          localStorage.setItem('ecotrack_active_role', data.user.role)
        } catch {}
        setLoginModalOpen(false)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    // Reset to auditor (or admin)
    switchRole('auditor')
  }, [switchRole])

  // Permission check helper
  const can = useCallback(
    (permissionKey) => {
      const perms = ROLE_PERMISSIONS[role]?.can
      return Boolean(perms && perms[permissionKey])
    },
    [role]
  )

  // Authenticated fetch wrapper injecting user role headers
  const authFetch = useCallback(
    (url, options = {}) => {
      const headers = {
        ...(options.headers || {}),
        'x-user-role': role,
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      return fetch(url, { ...options, headers })
    },
    [role, token]
  )

  const value = {
    user: currentUser,
    role,
    token,
    isLoading,
    loginModalOpen,
    setLoginModalOpen,
    switchRole,
    login,
    logout,
    can,
    authFetch,
    isAdmin: role === 'admin',
    isOperator: role === 'operator',
    isAuditor: role === 'auditor',
    permissions: ROLE_PERMISSIONS[role]?.can || {},
    allRoles: USERS,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
