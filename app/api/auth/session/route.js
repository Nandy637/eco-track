import { NextResponse } from 'next/server'
import { USERS, ROLE_PERMISSIONS, verifyAuth, createSessionToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        user: null,
        role: null,
        allRoles: USERS,
      })
    }
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: auth.user,
      role: auth.role,
      permissions: auth.permissions,
      allRoles: USERS,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { role } = body

    if (!role || !USERS[role]) {
      return NextResponse.json(
        { success: false, error: `Invalid role '${role}'. Expected 'admin', 'operator', or 'auditor'.` },
        { status: 400 }
      )
    }

    const newUser = USERS[role]
    const token = await createSessionToken(newUser)

    const response = NextResponse.json({
      success: true,
      user: newUser,
      role: newUser.role,
      permissions: ROLE_PERMISSIONS[newUser.role].can,
      token,
      message: `Switched active role to ${newUser.roleTitle}`,
    })

    response.cookies.set({
      name: 'ecotrack_session',
      value: token,
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to switch role' },
      { status: 500 }
    )
  }
}
