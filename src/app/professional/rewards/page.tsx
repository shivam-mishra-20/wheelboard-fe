'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import {
  ChevronRight,
  Trophy,
  Gift,
  Star,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  Tag,
  ChevronDown,
  Download,
  ExternalLink,
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'Voucher' | 'Discount' | 'Premium' | 'Special';
  image?: string;
  expiryDays?: number;
  available: boolean;
}

interface EarnedReward {
  id: string;
  rewardName: string;
  earnedDate: string;
  expiryDate: string;
  status: 'Active' | 'Used' | 'Expired';
  code: string;
  value: string;
}

export default function RewardsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showEarnHistory, setShowEarnHistory] = useState(false);

  const userPoints = 75;

  const categories = [
    { id: 'All', name: 'All Rewards', icon: Gift },
    { id: 'Voucher', name: 'Vouchers', icon: Tag },
    { id: 'Discount', name: 'Discounts', icon: Star },
    { id: 'Premium', name: 'Premium', icon: Award },
    { id: 'Special', name: 'Special', icon: Sparkles },
  ];

  const availableRewards: Reward[] = [
    {
      id: '1',
      name: '₹100 Fuel Voucher',
      description: 'Valid at all petrol pumps across India',
      pointsCost: 100,
      category: 'Voucher',
      expiryDays: 90,
      available: true,
    },
    {
      id: '2',
      name: '₹50 Food Voucher',
      description: 'Use at any Dhaba or restaurant',
      pointsCost: 50,
      category: 'Voucher',
      expiryDays: 60,
      available: true,
    },
    {
      id: '3',
      name: '20% Off Vehicle Service',
      description: 'Discount on next vehicle service',
      pointsCost: 75,
      category: 'Discount',
      expiryDays: 30,
      available: true,
    },
    {
      id: '4',
      name: '₹200 Shopping Voucher',
      description: 'Amazon/Flipkart gift card',
      pointsCost: 200,
      category: 'Voucher',
      expiryDays: 180,
      available: false,
    },
    {
      id: '5',
      name: 'Premium Membership',
      description: '1 month premium features access',
      pointsCost: 150,
      category: 'Premium',
      expiryDays: 30,
      available: false,
    },
    {
      id: '6',
      name: 'Free Health Checkup',
      description: 'Complete health checkup at partner clinics',
      pointsCost: 120,
      category: 'Special',
      expiryDays: 90,
      available: false,
    },
  ];

  const earnedRewards: EarnedReward[] = [
    {
      id: '1',
      rewardName: '₹50 Fuel Voucher',
      earnedDate: '15 Sep, 2025',
      expiryDate: '15 Dec, 2025',
      status: 'Active',
      code: 'FUEL50XYZ',
      value: '₹50',
    },
    {
      id: '2',
      rewardName: '20% Off Service',
      earnedDate: '01 Sep, 2025',
      expiryDate: '01 Oct, 2025',
      status: 'Used',
      code: 'SVC20ABC',
      value: '20% Off',
    },
  ];

  const earnHistory = [
    {
      id: '1',
      title: 'Referral Accepted',
      points: 25,
      date: '18 Oct, 2025',
      type: 'earn',
    },
    {
      id: '2',
      title: 'Redeemed ₹50 Voucher',
      points: -50,
      date: '15 Sep, 2025',
      type: 'spend',
    },
    {
      id: '3',
      title: 'Referral Accepted',
      points: 25,
      date: '10 Sep, 2025',
      type: 'earn',
    },
    {
      id: '4',
      title: 'Trip Bonus',
      points: 10,
      date: '05 Sep, 2025',
      type: 'earn',
    },
  ];

  const filteredRewards =
    selectedCategory === 'All'
      ? availableRewards
      : availableRewards.filter((r) => r.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Used':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Expired':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.pointsCost && reward.available) {
      console.log('Redeeming reward:', reward.name);
      // In production: API call to redeem reward
    }
  };

  return (
    <ProfessionalProtected>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/30">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Rewards
                </h1>
                <p className="text-sm text-gray-600">
                  Redeem your points for exciting rewards
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Available Points Card */}
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-xl">
                <div className="p-6 sm:p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <p className="mb-2 text-sm font-medium text-white/90">
                        Available Points
                      </p>
                      <div className="mb-1 flex items-baseline gap-2">
                        {/* Smaller base font on very small screens to prevent overflow */}
                        <span className="text-4xl font-bold leading-none text-white sm:text-6xl md:text-7xl">
                          {userPoints}
                        </span>
                        <span className="text-xl font-semibold text-white/90 sm:text-3xl">
                          PTS
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-xl bg-white/15 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className="h-6 w-6 text-white" />
                      <p className="text-sm font-medium text-white">
                        Earn more by referring friends!
                      </p>
                    </div>
                    <button
                      onClick={() => router.push('/professional/referrals')}
                      className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-yellow-600 shadow-lg transition-all hover:bg-yellow-50 hover:shadow-xl active:scale-95"
                    >
                      Refer Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all sm:px-5 sm:py-3 ${
                          isSelected
                            ? 'border-[#f36969] bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-lg shadow-[#f36969]/30'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="whitespace-nowrap">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Rewards */}
              <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                  Available Rewards
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredRewards.map((reward) => {
                    const canAfford = userPoints >= reward.pointsCost;
                    const isAvailable = reward.available;
                    return (
                      <div
                        key={reward.id}
                        className={`group overflow-hidden rounded-xl border-2 transition-all ${
                          isAvailable && canAfford
                            ? 'border-[#f36969]/20 bg-gradient-to-br from-white to-[#f36969]/5 shadow-lg hover:border-[#f36969] hover:shadow-xl'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="p-5 sm:p-6">
                          <div className="mb-4">
                            <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">
                              {reward.name}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                              {reward.description}
                            </p>
                          </div>

                          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Valid for {reward.expiryDays} days</span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold text-[#f36969]">
                                {reward.pointsCost}
                              </span>
                              <span className="text-sm font-semibold text-gray-600">
                                PTS
                              </span>
                            </div>
                            <button
                              onClick={() => handleRedeem(reward)}
                              disabled={!isAvailable || !canAfford}
                              className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-all sm:w-auto sm:px-6 ${
                                isAvailable && canAfford
                                  ? 'bg-gradient-to-r from-[#f36969] to-[#f36565] text-white shadow-lg shadow-[#f36969]/30 hover:shadow-xl hover:shadow-[#f36969]/40 active:scale-95'
                                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
                              }`}
                            >
                              {!isAvailable
                                ? 'Coming Soon'
                                : !canAfford
                                  ? 'Not Enough'
                                  : 'Redeem'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* My Rewards */}
              <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
                  My Rewards
                </h2>
                {earnedRewards.length > 0 ? (
                  <div className="space-y-4">
                    {earnedRewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 transition-all hover:border-gray-300 hover:shadow-md"
                      >
                        <div className="p-5 sm:p-6">
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                                  {reward.rewardName}
                                </h3>
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(reward.status)}`}
                                >
                                  {reward.status === 'Active' && (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  )}
                                  {reward.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  <span>Earned: {reward.earnedDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  <span>Expires: {reward.expiryDate}</span>
                                </div>
                              </div>
                              {reward.status === 'Active' && (
                                <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                                  <p className="mb-1 text-xs font-medium text-gray-500">
                                    Reward Code
                                  </p>
                                  <p className="font-mono text-lg font-bold text-gray-900 sm:text-xl">
                                    {reward.code}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          {reward.status === 'Active' && (
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 active:scale-95">
                                <Download className="h-4 w-4" />
                                Download
                              </button>
                              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95">
                                <ExternalLink className="h-4 w-4" />
                                Use Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <Gift className="h-10 w-10 text-gray-300" />
                    </div>
                    <p className="mb-2 text-lg font-semibold text-gray-900">
                      No rewards yet
                    </p>
                    <p className="text-sm text-gray-600">
                      Start redeeming your points to earn rewards
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              {/* Earn More Points */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg">
                <div className="mb-5 flex items-center gap-2">
                  <div className="rounded-xl bg-blue-200 p-2">
                    <Sparkles className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900">
                    Earn More Points
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Refer Friends',
                      points: 25,
                      desc: 'Per accepted referral',
                    },
                    {
                      title: 'Complete Trips',
                      points: 10,
                      desc: 'Per successful trip',
                    },
                    {
                      title: 'Monthly Bonus',
                      points: 50,
                      desc: 'Complete 20+ trips/month',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-blue-900">
                            {item.title}
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            +{item.points} PTS
                          </span>
                        </div>
                        <p className="text-xs text-blue-700">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Points History */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <button
                  onClick={() => setShowEarnHistory(!showEarnHistory)}
                  className="mb-4 flex w-full items-center justify-between text-left transition-colors hover:text-[#f36969]"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    Points History
                  </h3>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
                      showEarnHistory ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showEarnHistory && (
                  <div className="space-y-3">
                    {earnHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100"
                      >
                        <div>
                          <p className="mb-1 font-semibold text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600">{item.date}</p>
                        </div>
                        <span
                          className={`text-xl font-bold ${
                            item.type === 'earn'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {item.points > 0 ? '+' : ''}
                          {item.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rewards Info */}
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-xl bg-purple-200 p-2">
                    <Award className="h-5 w-5 text-purple-700" />
                  </div>
                  <h3 className="font-bold text-purple-900">About Rewards</h3>
                </div>
                <ul className="space-y-2.5 text-sm text-purple-800">
                  {[
                    'Points never expire',
                    'Redeem anytime for rewards',
                    'New rewards added monthly',
                    'Track earnings in real-time',
                  ].map((text, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 text-purple-600">•</span>
                      <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProfessionalProtected>
  );
}
