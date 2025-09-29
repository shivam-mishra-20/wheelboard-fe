'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAPI } from '@/lib/mockApi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await mockAPI.login({ email, password });

      setMessageType(result.success ? 'success' : 'error');
      setMessage(result.message);

      if (result.success && result.user) {
        // Redirect to role-specific home page
        const role = result.user.userType;
        const target =
          role === 'company'
            ? '/company/home'
            : role === 'business'
              ? '/business/home'
              : '/professional/home';

        // Small delay to show success message, then navigate
        setTimeout(() => {
          router.push(target);
        }, 800);
      }
    } catch {
      setMessageType('error');
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg font-poppins">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-secondary/20"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary-accent/10"></div>
        <div className="absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-primary-button/10"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Clean Card Design */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            {/* Logo Section */}
            <div className="mb-8 text-center">
              <div className="inline-block rounded-xl bg-primary-bg p-3">
                <Image
                  src="/Logo.svg"
                  alt="WheelBoard Logo"
                  width={60}
                  height={60}
                  className="mx-auto"
                />
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-primary-accent">
                WheelBoard
              </h1>
              <p className="mt-1 text-sm text-gray-600">Welcome back</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-button focus:outline-none focus:ring-2 focus:ring-primary-button/20"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-button focus:outline-none focus:ring-2 focus:ring-primary-button/20"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-300 text-primary-button focus:ring-primary-button"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-medium text-primary-button hover:text-primary-button/80"
                >
                  Forgot Password?
                </button>
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
                className="w-full rounded-lg bg-primary-button py-3 font-semibold text-white transition-colors hover:bg-primary-button/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">or</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const result = await mockAPI.socialLogin('google');
                    setMessageType(result.success ? 'success' : 'error');
                    setMessage(result.message);
                    if (result.success && result.user) {
                      const role = result.user.userType;
                      const target =
                        role === 'company'
                          ? '/company/home'
                          : role === 'business'
                            ? '/business/home'
                            : '/professional/home';
                      setTimeout(() => router.push(target), 800);
                    }
                  } catch {
                    setMessageType('error');
                    setMessage('Social login failed.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Registration Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register/professional"
                className="font-medium text-primary-button hover:text-primary-button/80 hover:underline"
              >
                Create Account
              </Link>
            </div>

            {/* Footer Text */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <button className="text-primary-button hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-primary-button hover:underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
