'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

export default function CompanyRegisterPage() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');

  // Step 1 fields
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');

  // Step 2 fields (for transport companies)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [fleetSize, setFleetSize] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );
  const router = useRouter();

  // Check if user is already logged in (incomplete profile)
  useEffect(() => {
    const user = api.getCurrentUser();
    if (user && user.id && user.userType === 'company') {
      // User already completed step 1, go to step 2
      setUserId(user.id);
      setEmail(user.email || '');
      setCompanyName(user.companyName || '');
      setPhoneNumber(user.mobileNo || '');
      // Normalize businessCategory to match API format (capital case)
      const normalizedCategory = user.businessCategory
        ? user.businessCategory.charAt(0).toUpperCase() +
          user.businessCategory.slice(1).toLowerCase()
        : 'Transport';
      setBusinessCategory(normalizedCategory);
      setStep(2);
    }
  }, []);

  // Handle category change and routing
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBusinessCategory(value);

    if (value === 'Service Provider') {
      // Redirect to business registration page for service providers
      router.push('/register/business');
    }
  };

  // Step 1: Company Signup
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await wheelboardApi.user.companySignup({
        companyName,
        mobileNo: phoneNumber,
        email,
        password,
        businessCategory,
      });

      console.log('Company signup response:', response);

      if (response.success) {
        const responseData = response.data as any;
        const userIdFromResponse = responseData?.userId || responseData?.UserId;

        if (userIdFromResponse) {
          setUserId(userIdFromResponse);
          setMessageType('success');
          setMessage('Account created! Please complete your profile.');

          // Move to step 2 for transport companies
          if (
            businessCategory === 'Transport' ||
            businessCategory.toLowerCase() === 'logistics & transport'
          ) {
            setTimeout(() => {
              setStep(2);
              setMessage('');
            }, 1000);
          } else {
            // For other categories, redirect to login
            setTimeout(() => {
              router.replace('/login');
            }, 1500);
          }
        } else {
          throw new Error('User ID not returned from server');
        }
      } else {
        throw new Error(
          response.message || 'Failed to create account. Please try again.'
        );
      }
    } catch (error: any) {
      setMessageType('error');
      setMessage(
        error?.response?.data?.message ||
          error.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Complete Transport Profile
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate email is present
    if (!email || email.trim() === '') {
      setMessageType('error');
      setMessage('Email is required. Please provide your email address.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('=== STEP 2 SUBMISSION DEBUG ===');
      console.log('UserId being sent:', userId);
      console.log('UserId type:', typeof userId);
      console.log('Email being sent:', email);
      console.log('Submitting complete transport with data:', {
        UserId: userId,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Address: address,
        FleetSize: parseInt(fleetSize),
        GSTNumber: gstNumber,
        HasLogo: !!companyLogo,
      });

      const response = await wheelboardApi.user.completeTransport({
        UserId: userId,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Address: address,
        FleetSize: parseInt(fleetSize),
        GSTNumber: gstNumber,
        CompanyLogo: companyLogo || undefined,
      });

      console.log('Complete transport response:', response);

      if (response.success) {
        setMessageType('success');
        setMessage('Profile completed successfully! Please login to continue.');

        // Clear any existing user data
        localStorage.removeItem('wheelboard_current_user');
        localStorage.removeItem('authToken');

        // Redirect to login page to authenticate and get proper token
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to complete profile');
      }
    } catch (error: any) {
      setMessageType('error');
      setMessage(
        error?.response?.data?.message ||
          error.message ||
          'Failed to complete profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in');
  };

  const handleFacebookSignIn = () => {
    console.log('Facebook sign in');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 font-poppins">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-200/30"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gray-300/20"></div>
        <div className="absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-blue-300/20"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Clean Card Design */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                {step === 1 ? 'Register as Company' : 'Complete Your Profile'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {step === 1 ? (
                  <>
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-orange-500 hover:text-orange-600"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <span>
                    Step 2 of 2 - Complete your transport company profile
                  </span>
                )}
              </p>
            </div>

            {/* Form */}
            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter Company Name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your number"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="company@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Set Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Create Your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
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
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Select Business Category
                  </label>
                  <select
                    value={businessCategory}
                    onChange={handleCategoryChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="">Select Business Category</option>
                    <option value="Transport">Transport</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`rounded-lg p-4 ${
                      messageType === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-orange-500 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Create Company Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleStep2Submit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter First Name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter Last Name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="company@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter Company Address"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Fleet Size
                  </label>
                  <input
                    type="number"
                    value={fleetSize}
                    onChange={(e) => setFleetSize(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Number of vehicles"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter GST Number"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCompanyLogo(e.target.files?.[0] || null)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`rounded-lg p-4 ${
                      messageType === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="w-1/3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 rounded-lg bg-orange-500 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Completing Profile...' : 'Complete Profile'}
                  </button>
                </div>
              </form>
            )}

            {/* Only show social login and divider on step 1 */}
            {step === 1 && (
              <>
                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">OR</span>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC04"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    onClick={handleFacebookSignIn}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="#1877F2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
