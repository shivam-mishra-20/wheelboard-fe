// API Integration Adapter
// This file provides a unified interface that switches between mock API and real API
// based on environment configuration

import { wheelboardApi } from './wheelboardApi';
import { mockAPI, type LoginCredentials } from './mockApi';

// Configuration: Set to 'real' to use live API, 'mock' for development
const API_MODE = process.env.NEXT_PUBLIC_API_MODE || 'real'; // 'mock' | 'real'

// Unified User type that combines both mock and real API user structures
export interface UnifiedUser {
  id: string;
  email: string;
  mobileNo?: string;
  name?: string;
  companyName?: string;
  businessName?: string;
  phoneNumber?: string;
  userType: 'professional' | 'company' | 'business';
  businessCategory?: string;
  isProfileComplete?: boolean;
  avatar?: string | null;
  profileImage?: string;
  createdAt: string;
}

export interface UnifiedLoginResponse {
  success: boolean;
  message: string;
  user?: UnifiedUser;
  token?: string;
}

export interface UnifiedRegisterData {
  // Common fields
  email?: string;
  mobileNo?: string;
  password: string;
  userType: 'professional' | 'company' | 'business';

  // Professional fields
  name?: string;
  fatherName?: string;
  dateOfBirth?: string;
  state?: string;
  city?: string;
  professionalType?: string;
  profileImage?: File | Blob;

  // Company fields
  companyName?: string;
  businessCategory?: string;

  // Business fields
  businessName?: string;

  // Legacy mock API fields
  phoneNumber?: string;
  fullName?: string;
  birthDate?: string;
  avatarDataUrl?: string;
}

/**
 * Unified API Interface
 * Automatically switches between mock and real API based on configuration
 */
