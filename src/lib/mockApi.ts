// Mock data and API simulation
export interface User {
  id: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  businessCategory: string;
  userType: 'professional' | 'company' | 'business';
  // Optional avatar/data URL for profile display
  avatar?: string | null;
  createdAt: string;
}

// Bid-related types
export interface Bidder {
  id: string;
  name: string;
  avatar: string;
  rating: number; // 0-5
  totalTrips: number;
  isVerified: boolean;
  experience: string;
  phoneNumber: string;
}

export interface TripBid {
  id: string;
  tripId: string;
  bidder: Bidder;
  bidAmount: number;
  proposedDuration: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  companyName: string;
  phoneNumber: string;
  password: string;
  businessCategory: string;
  userType: 'professional' | 'company' | 'business';
  // Optional professional-specific fields
  fullName?: string;
  fatherName?: string;
  birthDate?: string;
  state?: string;
  city?: string;
  avatarDataUrl?: string;
}

export interface BusinessRegistrationStep2 {
  businessName: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
  gstNumber?: string;
  servicesOffered: string[];
  businessType: string[];
  description: string;
  logo?: File;
  website?: string;
}

export interface ExtendedBusinessData extends RegisterData {
  step2Data?: BusinessRegistrationStep2;
}

// Mock users database - using a function to get mutable array
const getMockUsers = (): User[] => {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage to persist data
    const stored = localStorage.getItem('wheelboard_users');
    if (stored) {
      return JSON.parse(stored);
    }
  }

  // Default users
  return [
    {
      id: '1',
      email: 'john@transport.com',
      companyName: 'John Transport Co.',
      phoneNumber: '+1234567890',
      businessCategory: 'transport',
      userType: 'company',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      email: 'sarah@mining.com',
      companyName: 'Sarah Mining Services',
      phoneNumber: '+1234567891',
      businessCategory: 'mining',
      userType: 'professional',
      createdAt: '2024-01-16T14:30:00Z',
    },
    {
      id: '3',
      email: 'mike@parts.com',
      companyName: 'Mike Parts Supply',
      phoneNumber: '+1234567892',
      businessCategory: 'parts-supplier',
      userType: 'business',
      createdAt: '2024-01-17T09:15:00Z',
    },
    {
      id: '4',
      email: 'test@company.com',
      companyName: 'Test Company',
      phoneNumber: '+1234567893',
      businessCategory: 'transport',
      userType: 'company',
      createdAt: '2024-01-18T11:00:00Z',
    },
    {
      id: '5',
      email: 'demo@business.com',
      companyName: 'Demo Business',
      phoneNumber: '+1234567894',
      businessCategory: 'service-provider',
      userType: 'business',
      createdAt: '2024-01-19T13:45:00Z',
    },
  ];
};

const saveMockUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wheelboard_users', JSON.stringify(users));
  }
};

// Simulated API delay
const simulateDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// This section is now handled by the extended mockAPI below

// Helper functions for form validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// User session management
export interface UserSession {
  user: User;
  isAuthenticated: boolean;
  profileImage: string;
  navigationLinks: NavigationLink[];
}

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
}

// Get current user session from localStorage
const getCurrentSession = (): UserSession | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wheelboard_session');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return null;
};

// Save current user session to localStorage
const saveCurrentSession = (session: UserSession) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wheelboard_session', JSON.stringify(session));
  }
};

// Clear current user session
const clearCurrentSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('wheelboard_session');
  }
};

// Get navigation links based on user type
const getNavigationLinks = (
  userType: 'professional' | 'company' | 'business'
): NavigationLink[] => {
  switch (userType) {
    case 'company':
      return [
        { id: 'home', label: 'Home', href: '/company/home' },
        { id: 'fleet', label: 'Fleet', href: '/company/fleet' },
        { id: 'trips', label: 'Trips', href: '/company/trips' },
        { id: 'feeds', label: 'Feeds', href: '/company/feeds' },
        { id: 'jobs', label: 'Jobs', href: '/company/jobs' },
        { id: 'profile', label: 'Profile', href: '/company/profile' },
      ];
    case 'business':
      return [
        { id: 'home', label: 'Home', href: '/business/home' },
        { id: 'listings', label: 'Listings', href: '/business/listings' },
        { id: 'feeds', label: 'Feeds', href: '/business/feeds' },
        { id: 'jobs', label: 'Jobs', href: '/business/jobs' },
        { id: 'profile', label: 'Profile', href: '/business/profile' },
      ];
    case 'professional':
      return [
        { id: 'home', label: 'Home', href: '/professional/home' },
        { id: 'search', label: 'Search', href: '/professional/search' },
        { id: 'trips', label: 'Trips', href: '/professional/trips' },
        { id: 'feeds', label: 'Feeds', href: '/professional/feeds' },
        { id: 'jobs', label: 'Jobs', href: '/professional/jobs' },
        { id: 'profile', label: 'Profile', href: '/professional/profile' },
      ];
    default:
      return [];
  }
};

// Get profile image based on user type
const getProfileImage = (
  userType: 'professional' | 'company' | 'business'
): string => {
  switch (userType) {
    case 'company':
      return '/profile.png';
    case 'business':
      return 'profile.png';
    case 'professional':
      return 'profile.png';
    default:
      return '/profile.png';
  }
};

// Extended mockAPI with session management
export const mockAPI = {
  // ... existing methods ...

  // Login user
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    message: string;
  }> {
    await simulateDelay();

    const users = getMockUsers();
    const user = users.find((u: User) => u.email === credentials.email);

    if (!user) {
      return {
        success: false,
        message:
          'User not found. Please check your email or create an account.',
      };
    }

    // For demo purposes, accept "password123" for all accounts
    // In a real app, we'd verify the password hash
    if (
      credentials.password !== 'password123' &&
      credentials.password.length < 6
    ) {
      return {
        success: false,
        message: 'Invalid password. Try "password123" for demo accounts.',
      };
    }

    // Create user session
    const session: UserSession = {
      user,
      isAuthenticated: true,
      profileImage: getProfileImage(user.userType),
      navigationLinks: getNavigationLinks(user.userType),
    };

    saveCurrentSession(session);

    return {
      success: true,
      user,
      message: 'Login successful!',
    };
  },

  // Register new user
  async register(data: RegisterData): Promise<{
    success: boolean;
    user?: User;
    message: string;
  }> {
    await simulateDelay();

    // Check if user already exists
    const users = getMockUsers();
    const existingUser = users.find(
      (u: User) => u.email === data.companyName + '@example.com'
    );

    if (existingUser) {
      return {
        success: false,
        message: 'A user with this company name already exists.',
      };
    }

    // Validate phone number
    if (data.phoneNumber.length < 10) {
      return {
        success: false,
        message: 'Please enter a valid phone number.',
      };
    }

    // Validate password
    if (data.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.',
      };
    }

    // Create new user (include optional professional fields)
    const newUser: User = {
      id: Date.now().toString(),
      email:
        data.companyName.toLowerCase().replace(/\s+/g, '') + '@example.com',
      companyName: data.companyName,
      phoneNumber: data.phoneNumber,
      businessCategory: data.businessCategory,
      userType: data.userType,
      // store avatar if provided
      avatar: data.avatarDataUrl || null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveMockUsers(users);

    // Create user session
    const session: UserSession = {
      user: newUser,
      isAuthenticated: true,
      profileImage: newUser.avatar || getProfileImage(newUser.userType),
      navigationLinks: getNavigationLinks(newUser.userType),
    };

    saveCurrentSession(session);

    return {
      success: true,
      user: newUser,
      message: 'Registration successful! Welcome to WheelBoard.',
    };
  },

  // Get current user session
  getCurrentSession(): UserSession | null {
    return getCurrentSession();
  },

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    await simulateDelay(500);
    clearCurrentSession();
    return {
      success: true,
      message: 'Logged out successfully!',
    };
  },

  // Simulate login for different user types (for testing)
  async simulateLogin(
    userType: 'professional' | 'company' | 'business'
  ): Promise<{
    success: boolean;
    user?: User;
    message: string;
  }> {
    await simulateDelay(500);

    const users = getMockUsers();
    const user = users.find((u) => u.userType === userType);

    if (!user) {
      return {
        success: false,
        message: `No ${userType} user found in mock data.`,
      };
    }

    // Create user session
    const session: UserSession = {
      user,
      isAuthenticated: true,
      profileImage: getProfileImage(user.userType),
      navigationLinks: getNavigationLinks(user.userType),
    };

    saveCurrentSession(session);

    return {
      success: true,
      user,
      message: `Simulated login as ${userType} successful!`,
    };
  },

  // Get all users (for admin purposes)
  async getUsers(): Promise<User[]> {
    await simulateDelay(500);
    return getMockUsers();
  },

  // Social login simulation
  async socialLogin(provider: 'google' | 'facebook'): Promise<{
    success: boolean;
    user?: User;
    message: string;
  }> {
    await simulateDelay();

    // Simulate successful social login
    const socialUser: User = {
      id: Date.now().toString(),
      email: `user@${provider}.com`,
      companyName: `${provider} User Company`,
      phoneNumber: '+1234567999',
      businessCategory: 'general',
      userType: 'professional',
      createdAt: new Date().toISOString(),
    };

    // Create user session
    const session: UserSession = {
      user: socialUser,
      isAuthenticated: true,
      profileImage: getProfileImage(socialUser.userType),
      navigationLinks: getNavigationLinks(socialUser.userType),
    };

    saveCurrentSession(session);

    return {
      success: true,
      user: socialUser,
      message: `Successfully signed in with ${provider}!`,
    };
  },
};

// Business category options
export const businessCategories = {
  professional: [
    { value: 'mining', label: 'Mining' },
    { value: 'construction', label: 'Construction' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' },
  ],
  company: [
    { value: 'transport', label: 'Transport' },
    { value: 'service-provider', label: 'Service Provider' },
  ],
  business: [
    { value: 'parts-supplier', label: 'Parts Supplier' },
    { value: 'maintenance-services', label: 'Maintenance Services' },
    { value: 'fuel-supplier', label: 'Fuel Supplier' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'financing', label: 'Financing' },
    { value: 'logistics-support', label: 'Logistics Support' },
    { value: 'training-services', label: 'Training Services' },
    { value: 'other', label: 'Other' },
  ],
};

// Company Home Page Mock Data
export interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  experience: string;
  location: string;
  avatar?: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
}

export interface DetailedJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  image: string;
  createdAt: string;
  updatedAt?: string;
  status: 'Active' | 'Paused' | 'Closed';
  urgent?: boolean;
  applications: JobApplication[];
  views: number;
}

export interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
    userType: 'professional' | 'company' | 'business';
    id?: string;
    company?: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  timeAgo: string;
  likes: number;
  shares: number;
  comments: {
    id: string;
    author: {
      name: string;
      avatar: string;
      id?: string;
    };
    content: string;
    timestamp: string;
    timeAgo: string;
  }[];
  isLiked?: boolean;
  // Standardized category values used across the app
  // Keep values lowercase for consistency when matching/filtering
  category?: CategoryType;
  // Legacy fields for backward compatibility
  title?: string;
  description?: string;
}

// Unified category type used application-wide
export type CategoryType =
  | 'Promotions'
  | 'tip'
  | 'services'
  | 'question'
  | 'general';

export interface VehicleTrip {
  id: string;
  route: string;
  date: string;
  distance?: string;
  duration?: string;
}

export interface VehicleMetrics {
  avgRun: number; // in KM
  tripEfficiency: number; // in Rs per KM
  monthlyUsage: number; // in KM
  costPerKM: number; // in Rs
}

export interface Vehicle {
  id: string;
  name: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  status: string;
  fuelType?: string;
  capacity?: string;
  mileage?: string;
  lastService?: string;
  location: string;
  image: string;
  // New fields for desktop design
  statusBadge: 'Assigned' | 'Available' | 'In Transit';
  ownership: 'Owned' | 'Attached'; // Ownership type of the vehicle
  onTrip?: boolean; // Whether the vehicle is currently on a trip
  assignedDriver?: {
    id: string;
    name: string;
    avatar: string;
  };
  metrics: VehicleMetrics;
  recentTrips: VehicleTrip[];
  totalTrips: number;
  manufacturer?: string;
  // Lease fields
  isLeased?: boolean;
  lease?: {
    startDate: string;
    endDate: string;
    monthlyRun: number;
    odometerStart: number;
    odometerBookingOnLease: number;
    pricingModel: 'flat' | 'km-based';
    flatPricePerDay?: number;
    pricePerKm?: number;
    topEfficiency?: number;
    businessDays: number[];
    businessHoursStart: string;
    businessHoursEnd: string;
    additionalInstructions?: string;
  };
}

