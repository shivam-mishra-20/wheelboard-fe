'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  Building2,
  Smartphone,
  DollarSign,
  Shield,
  TrendingUp,
  Info,
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

export default function TripAssignmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const driverId = searchParams.get('driverId');
  const tripId = searchParams.get('tripId');

  const [selectedPaymentOption, setSelectedPaymentOption] = useState<
    'bid' | 'platform' | 'total'
  >('total');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'upi' | 'netbanking'
  >('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!driverId || !tripId) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Invalid Request
            </h2>
            <p className="mt-2 text-gray-600">
              Missing driver or trip information
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="mt-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md"
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  const driver = getDriverById(driverId);
  const trips = companyHomeData.allTrips || [];
  const trip = trips.find((t: Trip) => t.id === tripId);

  if (!trip) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Trip Not Found</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="mt-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md"
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  // Calculate payment amounts (no booking fee)
  const bidAmount = 2500;
  const platformFee = bidAmount * 0.05; // 5% platform fee
  const totalAmount = bidAmount + platformFee;

  const getPaymentAmount = () => {
    switch (selectedPaymentOption) {
      case 'bid':
        return bidAmount;
      case 'platform':
        return platformFee;
      case 'total':
        return totalAmount;
      default:
        return totalAmount;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push(
      `/company/trips/assignment/success?driverId=${driverId}&tripId=${tripId}&amount=${getPaymentAmount()}&paymentOption=${selectedPaymentOption}&paymentMethod=${selectedPaymentMethod}`
    );
  };

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Assignment & Payment
            </h1>
            <p className="mt-2 text-gray-600">
              Review trip details and complete payment to assign driver
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Trip Overview
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Pickup Location
                      </p>
                      <p className="font-semibold text-gray-900">{trip.from}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Destination
                      </p>
                      <p className="font-semibold text-gray-900">{trip.to}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Date
                        </p>
                        <p className="font-semibold text-gray-900">
                          {trip.departureDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Time
                        </p>
                        <p className="font-semibold text-gray-900">
                          {trip.departureTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#f36969]/10 p-2">
                      <TrendingUp className="h-5 w-5 text-[#f36969]" />
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

                  <div className="mt-4 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] p-4 text-center">
                    <p className="text-sm text-white/80">Trip ID</p>
                    <p className="font-mono text-lg font-bold text-white">
                      {trip.id.toUpperCase()}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Assigned Driver
                </h2>

                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-[#f36969]/20">
                    <Image
                      src={driver.avatar}
                      alt={driver.name}
                      fill
                      className="object-cover"
                    />
                    {driver.isVerified && (
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {driver.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {driver.phoneNumber}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Select Payment Option
                </h2>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-[#f36969]/50 hover:bg-[#f36969]/5">
                    <div className="flex items-center gap-3">
                      <input
                        checked={selectedPaymentOption === 'bid'}
                        name="paymentOption"
                        onChange={() => setSelectedPaymentOption('bid')}
                        type="radio"
                        className="h-5 w-5 text-[#f36969]"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Bid Amount Only
                        </p>
                        <p className="text-sm text-gray-600">
                          Pay only the driver&apos;s bid amount
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#f36969]">
                        ₹{bidAmount}
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-[#f36969]/50 hover:bg-[#f36969]/5">
                    <div className="flex items-center gap-3">
                      <input
                        checked={selectedPaymentOption === 'platform'}
                        name="paymentOption"
                        onChange={() => setSelectedPaymentOption('platform')}
                        type="radio"
                        className="h-5 w-5 text-[#f36969]"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Platform Fee Only
                        </p>
                        <p className="text-sm text-gray-600">5% platform fee</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600">
                        ₹{platformFee.toFixed(2)}
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-[#f36969]/50 bg-[#f36969]/5 p-4 transition-all">
                    <div className="flex items-center gap-3">
                      <input
                        checked={selectedPaymentOption === 'total'}
                        name="paymentOption"
                        onChange={() => setSelectedPaymentOption('total')}
                        type="radio"
                        className="h-5 w-5 text-[#f36969]"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Total Amount (Recommended)
                        </p>
                        <p className="text-sm text-gray-600">
                          All fees included
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₹{totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-4">
                  <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <p className="text-sm text-gray-700">
                    Paying the total amount ensures seamless trip execution and
                    platform support.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-[#f36969]/50 hover:bg-[#f36969]/5">
                    <input
                      checked={selectedPaymentMethod === 'card'}
                      name="paymentMethod"
                      onChange={() => setSelectedPaymentMethod('card')}
                      type="radio"
                      className="h-5 w-5 text-[#f36969]"
                    />
                    <CreditCard className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Credit / Debit Card
                      </p>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, Amex
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-[#f36969]/50 hover:bg-[#f36969]/5">
                    <input
                      checked={selectedPaymentMethod === 'upi'}
                      name="paymentMethod"
                      onChange={() => setSelectedPaymentMethod('upi')}
                      type="radio"
                      className="h-5 w-5 text-[#f36969]"
                    />
                    <Smartphone className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">UPI</p>
                      <p className="text-sm text-gray-600">
                        Google Pay, PhonePe, Paytm
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-[#f36969]/50 hover:bg-[#f36969]/5">
                    <input
                      checked={selectedPaymentMethod === 'netbanking'}
                      name="paymentMethod"
                      onChange={() => setSelectedPaymentMethod('netbanking')}
                      type="radio"
                      className="h-5 w-5 text-[#f36969]"
                    />
                    <Building2 className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Net Banking</p>
                      <p className="text-sm text-gray-600">
                        All major banks supported
                      </p>
                    </div>
                  </label>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sticky top-24 rounded-3xl bg-gradient-to-br from-[#f36969] to-[#e85555] p-6 shadow-xl"
              >
                <h2 className="mb-6 text-xl font-bold text-white">
                  Payment Summary
                </h2>

                <div className="space-y-4">
                  <div className="space-y-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-white/90">
                      <span>Bid Amount</span>
                      <span className="font-semibold">₹{bidAmount}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/90">
                      <span>Platform Fee (5%)</span>
                      <span className="font-semibold">
                        ₹{platformFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-white">
                          ₹{totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-sm text-gray-600">
                      You&apos;re paying
                    </p>
                    <p className="text-3xl font-bold text-[#f36969]">
                      ₹{getPaymentAmount().toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedPaymentOption === 'bid' && 'Bid Amount'}
                      {selectedPaymentOption === 'platform' && 'Platform Fee'}
                      {selectedPaymentOption === 'total' && 'Total Amount'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-xl bg-white/10 p-3 text-white backdrop-blur-sm">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>

                  <motion.button
                    disabled={isProcessing}
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    onClick={handlePayment}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-[#f36969] shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#f36969] border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-5 w-5" />
                        Pay Now & Confirm
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-white/70">
                    By proceeding, you agree to our terms & conditions
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}
