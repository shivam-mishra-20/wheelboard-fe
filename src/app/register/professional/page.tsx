'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api, saveAuthUser } from '@/lib/apiAdapter';
import { formatDateForApi } from '@/lib/userApi';

// Indian States and Cities Data
const statesAndCities: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Visakhapatnam',
    'Vijayawada',
    'Guntur',
    'Nellore',
    'Kurnool',
    'Tirupati',
    'Kakinada',
    'Rajahmundry',
  ],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
  Assam: [
    'Guwahati',
    'Silchar',
    'Dibrugarh',
    'Jorhat',
    'Nagaon',
    'Tinsukia',
    'Tezpur',
  ],
  Bihar: [
    'Patna',
    'Gaya',
    'Bhagalpur',
    'Muzaffarpur',
    'Purnia',
    'Darbhanga',
    'Bihar Sharif',
  ],
  Chhattisgarh: [
    'Raipur',
    'Bhilai',
    'Bilaspur',
    'Korba',
    'Durg',
    'Rajnandgaon',
  ],
  Goa: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  Gujarat: [
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Rajkot',
    'Bhavnagar',
    'Jamnagar',
    'Gandhinagar',
    'Anand',
  ],
  Haryana: [
    'Faridabad',
    'Gurgaon',
    'Panipat',
    'Ambala',
    'Yamunanagar',
    'Rohtak',
    'Hisar',
    'Karnal',
  ],
  'Himachal Pradesh': [
    'Shimla',
    'Dharamshala',
    'Solan',
    'Mandi',
    'Kullu',
    'Manali',
  ],
  Jharkhand: [
    'Ranchi',
    'Jamshedpur',
    'Dhanbad',
    'Bokaro',
    'Deoghar',
    'Hazaribagh',
  ],
  Karnataka: [
    'Bangalore',
    'Mysore',
    'Hubli',
    'Mangalore',
    'Belgaum',
    'Dharwad',
    'Tumkur',
    'Bellary',
  ],
  Kerala: [
    'Thiruvananthapuram',
    'Kochi',
    'Kozhikode',
    'Thrissur',
    'Kollam',
    'Palakkad',
    'Kannur',
  ],
  'Madhya Pradesh': [
    'Indore',
    'Bhopal',
    'Jabalpur',
    'Gwalior',
    'Ujjain',
    'Sagar',
    'Dewas',
    'Satna',
  ],
  Maharashtra: [
    'Mumbai',
    'Pune',
    'Nagpur',
    'Thane',
    'Nashik',
    'Aurangabad',
    'Solapur',
    'Amravati',
  ],
  Manipur: ['Imphal', 'Thoubal', 'Churachandpur', 'Bishnupur'],
  Meghalaya: ['Shillong', 'Tura', 'Nongstoin', 'Jowai'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
  Odisha: [
    'Bhubaneswar',
    'Cuttack',
    'Rourkela',
    'Berhampur',
    'Sambalpur',
    'Puri',
    'Balasore',
  ],
  Punjab: [
    'Ludhiana',
    'Amritsar',
    'Jalandhar',
    'Patiala',
    'Bathinda',
    'Mohali',
    'Pathankot',
  ],
  Rajasthan: [
    'Jaipur',
    'Jodhpur',
    'Kota',
    'Bikaner',
    'Ajmer',
    'Udaipur',
    'Bhilwara',
    'Alwar',
  ],
  Sikkim: ['Gangtok', 'Namchi', 'Geyzing', 'Mangan'],
  'Tamil Nadu': [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Tirunelveli',
    'Tiruppur',
    'Vellore',
  ],
  Telangana: [
    'Hyderabad',
    'Warangal',
    'Nizamabad',
    'Khammam',
    'Karimnagar',
    'Ramagundam',
  ],
  Tripura: ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar'],
  'Uttar Pradesh': [
    'Lucknow',
    'Kanpur',
    'Ghaziabad',
    'Agra',
    'Meerut',
    'Varanasi',
    'Allahabad',
    'Bareilly',
    'Noida',
  ],
  Uttarakhand: [
    'Dehradun',
    'Haridwar',
    'Roorkee',
    'Haldwani',
    'Rudrapur',
    'Nainital',
  ],
  'West Bengal': [
    'Kolkata',
    'Howrah',
    'Durgapur',
    'Asansol',
    'Siliguri',
    'Bardhaman',
    'Malda',
  ],
  'Andaman and Nicobar Islands': ['Port Blair', 'Car Nicobar', 'Diglipur'],
  Chandigarh: ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  Delhi: [
    'New Delhi',
    'North Delhi',
    'South Delhi',
    'East Delhi',
    'West Delhi',
    'Central Delhi',
  ],
  'Jammu and Kashmir': [
    'Srinagar',
    'Jammu',
    'Anantnag',
    'Baramulla',
    'Udhampur',
  ],
  Ladakh: ['Leh', 'Kargil'],
  Lakshadweep: ['Kavaratti', 'Agatti', 'Amini'],
  Puducherry: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
};

