'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Eye,
  Users,
  Calendar,
  FileText,
  Send,
} from 'lucide-react';
import Headers from '@/components/Header';
import { companyHomeData } from '@/lib/mockApi';

export default function AppliedJobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobs] = useState<string[]>(['job-2', 'job-1', 'job-5']); // Mock applied jobs

  const allJobs = companyHomeData.allJobs;

  // Filter to show only applied jobs
  const appliedJobsList = useMemo(() => {
    return allJobs.filter((job) => appliedJobs.includes(job.id));
  }, [allJobs, appliedJobs]);

  // Search filter
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return appliedJobsList;

    const query = searchQuery.toLowerCase();
    return appliedJobsList.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query)
    );
  }, [searchQuery, appliedJobsList]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = 2;
    const reviewed = 1;
    const shortlisted = 0;
    const rejected = 0;

    return {
      total: appliedJobs.length,
      pending,
      reviewed,
      shortlisted,
      rejected,
    };
  }, [appliedJobs.length]);

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-100 text-blue-700';
      case 'Part-time':
        return 'bg-purple-100 text-purple-700';
      case 'Contract':
        return 'bg-orange-100 text-orange-700';
      case 'Freelance':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Mock application status
  const getApplicationStatus = (jobId: string) => {
    const statuses: { [key: string]: string } = {
      'job-1': 'reviewed',
      'job-2': 'pending',
      'job-5': 'pending',
    };
    return statuses[jobId] || 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'reviewed':
        return <Eye className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 py-4 pt-16 lg:px-4 lg:py-6 lg:pt-20">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3 lg:mb-6 lg:gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md lg:h-12 lg:w-12 lg:rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 lg:h-6 lg:w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#535353] lg:text-4xl">
              Applied Jobs
            </h1>
            <p className="mt-0.5 text-sm text-gray-600 lg:mt-1 lg:text-lg">
              Track your job applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-4 grid grid-cols-2 gap-2 lg:mb-6 lg:grid-cols-5 lg:gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:rounded-2xl lg:p-5">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 lg:mb-2 lg:h-10 lg:w-10">
              <Send className="h-4 w-4 text-white lg:h-5 lg:w-5" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">
              Total Applied
            </p>
            <p className="text-lg font-bold text-[#535353] lg:text-2xl">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:rounded-2xl lg:p-5">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 lg:mb-2 lg:h-10 lg:w-10">
              <Clock className="h-4 w-4 text-white lg:h-5 lg:w-5" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Pending</p>
            <p className="text-lg font-bold text-[#535353] lg:text-2xl">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:rounded-2xl lg:p-5">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 lg:mb-2 lg:h-10 lg:w-10">
              <Eye className="h-4 w-4 text-white lg:h-5 lg:w-5" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Reviewed</p>
            <p className="text-lg font-bold text-[#535353] lg:text-2xl">
              {stats.reviewed}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:rounded-2xl lg:p-5">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 lg:mb-2 lg:h-10 lg:w-10">
              <CheckCircle2 className="h-4 w-4 text-white lg:h-5 lg:w-5" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Shortlisted</p>
            <p className="text-lg font-bold text-[#535353] lg:text-2xl">
              {stats.shortlisted}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:rounded-2xl lg:p-5">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 lg:mb-2 lg:h-10 lg:w-10">
              <AlertCircle className="h-4 w-4 text-white lg:h-5 lg:w-5" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Rejected</p>
            <p className="text-lg font-bold text-[#535353] lg:text-2xl">
              {stats.rejected}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:mb-6 lg:rounded-2xl lg:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 lg:left-4 lg:h-5 lg:w-5" />
            <input
              type="text"
              placeholder="Search applied jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:rounded-xl lg:py-3 lg:pl-12 lg:pr-4 lg:text-base"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 lg:text-base">
            Showing{' '}
            <span className="font-semibold text-[#535353]">
              {filteredJobs.length}
            </span>{' '}
            {filteredJobs.length === 1 ? 'application' : 'applications'}
          </p>
        </div>

        {/* Applied Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div>
              <Send className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-[#535353]">
                {searchQuery
                  ? 'No applications found'
                  : "You haven't applied to any jobs yet"}
              </h3>
              <p className="mb-4 text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Start applying to jobs to see them here'}
              </p>
              <button
                onClick={() => router.push('/professional/jobs')}
                className="rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {filteredJobs.map((job) => {
              const applicationStatus = getApplicationStatus(job.id);
              const daysAgo = Math.floor(
                (new Date().getTime() - new Date(job.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={job.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg lg:rounded-2xl"
                >
                  <div className="p-3 lg:p-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                      {/* Left Section */}
                      <div className="flex flex-1 gap-2.5 lg:gap-4">
                        {/* Job Image */}
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 lg:h-20 lg:w-20 lg:rounded-xl">
                          <Image
                            src={job.image}
                            alt={job.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Job Details */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap items-center gap-1.5 lg:mb-2 lg:gap-2">
                            <h3 className="text-base font-bold text-[#535353] lg:text-2xl">
                              {job.title}
                            </h3>
                            <span
                              className={`flex items-center gap-0.5 rounded-full border-2 px-2 py-0.5 text-[10px] font-semibold lg:gap-1 lg:px-3 lg:py-1 lg:text-xs ${getStatusColor(applicationStatus)}`}
                            >
                              {getStatusIcon(applicationStatus)}
                              <span className="hidden sm:inline">
                                {applicationStatus.charAt(0).toUpperCase() +
                                  applicationStatus.slice(1)}
                              </span>
                            </span>
                          </div>

                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 lg:mb-3 lg:gap-3 lg:text-sm">
                            <div className="flex items-center gap-0.5 lg:gap-1">
                              <Building2 className="h-3 w-3 lg:h-4 lg:w-4" />
                              <span className="truncate">{job.department}</span>
                            </div>
                            <div className="flex items-center gap-0.5 lg:gap-1">
                              <MapPin className="h-3 w-3 lg:h-4 lg:w-4" />
                              <span className="truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-0.5 lg:gap-1">
                              <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                              Applied{' '}
                              {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
                            </div>
                          </div>

                          <p className="mb-2 line-clamp-2 text-xs text-gray-600 lg:mb-3 lg:text-base">
                            {job.description}
                          </p>

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold lg:px-3 lg:py-1 lg:text-xs ${getJobTypeColor(job.type)}`}
                            >
                              {job.type}
                            </span>
                            <div className="flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 lg:gap-1 lg:px-3 lg:py-1 lg:text-xs">
                              <IndianRupee className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                              {job.salary}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Desktop */}
                      <div className="hidden flex-col items-end gap-3 lg:flex">
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applications.length}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Application Timeline */}
                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 lg:mt-4 lg:rounded-xl lg:p-4">
                      <div className="mb-2 flex items-center gap-2 lg:mb-3">
                        <FileText className="h-4 w-4 text-[#f36969] lg:h-5 lg:w-5" />
                        <h4 className="text-sm font-semibold text-[#535353] lg:text-base">
                          Application Timeline
                        </h4>
                      </div>
                      <div className="space-y-1.5 text-xs lg:space-y-2 lg:text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Submitted:</span>
                          <span className="font-semibold text-[#535353]">
                            {new Date(job.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        {applicationStatus === 'reviewed' && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Reviewed:</span>
                            <span className="font-semibold text-[#535353]">
                              {new Date(
                                new Date(job.createdAt).getTime() +
                                  2 * 24 * 60 * 60 * 1000
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-semibold text-[#535353]">
                            {applicationStatus === 'pending'
                              ? 'Waiting for review'
                              : 'Under review by employer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
