'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import { inputStyles, selectStyles, textareaStyles, labelStyles, buttonStyles } from '@/lib/styles'
import { Pet } from '@/lib/api'

interface PetFormProps {
  mode: 'create' | 'edit'
  pet?: Pet
}

const initialFormData: Omit<Pet, 'id' | 'created' | 'updated' | 'owner'> = {
  name: '',
  species: 'dog',
  breed: '',
  age: 1,
  gender: 'male',
  size: 'medium',
  color: '',
  description: '',
  adoptionStatus: 'available',
  location: '',
  image: {
    url: '',
    alt: ''
  }
}

export default function PetForm({ mode, pet }: PetFormProps) {
  const [formData, setFormData] = useState<Omit<Pet, 'id' | 'created' | 'updated' | 'owner'>>(
    pet ? {
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      color: pet.color,
      description: pet.description,
      adoptionStatus: pet.adoptionStatus,
      location: pet.location,
      image: pet.image
    } : initialFormData
  )
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
    const requiredFields = ['name', 'species', 'breed', 'gender', 'color', 'description', 'location'] as const
    for (const field of requiredFields) {
      if (!formData[field]) {
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
          <label htmlFor="name" className={labelStyles.required}>
            Pet Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputStyles.base}
            placeholder="e.g., Buddy"
          />
        </div>

        <div>
          <label htmlFor="species" className={labelStyles.required}>
            Species
          </label>
          <select
            id="species"
            name="species"
            required
            value={formData.species}
            onChange={handleChange}
            className={selectStyles.base}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="breed" className={labelStyles.required}>
            Breed
          </label>
          <input
            id="breed"
            name="breed"
            type="text"
            required
            value={formData.breed}
            onChange={handleChange}
            className={inputStyles.base}
            placeholder="e.g., Golden Retriever"
          />
        </div>

        <div>
          <label htmlFor="gender" className={labelStyles.required}>
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className={selectStyles.base}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="age" className={labelStyles.required}>
            Age (years)
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
            className={inputStyles.number}
          />
        </div>

        <div>
          <label htmlFor="size" className={labelStyles.required}>
            Size
          </label>
          <select
            id="size"
            name="size"
            required
            value={formData.size}
            onChange={handleChange}
            className={selectStyles.base}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label htmlFor="color" className={labelStyles.required}>
            Color
          </label>
          <input
            id="color"
            name="color"
            type="text"
            required
            value={formData.color}
            onChange={handleChange}
            className={inputStyles.base}
            placeholder="e.g., Golden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className={labelStyles.required}>
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            className={inputStyles.base}
            placeholder="e.g., Bergen, Norway"
          />
        </div>

        <div>
          <label htmlFor="adoptionStatus" className={labelStyles.required}>
            Adoption Status
          </label>
          <select
            id="adoptionStatus"
            name="adoptionStatus"
            required
            value={formData.adoptionStatus}
            onChange={handleChange}
            className={selectStyles.base}
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelStyles.required}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className={textareaStyles.base}
          placeholder="Tell us about this pet's personality, needs, and what makes them special..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pet Photo (Optional)</h3>
        
        <div>
          <label htmlFor="image.url" className={labelStyles.base}>
            Image URL
          </label>
          <input
            id="image.url"
            name="image.url"
            type="url"
            value={formData.image?.url || ''}
            onChange={handleChange}
            className={inputStyles.base}
            placeholder="https://example.com/pet-photo.jpg"
          />
        </div>

        <div>
          <label htmlFor="image.alt" className={labelStyles.base}>
            Image Description
          </label>
          <input
            id="image.alt"
            name="image.alt"
            type="text"
            value={formData.image?.alt || ''}
            onChange={handleChange}
            className={inputStyles.base}
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
          className={buttonStyles.secondary}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={buttonStyles.primary}
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