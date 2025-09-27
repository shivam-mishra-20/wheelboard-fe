'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-primary-bg p-2">
                <Image
                  src="/Logo.svg"
                  alt="WheelBoard Logo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-poppins text-xl font-semibold text-primary-accent">
                WheelBoard
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-button"
              >
                Dashboard
              </Link>
              <Link
                href="/fleet"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-button"
              >
                Fleet
              </Link>
              <Link
                href="/jobs"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-button"
              >
                Jobs
              </Link>
              <Link
                href="/drivers"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-button"
              >
                Drivers
              </Link>
              <Link
                href="/analytics"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-button"
              >
                Analytics
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3 md:ml-6">
              <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-button">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5-5-5h5v-12z"
                  />
                </svg>
              </button>
              <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-button">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5-5-5h5v-12z"
                  />
                </svg>
              </button>
              <Link
                href="/login"
                className="rounded-lg bg-primary-button px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-button/90"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-button"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t bg-white px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-button"
            >
              Dashboard
            </Link>
            <Link
              href="/fleet"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-button"
            >
              Fleet
            </Link>
            <Link
              href="/jobs"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-button"
            >
              Jobs
            </Link>
            <Link
              href="/drivers"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-button"
            >
              Drivers
            </Link>
            <Link
              href="/analytics"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-button"
            >
              Analytics
            </Link>
            <Link
              href="/login"
              className="mt-4 block rounded-md bg-primary-button px-3 py-2 text-base font-medium text-white hover:bg-primary-button/90"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
