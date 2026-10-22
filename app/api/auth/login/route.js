import { NextResponse } from 'next/server'
import { USERS, authenticateUser, findUserByEmail, createSessionToken, ROLE_PERMISSIONS } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { role, email, password } = body

    let targetUser = null

    // 1. Direct role-based quick demo login
    if (role && USERS[role]) {
      targetUser = USERS[role]
    }
    // 2. Email + Password credential authentication
    else if (email && password) {
      targetUser = authenticateUser(email, password)
      if (!targetUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid email or password. Use demo credentials or register a new account.',
          },
          { status: 401 }
        )
      }
    }
    // 3. Email only lookup (quick login for demo accounts)
    else if (email) {
      const found = findUserByEmail(email)
      if (found) {
        targetUser = found
      } else {
        return NextResponse.json(
          { success: false, error: 'No account found with this email.' },
          { status: 404 }
        )
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Email and password, or stakeholder role required.' },
        { status: 400 }
      )
    }

    // Generate signed JWT
    const token = await createSessionToken(targetUser)

    const response = NextResponse.json({
      success: true,
      user: targetUser,
      role: targetUser.role,
      permissions: ROLE_PERMISSIONS[targetUser.role]?.can || {},
      token,
      message: `Signed in as ${targetUser.name} (${targetUser.roleTitle || targetUser.role})`,
    })

    // Set session cookie
    response.cookies.set({
      name: 'ecotrack_session',
      value: token,
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed: ' + error.message },
      { status: 500 }
    )
  }
}
