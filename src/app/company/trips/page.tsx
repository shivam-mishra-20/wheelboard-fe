'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  MapPin,
  User,
  Truck,
  Clock,
  TrendingUp,
  Package,
  Navigation,
  Phone,
  Eye,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateTripModal from '@/components/company/CreateTripModal';
import ScheduleTripModal from '@/components/company/ScheduleTripModal';
import TripDetailsModal from '@/components/company/TripDetailsModal';
import { companyHomeData, companyFleetData, type Trip } from '@/lib/mockApi';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

type TripStatus = 'Completed' | 'In-Process' | 'Upcoming';

type StatusFilter = 'All' | 'Assigned' | 'Unassigned';
type SortOption = 'dateDesc' | 'dateAsc' | 'distanceDesc' | 'distanceAsc';

export default function CompanyTripsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TripStatus>('In-Process');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showScheduleToast, setShowScheduleToast] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortOption, setSortOption] = useState<SortOption>('dateDesc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const trips: Trip[] = companyHomeData.allTrips || [];
  const vehicles = companyFleetData.vehicles || [];
  const drivers = companyFleetData.drivers || [];

  const handleTripCreated = () => {
    // Switch to Upcoming tab
    setActiveTab('Upcoming');
    // Show success toast
    setShowSuccessToast(true);
    // Hide toast after 5 seconds
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleTripScheduled = () => {
    // Switch to Upcoming tab
    setActiveTab('Upcoming');
    // Show schedule success toast
    setShowScheduleToast(true);
    // Hide toast after 5 seconds
    setTimeout(() => setShowScheduleToast(false), 5000);
  };

  const handleViewBids = (tripId: string) => {
    router.push(`/company/trips/bids?tripId=${tripId}`);
  };

  const handleViewDetails = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEditTrip = (tripId: string) => {
    console.log('Edit trip:', tripId);
    // Implement edit functionality
    setIsDetailsModalOpen(false);
  };

  // Filter trips based on active tab, search, status filter
  const filteredTrips = trips
    .filter((trip) => trip.status === activeTab)
    .filter((trip) => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driver.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .filter((trip) => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Assigned') return !!trip.isAssigned;
      return !trip.isAssigned;
    })
    .sort((a, b) => {
      // parse dates
      const dateA = new Date(a.departureDate).getTime();
      const dateB = new Date(b.departureDate).getTime();
      const parseDistance = (d: string) => {
        // assume format like "450 km" or "120 km"
        const m = d.match(/(\d+\.?\d*)/);
        return m ? parseFloat(m[1]) : 0;
      };
      const distA = parseDistance(a.distance);
      const distB = parseDistance(b.distance);

      switch (sortOption) {
        case 'dateAsc':
          return dateA - dateB;
        case 'dateDesc':
          return dateB - dateA;
        case 'distanceAsc':
          return distA - distB;
        case 'distanceDesc':
          return distB - distA;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          active: 'bg-green-100 shadow-green-200',
          glow: 'shadow-green-300',
        };
      case 'In-Process':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          active: 'bg-blue-100 shadow-blue-200',
          glow: 'shadow-blue-300',
        };
      case 'Upcoming':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          active: 'bg-orange-100 shadow-orange-200',
          glow: 'shadow-orange-300',
        };
    }
  };

  const getDeliveryTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Express Delivery': 'bg-red-100 text-red-700 border-red-200',
      Standard: 'bg-blue-100 text-blue-700 border-blue-200',
      'Bulk Transport': 'bg-purple-100 text-purple-700 border-purple-200',
      Scheduled: 'bg-teal-100 text-teal-700 border-teal-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getSortLabel = (opt: SortOption) => {
    if (opt === 'dateDesc') return 'Date: Newest';
    if (opt === 'dateAsc') return 'Date: Oldest';
    if (opt === 'distanceDesc') return 'Distance: Long → Short';
    return 'Distance: Short → Long';
  };

  return (
    <CompanyProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Top Bar - Search and Actions */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-white p-4 shadow-md"
          >
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Trips"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              {/* Filter & Sort Popovers (toggled by toolbar buttons on small screens hidden) */}
              <div className="hidden items-center gap-2 sm:flex">
                {/* inline indicators for current filter/sort */}
                <div className="rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-sm">
                  <span className="font-semibold">Filter:</span>{' '}
                  <span className="ml-2 text-gray-600">{statusFilter}</span>
                </div>

                <div className="rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-sm">
                  <span className="font-semibold">Sort:</span>{' '}
                  <span className="ml-2 text-gray-600">
                    {getSortLabel(sortOption)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFilterOpen((s) => !s);
                  setIsSortOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="hidden sm:inline">Filter</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsSortOpen((s) => !s);
                  setIsFilterOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50"
              >
                <ArrowUpDown className="h-5 w-5" />
                <span className="hidden sm:inline">Sort</span>
              </motion.button>

              {/* Popover Panels (absolute, small) */}
              {isFilterOpen && (
                <div className="absolute right-40 top-20 z-30 w-56 rounded-xl border bg-white p-3 shadow-lg">
                  <h4 className="mb-2 text-sm font-semibold">Filter Trips</h4>
                  <button
                    onClick={() => {
                      setStatusFilter('All');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm ${statusFilter === 'All' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('Assigned');
                      setIsFilterOpen(false);
                    }}
                    className={`mt-2 block w-full rounded-md px-3 py-2 text-left text-sm ${statusFilter === 'Assigned' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    Assigned
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('Unassigned');
                      setIsFilterOpen(false);
                    }}
                    className={`mt-2 block w-full rounded-md px-3 py-2 text-left text-sm ${statusFilter === 'Unassigned' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    Unassigned
                  </button>
                </div>
              )}

              {isSortOpen && (
                <div className="absolute right-28 top-20 z-30 w-64 rounded-xl border bg-white p-3 shadow-lg">
                  <h4 className="mb-2 text-sm font-semibold">Sort Trips</h4>
                  <button
                    onClick={() => {
                      setSortOption('dateDesc');
                      setIsSortOpen(false);
                    }}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm ${sortOption === 'dateDesc' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    Date: Newest
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('dateAsc');
                      setIsSortOpen(false);
                    }}
                    className={`mt-2 block w-full rounded-md px-3 py-2 text-left text-sm ${sortOption === 'dateAsc' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    Date: Oldest
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('distanceDesc');
                      setIsSortOpen(false);
                    }}
                    className={`mt-2 block w-full rounded-md px-3 py-2 text-left text-sm ${sortOption === 'distanceDesc' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    Distance: Long → Short
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('distanceAsc');
                      setIsSortOpen(false);
                    }}
                    className={`mt-2 block w-full rounded-md px-3 py-2 text-left text-sm ${sortOption === 'distanceAsc' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    Distance: Short → Long
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                <span className="hidden sm:inline">Schedule Trip</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Status Tabs - Sticky */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="top-16 z-10 mb-8"
          >
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-white p-3 shadow-md md:gap-4">
              {(['Completed', 'In-Process', 'Upcoming'] as TripStatus[]).map(
                (status) => {
                  const colors = getStatusColor(status);
                  const isActive = activeTab === status;
                  return (
                    <motion.button
                      key={status}
                      onClick={() => setActiveTab(status)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex-1 rounded-xl px-6 py-3 text-xs font-medium transition-all md:text-sm md:font-semibold ${
                        isActive
                          ? `${colors.bg} ${colors.text} shadow-lg ${colors.glow}`
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {status}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute bottom-0 left-0 right-0 h-1 rounded-full ${colors.text.replace('text', 'bg')}`}
                        />
                      )}
                    </motion.button>
                  );
                }
              )}
            </div>
          </motion.div>

          {/* Trips Grid */}
          {filteredTrips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-white p-16 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Trips Found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : `No ${activeTab.toLowerCase()} trips at the moment`}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredTrips.map((trip) => (
                  <motion.div
                    key={trip.id}
                    variants={item}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    {/* Card Header Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={trip.image}
                        alt={trip.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Status Badge - Top Left */}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${getStatusColor(trip.status).bg} ${getStatusColor(trip.status).text} ${getStatusColor(trip.status).border}`}
                        >
                          {trip.status}
                        </span>
                      </div>

                      {/* Delivery Type Badge - Top Right */}
                      <div className="absolute right-3 top-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${getDeliveryTypeBadge(trip.deliveryType)}`}
                        >
                          {trip.deliveryType}
                        </span>
                      </div>

                      {/* Progress Bar for In-Process */}
                      {trip.status === 'In-Process' && trip.progress && (
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 backdrop-blur-sm">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${trip.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                        {trip.title}
                      </h3>

                      {/* Trip Details */}
                      <div className="mb-4 space-y-2 text-sm text-gray-600">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary-500" />
                          <span>
                            {new Date(trip.departureDate).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}{' '}
                            • {trip.departureTime}
                          </span>
                        </div>

                        {/* Route */}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary-500" />
                          <span className="truncate">
                            {trip.from} → {trip.to}
                          </span>
                        </div>

                        {/* Driver */}
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary-500" />
                          <span className="truncate">{trip.driver.name}</span>
                        </div>

                        {/* Vehicle */}
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary-500" />
                          <span className="truncate">
                            {trip.vehicle.name} {'•'}{' '}
                            {trip.vehicle.registrationNumber}
                          </span>
                        </div>

                        {/* Distance & Duration */}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary-500" />
                          <span>
                            {trip.distance} • {trip.duration}
                          </span>
                        </div>

                        {/* Assignment Status for Upcoming Trips */}
                        {trip.status === 'Upcoming' && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary-500" />
                            <span
                              className={`font-semibold ${
                                trip.isAssigned
                                  ? 'text-green-600'
                                  : 'text-orange-600'
                              }`}
                            >
                              {trip.isAssigned ? 'Assigned' : 'Unassigned'}
                            </span>
                          </div>
                        )}

                        {/* ETA for In-Process */}
                        {trip.status === 'In-Process' && trip.eta && (
                          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-700">
                              ETA: {trip.eta}
                            </span>
                          </div>
                        )}

                        {/* Bids for Upcoming/Completed */}
                        {trip.bids && (
                          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2">
                            <Package className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-700">
                              {trip.bids} Bids Available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {/* In-Process Trip Buttons */}
                        {trip.status === 'In-Process' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                            >
                              <Navigation className="h-4 w-4" />
                              Track Trip
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50"
                            >
                              <Phone className="h-4 w-4" />
                              Call Driver
                            </motion.button>
                          </>
                        )}

                        {/* Upcoming Trip Buttons */}
                        {trip.status === 'Upcoming' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewBids(trip.id)}
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                            >
                              <Users className="h-4 w-4" />
                              View Bids
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewDetails(trip.id)}
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </motion.button>
                          </>
                        )}

                        {/* Completed Trip Button */}
                        {trip.status === 'Completed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(trip.id)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* New Trip Button - Floating */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="fixed bottom-8 right-8 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
          >
            <Package className="h-5 w-5" />
            <span>New Trip</span>
          </motion.button>

          {/* Create Trip Modal */}
          <CreateTripModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onTripCreated={handleTripCreated}
            vehicles={vehicles}
          />

          {/* Schedule Trip Modal */}
          <ScheduleTripModal
            open={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            onTripScheduled={handleTripScheduled}
            vehicles={vehicles}
            drivers={drivers}
          />

          {/* Trip Details Modal */}
          <TripDetailsModal
            open={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            trip={selectedTrip}
            onEdit={handleEditTrip}
          />

          {/* Success Toast Notification - New Trip (Top Center) */}
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 0.8,
                  transition: { duration: 0.2 },
                }}
                className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-white shadow-2xl"
              >
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Trip Posted Successfully!</p>
                  <p className="text-sm text-green-100">
                    Your trip is now available for professionals to bid on.
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessToast(false)}
                  className="ml-4 rounded-lg p-1 hover:bg-green-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Toast Notification - Schedule Trip (Top Center) */}
          <AnimatePresence>
            {showScheduleToast && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 0.8,
                  transition: { duration: 0.2 },
                }}
                className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-white shadow-2xl"
              >
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Trip Scheduled Successfully!</p>
                  <p className="text-sm text-blue-100">
                    Your trip has been scheduled and assigned to a driver.
                  </p>
                </div>
                <button
                  onClick={() => setShowScheduleToast(false)}
                  className="ml-4 rounded-lg p-1 hover:bg-blue-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </CompanyProtected>
  );
}
