'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, MapPin, Calendar, Stethoscope, PawPrint, Phone, Mail, Share2, Check, X, Palette } from 'lucide-react';
import { getPetById, Pet } from '@/lib/api';
import { isFavorited, toggleFavorite } from '@/lib/favorites';

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

// Toast component
function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
        <Check className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-green-200 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function PetDetailPage() {
  const params = useParams();
  const petId = params?.id as string;
  const [favorited, setFavorited] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { pet, loading, error } = usePet(petId);

  // Check if pet is favorited on mount and when pet changes
  useEffect(() => {
    if (petId) {
      setFavorited(isFavorited(petId));
    }
  }, [petId]);

  const handleToggleFavorite = () => {
    const newFavoriteState = toggleFavorite(petId);
    setFavorited(newFavoriteState);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/pets/${petId}`;
      
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
        showToast('Page link copied to clipboard!');
        setTimeout(() => setShareSuccess(false), 2000);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setShareSuccess(true);
          showToast('Page link copied to clipboard!');
          setTimeout(() => setShareSuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy URL:', err);
          showToast('Failed to copy link. Please try again.');
        } finally {
          textArea.remove();
        }
      }
    } catch (err) {
      console.error('Failed to share:', err);
      showToast('Failed to copy link. Please try again.');
    }
  };

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
      {/* Toast Notification */}
      <Toast 
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      
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
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleShare}
                    aria-label={`Share ${pet.name}'s page`}
                    className={`p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      shareSuccess 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    {shareSuccess ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Share2 className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    aria-label={favorited ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
                    className={`p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                      favorited 
                        ? 'bg-pink-500 text-white hover:bg-pink-600' 
                        : 'bg-white text-gray-600 hover:bg-pink-50'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${favorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
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
                  <span>Species: {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Stethoscope className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Gender: {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Size: {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Palette className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Color: {pet.color}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-1 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-orange-500" />
                  <span>Location: {pet.location}</span>
                </div>
              </div>

              {/* Adoption Status */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  pet.adoptionStatus === 'available' ? 'bg-green-100 text-green-800' :
                  pet.adoptionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {pet.adoptionStatus === 'available' ? '✅ Available for Adoption' :
                   pet.adoptionStatus === 'pending' ? '⏳ Adoption Pending' :
                   '✓ Adopted'}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {pet.name}</h3>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>
            </div>

            {/* Adoption Information */}
            {pet.adoptionStatus === 'available' ? (
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
                      href="tel:+4755123456"
                      aria-label="Call us at +47 55 12 34 56 to discuss adopting this pet"
                      className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </a>
                    <a
                      href="mailto:adopt@pawsitive.com"
                      aria-label="Email us at adopt@pawsitive.com to discuss adopting this pet"
                      className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Us
                    </a>
                  </div>
                </div>
              </div>
            ) : pet.adoptionStatus === 'pending' ? (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Adoption in Progress</h3>
                <p className="mb-6 opacity-90">
                  {pet.name}'s adoption is currently pending. If it doesn't work out, we'll let you know!
                  In the meantime, check out our other available pets.
                </p>
                <Link
                  href="/pets"
                  className="inline-flex items-center bg-white text-yellow-600 py-3 px-6 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  <PawPrint className="mr-2 h-4 w-4" />
                  View Other Available Pets
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Successfully Adopted!</h3>
                <p className="mb-6 opacity-90">
                  {pet.name} has found their forever home! We're so happy for this wonderful pet.
                  There are many other pets still looking for loving families.
                </p>
                <Link
                  href="/pets"
                  className="inline-flex items-center bg-white text-gray-600 py-3 px-6 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  <PawPrint className="mr-2 h-4 w-4" />
                  Meet Other Pets Looking for Homes
                </Link>
              </div>
            )}

            {/* Care Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Requirements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Exercise Needs</h4>
                  <p className="text-sm text-gray-600">
                    {pet.species === 'dog' 
                      ? (pet.size === 'large' ? 'High - Daily walks and active playtime' : 
                         pet.size === 'medium' ? 'Moderate - Regular walks and play' : 
                         'Low-Moderate - Short walks and indoor play')
                      : pet.species === 'cat'
                      ? 'Low - Indoor play and climbing'
                      : pet.species === 'bird'
                      ? 'Moderate - Flight time and mental stimulation'
                      : pet.species === 'rabbit'
                      ? 'Moderate - Hopping space and play'
                      : 'Varies by species'}
                  </p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Living Space</h4>
                  <p className="text-sm text-gray-600">
                    {pet.species === 'dog' 
                      ? (pet.size === 'large' ? 'House with yard preferred' : 
                         pet.size === 'medium' ? 'Apartment or house suitable' : 
                         'Apartment friendly')
                      : pet.species === 'cat'
                      ? 'Apartment or house suitable'
                      : pet.species === 'bird'
                      ? 'Spacious cage and flight area'
                      : pet.species === 'rabbit'
                      ? 'Large enclosure or bunny-proofed room'
                      : 'Species-appropriate housing'}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Experience Level</h4>
                  <p className="text-sm text-gray-600">
                    {pet.age <= 1 ? 'Some experience helpful for young pets' : 
                     pet.age <= 3 ? 'Good for first-time or experienced owners' :
                     'Great for first-time owners'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Health & Info</h4>
                  <p className="text-sm text-gray-600">
                    Healthy • {pet.age} {pet.age === 1 ? 'year' : 'years'} old • {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Find More Pets */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Match</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Every pet is unique and special. Browse our full collection of loving animals 
              waiting for their forever homes, or search for specific traits that match your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pets"
                className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                <PawPrint className="mr-2 h-4 w-4" />
                Browse All Available Pets
              </Link>
              <Link
                href={`/pets?species=${pet.species}`}
                className="inline-flex items-center bg-white text-orange-500 border-2 border-orange-500 px-6 py-3 rounded-full hover:bg-orange-50 transition-colors font-medium"
              >
                Find More {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}s
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 