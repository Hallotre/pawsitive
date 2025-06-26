import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, PawPrint } from 'lucide-react'
import { PetForm } from '@/components'

export default async function NewPetPage() {
  await requireAdmin()

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
            <h1 className="text-3xl font-bold text-gray-900">Add New Pet</h1>
            <p className="text-gray-600">Create a new pet listing for adoption</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pet Information</h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the details for the new pet listing
            </p>
          </div>
          
          <div className="p-6">
            <PetForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  )
} 