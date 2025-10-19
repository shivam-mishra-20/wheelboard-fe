'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { companyHomeData, DetailedJob } from '@/lib/mockApi';
import Headers from '@/components/Header';
import JobApplicationModal from '@/components/professional/JobApplicationModal';

type SearchCategory = 'all' | 'jobs' | 'trips';
type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
type TripStatus = 'Completed' | 'In-Process' | 'Upcoming';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<SearchCategory>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [selectedTripStatus, setSelectedTripStatus] = useState<TripStatus[]>(
    []
  );
  const [selectedJob, setSelectedJob] = useState<DetailedJob | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const jobs = companyHomeData.allJobs;
  const trips = companyHomeData.allTrips;

  // Filter logic
  const filteredResults = useMemo(() => {
    let filteredJobs = jobs;
    let filteredTrips = trips;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredJobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.department.toLowerCase().includes(query)
      );
      filteredTrips = trips.filter(
        (trip) =>
          trip.title.toLowerCase().includes(query) ||
          trip.from.toLowerCase().includes(query) ||
          trip.to.toLowerCase().includes(query)
      );
    }

    // Job type filter
    if (selectedJobTypes.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        selectedJobTypes.includes(job.type)
      );
    }

    // Trip status filter
    if (selectedTripStatus.length > 0) {
      filteredTrips = filteredTrips.filter((trip) =>
        selectedTripStatus.includes(trip.status)
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

  const toggleJobType = (type: JobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleTripStatus = (status: TripStatus) => {
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

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      {/* Header */}
      <Headers />
      {/* Main */}
      <div className="sticky top-14 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#535353]">Job Board</h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Jobs or Trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-[#535353] placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#f36969]"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 ${
                showFilters ? 'text-[#f36969]' : 'text-gray-400'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#f36969] text-white'
                  : 'bg-gray-100 text-[#535353] hover:bg-gray-200'
              }`}
            >
              All ({filteredResults.jobs.length + filteredResults.trips.length})
            </button>
            <button
              onClick={() => setSelectedCategory('jobs')}
              className={`whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                selectedCategory === 'jobs'
                  ? 'bg-[#f36969] text-white'
                  : 'bg-gray-100 text-[#535353] hover:bg-gray-200'
              }`}
            >
              Jobs ({filteredResults.jobs.length})
            </button>
            <button
              onClick={() => setSelectedCategory('trips')}
              className={`whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                selectedCategory === 'trips'
                  ? 'bg-[#f36969] text-white'
                  : 'bg-gray-100 text-[#535353] hover:bg-gray-200'
              }`}
            >
              Trips ({filteredResults.trips.length})
            </button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#535353]">Filters:</span>
              {selectedJobTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f36969] px-3 py-1 text-sm text-white"
                >
                  {type}
                  <button onClick={() => toggleJobType(type)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {selectedTripStatus.map((status) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f36969] px-3 py-1 text-sm text-white"
                >
                  {status}
                  <button onClick={() => toggleTripStatus(status)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#f36969] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-12 border-b border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Job Filters */}
              {(selectedCategory === 'all' || selectedCategory === 'jobs') && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#535353]">
                    Job Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'Full-time',
                        'Part-time',
                        'Contract',
                        'Freelance',
                      ] as JobType[]
                    ).map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleJobType(type)}
                        className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                          selectedJobTypes.includes(type)
                            ? 'bg-[#f36969] text-white'
                            : 'border border-gray-200 bg-white text-[#535353] hover:border-[#f36969]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trip Filters */}
              {(selectedCategory === 'all' || selectedCategory === 'trips') && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#535353]">
                    Trip Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ['Completed', 'In-Process', 'Upcoming'] as TripStatus[]
                    ).map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleTripStatus(status)}
                        className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                          selectedTripStatus.includes(status)
                            ? 'bg-[#f36969] text-white'
                            : 'border border-gray-200 bg-white text-[#535353] hover:border-[#f36969]'
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
        <p className="mb-4 text-sm text-gray-500">
          {totalResults} result{totalResults !== 1 ? 's' : ''} found
        </p>

        {/* Jobs Section */}
        {(selectedCategory === 'all' || selectedCategory === 'jobs') &&
          filteredResults.jobs.length > 0 && (
            <div className="mb-8">
              {selectedCategory === 'all' && (
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#535353]">
                  <Briefcase className="h-5 w-5" />
                  Jobs
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {filteredResults.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-[#f36565] transition-colors group-hover:text-[#f36969]">
                          {job.title}
                        </h3>
                        <p className="text-sm text-[#535353]">
                          {job.department}
                        </p>
                      </div>
                      {job.urgent && (
                        <span className="rounded-full bg-[#f36969] px-2 py-1 text-xs text-white">
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-[#535353]" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-[#535353]" />
                        <span>{job.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-sm font-semibold text-[#f36565]">
                        {job.salary}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsApplicationModalOpen(true);
                        }}
                        className="rounded-lg bg-[#f36969] px-4 py-2 text-sm text-white transition-colors hover:bg-[#f36565]"
                      >
                        Apply now
                      </button>
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
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#535353]">
                  <Truck className="h-5 w-5" />
                  Trips
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {filteredResults.trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-40">
                      <Image
                        src={trip.image}
                        alt={trip.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute right-3 top-3 flex gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            trip.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : trip.status === 'In-Process'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {trip.status}
                        </span>
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#f36969] backdrop-blur-sm">
                          {trip.deliveryType}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="mb-3 text-lg font-semibold text-[#f36565] transition-colors group-hover:text-[#f36969]">
                        {trip.title}
                      </h3>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#535353]" />
                          <div>
                            <p className="font-medium text-[#535353]">
                              {trip.from} → {trip.to}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trip.distance} • {trip.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-[#535353]" />
                          <span>
                            {trip.departureDate} • {trip.departureTime}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          router.push(`/professional/trips/${trip.id}`)
                        }
                        className="w-full rounded-lg bg-[#f36969] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#f36565]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* No Results */}
        {totalResults === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#535353]">
              No results found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you&apos;re
              looking for
            </p>
          </div>
        )}
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
        />
      )}
    </div>
  );
}
