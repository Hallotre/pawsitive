import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { updatePet, deletePet } from '@/lib/api'

// Prevent static generation for this API route
export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await verifySession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const petData = await request.json()

    // Update pet using the API function
    const result = await updatePet(id, petData)
    
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('Update pet error:', error)
    return NextResponse.json(
      { error: 'Failed to update pet' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await verifySession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Delete pet using the API function
    await deletePet(id)
    
    return NextResponse.json({
      success: true,
      message: 'Pet deleted successfully'
    })
  } catch (error) {
    console.error('Delete pet error:', error)
    return NextResponse.json(
      { error: 'Failed to delete pet' },
      { status: 500 }
    )
  }
} 