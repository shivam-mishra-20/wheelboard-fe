'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  MapPin,
  Truck,
  CheckCircle2,
  Navigation,
  Star,
  IndianRupee,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  ChevronDown,
  Filter,
} from 'lucide-react';
import Headers from '@/components/Header';
import { companyHomeData } from '@/lib/mockApi';

type TripFilter = 'all' | 'Completed' | 'In-Process' | 'Upcoming' | 'Assigned';
type ChartView = 'trips' | 'earnings' | 'distance';

export default function ProfessionalTripsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<TripFilter>('all');
  const [chartView, setChartView] = useState<ChartView>('trips');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock professional data (in real app, this would come from API based on logged-in user)
  const professionalTrips = companyHomeData.allTrips;

  // Calculate stats
  const stats = useMemo(() => {
    const completed = professionalTrips.filter(
      (t) => t.status === 'Completed'
    ).length;
    const inProgress = professionalTrips.filter(
      (t) => t.status === 'In-Process'
    ).length;
    const upcoming = professionalTrips.filter(
      (t) => t.status === 'Upcoming'
    ).length;
    const assigned = professionalTrips.filter(
      (t) => t.isAssigned && t.status === 'Upcoming'
    ).length;
    const thisMonth = professionalTrips.filter((t) => {
      const tripDate = new Date(t.createdAt);
      const now = new Date();
      return (
        tripDate.getMonth() === now.getMonth() &&
        tripDate.getFullYear() === now.getFullYear()
      );
    }).length;

    // Mock earnings calculation
    const earnings = completed * 1000 + Math.floor(Math.random() * 50000);
    const lastMonthEarnings = earnings - 12000;
    const earningsChange =
      ((earnings - lastMonthEarnings) / lastMonthEarnings) * 100;

    return {
      completed,
      inProgress,
      upcoming,
      assigned,
      thisMonth,
      earnings,
      earningsChange,
    };
  }, [professionalTrips]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    if (selectedFilter === 'all') return professionalTrips;
    if (selectedFilter === 'Assigned')
      return professionalTrips.filter(
        (trip) => trip.isAssigned && trip.status === 'Upcoming'
      );
    return professionalTrips.filter((trip) => trip.status === selectedFilter);
  }, [selectedFilter, professionalTrips]);

  // Advanced Trip completion trend data (last 7 days)
  const trendData = useMemo(() => {
    const baseData = [
      {
        day: 'Mon',
        dayFull: 'Monday',
        trips: 10,
        earnings: 12000,
        distance: 450,
      },
      {
        day: 'Tue',
        dayFull: 'Tuesday',
        trips: 12,
        earnings: 14500,
        distance: 520,
      },
      {
        day: 'Wed',
        dayFull: 'Wednesday',
        trips: 24,
        earnings: 28000,
        distance: 890,
      },
      {
        day: 'Thu',
        dayFull: 'Thursday',
        trips: 19,
        earnings: 22000,
        distance: 680,
      },
      {
        day: 'Fri',
        dayFull: 'Friday',
        trips: 24,
        earnings: 27500,
        distance: 920,
      },
      {
        day: 'Sat',
        dayFull: 'Saturday',
        trips: 24,
        earnings: 26000,
        distance: 850,
      },
      {
        day: 'Sun',
        dayFull: 'Sunday',
        trips: 18,
        earnings: 20000,
        distance: 640,
      },
    ];
    return baseData;
  }, []);

  const maxValue = useMemo(() => {
    if (chartView === 'trips')
      return Math.max(...trendData.map((d) => d.trips));
    if (chartView === 'earnings')
      return Math.max(...trendData.map((d) => d.earnings));
    return Math.max(...trendData.map((d) => d.distance));
  }, [chartView, trendData]);

  // Mock ratings distribution
  const ratings = [
    { stars: 5, percentage: 90, count: 180 },
    { stars: 4, percentage: 25, count: 50 },
    { stars: 3, percentage: 1, count: 2 },
    { stars: 2, percentage: 1, count: 2 },
    { stars: 1, percentage: 2, count: 4 },
  ];

  const totalRatings = ratings.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 pt-20">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#535353]">My Trips</h1>
          <p className="text-gray-600">Track and manage your trip history</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Completed Trips */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-blue-50 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-[#535353]">
                  {stats.completed}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                Completed Trips
              </p>
              <p className="mt-1 text-xs text-gray-500">All time total</p>
            </div>
          </div>

          {/* Earnings */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-green-50 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                  <IndianRupee className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{(stats.earnings / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-600">This Month</p>
              <div className="mt-1 flex items-center gap-1">
                {stats.earningsChange > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={`text-xs font-semibold ${stats.earningsChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {Math.abs(stats.earningsChange).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </div>
          </div>

          {/* Avg Rating */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-yellow-50 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/30">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-4xl font-bold text-[#535353]">4.8</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                Average Rating
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {totalRatings} reviews
              </p>
            </div>
          </div>

          {/* Active Trips */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-red-50 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-lg shadow-[#f36969]/30">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-[#535353]">
                  {stats.inProgress}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                Active Trips
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.upcoming} upcoming
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Trip Completion Trend Chart */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f36969] to-[#f36565]">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#535353]">
                  Performance Analytics
                </h2>
                <p className="text-xs text-gray-500">Last 7 days overview</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setChartView('trips')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  chartView === 'trips'
                    ? 'bg-[#f36969] text-white shadow-md shadow-[#f36969]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Trips
              </button>
              <button
                onClick={() => setChartView('earnings')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  chartView === 'earnings'
                    ? 'bg-[#f36969] text-white shadow-md shadow-[#f36969]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => setChartView('distance')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  chartView === 'distance'
                    ? 'bg-[#f36969] text-white shadow-md shadow-[#f36969]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Distance
              </button>
            </div>
          </div>

          {/* Advanced Chart with hover effects */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute -left-2 top-0 flex h-48 flex-col justify-between text-xs text-gray-400">
              <span>{maxValue}</span>
              <span>{Math.floor(maxValue * 0.75)}</span>
              <span>{Math.floor(maxValue * 0.5)}</span>
              <span>{Math.floor(maxValue * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-8 flex h-48 items-end justify-between gap-2">
              {trendData.map((data, index) => {
                const value =
                  chartView === 'trips'
                    ? data.trips
                    : chartView === 'earnings'
                      ? data.earnings
                      : data.distance;
                const height = (value / maxValue) * 100;
                const isHovered = hoveredBar === index;

                return (
                  <div
                    key={index}
                    className="relative flex flex-1 flex-col items-center"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-20 z-10 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
                        <p className="mb-1 text-xs font-semibold text-[#535353]">
                          {data.dayFull}
                        </p>
                        <div className="space-y-1 text-xs">
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-gray-600">Trips:</span>
                            <span className="font-semibold text-[#535353]">
                              {data.trips}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-gray-600">Earnings:</span>
                            <span className="font-semibold text-green-600">
                              ₹{data.earnings.toLocaleString('en-IN')}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-gray-600">Distance:</span>
                            <span className="font-semibold text-blue-600">
                              {data.distance} km
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bar */}
                    <div className="relative mb-3 flex w-full flex-1 items-end">
                      <div
                        className={`w-full rounded-t-xl bg-gradient-to-t from-[#f36969] to-[#f36565] transition-all duration-300 ${
                          isHovered
                            ? 'opacity-100 shadow-lg shadow-[#f36969]/50'
                            : 'opacity-80'
                        }`}
                        style={{ height: `${height}%` }}
                      >
                        {isHovered && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-[#535353] px-2 py-1 text-xs font-bold text-white">
                            {chartView === 'trips' && data.trips}
                            {chartView === 'earnings' &&
                              `₹${(data.earnings / 1000).toFixed(1)}k`}
                            {chartView === 'distance' && `${data.distance}km`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* X-axis label */}
                    <span
                      className={`text-xs font-medium transition-colors ${isHovered ? 'text-[#f36969]' : 'text-gray-500'}`}
                    >
                      {data.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grid lines */}
            <div className="pointer-events-none absolute left-8 right-0 top-0 h-48">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="absolute w-full border-t border-dashed border-gray-200"
                  style={{ bottom: `${percent}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          {/* Mobile: Collapsible Filter */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#f36969]" />
                <span>
                  {selectedFilter === 'all' ? 'All Trips' : selectedFilter}
                </span>
                <span className="rounded-full bg-[#f36969]/10 px-2 py-0.5 text-xs font-bold text-[#f36969]">
                  {filteredTrips.length}
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Collapsible Filter Options */}
            <div
              className={`grid gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
                isFilterOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {(
                    [
                      'all',
                      'In-Process',
                      'Completed',
                      'Upcoming',
                      'Assigned',
                    ] as TripFilter[]
                  ).map((filter) => {
                    const count =
                      filter === 'all'
                        ? professionalTrips.length
                        : filter === 'Assigned'
                          ? stats.assigned
                          : professionalTrips.filter((t) => t.status === filter)
                              .length;
                    return (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          selectedFilter === filter
                            ? 'bg-[#f36969] text-white shadow-md shadow-[#f36969]/30'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{filter === 'all' ? 'All Trips' : filter}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            selectedFilter === filter
                              ? 'bg-white/20'
                              : 'bg-gray-100'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Horizontal Filter */}
          <div className="hidden gap-2 overflow-x-auto pb-2 lg:flex">
            {(
              [
                'all',
                'In-Process',
                'Completed',
                'Upcoming',
                'Assigned',
              ] as TripFilter[]
            ).map((filter) => {
              const count =
                filter === 'all'
                  ? professionalTrips.length
                  : filter === 'Assigned'
                    ? stats.assigned
                    : professionalTrips.filter((t) => t.status === filter)
                        .length;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                    selectedFilter === filter
                      ? 'bg-[#f36969] text-white shadow-md shadow-[#f36969]/30'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filter === 'all' ? 'All Trips' : filter}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${selectedFilter === filter ? 'bg-white/20' : 'bg-gray-100'}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Trips Section */}
        {(selectedFilter === 'all' || selectedFilter === 'In-Process') && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-[#535353]">Active Trips</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                {
                  filteredTrips.filter((trip) => trip.status === 'In-Process')
                    .length
                }
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredTrips
                .filter((trip) => trip.status === 'In-Process')
                .map((trip) => (
                  <div
                    key={trip.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-xl"
                  >
                    {/* Animated background */}
                    <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-blue-50 opacity-0 transition-all group-hover:opacity-100"></div>

                    <div className="relative">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[#535353]">
                              {trip.from}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Today, {trip.departureTime}</span>
                            </div>
                          </div>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
                          In Transit
                        </span>
                      </div>

                      {/* Route Divider */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                        <Truck className="h-5 w-5 text-[#f36969]" />
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                      </div>

                      {/* Destination */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                            <Navigation className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[#535353]">
                              {trip.to}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {trip.vehicle.registrationNumber}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      {trip.progress && (
                        <div className="mb-4 rounded-xl bg-gray-50 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">
                              Progress
                            </span>
                            <span className="text-lg font-bold text-[#f36969]">
                              {trip.progress}%
                            </span>
                          </div>
                          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#f36969] to-[#f36565] shadow-lg shadow-[#f36969]/50 transition-all duration-500"
                              style={{ width: `${trip.progress}%` }}
                            ></div>
                          </div>
                          {trip.eta && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>ETA: {trip.eta}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() =>
                          router.push(`/professional/trips/${trip.id}/progress`)
                        }
                        className="w-full rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Completed Trips Section */}
        {(selectedFilter === 'all' || selectedFilter === 'Completed') && (
          <div>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-[#535353]">
                  Completed Trips
                </h2>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                  {
                    filteredTrips.filter((trip) => trip.status === 'Completed')
                      .length
                  }
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTrips
                .filter((trip) => trip.status === 'Completed')
                .slice(0, 5)
                .map((trip, index) => (
                  <div
                    key={trip.id}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:shadow-lg"
                    onClick={() =>
                      router.push(`/professional/trips/${trip.id}/progress`)
                    }
                  >
                    <div className="flex items-center justify-between gap-2 md:gap-4">
                      {/* Left Section */}
                      <div className="flex flex-1 items-center gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                          <CheckCircle2 className="h-7 w-7 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="text-md font-bold text-[#535353] md:text-lg">
                              {trip.from}
                            </h3>
                            <span className="font-bold text-gray-600">→</span>
                            <h3 className="text-md font-bold text-[#535353] md:text-lg">
                              {trip.to}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{trip.departureDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Navigation className="h-3 w-3" />
                              <span>{trip.distance}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col items-end gap-4">
                        <span className="text-xl font-bold text-green-600 md:text-2xl">
                          +₹{(index + 1) * 1200 + 200}
                        </span>
                        <div className="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="ml-1 text-xs font-bold text-yellow-700">
                            5.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Ratings Summary Card */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#535353]">
                    Rating Overview
                  </h3>
                  <p className="text-xs text-gray-500">
                    Based on {totalRatings} reviews
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {ratings.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-4">
                    <div className="flex w-20 items-center justify-end gap-1">
                      {[...Array(rating.stars)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex w-20 items-center justify-between text-xs">
                      <span className="font-bold text-gray-700">
                        {rating.percentage}%
                      </span>
                      <span className="text-gray-500">({rating.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Trips */}
        {(selectedFilter === 'all' || selectedFilter === 'Upcoming') && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-[#535353]">
                Upcoming Trips
              </h2>
              <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-600">
                {
                  filteredTrips.filter((trip) => trip.status === 'Upcoming')
                    .length
                }
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredTrips
                .filter((trip) => trip.status === 'Upcoming')
                .map((trip) => (
                  <div
                    key={trip.id}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg"
                    onClick={() =>
                      router.push(`/professional/trips/${trip.id}/progress`)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/30">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#535353]">
                            {trip.from} → {trip.to}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {trip.departureDate} • {trip.departureTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
                        Upcoming
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Assigned Trips Section */}
        {(selectedFilter === 'all' || selectedFilter === 'Assigned') && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-[#535353]">
                Assigned Trips
              </h2>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-600">
                {
                  filteredTrips.filter(
                    (trip) => trip.isAssigned && trip.status === 'Upcoming'
                  ).length
                }
              </span>
            </div>

            {filteredTrips.filter(
              (trip) => trip.isAssigned && trip.status === 'Upcoming'
            ).length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Truck className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#535353]">
                  No Assigned Trips
                </h3>
                <p className="text-sm text-gray-500">
                  Trips assigned by companies will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredTrips
                  .filter(
                    (trip) => trip.isAssigned && trip.status === 'Upcoming'
                  )
                  .map((trip) => (
                    <div
                      key={trip.id}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg"
                      onClick={() =>
                        router.push(`/professional/trips/${trip.id}/progress`)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[#535353]">
                              {trip.from} → {trip.to}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>
                                {trip.departureDate} • {trip.departureTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusColor(trip.status)}`}
                        >
                          {getStatusLabel(trip.status)}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            {trip.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            {trip.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'In-Process':
      return 'bg-blue-100 text-blue-700';
    case 'Completed':
      return 'bg-green-100 text-green-700';
    case 'Upcoming':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getStatusLabel(status: string) {
  if (status === 'In-Process') return 'In Progress';
  return status;
}
