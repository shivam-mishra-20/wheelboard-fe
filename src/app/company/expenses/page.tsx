'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Fuel,
  Wrench,
  Users,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import {
  getExpenses,
  addExpense,
  deleteExpense,
  categoryConfig,
  type Expense,
  type ExpenseCategory,
} from '@/lib/expensesApi';
import { companyHomeData } from '@/lib/mockApi';

// Hide scrollbar but keep scrolling: used by AddExpenseModal scroll container
const hideScrollbarStyles = `
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar { display: none; } /* WebKit */
`;

interface DonutChartProps {
  data: {
    category: ExpenseCategory;
    amount: number;
    color: string;
    label: string;
  }[];
  total: number;
}

function DonutChart({ data, total }: DonutChartProps) {
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercentage = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {data.map((segment, index) => {
            const percentage = (segment.amount / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -(
              (cumulativePercentage / 100) *
              circumference
            );
            cumulativePercentage += percentage;

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            ₹{(total / 1000).toFixed(0)}k
          </span>
          <span className="text-sm text-gray-500">Total</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((segment, index) => {
          const percentage = ((segment.amount / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-gray-700">{segment.label}</span>
              <span className="ml-auto font-semibold">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    category: 'fuel' as ExpenseCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'paid' | 'pending' | 'overdue',
    vehicle: '',
    paymentMethod: 'Cash',
    tripId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount) {
      onAdd({
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: formData.status,
        vehicle: formData.vehicle || undefined,
        paymentMethod: formData.paymentMethod,
      });
      setFormData({
        category: 'fuel',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        vehicle: '',
        paymentMethod: 'Cash',
        tripId: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mx-4 w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
      >
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Add New Expense
        </h2>
        <div className="hide-scrollbar max-h-[72vh] overflow-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ExpenseCategory,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Trip (optional)
              </label>
              <select
                value={formData.tripId}
                onChange={(e) =>
                  setFormData({ ...formData, tripId: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              >
                <option value="">-- None --</option>
                {companyHomeData.allTrips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {t.from} → {t.to}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Vehicle (Optional)
              </label>
              <input
                type="text"
                value={formData.vehicle}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle: e.target.value })
                }
                placeholder="e.g., DL-12-AB-3456"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter expense description"
                required
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                >
                  <option value="Cash">Cash</option>
                  <option value="Corporate Card">Corporate Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="FASTag">FASTag</option>
                  <option value="Fuel Card">Fuel Card</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'paid' | 'pending' | 'overdue',
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] py-3 font-semibold text-white transition-all hover:shadow-lg"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
        <style jsx global>
          {hideScrollbarStyles}
        </style>
      </motion.div>
    </div>
  );
}

const newCategoryConfig = {
  advance: {
    icon: CreditCard,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    label: 'Advance',
  },
  fuel: {
    icon: Fuel,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    label: 'Fuel',
  },
  challan: {
    icon: FileText,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Challan',
  },
  food: {
    icon: Wrench,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Food',
  },
  salary: {
    icon: Users,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    label: 'Salary',
  },
  enroute: {
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    label: 'Enroute',
  },
};

const statusColors = {
  paid: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: CheckCircle2,
    label: 'Paid',
  },
  pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    icon: Clock,
    label: 'Pending',
  },
  overdue: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: AlertCircle,
    label: 'Overdue',
  },
};

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      await addExpense(expenseData);
      await loadExpenses();
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        await loadExpenses();
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Category',
      'Description',
      'Vehicle',
      'Amount',
      'Status',
      'Payment Method',
    ];
    const csvData = [headers.join(',')];

    filteredExpenses.forEach((expense) => {
      const row = [
        expense.date,
        newCategoryConfig[expense.category].label,
        `"${expense.description}"`,
        expense.vehicle || '',
        expense.amount,
        expense.status,
        expense.paymentMethod,
      ];
      csvData.push(row.join(','));
    });

    const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vehicle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || expense.category === filterCategory;

    const matchesStatus =
      filterStatus === 'all' || expense.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const paidExpenses = filteredExpenses
    .filter((e) => e.status === 'paid')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses
    .filter((e) => e.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const overdueExpenses = filteredExpenses
    .filter((e) => e.status === 'overdue')
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate chart data
  const chartData = Object.entries(categoryConfig)
    .map(([category, config]) => {
      const categoryExpenses = filteredExpenses.filter(
        (e) => e.category === category
      );
      const amount = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        category: category as ExpenseCategory,
        amount,
        color: config.color,
        label: config.label,
      };
    })
    .filter((item) => item.amount > 0);

  if (loading) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#f36969] border-t-transparent"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </motion.button>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-[#f36969] to-[#e85555] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                  Expense Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Track and manage all your business expenses
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportToCSV}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5"
                >
                  <Download className="h-5 w-5" />
                  Export
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  Add Expense
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Expenses
                </span>
                <DollarSign className="h-5 w-5 text-[#f36969]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(totalExpenses / 1000).toFixed(1)}k
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="font-semibold text-green-600">12.5%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Paid</span>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">
                ₹{(paidExpenses / 1000).toFixed(1)}k
              </p>
              <p className="mt-2 text-xs text-green-600">
                {filteredExpenses.filter((e) => e.status === 'paid').length}{' '}
                transactions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Pending
                </span>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-900">
                ₹{(pendingExpenses / 1000).toFixed(1)}k
              </p>
              <p className="mt-2 text-xs text-yellow-600">
                {filteredExpenses.filter((e) => e.status === 'pending').length}{' '}
                pending
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">
                  Overdue
                </span>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-900">
                ₹{(overdueExpenses / 1000).toFixed(1)}k
              </p>
              <p className="mt-2 text-xs text-red-600">
                {filteredExpenses.filter((e) => e.status === 'overdue').length}{' '}
                overdue
              </p>
            </motion.div>
          </div>

          {/* Chart Section */}
          {chartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Expense Distribution
              </h2>
              <div className="flex justify-center">
                <DonutChart data={chartData} total={totalExpenses} />
              </div>
            </motion.div>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses by description or vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5"
                >
                  <Filter className="h-5 w-5" />
                  Filter
                  {(filterCategory !== 'all' || filterStatus !== 'all') && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f36969] text-xs text-white">
                      {(filterCategory !== 'all' ? 1 : 0) +
                        (filterStatus !== 'all' ? 1 : 0)}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full z-10 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
                    >
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-bold text-gray-500">
                          CATEGORY
                        </p>
                        <div className="space-y-1">
                          {[
                            'all',
                            'advance',
                            'fuel',
                            'challan',
                            'food',
                            'salary',
                            'enroute',
                          ].map((category) => (
                            <button
                              key={category}
                              onClick={() => setFilterCategory(category)}
                              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize transition-all ${
                                filterCategory === category
                                  ? 'bg-[#f36969] text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-bold text-gray-500">
                          STATUS
                        </p>
                        <div className="space-y-1">
                          {['all', 'paid', 'pending', 'overdue'].map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize transition-all ${
                                  filterStatus === status
                                    ? 'bg-[#f36969] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {status}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Expenses Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Vehicle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense, index) => {
                    const categoryStyle = newCategoryConfig[expense.category];
                    const statusStyle = statusColors[expense.status];
                    const CategoryIcon = categoryStyle.icon;
                    const StatusIcon = statusStyle.icon;

                    return (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div
                            className={`flex w-fit items-center gap-2 rounded-lg border ${categoryStyle.border} ${categoryStyle.bg} px-3 py-1.5`}
                          >
                            <CategoryIcon
                              className={`h-4 w-4 ${categoryStyle.color}`}
                            />
                            <span
                              className={`text-xs font-bold ${categoryStyle.color}`}
                            >
                              {categoryStyle.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {expense.description}
                          </p>
                          {expense.receipt && (
                            <p className="mt-1 text-xs text-gray-500">
                              Receipt: {expense.receipt}
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="font-mono text-sm font-medium text-gray-700">
                            {expense.vehicle || '-'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {new Date(expense.date).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-lg font-bold text-[#f36969]">
                            ₹{expense.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div
                            className={`flex w-fit items-center gap-1.5 rounded-lg border ${statusStyle.border} ${statusStyle.bg} px-3 py-1.5 ${statusStyle.text}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-xs font-bold">
                              {statusStyle.label}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600"
                            title="Delete expense"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredExpenses.length === 0 && (
              <div className="py-16 text-center">
                <DollarSign className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  No expenses found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </motion.div>
        </main>

        <Footer />

        <AddExpenseModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddExpense}
        />
      </div>
    </CompanyProtected>
  );
}
