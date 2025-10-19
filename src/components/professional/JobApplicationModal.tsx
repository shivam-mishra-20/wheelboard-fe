'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Upload,
  Check,
} from 'lucide-react';
import { DetailedJob } from '@/lib/mockApi';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: DetailedJob;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  job,
}: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    experience: '',
    location: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          resume: 'File size must be less than 5MB',
        }));
        return;
      }
      if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
        setErrors((prev) => ({
          ...prev,
          resume: 'Only PDF, DOC, and DOCX files are allowed',
        }));
        return;
      }
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.candidateName.trim()) {
      newErrors.candidateName = 'Name is required';
    }
    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail)) {
      newErrors.candidateEmail = 'Invalid email format';
    }
    if (!formData.candidatePhone.trim()) {
      newErrors.candidatePhone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.candidatePhone)) {
      newErrors.candidatePhone = 'Invalid phone number';
    }
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Mock submission - in real app, this would call an API
    console.log('Submitting application:', {
      ...formData,
      jobId: job.id,
      jobTitle: job.title,
      resume: resumeFile?.name,
    });

    setSubmitted(true);

    // Reset and close after showing success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        candidateName: '',
        candidateEmail: '',
        candidatePhone: '',
        experience: '',
        location: '',
        coverLetter: '',
      });
      setResumeFile(null);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-[#f36969]/10 to-[#f36565]/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#535353]">
                  Apply for Job
                </h2>
                <p className="mt-1 text-sm text-gray-600">{job.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {job.department} • {job.location}
                </p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full bg-white p-2 text-gray-400 shadow-md transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-[#535353]">
                  Application Submitted!
                </h3>
                <p className="text-gray-600">
                  Your application has been successfully submitted. The company
                  will review it and contact you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#535353]">
                    Full Name <span className="text-[#f36969]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full rounded-lg border ${
                        errors.candidateName
                          ? 'border-red-300'
                          : 'border-gray-200'
                      } bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20`}
                    />
                  </div>
                  {errors.candidateName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.candidateName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#535353]">
                    Email Address <span className="text-[#f36969]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="candidateEmail"
                      value={formData.candidateEmail}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`w-full rounded-lg border ${
                        errors.candidateEmail
                          ? 'border-red-300'
                          : 'border-gray-200'
                      } bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20`}
                    />
                  </div>
                  {errors.candidateEmail && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.candidateEmail}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#535353]">
                    Phone Number <span className="text-[#f36969]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="candidatePhone"
                      value={formData.candidatePhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`w-full rounded-lg border ${
                        errors.candidatePhone
                          ? 'border-red-300'
                          : 'border-gray-200'
                      } bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20`}
                    />
                  </div>
                  {errors.candidatePhone && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.candidatePhone}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#535353]">
                    Years of Experience{' '}
                    <span className="text-[#f36969]">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g., 5 years"
                      className={`w-full rounded-lg border ${
                        errors.experience ? 'border-red-300' : 'border-gray-200'
                      } bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20`}
                    />
                  </div>
                  {errors.experience && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.experience}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#535353]">
                    Current Location <span className="text-[#f36969]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Mumbai, Maharashtra"
                      className={`w-full rounded-lg border ${
                        errors.location ? 'border-red-300' : 'border-gray-200'
                      } bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20`}
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#535353]">
                    Resume/CV{' '}
                    <span className="text-xs font-normal text-gray-500">
                      (Optional - PDF, DOC, DOCX, max 5MB)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-4 text-sm text-gray-600 transition-colors hover:border-[#f36969] hover:bg-[#f36969]/5"
                    >
                      <Upload className="h-5 w-5" />
                      {resumeFile ? (
                        <span className="font-medium text-[#535353]">
                          {resumeFile.name}
                        </span>
                      ) : (
                        <span>Click to upload resume</span>
                      )}
                    </label>
                  </div>
                  {errors.resume && (
                    <p className="mt-1 text-xs text-red-600">{errors.resume}</p>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#535353]">
                    Cover Letter{' '}
                    <span className="text-xs font-normal text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us why you're a great fit for this position..."
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-[#535353] placeholder:text-gray-400 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-[#535353] transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-[#f36969] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#f36565]"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
