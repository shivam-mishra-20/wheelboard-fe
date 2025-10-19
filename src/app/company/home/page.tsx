'use client';

import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { CompanyProtected } from '../../../components/ProtectedRoute';
import HeroCarousel from '../../../components/company/HeroCarousel';
import ServiceCardsGrid, {
  VehicleIcon,
  ProfessionalIcon,
  ExpensesIcon,
  HireIcon,
  ServicesIcon,
  DashboardIcon,
} from '../../../components/company/ServiceCardsGrid';
import RecentJobs from '../../../components/company/RecentJobs';
import PopularFeeds from '../../../components/company/PopularFeeds';
import { companyHomeData } from '../../../lib/mockApi';

export default function CompanyHomePage() {
  const router = useRouter();

  // Service cards configuration matching the design
  const serviceCards = [
    {
      id: 'vehicles',
      title: 'Vehicles',
      icon: <VehicleIcon />,
      color: 'blue' as const,
      onClick: () => router.push('/company/fleet'),
    },
    {
      id: 'professional',
      title: 'Professional',
      icon: <ProfessionalIcon />,
      color: 'teal' as const,
      onClick: () => router.push('/company/professionals'),
    },
    {
      id: 'expenses',
      title: 'Expenses',
      icon: <ExpensesIcon />,
      color: 'orange' as const,
      onClick: () => router.push('/company/expenses'),
    },
    {
      id: 'hire',
      title: 'Hire',
      icon: <HireIcon />,
      color: 'pink' as const,
      onClick: () => router.push('/company/jobs'),
    },
    {
      id: 'services',
      title: 'Services',
      icon: <ServicesIcon />,
      color: 'yellow' as const,
      onClick: () => router.push('/company/services'),
    },
    {
      id: 'dashboard',
      title: 'DashBoard',
      icon: <DashboardIcon />,
      color: 'gray' as const,
      onClick: () => router.push('/company/dashboard'),
    },
  ];

  return (
    <CompanyProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen pt-4 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Hero Carousel Section */}
          <HeroCarousel slides={companyHomeData.carouselSlides} />

          {/* Services Grid */}
          <ServiceCardsGrid services={serviceCards} />

          {/* Recent Jobs Section */}
          <RecentJobs jobs={companyHomeData.recentJobs} />

          {/* Popular Feeds Section */}
          <PopularFeeds feeds={companyHomeData.popularFeeds} />
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </CompanyProtected>
  );
}
