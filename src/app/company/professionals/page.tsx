'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  User,
  Star,
  Clock,
  UserCheck,
  Phone,
  Truck,
  FileText,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import Image from 'next/image';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

interface Professional {
  id: string;
  name: string;
  contactNumber: string;
  vehicleNumber: string;
  description: string;
  driverType: string; // "Onboard", "Hired", "Applicant"
  driverImagePath?: string;
}

export default function ProfessionalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch professionals from API
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);
        const user = api.getCurrentUser();
        if (!user) {
          setError('Please log in to view professionals');
          return;
        }

        // Fetch professional list using userId
        const response = await wheelboardApi.transport.getProfessionalList(
          user.id
        );

        console.log('[Professionals] API Response:', response);

        const professionalsData: any[] = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        console.log(
          '[Professionals] Professionals Data Array:',
          professionalsData
        );

        // Fetch details for each professional to get their images
        const professionalsWithImages = await Promise.all(
          professionalsData.map(async (apiProf: any) => {
            try {
              // Fetch individual professional details to get image
              const detailsResponse =
                await wheelboardApi.transport.getProfessionalDetails(
                  apiProf.driverId
                );

              const details = detailsResponse.data as any;
              const imagePath = details?.driverImagePath;

              console.log(
                `[Professional ${apiProf.fullName}] Image:`,
                imagePath
              );

              return {
                id: apiProf.driverId,
                name: apiProf.fullName,
                contactNumber: apiProf.contactNumber,
                vehicleNumber: apiProf.vehicleNumber,
                description: apiProf.description,
                driverType: apiProf.driverType,
                driverImagePath: imagePath
                  ? `https://wheelboardapi.addonshareware.com/${imagePath}`
                  : '/profile.png',
              };
            } catch (error) {
              console.error(
                `Error fetching details for ${apiProf.fullName}:`,
                error
              );
              // Fallback to basic data without image
              return {
                id: apiProf.driverId,
                name: apiProf.fullName,
                contactNumber: apiProf.contactNumber,
                vehicleNumber: apiProf.vehicleNumber,
                description: apiProf.description,
                driverType: apiProf.driverType,
                driverImagePath: '/profile.png',
              };
            }
          })
        );

        console.log(
          '[Professionals] Mapped Data with Images:',
          professionalsWithImages
        );
        setProfessionals(professionalsWithImages);
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setError('Failed to load professionals from API');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter((prof) => {
    // Filter by driver type (Onboard/Hired/Applicant)
    if (
      accountFilter !== 'all' &&
      prof.driverType.toLowerCase() !== accountFilter.toLowerCase()
    ) {
      return false;
    }

    // Search by name, contact number, vehicle number, or description
    const matchesSearch =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.contactNumber.includes(searchQuery) ||
      prof.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    total: professionals.length,
    onboarded: professionals.filter(
      (p) => p.driverType.toLowerCase() === 'onboard'
    ).length,
    hired: professionals.filter((p) => p.driverType.toLowerCase() === 'hired')
      .length,
    applicants: professionals.filter(
      (p) => p.driverType.toLowerCase() === 'applicant'
    ).length,
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
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
              onClick={() => router.push('/company/home')}
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
                All ({professionals.length})
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
                  Total Professionals
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
              className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  Onboarded
                </span>
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-900">
                {stats.onboarded}
              </p>
              <p className="mt-1 text-xs text-blue-600">Active members</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  Hired
                </span>
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.hired}</p>
              <p className="mt-1 text-xs text-green-600">Contract workers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Applicants
                </span>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-900">
                {stats.applicants}
              </p>
              <p className="mt-1 text-xs text-yellow-600">Pending review</p>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, contact, vehicle number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600"></div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Loading Professionals...
              </h3>
              <p className="text-gray-600">
                Fetching professional network from our database
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-4 text-orange-500">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{error}</h3>
              <p className="text-gray-600">Showing cached professionals data</p>
            </motion.div>
          ) : null}

          {/* Professionals Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals.map((prof, index) => {
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
                      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                        <span className="text-xs font-bold">
                          {prof.driverType}
                        </span>
                      </div>
                    </div>

                    {/* Profile Section */}
                    <div className="relative px-5 pb-5">
                      <div className="relative -mt-12 mb-4 flex flex-col items-center">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                          <Image
                            src={prof.driverImagePath || '/profile.png'}
                            alt={prof.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="mt-3 text-center text-lg font-bold text-gray-900">
                          {prof.name}
                        </h3>
                      </div>

                      {/* Info Grid */}
                      <div className="mb-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            {prof.contactNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            {prof.vehicleNumber}
                          </span>
                        </div>
                        {prof.description && (
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="mt-0.5 h-4 w-4 text-gray-400" />
                            <span className="line-clamp-2 text-gray-700">
                              {prof.description}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            router.push(`/company/professionals/${prof.id}`)
                          }
                          className="flex-1 rounded-xl bg-[#f36969] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e85555]"
                        >
                          View Details
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleFavorite(prof.id)}
                          className={`rounded-xl border px-4 py-2.5 transition-all ${
                            favorites[prof.id]
                              ? 'border-[#f36969] bg-[#f36969]/5 text-[#f36969]'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-[#f36969] hover:text-[#f36969]'
                          }`}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              favorites[prof.id] ? 'fill-[#f36969]' : ''
                            }`}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProfessionals.length === 0 && (
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
