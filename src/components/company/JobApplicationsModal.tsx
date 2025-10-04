'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { JobApplication } from '@/lib/mockApi';

interface JobApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  applications: JobApplication[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  shortlisted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels = {
  pending: 'Pending Review',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
};

export default function JobApplicationsModal({
  isOpen,
  onClose,
  jobTitle,
  applications,
}: JobApplicationsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="bg-gradient-premium bg-clip-text text-2xl font-bold text-transparent">
                  Job Applications
                </h2>
                <p className="mt-1 text-sm text-gray-600">{jobTitle}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Total Applications: {applications.length}
                </p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full bg-white p-2 text-gray-400 shadow-md transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Applications List */}
          <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
            {applications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  No Applications Yet
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Applications will appear here once candidates apply for this
                  job.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary-100">
                          {application.avatar ? (
                            <Image
                              src={application.avatar}
                              alt={application.candidateName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 text-xl font-bold text-white">
                              {application.candidateName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {application.candidateName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.experience} experience
                            </p>
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[application.status]}`}
                          >
                            {statusLabels[application.status]}
                          </span>
                        </div>

                        {/* Contact Info Grid */}
                        <div className="mb-3 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary-500" />
                            <span className="truncate">
                              {application.candidateEmail}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary-500" />
                            <span>{application.candidatePhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary-500" />
                            <span>{application.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary-500" />
                            <span>
                              Applied:{' '}
                              {new Date(
                                application.appliedDate
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Cover Letter Preview */}
                        {application.coverLetter && (
                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs font-semibold text-gray-700">
                              Cover Letter:
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md"
                          >
                            View Profile
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-lg border border-primary-300 bg-white px-4 py-2 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-50"
                          >
                            Contact
                          </motion.button>
                          {application.status === 'pending' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-lg border border-green-300 bg-white px-4 py-2 text-xs font-semibold text-green-600 transition-all hover:bg-green-50"
                              >
                                Shortlist
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-50"
                              >
                                Reject
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
