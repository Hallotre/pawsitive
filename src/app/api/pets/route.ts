import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { createPet } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifySession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const petData = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'breed', 'age', 'size', 'color', 'description']
    for (const field of requiredFields) {
      if (!petData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create pet using the API function
    const result = await createPet(petData)
    
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('Create pet error:', error)
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    )
  }
} 