'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAPI, BusinessRegistrationStep2 } from '@/lib/mockApi';

export default function BusinessRegisterPage() {
  const router = useRouter();
  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 data
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 data
  const [step2Data, setStep2Data] = useState<BusinessRegistrationStep2>({
    businessName: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    gstNumber: '',
    servicesOffered: [],
    businessType: [],
    description: '',
    website: '',
    // optional field used only in UI for WhatsApp number
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    whatsApp: '',
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Service types and business types options
  // NOTE: specific service & business type buttons for Step 2 are rendered inline (per design)

  // Handle Step 1 submission
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Basic validation
      if (!companyName || !phoneNumber || !password) {
        setMessageType('error');
        setMessage('Please fill in all required fields.');
        return;
      }

      if (password.length < 6) {
        setMessageType('error');
        setMessage('Password must be at least 6 characters long.');
        return;
      }

      // Move to step 2
      setCurrentStep(2);
      setStep2Data((prev) => ({
        ...prev,
        businessName: companyName,
        phone: phoneNumber,
      }));

      setMessage('');
    } catch {
      setMessageType('error');
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2 submission
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Validate required fields
      const requiredFields = [
        'businessName',
        'businessAddress',
        'city',
        'email',
        'description',
      ];
      const missingFields = requiredFields.filter(
        (field) => !step2Data[field as keyof BusinessRegistrationStep2]
      );

      if (missingFields.length > 0) {
        setMessageType('error');
        setMessage('Please fill in all required fields.');
        return;
      }

      if (step2Data.description.length > 400) {
        setMessageType('error');
        setMessage('Description must be 400 characters or less.');
        return;
      }

      // Validate GST number format if provided
      if (
        step2Data.gstNumber &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          step2Data.gstNumber
        )
      ) {
        setMessageType('error');
        setMessage('Please enter a valid GST number format.');
        return;
      }

      // Submit complete registration
      const result = await mockAPI.register({
        companyName,
        phoneNumber,
        password,
        businessCategory: 'service-provider',
        userType: 'business',
      });

      setMessageType(result.success ? 'success' : 'error');
      setMessage(result.message);

      if (result.success) {
        // Redirect to the appropriate home for the new account
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

  // Handle file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setMessageType('error');
      setMessage('Please upload only JPG or PNG files.');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessageType('error');
      setMessage('File size must be less than 2MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setStep2Data((prev) => ({ ...prev, logo: file }));
    setMessage('');
  };

  // Toggle service/business type selection
  const toggleSelection = (item: string, type: 'services' | 'business') => {
    setStep2Data((prev) => {
      const field = type === 'services' ? 'servicesOffered' : 'businessType';
      const currentList = prev[field];
      const updated = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];

      return { ...prev, [field]: updated };
    });
  };

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 font-poppins">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-200/30"></div>
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-pink-200/20"></div>
          <div className="absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-purple-300/20"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Clean Card Design */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              {/* Progress Indicator */}
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Register as Service Provider
                </h1>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
                  Step 1 of 2
                </span>
              </div>

              <p className="mb-8 text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-purple-500 hover:text-purple-600"
                >
                  Login
                </Link>
              </p>

              {/* Form */}
              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter Company Name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter your number"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Set Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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

                {/* Auto-filled Service Provider Category */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Business Category
                  </label>
                  <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600">
                    Service Provider (Auto-filled)
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

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 - Detailed Business Information
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 font-poppins">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-200/30"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-pink-200/20"></div>
        <div className="absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-purple-300/20"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Clean Card Design */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            {/* Progress Indicator */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">
                Business Information
              </h1>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600">
                Step 2 of 2
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleStep2Submit} className="space-y-6">
              {/* Business Information Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={step2Data.businessName}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter business name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={step2Data.email}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="business@example.com"
                    required
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Business Address *
                </label>
                <input
                  type="text"
                  value={step2Data.businessAddress}
                  onChange={(e) =>
                    setStep2Data((prev) => ({
                      ...prev,
                      businessAddress: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Enter complete business address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    value={step2Data.city}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="City"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    value={step2Data.state}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="State"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={step2Data.zipCode}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="ZIP"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={step2Data.phone}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    value={step2Data.website}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* GST Number */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  GST Number (Optional)
                </label>
                <input
                  type="text"
                  value={step2Data.gstNumber}
                  onChange={(e) =>
                    setStep2Data((prev) => ({
                      ...prev,
                      gstNumber: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="22AAAAA0000A1Z5"
                />
                <p className="text-xs text-gray-500">
                  Format: 15 characters (e.g., 22AAAAA0000A1Z5)
                </p>
              </div>

              {/* Services Offered (updated to match design) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  What kind of services do you offer? *
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Tyre Services',
                    'Vehicle Services',
                    'Tyre Retreader',
                    'Other',
                  ].map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleSelection(service, 'services')}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        step2Data.servicesOffered.includes(service)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Type (Dealer / Manufacturer / Service Provider) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Dealer', 'Manufacturer', 'Service Provider'].map(
                    (type) => {
                      const selected = step2Data.businessType.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            // ensure only Service Provider is preselected if not chosen
                            setStep2Data((prev) => {
                              const list = prev.businessType.includes(type)
                                ? prev.businessType.filter((i) => i !== type)
                                : [type];
                              return { ...prev, businessType: list };
                            });
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            selected
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Business Address / WhatsApp / Upload */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Business Address
                  </label>
                  <input
                    type="text"
                    value={step2Data.businessAddress}
                    onChange={(e) =>
                      setStep2Data((prev) => ({
                        ...prev,
                        businessAddress: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter full business address"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    WhatsApp (Optional)
                  </label>
                  {(() => {
                    // typed access to optional whatsApp
                    const whatsApp =
                      (step2Data as unknown as Record<string, string>)
                        .whatsApp || '';
                    return (
                      <input
                        type="tel"
                        value={whatsApp}
                        onChange={(e) =>
                          setStep2Data((prev) => ({
                            ...prev,
                            // store in a dynamic field so we don't change the interface shape
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            whatsApp: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        placeholder="WhatsApp number for updates"
                      />
                    );
                  })()}
                  <p className="text-xs text-gray-500">
                    We&apos;ll send updates to the number if provided.
                  </p>
                </div>
              </div>

              {/* Upload Business Logo (styled) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Upload Business Logo
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center rounded-md border border-dashed border-gray-300 px-4 py-3 hover:bg-gray-50">
                    <svg
                      className="mr-2 h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">Upload</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleLogoUpload}
                      className="sr-only"
                    />
                  </label>

                  <p className="text-xs text-gray-500">PNG or JPG, Max 2MB</p>

                  {logoPreview && (
                    <div className="h-16 w-16 overflow-hidden rounded-lg border-2 border-gray-200">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Business Description *
                </label>
                <textarea
                  value={step2Data.description}
                  onChange={(e) =>
                    setStep2Data((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Describe your business, services, and what makes you unique..."
                  required
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Minimum 50 characters</span>
                  <span
                    className={
                      step2Data.description.length > 400
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }
                  >
                    {step2Data.description.length}/400
                  </span>
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
              <div className="sticky bottom-0 bg-white pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-red-400 to-red-500 py-3 font-semibold text-white transition-all hover:from-red-500 hover:to-red-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
