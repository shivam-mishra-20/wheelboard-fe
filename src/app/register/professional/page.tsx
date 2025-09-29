'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAPI } from '@/lib/mockApi';

export default function ProfessionalRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [stateName, setStateName] = useState('');
  const [city, setCity] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await mockAPI.register({
        companyName: fullName || 'Professional',
        phoneNumber,
        password: 'defaultpassword',
        businessCategory: 'professional',
        userType: 'professional',
        fullName,
        fatherName,
        birthDate,
        state: stateName,
        city,
        avatarDataUrl: avatarPreview || undefined,
      });

      setMessageType(result.success ? 'success' : 'error');
      setMessage(result.message);

      if (result.success) {
        // Clear form on success
        setFullName('');
        setFatherName('');
        setBirthDate('');
        setPhoneNumber('');
        setStateName('');
        setCity('');
        setAvatarPreview(null);

        // Redirect to role-specific home
        const redirectMap: Record<string, string> = {
          company: '/company/home',
          business: '/business/home',
          professional: '/professional/home',
        };
        const target = redirectMap[result.user?.userType || ''] || '/';
        router.replace(target);
      }
    } catch {
      setMessageType('error');
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await mockAPI.socialLogin('google');
      setMessageType(result.success ? 'success' : 'error');
      setMessage(result.message);

      if (result.success) {
        // social login returns an authenticated session in mockAPI
        const redirectMap: Record<string, string> = {
          company: '/company/home',
          business: '/business/home',
          professional: '/professional/home',
        };
        const target = redirectMap[result.user?.userType || ''] || '/';
        router.replace(target);
      }
    } catch {
      setMessageType('error');
      setMessage('Google sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await mockAPI.socialLogin('facebook');
      setMessageType(result.success ? 'success' : 'error');
      setMessage(result.message);

      if (result.success) {
        const redirectMap: Record<string, string> = {
          company: '/company/home',
          business: '/business/home',
          professional: '/professional/home',
        };
        const target = redirectMap[result.user?.userType || ''] || '/';
        router.replace(target);
      }
    } catch {
      setMessageType('error');
      setMessage('Facebook sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 font-poppins">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-pink-200/30"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-purple-200/20"></div>
        <div className="absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-pink-300/20"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Clean Card Design */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Register as Professional
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-orange-500 hover:text-orange-600"
                >
                  Login
                </Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Father name
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Enter father's name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Eg.(+91) 98734 9864"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Select State*
                    </label>
                    <select
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      required
                    >
                      <option value="">Select state</option>
                      <option value="state-1">State 1</option>
                      <option value="state-2">State 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Select City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      required
                    >
                      <option value="">Select City</option>
                      <option value="city-1">City 1</option>
                      <option value="city-2">City 2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Upload Driver Image* JPG/PNG, max 2MB
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center rounded-md border border-dashed border-gray-300 px-4 py-2 hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            return;
                          }
                          if (
                            !['image/jpeg', 'image/png'].includes(file.type)
                          ) {
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setAvatarPreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }}
                        className="sr-only"
                      />
                      <svg
                        className="mr-2 h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Upload
                    </label>
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-14 w-14 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-44 items-center justify-center rounded-md border border-gray-200 text-gray-400">
                        No Image Uploaded.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    messageType === 'success'
                      ? 'border border-green-200 bg-green-50 text-green-800'
                      : 'border border-red-200 bg-red-50 text-red-800'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-red-400 to-red-500 py-3 font-semibold text-white transition-all hover:from-red-500 hover:to-red-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>

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
          </div>
        </div>
      </div>
    </div>
  );
}
