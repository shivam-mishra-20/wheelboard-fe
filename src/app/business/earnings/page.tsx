'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { BusinessProtected } from '../../../components/ProtectedRoute';
import EarningsSummary from '@/components/business/EarningsSummary';
import ServiceBreakdown from '@/components/business/ServiceBreakdown';
import EarningsChart from '@/components/business/EarningsChart';
import PaymentHistory from '@/components/business/PaymentHistory';
import RegisterPaymentModal from '@/components/business/RegisterPaymentModal';

export default function EarningsPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <BusinessProtected>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
              <p className="mt-1 text-sm text-gray-600">
                Track your business revenue and payments
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Earnings Summary */}
              <EarningsSummary />

              {/* Service Breakdown */}
              <ServiceBreakdown />

              {/* Earnings Chart */}
              <EarningsChart />
            </div>

            {/* Right Column - Payment History & Actions */}
            <div className="space-y-6">
              <PaymentHistory
                onRegisterPayment={() => setIsRegisterModalOpen(true)}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Register Payment Modal */}
      <RegisterPaymentModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </BusinessProtected>
  );
}