export default function ProfessionalRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stateName, setStateName] = useState('');
  const [city, setCity] = useState('');
  const [professionalType, setProfessionalType] = useState('Driver');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );

  // Get cities for selected state
  const availableCities = useMemo(() => {
    return stateName ? statesAndCities[stateName] || [] : [];
  }, [stateName]);

  // Reset city when state changes
  const handleStateChange = (newState: string) => {
    setStateName(newState);
    setCity(''); // Reset city when state changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await api.register({
        userType: 'professional',
        email: email,
        password: password,
        name: fullName,
        fatherName: fatherName,
        dateOfBirth: birthDate
          ? formatDateForApi(new Date(birthDate))
          : undefined,
        mobileNo: phoneNumber,
        phoneNumber: phoneNumber, // Backward compatibility with mock API
        state: stateName,
        city: city,
        professionalType: professionalType,
        businessCategory: professionalType, // Backward compatibility
        profileImage: profileImageFile || undefined,
        avatarDataUrl: avatarPreview || undefined, // For mock API
        fullName: fullName, // For mock API
        birthDate: birthDate, // For mock API
      });

      setMessageType(result.success ? 'success' : 'error');
      setMessage(result.message);

      if (result.success) {
        // Save user session if returned
        if (result.user) {
          saveAuthUser(result.user, result.token);
        }

        // Clear form on success
        setFullName('');
        setFatherName('');
        setBirthDate('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setStateName('');
        setCity('');
        setAvatarPreview(null);
        setProfileImageFile(null);

        // Redirect to login or role-specific home
        setTimeout(() => {
          if (result.user) {
            const redirectMap: Record<string, string> = {
              company: '/company/home',
              business: '/business/home',
              professional: '/professional/home',
            };
            const target = redirectMap[result.user.userType] || '/login';
            router.replace(target);
          } else {
            router.replace('/login');
          }
        }, 1500);
      }
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      setMessageType('error');
      setMessage(
        'Social login coming soon. Please complete the registration form.'
      );
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
      setMessageType('error');
      setMessage(
        'Social login coming soon. Please complete the registration form.'
      );
    } catch {
      setMessageType('error');
      setMessage('Facebook sign in failed. Please try again.');
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
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Clean Card Design */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2">
                <div className="rounded-full bg-gray-100 p-2.5">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Professional Registration
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Father Name
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="Enter father's name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="(+91) 98734 9864"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="your.email@example.com"
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
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Professional Type
                  </label>
                  <select
                    value={professionalType}
                    onChange={(e) => setProfessionalType(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  >
                    <option value="Driver">Driver</option>
                    <option value="Helper">Helper</option>
                    <option value="Technician">Technician</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  >
                    <option value="">Select state</option>
                    {Object.keys(statesAndCities)
                      .sort()
                      .map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                    disabled={!stateName}
                  >
                    <option value="">
                      {stateName ? 'Select city' : 'Select state first'}
                    </option>
                    {availableCities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Profile Image{' '}
                  <span className="text-gray-400">(JPG/PNG, max 2MB)</span>
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-3 transition-colors hover:border-gray-400 hover:bg-gray-100">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          return;
                        }
                        if (!['image/jpeg', 'image/png'].includes(file.type)) {
                          return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          return;
                        }
                        // Store the actual file for API upload
                        setProfileImageFile(file);
                        // Create preview
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
                      stroke="currentColor"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Choose File
                    </span>
                  </label>
                  {avatarPreview ? (
                    <div className="flex items-center gap-3 rounded-lg border-2 border-green-200 bg-green-50 px-4 py-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          Image uploaded
                        </p>
                        <p className="text-xs text-green-600">
                          Ready to submit
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-center">
                      <p className="text-sm text-gray-500">No image selected</p>
                    </div>
                  )}
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
                className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
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
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
