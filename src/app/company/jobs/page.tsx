'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { companyHomeData, DetailedJob } from '@/lib/mockApi';
import JobApplicationsModal from '@/components/company/JobApplicationsModal';
import CreateJobModal from '@/components/company/CreateJobModal';
import ConfirmDeleteModal from '@/components/company/ConfirmDeleteModal';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

export default function CompanyJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'Active' | 'Paused' | 'Closed'
  >('all');
  const [selectedJob, setSelectedJob] = useState<DetailedJob | null>(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<DetailedJob | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<DetailedJob | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);

  const jobs = companyHomeData.allJobs || [];

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewApplications = (job: DetailedJob) => {
    setSelectedJob(job);
    setIsApplicationsModalOpen(true);
  };

  const handleCreateJob = (jobData: {
    jobType: string;
    duration: string;
    openings: string;
    salary: string;
    city: string;
    type: string;
    description: string;
    images: File[];
  }) => {
    console.log('Creating new job:', jobData);
    // In a real app, this would call an API to create the job
    // For now, we'll just log it and show a success message
    // simulate adding to mock data
    const newJob: DetailedJob = {
      id: 'job-' + Date.now(),
      title: jobData.jobType || 'New Job',
      department: 'Operations',
      location: jobData.city || 'Unknown',
      type: (jobData.type as DetailedJob['type']) || 'Full-time',
      salary: jobData.salary || 'Not specified',
      description: jobData.description || '',
      requirements: [],
      benefits: [],
      image: jobData.images?.[0]
        ? URL.createObjectURL(jobData.images[0])
        : '/truck-01.jpg',
      createdAt: new Date().toISOString(),
      status: 'Active',
      views: 0,
      applications: [],
    } as DetailedJob;

    companyHomeData.allJobs.unshift(newJob);
    setToast({ message: 'Job created successfully!', type: 'success' });
    setIsCreateJobModalOpen(false);
  };

  type ModalJobType = '' | 'Driver' | 'Technician' | 'Helper';

  const handleEditClick = (job: DetailedJob) => {
    setJobToEdit(job);
    setIsEditMode(true);
    setIsCreateJobModalOpen(true);
  };

  const handleSaveEditedJob = (jobData: {
    id?: string;
    jobType?: string;
    duration?: string;
    openings?: string;
    salary?: string;
    city?: string;
    type?: string;
    description?: string;
    images?: File[];
  }) => {
    // Find and update job in mock data
    const jobs = companyHomeData.allJobs;
    const idx = jobs.findIndex((j) => j.id === jobData.id);
    if (idx !== -1) {
      const updated: DetailedJob = {
        ...jobs[idx],
        title: jobData.jobType || jobs[idx].title,
        location: jobData.city || jobs[idx].location,
        type: (jobData.type as DetailedJob['type']) || jobs[idx].type,
        salary: jobData.salary || jobs[idx].salary,
        description: jobData.description || jobs[idx].description,
        image: jobData.images?.[0]
          ? URL.createObjectURL(jobData.images[0])
          : jobs[idx].image,
        updatedAt: new Date().toISOString(),
      };
      jobs.splice(idx, 1, updated);
      setToast({ message: 'Job updated successfully!', type: 'success' });
    }
    setIsCreateJobModalOpen(false);
    setIsEditMode(false);
    setJobToEdit(null);
  };

  const handleDeleteClick = (job: DetailedJob) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!jobToDelete) return;
    const jobs = companyHomeData.allJobs;
    const idx = jobs.findIndex((j) => j.id === jobToDelete.id);
    if (idx !== -1) {
      jobs.splice(idx, 1);
      setToast({ message: 'Job deleted successfully', type: 'success' });
    }
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <CompanyProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="mt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="bg-gradient-premium bg-clip-text text-4xl font-bold text-transparent">
                  Job Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your job postings and review applications
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateJobModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-glow"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Job</span>
              </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Jobs
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {jobs.length}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary-100 p-3">
                    <Briefcase className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Jobs
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {jobs.filter((j) => j.status === 'Active').length}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <AlertCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Applications
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {jobs.reduce(
                        (acc, job) => acc + job.applications.length,
                        0
                      )}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Views
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {jobs.reduce((acc, job) => acc + job.views, 0)}
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 flex flex-col gap-4 sm:flex-row"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, department, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as 'all' | 'Active' | 'Paused' | 'Closed'
                  )
                }
                className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-10 text-sm font-medium transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </motion.div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-white p-16 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Jobs Found
              </h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first job posting to get started'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={item}
                  className="group overflow-hidden rounded-3xl bg-gradient-to-br from-white to-primary-50/30 shadow-premium transition-all duration-500 hover:shadow-premium-lg"
                  whileHover={{ scale: 1.01, x: 4 }}
                >
                  <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
                    {/* Image Section */}
                    <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white lg:h-32 lg:w-48">
                      <Image
                        src={job.image}
                        alt={job.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:rotate-2 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-500/20 group-hover:to-accent-500/20 group-hover:opacity-100"></div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                              {job.title}
                            </h3>
                            {job.urgent && (
                              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Urgent
                              </span>
                            )}
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(job.status)}`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                            {job.description}
                          </p>
                        </div>
                      </div>

                      {/* Meta Info Grid */}
                      <div className="mb-4 grid grid-cols-1 gap-3 text-xs text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary-500" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary-500" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary-500" />
                          <span>
                            {new Date(job.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Stats Bar */}
                      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 px-4 py-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-gray-900">
                            {job.applications.length}
                          </span>
                          <span className="text-gray-600">Applications</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4 text-purple-500" />
                          <span className="font-semibold text-gray-900">
                            {job.views}
                          </span>
                          <span className="text-gray-600">Views</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          onClick={() => handleViewApplications(job)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-glow"
                        >
                          <Users className="h-4 w-4" />
                          <span>
                            View Applications ({job.applications.length})
                          </span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleEditClick(job)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Job</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteClick(job)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:shadow-md"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Applications Modal */}
      {selectedJob && (
        <JobApplicationsModal
          isOpen={isApplicationsModalOpen}
          onClose={() => {
            setIsApplicationsModalOpen(false);
            setSelectedJob(null);
          }}
          jobTitle={selectedJob.title}
          applications={selectedJob.applications}
        />
      )}

      {/* Create/Edit Job Modal */}
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => {
          setIsCreateJobModalOpen(false);
          setIsEditMode(false);
          setJobToEdit(null);
        }}
        initialData={
          isEditMode && jobToEdit
            ? {
                id: jobToEdit.id,
                // jobType in the modal expects one of Driver/Technician/Helper so leave empty when editing a generic title
                jobType: '' as ModalJobType,
                duration: 'Permanent',
                openings: '',
                salary: jobToEdit.salary,
                city: jobToEdit.location,
                type: ['Full-time', 'Part-time', 'Contract'].includes(
                  jobToEdit.type
                )
                  ? (jobToEdit.type as DetailedJob['type'])
                  : ('Full-time' as DetailedJob['type']),
                description: jobToEdit.description,
                images: [],
              }
            : null
        }
        mode={isEditMode ? 'edit' : 'create'}
        onSubmit={(data) => {
          const d = data as unknown as {
            id?: string;
            jobType?: string;
            duration?: string;
            openings?: string;
            salary?: string;
            city?: string;
            type?: string;
            description?: string;
            images?: File[];
          };
          if (isEditMode) handleSaveEditedJob(d);
          else
            handleCreateJob({
              jobType: d.jobType || '',
              duration: d.duration || 'Permanent',
              openings: d.openings || '',
              salary: d.salary || '',
              city: d.city || '',
              type: d.type || 'Full-time',
              description: d.description || '',
              images: d.images || [],
            });
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`rounded-lg px-4 py-3 shadow-md ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>{toast.message}</div>
              <button onClick={() => setToast(null)} className="font-bold">
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Shared Footer */}
      <Footer />
    </CompanyProtected>
  );
}
