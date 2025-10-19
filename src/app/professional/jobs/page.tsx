'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Search,
  Filter,
  ChevronDown,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  Building2,
  Bookmark,
  Send,
  Eye,
  BookmarkCheck,
  X,
} from 'lucide-react';
import Headers from '@/components/Header';
import { companyHomeData } from '@/lib/mockApi';
import type { DetailedJob } from '@/lib/mockApi';

type JobFilter = 'all' | 'Active' | 'Paused' | 'Closed';
type JobTypeFilter =
  | 'all'
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Freelance';

export default function ProfessionalJobsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<JobFilter>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] =
    useState<JobTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>(['job-1']); // Mock saved jobs
  const [appliedJobs, setAppliedJobs] = useState<string[]>(['job-2']); // Mock applied jobs
  const [selectedJob, setSelectedJob] = useState<DetailedJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    experience: '',
    expectedSalary: '',
  });

  const allJobs = companyHomeData.allJobs;

  // Calculate stats
  const stats = useMemo(() => {
    const totalJobs = allJobs.filter((job) => job.status === 'Active').length;
    const appliedCount = appliedJobs.length;
    const savedCount = savedJobs.length;
    const urgentJobs = allJobs.filter(
      (job) => job.urgent && job.status === 'Active'
    ).length;

    return {
      totalJobs,
      appliedCount,
      savedCount,
      urgentJobs,
    };
  }, [allJobs, appliedJobs.length, savedJobs.length]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    let filtered = allJobs;

    // Status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((job) => job.status === selectedFilter);
    }

    // Type filter
    if (selectedTypeFilter !== 'all') {
      filtered = filtered.filter((job) => job.type === selectedTypeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.department.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedFilter, selectedTypeFilter, searchQuery, allJobs]);

  // Sort jobs: urgent first, then by date
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredJobs]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyClick = (job: DetailedJob) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    if (
      selectedJob &&
      applicationData.coverLetter &&
      applicationData.experience
    ) {
      setAppliedJobs((prev) => [...prev, selectedJob.id]);
      setIsApplyModalOpen(false);
      setApplicationData({
        coverLetter: '',
        experience: '',
        expectedSalary: '',
      });
      setSelectedJob(null);
      // In a real app, this would make an API call
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'Closed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 py-4 pt-16 lg:px-4 lg:py-6 lg:pt-20">
        {/* Header */}
        <div className="mb-4 lg:mb-6">
          <h1 className="text-2xl font-bold text-[#535353] lg:text-4xl">
            Browse Jobs
          </h1>
          <p className="mt-1 text-sm text-gray-600 lg:mt-2 lg:text-lg">
            Find your next opportunity from {allJobs.length} available positions
          </p>
        </div>

        {/* Stats Cards */}
        {/* Stats Grid */}
        <div className="mb-4 grid grid-cols-2 gap-2 lg:mb-6 lg:grid-cols-4 lg:gap-4">
          <button
            onClick={() => router.push('/professional/jobs')}
            className="rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:scale-105 hover:border-[#f36969] hover:shadow-lg lg:rounded-2xl lg:p-6"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-lg shadow-[#f36969]/30 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <Briefcase className="h-5 w-5 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-xs text-gray-500 lg:text-sm">All Jobs</p>
            <p className="text-xl font-bold text-[#535353] lg:text-3xl">
              {stats.totalJobs}
            </p>
          </button>

          <button
            onClick={() => router.push('/professional/jobs/applied')}
            className="rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:scale-105 hover:border-blue-300 hover:shadow-lg lg:rounded-2xl lg:p-6"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <Send className="h-5 w-5 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-xs text-gray-500 lg:text-sm">Applied</p>
            <p className="text-xl font-bold text-[#535353] lg:text-3xl">
              {stats.appliedCount}
            </p>
          </button>

          <button
            onClick={() => router.push('/professional/jobs/saved')}
            className="rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:scale-105 hover:border-purple-300 hover:shadow-lg lg:rounded-2xl lg:p-6"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <BookmarkCheck className="h-5 w-5 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-xs text-gray-500 lg:text-sm">Saved</p>
            <p className="text-xl font-bold text-[#535353] lg:text-3xl">
              {stats.savedCount}
            </p>
          </button>

          <button
            onClick={() => router.push('/professional/jobs/urgent')}
            className="rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:scale-105 hover:border-orange-300 hover:shadow-lg lg:rounded-2xl lg:p-6"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <TrendingUp className="h-5 w-5 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-xs text-gray-500 lg:text-sm">Urgent</p>
            <p className="text-xl font-bold text-[#535353] lg:text-3xl">
              {stats.urgentJobs}
            </p>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:mb-6 lg:rounded-2xl lg:p-6">
          {/* Search Bar */}
          <div className="mb-3 flex flex-col gap-2 lg:mb-4 lg:flex-row lg:items-center lg:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 lg:left-4 lg:h-5 lg:w-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:rounded-xl lg:py-3 lg:pl-12 lg:pr-4 lg:text-base"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:text-[#f36969] lg:rounded-xl lg:px-6 lg:py-3 lg:text-base"
            >
              <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform lg:h-5 lg:w-5 ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Filter Options - Collapsible */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isFilterOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-3 border-t border-gray-100 pt-3 lg:space-y-4 lg:pt-4">
              {/* Status Filter */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-700 lg:text-sm">
                  Job Status
                </p>
                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                  {['all', 'Active', 'Paused', 'Closed'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter as JobFilter)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all lg:px-4 lg:py-2 lg:text-sm ${
                        selectedFilter === filter
                          ? 'bg-[#f36969] text-white shadow-lg shadow-[#f36969]/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter === 'all' ? 'All Status' : filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-700 lg:text-sm">
                  Job Type
                </p>
                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                  {[
                    'all',
                    'Full-time',
                    'Part-time',
                    'Contract',
                    'Freelance',
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setSelectedTypeFilter(type as JobTypeFilter)
                      }
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all lg:px-4 lg:py-2 lg:text-sm ${
                        selectedTypeFilter === type
                          ? 'bg-[#f36969] text-white shadow-lg shadow-[#f36969]/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 lg:text-base">
            Showing{' '}
            <span className="font-semibold text-[#535353]">
              {sortedJobs.length}
            </span>{' '}
            {sortedJobs.length === 1 ? 'job' : 'jobs'}
          </p>
          {(searchQuery ||
            selectedFilter !== 'all' ||
            selectedTypeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
                setSelectedTypeFilter('all');
              }}
              className="text-sm font-medium text-[#f36969] hover:underline lg:text-base"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Jobs List */}
        {sortedJobs.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div>
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-[#535353]">
                No jobs found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters to find more opportunities
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {sortedJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              const isApplied = appliedJobs.includes(job.id);
              const daysAgo = Math.floor(
                (new Date().getTime() - new Date(job.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={job.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg lg:rounded-2xl"
                >
                  {/* Urgent Badge */}
                  {job.urgent && (
                    <div className="absolute right-0 top-0 z-10">
                      <div className="rounded-bl-xl bg-gradient-to-br from-orange-500 to-orange-600 px-2.5 py-1 shadow-lg lg:rounded-bl-2xl lg:px-4 lg:py-2">
                        <p className="text-[10px] font-bold text-white lg:text-xs">
                          URGENT
                        </p>
                      </div>
                    </div>
                  )}

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
                            {isApplied && (
                              <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 lg:gap-1 lg:px-3 lg:py-1 lg:text-xs">
                                <CheckCircle2 className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                                Applied
                              </span>
                            )}
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
                              <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
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
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold lg:px-3 lg:py-1 lg:text-xs ${getStatusColor(job.status)}`}
                            >
                              {job.status}
                            </span>
                            <div className="flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 lg:gap-1 lg:px-3 lg:py-1 lg:text-xs">
                              <IndianRupee className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                              {job.salary}
                            </div>
                          </div>

                          {/* Stats - Mobile */}
                          <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-500 lg:hidden">
                            <div className="flex items-center gap-0.5">
                              <Eye className="h-3 w-3" />
                              {job.views}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Users className="h-3 w-3" />
                              {job.applications.length}
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

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
                              isSaved
                                ? 'border-[#f36969] bg-[#f36969] text-white'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-[#f36969] hover:text-[#f36969]'
                            }`}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="h-5 w-5" />
                            ) : (
                              <Bookmark className="h-5 w-5" />
                            )}
                          </button>
                          {job.status === 'Active' && (
                            <button
                              onClick={() => handleApplyClick(job)}
                              disabled={isApplied}
                              className={`rounded-lg px-6 py-2 font-semibold transition-all ${
                                isApplied
                                  ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                  : 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-lg shadow-[#f36969]/30 hover:shadow-xl'
                              }`}
                            >
                              {isApplied ? 'Applied' : 'Apply Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile */}
                    <div className="mt-3 flex gap-2 lg:hidden">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                          isSaved
                            ? 'border-[#f36969] bg-[#f36969] text-white'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-[#f36969] hover:text-[#f36969]'
                        }`}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                      {job.status === 'Active' && (
                        <button
                          onClick={() => handleApplyClick(job)}
                          disabled={isApplied}
                          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                            isApplied
                              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                              : 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md shadow-[#f36969]/20'
                          }`}
                        >
                          {isApplied ? 'Applied' : 'Apply Now'}
                        </button>
                      )}
                    </div>

                    {/* Expandable Details */}
                    <details className="group/details mt-4">
                      <summary className="cursor-pointer text-sm font-semibold text-[#f36969] hover:underline">
                        View Details
                      </summary>
                      <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                        {/* Requirements */}
                        <div>
                          <h4 className="mb-2 text-sm font-bold text-[#535353]">
                            Requirements:
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {job.requirements.map((req, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="mb-2 text-sm font-bold text-[#535353]">
                            Benefits:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.benefits.map((benefit, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-[#535353]">
                  Apply for Job
                </h2>
                <p className="text-sm text-gray-500">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setSelectedJob(null);
                  setApplicationData({
                    coverLetter: '',
                    experience: '',
                    expectedSalary: '',
                  });
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Years of Experience *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 5 years"
                    value={applicationData.experience}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        experience: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                  />
                </div>

                {/* Expected Salary */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Expected Salary (Optional)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g., 5,00,000/year"
                      value={applicationData.expectedSalary}
                      onChange={(e) =>
                        setApplicationData({
                          ...applicationData,
                          expectedSalary: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Cover Letter *
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us why you're a great fit for this role..."
                    value={applicationData.coverLetter}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        coverLetter: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                  />
                </div>

                {/* Info Box */}
                <div className="rounded-xl bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold">Application Tips:</p>
                      <ul className="mt-2 list-inside list-disc space-y-1">
                        <li>Highlight your relevant experience</li>
                        <li>Be specific about your skills</li>
                        <li>Show enthusiasm for the role</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setSelectedJob(null);
                  setApplicationData({
                    coverLetter: '',
                    experience: '',
                    expectedSalary: '',
                  });
                }}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={
                  !applicationData.coverLetter || !applicationData.experience
                }
                className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
