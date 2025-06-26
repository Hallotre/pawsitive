import { requireAdmin } from '@/lib/auth'
import { getPetById } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, PawPrint } from 'lucide-react'
import { PetForm } from '@/components'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPetPage({ params }: PageProps) {
  await requireAdmin()
  
  const { id } = await params
  
  let pet = null
  
  try {
    const petResponse = await getPetById(id)
    pet = petResponse.data
  } catch (error) {
    console.error('Error fetching pet:', error)
    notFound()
  }

  if (!pet) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center space-x-4">
          <Link
            href="/admin/pets"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit {pet.name}</h1>
            <p className="text-gray-600">Update pet information and details</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pet Information</h2>
            <p className="text-sm text-gray-600 mt-1">
              Update the details for {pet.name}
            </p>
          </div>
          
          <div className="p-6">
            <PetForm mode="edit" pet={pet} />
          </div>
        </div>
      </div>
    </div>
  )
} 