'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/apiAdapter';

const LoginSimulator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleSimulateLogin = async (userType) => {
    try {
      // For mock mode, use mock credentials
      const mockCredentials = {
        company: { email: 'john@transport.com', password: 'password123' },
        business: { email: 'mike@parts.com', password: 'password123' },
        professional: { email: 'sarah@mining.com', password: 'password123' },
      };

      const credentials = mockCredentials[userType];
      if (!credentials) {
        alert('Invalid user type');
        return;
      }

      const result = await api.login(credentials);
      if (result.success && result.user) {
        // Save user session
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }
        localStorage.setItem('currentUser', JSON.stringify(result.user));

        // Navigate to role-specific home
        const redirectMap = {
          company: '/company/home',
          business: '/business/home',
          professional: '/professional/home',
        };
        const target = redirectMap[userType] || '/';
        router.push(target);
      } else {
        alert(`Login failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      // Redirect to public home after logout
      router.push('/');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600"
        title="Login Simulator"
      >
        👤
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Login Simulator</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleSimulateLogin('company')}
          className="w-full rounded bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-600"
        >
          Login as Company
        </button>

        <button
          onClick={() => handleSimulateLogin('business')}
          className="w-full rounded bg-green-500 px-3 py-2 text-xs text-white hover:bg-green-600"
        >
          Login as Business
        </button>

        <button
          onClick={() => handleSimulateLogin('professional')}
          className="w-full rounded bg-blue-500 px-3 py-2 text-xs text-white hover:bg-blue-600"
        >
          Login as Professional
        </button>

        <button
          onClick={handleLogout}
          className="w-full rounded bg-gray-500 px-3 py-2 text-xs text-white hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LoginSimulator;
