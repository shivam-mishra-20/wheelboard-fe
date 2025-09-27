/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Background Pattern Component - more scalable than images
const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* Abstract geometric pattern */}
    <svg
      className="absolute h-full w-full opacity-10"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0052CC" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF6D1B" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0052CC" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF6D1B" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      <path
        d="M0,200 L1000,200"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />
      <path
        d="M0,400 L1000,400"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />
      <path
        d="M0,600 L1000,600"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />
      <path
        d="M0,800 L1000,800"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />
      <path
        d="M200,0 L200,1000"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />
      <path
        d="M400,0 L400,1000"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />
      <path
        d="M600,0 L600,1000"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />
      <path
        d="M800,0 L800,1000"
        stroke="#0052CC"
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />

      {/* Abstract shapes */}
      <circle cx="200" cy="200" r="80" fill="url(#grad1)" />
      <circle cx="800" cy="700" r="120" fill="url(#grad2)" />
      <path
        d="M500,100 Q650,150 700,300 T900,400"
        stroke="#FF6D1B"
        strokeWidth="2"
        strokeOpacity="0.3"
        fill="none"
      />
      <path
        d="M100,400 Q250,450 300,600 T500,800"
        stroke="#0052CC"
        strokeWidth="2"
        strokeOpacity="0.3"
        fill="none"
      />
    </svg>

    {/* Gradient overlay for depth */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-transparent"></div>
  </div>
);

