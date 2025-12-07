'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Share2 } from 'lucide-react';
import { ProfessionalProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeedCard from '@/components/company/FeedCard';
import { mockAPI } from '@/lib/mockApi';
import type { FeedPost } from '@/lib/mockApi';
import { wheelboardApi } from '@/lib/wheelboardApi';

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
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const session = mockAPI.getCurrentSession();
  const currentUserId = session?.user?.id || null;
  const [showShareToast, setShowShareToast] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('🔍 Fetching all posts...');
        setLoading(true);

        const response = await wheelboardApi.post.getAllPosts();
        console.log('📦 Posts API Response:', response);

        const postsData: any[] = Array.isArray(response)
          ? response
          : (response as any)?.data || [];

        // Map API response to FeedPost format
        const mappedFeeds: FeedPost[] = postsData.map((post: any) => {
          const userName = post.userName || 'Anonymous';
          return {
            id: post.postId,
            author: {
              id: post.userId || 'unknown',
              name: userName,
              avatar: '/profile.png',
              role: 'Community Member',
              userType: 'professional',
              initials: userName.charAt(0).toUpperCase(),
            },
            content: post.content || '',
            category: post.category || 'general',
            images: post.imageUrls || [],
            timestamp: post.dateEntered || new Date().toISOString(),
            timeAgo: getTimeAgo(new Date(post.dateEntered)),
            likes: 0,
            comments: [],
            shares: 0,
            status: post.status || 'Pending',
          };
        });

        setFeeds(mappedFeeds);
        console.log('✅ Posts loaded:', mappedFeeds.length);
      } catch (error) {
        console.error('❌ Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Helper function to calculate time ago
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

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
      : feeds.filter(
          (feed) =>
            feed.category &&
            feed.category.toLowerCase() === filterCategory.toLowerCase()
        );

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
            className="mb-6 lg:mb-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-1.5 text-2xl font-bold text-[#535353] lg:text-3xl">
                  Community Feeds
                </h1>
                <p className="text-sm text-gray-600 lg:text-base">
                  Discover tips, promotions, and insights from the community
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-[#f36969]">
                  {feeds.length}
                </span>{' '}
                Posts
              </div>
            </div>
          </motion.div>

          {/* Stats Cards
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
          </motion.div> */}

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-5 rounded-xl border-2 border-gray-100 bg-white p-3 shadow-sm lg:mb-6 lg:rounded-2xl lg:p-4"
          >
            <div className="hidden items-center gap-3 overflow-x-auto lg:flex">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="h-4 w-4 text-[#f36969] lg:h-5 lg:w-5" />
                <span className="whitespace-nowrap text-sm font-semibold lg:text-base">
                  Filter:
                </span>
              </div>

              {[
                { value: 'all', label: 'All Posts' },
                { value: 'Tips', label: 'Tips' },
                { value: 'Promotions', label: 'Promotions' },
                { value: 'Services', label: 'Services' },
                { value: 'question', label: 'Questions' },
                { value: 'general', label: 'General' },
              ].map((category) => (
                <motion.button
                  key={category.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterCategory(category.value)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all lg:rounded-xl lg:text-base ${
                    filterCategory === category.value
                      ? 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md shadow-[#f36969]/20'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-between lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <span className="text-sm font-medium text-gray-500">
                {filteredFeeds.length} posts
              </span>
            </div>

            {mobileFiltersOpen && (
              <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
                {[
                  { value: 'all', label: 'All Posts' },
                  { value: 'Tips', label: 'Tips' },
                  { value: 'Promotions', label: 'Promotions' },
                  { value: 'Services', label: 'Services' },
                  { value: 'question', label: 'Questions' },
                  { value: 'general', label: 'General' },
                ].map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setFilterCategory(category.value);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                      filterCategory === category.value
                        ? 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex min-h-[500px] items-center justify-center rounded-2xl border-2 border-gray-100 bg-white">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-[#f36969]" />
                <p className="text-base font-semibold text-gray-700">
                  Loading posts...
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please wait while we fetch the latest updates
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Feeds Grid */}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4 lg:space-y-5"
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
                  className="rounded-2xl border-2 border-gray-100 bg-white p-12 text-center shadow-sm lg:rounded-3xl lg:p-16"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Filter className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#535353] lg:text-2xl">
                    No Posts Found
                  </h3>
                  <p className="text-sm text-gray-600 lg:text-base">
                    Try adjusting your filter to see more posts from the
                    community
                  </p>
                </motion.div>
              )}
            </>
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