export interface DriverReview {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DriverPerformance {
  timelyDelivery: number;
  tripEfficiency: number;
  safety: number;
}

export interface Driver {
  id: string;
  name: string;
  experience: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  licenseNumber: string;
  phoneNumber: string;
  email?: string;
  rating: number;
  totalTrips: number;
  currentVehicle?: string;
  location: string;
  image: string;
  joinedDate: string;
  address?: string;
  emergencyContact?: string;
  statusBadge?: 'Hired' | 'Contract' | 'Freelance';
  performance: DriverPerformance;
  feedback?: string;
  reviews: DriverReview[];
  isFavorite?: boolean;
}

export interface Trip {
  id: string;
  title: string;
  status: 'Completed' | 'In-Process' | 'Upcoming';
  deliveryType:
    | 'Express Delivery'
    | 'Standard'
    | 'Bulk Transport'
    | 'Scheduled';
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalDate?: string;
  arrivalTime?: string;
  distance: string;
  duration: string;
  driver: {
    id: string;
    name: string;
    avatar?: string;
  };
  vehicle: {
    id: string;
    name: string;
    registrationNumber: string;
  };
  image: string;
  bids?: number;
  eta?: string;
  progress?: number; // percentage for in-process trips
  isAssigned?: boolean; // whether trip has been assigned to a driver
  createdAt: string;
}

// Service Listings (created by Business users)
export interface Service {
  id: string;
  businessId: string;
  businessName: string;
  businessAvatar?: string;
  serviceName: string;
  category:
    | 'maintenance'
    | 'parts-supply'
    | 'fuel'
    | 'insurance'
    | 'financing'
    | 'logistics-support'
    | 'training'
    | 'other';
  description: string;
  detailedDescription?: string;
  pricing: {
    type: 'fixed' | 'hourly' | 'quote-based' | 'subscription';
    amount?: number;
    currency?: string;
    details?: string;
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    coverage: string[]; // e.g., ['Pan India', 'North India']
    responseTime: string; // e.g., '< 2 hours', '24 hours'
  };
  rating: number;
  reviewCount: number;
  certifications?: string[];
  isVerified: boolean;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  images?: string[];
  featuredImage?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Service Assignment (Company assigns a service)
export interface ServiceAssignment {
  id: string;
  serviceId: string;
  service: Service;
  companyId: string;
  companyName: string;
  assignedDate: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requirements?: string;
  assignedTo?: {
    vehicleId?: string;
    driverId?: string;
  };
  cost?: number;
  notes?: string;
  lastUpdated: string;
}

// Service Enquiry (Company raises enquiry for a service)
export interface ServiceEnquiry {
  id: string;
  serviceId: string;
  service: Service;
  companyId: string;
  companyName: string;
  enquiryDate: string;
  status: 'pending' | 'responded' | 'closed' | 'converted';
  subject: string;
  message: string;
  response?: {
    message: string;
    respondedBy: string;
    respondedAt: string;
  };
  followUps?: {
    message: string;
    by: 'company' | 'business';
    timestamp: string;
  }[];
  priority: 'low' | 'medium' | 'high';
}

// Mock data for company home page
export const companyHomeData = {
  carouselSlides: [
    {
      id: 1,
      image: '/truck-01.jpg',
      alt: 'Professional truck transport services',
    },
    {
      id: 2,
      image: '/Yellow-truck.jpg',
      alt: 'Fleet management solutions',
    },
    {
      id: 3,
      image: '/mining-truck.jpg',
      alt: 'Logistics and transportation',
    },
    {
      id: 4,
      image: '/black-truck.png',
      alt: 'Commercial vehicle services',
    },
    { id: 5, image: '/Bus.jpg', alt: 'Live truck tracking' },
  ] as CarouselSlide[],

  recentJobs: [
    {
      id: 'job-1',
      title: 'Driver',
      description:
        'Lorem ipsum dolor Description part comes here dynamically as the company creates Jobs and posts online',
      image: '/staring-man.jpg',
      createdAt: '2025-09-26T10:30:00Z',
    },
    {
      id: 'job-2',
      title: 'Technician',
      description:
        'Lorem ipsum dolor Description part comes here dynamically as the company creates Jobs and posts online',
      image: '/excavator.jpg',
      createdAt: '2025-09-25T14:15:00Z',
    },
    {
      id: 'job-3',
      title: 'Logistics Manager',
      description:
        'Lorem ipsum dolor Description part comes here dynamically as the company creates Jobs and posts online',
      image: '/truck-01.jpg',
      createdAt: '2025-09-24T09:45:00Z',
    },
  ] as Job[],

  allJobs: [
    {
      id: 'job-1',
      title: 'Senior Fleet Manager',
      department: 'Operations',
      location: 'Mumbai, Maharashtra',
      type: 'Full-time',
      salary: '₹8,00,000 - ₹12,00,000/year',
      description:
        'Looking for an experienced fleet manager to oversee our growing transportation operations. Responsible for fleet optimization, driver management, and operational efficiency.',
      requirements: [
        '5+ years in fleet management',
        'Experience with GPS tracking systems',
        'Strong leadership skills',
        'Knowledge of transportation regulations',
      ],
      benefits: [
        'Health Insurance',
        'Performance Bonus',
        'Flexible Hours',
        'Professional Development',
      ],
      image: '/truck-01.jpg',
      createdAt: '2025-09-28T10:00:00Z',
      updatedAt: '2025-10-01T14:30:00Z',
      status: 'Active',
      urgent: true,
      views: 324,
      applications: [
        {
          id: 'app-1',
          candidateName: 'Rajesh Kumar',
          candidateEmail: 'rajesh.kumar@email.com',
          candidatePhone: '+91 98765 43210',
          experience: '8 years',
          location: 'Mumbai, Maharashtra',
          avatar: '/staring-man.jpg',
          appliedDate: '2025-09-29T09:15:00Z',
          status: 'shortlisted',
          coverLetter:
            'I am excited to apply for the Fleet Manager position. With 8 years of experience managing large fleets...',
        },
        {
          id: 'app-2',
          candidateName: 'Priya Singh',
          candidateEmail: 'priya.singh@email.com',
          candidatePhone: '+91 98765 43211',
          experience: '6 years',
          location: 'Mumbai, Maharashtra',
          avatar: '/profile.png',
          appliedDate: '2025-09-30T11:20:00Z',
          status: 'reviewed',
        },
        {
          id: 'app-3',
          candidateName: 'Amit Patel',
          candidateEmail: 'amit.patel@email.com',
          candidatePhone: '+91 98765 43212',
          experience: '5 years',
          location: 'Pune, Maharashtra',
          appliedDate: '2025-10-01T15:45:00Z',
          status: 'pending',
        },
      ],
    },
    {
      id: 'job-2',
      title: 'Heavy Vehicle Driver',
      department: 'Operations',
      location: 'Delhi, NCR',
      type: 'Full-time',
      salary: '₹35,000 - ₹45,000/month',
      description:
        'Seeking experienced heavy vehicle drivers for long-distance transportation. Must have clean driving record and flexibility for interstate travel.',
      requirements: [
        'Valid Heavy Vehicle License',
        'Minimum 3 years experience',
        'Clean driving record',
        'Interstate travel flexibility',
      ],
      benefits: [
        'Fuel Allowance',
        'Medical Coverage',
        'Overtime Pay',
        'Travel Allowance',
      ],
      image: '/staring-man.jpg',
      createdAt: '2025-09-25T08:00:00Z',
      status: 'Active',
      urgent: false,
      views: 567,
      applications: [
        {
          id: 'app-4',
          candidateName: 'Suresh Yadav',
          candidateEmail: 'suresh.yadav@email.com',
          candidatePhone: '+91 98765 43213',
          experience: '4 years',
          location: 'Delhi, NCR',
          avatar: '/staring-man.jpg',
          appliedDate: '2025-09-26T10:00:00Z',
          status: 'shortlisted',
        },
        {
          id: 'app-5',
          candidateName: 'Ramesh Verma',
          candidateEmail: 'ramesh.verma@email.com',
          candidatePhone: '+91 98765 43214',
          experience: '7 years',
          location: 'Noida, UP',
          appliedDate: '2025-09-27T14:30:00Z',
          status: 'reviewed',
        },
      ],
    },
    {
      id: 'job-3',
      title: 'Logistics Coordinator',
      department: 'Planning',
      location: 'Bangalore, Karnataka',
      type: 'Full-time',
      salary: '₹4,50,000 - ₹6,50,000/year',
      description:
        'Coordinate logistics operations, manage supply chain activities, and ensure timely deliveries. Work closely with drivers and customers.',
      requirements: [
        "Bachelor's degree preferred",
        'Logistics experience 2+ years',
        'Strong communication skills',
        'Computer proficiency',
      ],
      benefits: [
        'Career Growth',
        'Training Programs',
        'Health Benefits',
        'Team Environment',
      ],
      image: '/dashboard.png',
      createdAt: '2025-09-22T12:00:00Z',
      status: 'Active',
      urgent: false,
      views: 156,
      applications: [
        {
          id: 'app-6',
          candidateName: 'Sneha Reddy',
          candidateEmail: 'sneha.reddy@email.com',
          candidatePhone: '+91 98765 43215',
          experience: '3 years',
          location: 'Bangalore, Karnataka',
          avatar: '/profile.png',
          appliedDate: '2025-09-23T09:00:00Z',
          status: 'pending',
        },
      ],
    },
    {
      id: 'job-4',
      title: 'Maintenance Supervisor',
      department: 'Maintenance',
      location: 'Chennai, Tamil Nadu',
      type: 'Full-time',
      salary: '₹6,00,000 - ₹8,50,000/year',
      description:
        'Supervise vehicle maintenance operations, manage workshop staff, and ensure fleet readiness. Focus on preventive maintenance and cost optimization.',
      requirements: [
        'Mechanical engineering background',
        '4+ years supervisory experience',
        'Knowledge of vehicle systems',
        'Team management skills',
      ],
      benefits: [
        'Technical Training',
        'Performance Incentives',
        'Health Insurance',
        'Growth Opportunities',
      ],
      image: '/excavator.jpg',
      createdAt: '2025-09-20T10:00:00Z',
      status: 'Paused',
      urgent: false,
      views: 203,
      applications: [],
    },
    {
      id: 'job-5',
      title: 'Warehouse Manager',
      department: 'Logistics',
      location: 'Kolkata, West Bengal',
      type: 'Full-time',
      salary: '₹5,50,000 - ₹7,50,000/year',
      description:
        'Manage warehouse operations, inventory control, and coordinate with transportation team for efficient distribution.',
      requirements: [
        'Warehouse management experience 3+ years',
        'Inventory management systems knowledge',
        'Team leadership skills',
        'Problem-solving abilities',
      ],
      benefits: [
        'Medical Insurance',
        'Bonus Structure',
        'Paid Leave',
        'Career Development',
      ],
      image: '/network.png',
      createdAt: '2025-09-18T08:30:00Z',
      status: 'Active',
      urgent: false,
      views: 189,
      applications: [
        {
          id: 'app-7',
          candidateName: 'Arijit Das',
          candidateEmail: 'arijit.das@email.com',
          candidatePhone: '+91 98765 43216',
          experience: '5 years',
          location: 'Kolkata, West Bengal',
          appliedDate: '2025-09-19T11:00:00Z',
          status: 'reviewed',
        },
        {
          id: 'app-8',
          candidateName: 'Sanjay Ghosh',
          candidateEmail: 'sanjay.ghosh@email.com',
          candidatePhone: '+91 98765 43217',
          experience: '4 years',
          location: 'Howrah, West Bengal',
          appliedDate: '2025-09-20T16:20:00Z',
          status: 'pending',
        },
      ],
    },
  ] as DetailedJob[],

  popularFeeds: [
    {
      id: 'feed-1',
      author: {
        name: 'Delhi Transport',
        avatar: '/profile.png',
        initials: 'D',
      },
      title: 'Tips For Fleet Management',
      description:
        'Learn how to optimize your fleet operations and reduce maintenance costs effectively',
      image: '/image.png',
      timeAgo: 'Posted 2 days ago',
    },
    {
      id: 'feed-2',
      author: {
        name: 'Delhi Transport',
        avatar: '/profile.png',
        initials: 'D',
      },
      title: 'Tips For Fleet Management',
      description:
        'Learn how to optimize your fleet operations and reduce maintenance costs effectively',
      image: '/truck-01.jpg',
      timeAgo: 'Posted 2 days ago',
    },
    {
      id: 'feed-3',
      author: {
        name: 'Delhi Transport',
        avatar: '/profile.png',
        initials: 'D',
      },
      title: 'Tips For Fleet Management',
      description:
        'Learn how to optimize your fleet operations and reduce maintenance costs effectively',
      image: '/image.png',
      timeAgo: 'Posted 2 days ago',
    },
    {
      id: 'feed-4',
      author: {
        name: 'Delhi Transport',
        avatar: '/profile.png',
        initials: 'D',
      },
      title: 'Tips For Fleet Management',
      description:
        'Learn how to optimize your fleet operations and reduce maintenance costs effectively',
      image: '/image.png',
      timeAgo: 'Posted 2 days ago',
    },
  ] as FeedPost[],

  allTrips: [
    {
      id: 'trip-1',
      title: 'Trip to Chennai',
      status: 'Completed',
      deliveryType: 'Express Delivery',
      from: 'Hyderabad',
      to: 'Chennai',
      departureDate: '2025-10-01',
      departureTime: '08:00 AM',
      arrivalDate: '2025-10-01',
      arrivalTime: '06:30 PM',
      distance: '628 km',
      duration: '10h 30m',
      driver: {
        id: 'd1',
        name: 'Rajesh Kumar',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v1',
        name: 'Omni Van',
        registrationNumber: 'DL-01-AB-1234',
      },
      image: '/truck-01.jpg',
      createdAt: '2025-10-01T08:00:00Z',
    },
    {
      id: 'trip-2',
      title: 'Mumbai to Pune Delivery',
      status: 'Completed',
      deliveryType: 'Standard',
      from: 'Mumbai',
      to: 'Pune',
      departureDate: '2025-09-30',
      departureTime: '06:00 AM',
      arrivalDate: '2025-09-30',
      arrivalTime: '10:00 AM',
      distance: '148 km',
      duration: '4h',
      driver: {
        id: 'd2',
        name: 'Deepak Kumar',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v2',
        name: 'Tata',
        registrationNumber: 'MH-12-AB-1234',
      },
      image: '/Yellow-truck.jpg',
      createdAt: '2025-09-30T06:00:00Z',
    },
    {
      id: 'trip-3',
      title: 'Delhi to Jaipur Route',
      status: 'Completed',
      deliveryType: 'Bulk Transport',
      from: 'Delhi',
      to: 'Jaipur',
      departureDate: '2025-09-28',
      departureTime: '05:00 AM',
      arrivalDate: '2025-09-28',
      arrivalTime: '12:30 PM',
      distance: '280 km',
      duration: '7h 30m',
      driver: {
        id: 'd5',
        name: 'Manoj Verma',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v5',
        name: 'Ashok Leyland',
        registrationNumber: 'TS-05-IJ-7890',
      },
      image: '/mining-truck.jpg',
      bids: 5,
      createdAt: '2025-09-28T05:00:00Z',
    },
    {
      id: 'trip-4',
      title: 'Bangalore to Mysore',
      status: 'In-Process',
      deliveryType: 'Express Delivery',
      from: 'Bangalore',
      to: 'Mysore',
      departureDate: '2025-10-05',
      departureTime: '09:00 AM',
      distance: '143 km',
      duration: '3h 30m',
      driver: {
        id: 'd1',
        name: 'Rajesh Kumar',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v1',
        name: 'Omni Van',
        registrationNumber: 'DL-01-AB-1234',
      },
      image: '/black-truck.png',
      eta: '12:30 PM',
      progress: 65,
      isAssigned: true,
      createdAt: '2025-10-05T09:00:00Z',
    },
    {
      id: 'trip-5',
      title: 'Chennai to Bangalore',
      status: 'In-Process',
      deliveryType: 'Standard',
      from: 'Chennai',
      to: 'Bangalore',
      departureDate: '2025-10-05',
      departureTime: '07:00 AM',
      distance: '346 km',
      duration: '6h 30m',
      driver: {
        id: 'd2',
        name: 'Deepak Kumar',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v2',
        name: 'Tata',
        registrationNumber: 'MH-12-AB-1234',
      },
      image: '/red-truck.png',
      eta: '01:30 PM',
      progress: 45,
      createdAt: '2025-10-05T07:00:00Z',
    },
    {
      id: 'trip-6',
      title: 'Kolkata to Bhubaneswar',
      status: 'In-Process',
      deliveryType: 'Scheduled',
      from: 'Kolkata',
      to: 'Bhubaneswar',
      departureDate: '2025-10-05',
      departureTime: '06:30 AM',
      distance: '442 km',
      duration: '8h',
      driver: {
        id: 'd5',
        name: 'Manoj Verma',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v3',
        name: 'Mercedes-Benz',
        registrationNumber: 'CA-55-XY9782',
      },
      image: '/Bus.jpg',
      eta: '02:30 PM',
      progress: 30,
      createdAt: '2025-10-05T06:30:00Z',
    },
    {
      id: 'trip-7',
      title: 'Ahmedabad to Surat',
      status: 'Upcoming',
      deliveryType: 'Express Delivery',
      from: 'Ahmedabad',
      to: 'Surat',
      departureDate: '2025-10-06',
      departureTime: '08:00 AM',
      distance: '263 km',
      duration: '5h',
      driver: {
        id: 'd1',
        name: 'Rajesh Kumar',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v4',
        name: 'Tata LPT 1613',
        registrationNumber: 'CA-55-XY9782',
      },
      image: '/truck-01.jpg',
      bids: 8,
      isAssigned: true,
      createdAt: '2025-10-04T10:00:00Z',
    },
    {
      id: 'trip-8',
      title: 'Pune to Nashik',
      status: 'Upcoming',
      deliveryType: 'Standard',
      from: 'Pune',
      to: 'Nashik',
      departureDate: '2025-10-06',
      departureTime: '10:00 AM',
      isAssigned: true,
      distance: '210 km',
      duration: '4h 30m',
      driver: {
        id: 'd2',
        name: 'Deepak Kumar',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v2',
        name: 'Tata',
        registrationNumber: 'MH-12-AB-1234',
      },
      image: '/Yellow-truck.jpg',
      bids: 3,
      createdAt: '2025-10-04T11:00:00Z',
    },
    {
      id: 'trip-9',
      title: 'Hyderabad to Vijayawada',
      status: 'Upcoming',
      deliveryType: 'Bulk Transport',
      from: 'Hyderabad',
      to: 'Vijayawada',
      departureDate: '2025-10-07',
      departureTime: '07:00 AM',
      distance: '275 km',
      duration: '5h 30m',
      driver: {
        id: 'd5',
        name: 'Manoj Verma',
        avatar: '/staring-man.jpg',
      },
      vehicle: {
        id: 'v5',
        name: 'Ashok Leyland',
        registrationNumber: 'TS-05-IJ-7890',
      },
      image: '/mining-truck.jpg',
      isAssigned: true,
      createdAt: '2025-10-04T12:00:00Z',
    },
  ] as Trip[],
};

// Business Jobs Mock Data
export interface BusinessJobApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  experience: string;
  location: string;
  avatar?: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  coverLetter?: string;
}

export interface BusinessJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  image: string;
  createdAt: string;
  status: 'Active' | 'Paused' | 'Closed';
  views: number;
  applications: BusinessJobApplication[];
  urgent?: boolean;
}

