'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Edit2,
  X,
  LogOut,
  Save,
  Camera,
  Calendar,
  Globe,
  Hash,
  Truck,
  ArrowLeft,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompanyProfile {
  id: string;
  email: string;
  rating?: number;
  companyName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  businessCategory: string;
  userType: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  gstNumber?: string;
  fleetSize?: number;
  operatingRegions?: string[];
  description?: string;
  logo?: string;
  website?: string;
  createdAt: string;
}

const CompanyProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CompanyProfile | null>(
    null
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const mockProfile: CompanyProfile = {
      id: '1',
      email: 'contact@transportco.com',
      companyName: 'Swift Transport Co.',
      phoneNumber: '+91 98765 43210',
      whatsappNumber: '+91 98765 43210',
      businessCategory: 'Logistics & Transport',
      userType: 'company',
      businessAddress: '456 Industrial Area, Transport Hub Sector 22',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      gstNumber: 'GST: 27AABCT1332L1Z',
      fleetSize: 45,
      operatingRegions: ['Maharashtra', 'Gujarat', 'Karnataka'],
      description:
        'Swift Transport Co. is a premier logistics and transportation company with over 20 years of experience in the industry. We operate a modern fleet of 45 vehicles and provide reliable transportation solutions across multiple states. Our commitment to safety, punctuality, and customer satisfaction has made us a trusted partner for businesses nationwide.',
      logo: '/profile.png',
      website: 'www.swifttransport.com',
      createdAt: '2024-01-10T10:00:00Z',
    };

    setProfile(mockProfile);
    setEditedProfile(mockProfile);
    setLogoPreview(mockProfile.logo || null);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
      setLogoPreview(profile?.logo || null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    field: keyof CompanyProfile,
    value: string | string[] | number
  ) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        if (editedProfile) {
          setEditedProfile({
            ...editedProfile,
            logo: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleLogout = () => {
    router.push('/');
  };

  // Switch user to the professional profile (simple client-side navigation)
  const handleSwitchProfile = () => {
    router.push('/professional/profile');
  };

  if (!profile || !editedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#f36969]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-lg shadow-[#f36969]/30">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Company Profile
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your company profile and fleet
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditToggle}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 sm:flex-initial"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditToggle}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-md transition-all hover:border-gray-400 hover:shadow-lg sm:flex-initial"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/30 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/40 disabled:opacity-50 sm:flex-initial"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="relative h-28 bg-gradient-to-r from-[#f36969] to-[#f36565] sm:h-32">
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 sm:-bottom-16">
                  <div className="relative">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl sm:h-32 sm:w-32">
                      <Image
                        src={logoPreview || '/profile-pic.png'}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f36969] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#f36565] sm:h-10 sm:w-10">
                        <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">
                          {profile.rating}
                        </span>
                        <span className="text-xs text-gray-500">/ 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-6 pt-16 sm:px-6 sm:pt-20">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {editedProfile.companyName}
                  </h2>
                  <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                    {editedProfile.gstNumber}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-[#f36969]/10 to-[#f36565]/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f36969]">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          Fleet Size
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {editedProfile.fleetSize} Vehicles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Operating Regions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {editedProfile.operatingRegions?.map((region, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => router.push('/company/subscriptions')}
                    className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/30 transition-all hover:shadow-xl hover:shadow-green-600/40"
                  >
                    View Subscription Plans
                  </button>
                  <button
                    onClick={handleSwitchProfile}
                    className="w-full rounded-xl border-2 border-[#f36969] bg-white py-3.5 text-sm font-bold text-[#f36969] transition-all hover:bg-[#f36969]/5"
                  >
                    Switch Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-black"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 lg:col-span-2"
          >
            <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="mb-5 text-lg font-bold text-gray-900 sm:text-xl">
                Business Address
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={editedProfile.businessAddress || ''}
                      onChange={(e) =>
                        handleInputChange('businessAddress', e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        value={editedProfile.city || ''}
                        onChange={(e) =>
                          handleInputChange('city', e.target.value)
                        }
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        value={editedProfile.state || ''}
                        onChange={(e) =>
                          handleInputChange('state', e.target.value)
                        }
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#f36969]" />
                  <div className="text-sm text-gray-900">
                    <p className="font-semibold">{profile.businessAddress}</p>
                    <p className="mt-1 text-gray-600">
                      {profile.city}, {profile.state}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="mb-5 text-lg font-bold text-gray-900 sm:text-xl">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.phoneNumber}
                        onChange={(e) =>
                          handleInputChange('phoneNumber', e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      />
                    ) : (
                      <p className="mt-1 truncate text-sm font-bold text-gray-900">
                        {profile.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-500">
                      Email Address
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      />
                    ) : (
                      <p className="mt-1 truncate text-sm font-bold text-gray-900">
                        {profile.email}
                      </p>
                    )}
                  </div>
                </div>

                {(isEditing || profile.website) && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                      <Globe className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-500">
                        Website
                      </p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.website || ''}
                          onChange={(e) =>
                            handleInputChange('website', e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                        />
                      ) : (
                        <p className="mt-1 truncate text-sm font-bold text-gray-900">
                          {profile.website}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="mb-5 text-lg font-bold text-gray-900 sm:text-xl">
                About Company
              </h3>
              {isEditing ? (
                <textarea
                  value={editedProfile.description || ''}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  rows={6}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                  placeholder="Tell us about your company..."
                />
              ) : (
                <p className="text-sm leading-relaxed text-gray-700">
                  {profile.description || 'No description available'}
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="mb-5 text-lg font-bold text-gray-900 sm:text-xl">
                Additional Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <Hash className="h-5 w-5 shrink-0 text-gray-600" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500">
                      GST Number
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-gray-900">
                      {profile.gstNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <Calendar className="h-5 w-5 shrink-0 text-gray-600" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500">
                      Member Since
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
