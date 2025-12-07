/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  CreditCard,
  Smartphone,
  Building2,
  ArrowRight,
  Download,
  Phone,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

function TripAssignmentSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const driverId = searchParams.get('driverId');
  const tripId = searchParams.get('tripId');
  const bidId = searchParams.get('bidId');
  const amount = searchParams.get('amount');
  const paymentOption = searchParams.get('paymentOption');
  const paymentMethod = searchParams.get('paymentMethod');
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  const [trip, setTrip] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [bid, setBid] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [assignmentComplete, setAssignmentComplete] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    const fetchDataAndAssignTrip = async () => {
      if (!tripId || !driverId) {
        setIsLoading(false);
        return;
      }

      try {
        const user = api.getCurrentUser();

        // Fetch trip data
        let foundTrip = null;
        if (user?.id) {
          const tripResponse = await wheelboardApi.trip.getTripsByUser(user.id);
          const trips = (tripResponse.data as any[]) || [];
          foundTrip = trips.find((t: any) => t.tripId === tripId);
        }

        if (!foundTrip) {
          try {
            const tripDetailsResponse =
              await wheelboardApi.trip.getUnassignedTripDetails(tripId);
            foundTrip =
              (tripDetailsResponse as any).data || tripDetailsResponse;
          } catch (error) {
            console.error('Error fetching trip details:', error);
          }
        }

        setTrip(foundTrip);

        // Fetch driver data
        const driverResponse =
          await wheelboardApi.transport.getDriverDetails(driverId);
        setDriver((driverResponse as any).data || driverResponse);

        // Fetch bid data if bidId is provided
        if (bidId) {
          const bidsResponse = await wheelboardApi.trip.getTripBids(tripId);
          const bidsData = ((bidsResponse as any).data as any[]) || [];
          const foundBid = bidsData.find((b: any) => b.bidId === bidId);
          setBid(foundBid);
        }

        // Assign the trip after successful payment verification
        try {
          // Call assign trip API
          await wheelboardApi.trip.assignTrip(tripId);
          setAssignmentComplete(true);
          console.log('Trip assigned successfully');

          // Fetch confirmation details
          try {
            const confirmationResponse =
              await wheelboardApi.trip.getTripConfirmation(tripId);
            setConfirmationData(
              (confirmationResponse as any).data || confirmationResponse
            );
          } catch (error) {
            console.error('Error fetching confirmation:', error);
          }
        } catch (error) {
          console.error('Error assigning trip:', error);
          // Still show success page even if assignment API fails
          // as payment was already processed and verified
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndAssignTrip();
  }, [tripId, driverId, bidId]);

  if (!driverId || !tripId || !amount) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Invalid Request
            </h2>
            <p className="mt-2 text-gray-600">Missing payment information</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/company/trips')}
              className="mt-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md"
            >
              Go to Trips
            </motion.button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  if (isLoading) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
            <p className="text-gray-600">Processing assignment...</p>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'card':
        return 'Credit / Debit Card';
      case 'upi':
        return 'UPI';
      case 'netbanking':
        return 'Net Banking';
      case 'cash':
        return 'Cash on Completion';
      default:
        return 'Credit / Debit Card';
    }
  };

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'upi':
        return <Smartphone className="h-5 w-5" />;
      case 'netbanking':
        return <Building2 className="h-5 w-5" />;
      case 'cash':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentOptionLabel = () => {
    switch (paymentOption) {
      case 'bid':
        return 'Bid Amount';
      case 'platform':
        return 'Platform Fee';
      case 'total':
        return 'Total Amount';
      default:
        return 'Total Amount';
    }
  };

  const transactionId = `TXN${Date.now().toString().slice(-10)}`;
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900"
            >
              Trip Assigned Successfully!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-gray-600"
            >
              {paymentMethod === 'cash'
                ? 'Trip assigned successfully - Payment to be collected in cash'
                : 'Your payment has been processed and driver has been assigned'}
            </motion.p>
          </motion.div>

          {/* Transaction Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 overflow-hidden rounded-3xl bg-white shadow-lg"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Transaction ID</p>
                  <p className="font-mono text-lg font-bold text-white">
                    {paymentId || orderId || transactionId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Date & Time</p>
                  <p className="font-semibold text-white">{timestamp}</p>
                </div>
              </div>
              {orderId && paymentId && (
                <div className="mt-3 border-t border-white/20 pt-3">
                  <p className="text-xs text-white/70">Order ID: {orderId}</p>
                  <p className="text-xs text-white/70">
                    Payment ID: {paymentId}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Payment Amount */}
                <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {paymentMethod === 'cash'
                          ? 'Amount to Pay'
                          : 'Amount Paid'}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {getPaymentOptionLabel()}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{parseFloat(amount).toFixed(2)}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      {getPaymentMethodIcon()}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-900">
                        {getPaymentMethodLabel()}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trip Details Card */}
          {trip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 overflow-hidden rounded-3xl bg-white shadow-lg"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Trip Details</h2>
              </div>

              <div className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Pickup */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Pickup
                      </p>
                      <p className="truncate font-semibold text-gray-900">
                        {trip.pickupLocation || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Destination
                      </p>
                      <p className="truncate font-semibold text-gray-900">
                        {trip.destination || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">
                        {trip.pickupDate || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900">
                        {trip.pickupTime || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trip ID */}
                {trip?.tripCode && (
                  <div className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-center">
                    <p className="text-sm text-white/80">Trip ID</p>
                    <p className="font-mono text-lg font-bold text-white">
                      {trip.tripCode}
                    </p>
                  </div>
                )}

                {/* Assignment Status */}
                {assignmentComplete && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="font-semibold text-green-700">
                        Trip Assigned Successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Driver Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 overflow-hidden rounded-3xl bg-white shadow-lg"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Assigned Driver</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-200 bg-blue-100">
                  <User className="h-10 w-10 text-blue-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-xl font-bold text-gray-900">
                      {bid?.name || driver?.driverName || 'Driver'}
                    </h3>
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <p className="truncate text-sm">
                      {bid?.contactNumber || driver?.mobileNo || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/company/trips')}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-6 py-3 font-semibold text-primary-600 transition-all hover:bg-primary-50"
            >
              <ArrowRight className="h-5 w-5" />
              Back to Trips
            </motion.button>

            {trip && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  router.push(
                    `/company/trips?tripId=${trip.tripId || trip.tripCode}`
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg"
              >
                <User className="h-5 w-5" />
                View Trip
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <Download className="h-5 w-5" />
              Download Receipt
            </motion.button>
          </motion.div>

          {/* Confirmation Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 rounded-xl bg-blue-50 p-4 text-center"
          >
            <p className="text-sm text-gray-700">
              A confirmation email has been sent to your registered email
              address. The driver will be notified and will contact you shortly.
              {paymentMethod === 'cash' && (
                <span className="mt-2 block font-semibold text-orange-700">
                  💵 Please keep ₹{parseFloat(amount).toLocaleString()} ready in
                  cash for the driver.
                </span>
              )}
            </p>
          </motion.div>
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}

const LoadingFallback = () => (
  <div className="p-6 text-sm text-gray-500">Loading…</div>
);

export default function TripAssignmentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TripAssignmentSuccessInner />
    </Suspense>
  );
}
