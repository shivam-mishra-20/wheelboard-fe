'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';

export default function ProfessionalJobsPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: '/Hire.png', alt: 'Job opportunities' },
    { id: 2, image: '/challenges.png', alt: 'Professional challenges' },
    { id: 3, image: '/support.png', alt: 'Career support' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  const availableJobs = [
    {
      id: 1,
      title: 'Senior Heavy Vehicle Driver',
      company: 'Metro Transport Solutions',
      location: 'Delhi, India',
      salary: '₹35,000 - ₹45,000/month',
      type: 'Full-time',
      experience: '5+ years',
      description:
        'We are looking for an experienced heavy vehicle driver for long-distance transportation. Must have clean driving record and experience with multiple vehicle types.',
      requirements: [
        'Valid Heavy Vehicle License',
        'Minimum 5 years experience',
        'Clean driving record',
        'Flexible schedule',
      ],
      posted: '2 days ago',
      urgent: true,
      image: '/truck-01.jpg',
      benefits: ['Health Insurance', 'Fuel Allowance', 'Performance Bonus'],
    },
    {
      id: 2,
      title: 'Construction Equipment Operator',
      company: 'BuildTech Construction',
      location: 'Mumbai, India',
      salary: '₹28,000 - ₹38,000/month',
      type: 'Full-time',
      experience: '3-5 years',
      description:
        'Operate various construction equipment including excavators, bulldozers, and cranes. Safety certification required.',
      requirements: [
        'Equipment operation certification',
        'Safety training completed',
        '3+ years experience',
        'Team player attitude',
      ],
      posted: '1 day ago',
      urgent: false,
      image: '/excavator.jpg',
      benefits: ['Medical Coverage', 'Training Programs', 'Overtime Pay'],
    },
    {
      id: 3,
      title: 'Mining Truck Driver',
      company: 'Indian Mining Corp',
      location: 'Jharkhand, India',
      salary: '₹40,000 - ₹55,000/month',
      type: 'Full-time',
      experience: '4-6 years',
      description:
        'Drive heavy mining trucks in open-pit mining operations. Must be comfortable working in challenging environments.',
      requirements: [
        'Mining vehicle experience',
        'Safety certification',
        'Physical fitness',
        'Shift work availability',
      ],
      posted: '3 hours ago',
      urgent: true,
      image: '/mining-truck.jpg',
      benefits: ['High Compensation', 'Accommodation', 'Medical Care'],
    },
    {
      id: 4,
      title: 'Logistics Coordinator',
      company: 'Swift Logistics',
      location: 'Bangalore, India',
      salary: '₹25,000 - ₹32,000/month',
      type: 'Full-time',
      experience: '2-4 years',
      description:
        'Coordinate transportation operations, manage driver schedules, and ensure timely deliveries.',
      requirements: [
        'Logistics experience',
        'Computer skills',
        'Communication skills',
        'Problem-solving ability',
      ],
      posted: '5 days ago',
      urgent: false,
      image: '/dashboard.png',
      benefits: ['Career Growth', 'Skill Development', 'Team Environment'],
    },
  ];

  const appliedJobs = [
    {
      id: 5,
      title: 'Fleet Maintenance Supervisor',
      company: 'Transport Masters Ltd',
      location: 'Chennai, India',
      appliedDate: '2025-09-28',
      status: 'Under Review',
      salary: '₹42,000 - ₹52,000/month',
      image: '/tires.png',
      lastUpdate: '2 days ago',
    },
    {
      id: 6,
      title: 'Long Distance Driver',
      company: 'Highway Express',
      location: 'Pune, India',
      appliedDate: '2025-09-25',
      status: 'Interview Scheduled',
      salary: '₹30,000 - ₹40,000/month',
      image: '/Yellow-truck.jpg',
      lastUpdate: '1 day ago',
      interviewDate: '2025-10-02',
    },
    {
      id: 7,
      title: 'Equipment Technician',
      company: 'Heavy Machinery Co',
      location: 'Hyderabad, India',
      appliedDate: '2025-09-20',
      status: 'Rejected',
      salary: '₹24,000 - ₹30,000/month',
      image: '/bulldozer.png',
      lastUpdate: '3 days ago',
    },
  ];

  const savedJobs = [
    {
      id: 8,
      title: 'Regional Transport Manager',
      company: 'National Carriers',
      location: 'Kolkata, India',
      salary: '₹50,000 - ₹65,000/month',
      type: 'Full-time',
      experience: '7+ years',
      savedDate: '2025-09-29',
      image: '/truck-CTA.png',
    },
    {
      id: 9,
      title: 'Safety Inspector',
      company: 'Safety First Solutions',
      location: 'Jaipur, India',
      salary: '₹32,000 - ₹42,000/month',
      type: 'Full-time',
      experience: '4-6 years',
      savedDate: '2025-09-27',
      image: '/challenges.png',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProfessionalProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="relative h-64 md:h-80">
              <div className="relative h-full w-full">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    Job Management
                  </h1>
                  <p className="text-lg md:text-xl">
                    Discover, apply, and track your career opportunities
                  </p>
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

          {/* Stats Cards */}
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Available Jobs',
                value: availableJobs.length.toString(),
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                    />
                  </svg>
                ),
                color: 'bg-green-50 border-green-200',
              },
              {
                title: 'Applied Jobs',
                value: appliedJobs.length.toString(),
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
                color: 'bg-blue-50 border-blue-200',
              },
              {
                title: 'Saved Jobs',
                value: savedJobs.length.toString(),
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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                ),
                color: 'bg-purple-50 border-purple-200',
              },
              {
                title: 'Profile Views',
                value: '47',
                icon: (
                  <svg
                    className="h-8 w-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ),
                color: 'bg-orange-50 border-orange-200',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${stat.color}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 flex space-x-1 rounded-2xl bg-gray-100 p-1">
            {[
              { id: 'available', label: 'Available Jobs' },
              { id: 'applied', label: 'Applied Jobs' },
              { id: 'saved', label: 'Saved Jobs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Available Jobs */}
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Jobs
                </h2>
                <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                  Create Job Alert
                </button>
              </div>

              {availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={job.image}
                          alt={job.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          {job.urgent && (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                              Urgent
                            </span>
                          )}
                        </div>
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {job.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-700">
                    {job.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">
                      Requirements:
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">
                      Benefits:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Posted {job.posted}
                    </span>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        View Details
                      </button>
                      <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applied Jobs */}
          {activeTab === 'applied' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Applied Jobs</h2>
              {appliedJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={job.image}
                          alt={job.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm font-medium text-blue-600">
                          {job.company}
                        </p>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        APPLIED DATE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.appliedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        SALARY
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.salary}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        LAST UPDATE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.lastUpdate}
                      </p>
                    </div>
                    {job.interviewDate && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          INTERVIEW DATE
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          {job.interviewDate}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {job.status === 'Interview Scheduled' && (
                        <span className="text-sm text-green-600">
                          🎉 Interview scheduled!
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        View Application
                      </button>
                      {job.status === 'Under Review' && (
                        <button className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Jobs */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Saved Jobs</h2>
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={job.image}
                          alt={job.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm font-medium text-blue-600">
                          {job.company}
                        </p>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-700">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        SALARY
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.salary}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        EXPERIENCE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.experience}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        SAVED DATE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.savedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Job Type: {job.type}
                    </span>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        View Details
                      </button>
                      <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </ProfessionalProtected>
  );
}
