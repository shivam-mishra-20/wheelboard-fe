'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LoginSimulator from '../../../components/LoginSimulator';
import { CompanyProtected } from '../../../components/ProtectedRoute';
import VehiclesListing from '@/components/company/VehiclesListing';
import PopularFeeds from '../../../components/company/PopularFeeds';
import { companyFleetData } from '../../../lib/mockApi';

export default function CompanyFleetPage() {
  return (
    <CompanyProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Vehicles & Drivers Listing Section */}
          <VehiclesListing
            vehicles={companyFleetData.vehicles.map((vehicle) => ({
              ...vehicle,
              status: vehicle.status as 'Attached' | 'Owned' | 'Rented',
            }))}
            drivers={companyFleetData.drivers.map((driver) => ({
              ...driver,
              status: driver.status as 'Available' | 'On Trip' | 'Off Duty',
            }))}
          />

          {/* Popular Feeds Section */}
          <PopularFeeds feeds={companyFleetData.popularFeeds} />
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </CompanyProtected>
  );
}
