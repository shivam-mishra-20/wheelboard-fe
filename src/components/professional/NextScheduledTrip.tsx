'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NextScheduledTripProps {
  tripDetails?: any;
  isLoading?: boolean;
}

export default function NextScheduledTrip({
  tripDetails,
  isLoading = false,
}: NextScheduledTripProps) {
  const router = useRouter();

  // Format date and time
  const formatDateTime = (date: string, time: string) => {
    if (!date) return 'Date TBD';

    try {
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      if (time) {
        // Time comes as "11:42:00"
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${formattedDate} - ${displayHours}:${minutes} ${ampm}`;
      }

      return formattedDate;
    } catch (error) {
      return 'Date TBD';
    }
  };

  const getTripIcon = () => {
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
  };

  const handleViewDetails = () => {
    if (tripDetails?.tripId) {
      router.push(`/professional/trips/${tripDetails.tripId}/progress`);
    }
  };

  const handleStartTrip = () => {
    if (tripDetails?.tripId) {
      router.push(`/professional/trips/${tripDetails.tripId}/progress`);
    }
  };

  return (
    <div className="mb-8 md:mb-16">
      {/* Header */}
      <div className="mb-5 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
          Last Scheduled <span className="text-[#f36969]">Trip</span>
        </h2>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f36969] border-t-transparent"></div>
        </div>
      ) : !tripDetails ? (
        /* No Trip State */
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
          <svg
            className="mb-4 h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-medium text-gray-500">
            No upcoming trips scheduled
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Check back later for new assignments
          </p>
        </div>
      ) : (
        /* Trip Card */
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
                  <p className="text-xs text-gray-500 md:text-sm">
                    Vehicle Type
                  </p>
                  <p className="text-base font-bold capitalize text-gray-900 md:text-lg">
                    {tripDetails.vehicleType || 'Vehicle'}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 md:text-sm">
                {tripDetails.tripStatus || 'Assigned'}
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
                    {tripDetails.pickupLocation || 'Location TBD'}
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
                    {tripDetails.deliveryLocation || 'Location TBD'}
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
                  {formatDateTime(
                    tripDetails.pickupDate,
                    tripDetails.pickupTime
                  )}
                </span>
              </div>

              {/* Additional Info */}
              {tripDetails.payRange && (
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 md:gap-3 md:p-4">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-green-600 md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900 md:text-base">
                    ₹{tripDetails.payRange}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-6">
              <motion.button
                onClick={handleStartTrip}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-[#f36969]/30 md:text-base"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Trip
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
