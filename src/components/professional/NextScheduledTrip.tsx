'use client';

import { motion } from 'framer-motion';

interface TripDetails {
  pickup: {
    address: string;
  };
  destination: {
    address: string;
  };
  dateTime: string;
  tripType: 'cargo' | 'fragile' | 'liftgate';
}

interface NextScheduledTripProps {
  tripDetails?: TripDetails;
}

const defaultTripDetails: TripDetails = {
  pickup: {
    address: '123 Main Street, AnyTown, CA 32132',
  },
  destination: {
    address: '456 Oak Avenue, OtherTown, NY 100001',
  },
  dateTime: 'Oct 26, 2024 - 10:00 AM',
  tripType: 'fragile',
};

export default function NextScheduledTrip({
  tripDetails = defaultTripDetails,
}: NextScheduledTripProps) {
  const getTripIcon = () => {
    switch (tripDetails.tripType) {
      case 'fragile':
        return (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case 'cargo':
        return (
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        );
      default:
        return (
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
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
        );
    }
  };

  return (
    <div className="mb-8 md:mb-16">
      {/* Header */}
      <div className="mb-5 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
          Next Scheduled <span className="text-[#f36969]">Trip</span>
        </h2>
      </div>

      {/* Trip Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:border-[#f36969]/30 hover:shadow-2xl hover:shadow-[#f36969]/10 md:rounded-3xl"
      >
        <div className="p-5 md:p-7 lg:p-8">
          {/* Trip Type Header */}
          <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f36969]/10 to-[#f36565]/10 text-[#f36969] md:h-14 md:w-14">
                {getTripIcon()}
              </div>
              <div>
                <p className="text-xs text-gray-500 md:text-sm">Trip Type</p>
                <p className="text-base font-bold capitalize text-gray-900 md:text-lg">
                  {tripDetails.tripType}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 md:text-sm">
              Upcoming
            </span>
          </div>

          {/* Trip Route */}
          <div className="space-y-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-5 md:space-y-5 md:p-6">
            {/* Pickup */}
            <div className="flex items-start gap-3 md:gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-md md:h-12 md:w-12">
                <svg
                  className="h-5 w-5 text-white md:h-6 md:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-700 md:text-sm">
                  Pickup Location
                </p>
                <p className="break-words text-sm leading-relaxed text-gray-600 md:text-base">
                  {tripDetails.pickup.address}
                </p>
              </div>
            </div>

            {/* Route Line */}
            <div className="ml-5 h-8 border-l-2 border-dashed border-[#f36969]/30 md:ml-6"></div>

            {/* Destination */}
            <div className="flex items-start gap-3 md:gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-md md:h-12 md:w-12">
                <svg
                  className="h-5 w-5 text-white md:h-6 md:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-700 md:text-sm">
                  Destination
                </p>
                <p className="break-words text-sm leading-relaxed text-gray-600 md:text-base">
                  {tripDetails.destination.address}
                </p>
              </div>
            </div>

            {/* Date Time */}
            <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 md:gap-3 md:p-4">
              <svg
                className="h-5 w-5 flex-shrink-0 text-[#f36969] md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-900 md:text-base">
                {tripDetails.dateTime}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-6">
            <motion.button
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md md:text-base"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
            <motion.button
              className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-[#f36969]/30 md:text-base"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Trip
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
