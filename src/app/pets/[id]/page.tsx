'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, MapPin, Calendar, User, Stethoscope, PawPrint, Phone, Mail } from 'lucide-react';
import { getPetById, Pet, ApiResponse } from '@/lib/api';

// Custom hook for individual pet data fetching
function usePet(id: string) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchPet() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getPetById(id);
        
        if (!ignore) {
          setPet(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to fetch pet details');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchPet();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  return { pet, loading, error };
}

function LoadingDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PetDetailPage() {
  const params = useParams();
  const petId = params?.id as string;
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { pet, loading, error } = usePet(petId);

  if (loading) {
    return <LoadingDetail />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/pets"
            className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Pets
          </Link>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h2>
          <p className="text-gray-600 mb-6">The pet you're looking for doesn't exist or has been adopted.</p>
          <Link
            href="/pets"
            className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Pets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/pets"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Pets
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pet Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={pet.image?.url || '/api/placeholder/600/600'}
                  alt={pet.image?.alt || `Photo of ${pet.name}`}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  aria-label={isFavorited ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                    isFavorited 
                      ? 'bg-pink-500 text-white hover:bg-pink-600' 
                      : 'bg-white text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {pet.size}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pet Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet.name}</h1>
              <p className="text-xl text-gray-600 mb-6">
                {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <PawPrint className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Size: {pet.size}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Stethoscope className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Color: {pet.color}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Available since {new Date(pet.created).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Local Animal Shelter</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {pet.name}</h3>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>
            </div>

            {/* Adoption Information */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Adopt {pet.name}?</h3>
                             <p id="adoption-description" className="mb-6 opacity-90">
                 {pet.name} is looking for a loving forever home. Contact us to start the adoption process
                 and meet this wonderful companion in person.
               </p>
              
                             <div className="space-y-3">
                 <button 
                   aria-describedby="adoption-description"
                   className="w-full bg-white text-orange-500 py-3 px-6 rounded-full font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                 >
                   Start Adoption Process
                 </button>
                <div className="grid md:grid-cols-2 gap-3">
                                     <a
                     href="tel:555-123-PETS"
                     aria-label="Call us at 555-123-PETS to discuss adopting this pet"
                     className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                   >
                     <Phone className="h-4 w-4 mr-2" />
                     Call Us
                   </a>
                   <a
                     href="mailto:hello@pawsitive.com"
                     aria-label="Email us at hello@pawsitive.com to discuss adopting this pet"
                     className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                   >
                     <Mail className="h-4 w-4 mr-2" />
                     Email Us
                   </a>
                </div>
              </div>
            </div>

            {/* Care Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Requirements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Exercise Needs</h4>
                  <p className="text-sm text-gray-600">
                    {pet.size === 'Large' ? 'High - Daily walks and playtime' : 
                     pet.size === 'Medium' ? 'Moderate - Regular walks and play' : 
                     'Low - Indoor play and short walks'}
                  </p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Living Space</h4>
                  <p className="text-sm text-gray-600">
                    {pet.size === 'Large' ? 'House with yard preferred' : 
                     pet.size === 'Medium' ? 'Apartment or house suitable' : 
                     'Apartment friendly'}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Experience Level</h4>
                  <p className="text-sm text-gray-600">
                    {pet.age <= 2 ? 'Some experience helpful' : 'Great for first-time owners'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Health Status</h4>
                  <p className="text-sm text-gray-600">Healthy and up-to-date on vaccinations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pets */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Pets You Might Love</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Placeholder for related pets - would normally fetch similar pets */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="group cursor-pointer" role="button" tabIndex={0} aria-label={`View details for similar pet ${index}`}>
                  <div className="bg-gray-100 rounded-lg h-48 mb-3 group-hover:bg-gray-200 transition-colors flex items-center justify-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none">
                    <PawPrint className="h-12 w-12 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900">Similar Pet {index}</h4>
                  <p className="text-sm text-gray-600">Breed • Age</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/pets"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
              >
                View All Available Pets
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 