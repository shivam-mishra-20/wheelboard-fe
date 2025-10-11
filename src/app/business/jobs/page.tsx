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
import { BusinessProtected } from '@/components/ProtectedRoute';
import LoginSimulator from '@/components/LoginSimulator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateJobModal from '@/components/company/CreateJobModal';
import ConfirmDeleteModal from '@/components/company/ConfirmDeleteModal';
import JobApplicationsModal from '@/components/business/JobApplicationsModal';
import { businessJobsData, type BusinessJob } from '@/lib/mockApi';

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

type ModalJobType = '' | 'Technician' | 'Helper';

export default function BusinessJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'Active' | 'Paused' | 'Closed'
  >('all');
  const [jobs, setJobs] = useState<BusinessJob[]>(businessJobsData);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<BusinessJob | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<BusinessJob | null>(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [selectedJobForApplications, setSelectedJobForApplications] =
    useState<BusinessJob | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
    const newJob: BusinessJob = {
      id: 'job-' + Date.now(),
      title: jobData.jobType || 'New Job',
      department: 'Service',
      location: jobData.city || 'Unknown',
      type: (jobData.type as BusinessJob['type']) || 'Full-time',
      salary: jobData.salary || 'Not specified',
      description: jobData.description || '',
      requirements: [],
      benefits: [],
      image: jobData.images?.[0]
        ? URL.createObjectURL(jobData.images[0])
        : '/tires.png',
      createdAt: new Date().toISOString(),
      status: 'Active',
      views: 0,
      applications: [],
    };

    setJobs([newJob, ...jobs]);
    setToast({ message: 'Job created successfully!', type: 'success' });
    setIsCreateJobModalOpen(false);

    // Auto-hide toast
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditClick = (job: BusinessJob) => {
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
    const updatedJobs = jobs.map((job) => {
      if (job.id === jobData.id) {
        return {
          ...job,
          title: jobData.jobType || job.title,
          location: jobData.city || job.location,
          type: (jobData.type as BusinessJob['type']) || job.type,
          salary: jobData.salary || job.salary,
          description: jobData.description || job.description,
          image: jobData.images?.[0]
            ? URL.createObjectURL(jobData.images[0])
            : job.image,
        };
      }
      return job;
    });

    setJobs(updatedJobs);
    setToast({ message: 'Job updated successfully!', type: 'success' });
    setIsCreateJobModalOpen(false);
    setIsEditMode(false);
    setJobToEdit(null);

    // Auto-hide toast
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteClick = (job: BusinessJob) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!jobToDelete) return;
    setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
    setToast({ message: 'Job deleted successfully', type: 'success' });
    setIsDeleteModalOpen(false);
    setJobToDelete(null);

    // Auto-hide toast
    setTimeout(() => setToast(null), 3000);
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
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="mt-20 min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="bg-gradient-to-r from-[#f36969] to-[#e85555] bg-clip-text text-4xl font-bold text-transparent">
                  Job Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Post jobs for Technicians and Helpers
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateJobModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
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
                  <div className="rounded-full bg-[#f36969]/10 p-3">
                    <Briefcase className="h-6 w-6 text-[#f36969]" />
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
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
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
                className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-10 text-sm font-medium transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 sm:w-auto"
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
                  className="group overflow-hidden rounded-3xl bg-gradient-to-br from-white to-pink-50/30 shadow-lg transition-all duration-500 hover:shadow-xl"
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
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f36969]/0 to-[#e85555]/0 opacity-0 transition-opacity duration-500 group-hover:from-[#f36969]/20 group-hover:to-[#e85555]/20 group-hover:opacity-100"></div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#f36969]">
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
                          <Briefcase className="h-4 w-4 text-[#f36969]" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#f36969]" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#f36969]" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#f36969]" />
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
                        {job.applications.length > 0 && (
                          <motion.button
                            onClick={() => {
                              setSelectedJobForApplications(job);
                              setIsApplicationsModalOpen(true);
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-xl border-2 border-[#f36969] bg-white px-5 py-2.5 text-sm font-semibold text-[#f36969] shadow-sm transition-all hover:bg-[#f36969] hover:text-white hover:shadow-md"
                          >
                            <Users className="h-4 w-4" />
                            <span>
                              View Applications ({job.applications.length})
                            </span>
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => handleEditClick(job)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
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

      {/* Create/Edit Job Modal - Only allows Technician and Helper */}
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
                jobType: '' as ModalJobType,
                duration: 'Permanent',
                openings: '',
                salary: jobToEdit.salary,
                city: jobToEdit.location,
                type: jobToEdit.type,
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
        // Restrict job types to only Technician and Helper for business
        allowedJobTypes={['Technician', 'Helper']}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
      />

      {/* Job Applications Modal */}
      <JobApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={() => {
          setIsApplicationsModalOpen(false);
          setSelectedJobForApplications(null);
        }}
        jobTitle={selectedJobForApplications?.title || ''}
        applications={selectedJobForApplications?.applications || []}
      />

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className={`rounded-xl px-6 py-4 shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold">{toast.message}</div>
              <button
                onClick={() => setToast(null)}
                className="text-xl font-bold hover:opacity-80"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <Footer />
    </BusinessProtected>
  );
}
