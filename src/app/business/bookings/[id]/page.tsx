'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  X,
  User,
  CreditCard,
  Tag,
  Timer,
  Loader2,
} from 'lucide-react';
import Header from '@/components/Header';
import LoginSimulator from '@/components/LoginSimulator';
import Footer from '@/components/Footer';
import { BusinessProtected } from '@/components/ProtectedRoute';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

// Interface for service booking/assignment from API
interface ServiceBooking {
  assignmentId: string;
  serviceId: string;
  serviceName: string;
  serviceTitle?: string;
  assignedToUserId: string;
  companyName?: string;
  customerName?: string;
  companyPhone?: string;
  phoneNumber?: string;
  location?: string;
  address?: string;
  vehicleNumber?: string;
  scheduledDate: string;
  scheduledTime: string;
  description?: string;
  notes?: string;
  status: string;
  category?: string;
  serviceType?: string;
  price?: number;
  amount?: number;
  currency?: string;
  duration?: string;
  bookedBy?: string;
  internalNotes?: string;
  createdAt?: string;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;
  const [booking, setBooking] = useState<ServiceBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch booking details from API
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const user = api.getCurrentUser();
        if (!user) {
          setError('Please log in to view booking details');
          return;
        }

        // Get all assigned services for the user
        const response = await wheelboardApi.service.getAssignedServices(
          user.id
        );

