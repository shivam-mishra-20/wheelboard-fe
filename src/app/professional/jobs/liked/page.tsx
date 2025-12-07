'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Eye,
  Users,
  Bookmark,
  BookmarkCheck,
  X,
  Heart,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';
import type { DetailedJob } from '@/lib/mockApi';

export default function LikedJobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [likedJobs, setLikedJobs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [allJobs, setAllJobs] = useState<DetailedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<DetailedJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    experience: '',
    expectedSalary: '',
  });
  const [likingJobId, setLikingJobId] = useState<string | null>(null);

  // Load liked and saved jobs from localStorage
  useEffect(() => {
    const liked = localStorage.getItem('likedJobs');
    if (liked) {
      setLikedJobs(JSON.parse(liked));
    }

    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);

        // Get current user - hardcoded for now
        const user = {
          id: '48e36413-ba01-4850-8aae-8c8d05206dc7',
        };
        setCurrentUser(user);

        // Fetch open jobs
        const openJobsResponse = await wheelboardApi.job.getOpenJobList();
        const jobsData: any[] = Array.isArray(openJobsResponse)
          ? openJobsResponse
          : (openJobsResponse as any).data || [];

        // Fetch applied jobs
        const appliedJobsResponse = await wheelboardApi.job.getAppliedJobs(
          user.id
        );
        const appliedJobsData: any[] = Array.isArray(appliedJobsResponse)
          ? appliedJobsResponse
          : (appliedJobsResponse as any).data || [];
        const appliedJobIds = appliedJobsData.map(
          (job: any) => job.jobId || job.id
        );
        setAppliedJobs(appliedJobIds);

        // Map API data to DetailedJob format
        const mappedJobs: DetailedJob[] = jobsData.map((apiJob: any) => ({
          id: apiJob.jobId || apiJob.id,
          title: apiJob.role || apiJob.title || 'Job Position',
          department: apiJob.department || 'General',
          location: apiJob.city || apiJob.location || 'Not specified',
          type: (apiJob.jobType || 'Full-time') as DetailedJob['type'],
          salary: apiJob.salary || 'Competitive',
          description: apiJob.description || '',
          requirements: apiJob.requirements || [],
          benefits: apiJob.benefits || [],
          image: apiJob.imageUrls?.[0] || '/tires.png',
          createdAt: apiJob.createdAt || new Date().toISOString(),
          status: (apiJob.status || 'Active') as 'Active' | 'Paused' | 'Closed',
          views: apiJob.views || 0,
          applications: apiJob.applications || [],
          urgent: apiJob.urgent || false,
        }));

        setAllJobs(mappedJobs);
      } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter to show only liked jobs
  const likedJobsList = useMemo(() => {
    return allJobs.filter((job) => likedJobs.includes(job.id));
  }, [allJobs, likedJobs]);

  // Search filter
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return likedJobsList;

    const query = searchQuery.toLowerCase();
    return likedJobsList.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
    );
  }, [searchQuery, likedJobsList]);

  const toggleSaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const handleLikeToggle = async (jobId: string) => {
    if (!currentUser?.id) {
      console.error('User not logged in');
      return;
    }

    try {
      setLikingJobId(jobId);

      // Optimistic update
      const newLikedJobs = likedJobs.filter((id) => id !== jobId);
      setLikedJobs(newLikedJobs);
      localStorage.setItem('likedJobs', JSON.stringify(newLikedJobs));

      // Call API
      const response = await wheelboardApi.job.toggleJobLike(
        jobId,
        currentUser.id
      );
      const responseData = (response as any).data;

      console.log('✅ Job unliked:', {
        isLiked: responseData?.isLiked,
        likeCount: responseData?.likeCount,
      });
    } catch (error) {
      console.error('❌ Error toggling job like:', error);
      // Revert on error
      const revertedLikedJobs = [...likedJobs, jobId];
      setLikedJobs(revertedLikedJobs);
      localStorage.setItem('likedJobs', JSON.stringify(revertedLikedJobs));
    } finally {
      setLikingJobId(null);
    }
  };

  const handleApplyClick = (job: DetailedJob) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob || !currentUser) {
      console.error('User not logged in or no job selected');
      return;
    }

    if (!applicationData.coverLetter || !applicationData.experience) {
      console.error('Missing required fields');
      return;
    }

    try {
      // Call API to apply for job
      await wheelboardApi.job.applyJob({
        jobId: selectedJob.id,
        userId: currentUser.id,
      });

      // Update local state
      setAppliedJobs((prev) => [...prev, selectedJob.id]);
      setIsApplyModalOpen(false);
      setApplicationData({
        coverLetter: '',
        experience: '',
        expectedSalary: '',
      });
      setSelectedJob(null);

      // Redirect to applied jobs
      router.push('/professional/jobs/applied');
    } catch (error) {
      console.error('❌ Error applying for job:', error);
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-100 text-blue-700';
      case 'Part-time':
        return 'bg-purple-100 text-purple-700';
      case 'Contract':
        return 'bg-orange-100 text-orange-700';
      case 'Freelance':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'Closed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 pt-20">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md lg:h-12 lg:w-12"
          >
            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#535353] lg:text-4xl">
              Liked Jobs
            </h1>
            <p className="mt-1 text-base text-gray-600 lg:text-lg">
              Jobs you&apos;ve shown interest in
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-6 rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-500 to-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm opacity-90">Liked Jobs</p>
              <p className="text-4xl font-bold">{likedJobsList.length}</p>
              <p className="mt-2 text-sm opacity-90">
                Quick access to your favorite opportunities
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Heart className="h-8 w-8 fill-current" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search liked jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:text-base"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 lg:text-base">
            Showing{' '}
            <span className="font-semibold text-[#535353]">
              {filteredJobs.length}
            </span>{' '}
            liked {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>

        {/* Liked Jobs List */}
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div>
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]" />
              <p className="text-gray-500">Loading liked jobs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div>
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-300" />
              <h3 className="mb-2 text-xl font-bold text-[#535353]">{error}</h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div>
              <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-[#535353]">
                {searchQuery
                  ? 'No liked jobs found'
                  : "You haven't liked any jobs yet"}
              </h3>
              <p className="mb-4 text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Start liking jobs to save them for later'}
              </p>
              <button
                onClick={() => router.push('/professional/jobs')}
                className="rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              const isApplied = appliedJobs.includes(job.id);
              const daysAgo = Math.floor(
                (new Date().getTime() - new Date(job.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={job.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {job.urgent && (
                    <div className="absolute right-0 top-0">
                      <div className="rounded-bl-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-2 shadow-lg">
                        <p className="text-xs font-bold text-white">URGENT</p>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      {/* Left Section */}
                      <div className="flex flex-1 gap-4">
                        {/* Job Image */}
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 lg:h-20 lg:w-20">
                          <Image
                            src={job.image}
                            alt={job.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Job Details */}
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-[#535353] lg:text-2xl">
                              {job.title}
                            </h3>
                            {isApplied && (
                              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Applied
                              </span>
                            )}
                          </div>

                          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {job.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                            </div>
                          </div>

                          <p className="mb-3 line-clamp-2 text-sm text-gray-600 lg:text-base">
                            {job.description}
                          </p>

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getJobTypeColor(job.type)}`}
                            >
                              {job.type}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(job.status)}`}
                            >
                              {job.status}
                            </span>
                            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                              <IndianRupee className="h-3 w-3" />
                              {job.salary}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Desktop */}
                      <div className="hidden flex-col items-end gap-3 lg:flex">
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applications.length}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLikeToggle(job.id)}
                            disabled={likingJobId === job.id}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-pink-500 bg-pink-500 text-white transition-all hover:bg-pink-600 disabled:opacity-50"
                          >
                            <Heart className="h-5 w-5 fill-current" />
                          </button>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
                              isSaved
                                ? 'border-[#f36969] bg-[#f36969] text-white'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-[#f36969] hover:text-[#f36969]'
                            }`}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="h-5 w-5" />
                            ) : (
                              <Bookmark className="h-5 w-5" />
                            )}
                          </button>
                          {job.status === 'Active' && (
                            <button
                              onClick={() => handleApplyClick(job)}
                              disabled={isApplied}
                              className={`rounded-lg px-6 py-2 font-semibold transition-all ${
                                isApplied
                                  ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                  : 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-lg shadow-[#f36969]/30 hover:shadow-xl'
                              }`}
                            >
                              {isApplied ? 'Applied' : 'Apply Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile */}
                    <div className="mt-3 flex gap-2 lg:hidden">
                      <button
                        onClick={() => handleLikeToggle(job.id)}
                        disabled={likingJobId === job.id}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-2 border-pink-500 bg-pink-500 text-white transition-all hover:bg-pink-600 disabled:opacity-50"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                          isSaved
                            ? 'border-[#f36969] bg-[#f36969] text-white'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-[#f36969] hover:text-[#f36969]'
                        }`}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                      {job.status === 'Active' && (
                        <button
                          onClick={() => handleApplyClick(job)}
                          disabled={isApplied}
                          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                            isApplied
                              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                              : 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-md shadow-[#f36969]/20'
                          }`}
                        >
                          {isApplied ? 'Applied' : 'Apply Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-[#535353]">
                  Apply for Job
                </h2>
                <p className="text-sm text-gray-500">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setSelectedJob(null);
                  setApplicationData({
                    coverLetter: '',
                    experience: '',
                    expectedSalary: '',
                  });
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Years of Experience *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 5 years"
                    value={applicationData.experience}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        experience: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                  />
                </div>

                {/* Expected Salary */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Expected Salary (Optional)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g., 5,00,000/year"
                      value={applicationData.expectedSalary}
                      onChange={(e) =>
                        setApplicationData({
                          ...applicationData,
                          expectedSalary: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Cover Letter *
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us why you're a great fit for this role..."
                    value={applicationData.coverLetter}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        coverLetter: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
                  />
                </div>

                {/* Info Box */}
                <div className="rounded-xl bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold">Application Tips:</p>
                      <ul className="mt-2 list-inside list-disc space-y-1">
                        <li>Highlight your relevant experience</li>
                        <li>Be specific about your skills</li>
                        <li>Show enthusiasm for the role</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setSelectedJob(null);
                  setApplicationData({
                    coverLetter: '',
                    experience: '',
                    expectedSalary: '',
                  });
                }}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={
                  !applicationData.coverLetter || !applicationData.experience
                }
                className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
