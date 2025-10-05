'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Shield,
  Phone,
  User,
  TrendingUp,
  Clock,
  DollarSign,
  MessageSquare,
  Award,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBidsForTrip, type TripBid } from '@/lib/mockApi';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

export default function TripBidsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get('tripId');

  const [bids, setBids] = useState<TripBid[]>([]);

  useEffect(() => {
    if (tripId) {
      const tripBids = getBidsForTrip(tripId);
      setBids(tripBids);
    }
  }, [tripId]);

  const handleAssignTrip = (bidId: string, bidderId: string) => {
    // Navigate to payment page with driver and trip info
    router.push(
      `/company/trips/assignment?driverId=${bidderId}&tripId=${tripId}`
    );
  };

  const handleViewProfile = (bidderId: string) => {
    // Navigate to driver profile page with tripId
    router.push(
      `/company/drivers/profile?driverId=${bidderId}&tripId=${tripId}`
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (!tripId) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              No Trip Selected
            </h2>
            <p className="mt-2 text-gray-600">
              Please select a trip to view bids.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/company/trips')}
              className="mt-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              Back to Trips
            </motion.button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  return (
    <CompanyProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/company/trips')}
                  className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Trips
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Trip Bids
                  </h1>
                  <p className="text-sm text-gray-600 sm:text-base">
                    {bids.length} bid{bids.length !== 1 ? 's' : ''} received
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-md">
                <Award className="h-5 w-5 text-primary-500" />
                <div>
                  <p className="text-xs text-gray-500">Lowest Bid</p>
                  <p className="font-bold text-gray-900">
                    ₹
                    {bids.length > 0
                      ? Math.min(
                          ...bids.map((b) => b.bidAmount)
                        ).toLocaleString()
                      : '0'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bids List */}
          {bids.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-white p-16 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Bids Yet
              </h3>
              <p className="text-gray-600">
                Wait for professionals to submit their bids for this trip.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {bids.map((bid) => (
                  <motion.div
                    key={bid.id}
                    variants={item}
                    layout
                    className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="p-6">
                      {/* Bidder Header */}
                      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Bidder Info */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary-200 sm:h-20 sm:w-20">
                              <Image
                                src={bid.bidder.avatar}
                                alt={bid.bidder.name}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {bid.bidder.isVerified && (
                              <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                {bid.bidder.name}
                              </h3>
                              {bid.bidder.isVerified && (
                                <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1">
                                  <Shield className="h-3 w-3 text-green-600" />
                                  <span className="text-xs font-semibold text-green-700">
                                    Verified
                                  </span>
                                </div>
                              )}
                            </div>

                            {renderStars(bid.bidder.rating)}

                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-primary-500" />
                                <span>
                                  {bid.bidder.totalTrips} trips completed
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-primary-500" />
                                <span>{bid.bidder.experience} experience</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bid Amount */}
                        <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-primary-600">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold">Bid Amount</span>
                          </div>
                          <p className="mt-1 text-2xl font-bold text-primary-700 sm:text-3xl">
                            ₹{bid.bidAmount.toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary-600">
                            <Clock className="h-3 w-3" />
                            <span>{bid.proposedDuration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bid Message */}
                      <div className="mb-6 rounded-xl bg-gray-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <MessageSquare className="h-4 w-4 text-primary-500" />
                          Message from Bidder
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {bid.message}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-6 flex items-center gap-2 rounded-xl bg-blue-50 p-3">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">
                          {bid.bidder.phoneNumber}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleViewProfile(bid.bidder.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50"
                        >
                          <User className="h-5 w-5" />
                          View Profile
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleAssignTrip(bid.id, bid.bidder.id)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Assign Trip
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </CompanyProtected>
  );
}
