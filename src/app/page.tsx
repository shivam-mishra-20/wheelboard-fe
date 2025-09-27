'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhyChoose from '@/components/WhyChoose';
import About from '@/components/About';
import Services from '@/components/Services';
import MissionVision from '@/components/MissionVision';
import Leader from '@/components/Leader';
import Industries from '@/components/Industries';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import './globals.css';

export default function Page() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If you need to load resources up front, do it here
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
    if (typeof document !== 'undefined') document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (loading && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (typeof document !== 'undefined')
        document.body.style.overflow = 'auto';
    };
  }, [loading]);

  return (
    <div className="relative min-h-screen bg-white font-poppins">
      {loading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <Header />
        <main>
          <Hero />
          <WhyChoose />
          <About />
          <Services />
          <MissionVision />
          <Leader />
          <Industries />
          <FAQ />
          <Contact />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
