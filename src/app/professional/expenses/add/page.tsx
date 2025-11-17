'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  IndianRupee,
  Calendar as CalendarIcon,
  FileText,
  Upload,
  Save,
  X,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';

interface ExpenseFormData {
  purpose: string;
  category: string;
  amount: string;
  date: string;
  description: string;
  tripId: string;
  receipt: File | null;
  expensePurposeId: number;
}

export default function AddExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ExpenseFormData>({
    purpose: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tripId: '',
    receipt: null,
    expensePurposeId: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [expensePurposes, setExpensePurposes] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch expense purposes and trips from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching expense data...');
        setLoading(true);

        // Get current user
        const currentUser = localStorage.getItem('currentUser');
        const userId = currentUser
          ? JSON.parse(currentUser).id
          : '48e36413-ba01-4850-8aae-8c8d05206dc7';

        // Fetch expense purposes
        const purposesResponse = await wheelboardApi.trip.getExpensePurposes();
        const purposes = Array.isArray(purposesResponse)
          ? purposesResponse
          : purposesResponse.data || [];

        // Map API expense purposes with icons
        const mappedPurposes = purposes.map((purpose: any) => {
          const iconMap: Record<string, string> = {
            Fuel: '⛽',
            Food: '🍔',
            Challan: '🚨',
            Enroute: '🛣️',
            Advance: '💰',
            Salary: '💵',
            Other: '📦',
          };
          return {
            id: purpose.expensePurposeId,
            name: purpose.purposeName,
            icon: iconMap[purpose.purposeName] || '📦',
          };
        });

        setExpensePurposes(mappedPurposes);
        console.log('✅ Expense purposes loaded:', mappedPurposes.length);

        // Fetch assigned trips for user
        const tripsResponse = await wheelboardApi.trip.getAssignedTrips(userId);
        const tripsData = Array.isArray(tripsResponse)
          ? tripsResponse
          : tripsResponse.data || [];

        setTrips(tripsData);
        console.log('✅ Trips loaded:', tripsData.length);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File) => {
    if (
      file &&
      (file.type.includes('image') || file.type === 'application/pdf')
    ) {
      setFormData((prev) => ({ ...prev, receipt: file }));

      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview('pdf');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const removeReceipt = () => {
    setFormData((prev) => ({ ...prev, receipt: null }));
    setReceiptPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.expensePurposeId || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('💾 Submitting expense...');

      // Get current user
      const currentUser = localStorage.getItem('currentUser');
      const userId = currentUser
        ? JSON.parse(currentUser).id
        : '48e36413-ba01-4850-8aae-8c8d05206dc7';

      // Prepare expense data
      const expenseData = {
        CreatedBy: userId,
        ExpensePurposeId: formData.expensePurposeId,
        Amount: parseFloat(formData.amount),
        ExpenseDate: new Date(formData.date).toISOString(),
        Description: formData.description || '',
        TripId: formData.tripId || '00000000-0000-0000-0000-000000000000',
        ...(formData.receipt && { ReceiptFile: formData.receipt }),
      };

      console.log('📦 Expense data:', expenseData);

      // Call API
      const response = await wheelboardApi.trip.saveExpense(expenseData);
      console.log('✅ Expense saved:', response);

      alert('Expense saved successfully!');
      router.push('/professional/expenses');
    } catch (error) {
      console.error('❌ Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.expensePurposeId > 0 && formData.amount && formData.date;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-3 py-4 pt-16 lg:px-4 lg:py-6 lg:pt-20">
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
              Add Expense
            </h1>
            <p className="mt-0.5 text-sm text-gray-600 lg:mt-1 lg:text-lg">
              Record a new expense entry
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 lg:space-y-6">
            {/* Expense Purpose */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Expense Purpose
                <span className="text-pink-500">*</span>
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-50 lg:rounded-xl lg:text-base"
              >
                <option value="">
                  {loading ? 'Loading...' : 'Select expense purpose...'}
                </option>
                {expensePurposes.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category & Amount */}
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              {/* Category */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
                <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                  Category
                  <span className="text-pink-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {loading ? (
                    <div className="col-span-2 py-8 text-center text-sm text-gray-500">
                      Loading categories...
                    </div>
                  ) : (
                    expensePurposes.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            category: cat.name.toLowerCase(),
                            purpose: cat.name,
                            expensePurposeId: cat.id,
                          }))
                        }
                        className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm transition-all lg:text-base ${
                          formData.expensePurposeId === cat.id
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium">{cat.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
                <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                  Amount
                  <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 lg:rounded-xl lg:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Date
                <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 lg:rounded-xl lg:text-base"
                />
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Description
                <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                  (Optional)
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe this expense..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 lg:rounded-xl lg:text-base"
              />
            </div>

            {/* Choose Trip */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Choose Trip
                <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                  (Optional)
                </span>
              </label>
              <select
                name="tripId"
                value={formData.tripId}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-50 lg:rounded-xl lg:text-base"
              >
                <option value="">
                  {loading ? 'Loading trips...' : 'Select a trip (optional)...'}
                </option>
                {trips.map((trip) => (
                  <option
                    key={trip.tripId || trip.id}
                    value={trip.tripId || trip.id}
                  >
                    {trip.from || 'Trip'} to {trip.to || 'Destination'} -{' '}
                    {trip.tripId || trip.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Receipt */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Upload Receipt
                <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                  (Optional)
                </span>
              </label>

              {!receiptPreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all lg:p-12 ${
                    isDragging
                      ? 'border-[#f36969] bg-[#f36969]/10'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <Upload
                    className={`mx-auto mb-4 h-12 w-12 lg:h-16 lg:w-16 ${
                      isDragging ? 'text-pink-500' : 'text-gray-400'
                    }`}
                  />
                  <p className="mb-2 text-sm font-semibold text-gray-700 lg:text-base">
                    Drag & drop or tap to upload
                  </p>
                  <p className="mb-4 text-xs text-gray-500 lg:text-sm">
                    (.jpg, .png, .pdf)
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <button
                    type="button"
                    className="rounded-lg border-2 border-[#f36969] bg-white px-6 py-2 text-sm font-semibold text-[#535353] transition-all hover:bg-[#f36969]/10 lg:text-base"
                  >
                    Choose File
                  </button>
                </div>
              ) : (
                <div className="relative rounded-xl border-2 border-pink-200 bg-pink-50 p-4">
                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#f36969] text-white shadow-lg transition-all hover:bg-[#f36969]/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {receiptPreview === 'pdf' ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-pink-100">
                        <FileText className="h-8 w-8 text-[#535353]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#535353]">
                          {formData.receipt?.name}
                        </p>
                        <p className="text-sm text-[#535353]">
                          {(formData.receipt?.size || 0 / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={receiptPreview}
                      alt="Receipt preview"
                      width={500}
                      height={256}
                      className="mx-auto max-h-64 rounded-lg object-contain"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 lg:py-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting || loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f36969] py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 lg:py-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Expense
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
