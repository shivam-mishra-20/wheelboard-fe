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
      ];
    case 'business':
      return [
        { id: 'home', label: 'Home', href: '/business/home' },
        { id: 'listings', label: 'Listings', href: '/business/listings' },
        { id: 'feeds', label: 'Feeds', href: '/business/feeds' },
        { id: 'jobs', label: 'Jobs', href: '/business/jobs' },
      ];
    case 'professional':
      return [
        { id: 'home', label: 'Home', href: '/professional/home' },
        { id: 'search', label: 'Search', href: '/professional/search' },
        { id: 'trips', label: 'Trips', href: '/professional/trips' },
        { id: 'feeds', label: 'Feeds', href: '/professional/feeds' },
        { id: 'jobs', label: 'Jobs', href: '/professional/jobs' },
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
      return '/profile-pic.png';
    case 'business':
      return '/business-profile.png';
    case 'professional':
      return '/professional-profile.png';
    default:
      return '/profile-pic.png';
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
  };
  title: string;
  description: string;
  image: string;
  timeAgo: string;
}

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
          avatar: '/profile-pic.png',
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
          avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
        initials: 'D',
      },
      title: 'Tips For Fleet Management',
      description:
        'Learn how to optimize your fleet operations and reduce maintenance costs effectively',
      image: '/image.png',
      timeAgo: 'Posted 2 days ago',
    },
  ] as FeedPost[],
};

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
          reviewerAvatar: '/profile-pic.png',
          rating: 5,
          comment: 'Excellent driver, always on time and very professional.',
          date: '2025-09-15',
        },
        {
          id: 'r2',
          reviewerName: 'Priya Singh',
          reviewerAvatar: '/profile-pic.png',
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
          reviewerAvatar: '/profile-pic.png',
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
          reviewerAvatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
        avatar: '/profile-pic.png',
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
