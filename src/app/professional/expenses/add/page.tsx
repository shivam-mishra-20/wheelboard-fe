'use client';

import React, { useState } from 'react';
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

interface ExpenseFormData {
  purpose: string;
  category: string;
  amount: string;
  date: string;
  description: string;
  tripId: string;
  receipt: File | null;
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
  });
  const [isDragging, setIsDragging] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string>('');

  const categories = [
    { id: 'fuel', name: 'Fuel', icon: '⛽' },
    { id: 'food', name: 'Food', icon: '🍔' },
    { id: 'maintenance', name: 'Vehicle Repair', icon: '🔧' },
    { id: 'toll', name: 'Toll', icon: '🛣️' },
    { id: 'challan', name: 'Challan', icon: '🚨' },
    { id: 'parking', name: 'Parking', icon: '🅿️' },
    { id: 'other', name: 'Others', icon: '📦' },
  ];

  const recentTrips = [
    { id: 'TRP-1029', name: 'Delhi to Mumbai', date: '2024-10-19' },
    { id: 'TRP-1028', name: 'Bangalore to Chennai', date: '2024-10-17' },
    { id: 'TRP-1027', name: 'Pune to Hyderabad', date: '2024-10-15' },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Expense Data:', formData);
    router.push('/professional/expenses');
  };

  const isFormValid =
    formData.purpose && formData.category && formData.amount && formData.date;

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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 lg:rounded-xl lg:text-base"
              >
                <option value="">Select expense purpose...</option>
                {categories.map((cat) => (
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
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: cat.id,
                          purpose: cat.name,
                        }))
                      }
                      className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm transition-all lg:text-base ${
                        formData.category === cat.id
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 lg:rounded-xl lg:text-base"
              >
                <option value="">Select a trip...</option>
                {recentTrips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name} - {trip.id} ({trip.date})
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
                disabled={!isFormValid}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f36969] py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 lg:py-4"
              >
                <Save className="h-5 w-5" />
                Save Expense
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
