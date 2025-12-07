'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
import { Loader2 } from 'lucide-react';
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
  isLiked?: boolean;
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

// Helper to calculate time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likingJobId, setLikingJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const currentUser = api.getCurrentUser();
        const userId = currentUser?.id;

        const response = await wheelboardApi.job.getOpenJobList(userId);
        console.log('💼 Open Jobs Response:', response);

        const apiResponse = response as any;
        let jobsData: any[] = [];

        if (apiResponse.success && apiResponse.data) {
          jobsData = Array.isArray(apiResponse.data)
            ? apiResponse.data
            : [apiResponse.data];
        } else if (Array.isArray(apiResponse)) {
          jobsData = apiResponse;
        }

        // Transform and take first 3 jobs
        const transformedJobs: Job[] = jobsData.slice(0, 3).map((job: any) => ({
          id: job.jobId || job.id,
          company: job.companyName || job.company || 'Company',
          position: job.role || job.title || job.position || 'Job Position',
          description: job.description || 'No description available',
          image: (job.images && job.images[0]) || job.image || '/truck-01.jpg',
          likes: job.likes || 0,
          applicants: job.applicants || job.openings || 0,
          postedAt: job.createdDate ? getTimeAgo(job.createdDate) : 'Recently',
          location: job.city || job.location || 'Location',
          salary: job.salary
            ? `₹${job.salary.toLocaleString()}`
            : 'Competitive',
          isLiked: job.isLiked || false,
        }));

        setJobs(transformedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleLikeToggle = async (jobId: string) => {
    const currentUser = api.getCurrentUser();
    if (!currentUser?.id) {
      console.log('Please log in to like jobs');
      return;
    }

    try {
      setLikingJobId(jobId);

      // Optimistic update
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                isLiked: !job.isLiked,
                likes: job.isLiked ? job.likes - 1 : job.likes + 1,
              }
            : job
        )
      );

      // Call API
      await wheelboardApi.job.toggleJobLike(jobId, currentUser.id);
      console.log('✅ Job like toggled successfully');
    } catch (error) {
      console.error('❌ Error toggling job like:', error);
      // Revert optimistic update on error
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                isLiked: !job.isLiked,
                likes: job.isLiked ? job.likes + 1 : job.likes - 1,
              }
            : job
        )
      );
    } finally {
      setLikingJobId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8 md:mb-16">
        <div className="mb-5 flex items-center justify-between md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Available <span className="text-[#f36969]">Jobs</span>
          </h2>
        </div>
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="mb-8 md:mb-16">
        <div className="mb-5 flex items-center justify-between md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Available <span className="text-[#f36969]">Jobs</span>
          </h2>
        </div>
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
          <p className="text-gray-500">No jobs available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 md:mb-16">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
          Available <span className="text-[#f36969]">Jobs</span>
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

      {/* Jobs Grid */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            variants={item}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:border-[#f36969]/30 hover:shadow-2xl hover:shadow-[#f36969]/10 md:rounded-3xl"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Job Image */}
            <div className="relative h-40 w-full overflow-hidden bg-gray-50 sm:h-44 md:h-48">
              <Image
                src={job.image}
                alt={job.company}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Company Badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm md:bottom-4 md:left-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f36969] to-[#f36565] text-xs font-bold text-white shadow-md md:h-8 md:w-8">
                  {job.company.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-gray-900 md:text-sm">
                  {job.company}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-5">
              <h3 className="mb-2 line-clamp-1 text-base font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-[#f36969] md:text-lg">
                {job.position}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 md:text-base">
                {job.description}
              </p>

              {/* Job Details */}
              <div className="mb-4 space-y-2 rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-xs text-gray-600 md:text-sm">
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-[#f36969]"
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
                  <span className="truncate font-medium">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#f36969] md:text-sm">
                  <svg
                    className="h-4 w-4 flex-shrink-0"
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
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 md:pt-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 md:gap-4 md:text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle(job.id);
                    }}
                    disabled={likingJobId === job.id}
                    className="flex items-center gap-1 transition-all hover:scale-110 disabled:opacity-50"
                  >
                    <svg
                      className={`h-4 w-4 transition-colors ${
                        job.isLiked
                          ? 'fill-[#f36969] stroke-[#f36969]'
                          : 'fill-none stroke-current'
                      }`}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span
                      className={`font-medium ${
                        job.isLiked ? 'text-[#f36969]' : ''
                      }`}
                    >
                      {job.likes}
                    </span>
                  </button>
                  <div className="flex items-center gap-1">
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
                    <span className="font-medium">{job.applicants}</span>
                  </div>
                </div>
                <motion.button
                  className="rounded-lg bg-[#f36969]/10 px-3 py-1.5 text-xs font-semibold text-[#f36969] transition-all hover:bg-[#f36969] hover:text-white hover:shadow-md md:px-4 md:py-2 md:text-sm"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
