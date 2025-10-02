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
            className="h-6 w-6"
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
            className="h-6 w-6"
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
            className="h-6 w-6"
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
    <div className="mb-16">
      <motion.div
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="bg-gradient-premium bg-clip-text text-3xl font-bold text-transparent">
          Next Scheduled Trip
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="group overflow-hidden rounded-3xl bg-gradient-to-br from-white to-primary-50/30 shadow-premium transition-all duration-500 hover:shadow-premium-lg"
        whileHover={{ scale: 1.01, x: 4 }}
      >
        <div className="p-6">
          {/* Trip Type Badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg">
                {getTripIcon()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Trip Type</p>
                <p className="text-sm font-bold capitalize text-gray-900">
                  {tripDetails.tripType}
                </p>
              </div>
            </div>
            <div className="rounded-full bg-primary-100 px-4 py-2">
              <span className="text-xs font-semibold text-primary-700">
                Upcoming
              </span>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            {/* Pickup Location */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <svg
                  className="h-6 w-6 text-[#FF7A00]"
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
              <div className="flex-1">
                <p className="mb-1 text-sm font-bold text-gray-900">Pickup</p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {tripDetails.pickup.address}
                </p>
              </div>
            </div>

            {/* Route Line */}
            <div className="ml-5 h-8 border-l-2 border-dashed border-gray-300"></div>

            {/* Destination */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <svg
                  className="h-6 w-6 text-blue-600"
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
              <div className="flex-1">
                <p className="mb-1 text-sm font-bold text-gray-900">
                  Destination
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {tripDetails.destination.address}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-500"
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
                  <span className="text-sm font-medium text-gray-700">
                    {tripDetails.dateTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            <motion.button
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
            <motion.button
              className="flex-1 rounded-xl border-2 border-primary-200 bg-gradient-to-r from-primary-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
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
