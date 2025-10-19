'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';

import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import {
  ChevronRight,
  Copy,
  Share2,
  Trophy,
  Gift,
  CheckCircle2,
  Clock,
  Truck,
  Wrench,
  Briefcase,
  Plus,
  ChevronDown,
  Award,
  X,
} from 'lucide-react';

interface Referral {
  id: string;
  name: string;
  role: string;
  status: 'Accepted' | 'Pending' | 'Rejected';
  date: string;
  points: number;
  avatar?: string;
}

interface ReferralStats {
  totalPoints: number;
  acceptedReferrals: number;
  pendingReferrals: number;
  nextRewardAt: number;
  progressPercentage: number;
}

export default function ReferralsPage() {
  const router = useRouter();
  const [showAddReferral, setShowAddReferral] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [referralForm, setReferralForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    role: 'Driver',
    notifyOnAccept: true,
  });

  // Mock data
  const stats: ReferralStats = {
    totalPoints: 75,
    acceptedReferrals: 3,
    pendingReferrals: 2,
    nextRewardAt: 100,
    progressPercentage: 75,
  };

  const referrals: Referral[] = [
    {
      id: '1',
      name: 'Ajay Verma',
      role: 'Driver',
      status: 'Accepted',
      date: '12 May, 2025',
      points: 25,
      avatar: '/profile.png',
    },
    {
      id: '2',
      name: 'Sonia Malik',
      role: 'Tyre Fitter',
      status: 'Pending',
      date: '20 May, 2025',
      points: 0,
    },
    {
      id: '3',
      name: 'Priya Singh',
      role: 'Mechanic',
      status: 'Accepted',
      date: '05 May, 2025',
      points: 25,
    },
    {
      id: '4',
      name: 'Rahul Kumar',
      role: 'Consulting Agent',
      status: 'Accepted',
      date: '28 Apr, 2025',
      points: 25,
    },
  ];

  const roleOptions = [
    { value: 'Driver', icon: Truck, color: 'red' },
    { value: 'Tyre Fitter', icon: Wrench, color: 'orange' },
    { value: 'Mechanic', icon: Wrench, color: 'teal' },
    { value: 'Consulting Agent', icon: Briefcase, color: 'purple' },
  ];

  const referralCode = 'ROHIT2025';
  const referralLink = 'wheelboard.com/ref/rohit2025';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
    console.log('Copied to clipboard:', text);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Join Wheelboard',
          text: `Use my referral code: ${referralCode}`,
          url: `https://${referralLink}`,
        })
        .catch((error) => console.log('Error sharing:', error));
    }
  };

  const handleSubmitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting referral:', referralForm);
    // Reset form and close modal
    setReferralForm({
      name: '',
      phone: '',
      email: '',
      location: '',
      role: 'Driver',
      notifyOnAccept: true,
    });
    setShowAddReferral(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-lg shadow-[#f36969]/20">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Your Referrals
                  </h1>
                  <p className="text-sm text-gray-600">
                    Earn rewards by referring professionals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddReferral(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 active:scale-[0.98] sm:w-auto"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm">NEW REFERRAL</span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Referral Points Card */}
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#f36969] to-[#f36565] shadow-xl">
                <div className="p-6 sm:p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="mb-1 text-lg font-semibold text-white sm:text-xl">
                        Your Referral Points
                      </h2>
                      <p className="text-sm text-white/80">
                        Earned from {stats.acceptedReferrals} referrals
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-6xl font-bold text-white sm:text-7xl">
                        {stats.totalPoints}
                      </span>
                      <span className="text-3xl font-semibold text-white/90">
                        PTS
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex flex-col gap-2 text-sm text-white sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-medium">
                        {stats.totalPoints} PTS = ₹{stats.totalPoints * 8}{' '}
                        voucher
                      </span>
                      <span className="font-semibold">
                        {stats.nextRewardAt - stats.totalPoints} points to next
                        reward
                      </span>
                    </div>
                    <div className="relative h-2.5 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-green-300 to-green-400 shadow-lg transition-all duration-700 ease-out"
                        style={{ width: `${stats.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/70">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Referrals */}
              <div className="rounded-2xl bg-white shadow-lg">
                <div className="p-6 sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                      Recent Referrals
                    </h2>
                    <button
                      onClick={() => router.push('/professional/referrals/all')}
                      className="flex items-center gap-1 text-sm font-semibold text-[#f36969] transition-colors hover:text-[#f36565]"
                    >
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="group rounded-xl border-2 border-gray-100 bg-gray-50 p-4 transition-all hover:border-[#f36969]/20 hover:bg-white hover:shadow-md sm:p-5"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f36969] to-[#f36565] text-xl font-bold text-white shadow-lg">
                              {referral.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="mb-1 truncate text-base font-semibold text-gray-900 sm:text-lg">
                                {referral.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {referral.role}
                              </p>
                              <p className="text-xs text-gray-500">
                                {referral.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusColor(referral.status)}`}
                            >
                              {getStatusIcon(referral.status)}
                              {referral.status}
                            </span>
                            {referral.points > 0 && (
                              <span className="text-base font-bold text-green-600">
                                +{referral.points} PTS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Referral Stats */}
              <div className="rounded-2xl bg-white shadow-lg">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                      Your Referral Stats
                    </h2>
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
                      showStats ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showStats && (
                  <div className="border-t border-gray-100 p-6 sm:p-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          icon: CheckCircle2,
                          label: 'Accepted',
                          value: stats.acceptedReferrals,
                          color: 'blue',
                        },
                        {
                          icon: Clock,
                          label: 'Pending',
                          value: stats.pendingReferrals,
                          color: 'yellow',
                        },
                        {
                          icon: Trophy,
                          label: 'Total Points',
                          value: stats.totalPoints,
                          color: 'green',
                        },
                        {
                          icon: Gift,
                          label: 'Voucher Value',
                          value: `₹${stats.totalPoints * 8}`,
                          color: 'purple',
                        },
                      ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                          <div
                            key={idx}
                            className={`rounded-xl bg-${stat.color}-50 p-6 transition-all hover:shadow-md`}
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <Icon
                                className={`h-5 w-5 text-${stat.color}-600`}
                              />
                              <span
                                className={`text-sm font-semibold text-${stat.color}-900`}
                              >
                                {stat.label}
                              </span>
                            </div>
                            <p
                              className={`text-4xl font-bold text-${stat.color}-900`}
                            >
                              {stat.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              {/* Referral Code Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Your Referral Code
                </h3>

                <div className="mb-3 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Referral Code
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold tracking-wider text-gray-900">
                      {referralCode}
                    </span>
                    <button
                      onClick={() => handleCopy(referralCode)}
                      className="rounded-lg bg-white p-2.5 text-gray-600 shadow-md transition-all hover:bg-gray-50 hover:text-[#f36969] hover:shadow-lg active:scale-95"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Referral Link
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                      {referralLink}
                    </span>
                    <button
                      onClick={() => handleCopy(`https://${referralLink}`)}
                      className="shrink-0 rounded-lg bg-white p-2.5 text-gray-600 shadow-md transition-all hover:bg-gray-50 hover:text-[#f36969] hover:shadow-lg active:scale-95"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3.5 font-semibold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]"
                >
                  <Share2 className="h-5 w-5" />
                  Share Referral
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Share your referral code',
                    desc: 'Send to professionals in transport',
                  },
                  {
                    step: 2,
                    title: 'They join Wheelboard',
                    desc: 'Using your referral code',
                  },
                  {
                    step: 3,
                    title: 'Earn reward points',
                    desc: 'Get 25 points per referral',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-semibold text-blue-900">
                        {item.title}
                      </p>
                      <p className="text-xs leading-relaxed text-blue-700">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Add Referral Modal */}
      {showAddReferral && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="animate-slide-up sm:animate-scale-in mb-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl sm:rounded-2xl md:mb-0">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Referral
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Fill in the details below
                </p>
              </div>
              <button
                onClick={() => setShowAddReferral(false)}
                className="rounded-xl bg-gray-100 p-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form
              onSubmit={handleSubmitReferral}
              className="max-h-[70vh] overflow-y-auto p-6 sm:max-h-[600px]"
            >
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Rohit Sharma"
                    value={referralForm.name}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, name: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="+91"
                      disabled
                      className="w-20 rounded-xl border-2 border-gray-200 bg-gray-50 px-3 py-3.5 text-center font-semibold text-gray-600"
                    />
                    <input
                      type="tel"
                      placeholder="9725194416"
                      value={referralForm.phone}
                      onChange={(e) =>
                        setReferralForm({
                          ...referralForm,
                          phone: e.target.value,
                        })
                      }
                      className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="rohit@gmail.com"
                    value={referralForm.email}
                    onChange={(e) =>
                      setReferralForm({
                        ...referralForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Select Role *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      const isSelected = referralForm.role === role.value;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() =>
                            setReferralForm({
                              ...referralForm,
                              role: role.value,
                            })
                          }
                          className={`flex items-center gap-2.5 rounded-xl border-2 p-4 transition-all ${
                            isSelected
                              ? 'border-[#f36969] bg-[#f36969]/5 shadow-lg shadow-[#f36969]/10'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isSelected ? 'text-[#f36969]' : 'text-gray-400'
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold ${
                              isSelected ? 'text-[#f36969]' : 'text-gray-700'
                            }`}
                          >
                            {role.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Location
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={referralForm.location}
                    onChange={(e) =>
                      setReferralForm({
                        ...referralForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 transition-all focus:border-[#f36969] focus:outline-none focus:ring-4 focus:ring-[#f36969]/10"
                  />
                </div>

                {/* Notification Checkbox */}
                <label className="flex items-start gap-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-4 transition-all hover:bg-blue-100">
                  <input
                    type="checkbox"
                    checked={referralForm.notifyOnAccept}
                    onChange={(e) =>
                      setReferralForm({
                        ...referralForm,
                        notifyOnAccept: e.target.checked,
                      })
                    }
                    className="mt-1 h-5 w-5 rounded-md border-2 border-blue-300 text-[#f36969] transition-all focus:ring-2 focus:ring-[#f36969] focus:ring-offset-2"
                  />
                  <div className="flex-1 text-sm">
                    <span className="font-semibold text-blue-900">
                      Notify me when accepted
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-blue-700">
                      Get SMS or app notification when your referral is accepted
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-6 space-y-4">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-4 text-base font-bold text-white shadow-lg shadow-[#f36969]/30 transition-all hover:shadow-xl hover:shadow-[#f36969]/40 active:scale-[0.98]"
                >
                  SEND INVITE
                </button>

                {/* Info Text */}
                <div className="flex gap-3 rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4">
                  <Gift className="h-5 w-5 shrink-0 text-yellow-600" />
                  <p className="text-xs leading-relaxed text-yellow-800">
                    Refer people active in transport or automotive sectors for
                    higher acceptance rates!
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProfessionalProtected>
  );
}
