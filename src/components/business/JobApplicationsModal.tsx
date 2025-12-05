'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { wheelboardApi } from '@/lib/wheelboardApi';
import type { JobApplication } from '@/types/job';

interface JobApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'shortlisted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'reviewed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

export default function JobApplicationsModal({
  isOpen,
  onClose,
  jobTitle,
  jobId,
}: JobApplicationsModalProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!jobId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await wheelboardApi.job.getJobApplications(jobId);
      console.log('Applications API response:', response);

      const applicationsData = (response as any)?.data || [];
      setApplications(applicationsData);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchApplications();
    }
  }, [isOpen, jobId, fetchApplications]);
  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: string
  ) => {
    setUpdatingStatus(applicationId);

    try {
      // Need userId from session - get it from apiAdapter
      const { api } = await import('@/lib/apiAdapter');
      const user = api.getCurrentUser();
      if (!user?.id) {
        setError('User not authenticated');
        return;
      }

      await wheelboardApi.job.updateJobStatus({
        applicationId: applicationId,
        status: newStatus,
        userId: user.id,
      });

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-red-50 p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Applications for {jobTitle}
            </h2>
            <p className="text-sm text-gray-600">
              {applications.length} application
              {applications.length !== 1 ? 's' : ''} received
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f36969] border-t-transparent"></div>
            <p className="ml-3 text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mx-6 rounded-lg bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Applications List */}
        {!isLoading && !error && (
          <div className="p-6">
            {applications.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No Applications Yet
                </h3>
                <p className="text-gray-600">
                  Applications will appear here when candidates apply for this
                  position.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {applications.map((application, index) => (
                    <motion.div
                      key={application.applicationId || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-shadow hover:shadow-lg"
                    >
                      <div className="p-6">
                        {/* Application Header */}
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#f36969] to-[#e85555] text-xl font-bold text-white">
                              {application.avatar ? (
                                <Image
                                  src={application.avatar}
                                  alt={application.applicantName || 'Applicant'}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                (application.applicantName || 'NA')
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                              )}
                            </div>

                            {/* Applicant Info */}
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {application.applicantName || 'Unknown'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {application.experience || 'N/A'} of experience
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(application.status || 'pending')}`}
                          >
                            {application.status || 'pending'}
                          </span>
                        </div>

                        {/* Contact Details Grid */}
                        <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 text-sm md:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[#f36969]" />
                            <span className="truncate text-gray-700">
                              {application.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#f36969]" />
                            <span className="text-gray-700">
                              {application.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#f36969]" />
                            <span className="text-gray-700">
                              {application.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#f36969]" />
                            <span className="text-gray-700">
                              Applied{' '}
                              {application.appliedAt
                                ? new Date(
                                    application.appliedAt
                                  ).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Cover Letter */}
                        {application.coverLetter && (
                          <div className="rounded-xl border-2 border-gray-100 bg-white p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                              <FileText className="h-4 w-4 text-[#f36969]" />
                              <span>Cover Letter</span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-700">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          {application.status === 'pending' &&
                            application.applicationId && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application.applicationId!,
                                      'shortlisted'
                                    )
                                  }
                                  disabled={
                                    updatingStatus === application.applicationId
                                  }
                                  className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                  {updatingStatus === application.applicationId
                                    ? 'Updating...'
                                    : 'Shortlist'}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application.applicationId!,
                                      'reviewed'
                                    )
                                  }
                                  disabled={
                                    updatingStatus === application.applicationId
                                  }
                                  className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  {updatingStatus === application.applicationId
                                    ? 'Updating...'
                                    : 'Review Later'}
                                </button>
                              </>
                            )}
                          {application.status === 'reviewed' &&
                            application.applicationId && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application.applicationId!,
                                      'shortlisted'
                                    )
                                  }
                                  disabled={
                                    updatingStatus === application.applicationId
                                  }
                                  className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                  {updatingStatus === application.applicationId
                                    ? 'Updating...'
                                    : 'Shortlist'}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application.applicationId!,
                                      'rejected'
                                    )
                                  }
                                  disabled={
                                    updatingStatus === application.applicationId
                                  }
                                  className="flex-1 rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                                >
                                  {updatingStatus === application.applicationId
                                    ? 'Updating...'
                                    : 'Reject'}
                                </button>
                              </>
                            )}
                          {application.status === 'shortlisted' &&
                            application.applicationId && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    application.applicationId!,
                                    'interviewed'
                                  )
                                }
                                disabled={
                                  updatingStatus === application.applicationId
                                }
                                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                              >
                                {updatingStatus === application.applicationId
                                  ? 'Updating...'
                                  : 'Schedule Interview'}
                              </button>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
