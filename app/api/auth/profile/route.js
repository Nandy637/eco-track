import { NextResponse } from 'next/server'
import { verifyAuth, updateUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const auth = await verifyAuth(request)
    return NextResponse.json({
      success: true,
      user: auth.user,
      role: auth.role,
      permissions: auth.permissions,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const updatedUser = updateUser(auth.user.id, body)

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
