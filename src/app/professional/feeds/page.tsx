'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Filter, Share2 } from 'lucide-react';
import { ProfessionalProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeedCard from '@/components/company/FeedCard';
import { communityFeeds, mockAPI } from '@/lib/mockApi';
import type { FeedPost } from '@/lib/mockApi';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProfessionalFeedsPage() {
  const [feeds, setFeeds] = useState<FeedPost[]>(communityFeeds);
  const session = mockAPI.getCurrentSession();
  const currentUserId = session?.user?.id || null;
  const [showShareToast, setShowShareToast] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleComment = (postId: string, commentText: string) => {
    setFeeds((prevFeeds) =>
      prevFeeds.map((feed) =>
        feed.id === postId
          ? {
              ...feed,
              comments: [
                ...feed.comments,
                {
                  id: `comment-${Date.now()}`,
                  author: {
                    name: session?.user?.companyName || 'Professional',
                    avatar: 'profile.png',
                    id: currentUserId || `user-${Date.now()}`,
                  },
                  content: commentText,
                  timestamp: new Date().toISOString(),
                  timeAgo: 'Just now',
                },
              ],
            }
          : feed
      )
    );
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setFeeds((prev) =>
      prev.map((f) =>
        f.id === postId
          ? { ...f, comments: f.comments.filter((c) => c.id !== commentId) }
          : f
      )
    );
  };

  const filteredFeeds =
    filterCategory === 'all'
      ? feeds
      : feeds.filter((feed) => feed.category === filterCategory);

  const stats = [
    {
      icon: Users,
      label: 'Community Members',
      value: '12,547',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Active Discussions',
      value: '342',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Share2,
      label: 'Posts This Week',
      value: '1,234',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <ProfessionalProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  Professional Feeds
                </h1>
                <p className="text-gray-600">
                  Stay connected with the fleet management community
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md"
              >
                <div className={`rounded-xl ${stat.bg} p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 rounded-2xl bg-white p-4 shadow-md"
          >
            <div className="hidden items-center gap-4 overflow-x-auto sm:flex">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="h-5 w-5" />
                <span className="whitespace-nowrap font-semibold">Filter:</span>
              </div>

              {[
                { value: 'all', label: 'All Posts' },
                { value: 'Promotions', label: 'Promotions' },
                { value: 'tip', label: 'Tips' },
                { value: 'services', label: 'Services' },
                { value: 'question', label: 'Questions' },
                { value: 'general', label: 'General' },
              ].map((category) => (
                <motion.button
                  key={category.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterCategory(category.value)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    filterCategory === category.value
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-between sm:hidden">
              <button
                onClick={() => setMobileFiltersOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <span className="text-sm text-gray-500">
                {filteredFeeds.length} posts
              </span>
            </div>

            {mobileFiltersOpen && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
                {[
                  { value: 'all', label: 'All Posts' },
                  { value: 'Promotions', label: 'Promotions' },
                  { value: 'tip', label: 'Tips' },
                  { value: 'services', label: 'Services' },
                  { value: 'question', label: 'Questions' },
                  { value: 'general', label: 'General' },
                ].map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setFilterCategory(category.value);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                      filterCategory === category.value
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Feeds Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {filteredFeeds.map((feed) => (
              <FeedCard
                key={feed.id}
                post={feed}
                onLike={handleLike}
                onShare={handleShare}
                onComment={handleComment}
                currentUserId={currentUserId}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredFeeds.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-white p-16 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Posts Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filter to see more posts
              </p>
            </motion.div>
          )}

          {/* Share Toast */}
          {showShareToast && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-white shadow-2xl"
            >
              <Share2 className="h-6 w-6" />
              <p className="font-semibold">Post Shared Successfully!</p>
            </motion.div>
          )}
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </ProfessionalProtected>
  );
}
