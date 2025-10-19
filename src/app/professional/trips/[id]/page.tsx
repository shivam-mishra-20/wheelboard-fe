'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Truck,
  Phone,
  IndianRupee,
  MessageSquare,
  User,
  Building2,
  Package,
  Navigation,
} from 'lucide-react';
import { companyHomeData } from '@/lib/mockApi';
import Headers from '@/components/Header';

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  // Find trip from mock data
  const trip = companyHomeData.allTrips.find((t) => t.id === tripId);

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

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || !bidMessage) return;

    // Mock bid submission
    console.log('Bid submitted:', {
      tripId,
      amount: bidAmount,
      message: bidMessage,
    });

    setBidSubmitted(true);
    setTimeout(() => {
      setShowBidModal(false);
      setBidSubmitted(false);
      setBidAmount('');
      setBidMessage('');
    }, 2000);
  };

  const handleCallFleetOwner = () => {
    // Mock phone call
    window.location.href = 'tel:+919876543210';
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
              <h1 className="text-xl font-bold text-[#535353]">{trip.title}</h1>
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
            {/* Trip Image */}
            <div className="relative mb-6 h-64 overflow-hidden rounded-xl lg:h-96">
              <Image
                src={trip.image}
                alt={trip.title}
                fill
                className="object-cover"
              />
              <div className="absolute right-4 top-4 flex gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    trip.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : trip.status === 'In-Process'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {trip.status}
                </span>
                <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-[#f36969] backdrop-blur-sm">
                  {trip.deliveryType}
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
                      {trip.from} → {trip.to}
                    </p>
                    <p className="text-sm text-gray-500">
                      {trip.distance} • {trip.duration}
                    </p>
                  </div>
                </div>

                {/* Departure */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Calendar className="h-5 w-5 text-[#f36969]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="font-semibold text-[#535353]">
                      {trip.departureDate}
                    </p>
                    <p className="text-sm text-gray-500">
                      {trip.departureTime}
                    </p>
                  </div>
                </div>

                {trip.arrivalDate && trip.arrivalTime && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Clock className="h-5 w-5 text-[#f36969]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="font-semibold text-[#535353]">
                        {trip.arrivalDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        {trip.arrivalTime}
                      </p>
                    </div>
                  </div>
                )}

                {/* Vehicle */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Truck className="h-5 w-5 text-[#f36969]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-semibold text-[#535353]">
                      {trip.vehicle.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {trip.vehicle.registrationNumber}
                    </p>
                  </div>
                </div>

                {/* Driver */}
                {trip.driver && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-5 w-5 text-[#f36969]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Assigned Driver</p>
                      <p className="font-semibold text-[#535353]">
                        {trip.driver.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Delivery Type */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Package className="h-5 w-5 text-[#f36969]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Delivery Type</p>
                    <p className="font-semibold text-[#535353]">
                      {trip.deliveryType}
                    </p>
                  </div>
                </div>
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
                    {trip.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold text-[#535353]">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {trip.bids !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bids Received</span>
                    <span className="font-semibold text-[#f36969]">
                      {trip.bids} bids
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
              {trip.status === 'Upcoming' && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-[#535353]">
                    Interested in this trip?
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Submit your bid with your proposed amount and message to the
                    fleet owner.
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

              {/* Quick Stats */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-[#535353]">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-[#f36969]" />
                    <div>
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-semibold text-[#535353]">
                        {trip.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#f36969]" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-[#535353]">
                        {trip.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#535353]">
                    Proposed Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter your bid amount"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the amount you&apos;re willing to complete this trip
                    for
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#535353]">
                    Message to Fleet Owner
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      placeholder="Explain why you're the best choice for this trip..."
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Include your experience, reliability, and any special
                    equipment
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBidModal(false)}
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
    </div>
  );
}
