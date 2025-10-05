'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Lightbulb, Layers, Briefcase, Send } from 'lucide-react';
import type { CategoryType } from '@/lib/mockApi';

// Local CategoryType pulled from shared mock types

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated: (
    content: string,
    category: CategoryType,
    image?: string
  ) => void;
}

export default function CreatePostModal({
  open,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('tip');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories: {
    value: CategoryType;
    label: string;
    icon: React.ComponentType<Record<string, unknown>>;
  }[] = [
    { value: 'tip', label: 'Tips', icon: Lightbulb },
    { value: 'services', label: 'Services', icon: Layers },
    { value: 'Promotions', label: 'Promotions', icon: Briefcase },
    { value: 'question', label: 'Question', icon: Lightbulb },
    { value: 'general', label: 'General', icon: Layers },
  ];

  const handleImageSelect = () => {
    // Placeholder for image upload - in production would use file input
    const demoImages = [
      '/truck-01.jpg',
      '/mining-truck.jpg',
      '/yellow-truck.jpg',
      '/excavator.jpg',
    ];
    const randomImage =
      demoImages[Math.floor(Math.random() * demoImages.length)];
    setSelectedImage(randomImage);
  };

  const handlePost = () => {
    if (content.trim() && selectedCategory) {
      onPostCreated(content, selectedCategory, selectedImage || undefined);
      setContent('');
      setSelectedCategory('tip');
      setSelectedImage(null);
      onClose();
    }
  };

  const handleClose = () => {
    setContent('');
    setSelectedCategory('tip');
    setSelectedImage(null);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Create Post
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Text Area */}
            <div className="mb-4 sm:mb-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 sm:rounded-2xl sm:p-4 sm:text-base"
                rows={4}
              />
            </div>

            {/* Category Selection */}
            <div className="mb-4 rounded-xl border-2 border-gray-200 bg-white p-3 sm:mb-6 sm:rounded-2xl sm:p-5">
              <h3 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
                Select Category
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex w-full items-center justify-between rounded-lg p-3 transition-all sm:rounded-xl sm:p-4 ${
                      selectedCategory === category.value
                        ? 'bg-primary-50 ring-2 ring-primary-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
                          selectedCategory === category.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-600'
                        }`}
                      >
                        <category.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span
                        className={`text-sm font-semibold sm:text-base ${
                          selectedCategory === category.value
                            ? 'text-primary-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {category.label}
                      </span>
                    </div>
                    <div
                      className={`h-4 w-4 flex-shrink-0 rounded-full border-2 sm:h-5 sm:w-5 ${
                        selectedCategory === category.value
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedCategory === category.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-full w-full items-center justify-center"
                        >
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="relative mb-4 h-48 overflow-hidden rounded-lg sm:mb-6 sm:h-64 sm:rounded-xl">
                <Image
                  src={selectedImage}
                  alt="Selected"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Upload and Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImageSelect}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:border-primary-300 hover:bg-gray-50 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              >
                <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="xs:inline hidden">
                  Upload Pictures (optional)
                </span>
                <span className="xs:hidden">Upload Picture</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImageSelect}
                className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-red-600 sm:w-auto sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
              >
                + Browse File
              </motion.button>
            </div>

            {/* Bottom Action Buttons */}
            <div className="mt-4 flex gap-2 sm:mt-6 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePost}
                disabled={!content.trim()}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all sm:rounded-xl sm:px-6 sm:py-3 sm:text-base ${
                  content.trim()
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'cursor-not-allowed bg-gray-300'
                }`}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                Post
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
