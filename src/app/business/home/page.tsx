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

      <div className="min-h-screen pt-6">
        <main className="mx-auto max-w-7xl px-4 lg:px-8">
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
