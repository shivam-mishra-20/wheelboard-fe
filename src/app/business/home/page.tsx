'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { BusinessProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';

export default function BusinessHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: '/Bus.jpg', alt: 'Business logistics' },
    { id: 2, image: '/truck-01.jpg', alt: 'Business fleet' },
    { id: 3, image: '/yellow-truck.jpg', alt: 'Business transport' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Carousel */}
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="relative h-64 md:h-96">
              <div className="relative h-full w-full">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="mb-12">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
              Our Services
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {/* Reuse the same cards as company page for visual consistency */}
              {[
                'Vehicles',
                'Professional',
                'Expenses',
                'Hire',
                'Services',
                'DashBoard',
              ].map((label) => (
                <div
                  key={label}
                  className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-blue-50 p-3">
                      <svg
                        className="h-8 w-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Recent Jobs Created
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Driver',
                  img: '/staring-man.jpg',
                },
                {
                  title: 'Technician',
                  img: '/excavator.jpg',
                },
              ].map((job) => (
                <div
                  key={job.title}
                  className="flex items-center justify-between rounded-2xl bg-red-50 p-6"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor Description part comes here dynamically
                      as the company creates Jobs and posts online
                    </p>
                    <div className="mt-3 flex space-x-4">
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Share
                      </button>
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="ml-6 h-20 w-20 overflow-hidden rounded-lg">
                    <Image
                      src={job.img}
                      alt={job.title}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Feeds */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Popular Feeds
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
                      <span className="text-xs font-medium">B</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Business Feed
                    </span>
                  </div>
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <Image
                      src="/live-truck.gif"
                      alt="Fleet management"
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Industry Insights
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Short feed description about operations and updates
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Posted 3 days ago
                    </span>
                    <button className="text-sm font-medium text-blue-500 hover:text-blue-600">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </BusinessProtected>
  );
}
