'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Heart, PawPrint, Filter, MapPin, X, Clock } from 'lucide-react';
import { getPets, Pet, ApiResponse } from '@/lib/api';
import { isFavorited, toggleFavorite } from '@/lib/favorites';
import { inputStyles, selectStyles, labelStyles } from '@/lib/styles';

interface PetFilters {
  size: string;
  age: string;
  breed: string;
  location: string;
  specialNeeds: string;
  sortBy: string;
}

interface SearchResult {
  pet: Pet;
  score: number;
  matchedFields: string[];
}

// Enhanced search utilities
class SearchEngine {
  // Common pet breed synonyms and variations
  private static synonyms: Record<string, string[]> = {
    'dog': ['puppy', 'canine', 'pup', 'doggy', 'hound'],
    'cat': ['kitten', 'feline', 'kitty', 'pussy cat'],
    'rabbit': ['bunny', 'hare'],
    'bird': ['parrot', 'canary', 'finch', 'cockatiel', 'budgie'],
    'small': ['tiny', 'little', 'mini', 'petite'],
    'large': ['big', 'huge', 'giant', 'massive'],
    'young': ['baby', 'juvenile', 'kid'],
    'old': ['senior', 'elderly', 'mature'],
    'friendly': ['social', 'outgoing', 'loving', 'affectionate'],
    'calm': ['quiet', 'peaceful', 'gentle', 'laid-back'],
    'active': ['energetic', 'playful', 'lively', 'spirited'],
    'trained': ['house-trained', 'housebroken', 'potty-trained']
  };

  // Calculate similarity between two strings using Levenshtein distance
  private static calculateSimilarity(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - matrix[str2.length][str1.length] / maxLength;
  }

  // Expand query with synonyms
  private static expandQuery(query: string): string[] {
    const words = query.toLowerCase().split(/\s+/);
    const expandedWords = new Set(words);
    
    words.forEach(word => {
      Object.entries(this.synonyms).forEach(([key, synonyms]) => {
        if (synonyms.includes(word) || key === word) {
          expandedWords.add(key);
          synonyms.forEach(synonym => expandedWords.add(synonym));
        }
      });
    });
    
    return Array.from(expandedWords);
  }

  // Score a pet against a search query
  static scorePet(pet: Pet, query: string): SearchResult {
    if (!query.trim()) {
      return { pet, score: 0, matchedFields: [] };
    }

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = this.expandQuery(normalizedQuery);
    const matchedFields: string[] = [];
    let totalScore = 0;

    // Field weights (higher = more important)
    const fieldWeights = {
      name: 10,
      breed: 8,
      description: 3,
      color: 2,
      size: 2
    };

    // Search in pet name (highest priority)
    const nameScore = this.scoreField(pet.name, queryWords, normalizedQuery);
    if (nameScore > 0) {
      totalScore += nameScore * fieldWeights.name;
      matchedFields.push('name');
    }

    // Search in breed
    const breedScore = this.scoreField(pet.breed, queryWords, normalizedQuery);
    if (breedScore > 0) {
      totalScore += breedScore * fieldWeights.breed;
      matchedFields.push('breed');
    }

    // Search in description
    const descriptionScore = this.scoreField(pet.description, queryWords, normalizedQuery);
    if (descriptionScore > 0) {
      totalScore += descriptionScore * fieldWeights.description;
      matchedFields.push('description');
    }

    // Search in color
    const colorScore = this.scoreField(pet.color, queryWords, normalizedQuery);
    if (colorScore > 0) {
      totalScore += colorScore * fieldWeights.color;
      matchedFields.push('color');
    }

    // Search in size
    const sizeScore = this.scoreField(pet.size, queryWords, normalizedQuery);
    if (sizeScore > 0) {
      totalScore += sizeScore * fieldWeights.size;
      matchedFields.push('size');
    }

    // Age-based matching
    const ageStr = `${pet.age} year${pet.age !== 1 ? 's' : ''} old`;
    const ageScore = this.scoreField(ageStr, queryWords, normalizedQuery);
    if (ageScore > 0) {
      totalScore += ageScore * 2;
      matchedFields.push('age');
    }

    return { pet, score: totalScore, matchedFields };
  }

