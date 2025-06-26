'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, PawPrint, Search, User, Calendar, MapPin, Star, TrendingUp } from 'lucide-react'
import { getPets, Pet } from '@/lib/api'
import { getFavorites, addToFavorites, removeFromFavorites, isFavorited, FavoriteData } from '@/lib/favorites'

interface SessionData {
  userId: string
  email: string
  role: string
}



function FavoritePetCard({ pet, onRemove }: { pet: Pet; onRemove: (petId: string) => void }) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    removeFromFavorites(pet.id)
    onRemove(pet.id)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={pet.image?.url || '/api/placeholder/400/300'}
          alt={pet.image?.alt || `Photo of ${pet.name}`}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label={`Remove ${pet.name} from favorites`}
          className="absolute top-3 right-3 p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {pet.size}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{pet.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{pet.breed} • {pet.age} years old</p>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{pet.location || 'Location not specified'}</span>
        </div>
        <Link
          href={`/pets/${pet.id}`}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

function QuickStatsCard({ icon: Icon, title, value, subtitle, color }: {
  icon: any
  title: string
  value: string | number
  subtitle: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default function UserDashboard() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [favorites, setFavorites] = useState<FavoriteData[]>([])
  const [favoritePets, setFavoritePets] = useState<Pet[]>([])
  const [recentPets, setRecentPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setSession(data.user)
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/auth/login'
        }
      } catch (error) {
        console.error('Failed to check auth status:', error)
        window.location.href = '/auth/login'
      }
    }

    checkAuth()
    setMounted(true)
  }, [])

  // Load favorites and fetch favorite pets
  useEffect(() => {
    if (!mounted) return

    const loadFavorites = async () => {
      try {
        setLoading(true)
        const favoritesList = getFavorites()
        setFavorites(favoritesList)

        // Fetch recent pets for recommendations
        const recentResponse = await getPets(1, 6)
        setRecentPets(recentResponse.data)

        // Fetch favorite pets details
        if (favoritesList.length > 0) {
          const allPetsResponse = await getPets(1, 100) // Get more pets to find favorites
          const favoritePetDetails = allPetsResponse.data.filter(pet => 
            favoritesList.some(fav => fav.petId === pet.id)
          )
          setFavoritePets(favoritePetDetails)
        }
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [mounted])

  const handleRemoveFavorite = (petId: string) => {
    setFavoritePets(prev => prev.filter(pet => pet.id !== petId))
    setFavorites(prev => prev.filter(fav => fav.petId !== petId))
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.email}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/pets"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Browse Pets
            </Link>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickStatsCard
            icon={Heart}
            title="Favorite Pets"
            value={favoritePets.length}
            subtitle="pets you've saved"
            color="pink"
          />
          <QuickStatsCard
            icon={Star}
            title="Total Available"
            value={recentPets.length > 0 ? `${recentPets.length}+` : '0'}
            subtitle="pets looking for homes"
            color="orange"
          />
          <QuickStatsCard
            icon={TrendingUp}
            title="New This Week"
            value="12"
            subtitle="recently added pets"
            color="green"
          />
        </div>

        {/* Favorite Pets Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Favorite Pets</h2>
            <Link
              href="/pets"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Find More Pets →
            </Link>
          </div>

          {favoritePets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePets.map(pet => (
                <FavoritePetCard
                  key={pet.id}
                  pet={pet}
                  onRemove={handleRemoveFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">
                Start browsing pets and click the heart icon to save your favorites!
              </p>
              <Link
                href="/pets"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Available Pets
              </Link>
            </div>
          )}
        </div>

        {/* Recently Added Pets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added Pets</h2>
            <Link
              href="/pets"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPets.slice(0, 6).map(pet => (
              <div key={pet.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={pet.image?.url || '/api/placeholder/400/300'}
                    alt={pet.image?.alt || `Photo of ${pet.name}`}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => {
                      if (isFavorited(pet.id)) {
                        removeFromFavorites(pet.id)
                        setFavoritePets(prev => prev.filter(p => p.id !== pet.id))
                      } else {
                        addToFavorites(pet.id)
                        setFavoritePets(prev => [...prev, pet])
                      }
                    }}
                    aria-label={isFavorited(pet.id) ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                      isFavorited(pet.id)
                        ? 'bg-pink-500 text-white hover:bg-pink-600'
                        : 'bg-white text-gray-600 hover:bg-pink-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited(pet.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {pet.size}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pet.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{pet.breed} • {pet.age} years old</p>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{pet.location || 'Location not specified'}</span>
                  </div>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 