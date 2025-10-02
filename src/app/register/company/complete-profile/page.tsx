'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAPI } from '../../../../lib/mockApi';

export default function CompleteCompanyProfile() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fleet, setFleet] = useState('');
  const [gst, setGst] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a company user session
      const result = await mockAPI.register({
        companyName,
        phoneNumber: phone,
        password: 'defaultpassword', // In real app, this would come from previous step
        businessCategory: 'transport',
        userType: 'company',
      });

      if (result.success) {
        // Navigate to company home - the Header will automatically update with new session
        router.replace('/company/home');
      } else {
        alert('Registration failed: ' + result.message);
        setIsSubmitting(false);
      }
    } catch {
      alert('An error occurred during registration');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 font-poppins">
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg lg:max-w-2xl">
          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Complete Your Profile
              </h1>
              <p className="text-sm text-gray-600">
                Fill in the details to complete your transport profile
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Avatar Section */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">Profile</div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 inline-flex cursor-pointer items-center rounded-full bg-red-100 p-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="sr-only"
                    />
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M15 5l7 7-7 7" />
                    </svg>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter Company name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your number"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your Address"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Fleet</label>
                <input
                  type="number"
                  value={fleet}
                  onChange={(e) => setFleet(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="No of Fleet Size"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Company GST (Optional)
                </label>
                <input
                  type="text"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Company GST (Optional)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#E66D00] py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-[#E66D00] hover:to-[#CC6100] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </div>
                ) : (
                  'Get in Now'
                )}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-red-500">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
