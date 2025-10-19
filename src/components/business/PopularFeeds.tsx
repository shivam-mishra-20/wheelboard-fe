'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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

const feeds: FeedPost[] = [
  {
    id: '1',
    author: {
      name: 'Fleet Operations',
      initials: 'FO',
    },
    title: 'Industry Insights',
    description:
      'Latest trends in fleet management and logistics optimization strategies',
    image: '/image.png',
    timeAgo: '3 days ago',
  },
  {
    id: '2',
    author: {
      name: 'Maintenance Team',
      initials: 'MT',
    },
    title: 'Service Updates',
    description:
      'New preventive maintenance schedules and service improvements',
    image: '/excavator.jpg',
    timeAgo: '5 days ago',
  },
  {
    id: '3',
    author: {
      name: 'Business Network',
      initials: 'BN',
    },
    title: 'Market Trends',
    description:
      'Current market dynamics and opportunities in transportation sector',
    image: '/truck-01.jpg',
    timeAgo: '7 days ago',
  },
  {
    id: '4',
    author: {
      name: 'Operations Hub',
      initials: 'OH',
    },
    title: 'Tech Integration',
    description:
      'Digital transformation and technology adoption in fleet management',
    image: '/yellow-truck.jpg',
    timeAgo: '10 days ago',
  },
];

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

export default function PopularFeeds() {
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
