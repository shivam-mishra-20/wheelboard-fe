'use client';

import React, { useState, useMemo, useEffect } from 'react';

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
  Calendar,
  FileText,
  Send,
  User,
  Briefcase,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

interface AppliedJob {
  applicationId: string;
  jobId: string;
  salary: number;
  jobRole: string;
  jobDuration: string;
  jobCity: string;
  jobType: string;
  jobDescription: string;
  userId: string;
  fullName: string;
  userLocation: string;
  appliedDate: string;
  status: string;
  salaryExpectation: number;
  remarks: string;
}

export default function AppliedJobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applied jobs from API
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setIsLoading(true);

        // Get current user from API
        const user = api.getCurrentUser();
        if (!user || !user.id) {
          setError('Please log in to view applied jobs');
          setIsLoading(false);
          return;
        }

        // Fetch applied jobs using the dedicated endpoint
        const response = await wheelboardApi.job.getAppliedJobs(user.id);
        console.log('✅ Applied Jobs Response:', response);

        const jobsData: AppliedJob[] = Array.isArray(response)
          ? response
          : (response as any).data || [];

        setAppliedJobs(jobsData);
      } catch (error) {
        console.error('❌ Error fetching applied jobs:', error);
        setError('Failed to load applied jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Filter applied jobs list
  const appliedJobsList = useMemo(() => {
    return appliedJobs;
  }, [appliedJobs]);

  // Search filter
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return appliedJobsList;

    const query = searchQuery.toLowerCase();
    return appliedJobsList.filter(
      (job) =>
        job.jobRole.toLowerCase().includes(query) ||
        job.jobCity.toLowerCase().includes(query) ||
        job.jobType.toLowerCase().includes(query) ||
        job.jobDescription.toLowerCase().includes(query)
    );
  }, [searchQuery, appliedJobsList]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = appliedJobs.filter(
      (job) => job.status === 'Pending'
    ).length;
    const accepted = appliedJobs.filter(
      (job) => job.status === 'Accepted'
    ).length;
    const rejected = appliedJobs.filter(
      (job) => job.status === 'Rejected'
    ).length;
    const reviewed = appliedJobs.filter(
      (job) => job.status === 'Reviewed'
    ).length;

    return {
      total: appliedJobs.length,
      pending,
      reviewed,
      shortlisted: accepted,
      rejected,
    };
  }, [appliedJobs]);

  const getJobTypeColor = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('full'))
      return 'bg-blue-50 text-blue-700 border-blue-200';
    if (typeLower.includes('part'))
      return 'bg-purple-50 text-purple-700 border-purple-200';
    if (typeLower.includes('contract'))
      return 'bg-orange-50 text-orange-700 border-orange-200';
    if (typeLower.includes('freelance'))
      return 'bg-green-50 text-green-700 border-green-200';
    if (typeLower.includes('technician'))
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getDurationColor = (duration: string) => {
    const durationLower = duration.toLowerCase();
    if (durationLower.includes('task'))
      return 'bg-amber-50 text-amber-700 border-amber-200';
    if (durationLower.includes('hour'))
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (durationLower.includes('day'))
      return 'bg-teal-50 text-teal-700 border-teal-200';
    if (durationLower.includes('month'))
      return 'bg-violet-50 text-violet-700 border-violet-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'accepted':
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
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'accepted':
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
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div>
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]" />
              <p className="text-gray-500">Loading applied jobs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div>
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-300" />
              <h3 className="mb-2 text-xl font-bold text-[#535353]">{error}</h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
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
          <div className="space-y-4 lg:space-y-5">
            {filteredJobs.map((job) => {
              const appliedDate = new Date(job.appliedDate);
              const daysAgo = Math.floor(
                (new Date().getTime() - appliedDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={job.applicationId}
                  className="group overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all hover:border-[#f36969]/20 hover:shadow-xl lg:rounded-3xl"
                >
                  {/* Header Section with Status Banner */}
                  <div
                    className={`px-4 py-2.5 lg:px-6 lg:py-3 ${
                      job.status === 'Pending'
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50'
                        : job.status === 'Accepted'
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                          : job.status === 'Reviewed'
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50'
                            : job.status === 'Rejected'
                              ? 'bg-gradient-to-r from-red-50 to-rose-50'
                              : 'bg-gradient-to-r from-gray-50 to-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="text-sm font-semibold lg:text-base">
                          Application {job.status}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-600 lg:text-sm">
                        ID: {job.applicationId.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6">
                    {/* Main Job Info */}
                    <div className="mb-4 flex gap-3 lg:mb-5 lg:gap-4">
                      {/* Job Icon/Image */}
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#f36969]/10 to-[#f36969]/5 lg:h-20 lg:w-20 lg:rounded-2xl">
                        <Briefcase className="h-7 w-7 text-[#f36969] lg:h-10 lg:w-10" />
                      </div>

                      {/* Job Title and Basic Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-2 text-xl font-bold text-[#535353] lg:text-2xl">
                          {job.jobRole}
                        </h3>

                        <div className="mb-3 flex flex-wrap items-center gap-2 lg:gap-3">
                          <span
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold lg:text-sm ${getJobTypeColor(job.jobType)}`}
                          >
                            <Building2 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            {job.jobType}
                          </span>
                          <span
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold lg:text-sm ${getDurationColor(job.jobDuration)}`}
                          >
                            <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            {job.jobDuration}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 lg:text-sm">
                            <MapPin className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            {job.jobCity}
                          </span>
                        </div>

                        {/* Salary */}
                        {job.salary > 0 && (
                          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2.5 lg:inline-flex">
                            <IndianRupee className="h-5 w-5 text-green-600 lg:h-6 lg:w-6" />
                            <span className="text-lg font-bold text-green-700 lg:text-xl">
                              ₹{job.salary.toLocaleString()}
                            </span>
                            <span className="text-xs text-green-600 lg:text-sm">
                              per month
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Job Description */}
                    {job.jobDescription && (
                      <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3 lg:mb-5 lg:p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#f36969] lg:h-5 lg:w-5" />
                          <h4 className="text-sm font-semibold text-[#535353] lg:text-base">
                            Job Description
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-700 lg:text-sm">
                          {job.jobDescription}
                        </p>
                      </div>
                    )}

                    {/* Application Timeline & Details Grid */}
                    <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                      {/* Timeline Card */}
                      <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 p-3 lg:p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600 lg:h-5 lg:w-5" />
                          <h4 className="text-sm font-semibold text-blue-900 lg:text-base">
                            Application Timeline
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs lg:text-sm">
                            <span className="text-blue-700">Submitted</span>
                            <span className="font-semibold text-blue-900">
                              {appliedDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm">
                            <span className="text-blue-700">Time Elapsed</span>
                            <span className="font-semibold text-blue-900">
                              {daysAgo === 0
                                ? 'Today'
                                : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm">
                            <span className="text-blue-700">Time</span>
                            <span className="font-semibold text-blue-900">
                              {appliedDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Employer Details Card */}
                      <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-3 lg:p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-600 lg:h-5 lg:w-5" />
                          <h4 className="text-sm font-semibold text-purple-900 lg:text-base">
                            Employer Info
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs lg:text-sm">
                            <span className="text-purple-700">Posted By</span>
                            <span className="font-semibold text-purple-900">
                              {job.fullName || 'Not specified'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm">
                            <span className="text-purple-700">Location</span>
                            <span className="font-semibold text-purple-900">
                              {job.userLocation || 'Not specified'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* Salary Expectation & Remarks Section */}
                    {(job.salaryExpectation > 0 || job.remarks) && (
                      <div className="mt-3 grid gap-3 lg:mt-4 lg:grid-cols-2 lg:gap-4">
                        {/* Salary Expectation */}
                        {job.salaryExpectation > 0 && (
                          <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50/50 to-emerald-50/30 p-3 lg:p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600 lg:h-5 lg:w-5" />
                              <h4 className="text-sm font-semibold text-green-900 lg:text-base">
                                Your Expectation
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="h-5 w-5 text-green-600" />
                              <span className="text-xl font-bold text-green-700 lg:text-2xl">
                                ₹{job.salaryExpectation.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Remarks */}
                        {job.remarks && (
                          <div
                            className={`rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50/50 to-amber-50/30 p-3 lg:p-4 ${
                              job.salaryExpectation > 0 ? '' : 'lg:col-span-2'
                            }`}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-orange-600 lg:h-5 lg:w-5" />
                              <h4 className="text-sm font-semibold text-orange-900 lg:text-base">
                                Feedback / Remarks
                              </h4>
                            </div>
                            <p className="text-xs leading-relaxed text-orange-800 lg:text-sm">
                              {job.remarks}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Current Status Banner */}
                    <div
                      className={`mt-4 rounded-xl border-2 p-3 lg:mt-5 lg:p-4 ${getStatusColor(job.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/50 lg:h-12 lg:w-12">
                            {getStatusIcon(job.status)}
                          </div>
                          <div>
                            <p className="text-xs font-medium lg:text-sm">
                              Current Status
                            </p>
                            <p className="text-base font-bold lg:text-lg">
                              {job.status}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/professional/jobs`)}
                          className="rounded-lg bg-white/80 px-4 py-2 text-xs font-semibold shadow-sm transition-all hover:bg-white hover:shadow-md lg:px-5 lg:py-2.5 lg:text-sm"
                        >
                          View Similar Jobs
                        </button>
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
