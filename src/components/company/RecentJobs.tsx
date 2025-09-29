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
    <div className="mb-12">
      <motion.h2
        className="mb-6 text-2xl font-bold text-gray-900"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Recent Jobs Created
      </motion.h2>

      <motion.div
        className="space-y-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            variants={item}
            className="group overflow-hidden rounded-2xl bg-white p-0.5 shadow-sm transition-shadow hover:shadow-md"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex flex-col items-center rounded-xl bg-red-50 p-5 transition-colors group-hover:bg-red-100 sm:flex-row">
              <div className="order-2 mt-4 flex-1 sm:order-1 sm:mt-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {job.description}
                </p>
                <div className="mt-4 flex space-x-3">
                  <motion.button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 active:bg-gray-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Share
                  </motion.button>
                  <motion.button
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:bg-red-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                </div>
              </div>
              <div className="order-1 ml-0 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:order-2 sm:ml-6 sm:h-20 sm:w-20">
                <Image
                  src={job.image}
                  alt={job.title}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
