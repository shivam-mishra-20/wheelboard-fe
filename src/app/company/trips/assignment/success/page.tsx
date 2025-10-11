'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  TrendingUp,
  Star,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { companyHomeData, type Trip } from '@/lib/mockApi';

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
  };
};

function TripAssignmentSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const driverId = searchParams.get('driverId');
  const tripId = searchParams.get('tripId');
  const amount = searchParams.get('amount');
  const paymentOption = searchParams.get('paymentOption');
  const paymentMethod = searchParams.get('paymentMethod');

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

  const driver = getDriverById(driverId);
  const trips = companyHomeData.allTrips || [];
  const trip = trips.find((t: Trip) => t.id === tripId);

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'card':
        return 'Credit / Debit Card';
      case 'upi':
        return 'UPI';
      case 'netbanking':
        return 'Net Banking';
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
              Your payment has been processed and driver has been assigned
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
                    {transactionId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Date & Time</p>
                  <p className="font-semibold text-white">{timestamp}</p>
                </div>
              </div>
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
                      <p className="text-sm text-gray-600">Amount Paid</p>
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
                  {/* From */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">From</p>
                      <p className="font-semibold text-gray-900">{trip.from}</p>
                    </div>
                  </div>

                  {/* To */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">To</p>
                      <p className="font-semibold text-gray-900">{trip.to}</p>
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
                        {trip.departureDate}
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
                        {trip.departureTime}
                      </p>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-orange-100 p-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Distance
                      </p>
                      <p className="font-semibold text-gray-900">
                        {trip.distance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trip ID */}
                <div className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-center">
                  <p className="text-sm text-white/80">Trip ID</p>
                  <p className="font-mono text-lg font-bold text-white">
                    {trip.id.toUpperCase()}
                  </p>
                </div>
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
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-blue-100">
                  <Image
                    alt={driver.name}
                    fill
                    src={driver.avatar}
                    className="object-cover"
                  />
                  {driver.isVerified && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {driver.name}
                  </h3>
                  <p className="text-sm text-gray-600">{driver.phoneNumber}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-700">
                        {driver.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {driver.totalTrips} trips
                    </div>
                    <div className="text-sm text-gray-600">
                      {driver.experience}
                    </div>
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
                onClick={() => router.push(`/company/trips?tripId=${trip.id}`)}
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
