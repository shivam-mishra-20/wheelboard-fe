'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Job {
  id: string;
  company: string;
  position: string;
  description: string;
  image: string;
  likes: number;
  applicants: number;
  postedAt: string;
  location: string;
  salary: string;
}

interface JobListingsProps {
  jobs: Job[];
}

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

export default function JobListings({ jobs }: JobListingsProps) {
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
          Available Jobs
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
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            variants={item}
            className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-premium transition-all duration-500 hover:border-primary-200 hover:shadow-premium-lg"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Job Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={job.image}
                alt={job.company}
                width={400}
                height={200}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
              />

              {/* Company Badge Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-12">
                <div className="flex items-center space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 text-gray-900 shadow-lg ring-2 ring-white/30">
                    <span className="text-xs font-bold">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white drop-shadow-lg">
                    {job.company}
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-500/10 group-hover:to-accent-500/10 group-hover:opacity-100"></div>
            </div>

            {/* Content */}
            <div className="space-y-3 p-6">
              <h3 className="line-clamp-1 text-lg font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
                {job.position}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                {job.description}
              </p>

              {/* Job Details */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary-600">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{job.salary}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
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
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>{job.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>{job.applicants}</span>
                  </div>
                  <span>{job.postedAt}</span>
                </div>
                <motion.button
                  className="flex items-center space-x-1 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-600 transition-all hover:bg-primary-100 hover:shadow-sm"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Apply</span>
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
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
