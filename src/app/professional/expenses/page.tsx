'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Receipt,
  PieChart,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';

export default function ProfessionalExpensesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expensePurposes, setExpensePurposes] = useState<any[]>([]);
  const [expenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch expense purposes from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching expense data...');
        const response = await wheelboardApi.trip.getExpensePurposes();
        console.log('📦 Expense purposes response:', response);

        const purposes = Array.isArray(response)
          ? response
          : (response as any)?.data || [];
        const purposesArray = Array.isArray(purposes) ? purposes : [];
        setExpensePurposes(purposesArray);
        console.log('✅ Expense purposes loaded:', purposesArray.length);

        // TODO: Fetch real expenses when API is available
        // const expensesResponse = await wheelboardApi.trip.getExpenses(userId);
        // setExpenses(expensesResponse.data || []);
      } catch (error) {
        console.error('❌ Error fetching expense data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map API expense purposes to category breakdown with icons and colors
  const getCategoryIcon = (purposeName: string) => {
    const iconMap: Record<string, string> = {
      Fuel: '⛽',
      Food: '🍔',
      Challan: '🚨',
      Enroute: '🛣️',
      Advance: '💰',
      Salary: '💵',
      Other: '📦',
    };
    return iconMap[purposeName] || '📦';
  };

  const getCategoryColor = (purposeName: string) => {
    const colorMap: Record<string, string> = {
      Fuel: '#3B82F6',
      Food: '#F59E0B',
      Challan: '#F97316',
      Enroute: '#10B981',
      Advance: '#8B5CF6',
      Salary: '#06B6D4',
      Other: '#6B7280',
    };
    return colorMap[purposeName] || '#6B7280';
  };

  // Create dynamic category breakdown from API data
  const displayCategories = expensePurposes.map((purpose) => {
    const categoryExpenses = expenses.filter(
      (exp) => exp.expensePurposeId === purpose.expensePurposeId
    );
    const total = categoryExpenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    return {
      id: purpose.purposeName.toLowerCase(),
      name: purpose.purposeName,
      icon: getCategoryIcon(purpose.purposeName),
      color: getCategoryColor(purpose.purposeName),
      total: total,
      count: categoryExpenses.length,
    };
  });

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      expense.category === selectedCategory ||
      expensePurposes
        .find((p) => p.expensePurposeId === expense.expensePurposeId)
        ?.purposeName.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper to get icon for expense category in list
  const getExpenseCategoryIcon = (category: string) => {
    const categoryData = displayCategories.find((c) => c.id === category);
    return categoryData?.icon || '📦';
  };

  // Helper to get color for expense category in list
  const getExpenseCategoryColor = (category: string) => {
    const categoryData = displayCategories.find((c) => c.id === category);
    return categoryData?.color || '#6B7280';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalCategoryAmount = displayCategories.reduce(
    (sum, cat) => sum + cat.total,
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const thisMonthExpenses = expenses
    .filter((exp) => {
      const expDate = new Date(exp.expenseDate);
      return (
        expDate.getMonth() === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const lastMonthExpenses = expenses
    .filter((exp) => {
      const expDate = new Date(exp.expenseDate);
      return (
        expDate.getMonth() === lastMonth &&
        expDate.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const pendingExpenses = expenses
    .filter((exp) => exp.status === 'pending')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);

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
                Expenses
              </h1>
              <p className="mt-0.5 text-sm text-gray-600 lg:mt-1 lg:text-lg">
                Track and manage your expenses
              </p>
            </div>
          </div>

          {/* Add Expense Button - Desktop */}
          <button
            onClick={() => router.push('/professional/expenses/add')}
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#F36969] to-[#f36565] px-6 py-3 font-semibold text-white shadow-lg shadow-[#F36969]/30 transition-all hover:shadow-xl lg:flex"
          >
            <Plus className="h-5 w-5" />
            Add Expense
          </button>
        </div>

        {/* Stats Overview */}
        <div className="mb-4 grid grid-cols-2 gap-2 lg:mb-6 lg:grid-cols-4 lg:gap-4">
          {/* Total Expenses */}
          <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#F36969] to-pink-600 p-4 text-white shadow-lg shadow-[#F36969]/20 transition-all hover:shadow-xl lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <IndianRupee className="h-5 w-5 lg:h-6 lg:w-6" />
            </div>
            <p className="text-xs opacity-90 lg:text-sm">Total Expenses</p>
            <p className="mt-1 text-2xl font-bold lg:text-4xl">
              ₹{totalExpenses.toLocaleString()}
            </p>
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          </div>

          {/* This Month */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-lg lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <Calendar className="h-4 w-4 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">This Month</p>
            <p className="mt-1 text-xl font-bold text-[#535353] lg:text-3xl">
              ₹{thisMonthExpenses.toLocaleString()}
            </p>
          </div>

          {/* Last Month */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-lg lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <TrendingUp className="h-4 w-4 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Last Month</p>
            <p className="mt-1 text-xl font-bold text-gray-500 lg:text-3xl">
              ₹{lastMonthExpenses.toLocaleString()}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-lg lg:rounded-2xl lg:p-6">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 lg:mb-3 lg:h-12 lg:w-12 lg:rounded-xl">
              <Clock className="h-4 w-4 text-white lg:h-6 lg:w-6" />
            </div>
            <p className="text-[10px] text-gray-500 lg:text-sm">Pending</p>
            <p className="mt-1 text-xl font-bold text-[#535353] lg:text-3xl">
              ₹{pendingExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-4 grid gap-4 lg:mb-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
            <div className="mb-4 flex items-center justify-between lg:mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#535353] lg:text-2xl">
                  Distribution of Expenses
                </h2>
                <p className="mt-1 text-xs text-gray-600 lg:text-sm">
                  By category breakdown
                </p>
              </div>
              <PieChart className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
            </div>

            {loading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#F36969]"></div>
                <p className="text-sm text-gray-500">Loading categories...</p>
              </div>
            ) : displayCategories.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                <PieChart className="mb-4 h-16 w-16 text-gray-300" />
                <p className="text-sm text-gray-500">
                  No expense categories available
                </p>
              </div>
            ) : (
              <>
                {/* Donut Chart */}
                <div className="relative mx-auto mb-6 h-48 w-48 lg:h-64 lg:w-64">
                  <svg
                    viewBox="0 0 200 200"
                    className="h-full w-full -rotate-90"
                  >
                    {displayCategories.map((category, index) => {
                      const total = displayCategories.reduce(
                        (sum, cat) => sum + cat.total,
                        0
                      );
                      const percentage =
                        total > 0 ? (category.total / total) * 100 : 0;
                      const circumference = 2 * Math.PI * 70;
                      const offset = displayCategories
                        .slice(0, index)
                        .reduce(
                          (sum, cat) =>
                            sum +
                            (total > 0
                              ? (cat.total / total) * circumference
                              : 0),
                          0
                        );

                      return (
                        <circle
                          key={category.id}
                          cx="100"
                          cy="100"
                          r="70"
                          fill="none"
                          stroke={category.color}
                          strokeWidth="30"
                          strokeDasharray={`${
                            (percentage / 100) * circumference
                          } ${circumference}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-[#535353] lg:text-3xl">
                      ₹{totalCategoryAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 lg:text-sm">Total</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  {displayCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 lg:p-3"
                    >
                      <div
                        className="h-3 w-3 rounded-full lg:h-4 lg:w-4"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[#535353] lg:text-sm">
                          {category.icon} {category.name}
                        </p>
                        <p className="text-[10px] text-gray-600 lg:text-xs">
                          ₹{category.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Monthly Trend - Placeholder */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
            <div className="mb-4 flex items-center justify-between lg:mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#535353] lg:text-2xl">
                  Monthly Trend
                </h2>
                <p className="mt-1 text-xs text-gray-600 lg:text-sm">
                  Expense trends over time
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
            </div>
            <div className="flex min-h-[200px] items-center justify-center text-center">
              <p className="text-sm text-gray-500">
                {expenses.length === 0
                  ? 'No expense data available'
                  : 'Chart coming soon'}
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:mb-6 lg:rounded-2xl lg:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 lg:left-4 lg:h-5 lg:w-5" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm transition-all focus:border-[#F36969] focus:outline-none focus:ring-2 focus:ring-[#F36969]/20 lg:rounded-xl lg:py-3 lg:pl-12 lg:pr-4 lg:text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all lg:px-4 lg:text-sm ${
                  selectedCategory === 'all'
                    ? 'bg-[#F36969] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {displayCategories.slice(0, 5).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all lg:px-4 lg:text-sm ${
                    selectedCategory === category.id
                      ? 'bg-[#F36969] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Filter & Export Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-[#F36969] hover:text-[#F36969] lg:px-4">
                <Filter className="h-4 w-4" />
                <span className="hidden lg:inline">Filter</span>
              </button>
              <button className="hidden items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-[#F36969] hover:text-[#F36969] lg:flex">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:rounded-2xl">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#535353] lg:text-2xl">
                  Recent Expenses
                </h2>
                <p className="mt-1 text-xs text-gray-600 lg:text-sm">
                  {filteredExpenses.length} transaction
                  {filteredExpenses.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#F36969]"></div>
                <p className="text-sm text-gray-500">Loading expenses...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
                <Receipt className="mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-lg font-bold text-[#535353]">
                  No expenses found
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Add your first expense to get started'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => router.push('/professional/expenses/add')}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F36969] to-[#f36565] px-6 py-3 font-semibold text-white shadow-lg shadow-[#F36969]/30 transition-all hover:shadow-xl"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Expense
                  </button>
                )}
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id || expense.expenseId}
                  className="group p-4 transition-all hover:bg-gray-50 lg:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left Side */}
                    <div className="flex flex-1 items-start gap-3 lg:gap-4">
                      {/* Category Icon */}
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl lg:h-12 lg:w-12 lg:rounded-xl lg:text-2xl"
                        style={{
                          backgroundColor: `${getExpenseCategoryColor(expense.category || expensePurposes.find((p) => p.expensePurposeId === expense.expensePurposeId)?.purposeName.toLowerCase() || '')}20`,
                        }}
                      >
                        {getExpenseCategoryIcon(
                          expense.category ||
                            expensePurposes
                              .find(
                                (p) =>
                                  p.expensePurposeId ===
                                  expense.expensePurposeId
                              )
                              ?.purposeName.toLowerCase() ||
                            ''
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-[#535353] lg:text-base">
                            {expense.purpose ||
                              expensePurposes.find(
                                (p) =>
                                  p.expensePurposeId ===
                                  expense.expensePurposeId
                              )?.purposeName ||
                              'Expense'}
                          </p>
                          {expense.status && (
                            <span
                              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold lg:px-2.5 lg:py-1 lg:text-xs ${getStatusColor(expense.status)}`}
                            >
                              {getStatusIcon(expense.status)}
                              <span className="hidden sm:inline">
                                {expense.status.charAt(0).toUpperCase() +
                                  expense.status.slice(1)}
                              </span>
                            </span>
                          )}
                        </div>

                        {expense.description && (
                          <p className="mt-1 text-xs text-gray-600 lg:text-sm">
                            {expense.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 lg:text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                            {new Date(
                              expense.expenseDate || expense.date
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          {expense.tripId && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 lg:h-4 lg:w-4" />
                              {expense.tripName || expense.tripId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Amount */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#F36969] lg:text-xl">
                        ₹{expense.amount}
                      </p>
                      {expense.receiptUrl && (
                        <button className="mt-1 text-xs text-[#F36969] hover:underline lg:text-sm">
                          View Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All */}
          {filteredExpenses.length > 0 && (
            <div className="border-t border-gray-200 p-4 text-center lg:p-6">
              <button className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 font-semibold text-gray-700 transition-all hover:border-[#F36969] hover:text-[#F36969] lg:w-auto lg:px-8">
                View All Expenses
              </button>
            </div>
          )}
        </div>

        {/* Floating Add Button - Mobile */}
        <button
          onClick={() => router.push('/professional/expenses/add')}
          className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F36969] text-white shadow-2xl shadow-[#F36969]/50 transition-all hover:scale-110 lg:hidden"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