export const api = {
  /**
   * Login user with email/mobile and password
   */
  login: async (credentials: {
    email?: string;
    mobileNo?: string;
    password: string;
  }): Promise<UnifiedLoginResponse> => {
    if (API_MODE === 'real') {
      // Use real API
      const loginData = {
        mobileNo: credentials.mobileNo || credentials.email || '',
        password: credentials.password,
      };

      const response = await wheelboardApi.user.login(loginData);

      console.log('=== LOGIN API DEBUG ===');
      console.log('Login API response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);

      if (response.success && response.data) {
        // Map actual API response structure
        const userData = response.data as {
          userId: string;
          token: string;
          userType: string; // "Company", "Professional", "Business" (capitalized)
          businessCategory?: string;
          isProfileComplete: boolean;
          email?: string;
          mobileNo?: string;
          name?: string;
          companyName?: string;
        };

        console.log('Extracted userId:', userData.userId);
        console.log('Extracted token:', userData.token ? 'exists' : 'missing');
        console.log('isProfileComplete:', userData.isProfileComplete);

        // Normalize userType to lowercase for frontend consistency
        const normalizedUserType = userData.userType.toLowerCase() as
          | 'professional'
          | 'company'
          | 'business';

        // Service Provider users come as Company type with businessCategory 'Service Provider'
        const mappedUserType: 'professional' | 'company' | 'business' =
          (userData.businessCategory || '').toLowerCase() ===
            'service provider' ||
          (userData.businessCategory || '').toLowerCase() === 'service-provider'
            ? 'business'
            : normalizedUserType;

        return {
          success: true,
          message: response.message,
          user: {
            id: userData.userId,
            email: userData.email || '',
            mobileNo: userData.mobileNo || '',
            name: userData.name || '',
            companyName: userData.companyName || '',
            userType: mappedUserType,
            businessCategory: userData.businessCategory,
            isProfileComplete: userData.isProfileComplete,
            createdAt: new Date().toISOString(),
          },
          token: userData.token,
        };
      }

      return {
        success: false,
        message: response.message || 'Login failed',
      };
    } else {
      // Use mock API
      const mockCredentials: LoginCredentials = {
        email: credentials.email || credentials.mobileNo || '',
        password: credentials.password,
      };

      const response = await mockAPI.login(mockCredentials);

      if (response.success && response.user) {
        return {
          success: true,
          message: response.message,
          user: {
            id: response.user.id,
            email: response.user.email,
            companyName: response.user.companyName,
            phoneNumber: response.user.phoneNumber,
            userType: response.user.userType,
            businessCategory: response.user.businessCategory,
            avatar: response.user.avatar,
            createdAt: response.user.createdAt,
          },
        };
      }

      return {
        success: false,
        message: response.message,
      };
    }
  },

  /**
   * Register a new user
   */
  register: async (
    data: UnifiedRegisterData
  ): Promise<UnifiedLoginResponse> => {
    if (API_MODE === 'real') {
      // Use real API
      if (data.userType === 'professional') {
        const response = await wheelboardApi.user.professionalSignup({
          Email: data.email || '',
          Password: data.password,
          Name: data.name || data.fullName || '',
          FatherName: data.fatherName || '',
          DateOfBirth:
            data.dateOfBirth || data.birthDate || new Date().toISOString(),
          MobileNo: data.mobileNo || data.phoneNumber || '',
          State: data.state || '',
          City: data.city || '',
          ProfessionalType:
            data.professionalType || data.businessCategory || '',
          ProfileImage: data.profileImage as File | undefined,
        });

        return {
          success: response.success,
          message: response.message,
        };
      } else if (data.userType === 'company') {
        const response = await wheelboardApi.user.companySignup({
          companyName: data.companyName || '',
          mobileNo: data.mobileNo || data.phoneNumber || '',
          email: data.email || '',
          password: data.password,
          businessCategory: data.businessCategory || '',
        });

        return {
          success: response.success,
          message: response.message,
        };
      } else {
        // Business type - use company signup for now
        const response = await wheelboardApi.user.companySignup({
          companyName: data.businessName || data.companyName || '',
          mobileNo: data.mobileNo || data.phoneNumber || '',
          email: data.email || '',
          password: data.password,
          businessCategory: data.businessCategory || 'Service Provider',
        });

        return {
          success: response.success,
          message: response.message,
        };
      }
    } else {
      // Use mock API
      const response = await mockAPI.register({
        companyName: data.companyName || data.businessName || data.name || '',
        phoneNumber: data.phoneNumber || data.mobileNo || '',
        password: data.password,
        businessCategory: data.businessCategory || data.professionalType || '',
        userType: data.userType,
        fullName: data.fullName || data.name,
        fatherName: data.fatherName,
        birthDate: data.birthDate || data.dateOfBirth,
        state: data.state,
        city: data.city,
        avatarDataUrl: data.avatarDataUrl,
      });

      if (response.success && response.user) {
        return {
          success: true,
          message: response.message,
          user: {
            id: response.user.id,
            email: response.user.email,
            companyName: response.user.companyName,
            phoneNumber: response.user.phoneNumber,
            userType: response.user.userType,
            businessCategory: response.user.businessCategory,
            avatar: response.user.avatar,
            createdAt: response.user.createdAt,
          },
        };
      }

      return {
        success: false,
        message: response.message,
      };
    }
  },

  /**
   * Get current user session
   */
  getCurrentUser: (): UnifiedUser | null => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null;
    }

    if (API_MODE === 'real') {
      // For real API, check localStorage or session storage
      const userStr = localStorage.getItem('wheelboard_current_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
      return null;
    } else {
      // Use mock API
      const user = mockAPI.getCurrentUser();
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        businessCategory: user.businessCategory,
        avatar: user.avatar,
        createdAt: user.createdAt,
      };
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<{ success: boolean; message: string }> => {
    if (API_MODE === 'real') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wheelboard_current_user');
        localStorage.removeItem('authToken');
      }
      return {
        success: true,
        message: 'Logged out successfully!',
      };
    } else {
      return await mockAPI.logout();
    }
  },

  /**
   * Get user profile by ID
   */
  getUserProfile: async (
    userId: string
  ): Promise<{ success: boolean; message: string; data?: UnifiedUser }> => {
    if (API_MODE === 'real') {
      const response = await wheelboardApi.user.getUserProfile(userId);

      if (response.success && response.data) {
        const profileData = response.data as {
          userId: string;
          email: string;
          mobileNo?: string;
          name?: string;
          companyName?: string;
          businessName?: string;
          userType: 'professional' | 'company' | 'business';
          profileImage?: string;
        };

        return {
          success: true,
          message: response.message,
          data: {
            id: profileData.userId,
            email: profileData.email,
            mobileNo: profileData.mobileNo,
            name: profileData.name,
            companyName: profileData.companyName,
            businessName: profileData.businessName,
            userType: profileData.userType,
            profileImage: profileData.profileImage,
            createdAt: new Date().toISOString(),
          },
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch user profile',
      };
    } else {
      // Mock implementation
      return {
        success: false,
        message: 'getUserProfile not implemented in mock API',
      };
    }
  },
};

/**
 * Helper to save authenticated user to localStorage
 */
export const saveAuthUser = (user: UnifiedUser, token?: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('wheelboard_current_user', JSON.stringify(user));
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Helper to get auth token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

/**
 * Get current API mode
 */
export const getApiMode = (): 'mock' | 'real' => {
  return API_MODE as 'mock' | 'real';
};

export default api;
