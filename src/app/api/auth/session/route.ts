import { NextResponse } from 'next/server'
import { verifySession, deleteSession } from '@/lib/session'

// Prevent static generation for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Session API: Starting session verification...')
    const session = await verifySession()
    console.log('Session API: Verification result:', session ? 'Success' : 'Failed')
    
    if (!session) {
      // Clear any invalid session cookie
      await deleteSession()
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        email: session.email,
        role: session.role
      }
    })
  } catch (error) {
    console.error('Session check error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })
    
    // Clear any invalid session cookie on error
    try {
      await deleteSession()
    } catch (deleteError) {
      console.error('Failed to delete invalid session:', deleteError)
    }
    
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    )
  }
} 