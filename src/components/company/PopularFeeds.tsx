'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Align FeedPost shape with mockApi (title/description are optional)
interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials?: string;
    userType?: 'professional' | 'company' | 'business';
    id?: string;
    company?: string;
  };
  // Primary textual content (use either title/description or content)
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  timeAgo?: string;
}

interface PopularFeedsProps {
  feeds: FeedPost[];
}

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
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function PopularFeeds({ feeds }: PopularFeedsProps) {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('') || 'U';

  return (
    <div className="mb-8 md:mb-16">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
          Popular <span className="text-[#f36969]">Feeds</span>
        </h2>
        <motion.button
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f36969] to-[#f36565] px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-[#f36969]/20 md:px-5 md:py-2.5 md:text-sm"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View All</span>
          <svg
            className="h-3.5 w-3.5 md:h-4 md:w-4"
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

      {/* Feeds Grid */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {feeds.map((feed) => {
          let titleText = 'Untitled';
          if (feed.title) {
            titleText = feed.title;
          } else if (feed.content) {
            titleText = feed.content.slice(0, 80);
          }

          let descText = '';
          if (feed.description) {
            descText = feed.description;
          } else if (feed.content) {
            descText = feed.content.slice(80, 200);
          }

          const imageSrc = feed.image ?? '/Cards/img.png';
          const authorName = feed.author?.name ?? 'Unknown';
          const authorInitials =
            feed.author && feed.author.initials
              ? feed.author.initials
              : getInitials(authorName);
          const timeAgo = feed.timeAgo ?? 'Just now';

          return (
            <motion.div
              key={feed.id}
              variants={item}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:border-[#f36969]/30 hover:shadow-2xl hover:shadow-[#f36969]/10 md:rounded-3xl"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Feed Image */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-50 sm:h-48 md:h-52">
                <Image
                  src={imageSrc}
                  alt={titleText}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Author Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm md:bottom-4 md:left-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f36969] to-[#f36565] text-xs font-bold text-white shadow-md md:h-8 md:w-8">
                    {authorInitials}
                  </div>
                  <span className="text-xs font-semibold text-gray-900 md:text-sm">
                    {authorName}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <h3 className="mb-2 line-clamp-2 text-base font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-[#f36969] md:text-lg">
                  {titleText}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 md:text-base">
                  {descText}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 md:pt-4">
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
                    <span>{timeAgo}</span>
                  </div>
                  <motion.button
                    className="rounded-lg bg-[#f36969]/10 px-3 py-1.5 text-xs font-semibold text-[#f36969] transition-all hover:bg-[#f36969] hover:text-white hover:shadow-md md:px-4 md:py-2 md:text-sm"
                    whileHover={{ scale: 1.05, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
