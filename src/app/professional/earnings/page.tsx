'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Headers from '@/components/Header';

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  tripId?: string;
}

interface MonthlyData {
  month: string;
  earnings: number;
}

export default function ProfessionalEarningsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'year'
  >('month');
  //const [showTransactions, setShowTransactions] = useState(true);

  // Mock data
  const stats = {
    totalEarnings: 70000,
    tripsCompleted: 75,
    averagePerTrip: 167,
    pendingAmount: 2500,
    thisMonthEarnings: 15420,
    lastMonthEarnings: 14200,
    percentageChange: 8.6,
  };

  const monthlyData: MonthlyData[] = [
    { month: 'Jan', earnings: 12500 },
    { month: 'Feb', earnings: 13200 },
    { month: 'Mar', earnings: 11800 },
    { month: 'Apr', earnings: 14500 },
    { month: 'May', earnings: 13900 },
    { month: 'Jun', earnings: 15200 },
    { month: 'Jul', earnings: 14800 },
    { month: 'Aug', earnings: 16100 },
    { month: 'Sep', earnings: 14200 },
    { month: 'Oct', earnings: 15420 },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-10-19',
      type: 'credit',
      amount: 500,
      description: 'Trip Payment - #TR1234',
      status: 'completed',
      tripId: 'TR1234',
    },
    {
      id: '2',
      date: '2024-10-18',
      type: 'credit',
      amount: 320,
      description: 'Trip Payment - #TR1233',
      status: 'completed',
      tripId: 'TR1233',
    },
    {
      id: '3',
      date: '2024-10-18',
      type: 'debit',
      amount: 50,
      description: 'Platform Fee',
      status: 'completed',
    },
    {
      id: '4',
      date: '2024-10-17',
      type: 'credit',
      amount: 450,
      description: 'Trip Payment - #TR1232',
      status: 'pending',
      tripId: 'TR1232',
    },
    {
      id: '5',
      date: '2024-10-16',
      type: 'credit',
      amount: 280,
      description: 'Trip Payment - #TR1231',
      status: 'completed',
      tripId: 'TR1231',
    },
    {
      id: '6',
      date: '2024-10-15',
      type: 'credit',
      amount: 390,
      description: 'Trip Payment - #TR1230',
      status: 'completed',
      tripId: 'TR1230',
    },
  ];

  const maxEarning = Math.max(...monthlyData.map((d) => d.earnings));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 py-4 pt-16 lg:px-4 lg:py-6 lg:pt-20">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md lg:h-12 lg:w-12 lg:rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 lg:h-6 lg:w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#535353] lg:text-4xl">
                Earnings
              </h1>
              <p className="mt-0.5 text-sm text-gray-600 lg:mt-1 lg:text-lg">
                Track your income and transactions
              </p>
            </div>
          </div>

          {/* Export Button - Desktop */}
          <button className="hidden items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:text-[#f36969] lg:flex">
            <Download className="h-5 w-5" />
            Export PDF
          </button>
        </div>

        {/* Stats Overview */}
        <div className="mb-4 grid grid-cols-2 gap-2 lg:mb-6 lg:grid-cols-4 lg:gap-4">
          {/* Total Earnings */}
          <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#f36969] to-[#f36565] p-4 text-white shadow-lg shadow-[#f36969]/20 transition-all hover:shadow-xl lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <IndianRupee className="h-5 w-5 lg:h-6 lg:w-6" />
            </div>
            <p className="text-xs opacity-90 lg:text-sm">Total Earnings</p>
            <p className="mt-1 text-2xl font-bold lg:text-4xl">
              ₹{stats.totalEarnings.toLocaleString()}
            </p>
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          </div>

          {/* Trips Completed */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-lg lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">
              Trips Completed
            </p>
            <p className="mt-1 text-xl font-bold text-[#535353] lg:text-3xl">
              {stats.tripsCompleted}
            </p>
          </div>

          {/* Average Per Trip */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-lg lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <TrendingUp className="h-4 w-4 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Avg/Trip</p>
            <p className="mt-1 text-xl font-bold text-[#535353] lg:text-3xl">
              ₹{stats.averagePerTrip}
            </p>
          </div>

          {/* Pending Amount */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-lg lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <Clock className="h-4 w-4 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Pending</p>
            <p className="mt-1 text-xl font-bold text-[#535353] lg:text-3xl">
              ₹{stats.pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:mb-6 lg:rounded-2xl lg:p-6">
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#535353] lg:text-2xl">
                Monthly Performance
              </h2>
              <p className="mt-1 text-xs text-gray-600 lg:text-sm">
                Your earning trends over time
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 lg:gap-2 lg:rounded-xl lg:p-1.5">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-all lg:rounded-lg lg:px-4 lg:py-2 lg:text-sm ${
                    selectedPeriod === period
                      ? 'bg-[#f36969] text-white shadow-md'
                      : 'text-gray-600 hover:text-[#f36969]'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 lg:rounded-xl lg:p-4">
              <p className="text-xs text-gray-600 lg:text-sm">This Month</p>
              <p className="mt-1 text-xl font-bold text-[#535353] lg:text-2xl">
                ₹{stats.thisMonthEarnings.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 lg:rounded-xl lg:p-4">
              <p className="text-xs text-gray-600 lg:text-sm">Last Month</p>
              <p className="mt-1 text-xl font-bold text-gray-500 lg:text-2xl">
                ₹{stats.lastMonthEarnings.toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 rounded-lg border border-green-200 bg-green-50 p-3 lg:col-span-1 lg:rounded-xl lg:p-4">
              <p className="text-xs text-green-700 lg:text-sm">Growth</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xl font-bold text-green-700 lg:text-2xl">
                  +{stats.percentageChange}%
                </p>
                <TrendingUp className="h-5 w-5 text-green-700 lg:h-6 lg:w-6" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64 lg:h-80">
            <div className="absolute inset-0 flex items-end justify-between gap-1 lg:gap-2">
              {monthlyData.map((data, index) => {
                const height = (data.earnings / maxEarning) * 100;
                return (
                  <div key={index} className="group flex flex-1 flex-col">
                    <div className="relative flex flex-1 items-end">
                      {/* Bar */}
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#f36969] to-[#f36565] transition-all duration-500 ease-out hover:from-[#f36565] hover:to-[#f36969]"
                        style={{
                          height: `${height}%`,
                          minHeight: '20px',
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                          ₹{data.earnings.toLocaleString()}
                          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
                        </div>
                      </div>
                    </div>
                    {/* Month Label */}
                    <p className="mt-2 text-center text-[10px] font-medium text-gray-600 lg:text-xs">
                      {data.month}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:rounded-2xl">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#535353] lg:text-2xl">
                  Transaction History
                </h2>
                <p className="mt-1 text-xs text-gray-600 lg:text-sm">
                  Recent payment activities
                </p>
              </div>
              <button className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:text-[#f36969] lg:rounded-xl lg:px-4 lg:py-2.5">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group p-4 transition-all hover:bg-gray-50 lg:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left Side */}
                  <div className="flex flex-1 items-start gap-3 lg:gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg lg:h-12 lg:w-12 lg:rounded-xl ${
                        transaction.type === 'credit'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'credit' ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600 lg:h-6 lg:w-6" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600 lg:h-6 lg:w-6" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#535353] lg:text-base">
                          {transaction.description}
                        </p>
                        <span
                          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold lg:px-2.5 lg:py-1 lg:text-xs ${getStatusColor(transaction.status)}`}
                        >
                          {getStatusIcon(transaction.status)}
                          <span className="hidden sm:inline">
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 lg:text-sm">
                        <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                        {new Date(transaction.date).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Amount */}
                  <div className="text-right">
                    <p
                      className={`text-base font-bold lg:text-xl ${
                        transaction.type === 'credit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}₹
                      {transaction.amount}
                    </p>
                    {transaction.tripId && (
                      <button className="mt-1 text-xs text-[#f36969] hover:underline lg:text-sm">
                        View Trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All */}
          <div className="border-t border-gray-200 p-4 text-center lg:p-6">
            <button className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:text-[#f36969] lg:w-auto lg:px-8">
              View All Transactions
            </button>
          </div>
        </div>

        {/* Export Button - Mobile */}
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:text-[#f36969] lg:hidden">
          <Download className="h-5 w-5" />
          Export PDF
        </button>
      </div>
    </div>
  );
}
