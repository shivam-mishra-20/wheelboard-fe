'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';

export default function ProfessionalFeedsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: '/network.png', alt: 'Professional network' },
    { id: 2, image: '/support.png', alt: 'Community support' },
    { id: 3, image: '/dashboard.png', alt: 'Industry insights' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  const categories = [
    'All',
    'Industry News',
    'Tips & Tricks',
    'Safety',
    'Maintenance',
    'Regulations',
    'Success Stories',
  ];

  const feeds = [
    {
      id: 1,
      author: {
        name: 'Transport Authority India',
        avatar: '/professional-profile.png',
        verified: true,
        type: 'Official',
      },
      title: 'New Safety Regulations for Heavy Vehicle Drivers',
      content:
        'Starting October 1st, 2025, all heavy vehicle drivers must complete mandatory safety training every 6 months. This initiative aims to reduce road accidents and improve overall transportation safety standards.',
      image: '/truck-01.jpg',
      category: 'Regulations',
      timeAgo: '2 hours ago',
      likes: 156,
      comments: 23,
      shares: 12,
      tags: ['Safety', 'Regulations', 'Training'],
    },
    {
      id: 2,
      author: {
        name: 'Pro Driver Tips',
        avatar: '/staring-man.jpg',
        verified: false,
        type: 'Professional',
      },
      title: '5 Fuel-Saving Tips Every Driver Should Know',
      content:
        'Save up to 15% on fuel costs with these proven techniques: 1) Maintain steady speeds, 2) Regular vehicle maintenance, 3) Proper tire pressure, 4) Route optimization, 5) Avoid excessive idling. Small changes make big differences!',
      image: '/Yellow-truck.jpg',
      category: 'Tips & Tricks',
      timeAgo: '4 hours ago',
      likes: 289,
      comments: 45,
      shares: 67,
      tags: ['Fuel Efficiency', 'Cost Saving', 'Maintenance'],
    },
    {
      id: 3,
      author: {
        name: 'Mining Equipment Expert',
        avatar: '/mining-2.jpg',
        verified: true,
        type: 'Expert',
      },
      title: 'Mining Equipment Maintenance Best Practices',
      content:
        'Proper maintenance of mining equipment can extend machine life by 40%. Key practices include daily inspections, scheduled servicing, proper lubrication, and operator training. Invest in maintenance to avoid costly breakdowns.',
      image: '/mining-truck.jpg',
      category: 'Maintenance',
      timeAgo: '6 hours ago',
      likes: 178,
      comments: 31,
      shares: 28,
      tags: ['Mining', 'Equipment', 'Maintenance'],
    },
    {
      id: 4,
      author: {
        name: 'Success Stories Hub',
        avatar: '/logistics-professional.jpg',
        verified: false,
        type: 'Community',
      },
      title: 'From Driver to Fleet Owner: My Journey',
      content:
        'Started as a truck driver 10 years ago, now I own a fleet of 15 vehicles. Key lessons: Save consistently, build relationships, maintain your vehicles well, and always deliver on time. The transportation industry rewards hard work and reliability.',
      image: '/truck-CTA.png',
      category: 'Success Stories',
      timeAgo: '8 hours ago',
      likes: 423,
      comments: 78,
      shares: 95,
      tags: ['Success', 'Entrepreneurship', 'Inspiration'],
    },
    {
      id: 5,
      author: {
        name: 'Construction Safety Board',
        avatar: '/excavator.jpg',
        verified: true,
        type: 'Official',
      },
      title: 'Construction Site Safety Guidelines Updated',
      content:
        'New safety protocols for construction sites are now in effect. All heavy machinery operators must wear high-visibility gear, conduct pre-operation inspections, and maintain communication with site supervisors at all times.',
      image: '/bulldozer.png',
      category: 'Safety',
      timeAgo: '12 hours ago',
      likes: 267,
      comments: 19,
      shares: 34,
      tags: ['Construction', 'Safety', 'Guidelines'],
    },
    {
      id: 6,
      author: {
        name: 'Industry News Today',
        avatar: '/business-profile.png',
        verified: true,
        type: 'News',
      },
      title: 'Electric Trucks: The Future of Transportation',
      content:
        'Major transportation companies are investing heavily in electric vehicle technology. By 2030, experts predict 25% of commercial vehicles will be electric. Benefits include reduced operating costs, lower emissions, and government incentives.',
      image: '/live-truck.gif',
      category: 'Industry News',
      timeAgo: '1 day ago',
      likes: 512,
      comments: 89,
      shares: 156,
      tags: ['Electric Vehicles', 'Future', 'Technology'],
    },
    {
      id: 7,
      author: {
        name: 'Maintenance Pro',
        avatar: '/tires.png',
        verified: false,
        type: 'Professional',
      },
      title: 'Tire Maintenance: Extend Life and Improve Safety',
      content:
        'Proper tire maintenance can save thousands of rupees annually. Check tire pressure weekly, rotate tires every 10,000 km, inspect for wear patterns, and replace when tread depth reaches 3mm. Your safety depends on good tires!',
      image: '/tires.png',
      category: 'Maintenance',
      timeAgo: '1 day ago',
      likes: 198,
      comments: 27,
      shares: 41,
      tags: ['Tires', 'Safety', 'Maintenance'],
    },
    {
      id: 8,
      author: {
        name: 'Driver Success Network',
        avatar: '/profile-pic.png',
        verified: false,
        type: 'Community',
      },
      title: 'Building Your Professional Network in Transportation',
      content:
        'Networking is crucial for career growth in transportation. Attend industry events, join professional associations, maintain good relationships with clients, and help fellow drivers. Your network is your net worth!',
      image: '/network.png',
      category: 'Tips & Tricks',
      timeAgo: '2 days ago',
      likes: 334,
      comments: 52,
      shares: 73,
      tags: ['Networking', 'Career Growth', 'Professional Development'],
    },
  ];

  const filteredFeeds = feeds.filter((feed) => {
    if (activeCategory === 'all' || activeCategory === 'All') return true;
    return feed.category === activeCategory;
  });

  const getAuthorTypeColor = (type: string) => {
    switch (type) {
      case 'Official':
        return 'bg-blue-100 text-blue-800';
      case 'Expert':
        return 'bg-purple-100 text-purple-800';
      case 'Professional':
        return 'bg-green-100 text-green-800';
      case 'Community':
        return 'bg-orange-100 text-orange-800';
      case 'News':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProfessionalProtected>
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
                    Professional Feeds
                  </h1>
                  <p className="text-lg md:text-xl">
                    Stay updated with industry news, tips, and insights
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
                  src="/professional-profile.png"
                  alt="Your Profile"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share your experience, tips, or ask questions..."
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
                  <span>Photo</span>
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
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v8.586l-2-2V6a1 1 0 00-1-1H8a1 1 0 00-1 1v5.586l-2 2V4a1 1 0 011-1h11z"
                    />
                  </svg>
                  <span>Poll</span>
                </button>
              </div>
              <button className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600">
                Post
              </button>
            </div>
          </div>

          {/* Feeds List */}
          <div className="space-y-6">
            {filteredFeeds.map((feed) => (
              <div key={feed.id} className="rounded-2xl bg-white p-6 shadow-sm">
                {/* Author Info */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={feed.author.avatar}
                        alt={feed.author.name}
                        width={48}
                        height={48}
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
                      <p className="text-sm text-gray-600">{feed.timeAgo}</p>
                    </div>
                  </div>
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

                {/* Content */}
                <div className="mb-4">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    {feed.title}
                  </h2>
                  <p className="text-gray-700">{feed.content}</p>
                </div>

                {/* Image */}
                {feed.image && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={feed.image}
                      alt={feed.title}
                      width={600}
                      height={300}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {feed.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-sm">{feed.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-sm">{feed.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      <span className="text-sm">{feed.shares}</span>
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
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
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-8 text-center">
            <button className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600">
              Load More Posts
            </button>
          </div>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </ProfessionalProtected>
  );
}
