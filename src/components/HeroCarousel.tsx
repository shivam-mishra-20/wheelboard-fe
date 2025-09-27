'use client';

import { useState, useEffect } from 'react';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  stats: {
    label: string;
    value: string;
  }[];
}

const carouselData: CarouselItem[] = [
  {
    id: 1,
    title: 'Fleet Management Made Simple',
    description:
      'Track, manage, and optimize your entire fleet from one powerful dashboard.',
    image: '/fleet-hero.jpg',
    stats: [
      { label: 'Active Vehicles', value: '2,847' },
      { label: 'Total Distance', value: '1.2M km' },
      { label: 'Fuel Saved', value: '15%' },
    ],
  },
  {
    id: 2,
    title: 'Smart Job Scheduling',
    description:
      'Automate job assignments and optimize routes for maximum efficiency.',
    image: '/jobs-hero.jpg',
    stats: [
      { label: 'Jobs Completed', value: '18,392' },
      { label: 'On-time Delivery', value: '96.5%' },
      { label: 'Route Optimization', value: '23%' },
    ],
  },
  {
    id: 3,
    title: 'Driver Performance Analytics',
    description:
      'Monitor driver behavior, safety scores, and performance metrics in real-time.',
    image: '/driver-hero.jpg',
    stats: [
      { label: 'Active Drivers', value: '1,524' },
      { label: 'Safety Score', value: '94.2%' },
      { label: 'Training Hours', value: '2,400' },
    ],
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselData.length) % carouselData.length
    );
  };

  return (
    <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-primary-bg via-primary-secondary/30 to-primary-accent/20">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute right-20 top-20 h-64 w-64 rounded-full bg-primary-secondary/20"></div>
        <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-primary-accent/10"></div>
        <div className="absolute left-1/3 top-1/2 h-32 w-32 rounded-full bg-primary-button/10"></div>
      </div>

      <div className="relative z-10 mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center">
          <div className="w-full">
            {/* Current Slide Content */}
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              {/* Text Content */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-poppins text-4xl font-bold leading-tight text-primary-accent md:text-5xl">
                    {carouselData[currentSlide].title}
                  </h1>
                  <p className="mt-4 text-lg leading-relaxed text-gray-600">
                    {carouselData[currentSlide].description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  {carouselData[currentSlide].stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary-button">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button className="rounded-lg bg-primary-button px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-button/90">
                    Get Started Free
                  </button>
                  <button className="rounded-lg border border-primary-accent px-8 py-3 font-semibold text-primary-accent transition-colors hover:bg-primary-accent hover:text-white">
                    Watch Demo
                  </button>
                </div>
              </div>

              {/* Image/Visual Content */}
              <div className="relative">
                <div className="rounded-2xl bg-white p-8 shadow-xl">
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-primary-bg to-primary-secondary/50">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary-button/20">
                        <svg
                          className="h-12 w-12 text-primary-button"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <p className="font-medium text-primary-accent">
                        Dashboard Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform items-center space-x-4">
          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <svg
              className="h-5 w-5 text-primary-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-primary-button'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <svg
              className="h-5 w-5 text-primary-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
