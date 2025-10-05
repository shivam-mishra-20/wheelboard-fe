'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Clock, FileText, Edit } from 'lucide-react';
import type { Trip } from '@/lib/mockApi';

interface TripDetailsModalProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
  onEdit?: (tripId: string) => void;
}

export default function TripDetailsModal({
  open,
  onClose,
  trip,
  onEdit,
}: TripDetailsModalProps) {
  if (!trip) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(trip.id);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-lg transition-all hover:bg-white hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4">
                <h2 className="text-center text-xl font-bold text-gray-900">
                  Trip Details
                </h2>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto p-6">
                {/* Trip Image */}
                <div className="mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    width={400}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                </div>

                {/* Trip Details */}
                <div className="space-y-4">
                  {/* Pickup Address */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span>Pickup Address</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {trip.from || '123 Main street, Hyderabad, CA 32132'}
                    </p>
                  </div>

                  {/* Destination Address */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span>Destination Address</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {trip.to || '456 Oak Avenue, Chennai, NY, 100001'}
                    </p>
                  </div>

                  {/* Date and Time */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="h-4 w-4 text-primary-600" />
                      <span>Date and Time</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        {new Date(trip.departureDate).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{trip.departureTime}</span>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FileText className="h-4 w-4 text-primary-600" />
                      <span>Special Requirements</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {trip.deliveryType || 'Standard delivery'}
                      {trip.distance && ` • ${trip.distance}`}
                      {trip.duration && ` • ${trip.duration}`}
                    </p>
                  </div>

                  {/* Driver Info (if assigned) */}
                  {trip.driver && (
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
                        <span>Assigned Driver</span>
                      </div>
                      <p className="text-sm text-blue-600">
                        {trip.driver.name}
                      </p>
                    </div>
                  )}

                  {/* Vehicle Info (if assigned) */}
                  {trip.vehicle && (
                    <div className="rounded-xl bg-purple-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-700">
                        <span>Assigned Vehicle</span>
                      </div>
                      <p className="text-sm text-purple-600">
                        {trip.vehicle.name} • {trip.vehicle.registrationNumber}
                      </p>
                    </div>
                  )}

                  {/* Trip ID */}
                  <div className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-center">
                    <p className="text-sm font-semibold text-white">
                      Trip ID: {trip.id.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
                >
                  <Edit className="h-5 w-5" />
                  Edit
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
