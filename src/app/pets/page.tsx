'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, PawPrint, Filter, MapPin, Calendar } from 'lucide-react';
import { getPets, searchPets, Pet, ApiResponse } from '@/lib/api';

// Custom hook for pet data fetching
function usePets(searchQuery: string = '', currentPage: number = 1) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Pet[]>['meta']>();

  useEffect(() => {
    let ignore = false;

    async function fetchPets() {
      try {
        setLoading(true);
        setError(null);
        
        const response = searchQuery 
          ? await searchPets(searchQuery, currentPage)
          : await getPets(currentPage, 12);
        
        if (!ignore) {
          setPets(response.data);
          setMeta(response.meta);
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

    fetchPets();

    return () => {
      ignore = true;
    };
  }, [searchQuery, currentPage]);

  return { pets, loading, error, meta };
}

function PetCard({ pet }: { pet: Pet }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={pet.image?.url || '/api/placeholder/400/300'}
          alt={pet.image?.alt || `Photo of ${pet.name}`}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          aria-label={isFavorited ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
            isFavorited 
              ? 'bg-pink-500 text-white hover:bg-pink-600' 
              : 'bg-white text-gray-600 hover:bg-pink-50'
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {pet.size}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.name}</h3>
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
  onFilterChange 
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: any) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    size: '',
    age: '',
    breed: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search for pets by name, breed, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search for pets"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400"
          />
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
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div id="filter-options" className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Size</label>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                aria-label="Filter by pet size"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400"
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
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                aria-label="Filter by pet age"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400"
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
                value={filters.breed}
                onChange={(e) => handleFilterChange('breed', e.target.value)}
                aria-label="Filter by pet type"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400"
              >
                <option value="">Any Type</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="rabbit">Rabbits</option>
                <option value="bird">Birds</option>
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
  const [filters, setFilters] = useState({});
  
  const { pets, loading, error, meta } = usePets(searchQuery, currentPage);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          />

          {/* Results Count */}
          {meta && !loading && (
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {pets.length} of {meta.totalCount} pets
                {searchQuery && (
                  <span> for "{searchQuery}"</span>
                )}
              </p>
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
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && pets.length === 0 && (
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `We couldn't find any pets matching "${searchQuery}". Try adjusting your search or filters.`
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
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, meta.pageCount) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
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
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get in touch with us and we'll help you find the perfect pet match.
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