import { SignJWT, jwtVerify } from 'jose'

// JWT Secret Key (derived from environment or secure development fallback)
const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'ecotrack-enterprise-ghg-audit-secret-key-2026-auth'
)

// Predefined Multi-Tenant Organizational Stakeholders with passwords for full auth
export const USERS = {
  admin: {
    id: 'usr-admin-01',
    name: 'Michael Thomas',
    email: 'admin@ecotrack.corp',
    password: 'admin123',
    role: 'admin',
    roleTitle: 'Corporate Admin / CSO',
    department: 'Corporate Global Sustainability',
    sector: 'All Sectors',
    avatar: 'MT',
    badgeTone: 'emerald',
    preferences: {
      standard: 'IPCC AR6',
      gwpMetric: 'GWP-100',
      gridFactor: 0.386,
      anomalyAlerts: true,
      weeklyDigest: true,
      theme: 'light',
    },
  },
  operator: {
    id: 'usr-oper-02',
    name: 'Elena Rostova',
    email: 'operator@ecotrack.corp',
    password: 'operator123',
    role: 'operator',
    roleTitle: 'Facility Operations Lead',
    department: 'Site Operations & Energy Management',
    sector: 'Manufacturing Site A',
    avatar: 'ER',
    badgeTone: 'sky',
    preferences: {
      standard: 'IPCC AR6',
      gwpMetric: 'GWP-100',
      gridFactor: 0.386,
      anomalyAlerts: true,
      weeklyDigest: false,
      theme: 'light',
    },
  },
  auditor: {
    id: 'usr-audit-03',
    name: 'Dr. Eleanor Vance',
    email: 'auditor@bv.com',
    password: 'auditor123',
    role: 'auditor',
    roleTitle: 'Lead Environmental Auditor',
    department: 'Bureau Veritas Assurance',
    sector: 'Third-Party Independent Verification',
    avatar: 'EV',
    badgeTone: 'amber',
    preferences: {
      standard: 'IPCC AR6',
      gwpMetric: 'GWP-100',
      gridFactor: 0.386,
      anomalyAlerts: false,
      weeklyDigest: true,
      theme: 'light',
    },
  },
}

// In-memory registered user cache (persists during node process runtime alongside MongoDB)
if (!global.__ecotrack_registered_users) {
  global.__ecotrack_registered_users = new Map()
}
const customUsers = global.__ecotrack_registered_users

// Role Permissions Matrix
export const ROLE_PERMISSIONS = {
  admin: {
    title: 'Corporate Admin / CSO',
    description: 'Full organizational authority over ESG targets, disclosures, user governance, and data ledgers.',
    can: {
      log_emissions: true,
      batch_import: true,
      log_water: true,
      manage_targets: true,
      approve_disclosures: true,
      manage_team: true,
      export_reports: true,
      view_ledger: true,
      view_factors: true,
      edit_settings: true,
    },
  },
  operator: {
    title: 'Facility Operator',
    description: 'Operational permissions to log direct activity, upload utility CSVs, and manage water readings.',
    can: {
      log_emissions: true,
      batch_import: true,
      log_water: true,
      manage_targets: false,
      approve_disclosures: false,
      manage_team: false,
      export_reports: true,
      view_ledger: true,
      view_factors: true,
      edit_settings: false,
    },
  },
  auditor: {
    title: 'Sustainability Auditor',
    description: 'Read-only audit access to historical ledgers, IPCC emission factors, and compliance exports.',
    can: {
      log_emissions: false,
      batch_import: false,
      log_water: false,
      manage_targets: false,
      approve_disclosures: false,
      manage_team: false,
      export_reports: true,
      view_ledger: true,
      view_factors: true,
      audit_verify: true,
      edit_settings: false,
    },
  },
}

/**
 * Check if a role possesses a specific permission
 */
export function hasPermission(role, action) {
  if (!role || !ROLE_PERMISSIONS[role]) return false
  return Boolean(ROLE_PERMISSIONS[role].can[action])
}

/**
 * Find user by email across predefined and dynamic users
 */
export function findUserByEmail(email) {
  if (!email) return null
  const cleanEmail = email.trim().toLowerCase()

  // 1. Check predefined USERS
  for (const key of Object.keys(USERS)) {
    if (USERS[key].email.toLowerCase() === cleanEmail) {
      return USERS[key]
    }
  }

  // 2. Check custom registered users
  if (customUsers.has(cleanEmail)) {
    return customUsers.get(cleanEmail)
  }

  return null
}

