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
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
  },
};

export default function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <div className="mb-12 md:mb-20">
      <motion.div
        className="flex-col-1 mb-6 flex items-start justify-between gap-2 sm:flex-row sm:items-center md:mb-10"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
          Recent <span className="text-[#f36969]">Jobs Created</span>
        </h2>
        <motion.button
          className="group flex items-center gap-1 rounded-full bg-gradient-to-r from-[#f36969] to-[#f36565] px-2.5 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-[#f36969]/20 md:px-6 md:py-3"
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
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <div className="hidden md:block">
            <span>Create New Job</span>
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        className="space-y-4 md:space-y-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            variants={item}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-500 hover:border-[#f36969]/30 hover:shadow-2xl hover:shadow-[#f36969]/10 md:rounded-3xl"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 md:p-7">
              {/* Image Section */}
              <div className="relative order-1 mx-auto h-36 w-36 flex-shrink overflow-hidden rounded-2xl shadow-lg ring-4 ring-white sm:order-2 sm:mx-0 sm:h-32 sm:w-32 md:h-36 md:w-36">
                <Image
                  src={job.image}
                  alt={job.title}
                  fill
                  sizes="(max-width: 640px) 144px, 128px"
                  className="object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f36969]/0 to-[#f36565]/0 opacity-0 transition-opacity duration-500 group-hover:from-[#f36969]/20 group-hover:to-[#f36565]/20 group-hover:opacity-100"></div>
              </div>

              {/* Content Section */}
              <div className="order-2 flex-1 sm:order-1">
                <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-3">
                  <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#f36969] md:text-xl lg:text-2xl">
                    {job.title}
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Active
                  </span>
                </div>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 md:mb-5 md:text-base">
                  {job.description}
                </p>

                {/* Meta Info */}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 md:gap-4 md:text-sm">
                  <div className="flex items-center gap-1.5">
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
                  <div className="flex items-center gap-1.5">
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
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md md:px-5"
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
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-[#f36969]/30 md:px-5"
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
