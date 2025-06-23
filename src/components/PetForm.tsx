'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'

interface Pet {
  id?: string
  name: string
  breed: string
  age: number
  size: string
  color: string
  description: string
  image?: {
    url: string
    alt: string
  }
}

interface PetFormProps {
  mode: 'create' | 'edit'
  pet?: Pet
}

const initialFormData: Pet = {
  name: '',
  breed: '',
  age: 1,
  size: 'medium',
  color: '',
  description: '',
  image: {
    url: '',
    alt: ''
  }
}

export default function PetForm({ mode, pet }: PetFormProps) {
  const [formData, setFormData] = useState<Pet>(pet || initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (pet && mode === 'edit') {
      setFormData(pet)
    }
  }, [pet, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('image.')) {
      const imageField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        image: {
          url: prev.image?.url || '',
          alt: prev.image?.alt || '',
          [imageField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'age' ? parseInt(value) || 1 : value
      }))
    }
  }

  const validateForm = () => {
    const requiredFields = ['name', 'breed', 'color', 'description']
    for (const field of requiredFields) {
      if (!formData[field as keyof Pet]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        return false
      }
    }
    
    if (formData.age < 0 || formData.age > 30) {
      setError('Age must be between 0 and 30 years')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const url = mode === 'create' ? '/api/pets' : `/api/pets/${pet?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/pets')
          router.refresh()
        }, 1500)
      } else {
        setError(data.error || `Failed to ${mode} pet`)
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pet {mode === 'create' ? 'Created' : 'Updated'} Successfully!
        </h3>
        <p className="text-gray-600">Redirecting to pets list...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Pet Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Buddy"
          />
        </div>

        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
            Breed *
          </label>
          <input
            id="breed"
            name="breed"
            type="text"
            required
            value={formData.breed}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Golden Retriever"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age (years) *
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min="0"
            max="30"
            required
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
            Size *
          </label>
          <select
            id="size"
            name="size"
            required
            value={formData.size}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color *
          </label>
          <input
            id="color"
            name="color"
            type="text"
            required
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Golden"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          placeholder="Tell us about this pet's personality, needs, and what makes them special..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pet Photo (Optional)</h3>
        
        <div>
          <label htmlFor="image.url" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            id="image.url"
            name="image.url"
            type="url"
            value={formData.image?.url || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="https://example.com/pet-photo.jpg"
          />
        </div>

        <div>
          <label htmlFor="image.alt" className="block text-sm font-medium text-gray-700">
            Image Description
          </label>
          <input
            id="image.alt"
            name="image.alt"
            type="text"
            value={formData.image?.alt || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="Brief description of the photo for accessibility"
          />
        </div>

        {formData.image?.url && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={formData.image.url}
              alt={formData.image.alt || formData.name}
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Pet' : 'Update Pet')}
        </button>
      </div>
    </form>
  )
} 