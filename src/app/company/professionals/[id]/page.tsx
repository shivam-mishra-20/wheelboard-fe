'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Truck,
  FileText,
  User,
  Mail,
  Calendar,
  Briefcase,
  Award,
  Star,
  Clock,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import Image from 'next/image';
import { wheelboardApi } from '@/lib/wheelboardApi';
import toast from 'react-hot-toast';

interface ProfessionalDetails {
  driverId: string;
  fullName: string;
  contactNumber: string;
  vehicleNumber: string;
  description: string;
  driverImagePath: string;
  driverType: string;
}

export default function ProfessionalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const driverId = params?.id as string;

  const [professional, setProfessional] = useState<ProfessionalDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      if (!driverId) {
        setError('Professional ID not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('[Professional Details] Fetching for ID:', driverId);

        const response =
          await wheelboardApi.transport.getProfessionalDetails(driverId);

        console.log('[Professional Details] API Response:', response);

        if (response.success && response.data) {
          const data = response.data as any;
          setProfessional({
            driverId: data.driverId,
            fullName: data.fullName,
            contactNumber: data.contactNumber,
            vehicleNumber: data.vehicleNumber,
            description: data.description,
            driverImagePath: data.driverImagePath
              ? `https://wheelboardapi.addonshareware.com/${data.driverImagePath}`
              : '/profile.png',
            driverType: data.driverType,
          });
        } else {
          setError('Failed to load professional details');
          toast.error('Failed to load professional details');
        }
      } catch (error) {
        console.error('[Professional Details] Error:', error);
        setError('An error occurred while loading professional details');
        toast.error('Failed to load professional details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionalDetails();
  }, [driverId]);

  if (isLoading) {
    return (
      <CompanyProtected>
        <Header />
        <LoginSimulator />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
          <div className="flex min-h-[60vh] items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#f36969]"></div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Loading Professional Details...
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch the data
              </p>
            </motion.div>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  if (error || !professional) {
    return (
      <CompanyProtected>
        <Header />
        <LoginSimulator />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
          <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/company/professionals')}
              className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Professionals
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-4 text-orange-500">
                <svg
                  className="mx-auto h-16 w-16"
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
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {error || 'Professional Not Found'}
              </h3>
              <p className="mb-6 text-gray-600">
                Unable to load the professional details
              </p>
              <button
                onClick={() => router.push('/company/professionals')}
                className="rounded-xl bg-[#f36969] px-6 py-3 font-semibold text-white transition-all hover:bg-[#e85555]"
              >
                Back to Professionals
              </button>
            </motion.div>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/company/professionals')}
            className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Professionals
          </motion.button>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Header with Gradient */}
                <div className="relative h-32 bg-gradient-to-r from-[#f36969] to-[#e85555]">
                  <div className="absolute right-4 top-4 rounded-lg border border-white/20 bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                    <span className="text-xs font-bold">
                      {professional.driverType}
                    </span>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="relative px-6 pb-6">
                  <div className="relative -mt-16 mb-4 flex flex-col items-center">
                    <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                      <Image
                        src={professional.driverImagePath}
                        alt={professional.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
                      {professional.fullName}
                    </h2>
                    <p className="text-sm text-gray-500">Professional</p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Contact Number</p>
                        <p className="font-semibold text-gray-900">
                          {professional.contactNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                        <Truck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Vehicle Number</p>
                        <p className="font-semibold text-gray-900">
                          {professional.vehicleNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold text-gray-900">
                          {professional.driverType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-2">
                    <button className="w-full rounded-xl bg-[#f36969] px-4 py-3 font-semibold text-white transition-all hover:bg-[#e85555]">
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        Call Professional
                      </div>
                    </button>
                    <button className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        Send Message
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#f36969]" />
                  <h3 className="text-xl font-bold text-gray-900">
                    About Professional
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {professional.description}
                  </p>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Status
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Available for work
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-green-50 p-2">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Rating
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="mt-1 text-xs text-gray-500">Based on reviews</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-purple-50 p-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Experience
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">5+ Years</p>
                  <p className="mt-1 text-xs text-gray-500">
                    In transportation
                  </p>
                </motion.div>
              </div>

              {/* Additional Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#f36969]" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Professional Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <Truck className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Vehicle Assigned
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {professional.vehicleNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <Briefcase className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Employment Type
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {professional.driverType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <Phone className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Contact
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {professional.contactNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Member Since
                      </p>
                      <p className="mt-1 text-sm text-gray-600">2024</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}
