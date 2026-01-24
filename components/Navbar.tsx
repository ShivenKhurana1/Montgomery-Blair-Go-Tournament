'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-900 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center space-x-0.5">
                <div className="go-stone-black h-3 w-3"></div>
                <div className="go-stone-white h-3 w-3"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Montgomery Blair Go Tournament
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-navy-700"
            >
              Home
            </Link>
            <Link
              href="/tournaments"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-navy-700"
            >
              Tournaments
            </Link>
            <Link
              href="/registration"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-navy-700"
            >
              Registration
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-navy-700"
            >
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-1 border-t border-gray-200 px-2 pt-4 pb-3">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/tournaments"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Tournaments
              </Link>
              <Link
                href="/registration"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Registration
              </Link>
              <Link
                href="/about"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
