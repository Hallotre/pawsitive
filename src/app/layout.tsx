import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { PawPrint, Menu } from "lucide-react";
import { Navigation } from "@/components";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Pawsitive - Pet Adoption Made Easy",
  description: "Find your perfect furry friend. Connect loving families with pets in need of homes through our modern pet adoption platform.",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  metadataBase: new URL('https://pawsitive-pet-adoption.vercel.app'),
  openGraph: {
    title: 'Pawsitive - Pet Adoption Made Easy',
    description: 'Find your perfect furry friend. Connect loving families with pets in need of homes.',
    images: ['/apple-icon.svg'],
  },
};

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <PawPrint className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold">Pawsitive</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting loving families with pets in need of homes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pets" className="text-gray-400 hover:text-white transition-colors">
                  Browse Pets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/adoption-guide" className="text-gray-400 hover:text-white transition-colors">
                  Adoption Guide
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors">
                  Pet Care Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <p className="text-gray-400 mb-2">Email: hello@pawsitive.com</p>
            <p className="text-gray-400 mb-2">Phone: (555) 123-PETS</p>
            <p className="text-gray-400">Available 24/7 for support</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pawsitive. All rights reserved. Made with ❤️ for pets and their future families.</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
