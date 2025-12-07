'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  Users,
  Filter,
  CheckCircle2,
  Share2,
  Sparkles,
  X,
  Trash2,
} from 'lucide-react';
import { BusinessProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeedCard from '@/components/company/FeedCard';
import CreatePostModal from '@/components/company/CreatePostModal';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
import type { FeedPost, CategoryType } from '@/lib/mockApi';

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}

// Toast notification types
type ToastType = 'success' | 'error' | 'info' | 'delete';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function BusinessFeedsPage() {
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');

  // Get current user once and memoize
  const currentUser = api.getCurrentUser();
  const currentUserId = currentUser?.id || null;
  const currentUserName = currentUser?.businessName || currentUser?.name || '';

  // Toast helper function
  const showToast = (type: ToastType, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch posts from API - refetch when viewMode changes
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (viewMode === 'my') {
          // Get user's own posts only
          if (!currentUserId) {
            if (isMounted) {
              setError('Please log in to view your posts');
              setIsLoading(false);
            }
            return;
          }
          console.log('Fetching user posts for userId:', currentUserId);
          response = await wheelboardApi.post.getPostsByUser(currentUserId);
        } else {
          // Get ALL posts from database
          console.log('Fetching all posts');
          response = await wheelboardApi.post.getAllPosts();
        }

        if (!isMounted) return;

        const posts = (response.data as any[]) || [];

        console.log(
          `📰 Posts API Response (${viewMode === 'my' ? 'My Posts' : 'All Posts'}):`,
          posts
        );

        // Transform API Post data to FeedPost format
        const transformedPosts: FeedPost[] = posts.map((post: any) => {
          const imageUrls = post.imageUrls || [];
          // For My Posts, userName may be null from API, use currentUserName
          const authorName =
            viewMode === 'my'
              ? currentUserName
              : post.userName || post.businessName || 'Business User';

          return {
            id: post.postId,
            author: {
              name: authorName,
              avatar: '/profile.png',
              initials: authorName.substring(0, 2).toUpperCase(),
              userType: 'business' as const,
              id:
                viewMode === 'my'
                  ? currentUserId || 'unknown'
                  : post.userId || 'unknown',
              company: authorName,
            },
            content: post.content,
            image: imageUrls.length > 0 ? imageUrls[0] : undefined,
            timestamp: post.dateEntered || new Date().toISOString(),
            timeAgo: formatTimeAgo(
              post.dateEntered || new Date().toISOString()
            ),
            likes: post.likeCount || 0,
            shares: 0,
            comments: [],
            isLiked: post.isLiked || false,
            category: post.category,
            status: post.status,
          };
        });

        if (isMounted) {
          setFeeds(transformedPosts);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching posts:', err);
        if (isMounted) {
          setError('Failed to load posts from API.');
          setFeeds([]);
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentUserId]);

  const handlePostCreated = async (
    content: string,
    category: CategoryType,
    imageFile?: File
  ) => {
    try {
      if (!currentUserId) {
        setError('Please log in to create posts');
        return;
      }

      // Create post via API with proper field mapping
      const postData = {
        UserId: currentUserId,
        Content: content,
        Category: category,
        Images: imageFile ? [imageFile] : [],
        CreatedBy: currentUserId,
        PartnerId: 0,
      };

      console.log('Creating post with data:', postData);
      const response = await wheelboardApi.post.addPost(postData);
      console.log('Create post response:', response);

      if (response.success) {
        // Refetch posts based on current view mode
        let postsResponse;
        if (viewMode === 'my') {
          postsResponse =
            await wheelboardApi.post.getPostsByUser(currentUserId);
        } else {
          postsResponse = await wheelboardApi.post.getAllPosts();
        }

        const posts = (postsResponse.data as any[]) || [];

        // Transform API Post data to FeedPost format
        const transformedPosts: FeedPost[] = posts.map((post: any) => {
          const imageUrls = post.imageUrls || [];
          const authorName =
            viewMode === 'my'
              ? currentUserName
              : post.userName || post.businessName || 'Business User';

          return {
            id: post.postId,
            author: {
              name: authorName,
              avatar: '/profile.png',
              initials: authorName.substring(0, 2).toUpperCase(),
              userType: 'business' as const,
              id:
                viewMode === 'my'
                  ? currentUserId || 'unknown'
                  : post.userId || 'unknown',
              company: authorName,
            },
            content: post.content,
            image: imageUrls.length > 0 ? imageUrls[0] : undefined,
            timestamp: post.dateEntered || new Date().toISOString(),
            timeAgo: formatTimeAgo(
              post.dateEntered || new Date().toISOString()
            ),
            likes: post.likeCount || 0,
            shares: 0,
            comments: [],
            isLiked: post.isLiked || false,
            category: post.category,
            status: post.status,
          };
        });

        setFeeds(transformedPosts);
        showToast('success', 'Post Created!', 'Your post is now live.');
      }
    } catch (err) {
      console.error('❌ Error creating post:', err);
      showToast('error', 'Error', 'Failed to create post. Please try again.');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      console.log('Deleting post:', postId);
      const response = await wheelboardApi.post.deletePost(postId);
      console.log('Delete response:', response);

      // If we got here without throwing, the delete was successful
      // Remove from UI immediately
      setFeeds((prev) => prev.filter((f) => f.id !== postId));

      // Show success message
      showToast(
        'success',
        'Post Deleted',
        'Your post has been removed successfully.'
      );
    } catch (err: any) {
      console.error('❌ Error deleting post:', err);

      // Check if the error message indicates success (some APIs return success in error format)
      const errorMessage = err?.message?.toLowerCase() || '';
      if (
        errorMessage.includes('success') ||
        errorMessage.includes('deleted')
      ) {
        // It was actually successful
        setFeeds((prev) => prev.filter((f) => f.id !== postId));
        showToast(
          'success',
          'Post Deleted',
          'Your post has been removed successfully.'
        );
      } else {
        showToast(
          'error',
          'Error',
          err.message || 'Failed to delete post. Please try again.'
        );
      }
    }
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

  const handleLike = (postId: string) => {
    setFeeds((prevFeeds) =>
      prevFeeds.map((feed) =>
        feed.id === postId
          ? {
              ...feed,
              isLiked: !feed.isLiked,
              likes: feed.isLiked ? feed.likes - 1 : feed.likes + 1,
            }
          : feed
      )
    );
  };

  const handleShare = (postId: string) => {
    // Simulate share action
    setFeeds((prevFeeds) =>
      prevFeeds.map((feed) =>
        feed.id === postId ? { ...feed, shares: feed.shares + 1 } : feed
      )
    );
    showToast('info', 'Shared!', 'Post link copied to clipboard.');
  };

  const handleComment = (postId: string, commentText: string) => {
    if (!currentUserId || !commentText.trim()) return;

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
                    name: currentUser?.name || currentUser?.businessName || '',
                    avatar: '/profile.png',
                    id: currentUserId,
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

  const filteredFeeds =
    filterCategory === 'all'
      ? feeds
      : feeds.filter((feed) => feed.category === filterCategory);

  return (
    <BusinessProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          {/* Page Header - Modern Design */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Business Feeds
                  </h1>
                  <Sparkles className="h-5 w-5 text-amber-500 sm:h-6 sm:w-6" />
                </div>
                <p className="text-sm text-gray-500 sm:text-base">
                  Connect with service providers worldwide
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 sm:flex"
              >
                <Plus className="h-4 w-4" />
                Create Post
              </motion.button>
            </div>
          </motion.div>

          {/* View Mode Toggle - Modern Pill Design */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 sm:mb-6"
          >
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>All Posts</span>
              </button>
              <button
                onClick={() => setViewMode('my')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === 'my'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>My Posts</span>
              </button>
            </div>
          </motion.div>

          {/* Filter Bar - Compact & Modern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            {/* Desktop Filters */}
            <div className="hidden flex-wrap items-center gap-2 sm:flex">
              {[
                { value: 'all', label: 'All', icon: '🌐' },
                { value: 'Promotions', label: 'Promotions', icon: '📢' },
                { value: 'tip', label: 'Tips', icon: '💡' },
                { value: 'services', label: 'Services', icon: '🔧' },
                { value: 'question', label: 'Questions', icon: '❓' },
                { value: 'general', label: 'General', icon: '💬' },
              ].map((category) => (
                <motion.button
                  key={category.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterCategory(category.value)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                    filterCategory === category.value
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                      : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:shadow'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Filters */}
            <div className="flex items-center justify-between sm:hidden">
              <button
                onClick={() => setMobileFiltersOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                <Filter className="h-4 w-4" />
                Filter
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-700">
                  {filterCategory === 'all' ? 'All' : filterCategory}
                </span>
              </button>
              <span className="text-sm text-gray-500">
                {filteredFeeds.length} post{filteredFeeds.length !== 1 && 's'}
              </span>
            </div>

            {/* Mobile Filter Dropdown */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden sm:hidden"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'all', label: 'All', icon: '🌐' },
                      { value: 'Promotions', label: 'Promos', icon: '📢' },
                      { value: 'tip', label: 'Tips', icon: '💡' },
                      { value: 'services', label: 'Services', icon: '🔧' },
                      { value: 'question', label: 'Q&A', icon: '❓' },
                      { value: 'general', label: 'General', icon: '💬' },
                    ].map((category) => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setFilterCategory(category.value);
                          setMobileFiltersOpen(false);
                        }}
                        className={`flex flex-col items-center gap-1 rounded-xl p-3 text-xs font-medium transition-all ${
                          filterCategory === category.value
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-white text-gray-600 shadow-sm'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading State - Modern Skeleton */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                      <div className="h-3 w-20 rounded bg-gray-200" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                  </div>
                  <div className="mt-4 h-48 rounded-xl bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {/* Error State - Modern Design */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800">
                  Something went wrong
                </p>
                <p className="mt-0.5 text-sm text-red-600">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* Feeds Grid - Modern Layout */}
          {!isLoading && (
            <>
              {filteredFeeds.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                    <Sparkles className="h-7 w-7 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {viewMode === 'my' ? 'No Posts Yet' : 'No Posts Found'}
                  </h3>
                  <p className="mx-auto max-w-sm text-sm text-gray-500">
                    {viewMode === 'my'
                      ? "You haven't created any posts yet. Share something with the community!"
                      : 'Try adjusting your filter or be the first to post!'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Post
                  </motion.button>
                </motion.div>
              ) : (
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
                      onDelete={viewMode === 'my' ? handleDelete : undefined}
                      onDeleteComment={handleDeleteComment}
                    />
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/* Floating Create Post Button (Mobile) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="fixed bottom-8 right-8 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 font-semibold text-white shadow-xl transition-all hover:shadow-2xl sm:hidden"
          >
            <Plus className="h-5 w-5" />
            <span>Post</span>
          </motion.button>

          {/* Create Post Modal */}
          <CreatePostModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onPostCreated={handlePostCreated}
          />

          {/* Modern Toast Notifications */}
          <div className="fixed right-4 top-20 z-50 flex flex-col gap-3 sm:right-6 sm:top-24">
            <AnimatePresence mode="popLayout">
              {toasts.map((toast) => {
                const toastConfig = {
                  success: {
                    bg: 'bg-gradient-to-r from-emerald-500 to-green-600',
                    icon: <CheckCircle2 className="h-5 w-5" />,
                    border: 'border-emerald-400/30',
                  },
                  error: {
                    bg: 'bg-gradient-to-r from-red-500 to-rose-600',
                    icon: <X className="h-5 w-5" />,
                    border: 'border-red-400/30',
                  },
                  info: {
                    bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
                    icon: <Share2 className="h-5 w-5" />,
                    border: 'border-blue-400/30',
                  },
                  delete: {
                    bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
                    icon: <Trash2 className="h-5 w-5" />,
                    border: 'border-amber-400/30',
                  },
                };
                const config = toastConfig[toast.type];

                return (
                  <motion.div
                    key={toast.id}
                    layout
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className={`relative flex w-80 items-center gap-3 overflow-hidden rounded-2xl border ${config.border} bg-white p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:w-96`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.bg} text-white shadow-lg`}
                    >
                      {config.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">
                        {toast.title}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {toast.message}
                      </p>
                    </div>
                    <button
                      onClick={() => removeToast(toast.id)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {/* Progress bar */}
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 4, ease: 'linear' }}
                      className={`absolute bottom-0 left-0 h-1 rounded-b-2xl ${config.bg}`}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </BusinessProtected>
  );
}
