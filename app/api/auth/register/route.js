import { NextResponse } from 'next/server'
import { registerUser, createSessionToken, ROLE_PERMISSIONS } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password, role = 'operator', department, sector } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      )
    }

    const newUser = registerUser({
      name,
      email,
      password,
      role,
      department,
      sector,
    })

    const token = await createSessionToken(newUser)

    const response = NextResponse.json({
      success: true,
      user: newUser,
      role: newUser.role,
      permissions: ROLE_PERMISSIONS[newUser.role]?.can || {},
      token,
      message: `Account created successfully for ${newUser.name}`,
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
      { success: false, error: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}
