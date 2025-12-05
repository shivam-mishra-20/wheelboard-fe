'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Users,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

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

// Referral interface
interface Referral {
  referralId: string;
  createdBy: string;
  partnerId?: number;
  userId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: string;
  location: string;
  notifyOnAcceptance: boolean;
  referralStatus: string;
  createdAt?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Referral state
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralForm, setReferralForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    role: 'Driver',
    location: '',
    notifyOnAcceptance: true,
  });
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'referrals'>(
    'profile'
  );

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('wheelboard_current_user');
      const token = localStorage.getItem('authToken');
      console.log('LocalStorage check - User:', userStr);
      console.log('LocalStorage check - Token:', token ? 'exists' : 'missing');
    }
    fetchProfile();
    fetchReferrals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const user = api.getCurrentUser();
      const token = localStorage.getItem('authToken');
      console.log('=== PROFILE FETCH DEBUG ===');
      console.log('Current user from api.getCurrentUser():', user);
      console.log('Auth token exists:', !!token);
      console.log('User ID value:', user?.id);
      console.log('User ID type:', typeof user?.id);

      if (!user || !user.id) {
        console.error('User not authenticated or missing ID');
        setError('User not authenticated');
        router.push('/login');
        return;
      }

      console.log('Calling API: /api/User/user-profile/' + user.id);
      const response = await wheelboardApi.user.getUserProfile(user.id);
      console.log('Profile API response:', response);
      console.log('Response status:', response.success);
      console.log('Response data:', response.data);

      // WORKAROUND: If profile not found, it means complete-transport didn't create the user profile
      // This is a backend issue - complete-transport should create it automatically
      // For now, create a basic profile from the user data we have
      if (!response.success && response.message === 'Profile not found.') {
        console.warn(
          'Profile not found in database. Using data from localStorage as fallback.'
        );
        const fallbackProfile: CompanyProfile = {
          id: user.id,
          email: user.email || '',
          companyName: user.companyName || '',
          phoneNumber: user.mobileNo || '',
          whatsappNumber: user.mobileNo || '',
          businessCategory: user.businessCategory || 'Transport',
          userType: user.userType,
          businessAddress: '',
          city: '',
          state: '',
          zipCode: '',
          gstNumber: '',
          fleetSize: 0,
          operatingRegions: [],
          description: '',
          logo: '/profile.png',
          website: '',
          rating: 0,
          createdAt: user.createdAt || new Date().toISOString(),
        };

        setProfile(fallbackProfile);
        setEditedProfile(fallbackProfile);
        setLogoPreview(fallbackProfile.logo || null);
        setError(
          'Profile data not fully loaded. Please complete your profile to see all details.'
        );
        return;
      }

      if (response.success && response.data) {
        const userData = response.data as {
          userId?: string;
          email?: string;
          companyName?: string;
          mobileNo?: string;
          businessCategory?: string;
          userType?: string;
          address?: string;
          city?: string;
          state?: string;
          zipCode?: string;
          gstNumber?: string;
          fleetSize?: number | string;
          operatingRegions?: string[];
          description?: string;
          companyLogo?: string;
          companyLogoPath?: string;
          website?: string;
          rating?: number;
          createdAt?: string;
          firstName?: string;
          lastName?: string;
          fullName?: string;
        };
        console.log('Profile data received:', userData);

        // Map API response to CompanyProfile interface
        const profileData: CompanyProfile = {
          id: userData.userId || user.id,
          email: userData.email || user.email || '',
          companyName: userData.companyName || user.companyName || '',
          phoneNumber: userData.mobileNo || user.mobileNo || '',
          whatsappNumber: userData.mobileNo || user.mobileNo || '',
          businessCategory:
            userData.businessCategory || user.businessCategory || 'Transport',
          userType: userData.userType || user.userType || 'company',
          businessAddress: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zipCode: userData.zipCode || '',
          gstNumber: userData.gstNumber || '',
          fleetSize:
            typeof userData.fleetSize === 'string'
              ? parseInt(userData.fleetSize) || 0
              : userData.fleetSize || 0,
          operatingRegions: userData.operatingRegions || [],
          description: userData.description || '',
          logo:
            userData.companyLogoPath || userData.companyLogo || '/profile.png',
          website: userData.website || '',
          rating: userData.rating || 0,
          createdAt: userData.createdAt || new Date().toISOString(),
        };

        setProfile(profileData);
        setEditedProfile(profileData);
        setLogoPreview(profileData.logo || null);
      } else {
        // If API returns success but no data, show error
        setError('Profile data not found. Please complete your profile.');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch referrals
  const fetchReferrals = async () => {
    try {
      setIsLoadingReferrals(true);
      const user = api.getCurrentUser();

      if (!user?.id) return;

      const response = await wheelboardApi.user.getReferralsByUserId(user.id);
      console.log('Referrals response:', response);

      if (response.success && response.data) {
        const referralsData = Array.isArray(response.data) ? response.data : [];
        setReferrals(referralsData as Referral[]);
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
    } finally {
      setIsLoadingReferrals(false);
    }
  };

  // Submit new referral
  const handleSubmitReferral = async () => {
    if (!referralForm.fullName || !referralForm.mobileNumber) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setIsSubmittingReferral(true);
      const user = api.getCurrentUser();

      if (!user?.id) {
        alert('User not authenticated');
        return;
      }

      const referralData = {
        referralId: crypto.randomUUID(),
        createdBy: user.id,
        partnerId: user.partnerId || undefined,
        userId: user.id,
        fullName: referralForm.fullName,
        mobileNumber: referralForm.mobileNumber,
        email: referralForm.email,
        role: referralForm.role,
        location: referralForm.location,
        notifyOnAcceptance: referralForm.notifyOnAcceptance,
        referralStatus: 'Pending',
      };

      const response = await wheelboardApi.user.saveReferral(referralData);

      if (response.success) {
        alert('Referral submitted successfully!');
        setShowReferralModal(false);
        setReferralForm({
          fullName: '',
          mobileNumber: '',
          email: '',
          role: 'Driver',
          location: '',
          notifyOnAcceptance: true,
        });
        // Refresh referrals list
        await fetchReferrals();
      } else {
        alert(response.message || 'Failed to submit referral');
      }
    } catch (err: any) {
      console.error('Error submitting referral:', err);
      alert('Failed to submit referral. Please try again.');
    } finally {
      setIsSubmittingReferral(false);
    }
  };

  const getReferralStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: CheckCircle2,
        };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock };
      case 'rejected':
      case 'declined':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock };
    }
  };

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
      setLogoFile(file);
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
    if (!editedProfile) return;

    try {
      setIsSaving(true);
      setError(null);

      const user = api.getCurrentUser();
      console.log('Current user for save:', user);

      if (!user || !user.id) {
        console.error('User not authenticated or missing ID');
        setError('User not authenticated');
        return;
      }

      // Prepare data object for API (buildFormData will be called internally)
      const updateData: {
        UserId: string;
        CompanyName: string;
        FullName: string;
        Email: string;
        Location: string;
        FleetSize: number;
        GSTNumber: string;
        CompanyLogo?: File;
      } = {
        UserId: user.id,
        CompanyName: editedProfile.companyName || '',
        FullName: editedProfile.companyName || '', // API expects FullName
        Email: editedProfile.email || '',
        Location: `${editedProfile.businessAddress || ''}, ${editedProfile.city || ''}, ${editedProfile.state || ''}`,
        FleetSize: editedProfile.fleetSize || 0,
        GSTNumber: editedProfile.gstNumber || '',
      };

      // Add logo file if changed
      if (logoFile) {
        updateData.CompanyLogo = logoFile;
      }

      console.log('Updating profile with data:', updateData);
      const response =
        await wheelboardApi.user.updateTransportProfile(updateData);
      console.log('Update profile API response:', response);

      if (response.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        setLogoFile(null);

        // Refresh profile data from server
        await fetchProfile();

        alert('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  // Switch user to the professional profile (simple client-side navigation)
  const handleSwitchProfile = () => {
    router.push('/professional/profile');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#f36969] border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 rounded-xl bg-[#f36969] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#f36565]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !editedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">
            No profile data available
          </p>
          <button
            onClick={fetchProfile}
            className="mt-4 rounded-xl bg-[#f36969] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#f36565]"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

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
                  Manage your company profile and referrals
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {activeTab === 'profile' && !isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditToggle}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 sm:flex-initial"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </motion.button>
              ) : activeTab === 'profile' && isEditing ? (
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
              ) : activeTab === 'referrals' ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReferralModal(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 sm:flex-initial"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Referral
                </motion.button>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 rounded-xl bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#f36969] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Truck className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'referrals'
                ? 'bg-[#f36969] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4" />
            Referrals
            {referrals.length > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === 'referrals'
                    ? 'bg-white/20'
                    : 'bg-[#f36969] text-white'
                }`}
              >
                {referrals.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'profile' ? (
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
                          alt="Company Logo"
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/profile-pic.png';
                          }}
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
                      {profile.rating !== undefined && profile.rating > 0 && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">
                              {profile.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500">/ 5</span>
                          </div>
                        </div>
                      )}
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
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-600">
                            Fleet Size
                          </p>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editedProfile.fleetSize || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  'fleetSize',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="mt-1 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-bold transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                              min="0"
                            />
                          ) : (
                            <p className="text-xl font-bold text-gray-900">
                              {editedProfile.fleetSize} Vehicles
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Operating Regions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {editedProfile.operatingRegions?.map(
                          (region, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                            >
                              {region}
                            </span>
                          )
                        )}
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
                      <p className="text-xs font-semibold text-gray-500">
                        Phone
                      </p>
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
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-500">
                        GST Number
                      </p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.gstNumber || ''}
                          onChange={(e) =>
                            handleInputChange('gstNumber', e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-bold transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                          placeholder="Enter GST Number"
                        />
                      ) : (
                        <p className="mt-1 truncate text-sm font-bold text-gray-900">
                          {profile.gstNumber || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <Calendar className="h-5 w-5 shrink-0 text-gray-600" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-500">
                        Member Since
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-gray-900">
                        {new Date(profile.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Referrals Tab Content */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Referrals Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {referrals.length}
                    </p>
                    <p className="text-sm text-gray-500">Total Referrals</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        referrals.filter(
                          (r) =>
                            r.status === 'Accepted' || r.status === 'accepted'
                        ).length
                      }
                    </p>
                    <p className="text-sm text-gray-500">Accepted</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        referrals.filter(
                          (r) =>
                            r.status === 'Pending' || r.status === 'pending'
                        ).length
                      }
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referrals List */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Your Referrals
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and track your referrals
                </p>
              </div>

              {loadingReferrals ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#f36969]" />
                </div>
              ) : referrals.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    No Referrals Yet
                  </h4>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Start referring professionals and drivers to earn rewards!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReferralModal(true)}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#f36969]/30"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Your First Referral
                  </motion.button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {referrals.map((referral, index) => (
                    <motion.div
                      key={referral.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-5 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f36969] to-[#f36565] text-lg font-bold text-white">
                          {referral.fullName?.charAt(0)?.toUpperCase() || 'R'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {referral.fullName}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {referral.mobileNumber}
                            </span>
                            {referral.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {referral.email}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              {referral.role || 'Professional'}
                            </span>
                            {referral.location && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                {referral.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getReferralStatusColor(referral.status)}`}
                        >
                          {referral.status || 'Pending'}
                        </span>
                        {referral.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Add Referral Modal */}
        <AnimatePresence>
          {showReferralModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowReferralModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
              >
                <div className="border-b border-gray-100 bg-gradient-to-r from-[#f36969] to-[#f36565] p-5">
                  <h3 className="text-lg font-bold text-white">
                    Add New Referral
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    Refer a professional or driver
                  </p>
                </div>

                <form onSubmit={handleSubmitReferral} className="space-y-4 p-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newReferral.fullName}
                      onChange={(e) =>
                        setNewReferral({
                          ...newReferral,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newReferral.mobileNumber}
                      onChange={(e) =>
                        setNewReferral({
                          ...newReferral,
                          mobileNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={newReferral.email}
                      onChange={(e) =>
                        setNewReferral({
                          ...newReferral,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newReferral.role}
                      onChange={(e) =>
                        setNewReferral({ ...newReferral, role: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      required
                    >
                      <option value="">Select a role</option>
                      <option value="Driver">Driver</option>
                      <option value="Professional">Professional</option>
                      <option value="Transport Company">
                        Transport Company
                      </option>
                      <option value="Service Provider">Service Provider</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={newReferral.location}
                      onChange={(e) =>
                        setNewReferral({
                          ...newReferral,
                          location: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifyOnAcceptance"
                      checked={newReferral.notifyOnAcceptance}
                      onChange={(e) =>
                        setNewReferral({
                          ...newReferral,
                          notifyOnAcceptance: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#f36969] focus:ring-[#f36969]"
                    />
                    <label
                      htmlFor="notifyOnAcceptance"
                      className="text-sm text-gray-700"
                    >
                      Notify me when referral is accepted
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowReferralModal(false)}
                      className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={submittingReferral}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#f36969]/30 disabled:opacity-50"
                    >
                      {submittingReferral ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Submit Referral
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
