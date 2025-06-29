'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PawPrint, Menu, X, User, Settings, Heart } from 'lucide-react'
import { LogoutButton } from '@/components'

interface SessionData {
  userId: string
  email: string
  role: string
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        setSession(data.user)
      } else {
        setSession(null)
      }
    } catch (error) {
      console.error('Failed to check auth status:', error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Function to refresh session state (called after logout)
  const refreshSession = () => {
    setLoading(true)
    checkAuth()
  }

  const isAdmin = session?.role === 'admin'
  const isUser = session?.role === 'user'
  const isAuthenticated = !!session

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <PawPrint className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Pawsitive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/pets"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
            >
              Browse Pets
            </Link>

            {!loading && (
              <>
                {/* Authenticated User Navigation */}
                {isAuthenticated ? (
                  <>
                    {/* Admin Links - Only show admin dashboard for authenticated admins */}
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    {/* User Links */}
                    {isUser && (
                      <>
                        <Link
                          href="/account/dashboard"
                          className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          My Favorites
                        </Link>
                        <Link
                          href="/account/profile"
                          className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center"
                        >
                          <User className="h-4 w-4 mr-1" />
                          Profile
                        </Link>
                      </>
                    )}

                    {/* Logout Button */}
                    <LogoutButton onLogout={refreshSession} />
                  </>
                ) : (
                  /* Non-authenticated Navigation */
                  <>
                    <Link
                      href="/auth/user-login"
                      className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register-user"
                      className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors font-medium text-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/pets"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Pets
              </Link>

              {!loading && (
                <>
                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      {isUser && (
                        <>
                          <Link
                            href="/account/dashboard"
                            className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            My Favorites
                          </Link>
                          <Link
                            href="/account/profile"
                            className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </>
                      )}

                      <div className="px-3 py-2">
                        <LogoutButton onLogout={refreshSession} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/user-login"
                        className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/register-user"
                        className="block px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium mx-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 