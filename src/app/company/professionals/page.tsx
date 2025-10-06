'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  User,
  Star,
  MapPin,
  Clock,
  Award,
  Eye,
  Heart,
  MoreVertical,
  UserCheck,
  UserX,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import Image from 'next/image';

interface Professional {
  id: string;
  name: string;
  role: string;
  // removed 'specialty' UI to declutter; keep in data for now if needed
  specialty?: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  status: 'available' | 'busy' | 'offline';
  email: string;
  phone: string;
  location: string;
  experience: string;
  hourlyRate?: number;
  avatar: string;
  joinedDate: string;
  skills: string[];
  // source: where the account came from
  source: 'onboarded' | 'hired' | 'applicant';
}

const mockProfessionals: Professional[] = [
  {
    id: 'p1',
    name: 'Rajesh Kumar',
    role: 'Logistics Manager',
    specialty: 'Supply Chain',
    rating: 4.8,
    totalJobs: 156,
    completedJobs: 148,
    status: 'available',
    email: 'rajesh.k@example.com',
    phone: '+91 98765 43210',
    location: 'Delhi, India',
    experience: '8 years',
    hourlyRate: 1500,
    avatar: '/profile.png',
    joinedDate: '2022-01-15',
    skills: ['Route Planning', 'Fleet Management', 'Cost Optimization'],
    source: 'onboarded',
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    role: 'Operations Coordinator',
    specialty: 'Transportation',
    rating: 4.9,
    totalJobs: 203,
    completedJobs: 198,
    status: 'busy',
    email: 'priya.s@example.com',
    phone: '+91 98765 43211',
    location: 'Mumbai, India',
    experience: '6 years',
    hourlyRate: 1200,
    avatar: '/profile.png',
    joinedDate: '2022-03-20',
    skills: ['Scheduling', 'Team Coordination', 'Documentation'],
    source: 'onboarded',
  },
  {
    id: 'p3',
    name: 'Amit Patel',
    role: 'Safety Inspector',
    specialty: 'Compliance',
    rating: 4.7,
    totalJobs: 89,
    completedJobs: 85,
    status: 'available',
    email: 'amit.p@example.com',
    phone: '+91 98765 43212',
    location: 'Ahmedabad, India',
    experience: '10 years',
    hourlyRate: 1800,
    avatar: '/profile.png',
    joinedDate: '2021-11-10',
    skills: ['Safety Audits', 'Compliance', 'Risk Assessment'],
    source: 'hired',
  },
  {
    id: 'p4',
    name: 'Sneha Reddy',
    role: 'Warehouse Manager',
    specialty: 'Inventory',
    rating: 4.6,
    totalJobs: 134,
    completedJobs: 127,
    status: 'available',
    email: 'sneha.r@example.com',
    phone: '+91 98765 43213',
    location: 'Bangalore, India',
    experience: '7 years',
    hourlyRate: 1400,
    avatar: '/profile.png',
    joinedDate: '2022-05-08',
    skills: ['Inventory Management', 'Logistics', 'Quality Control'],
    source: 'hired',
  },
  {
    id: 'p5',
    name: 'Vikram Singh',
    role: 'Transport Consultant',
    specialty: 'Strategy',
    rating: 5.0,
    totalJobs: 67,
    completedJobs: 67,
    status: 'offline',
    email: 'vikram.s@example.com',
    phone: '+91 98765 43214',
    location: 'Pune, India',
    experience: '12 years',
    hourlyRate: 2500,
    avatar: '/profile.png',
    joinedDate: '2023-02-14',
    skills: ['Strategic Planning', 'Business Analysis', 'Process Improvement'],
    source: 'applicant',
  },
  // Additional mock entries representing hired and applicants
  {
    id: 'p7',
    name: 'Rohit Verma',
    role: 'Driver',
    specialty: 'Long Haul',
    rating: 4.5,
    totalJobs: 34,
    completedJobs: 34,
    status: 'available',
    email: 'rohit.v@example.com',
    phone: '+91 98765 43216',
    location: 'Nashik, India',
    experience: '4 years',
    hourlyRate: 800,
    avatar: '/profile.png',
    joinedDate: '2024-06-10',
    skills: ['Driving', 'Loading'],
    source: 'hired',
  },
  {
    id: 'p8',
    name: 'Sonal Mehta',
    role: 'Helper',
    specialty: 'Loading',
    rating: 4.2,
    totalJobs: 12,
    completedJobs: 11,
    status: 'available',
    email: 'sonal.m@example.com',
    phone: '+91 98765 43217',
    location: 'Vadodara, India',
    experience: '2 years',
    hourlyRate: 500,
    avatar: '/profile.png',
    joinedDate: '2024-07-01',
    skills: ['Loading', 'Inventory Help'],
    source: 'applicant',
  },
  {
    id: 'p6',
    name: 'Anita Desai',
    role: 'Fleet Coordinator',
    specialty: 'Maintenance',
    rating: 4.8,
    totalJobs: 178,
    completedJobs: 172,
    status: 'available',
    email: 'anita.d@example.com',
    phone: '+91 98765 43215',
    location: 'Chennai, India',
    experience: '5 years',
    hourlyRate: 1100,
    avatar: '/profile.png',
    joinedDate: '2022-08-22',
    skills: ['Vehicle Maintenance', 'Scheduling', 'Budget Management'],
    source: 'onboarded',
  },
];

