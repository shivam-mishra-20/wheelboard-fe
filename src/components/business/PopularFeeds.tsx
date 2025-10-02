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
    image: '/live-truck.gif',
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
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 15 },
  },
};

export default function PopularFeeds() {
  return (
    <div className="mb-16">
      <motion.div
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="bg-gradient-premium bg-clip-text text-3xl font-bold text-transparent">
          Popular Feeds
        </h2>
        <motion.button
          className="group flex items-center space-x-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-medium text-white shadow-premium transition-all hover:shadow-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </motion.button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {feeds.map((feed) => (
          <motion.div
            key={feed.id}
            variants={item}
            className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-premium transition-all duration-500 hover:border-primary-200 hover:shadow-premium-lg"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Feed Image */}
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={feed.image}
                alt={feed.title}
                width={400}
                height={300}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
              />

              {/* Author Overlay with Glass Effect */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-5 pt-12">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 text-gray-900 shadow-lg ring-2 ring-white/30">
                    <span className="text-xs font-bold">
                      {feed.author.initials}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white drop-shadow-lg">
                    {feed.author.name}
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-500/10 group-hover:to-accent-500/10 group-hover:opacity-100"></div>
            </div>

            {/* Content */}
            <div className="space-y-3 p-6">
              <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
                {feed.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                {feed.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-1.5 text-xs text-gray-500">
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
                  className="flex items-center space-x-1 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-600 transition-all hover:bg-primary-100 hover:shadow-sm"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Read</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