        if (response.success && response.data) {
          const assignments = response.data as ServiceBooking[];
          const foundBooking = assignments.find(
            (a) => a.assignmentId === bookingId
          );

          if (foundBooking) {
            setBooking(foundBooking);
          } else {
            setError('Booking not found');
          }
        } else {
          setError('Failed to load booking details');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('An error occurred while loading booking details');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleMarkComplete = async () => {
    if (!booking) return;

    setIsCompleting(true);
    try {
      const response = await wheelboardApi.service.completeService(
        booking.assignmentId
      );

      if (response.success) {
        setBooking({ ...booking, status: 'Completed' });
        alert('Booking marked as completed!');
      } else {
        alert(response.message || 'Failed to complete booking');
      }
    } catch (err) {
      console.error('Error completing booking:', err);
      alert('An error occurred while completing the booking');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!booking) return;

    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await wheelboardApi.service.cancelService(
        booking.assignmentId
      );

      if (response.success) {
        alert('Appointment cancelled successfully!');
        router.back();
      } else {
        alert(response.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('An error occurred while cancelling the appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <BusinessProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#f36969]" />
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </BusinessProtected>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <BusinessProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              {error || 'Booking Not Found'}
            </h2>
            <p className="mb-4 text-gray-600">
              The booking you&apos;re looking for doesn&apos;t exist or
              couldn&apos;t be loaded.
            </p>
            <button
              onClick={() => router.back()}
              className="rounded-lg bg-[#f36969] px-6 py-3 font-semibold text-white hover:bg-[#e85555]"
            >
              Go Back
            </button>
          </div>
        </div>
      </BusinessProtected>
    );
  }

  // Extract booking details with fallbacks
  const serviceName = booking.serviceTitle || booking.serviceName || 'Service';
  const customerName =
    booking.customerName || booking.companyName || 'Customer';
  const phoneNumber = booking.phoneNumber || booking.companyPhone || '';
  const locationAddress =
    booking.address || booking.location || 'Not specified';
  const bookingStatus = booking.status || 'Pending';
  const priceAmount = booking.amount || booking.price || 0;
  const priceCurrency = booking.currency || '₹';

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Bookings</span>
          </button>

          {/* Desktop: Two Column Layout, Mobile: Single Column */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Customer Info & Actions (1/3 width on desktop) */}
            <div className="space-y-6 lg:col-span-1">
              {/* Customer Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="bg-gradient-to-br from-[#f36969] to-[#e85555] px-6 py-8 text-white">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold backdrop-blur-sm">
                      {customerName
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  </div>
                  <h2 className="text-center text-xl font-bold">
                    {customerName}
                  </h2>
                </div>

                <div className="space-y-4 px-6 py-6">
                  {phoneNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Phone Number
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {locationAddress}
                      </p>
                    </div>
                  </div>

                  {booking.vehicleNumber && (
                    <div className="flex items-start gap-3">
                      <Tag className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Vehicle Number
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.vehicleNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Booked By
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.bookedBy || customerName}
                      </p>
                    </div>
                  </div>

                  {(booking.notes || booking.description) && (
                    <div className="rounded-lg bg-orange-50 p-3">
                      <p className="mb-1 text-xs font-medium text-orange-700">
                        Special Instructions
                      </p>
                      <p className="text-sm text-orange-900">
                        &quot;{booking.notes || booking.description}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3 rounded-2xl bg-white p-6 shadow-sm"
              >
                {phoneNumber && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(`tel:${phoneNumber}`, '_self')}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3.5 font-semibold text-white transition-colors hover:bg-teal-700"
                  >
                    <Phone className="h-5 w-5" />
                    Call Customer
                  </motion.button>
                )}

                {(bookingStatus === 'Confirmed' ||
                  bookingStatus === 'Pending' ||
                  bookingStatus === 'In Progress') && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkComplete}
                    disabled={isCompleting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3.5 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    {isCompleting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    {isCompleting ? 'Completing...' : 'Mark as Completed'}
                  </motion.button>
                )}

                {bookingStatus !== 'Completed' &&
                  bookingStatus !== 'Cancelled' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancelAppointment}
                      disabled={isCancelling}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-red-300 bg-white py-3.5 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {isCancelling ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                      {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
                    </motion.button>
                  )}
              </motion.div>
            </div>

            {/* Right Column - Booking Details (2/3 width on desktop) */}
            <div className="space-y-6 lg:col-span-2">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white p-6 shadow-sm lg:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                        {serviceName}
                      </h1>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          bookingStatus === 'Confirmed'
                            ? 'bg-teal-100 text-teal-700'
                            : bookingStatus === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : bookingStatus === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : bookingStatus === 'In Progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {bookingStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Assignment ID: #{booking.assignmentId.slice(0, 8)}
                    </p>
                  </div>
                  {priceAmount > 0 && (
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-3xl font-bold text-gray-900">
                        {priceCurrency}
                        {priceAmount}
                      </div>
                      <div className="text-sm text-gray-500">Service Fee</div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {booking.scheduledDate
                        ? new Date(booking.scheduledDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )
                        : 'Not scheduled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {booking.scheduledTime || '— : — PM'}
                    </span>
                  </div>
                  {booking.duration && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                      <Timer className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {booking.duration}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Service Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white p-6 shadow-sm lg:p-8"
              >
                <h2 className="mb-6 text-lg font-bold text-gray-900">
                  Service Details
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {booking.serviceType && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-50 p-2">
                        <Tag className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Type</p>
                        <p className="font-semibold text-gray-900">
                          {booking.serviceType}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.category && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-purple-50 p-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-semibold text-gray-900">
                          {booking.category}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service ID</p>
                      <p className="font-semibold text-gray-900">
                        {booking.serviceId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Scheduled Time Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white p-6 shadow-sm lg:p-8"
              >
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Schedule Information
                </h2>
                <div className="rounded-lg bg-gradient-to-br from-teal-50 to-blue-50 p-6">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Scheduled For
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {booking.scheduledDate && booking.scheduledTime
                      ? `${new Date(booking.scheduledDate).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )} at ${booking.scheduledTime}`
                      : 'To be scheduled'}
                  </p>
                  {booking.duration && (
                    <p className="mt-2 text-sm text-gray-600">
                      Estimated Duration: {booking.duration}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <span className="cursor-pointer text-sm font-medium text-teal-600 hover:underline">
                    View Job Documents
                  </span>
                </div>
              </motion.div>

              {/* Internal Notes Card */}
              {booking.internalNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl bg-white p-6 shadow-sm lg:p-8"
                >
                  <h2 className="mb-4 text-lg font-bold text-gray-900">
                    Internal Notes
                  </h2>
                  <div className="rounded-lg bg-amber-50 p-4">
                    <p className="mb-2 text-xs font-medium text-amber-700">
                      Visible to You Only
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {booking.internalNotes}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </BusinessProtected>
  );
}