const statusColors = {
  available: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    label: 'Available',
  },
  busy: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
    label: 'Busy',
  },
  offline: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
    label: 'Offline',
  },
};

export default function ProfessionalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<
    'all' | 'onboarded' | 'hired' | 'applicant'
  >('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredProfessionals = mockProfessionals.filter((prof) => {
    // filter by account source (onboarded/hired/applicant)
    if (accountFilter !== 'all' && prof.source !== accountFilter) return false;
    const matchesSearch =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prof.specialty || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || prof.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockProfessionals.length,
    available: mockProfessionals.filter((p) => p.status === 'available').length,
    busy: mockProfessionals.filter((p) => p.status === 'busy').length,
    offline: mockProfessionals.filter((p) => p.status === 'offline').length,
    onboarded: mockProfessionals.filter((p) => p.source === 'onboarded').length,
    hired: mockProfessionals.filter((p) => p.source === 'hired').length,
    applicants: mockProfessionals.filter((p) => p.source === 'applicant')
      .length,
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const favBase =
    'flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold transition-all ';

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - rating < 1
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </motion.button>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-[#f36969] to-[#e85555] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                  Professional Network
                </h1>
                <p className="mt-2 text-gray-600">
                  Connect with logistics and transport professionals
                </p>
              </div>

              {/* Add Professional removed per request */}
            </div>
          </div>

          {/* Account Type Tabs */}
          <div className="mb-6">
            {/* Mobile: collapsible tabs */}
            <div className="flex items-center justify-between md:hidden">
              <div className="text-sm font-semibold text-gray-700">Filters</div>
              <button
                onClick={() => setShowFilterMenu((s) => !s)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700"
              >
                {showFilterMenu ? 'Hide' : 'Show'}
              </button>
            </div>

            <div
              className={`mt-3 flex gap-3 overflow-x-auto pb-2 ${
                showFilterMenu ? '' : 'hidden md:flex'
              }`}
            >
              <button
                onClick={() => setAccountFilter('all')}
                className={`rounded-xl px-4 py-2 font-semibold transition-all ${accountFilter === 'all' ? 'bg-[#f36969] text-white' : 'border border-gray-200 bg-white text-gray-700'}`}
              >
                All ({mockProfessionals.length})
              </button>
              <button
                onClick={() => setAccountFilter('onboarded')}
                className={`rounded-xl px-4 py-2 font-semibold transition-all ${accountFilter === 'onboarded' ? 'bg-[#f36969] text-white' : 'border border-gray-200 bg-white text-gray-700'}`}
              >
                Onboarded ({stats.onboarded})
              </button>
              <button
                onClick={() => setAccountFilter('hired')}
                className={`rounded-xl px-4 py-2 font-semibold transition-all ${accountFilter === 'hired' ? 'bg-[#f36969] text-white' : 'border border-gray-200 bg-white text-gray-700'}`}
              >
                Hired ({stats.hired})
              </button>
              <button
                onClick={() => setAccountFilter('applicant')}
                className={`rounded-xl px-4 py-2 font-semibold transition-all ${accountFilter === 'applicant' ? 'bg-[#f36969] text-white' : 'border border-gray-200 bg-white text-gray-700'}`}
              >
                Applicants ({stats.applicants})
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Network
                </span>
                <User className="h-5 w-5 text-[#f36969]" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="mt-1 text-xs text-gray-500">All professionals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  Available
                </span>
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-900">
                {stats.available}
              </p>
              <p className="mt-1 text-xs text-green-600">Ready to work</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Busy
                </span>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-900">{stats.busy}</p>
              <p className="mt-1 text-xs text-yellow-600">On assignment</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Offline
                </span>
                <UserX className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.offline}
              </p>
              <p className="mt-1 text-xs text-gray-600">Not available</p>
            </motion.div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, role, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 sm:w-auto"
              >
                <Filter className="h-5 w-5" />
                Filter
                {filterStatus !== 'all' && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f36969] text-xs text-white">
                    1
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full z-10 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
                  >
                    <p className="mb-2 text-xs font-bold text-gray-500">
                      STATUS
                    </p>
                    {['all', 'available', 'busy', 'offline'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowFilterMenu(false);
                        }}
                        className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize transition-all ${
                          filterStatus === status
                            ? 'bg-[#f36969] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Professionals Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map((prof, index) => {
              const statusStyle = statusColors[prof.status];
              return (
                <motion.div
                  key={prof.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Header with Gradient */}
                  <div className="relative h-24 bg-gradient-to-r from-[#f36969] to-[#e85555]">
                    <div
                      className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border ${statusStyle.border} ${statusStyle.bg} px-3 py-1 ${statusStyle.text}`}
                    >
                      <div
                        className={`h-2 w-2 animate-pulse rounded-full ${statusStyle.dot}`}
                      />
                      <span className="text-xs font-bold">
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>

                  {/* Profile Section */}
                  <div className="relative px-5 pb-5">
                    <div className="relative -mt-12 mb-4 flex flex-col items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                        <Image
                          src={prof.avatar}
                          alt={prof.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-3 text-center text-lg font-bold text-gray-900">
                        {prof.name}
                      </h3>
                      <p className="text-sm font-semibold text-[#f36969]">
                        {prof.role}
                      </p>
                      <p className="text-xs text-gray-600">{prof.specialty}</p>
                    </div>

                    {/* Rating and Stats */}
                    <div className="mb-4 flex items-center justify-center gap-4 border-b border-gray-100 pb-4">
                      <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-1">
                          {renderStars(prof.rating)}
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {prof.rating}
                        </p>
                      </div>
                      <div className="h-12 w-px bg-gray-200" />
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">
                          {prof.completedJobs}
                        </p>
                        <p className="text-xs text-gray-600">Jobs Done</p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{prof.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{prof.experience}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {prof.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-[#f36969]/10 px-2.5 py-1 text-xs font-semibold text-[#f36969]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#f36969] to-[#e85555] px-3 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-md"
                      >
                        <Eye className="h-4 w-4" />
                        View Profile
                      </motion.button>

                      {(() => {
                        const favClasses =
                          favBase +
                          (favorites[prof.id]
                            ? 'bg-[#f36969] text-white border-transparent'
                            : 'bg-white text-gray-700 hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]');

                        return (
                          <motion.button
                            onClick={() => toggleFavorite(prof.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={favClasses}
                          >
                            <Heart className="h-4 w-4" />
                          </motion.button>
                        );
                      })()}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProfessionals.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <User className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No professionals found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}
