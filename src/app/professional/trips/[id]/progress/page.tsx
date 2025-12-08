'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Clock,
  Loader2,
  MapIcon,
  MapPin,
  MessageSquare,
  Minus,
  Navigation,
  Phone,
  PhoneCall,
  Plus,
  RefreshCw,
  Route,
  Star,
  Truck,
  User,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';
//import { api } from '@/lib/apiAdapter';

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
  vehicleTypeName: string;
  driverId: string | null;
  driverName: string;
  driverContact: string;
  driverImagePath: string;
}

export default function TripProgressPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [isDriverInfoOpen, setIsDriverInfoOpen] = useState(false);
  const [showLiveLocation, setShowLiveLocation] = useState(false);
  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch trip details
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setIsLoading(true);
        const response =
          await wheelboardApi.trip.getUnassignedTripDetails(tripId);
        console.log('✅ Trip Progress - Trip Details Response:', response);

        const tripData = (response?.data || response) as TripDetails;
        setTrip(tripData);

        // Check if trip is already in progress
        if (tripData.tripStatus === 'Inprogress') {
          setShowLiveLocation(true);
        }
      } catch (error) {
        console.error('❌ Error fetching trip details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Get current user
    //const user = api.getCurrentUser();

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#f36969]" />
          <p className="text-lg font-semibold text-[#535353]">
            Loading trip progress...
          </p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response =
        await wheelboardApi.trip.getUnassignedTripDetails(tripId);
      const tripData = (response?.data || response) as TripDetails;
      setTrip(tripData);

      if (tripData.tripStatus === 'Inprogress') {
        setShowLiveLocation(true);
      }
    } catch (error) {
      console.error('Error refreshing trip:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Inprogress':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Assigned':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'Inprogress') return 'In Progress';
    return status;
  };

  // Only show this page for Inprogress trips
  if (trip.tripStatus !== 'Inprogress') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <h2 className="text-xl font-semibold text-[#535353]">
            This trip is not in progress
          </h2>
          <p className="mt-2 text-gray-500">Trip Status: {trip.tripStatus}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-xl bg-[#f36969] px-6 py-2 text-white hover:bg-[#e05858]"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 pt-20">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md lg:h-12 lg:w-12"
            >
              <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#535353] lg:text-3xl">
                Trip Progress
              </h1>
              <p className="text-sm text-gray-500 lg:text-base">
                Real-time tracking
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md lg:h-12 lg:w-12"
          >
            <RefreshCw
              className={`h-5 w-5 lg:h-6 lg:w-6 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {/* Status Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-lg shadow-[#f36969]/30 lg:h-14 lg:w-14">
              <Truck className="h-6 w-6 text-white lg:h-7 lg:w-7" />
            </div>
            <div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold lg:text-sm ${getStatusColor(trip.tripStatus)}`}
              >
                {getStatusLabel(trip.tripStatus)}
              </span>
              <p className="mt-1 text-sm text-gray-500 lg:text-base">
                {trip.vehicleTypeName || 'Transport Service'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 lg:text-sm">Trip Code</p>
            <p className="text-sm font-bold text-[#535353] lg:text-base">
              {trip.tripCode}
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Map Section - Takes up most of the space */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-sm">
              {/* Simulated Map - In a real app, this would be a map component */}
              <div className="relative h-[400px] w-full bg-gray-100 lg:h-[500px]">
                {/* Placeholder for map - would be replaced with actual map component */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#e9ecef]">
                  <div className="text-center">
                    {showLiveLocation || trip.tripStatus === 'Inprogress' ? (
                      <div className="flex flex-col items-center justify-center">
                        <MapIcon className="mb-4 h-16 w-16 animate-pulse text-[#f36969]" />
                        <p className="text-lg font-bold text-[#535353]">
                          Live Tracking Active
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Real-time location tracking enabled
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {trip.pickupLocation} → {trip.deliveryLocation}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Pickup:{' '}
                          {new Date(trip.pickupDate).toLocaleDateString()} at{' '}
                          {trip.pickupTime}
                        </p>
                        <div className="mt-4 rounded-lg bg-yellow-100 px-4 py-2">
                          <p className="text-sm font-semibold text-yellow-800">
                            📍 Google Maps Integration
                          </p>
                          <p className="mt-1 text-xs text-yellow-700">
                            To enable real-time GPS tracking, integrate Google
                            Maps API with geolocation updates
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <MapIcon className="mb-4 h-16 w-16 text-gray-400" />
                        <p className="text-lg font-bold text-[#535353]">
                          Route Preview
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {trip.pickupLocation} → {trip.deliveryLocation}
                        </p>
                        <p className="mt-4 text-xs text-gray-400">
                          Start trip to activate live GPS tracking
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Markers for origin and destination */}
                <div className="absolute left-[20%] top-[25%] h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <div className="absolute bottom-[25%] right-[20%] h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-lg shadow-green-500/50"></div>

                {/* Current position marker - only shown when trip is in progress */}
                {(showLiveLocation || trip.tripStatus === 'Inprogress') && (
                  <div className="absolute left-[45%] top-[40%] animate-pulse">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#f36969] shadow-lg shadow-[#f36969]/50">
                      <Navigation className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}

                {/* Route line simulation */}
                <div className="pointer-events-none absolute bottom-[27%] left-[22%] right-[22%] top-[27%]">
                  <svg className="h-full w-full">
                    <path
                      d="M 0,30 Q 50,10 100,50 T 200,90"
                      fill="none"
                      stroke="#f36969"
                      strokeWidth="3"
                      strokeDasharray="8 4"
                      className="h-full w-full"
                      style={{
                        strokeDashoffset:
                          showLiveLocation || trip.tripStatus === 'Inprogress'
                            ? '100'
                            : '0',
                        animation:
                          showLiveLocation || trip.tripStatus === 'Inprogress'
                            ? 'dash 15s linear infinite'
                            : 'none',
                      }}
                    />
                  </svg>
                </div>
              </div>

              {/* Map Controls */}
              <div className="flex items-center justify-between border-t border-gray-100 p-4">
                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Plus className="h-5 w-5" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Minus className="h-5 w-5" />
                  </button>
                </div>
                <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f36969] px-4 text-white hover:bg-[#e45858]">
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm font-medium">Recenter</span>
                </button>
              </div>
            </div>

            {/* Trip Details Section - Collapsible */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => setIsTripDetailsOpen(!isTripDetailsOpen)}
              >
                <div className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-[#f36969]" />
                  <h3 className="text-lg font-bold text-[#535353]">
                    Trip Details
                  </h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${isTripDetailsOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Collapsible content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isTripDetailsOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="border-t border-gray-100 p-4 pt-0">
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Origin */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-md shadow-blue-500/30">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">
                          Pickup Location
                        </p>
                        <h4 className="text-sm font-bold text-[#535353]">
                          {trip.pickupLocation}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(trip.pickupDate).toLocaleDateString()} •{' '}
                          {trip.pickupTime}
                        </p>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-500 shadow-md shadow-green-500/30">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">
                          Delivery Location
                        </p>
                        <h4 className="text-sm font-bold text-[#535353]">
                          {trip.deliveryLocation}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Estimated delivery
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Grid */}
                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="mt-1 text-sm font-bold text-[#535353]">
                        {trip.vehicleNumber}
                      </p>
                      <p className="text-xs text-gray-600">
                        {trip.vehicleModel || trip.vehicleTypeName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Driver</p>
                      <p className="mt-1 text-sm font-bold text-[#535353]">
                        {trip.driverName || 'You'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {trip.driverContact || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <p className="mt-1 text-sm font-bold text-green-600">
                        ₹{trip.payRange || '0'}
                      </p>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {trip.specialInstructions && (
                    <div className="mt-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-3">
                      <p className="text-xs font-semibold text-yellow-700">
                        Special Instructions:
                      </p>
                      <p className="mt-1 text-sm text-yellow-600">
                        {trip.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Note: Progress tracking would require additional API endpoints for real-time updates */}
          </div>

          {/* Right Column - Info Cards & Actions */}
          <div className="space-y-6 lg:col-span-2">
            {/* Driver & Vehicle Info - Collapsible */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => setIsDriverInfoOpen(!isDriverInfoOpen)}
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#f36969]" />
                  <h3 className="text-lg font-bold text-[#535353]">
                    Driver & Vehicle
                  </h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${isDriverInfoOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Collapsible content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isDriverInfoOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="border-t border-gray-100 p-4 pt-0">
                  {/* Driver Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-2xl font-bold text-gray-700">
                        {trip.driverName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-[#535353]">
                          {trip.driverName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Professional Driver
                        </p>
                        <div className="mt-2 flex items-center">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <Star className="h-4 w-4 text-gray-300" />
                          <span className="ml-1 text-xs text-gray-500">
                            4.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-[#f36969]" />
                      <h3 className="text-base font-bold text-[#535353]">
                        Vehicle
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Model</p>
                        <p className="text-sm font-semibold text-[#535353]">
                          {trip.vehicleTypeName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Registration</p>
                        <p className="font-mono text-sm font-semibold text-[#535353]">
                          {trip.vehicleNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Schedule */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#f36969]" />
                <h3 className="text-lg font-bold text-[#535353]">Schedule</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pickup Date</span>
                  <span className="font-semibold text-[#535353]">
                    {new Date(trip.pickupDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pickup Time</span>
                  <span className="font-semibold text-[#535353]">
                    {trip.pickupTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Trip is in progress - show status */}
              <div className="rounded-xl border-2 border-green-500 bg-green-50 p-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Truck className="h-5 w-5" />
                  <span className="font-bold">Trip In Progress</span>
                </div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-4 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40">
                <Phone className="h-5 w-5" />
                Contact Driver
              </button>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#f36969] bg-white py-4 font-semibold text-[#f36969] transition-all hover:bg-[#f36969]/5">
                <MessageSquare className="h-5 w-5" />
                Send Message
              </button>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-bold text-red-700">
                  Emergency Contact
                </h3>
              </div>
              <p className="mb-4 text-sm text-red-700">
                For urgent assistance or emergencies related to this trip:
              </p>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-4 font-semibold text-white transition-all hover:bg-red-600">
                <PhoneCall className="h-5 w-5" />
                Call Emergency Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animated route path */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
