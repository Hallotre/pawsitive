import { NextRequest, NextResponse } from 'next/server'
import { createSession, deleteSession } from '@/lib/session'
import { register, type NoroffUser } from '@/lib/api'

// Prevent static generation for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Clear any existing invalid session first
    await deleteSession()
    
    const { name, email, password, venueManager = false } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check for valid Noroff name format (only a-Z, 0-9, and _)
    const namePattern = /^[a-zA-Z0-9_]+$/
    if (!namePattern.test(name)) {
      return NextResponse.json(
        { error: 'Name can only contain letters, numbers, and underscores (no spaces or special characters)' },
        { status: 400 }
      )
    }

    // Check for valid Noroff email domain
    if (!email.endsWith('@stud.noroff.no')) {
      return NextResponse.json(
        { error: 'Email must be a valid @stud.noroff.no address' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Use Noroff API for registration with venueManager flag
    const registerResponse = await register(name, email, password, venueManager)
    
    if (registerResponse.data) {
      const user: NoroffUser = registerResponse.data
      
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
        { error: 'Registration failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific API errors
    if (error instanceof Error && error.message.includes('409')) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    if (error instanceof Error && error.message.includes('400')) {
      return NextResponse.json(
        { error: 'Invalid registration data. Please check your input.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Registration service unavailable. Please try again later.' },
      { status: 500 }
    )
  }
} 