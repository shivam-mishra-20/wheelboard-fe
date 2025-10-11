'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, MapPin, Phone, DollarSign } from 'lucide-react';
import Img from 'next/image';
import type { ServiceData } from '@/types/ServiceData';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceData: ServiceData) => void;
  editingService?: Partial<ServiceData>;
}

const categoryOptions = [
  { value: 'Tyre Repair', color: '#E3F2FD' },
  { value: 'Engine', color: '#F3E5F5' },
  { value: 'Oil Change', color: '#FFF3E0' },
  { value: 'Brake Service', color: '#FFEBEE' },
  { value: 'Battery', color: '#E8F5E9' },
  { value: 'AC Service', color: '#E0F2F1' },
];

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function AddServiceModal({
  isOpen,
  onClose,
  onSubmit,
  editingService,
}: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    title: editingService?.title || '',
    category: editingService?.category || categoryOptions[0].value,
    description: editingService?.description || '',
    detailedDescription: editingService?.detailedDescription || '',
    pricingType: editingService?.pricing?.type || 'fixed',
    amount: editingService?.pricing?.amount || '',
    pricingDetails: editingService?.pricing?.details || '',
    location: editingService?.location || '',
    phone: editingService?.contactInfo?.phone || '',
    email: editingService?.contactInfo?.email || '',
    selectedDays: editingService?.availability?.days || [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    startTime: editingService?.availability?.hours?.split(' - ')[0] || '09:00',
    endTime: editingService?.availability?.hours?.split(' - ')[1] || '18:00',
    tags: editingService?.tags?.join(', ') || '',
    images: editingService?.images || [],
    status: editingService?.status || 'Draft',
  });

  const [imagePreview, setImagePreview] = useState<string[]>(
    editingService?.images || []
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreview((prev) => [...prev, ...newImages]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent, status: 'Published' | 'Draft') => {
    e.preventDefault();

    const serviceData: ServiceData = {
      id: editingService?.id || `svc-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      categoryColor:
        categoryOptions.find((cat) => cat.value === formData.category)?.color ||
        '#E3F2FD',
      description: formData.description,
      detailedDescription: formData.detailedDescription,
      status: status,
      createdAt: editingService?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pricing: formData.amount
        ? {
            amount: String(parseFloat(formData.amount as string)),
            currency: '₹',
            details: formData.pricingDetails,
            type:
              formData.pricingType === 'fixed'
                ? 'Fixed'
                : formData.pricingType === 'hourly'
                  ? 'Hourly'
                  : 'On Request',
          }
        : undefined,
      availability: {
        days: formData.selectedDays,
        hours: `${formData.startTime} - ${formData.endTime}`,
      },
      location: formData.location,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
      },
      images: formData.images,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      rating: editingService?.rating || 0,
      reviewCount: editingService?.reviewCount || 0,
      completedJobs: editingService?.completedJobs || 0,
    };

    onSubmit(serviceData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Service Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Professional Tyre Repair"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    required
                  />
                </div>

                {/* Category and Contact Number Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-10 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Number (Optional) */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of your service"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    required
                  />
                  <p className="mt-1 text-right text-xs text-gray-500">0/30</p>
                </div>

                {/* Pricing Option */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Pricing Option *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="pricingType"
                        value="fixed"
                        checked={formData.pricingType === 'fixed'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#f36969] focus:ring-[#f36969]"
                      />
                      <span className="text-sm text-gray-700">Fixed Price</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="pricingType"
                        value="quote"
                        checked={formData.pricingType === 'quote'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#f36969] focus:ring-[#f36969]"
                      />
                      <span className="text-sm text-gray-700">On Request</span>
                    </label>
                  </div>
                </div>

                {/* Amount (if Fixed Price) */}
                {formData.pricingType === 'fixed' && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="2500"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-10 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                      />
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Business Hours
                  </label>
                  <div className="mb-4 grid grid-cols-4 gap-2 md:grid-cols-7">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                          formData.selectedDays.includes(day)
                            ? 'border-[#f36969] bg-[#f36969] text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#f36969]'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs text-gray-600">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs text-gray-600">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai, Maharashtra"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-10 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    />
                  </div>
                </div>

                {/* Full Address (Optional) */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Address (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Complete address"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                  />
                </div>

                {/* Image Gallery */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Image Gallery
                  </label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {imagePreview.map((img, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200"
                      >
                        <Img
                          src={img}
                          width={400}
                          height={400}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {imagePreview.length < 4 && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-[#f36969] hover:bg-[#f36969]/5">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-xs font-semibold text-[#f36969]">
                          Add Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Max image size: 2MB each
                  </p>
                </div>

                {/* Service Visibility */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Service Visibility
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.status === 'Published'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.checked ? 'Published' : 'Draft',
                        }))
                      }
                      className="h-5 w-5 rounded border-gray-300 text-[#f36969] focus:ring-[#f36969]"
                    />
                    <span className="text-sm text-gray-700">
                      Set as available
                    </span>
                  </label>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'Draft')}
                  className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={(e) => handleSubmit(e, 'Published')}
                  className="rounded-xl bg-[#f36969] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e85555]"
                >
                  {editingService ? 'Update Service' : 'List Service'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
