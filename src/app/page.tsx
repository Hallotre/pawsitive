import Link from 'next/link';
import { Heart, PawPrint, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <PawPrint className="h-16 w-16 text-orange-500" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-orange-500 block">Furry Friend</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect loving families with pets in need of homes. Every pet deserves 
              a chance at happiness, and every family deserves the unconditional love of a pet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pets"
                className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                Browse Available Pets
              </Link>
              <Link
                href="/about"
                className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-50 animate-bounce delay-300"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Pawsitive?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to making pet adoption a positive experience for both pets and families.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vetted & Loved</h3>
              <p className="text-gray-600">
                All our pets receive proper medical care and lots of love before finding their forever homes.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-shadow">
              <div className="bg-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Perfect Matches</h3>
              <p className="text-gray-600">
                Our team helps match the right pet with the right family for lasting happiness.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-shadow">
              <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ongoing Support</h3>
              <p className="text-gray-600">
                We provide continued support and resources to ensure successful adoptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Making a Difference Together
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">500+</div>
              <div className="text-orange-100 text-lg">Pets Adopted</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">95%</div>
              <div className="text-orange-100 text-lg">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">24/7</div>
              <div className="text-orange-100 text-lg">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Change a Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your journey to finding the perfect companion today.
          </p>
          <Link
            href="/pets"
            className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            <PawPrint className="mr-2 h-5 w-5" />
            Start Browsing Pets
          </Link>
        </div>
      </section>
    </div>
  );
}
