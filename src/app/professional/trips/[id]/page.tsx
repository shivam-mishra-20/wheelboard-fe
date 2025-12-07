'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Truck,
  Phone,
  IndianRupee,
  MessageSquare,
  User,
  Building2,
  Play,
  Square,
  Loader2,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

interface TripDetails {
  tripId: string;
  tripCode: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
  payRange: string | null;
  tripStatus: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleModel: string;
  manufacturingYear: number;
  ownershipType: string;
  vehicleTypeName: string;
  driverId: string | null;
  driverName: string;
  driverContact: string;
  driverImagePath: string;
}

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tripStatus, setTripStatus] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch trip details
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setIsLoading(true);
        const response =
          await wheelboardApi.trip.getUnassignedTripDetails(tripId);
        console.log('✅ Trip Details Response:', response);

        const tripData = (response?.data || response) as TripDetails;
        setTrip(tripData);
        setTripStatus(tripData.tripStatus || 'Upcoming');
      } catch (error) {
        console.error('❌ Error fetching trip details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Get current user using api adapter
    const user = api.getCurrentUser();
    setCurrentUser(user);

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#f36969]" />
          <p className="text-lg font-semibold text-[#535353]">
            Loading trip details...
          </p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#535353]">
            Trip not found
          </h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-[#f36969] hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!currentUser?.id) {
      alert('Please log in to submit a bid');
      return;
    }

    try {
      // Call API to submit bid with exact parameters from API spec
      const response = await wheelboardApi.trip.submitBid({
        createdBy: currentUser.id,
        partnerId: 0,
        tripId: tripId,
        userId: currentUser.id,
        bidAmount: parseFloat(bidAmount),
        bidDescription: bidMessage,
      });

      console.log('✅ Bid submitted successfully:', response);

      // Check response status
      if (
        (response as any)?.status ||
        (response as any)?.message?.includes('success')
      ) {
        setBidSubmitted(true);
        setTimeout(() => {
          setShowBidModal(false);
          setBidSubmitted(false);
          setBidAmount('');
          setBidMessage('');
        }, 2000);
      } else {
        throw new Error(response?.message || 'Failed to submit bid');
      }
    } catch (error: any) {
      console.error('❌ Error submitting bid:', error);
      alert(error?.message || 'Failed to submit bid. Please try again.');
    }
  };

  const handleCallFleetOwner = () => {
    // Mock phone call
    window.location.href = 'tel:+919876543210';
  };

  const handleStartTrip = async () => {
    if (!currentUser?.id) return;

    try {
      setIsStarting(true);
      await wheelboardApi.trip.startTrip(tripId);

      setTripStatus('In-Process');
      setToastMessage('✅ Trip started successfully!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      console.log('✅ Trip started');
    } catch (error) {
      console.error('❌ Error starting trip:', error);
      alert('Failed to start trip. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndTrip = async () => {
    if (!currentUser?.id) return;

    const confirmed = window.confirm(
      'Are you sure you want to end this trip? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      setIsEnding(true);
      await wheelboardApi.trip.endTrip(tripId);

      setTripStatus('Completed');
      setToastMessage('✅ Trip completed successfully!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      console.log('✅ Trip ended');
    } catch (error) {
      console.error('❌ Error ending trip:', error);
      alert('Failed to end trip. Please try again.');
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Header */}
      <div className="sticky top-14 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-[#535353]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#535353]">
                {trip.tripCode}
              </h1>
              <p className="text-sm text-gray-500">Trip Details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 pt-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2">
            {/* Trip Status Banner */}
            <div className="mb-6 rounded-xl border-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">Trip Code</p>
                  <p className="text-2xl font-bold text-[#535353]">
                    {trip.tripCode}
                  </p>
                </div>
                <span
                  className={`rounded-xl px-6 py-3 text-sm font-semibold shadow-sm ${
                    tripStatus === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : tripStatus === 'In-Process'
                        ? 'bg-blue-100 text-blue-700'
                        : tripStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tripStatus}
                </span>
              </div>
            </div>

            {/* Trip Information */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-[#535353]">
                Trip Information
              </h2>

              <div className="space-y-4">
                {/* Route */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <MapPin className="h-5 w-5 text-[#f36969]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-semibold text-[#535353]">
                      {trip.pickupLocation} → {trip.deliveryLocation}
                    </p>
                  </div>
                </div>

                {/* Pickup Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Calendar className="h-5 w-5 text-[#f36969]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Pickup Date & Time</p>
                    <p className="font-semibold text-[#535353]">
                      {new Date(trip.pickupDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-500">{trip.pickupTime}</p>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Truck className="h-5 w-5 text-[#f36969]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-semibold text-[#535353]">
                      {trip.vehicleModel || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {trip.vehicleNumber} • {trip.manufacturingYear} •{' '}
                      {trip.ownershipType}
                    </p>
                  </div>
                </div>

                {/* Driver */}
                {trip.driverId && trip.driverName && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-5 w-5 text-[#f36969]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Assigned Driver</p>
                      <p className="font-semibold text-[#535353]">
                        {trip.driverName}
                      </p>
                      {trip.driverContact && (
                        <p className="text-sm text-gray-500">
                          {trip.driverContact}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                {trip.specialInstructions && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <MessageSquare className="h-5 w-5 text-[#f36969]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Special Instructions
                      </p>
                      <p className="font-semibold text-[#535353]">
                        {trip.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-[#535353]">
                Additional Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip ID</span>
                  <span className="font-semibold text-[#535353]">
                    {trip.tripId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip Status</span>
                  <span className="font-semibold text-[#535353]">
                    {trip.tripStatus}
                  </span>
                </div>
                {trip.payRange && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pay Range</span>
                    <span className="font-semibold text-[#f36969]">
                      {trip.payRange}
                    </span>
                  </div>
                )}
                {trip.vehicleTypeName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Type</span>
                    <span className="font-semibold text-[#535353]">
                      {trip.vehicleTypeName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 space-y-4">
              {/* Contact Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Building2 className="h-6 w-6 text-[#f36969]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fleet Owner</p>
                    <p className="font-semibold text-[#535353]">
                      Transport Company
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCallFleetOwner}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#f36969] bg-white px-4 py-3 font-semibold text-[#f36969] transition-colors hover:bg-[#f36969] hover:text-white"
                >
                  <Phone className="h-5 w-5" />
                  Call Fleet Owner
                </button>
              </div>

              {/* Bid Submission */}
              {(tripStatus === 'Upcoming' || tripStatus === 'Pending') &&
                !trip.driverId && (
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-[#535353]">
                      Interested in this trip?
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Submit your bid with your proposed amount and message to
                      the fleet owner.
                    </p>
                    <button
                      onClick={() => setShowBidModal(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f36969] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#f36565]"
                    >
                      <IndianRupee className="h-5 w-5" />
                      Submit Bid
                    </button>
                  </div>
                )}

              {/* Trip Control Buttons - For Assigned Trips */}
              {trip.driverId && tripStatus === 'Upcoming' && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-green-900">
                    Ready to Start?
                  </h3>
                  <p className="mb-4 text-sm text-green-700">
                    Click below to start tracking this trip. Make sure
                    you&apos;re at the pickup location.
                  </p>
                  <button
                    onClick={handleStartTrip}
                    disabled={isStarting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        Start Trip
                      </>
                    )}
                  </button>
                </div>
              )}

              {trip.driverId && tripStatus === 'In-Process' && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-blue-900">
                    Trip in Progress
                  </h3>
                  <p className="mb-4 text-sm text-blue-700">
                    Complete the delivery and click below to end the trip.
                  </p>
                  <button
                    onClick={handleEndTrip}
                    disabled={isEnding}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isEnding ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Ending...
                      </>
                    ) : (
                      <>
                        <Square className="h-5 w-5" />
                        End Trip
                      </>
                    )}
                  </button>
                </div>
              )}

              {trip.driverId && tripStatus === 'Completed' && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Trip Completed
                  </h3>
                  <p className="text-sm text-gray-600">
                    This trip has been successfully completed. Thank you for
                    your service!
                  </p>
                </div>
              )}

              {/* Pay Range Card */}
              {trip.payRange && (
                <div className="rounded-xl border-2 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <h3 className="mb-3 text-lg font-semibold text-green-900">
                    Pay Range
                  </h3>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-6 w-6 text-green-600" />
                    <p className="text-2xl font-bold text-green-700">
                      {trip.payRange}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-green-700">
                    Estimated payment for this trip
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Submission Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#535353]">
                Submit Your Bid
              </h2>
              <button
                onClick={() => setShowBidModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {bidSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#535353]">
                  Bid Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-500">
                  The fleet owner will review your bid and contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-4">
                {/* CreatedBy - Hidden field, auto-filled */}
                <input type="hidden" value={currentUser?.id || ''} />

                {/* PartnerId - Hidden field, set to 0 */}
                <input type="hidden" value="0" />

                {/* TripId - Hidden field, auto-filled */}
                <input type="hidden" value={tripId} />

                {/* UserId - Hidden field, auto-filled */}
                <input type="hidden" value={currentUser?.id || ''} />

                {/* BidAmount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#535353]">
                    Bid Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your proposed amount for this trip
                  </p>
                </div>

                {/* BidDescription */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#535353]">
                    Bid Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="string"
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Provide details about your bid and why you&apos;re the best
                    choice
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBidModal(false);
                      setBidAmount('');
                      setBidMessage('');
                    }}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 font-semibold text-[#535353] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-[#f36969] px-4 py-3 font-semibold text-white hover:bg-[#f36565]"
                  >
                    Submit Bid
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="animate-slide-up fixed bottom-6 right-6 z-50">
          <div className="rounded-xl bg-gray-900 px-6 py-4 text-white shadow-xl">
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
