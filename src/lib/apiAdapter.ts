// API Integration Adapter
// This file provides a unified interface that switches between mock API and real API
// based on environment configuration

import { userApi, type LoginRequest, type ApiResponse } from './userApi';
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
      const loginData: LoginRequest = {
        mobileNo: credentials.mobileNo || credentials.email || '',
        password: credentials.password,
      };

      const response = await userApi.login(loginData);

      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          user: {
            id: response.data.userId,
            email: response.data.email || '',
            mobileNo: response.data.mobileNo,
            name: response.data.name,
            companyName: response.data.companyName,
            businessName: response.data.businessName,
            userType: response.data.userType,
            createdAt: new Date().toISOString(),
          },
          token: response.data.token,
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
        const response = await userApi.professionalSignup({
          email: data.email || '',
          password: data.password,
          name: data.name || data.fullName || '',
          fatherName: data.fatherName || '',
          dateOfBirth:
            data.dateOfBirth || data.birthDate || new Date().toISOString(),
          mobileNo: data.mobileNo || data.phoneNumber || '',
          state: data.state || '',
          city: data.city || '',
          professionalType:
            data.professionalType || data.businessCategory || '',
          profileImage: data.profileImage,
        });

        return {
          success: response.success,
          message: response.message,
        };
      } else if (data.userType === 'company') {
        const response = await userApi.companySignup({
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
        const response = await userApi.companySignup({
          companyName: data.businessName || data.companyName || '',
          mobileNo: data.mobileNo || data.phoneNumber || '',
          email: data.email || '',
          password: data.password,
          businessCategory: data.businessCategory || 'service-provider',
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
      localStorage.removeItem('wheelboard_current_user');
      localStorage.removeItem('wheelboard_auth_token');
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
  getUserProfile: async (userId: string): Promise<ApiResponse<UnifiedUser>> => {
    if (API_MODE === 'real') {
      const response = await userApi.getUserProfile(userId);

      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          data: {
            id: response.data.userId,
            email: response.data.email,
            mobileNo: response.data.mobileNo,
            name: response.data.name,
            companyName: response.data.companyName,
            businessName: response.data.businessName,
            userType: response.data.userType,
            profileImage: response.data.profileImage,
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
  localStorage.setItem('wheelboard_current_user', JSON.stringify(user));
  if (token) {
    localStorage.setItem('wheelboard_auth_token', token);
  }
};

/**
 * Helper to get auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('wheelboard_auth_token');
};

/**
 * Get current API mode
 */
export const getApiMode = (): 'mock' | 'real' => {
  return API_MODE as 'mock' | 'real';
};

export default api;
