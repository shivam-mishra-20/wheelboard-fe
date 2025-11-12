'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, CheckCircle2, Share2 } from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function CompanyFeedsPage() {
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = api.getCurrentUser();
  const currentUserId = currentUser?.id || null;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch posts from API - only run once on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!currentUser) {
          setError('Please log in to view posts');
          setIsLoading(false);
          return;
        }

        // Get posts for current user
        const response = await wheelboardApi.post.getPostsByUser(
          currentUser.id
        );
        const posts = (response.data as any[]) || [];

        // Transform API Post data to FeedPost format
        const transformedPosts: FeedPost[] = posts.map((post: any) => ({
          id: post.postId,
          author: {
            name:
              currentUser?.name || currentUser?.companyName || 'Anonymous User',
            avatar: '/profile.png',
            initials: (currentUser?.name || currentUser?.companyName || 'A')
              .substring(0, 2)
              .toUpperCase(),
            userType: 'company' as const,
            id: currentUser?.id || 'unknown',
            company: currentUser?.companyName || 'Company',
          },
          content: post.content,
          image:
            post.imageUrls && post.imageUrls.length > 0
              ? encodeURI(post.imageUrls[0])
              : undefined,
          timestamp: post.dateEntered,
          timeAgo: formatTimeAgo(post.dateEntered),
          likes: 0, // API doesn't provide likes
          shares: 0, // API doesn't provide shares
          comments: [], // API doesn't provide comments
          isLiked: false,
          category: post.category,
        }));

        setFeeds(transformedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts from API.');
        setFeeds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - currentUser is stable from api.getCurrentUser()

  const handlePostCreated = async (
    content: string,
    category: CategoryType,
    imageFile?: File
  ) => {
    try {
      if (!currentUser) {
        setError('Please log in to create posts');
        return;
      }

      // Create post via API with proper field mapping
      const postData = {
        UserId: currentUser.id,
        Content: content,
        Category: category,
        Images: imageFile ? [imageFile] : [], // Pass the actual image file
        CreatedBy: currentUser.id,
        PartnerId: 0,
      };

      console.log('Creating post with data:', postData);
      const response = await wheelboardApi.post.addPost(postData);

      if (response.success) {
        // Add new post to state
        const newPost: FeedPost = {
          id: `post-${Date.now()}`,
          author: {
            name: currentUser.name || currentUser.companyName || 'Anonymous',
            avatar: '/profile.png',
            initials: (currentUser.name || currentUser.companyName || 'A')
              .substring(0, 2)
              .toUpperCase(),
            userType: 'company' as const,
            id: currentUser.id,
            company: currentUser.companyName || 'Company',
          },
          content: content,
          image: imageFile ? URL.createObjectURL(imageFile) : undefined,
          timestamp: new Date().toISOString(),
          timeAgo: 'Just now',
          likes: 0,
          shares: 0,
          comments: [],
          isLiked: false,
          category: category,
        };

        setFeeds([newPost, ...feeds]);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await wheelboardApi.post.deletePost(postId);
      setFeeds((prev) => prev.filter((f) => f.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
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
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
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
                    name:
                      currentUser?.name ||
                      currentUser?.companyName ||
                      'Anonymous',
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
    <CompanyProtected>
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
                  Community Feeds
                </h1>
                <p className="text-gray-600">
                  Stay connected with the fleet management community
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg sm:flex"
              >
                <Plus className="h-5 w-5" />
                Create Post
              </motion.button>
            </div>
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

            {/* Mobile: show a Filters button that toggles a collapsible panel */}
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
              <p className="ml-3 text-gray-600">Loading posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-red-100 p-1">
                  <svg
                    className="h-4 w-4 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="font-medium text-red-800">Error loading posts</p>
              </div>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Feeds Grid */}
          {!isLoading && (
            <>
              {filteredFeeds.length === 0 ? (
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
                    Try adjusting your filter to see more posts, or create the
                    first post!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    Create Post
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
                      onDelete={handleDelete}
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

          {/* Success Toast */}
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 0.8,
                  transition: { duration: 0.2 },
                }}
                className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-white shadow-2xl"
              >
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Post Created Successfully!</p>
                  <p className="text-sm text-green-100">
                    Your post is now visible to the community.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Share Toast */}
          <AnimatePresence>
            {showShareToast && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 0.8,
                  transition: { duration: 0.2 },
                }}
                className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-white shadow-2xl"
              >
                <Share2 className="h-6 w-6" />
                <p className="font-semibold">Post Shared Successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </CompanyProtected>
  );
}
