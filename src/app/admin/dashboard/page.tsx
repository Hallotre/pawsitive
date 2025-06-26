import { requireAdmin } from '@/lib/auth'
import { getPets } from '@/lib/api'
import Link from 'next/link'
import { PawPrint, Plus, Users, BarChart3, Settings } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await requireAdmin()
  
  // Get pet statistics
  let totalPets = 0
  let recentPets: Array<{
    id: string;
    name: string;
    breed: string;
    age: number;
    image?: { url: string; alt: string };
  }> = []
  
  try {
    const petsResponse = await getPets(1, 100) // Get first 100 pets for stats
    totalPets = petsResponse.meta?.totalCount || petsResponse.data.length
    recentPets = petsResponse.data.slice(0, 5) // Get 5 most recent
  } catch (error) {
    console.error('Error fetching pets:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.email}!</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PawPrint className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pets</p>
                <p className="text-2xl font-bold text-gray-900">{totalPets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{totalPets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">+{Math.floor(totalPets * 0.2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Actions Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <Link
                href="/admin/pets/new"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Pet
              </Link>
              
              <Link
                href="/admin/pets"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <PawPrint className="h-5 w-5 mr-2" />
                Manage All Pets
              </Link>
              
              <Link
                href="/pets"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Users className="h-5 w-5 mr-2" />
                View Public Site
              </Link>
            </div>
          </div>

          {/* Recent Pets */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Pets</h2>
            </div>
            <div className="p-6">
              {recentPets.length > 0 ? (
                <div className="space-y-4">
                  {recentPets.map((pet) => (
                    <div key={pet.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {pet.image?.url ? (
                          <img
                            src={pet.image.url}
                            alt={pet.image.alt || pet.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <PawPrint className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {pet.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {pet.breed} • {pet.age} years old
                        </p>
                      </div>
                      <Link
                        href={`/admin/pets/${pet.id}`}
                        className="text-sm text-orange-500 hover:text-orange-600"
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No pets found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 