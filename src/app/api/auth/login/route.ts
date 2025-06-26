import { NextRequest, NextResponse } from 'next/server'
import { createSession, deleteSession } from '@/lib/session'
import { login, type NoroffUser } from '@/lib/api'

// Prevent static generation for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Clear any existing invalid session first
    await deleteSession()
    
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Use Noroff API for authentication
    const loginResponse = await login(email, password)
    
    if (loginResponse.data) {
      const user: NoroffUser = loginResponse.data
      
      // Create local session with venueManager property
      // venueManager: true becomes 'admin', false becomes 'user'
      await createSession(user.name, user.email, user.venueManager || false)
      
      const role = user.venueManager ? 'admin' : 'user'
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.name,
          email: user.email,
          name: user.name,
          role: role,
          venueManager: user.venueManager || false
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    
    // Handle specific API errors
    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Authentication service unavailable. Please try again later.' },
      { status: 500 }
    )
  }
} 