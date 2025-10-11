'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Calendar as CalendarIcon,
  Shield,
  MapPin,
  Truck,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock driver data
const getDriverById = (id: string) => {
  return {
    id,
    name: 'Jon Doe',
    avatar: '/profile.png',
    phoneNumber: '704 Hameogeo +61 70063',
    rating: 4.6,
    totalTrips: 162,
    isVerified: true,
    experience: '5 years',
    performance: {
      safetyRating: 95,
      topEfficiency: 93,
      customerFeedback: 4.4,
    },
    tripStats: {
      totalTrips: 162,
      onTimeDelivery: '2h 18m',
      avgDeliveryTime: '8h 40m',
      completedTrips: 28,
    },
    reviews: [
      {
        id: 'r1',
        author: 'Alex Sharma',
        date: 'Jul 12, 2019',
        location: 'Ontario-5',
        rating: 5,
        comment:
          'Delayed it always prompt and professional. He has an expert drivers and is very comfortable.',
      },
      {
        id: 'r2',
        author: 'Samantha Jones',
        date: 'Jul 14, 2019',
        location: 'Ontario-5',
        rating: 4,
        comment:
          'On time and quick service. Would pick again. Polite and professional.',
      },
      {
        id: 'r3',
        author: 'Michael Lee',
        date: 'Jul 16, 2019',
        location: 'Ontario-5',
        rating: 5,
        comment:
          'Punctual and efficient. All deliveries were timely and in perfect condition.',
      },
    ],
    calendar: {
      month: 'May 2025',
      availableDays: [2, 4, 5, 9, 11, 16, 18, 23, 25, 30],
    },
  };
};

function DriverProfileInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const driverId = searchParams.get('driverId');
  const tripId = searchParams.get('tripId');

  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!driverId) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Driver Not Found
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="mt-6 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3 font-semibold text-white shadow-md"
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  const driver = getDriverById(driverId);
  const displayedReviews = showAllReviews
    ? driver.reviews
    : driver.reviews.slice(0, 2);

  const handleAssignTrip = () => {
    if (tripId) {
      router.push(
        `/company/trips/assignment?driverId=${driverId}&tripId=${tripId}`
      );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Generate calendar for current month
  const generateCalendar = () => {
    const daysInMonth = 31;
    const firstDay = 0; // Sunday
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = driver.calendar.availableDays.includes(day);
      days.push(
        <div
          key={day}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
            isAvailable
              ? 'bg-[#f36969] text-white shadow-sm hover:shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bids
          </motion.button>

          {/* Hero Section - Professional Driver Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg"
          >
            <div className="bg-transparent p-1">
              <div className="bg-white">
                <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
                  {/* Left: Driver Photo & Basic Info */}
                  <div className="flex flex-col items-center lg:col-span-3 lg:border-r lg:border-gray-200 lg:pr-8">
                    <div className="relative mb-4">
                      <div className="relative h-40 w-40 overflow-hidden rounded-2xl border-4 border-gray-100 shadow-lg">
                        <Image
                          src={driver.avatar}
                          alt={driver.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {driver.isVerified && (
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg">
                          <CheckCircle2 className="h-7 w-7 text-green-500" />
                        </div>
                      )}
                    </div>

                    <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
                      {driver.name}
                    </h1>
                    <p className="mb-3 text-center text-sm text-gray-600">
                      {driver.phoneNumber}
                    </p>

                    {/* Rating Badge */}
                    <div className="mb-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 px-5 py-2.5">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        {driver.rating}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({driver.totalTrips} trips)
                      </span>
                    </div>

                    {/* Contact Buttons */}
                    <div className="mb-4 flex w-full gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-green-500 hover:bg-green-50 hover:text-green-600"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </motion.button>
                    </div>

                    {/* Experience Badge */}
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5">
                      <Award className="h-4 w-4 text-[#f36969]" />
                      <span className="text-sm font-semibold text-gray-700">
                        {driver.experience} Experience
                      </span>
                    </div>
                  </div>

                  {/* Right: Stats & Assign Button */}
                  <div className="lg:col-span-9">
                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {driver.tripStats.totalTrips}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          Total Trips
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {driver.tripStats.onTimeDelivery}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          Avg Delivery
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100/50 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {driver.tripStats.completedTrips}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          Completed
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-[#f36969]/10 to-[#f36969]/20 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f36969]">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {driver.tripStats.avgDeliveryTime}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          Drive Time
                        </p>
                      </div>
                    </div>

                    {/* Performance Bars */}
                    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">
                        Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              Safety Rating
                            </span>
                            <span className="text-sm font-bold text-[#f36969]">
                              {driver.performance.safetyRating}%
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${driver.performance.safetyRating}%`,
                              }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              Efficiency
                            </span>
                            <span className="text-sm font-bold text-[#f36969]">
                              {driver.performance.topEfficiency}%
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${driver.performance.topEfficiency}%`,
                              }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              Customer Satisfaction
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-bold text-yellow-600">
                                {driver.performance.customerFeedback}/5
                              </span>
                            </div>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(driver.performance.customerFeedback / 5) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: 0.4 }}
                              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assign Button */}
                    {tripId && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleAssignTrip}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-1 py-2 font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-8 md:py-4 md:text-lg"
                      >
                        <Shield className="h-8 w-8" />
                        Assign Driver & Proceed to Payment
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Availability Calendar
                </h2>
                <div className="flex items-center gap-2 rounded-lg bg-[#f36969]/10 px-3 py-1.5">
                  <CalendarIcon className="h-4 w-4 text-[#f36969]" />
                  <span className="text-sm font-semibold text-[#f36969]">
                    {driver.calendar.month}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-gray-400"
                    >
                      {day}
                    </div>
                  )
                )}
                {generateCalendar()}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="h-4 w-4 rounded bg-[#f36969] shadow-sm" />
                <span className="text-sm font-semibold text-gray-700">
                  Available Days
                </span>
              </div>
            </motion.div>

            {/* Right Column - Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-bold text-gray-900">
                Customer Reviews
              </h2>

              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 transition-all hover:border-[#f36969]/30 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {review.author}
                        </h4>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {review.date} • {review.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              {driver.reviews.length > 2 && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-5 w-full rounded-xl border border-[#f36969]/30 bg-[#f36969]/5 px-4 py-3 font-semibold text-[#f36969] transition-all hover:bg-[#f36969]/10"
                >
                  {showAllReviews
                    ? 'Show Less'
                    : `View All ${driver.reviews.length} Reviews`}
                </motion.button>
              )}
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}

const LoadingFallback = () => (
  <div className="p-6 text-sm text-gray-500">Loading…</div>
);

export default function DriverProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DriverProfileInner />
    </Suspense>
  );
}
