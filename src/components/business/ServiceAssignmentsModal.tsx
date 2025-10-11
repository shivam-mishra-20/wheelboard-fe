'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { ServiceBooking } from '@/types/ServiceData';

interface ServiceAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  assignments: ServiceBooking[];
  onViewDetails: (assignmentId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ServiceAssignmentsModal({
  isOpen,
  onClose,
  serviceName,
  assignments,
  onViewDetails,
}: ServiceAssignmentsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-red-50 p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Service Assignments
            </h2>
            <p className="text-sm text-gray-600">
              {serviceName} - {assignments.length} assignment
              {assignments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Assignments List */}
        <div className="p-6">
          {assignments.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No Assignments Yet
              </h3>
              <p className="text-gray-600">
                Assignments will appear here when companies book this service.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onViewDetails(assignment.id)}
                    className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all hover:scale-[1.01] hover:shadow-lg"
                  >
                    <div className="p-6">
                      {/* Assignment Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {/* Company Logo/Avatar */}
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f36969] to-[#e85555] text-xl font-bold text-white">
                            {assignment.companyName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </div>

                          {/* Company Info */}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {assignment.companyName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Booking ID: #{assignment.id}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(assignment.status)}`}
                        >
                          {assignment.status}
                        </span>
                      </div>

                      {/* Assignment Details Grid */}
                      <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#f36969]" />
                          <div>
                            <span className="text-xs text-gray-500">
                              Assigned By
                            </span>
                            <p className="font-semibold text-gray-700">
                              {assignment.assignedBy}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#f36969]" />
                          <div>
                            <span className="text-xs text-gray-500">Phone</span>
                            <p className="font-semibold text-gray-700">
                              {assignment.companyPhone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#f36969]" />
                          <div>
                            <span className="text-xs text-gray-500">
                              Scheduled
                            </span>
                            <p className="font-semibold text-gray-700">
                              {assignment.scheduledDate
                                ? new Date(
                                    assignment.scheduledDate
                                  ).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'Not scheduled'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#f36969]" />
                          <div>
                            <span className="text-xs text-gray-500">
                              Location
                            </span>
                            <p className="font-semibold text-gray-700">
                              {assignment.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Service Type and Pricing */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                        <div>
                          <span className="text-xs text-gray-500">
                            Service Type
                          </span>
                          <p className="font-semibold text-gray-900">
                            {assignment.serviceType}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">Price</span>
                          <p className="text-2xl font-bold text-[#f36969]">
                            {assignment.pricing.currency}
                            {assignment.pricing.amount}
                          </p>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onViewDetails(assignment.id)}
                        className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
                      >
                        View Booking Details
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
