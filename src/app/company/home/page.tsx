'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../../../components/Header';

import Footer from '../../../components/Footer';
import { CompanyProtected } from '../../../components/ProtectedRoute';
import HeroCarousel from '../../../components/company/HeroCarousel';
import ServiceCardsGrid, {
  VehicleIcon,
  ProfessionalIcon,
  ExpensesIcon,
  HireIcon,
  ServicesIcon,
  DashboardIcon,
} from '../../../components/company/ServiceCardsGrid';
import RecentJobs from '../../../components/company/RecentJobs';
import PopularFeeds from '../../../components/company/PopularFeeds';
import CreateJobModal from '../../../components/company/CreateJobModal';
import { companyHomeData } from '../../../lib/mockApi';
import { api } from '../../../lib/apiAdapter';
import { wheelboardApi } from '../../../lib/wheelboardApi';

export default function CompanyHomePage() {
  const router = useRouter();
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [popularFeeds, setPopularFeeds] = useState<any[]>([]);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(true);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Fetch recent jobs from API
  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const user = api.getCurrentUser();
        if (!user) return;

        const response = await wheelboardApi.job.getJobListByUser(user.id);
        const jobsData = (response.data as any[]) || [];

        // Map to RecentJobs format and take only the 3 most recent
        const mappedJobs = jobsData.slice(0, 3).map((apiJob: any) => ({
          id: apiJob.jobId,
          title: apiJob.role || 'Untitled Job',
          description: apiJob.description || 'No description provided',
          image: apiJob.imagePaths?.[0] || '/truck-01.jpg',
          createdAt: 'Recently posted', // API doesn't provide timestamp
        }));

        setRecentJobs(mappedJobs);
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
        // Fallback to mock data on error
        setRecentJobs(companyHomeData.recentJobs);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchRecentJobs();
  }, []);

  // Fetch popular feeds from API
  useEffect(() => {
    const fetchPopularFeeds = async () => {
      try {
        const user = api.getCurrentUser();
        if (!user) return;

        const response = await wheelboardApi.post.getPostsByUser(user.id);
        const postsData = (response.data as any[]) || [];

        // Map API response to Feed interface
        const mappedFeeds = postsData.slice(0, 8).map((apiPost: any) => ({
          id: apiPost.postId,
          author: {
            name: apiPost.authorName || user.mobileNo || 'Company User',
            avatar: apiPost.authorAvatar,
            initials: (apiPost.authorName || 'C')
              .split(' ')
              .map((s: string) => s[0])
              .slice(0, 2)
              .join(''),
            userType: 'company' as const,
          },
          title: apiPost.title,
          content: apiPost.content,
          image: apiPost.mediaUrls?.[0],
          timeAgo: apiPost.createdAt || 'Recently posted',
        }));

        setPopularFeeds(mappedFeeds);
      } catch (error) {
        console.error('Error fetching feeds:', error);
        // Fallback to mock data on error
        setPopularFeeds(companyHomeData.popularFeeds);
      } finally {
        setIsLoadingFeeds(false);
      }
    };

    fetchPopularFeeds();
  }, []);

  // Job handlers
  const handleCreateJob = () => {
    setEditingJobId(null);
    setIsCreateJobModalOpen(true);
  };

  const handleEditJob = (jobId: string) => {
    setEditingJobId(jobId);
    setIsCreateJobModalOpen(true);
  };

  const handleSaveJob = async (jobData: any) => {
    const loadingToast = toast.loading('Creating job...');

    try {
      const user = api.getCurrentUser();
      if (!user) {
        toast.error('Please login to create a job', { id: loadingToast });
        return;
      }

      // Validate required fields
      if (!jobData.jobType || !jobData.duration) {
        toast.error(
          'Please fill in all required fields (Job Type and Duration)',
          { id: loadingToast }
        );
        return;
      }

      if (editingJobId) {
        // TODO: Implement update job API
        console.log('Update job:', editingJobId, jobData);
        toast('Update job functionality coming soon!', { id: loadingToast });
      } else {
        // Map form fields to API fields
        await wheelboardApi.job.addJob({
          UserId: user.id,
          Role: jobData.jobType, // jobType from form -> Role in API (e.g., "Driver")
          City: jobData.city || 'Not specified',
          Description: jobData.description || 'No description provided',
          JobType: jobData.type || 'Full-time', // type from form -> JobType in API (e.g., "Full-time")
          JobDuration: jobData.duration, // duration from form -> JobDuration in API (e.g., "Permanent")
          Openings: 1, // Default value since not in form
          Salary: 0, // Default value since not in form
          Images: jobData.images || [],
        });

        toast.success('Job created successfully!', { id: loadingToast });
      }

      // Refresh jobs list
      const response = await wheelboardApi.job.getJobListByUser(user.id);
      const jobsData = (response.data as any[]) || [];
      const mappedJobs = jobsData.slice(0, 3).map((apiJob: any) => ({
        id: apiJob.jobId,
        title: apiJob.role || 'Untitled Job',
        description: apiJob.description || 'No description provided',
        image: apiJob.imagePaths?.[0] || '/truck-01.jpg',
        createdAt: 'Recently posted',
      }));
      setRecentJobs(mappedJobs);
      setIsCreateJobModalOpen(false);
    } catch (error: any) {
      console.error('Error saving job:', error);

      // Show detailed error message
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(
            ([field, messages]: [string, any]) =>
              `${field}: ${messages.join(', ')}`
          )
          .join('\n');
        toast.error(`Failed to create job:\n${errorMessages}`, {
          id: loadingToast,
          duration: 5000,
        });
      } else if (error.response?.data?.message) {
        toast.error(`Failed to create job: ${error.response.data.message}`, {
          id: loadingToast,
        });
      } else {
        toast.error('Failed to create job. Please try again.', {
          id: loadingToast,
        });
      }
    }
  };

  // Service cards configuration matching the design
  const serviceCards = [
    {
      id: 'vehicles',
      title: 'Vehicles',
      icon: <VehicleIcon />,
      color: 'blue' as const,
      onClick: () => router.push('/company/fleet'),
    },
    {
      id: 'professional',
      title: 'Professional',
      icon: <ProfessionalIcon />,
      color: 'teal' as const,
      onClick: () => router.push('/company/professionals'),
    },
    {
      id: 'expenses',
      title: 'Expenses',
      icon: <ExpensesIcon />,
      color: 'orange' as const,
      onClick: () => router.push('/company/expenses'),
    },
    {
      id: 'hire',
      title: 'Hire',
      icon: <HireIcon />,
      color: 'pink' as const,
      onClick: () => router.push('/company/jobs'),
    },
    {
      id: 'services',
      title: 'Services',
      icon: <ServicesIcon />,
      color: 'yellow' as const,
      onClick: () => router.push('/company/services'),
    },
    {
      id: 'dashboard',
      title: 'DashBoard',
      icon: <DashboardIcon />,
      color: 'gray' as const,
      onClick: () => router.push('/company/dashboard'),
    },
  ];

  return (
    <CompanyProtected>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />

      {/* Unified Header */}
      <Header />

      <div className="min-h-screen pt-4 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Hero Carousel Section */}
          <HeroCarousel slides={companyHomeData.carouselSlides} />

          {/* Services Grid */}
          <ServiceCardsGrid services={serviceCards} />

          {/* Recent Jobs Section */}
          {isLoadingJobs ? (
            <div className="mb-12 flex items-center justify-center py-8 md:mb-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]"></div>
              <p className="ml-3 text-gray-600">Loading jobs...</p>
            </div>
          ) : (
            <RecentJobs
              jobs={
                recentJobs.length > 0 ? recentJobs : companyHomeData.recentJobs
              }
              onCreateJob={handleCreateJob}
              onEditJob={handleEditJob}
            />
          )}

          {/* Popular Feeds Section */}
          {isLoadingFeeds ? (
            <div className="mb-12 flex items-center justify-center py-8 md:mb-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]"></div>
              <p className="ml-3 text-gray-600">Loading feeds...</p>
            </div>
          ) : (
            <PopularFeeds
              feeds={
                popularFeeds.length > 0
                  ? popularFeeds
                  : companyHomeData.popularFeeds
              }
            />
          )}
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>

      {/* Create/Edit Job Modal */}
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
        onSubmit={handleSaveJob}
        mode={editingJobId ? 'edit' : 'create'}
      />
    </CompanyProtected>
  );
}
