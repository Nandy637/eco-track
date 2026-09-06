import { NextResponse } from 'next/server'
import { USERS, createSessionToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { role, email } = body

    // Match user by requested role key or email
    let matchedUser = null
    if (role && USERS[role]) {
      matchedUser = USERS[role]
    } else if (email) {
      matchedUser = Object.values(USERS).find((u) => u.email.toLowerCase() === email.toLowerCase())
    }

    if (!matchedUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials. Choose from Admin, Operator, or Auditor.',
        },
        { status: 401 }
      )
    }

    // Generate signed JWT
    const token = await createSessionToken(matchedUser)

    const response = NextResponse.json({
      success: true,
      user: matchedUser,
      token,
      message: `Signed in as ${matchedUser.name} (${matchedUser.roleTitle})`,
    })

    // Set HTTP session cookie for browser persistence
    response.cookies.set({
      name: 'ecotrack_session',
      value: token,
      httpOnly: false, // accessible to client for offline demonstration state
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