export const businessJobsData: BusinessJob[] = [
  {
    id: 'bj-1',
    title: 'Automotive Technician',
    department: 'Service',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    salary: '₹25,000 - ₹35,000/month',
    description:
      'Experienced automotive technician needed for vehicle maintenance and repair services. Must have expertise in diagnostics and repair.',
    requirements: [
      '3+ years experience in automotive repair',
      'Knowledge of diagnostic tools',
      'Certification preferred',
      'Good problem-solving skills',
    ],
    benefits: [
      'Health Insurance',
      'Performance Bonus',
      'Training Programs',
      'Career Growth',
    ],
    image: '/tires.png',
    createdAt: '2025-09-28T10:00:00Z',
    status: 'Active',
    views: 234,
    applications: [
      {
        id: 'ba-1',
        applicantName: 'Vikram Sharma',
        email: 'vikram.sharma@email.com',
        phone: '+91 98765 11111',
        experience: '4 years',
        location: 'Mumbai, Maharashtra',
        avatar: '/staring-man.jpg',
        appliedAt: '2025-09-29T09:30:00Z',
        status: 'shortlisted',
        coverLetter:
          'I am a certified automotive technician with 4 years of hands-on experience in vehicle diagnostics and repair. I specialize in modern diagnostic equipment and have a proven track record of efficient repairs.',
      },
      {
        id: 'ba-2',
        applicantName: 'Arjun Patel',
        email: 'arjun.patel@email.com',
        phone: '+91 98765 22222',
        experience: '5 years',
        location: 'Thane, Maharashtra',
        avatar: '/profile.png',
        appliedAt: '2025-09-30T14:15:00Z',
        status: 'reviewed',
      },
      {
        id: 'ba-3',
        applicantName: 'Karan Singh',
        email: 'karan.singh@email.com',
        phone: '+91 98765 33333',
        experience: '3 years',
        location: 'Navi Mumbai, Maharashtra',
        appliedAt: '2025-10-01T11:20:00Z',
        status: 'pending',
      },
    ],
    urgent: true,
  },
  {
    id: 'bj-2',
    title: 'Vehicle Helper',
    department: 'Operations',
    location: 'Delhi, NCR',
    type: 'Full-time',
    salary: '₹15,000 - ₹20,000/month',
    description:
      'Looking for reliable helpers to assist with vehicle loading/unloading and maintenance support.',
    requirements: [
      'Physical fitness required',
      '1+ year experience preferred',
      'Team player attitude',
      'Flexible work hours',
    ],
    benefits: [
      'Food Allowance',
      'Overtime Pay',
      'Medical Coverage',
      'Uniform Provided',
    ],
    image: '/truck-01.jpg',
    createdAt: '2025-09-25T14:30:00Z',
    status: 'Active',
    views: 156,
    applications: [
      {
        id: 'ba-4',
        applicantName: 'Ravi Kumar',
        email: 'ravi.kumar@email.com',
        phone: '+91 98765 44444',
        experience: '2 years',
        location: 'Delhi, NCR',
        avatar: '/staring-man.jpg',
        appliedAt: '2025-09-26T10:00:00Z',
        status: 'shortlisted',
      },
      {
        id: 'ba-5',
        applicantName: 'Sunil Yadav',
        email: 'sunil.yadav@email.com',
        phone: '+91 98765 55555',
        experience: '1 year',
        location: 'Gurgaon, Haryana',
        appliedAt: '2025-09-27T16:45:00Z',
        status: 'pending',
      },
    ],
  },
  {
    id: 'bj-3',
    title: 'Diesel Mechanic',
    department: 'Service',
    location: 'Bangalore, Karnataka',
    type: 'Full-time',
    salary: '₹30,000 - ₹40,000/month',
    description:
      'Skilled diesel mechanic required for heavy vehicle maintenance and engine repairs.',
    requirements: [
      '5+ years diesel engine experience',
      'Heavy vehicle expertise',
      'Valid certifications',
      'Tool proficiency',
    ],
    benefits: [
      'High Pay Package',
      'Insurance Benefits',
      'Skill Development',
      'Job Security',
    ],
    image: '/excavator.jpg',
    createdAt: '2025-09-22T09:00:00Z',
    status: 'Active',
    views: 189,
    applications: [
      {
        id: 'ba-6',
        applicantName: 'Prakash Reddy',
        email: 'prakash.reddy@email.com',
        phone: '+91 98765 66666',
        experience: '6 years',
        location: 'Bangalore, Karnataka',
        avatar: '/staring-man.jpg',
        appliedAt: '2025-09-23T09:00:00Z',
        status: 'reviewed',
        coverLetter:
          'With over 6 years of experience in diesel engine repair and maintenance, I have extensive knowledge of heavy vehicle systems and troubleshooting.',
      },
      {
        id: 'ba-7',
        applicantName: 'Manoj Kumar',
        email: 'manoj.kumar@email.com',
        phone: '+91 98765 77777',
        experience: '7 years',
        location: 'Bangalore, Karnataka',
        appliedAt: '2025-09-24T13:30:00Z',
        status: 'pending',
      },
    ],
  },
  {
    id: 'bj-4',
    title: 'Workshop Supervisor',
    department: 'Service',
    location: 'Pune, Maharashtra',
    type: 'Full-time',
    salary: '₹40,000 - ₹55,000/month',
    description:
      'Lead our workshop team and oversee all repair and maintenance operations. Ensure quality standards and timely service delivery.',
    requirements: [
      '7+ years automotive experience',
      'Team management skills',
      'Technical expertise',
      'Quality control knowledge',
    ],
    benefits: [
      'Leadership Role',
      'Performance Incentives',
      'Health Benefits',
      'Professional Growth',
    ],
    image: '/tires.png',
    createdAt: '2025-09-20T08:00:00Z',
    status: 'Active',
    views: 312,
    applications: [
      {
        id: 'ba-8',
        applicantName: 'Santosh Jadhav',
        email: 'santosh.jadhav@email.com',
        phone: '+91 98765 88888',
        experience: '8 years',
        location: 'Pune, Maharashtra',
        avatar: '/staring-man.jpg',
        appliedAt: '2025-09-21T10:30:00Z',
        status: 'shortlisted',
      },
    ],
  },
  {
    id: 'bj-5',
    title: 'AC Technician',
    department: 'Service',
    location: 'Hyderabad, Telangana',
    type: 'Full-time',
    salary: '₹22,000 - ₹30,000/month',
    description:
      'Specialized AC technician for vehicle air conditioning systems. Installation, repair, and maintenance of automotive AC units.',
    requirements: [
      '3+ years AC repair experience',
      'Refrigerant handling certification',
      'Electrical knowledge',
      'Customer service skills',
    ],
    benefits: [
      'Training Programs',
      'Tool Allowance',
      'Medical Insurance',
      'Stable Employment',
    ],
    image: '/truck-01.jpg',
    createdAt: '2025-09-18T12:00:00Z',
    status: 'Paused',
    views: 98,
    applications: [],
  },
  {
    id: 'bj-6',
    title: 'Tire Specialist',
    department: 'Service',
    location: 'Chennai, Tamil Nadu',
    type: 'Part-time',
    salary: '₹18,000 - ₹25,000/month',
    description:
      'Expert tire technician needed for tire installation, balancing, alignment, and repairs.',
    requirements: [
      '2+ years tire service experience',
      'Wheel alignment knowledge',
      'Physical fitness',
      'Safety conscious',
    ],
    benefits: [
      'Flexible Hours',
      'Performance Bonus',
      'Training',
      'Equipment Provided',
    ],
    image: '/tires.png',
    createdAt: '2025-09-15T09:30:00Z',
    status: 'Active',
    views: 145,
    applications: [
      {
        id: 'ba-9',
        applicantName: 'Muthu Selvam',
        email: 'muthu.selvam@email.com',
        phone: '+91 98765 99999',
        experience: '3 years',
        location: 'Chennai, Tamil Nadu',
        appliedAt: '2025-09-16T11:00:00Z',
        status: 'pending',
      },
    ],
  },
];

// Service Assignments Mock Data (Booking Details)
export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyPhone: string;
  assignedBy: string;
  assignedDate: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  location: string;
  serviceType: string;
  category: string;
  pricing: {
    amount: string;
    currency: string;
  };
  duration?: string;
  bookedBy: 'Customer' | 'Company';
  notes?: string;
  internalNotes?: string;
}

export const serviceBookingsData: ServiceBooking[] = [
  {
    id: 'WB123456',
    serviceId: 'serv-1',
    serviceName: 'Premium Tyre Replacement',
    companyId: 'comp-1',
    companyName: 'Rohit Sharma',
    companyLogo: '/profile.png',
    companyPhone: '+91 98765 43210',
    assignedBy: 'Rohit Sharma',
    assignedDate: '2025-06-07T10:30:00Z',
    scheduledDate: '2025-07-10T15:00:00Z',
    scheduledTime: '3:00 PM',
    status: 'Confirmed',
    location: 'Pune, Maharashtra',
    serviceType: 'Tyre Retreading',
    category: 'Mechanical',
    pricing: {
      amount: '1,200',
      currency: '₹',
    },
    duration: '1 hour',
    bookedBy: 'Customer',
    notes: 'Bring a replacement wheel!',
    internalNotes: 'Visible to You Only',
  },
  {
    id: 'WB123457',
    serviceId: 'serv-1',
    serviceName: 'Premium Tyre Replacement',
    companyId: 'comp-2',
    companyName: 'Delhi Transport Co.',
    companyLogo: '/profile.png',
    companyPhone: '+91 98765 43211',
    assignedBy: 'Suresh Kumar',
    assignedDate: '2025-06-10T14:20:00Z',
    scheduledDate: '2025-07-15T10:00:00Z',
    scheduledTime: '10:00 AM',
    status: 'Confirmed',
    location: 'Delhi, NCR',
    serviceType: 'Tyre Retreading',
    category: 'Mechanical',
    pricing: {
      amount: '1,200',
      currency: '₹',
    },
    duration: '1 hour',
    bookedBy: 'Company',
    notes: 'Need urgent service',
  },
  {
    id: 'WB123458',
    serviceId: 'serv-2',
    serviceName: 'Engine Repair Service',
    companyId: 'comp-3',
    companyName: 'Mumbai Logistics',
    companyLogo: '/profile.png',
    companyPhone: '+91 98765 43212',
    assignedBy: 'Amit Patel',
    assignedDate: '2025-06-12T09:15:00Z',
    scheduledDate: '2025-07-18T14:00:00Z',
    scheduledTime: '2:00 PM',
    status: 'Pending',
    location: 'Mumbai, Maharashtra',
    serviceType: 'Engine Diagnostics',
    category: 'Mechanical',
    pricing: {
      amount: '2,500',
      currency: '₹',
    },
    duration: '2 hours',
    bookedBy: 'Customer',
    notes: 'Check coolant system',
  },
  {
    id: 'WB123459',
    serviceId: 'serv-1',
    serviceName: 'Premium Tyre Replacement',
    companyId: 'comp-4',
    companyName: 'Bangalore Fleet Services',
    companyLogo: '/profile.png',
    companyPhone: '+91 98765 43213',
    assignedBy: 'Rajesh Verma',
    assignedDate: '2025-06-05T16:45:00Z',
    scheduledDate: '2025-07-08T11:30:00Z',
    scheduledTime: '11:30 AM',
    status: 'Completed',
    location: 'Bangalore, Karnataka',
    serviceType: 'Tyre Retreading',
    category: 'Mechanical',
    pricing: {
      amount: '1,200',
      currency: '₹',
    },
    duration: '1 hour',
    bookedBy: 'Company',
  },
  {
    id: 'WB123460',
    serviceId: 'serv-3',
    serviceName: 'AC Repair & Maintenance',
    companyId: 'comp-5',
    companyName: 'Chennai Motors',
    companyLogo: '/profile.png',
    companyPhone: '+91 98765 43214',
    assignedBy: 'Venkat Raman',
    assignedDate: '2025-06-15T11:00:00Z',
    scheduledDate: '2025-07-20T09:00:00Z',
    scheduledTime: '9:00 AM',
    status: 'Confirmed',
    location: 'Chennai, Tamil Nadu',
    serviceType: 'AC Service',
    category: 'Electrical',
    pricing: {
      amount: '1,800',
      currency: '₹',
    },
    duration: '90 minutes',
    bookedBy: 'Customer',
    notes: 'AC not cooling properly',
  },
  // Additional assignments referencing existing business services (svc-1 .. svc-6)
  {
    id: 'WB123461',
    serviceId: 'svc-1',
    serviceName: 'Tyre Replacement',
    companyId: 'comp-6',
    companyName: 'Pune Haulage Co.',
    companyLogo: '/logo-01.png',
    companyPhone: '+91 99222 33445',
    assignedBy: 'Ajay Singh',
    assignedDate: '2025-09-20T08:30:00Z',
    scheduledDate: '2025-10-10T10:00:00Z',
    scheduledTime: '10:00 AM',
    status: 'Pending',
    location: 'Mumbai, Maharashtra',
    serviceType: 'Tyre Replacement',
    category: 'Tyre Repair',
    pricing: {
      amount: '2,500',
      currency: '₹',
    },
    duration: '1.5 hours',
    bookedBy: 'Company',
    notes: 'Require heavy-duty tyre for EX-200',
  },
  {
    id: 'WB123462',
    serviceId: 'svc-2',
    serviceName: 'Engine Diagnostics',
    companyId: 'comp-7',
    companyName: 'North Fleet Repairs',
    companyLogo: '/profile.png',
    companyPhone: '+91 99111 22334',
    assignedBy: 'Rakesh Mehta',
    assignedDate: '2025-09-18T12:15:00Z',
    scheduledDate: '2025-10-12T14:00:00Z',
    scheduledTime: '2:00 PM',
    status: 'Confirmed',
    location: 'Pune, Maharashtra',
    serviceType: 'Engine Diagnostics',
    category: 'Engine',
    pricing: {
      amount: '3,000',
      currency: '₹',
    },
    duration: '2 hours',
    bookedBy: 'Customer',
    notes: 'Priority: emissions check',
  },
  {
    id: 'WB123463',
    serviceId: 'svc-4',
    serviceName: 'Brake Inspection',
    companyId: 'comp-8',
    companyName: 'SafeStop Services',
    companyLogo: '/profile.png',
    companyPhone: '+91 98888 77665',
    assignedBy: 'Sunita Rao',
    assignedDate: '2025-09-25T09:00:00Z',
    scheduledDate: '2025-10-15T11:30:00Z',
    scheduledTime: '11:30 AM',
    status: 'Confirmed',
    location: 'Thane, Maharashtra',
    serviceType: 'Brake Inspection',
    category: 'Brake',
    pricing: {
      amount: '3,500',
      currency: '₹',
    },
    duration: '1 hour',
    bookedBy: 'Company',
  },
  {
    id: 'WB123464',
    serviceId: 'svc-5',
    serviceName: 'Battery Replacement',
    companyId: 'comp-9',
    companyName: 'ElectroPower Pvt Ltd',
    companyLogo: '/profile.png',
    companyPhone: '+91 97777 66554',
    assignedBy: 'Manoj Kumar',
    assignedDate: '2025-09-22T10:45:00Z',
    scheduledDate: '2025-10-05T09:00:00Z',
    scheduledTime: '9:00 AM',
    status: 'Cancelled',
    location: 'Nashik, Maharashtra',
    serviceType: 'Battery Replacement',
    category: 'Battery',
    pricing: {
      amount: '4,500',
      currency: '₹',
    },
    duration: '45 minutes',
    bookedBy: 'Customer',
    notes: 'Caller requested cancellation due to stock issue',
  },
  {
    id: 'WB123465',
    serviceId: 'svc-6',
    serviceName: 'AC Service & Repair',
    companyId: 'comp-10',
    companyName: 'CoolTech Services',
    companyLogo: '/profile.png',
    companyPhone: '+91 96666 55443',
    assignedBy: 'Priya Singh',
    assignedDate: '2025-09-28T13:30:00Z',
    scheduledDate: '2025-10-18T08:30:00Z',
    scheduledTime: '8:30 AM',
    status: 'Pending',
    location: 'Mumbai, Maharashtra',
    serviceType: 'AC Service',
    category: 'AC',
    pricing: {
      amount: '2,200',
      currency: '₹',
    },
    duration: '1.5 hours',
    bookedBy: 'Company',
    notes: 'Customer prefers early morning slot',
  },
];

