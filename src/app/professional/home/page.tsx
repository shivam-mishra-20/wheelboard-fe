'use client';

import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import HeroCarousel from '../../../components/professional/HeroCarousel';
import QuickActions from '../../../components/professional/QuickActions';
import NextScheduledTrip from '../../../components/professional/NextScheduledTrip';
import JobListings from '../../../components/professional/JobListings';
import PopularFeeds from '../../../components/company/PopularFeeds';
import FloatingSOSButton from '../../../components/professional/FloatingSOSButton';
import { professionalHomeData } from '../../../lib/mockApi';

export default function ProfessionalHomePage() {
  return (
    <ProfessionalProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen pt-6 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Hero Carousel Section */}
          <HeroCarousel
            slides={professionalHomeData.carouselSlides}
            autoPlay={true}
            autoPlayDelay={5000}
          />

          {/* Quick Actions */}
          <QuickActions />

          {/* Next Scheduled Trip */}
          <NextScheduledTrip
            tripDetails={professionalHomeData.nextScheduledTrip}
          />

          {/* Job Listings Section */}
          <JobListings jobs={professionalHomeData.jobListings} />

          {/* Popular Feeds Section */}
          <PopularFeeds feeds={professionalHomeData.popularFeeds} />
        </main>

        {/* Floating SOS Button */}
        <FloatingSOSButton />

        {/* Shared Footer */}
        <Footer />
      </div>
    </ProfessionalProtected>
  );
}
