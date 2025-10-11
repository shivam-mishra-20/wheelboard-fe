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
  Globe,
  Hash,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BusinessProfile {
  id: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  businessCategory: string;
  userType: string;
  businessName?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  gstNumber?: string;
  servicesOffered?: string[];
  businessType?: string[];
  description?: string;
  logo?: string;
  website?: string;
  createdAt: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<BusinessProfile | null>(
    null
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data
  useEffect(() => {
    // Mock profile data - in production, fetch from API
    const mockProfile: BusinessProfile = {
      id: '1',
      email: 'contact@techcorp.com',
      companyName: 'TechCorp Solutions',
      phoneNumber: '+91 98765 43210',
      whatsappNumber: '+91 98765 43210',
      businessCategory: 'Automobile Services',
      userType: 'business',
      businessName: 'TechCorp Solutions',
      businessAddress:
        '123 Business Park, Tech District Sector 15, Electronic City',
      city: 'Pune',
      state: 'Karnataka',
      zipCode: '560100',
      gstNumber: 'GST: 29AABCT1332L1Z',
      servicesOffered: ['Tyre Services', 'Vehicle Services'],
      businessType: ['Dealer', 'Manufacturer'],
      description:
        'TechCorp Solutions is a leading provider of automotive services and solutions. We specialize in comprehensive tyre services, vehicle maintenance, and advanced automotive technologies. With over 15 years of experience, our team of certified professionals is committed to delivering exceptional quality and customer satisfaction. Our state-of-the-art facilities ensure that every vehicle receives the highest standard of care across Karnataka.',
      logo: '/profile.png',
      website: 'www.techcorp.com',
      createdAt: '2024-01-15T10:00:00Z',
    };

    setProfile(mockProfile);
    setEditedProfile(mockProfile);
    setLogoPreview(mockProfile.logo || null);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edited profile to original
      setEditedProfile(profile);
      setLogoPreview(profile?.logo || null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    field: keyof BusinessProfile,
    value: string | string[]
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Implement logout logic
    router.push('/');
  };

  const handleSwitchProfile = () => {
    // Implement profile switch logic
    console.log('Switch Profile');
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
        {/* Header Section */}
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
                Manage your business profile and settings
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

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl">
              {/* Profile Header with Logo */}
              <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                      <Image
                        src={logoPreview || '/profile-pic.png'}
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
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-20">
                {/* Company Name */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editedProfile.companyName}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {editedProfile.gstNumber}
                  </p>
                </div>

                {/* Service Tags */}
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Services Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.servicesOffered?.map((service, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Business Type Tags */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.businessType?.map((type, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => router.push('/business/subscriptions')}
                    className="w-full rounded-lg bg-green-500 py-3 text-sm font-semibold text-white transition-all hover:bg-green-600"
                  >
                    View Subscription Plans
                  </button>
                  <button
                    onClick={handleSwitchProfile}
                    className="w-full rounded-lg border-2 border-red-500 bg-white py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
                  >
                    Switch Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6 pb-8">
              {/* Business Address Section */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Business Address
                </h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={editedProfile.businessAddress || ''}
                        onChange={(e) =>
                          handleInputChange('businessAddress', e.target.value)
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
                      <p>{profile.businessAddress}</p>
                      <p className="mt-1">
                        {profile.city}, {profile.state}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {/* Phone */}
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

                  {/* WhatsApp */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500">
                        WhatsApp
                      </p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.whatsappNumber || ''}
                          onChange={(e) =>
                            handleInputChange('whatsappNumber', e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {profile.whatsappNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
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

                  {/* Website */}
                  {(isEditing || profile.website) && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                        <Globe className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">
                          Website
                        </p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.website || ''}
                            onChange={(e) =>
                              handleInputChange('website', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">
                            {profile.website}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Description
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile.description || ''}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell us about your business..."
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-gray-600">
                    {profile.description || 'No description available'}
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Additional Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                    <Hash className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        GST Number
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.gstNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Member Since
                      </p>
                      <p className="text-sm font-medium text-gray-900">
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
