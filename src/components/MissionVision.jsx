import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const MissionVisionSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screens for conditional rendering
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      id="mission-vision"
      className="relative overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-8"
    >
      {/* Glassy background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#000000]/30 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#FF7A00]/20 blur-3xl"></div>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
          Our <span className="text-[#535353]">Mission</span> and{' '}
          <span className="text-[#FF7A00]">Vision</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Guided by clear principles to transform the transport industry.
        </p>
      </div>

      {isMobile ? renderMobileView() : renderDesktopView()}
    </section>
  );
};

// Desktop view rendering function
const renderDesktopView = () => (
  <div className="relative z-10 mx-auto max-w-4xl space-y-16">
    {/* Mission Card */}
    <motion.div
      className="relative mr-0 sm:mr-40"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Foreground card */}
      <div
        className="relative flex flex-col items-center rounded-2xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-md backdrop-filter transition-all hover:bg-white/90 sm:p-10 md:flex-row"
        style={{
          minHeight: 320,
          height: 280,
          maxWidth: 760,
          width: '100%',
          margin: '0 auto',
          alignItems: 'center',
        }}
      >
        {/* Text */}
        <div className="z-10 flex-1 text-left md:w-1/2">
          <h3 className="mb-4 text-xl font-bold text-gray-800 sm:text-2xl">
            Our Mission
          </h3>
          <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
            To promote sustainable practices and efficient transport operations
            that deliver exceptional value to our Clients while making a
            meaningful, positive impact on Society. We are committed to
            advancing eco-friendly logistics solutions that support both
            business success and social responsibility.
          </p>
          {/* <motion.div
            className="absolute bottom-[-2] left-8 text-gray-200 text-6xl sm:text-7xl"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <FaQuoteLeft />
          </motion.div> */}
        </div>

        {/* Van image */}
        <div className="relative flex min-w-[220px] flex-1 items-end justify-end md:w-1/2">
          <img
            src="/VAN 1.png"
            alt="Mission Van"
            className="pointer-events-none absolute bottom-[-110px] right-[-200px] w-80 transform select-none drop-shadow-xl sm:w-[480px] md:w-[560px] lg:w-[600px]"
            style={{
              maxWidth: '150%',
              height: 'auto',
              zIndex: 20,
            }}
          />
        </div>
      </div>
    </motion.div>

    {/* Vision Card */}
    <motion.div
      className="relative ml-0 sm:ml-40"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Foreground card */}
      <div
        className="relative flex flex-col items-center rounded-2xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-md backdrop-filter transition-all hover:bg-white/90 sm:p-10 md:flex-row-reverse"
        style={{
          minHeight: 320,
          height: 240,
          maxWidth: 760,
          width: '100%',
          margin: '0 auto',
          alignItems: 'center',
        }}
      >
        {/* Text */}
        <div className="z-10 flex-1 text-left md:w-1/2 md:text-right">
          <h3 className="mb-4 text-xl font-bold text-gray-800 sm:text-2xl">
            Our Vision
          </h3>
          <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
            To become a key driving force in transforming the transport industry
            into a Safer, Efficient, and Sustainable ecosystem, where every
            stakeholder thrives through Innovation and Collaborative
            partnerships, building a better future.
          </p>
          {/* <motion.div
            className="absolute bottom-[-2] right-8 text-gray-200 text-6xl sm:text-7xl rotate-180"
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <FaQuoteLeft />
          </motion.div> */}
        </div>

        {/* Van image */}
        <div className="relative flex min-w-[220px] flex-1 items-end justify-start md:w-1/2">
          <img
            src="/truck-CTA.png"
            alt="Vision Van"
            className="pointer-events-none absolute bottom-[-110px] left-[-200px] w-80 transform select-none drop-shadow-xl sm:w-[480px] md:w-[560px] lg:w-[600px]"
            style={{
              maxWidth: '150%',
              height: 'auto',
              zIndex: 20,
            }}
          />
        </div>
      </div>
    </motion.div>
  </div>
);

// Mobile view rendering function
const renderMobileView = () => (
  <div className="relative z-10 mx-auto max-w-sm space-y-24">
    {/* Mission Card - Mobile */}
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Van image positioned above card for mobile */}
      <div className="relative mb-[-20px] flex h-40 justify-center">
        <img
          src="/VAN 1.png"
          alt="Mission Van"
          className="pointer-events-none w-60 transform select-none drop-shadow-xl"
          style={{ zIndex: 20 }}
        />
      </div>

      {/* Foreground card */}
      <div className="relative flex flex-col items-center rounded-2xl border border-white/20 bg-white/80 p-6 text-center shadow-xl backdrop-blur-md backdrop-filter transition-all hover:bg-white/90">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Our Mission</h3>
        <p className="text-sm leading-relaxed text-gray-700">
          To promote sustainable practices and efficient transport operations
          that deliver exceptional value to our Clients while making a
          meaningful, positive impact on Society. We are committed to advancing
          eco-friendly logistics solutions that support both business success
          and social responsibility.
        </p>
        {/* <motion.div
          className="text-gray-200 text-5xl mt-4"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FaQuoteLeft />
        </motion.div> */}
      </div>
    </motion.div>

    {/* Vision Card - Mobile */}
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Van image positioned above card for mobile */}
      <div className="relative mb-[-20px] flex h-40 justify-center">
        <img
          src="/truck-CTA.png"
          alt="Vision Van"
          className="pointer-events-none w-60 select-none drop-shadow-xl"
          style={{ zIndex: 20 }}
        />
      </div>

      {/* Foreground card */}
      <div className="relative flex flex-col items-center rounded-2xl border border-white/20 bg-white/80 p-6 text-center shadow-xl backdrop-blur-md backdrop-filter transition-all hover:bg-white/90">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Our Vision</h3>
        <p className="text-sm leading-relaxed text-gray-700">
          To become a key driving force in transforming the transport industry
          into a Safer, Efficient, and Sustainable ecosystem, where every
          stakeholder thrives through Innovation and Collaborative partnerships,
          building a better future.
        </p>
        {/* <motion.div
          className="text-gray-200 text-5xl mt-4 rotate-180"
          animate={{ scale: [1, 1.1, 1], rotate: [180, 175, 180] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FaQuoteLeft />
        </motion.div> */}
      </div>
    </motion.div>
  </div>
);

export default MissionVisionSection;