export const companyFleetData = {
  vehicles: [
    {
      id: 'v1',
      name: 'Omni Van',
      model: 'Maruti Omni E MPI',
      year: 1998,
      registrationNumber: 'DL-01-AB-1234',
      status: 'Attached',
      fuelType: 'Petrol',
      capacity: '600 kg',
      mileage: '15 km/l',
      lastService: 'Last service: 12 Jan',
      location: 'Current: Delhi',
      image: '/truck-01.jpg',
      statusBadge: 'In Transit',
      ownership: 'Attached',
      onTrip: true,
      manufacturer: 'Maruti',
      assignedDriver: {
        id: 'd1',
        name: 'Rajesh Kumar',
        avatar: '/staring-man.jpg',
      },
      metrics: {
        avgRun: 12500,
        tripEfficiency: 2.8,
        monthlyUsage: 8500,
        costPerKM: 2.8,
      },
      totalTrips: 156,
      recentTrips: [
        { id: 'ST0624AD2024', route: 'SURAT-AHMEDABAD', date: '2024-12-20' },
        { id: 'BR0624PNE2024', route: 'VADODARA-PUNE', date: '2024-12-18' },
        { id: 'ST0624AD2024', route: 'SURAT-AHMEDABAD', date: '2024-12-15' },
      ],
    },
    {
      id: 'v2',
      name: 'Tata',
      model: 'Tata Ace Gold CX',
      year: 2007,
      registrationNumber: 'MH-12-AB-1234',
      status: 'Owned',
      fuelType: 'Diesel',
      capacity: '750 kg',
      mileage: '20 km/l',
      lastService: 'Last service: 20 Feb',
      location: 'Current: Mumbai',
      image: '/truck-01.jpg',
      statusBadge: 'Assigned',
      ownership: 'Owned',
      onTrip: false,
      manufacturer: 'Tata',
      assignedDriver: {
        id: 'd2',
        name: 'Deepak Kumar',
        avatar: '/staring-man.jpg',
      },
      metrics: {
        avgRun: 15002,
        tripEfficiency: 3,
        monthlyUsage: 12500,
        costPerKM: 3,
      },
      totalTrips: 234,
      recentTrips: [
        { id: 'ST0624AD2024', route: 'SURAT-AHMEDABAD', date: '2024-12-20' },
        { id: 'DRD0624PNB2024', route: 'DADAR-PUNE', date: '2024-12-19' },
        { id: 'TN0624AD2024', route: 'CHENNAI-AHMEDABAD', date: '2024-12-17' },
      ],
    },
    {
      id: 'v3',
      name: 'Mercedes-Benz',
      model: 'Mercedes-Benz Actros',
      year: 2019,
      registrationNumber: 'CA-55-XY9782',
      status: 'Rented',
      fuelType: 'Diesel',
      capacity: '25 tons',
      mileage: '8 km/l',
      lastService: 'Last service: 5 Mar',
      location: 'Current: Bangalore',
      image: '/truck-01.jpg',
      statusBadge: 'Available',
      ownership: 'Owned',
      onTrip: false,
      manufacturer: 'Mercedes-Benz',
      assignedDriver: undefined,
      metrics: {
        avgRun: 18500,
        tripEfficiency: 4.2,
        monthlyUsage: 15600,
        costPerKM: 4.2,
      },
      totalTrips: 89,
      recentTrips: [
        { id: 'XWK 1107', route: 'BANGALORE-CHENNAI', date: '2024-12-22' },
        { id: 'ST0624AD2024', route: 'SURAT-AHMEDABAD', date: '2024-12-20' },
      ],
    },
    {
      id: 'v4',
      name: 'Tata LPT 1613',
      model: 'Tata LPT 1613 TC',
      year: 2007,
      registrationNumber: 'CA-55-XY9782',
      status: 'Owned',
      fuelType: 'Diesel',
      capacity: '16 tons',
      mileage: '10 km/l',
      lastService: 'Last service: 18 Apr',
      location: 'Current: Chennai',
      image: '/truck-01.jpg',
      statusBadge: 'Available',
      ownership: 'Owned',
      onTrip: false,
      manufacturer: 'Tata',
      assignedDriver: undefined,
      metrics: {
        avgRun: 8500,
        tripEfficiency: 4.5,
        monthlyUsage: 6200,
        costPerKM: 4.5,
      },
      totalTrips: 67,
      recentTrips: [
        { id: 'XWK 1107', route: 'CHENNAI-BANGALORE', date: '2024-12-21' },
      ],
    },
    {
      id: 'v5',
      name: 'Ashok Leyland',
      model: 'Ashok Leyland Dost+',
      year: 2007,
      registrationNumber: 'TS-05-IJ-7890',
      status: 'Owned',
      fuelType: 'CNG',
      capacity: '1.5 tons',
      mileage: '16 km/l',
      lastService: 'Last service: 30 May',
      location: 'Current: Hyderabad',
      image: '/truck-01.jpg',
      statusBadge: 'In Transit',
      ownership: 'Owned',
      onTrip: true,
      manufacturer: 'Ashok Leyland',
      assignedDriver: {
        id: 'd5',
        name: 'Manoj Verma',
        avatar: '/staring-man.jpg',
      },
      metrics: {
        avgRun: 11200,
        tripEfficiency: 3.8,
        monthlyUsage: 9800,
        costPerKM: 3.8,
      },
      totalTrips: 142,
      recentTrips: [
        { id: 'HYD987', route: 'HYDERABAD-VIJAYAWADA', date: '2024-12-22' },
        { id: 'HYD542', route: 'HYDERABAD-BANGALORE', date: '2024-12-19' },
      ],
    },
  ],
  drivers: [
    {
      id: 'd1',
      name: 'Rajesh Kumar',
      experience: '8 years',
      status: 'On Trip',
      licenseNumber: 'MH-12-AB-1234',
      phoneNumber: '+91 98765 43210',
      email: 'rajesh.kumar@wheelboard.com',
      rating: 4.8,
      totalTrips: 1245,
      currentVehicle: 'Omni Van (v1)',
      location: 'Current: Delhi → Mumbai',
      image: '/staring-man.jpg',
      joinedDate: '2017-03-15',
      address: '123 Main Street, Sector 15, Delhi, India 110001',
      emergencyContact: '+91 98765 00001',
      statusBadge: 'Hired',
      performance: { timelyDelivery: 92, tripEfficiency: 85, safety: 80 },
      feedback: 'Skilled Driver with good response time.',
      reviews: [
        {
          id: 'r1',
          reviewerName: 'Amit Sharma',
          reviewerAvatar: '/profile.png',
          rating: 5,
          comment: 'Excellent driver, always on time and very professional.',
          date: '2025-09-15',
        },
        {
          id: 'r2',
          reviewerName: 'Priya Singh',
          reviewerAvatar: '/profile.png',
          rating: 4,
          comment: 'Good service, safe driving. Highly recommended.',
          date: '2025-09-01',
        },
      ],
      isFavorite: true,
    },
    {
      id: 'd2',
      name: 'Deepak Kumar',
      experience: '5 years',
      status: 'Available',
      licenseNumber: 'MH-12-AB-1234',
      phoneNumber: '+91 98765 43211',
      email: 'deepak.kumar@wheelboard.com',
      rating: 4.0,
      totalTrips: 876,
      currentVehicle: undefined,
      location: 'Current: Mumbai',
      image: '/staring-man.jpg',
      joinedDate: '2019-06-20',
      address: '456 Park Avenue, Andheri West, Mumbai, India 400058',
      emergencyContact: '+91 98765 00002',
      statusBadge: 'Hired',
      performance: { timelyDelivery: 92, tripEfficiency: 85, safety: 80 },
      feedback: 'Skilled Driver with good response time.',
      reviews: [],
      isFavorite: false,
    },
    {
      id: 'd3',
      name: 'Suresh Patel',
      experience: '12 years',
      status: 'On Trip',
      licenseNumber: 'KA-05-CD-5678',
      phoneNumber: '+91 98765 43212',
      email: 'suresh.patel@wheelboard.com',
      rating: 4.9,
      totalTrips: 2134,
      currentVehicle: 'Mercedes-Benz (v3)',
      location: 'Current: Bangalore → Chennai',
      image: '/staring-man.jpg',
      joinedDate: '2013-01-10',
      address: '789 Tech Park Road, Whitefield, Bangalore, India 560066',
      emergencyContact: '+91 98765 00003',
      statusBadge: 'Hired',
      performance: { timelyDelivery: 95, tripEfficiency: 92, safety: 88 },
      feedback:
        'Highly experienced and reliable driver with excellent track record.',
      reviews: [
        {
          id: 'r3',
          reviewerName: 'Rahul Verma',
          reviewerAvatar: '/profile.png',
          rating: 5,
          comment:
            'Best driver in our fleet. Always professional and punctual.',
          date: '2025-09-20',
        },
      ],
      isFavorite: true,
    },
    {
      id: 'd4',
      name: 'Vijay Sharma',
      experience: '6 years',
      status: 'Available',
      licenseNumber: 'TN-09-EF-9012',
      phoneNumber: '+91 98765 43213',
      email: 'vijay.sharma@wheelboard.com',
      rating: 4.7,
      totalTrips: 1023,
      currentVehicle: undefined,
      location: 'Current: Chennai',
      image: '/staring-man.jpg',
      joinedDate: '2018-09-05',
      address: '321 Beach Road, Adyar, Chennai, India 600020',
      emergencyContact: '+91 98765 00004',
      statusBadge: 'Contract',
      performance: { timelyDelivery: 88, tripEfficiency: 82, safety: 85 },
      feedback: 'Dependable driver with good customer service skills.',
      reviews: [],
      isFavorite: false,
    },
    {
      id: 'd5',
      name: 'Manoj Verma',
      experience: '3 years',
      status: 'Off Duty',
      licenseNumber: 'TS-08-GH-3456',
      phoneNumber: '+91 98765 43214',
      email: 'manoj.verma@wheelboard.com',
      rating: 4.5,
      totalTrips: 542,
      currentVehicle: undefined,
      location: 'Current: Hyderabad',
      image: '/staring-man.jpg',
      joinedDate: '2021-11-12',
      address: '654 HITEC City, Madhapur, Hyderabad, India 500081',
      emergencyContact: '+91 98765 00005',
      statusBadge: 'Freelance',
      performance: { timelyDelivery: 78, tripEfficiency: 75, safety: 82 },
      feedback: 'Improving driver with good potential.',
      reviews: [
        {
          id: 'r4',
          reviewerName: 'Sneha Reddy',
          reviewerAvatar: '/profile.png',
          rating: 4,
          comment: 'Good driver, needs to improve on time management.',
          date: '2025-08-25',
        },
      ],
      isFavorite: false,
    },
  ] as Driver[],
  popularFeeds: [
    {
      id: 'cf1',
      author: {
        name: 'Delhi Transport',
        avatar: '/profile.png',
        initials: 'D',
      },
      title: 'Tips For Fleet Management',
      description:
        'Learn how to optimize your fleet operations and reduce maintenance costs effectively',
      image: '/image.png',
      timeAgo: 'Posted 2 days ago',
    },
    {
      id: 'cf2',
      author: {
        name: 'Mumbai Logistics',
        avatar: '/profile.png',
        initials: 'M',
      },
      title: 'Vehicle Maintenance Best Practices',
      description:
        'Regular maintenance tips to keep your fleet running smoothly and extend vehicle lifespan',
      image: '/truck-01.jpg',
      timeAgo: 'Posted 3 days ago',
    },
    {
      id: 'cf3',
      author: {
        name: 'Bangalore Transporters',
        avatar: '/profile.png',
        initials: 'B',
      },
      title: 'Reducing Fuel Costs',
      description:
        'Strategies to optimize fuel efficiency and reduce operational expenses in your fleet',
      image: '/image.png',
      timeAgo: 'Posted 5 days ago',
    },
    {
      id: 'cf4',
      author: {
        name: 'Chennai Carriers',
        avatar: '/profile.png',
        initials: 'C',
      },
      title: 'Driver Safety Programs',
      description:
        'Implement effective driver safety programs to prevent accidents and improve fleet safety',
      image: '/image.png',
      timeAgo: 'Posted 1 week ago',
    },
  ] as FeedPost[],
};

// Mock data for professional home page
export const professionalHomeData = {
  carouselSlides: [
    {
      id: 1,
      image: '/staring-man.jpg',
      alt: 'Professional driver',
    },
    {
      id: 2,
      image: '/logistics-professional.jpg',
      alt: 'Logistics professional',
    },
    {
      id: 3,
      image: '/truck-01.jpg',
      alt: 'Professional transport services',
    },
    {
      id: 4,
      image: '/Yellow-truck.jpg',
      alt: 'Commercial driving',
    },
    {
      id: 5,
      image: '/excavator.jpg',
      alt: 'Heavy vehicle operator',
    },
  ] as CarouselSlide[],

  nextScheduledTrip: {
    pickup: {
      address: '123 Main Street, AnyTown, CA 32132',
    },
    destination: {
      address: '456 Oak Avenue, OtherTown, NY 100001',
    },
    dateTime: 'Oct 26, 2024 - 10:00 AM',
    tripType: 'fragile' as 'cargo' | 'fragile' | 'liftgate',
  },

  jobListings: [
    {
      id: 'job-1',
      company: 'Concor Bangalore',
      position: 'Heavy Vehicle Driver',
      description:
        'Looking for experienced heavy vehicle drivers for long-haul transportation. Competitive salary and benefits.',
      image: '/excavator.jpg',
      likes: 35,
      applicants: 12,
      postedAt: 'Posted 2 days ago',
      location: 'Bangalore, Karnataka',
      salary: '₹35,000 - ₹45,000/month',
    },
    {
      id: 'job-2',
      company: 'Delhi Transport',
      position: 'Logistics Coordinator',
      description:
        'Coordinate logistics operations and manage transportation schedules. Excellent opportunity for career growth.',
      image: '/truck-01.jpg',
      likes: 20,
      applicants: 8,
      postedAt: 'Posted 3 days ago',
      location: 'Delhi, NCR',
      salary: '₹30,000 - ₹40,000/month',
    },
    {
      id: 'job-3',
      company: 'Mumbai Carriers',
      position: 'Fleet Supervisor',
      description:
        'Supervise fleet operations and ensure timely deliveries. Prior experience in transportation industry required.',
      image: '/Bus.jpg',
      likes: 28,
      applicants: 15,
      postedAt: 'Posted 5 days ago',
      location: 'Mumbai, Maharashtra',
      salary: '₹40,000 - ₹55,000/month',
    },
  ],

  popularFeeds: [
    {
      id: 'pf-1',
      author: {
        name: 'Transport Academy',
        avatar: '/profile.png',
        initials: 'TA',
      },
      title: 'Safe Driving Tips for Professionals',
      description:
        'Essential safety tips every professional driver should know to ensure safe and efficient transportation',
      image: '/truck-01.jpg',
      timeAgo: 'Posted 1 day ago',
    },
    {
      id: 'pf-2',
      author: {
        name: 'Career Growth Hub',
        avatar: '/profile.png',
        initials: 'CG',
      },
      title: 'Growing Your Career in Logistics',
      description:
        'Explore career opportunities and advancement paths in the logistics and transportation industry',
      image: '/logistics-professional.jpg',
      timeAgo: 'Posted 2 days ago',
    },
    {
      id: 'pf-3',
      author: {
        name: 'Driver Training Institute',
        avatar: '/profile.png',
        initials: 'DT',
      },
      title: 'Advanced Driving Techniques',
      description:
        'Master advanced driving techniques to enhance your professional skills and increase earning potential',
      image: '/Yellow-truck.jpg',
      timeAgo: 'Posted 3 days ago',
    },
    {
      id: 'pf-4',
      author: {
        name: 'Fleet Management Pro',
        avatar: '/profile.png',
        initials: 'FM',
      },
      title: 'Vehicle Maintenance Basics',
      description:
        'Learn essential vehicle maintenance practices to keep your vehicle in top condition',
      image: '/excavator.jpg',
      timeAgo: 'Posted 5 days ago',
    },
  ] as FeedPost[],
};

// Professional Expenses Data
export interface Expense {
  id: string;
  date: string;
  purpose: string;
  category:
    | 'fuel'
    | 'maintenance'
    | 'food'
    | 'challan'
    | 'toll'
    | 'parking'
    | 'other';
  amount: number;
  description?: string;
  tripId?: string;
  tripName?: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  count: number;
}

export const professionalExpensesData = {
  totalExpenses: 12340,
  thisMonthExpenses: 4250,
  lastMonthExpenses: 3890,
  pendingApprovals: 850,
  categoryBreakdown: [
    {
      id: 'fuel',
      name: 'Fuel',
      icon: '⛽',
      color: '#3B82F6',
      total: 2300,
      count: 8,
    },
    {
      id: 'food',
      name: 'Food',
      icon: '🍔',
      color: '#F59E0B',
      total: 450,
      count: 12,
    },
    {
      id: 'maintenance',
      name: 'Vehicle Repair',
      icon: '🔧',
      color: '#EF4444',
      total: 1500,
      count: 2,
    },
    {
      id: 'toll',
      name: 'Toll',
      icon: '🛣️',
      color: '#10B981',
      total: 890,
      count: 15,
    },
    {
      id: 'challan',
      name: 'Challan',
      icon: '🚨',
      color: '#F97316',
      total: 500,
      count: 1,
    },
    {
      id: 'parking',
      name: 'Parking',
      icon: '🅿️',
      color: '#8B5CF6',
      total: 320,
      count: 18,
    },
    {
      id: 'other',
      name: 'Others',
      icon: '📦',
      color: '#6B7280',
      total: 380,
      count: 6,
    },
  ] as ExpenseCategory[],

  recentExpenses: [
    {
      id: 'exp-1',
      date: '2024-10-19',
      purpose: 'Vehicle Repair',
      category: 'maintenance' as const,
      amount: 1500,
      description: 'Brake system replacement',
      tripId: 'TRP-1029',
      tripName: 'Delhi to Mumbai',
      receiptUrl: '/receipts/exp-1.pdf',
      status: 'approved' as const,
    },
    {
      id: 'exp-2',
      date: '2024-10-18',
      purpose: 'Fuel',
      category: 'fuel' as const,
      amount: 2300,
      description: 'Diesel - Highway fuel station',
      tripId: 'TRP-1029',
      tripName: 'Delhi to Mumbai',
      receiptUrl: '/receipts/exp-2.pdf',
      status: 'approved' as const,
    },
    {
      id: 'exp-3',
      date: '2024-10-18',
      purpose: 'Food',
      category: 'food' as const,
      amount: 450,
      description: 'Lunch stop - Dhaba',
      tripId: 'TRP-1029',
      tripName: 'Delhi to Mumbai',
      status: 'approved' as const,
    },
    {
      id: 'exp-4',
      date: '2024-10-17',
      purpose: 'Challan',
      category: 'challan' as const,
      amount: 500,
      description: 'Speed limit violation',
      tripId: 'TRP-1028',
      tripName: 'Bangalore to Chennai',
      receiptUrl: '/receipts/exp-4.pdf',
      status: 'pending' as const,
    },
    {
      id: 'exp-5',
      date: '2024-10-16',
      purpose: 'Toll',
      category: 'toll' as const,
      amount: 350,
      description: 'Highway toll - NH44',
      tripId: 'TRP-1028',
      tripName: 'Bangalore to Chennai',
      status: 'approved' as const,
    },
    {
      id: 'exp-6',
      date: '2024-10-15',
      purpose: 'Parking',
      category: 'parking' as const,
      amount: 120,
      description: 'Overnight parking - Rest area',
      tripId: 'TRP-1027',
      tripName: 'Pune to Hyderabad',
      status: 'approved' as const,
    },
  ] as Expense[],

  monthlyExpenseData: [
    { month: 'Jan', amount: 3200 },
    { month: 'Feb', amount: 3500 },
    { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 4100 },
    { month: 'May', amount: 3900 },
    { month: 'Jun', amount: 4200 },
    { month: 'Jul', amount: 3800 },
    { month: 'Aug', amount: 4500 },
    { month: 'Sep', amount: 3890 },
    { month: 'Oct', amount: 4250 },
  ],

  topExpenses: [
    { category: 'Fuel', amount: 2300, percentage: 38 },
    { category: 'Vehicle Repair', amount: 1500, percentage: 25 },
    { category: 'Toll', amount: 890, percentage: 15 },
    { category: 'Challan', amount: 500, percentage: 8 },
    { category: 'Food', amount: 450, percentage: 7 },
    { category: 'Others', amount: 710, percentage: 7 },
  ],
};

