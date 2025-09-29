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

    // In a real app, we'd verify the password hash
    if (credentials.password.length < 6) {
      return {
        success: false,
        message: 'Invalid password. Please try again.',
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
      image: '/live-truck.gif',
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
      image: '/live-truck-01.gif',
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
      image: '/live-truck.gif',
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
      image: '/live-truck-01.gif',
      timeAgo: 'Posted 2 days ago',
    },
  ] as FeedPost[],
};

export const companyFleetData = {
  vehicles: [
    {
      id: 'v1',
      name: 'Omni Van',
      year: 1998,
      status: 'Attached',
      lastService: 'Last service: 12 Jan',
      location: 'Current: Delhi',
      image: '/VAN 1.png',
    },
    {
      id: 'v2',
      name: 'Tata',
      year: 2007,
      status: 'Owned',
      lastService: 'Last service: 20 Feb',
      location: 'Current: Mumbai',
      image: '/truck-01.jpg',
    },
    {
      id: 'v3',
      name: 'Mercedes-Benz',
      year: 2019,
      status: 'Rented',
      lastService: 'Last service: 5 Mar',
      location: 'Current: Bangalore',
      image: '/truck-01.jpg',
    },
    {
      id: 'v4',
      name: 'Tata',
      year: 2007,
      status: 'Owned',
      lastService: 'Last service: 18 Apr',
      location: 'Current: Chennai',
      image: '/truck-01.jpg',
    },
    {
      id: 'v5',
      name: 'Tata',
      year: 2007,
      status: 'Owned',
      lastService: 'Last service: 30 May',
      location: 'Current: Hyderabad',
      image: '/truck-01.jpg',
    },
  ],
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
      image: '/live-truck-01.gif',
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
      image: '/truck-CTA.png',
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
      image: '/live-truck.gif',
      timeAgo: 'Posted 1 week ago',
    },
  ] as FeedPost[],
};
