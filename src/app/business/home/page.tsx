'use client';

import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { BusinessProtected } from '../../../components/ProtectedRoute';
import HeroCarousel from '@/components/business/HeroCarousel';
import ServiceCardsGrid from '../../../components/business/ServiceCardsGrid';
import RecentServices from '../../../components/business/RecentServices';
import PopularFeeds from '../../../components/business/PopularFeeds';

export default function BusinessHomePage() {
  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Carousel */}
          <HeroCarousel />

          {/* Services Grid */}
          <ServiceCardsGrid />

          {/* Recent Services */}
          <RecentServices />

          {/* Popular Feeds */}
          <PopularFeeds />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BusinessProtected>
  );
}
