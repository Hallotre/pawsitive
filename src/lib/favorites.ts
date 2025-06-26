export interface FavoriteData {
  petId: string
  dateAdded: string
}

// Local storage utilities for favorites
export const getFavorites = (): FavoriteData[] => {
  if (typeof window === 'undefined') return []
  const favorites = localStorage.getItem('pawsitive-favorites')
  return favorites ? JSON.parse(favorites) : []
}

export const addToFavorites = (petId: string): void => {
  const favorites = getFavorites()
  const exists = favorites.find(fav => fav.petId === petId)
  if (!exists) {
    favorites.push({ petId, dateAdded: new Date().toISOString() })
    localStorage.setItem('pawsitive-favorites', JSON.stringify(favorites))
  }
}

export const removeFromFavorites = (petId: string): void => {
  const favorites = getFavorites()
  const filtered = favorites.filter(fav => fav.petId !== petId)
  localStorage.setItem('pawsitive-favorites', JSON.stringify(filtered))
}

export const isFavorited = (petId: string): boolean => {
  const favorites = getFavorites()
  return favorites.some(fav => fav.petId === petId)
}

export const toggleFavorite = (petId: string): boolean => {
  if (isFavorited(petId)) {
    removeFromFavorites(petId)
    return false
  } else {
    addToFavorites(petId)
    return true
  }
} 