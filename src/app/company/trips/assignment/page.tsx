/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Shield,
  User,
  Phone,
  CreditCard,
  Smartphone,
  Building2,
  DollarSign,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

function TripAssignmentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const driverId = searchParams.get('driverId');
  const tripId = searchParams.get('tripId');
  const bidId = searchParams.get('bidId');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'upi' | 'netbanking' | 'cash'
  >('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [trip, setTrip] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [bid, setBid] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tripId, driverId, bidId]);

  const bidAmount = bid?.bidAmount || 0;
  const platformFee = bidAmount * 0.05;
  const totalAmount = bidAmount + platformFee;

  const handlePayment = async () => {
    if (!tripId || !bidId) {
      alert('Missing trip or bid information');
      return;
    }

    setIsProcessing(true);
    try {
      const user = api.getCurrentUser();
      if (!user?.id) {
        alert('Please log in to continue');
        setIsProcessing(false);
        return;
      }

      // Handle CASH payment separately
      if (selectedPaymentMethod === 'cash') {
        // For cash payment, skip Razorpay and go directly to success
        // Payment will be collected in person
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push(
          `/company/trips/assignment/success?driverId=${driverId}&tripId=${tripId}&bidId=${bidId}&amount=${totalAmount}&paymentMethod=cash`
        );
        return;
      }

      // Step 1: Create Razorpay order
      const orderResponse = await wheelboardApi.trip.createPaymentOrder({
        totalAmount: totalAmount,
      });

      const orderData = (orderResponse as any).data || orderResponse;
      const orderId = orderData.orderId || orderData.id;

      if (!orderId) {
        throw new Error('Failed to create payment order');
      }

      // Step 2: Initialize Razorpay checkout (if Razorpay is loaded)
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: totalAmount * 100, // Convert to paise
          currency: 'INR',
          name: 'WheelBoard',
          description: `Trip Assignment - ${trip?.tripCode || tripId}`,
          order_id: orderId,
          handler: async function (response: any) {
            try {
              // Step 3: Verify payment
              const verifyResponse = await wheelboardApi.trip.verifyPayment({
                tripId: tripId,
                bidId: bidId,
                userId: user.id,
                amount: bidAmount,
                platformFee: platformFee,
                totalAmount: totalAmount,
                orderId: orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              // Payment verified, redirect to success page
              router.push(
                `/company/trips/assignment/success?driverId=${driverId}&tripId=${tripId}&bidId=${bidId}&amount=${totalAmount}&paymentMethod=${selectedPaymentMethod}&orderId=${orderId}&paymentId=${response.razorpay_payment_id}`
              );
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user.name || '',
            email: user.email || '',
            contact: (user as any).phone || (user as any).mobileNo || '',
          },
          theme: {
            color: '#3B82F6',
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        // Fallback: Direct payment simulation for testing
        console.warn('Razorpay not loaded, using simulation');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push(
          `/company/trips/assignment/success?driverId=${driverId}&tripId=${tripId}&bidId=${bidId}&amount=${totalAmount}&paymentMethod=${selectedPaymentMethod}`
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

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

  if (isLoading || !driver || !trip) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
            <p className="text-gray-600">Loading assignment details...</p>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 py-6 pt-20 font-poppins">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Trip Assignment
              </h1>
              <p className="text-sm text-gray-500">
                Review and confirm assignment
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Trip Details Card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="font-semibold text-gray-900">Trip Details</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Pickup
                      </p>
                      <p className="truncate font-medium text-gray-900">
                        {trip?.pickupLocation || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-red-50 p-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Destination
                      </p>
                      <p className="truncate font-medium text-gray-900">
                        {trip?.destination || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {trip?.pickupDate || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-purple-50 p-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">
                        {trip?.pickupTime || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {trip?.tripCode && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">Trip ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {trip.tripCode}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Driver Details Card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="font-semibold text-gray-900">Assigned Driver</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-gray-900">
                        {bid?.name || driver?.driverName || 'Driver'}
                      </h3>
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="truncate">
                        {bid?.contactNumber || driver?.mobileNo || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="font-semibold text-gray-900">Payment Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bid Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₹{bidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platform Fee (5%)</span>
                    <span className="font-semibold text-gray-900">
                      ₹{platformFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="font-semibold text-gray-900">Payment Method</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${selectedPaymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={selectedPaymentMethod === 'card'}
                      onChange={(e) =>
                        setSelectedPaymentMethod(e.target.value as any)
                      }
                      className="h-4 w-4 text-primary-600"
                    />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Card
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${selectedPaymentMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={selectedPaymentMethod === 'upi'}
                      onChange={(e) =>
                        setSelectedPaymentMethod(e.target.value as any)
                      }
                      className="h-4 w-4 text-primary-600"
                    />
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      UPI
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${selectedPaymentMethod === 'netbanking' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={selectedPaymentMethod === 'netbanking'}
                      onChange={(e) =>
                        setSelectedPaymentMethod(e.target.value as any)
                      }
                      className="h-4 w-4 text-primary-600"
                    />
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Banking
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${selectedPaymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={selectedPaymentMethod === 'cash'}
                      onChange={(e) =>
                        setSelectedPaymentMethod(e.target.value as any)
                      }
                      className="h-4 w-4 text-primary-600"
                    />
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Cash
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pb-6">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Confirm & Pay ₹{totalAmount.toLocaleString()}
                  </>
                )}
              </button>

              {selectedPaymentMethod === 'cash' ? (
                <p className="text-center text-xs text-gray-500">
                  💵 Payment will be collected in cash upon trip completion
                </p>
              ) : (
                <p className="text-center text-xs text-gray-500">
                  <Shield className="mr-1 inline h-3 w-3" />
                  Secure payment powered by industry-standard encryption
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </CompanyProtected>
  );
}

const LoadingFallback = () => (
  <div className="p-6 text-sm text-gray-500">Loading…</div>
);

export default function TripAssignmentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TripAssignmentInner />
    </Suspense>
  );
}
