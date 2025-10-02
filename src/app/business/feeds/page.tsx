'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { BusinessProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';

export default function BusinessFeedsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: '/network.png', alt: 'Business network' },
    { id: 2, image: '/business-profile.png', alt: 'Business insights' },
    { id: 3, image: '/dashboard.png', alt: 'Industry updates' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  const categories = [
    'All',
    'Market Trends',
    'Business Tips',
    'Industry News',
    'Success Stories',
    'Product Updates',
    'Partnerships',
    'Regulations',
  ];

  const feeds = [
    {
      id: 1,
      author: {
        name: 'Transportation Business Council',
        avatar: '/business-profile.png',
        verified: true,
        type: 'Official',
        followers: '25.4K',
      },
      title: 'New Tax Benefits for Transportation Businesses in 2025',
      content:
        'The government has announced new tax incentives for transportation businesses adopting eco-friendly practices. Businesses can now claim up to 40% tax deduction on electric vehicle purchases and sustainable fuel initiatives. This policy aims to accelerate the transition to green transportation.',
      image: '/truck-01.jpg',
      category: 'Regulations',
      timeAgo: '3 hours ago',
      likes: 428,
      comments: 67,
      shares: 89,
      tags: ['Tax Benefits', 'Green Transport', 'Government Policy'],
      engagement: 'high',
    },
    {
      id: 2,
      author: {
        name: 'Supply Chain Insights',
        avatar: '/dashboard.png',
        verified: true,
        type: 'Expert',
        followers: '18.7K',
      },
      title: 'Digital Transformation: How Small Businesses Can Compete',
      content:
        'Small transportation businesses are leveraging technology to compete with larger companies. Key strategies include fleet management software, GPS tracking, digital invoicing, and customer portals. Companies adopting these technologies report 30% increase in efficiency and 25% cost reduction.',
      image: '/live-truck.gif',
      category: 'Business Tips',
      timeAgo: '6 hours ago',
      likes: 356,
      comments: 45,
      shares: 72,
      tags: ['Digital Transformation', 'Technology', 'Efficiency'],
      engagement: 'high',
    },
    {
      id: 3,
      author: {
        name: 'TruckParts Pro',
        avatar: '/tires.png',
        verified: false,
        type: 'Business',
        followers: '12.1K',
      },
      title: 'Introducing Our New Premium Tire Collection',
      content:
        'We are excited to launch our new range of premium heavy-duty tires designed for long-haul transportation. These tires offer 20% longer life, improved fuel efficiency, and enhanced safety features. Special launch discount of 25% available for the first 100 customers.',
      image: '/tires.png',
      category: 'Product Updates',
      timeAgo: '8 hours ago',
      likes: 234,
      comments: 28,
      shares: 41,
      tags: ['New Product', 'Tires', 'Discount'],
      engagement: 'medium',
      isSponsored: true,
    },
    {
      id: 4,
      author: {
        name: 'Logistics Today',
        avatar: '/support.png',
        verified: true,
        type: 'News',
        followers: '45.2K',
      },
      title: 'Partnership Spotlight: FleetTech & AutoCare Alliance',
      content:
        'FleetTech Solutions has partnered with AutoCare Services to provide comprehensive vehicle maintenance packages. This partnership will offer 24/7 breakdown support, preventive maintenance, and real-time vehicle health monitoring across 500+ locations nationwide.',
      image: '/network.png',
      category: 'Partnerships',
      timeAgo: '12 hours ago',
      likes: 512,
      comments: 83,
      shares: 156,
      tags: ['Partnership', 'Maintenance', 'Fleet Management'],
      engagement: 'high',
    },
    {
      id: 5,
      author: {
        name: 'StartUp Success Hub',
        avatar: '/challenges.png',
        verified: false,
        type: 'Community',
        followers: '8.9K',
      },
      title: 'From Garage to 50-Truck Fleet: An Inspiring Journey',
      content:
        'Meet Rajesh Kumar, who started with a single truck in 2015 and now operates a fleet of 50 vehicles. His success formula: excellent customer service, timely deliveries, and smart use of technology. Key advice: "Start small, dream big, and never compromise on quality."',
      image: '/Yellow-truck.jpg',
      category: 'Success Stories',
      timeAgo: '1 day ago',
      likes: 789,
      comments: 142,
      shares: 298,
      tags: ['Success Story', 'Inspiration', 'Entrepreneurship'],
      engagement: 'very-high',
    },
    {
      id: 6,
      author: {
        name: 'Market Research Pro',
        avatar: '/img-2.png',
        verified: true,
        type: 'Research',
        followers: '32.6K',
      },
      title: 'Transportation Market Trends: Q4 2025 Report',
      content:
        'Latest market analysis reveals significant growth in last-mile delivery services (+35%) and cold chain logistics (+28%). E-commerce boom continues to drive demand for specialized transportation services. Businesses focusing on these segments show highest profit margins.',
      image: '/dashboard.png',
      category: 'Market Trends',
      timeAgo: '1 day ago',
      likes: 445,
      comments: 76,
      shares: 134,
      tags: ['Market Research', 'Trends', 'Growth'],
      engagement: 'high',
    },
    {
      id: 7,
      author: {
        name: 'FuelSaver Solutions',
        avatar: '/excavator.jpg',
        verified: true,
        type: 'Business',
        followers: '15.3K',
      },
      title: 'Reduce Fuel Costs by 25% with Smart Route Optimization',
      content:
        'Our AI-powered route optimization platform has helped 1000+ businesses reduce fuel costs significantly. Features include real-time traffic analysis, weather considerations, and vehicle-specific routing. Free trial available for new customers.',
      image: '/truck-CTA.png',
      category: 'Business Tips',
      timeAgo: '2 days ago',
      likes: 298,
      comments: 52,
      shares: 87,
      tags: ['Fuel Efficiency', 'AI Technology', 'Cost Reduction'],
      engagement: 'medium',
      isSponsored: true,
    },
    {
      id: 8,
      author: {
        name: 'Industry Leaders Forum',
        avatar: '/profile-pic.png',
        verified: true,
        type: 'Community',
        followers: '67.8K',
      },
      title: 'Upcoming Webinar: Future of Autonomous Vehicles in Logistics',
      content:
        'Join industry experts for an exclusive webinar on autonomous vehicles in logistics. Topics include current technology, regulatory challenges, implementation timeline, and impact on traditional transportation businesses. Register now for early bird discount.',
      image: '/live-truck-01.gif',
      category: 'Industry News',
      timeAgo: '2 days ago',
      likes: 623,
      comments: 95,
      shares: 187,
      tags: ['Webinar', 'Autonomous Vehicles', 'Future Tech'],
      engagement: 'very-high',
    },
  ];

  const filteredFeeds = feeds.filter((feed) => {
    if (activeCategory === 'all' || activeCategory === 'All') return true;
    return feed.category === activeCategory;
  });

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'very-high':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAuthorTypeColor = (type: string) => {
    switch (type) {
      case 'Official':
        return 'bg-blue-100 text-blue-800';
      case 'Expert':
        return 'bg-purple-100 text-purple-800';
      case 'Business':
        return 'bg-green-100 text-green-800';
      case 'Community':
        return 'bg-orange-100 text-orange-800';
      case 'News':
        return 'bg-red-100 text-red-800';
      case 'Research':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="relative h-64 md:h-80">
              <div className="relative h-full w-full">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    Business Feeds
                  </h1>
                  <p className="text-lg md:text-xl">
                    Stay connected with industry trends and business insights
                  </p>
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category === 'All' ? 'all' : category)
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category ||
                  (activeCategory === 'all' && category === 'All')
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } border border-gray-200 shadow-sm`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Create Post Section */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                <Image
                  src="/business-profile.png"
                  alt="Your Profile"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share business insights, updates, or ask for advice..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Media</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Analytics</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Schedule</span>
                </button>
              </div>
              <button className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600">
                Post Update
              </button>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <h3 className="mb-4 text-xl font-bold">🔥 Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {[
                '#DigitalTransformation',
                '#GreenTransport',
                '#FleetManagement',
                '#SupplyChain',
                '#BusinessGrowth',
              ].map((tag) => (
                <span
                  key={tag}
                  className="cursor-pointer rounded-full bg-white/20 px-3 py-1 text-sm font-medium hover:bg-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Feeds List */}
          <div className="space-y-6">
            {filteredFeeds.map((feed) => (
              <div
                key={feed.id}
                className={`rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg ${
                  feed.isSponsored ? 'ring-2 ring-yellow-200' : ''
                }`}
              >
                {feed.isSponsored && (
                  <div className="rounded-t-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2">
                    <span className="text-sm font-medium text-white">
                      💼 Sponsored Content
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Author Info */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-14 w-14 overflow-hidden rounded-full">
                        <Image
                          src={feed.author.avatar}
                          alt={feed.author.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {feed.author.name}
                          </h3>
                          {feed.author.verified && (
                            <svg
                              className="h-5 w-5 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.255.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getAuthorTypeColor(feed.author.type)}`}
                          >
                            {feed.author.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{feed.timeAgo}</span>
                          <span>•</span>
                          <span>{feed.author.followers} followers</span>
                          <span
                            className={`font-medium ${getEngagementColor(feed.engagement)}`}
                          >
                            • {feed.engagement.replace('-', ' ')} engagement
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100">
                        Follow
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h2 className="mb-3 text-xl font-semibold text-gray-900">
                      {feed.title}
                    </h2>
                    <p className="leading-relaxed text-gray-700">
                      {feed.content}
                    </p>
                  </div>

                  {/* Image */}
                  {feed.image && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <Image
                        src={feed.image}
                        alt={feed.title}
                        width={700}
                        height={350}
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {feed.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex space-x-6">
                      <button className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-red-600">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="font-medium">{feed.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-blue-600">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="font-medium">{feed.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-green-600">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        <span className="font-medium">{feed.shares}</span>
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <button className="rounded-lg bg-blue-500 px-8 py-3 font-medium text-white hover:bg-blue-600">
              Load More Posts
            </button>
          </div>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </BusinessProtected>
  );
}
