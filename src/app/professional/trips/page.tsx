'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';

export default function ProfessionalTripsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: '/live-truck.gif', alt: 'Live tracking dashboard' },
    { id: 2, image: '/truck-01.jpg', alt: 'Trip management' },
    { id: 3, image: '/Yellow-truck.jpg', alt: 'Route optimization' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  const activeTrips = [
    {
      id: 1,
      tripId: 'TRP-001',
      route: 'Delhi → Mumbai',
      startTime: '2025-09-30 08:00 AM',
      estimatedArrival: '2025-10-01 06:00 PM',
      distance: '1,424 km',
      vehicle: 'Tata 407',
      vehicleNumber: 'DL-8C-4567',
      status: 'In Transit',
      progress: 65,
      currentLocation: 'Ahmedabad, Gujarat',
      cargo: 'Electronics Components',
      client: 'Tech Solutions Ltd.',
      earnings: '₹45,000',
      image: '/truck-01.jpg',
    },
    {
      id: 2,
      tripId: 'TRP-002',
      route: 'Bangalore → Chennai',
      startTime: '2025-09-30 10:30 AM',
      estimatedArrival: '2025-09-30 08:00 PM',
      distance: '346 km',
      vehicle: 'Mahindra Bolero',
      vehicleNumber: 'KA-05-8921',
      status: 'Loading',
      progress: 15,
      currentLocation: 'Bangalore Depot',
      cargo: 'Textile Materials',
      client: 'Fashion Hub Pvt Ltd',
      earnings: '₹18,500',
      image: '/red-truck.png',
    },
  ];

  const completedTrips = [
    {
      id: 3,
      tripId: 'TRP-003',
      route: 'Mumbai → Pune',
      completedDate: '2025-09-28',
      distance: '148 km',
      vehicle: 'Eicher Pro 1049',
      vehicleNumber: 'MH-12-5643',
      status: 'Completed',
      cargo: 'Construction Materials',
      client: 'Build Pro Construction',
      earnings: '₹12,000',
      rating: 4.8,
      image: '/black-truck.png',
    },
    {
      id: 4,
      tripId: 'TRP-004',
      route: 'Delhi → Jaipur',
      completedDate: '2025-09-25',
      distance: '280 km',
      vehicle: 'Tata 407',
      vehicleNumber: 'DL-8C-4567',
      status: 'Completed',
      cargo: 'Medical Supplies',
      client: 'HealthCare Solutions',
      earnings: '₹15,500',
      rating: 5.0,
      image: '/truck-CTA.png',
    },
    {
      id: 5,
      tripId: 'TRP-005',
      route: 'Chennai → Coimbatore',
      completedDate: '2025-09-22',
      distance: '504 km',
      vehicle: 'Ashok Leyland',
      vehicleNumber: 'TN-01-9876',
      status: 'Completed',
      cargo: 'Food Products',
      client: 'Fresh Foods Ltd',
      earnings: '₹22,000',
      rating: 4.5,
      image: '/Yellow-truck.jpg',
    },
  ];

  const upcomingTrips = [
    {
      id: 6,
      tripId: 'TRP-006',
      route: 'Hyderabad → Vijayawada',
      scheduledDate: '2025-10-02',
      scheduledTime: '06:00 AM',
      distance: '275 km',
      vehicle: 'Tata Ultra',
      vehicleNumber: 'TS-09-1234',
      status: 'Scheduled',
      cargo: 'Industrial Equipment',
      client: 'Industrial Solutions Inc.',
      estimatedEarnings: '₹16,800',
      image: '/mining-truck.jpg',
    },
    {
      id: 7,
      tripId: 'TRP-007',
      route: 'Kolkata → Bhubaneswar',
      scheduledDate: '2025-10-05',
      scheduledTime: '05:30 AM',
      distance: '442 km',
      vehicle: 'Mahindra Furio',
      vehicleNumber: 'WB-06-7890',
      status: 'Scheduled',
      cargo: 'Consumer Goods',
      client: 'Retail Chain Pvt Ltd',
      estimatedEarnings: '₹21,500',
      image: '/Bus.jpg',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-green-100 text-green-800';
      case 'Loading':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
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
                    Trip Management
                  </h1>
                  <p className="text-lg md:text-xl">
                    Track, manage and optimize your transportation trips
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
                title: 'Active Trips',
                value: activeTrips.length.toString(),
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                color: 'bg-green-50 border-green-200',
              },
              {
                title: 'Completed Trips',
                value: completedTrips.length.toString(),
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                color: 'bg-blue-50 border-blue-200',
              },
              {
                title: 'Upcoming Trips',
                value: upcomingTrips.length.toString(),
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
                color: 'bg-purple-50 border-purple-200',
              },
              {
                title: 'Total Earnings',
                value: '₹1,51,300',
                icon: (
                  <svg
                    className="h-8 w-8 text-yellow-500"
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
                ),
                color: 'bg-yellow-50 border-yellow-200',
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
              { id: 'active', label: 'Active Trips' },
              { id: 'completed', label: 'Completed' },
              { id: 'upcoming', label: 'Upcoming' },
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

          {/* Active Trips */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Trips</h2>
              {activeTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={trip.image}
                          alt={trip.vehicle}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trip.route}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Trip ID: {trip.tripId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trip.vehicle} • {trip.vehicleNumber}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(trip.status)}`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        START TIME
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.startTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        ESTIMATED ARRIVAL
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.estimatedArrival}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        CURRENT LOCATION
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.currentLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        EARNINGS
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {trip.earnings}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        Progress
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {trip.progress}%
                      </p>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all"
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cargo:</span> {trip.cargo}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Client:</span>{' '}
                        {trip.client}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
                        Track Live
                      </button>
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Trips */}
          {activeTab === 'completed' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Completed Trips
              </h2>
              {completedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={trip.image}
                          alt={trip.vehicle}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trip.route}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Trip ID: {trip.tripId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trip.vehicle} • {trip.vehicleNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(trip.status)}`}
                      >
                        {trip.status}
                      </span>
                      <div className="mt-2 flex items-center">
                        {renderStars(trip.rating)}
                        <span className="ml-1 text-sm text-gray-600">
                          {trip.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        COMPLETED DATE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.completedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        DISTANCE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.distance}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        CLIENT
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.client}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        EARNINGS
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {trip.earnings}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cargo:</span> {trip.cargo}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Download Invoice
                      </button>
                      <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Trips */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Trips
              </h2>
              {upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={trip.image}
                          alt={trip.vehicle}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trip.route}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Trip ID: {trip.tripId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trip.vehicle} • {trip.vehicleNumber}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(trip.status)}`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        SCHEDULED DATE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.scheduledDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        SCHEDULED TIME
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.scheduledTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        DISTANCE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.distance}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        EST. EARNINGS
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {trip.estimatedEarnings}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cargo:</span> {trip.cargo}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Client:</span>{' '}
                        {trip.client}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                        Cancel
                      </button>
                      <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
                        View Details
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
