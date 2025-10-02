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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-poppins">
      {/* Minimal Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, #000 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center gap-6 p-6 lg:gap-8">
        {/* Demo Accounts Card
        <div className="hidden w-full max-w-sm lg:block">
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Demo Accounts
            </h2>
            <p className="mb-4 text-xs text-gray-500">
              Use any account below to test the application
            </p>
            <div className="space-y-3">
              {[
                {
                  type: 'Company',
                  email: 'john@transport.com',
                  role: 'Transport',
                  color: 'bg-gray-50 text-gray-700 border-gray-200',
                },
                {
                  type: 'Professional',
                  email: 'sarah@mining.com',
                  role: 'Mining Services',
                  color: 'bg-gray-50 text-gray-700 border-gray-200',
                },
                {
                  type: 'Business',
                  email: 'mike@parts.com',
                  role: 'Parts Supply',
                  color: 'bg-green-50 text-green-700 border-green-200',
                },
                {
                  type: 'Custom',
                  email: 'test@company.com',
                  role: 'Test Account',
                  color: 'bg-orange-50 text-orange-700 border-orange-200',
                },
                {
                  type: 'Demo',
                  email: 'demo@business.com',
                  role: 'Demo User',
                  color: 'bg-orange-50 text-[#FF7A00] border-orange-200',
                },
              ].map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password123');
                  }}
                  className="group w-full rounded-lg border bg-white p-3 text-left transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div
                        className={`mb-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${account.color}`}
                      >
                        {account.type}
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {account.email}
                      </p>
                      <p className="text-xs text-gray-500">{account.role}</p>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Password for all:</span>{' '}
                password123
              </p>
            </div>
          </div>
        </div> */}

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            {/* Logo Section */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-3">
                <Image
                  src="/Logo.png"
                  alt="Wheelboard Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
                <h1 className="font-poppins text-2xl font-bold">
                  <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                    Wheel
                  </span>
                  <span className="text-gray-800">board</span>
                </h1>
              </div>
              <p className="text-sm font-medium text-gray-500">
                Sign in to your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center text-gray-600 hover:text-gray-800">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-offset-0"
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
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
                className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
                className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
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
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Create Account
              </Link>
            </div>

            {/* Footer Text */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <button className="text-primary-600 hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-primary-600 hover:underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
