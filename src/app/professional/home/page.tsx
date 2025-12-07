'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/Header';

import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import HeroCarousel from '../../../components/professional/HeroCarousel';
import QuickActions from '../../../components/professional/QuickActions';
import NextScheduledTrip from '../../../components/professional/NextScheduledTrip';
import JobListings from '../../../components/professional/JobListings';
import PopularFeeds from '../../../components/company/PopularFeeds';
import FloatingSOSButton from '../../../components/professional/FloatingSOSButton';
import { professionalHomeData } from '../../../lib/mockApi';
import { wheelboardApi } from '../../../lib/wheelboardApi';

// Helper function to calculate time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

// Helper to get initials from name
const getInitials = (name: string): string => {
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  timeAgo?: string;
}

export default function ProfessionalHomePage() {
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setIsLoadingFeeds(true);
        const response = await wheelboardApi.post.getAllPosts();
        console.log('📰 All Posts Response:', response);

        const apiResponse = response as any;
        let postsData: any[] = [];

        if (apiResponse.success && apiResponse.data) {
          postsData = Array.isArray(apiResponse.data)
            ? apiResponse.data
            : [apiResponse.data];
        } else if (Array.isArray(apiResponse)) {
          postsData = apiResponse;
        }

        // Transform API data to FeedPost format and take first 4
        const transformedFeeds: FeedPost[] = postsData
          .slice(0, 4)
          .map((post: any) => ({
            id: post.postId || post.id,
            author: {
              name: post.userName || post.authorName || 'WheelBoard User',
              initials: getInitials(
                post.userName || post.authorName || 'WheelBoard User'
              ),
            },
            title: post.category || 'Community Post',
            description:
              post.content || post.description || 'No description available',
            image:
              (post.images && post.images[0]) || post.image || '/Cards/img.png',
            timeAgo: post.createdDate
              ? getTimeAgo(post.createdDate)
              : 'Recently',
          }));

        setFeeds(transformedFeeds);
      } catch (error) {
        console.error('❌ Error fetching feeds:', error);
        setFeeds([]);
      } finally {
        setIsLoadingFeeds(false);
      }
    };

    fetchFeeds();
  }, []);

  return (
    <ProfessionalProtected>
      {/* Unified Header */}
      <Header />

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
          <JobListings />

          {/* Popular Feeds Section */}
          {isLoadingFeeds ? (
            <div className="mb-8 md:mb-16">
              <div className="mb-5 md:mb-8">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                  Popular <span className="text-[#f36969]">Feeds</span>
                </h2>
              </div>
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f36969] border-t-transparent"></div>
              </div>
            </div>
          ) : feeds.length > 0 ? (
            <PopularFeeds feeds={feeds} />
          ) : (
            <div className="mb-8 md:mb-16">
              <div className="mb-5 md:mb-8">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                  Popular <span className="text-[#f36969]">Feeds</span>
                </h2>
              </div>
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                <p className="text-gray-500">
                  No feeds available at the moment
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Floating SOS Button */}
        <FloatingSOSButton />

        {/* Shared Footer */}
        <Footer />
      </div>
    </ProfessionalProtected>
  );
}
