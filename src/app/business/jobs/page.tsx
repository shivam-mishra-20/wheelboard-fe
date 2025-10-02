'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { BusinessProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';

export default function BusinessJobsPage() {
  const [activeTab, setActiveTab] = useState('posted');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: '/Hire.png', alt: 'Hiring solutions' },
    { id: 2, image: '/support.png', alt: 'Job management' },
    { id: 3, image: '/challenges.png', alt: 'Talent acquisition' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  const postedJobs = [
    {
      id: 1,
      title: 'Senior Fleet Manager',
      department: 'Operations',
      location: 'Mumbai, Maharashtra',
      type: 'Full-time',
      salary: '₹8,00,000 - ₹12,00,000/year',
      description:
        'Looking for an experienced fleet manager to oversee our growing transportation operations. Responsible for fleet optimization, driver management, and operational efficiency.',
      requirements: [
        '5+ years in fleet management',
        'Experience with GPS tracking systems',
        'Strong leadership skills',
        'Knowledge of transportation regulations',
      ],
      benefits: [
        'Health Insurance',
        'Performance Bonus',
        'Flexible Hours',
        'Professional Development',
      ],
      postedDate: '2025-09-28',
      applications: 47,
      views: 324,
      status: 'Active',
      urgent: true,
      image: '/truck-01.jpg',
    },
    {
      id: 2,
      title: 'Heavy Vehicle Driver',
      department: 'Operations',
      location: 'Delhi, NCR',
      type: 'Full-time',
      salary: '₹35,000 - ₹45,000/month',
      description:
        'Seeking experienced heavy vehicle drivers for long-distance transportation. Must have clean driving record and flexibility for interstate travel.',
      requirements: [
        'Valid Heavy Vehicle License',
        'Minimum 3 years experience',
        'Clean driving record',
        'Interstate travel flexibility',
      ],
      benefits: [
        'Fuel Allowance',
        'Medical Coverage',
        'Overtime Pay',
        'Travel Allowance',
      ],
      postedDate: '2025-09-25',
      applications: 89,
      views: 567,
      status: 'Active',
      urgent: false,
      image: '/staring-man.jpg',
    },
    {
      id: 3,
      title: 'Logistics Coordinator',
      department: 'Planning',
      location: 'Bangalore, Karnataka',
      type: 'Full-time',
      salary: '₹4,50,000 - ₹6,50,000/year',
      description:
        'Coordinate logistics operations, manage supply chain activities, and ensure timely deliveries. Work closely with drivers and customers.',
      requirements: [
        "Bachelor's degree preferred",
        'Logistics experience 2+ years',
        'Strong communication skills',
        'Computer proficiency',
      ],
      benefits: [
        'Career Growth',
        'Training Programs',
        'Health Benefits',
        'Team Environment',
      ],
      postedDate: '2025-09-22',
      applications: 23,
      views: 156,
      status: 'Active',
      urgent: false,
      image: '/dashboard.png',
    },
    {
      id: 4,
      title: 'Maintenance Supervisor',
      department: 'Maintenance',
      location: 'Chennai, Tamil Nadu',
      type: 'Full-time',
      salary: '₹6,00,000 - ₹8,50,000/year',
      description:
        'Supervise vehicle maintenance operations, manage workshop staff, and ensure fleet readiness. Focus on preventive maintenance and cost optimization.',
      requirements: [
        'Mechanical engineering background',
        '4+ years supervisory experience',
        'Knowledge of vehicle systems',
        'Team management skills',
      ],
      benefits: [
        'Technical Training',
        'Performance Incentives',
        'Health Insurance',
        'Growth Opportunities',
      ],
      postedDate: '2025-09-20',
      applications: 31,
      views: 203,
      status: 'Paused',
      urgent: false,
      image: '/tires.png',
    },
  ];

  const applications = [
    {
      id: 1,
      jobTitle: 'Senior Fleet Manager',
      candidate: {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        experience: '8 years',
        location: 'Mumbai, Maharashtra',
        avatar: '/profile-pic.png',
      },
      appliedDate: '2025-09-29',
      status: 'Under Review',
      score: 85,
      resume: 'rajesh_kumar_resume.pdf',
      coverLetter: true,
      skills: [
        'Fleet Management',
        'GPS Systems',
        'Team Leadership',
        'Cost Optimization',
      ],
    },
    {
      id: 2,
      jobTitle: 'Heavy Vehicle Driver',
      candidate: {
        name: 'Suresh Patel',
        email: 'suresh.patel@email.com',
        phone: '+91 87654 32109',
        experience: '6 years',
        location: 'Delhi, NCR',
        avatar: '/staring-man.jpg',
      },
      appliedDate: '2025-09-28',
      status: 'Interview Scheduled',
      score: 92,
      resume: 'suresh_patel_resume.pdf',
      coverLetter: false,
      interviewDate: '2025-10-02',
      skills: [
        'Heavy Vehicle Driving',
        'Interstate Travel',
        'Safety Compliance',
      ],
    },
    {
      id: 3,
      jobTitle: 'Logistics Coordinator',
      candidate: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 76543 21098',
        experience: '3 years',
        location: 'Bangalore, Karnataka',
        avatar: '/professional-profile.png',
      },
      appliedDate: '2025-09-27',
      status: 'Shortlisted',
      score: 78,
      resume: 'priya_sharma_resume.pdf',
      coverLetter: true,
      skills: [
        'Supply Chain',
        'Coordination',
        'Customer Service',
        'Data Analysis',
      ],
    },
    {
      id: 4,
      jobTitle: 'Senior Fleet Manager',
      candidate: {
        name: 'Amit Singh',
        email: 'amit.singh@email.com',
        phone: '+91 65432 10987',
        experience: '7 years',
        location: 'Pune, Maharashtra',
        avatar: '/logistics-professional.jpg',
      },
      appliedDate: '2025-09-26',
      status: 'Rejected',
      score: 65,
      resume: 'amit_singh_resume.pdf',
      coverLetter: true,
      skills: ['Fleet Operations', 'Budget Management', 'Vendor Relations'],
      rejectionReason: 'Insufficient experience with GPS systems',
    },
  ];

  const analytics = {
    totalJobs: postedJobs.length,
    activeJobs: postedJobs.filter((job) => job.status === 'Active').length,
    totalApplications: applications.length,
    totalViews: postedJobs.reduce((sum, job) => sum + job.views, 0),
    avgApplicationsPerJob: Math.round(
      postedJobs.reduce((sum, job) => sum + job.applications, 0) /
        postedJobs.length
    ),
    responseRate: '73%',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Shortlisted':
        return 'bg-indigo-100 text-indigo-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="relative h-64 md:h-80">
              <div className="relative h-full w-full">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    Job Management
                  </h1>
                  <p className="text-lg md:text-xl">
                    Post jobs, manage applications, and find the right talent
                  </p>
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              {
                title: 'Total Jobs',
                value: analytics.totalJobs.toString(),
                icon: (
                  <svg
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                    />
                  </svg>
                ),
                color: 'bg-blue-50 border-blue-200',
              },
              {
                title: 'Active Jobs',
                value: analytics.activeJobs.toString(),
                icon: (
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                color: 'bg-green-50 border-green-200',
              },
              {
                title: 'Applications',
                value: analytics.totalApplications.toString(),
                icon: (
                  <svg
                    className="h-8 w-8 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                color: 'bg-purple-50 border-purple-200',
              },
              {
                title: 'Total Views',
                value: analytics.totalViews.toString(),
                icon: (
                  <svg
                    className="h-8 w-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                ),
                color: 'bg-orange-50 border-orange-200',
              },
              {
                title: 'Avg Applications',
                value: analytics.avgApplicationsPerJob.toString(),
                icon: (
                  <svg
                    className="h-8 w-8 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                color: 'bg-indigo-50 border-indigo-200',
              },
              {
                title: 'Response Rate',
                value: analytics.responseRate,
                icon: (
                  <svg
                    className="h-8 w-8 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ),
                color: 'bg-pink-50 border-pink-200',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${stat.color}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
              <div>
                <h3 className="text-xl font-bold">Ready to hire?</h3>
                <p className="mt-1 text-blue-100">
                  Create a new job posting and reach qualified candidates
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-gray-100">
                  Post New Job
                </button>
                <button className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium text-white hover:bg-white/20">
                  View Templates
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 flex space-x-1 rounded-2xl bg-gray-100 p-1">
            {[
              { id: 'posted', label: 'Posted Jobs' },
              { id: 'applications', label: 'Applications' },
              { id: 'analytics', label: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Posted Jobs */}
          {activeTab === 'posted' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Posted Jobs</h2>
              {postedJobs.map((job) => (
                <div
                  key={job.id}
                  className={`rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg ${
                    job.urgent ? 'ring-2 ring-red-200' : ''
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={job.image}
                          alt={job.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          {job.urgent && (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                        <div className="mt-1 text-lg font-semibold text-green-600">
                          {job.salary}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-gray-700">{job.description}</p>

                  <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900">
                        Requirements:
                      </h4>
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900">
                        Benefits:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {job.applications}
                      </div>
                      <div className="text-sm text-blue-700">Applications</div>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {job.views}
                      </div>
                      <div className="text-sm text-purple-700">Views</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-sm font-medium text-gray-600">
                        Posted
                      </div>
                      <div className="text-sm text-gray-900">
                        {job.postedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {job.status === 'Active' && (
                        <button className="rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-100">
                          Pause Job
                        </button>
                      )}
                      {job.status === 'Paused' && (
                        <button className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-100">
                          Resume Job
                        </button>
                      )}
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Edit Job
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
                        View Applications
                      </button>
                      <button className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-100">
                        Share Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applications */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={application.candidate.avatar}
                          alt={application.candidate.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {application.candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Applied for: {application.jobTitle}
                        </p>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                          <span>{application.candidate.email}</span>
                          <span>•</span>
                          <span>{application.candidate.phone}</span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            {application.candidate.experience} experience
                          </span>
                          <span>•</span>
                          <span>{application.candidate.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`rounded-lg px-3 py-1 text-sm font-semibold ${getScoreColor(application.score)}`}
                      >
                        {application.score}% Match
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">
                      Key Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        APPLIED DATE
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {application.appliedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        RESUME
                      </p>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {application.resume}
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        COVER LETTER
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {application.coverLetter ? 'Included' : 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {/* Interview Info */}
                  {application.interviewDate && (
                    <div className="mb-4 rounded-lg bg-purple-50 p-3">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium text-purple-800">
                          Interview scheduled for {application.interviewDate}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {application.status === 'Rejected' &&
                    application.rejectionReason && (
                      <div className="mb-4 rounded-lg bg-red-50 p-3">
                        <div className="flex items-start space-x-2">
                          <svg
                            className="mt-0.5 h-5 w-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <span className="font-medium text-red-800">
                              Rejection Reason:
                            </span>
                            <p className="text-sm text-red-700">
                              {application.rejectionReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {application.status === 'Under Review' && (
                        <>
                          <button className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-100">
                            Shortlist
                          </button>
                          <button className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-100">
                            Schedule Interview
                          </button>
                          <button className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                            Reject
                          </button>
                        </>
                      )}
                      {application.status === 'Shortlisted' && (
                        <button className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-100">
                          Schedule Interview
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        View Profile
                      </button>
                      <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Job Analytics
              </h2>

              {/* Performance Chart Placeholder */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Application Trends
                </h3>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Analytics chart would be integrated here
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Performing Jobs */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Top Performing Jobs
                </h3>
                <div className="space-y-4">
                  {postedJobs
                    .sort((a, b) => b.applications - a.applications)
                    .slice(0, 3)
                    .map((job, index) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {job.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {job.applications}
                          </div>
                          <div className="text-sm text-gray-600">
                            applications
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </BusinessProtected>
  );
}
