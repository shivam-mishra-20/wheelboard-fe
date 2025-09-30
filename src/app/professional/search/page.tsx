'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';

export default function ProfessionalSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: '/truck-01.jpg', alt: 'Search professional opportunities' },
    { id: 2, image: '/mining-truck.jpg', alt: 'Mining jobs available' },
    { id: 3, image: '/excavator.jpg', alt: 'Construction work' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  const jobCategories = [
    'All Categories',
    'Driving',
    'Construction',
    'Mining',
    'Logistics',
    'Maintenance',
    'Technical',
  ];

  const locations = [
    'All Locations',
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Pune',
  ];

  const searchResults = [
    {
      id: 1,
      title: 'Heavy Vehicle Driver',
      company: 'Delhi Transport Co.',
      location: 'Delhi, India',
      salary: '₹25,000 - ₹35,000/month',
      experience: '2-5 years',
      type: 'Full-time',
      description:
        'Looking for experienced heavy vehicle drivers for long-distance transport operations.',
      image: '/staring-man.jpg',
      postedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Mining Equipment Operator',
      company: 'Mining Solutions Ltd.',
      location: 'Mumbai, India',
      salary: '₹30,000 - ₹45,000/month',
      experience: '3-6 years',
      type: 'Full-time',
      description:
        'Operate and maintain mining equipment in open-pit mining operations.',
      image: '/mining-2.jpg',
      postedDate: '1 day ago',
    },
    {
      id: 3,
      title: 'Construction Site Supervisor',
      company: 'Build Pro Construction',
      location: 'Bangalore, India',
      salary: '₹40,000 - ₹55,000/month',
      experience: '5-8 years',
      type: 'Full-time',
      description:
        'Supervise construction activities and ensure safety compliance on site.',
      image: '/excavator.jpg',
      postedDate: '3 days ago',
    },
    {
      id: 4,
      title: 'Logistics Coordinator',
      company: 'Express Logistics',
      location: 'Chennai, India',
      salary: '₹28,000 - ₹38,000/month',
      experience: '1-3 years',
      type: 'Full-time',
      description:
        'Coordinate logistics operations and manage supply chain activities.',
      image: '/truck-CTA.png',
      postedDate: '4 days ago',
    },
    {
      id: 5,
      title: 'Fleet Maintenance Technician',
      company: 'Transport Solutions',
      location: 'Hyderabad, India',
      salary: '₹22,000 - ₹32,000/month',
      experience: '2-4 years',
      type: 'Full-time',
      description:
        'Maintain and repair fleet vehicles to ensure optimal performance.',
      image: '/logistics-professional.jpg',
      postedDate: '5 days ago',
    },
    {
      id: 6,
      title: 'Site Engineer',
      company: 'Infrastructure Corp',
      location: 'Pune, India',
      salary: '₹35,000 - ₹50,000/month',
      experience: '3-5 years',
      type: 'Full-time',
      description:
        'Plan and execute construction projects with focus on quality and safety.',
      image: '/professional-profile.png',
      postedDate: '1 week ago',
    },
  ];

  const filteredResults = searchResults.filter((job) => {
    const matchesQuery =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      selectedCategory === 'All Categories' ||
      job.title.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesLocation =
      selectedLocation === 'all' ||
      selectedLocation === 'All Locations' ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesQuery && matchesCategory && matchesLocation;
  });

  return (
    <ProfessionalProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Search Section */}
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
              </div>

              {/* Search Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-4xl px-6">
                  <h1 className="mb-8 text-center text-3xl font-bold text-white md:text-4xl">
                    Find Your Perfect Job Opportunity
                  </h1>
                  <div className="rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Search jobs, companies, or keywords..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          {jobCategories.map((category) => (
                            <option
                              key={category}
                              value={
                                category === 'All Categories' ? 'all' : category
                              }
                            >
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          {locations.map((location) => (
                            <option
                              key={location}
                              value={
                                location === 'All Locations' ? 'all' : location
                              }
                            >
                              {location}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
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

          {/* Search Results Section */}
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Job Opportunities
              </h2>
              <p className="text-sm text-gray-600">
                {filteredResults.length} jobs found
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredResults.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={job.image}
                        alt={job.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-blue-600">
                        {job.company}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                        <span className="flex items-center">
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                          {job.salary}
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                            />
                          </svg>
                          {job.experience}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {job.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Posted {job.postedDate}
                        </span>
                        <div className="flex space-x-2">
                          <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100">
                            Apply Now
                          </button>
                          <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredResults.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Try adjusting your search criteria or browse all available
                  positions.
                </p>
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <div className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {[
                'Driving',
                'Construction',
                'Mining',
                'Logistics',
                'Maintenance',
                'Technical',
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group cursor-pointer rounded-2xl border p-6 text-center shadow-sm transition-all hover:shadow-md ${
                    selectedCategory === category
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="mb-4 flex justify-center">
                    <div
                      className={`rounded-full p-3 ${
                        selectedCategory === category
                          ? 'bg-blue-100'
                          : 'bg-blue-50'
                      }`}
                    >
                      <svg
                        className={`h-8 w-8 ${
                          selectedCategory === category
                            ? 'text-blue-600'
                            : 'text-blue-500'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3
                    className={`text-sm font-medium ${
                      selectedCategory === category
                        ? 'text-blue-900'
                        : 'text-gray-900'
                    }`}
                  >
                    {category}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Job Search Tips
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Update Your Profile',
                  description:
                    'Keep your professional profile updated with latest skills and experience.',
                  icon: (
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Apply Early',
                  description:
                    'Apply to jobs as soon as they are posted to increase your chances.',
                  icon: (
                    <svg
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Network & Connect',
                  description:
                    'Build professional relationships and connect with industry professionals.',
                  icon: (
                    <svg
                      className="h-8 w-8 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                },
              ].map((tip, index) => (
                <div key={index} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex justify-center">{tip.icon}</div>
                  <h3 className="mb-2 text-center font-semibold text-gray-900">
                    {tip.title}
                  </h3>
                  <p className="text-center text-sm text-gray-600">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </ProfessionalProtected>
  );
}
