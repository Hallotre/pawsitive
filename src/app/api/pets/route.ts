import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { createPet } from '@/lib/api'

// Prevent static generation for this API route
export const dynamic = 'force-dynamic'

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
    const requiredFields = ['name', 'species', 'breed', 'age', 'gender', 'size', 'color', 'description', 'location', 'adoptionStatus']
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