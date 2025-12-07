'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Shield,
  Phone,
  User,
  Clock,
  DollarSign,
  MessageSquare,
  Award,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { wheelboardApi } from '@/lib/wheelboardApi';
import type { TripBid } from '@/types/api';

function TripBidsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get('tripId');

  const [bids, setBids] = useState<TripBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      if (tripId) {
        try {
          setIsLoading(true);
          const response = await wheelboardApi.trip.getTripBids(tripId);
          console.log('Bids API Response:', response);
          console.log('Response type:', typeof response);
          console.log('Is Array?:', Array.isArray(response));
          console.log('Has data?:', (response as any)?.data);

          // Handle both response structures: {data: [...]} or direct array
          let bidsData: any[] = [];
          if (Array.isArray(response)) {
            bidsData = response;
            console.log('Using direct array');
          } else if (
            (response as any).data &&
            Array.isArray((response as any).data)
          ) {
            bidsData = (response as any).data;
            console.log('Using response.data');
          } else {
            console.log('No valid data structure found');
          }

          console.log('Bids Data:', bidsData);
          console.log('Bids Count:', bidsData.length);
          console.log('Setting bids state...');
          setBids(bidsData);
          console.log('Bids state set');
        } catch (error) {
          console.error('Error fetching bids:', error);
          setBids([]);
        } finally {
          console.log('Setting isLoading to false');
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, [tripId]);

  const handleAssignTrip = (bidId: string, driverId: string) => {
    // Navigate to payment page with driver and trip info
    router.push(
      `/company/trips/assignment?driverId=${driverId}&tripId=${tripId}&bidId=${bidId}`
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

  console.log(
    'Component render - isLoading:',
    isLoading,
    'bids:',
    bids,
    'bids.length:',
    bids.length
  );

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
                          ...bids.map((b) => (b as any).bidAmount)
                        ).toLocaleString()
                      : '0'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bids List */}
          {(() => {
            console.log(
              'Render check - isLoading:',
              isLoading,
              'bids.length:',
              bids.length,
              'Should show bids?',
              !isLoading && bids.length > 0
            );
            return null;
          })()}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-white p-16 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Loading Bids...
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch the bids for this trip.
              </p>
            </motion.div>
          ) : bids.length === 0 ? (
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
            <div className="space-y-6">
              {bids.map((bid) => {
                console.log('Rendering bid:', bid);
                return (
                  <div
                    key={(bid as any).bidId}
                    className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="p-6">
                      {/* Bidder Header */}
                      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Bidder Info */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary-200 bg-primary-100 sm:h-20 sm:w-20">
                              <div className="flex h-full w-full items-center justify-center">
                                <User className="h-8 w-8 text-primary-600 sm:h-10 sm:w-10" />
                              </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                {(bid as any).name}
                              </h3>
                              <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1">
                                <Shield className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-semibold text-green-700">
                                  Verified
                                </span>
                              </div>
                            </div>

                            {renderStars(4.5)}

                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4 text-primary-500" />
                                <span>{(bid as any).contactNumber}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-primary-500" />
                                <span>
                                  {new Date(
                                    (bid as any).dateEntered
                                  ).toLocaleDateString()}
                                </span>
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
                            ₹{(bid as any).bidAmount.toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary-600">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(
                                (bid as any).dateEntered
                              ).toLocaleString()}
                            </span>
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
                          {(bid as any).bidDescription || 'No message provided'}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-6 flex items-center gap-2 rounded-xl bg-blue-50 p-3">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">
                          {(bid as any).contactNumber}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleViewProfile((bid as any).driverId)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50"
                        >
                          <User className="h-5 w-5" />
                          View Profile
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleAssignTrip(
                              (bid as any).bidId,
                              (bid as any).driverId
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Assign Trip
                        </motion.button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </CompanyProtected>
  );
}

const LoadingFallback = () => (
  <div className="p-6 text-sm text-gray-500">Loading…</div>
);

export default function TripBidsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TripBidsInner />
    </Suspense>
  );
}