// Professional Calendar Data
export interface CalendarEvent {
  id: string;
  date: string;
  eventName: string;
  note?: string;
  startTime?: string;
  endTime?: string;
  category: 'trip' | 'job';
  isActive: boolean;
  location?: {
    from?: string;
    to?: string;
  };
  tripId?: string;
  status?: 'in-transit' | 'scheduled' | 'completed';
}

export interface AvailabilityDate {
  date: string;
  isActive: boolean;
  hasEvent: boolean;
  events?: CalendarEvent[];
}

export const professionalCalendarData = {
  currentMonth: 'September',
  currentYear: 2025,
  markedDates: [
    {
      date: '2025-09-02',
      isActive: true,
      hasEvent: true,
      events: [
        {
          id: 'evt-1',
          date: '2025-09-02',
          eventName: 'Warehouse A to Store Z',
          note: 'Delivery scheduled',
          startTime: '09:35',
          endTime: '18:00',
          category: 'trip' as const,
          isActive: true,
          location: {
            from: 'Warehouse A',
            to: 'Store Z',
          },
          tripId: 'MH2AB3456',
          status: 'in-transit' as const,
        },
      ],
    },
    {
      date: '2025-09-03',
      isActive: true,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-04',
      isActive: true,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-05',
      isActive: true,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-08',
      isActive: false,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-09',
      isActive: true,
      hasEvent: true,
      events: [
        {
          id: 'evt-2',
          date: '2025-09-09',
          eventName: 'Delhi to Mumbai Job',
          note: 'Long haul delivery',
          startTime: '06:00',
          endTime: '22:00',
          category: 'job' as const,
          isActive: true,
          location: {
            from: 'Delhi Hub',
            to: 'Mumbai Warehouse',
          },
          status: 'scheduled' as const,
        },
      ],
    },
    {
      date: '2025-09-10',
      isActive: true,
      hasEvent: true,
      events: [
        {
          id: 'evt-3',
          date: '2025-09-10',
          eventName: 'Return trip preparation',
          note: 'Vehicle maintenance check',
          category: 'trip' as const,
          isActive: true,
          status: 'scheduled' as const,
        },
      ],
    },
    {
      date: '2025-09-14',
      isActive: false,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-15',
      isActive: false,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-16',
      isActive: true,
      hasEvent: true,
      events: [
        {
          id: 'evt-4',
          date: '2025-09-16',
          eventName: 'Local delivery job',
          note: 'Multiple stops scheduled',
          startTime: '08:00',
          endTime: '16:00',
          category: 'job' as const,
          isActive: true,
          status: 'scheduled' as const,
        },
      ],
    },
    {
      date: '2025-09-17',
      isActive: true,
      hasEvent: true,
      events: [
        {
          id: 'evt-5',
          date: '2025-09-17',
          eventName: 'Bangalore to Chennai',
          note: 'Express delivery',
          startTime: '05:00',
          endTime: '14:00',
          category: 'trip' as const,
          isActive: true,
          location: {
            from: 'Bangalore',
            to: 'Chennai',
          },
          tripId: 'KA01AB1234',
          status: 'scheduled' as const,
        },
      ],
    },
    {
      date: '2025-09-21',
      isActive: false,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-22',
      isActive: false,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-28',
      isActive: true,
      hasEvent: false,
      events: [],
    },
    {
      date: '2025-09-29',
      isActive: true,
      hasEvent: true,
      events: [
        {
          id: 'evt-6',
          date: '2025-09-29',
          eventName: 'Weekend delivery',
          note: 'Special shipment',
          category: 'trip' as const,
          isActive: true,
          status: 'scheduled' as const,
        },
      ],
    },
    {
      date: '2025-09-30',
      isActive: true,
      hasEvent: true,
      events: [
        {
          id: 'evt-7',
          date: '2025-09-30',
          eventName: 'Month-end clearance',
          note: 'Final deliveries of the month',
          category: 'job' as const,
          isActive: true,
          status: 'scheduled' as const,
        },
      ],
    },
  ] as AvailabilityDate[],

  stats: {
    totalActiveDays: 18,
    totalInactiveDays: 5,
    totalEventsScheduled: 7,
    thisMonthAvailability: 78, // percentage
  },

  upcomingEvents: [
    {
      id: 'evt-8',
      date: '2025-10-02',
      eventName: 'Pune to Hyderabad',
      category: 'trip' as const,
      isActive: true,
      location: {
        from: 'Pune',
        to: 'Hyderabad',
      },
      status: 'scheduled' as const,
    },
    {
      id: 'evt-9',
      date: '2025-10-05',
      eventName: 'Local deliveries',
      category: 'job' as const,
      isActive: true,
      status: 'scheduled' as const,
    },
  ] as CalendarEvent[],
};

// Professional Learning Data
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'maintenance' | 'regulations' | 'driving' | 'business';
  duration: string;
  thumbnail: string;
  videoUrl: string;
  progress: number;
  isCompleted: boolean;
  modulesCompleted: number;
  totalModules: number;
  lastWatched?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  rating?: number;
  enrolledCount?: number;
}

export interface LearningCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export const professionalLearningData = {
  stats: {
    modulesCompleted: 5,
    inProgress: 2,
    totalModules: 15,
    completionRate: 33,
    totalWatchTime: '12h 45m',
    certificatesEarned: 3,
  },

  categories: [
    {
      id: 'safety',
      name: 'Safety',
      icon: '🛡️',
      color: '#f36969',
      count: 4,
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: '🔧',
      color: '#EF4444',
      count: 3,
    },
    {
      id: 'regulations',
      name: 'Regulations',
      icon: '📋',
      color: '#F59E0B',
      count: 3,
    },
    {
      id: 'driving',
      name: 'Driving',
      icon: '🚛',
      color: '#10B981',
      count: 3,
    },
    {
      id: 'business',
      name: 'Business',
      icon: '💼',
      color: '#3B82F6',
      count: 2,
    },
  ] as LearningCategory[],

  modules: [
    {
      id: 'learn-1',
      title: 'How to Save Fuel',
      description:
        'Learn best practices to reduce fuel costs and improve efficiency',
      category: 'driving' as const,
      duration: '7 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/fuel-saving.mp4',
      progress: 100,
      isCompleted: true,
      modulesCompleted: 3,
      totalModules: 3,
      lastWatched: '2 Oct 2025',
      tags: ['Fuel', 'Completed'],
      difficulty: 'beginner' as const,
      instructor: 'John Davis',
      rating: 4.8,
      enrolledCount: 2340,
    },
    {
      id: 'learn-2',
      title: 'Tyre Filling Animation',
      description:
        'Step-by-step visual guide on proper tire inflation and safety',
      category: 'maintenance' as const,
      duration: '5 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/tyre-filling.mp4',
      progress: 60,
      isCompleted: false,
      modulesCompleted: 3,
      totalModules: 5,
      lastWatched: '17 Oct 2025',
      tags: ['Intermediate', 'In Progress'],
      difficulty: 'intermediate' as const,
      instructor: 'Mike Johnson',
      rating: 4.6,
      enrolledCount: 1850,
    },
    {
      id: 'learn-3',
      title: 'Safe Lifting Techniques',
      description:
        'Essential tips to avoid injuries when lifting heavy objects during trips',
      category: 'safety' as const,
      duration: '8 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/safe-lifting.mp4',
      progress: 100,
      isCompleted: true,
      modulesCompleted: 4,
      totalModules: 4,
      lastWatched: '15 Oct 2025',
      tags: ['Safety', 'Completed'],
      difficulty: 'beginner' as const,
      instructor: 'Sarah Williams',
      rating: 4.9,
      enrolledCount: 3120,
    },
    {
      id: 'learn-4',
      title: 'Eco-Driving Animation',
      description:
        'Learn eco-friendly driving techniques to reduce carbon footprint',
      category: 'driving' as const,
      duration: '6 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/eco-driving.mp4',
      progress: 100,
      isCompleted: true,
      modulesCompleted: 2,
      totalModules: 2,
      lastWatched: '12 Oct 2025',
      tags: ['Completed'],
      difficulty: 'beginner' as const,
      instructor: 'Robert Chen',
      rating: 4.7,
      enrolledCount: 1950,
    },
    {
      id: 'learn-5',
      title: 'Keep Your Tyre Safe',
      description:
        'Why tire safety matters and key safety tips for road readiness',
      category: 'safety' as const,
      duration: '10 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/tyre-safety.mp4',
      progress: 0,
      isCompleted: false,
      modulesCompleted: 0,
      totalModules: 6,
      lastWatched: undefined,
      tags: ['Safety', 'Admin'],
      difficulty: 'beginner' as const,
      instructor: 'Emily Taylor',
      rating: 4.8,
      enrolledCount: 2670,
    },
    {
      id: 'learn-6',
      title: 'Advanced Route Planning',
      description: 'Master efficient route planning for maximum productivity',
      category: 'business' as const,
      duration: '15 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/route-planning.mp4',
      progress: 0,
      isCompleted: false,
      modulesCompleted: 0,
      totalModules: 8,
      lastWatched: undefined,
      tags: ['Advanced', 'Business'],
      difficulty: 'advanced' as const,
      instructor: 'David Martinez',
      rating: 4.5,
      enrolledCount: 980,
    },
    {
      id: 'learn-7',
      title: 'Traffic Rules & Regulations',
      description:
        'Updated traffic laws and regulations for professional drivers',
      category: 'regulations' as const,
      duration: '12 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/traffic-rules.mp4',
      progress: 100,
      isCompleted: true,
      modulesCompleted: 5,
      totalModules: 5,
      lastWatched: '8 Oct 2025',
      tags: ['Regulations', 'Completed'],
      difficulty: 'intermediate' as const,
      instructor: 'Lisa Anderson',
      rating: 4.9,
      enrolledCount: 4200,
    },
    {
      id: 'learn-8',
      title: 'Vehicle Pre-Trip Inspection',
      description: 'Complete checklist for pre-trip vehicle inspection',
      category: 'maintenance' as const,
      duration: '9 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/inspection.mp4',
      progress: 30,
      isCompleted: false,
      modulesCompleted: 1,
      totalModules: 4,
      lastWatched: '16 Oct 2025',
      tags: ['Intermediate', 'In Progress'],
      difficulty: 'intermediate' as const,
      instructor: 'Tom Wilson',
      rating: 4.7,
      enrolledCount: 2100,
    },
    {
      id: 'learn-9',
      title: 'Emergency Response Training',
      description: 'How to handle roadside emergencies and breakdowns',
      category: 'safety' as const,
      duration: '11 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/emergency.mp4',
      progress: 0,
      isCompleted: false,
      modulesCompleted: 0,
      totalModules: 6,
      lastWatched: undefined,
      tags: ['Safety', 'Advanced'],
      difficulty: 'advanced' as const,
      instructor: 'Jennifer Brown',
      rating: 4.8,
      enrolledCount: 1560,
    },
    {
      id: 'learn-10',
      title: 'Load Securing Best Practices',
      description: 'Proper techniques for securing and distributing cargo load',
      category: 'regulations' as const,
      duration: '13 min',
      thumbnail: '/placeholder-video.jpg',
      videoUrl: 'https://example.com/load-securing.mp4',
      progress: 0,
      isCompleted: false,
      modulesCompleted: 0,
      totalModules: 7,
      lastWatched: undefined,
      tags: ['Regulations'],
      difficulty: 'intermediate' as const,
      instructor: 'Michael Garcia',
      rating: 4.6,
      enrolledCount: 1420,
    },
  ] as LearningModule[],

  recentlyWatched: ['learn-8', 'learn-2', 'learn-3', 'learn-7'],

  recommended: ['learn-5', 'learn-9', 'learn-10', 'learn-6'],
};