/**
 * Authenticate credentials (email + password or demo password)
 */
export function authenticateUser(email, password) {
  const user = findUserByEmail(email)
  if (!user) return null

  // Allow standard password or universal demo password
  const cleanPass = (password || '').trim()
  if (
    cleanPass === user.password ||
    cleanPass === 'ecotrack2026!' ||
    cleanPass === 'password123' ||
    cleanPass === 'admin123'
  ) {
    const { password: _, ...safeUser } = user
    return safeUser
  }

  return null
}

/**
 * Register a new user in system
 */
export function registerUser({ name, email, password, role = 'operator', department, sector }) {
  const cleanEmail = email.trim().toLowerCase()
  if (findUserByEmail(cleanEmail)) {
    throw new Error('A user with this email address already exists.')
  }

  const roleTitles = {
    admin: 'Corporate Admin / Sustainability Officer',
    operator: 'Facility Operations Lead',
    auditor: 'Assurance & Compliance Auditor',
  }

  const badgeTones = {
    admin: 'emerald',
    operator: 'sky',
    auditor: 'amber',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const newUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: cleanEmail,
    password: password.trim(),
    role,
    roleTitle: roleTitles[role] || 'Sustainability Officer',
    department: department?.trim() || 'Sustainability Operations',
    sector: sector?.trim() || 'Facility Operations',
    avatar: initials || 'US',
    badgeTone: badgeTones[role] || 'emerald',
    twoFactorEnabled: false,
    preferences: {
      standard: 'IPCC AR6',
      gwpMetric: 'GWP-100',
      gridFactor: 0.386,
      anomalyAlerts: true,
      weeklyDigest: true,
      theme: 'light',
    },
  }

  customUsers.set(cleanEmail, newUser)
  const { password: _, ...safeUser } = newUser
  return safeUser
}

/**
 * Update user profile or preferences
 */
export function updateUser(id, updates) {
  // Check predefined users
  for (const key of Object.keys(USERS)) {
    if (USERS[key].id === id) {
      USERS[key] = {
        ...USERS[key],
        ...updates,
        preferences: {
          ...USERS[key].preferences,
          ...(updates.preferences || {}),
        },
      }
      const { password: _, ...safeUser } = USERS[key]
      return safeUser
    }
  }

  // Check custom registered users
  for (const [email, user] of customUsers.entries()) {
    if (user.id === id) {
      const updated = {
        ...user,
        ...updates,
        preferences: {
          ...user.preferences,
          ...(updates.preferences || {}),
        },
      }
      customUsers.set(email, updated)
      const { password: _, ...safeUser } = updated
      return safeUser
    }
  }

  return null
}

/**
 * Generate a signed JWT session token
 */
export async function createSessionToken(userPayload) {
  return await new SignJWT({
    sub: userPayload.id,
    role: userPayload.role,
    name: userPayload.name,
    email: userPayload.email,
    sector: userPayload.sector,
    department: userPayload.department,
    avatar: userPayload.avatar,
    badgeTone: userPayload.badgeTone,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

/**
 * Extract and authenticate caller identity from incoming Next.js Request
 */
export async function verifyAuth(request) {
  // 1. Direct explicit testing/demo header (highest precedence)
  const roleHeader = request.headers.get('x-user-role')
  if (roleHeader && USERS[roleHeader]) {
    const u = USERS[roleHeader]
    return {
      authenticated: true,
      user: u,
      role: u.role,
      permissions: ROLE_PERMISSIONS[u.role].can,
      source: 'header-override',
    }
  }

  // 2. Bearer token in Authorization header
  const authHeader = request.headers.get('authorization')
  let token = null
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  }

  // 3. Cookie fallback
  if (!token) {
    const cookieHeader = request.headers.get('cookie') || ''
    const match = cookieHeader.match(/ecotrack_session=([^;]+)/)
    if (match) token = match[1]
  }

  if (token) {
    const decoded = await verifySessionToken(token)
    if (decoded) {
      // Find matching user from USERS or customUsers
      const existing = findUserByEmail(decoded.email) || USERS[decoded.role]
      const fullUser = existing ? { ...existing, ...decoded } : decoded

      return {
        authenticated: true,
        user: fullUser,
        role: decoded.role,
        permissions: ROLE_PERMISSIONS[decoded.role]?.can || {},
        source: 'jwt',
      }
    }
  }

  // Default unauthenticated response when no valid session or token is present
  return {
    authenticated: false,
    user: null,
    role: null,
    permissions: {},
    source: 'unauthenticated',
  }
}
