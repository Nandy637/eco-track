'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { USERS, ROLE_PERMISSIONS } from '@/lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loginModalTab, setLoginModalTab] = useState('signin') // 'signin' | 'personas' | 'register'

  // Enforce mandatory authentication on every page reload and initial visit
  useEffect(() => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setRole(null)
    setToken(null)
    setIsLoading(false)

    try {
      localStorage.removeItem('ecotrack_logged_out')
      localStorage.removeItem('ecotrack_active_role')
      localStorage.removeItem('ecotrack_user_profile')
      // Clear server-side session cookie so every reload requires a fresh login
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    } catch {}
  }, [])

  // Fast Persona / Role Switcher
  const switchRole = useCallback(async (newRoleKey) => {
    if (!USERS[newRoleKey]) return

    const targetUser = USERS[newRoleKey]
    setCurrentUser(targetUser)
    setRole(newRoleKey)
    setIsAuthenticated(true)

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

  // Login function supporting email & password or role
  const login = useCallback(async ({ email, password, role: selectedRole }) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      })
      const data = await res.json()

      if (data.success && data.user) {
        setCurrentUser(data.user)
        setRole(data.user.role)
        setIsAuthenticated(true)
        if (data.token) setToken(data.token)

        setLoginModalOpen(false)
        return { success: true, user: data.user }
      }
      return { success: false, error: data.error || 'Invalid credentials' }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Register function
  const register = useCallback(async ({ name, email, password, role: regRole, department, sector }) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: regRole, department, sector }),
      })
      const data = await res.json()

      if (data.success && data.user) {
        setCurrentUser(data.user)
        setRole(data.user.role)
        setIsAuthenticated(true)
        if (data.token) setToken(data.token)

        setLoginModalOpen(false)
        return { success: true, user: data.user }
      }
      return { success: false, error: data.error || 'Registration failed' }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}

    setIsAuthenticated(false)
    setCurrentUser(null)
    setRole(null)
    setToken(null)

    try {
      localStorage.removeItem('ecotrack_user_profile')
      localStorage.removeItem('ecotrack_active_role')
      localStorage.removeItem('ecotrack_logged_out')
    } catch {}
  }, [])

  // Update Profile & Preferences
  const updateProfile = useCallback(
    async (updates) => {
      const mergedUser = {
        ...(currentUser || {}),
        ...updates,
        preferences: {
          ...((currentUser && currentUser.preferences) || {}),
          ...(updates.preferences || {}),
        },
      }
      setCurrentUser(mergedUser)

      try {
        localStorage.setItem('ecotrack_user_profile', JSON.stringify(mergedUser))
      } catch {}

      try {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(updates),
        })
        const data = await res.json()
        if (data.success && data.user) {
          setCurrentUser(data.user)
        }
      } catch (e) {
        console.warn('Profile sync to server skipped:', e.message)
      }
    },
    [currentUser, role, token]
  )

  // Open login modal to a specific tab
  const openLoginModal = useCallback((tab = 'signin') => {
    setLoginModalTab(tab)
    setLoginModalOpen(true)
  }, [])

  // Permission check helper
  const can = useCallback(
    (permissionKey) => {
      if (!isAuthenticated || !role) return false
      const perms = ROLE_PERMISSIONS[role]?.can
      return Boolean(perms && perms[permissionKey])
    },
    [role, isAuthenticated]
  )

  // Authenticated fetch wrapper injecting user role headers
  const authFetch = useCallback(
    (url, options = {}) => {
      const headers = {
        ...(options.headers || {}),
        ...(role ? { 'x-user-role': role } : {}),
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
    isAuthenticated,
    isLoading,
    loginModalOpen,
    setLoginModalOpen,
    loginModalTab,
    setLoginModalTab,
    openLoginModal,
    switchRole,
    login,
    register,
    logout,
    updateProfile,
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
