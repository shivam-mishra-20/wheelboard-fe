'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
} from 'lucide-react';
import Headers from '@/components/Header';

interface MarkDateFormData {
  date: string;
  eventName: string;
  note: string;
  startTime: string;
  endTime: string;
  category: 'trip' | 'job' | '';
  isActive: boolean;
  location: {
    from: string;
    to: string;
  };
}

export default function MarkDatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<MarkDateFormData>({
    date: new Date().toISOString().split('T')[0],
    eventName: '',
    note: '',
    startTime: '',
    endTime: '',
    category: '',
    isActive: true,
    location: {
      from: '',
      to: '',
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === 'from' || name === 'to') {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (category: 'trip' | 'job') => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Calendar Event Data:', formData);
    router.push('/professional/calendar');
  };

  const isFormValid = formData.date;

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
              Mark Your Calendar
            </h1>
            <p className="mt-0.5 text-sm text-gray-600 lg:mt-1 lg:text-base">
              Set your availability and schedule events
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 lg:space-y-6">
            {/* Select Date */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Select Date
                <span className="text-[#f36969]">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
                />
              </div>
            </div>

            {/* Event Name */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Event name
                <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="e.g., Delhi to Mumbai Trip"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
              />
            </div>

            {/* Note */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                Type the note here...
                <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                  (Optional)
                </span>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={4}
                placeholder="Add any additional details..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
              />
            </div>

            {/* Time Selection */}
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
                <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                  Start time
                  <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
                <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                  End time
                  <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Location (Optional for Trip category) */}
            {formData.category === 'trip' && (
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
                  <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                    From
                    <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="from"
                      value={formData.location.from}
                      onChange={handleInputChange}
                      placeholder="Starting location"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
                  <label className="mb-2 block text-sm font-semibold text-[#535353] lg:text-base">
                    To
                    <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="to"
                      value={formData.location.to}
                      onChange={handleInputChange}
                      placeholder="Destination"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Select Category */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              <label className="mb-3 block text-sm font-semibold text-[#535353] lg:text-base">
                Select Category
                <span className="ml-1 text-xs text-gray-500 lg:text-sm">
                  (Optional)
                </span>
              </label>
              <div className="flex flex-wrap gap-3 lg:gap-4">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('trip')}
                  className={`flex items-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-semibold transition-all lg:text-base ${
                    formData.category === 'trip'
                      ? 'border-[#f36969] bg-[#f36969]/10 text-[#f36969]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-[#f36969]/50'
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${
                      formData.category === 'trip'
                        ? 'bg-[#f36969]'
                        : 'bg-gray-400'
                    }`}
                  ></div>
                  Trip
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('job')}
                  className={`flex items-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-semibold transition-all lg:text-base ${
                    formData.category === 'job'
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-teal-300'
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${
                      formData.category === 'job'
                        ? 'bg-teal-500'
                        : 'bg-gray-400'
                    }`}
                  ></div>
                  Job
                </button>
              </div>

              {formData.category && (
                <p className="mt-3 text-xs text-gray-500 lg:text-sm">
                  {formData.category === 'trip'
                    ? 'Mark this date as a trip event'
                    : 'Mark this date as a job event'}
                </p>
              )}
            </div>

            {/* Mark Date As Active/Inactive */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-[#535353] lg:text-base">
                    Mark the date As:
                  </label>
                  <p className="mt-1 text-xs text-gray-500 lg:text-sm">
                    Set your availability status for this date
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className={`relative h-12 w-24 rounded-full transition-all lg:h-14 lg:w-28 ${
                    formData.isActive
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669]'
                      : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all lg:h-12 lg:w-12 ${
                      formData.isActive ? 'right-1' : 'left-1'
                    }`}
                  >
                    {formData.isActive ? (
                      <span className="text-lg font-bold text-green-600 lg:text-xl">
                        ✓
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-gray-400 lg:text-xl">
                        ✕
                      </span>
                    )}
                  </div>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    formData.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></div>
                <span
                  className={`text-sm font-semibold lg:text-base ${
                    formData.isActive ? 'text-green-700' : 'text-gray-600'
                  }`}
                >
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* OR Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-50 px-4 text-sm font-semibold text-gray-400 lg:text-base">
                  OR
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 lg:py-4 lg:text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 lg:py-4 lg:text-lg"
              >
                Mark the Date
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
