'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Briefcase,
  Truck,
  X,
  IndianRupee,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

type SearchCategory = 'all' | 'jobs' | 'trips';

interface Job {
  jobId: string;
  role: string;
  jobDuration: string;
  openings: number;
  salary: number;
  city: string;
  jobType: string;
  description: string;
  imagePaths: string[];
  isApplied: boolean;
  likeCount: number;
  isLiked: boolean;
}

interface Trip {
  tripId: string;
  tripCode: string;
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  tripStatus: string;
  tripType: string;
  payRange: string | null;
}

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<SearchCategory>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedTripStatus, setSelectedTripStatus] = useState<string[]>([]);

  // Data states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoadingJobs(true);
        const user = api.getCurrentUser();
        const response = await wheelboardApi.job.getOpenJobList(user?.id);
        console.log('✅ Jobs Response:', response);

        const jobsData: Job[] = Array.isArray(response)
          ? response
          : ((response?.data || []) as Job[]);
        setJobs(jobsData);
      } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        setJobs([]);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoadingTrips(true);
        const response = await wheelboardApi.trip.getUnassignedTrips();
        console.log('✅ Trips Response:', response);

        const tripsData: Trip[] = Array.isArray(response)
          ? response
          : ((response?.data || []) as Trip[]);
        setTrips(tripsData);
      } catch (error) {
        console.error('❌ Error fetching trips:', error);
        setTrips([]);
      } finally {
        setIsLoadingTrips(false);
      }
    };

    fetchTrips();
  }, []);

  // Filter logic
  const filteredResults = useMemo(() => {
    let filteredJobs = jobs;
    let filteredTrips = trips;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredJobs = jobs.filter(
        (job) =>
          job.role?.toLowerCase().includes(query) ||
          job.city?.toLowerCase().includes(query) ||
          job.jobType?.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query)
      );
      filteredTrips = trips.filter(
        (trip) =>
          trip.pickupLocation?.toLowerCase().includes(query) ||
          trip.destination?.toLowerCase().includes(query) ||
          trip.tripCode?.toLowerCase().includes(query)
      );
    }

    // Job type filter
    if (selectedJobTypes.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        selectedJobTypes.some((type) =>
          job.jobType?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    // Trip status filter
    if (selectedTripStatus.length > 0) {
      filteredTrips = filteredTrips.filter((trip) =>
        selectedTripStatus.some(
          (status) => trip.tripStatus?.toLowerCase() === status.toLowerCase()
        )
      );
    }

    return { jobs: filteredJobs, trips: filteredTrips };
  }, [searchQuery, selectedJobTypes, selectedTripStatus, jobs, trips]);

  const totalResults =
    selectedCategory === 'all'
      ? filteredResults.jobs.length + filteredResults.trips.length
      : selectedCategory === 'jobs'
        ? filteredResults.jobs.length
        : filteredResults.trips.length;

  const toggleJobType = (type: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleTripStatus = (status: string) => {
    setSelectedTripStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedTripStatus([]);
  };

  const hasActiveFilters =
    selectedJobTypes.length > 0 || selectedTripStatus.length > 0;

  const handleApplyJob = async (jobId: string) => {
    try {
      const user = api.getCurrentUser();
      if (!user?.id) {
        alert('Please log in to apply for jobs');
        return;
      }

      await wheelboardApi.job.applyJob({ jobId, userId: user.id });
      alert('Application submitted successfully!');

      // Update local state
      setJobs(
        jobs.map((job) =>
          job.jobId === jobId ? { ...job, isApplied: true } : job
        )
      );
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application');
    }
  };

  const isLoading = isLoadingJobs || isLoadingTrips;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="pt-16">
        {/* Search Header */}
        <div className="sticky top-14 z-20 border-b-2 border-gray-100 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:py-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#535353] lg:text-3xl">
                  Search
                </h1>
                <p className="mt-1 text-sm text-gray-600 lg:text-base">
                  Find jobs and trips that match your skills
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, trips, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-12 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:py-3.5"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition-colors ${
                  showFilters
                    ? 'bg-[#f36969] text-white'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition-all lg:text-base ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md shadow-[#f36969]/20'
                    : 'bg-white text-[#535353] hover:bg-gray-50'
                }`}
              >
                All (
                {filteredResults.jobs.length + filteredResults.trips.length})
              </button>
              <button
                onClick={() => setSelectedCategory('jobs')}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition-all lg:text-base ${
                  selectedCategory === 'jobs'
                    ? 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md shadow-[#f36969]/20'
                    : 'bg-white text-[#535353] hover:bg-gray-50'
                }`}
              >
                Jobs ({filteredResults.jobs.length})
              </button>
              <button
                onClick={() => setSelectedCategory('trips')}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition-all lg:text-base ${
                  selectedCategory === 'trips'
                    ? 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md shadow-[#f36969]/20'
                    : 'bg-white text-[#535353] hover:bg-gray-50'
                }`}
              >
                Trips ({filteredResults.trips.length})
              </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[#535353]">
                  Active Filters:
                </span>
                {selectedJobTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#f36969] px-3 py-1.5 text-sm font-medium text-white"
                  >
                    {type}
                    <button onClick={() => toggleJobType(type)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                {selectedTripStatus.map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#f36969] px-3 py-1.5 text-sm font-medium text-white"
                  >
                    {status}
                    <button onClick={() => toggleTripStatus(status)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-[#f36969] hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-b-2 border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Job Filters */}
                {(selectedCategory === 'all' ||
                  selectedCategory === 'jobs') && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-[#535353] lg:text-base">
                      Job Type
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Technician', 'Driver', 'Mechanic', 'Helper'].map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => toggleJobType(type)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all lg:text-base ${
                              selectedJobTypes.includes(type)
                                ? 'bg-[#f36969] text-white shadow-md'
                                : 'border-2 border-gray-200 bg-white text-[#535353] hover:border-[#f36969]'
                            }`}
                          >
                            {type}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Trip Filters */}
                {(selectedCategory === 'all' ||
                  selectedCategory === 'trips') && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-[#535353] lg:text-base">
                      Trip Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Upcoming', 'Pending', 'Active'].map((status) => (
                        <button
                          key={status}
                          onClick={() => toggleTripStatus(status)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all lg:text-base ${
                            selectedTripStatus.includes(status)
                              ? 'bg-[#f36969] text-white shadow-md'
                              : 'border-2 border-gray-200 bg-white text-[#535353] hover:border-[#f36969]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]" />
                <p className="text-base font-semibold text-gray-700">
                  Loading results...
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm font-medium text-gray-600 lg:text-base">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </p>

              {/* Jobs Section */}
              {(selectedCategory === 'all' || selectedCategory === 'jobs') &&
                filteredResults.jobs.length > 0 && (
                  <div className="mb-8">
                    {selectedCategory === 'all' && (
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#535353] lg:text-2xl">
                        <Briefcase className="h-6 w-6 text-[#f36969]" />
                        Available Jobs
                      </h2>
                    )}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {filteredResults.jobs.map((job) => (
                        <div
                          key={job.jobId}
                          className="group overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all hover:border-[#f36969]/20 hover:shadow-xl"
                        >
                          {/* Job Image */}
                          {job.imagePaths && job.imagePaths[0] && (
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                              <Image
                                src={job.imagePaths[0]}
                                alt={job.role}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}

                          <div className="p-4 lg:p-5">
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="mb-1 text-lg font-bold text-[#535353] transition-colors group-hover:text-[#f36969] lg:text-xl">
                                  {job.role}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    {job.jobType}
                                  </span>
                                  {job.isApplied && (
                                    <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                      Applied
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="mb-4 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-[#f36969]" />
                                <span className="font-medium">{job.city}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4 text-[#f36969]" />
                                <span className="font-medium">
                                  {job.jobDuration}
                                </span>
                              </div>
                              {job.openings > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <TrendingUp className="h-4 w-4 text-[#f36969]" />
                                  <span className="font-medium">
                                    {job.openings} openings
                                  </span>
                                </div>
                              )}
                            </div>

                            {job.description && (
                              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                {job.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4">
                              <div className="flex items-center gap-1.5">
                                <IndianRupee className="h-5 w-5 text-green-600" />
                                <span className="text-lg font-bold text-green-700 lg:text-xl">
                                  {job.salary.toLocaleString()}
                                </span>
                              </div>
                              <button
                                onClick={() => handleApplyJob(job.jobId)}
                                disabled={job.isApplied}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all lg:px-5 lg:py-2.5 ${
                                  job.isApplied
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    : 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md hover:shadow-lg'
                                }`}
                              >
                                {job.isApplied ? 'Applied' : 'Apply Now'}
                                {!job.isApplied && (
                                  <ArrowRight className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Trips Section */}
              {(selectedCategory === 'all' || selectedCategory === 'trips') &&
                filteredResults.trips.length > 0 && (
                  <div>
                    {selectedCategory === 'all' && (
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#535353] lg:text-2xl">
                        <Truck className="h-6 w-6 text-[#f36969]" />
                        Available Trips
                      </h2>
                    )}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {filteredResults.trips.map((trip) => (
                        <div
                          key={trip.tripId}
                          className="group overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all hover:border-[#f36969]/20 hover:shadow-xl"
                        >
                          <div className="p-4 lg:p-5">
                            <div className="mb-4 flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f36969] to-[#f36565]">
                                  <Truck className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">
                                    Trip Code
                                  </p>
                                  <p className="text-base font-bold text-[#535353]">
                                    {trip.tripCode || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              {trip.tripStatus && (
                                <span
                                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                    trip.tripStatus === 'Upcoming'
                                      ? 'bg-blue-50 text-blue-700'
                                      : trip.tripStatus === 'Pending'
                                        ? 'bg-yellow-50 text-yellow-700'
                                        : 'bg-green-50 text-green-700'
                                  }`}
                                >
                                  {trip.tripStatus}
                                </span>
                              )}
                            </div>
                            <div className="mb-4 space-y-3">
                              <div className="rounded-xl bg-gray-50 p-3">
                                <div className="flex items-start gap-2">
                                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#f36969]" />
                                  <div className="flex-1">
                                    <p className="mb-1 text-sm font-semibold text-[#535353]">
                                      {trip.pickupLocation}
                                    </p>
                                    <div className="mb-1 flex items-center gap-2">
                                      <div className="h-px flex-1 bg-gray-300" />
                                      <ArrowRight className="h-4 w-4 text-gray-400" />
                                      <div className="h-px flex-1 bg-gray-300" />
                                    </div>
                                    <p className="text-sm font-semibold text-[#535353]">
                                      {trip.destination}
                                    </p>
                                  </div>
                                </div>
                                {trip.tripType && (
                                  <p className="mt-2 text-xs text-gray-600">
                                    Type: {trip.tripType}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-[#f36969]" />
                                <span className="font-medium">
                                  {new Date(trip.pickupDate).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    }
                                  )}{' '}
                                  • {trip.pickupTime}
                                </span>
                              </div>
                            </div>
                            {trip.payRange && (
                              <div className="mb-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-green-700">
                                    Pay Range
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold text-green-700">
                                      {trip.payRange}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}{' '}
                            <button
                              onClick={() =>
                                router.push(
                                  `/professional/trips/${trip.tripId}`
                                )
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                            >
                              View Details
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* No Results */}
              {totalResults === 0 && !isLoading && (
                <div className="rounded-2xl border-2 border-gray-100 bg-white py-16 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#535353] lg:text-2xl">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filters to find what
                    you&apos;re looking for
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