  // Score a specific field against query words
  private static scoreField(fieldValue: string, queryWords: string[], originalQuery: string): number {
    if (!fieldValue) return 0;
    
    const fieldText = fieldValue.toLowerCase();
    let score = 0;

    // Exact match bonus
    if (fieldText.includes(originalQuery)) {
      score += 100;
    }

    // Word-by-word matching
    queryWords.forEach(word => {
      if (fieldText.includes(word)) {
        score += 50;
      } else {
        // Fuzzy matching for partial words
        const words = fieldText.split(/\s+/);
        words.forEach(fieldWord => {
          const similarity = this.calculateSimilarity(word, fieldWord);
          if (similarity > 0.7) {
            score += similarity * 30;
          }
        });
      }
    });

    return score;
  }
}

// Custom hook for pet data fetching with filtering
function usePets(searchQuery: string = '', filters: PetFilters = { size: '', age: '', breed: '', location: '', specialNeeds: '', sortBy: '' }, currentPage: number = 1) {
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Pet[]>['meta']>();

  // Fetch all pets initially
  useEffect(() => {
    let ignore = false;

    async function fetchAllPets() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch pets with API limit (max 100)
        const response = await getPets(1, 100); // API limit is 100
        
        if (!ignore) {
          setAllPets(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to fetch pets');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchAllPets();

    return () => {
      ignore = true;
    };
  }, []); // Only fetch once

  // Filter pets based on search and filters
  useEffect(() => {
    let filtered = [...allPets];

    // Apply intelligent search filter
    if (searchQuery.trim()) {
      // Score all pets and filter by relevance
      const results = allPets
        .map(pet => SearchEngine.scorePet(pet, searchQuery))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);
      
      setSearchResults(results);
      filtered = results.map(result => result.pet);
    } else {
      setSearchResults([]);
    }

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter(pet => 
        pet.size.toLowerCase() === filters.size.toLowerCase()
      );
    }

    // Apply age filter
    if (filters.age) {
      filtered = filtered.filter(pet => {
        const age = pet.age;
        switch (filters.age) {
          case 'young':
            return age >= 0 && age <= 2;
          case 'adult':
            return age >= 3 && age <= 7;
          case 'senior':
            return age >= 8;
          default:
            return true;
        }
      });
    }

    // Apply breed/type filter
    if (filters.breed) {
      filtered = filtered.filter(pet => {
        const breed = pet.breed.toLowerCase();
        switch (filters.breed) {
          case 'dog':
            return breed.includes('dog') || breed.includes('retriever') || breed.includes('shepherd') || breed.includes('terrier') || breed.includes('bulldog') || breed.includes('poodle') || breed.includes('beagle') || breed.includes('husky') || breed.includes('boxer') || breed.includes('dachshund');
          case 'cat':
            return breed.includes('cat') || breed.includes('persian') || breed.includes('siamese') || breed.includes('maine') || breed.includes('bengal') || breed.includes('ragdoll') || breed.includes('british') || breed.includes('abyssinian');
          case 'rabbit':
            return breed.includes('rabbit') || breed.includes('bunny');
          case 'bird':
            return breed.includes('bird') || breed.includes('parrot') || breed.includes('canary') || breed.includes('finch') || breed.includes('cockatiel');
          default:
            return true;
        }
      });
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(pet => {
        // Use pet.location if available, otherwise use a default location matching
        const petLocation = (pet as any).location || 'Local Shelter';
        return petLocation.toLowerCase().includes(filters.location.toLowerCase());
      });
    }

    // Apply special needs filter
    if (filters.specialNeeds) {
      filtered = filtered.filter(pet => {
        const description = pet.description.toLowerCase();
        switch (filters.specialNeeds) {
          case 'none':
            return !description.includes('special needs') && !description.includes('medication') && !description.includes('medical');
          case 'medical':
            return description.includes('medication') || description.includes('medical') || description.includes('special care');
          case 'behavioral':
            return description.includes('training') || description.includes('socialization') || description.includes('shy') || description.includes('anxious');
          case 'mobility':
            return description.includes('mobility') || description.includes('wheelchair') || description.includes('blind') || description.includes('deaf');
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            // Sort by created date, newest first
            return new Date(b.created).getTime() - new Date(a.created).getTime();
          case 'oldest':
            // Sort by created date, oldest first
            return new Date(a.created).getTime() - new Date(b.created).getTime();
          case 'name':
            // Sort alphabetically by name
            return a.name.localeCompare(b.name);
          case 'age-young':
            // Sort by age, youngest first
            return a.age - b.age;
          case 'age-old':
            // Sort by age, oldest first
            return b.age - a.age;
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const itemsPerPage = 12;
    const totalCount = filtered.length;
    const pageCount = Math.ceil(totalCount / itemsPerPage);
    
    // Ensure currentPage doesn't exceed available pages
    const validCurrentPage = Math.min(currentPage, Math.max(1, pageCount));
    
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPets = filtered.slice(startIndex, endIndex);

    setFilteredPets(paginatedPets);

    // Update meta information
    setMeta({
      isFirstPage: validCurrentPage === 1,
      isLastPage: validCurrentPage === pageCount || pageCount === 0,
      currentPage: validCurrentPage,
      previousPage: validCurrentPage > 1 ? validCurrentPage - 1 : null,
      nextPage: validCurrentPage < pageCount ? validCurrentPage + 1 : null,
      pageCount,
      totalCount
    });

  }, [allPets, searchQuery, filters.size, filters.age, filters.breed, filters.location, filters.specialNeeds, filters.sortBy, currentPage]);

  return { pets: filteredPets, loading, error, meta, allPets, searchResults };
}

function PetCard({ pet, searchQuery = '', matchedFields = [] }: { 
  pet: Pet; 
  searchQuery?: string;
  matchedFields?: string[];
}) {
  const [favorited, setFavorited] = useState(false);

  // Check if pet is favorited on mount
  useEffect(() => {
    setFavorited(isFavorited(pet.id));
  }, [pet.id]);

  const handleToggleFavorite = () => {
    const newFavoriteState = toggleFavorite(pet.id);
    setFavorited(newFavoriteState);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={pet.image?.url || '/api/placeholder/400/300'}
          alt={pet.image?.alt || `Photo of ${pet.name}`}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          aria-label={favorited ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
            favorited 
              ? 'bg-pink-500 text-white hover:bg-pink-600' 
              : 'bg-white text-gray-600 hover:bg-pink-50'
          }`}
        >
          <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {pet.size}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
          {matchedFields.length > 0 && searchQuery && (
            <div className="flex flex-wrap gap-1">
              {matchedFields.slice(0, 2).map(field => (
                <span 
                  key={field}
                  className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full"
                  title={`Matched in ${field}`}
                >
                  {field}
                </span>
              ))}
              {matchedFields.length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{matchedFields.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-3">
          {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
        </p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{pet.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Local Shelter</span>
          </div>
          <Link
            href={`/pets/${pet.id}`}
            aria-label={`View details for ${pet.name}`}
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Meet Me
          </Link>
        </div>
      </div>
    </div>
  );
}

function SearchAndFilters({ 
  searchQuery, 
  onSearchChange,
  onFilterChange,
  allPets = [],
  currentFilters
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: PetFilters) => void;
  allPets?: Pet[];
  currentFilters: PetFilters;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  // Use the filters passed from parent instead of local state

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pawsitive-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  // Sync input value with parent searchQuery
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(inputValue);
      
      // Save to recent searches if it's a meaningful query
      if (inputValue.trim().length > 2) {
        setRecentSearches(prev => {
          const updated = [inputValue, ...prev.filter(s => s !== inputValue)].slice(0, 5);
          localStorage.setItem('pawsitive-recent-searches', JSON.stringify(updated));
          return updated;
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearchChange]);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!inputValue.trim() || inputValue.length < 2) return [];
    
    const query = inputValue.toLowerCase();
    const suggestionSet = new Set<string>();
    
    // Add name suggestions
    allPets.forEach(pet => {
      if (pet.name.toLowerCase().includes(query)) {
        suggestionSet.add(pet.name);
      }
    });
    
    // Add breed suggestions
    allPets.forEach(pet => {
      if (pet.breed.toLowerCase().includes(query)) {
        suggestionSet.add(pet.breed);
      }
    });
    
    // Add common search terms
    const commonTerms = [
      'friendly dog', 'playful cat', 'small dog', 'large dog', 'young cat',
      'senior dog', 'house trained', 'good with kids', 'energetic', 'calm',
      'indoor cat', 'outdoor dog', 'rescue', 'adoption ready'
    ];
    
    commonTerms.forEach(term => {
      if (term.toLowerCase().includes(query)) {
        suggestionSet.add(term);
      }
    });
    
    return Array.from(suggestionSet).slice(0, 6);
  }, [inputValue, allPets]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onSearchChange(suggestion);
  };

  const clearSearch = () => {
    setInputValue('');
    setShowSuggestions(false);
    onSearchChange('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('pawsitive-recent-searches');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Enhanced Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by name, breed, personality, age... Try 'friendly puppy' or 'calm senior cat'"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            aria-label="Search for pets with intelligent matching"
            className={inputStyles.large}
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors z-10"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {/* Recent Searches */}
              {recentSearches.length > 0 && !inputValue.trim() && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 hover:text-gray-900 rounded font-medium"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Live Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-3">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Suggestions</span>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-800 hover:bg-orange-50 hover:text-orange-700 rounded font-medium"
                      >
                        <Search className="h-3 w-3 inline mr-2 text-gray-500" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="filter-options"
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium">Filters</span>
          {/* Show active filter count */}
          {Object.values(currentFilters).filter(Boolean).length > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {Object.values(currentFilters).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div id="filter-options" className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filter Options</h3>
            <button
              onClick={() => {
                const clearedFilters = { size: '', age: '', breed: '', location: '', specialNeeds: '', sortBy: '' };
                onFilterChange(clearedFilters);
              }}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium focus:outline-none focus:underline"
            >
              Clear All Filters
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Size</label>
              <select
                value={currentFilters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                aria-label="Filter by pet size"
                className={selectStyles.filter}
              >
                <option value="">Any Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Age</label>
              <select
                value={currentFilters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                aria-label="Filter by pet age"
                className={selectStyles.filter}
              >
                <option value="">Any Age</option>
                <option value="young">Young (0-2 years)</option>
                <option value="adult">Adult (3-7 years)</option>
                <option value="senior">Senior (8+ years)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Type</label>
              <select
                value={currentFilters.breed}
                onChange={(e) => handleFilterChange('breed', e.target.value)}
                aria-label="Filter by pet type"
                className={selectStyles.filter}
              >
                <option value="">Any Type</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="rabbit">Rabbits</option>
                <option value="bird">Birds</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
              <select
                value={currentFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                aria-label="Filter by location"
                className={selectStyles.filter}
              >
                <option value="">Any Location</option>
                <option value="local">Local Shelter</option>
                <option value="downtown">Downtown</option>
                <option value="uptown">Uptown</option>
                <option value="suburbs">Suburbs</option>
                <option value="rural">Rural Area</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Special Needs</label>
              <select
                value={currentFilters.specialNeeds}
                onChange={(e) => handleFilterChange('specialNeeds', e.target.value)}
                aria-label="Filter by special needs"
                className={selectStyles.filter}
              >
                <option value="">Any Needs</option>
                <option value="none">No Special Needs</option>
                <option value="medical">Medical Care</option>
                <option value="behavioral">Behavioral Support</option>
                <option value="mobility">Mobility Assistance</option>
              </select>
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="w-full md:w-64">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Sort By</label>
              <select
                value={currentFilters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                aria-label="Sort pets by"
                className={selectStyles.filter}
              >
                <option value="">Default Order</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="age-young">Age (Youngest First)</option>
                <option value="age-old">Age (Oldest First)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PetFilters>({ size: '', age: '', breed: '', location: '', specialNeeds: '', sortBy: '' });
  
  // Initialize from URL params only once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get('page') || '1');
      const search = params.get('search') || '';
      
      if (page > 1) setCurrentPage(page);
      if (search) setSearchQuery(search);
    }
  }, []);
  
  const { pets, loading, error, meta, allPets, searchResults } = usePets(searchQuery, filters, currentPage);

  const handleSearchChange = (query: string) => {
    // Only update state and reset pagination if the query actually changed
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page when searching
      
      // Update URL
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (query) {
          params.set('search', query);
        } else {
          params.delete('search');
        }
        params.delete('page'); // Reset page when searching
        
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState(null, '', newUrl);
      }
    }
  };

  const handleFilterChange = (newFilters: PetFilters) => {
    // Check if only sortBy changed (sorting shouldn't reset pagination)
    const oldFiltersWithoutSort = { ...filters, sortBy: '' };
    const newFiltersWithoutSort = { ...newFilters, sortBy: '' };
    const onlySortChanged = JSON.stringify(oldFiltersWithoutSort) === JSON.stringify(newFiltersWithoutSort) && filters.sortBy !== newFilters.sortBy;
    
    setFilters(newFilters);
    
    // Only reset to first page if actual filters changed (not just sorting)
    if (!onlySortChanged) {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL without full page reload
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (page > 1) {
        params.set('page', page.toString());
      } else {
        params.delete('page');
      }
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState(null, '', newUrl);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <PawPrint className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Browse through our amazing pets looking for their forever homes.
            Each one has a unique personality and lots of love to give.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            allPets={allPets}
            currentFilters={filters}
          />

          {/* Results Count */}
          {meta && !loading && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-600">
                    Showing {pets.length} of {meta.totalCount} pets
                    {searchQuery && (
                      <span> for &quot;{searchQuery}&quot;</span>
                    )}
                  </p>
                  {searchQuery && searchResults.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✨ Smart search found matches in names, breeds, descriptions, and more!
                    </p>
                  )}
                </div>
              </div>
              
              {/* Active Filters Display */}
              {Object.values(filters).some(Boolean) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {filters.size && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                      Size: {filters.size}
                    </span>
                  )}
                  {filters.age && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                      Age: {filters.age === 'young' ? 'Young (0-2)' : filters.age === 'adult' ? 'Adult (3-7)' : 'Senior (8+)'}
                    </span>
                  )}
                  {filters.breed && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                      Type: {filters.breed.charAt(0).toUpperCase() + filters.breed.slice(1)}s
                    </span>
                  )}
                  {filters.location && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                      Location: {filters.location === 'local' ? 'Local Shelter' : filters.location.charAt(0).toUpperCase() + filters.location.slice(1)}
                    </span>
                  )}
                  {filters.specialNeeds && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                      Special Needs: {filters.specialNeeds === 'none' ? 'None' : 
                                      filters.specialNeeds === 'medical' ? 'Medical Care' :
                                      filters.specialNeeds === 'behavioral' ? 'Behavioral Support' :
                                      'Mobility Assistance'}
                    </span>
                  )}
                  {filters.sortBy && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      Sort: {filters.sortBy === 'newest' ? 'Newest First' :
                            filters.sortBy === 'oldest' ? 'Oldest First' :
                            filters.sortBy === 'name' ? 'Name (A-Z)' :
                            filters.sortBy === 'age-young' ? 'Age (Youngest First)' :
                            filters.sortBy === 'age-old' ? 'Age (Oldest First)' :
                            'Default'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <div className="text-red-500 mr-3" aria-hidden="true">
                  <PawPrint className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-red-800 font-medium">Oops! Something went wrong</h3>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingGrid />}

          {/* Pet Grid */}
          {!loading && !error && pets.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => {
                const matchInfo = searchResults.find(result => result.pet.id === pet.id);
                return (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    searchQuery={searchQuery}
                    matchedFields={matchInfo?.matchedFields || []}
                  />
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && pets.length === 0 && (
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `We couldn&apos;t find any pets matching &quot;${searchQuery}&quot;. Try adjusting your search or filters.`
                  : "There are no pets available at the moment. Please check back later."
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.pageCount > 1 && !loading && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2" aria-label="Pagination Navigation">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Previous
                </button>
                
                {(() => {
                  const totalPages = meta.pageCount;
                  const current = currentPage;
                  const pages = [];
                  
                  // Always show first page
                  if (totalPages > 0) {
                    pages.push(1);
                  }
                  
                  // Add ellipsis if needed before current group
                  if (current > 4) {
                    pages.push('...');
                  }
                  
                  // Add pages around current page
                  const start = Math.max(2, current - 1);
                  const end = Math.min(totalPages - 1, current + 1);
                  
                  for (let i = start; i <= end; i++) {
                    if (!pages.includes(i)) {
                      pages.push(i);
                    }
                  }
                  
                  // Add ellipsis if needed after current group
                  if (current < totalPages - 3) {
                    if (!pages.includes('...')) {
                      pages.push('...');
                    }
                  }
                  
                  // Always show last page
                  if (totalPages > 1 && !pages.includes(totalPages)) {
                    pages.push(totalPages);
                  }
                  
                  return pages.map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    
                    const pageNum = page as number;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                        className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.pageCount}
                  aria-label="Go to next page"
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get in touch with us and we&apos;ll help you find the perfect pet match.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            <Heart className="mr-2 h-5 w-5" />
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
} 