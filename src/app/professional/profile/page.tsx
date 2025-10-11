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
  MessageCircle,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [darkTheme, setDarkTheme] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const mockProfile: ProfessionalProfile = {
      id: '1',
      email: 'rohit.sharma@email.com',
      fullName: 'Rohit Sharma',
      fatherName: 'Jitendra Sharma',
      phoneNumber: '+91 98765 43210',
      whatsappNumber: '+91 98765 43210',
      birthDate: '1990-06-17',
      businessCategory: 'Heavy Vehicle Driver',
      userType: 'professional',
      address: 'Residential Colony, Driver Housing Sector 10',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      experience: '4 Years',
      skills: [
        'Heavy Vehicle Driving',
        'Long Distance Routes',
        'Safety Protocols',
      ],
      licenseNumber: 'DL-1420110012345',
      description:
        'Experienced professional driver with over 4 years in the transportation industry. Specialized in heavy vehicle operations and long-distance routes. Committed to safety, punctuality, and excellent service. Hold a valid commercial driving license and have a clean driving record.',
      avatar: '/profile.png',
      createdAt: '2024-02-01T10:00:00Z',
      membershipTier: 'Gold Member',
      rating: 4.7,
      jobsCompleted: 128,
      availableToday: true,
      kycProgress: 80,
      kycDocuments: {
        aadharCard: 'verified',
        panCard: 'pending',
        drivingLicense: 'missing',
        bankAccount: 'pending',
        profilePhoto: 'verified',
      },
      preferences: {
        language: 'English',
        darkTheme: false,
        smsNotifications: true,
        emailNotifications: false,
        whatsappNotifications: true,
      },
    };

    setProfile(mockProfile);
    setEditedProfile(mockProfile);
    setAvatarPreview(mockProfile.avatar || null);
    setDarkTheme(mockProfile.preferences?.darkTheme || false);
    setSmsNotifications(mockProfile.preferences?.smsNotifications || false);
    setEmailNotifications(mockProfile.preferences?.emailNotifications || false);
    setWhatsappNotifications(
      mockProfile.preferences?.whatsappNotifications || false
    );
    setLanguage(mockProfile.preferences?.language || 'English');
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
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsSaving(false);
    setIsEditing(false);
  };

  if (!profile || !editedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl scroll-smooth">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your professional profile and credentials
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditToggle}
                className="flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
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
                  className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-md transition-all hover:border-gray-400"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl">
              <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600">
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
                      <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-110">
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
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editedProfile.fullName}
                  </h2>
                  <button className="mt-2 rounded-full bg-red-500 px-4 py-1 text-xs font-semibold text-white">
                    Beta
                  </button>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {editedProfile.rating} / 5
                    </span>
                  </div>
                </div>

                {/* KYC Completion Banner */}
                <div className="mt-6 cursor-pointer rounded-lg bg-yellow-50 p-3 transition-all hover:bg-yellow-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span className="text-xs font-semibold text-gray-700">
                        Complete your KYC to unlock full access
                      </span>
                    </div>
                    <span className="text-lg">›</span>
                  </div>
                </div>

                {/* Gold Member Badge */}
                <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Gold Member
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    View Rewards
                  </button>
                </div>

                {/* Personal Details Section */}
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      Personal Details
                    </h3>
                    {!isEditing && (
                      <button
                        onClick={handleEditToggle}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-xs text-gray-600">👤</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.fullName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-xs text-gray-600">👨</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Father&apos;s Name
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.fatherName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <Calendar className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.birthDate
                            ? new Date(
                                editedProfile.birthDate
                              ).toLocaleDateString('en-GB')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <MapPin className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Address/Location
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.city}, {editedProfile.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <Briefcase className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Years of Experience
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.experience}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="mt-6">
                  <h3 className="mb-4 text-sm font-bold text-gray-900">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <Phone className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Mobile Number</p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.phoneNumber}
                        </p>
                      </div>
                      {!isEditing && (
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          Edit
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.email}
                        </p>
                      </div>
                      {!isEditing && (
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          Edit
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">WhatsApp Number</p>
                        <p className="text-sm font-medium text-gray-900">
                          {editedProfile.whatsappNumber}
                        </p>
                      </div>
                      {!isEditing && (
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6 pb-8">
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.fullName}
                        onChange={(e) =>
                          handleInputChange('fullName', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {profile.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Father&apos;s Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.fatherName || ''}
                        onChange={(e) =>
                          handleInputChange('fatherName', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {profile.fatherName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProfile.birthDate || ''}
                        onChange={(e) =>
                          handleInputChange('birthDate', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {profile.birthDate
                          ? new Date(profile.birthDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      License Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.licenseNumber || ''}
                        onChange={(e) =>
                          handleInputChange('licenseNumber', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {profile.licenseNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Address
                </h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={editedProfile.address || ''}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          value={editedProfile.city || ''}
                          onChange={(e) =>
                            handleInputChange('city', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          value={editedProfile.state || ''}
                          onChange={(e) =>
                            handleInputChange('state', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <p>{profile.address}</p>
                      <p className="mt-1">
                        {profile.city}, {profile.state}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500">Phone</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.phoneNumber}
                          onChange={(e) =>
                            handleInputChange('phoneNumber', e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {profile.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500">
                        Email Address
                      </p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) =>
                            handleInputChange('email', e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {profile.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Overview Section */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Work Overview
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6">
                    <Briefcase className="mb-2 h-8 w-8 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.jobsCompleted}
                    </p>
                    <p className="text-xs text-gray-500">Jobs Completed</p>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6">
                    <Star className="mb-2 h-8 w-8 fill-yellow-400 text-yellow-400" />
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.rating}
                    </p>
                    <p className="text-xs text-gray-500">Current Rating</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-6">
                    <CheckCircle className="mb-2 h-8 w-8 text-green-600" />
                    <p className="text-sm font-bold text-green-600">
                      Available Today
                    </p>
                  </div>
                </div>
              </div>

              {/* Complete KYC Section */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
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
                </div>
              </div>

              {/* Platform Preferences Section */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
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
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                          emailNotifications
                            ? 'translate-x-5'
                            : 'translate-x-0.5'
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
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Subscription Plans
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => router.push('/professional/subscriptions')}
                    className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-primary-500"
                  >
                    <CreditCard className="mb-2 h-8 w-8 text-primary-500" />
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

              {/* Quick Actions Section */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Quick Actions
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50">
                    <Phone className="mb-2 h-6 w-6 text-gray-600" />
                    <span className="text-xs font-medium text-gray-900">
                      Contact Us
                    </span>
                  </button>
                  <button className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50">
                    <RefreshCw className="mb-2 h-6 w-6 text-gray-600" />
                    <span className="text-xs font-medium text-gray-900">
                      Sync Profile
                    </span>
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="flex flex-col items-center rounded-lg border border-red-200 bg-red-50 p-4 transition-all hover:bg-red-100"
                  >
                    <LogOut className="mb-2 h-6 w-6 text-red-600" />
                    <span className="text-xs font-medium text-red-600">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Help Chat Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6"
        >
          <button className="flex items-center gap-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white shadow-xl transition-all hover:shadow-2xl">
            <MessageCircle className="h-5 w-5" />
            <div className="text-left">
              <p className="text-xs font-semibold">
                Having issues with your account?
              </p>
              <p className="text-xs opacity-90">Our team is here to help</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-600">
              Chat
            </span>
          </button>
        </motion.div>

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
