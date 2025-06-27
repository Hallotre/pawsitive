import { Heart, Stethoscope, Utensils, Home, Brush, Brain, Shield, Phone, Book } from 'lucide-react'
import Link from 'next/link'

export default function ResourcesPage() {
  const resourceCategories = [
    {
      title: "Health & Medical Care",
      icon: Stethoscope,
      color: "blue",
      description: "Essential health information for your pet's wellbeing"
    },
    {
      title: "Nutrition & Feeding", 
      icon: Utensils,
      color: "green",
      description: "Feeding guidelines and nutritional advice"
    },
    {
      title: "Training & Behavior",
      icon: Brain, 
      color: "purple",
      description: "Training tips and behavioral guidance"
    },
    {
      title: "Home & Safety",
      icon: Home,
      color: "orange", 
      description: "Creating a safe, comfortable home environment"
    },
    {
      title: "Grooming & Hygiene",
      icon: Brush,
      color: "pink",
      description: "Keeping your pet clean and healthy"
    },
    {
      title: "Exercise & Enrichment",
      icon: Heart,
      color: "red",
      description: "Physical activity and mental stimulation"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Book className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pet Care Resources
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Everything you need to know about caring for your new pet. From health and nutrition 
            to training and enrichment, we have got you covered with expert guidance.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">24/7 Emergency Support</h2>
          <p className="text-gray-600 mb-6">
            Need immediate help with your pet? Our emergency support line is available around the clock.
          </p>
          <a 
            href="tel:+15551234357"
            className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Emergency Line: (555) 123-HELP
          </a>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need More Help?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Contact our support team for personalized guidance with your pet care questions.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  )
} 