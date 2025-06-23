import { requireAdmin } from '@/lib/auth'
import { getPets } from '@/lib/api'
import Link from 'next/link'
import { PawPrint, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { DeletePetButton } from '@/components'

interface SearchParams {
  page?: string
}

export default async function AdminPetsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await requireAdmin()
  
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const limit = 12
  
  let pets: any[] = []
  let totalCount = 0
  let totalPages = 1
  
  try {
    const petsResponse = await getPets(page, limit)
    pets = petsResponse.data
    totalCount = petsResponse.meta?.totalCount || pets.length
    totalPages = Math.ceil(totalCount / limit)
  } catch (error) {
    console.error('Error fetching pets:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <PawPrint className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">Manage Pets</h1>
            </div>
            <Link
              href="/admin/pets/new"
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Pet
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pet Overview</h2>
              <p className="text-sm text-gray-600">Manage all pets in the system</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              <p className="text-sm text-gray-600">Total Pets</p>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        {pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1">
                    {pet.image?.url ? (
                      <img
                        src={pet.image.url}
                        alt={pet.image.alt || pet.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <PawPrint className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{pet.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{pet.breed}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>{pet.age} years old</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{pet.size}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/pets/${pet.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <DeletePetButton petId={pet.id} petName={pet.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                {page > 1 && (
                  <Link
                    href={`/admin/pets?page=${page - 1}`}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                
                <span className="px-3 py-2 text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                
                {page < totalPages && (
                  <Link
                    href={`/admin/pets?page=${page + 1}`}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <PawPrint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first pet to the system.</p>
            <Link
              href="/admin/pets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Pet
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 