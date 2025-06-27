'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Adoption Process',
    question: 'How does the adoption process work?',
    answer: 'Our adoption process is designed to ensure the best match between pets and families. First, browse our available pets and submit an adoption application for the pet you are interested in. We will review your application and may contact you for additional information. If approved, we will schedule a meet-and-greet. If everything goes well, we will finalize the adoption with paperwork and an adoption fee.'
  },
  {
    id: '2',
    category: 'Adoption Process',
    question: 'How long does the adoption process take?',
    answer: 'The timeline varies depending on several factors, but typically takes 3-7 days from application to bringing your pet home. Emergency applications for senior pets or those with special needs may be processed faster.'
  },
  {
    id: '3',
    category: 'Fees & Costs',
    question: 'What are the adoption fees?',
    answer: 'Adoption fees vary by pet type, age, and special needs. Generally: Dogs $150-$400, Cats $75-$250, Small animals $25-$100. Fees cover vaccinations, spaying/neutering, microchipping, and basic medical care.'
  },
  {
    id: '4',
    category: 'Pet Information',
    question: 'Are the pets house-trained?',
    answer: 'House-training status varies by individual pet and is noted in their profile. Many adult dogs are house-trained, but puppies and some rescues may need training. We provide resources and support to help with house-training.'
  },
  {
    id: '5',
    category: 'Support & Resources',
    question: 'What support do you provide after adoption?',
    answer: 'We offer lifetime support! This includes a 24/7 helpline, training resources, behavioral consultation, medical guidance, and our return policy. We want your adoption to be successful.'
  },
  {
    id: '6',
    category: 'Adoption Process',
    question: 'Can I meet the pet before deciding to adopt?',
    answer: 'Absolutely! We encourage meet-and-greets and may require them for certain pets. This helps ensure compatibility and gives you a chance to interact with your potential new family member.'
  },
  {
    id: '7',
    category: 'Fees & Costs',
    question: 'What is included in the adoption fee?',
    answer: 'All adopted pets come spayed/neutered, up-to-date on age-appropriate vaccinations, microchipped, and with a basic health check. Dogs receive a collar and leash, cats get a carrier, and all pets come with a starter kit of food and basic supplies.'
  },
  {
    id: '8',
    category: 'Support & Resources',
    question: 'What if the adoption does not work out?',
    answer: 'While we work hard to ensure good matches, we understand that sometimes situations change. We have a return policy - you can return your adopted pet to us at any time, for any reason. We would rather have the pet back with us than see them rehomed elsewhere.'
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <HelpCircle className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Find answers to common questions about pet adoption, our process, 
            and how we can help you find your perfect companion.
          </p>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqData.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.question}
                      </h3>
                    </div>
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
                
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-xl text-gray-600">
              We are here to help! Check out these resources or get in touch with our team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/contact"
              className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center hover:border-orange-300 hover:bg-orange-100 transition-colors"
            >
              <div className="bg-orange-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600">
                Get personalized help from our adoption specialists available 24/7.
              </p>
            </Link>

            <Link
              href="/adoption-guide"
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center hover:border-blue-300 hover:bg-blue-100 transition-colors"
            >
              <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adoption Guide</h3>
              <p className="text-gray-600">
                Step-by-step guide to help you through every part of the adoption process.
              </p>
            </Link>

            <Link
              href="/resources"
              className="bg-green-50 border border-green-200 rounded-xl p-6 text-center hover:border-green-300 hover:bg-green-100 transition-colors"
            >
              <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pet Care Resources</h3>
              <p className="text-gray-600">
                Comprehensive guides for caring for your new pet after adoption.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Adoption Journey?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Browse our available pets and take the first step toward finding 
            your new best friend and family member.
          </p>
          <Link
            href="/pets"
            className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            Browse Available Pets
          </Link>
        </div>
      </section>
    </div>
  )
} 