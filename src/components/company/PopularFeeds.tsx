'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  title: string;
  description: string;
  image: string;
  timeAgo: string;
}

interface PopularFeedsProps {
  feeds: FeedPost[];
}

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

export default function PopularFeeds({ feeds }: PopularFeedsProps) {
  return (
    <div className="mb-12">
      <motion.h2
        className="mb-6 text-2xl font-bold text-gray-900"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Popular Feeds
      </motion.h2>

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
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-sm transition-all duration-300 hover:shadow-lg"
            whileHover={{ y: -5 }}
          >
            {/* Feed Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={feed.image}
                alt={feed.title}
                width={400}
                height={300}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Author Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900">
                    <span className="text-xs font-bold">
                      {feed.author.initials}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {feed.author.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 p-5">
              <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                {feed.title}
              </h3>
              <p className="line-clamp-2 text-sm text-gray-600">
                {feed.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">{feed.timeAgo}</span>
                <motion.button
                  className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                  whileHover={{ scale: 1.05, x: 3 }}
                >
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
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
