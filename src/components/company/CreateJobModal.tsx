'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Wrench, Users as UsersIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobFormData & { id?: string }) => void; // include optional id for edit
  initialData?: Partial<JobFormData & { id?: string }> | null;
  mode?: 'create' | 'edit';
  allowedJobTypes?: ('Driver' | 'Technician' | 'Helper')[]; // Restrict job types (e.g., Business can only post Technician/Helper)
}

interface JobFormData {
  jobType: 'Driver' | 'Technician' | 'Helper' | '';
  duration: 'Permanent' | 'Temporary' | 'Task Based' | '';
  openings: string;
  salary: string;
  city: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | '';
  description: string;
  images: File[];
}

const jobTypeIcons = {
  Driver: User,
  Technician: Wrench,
  Helper: UsersIcon,
};

export default function CreateJobModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = 'create',
  allowedJobTypes = ['Driver', 'Technician', 'Helper'], // Default to all job types if not specified
}: CreateJobModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    jobType: '',
    duration: '',
    openings: '',
    salary: '',
    city: '',
    type: '',
    description: '',
    images: [],
  });

  const [uploadedImages, setUploadedImages] = useState<
    { file: File; preview: string; uploaded: boolean }[]
  >([]);

  const handleJobTypeSelect = (type: 'Driver' | 'Technician' | 'Helper') => {
    setFormData({ ...formData, jobType: type });
  };

  // Prefill when initialData provided (edit mode)
  React.useEffect(() => {
    if (initialData) {
      const copy: Partial<JobFormData> = {};
      if (initialData.jobType)
        copy.jobType = initialData.jobType as JobFormData['jobType'];
      if (initialData.duration)
        copy.duration = initialData.duration as JobFormData['duration'];
      if (initialData.openings) copy.openings = initialData.openings;
      if (initialData.salary) copy.salary = initialData.salary;
      if (initialData.city) copy.city = initialData.city;
      if (initialData.type) copy.type = initialData.type as JobFormData['type'];
      if (initialData.description) copy.description = initialData.description;

      const images = (initialData as Partial<JobFormData>)?.images;
      if (images && Array.isArray(images)) {
        setUploadedImages(
          images.map((file: File) => ({
            file,
            preview: URL.createObjectURL(file),
            uploaded: true,
          }))
        );
        copy.images = images as File[];
      }

      setFormData((prev) => ({ ...prev, ...copy }) as JobFormData);
    } else if (!isOpen) {
      // clear when modal closed
      setFormData({
        jobType: '',
        duration: '',
        openings: '',
        salary: '',
        city: '',
        type: '',
        description: '',
        images: [],
      });
      setUploadedImages([]);
      setCurrentStep(1);
    }
  }, [initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
    }));

    setUploadedImages([...uploadedImages, ...newImages]);
    setFormData({ ...formData, images: [...formData.images, ...files] });

    // Simulate upload success after 1 second
    setTimeout(() => {
      setUploadedImages((prev) =>
        prev.map((img) => ({ ...img, uploaded: true }))
      );
    }, 1000);
  };

  const handleSubmit = () => {
    if (!formData.jobType || !formData.duration) {
      alert('Please fill in all required fields');
      return;
    }
    const payload: Partial<JobFormData & { id?: string }> = { ...formData };
    if (initialData && (initialData as Partial<{ id?: string }>).id) {
      payload.id = (initialData as Partial<{ id?: string }>).id;
    }
    onSubmit(payload as JobFormData & { id?: string });
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      jobType: '',
      duration: '',
      openings: '',
      salary: '',
      city: '',
      type: '',
      description: '',
      images: [],
    });
    setUploadedImages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-red-50 p-0">
        {/* Custom Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'edit' ? 'Edit Job' : 'Post a Job'}
              </h2>
              <p className="text-sm text-gray-500">Step {currentStep} of 2</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Job Type Selection - Step 1 Header */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Job Details
                  </h3>

                  {/* Job Type Buttons */}
                  <div className="mb-6 flex flex-wrap gap-3">
                    {allowedJobTypes.map((type) => {
                      const Icon = jobTypeIcons[type];
                      const isSelected = formData.jobType === type;
                      return (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleJobTypeSelect(type)}
                          className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 font-semibold transition-all ${
                            isSelected
                              ? 'border-red-400 bg-red-50 text-red-600'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50/50'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {type}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Job Duration */}
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-sm font-medium text-gray-700"
                  >
                    Job duration
                  </Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        duration: value as JobFormData['duration'],
                      })
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 bg-white">
                      <SelectValue placeholder="Select Job Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Task Based">Task Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Opening and Salary - Side by Side */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="openings"
                      className="text-sm font-medium text-gray-700"
                    >
                      Opening
                    </Label>
                    <Input
                      id="openings"
                      name="openings"
                      type="number"
                      placeholder="No. of Openings"
                      value={formData.openings}
                      onChange={handleInputChange}
                      className="h-12 border-2 border-gray-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="salary"
                      className="text-sm font-medium text-gray-700"
                    >
                      Salary
                    </Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="text"
                      placeholder="Salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="h-12 border-2 border-gray-200 bg-white"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="h-12 border-2 border-gray-200 bg-white"
                  />
                </div>

                {/* Type of Job */}
                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-700"
                  >
                    Type of job
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value as JobFormData['type'],
                      })
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 bg-white">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="resize-none border-2 border-gray-200 bg-white"
                  />
                </div>

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.jobType || !formData.duration}
                  className="w-full rounded-lg bg-gradient-to-r from-red-400 to-red-500 py-3.5 font-semibold text-white shadow-lg transition-all hover:from-red-500 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next Step
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Step 2 - Image Upload */}
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Upload Images
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Upload images of vehicles or Job Poster
                  </p>

                  {/* Upload Button */}
                  <div className="mb-4">
                    <label
                      htmlFor="file-upload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-red-400 to-red-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-red-500 hover:to-red-600"
                    >
                      <Upload className="h-5 w-5" />
                      Upload
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Uploaded Images List */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      {uploadedImages.map((img, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                        >
                          <span className="truncate text-sm text-gray-700">
                            {img.file.name}
                          </span>
                          {img.uploaded ? (
                            <span className="text-sm font-semibold text-green-600">
                              uploaded successfully
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Uploading...
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 rounded-lg border-2 border-gray-300 bg-white py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 rounded-lg bg-gradient-to-r from-red-400 to-red-500 py-3.5 font-semibold text-white shadow-lg transition-all hover:from-red-500 hover:to-red-600"
                  >
                    Save Now!
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
