'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Truck,
  CheckCircle2,
  Navigation,
  IndianRupee,
  Calendar,
  ChevronDown,
  Filter,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

type TripFilter = 'Assigned' | 'Inprogress' | 'Completed';

export default function ProfessionalTripsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<TripFilter>('Assigned');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [professionalTrips, setProfessionalTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endingTripId, setEndingTripId] = useState<string | null>(null);
  const [startingTripId, setStartingTripId] = useState<string | null>(null);

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const user = api.getCurrentUser();

        if (!user?.id) {
          console.error('No user found');
          setIsLoading(false);
          return;
        }

        const response = await wheelboardApi.trip.getAssignedTrips(user.id);
        console.log('🚚 Assigned Trips API Response:', response);

        let assignedData: any[] = [];
        if (Array.isArray(response)) {
          assignedData = response;
        } else if (
          (response as any).data &&
          Array.isArray((response as any).data)
        ) {
          assignedData = (response as any).data;
        }

        console.log('Assigned Trips Data:', assignedData);

        const mappedAssignedTrips = assignedData.map((trip: any) => {
          let distance = trip.distance || 'N/A';
          if (!trip.distance && trip.pickupLocation && trip.deliveryLocation) {
            const randomDist = Math.floor(Math.random() * 500) + 100;
            distance = `${randomDist} km`;
          }

          return {
            id: trip.tripId,
            pickup: trip.pickupLocation || 'Pickup Location',
            delivery: trip.deliveryLocation || 'Delivery Location',
            distance: distance,
            // Map API status: 'Upcoming' from API means 'Assigned' in UI
            status:
              trip.tripStatus === 'Upcoming' ? 'Assigned' : trip.tripStatus,
            isAssigned: true,
            payRange: trip.payRange || '0',
            tripCode: trip.tripCode || '',
            totalBidCount: trip.totalBidCount || 0,
            specialInstructions: trip.specialInstructions || '',
            pickupDate: trip.pickupDate || '',
            pickupTime: trip.pickupTime || '',
            driver: {
              name: trip.driverName || user.name || 'You',
              contact: trip.driverContact || '',
              id: trip.driverId || '',
            },
            vehicle: {
              number: trip.vehicleNumber || 'N/A',
              type: trip.vehicleType || 'Truck',
              model: trip.vehicleModel || '',
              id: trip.vehicleId || '',
            },
            createdAt: trip.createdDate || new Date().toISOString(),
            scheduledDate: trip.pickupDate || new Date().toISOString(),
            userId: trip.userId || '',
          };
        });

        console.log('Mapped Trips:', mappedAssignedTrips);
        setProfessionalTrips(mappedAssignedTrips);
        console.log('✅ Trips loaded successfully');
      } catch (error) {
        console.error('❌ Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();

    const handleFocus = () => {
      console.log('🔄 Page focused, refreshing trips...');
      fetchTrips();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Handle Start Trip
  const handleStartTrip = async (tripId: string) => {
    try {
      setStartingTripId(tripId);
      console.log('🚀 Starting trip:', tripId);

      await wheelboardApi.trip.startTrip(tripId);
      console.log('✅ Trip started successfully');

      // Refresh trips to get updated status
      const user = api.getCurrentUser();
      if (user?.id) {
        const response = await wheelboardApi.trip.getAssignedTrips(user.id);
        let assignedData: any[] = [];
        if (Array.isArray(response)) {
          assignedData = response;
        } else if (
          (response as any).data &&
          Array.isArray((response as any).data)
        ) {
          assignedData = (response as any).data;
        }

        const mappedAssignedTrips = assignedData.map((trip: any) => {
          let distance = trip.distance || 'N/A';
          if (!trip.distance && trip.pickupLocation && trip.deliveryLocation) {
            const randomDist = Math.floor(Math.random() * 500) + 100;
            distance = `${randomDist} km`;
          }

          return {
            id: trip.tripId,
            pickup: trip.pickupLocation || 'Pickup Location',
            delivery: trip.deliveryLocation || 'Delivery Location',
            distance: distance,
            status:
              trip.tripStatus === 'Upcoming' ? 'Assigned' : trip.tripStatus,
            isAssigned: true,
            payRange: trip.payRange || '0',
            tripCode: trip.tripCode || '',
            totalBidCount: trip.totalBidCount || 0,
            specialInstructions: trip.specialInstructions || '',
            pickupDate: trip.pickupDate || '',
            pickupTime: trip.pickupTime || '',
            driver: {
              name: trip.driverName || user.name || 'You',
              contact: trip.driverContact || '',
              id: trip.driverId || '',
            },
            vehicle: {
              number: trip.vehicleNumber || 'N/A',
              type: trip.vehicleType || 'Truck',
              model: trip.vehicleModel || '',
              id: trip.vehicleId || '',
            },
            createdAt: trip.createdDate || new Date().toISOString(),
            scheduledDate: trip.pickupDate || new Date().toISOString(),
            userId: trip.userId || '',
          };
        });

        setProfessionalTrips(mappedAssignedTrips);
      }
    } catch (error) {
      console.error('❌ Error starting trip:', error);
      alert('Failed to start trip. Please try again.');
    } finally {
      setStartingTripId(null);
    }
  };

  // Calculate stats from real data
  const stats = useMemo(() => {
    const completed = professionalTrips.filter(
      (t) => t.status === 'Completed'
    ).length;
    const inProgress = professionalTrips.filter(
      (t) => t.status === 'Inprogress'
    ).length;
    const assigned = professionalTrips.filter(
      (t) => t.status === 'Assigned' // UI status (mapped from API's 'Upcoming')
    ).length;

    return {
      completed,
      inProgress,
      assigned,
      total: professionalTrips.length,
    };
  }, [professionalTrips]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return professionalTrips.filter((trip) => trip.status === selectedFilter);
  }, [selectedFilter, professionalTrips]);

  // Handle end trip
  const handleEndTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to end this trip?')) {
      return;
    }

    setEndingTripId(tripId);
    try {
      const response = await wheelboardApi.trip.endTrip(tripId);
      console.log('End trip response:', response);

      if (response.success) {
        // Refresh trips list
        const user = api.getCurrentUser();
        if (user?.id) {
          const refreshResponse = await wheelboardApi.trip.getAssignedTrips(
            user.id
          );
          let assignedData: any[] = [];
          if (Array.isArray(refreshResponse)) {
            assignedData = refreshResponse;
          } else if (
            (refreshResponse as any).data &&
            Array.isArray((refreshResponse as any).data)
          ) {
            assignedData = (refreshResponse as any).data;
          }

          const mappedTrips = assignedData.map((trip: any) => ({
            id: trip.tripId,
            pickup: trip.pickupLocation || 'Pickup Location',
            delivery: trip.deliveryLocation || 'Delivery Location',
            distance: trip.distance || 'N/A',
            // Map API status: 'Upcoming' from API means 'Assigned' in UI
            status:
              trip.tripStatus === 'Upcoming' ? 'Assigned' : trip.tripStatus,
            isAssigned: true,
            payRange: trip.payRange || '0',
            tripCode: trip.tripCode || '',
            specialInstructions: trip.specialInstructions || '',
            pickupDate: trip.pickupDate || '',
            pickupTime: trip.pickupTime || '',
            driver: {
              name: trip.driverName || user.name || 'You',
              contact: trip.driverContact || '',
              id: trip.driverId || '',
            },
            vehicle: {
              number: trip.vehicleNumber || 'N/A',
              type: trip.vehicleType || 'Truck',
              model: trip.vehicleModel || '',
              id: trip.vehicleId || '',
            },
            createdAt: trip.createdDate || new Date().toISOString(),
            scheduledDate: trip.pickupDate || new Date().toISOString(),
            userId: trip.userId || '',
          }));

          setProfessionalTrips(mappedTrips);
          alert('Trip ended successfully!');
        }
      } else {
        alert('Failed to end trip. Please try again.');
      }
    } catch (error) {
      console.error('Error ending trip:', error);
      alert('Error ending trip. Please try again.');
    } finally {
      setEndingTripId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 pt-20">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#535353]">My Trips</h1>
          <p className="text-gray-600">Track and manage your trip history</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Assigned Trips */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-purple-50 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-[#535353]">
                  {stats.assigned}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                Assigned Trips
              </p>
              <p className="mt-1 text-xs text-gray-500">Ready to start</p>
            </div>
          </div>

          {/* In Progress Trips */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-blue-50 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-[#535353]">
                  {stats.inProgress}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">In Progress</p>
              <p className="mt-1 text-xs text-gray-500">Active trips</p>
            </div>
          </div>

          {/* Completed Trips */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-green-50 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-[#535353]">
                  {stats.completed}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                Completed Trips
              </p>
              <p className="mt-1 text-xs text-gray-500">All time total</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          {/* Mobile: Collapsible Filter */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#f36969]" />
                <span>{selectedFilter}</span>
                <span className="rounded-full bg-[#f36969]/10 px-2 py-0.5 text-xs font-bold text-[#f36969]">
                  {filteredTrips.length}
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Collapsible Filter Options */}
            <div
              className={`grid gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
                isFilterOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-3 gap-2 pb-2">
                  {(
                    ['Assigned', 'Inprogress', 'Completed'] as TripFilter[]
                  ).map((filter) => {
                    const count = professionalTrips.filter(
                      (t) => t.status === filter
                    ).length;
                    return (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setIsFilterOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                          selectedFilter === filter
                            ? 'bg-[#f36969] text-white shadow-md shadow-[#f36969]/30'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs">{filter}</span>
                        <span
                          className={`mt-1 rounded-full px-2 py-0.5 text-xs ${
                            selectedFilter === filter
                              ? 'bg-white/20'
                              : 'bg-gray-100'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Horizontal Filter */}
          <div className="hidden gap-2 overflow-x-auto pb-2 lg:flex">
            {(['Assigned', 'Inprogress', 'Completed'] as TripFilter[]).map(
              (filter) => {
                const count = professionalTrips.filter(
                  (t) => t.status === filter
                ).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                      selectedFilter === filter
                        ? 'bg-[#f36969] text-white shadow-md shadow-[#f36969]/30'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${selectedFilter === filter ? 'bg-white/20' : 'bg-gray-100'}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Trips List based on selected filter */}
        <div>
          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]"></div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#535353]">
                Loading trips...
              </h3>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Truck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#535353]">
                No {selectedFilter} Trips
              </h3>
              <p className="text-sm text-gray-500">
                {selectedFilter === 'Assigned' &&
                  'Trips assigned to you will appear here'}
                {selectedFilter === 'Inprogress' &&
                  'Start a trip to see it here'}
                {selectedFilter === 'Completed' &&
                  'Completed trips will appear here'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className={`group cursor-pointer overflow-hidden rounded-2xl border-2 p-5 transition-all hover:shadow-xl ${
                    trip.status === 'Inprogress'
                      ? 'border-blue-500 bg-blue-50/50 hover:shadow-blue-500/20'
                      : trip.status === 'Completed'
                        ? 'border-green-200 bg-white hover:shadow-green-500/20'
                        : 'border-purple-200 bg-white hover:shadow-purple-500/20'
                  }`}
                >
                  <div className="relative">
                    {/* Status Badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                          trip.status === 'Inprogress'
                            ? 'bg-blue-100 text-blue-700'
                            : trip.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {trip.status === 'Inprogress' && (
                          <>
                            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                            IN PROGRESS
                          </>
                        )}
                        {trip.status === 'Completed' && 'COMPLETED'}
                        {trip.status === 'Upcoming' && 'UPCOMING'}
                      </span>
                    </div>

                    {/* Trip Route */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                            trip.status === 'Inprogress'
                              ? 'from-blue-500 to-blue-600 shadow-blue-500/30'
                              : trip.status === 'Completed'
                                ? 'from-green-500 to-green-600 shadow-green-500/30'
                                : 'from-purple-500 to-purple-600 shadow-purple-500/30'
                          }`}
                        >
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#535353]">
                            {trip.pickup}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(trip.pickupDate).toLocaleDateString()} •{' '}
                              {trip.pickupTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Route Divider */}
                      <div className="my-3 flex items-center gap-3 pl-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                        <Truck className="h-5 w-5 text-[#f36969]" />
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                      </div>

                      {/* Destination */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                          <Navigation className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#535353]">
                            {trip.delivery}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {trip.distance}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-green-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span className="font-medium">Payment</span>
                        </div>
                        <p className="mt-1 text-base font-bold text-green-700">
                          ₹{trip.payRange}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Truck className="h-3.5 w-3.5" />
                          <span className="font-medium">Vehicle</span>
                        </div>
                        <p className="mt-1 text-base font-bold text-gray-700">
                          {trip.vehicle.number}
                        </p>
                      </div>
                    </div>

                    {/* Trip Code */}
                    {trip.tripCode && (
                      <div className="mb-3 rounded-lg bg-purple-50 p-2.5">
                        <span className="text-xs text-purple-600">
                          Trip Code
                        </span>
                        <p className="mt-0.5 font-mono text-sm font-bold text-purple-700">
                          {trip.tripCode}
                        </p>
                      </div>
                    )}

                    {/* Special Instructions */}
                    {trip.specialInstructions && (
                      <div className="mb-3 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-2.5">
                        <p className="text-xs font-semibold text-yellow-700">
                          Special Instructions:
                        </p>
                        <p className="mt-1 text-xs text-yellow-600">
                          {trip.specialInstructions}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {trip.status === 'Inprogress' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/professional/trips/${trip.id}/progress`
                              );
                            }}
                            className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                          >
                            View Progress
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEndTrip(trip.id);
                            }}
                            disabled={endingTripId === trip.id}
                            className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {endingTripId === trip.id
                              ? 'Ending...'
                              : 'End Trip'}
                          </button>
                        </>
                      )}
                      {trip.status === 'Assigned' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTrip(trip.id);
                            }}
                            disabled={startingTripId === trip.id}
                            className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {startingTripId === trip.id
                              ? 'Starting...'
                              : 'Start'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/professional/trips/${trip.id}`);
                            }}
                            className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40"
                          >
                            View Details
                          </button>
                        </>
                      )}
                      {trip.status === 'Completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/professional/trips/${trip.id}`);
                          }}
                          className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
