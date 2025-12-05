'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Img from 'next/image';
import {
  ArrowLeft,
  Truck,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  MapPin,
  Star,
  ThumbsUp,
  Building,
  Eye,
  Edit,
  Share2,
  Fuel,
  Settings,
  Plus,
  Timer,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import { companyDashboardData } from '@/lib/mockApi';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

// Dashboard data interface
interface DashboardData {
  stats: {
    activeTrips: {
      value: number;
      scheduledToday: number;
      inMaintenance: number;
    };
    monthlyExpenses: { value: number; highestSpending: string };
    tripEfficiency: { value: string; unit: string };
    vehiclesOnRent: { value: number };
  };
  vehicleAvailability: { available: number; onTrip: number; onRent: number };
  topRated: {
    drivers: Array<{
      id: string;
      name: string;
      role: string;
      location: string;
      avatar: string;
      rating: number;
    }>;
    technicians: Array<{
      id: string;
      name: string;
      role: string;
      location: string;
      avatar: string;
      rating: number;
    }>;
    helpers: Array<{
      id: string;
      name: string;
      role: string;
      location: string;
      avatar: string;
      rating: number;
    }>;
  };
  jobsPosted: Array<{
    id: string;
    title: string;
    applicants: number;
    likes: number;
  }>;
  expenseOverview: {
    total: string | number;
    categories: Array<{ category: string; amount: number; color: string }>;
  };
  recentTransactions: Array<{
    id: string;
    type: string;
    date: string;
    description: string;
    amount: number;
  }>;
  assignedServices: Array<{
    id: string;
    title: string;
    status: string;
    description: string;
    updatedAt: string;
    backgroundColor: string;
  }>;
  tripCompletionTrend: Array<{ day: string; trips: number }>;
  upcomingTrips: Array<{
    id: string;
    title: string;
    time: string;
    route: string;
    driver: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'Drivers' | 'Technicians' | 'Helpers'
  >('Drivers');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const user = api.getCurrentUser();

        if (!user?.id) {
          // Use mock data if no user
          setDashboardData(companyDashboardData as unknown as DashboardData);
          setIsLoading(false);
          return;
        }

        const response = await wheelboardApi.dashboard.getDashboard(user.id);

        if (response.success && response.data) {
          // Map API response to our expected format
          const apiData = response.data as any;

          // Transform topProfessionals to topRated format (group by type)
          const drivers: DashboardData['topRated']['drivers'] = [];
          const technicians: DashboardData['topRated']['technicians'] = [];
          const helpers: DashboardData['topRated']['helpers'] = [];

          if (apiData.topProfessionals) {
            apiData.topProfessionals.forEach((p: any, idx: number) => {
              const professional = {
                id: `prof-${idx}`,
                name: p.fullName || 'Unknown',
                role: p.professionalType || 'Professional',
                location: p.city || 'Unknown',
                avatar:
                  p.driverImagePath?.replace(/\\/g, '/') || '/profile-pic.png',
                rating: 4.5, // Default rating if not provided
              };
              const type = (p.professionalType || '').toLowerCase();
              if (type === 'technician') {
                technicians.push(professional);
              } else if (type === 'helper') {
                helpers.push(professional);
              } else {
                drivers.push(professional);
              }
            });
          }

          // Transform jobList to jobsPosted format
          const jobsPosted =
            apiData.jobList?.map((j: any) => ({
              id: j.jobId,
              title: `${j.role} - ${j.jobType}`,
              applicants: j.applicants || 0,
              likes: j.likeCount || 0,
            })) || companyDashboardData.jobsPosted;

          // Transform assignedServices
          const assignedServices =
            apiData.assignedServices?.map((s: any) => ({
              id: s.serviceId,
              title: s.serviceTitle,
              status: 'Active',
              description: s.category || 'Service',
              updatedAt: s.dateModified,
              backgroundColor: '#fff4f4',
            })) || companyDashboardData.assignedServices;

          // Transform upcomingTrips
          const upcomingTrips =
            apiData.upcomingTrips?.map((t: any) => ({
              id: t.tripId,
              title: t.tripCode,
              time: t.pickupTime
                ? new Date(`1970-01-01T${t.pickupTime}`).toLocaleTimeString(
                    'en-US',
                    { hour: 'numeric', minute: '2-digit', hour12: true }
                  )
                : '',
              route: `${t.pickupLocation} → ${t.deliveryLocation}`,
              driver: t.driverName || 'Unassigned',
            })) || companyDashboardData.upcomingTrips;

          // Transform API data to match our interface
          const transformedData: DashboardData = {
            stats: {
              activeTrips: {
                value:
                  apiData.tripSummary?.totalTrips ??
                  companyDashboardData.stats.activeTrips.value,
                scheduledToday:
                  apiData.tripSummary?.scheduledToday ??
                  companyDashboardData.stats.activeTrips.scheduledToday,
                inMaintenance:
                  apiData.activeVehicles?.inMaintenance ??
                  companyDashboardData.stats.activeTrips.inMaintenance,
              },
              monthlyExpenses: {
                value:
                  apiData.monthlyExpenses?.totalExpenses ??
                  companyDashboardData.stats.monthlyExpenses.value,
                highestSpending: apiData.monthlyExpenses?.highestFuelAmount
                  ? `Fuel: ₹${apiData.monthlyExpenses.highestFuelAmount}`
                  : companyDashboardData.stats.monthlyExpenses.highestSpending,
              },
              tripEfficiency: {
                value:
                  apiData.tripEfficiency ??
                  companyDashboardData.stats.tripEfficiency.value,
                unit: companyDashboardData.stats.tripEfficiency.unit,
              },
              vehiclesOnRent: {
                value:
                  apiData.vehiclesOnLease ??
                  companyDashboardData.stats.vehiclesOnRent.value,
              },
            },
            vehicleAvailability:
              apiData.vehicleAvailability ??
              companyDashboardData.vehicleAvailability,
            topRated: {
              drivers:
                drivers.length > 0
                  ? drivers
                  : companyDashboardData.topRated.drivers,
              technicians:
                technicians.length > 0
                  ? technicians
                  : companyDashboardData.topRated.technicians,
              helpers:
                helpers.length > 0
                  ? helpers
                  : companyDashboardData.topRated.helpers,
            },
            jobsPosted,
            expenseOverview: companyDashboardData.expenseOverview, // API doesn't provide this breakdown
            recentTransactions:
              apiData.recentTransactions?.length > 0
                ? apiData.recentTransactions
                : companyDashboardData.recentTransactions,
            assignedServices,
            tripCompletionTrend:
              apiData.tripCompletionTrend?.length > 0
                ? apiData.tripCompletionTrend
                : companyDashboardData.tripCompletionTrend,
            upcomingTrips,
          };

          setDashboardData(transformedData);
        } else {
          // Fallback to mock data if API fails
          console.warn('Dashboard API returned no data, using mock data');
          setDashboardData(companyDashboardData as unknown as DashboardData);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Failed to load dashboard data');
        // Use mock data as fallback
        setDashboardData(companyDashboardData as unknown as DashboardData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Use fetched data or fallback
  const {
    stats,
    vehicleAvailability,
    topRated,
    jobsPosted,
    expenseOverview,
    recentTransactions,
    assignedServices,
    tripCompletionTrend,
    upcomingTrips,
  } = dashboardData || companyDashboardData;

  const getTopRatedData = () => {
    if (activeTab === 'Drivers') return topRated.drivers;
    if (activeTab === 'Technicians') return topRated.technicians;
    return topRated.helpers;
  };

  const maxTrips = Math.max(...tripCompletionTrend.map((d) => d.trips));

  if (isLoading) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-red-50 pt-16">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#f36969]" />
            <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pt-16 font-poppins">
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              {error} - Showing cached data
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#f36969] shadow-sm transition-all hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              DashBoard
            </motion.button>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-[#f36969]">DashBoard</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Active Trips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-full bg-blue-50 p-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-xs text-gray-500">Active Trips</div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                {stats.activeTrips.value}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{stats.activeTrips.scheduledToday} Scheduled Today</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {stats.activeTrips.inMaintenance} In Maintenance
              </div>
            </motion.div>

            {/* Monthly Expenses Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-full bg-green-50 p-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-xs text-gray-500">Monthly Expenses</div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                ₹{(stats.monthlyExpenses.value / 1000).toFixed(0)}k
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span>Highest: {stats.monthlyExpenses.highestSpending}</span>
              </div>
            </motion.div>

            {/* Trip Efficiency Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-full bg-yellow-50 p-2">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-xs text-gray-500">Trip Efficiency</div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                {stats.tripEfficiency.value}
              </div>
              <div className="text-xs text-gray-600">
                {stats.tripEfficiency.unit}
              </div>
            </motion.div>

            {/* Vehicles on Rent Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-full bg-purple-50 p-2">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-xs text-gray-500">Vehicles on Rent</div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                {stats.vehiclesOnRent.value}
              </div>
              <div className="text-xs text-gray-600">2 Latest this week</div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column - 8 cols */}
            <div className="space-y-6 lg:col-span-8">
              {/* Trip Completion Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Trip Completion Trend
                  </h2>
                  <div className="rounded-lg bg-pink-50 px-3 py-1 text-xs font-semibold text-[#f36969]">
                    Last 7 Days
                  </div>
                </div>
                <div className="flex h-48 items-end justify-between gap-2">
                  {tripCompletionTrend.map((data, idx) => (
                    <div
                      key={idx}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="relative w-full">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: `${(data.trips / maxTrips) * 160}px`,
                          }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-[#f36969]/60 to-[#f36969]"
                        />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">
                          {data.trips}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Vehicle Availability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Vehicle Availability
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-green-50 p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {vehicleAvailability.available}
                    </div>
                    <div className="mt-1 text-xs font-medium text-gray-600">
                      Available
                    </div>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {vehicleAvailability.onTrip}
                    </div>
                    <div className="mt-1 text-xs font-medium text-gray-600">
                      On Trip
                    </div>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {vehicleAvailability.onRent}
                    </div>
                    <div className="mt-1 text-xs font-medium text-gray-600">
                      On Rent
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Top Rated Personnel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Top Rated</h2>
                  <div className="flex rounded-full bg-gray-100 p-1">
                    {(['Drivers', 'Technicians', 'Helpers'] as const).map(
                      (tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            activeTab === tab
                              ? 'bg-[#f36969] text-white'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {tab}
                        </button>
                      )
                    )}
                  </div>
                  <button className="ml-auto rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                    See All
                  </button>
                </div>
                <div className="space-y-3">
                  {getTopRatedData().map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                          <Img
                            src={person.avatar}
                            alt={person.name}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {person.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {person.role} • {person.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-900">
                          {person.rating}
                        </span>
                      </div>
                      <button className="rounded-lg border border-blue-500 px-4 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Jobs Posted */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Jobs You Posted
                  </h2>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    See All
                  </button>
                </div>
                <div className="space-y-3">
                  {jobsPosted.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div>
                        <div className="font-bold text-gray-900">
                          {job.title}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applicants} Applicants
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {job.likes} Likes
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                          <Share2 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f36969] py-3 font-semibold text-white shadow-md hover:bg-[#e85555]"
                >
                  <Plus className="h-5 w-5" />
                  Post New Job
                </motion.button>
              </motion.div>
            </div>

            {/* Right Column - 4 cols */}
            <div className="space-y-6 lg:col-span-4">
              {/* Expense Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Expense Overview
                </h2>
                <div className="relative mx-auto h-40 w-40">
                  {/* Donut Chart */}
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#f0f0f0"
                      strokeWidth="20"
                    />
                    {expenseOverview.categories.map((cat, idx) => {
                      const total = expenseOverview.categories.reduce(
                        (sum, c) => sum + c.amount,
                        0
                      );
                      const percentage = (cat.amount / total) * 100;
                      const circumference = 2 * Math.PI * 70;
                      const offset = expenseOverview.categories
                        .slice(0, idx)
                        .reduce(
                          (sum, c) => sum + (c.amount / total) * circumference,
                          0
                        );

                      return (
                        <circle
                          key={cat.category}
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke={cat.color}
                          strokeWidth="20"
                          strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                          strokeDashoffset={-offset}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {expenseOverview.total}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {expenseOverview.categories.map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-gray-600">{cat.category}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-semibold text-white shadow-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </motion.button>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Recent Transactions
                </h2>
                <div className="space-y-3">
                  {recentTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg p-2 ${txn.type === 'Fuel' ? 'bg-blue-50' : 'bg-orange-50'}`}
                        >
                          {txn.type === 'Fuel' ? (
                            <Fuel className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Settings className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {txn.type}
                          </div>
                          <div className="text-xs text-gray-600">
                            {txn.date} • {txn.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        ₹{txn.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Assigned Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Assigned Services
                  </h2>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    See All
                  </button>
                </div>
                <div className="space-y-3">
                  {assignedServices.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-xl border border-gray-100 p-4"
                      style={{ backgroundColor: service.backgroundColor }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-bold text-gray-900">
                          {service.title}
                        </div>
                        <span className="rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                          {service.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {service.description}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Updated {service.updatedAt}
                      </div>
                      <button className="mt-3 rounded-lg bg-red-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Trips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Upcoming Trips
                  </h2>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="rounded-xl border border-gray-100 bg-blue-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-bold text-gray-900">
                          {trip.title}
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Timer className="h-3 w-3" />
                          {trip.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {trip.route}
                        </div>
                        <div>{trip.driver}</div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Manage Trip
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}
