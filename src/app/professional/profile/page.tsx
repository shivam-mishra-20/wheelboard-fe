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
  Save,
  LogOut,
  Camera,
  Calendar,
  Award,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  Download,
  Globe,
  Moon,
  Bell,
  MessageSquare,
  RefreshCw,
  CreditCard,
  ArrowLeft,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { wheelboardApi } from '@/lib/wheelboardApi';

interface ProfessionalProfile {
  id: string;
  email: string;
  fullName: string;
  fatherName?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  birthDate?: string;
  businessCategory: string;
  userType: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  experience?: string;
  skills?: string[];
  licenseNumber?: string;
  description?: string;
  avatar?: string;
  createdAt: string;
  membershipTier?: string;
  rating?: number;
  jobsCompleted?: number;
  availableToday?: boolean;
  kycProgress?: number;
  kycDocuments?: {
    aadharCard: 'verified' | 'pending' | 'missing';
    panCard: 'verified' | 'pending' | 'missing';
    drivingLicense: 'verified' | 'pending' | 'missing';
    bankAccount: 'verified' | 'pending' | 'missing';
    profilePhoto: 'verified' | 'pending' | 'missing';
  };
  preferences?: {
    language: string;
    darkTheme: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    whatsappNotifications: boolean;
  };
}

const ProfessionalProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] =
    useState<ProfessionalProfile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [darkTheme, setDarkTheme] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    acceptedReferrals: 0,
    pendingReferrals: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('🔍 Fetching professional profile...');

        // Get current user ID from localStorage
        const currentUser = localStorage.getItem('currentUser');
        const userId = currentUser
          ? JSON.parse(currentUser).id
          : 'af7b9574-67b7-4944-8bf5-78ff0c33aec9';

        console.log('👤 Using userId:', userId);

        // Fetch user profile from API
        const response = await fetch(
          `https://wheelboardapi.addonshareware.com/api/User/user-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Profile API Response:', data);

          // Map API response to ProfessionalProfile interface
          const apiProfile: ProfessionalProfile = {
            id: data.userId || userId,
            email: data.email || 'Not provided',
            fullName: data.name || 'Professional User',
            fatherName: data.fatherName || 'Not provided',
            phoneNumber: data.mobileNo || 'Not provided',
            whatsappNumber:
              data.whatsappNumber || data.mobileNo || 'Not provided',
            birthDate: data.dateOfBirth
              ? new Date(data.dateOfBirth).toISOString().split('T')[0]
              : undefined,
            businessCategory: data.professionalType || 'Driver',
            userType: data.userType?.toLowerCase() || 'professional',
            address: data.address || 'Not provided',
            city: data.city || 'Not provided',
            state: data.state || 'Not provided',
            zipCode: data.zipCode || '',
            experience: data.yearsOfExperience || 'Not specified',
            skills: data.skills || [],
            licenseNumber: data.licenseNumber || '',
            description: data.description || '',
            avatar: data.profileImagePath || '/profile.png',
            createdAt: data.createdAt || new Date().toISOString(),
            membershipTier: data.membershipTier || 'Standard Member',
            rating: data.rating || 0,
            jobsCompleted: data.jobsCompleted || 0,
            availableToday: data.availableToday || false,
            kycProgress: data.kycProgress || 0,
            kycDocuments: data.kycDocuments || {
              aadharCard: 'missing',
              panCard: 'missing',
              drivingLicense: 'missing',
              bankAccount: 'missing',
              profilePhoto: 'missing',
            },
            preferences: data.preferences || {
              language: 'English',
              darkTheme: false,
              smsNotifications: false,
              emailNotifications: false,
              whatsappNotifications: true,
            },
          };

          setProfile(apiProfile);
          setEditedProfile(apiProfile);
          setAvatarPreview(apiProfile.avatar || null);
          setDarkTheme(apiProfile.preferences?.darkTheme || false);
          setSmsNotifications(
            apiProfile.preferences?.smsNotifications || false
          );
          setEmailNotifications(
            apiProfile.preferences?.emailNotifications || false
          );
          setWhatsappNotifications(
            apiProfile.preferences?.whatsappNotifications || false
          );
          setLanguage(apiProfile.preferences?.language || 'English');

          // Fetch referrals for stats
          try {
            const referralsResponse =
              await wheelboardApi.user.getReferralsByUserId(userId);
            const referralsData: any[] =
              referralsResponse.success && referralsResponse.data
                ? Array.isArray(referralsResponse.data)
                  ? referralsResponse.data
                  : []
                : [];

            const acceptedCount = referralsData.filter((ref: any) => {
              const status = (ref.referralStatus || '').toUpperCase();
              return status === 'TRUE' || status === 'ACCEPTED';
            }).length;

            const pendingCount = referralsData.filter((ref: any) => {
              const status = (ref.referralStatus || '').toUpperCase();
              return (
                status !== 'TRUE' &&
                status !== 'ACCEPTED' &&
                status !== 'FALSE' &&
                status !== 'REJECTED'
              );
            }).length;

            setReferralStats({
              totalReferrals: referralsData.length,
              acceptedReferrals: acceptedCount,
              pendingReferrals: pendingCount,
            });
          } catch (error) {
            console.error('❌ Error fetching referrals:', error);
          }
        } else {
          console.error('❌ Failed to fetch profile:', response.statusText);
        }
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
      setAvatarPreview(profile?.avatar || null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    field: keyof ProfessionalProfile,
    value: string | string[]
  ) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file for upload
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        if (editedProfile) {
          setEditedProfile({
            ...editedProfile,
            avatar: reader.result as string,
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
      console.log('💾 Saving professional profile...');

      // Get current user ID
      const currentUser = localStorage.getItem('currentUser');
      const userId = currentUser
        ? JSON.parse(currentUser).id
        : editedProfile.id;

      // Parse experience to get years as number
      const yearsOfExperience = editedProfile.experience
        ? parseInt(editedProfile.experience.toString().replace(/\D/g, '')) || 0
        : 0;

      // Prepare the data matching the exact API format
      const updateData: any = {
        UserId: userId,
        FullName: editedProfile.fullName,
        FathersName: editedProfile.fatherName || '',
        YearsOfExperience: yearsOfExperience,
        BirthDate: editedProfile.birthDate
          ? new Date(editedProfile.birthDate).toISOString()
          : new Date().toISOString(),
        State: editedProfile.state || '',
        City: editedProfile.city || '',
      };

      // Add image file if available
      if (imageFile) {
        updateData.DriverImage = imageFile;
      }

      console.log('📦 Update data:', updateData);

      // Call the API
      const response =
        await wheelboardApi.user.updateProfessionalProfile(updateData);

      console.log('✅ Profile updated successfully:', response);

      if (response.success && response.data) {
        // Update profile with new image URL if provided
        if (response.data.imageUrl) {
          setEditedProfile({
            ...editedProfile,
            avatar: response.data.imageUrl,
          });
          setAvatarPreview(response.data.imageUrl);
        }

        setProfile(editedProfile);
        setIsEditing(false);
        setImageFile(null);

        alert(response.data.message || 'Profile updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile || !editedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#f36969] border-t-transparent"></div>
      </div>
    );
  }

  // Define arrays outside JSX for better readability
  const personalDetailsItems = [
    {
      icon: '👤',
      label: 'Name',
      value: editedProfile.fullName,
    },
    {
      icon: '👨',
      label: "Father's Name",
      value: editedProfile.fatherName,
    },
    {
      icon: Calendar,
      label: 'Date of Birth',
      value:
        editedProfile.birthDate &&
        new Date(editedProfile.birthDate).toLocaleDateString('en-GB'),
    },
    {
      icon: MapPin,
      label: 'Location',
      value: `${editedProfile.city}, ${editedProfile.state}`,
    },
    {
      icon: Briefcase,
      label: 'Experience',
      value: editedProfile.experience,
    },
  ];

  const contactItems = [
    {
      icon: Phone,
      label: 'Mobile',
      value: editedProfile.phoneNumber,
    },
    { icon: Mail, label: 'Email', value: editedProfile.email },
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      value: editedProfile.whatsappNumber,
    },
  ];

  const contactItemsMain = [
    {
      icon: Phone,
      label: 'Phone Number',
      field: 'phoneNumber',
      color: 'blue',
    },
    { icon: Mail, label: 'Email Address', field: 'email', color: 'purple' },
    {
      icon: MessageSquare,
      label: 'WhatsApp Number',
      field: 'whatsappNumber',
      color: 'green',
    },
  ];

  const workStats = [
    {
      icon: Briefcase,
      value: profile.jobsCompleted,
      label: 'Jobs Completed',
      color: 'gray',
      bg: 'gray-50',
    },
    {
      icon: Star,
      value: profile.rating && profile.rating > 0 ? profile.rating : 'N/A',
      label: 'Current Rating',
      color: 'yellow',
      bg: 'yellow-50',
    },
    {
      icon: CheckCircle,
      value: profile.availableToday ? 'Available' : 'Not Available',
      label: 'Status Today',
      color: profile.availableToday ? 'green' : 'gray',
      bg: profile.availableToday ? 'green-50' : 'gray-50',
    },
  ];

  const quickActions = [
    {
      icon: Gift,
      label: 'Referrals',
      path: '/professional/referrals',
      color: 'pink',
    },
    {
      icon: Award,
      label: 'Rewards',
      path: '/professional/rewards',
      color: 'yellow',
    },
    { icon: Phone, label: 'Contact Us', path: '#', color: 'gray' },
    { icon: RefreshCw, label: 'Sync Profile', path: '#', color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={() => router.push('/professional/home')}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#f36969]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-lg shadow-[#f36969]/30">
                <Star className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  My Profile
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your professional profile
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
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-md transition-all hover:border-gray-400 hover:shadow-lg sm:flex-initial"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/30 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/40 disabled:opacity-50 sm:flex-initial"
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
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 overflow-hidden rounded-2xl bg-white shadow-xl">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-[#f36969] to-[#f36565]">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                      <Image
                        src={avatarPreview || '/profile-pic.png'}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#f36969] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#f36565]">
                        <Camera className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-20">
                {/* Profile Info */}
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    {editedProfile.fullName}
                  </h2>
                  <span className="inline-block rounded-full bg-gradient-to-r from-[#f36969] to-[#f36565] px-4 py-1 text-xs font-bold text-white shadow-lg">
                    {editedProfile.businessCategory || 'Professional'}
                  </span>
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-base font-bold text-gray-900">
                      {editedProfile.rating && editedProfile.rating > 0
                        ? `${editedProfile.rating} / 5`
                        : 'No ratings yet'}
                    </span>
                  </div>
                </div>

                {/* KYC Banner */}
                <button
                  onClick={() => router.push('/professional/kyc')}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 transition-all hover:from-yellow-100 hover:to-yellow-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="h-6 w-6 text-yellow-600" />
                      <span className="text-left text-xs font-semibold text-gray-900">
                        Complete KYC to unlock full access
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-yellow-600" />
                  </div>
                </button>

                {/* Membership Tier */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 shadow-lg">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {editedProfile.membershipTier || 'Standard Member'}
                      </p>
                      <p className="text-xs text-gray-600">Premium Access</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/professional/rewards')}
                    className="text-xs font-bold text-[#f36969] hover:text-[#f36565]"
                  >
                    View Rewards
                  </button>
                </div>

                {/* Personal Details */}
                <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      Personal Details
                    </h3>
                    {!isEditing && (
                      <button
                        onClick={handleEditToggle}
                        className="text-xs font-bold text-[#f36969] hover:text-[#f36565]"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {personalDetailsItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                        {typeof item.icon === 'string' ? (
                          <span className="text-base">{item.icon}</span>
                        ) : (
                          <item.icon className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">
                          {item.label}
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                  <h3 className="mb-4 text-sm font-bold text-gray-900">
                    Contact Information
                  </h3>

                  {contactItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                        <item.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">
                          {item.label}
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {item.value}
                        </p>
                      </div>
                      {!isEditing && (
                        <button className="text-xs font-bold text-[#f36969] hover:text-[#f36565]">
                          Edit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 lg:col-span-2"
          >
            {/* Personal Information */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                Personal Information
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.fullName}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                    />
                  ) : (
                    <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900">
                      {profile.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Father&apos;s Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.fatherName || ''}
                      onChange={(e) =>
                        handleInputChange('fatherName', e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                    />
                  ) : (
                    <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900">
                      {profile.fatherName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile.birthDate || ''}
                      onChange={(e) =>
                        handleInputChange('birthDate', e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                    />
                  ) : (
                    <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900">
                      {profile.birthDate
                        ? new Date(profile.birthDate).toLocaleDateString(
                            'en-GB'
                          )
                        : 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    License Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.licenseNumber || ''}
                      onChange={(e) =>
                        handleInputChange('licenseNumber', e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                    />
                  ) : (
                    <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900">
                      {profile.licenseNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                Address Information
              </h3>
              {isEditing ? (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={editedProfile.address || ''}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
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
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#f36969]" />
                  <div className="text-sm text-gray-900">
                    <p className="mb-1 font-semibold">{profile.address}</p>
                    <p className="text-gray-600">
                      {profile.city}, {profile.state} - {profile.zipCode}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                Contact Information
              </h3>
              <div className="space-y-5">
                {contactItemsMain.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-${item.color}-50`}
                    >
                      <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-xs font-medium text-gray-500">
                        {item.label}
                      </p>
                      {isEditing ? (
                        <input
                          type={item.field === 'email' ? 'email' : 'text'}
                          value={
                            (editedProfile[
                              item.field as keyof ProfessionalProfile
                            ] as string) || ''
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item.field as keyof ProfessionalProfile,
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {
                            profile[
                              item.field as keyof ProfessionalProfile
                            ] as string
                          }
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Overview */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                Work Overview
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {workStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center rounded-xl bg-${stat.bg} p-6 transition-all hover:shadow-md`}
                  >
                    <stat.icon
                      className={`mb-3 h-10 w-10 ${
                        stat.color === 'yellow'
                          ? 'fill-yellow-400 text-yellow-400'
                          : `text-${stat.color}-600`
                      }`}
                    />
                    <p className="mb-1 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs font-medium text-gray-600">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete KYC Section */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Complete KYC
                </h3>
                <span className="text-sm text-red-500">Required</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📄</span>
                    <span className="text-sm font-medium text-gray-900">
                      Aadhar Card
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.kycDocuments?.aadharCard === 'verified' ? (
                      <>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Verified
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    ) : profile.kycDocuments?.aadharCard === 'pending' ? (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                        <XCircle className="h-3 w-3" /> Missing
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💳</span>
                    <span className="text-sm font-medium text-gray-900">
                      PAN Card
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.kycDocuments?.panCard === 'verified' ? (
                      <>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Verified
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    ) : profile.kycDocuments?.panCard === 'pending' ? (
                      <>
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          Pending
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                        <XCircle className="h-3 w-3" /> Missing
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🪪</span>
                    <span className="text-sm font-medium text-gray-900">
                      Driving License
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.kycDocuments?.drivingLicense === 'verified' ? (
                      <>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Verified
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    ) : profile.kycDocuments?.drivingLicense === 'pending' ? (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Pending
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                          <XCircle className="h-3 w-3" /> Missing
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏦</span>
                    <span className="text-sm font-medium text-gray-900">
                      Bank Account
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.kycDocuments?.bankAccount === 'verified' ? (
                      <>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Verified
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    ) : profile.kycDocuments?.bankAccount === 'pending' ? (
                      <>
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          Pending
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                        <XCircle className="h-3 w-3" /> Missing
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📷</span>
                    <span className="text-sm font-medium text-gray-900">
                      Profile Photo
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.kycDocuments?.profilePhoto === 'verified' ? (
                      <>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Verified
                        </span>
                        <Download className="h-4 w-4 cursor-pointer text-gray-400" />
                      </>
                    ) : profile.kycDocuments?.profilePhoto === 'pending' ? (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                        <XCircle className="h-3 w-3" /> Missing
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-gray-600">KYC Progress:</span>
                  <span className="font-semibold text-gray-900">
                    {profile.kycProgress}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${profile.kycProgress}%` }}
                  />
                </div>
                <button
                  onClick={() => router.push('/professional/kyc')}
                  className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Complete KYC Verification
                </button>
              </div>
            </div>

            {/* Platform Preferences Section */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                Platform Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Language
                    </span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Dark Theme
                    </span>
                  </div>
                  <button
                    onClick={() => setDarkTheme(!darkTheme)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      darkTheme ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        darkTheme ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      SMS Notifications
                    </span>
                  </div>
                  <button
                    onClick={() => setSmsNotifications(!smsNotifications)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      smsNotifications ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${smsNotifications ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Email Notifications
                    </span>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      emailNotifications ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        emailNotifications ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      WhatsApp Notifications
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setWhatsappNotifications(!whatsappNotifications)
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      whatsappNotifications ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        whatsappNotifications
                          ? 'translate-x-5'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription Plans Section */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                Subscription Plans
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => router.push('/professional/subscriptions')}
                  className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[#f36969]"
                >
                  <CreditCard className="mb-2 h-8 w-8 text-[#f36969]" />
                  <span className="text-sm font-semibold text-gray-900">
                    Starter
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/professional/subscriptions')}
                  className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-500"
                >
                  <CreditCard className="mb-2 h-8 w-8 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    Pro
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/professional/subscriptions')}
                  className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-purple-500"
                >
                  <CreditCard className="mb-2 h-8 w-8 text-purple-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    Enterprise
                  </span>
                </button>
              </div>
            </div>

            {/* Referrals Summary */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Your Referrals
                </h3>
                <button
                  onClick={() => router.push('/professional/referrals')}
                  className="flex items-center gap-1 text-sm font-semibold text-[#f36969] transition-colors hover:text-[#f36565]"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-4">
                  <Gift className="mb-2 h-8 w-8 text-pink-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {referralStats.totalReferrals}
                  </p>
                  <p className="text-xs font-medium text-gray-600">Total</p>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4">
                  <CheckCircle className="mb-2 h-8 w-8 text-green-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {referralStats.acceptedReferrals}
                  </p>
                  <p className="text-xs font-medium text-gray-600">Accepted</p>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
                  <XCircle className="mb-2 h-8 w-8 text-yellow-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {referralStats.pendingReferrals}
                  </p>
                  <p className="text-xs font-medium text-gray-600">Pending</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/professional/referrals')}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40"
              >
                Add New Referral
              </button>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      action.path !== '#' && router.push(action.path)
                    }
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 ${
                      action.color === 'gray'
                        ? 'border-gray-200 bg-white hover:bg-gray-50'
                        : `border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100`
                    } p-4 transition-all`}
                  >
                    <action.icon
                      className={`h-6 w-6 ${
                        action.color === 'gray'
                          ? 'text-gray-600'
                          : `text-${action.color}-600`
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        action.color === 'gray'
                          ? 'text-gray-900'
                          : `text-${action.color}-600`
                      }`}
                    >
                      {action.label}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => router.push('/')}
                  className="col-span-2 flex flex-col items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 transition-all hover:bg-red-100 sm:col-span-1"
                >
                  <LogOut className="h-6 w-6 text-red-600" />
                  <span className="text-xs font-semibold text-red-600">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* App Version Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>App v.1.3.2</p>
          <p className="mt-1">Terms & Conditions | Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfilePage;
