'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
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
  Play,
  Plus,
  RefreshCw,
  Route,
  Star,
  TrendingUp,
  Truck,
  User,
} from 'lucide-react';
import { companyHomeData } from '@/lib/mockApi';
import Headers from '@/components/Header';

export default function TripProgressPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [isDriverInfoOpen, setIsDriverInfoOpen] = useState(false);
  const [isStartingTrip, setIsStartingTrip] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);
  const [showLiveLocation, setShowLiveLocation] = useState(false);

  // Find trip from mock data
  const trip = companyHomeData.allTrips.find((t) => t.id === tripId);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleStartTrip = () => {
    setIsStartingTrip(true);
    // Simulate API call to start the trip
    setTimeout(() => {
      setIsStartingTrip(false);
      setTripStarted(true);
      setShowLiveLocation(true);
      // In a real app, this would update the backend and change trip status to In-Process
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In-Process':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'In-Process') return 'In Progress';
    return status;
  };

  const isAssigned = trip.isAssigned && trip.status === 'Upcoming';
  //const isInProgress = trip.status === 'In-Process' || tripStarted;

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
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold lg:text-sm ${getStatusColor(trip.status)}`}
              >
                {tripStarted ? 'In Progress' : getStatusLabel(trip.status)}
              </span>
              <p className="mt-1 text-sm text-gray-500 lg:text-base">
                {(trip.status === 'In-Process' || tripStarted) && trip.progress
                  ? `${trip.progress}% Complete`
                  : trip.deliveryType}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 lg:text-sm">Trip ID</p>
            <p className="text-sm font-bold text-[#535353] lg:text-base">
              {trip.id.toUpperCase()}
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
                    {showLiveLocation || trip.status === 'In-Process' ? (
                      <div className="flex flex-col items-center justify-center">
                        <MapIcon className="mb-4 h-16 w-16 animate-pulse text-[#f36969]" />
                        <p className="text-lg font-bold text-[#535353]">
                          Live Tracking Active
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Showing real-time location
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <MapIcon className="mb-4 h-16 w-16 text-gray-400" />
                        <p className="text-lg font-bold text-[#535353]">
                          Map Preview
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Start trip to activate live tracking
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Markers for origin and destination */}
                <div className="absolute left-[20%] top-[25%] h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <div className="absolute bottom-[25%] right-[20%] h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-lg shadow-green-500/50"></div>

                {/* Current position marker - only shown when trip is in progress */}
                {(showLiveLocation || trip.status === 'In-Process') && (
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
                          showLiveLocation || trip.status === 'In-Process'
                            ? '100'
                            : '0',
                        animation:
                          showLiveLocation || trip.status === 'In-Process'
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
                          Origin
                        </p>
                        <h4 className="text-sm font-bold text-[#535353]">
                          {trip.from}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Warehouse A, 123 Main St
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
                          Destination
                        </p>
                        <h4 className="text-sm font-bold text-[#535353]">
                          {trip.to}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Distribution Center, 456 Oak Ave
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* ETA */}
                    {trip.eta && (
                      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500">ETA</p>
                        <p className="text-sm font-bold text-[#535353]">
                          {trip.eta}
                        </p>
                      </div>
                    )}

                    {/* Distance Left */}
                    {(trip.status === 'In-Process' || tripStarted) &&
                      trip.progress && (
                        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                            <TrendingUp className="h-4 w-4 text-[#f36969]" />
                          </div>
                          <p className="text-xs text-gray-500">Distance Left</p>
                          <p className="text-sm font-bold text-[#535353]">
                            {Math.floor(
                              (parseInt(trip.distance) *
                                (100 - trip.progress)) /
                                100
                            )}{' '}
                            mi
                          </p>
                        </div>
                      )}

                    {/* Total Distance */}
                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                        <Navigation className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-500">Total Distance</p>
                      <p className="text-sm font-bold text-[#535353]">
                        {trip.distance}
                      </p>
                    </div>

                    {/* Departure */}
                    {trip.departureTime && (
                      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500">Departure</p>
                        <p className="text-sm font-bold text-[#535353]">
                          {trip.departureTime}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar - Mobile and Desktop */}
            {(trip.status === 'In-Process' || tripStarted) && trip.progress && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#535353]">
                    Overall Progress
                  </h3>
                  <span className="text-2xl font-bold text-[#f36969]">
                    {trip.progress}%
                  </span>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#f36969] to-[#f36565] transition-all duration-500"
                    style={{ width: `${trip.progress}%` }}
                  ></div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{trip.from}</span>
                  <span>{trip.to}</span>
                </div>
              </div>
            )}
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
                        {trip.driver.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-[#535353]">
                          {trip.driver.name}
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
                          {trip.vehicle.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Registration</p>
                        <p className="font-mono text-sm font-semibold text-[#535353]">
                          {trip.vehicle.registrationNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Info for Upcoming */}
            {trip.status === 'Upcoming' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#f36969]" />
                  <h3 className="text-lg font-bold text-[#535353]">Schedule</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Departure</span>
                    <span className="font-semibold text-[#535353]">
                      {trip.departureTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="font-semibold text-[#535353]">
                      {trip.duration}
                    </span>
                  </div>
                  {trip.arrivalTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Est. Arrival
                      </span>
                      <span className="font-semibold text-[#535353]">
                        {trip.arrivalTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Show Start Trip button only for assigned upcoming trips */}
              {isAssigned && !tripStarted && (
                <button
                  onClick={handleStartTrip}
                  disabled={isStartingTrip}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-4 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 disabled:opacity-70"
                >
                  {isStartingTrip ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Starting Trip...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start Trip
                    </>
                  )}
                </button>
              )}

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