// Comprehensive Feeds Data for Fleet Management Community
export const communityFeeds: FeedPost[] = [
  {
    id: 'feed-1',
    author: {
      name: 'Rajesh Kumar',
      avatar: '/profile.png',
      initials: 'RK',
      userType: 'company',
      company: 'Kumar Logistics Pvt Ltd',
    },
    content:
      '🚛 Just upgraded our fleet with 5 new electric trucks! Excited to reduce our carbon footprint while maintaining delivery efficiency. The future of logistics is sustainable! #GreenFleet #ElectricVehicles',
    image: '/image.png',
    timestamp: '2024-03-15T10:30:00Z',
    timeAgo: '2 hours ago',
    likes: 245,
    shares: 38,
    comments: [
      {
        id: 'c1',
        author: {
          name: 'Priya Sharma',
          avatar: '/profile.png',
          id: 'user-101',
        },
        content: 'Congratulations! How is the charging infrastructure setup?',
        timestamp: '2024-03-15T11:00:00Z',
        timeAgo: '1 hour ago',
      },
      {
        id: 'c2',
        author: {
          name: 'Amit Patel',
          avatar: '/profile.png',
          id: 'user-102',
        },
        content: 'Great move! We are considering the same transition.',
        timestamp: '2024-03-15T11:30:00Z',
        timeAgo: '30 minutes ago',
      },
    ],
    isLiked: false,
    category: 'services',
  },
  {
    id: 'feed-2',
    author: {
      name: 'Sarah Johnson',
      avatar: '/profile.png',
      initials: 'SJ',
      userType: 'business',
      company: 'FleetCare Solutions',
    },
    content:
      "📊 Fleet Management Tip: Regular tire pressure checks can improve fuel efficiency by up to 3%. Small habits, big savings! Here's our monthly maintenance checklist that has helped reduce operational costs by 15%.",
    image: '/truck-01.jpg',
    timestamp: '2024-03-15T08:15:00Z',
    timeAgo: '4 hours ago',
    likes: 189,
    shares: 52,
    comments: [
      {
        id: 'c3',
        author: {
          name: 'David Lee',
          avatar: '/profile.png',
          id: 'user-103',
        },
        content:
          'This is really helpful! Can you share the complete checklist?',
        timestamp: '2024-03-15T09:00:00Z',
        timeAgo: '3 hours ago',
      },
    ],
    isLiked: true,
    category: 'tip',
  },
  {
    id: 'feed-3',
    author: {
      name: 'Michael Chen',
      avatar: '/profile.png',
      initials: 'MC',
      userType: 'company',
      company: 'TransGlobal Express',
    },
    content:
      '🎯 Q1 Results are in! Our team completed 2,547 deliveries with a 99.2% on-time rate. Proud of every driver and dispatcher who made this possible. Excellence is a team effort! 💪',
    timestamp: '2024-03-14T16:45:00Z',
    timeAgo: '18 hours ago',
    likes: 412,
    shares: 67,
    comments: [
      {
        id: 'c4',
        author: {
          name: 'Lisa Wong',
          avatar: '/profile.png',
        },
        content:
          'Impressive numbers! What tools do you use for route optimization?',
        timestamp: '2024-03-14T17:30:00Z',
        timeAgo: '17 hours ago',
      },
      {
        id: 'c5',
        author: {
          name: 'John Smith',
          avatar: '/profile.png',
        },
        content: 'Congratulations to the entire team! 🎉',
        timestamp: '2024-03-14T18:00:00Z',
        timeAgo: '16 hours ago',
      },
      {
        id: 'c6',
        author: {
          name: 'Emma Davis',
          avatar: '/profile.png',
        },
        content: 'Would love to connect and learn from your best practices.',
        timestamp: '2024-03-15T10:00:00Z',
        timeAgo: '2 hours ago',
      },
    ],
    isLiked: true,
    category: 'Promotions',
  },
  {
    id: 'feed-4',
    author: {
      name: 'Anita Desai',
      avatar: '/profile.png',
      initials: 'AD',
      userType: 'professional',
      company: 'Independent Driver',
    },
    content:
      "🤔 Question for fleet managers: What's your preferred telematics solution? Looking to upgrade my vehicle tracking system. Budget-friendly options welcome!",
    timestamp: '2024-03-14T14:20:00Z',
    timeAgo: '22 hours ago',
    likes: 76,
    shares: 12,
    comments: [
      {
        id: 'c7',
        author: {
          name: 'Vikram Singh',
          avatar: '/profile.png',
        },
        content: 'We use GPS Insight. Good balance of features and price.',
        timestamp: '2024-03-14T15:00:00Z',
        timeAgo: '21 hours ago',
      },
      {
        id: 'c8',
        author: {
          name: 'Ravi Verma',
          avatar: '/profile.png',
        },
        content: 'Check out Verizon Connect. They have excellent support.',
        timestamp: '2024-03-14T16:00:00Z',
        timeAgo: '20 hours ago',
      },
    ],
    isLiked: false,
    category: 'question',
  },
  {
    id: 'feed-5',
    author: {
      name: 'Global Fleet Summit',
      avatar: '/network.png',
      initials: 'GF',
      userType: 'business',
      company: 'Industry Events',
    },
    content:
      '📢 Registration open for Global Fleet Management Summit 2024! Join 500+ industry leaders, explore latest technologies, and network with professionals. Early bird discount ends this Friday! Link in bio.',
    image: '/image.png',
    timestamp: '2024-03-14T09:00:00Z',
    timeAgo: '1 day ago',
    likes: 523,
    shares: 156,
    comments: [
      {
        id: 'c9',
        author: {
          name: 'Suresh Reddy',
          avatar: '/profile.png',
        },
        content: 'Already registered! Looking forward to the keynote sessions.',
        timestamp: '2024-03-14T10:00:00Z',
        timeAgo: '1 day ago',
      },
    ],
    isLiked: false,
    category: 'services',
  },
  {
    id: 'feed-6',
    author: {
      name: 'TechFleet Innovations',
      avatar: '/profile.png',
      initials: 'TF',
      userType: 'business',
      company: 'TechFleet Innovations',
    },
    content:
      '🚀 Introducing our new AI-powered route optimization platform! Reduce fuel costs by 20%, improve delivery times by 15%. Free trial for the first 100 companies. DM for details!',
    image: '/image.png',
    timestamp: '2024-03-13T13:30:00Z',
    timeAgo: '2 days ago',
    likes: 198,
    shares: 89,
    comments: [
      {
        id: 'c10',
        author: {
          name: 'Meera Joshi',
          avatar: '/profile.png',
        },
        content:
          'Sounds interesting! Does it integrate with existing fleet management systems?',
        timestamp: '2024-03-13T14:00:00Z',
        timeAgo: '2 days ago',
      },
    ],
    isLiked: true,
    category: 'services',
  },
  {
    id: 'feed-7',
    author: {
      name: 'Deepak Malhotra',
      avatar: '/profile.png',
      initials: 'DM',
      userType: 'company',
      company: 'Malhotra Transport Services',
    },
    content:
      '⚠️ Safety First! Implemented mandatory dashcam installation across our entire fleet. Driver safety and accountability have improved significantly. Highly recommend to all fleet operators.',
    image: '/truck-01.jpg',
    timestamp: '2024-03-13T07:45:00Z',
    timeAgo: '2 days ago',
    likes: 267,
    shares: 43,
    comments: [
      {
        id: 'c11',
        author: {
          name: 'Neha Gupta',
          avatar: '/profile.png',
        },
        content:
          'Which dashcam model are you using? Looking for reliable options.',
        timestamp: '2024-03-13T08:30:00Z',
        timeAgo: '2 days ago',
      },
      {
        id: 'c12',
        author: {
          name: 'Rohit Kapoor',
          avatar: '/profile.png',
        },
        content: 'Great initiative! Safety should always be the priority.',
        timestamp: '2024-03-13T09:00:00Z',
        timeAgo: '2 days ago',
      },
    ],
    isLiked: false,
    category: 'Promotions',
  },
  {
    id: 'feed-8',
    author: {
      name: 'FleetPro Academy',
      avatar: '/profile.png',
      initials: 'FP',
      userType: 'business',
      company: 'FleetPro Training',
    },
    content:
      '📚 New Course Alert: "Advanced Fleet Operations Management" - Learn from industry experts, get certified, advance your career. Limited seats available. Enroll now!',
    timestamp: '2024-03-12T11:00:00Z',
    timeAgo: '3 days ago',
    likes: 145,
    shares: 67,
    comments: [],
    isLiked: false,
    category: 'services',
  },
  {
    id: 'feed-9',
    author: {
      name: 'Kavita Rao',
      avatar: '/profile.png',
      initials: 'KR',
      userType: 'company',
      company: 'Rao Logistics Hub',
    },
    content:
      "🎉 Celebrating 10 years in the logistics industry! From 2 trucks to 50+ vehicles, the journey has been incredible. Grateful to every client, driver, and team member. Here's to the next decade! 🚛",
    image: '/mining-truck.jpg',
    timestamp: '2024-03-12T08:30:00Z',
    timeAgo: '3 days ago',
    likes: 634,
    shares: 94,
    comments: [
      {
        id: 'c13',
        author: {
          name: 'Arjun Nair',
          avatar: '/profile.png',
        },
        content: 'Congratulations! Inspiring growth story! 🎊',
        timestamp: '2024-03-12T09:00:00Z',
        timeAgo: '3 days ago',
      },
      {
        id: 'c14',
        author: {
          name: 'Pooja Shah',
          avatar: '/profile.png',
        },
        content: 'Amazing milestone! Wishing you continued success! 🌟',
        timestamp: '2024-03-12T10:00:00Z',
        timeAgo: '3 days ago',
      },
    ],
    isLiked: true,
    category: 'services',
  },
  {
    id: 'feed-10',
    author: {
      name: 'Sanjay Mehta',
      avatar: '/profile.png',
      initials: 'SM',
      userType: 'professional',
      company: 'Freelance Driver',
    },
    content:
      '💡 Pro Tip: Always do a pre-trip inspection. Today I caught a small tire issue that could have become a major problem on the highway. 15 minutes of checking can save hours of trouble!',
    timestamp: '2024-03-11T15:20:00Z',
    timeAgo: '4 days ago',
    likes: 312,
    shares: 78,
    comments: [
      {
        id: 'c15',
        author: {
          name: 'Manish Kumar',
          avatar: '/profile.png',
        },
        content: 'Absolutely right! Prevention is better than cure.',
        timestamp: '2024-03-11T16:00:00Z',
        timeAgo: '4 days ago',
      },
    ],
    isLiked: true,
    category: 'tip',
  },
];

// Mock Bids Data
export const mockBidsData: Record<string, TripBid[]> = {
  'trip-1': [
    {
      id: 'bid-1',
      tripId: 'trip-1',
      bidder: {
        id: 'prof-1',
        name: 'Rajesh Kumar',
        avatar: '/profile.png',
        rating: 4.8,
        totalTrips: 245,
        isVerified: true,
        experience: '8 years',
        phoneNumber: '+91 98765 43210',
      },
      bidAmount: 45000,
      proposedDuration: '18 hours',
      message:
        'I have extensive experience with long-haul trips on this route. I can ensure safe and timely delivery.',
      createdAt: '2024-03-15T10:30:00Z',
      status: 'pending',
    },
    {
      id: 'bid-2',
      tripId: 'trip-1',
      bidder: {
        id: 'prof-2',
        name: 'Suresh Patel',
        avatar: '/profile.png',
        rating: 4.5,
        totalTrips: 180,
        isVerified: true,
        experience: '6 years',
        phoneNumber: '+91 98765 43211',
      },
      bidAmount: 42000,
      proposedDuration: '20 hours',
      message:
        'Competitive pricing with guaranteed delivery. I know this route very well and can handle all cargo types.',
      createdAt: '2024-03-15T11:00:00Z',
      status: 'pending',
    },
    {
      id: 'bid-3',
      tripId: 'trip-1',
      bidder: {
        id: 'prof-3',
        name: 'Vikram Singh',
        avatar: '/profile.png',
        rating: 4.9,
        totalTrips: 320,
        isVerified: true,
        experience: '12 years',
        phoneNumber: '+91 98765 43212',
      },
      bidAmount: 48000,
      proposedDuration: '16 hours',
      message:
        'Premium service with real-time tracking and insurance. I have the fastest delivery record on this route.',
      createdAt: '2024-03-15T09:45:00Z',
      status: 'pending',
    },
    {
      id: 'bid-4',
      tripId: 'trip-1',
      bidder: {
        id: 'prof-4',
        name: 'Amit Sharma',
        avatar: 'profile.png',
        rating: 4.2,
        totalTrips: 95,
        isVerified: false,
        experience: '3 years',
        phoneNumber: '+91 98765 43213',
      },
      bidAmount: 38000,
      proposedDuration: '22 hours',
      message:
        'New to the platform but experienced driver. Offering competitive rates to build my reputation.',
      createdAt: '2024-03-15T12:15:00Z',
      status: 'pending',
    },
    {
      id: 'bid-5',
      tripId: 'trip-1',
      bidder: {
        id: 'prof-5',
        name: 'Mohammed Ali',
        avatar: '/profile.png',
        rating: 4.7,
        totalTrips: 210,
        isVerified: true,
        experience: '7 years',
        phoneNumber: '+91 98765 43214',
      },
      bidAmount: 44000,
      proposedDuration: '19 hours',
      message:
        'Reliable and professional service. I have excellent customer reviews and always deliver on time.',
      createdAt: '2024-03-15T10:00:00Z',
      status: 'pending',
    },
  ],
  'trip-2': [
    {
      id: 'bid-6',
      tripId: 'trip-2',
      bidder: {
        id: 'prof-6',
        name: 'Deepak Verma',
        avatar: '/profile.png',
        rating: 4.6,
        totalTrips: 150,
        isVerified: true,
        experience: '5 years',
        phoneNumber: '+91 98765 43215',
      },
      bidAmount: 32000,
      proposedDuration: '12 hours',
      message:
        'Experienced with express deliveries. Ready to start immediately.',
      createdAt: '2024-03-14T14:00:00Z',
      status: 'pending',
    },
    {
      id: 'bid-7',
      tripId: 'trip-2',
      bidder: {
        id: 'prof-7',
        name: 'Prakash Yadav',
        avatar: '/profile.png',
        rating: 4.4,
        totalTrips: 125,
        isVerified: true,
        experience: '4 years',
        phoneNumber: '+91 98765 43216',
      },
      bidAmount: 30000,
      proposedDuration: '14 hours',
      message:
        'Cost-effective solution with quality service. I have handled similar routes multiple times.',
      createdAt: '2024-03-14T15:30:00Z',
      status: 'pending',
    },
  ],
  'trip-3': [
    {
      id: 'bid-8',
      tripId: 'trip-3',
      bidder: {
        id: 'prof-8',
        name: 'Ramesh Gupta',
        avatar: '/profile.png',
        rating: 4.9,
        totalTrips: 280,
        isVerified: true,
        experience: '10 years',
        phoneNumber: '+91 98765 43217',
      },
      bidAmount: 55000,
      proposedDuration: '24 hours',
      message:
        'Top-rated driver with excellent safety record. Specialized in bulk transport.',
      createdAt: '2024-03-13T08:00:00Z',
      status: 'pending',
    },
  ],
  'trip-7': [
    {
      id: 'bid-9',
      tripId: 'trip-7',
      bidder: {
        id: 'prof-9',
        name: 'Karan Mehta',
        avatar: '/profile.png',
        rating: 4.6,
        totalTrips: 167,
        isVerified: true,
        experience: '5 years',
        phoneNumber: '+91 98765 43218',
      },
      bidAmount: 28000,
      proposedDuration: '5 hours',
      message:
        'I regularly travel this route and know it very well. Can ensure timely delivery.',
      createdAt: '2024-10-04T11:00:00Z',
      status: 'pending',
    },
    {
      id: 'bid-10',
      tripId: 'trip-7',
      bidder: {
        id: 'prof-10',
        name: 'Dinesh Shah',
        avatar: '/profile.png',
        rating: 4.8,
        totalTrips: 225,
        isVerified: true,
        experience: '7 years',
        phoneNumber: '+91 98765 43219',
      },
      bidAmount: 26000,
      proposedDuration: '4.5 hours',
      message:
        'Express delivery specialist. I can complete this trip faster than estimated time with complete safety.',
      createdAt: '2024-10-04T12:30:00Z',
      status: 'pending',
    },
    {
      id: 'bid-11',
      tripId: 'trip-7',
      bidder: {
        id: 'prof-11',
        name: 'Harish Joshi',
        avatar: '/profile.png',
        rating: 4.3,
        totalTrips: 112,
        isVerified: false,
        experience: '4 years',
        phoneNumber: '+91 98765 43220',
      },
      bidAmount: 24000,
      proposedDuration: '5.5 hours',
      message:
        'Competitive pricing with reliable service. Ready to start immediately.',
      createdAt: '2024-10-04T14:00:00Z',
      status: 'pending',
    },
  ],
  'trip-8': [
    {
      id: 'bid-12',
      tripId: 'trip-8',
      bidder: {
        id: 'prof-12',
        name: 'Sandeep Rathore',
        avatar: '/profile.png',
        rating: 4.7,
        totalTrips: 198,
        isVerified: true,
        experience: '6 years',
        phoneNumber: '+91 98765 43221',
      },
      bidAmount: 22000,
      proposedDuration: '4 hours',
      message:
        'Experienced with standard deliveries on this route. Professional and punctual service guaranteed.',
      createdAt: '2024-10-04T13:00:00Z',
      status: 'pending',
    },
    {
      id: 'bid-13',
      tripId: 'trip-8',
      bidder: {
        id: 'prof-13',
        name: 'Anil Kumar',
        avatar: '/profile.png',
        rating: 4.5,
        totalTrips: 143,
        isVerified: true,
        experience: '5 years',
        phoneNumber: '+91 98765 43222',
      },
      bidAmount: 20000,
      proposedDuration: '4.5 hours',
      message:
        'Cost-effective solution with quality service. I have handled similar cargo many times.',
      createdAt: '2024-10-04T15:30:00Z',
      status: 'pending',
    },
  ],
};

// Helper function to get bids for a trip
export const getBidsForTrip = (tripId: string): TripBid[] => {
  return mockBidsData[tripId] || [];
};

