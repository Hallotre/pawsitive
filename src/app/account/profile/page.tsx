'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Mail, Calendar, Heart, Settings, Shield, ChevronLeft, Save, Edit3, Bell } from 'lucide-react'
import { getFavorites } from '@/lib/favorites'
import { selectStyles, checkboxStyles } from '@/lib/styles'

interface SessionData {
  userId: string
  email: string
  role: string
}

interface UserPreferences {
  emailNotifications: boolean
  favoriteAlerts: boolean
  newsletter: boolean
  petTypes: string[]
  preferredSize: string[]
  maxDistance: string
}

const defaultPreferences: UserPreferences = {
  emailNotifications: true,
  favoriteAlerts: true,
  newsletter: false,
  petTypes: [],
  preferredSize: [],
  maxDistance: '25'
}

// Local storage utilities for preferences
const getPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return defaultPreferences
  const prefs = localStorage.getItem('pawsitive-preferences')
  return prefs ? { ...defaultPreferences, ...JSON.parse(prefs) } : defaultPreferences
}

const savePreferences = (prefs: UserPreferences): void => {
  localStorage.setItem('pawsitive-preferences', JSON.stringify(prefs))
}



export default function UserProfile() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setSession(data.user)
        } else {
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

  // Load preferences
  useEffect(() => {
    if (!mounted) return
    
    const loadPreferences = () => {
      const prefs = getPreferences()
      setPreferences(prefs)
      setLoading(false)
    }

    loadPreferences()
  }, [mounted])

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleArrayToggle = (key: 'petTypes' | 'preferredSize', value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const handleSave = () => {
    savePreferences(preferences)
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const getFavoriteCount = () => {
    return getFavorites().length
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/account/dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
          
          {saveSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Settings saved successfully!
              </div>
            </div>
          )}
        </div>
        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <User className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{session.userId}</h2>
                <p className="text-orange-100">{session.email}</p>
                <div className="flex items-center mt-2">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-sm capitalize">{session.role} Account</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{getFavoriteCount()}</div>
                <div className="text-sm text-gray-600">Favorite Pets</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Member</div>
                <div className="text-sm text-gray-600">Since Today</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Settings className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Active</div>
                <div className="text-sm text-gray-600">Account Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Pet Preferences</h3>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Preferences
                </>
              )}
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Notification Preferences */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    disabled={!isEditing}
                    className={checkboxStyles.base}
                  />
                  <span className="ml-3 text-gray-700">Email notifications for new pets</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.favoriteAlerts}
                    onChange={(e) => handlePreferenceChange('favoriteAlerts', e.target.checked)}
                    disabled={!isEditing}
                    className={checkboxStyles.base}
                  />
                  <span className="ml-3 text-gray-700">Alerts when favorite pets are updated</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.newsletter}
                    onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                    disabled={!isEditing}
                    className={checkboxStyles.base}
                  />
                  <span className="ml-3 text-gray-700">Monthly newsletter with adoption tips</span>
                </label>
              </div>
            </div>

            {/* Pet Type Preferences */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Preferred Pet Types</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Dogs', 'Cats', 'Rabbits', 'Birds'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.petTypes.includes(type)}
                      onChange={() => handleArrayToggle('petTypes', type)}
                      disabled={!isEditing}
                      className={checkboxStyles.base}
                    />
                    <span className="ml-3 text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Preferences */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Preferred Sizes</h4>
              <div className="grid grid-cols-3 gap-4">
                {['Small', 'Medium', 'Large'].map(size => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.preferredSize.includes(size)}
                      onChange={() => handleArrayToggle('preferredSize', size)}
                      disabled={!isEditing}
                      className={checkboxStyles.base}
                    />
                    <span className="ml-3 text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Preferences */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Location Preferences</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum distance from your location
                </label>
                <select
                  value={preferences.maxDistance}
                  onChange={(e) => handlePreferenceChange('maxDistance', e.target.value)}
                  disabled={!isEditing}
                  className={selectStyles.compact}
                >
                  <option value="10">Within 10 miles</option>
                  <option value="25">Within 25 miles</option>
                  <option value="50">Within 50 miles</option>
                  <option value="100">Within 100 miles</option>
                  <option value="any">Any distance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/account/dashboard"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-pink-100 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">My Dashboard</h3>
                <p className="text-sm text-gray-600">View favorites and recent activity</p>
              </div>
            </div>
          </Link>

          <Link
            href="/pets"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Browse Pets</h3>
                <p className="text-sm text-gray-600">Find your perfect companion</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 