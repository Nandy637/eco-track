import { SignJWT, jwtVerify } from 'jose'

// JWT Secret Key (derived from environment or secure development fallback)
const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'ecotrack-enterprise-ghg-audit-secret-key-2026-auth'
)

// Predefined Multi-Tenant Organizational Stakeholders
export const USERS = {
  admin: {
    id: 'usr-admin-01',
    name: 'Michael Thomas',
    email: 'admin@ecotrack.corp',
    role: 'admin',
    roleTitle: 'Corporate Admin / CSO',
    department: 'Corporate Global Sustainability',
    sector: 'All Sectors',
    avatar: 'MT',
    badgeTone: 'emerald',
  },
  operator: {
    id: 'usr-oper-02',
    name: 'Elena Rostova',
    email: 'operator@ecotrack.corp',
    role: 'operator',
    roleTitle: 'Facility Operations Lead',
    department: 'Site Operations & Energy Management',
    sector: 'Manufacturing Site A',
    avatar: 'ER',
    badgeTone: 'sky',
  },
  auditor: {
    id: 'usr-audit-03',
    name: 'Dr. Eleanor Vance',
    email: 'auditor@bv.com',
    role: 'auditor',
    roleTitle: 'Lead Environmental Auditor',
    department: 'Bureau Veritas Assurance',
    sector: 'Third-Party Independent Verification',
    avatar: 'EV',
    badgeTone: 'amber',
  },
}

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
 * Generate a signed JWT session token
 */
export async function createSessionToken(userPayload) {
  return await new SignJWT({
    sub: userPayload.id,
    role: userPayload.role,
    name: userPayload.name,
    email: userPayload.email,
    sector: userPayload.sector,
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
 * Checks Authorization header, cookies, or demo role header (x-user-role)
 */
export async function verifyAuth(request) {
  // 1. Direct explicit testing/demo header (highest precedence for developer testability)
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
    if (decoded && USERS[decoded.role]) {
      const u = USERS[decoded.role]
      return {
        authenticated: true,
        user: { ...u, ...decoded },
        role: decoded.role,
        permissions: ROLE_PERMISSIONS[decoded.role].can,
        source: 'jwt',
      }
    }
  }

  // Default fallback for unauthenticated public requests in prototype mode (defaults to Corporate Admin)
  const defaultUser = USERS.admin
  return {
    authenticated: true,
    user: defaultUser,
    role: defaultUser.role,
    permissions: ROLE_PERMISSIONS[defaultUser.role].can,
    source: 'default-admin',
  }
}