// Mock Services Data (Listed by Business users)
export const mockServices: Service[] = [
  {
    id: 'srv-1',
    businessId: 'bus-1',
    businessName: 'AutoCare Pro Services',
    businessAvatar: '/profile.png',
    serviceName: 'Comprehensive Fleet Maintenance',
    category: 'maintenance',
    description:
      'Complete maintenance and repair services for commercial vehicles including routine servicing, diagnostics, and emergency repairs.',
    detailedDescription:
      'Our certified technicians provide 24/7 maintenance support with genuine parts, preventive maintenance schedules, and quick turnaround times. We specialize in heavy commercial vehicles and mining equipment.',
    pricing: {
      type: 'quote-based',
      details:
        'Custom quotes based on vehicle type and service requirements. Starting from ₹5,000 per service.',
    },
    availability: {
      status: 'available',
      coverage: ['Pan India', 'Major Cities'],
      responseTime: '< 4 hours',
    },
    rating: 4.8,
    reviewCount: 234,
    certifications: ['ISO 9001:2015', 'Authorized Service Center'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12345',
      email: 'contact@autocarepro.com',
      website: 'www.autocarepro.com',
    },
    images: ['/truck-01.jpg', '/mining-truck.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: [
      'Fleet Maintenance',
      'Emergency Repairs',
      '24/7 Service',
      'Certified',
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-20T14:30:00Z',
  },
  {
    id: 'srv-2',
    businessId: 'bus-2',
    businessName: 'Premium Parts Solutions',
    businessAvatar: '/profile.png',
    serviceName: 'Genuine Vehicle Parts Supply',
    category: 'parts-supply',
    description:
      'Supplier of genuine OEM parts for trucks, buses, and heavy vehicles with pan-India delivery.',
    detailedDescription:
      'We stock over 50,000 genuine parts from leading manufacturers. Same-day delivery available in metro cities. Bulk discounts for fleet owners.',
    pricing: {
      type: 'fixed',
      amount: 0,
      currency: 'INR',
      details:
        'Competitive pricing on all parts. Volume discounts available. Request quote for specific parts.',
    },
    availability: {
      status: 'available',
      coverage: ['Pan India', 'Express Delivery Available'],
      responseTime: '< 2 hours',
    },
    rating: 4.9,
    reviewCount: 456,
    certifications: ['Authorized Dealer', 'Quality Assured'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12346',
      email: 'sales@premiumparts.com',
      website: 'www.premiumparts.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: ['Genuine Parts', 'OEM', 'Fast Delivery', 'Bulk Discounts'],
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-10-01T11:00:00Z',
  },
  {
    id: 'srv-3',
    businessId: 'bus-3',
    businessName: 'FuelFlow Networks',
    businessAvatar: '/profile.png',
    serviceName: 'Bulk Fuel Supply & Management',
    category: 'fuel',
    description:
      'Reliable bulk fuel supply with competitive pricing and doorstep delivery for fleet operations.',
    detailedDescription:
      'We provide diesel and petrol in bulk quantities with transparent pricing, fuel management systems, and digital payment options. Perfect for logistics companies and fleet operators.',
    pricing: {
      type: 'quote-based',
      details:
        'Market-linked pricing with volume discounts. Daily/weekly delivery schedules available.',
    },
    availability: {
      status: 'available',
      coverage: ['North India', 'Central India'],
      responseTime: '24 hours',
    },
    rating: 4.6,
    reviewCount: 189,
    certifications: ['Licensed Supplier', 'Safety Certified'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12347',
      email: 'orders@fuelflow.com',
      website: 'www.fuelflow.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: ['Bulk Fuel', 'Diesel', 'Petrol', 'Doorstep Delivery'],
    createdAt: '2024-03-05T08:00:00Z',
    updatedAt: '2024-09-28T16:00:00Z',
  },
  {
    id: 'srv-4',
    businessId: 'bus-4',
    businessName: 'Shield Insurance Co.',
    businessAvatar: '/profile.png',
    serviceName: 'Comprehensive Fleet Insurance',
    category: 'insurance',
    description:
      'Complete insurance solutions for commercial vehicles with comprehensive coverage and quick claim processing.',
    detailedDescription:
      'We offer customized insurance packages for fleet owners including third-party, comprehensive, and add-on covers. Zero depreciation available. 24/7 claim support.',
    pricing: {
      type: 'quote-based',
      details:
        'Premium calculated based on vehicle type, age, and coverage. Starting from ₹15,000/year per vehicle.',
    },
    availability: {
      status: 'available',
      coverage: ['Pan India'],
      responseTime: 'Instant',
    },
    rating: 4.9,
    reviewCount: 567,
    certifications: ['IRDAI Registered', 'ISO Certified'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12348',
      email: 'support@shieldinsurance.com',
      website: 'www.shieldinsurance.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: [
      'Vehicle Insurance',
      'Fleet Coverage',
      'Quick Claims',
      'Zero Depreciation',
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-10-02T09:00:00Z',
  },
  {
    id: 'srv-5',
    businessId: 'bus-5',
    businessName: 'EasyLease Finance',
    businessAvatar: '/profile.png',
    serviceName: 'Vehicle Financing & Leasing',
    category: 'financing',
    description:
      'Flexible financing and leasing options for commercial vehicles with competitive interest rates.',
    detailedDescription:
      'Get your fleet financed with minimal documentation. We offer loans up to 90% of vehicle value with flexible repayment options. Quick approval within 48 hours.',
    pricing: {
      type: 'quote-based',
      details:
        'Interest rates starting from 8.5% p.a. Processing fee: 1% of loan amount.',
    },
    availability: {
      status: 'available',
      coverage: ['Pan India'],
      responseTime: '< 24 hours',
    },
    rating: 4.7,
    reviewCount: 298,
    certifications: ['RBI Registered NBFC', 'CIBIL Certified'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12349',
      email: 'loans@easylease.com',
      website: 'www.easylease.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: ['Vehicle Finance', 'Leasing', 'Low Interest', 'Quick Approval'],
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-09-25T15:00:00Z',
  },
  {
    id: 'srv-6',
    businessId: 'bus-6',
    businessName: 'LogiTrack Solutions',
    businessAvatar: '/profile.png',
    serviceName: 'GPS Tracking & Fleet Management',
    category: 'logistics-support',
    description:
      'Advanced GPS tracking systems with real-time monitoring and fleet management software.',
    detailedDescription:
      'Monitor your entire fleet in real-time with our IoT-enabled tracking devices. Get alerts, route optimization, fuel monitoring, and detailed analytics dashboard.',
    pricing: {
      type: 'subscription',
      amount: 500,
      currency: 'INR',
      details:
        '₹500 per vehicle per month. Device installation: ₹3,000 (one-time)',
    },
    availability: {
      status: 'available',
      coverage: ['Pan India'],
      responseTime: '< 48 hours',
    },
    rating: 4.8,
    reviewCount: 412,
    certifications: ['ISO 27001', 'AIS 140 Certified'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12350',
      email: 'sales@logitrack.com',
      website: 'www.logitrack.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: ['GPS Tracking', 'Fleet Management', 'Real-time Monitoring', 'IoT'],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-10-03T12:00:00Z',
  },
  {
    id: 'srv-7',
    businessId: 'bus-7',
    businessName: 'DriveSkill Academy',
    businessAvatar: '/profile.png',
    serviceName: 'Commercial Driver Training',
    category: 'training',
    description:
      'Professional training programs for commercial vehicle drivers with certification.',
    detailedDescription:
      'We offer comprehensive training covering safe driving practices, vehicle handling, route planning, and regulatory compliance. Government-certified courses available.',
    pricing: {
      type: 'fixed',
      amount: 15000,
      currency: 'INR',
      details: '₹15,000 per driver for complete certification course (4 weeks)',
    },
    availability: {
      status: 'available',
      coverage: ['Major Cities', 'Training Centers Available'],
      responseTime: '< 72 hours',
    },
    rating: 4.9,
    reviewCount: 523,
    certifications: ['Government Certified', 'NSDC Approved'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12351',
      email: 'admission@driveskill.com',
      website: 'www.driveskill.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: [
      'Driver Training',
      'Certification',
      'Safety Training',
      'Professional',
    ],
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-09-30T10:00:00Z',
  },
  {
    id: 'srv-8',
    businessId: 'bus-8',
    businessName: 'TireCare Express',
    businessAvatar: '/profile.png',
    serviceName: 'Mobile Tire Service & Sales',
    category: 'maintenance',
    description:
      'On-site tire replacement, repair, and sales service with 24/7 emergency support.',
    detailedDescription:
      'We bring the tire service to your location. Wide range of commercial vehicle tires from top brands. Emergency puncture repair and replacement available round the clock.',
    pricing: {
      type: 'fixed',
      amount: 0,
      currency: 'INR',
      details:
        'Tire prices vary by brand and size. Emergency service fee: ₹1,000. Free inspection.',
    },
    availability: {
      status: 'available',
      coverage: ['Metro Cities', 'Highway Network'],
      responseTime: '< 3 hours',
    },
    rating: 4.7,
    reviewCount: 287,
    certifications: ['Authorized Dealer', 'Safety Certified'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12352',
      email: 'service@tirecare.com',
      website: 'www.tirecare.com',
    },
    images: ['/tires.png'],
    featuredImage: '/tires.png',
    tags: ['Tire Service', '24/7 Emergency', 'Mobile Service', 'Top Brands'],
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-10-04T14:00:00Z',
  },
  {
    id: 'srv-9',
    businessId: 'bus-9',
    businessName: 'SafeHaul Consulting',
    businessAvatar: '/profile.png',
    serviceName: 'Logistics Compliance Consulting',
    category: 'logistics-support',
    description:
      'Expert consulting for logistics compliance, permits, and regulatory documentation.',
    detailedDescription:
      'Navigate complex transport regulations with our expert guidance. We handle permits, licenses, compliance audits, and documentation for smooth operations.',
    pricing: {
      type: 'hourly',
      amount: 2000,
      currency: 'INR',
      details:
        '₹2,000 per hour consultation. Package deals available for ongoing support.',
    },
    availability: {
      status: 'available',
      coverage: ['Pan India', 'Remote Consulting'],
      responseTime: '< 12 hours',
    },
    rating: 4.8,
    reviewCount: 156,
    certifications: ['Legal Expert', 'Transport Authority Certified'],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12353',
      email: 'consult@safehaul.com',
      website: 'www.safehaul.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: ['Compliance', 'Permits', 'Legal Support', 'Consulting'],
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-09-27T13:00:00Z',
  },
  {
    id: 'srv-10',
    businessId: 'bus-10',
    businessName: 'CargoCare Insurance',
    businessAvatar: '/profile.png',
    serviceName: 'Cargo & Goods Transit Insurance',
    category: 'insurance',
    description:
      'Specialized insurance coverage for goods in transit with comprehensive protection.',
    detailedDescription:
      'Protect your cargo with our comprehensive transit insurance. Coverage for all types of goods, natural calamities, theft, and accidents. Quick claim settlement.',
    pricing: {
      type: 'quote-based',
      details:
        'Premium based on cargo value and route. Typically 0.5% to 2% of cargo value.',
    },
    availability: {
      status: 'available',
      coverage: ['Pan India', 'International Routes'],
      responseTime: 'Instant',
    },
    rating: 4.9,
    reviewCount: 378,
    certifications: ['IRDAI Registered', "Lloyd's Approved"],
    isVerified: true,
    contactInfo: {
      phone: '+91 98765 12354',
      email: 'claims@cargocare.com',
      website: 'www.cargocare.com',
    },
    images: ['/truck-01.jpg'],
    featuredImage: '/truck-01.jpg',
    tags: [
      'Cargo Insurance',
      'Transit Coverage',
      'Quick Claims',
      'International',
    ],
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-10-05T09:00:00Z',
  },
];

// Mock Service Assignments
export const mockServiceAssignments: ServiceAssignment[] = [
  {
    id: 'asg-1',
    serviceId: 'srv-1',
    service: mockServices[0],
    companyId: 'comp-1',
    companyName: 'LogiTrans Corp',
    assignedDate: '2024-09-15T10:00:00Z',
    startDate: '2024-09-20T08:00:00Z',
    status: 'active',
    priority: 'high',
    requirements: 'Monthly maintenance schedule for 5 vehicles',
    assignedTo: {
      vehicleId: 'veh-1',
    },
    cost: 25000,
    notes: 'Service scheduled for 3rd week of every month',
    lastUpdated: '2024-10-01T14:00:00Z',
  },
  {
    id: 'asg-2',
    serviceId: 'srv-6',
    service: mockServices[5],
    companyId: 'comp-1',
    companyName: 'LogiTrans Corp',
    assignedDate: '2024-08-10T11:00:00Z',
    startDate: '2024-08-15T09:00:00Z',
    status: 'active',
    priority: 'medium',
    requirements: 'GPS tracking installation for entire fleet (15 vehicles)',
    cost: 52500,
    notes: 'Subscription active, monthly billing',
    lastUpdated: '2024-10-04T10:00:00Z',
  },
  {
    id: 'asg-3',
    serviceId: 'srv-4',
    service: mockServices[3],
    companyId: 'comp-1',
    companyName: 'LogiTrans Corp',
    assignedDate: '2024-07-01T10:00:00Z',
    startDate: '2024-07-05T00:00:00Z',
    endDate: '2025-07-04T23:59:59Z',
    status: 'active',
    priority: 'high',
    requirements: 'Comprehensive insurance for 20 vehicles',
    cost: 380000,
    notes: 'Annual policy, renewal due July 2025',
    lastUpdated: '2024-09-15T12:00:00Z',
  },
];

// Mock Service Enquiries
export const mockServiceEnquiries: ServiceEnquiry[] = [
  {
    id: 'enq-1',
    serviceId: 'srv-5',
    service: mockServices[4],
    companyId: 'comp-1',
    companyName: 'LogiTrans Corp',
    enquiryDate: '2024-10-03T14:30:00Z',
    status: 'responded',
    subject: 'Financing for 3 new trucks',
    message:
      'We are looking to finance 3 new Tata trucks. Please provide loan terms, interest rates, and required documentation.',
    response: {
      message:
        "Thank you for your enquiry. We can offer financing up to 85% of vehicle value at 8.7% p.a. for 5 years. I've sent detailed information to your email. We can process your application within 48 hours.",
      respondedBy: 'Rakesh Kumar - EasyLease Finance',
      respondedAt: '2024-10-03T16:00:00Z',
    },
    priority: 'high',
  },
  {
    id: 'enq-2',
    serviceId: 'srv-7',
    service: mockServices[6],
    companyId: 'comp-1',
    companyName: 'LogiTrans Corp',
    enquiryDate: '2024-10-05T10:15:00Z',
    status: 'pending',
    subject: 'Bulk training for 8 new drivers',
    message:
      'We need to train 8 newly hired drivers for commercial vehicle operation. Can you accommodate bulk training and offer any group discounts?',
    priority: 'medium',
  },
  {
    id: 'enq-3',
    serviceId: 'srv-10',
    service: mockServices[9],
    companyId: 'comp-1',
    companyName: 'LogiTrans Corp',
    enquiryDate: '2024-09-28T11:00:00Z',
    status: 'converted',
    subject: 'Transit insurance for high-value cargo',
    message:
      'Need comprehensive transit insurance for electronics cargo worth ₹50 lakhs from Mumbai to Delhi.',
    response: {
      message:
        'We can provide complete coverage for your cargo. Premium would be 1.2% of cargo value (₹60,000). Policy documents sent for your review.',
      respondedBy: 'Priya Sharma - CargoCare Insurance',
      respondedAt: '2024-09-28T14:00:00Z',
    },
    followUps: [
      {
        message:
          'Approved and proceeding with the policy. Please send payment link.',
        by: 'company',
        timestamp: '2024-09-29T09:00:00Z',
      },
      {
        message:
          'Payment link sent. Policy will be active immediately upon payment confirmation.',
        by: 'business',
        timestamp: '2024-09-29T09:30:00Z',
      },
    ],
    priority: 'high',
  },
];

// Company Dashboard Data Structure
export interface DashboardStats {
  activeTrips: {
    value: number;
    scheduledToday: number;
    inMaintenance: number;
  };
  monthlyExpenses: {
    value: number;
    highestSpending: string;
  };
  tripEfficiency: {
    value: string;
    unit: string;
  };
  vehiclesOnRent: {
    value: number;
  };
}

export interface VehicleAvailability {
  available: number;
  onTrip: number;
  onRent: number;
}

export interface TopRatedPerson {
  id: string;
  name: string;
  role: 'Driver' | 'Technician' | 'Helper';
  rating: number;
  location: string;
  avatar: string;
}

export interface JobPosted {
  id: string;
  title: string;
  applicants: number;
  likes: number;
  status: 'Active' | 'Paused' | 'Closed';
}

export interface DashboardExpenseCategory {
  category: 'Advance' | 'Fuel' | 'Chalan' | 'Food' | 'Salary' | 'Enroute';
  amount: number;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'Fuel' | 'Maintenance' | 'Salary' | 'Other';
  description: string;
  date: string;
  amount: number;
  icon: string;
}

export interface AssignedService {
  id: string;
  title: string;
  description: string;
  status: 'Tyre Repair!' | 'Engine' | 'Active';
  updatedAt: string;
  backgroundColor: string;
}

export interface TripCompletionData {
  day: string;
  trips: number;
}

export interface CompanyDashboardData {
  stats: DashboardStats;
  vehicleAvailability: VehicleAvailability;
  topRated: {
    drivers: TopRatedPerson[];
    technicians: TopRatedPerson[];
    helpers: TopRatedPerson[];
  };
  jobsPosted: JobPosted[];
  expenseOverview: {
    total: number;
    categories: DashboardExpenseCategory[];
  };
  recentTransactions: Transaction[];
  assignedServices: AssignedService[];
  tripCompletionTrend: TripCompletionData[];
  upcomingTrips: Array<{
    id: string;
    title: string;
    time: string;
    driver: string;
    route: string;
  }>;
}

export const companyDashboardData: CompanyDashboardData = {
  stats: {
    activeTrips: {
      value: 25,
      scheduledToday: 5,
      inMaintenance: 2,
    },
    monthlyExpenses: {
      value: 265000,
      highestSpending: 'Fuel',
    },
    tripEfficiency: {
      value: '₹3/km Avg',
      unit: '15,002 km',
    },
    vehiclesOnRent: {
      value: 4,
    },
  },
  vehicleAvailability: {
    available: 12,
    onTrip: 5,
    onRent: 1,
  },
  topRated: {
    drivers: [
      {
        id: 'd1',
        name: 'Sanjana Mehta',
        role: 'Driver',
        rating: 4.8,
        location: 'South Zone',
        avatar: '/staring-man.jpg',
      },
      {
        id: 'd2',
        name: 'Kiran Kumar',
        role: 'Driver',
        rating: 4.7,
        location: 'North Zone',
        avatar: '/staring-man.jpg',
      },
    ],
    technicians: [
      {
        id: 't1',
        name: 'Rahul Sharma',
        role: 'Technician',
        rating: 4.9,
        location: 'Workshop A',
        avatar: '/staring-man.jpg',
      },
    ],
    helpers: [
      {
        id: 'h1',
        name: 'Amit Singh',
        role: 'Helper',
        rating: 4.6,
        location: 'Warehouse',
        avatar: '/staring-man.jpg',
      },
    ],
  },
  jobsPosted: [
    {
      id: 'job-1',
      title: 'Driver Mumbai',
      applicants: 8,
      likes: 35,
      status: 'Active',
    },
    {
      id: 'job-2',
      title: 'Technician Pune',
      applicants: 4,
      likes: 10,
      status: 'Active',
    },
  ],
  expenseOverview: {
    total: 12340,
    categories: [
      { category: 'Advance', amount: 2500, color: '#FF6B6B' },
      { category: 'Fuel', amount: 3200, color: '#4ECDC4' },
      { category: 'Chalan', amount: 800, color: '#FFE66D' },
      { category: 'Food', amount: 1500, color: '#95E1D3' },
      { category: 'Salary', amount: 3500, color: '#A8E6CF' },
      { category: 'Enroute', amount: 840, color: '#C7CEEA' },
    ],
  },
  recentTransactions: [
    {
      id: 'txn-1',
      type: 'Fuel',
      description: 'Petrol • Diesel',
      date: '25 May',
      amount: 12000,
      icon: 'fuel',
    },
    {
      id: 'txn-2',
      type: 'Maintenance',
      description: 'Break Repair!',
      date: '24 May',
      amount: 3500,
      icon: 'maintenance',
    },
  ],
  assignedServices: [
    {
      id: 'srv-1',
      title: 'Tyre Replacement',
      description:
        'Professional tyre replacement service for all vehicle types',
      status: 'Tyre Repair!',
      updatedAt: '2 days ago',
      backgroundColor: '#FFF5F5',
    },
    {
      id: 'srv-2',
      title: 'Engine Diagnostics',
      description: 'Complete diagnostic and repair services',
      status: 'Engine',
      updatedAt: '1 day ago',
      backgroundColor: '#F0F9FF',
    },
  ],
  tripCompletionTrend: [
    { day: 'Mon', trips: 18 },
    { day: 'Tue', trips: 22 },
    { day: 'Wed', trips: 24 },
    { day: 'Thurs', trips: 19 },
    { day: 'Fri', trips: 26 },
    { day: 'Sat', trips: 24 },
    { day: 'Sun', trips: 16 },
  ],
  upcomingTrips: [
    {
      id: 'trip-1',
      title: 'Trip #TR1042',
      time: '28 May, 07:00 AM',
      driver: 'Driver: A. Rojan',
      route: 'Chennai → Pune',
    },
    {
      id: 'trip-2',
      title: 'Trip #TR1042',
      time: '28 May, 07:00 AM',
      driver: 'Driver: A. Rojan',
      route: 'Chennai → Pune',
    },
  ],
};

// Business Service Listings Data Structure
export interface ServiceListing {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  detailedDescription?: string;
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
  businessId: string;
  businessName: string;
  pricing?: {
    type: 'fixed' | 'hourly' | 'quote' | 'package';
    amount?: number;
    currency: string;
    details?: string;
  };
  availability?: {
    days: string[];
    hours: string;
  };
  location?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  images?: string[];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
}

export interface BusinessServiceData {
  myServices: ServiceListing[];
  allServices: ServiceListing[];
}

export const businessServiceListings: BusinessServiceData = {
  myServices: [
    {
      id: 'svc-1',
      title: 'Tyre Replacement',
      category: 'Tyre Repair',
      categoryColor: '#E3F2FD',
      description:
        'Professional tyre replacement service for all vehicle types',
      detailedDescription:
        'Comprehensive tyre replacement service including balancing, alignment, and quality assurance. We use premium quality tyres suitable for all vehicle types including trucks, buses, and heavy machinery.',
      status: 'Published',
      createdAt: '2025-10-04T10:00:00Z',
      updatedAt: '2025-10-04T10:00:00Z',
      businessId: 'bus-1',
      businessName: 'TyreMaster Services',
      pricing: {
        type: 'fixed',
        amount: 2500,
        currency: '₹',
        details: 'Per tyre including fitting',
      },
      availability: {
        days: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        hours: '8:00 AM - 6:00 PM',
      },
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'contact@tyremaster.com',
      },
      images: ['/tires.png'],
      tags: ['Tyre', 'Replacement', 'Professional'],
      rating: 4.8,
      reviewCount: 156,
      completedJobs: 342,
    },
    {
      id: 'svc-2',
      title: 'Engine Diagnostics',
      category: 'Engine',
      categoryColor: '#F3E5F5',
      description: 'Complete engine diagnostic and repair services',
      detailedDescription:
        'Advanced engine diagnostics using latest computerized equipment. We identify and fix all engine-related issues including performance problems, emissions, and fuel efficiency.',
      status: 'Published',
      createdAt: '2025-10-03T14:30:00Z',
      updatedAt: '2025-10-05T09:15:00Z',
      businessId: 'bus-1',
      businessName: 'TyreMaster Services',
      pricing: {
        type: 'quote',
        currency: '₹',
        details: 'Based on diagnosis',
      },
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '9:00 AM - 5:00 PM',
      },
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'contact@tyremaster.com',
      },
      images: ['/excavator.jpg'],
      tags: ['Engine', 'Diagnostics', 'Repair'],
      rating: 4.9,
      reviewCount: 203,
      completedJobs: 578,
    },
    {
      id: 'svc-3',
      title: 'Oil Change Service',
      category: 'Oil',
      categoryColor: '#FFF9C4',
      description: 'Quick and efficient oil change for all vehicles',
      detailedDescription:
        'Professional oil change service using premium quality engine oils. Includes oil filter replacement and comprehensive 21-point vehicle inspection.',
      status: 'Draft',
      createdAt: '2025-10-02T16:45:00Z',
      updatedAt: '2025-10-02T16:45:00Z',
      businessId: 'bus-1',
      businessName: 'TyreMaster Services',
      pricing: {
        type: 'package',
        amount: 1500,
        currency: '₹',
        details: 'Including premium oil and filter',
      },
      availability: {
        days: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        hours: '8:00 AM - 7:00 PM',
      },
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'contact@tyremaster.com',
      },
      images: ['/truck-01.jpg'],
      tags: ['Oil Change', 'Quick Service', 'Maintenance'],
      rating: 4.7,
      reviewCount: 89,
      completedJobs: 234,
    },
    {
      id: 'svc-4',
      title: 'Brake Inspection',
      category: 'Brake',
      categoryColor: '#FFEBEE',
      description: 'Comprehensive brake system inspection and repair',
      detailedDescription:
        'Thorough brake system inspection covering brake pads, rotors, calipers, and brake fluid. Expert technicians ensure your vehicle safety with premium replacement parts.',
      status: 'Published',
      createdAt: '2025-10-01T11:20:00Z',
      updatedAt: '2025-10-01T11:20:00Z',
      businessId: 'bus-1',
      businessName: 'TyreMaster Services',
      pricing: {
        type: 'fixed',
        amount: 3500,
        currency: '₹',
        details: 'Complete inspection and minor repairs',
      },
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '9:00 AM - 6:00 PM',
      },
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'contact@tyremaster.com',
      },
      images: ['/black-truck.png'],
      tags: ['Brake', 'Safety', 'Inspection'],
      rating: 4.8,
      reviewCount: 167,
      completedJobs: 445,
    },
    {
      id: 'svc-5',
      title: 'Battery Replacement',
      category: 'Battery',
      categoryColor: '#E0F2F1',
      description: 'Professional battery testing and replacement service',
      detailedDescription:
        'Complete battery diagnostics and replacement using premium branded batteries. Free battery testing and installation with warranty coverage.',
      status: 'Published',
      createdAt: '2025-09-30T13:10:00Z',
      updatedAt: '2025-09-30T13:10:00Z',
      businessId: 'bus-1',
      businessName: 'TyreMaster Services',
      pricing: {
        type: 'fixed',
        amount: 4500,
        currency: '₹',
        details: 'Including battery and installation',
      },
      availability: {
        days: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        hours: '8:00 AM - 6:00 PM',
      },
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'contact@tyremaster.com',
      },
      images: ['/yellow-truck.jpg'],
      tags: ['Battery', 'Replacement', 'Warranty'],
      rating: 4.6,
      reviewCount: 98,
      completedJobs: 267,
    },
    {
      id: 'svc-6',
      title: 'AC Service & Repair',
      category: 'AC',
      categoryColor: '#E8F5E9',
      description: 'Complete air conditioning service and repair',
      detailedDescription:
        'Professional AC servicing including gas refilling, compressor repair, and cooling system maintenance. Expert diagnosis and repair for optimal cooling performance.',
      status: 'Draft',
      createdAt: '2025-09-29T15:30:00Z',
      updatedAt: '2025-09-29T15:30:00Z',
      businessId: 'bus-1',
      businessName: 'TyreMaster Services',
      pricing: {
        type: 'quote',
        currency: '₹',
        details: 'Based on service required',
      },
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '9:00 AM - 5:00 PM',
      },
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'contact@tyremaster.com',
      },
      images: ['/bus.jpg'],
      tags: ['AC', 'Cooling', 'Repair'],
      rating: 4.7,
      reviewCount: 134,
      completedJobs: 312,
    },
  ],
  allServices: [
    {
      id: 'svc-101',
      title: 'Fleet Maintenance Package',
      category: 'Maintenance',
      categoryColor: '#FFF3E0',
      description:
        'Comprehensive fleet maintenance service for commercial vehicles',
      detailedDescription:
        'Complete fleet maintenance solution including scheduled servicing, emergency repairs, and preventive maintenance for commercial fleets.',
      status: 'Published',
      createdAt: '2025-10-05T10:00:00Z',
      updatedAt: '2025-10-05T10:00:00Z',
      businessId: 'bus-2',
      businessName: 'FleetCare Solutions',
      pricing: {
        type: 'package',
        amount: 15000,
        currency: '₹',
        details: 'Monthly package per vehicle',
      },
      availability: {
        days: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        hours: '24/7 Available',
      },
      location: 'Delhi, NCR',
      contactInfo: {
        phone: '+91 98888 12345',
        email: 'support@fleetcare.com',
      },
      images: ['/truck-cta.png'],
      tags: ['Fleet', 'Maintenance', 'Commercial'],
      rating: 4.9,
      reviewCount: 287,
      completedJobs: 1245,
    },
    {
      id: 'svc-102',
      title: 'Hydraulic System Repair',
      category: 'Hydraulic',
      categoryColor: '#E1F5FE',
      description: 'Expert hydraulic system diagnostics and repair',
      detailedDescription:
        'Specialized hydraulic system repair for heavy machinery and commercial vehicles. Expert technicians with advanced diagnostic tools.',
      status: 'Published',
      createdAt: '2025-10-04T14:20:00Z',
      updatedAt: '2025-10-04T14:20:00Z',
      businessId: 'bus-3',
      businessName: 'HydroTech Services',
      pricing: {
        type: 'hourly',
        amount: 800,
        currency: '₹',
        details: 'Per hour plus parts',
      },
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '8:00 AM - 6:00 PM',
      },
      location: 'Bangalore, Karnataka',
      contactInfo: {
        phone: '+91 99999 54321',
        email: 'info@hydrotech.com',
      },
      images: ['/bulldozer.png'],
      tags: ['Hydraulic', 'Heavy Machinery', 'Expert'],
      rating: 4.8,
      reviewCount: 176,
      completedJobs: 523,
    },
  ],
};

