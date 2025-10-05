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

interface FeedCardProps {
  post: FeedPost;
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

    const badges: Record<string, string> = {
      services: 'bg-blue-100 text-blue-700 border-blue-200',
      tip: 'bg-green-100 text-green-700 border-green-200',
      Promotions: 'bg-purple-100 text-purple-700 border-purple-200',
      question: 'bg-orange-100 text-orange-700 border-orange-200',
      general: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${badges[post.category]}`}
      >
        {post.category === 'Promotions'
          ? 'Promotions'
          : post.category.charAt(0).toUpperCase() + post.category.slice(1)}
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
      className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl sm:rounded-3xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-600 sm:h-12 sm:w-12">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-base font-bold text-white sm:text-lg">
                  {post.author.initials}
                </span>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                {post.author.name}
              </h3>
              {getUserTypeBadge()}
            </div>
            {post.author.company && (
              <p className="text-xs text-gray-600 sm:text-sm">
                {post.author.company}
              </p>
            )}
            <p className="text-xs text-gray-500">{post.timeAgo}</p>
          </div>
        </div>

        {/* Category Badge & Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {getCategoryBadge()}
          <div className="flex items-center gap-2">
            {currentUserId &&
            post.author?.id &&
            currentUserId === post.author.id ? (
              <>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-full p-1.5 text-red-600 transition-colors hover:bg-red-50 sm:p-2"
                  aria-label="Delete post"
                >
                  Delete
                </button>

                {/* Confirmation small modal */}
                {showDeleteConfirm && (
                  <div className="z-60 fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
                      <p className="mb-4 text-sm font-medium text-gray-900">
                        Are you sure you want to delete this post?
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="rounded-lg border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (onDelete) {
                              onDelete(post.id);
                            }
                            setShowDeleteConfirm(false);
                          }}
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button className="rounded-full p-1.5 transition-colors hover:bg-gray-100 sm:p-2">
                <MoreHorizontal className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
          <Image
            src={post.image}
            alt="Post content"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}

      {/* Content (below image) */}
      <div className="px-3 py-3 sm:px-5 sm:py-4">
        <p className="whitespace-pre-wrap text-sm text-gray-800 sm:text-base">
          {post.content}
        </p>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between border-b border-t border-gray-200 px-3 py-2 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2 text-xs text-gray-600 sm:gap-4 sm:text-sm">
          <button
            onClick={() => setShowComments(!showComments)}
            className="transition-colors hover:text-primary-600"
          >
            <span className="font-semibold">{localLikes}</span> likes
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="transition-colors hover:text-primary-600"
          >
            <span className="font-semibold">{post.comments.length}</span>{' '}
            comments
          </button>
          <span>
            <span className="font-semibold">{post.shares}</span> shares
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 p-2 sm:gap-2 sm:p-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLike}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-all sm:gap-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm ${
            localLiked
              ? 'bg-red-50 text-red-600'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Heart
            className={`h-4 w-4 sm:h-5 sm:w-5 ${localLiked ? 'fill-current' : ''}`}
          />
          <span className="hidden sm:inline">Like</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-50 px-2 py-2 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
        >
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Comment</span>
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-50 px-2 py-2 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