const MobileHeroView = ({ setShowDemoModal, setShowDownloadModal }) => {
  return (
    <div className="relative z-20 flex min-h-[80vh] w-full flex-col items-center justify-center px-4">
      {/* Feature badges with cleaner design */}
      {/*
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute left-4 top-[30%] z-20 flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#0052CC] shadow-lg"
      >
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#0052CC]"></span>
        Smart Dashboard
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-[35%] right-4 z-20 flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#FF6D1B] shadow-lg"
      >
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6D1B]"></span>
        Real-time Data
      </motion.div>
      */}

      {/* Phone Mockup with refined animations */}
      {/*
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          type: 'spring',
          stiffness: 50,
        }}
        className="relative mb-4 mt-20 flex w-full justify-center"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.img
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            src="/mobile-ss.png"
            alt="App Preview"
            className="xs:w-[200px] w-[180px] rounded-2xl drop-shadow-2xl sm:w-[220px]"
          />

          {/* Subtle screen shine effect 
          <motion.div
            animate={{
              background: [
                'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0) 100%)',
                'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
              ],
              backgroundSize: '200% 200%',
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-[3px] z-10 rounded-[18px]"
          />
        </motion.div>
      </motion.div>
      */}

      {/* Text content centered */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 mt-0 flex flex-col items-center px-1 text-center"
      >
        <motion.h1 className="xs:text-[2.2rem] mb-2 text-center text-[2rem] font-extrabold leading-tight tracking-tight text-[#535353]">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="block"
          >
            Smart Logistics,
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="xs:text-[2.2rem] mb-1 mt-1 block text-[2rem] font-extrabold leading-[1.1] tracking-tight text-[#EF4444]"
          >
            One Tap Away
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="xs:text-base mb-5 mt-1 max-w-lg text-center text-sm font-medium leading-relaxed text-gray-700"
        >
          <span className="font-semibold text-gray-800">
            Transform your fleet into a safer, efficient, and sustainable
            ecosystem.
          </span>
          <br />
          Achieve sustainable growth through{' '}
          <span className="font-semibold">
            Innovation, Intelligent insights
          </span>
          , and collaborative partnerships— all in one platform.
        </motion.p>

        {/* Call-to-action buttons centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="z-10 mb-6 flex w-full max-w-sm flex-row justify-center gap-3"
        >
          <motion.a
            whileHover={{
              scale: 1.03,
              boxShadow: '0 4px 16px rgba(0,82,204,0.25)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            href="#download"
            onClick={(e) => {
              e.preventDefault();
              setShowDownloadModal(true);
            }}
            className="rounded-lg bg-gradient-to-r from-[#EF4444] to-[#f36969] px-6 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:from-[#0052CC] hover:to-[#1666D6]"
            style={{ minWidth: 150 }}
          >
            Download the App
          </motion.a>

          <motion.a
            whileHover={{
              scale: 1.03,
              boxShadow: '0 4px 12px rgba(0, 82, 204, 0.12)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            href="#demo"
            onClick={(e) => {
              e.preventDefault();
              setShowDemoModal(true);
            }}
            className="rounded-lg border-2 border-[#EF4444] bg-white px-6 py-2.5 text-center text-sm font-semibold text-[#EF4444] shadow-sm transition hover:bg-[#F5F9FF]"
            style={{ minWidth: 150 }}
          >
            Watch Demo
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

const DesktopHeroView = ({ setShowDemoModal, setShowDownloadModal }) => {
  return (
    <div className="container relative z-20 mx-auto flex flex-col items-center justify-center px-4 lg:flex-row lg:px-8 xl:px-12">
      {/* Left: Text Content - centered for desktop */}
      <div className="relative z-20 flex w-full max-w-[720px] flex-col items-center pt-8 text-center lg:ml-0 lg:mt-0 lg:w-full lg:pt-0 xl:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 flex w-full flex-col items-center text-center"
        >
          <h1 className="relative z-10 mb-3 text-center text-[2.3rem] font-extrabold leading-tight tracking-tight text-[#535353] sm:text-[2.6rem] md:text-[2.8rem] lg:text-[3.2rem]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="block"
            >
              Smart Logistics,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-2 mt-2 block text-[2.3rem] font-extrabold leading-[1.1] tracking-tight text-[#f36969] sm:text-[2.6rem] md:text-[2.8rem] lg:text-[3.2rem]"
            >
              One Tap Away
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative z-10 mb-6 mt-2 max-w-xl text-center text-base font-medium leading-relaxed text-gray-700 md:text-lg lg:text-xl"
          >
            <span className="font-semibold text-gray-800">
              Transform your fleet into a safer, efficient, and sustainable
              ecosystem.
            </span>
            <br />
            Achieve sustainable growth through{' '}
            <span className="font-semibold">
              Innovation, Intelligent insights
            </span>
            , and <br className="hidden md:block" />
            collaborative partnerships— all in one platform.
          </motion.p>

          {/* Call-to-action buttons centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative z-10 flex w-full flex-row justify-center gap-4 md:mt-4 md:w-auto"
          >
            <motion.a
              whileHover={{
                scale: 1.03,
                boxShadow: '0 6px 20px rgba(0, 82, 204, 0.25)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                setShowDownloadModal(true);
              }}
              className="rounded-lg bg-gradient-to-r from-[#EF4444] to-[#f36969] px-8 py-3 text-center font-semibold text-white shadow-md transition"
              style={{ minWidth: 150 }}
            >
              Download the App
            </motion.a>
            <motion.a
              whileHover={{
                scale: 1.03,
                boxShadow: '0 4px 16px rgba(0, 82, 204, 0.15)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                setShowDemoModal(true);
              }}
              className="rounded-lg border-2 border-[#EF4444] bg-white px-8 py-3 text-center font-semibold text-[#EF4444] shadow-sm transition hover:bg-[#F5F9FF]"
              style={{ minWidth: 150 }}
            >
              Watch Demo
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Right: Phone Mockup - commented out to keep centered layout */}
      {/*
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.5,
          type: 'spring',
          stiffness: 60,
        }}
        className="relative z-30 mb-0 mt-10 flex w-full justify-center lg:mr-0 lg:mt-0 lg:w-1/2 lg:justify-end xl:mt-0"
      >
        
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute left-10 top-1/4 z-20 flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#0052CC] shadow-lg backdrop-blur-sm md:left-0 lg:left-10"
        >
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-[#0052CC]"></span>
          Smart Dashboard
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-1/3 right-10 z-20 flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#FF6D1B] shadow-lg backdrop-blur-sm md:right-0 lg:right-10"
        >
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-[#FF6D1B]"></span>
          Real-time Data
        </motion.div>

        <motion.div
          whileHover={{
            y: -10,
            transition: { duration: 0.5, ease: 'easeOut' },
          }}
          className="relative"
        >
          <motion.img
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            src="/mobile-ss.png"
            alt="App Preview"
            className="w-[220px] rounded-3xl drop-shadow-2xl sm:w-[280px] md:w-[300px] lg:w-[340px]"
          />

       
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotateY: [0, 1, 0],
              rotateX: [0, 0.5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="absolute inset-0 z-10"
          >
       
            <motion.div
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                  'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0) 100%)',
                  'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                ],
                backgroundSize: '200% 200%',
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute inset-[5px] z-10 rounded-[18px]"
            />
          </motion.div>

     
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute bottom-[-30px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[#0052CC]/10 bg-white/95 px-4 py-2 text-xs font-semibold text-[#0052CC] shadow-lg"
            style={{
              boxShadow: '0 4px 20px 0 rgba(0,82,204,0.10)',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#0052CC" opacity="0.15" />
              <path
                d="M12 7v5l3 3"
                stroke="#0052CC"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>
              Our app is launching soon!{' '}
              <span className="font-normal text-gray-700">
                Stay tuned for a smarter fleet experience.
              </span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
      */}
    </div>
  );
};

// Modernized download modal design
const DownloadModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Modern backdrop with blur */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Card */}
      <div
        className="relative mx-4 flex w-full max-w-[370px] flex-col items-center rounded-2xl bg-white px-6 py-8 shadow-xl sm:max-w-[460px]"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0,82,204,0.15)',
          border: '1px solid #F6F7FD',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100/80 text-xl font-bold text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Logo */}
        <div className="mb-4 mt-2">
          <img src="/Logo.png" alt="Wheelboard Logo" className="h-28 w-auto" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Manage Your Fleet, Smarter.
        </h2>

        {/* Subtitle */}
        <p className="mb-7 text-center text-base font-normal text-gray-600">
          Download the Wheelboard app to access smart dashboard, performance
          insights, and control on the go.
        </p>

        {/* Google Play Button */}
        <a
          href="https://play.google.com/store/apps/details?id=com.wheelboard.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full justify-center"
        >
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            className="mb-3 h-14 w-auto transition hover:opacity-90"
            style={{ maxWidth: 200 }}
          />
        </a>

        <div className="flex w-full justify-center">
          <span className="text-md mt-[-4px] text-sm italic text-gray-500">
            (coming soon)
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Simplified VideoModal now mirrors DownloadModal's backdrop & transitions
const VideoModal = ({ onClose }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef(null);

  // Responsive sizing for 16:9 (kept same style as existing file)
  const maxW = Math.min(window.innerWidth * 0.96, 900);
  const maxH = Math.min(window.innerHeight * 0.88, 540);
  let width = maxW,
    height = (width * 9) / 16;
  if (height > maxH) {
    height = maxH;
    width = (height * 16) / 9;
  }

  // Prevent scroll bleed when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, []);

  // Pause video on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) videoRef.current.pause();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close modal"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative mx-4 flex w-full max-w-[960px] flex-col items-center rounded-2xl bg-white px-6 py-6 shadow-xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(0,82,204,0.15)',
            border: '1px solid #F6F7FD',
            width,
            height: height + 70,
            maxWidth: '98vw',
            maxHeight: '98vh',
            pointerEvents: 'auto',
            zIndex: 60,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100/80 text-xl font-bold text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>

          {/* Video Container */}
          <div
            className="mt-6 flex items-center justify-center overflow-hidden rounded-xl bg-black"
            style={{
              width: Math.max(300, width - 32),
              height: Math.max(180, height - 32),
            }}
          >
            <video
              ref={videoRef}
              src="/wheelboard.mp4"
              controls
              autoPlay
              muted={isMuted}
              playsInline
              className="h-full w-full rounded-xl bg-black object-contain outline-none"
            />

            {/* Unmute/Mute Toggle */}
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#0052CC] shadow transition hover:bg-[#0052CC] hover:text-white"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                  <path
                    d="M23 9l-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 9l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                  <path
                    d="M19.07 4.93a10 10 0 010 14.14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15.54 8.46a5 5 0 010 7.07"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Caption */}
          <div className="mb-4 mt-4 flex w-full justify-center">
            <span className="text-center text-sm font-medium text-gray-600">
              Experience how Wheelboard works
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Hero = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#f9faff] to-[#f6f7fd]"
    >
      {/* SVG Background instead of image files */}
      <BackgroundPattern />

      {/* Desktop Layout - ONLY on lg+ screens */}
      <div className="hidden w-full lg:block">
        <DesktopHeroView
          setShowDemoModal={setShowDemoModal}
          setShowDownloadModal={setShowDownloadModal}
        />
      </div>

      {/* Mobile Layout - ONLY on xs-md screens */}
      <div className="block w-full lg:hidden">
        <MobileHeroView
          setShowDemoModal={setShowDemoModal}
          setShowDownloadModal={setShowDownloadModal}
        />
      </div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <VideoModal onClose={() => setShowDemoModal(false)} />
        )}
      </AnimatePresence>

      {/* Download App Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <DownloadModal onClose={() => setShowDownloadModal(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
