'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  MoreHorizontal,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Link as LinkIcon,
} from 'lucide-react';
import type { FeedPost } from '@/lib/mockApi';

// Extended type to include status from API
interface ExtendedFeedPost extends FeedPost {
  status?: 'Pending' | 'Approved' | 'Rejected';
}

interface FeedCardProps {
  post: ExtendedFeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  currentUserId?: string | null;
  onDelete?: (postId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

export default function FeedCard({
  post,
  onLike,
  onShare,
  onComment,
  currentUserId,
  onDelete,
  onDeleteComment,
}: FeedCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localLiked, setLocalLiked] = useState(post.isLiked || false);
  const [localLikes, setLocalLikes] = useState(post.likes);

  const handleLike = () => {
    setLocalLiked(!localLiked);
    setLocalLikes(localLiked ? localLikes - 1 : localLikes + 1);
    onLike(post.id);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const getCategoryBadge = () => {
    if (!post.category) return null;

    const categoryLower = post.category.toLowerCase();
    const badges: Record<
      string,
      { bg: string; text: string; border: string; icon: string }
    > = {
      services: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: '🛠️',
      },
      tips: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: '💡',
      },
      promotions: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: '🎉',
      },
      question: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: '❓',
      },
      general: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: '📌',
      },
    };

    const badge = badges[categoryLower] || badges.general;
    const displayCategory =
      post.category.charAt(0).toUpperCase() + post.category.slice(1);

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
      >
        <span>{badge.icon}</span>
        {displayCategory}
      </span>
    );
  };

  const getUserTypeBadge = () => {
    const badges = {
      company: 'bg-blue-50 text-blue-600',
      business: 'bg-purple-50 text-purple-600',
      professional: 'bg-green-50 text-green-600',
    };

    return (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${badges[post.author.userType]}`}
      >
        {post.author.userType.charAt(0).toUpperCase() +
          post.author.userType.slice(1)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-[#f36969]/20 hover:shadow-xl lg:rounded-3xl"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Top Row: Avatar + Name + Actions */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative h-12 w-12 flex-shrink-0 sm:h-14 sm:w-14">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-md ring-2 ring-white sm:h-14 sm:w-14">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-white sm:text-lg">
                  {post.author.initials}
                </span>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-[#535353] sm:text-lg">
              {post.author.name}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              {post.timeAgo}
            </p>
          </div>

          {/* Delete/Menu Button */}
          <div className="flex-shrink-0">
            {onDelete ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all hover:bg-red-100 sm:h-10 sm:w-10"
                aria-label="Delete post"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </motion.button>
            ) : (
              <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100 sm:h-10 sm:w-10">
                <MoreHorizontal className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Badges Row - Below author info */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {getCategoryBadge()}
          {post.status && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                post.status === 'Approved'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : post.status === 'Rejected'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  post.status === 'Approved'
                    ? 'bg-emerald-500'
                    : post.status === 'Rejected'
                      ? 'bg-red-500'
                      : 'animate-pulse bg-amber-500'
                }`}
              />
              {post.status}
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && onDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 text-center sm:p-6">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:h-16 sm:w-16">
                  <svg
                    className="h-7 w-7 text-white sm:h-8 sm:w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Delete Post?
                </h3>
              </div>
              <div className="p-5 sm:p-6">
                <p className="mb-5 text-center text-sm text-gray-600 sm:mb-6">
                  This action cannot be undone. Are you sure you want to
                  permanently delete this post?
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 sm:py-3"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onDelete(post.id);
                      setShowDeleteConfirm(false);
                    }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:shadow-xl hover:shadow-red-500/30 sm:py-3"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="px-4 pb-3 sm:px-5 sm:pb-4 lg:px-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 sm:text-base">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div
          className={`grid gap-2 px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 ${
            post.images.length === 1
              ? 'grid-cols-1'
              : post.images.length === 2
                ? 'grid-cols-2'
                : post.images.length === 3
                  ? 'grid-cols-3'
                  : 'grid-cols-2'
          }`}
        >
          {post.images.slice(0, 4).map((imageUrl, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl bg-gray-100 ${
                post.images.length === 1 ? 'aspect-video' : 'aspect-square'
              } ${index === 3 && post.images.length > 4 ? 'relative' : ''}`}
            >
              <Image
                src={imageUrl}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              {index === 3 && post.images.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-white">
                    +{post.images.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between border-t-2 border-gray-100 px-4 py-3 sm:px-5 lg:px-6">
        <div className="flex items-center gap-4 text-xs sm:gap-6 sm:text-sm">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 transition-colors hover:text-[#f36969]"
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${localLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
            <span className="font-semibold text-gray-700">{localLikes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 transition-colors hover:text-[#f36969]"
          >
            <MessageCircle className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
            <span className="font-semibold text-gray-700">
              {post.comments.length}
            </span>
          </button>
          <span className="flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
            <span className="font-semibold text-gray-700">{post.shares}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 border-t-2 border-gray-100">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all sm:py-3.5 sm:text-base ${
            localLiked
              ? 'bg-red-50 text-red-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-[#f36969]'
          }`}
        >
          <Heart className={`h-5 w-5 ${localLiked ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">Like</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-2 border-x-2 border-gray-100 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-[#f36969] sm:py-3.5 sm:text-base"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Comment</span>
        </motion.button>

        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-[#f36969] sm:py-3.5 sm:text-base"
          >
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </motion.button>

          {/* Share Menu Dropdown */}
          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute bottom-full right-0 z-50 mb-2 w-56 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 sm:w-64 sm:rounded-2xl"
              >
                <div className="p-2 sm:p-3">
                  <p className="mb-2 px-2 text-xs font-semibold text-gray-500 sm:mb-3">
                    Share via
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(post.content + ' ' + window.location.href)}`,
                          '_blank'
                        );
                        onShare(post.id);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600"
                    >
                      <MessageSquare className="h-5 w-5" />
                      WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                          '_blank'
                        );
                        onShare(post.id);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Facebook className="h-5 w-5" />
                      Facebook
                    </button>

                    <button
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}&url=${encodeURIComponent(window.location.href)}`,
                          '_blank'
                        );
                        onShare(post.id);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-600"
                    >
                      <Twitter className="h-5 w-5" />
                      Twitter
                    </button>

                    <button
                      onClick={() => {
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                          '_blank'
                        );
                        onShare(post.id);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Linkedin className="h-5 w-5" />
                      LinkedIn
                    </button>

                    <button
                      onClick={() => {
                        const instagramUrl = `https://www.instagram.com/`;
                        window.open(instagramUrl, '_blank');
                        onShare(post.id);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-pink-50 hover:text-pink-600"
                    >
                      <Instagram className="h-5 w-5" />
                      Instagram
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        onShare(post.id);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <LinkIcon className="h-5 w-5" />
                      Copy Link
                    </button>

                    <button
                      onClick={() => {
                        const smsBody = encodeURIComponent(
                          `${post.content}\n\n${window.location.href}`
                        );
                        window.location.href = `sms:?&body=${smsBody}`;
                        onShare(post.id);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600"
                    >
                      <MessageCircle className="h-5 w-5" />
                      SMS
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-200 bg-gray-50"
          >
            <div className="p-5">
              {/* Existing Comments */}
              {post.comments.length > 0 && (
                <div className="mb-4 space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="relative h-8 w-8 flex-shrink-0">
                        <Image
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 rounded-xl bg-white p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            {comment.author.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {comment.timeAgo}
                          </p>
                        </div>
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
                          {currentUserId &&
                            comment.author?.id &&
                            currentUserId === comment.author.id && (
                              <button
                                onClick={() =>
                                  onDeleteComment &&
                                  onDeleteComment(post.id, comment.id)
                                }
                                className="ml-3 text-xs text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-bold text-white">
                  JT
                </div>
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className={`flex items-center justify-center rounded-xl px-4 py-2 text-white transition-all ${
                      newComment.trim()
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg'
                        : 'cursor-not-allowed bg-gray-300'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
