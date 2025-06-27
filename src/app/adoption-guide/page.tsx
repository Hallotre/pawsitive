import { CheckCircle, Clock, Heart, Home, PawPrint, Users, FileText, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'

export default function AdoptionGuidePage() {
  const steps = [
    {
      number: 1,
      title: "Browse & Choose Your Pet",
      description: "Explore our available pets and find one that matches your lifestyle and preferences.",
      icon: PawPrint,
      details: [
        "Use our advanced search filters to find pets by size, age, breed, and temperament",
        "Read detailed pet profiles including personality traits and care requirements",
        "Look for special badges like 'Good with Kids' or 'Dog Friendly'",
        "Save your favorites to compare different pets"
      ],
      timeframe: "Take your time",
      tips: "Consider your living situation, activity level, and family dynamics when choosing."
    },
    {
      number: 2,
      title: "Submit Your Application",
      description: "Complete our comprehensive adoption application with your information and preferences.",
      icon: FileText,
      details: [
        "Provide personal information and contact details",
        "Share details about your housing situation and lifestyle",
        "Include veterinary references if you've had pets before",
        "Specify any preferences or requirements for your new pet"
      ],
      timeframe: "15-30 minutes",
      tips: "Be thorough and honest - this helps us find the perfect match for both you and the pet."
    },
    {
      number: 3,
      title: "Application Review",
      description: "Our team reviews your application and may contact you for additional information.",
      icon: Clock,
      details: [
        "We review all applications within 24-48 hours",
        "May include a phone interview to discuss your application",
        "Verification of housing situation and references",
        "Assessment of compatibility between you and your chosen pet"
      ],
      timeframe: "1-3 business days",
      tips: "Keep your phone handy - we may call with questions or to schedule your visit."
    },
    {
      number: 4,
      title: "Meet & Greet",
      description: "Visit the shelter or foster home to meet your potential new family member.",
      icon: Users,
      details: [
        "Spend quality time with your chosen pet in a comfortable setting",
        "Bring family members and current pets (with approval) to meet",
        "Ask questions about the pet's history, behavior, and care needs",
        "Observe how the pet interacts with you and your family"
      ],
      timeframe: "1-2 hours",
      tips: "Come with an open mind and let the pet's personality shine through."
    },
    {
      number: 5,
      title: "Home Preparation",
      description: "Get your home ready for your new pet with necessary supplies and pet-proofing.",
      icon: Home,
      details: [
        "Pet-proof your home by removing hazards and securing dangerous items",
        "Set up a comfortable space with bed, food bowls, and toys",
        "Install safety gates if needed for puppies or small pets",
        "Stock up on appropriate food, treats, and basic supplies"
      ],
      timeframe: "1-2 days",
      tips: "We provide a new pet checklist and can recommend local pet stores for supplies."
    },
    {
      number: 6,
      title: "Finalize Adoption",
      description: "Complete the paperwork, pay adoption fees, and bring your new pet home!",
      icon: Heart,
      details: [
        "Sign adoption agreement and receive all pet documentation",
        "Pay adoption fees (includes vaccinations, spay/neuter, microchip)",
        "Receive medical records and care instructions",
        "Schedule follow-up vet appointment within 7 days"
      ],
      timeframe: "30-60 minutes",
      tips: "Bring a secure carrier or leash for the ride home. Take the first day slow and let your pet adjust."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pet Adoption Guide
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Your complete step-by-step guide to adopting a pet through Pawsitive. 
            We'll walk you through every part of the process to ensure a smooth and successful adoption.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adoption Process Overview</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                <p className="text-gray-600">Typically 3-7 days from application to bringing your pet home</p>
              </div>
              <div>
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Success Rate</h3>
                <p className="text-gray-600">98% of our adoptions result in happy, long-term placements</p>
              </div>
              <div>
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600">Lifetime support and guidance for all adopted pets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gradient-to-br from-orange-500 to-pink-500 p-8 text-white">
                      <div className="flex items-center mb-4">
                        <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-sm opacity-90">Step {step.number}</div>
                          <div className="text-xs opacity-75">{step.timeframe}</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="opacity-90">{step.description}</p>
                    </div>
                    
                    <div className="md:w-2/3 p-8">
                      <h4 className="font-semibold text-gray-900 mb-4">What to expect:</h4>
                      <ul className="space-y-3 mb-6">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h5 className="font-semibold text-orange-800 mb-2">💡 Pro Tip:</h5>
                        <p className="text-orange-700">{step.tips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Preparation Checklist */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">New Pet Preparation Checklist</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Essential Supplies</h3>
              <ul className="space-y-2">
                {[
                  'Food and water bowls (stainless steel or ceramic)',
                  'Age-appropriate pet food (ask what they\'re currently eating)',
                  'Comfortable bed or crate',
                  'Collar with ID tag and leash (for dogs)',
                  'Carrier (for cats and small animals)',
                  'Toys for mental stimulation and play',
                  'Waste bags and litter box (if applicable)',
                  'Grooming supplies (brush, nail clippers)'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-3" />
                    <span className="text-blue-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Home Preparation</h3>
              <ul className="space-y-2">
                {[
                  'Remove toxic plants and hazardous materials',
                  'Secure cabinets with dangerous items',
                  'Set up a quiet space for decompression',
                  'Install baby gates if needed',
                  'Check fence security (for dogs)',
                  'Hide electrical cords and small objects',
                  'Research local veterinarians',
                  'Plan the first few days at home'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                    <span className="text-green-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Check out our comprehensive FAQ section or contact our adoption specialists for personalized guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg"
            >
              View FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-500 hover:text-white transition-colors"
            >
              Contact Support
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
            Browse our available pets and take the first step toward welcoming 
            a new family member into your home.
          </p>
          <Link
            href="/pets"
            className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <PawPrint className="mr-2 h-5 w-5" />
            Browse Available Pets
          </Link>
        </div>
      </section>
    </div>
  )
} 