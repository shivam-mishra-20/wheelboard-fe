'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Job {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}

interface RecentJobsProps {
  jobs: Job[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

export default function RecentJobs({ jobs }: RecentJobsProps) {
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
          Recent Jobs Created
        </h2>
        <motion.button
          className="group flex items-center space-x-2 rounded-full border-2 border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50 hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Job</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="space-y-5"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            variants={item}
            className="group overflow-hidden rounded-3xl bg-gradient-to-br from-white to-primary-50/30 shadow-premium transition-all duration-500 hover:shadow-premium-lg"
            whileHover={{ scale: 1.01, x: 4 }}
          >
            <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-8">
              {/* Image Section */}
              <div className="relative order-1 h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white sm:order-2 sm:h-28 sm:w-28">
                <Image
                  src={job.image}
                  alt={job.title}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:rotate-2 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-500/20 group-hover:to-accent-500/20 group-hover:opacity-100"></div>
              </div>

              {/* Content Section */}
              <div className="order-2 flex-1 text-center sm:order-1 sm:text-left">
                <div className="mb-3 flex items-center justify-center gap-3 sm:justify-start">
                  <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                    {job.title}
                  </h3>
                  <span className="rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-700">
                    Active
                  </span>
                </div>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                  {job.description}
                </p>

                {/* Meta Info */}
                <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 sm:justify-start">
                  <div className="flex items-center space-x-1.5">
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
                    <span>{job.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>24 views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                  <motion.button
                    className="flex items-center space-x-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span>Share</span>
                  </motion.button>
                  <motion.button
                    className="btn-primary flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-glow"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit Job</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
