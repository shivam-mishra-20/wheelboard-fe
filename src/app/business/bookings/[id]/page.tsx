'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import Header from '@/components/Header';
import LoginSimulator from '@/components/LoginSimulator';
import Footer from '@/components/Footer';
import { BusinessProtected } from '@/components/ProtectedRoute';
import { serviceBookingsData } from '@/lib/mockApi';

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;
  const [isCompleting, setIsCompleting] = useState(false);

  const booking = serviceBookingsData.find((b) => b.id === bookingId);

  const handleMarkComplete = () => {
    setIsCompleting(true);
    // Simulate API call
    setTimeout(() => {
      alert('Booking marked as completed!');
      setIsCompleting(false);
    }, 1000);
  };

  const handleCancelAppointment = () => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      alert('Appointment cancelled successfully!');
      router.back();
    }
  };

  if (!booking) {
    return (
      <BusinessProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Booking Not Found
            </h2>
            <p className="mb-4 text-gray-600">
              The booking you&apos;re looking for doesn&apos;t exist.
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
                      {booking.companyName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                  </div>
                  <h2 className="text-center text-xl font-bold">
                    {booking.companyName}
                  </h2>
                </div>

                <div className="space-y-4 px-6 py-6">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.companyPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Booked By
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.bookedBy === 'Company'
                          ? booking.companyName
                          : booking.bookedBy}
                      </p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="rounded-lg bg-orange-50 p-3">
                      <p className="mb-1 text-xs font-medium text-orange-700">
                        Special Instructions
                      </p>
                      <p className="text-sm text-orange-900">
                        &quot;{booking.notes}&quot;
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    window.open(`tel:${booking.companyPhone}`, '_self')
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3.5 font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  <Phone className="h-5 w-5" />
                  Call Customer
                </motion.button>

                {booking.status === 'Confirmed' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkComplete}
                    disabled={isCompleting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3.5 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-5 w-5" />
                    {isCompleting ? 'Completing...' : 'Mark as Completed'}
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelAppointment}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-red-300 bg-white py-3.5 font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                  Cancel Appointment
                </motion.button>
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
                        {booking.serviceName}
                      </h1>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          booking.status === 'Confirmed'
                            ? 'bg-teal-100 text-teal-700'
                            : booking.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : booking.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Service ID: #{booking.id}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-3xl font-bold text-gray-900">
                      {booking.pricing.currency}
                      {booking.pricing.amount}
                    </div>
                    <div className="text-sm text-gray-500">Fixed Rate</div>
                  </div>
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

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pricing Type</p>
                      <p className="font-semibold text-gray-900">Fixed Rate</p>
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
