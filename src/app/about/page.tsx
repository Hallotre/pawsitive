import { PawPrint, Heart, Users, Award, Shield, Smile } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <PawPrint className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Pawsitive
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            We are on a mission to connect loving families with pets in need of homes, 
            creating lasting bonds that change lives - both human and animal.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Pawsitive was born from a simple belief: every pet deserves a loving home, 
                  and every family deserves the joy that comes with a furry companion. 
                  Founded in 2020, we started as a small local initiative to help overwhelmed 
                  animal shelters connect with potential adopters.
                </p>
                <p>
                  What began as weekend volunteer work quickly grew into something bigger. 
                  We realized that technology could bridge the gap between pets waiting for homes 
                  and families ready to love them. Today, we are proud to have facilitated over 
                  10,000 successful adoptions across the country.
                </p>
                <p>
                  Our platform combines modern technology with heartfelt care, making pet adoption 
                  accessible, transparent, and joyful for everyone involved.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">10,000+</div>
                  <div className="text-gray-600">Successful Adoptions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-500 mb-2">500+</div>
                  <div className="text-gray-600">Partner Shelters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">50,000+</div>
                  <div className="text-gray-600">Happy Families</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are guided by core values that shape everything we do, from our technology 
              to our relationships with shelters and adopters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassion First</h3>
              <p className="text-gray-600">
                Every decision we make prioritizes the welfare and happiness of animals. 
                We believe that love and care should guide every interaction.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                We maintain open communication with all parties, providing clear information 
                about pets, adoption processes, and support services.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Focus</h3>
              <p className="text-gray-600">
                We are building a community of pet lovers, shelter workers, and families 
                who share our commitment to animal welfare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team combines expertise in technology, animal welfare, 
              and community building to make pet adoption better for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">SJ</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-orange-600 font-medium mb-3">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Former veterinarian with 15 years of experience in animal care. 
                Sarah's passion for animal welfare drives our mission every day.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">MC</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Chen</h3>
              <p className="text-blue-600 font-medium mb-3">CTO</p>
              <p className="text-gray-600 text-sm">
                Technology leader with expertise in building scalable platforms. 
                Mike ensures our technology serves both pets and people effectively.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">ER</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p className="text-green-600 font-medium mb-3">Head of Community</p>
              <p className="text-gray-600 text-sm">
                Community builder and animal advocate who manages our relationships 
                with shelters and supports adopting families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recognition & Awards</h2>
            <p className="text-xl text-gray-600">
              We are honored to be recognized for our impact on animal welfare and technology innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Pet Tech 2023</h3>
              <p className="text-gray-600 text-sm">Pet Industry Awards</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Animal Welfare Champion</h3>
              <p className="text-gray-600 text-sm">ASPCA Recognition 2023</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Impact Award</h3>
              <p className="text-gray-600 text-sm">Tech for Good 2022</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Smile className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Top Workplace</h3>
              <p className="text-gray-600 text-sm">Local Business Journal 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Whether you are looking to adopt, volunteer, or partner with us, 
            there are many ways to be part of the Pawsitive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pets"
              className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <PawPrint className="mr-2 h-5 w-5" />
              Browse Pets
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 