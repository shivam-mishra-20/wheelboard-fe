'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { Loader2 } from 'lucide-react';

interface FeedPost {
  id: string;
  author: {
    name: string;
    initials: string;
  };
  title: string;
  description: string;
  image: string;
  timeAgo: string;
}

import type { Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 20, stiffness: 80 },
  },
};

// Helper function to calculate time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

// Helper to get initials from name
const getInitials = (name: string): string => {
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function PopularFeeds() {
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setIsLoading(true);
        const response = await wheelboardApi.post.getAllPosts();
        console.log('📰 All Posts Response:', response);

        const apiResponse = response as any;
        let postsData: any[] = [];

        if (apiResponse.success && apiResponse.data) {
          postsData = Array.isArray(apiResponse.data)
            ? apiResponse.data
            : [apiResponse.data];
        } else if (Array.isArray(apiResponse)) {
          postsData = apiResponse;
        }

        // Transform API data to FeedPost format and take first 4
        const transformedFeeds: FeedPost[] = postsData
          .slice(0, 4)
          .map((post: any) => ({
            id: post.postId || post.id,
            author: {
              name: post.userName || post.authorName || 'Business User',
              initials: getInitials(
                post.userName || post.authorName || 'Business User'
              ),
            },
            title: post.category || 'Community Post',
            description:
              post.content || post.description || 'No description available',
            image:
              (post.images && post.images[0]) || post.image || '/image.png',
            timeAgo: post.createdDate
              ? getTimeAgo(post.createdDate)
              : 'Recently',
          }));

        setFeeds(transformedFeeds);
      } catch (error) {
        console.error('Error fetching feeds:', error);
        // Set empty array on error
        setFeeds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-12 md:mb-20">
        <div className="mb-6 flex items-start justify-between gap-4 md:mb-10">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Popular <span className="text-[#f36969]">Feeds</span>
          </h2>
        </div>
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (feeds.length === 0) {
    return (
      <div className="mb-12 md:mb-20">
        <div className="mb-6 flex items-start justify-between gap-4 md:mb-10">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Popular <span className="text-[#f36969]">Feeds</span>
          </h2>
        </div>
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
          <p className="text-gray-500">No feeds available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 md:mb-20">
      <motion.div
        className="flex-col-span-2 mb-6 flex items-start justify-between gap-4 sm:flex-row sm:items-center md:mb-10"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
          Popular <span className="text-[#f36969]">Feeds</span>
        </h2>
        <motion.button
          className="group flex items-center gap-2 rounded-full bg-[#f36969] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#f36969]/20 md:text-base"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            window.location.href = '/business/feeds';
          }}
        >
          <span>View All</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </motion.button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {feeds.map((feed) => (
          <motion.div
            key={feed.id}
            variants={item}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-500 hover:border-[#f36969]/30 hover:shadow-2xl hover:shadow-[#f36969]/10 md:rounded-3xl"
            whileHover={{ y: -10, scale: 1.02 }}
          >
            {/* Feed Image */}
            <div className="relative h-48 w-full overflow-hidden md:h-56">
              <Image
                src={feed.image}
                alt={feed.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
              />

              {/* Author Overlay with Gradient */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-16 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f36969] to-[#f36565] text-white shadow-lg ring-2 ring-white/30 md:h-12 md:w-12">
                    <span className="text-xs font-bold md:text-sm">
                      {feed.author.initials}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white drop-shadow-lg md:text-base">
                    {feed.author.name}
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f36969]/0 to-[#f36565]/0 opacity-0 transition-opacity duration-500 group-hover:from-[#f36969]/10 group-hover:to-[#f36565]/10 group-hover:opacity-100"></div>
            </div>

            {/* Content */}
            <div className="space-y-3 p-5 md:p-6">
              <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-[#f36969] md:text-lg">
                {feed.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 md:text-base">
                {feed.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 md:text-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{feed.timeAgo}</span>
                </div>
                <motion.button
                  className="flex items-center gap-1 rounded-full bg-[#f36969]/10 px-3 py-1.5 text-xs font-semibold text-[#f36969] transition-all hover:bg-[#f36969] hover:text-white hover:shadow-md md:px-4 md:py-2 md:text-sm"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Read</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