// KYC Related Types and Functions
export interface KYCDocuments {
  aadharCard: 'verified' | 'pending' | 'missing';
  panCard: 'verified' | 'pending' | 'missing';
  drivingLicense: 'verified' | 'pending' | 'missing';
  bankAccount: 'verified' | 'pending' | 'missing';
  profilePhoto: 'verified' | 'pending' | 'missing';
}

export interface KYCData {
  userId: string;
  progress: number;
  documents: KYCDocuments;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId?: string;
  };
  updatedAt: string;
}

// Mock KYC database
const mockKYCData: { [userId: string]: KYCData } = {
  '1': {
    userId: '1',
    progress: 40,
    documents: {
      aadharCard: 'pending',
      panCard: 'missing',
      drivingLicense: 'missing',
      bankAccount: 'pending',
      profilePhoto: 'verified',
    },
    updatedAt: new Date().toISOString(),
  },
};

// Get KYC Status
export const getKYCStatus = async (userId: string): Promise<KYCData> => {
  await simulateDelay(500);

  if (mockKYCData[userId]) {
    return mockKYCData[userId];
  }

  // Return default KYC data for new users
  const defaultKYC: KYCData = {
    userId,
    progress: 0,
    documents: {
      aadharCard: 'missing',
      panCard: 'missing',
      drivingLicense: 'missing',
      bankAccount: 'missing',
      profilePhoto: 'missing',
    },
    updatedAt: new Date().toISOString(),
  };

  mockKYCData[userId] = defaultKYC;
  return defaultKYC;
};

// Upload KYC Document
export const uploadKYCDocument = async (
  userId: string,
  documentType: 'aadhar' | 'pan' | 'license' | 'photo',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  file: File
): Promise<{ success: boolean; message: string }> => {
  await simulateDelay(1000);

  if (!mockKYCData[userId]) {
    mockKYCData[userId] = {
      userId,
      progress: 0,
      documents: {
        aadharCard: 'missing',
        panCard: 'missing',
        drivingLicense: 'missing',
        bankAccount: 'missing',
        profilePhoto: 'missing',
      },
      updatedAt: new Date().toISOString(),
    };
  }

  // Update document status to pending
  const documentMap: { [key: string]: keyof KYCDocuments } = {
    aadhar: 'aadharCard',
    pan: 'panCard',
    license: 'drivingLicense',
    photo: 'profilePhoto',
  };

  const docKey = documentMap[documentType];
  mockKYCData[userId].documents[docKey] = 'pending';
  mockKYCData[userId].updatedAt = new Date().toISOString();

  // Calculate progress
  const docs = mockKYCData[userId].documents;
  const uploadedCount = Object.values(docs).filter(
    (status) => status !== 'missing'
  ).length;
  mockKYCData[userId].progress = Math.round((uploadedCount / 5) * 100);

  return {
    success: true,
    message: `${documentType} uploaded successfully. Verification pending.`,
  };
};

// Update Bank Details
export const updateBankDetails = async (
  userId: string,
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId?: string;
  }
): Promise<{ success: boolean; message: string }> => {
  await simulateDelay(800);

  if (!mockKYCData[userId]) {
    mockKYCData[userId] = {
      userId,
      progress: 0,
      documents: {
        aadharCard: 'missing',
        panCard: 'missing',
        drivingLicense: 'missing',
        bankAccount: 'missing',
        profilePhoto: 'missing',
      },
      updatedAt: new Date().toISOString(),
    };
  }

  // Store bank details (without confirming account number)
  mockKYCData[userId].bankDetails = {
    accountHolderName: bankDetails.accountHolderName,
    accountNumber: bankDetails.accountNumber,
    ifscCode: bankDetails.ifscCode,
    bankName: bankDetails.bankName,
    upiId: bankDetails.upiId,
  };
  mockKYCData[userId].documents.bankAccount = 'pending';
  mockKYCData[userId].updatedAt = new Date().toISOString();

  // Calculate progress
  const docs = mockKYCData[userId].documents;
  const uploadedCount = Object.values(docs).filter(
    (status) => status !== 'missing'
  ).length;
  mockKYCData[userId].progress = Math.round((uploadedCount / 5) * 100);

  return {
    success: true,
    message: 'Bank details updated successfully.',
  };
};

// Verify KYC Document (Admin function - for simulation)
export const verifyKYCDocument = async (
  userId: string,
  documentType: keyof KYCDocuments
): Promise<{ success: boolean; message: string }> => {
  await simulateDelay(500);

  if (!mockKYCData[userId]) {
    return {
      success: false,
      message: 'User KYC data not found',
    };
  }

  mockKYCData[userId].documents[documentType] = 'verified';
  mockKYCData[userId].updatedAt = new Date().toISOString();

  // Calculate progress
  const docs = mockKYCData[userId].documents;
  const verifiedCount = Object.values(docs).filter(
    (status) => status === 'verified'
  ).length;
  mockKYCData[userId].progress = Math.round((verifiedCount / 5) * 100);

  return {
    success: true,
    message: `${documentType} verified successfully.`,
  };
};
