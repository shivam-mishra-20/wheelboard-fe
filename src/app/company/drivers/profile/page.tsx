'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  Award,
  Calendar as CalendarIcon,
  Shield,
  Truck,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { wheelboardApi } from '@/lib/wheelboardApi';

interface DriverData {
  driverId: string;
  fullName: string;
  driverImagePath?: string;
  contactNumber: string;
  emailAddress?: string;
  rating?: number;
  totalTrips?: number;
  isVerified?: boolean;
  experience?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  vehicleType?: string;
  description?: string;
}

function DriverProfileInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const driverId = searchParams.get('driverId');
  const tripId = searchParams.get('tripId');

  const [driver, setDriver] = useState<DriverData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!driverId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // First try to get professional details (for professionals who bid on trips)
        const response =
          await wheelboardApi.transport.getProfessionalDetails(driverId);

        console.log('Driver Profile API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Has data?:', (response as any)?.data);

        // Handle both response structures: {data: {...}} or direct object
        let driverData: any = null;
        if (
          (response as any).data &&
          typeof (response as any).data === 'object'
        ) {
          driverData = (response as any).data;
          console.log('Using response.data');
        } else if (typeof response === 'object') {
          driverData = response;
          console.log('Using direct response');
        }

        console.log('Driver Data:', driverData);
        setDriver(driverData);
      } catch (error) {
        console.error('Error fetching professional details:', error);
        // If professional details fail, try getting driver details
        try {
          const driverResponse =
            await wheelboardApi.transport.getDriverDetails(driverId);

          console.log('Driver Details API Response:', driverResponse);

          // Handle both response structures
          let driverData: any = null;
          if (
            (driverResponse as any).data &&
            typeof (driverResponse as any).data === 'object'
          ) {
            driverData = (driverResponse as any).data;
            console.log('Using driverResponse.data');
          } else if (typeof driverResponse === 'object') {
            driverData = driverResponse;
            console.log('Using direct driverResponse');
          }

          console.log('Driver Data from fallback:', driverData);
          setDriver(driverData);
        } catch (driverError) {
          console.error('Error fetching driver details:', driverError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriverData();
  }, [driverId]);

  if (isLoading) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Loading Driver Profile...
            </h3>
            <p className="text-gray-600">Please wait</p>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  if (!driverId || !driver) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Driver Not Found
            </h2>
            <p className="mt-2 text-gray-600">
              Unable to load driver information.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="mt-6 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3 font-semibold text-white shadow-md"
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  // Extract data with fallbacks
  const driverName = driver.fullName || 'Professional Driver';
  const driverPhone = driver.contactNumber || 'N/A';
  const driverEmail = driver.emailAddress || '';
  const driverRating = driver.rating || 4.5;
  const driverTrips = driver.totalTrips || 0;
  const driverExperience = driver.experience || 'Not specified';
  const driverImagePath = driver.driverImagePath
    ? driver.driverImagePath.startsWith('http')
      ? driver.driverImagePath
      : `https://wheelboardapi.addonshareware.com${driver.driverImagePath.startsWith('/') ? '' : '/'}${driver.driverImagePath}`
    : '/profile.png';
  const isVerified = driver.isVerified !== true; // Default to false

  const handleAssignTrip = () => {
    if (tripId) {
      router.push(
        `/company/trips/assignment?driverId=${driverId}&tripId=${tripId}`
      );
    }
  };

  // Generate calendar for current month (simplified - actual availability would come from API)
  const generateCalendar = () => {
    const daysInMonth = 31;
    const firstDay = 0; // Sunday
    const days = [];
    // Mock available days for now - this should come from API when available
    const availableDays = [2, 4, 5, 9, 11, 16, 18, 23, 25, 30];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = availableDays.includes(day);
      days.push(
        <div
          key={day}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
            isAvailable
              ? 'bg-[#f36969] text-white shadow-sm hover:shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <CompanyProtected>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bids
          </motion.button>

          {/* Hero Section - Professional Driver Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg"
          >
            <div className="bg-transparent p-1">
              <div className="bg-white">
                <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
                  {/* Left: Driver Photo & Basic Info */}
                  <div className="flex flex-col items-center lg:col-span-3 lg:border-r lg:border-gray-200 lg:pr-8">
                    <div className="relative mb-4">
                      <div className="relative h-40 w-40 overflow-hidden rounded-2xl border-4 border-gray-100 shadow-lg">
                        <Image
                          src={driverImagePath}
                          alt={driverName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {isVerified && (
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg">
                          <CheckCircle2 className="h-7 w-7 text-green-500" />
                        </div>
                      )}
                    </div>

                    <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
                      {driverName}
                    </h1>
                    <p className="mb-3 text-center text-sm text-gray-600">
                      {driverPhone}
                    </p>

                    {/* Rating Badge */}
                    <div className="mb-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 px-5 py-2.5">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        {driverRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({driverTrips} trips)
                      </span>
                    </div>

                    {/* Contact Buttons */}
                    <div className="mb-4 flex w-full gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(`tel:${driverPhone}`)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-green-500 hover:bg-green-50 hover:text-green-600"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          driverEmail && window.open(`mailto:${driverEmail}`)
                        }
                        disabled={!driverEmail}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </motion.button>
                    </div>

                    {/* Experience Badge */}
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5">
                      <Award className="h-4 w-4 text-[#f36969]" />
                      <span className="text-sm font-semibold text-gray-700">
                        {driverExperience} Experience
                      </span>
                    </div>

                    {/* License Info */}
                    {driver.licenseNumber && (
                      <div className="mt-3 w-full rounded-xl bg-blue-50 p-3">
                        <p className="text-xs font-semibold text-blue-700">
                          License: {driver.licenseNumber}
                        </p>
                        {driver.licenseExpiryDate && (
                          <p className="mt-1 text-xs text-blue-600">
                            Expires:{' '}
                            {new Date(
                              driver.licenseExpiryDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Vehicle Type */}
                    {driver.vehicleType && (
                      <div className="mt-3 w-full rounded-xl bg-purple-50 p-3 text-center">
                        <p className="text-xs font-semibold text-purple-700">
                          Vehicle: {driver.vehicleType}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Stats & Assign Button */}
                  <div className="lg:col-span-9">
                    {/* Description */}
                    {driver.description && (
                      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-2 text-sm font-bold text-gray-900">
                          About
                        </h3>
                        <p className="text-sm text-gray-600">
                          {driver.description}
                        </p>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {driverTrips}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          Total Trips
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {driverRating.toFixed(1)}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          Rating
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100/50 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {isVerified ? 'Yes' : 'No'}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          Verified
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-[#f36969]/10 to-[#f36969]/20 p-5 transition-all hover:shadow-md">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f36969]">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">Pro</p>
                        <p className="text-sm font-medium text-gray-600">
                          Status
                        </p>
                      </div>
                    </div>

                    {/* Performance Note */}
                    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Detailed performance metrics,
                        trip history, and reviews will be available once the
                        driver completes trips through the platform.
                      </p>
                    </div>

                    {/* Assign Button */}
                    {tripId && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleAssignTrip}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-1 py-2 font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-8 md:py-4 md:text-lg"
                      >
                        <Shield className="h-8 w-8" />
                        Assign Driver & Proceed to Payment
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Availability Calendar
                </h2>
                <div className="flex items-center gap-2 rounded-lg bg-[#f36969]/10 px-3 py-1.5">
                  <CalendarIcon className="h-4 w-4 text-[#f36969]" />
                  <span className="text-sm font-semibold text-[#f36969]">
                    December 2025
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-gray-400"
                    >
                      {day}
                    </div>
                  )
                )}
                {generateCalendar()}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="h-4 w-4 rounded bg-[#f36969] shadow-sm" />
                <span className="text-sm font-semibold text-gray-700">
                  Available Days (Sample)
                </span>
              </div>
              <p className="mt-2 text-center text-xs text-gray-500">
                Calendar availability will sync once driver updates their
                schedule
              </p>
            </motion.div>

            {/* Right Column - Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-bold text-gray-900">
                Professional Information
              </h2>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#f36969]" />
                    <h4 className="font-bold text-gray-900">Contact</h4>
                  </div>
                  <p className="mb-2 text-sm text-gray-700">{driverPhone}</p>
                  {driverEmail && (
                    <p className="text-sm text-gray-600">{driverEmail}</p>
                  )}
                </div>

                {/* Vehicle Info */}
                {driver.vehicleType && (
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900">Vehicle Type</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      {driver.vehicleType}
                    </p>
                  </div>
                )}

                {/* License Info */}
                {driver.licenseNumber && (
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">
                        License Details
                      </h4>
                    </div>
                    <p className="mb-1 text-sm text-gray-700">
                      {driver.licenseNumber}
                    </p>
                    {driver.licenseExpiryDate && (
                      <p className="text-xs text-gray-600">
                        Valid until:{' '}
                        {new Date(
                          driver.licenseExpiryDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Reviews Placeholder */}
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-yellow-50 to-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-bold text-gray-900">Reviews</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Customer reviews will appear here after completed trips.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}

const LoadingFallback = () => (
  <div className="p-6 text-sm text-gray-500">Loading…</div>
);

export default function DriverProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DriverProfileInner />
    </Suspense>
  );
}
