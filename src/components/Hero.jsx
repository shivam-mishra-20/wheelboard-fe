/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileHeroView = ({ setShowDemoModal, setShowDownloadModal }) => {
  return (
    <div className="relative z-20 flex min-h-[90vh] w-full flex-col px-4 pt-10">
      {/* Background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Diagonal gradient overlay */}
        <div className="absolute left-0 right-0 top-0 h-[70vh] origin-top-right translate-y-[-10%] -rotate-[5deg] transform bg-gradient-to-br from-[#f6f7fd]/80 via-[#f8f9ff] to-transparent" />

        {/* Pink ball - animated floating effect */}
        <motion.img
          initial={{ opacity: 0, scale: 0.7, x: -20 }}
          animate={{
            opacity: 0.85,
            scale: 1,
            x: 0,
            y: [0, -18, 0, 12, 0], // floating effect
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          src="/ball-pink.png"
          alt=""
          className="pointer-events-none absolute right-[-80px] top-[15vh] z-0 h-auto w-[200px] select-none"
          aria-hidden="true"
        />

        {/* Blue ball - animated floating effect */}
        <motion.img
          initial={{ opacity: 0, scale: 0.7, x: 20 }}
          animate={{
            opacity: 0.7,
            scale: 1,
            x: 0,
            y: [0, 14, 0, -10, 0], // floating effect
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: 0.5,
          }}
          src="/ball-blue.png"
          alt=""
          className="pointer-events-none absolute bottom-[15vh] left-[-60px] z-0 h-auto w-[150px] select-none"
          aria-hidden="true"
        />

        {/* Decorative curved line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 0.7, scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute left-0 right-0 top-[45vh] h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        />
      </motion.div>

      {/* Split layout container */}
      <div className="relative z-10 mt-[5vh] flex h-full flex-col">
        {/* Phone Mockup - Now more prominent at top */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            type: 'spring',
            stiffness: 50,
          }}
          className="relative mb-4 mt-8 flex w-full justify-center" // Added mt-8 to move it down
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              // Removed rotation to make it straight by default
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            whileHover={{
              scale: 1.03,
              rotateY: -10, // Changed to negative value to rotate left
            }}
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
              className="xs:w-[200px] w-[180px] drop-shadow-2xl sm:w-[220px]"
            />

            {/* Subtle screen shine effect */}
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

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: -50, y: 10 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute left-0 top-1/4 flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-lg backdrop-blur-sm"
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
              Smart Dashboard
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 50, y: -10 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute bottom-1/4 right-0 flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-lg backdrop-blur-sm"
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
              Real-time Data
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, x: 0 }}
              animate={{ opacity: 1, y: 40, x: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="w-38 absolute left-1/2 top-0 flex translate-x-10 items-center rounded-2xl bg-white px-4 py-1 text-xs font-medium text-yellow-600 shadow-lg backdrop-blur-sm"
              style={{ zIndex: 30 }}
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-yellow-400"></span>
              Actionable Insights
            </motion.div>

            {/* Animated highlight dots */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 2 + i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
                className={`absolute z-20 h-2 w-2 rounded-full bg-gray-400 ${
                  i === 0
                    ? 'left-[20%] top-[30%]'
                    : i === 1
                      ? 'right-[25%] top-[45%]'
                      : 'bottom-[25%] left-[30%]'
                }`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Text aligned to left with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative z-10 mt-5 flex flex-col items-start px-1 text-left"
        >
          <motion.h1 className="xs:text-[2.2rem] mb-2 text-left text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1A1A1A]">
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
              className="xs:text-[2.2rem] mb-1 mt-1 block text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#000000]"
            >
              One Tap Away
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="xs:text-base mb-5 mt-1 text-left text-sm font-semibold text-[#3d3552]"
          >
            <span className="font-bold text-[#3d3552]">
              Transform your fleet into a safer, efficient, and sustainable
              ecosystem.
            </span>
            <br />
            Achieve sustainable growth through{' '}
            <span className="font-bold">Innovation, Intelligent insights</span>,
            and collaborative partnerships— all in one platform.
          </motion.p>

          {/* Buttons with improved animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="z-10 mb-6 flex w-full flex-row justify-start gap-3"
          >
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 5px 20px rgba(111,107,255,0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                setShowDownloadModal(true);
              }}
              className="rounded-lg bg-gradient-to-r from-[#FF7A00] via-[#FF7A00] to-[#E66D00] px-6 py-2.5 text-center text-sm font-semibold text-white transition"
              style={{ minWidth: 150 }}
            >
              Download the App
            </motion.a>

            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 15px rgba(0, 82, 204, 0.15)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                setShowDemoModal(true);
              }}
              className="rounded-lg border-2 border-[#000000] bg-transparent px-6 py-2.5 text-center text-sm font-semibold text-[#000000] transition"
              style={{ minWidth: 150 }}
            >
              Watch Demo
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const DesktopHeroView = ({ setShowDemoModal, setShowDownloadModal }) => {
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);

  return (
    <div className="container relative z-20 mx-auto flex flex-col-reverse items-center justify-between px-4 sm:px-6 lg:flex-row lg:px-8 xl:px-12">
      {/* Left: Text + Pink Ball */}
      <div className="relative z-20 flex w-full max-w-[540px] flex-col items-start pt-8 text-left lg:ml-0 lg:mt-10 lg:w-1/2 lg:pt-0 xl:ml-48 xl:mt-10">
        {/* Pink Ball - animated floating effect */}
        <motion.img
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 0.85,
            scale: 1,
            y: [0, -18, 0, 12, 0], // floating effect
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          src="/ball-pink.png"
          alt=""
          className="left-45 pointer-events-none absolute top-[-40px] z-0 h-auto w-[425px] -translate-x-1/2 select-none lg:top-[15px] lg:w-[350px] xl:top-[5px] xl:w-[425px]"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 flex w-full flex-col items-start text-left"
        >
          <h1 className="xs:text-[2.6rem] relative z-10 mb-2 text-left text-[2.3rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1A1A1A] sm:text-[2.6rem] md:text-[2.8rem] lg:text-[3.2rem]">
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
              className="xs:text-[2.6rem] mb-2 mt-2 block text-[2.3rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#000000] sm:text-[3rem] md:text-[3.2rem]"
            >
              One Tap Away
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="xs:text-lg w-200 relative z-10 mb-6 mt-2 text-left text-base font-semibold text-[#3d3552] md:text-xl"
          >
            <span className="font-bold text-[#3d3552]">
              Transform your fleet into a safer, efficient, and sustainable
              ecosystem.
            </span>
            <br />
            Achieve sustainable growth through{' '}
            <span className="font-bold">Innovation, Intelligent insights</span>
            , and <br />
            collaborative partnerships— all in one platform.
          </motion.p>
          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative z-10 flex w-full flex-row justify-start gap-4 md:mt-4 md:w-auto"
          >
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 6px 24px rgba(0, 82, 204, 0.25)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                setShowDownloadModal(true);
              }}
              className="rounded-lg bg-gradient-to-r from-[#000000] via-[#000000] to-[#FF7A00] px-8 py-3 text-center font-semibold text-white shadow-[0_4px_24px_0_rgba(0,82,204,0.18)] transition"
              style={{ minWidth: 150 }}
            >
              Download the App
            </motion.a>
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 20px rgba(0, 82, 204, 0.12)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                setShowDemoModal(true);
              }}
              className="rounded-lg border-2 border-[#000000] bg-transparent px-8 py-3 text-center font-semibold text-[#000000] shadow-[0_4px_24px_0_rgba(0,82,204,0.08)] transition"
              style={{ minWidth: 150 }}
            >
              Watch Demo
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      {/* Right: Phone Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: 10 }}
        animate={{ opacity: 1, y: -50, rotate: 0 }}
        transition={{
          duration: 1,
          delay: 0.5,
          type: 'spring',
          stiffness: 60,
        }}
        className="relative z-30 mb-0 mt-60 flex w-full justify-center lg:mr-0 lg:mt-40 lg:w-1/2 lg:justify-end xl:mr-48 xl:mt-60"
      >
        <motion.div
          whileHover={{
            y: -15,
            transition: { duration: 0.5, ease: 'easeOut' },
          }}
          className="relative"
          onHoverStart={() => setIsPhoneHovered(true)}
          onHoverEnd={() => setIsPhoneHovered(false)}
          onTapStart={() => setIsPhoneHovered(true)}
          onTapCancel={() => setIsPhoneHovered(false)}
          onTap={() => setIsPhoneHovered(false)}
        >
          <motion.img
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            src="/mobile-ss.png"
            alt="App Preview"
            className="xs:w-[260px] w-[220px] drop-shadow-xl sm:w-[280px] md:w-[300px] lg:w-[370px]"
          />

          {/* Animated interactive elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 2, 0],
              rotateX: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="absolute inset-0 z-10"
          >
            {/* Screen shine effect */}
            <motion.div
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                  'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0) 100%)',
                  'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                ],
                backgroundSize: '200% 200%',
                backgroundPosition: ['0% 0%', '200% 200%', '0% 0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute inset-[15px] z-10 rounded-[18px]"
            />

            {/* Floating feature indicators */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: -60 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute left-0 top-1/4 flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-purple-600 shadow-lg backdrop-blur-sm md:left-[-20px] lg:left-0"
            >
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500"></span>
              Smart Dashboard
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 60 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute bottom-1/3 right-0 flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-purple-600 shadow-lg backdrop-blur-sm md:right-[-20px] lg:right-0"
            >
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500"></span>
              Real-time Data
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, x: 0 }}
              animate={{ opacity: 1, y: 40, x: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="w-38 translate-x-30 absolute left-1/2 top-20 flex h-8 items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-yellow-600 shadow-lg backdrop-blur-sm"
              style={{ zIndex: 30 }}
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-yellow-400"></span>
              Actionable Insights
            </motion.div>
          </motion.div>

          {/* Coming Soon Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={
              // REMOVE the hover logic, always show
              { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="left-1/5 absolute bottom-[-40px] z-40 mr-48 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[#FF7A00]/30 bg-white/95 px-4 py-2 text-xs font-semibold text-[#FF7A00] shadow-lg"
            style={{
              boxShadow: '0 4px 24px 0 rgba(255,109,27,0.10)',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#FF7A00" opacity="0.15" />
              <path
                d="M12 7v5l3 3"
                stroke="#FF7A00"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>
              Our app is launching soon!{' '}
              <span className="font-normal text-[#3d3552]">
                Stay tuned for a smarter fleet experience.
              </span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const TabletHeroView = ({ setShowDemoModal, setShowDownloadModal }) => {
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);

  return (
    <div className="container relative z-20 mx-auto flex flex-col-reverse items-center justify-between px-4 sm:px-6 md:flex-row md:px-8 lg:px-12">
      {/* Left: Text + Pink Ball */}
      <div className="lg:ml-35 relative z-20 flex w-full max-w-[540px] flex-col items-start pt-8 text-left md:ml-0 md:mt-10 md:w-1/2 md:pt-0 lg:mt-20">
        {/* Pink Ball - animated floating effect */}
        <motion.img
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 0.85,
            scale: 1,
            y: [0, -18, 0, 12, 0], // floating effect
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          src="/ball-pink.png"
          alt=""
          className="left-45 pointer-events-none absolute top-[-40px] z-0 h-auto w-[425px] -translate-x-1/2 select-none md:top-[15px] md:w-[350px] lg:top-[5px] lg:w-[425px]"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 flex w-full flex-col items-start text-left"
        >
          <h1 className="xs:text-[2.6rem] relative z-10 mb-2 text-left text-[2.3rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1A1A1A] sm:text-[2.6rem] md:text-[2.8rem] lg:text-[3.2rem]">
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
              className="xs:text-[2.6rem] mb-2 mt-2 block text-[2.3rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#000000] sm:text-[3rem] md:text-[3.2rem]"
            >
              One Tap Away
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="xs:text-lg w-200 relative z-10 mb-6 mt-2 text-left text-base font-semibold text-[#3d3552] md:text-xl"
          >
            <span className="font-bold text-[#3d3552]">
              Transform your fleet into a safer, efficient, and sustainable
              ecosystem.
            </span>
            <br />
            Achieve sustainable growth through{' '}
            <span className="font-bold">Innovation, Intelligent insights</span>
            , and <br />
            collaborative partnerships— all in one platform.
          </motion.p>
          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative z-10 flex w-full flex-row justify-start gap-4 md:mt-4 md:w-auto"
          >
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 6px 24px rgba(0, 82, 204, 0.25)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                setShowDownloadModal(true);
              }}
              className="rounded-lg bg-gradient-to-r from-[#000000] via-[#000000] to-[#FF7A00] px-8 py-3 text-center font-semibold text-white shadow-[0_4px_24px_0_rgba(0,82,204,0.18)] transition"
              style={{ minWidth: 150 }}
            >
              Download the App
            </motion.a>
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 20px rgba(0, 82, 204, 0.12)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                setShowDemoModal(true);
              }}
              className="rounded-lg border-2 border-[#000000] bg-transparent px-8 py-3 text-center font-semibold text-[#000000] shadow-[0_4px_24px_0_rgba(0,82,204,0.08)] transition"
              style={{ minWidth: 150 }}
            >
              Watch Demo
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      {/* Right: Phone Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: 10 }}
        animate={{ opacity: 1, y: -50, rotate: 0 }}
        transition={{
          duration: 1,
          delay: 0.5,
          type: 'spring',
          stiffness: 60,
        }}
        className="lg:mr-30 relative z-30 mb-0 mt-60 flex w-full justify-center md:mr-0 md:mt-40 md:w-1/2 md:justify-end lg:mt-60"
      >
        <motion.div
          whileHover={{
            y: -15,
            transition: { duration: 0.5, ease: 'easeOut' },
          }}
          className="relative"
          onHoverStart={() => setIsPhoneHovered(true)}
          onHoverEnd={() => setIsPhoneHovered(false)}
          onTapStart={() => setIsPhoneHovered(true)}
          onTapCancel={() => setIsPhoneHovered(false)}
          onTap={() => setIsPhoneHovered(false)}
        >
          <motion.img
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            src="/mobile-ss.png"
            alt="App Preview"
            className="xs:w-[260px] w-[220px] drop-shadow-xl sm:w-[280px] md:w-[300px] lg:w-[370px]"
          />

          {/* Animated interactive elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 2, 0],
              rotateX: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="absolute inset-0 z-10"
          >
            {/* Screen shine effect */}
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

            {/* Floating feature indicators */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: -60 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute left-0 top-1/4 flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-purple-600 shadow-lg backdrop-blur-sm md:left-[-20px] lg:left-0"
            >
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500"></span>
              Smart Dashboard
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 60 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute bottom-1/3 right-0 flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-purple-600 shadow-lg backdrop-blur-sm md:right-[-20px] lg:right-0"
            >
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500"></span>
              Real-time Data
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, x: 0 }}
              animate={{ opacity: 1, y: 40, x: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="absolute left-1/2 top-2 flex w-36 translate-x-10 items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-yellow-600 shadow-lg backdrop-blur-sm"
              style={{ zIndex: 30 }}
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-yellow-400"></span>
              Actionable Insights
            </motion.div>
          </motion.div>

          {/* Coming Soon Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={
              // REMOVE the hover logic, always show
              { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute bottom-0 left-1/2 z-40 flex -translate-x-80 items-center gap-2 rounded-xl border border-[#FF7A00]/30 bg-white/95 px-4 py-2 text-sm font-semibold text-[#FF7A00] shadow-lg"
            style={{
              boxShadow: '0 4px 24px 0 rgba(255,109,27,0.10)',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#FF7A00" opacity="0.15" />
              <path
                d="M12 7v5l3 3"
                stroke="#FF7A00"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>
              Our app is launching soon!{' '}
              <span className="font-normal text-[#3d3552]">
                Stay tuned for a smarter fleet experience.
              </span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const DownloadModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        fontFamily: 'Inter',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      {/* Modal Card */}
      <div
        className="relative mx-4 flex w-full max-w-[370px] flex-col items-center rounded-2xl bg-white px-6 py-8 shadow-xl sm:max-w-[460px]"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0,82,204,0.10)',
          border: '1.5px solid #F6F7FD',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-400 transition hover:text-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]"
          aria-label="Close"
          style={{
            background: 'rgba(246,247,253,0.7)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            outline: 'none',
            border: 'none',
            boxShadow: '0 2px 8px 0 rgba(0,82,204,0.06)',
          }}
        >
          &times;
        </button>
        {/* Optional Illustration */}
        <div className="mb-4 mt-2">
          <img
            src="/Logo.png"
            alt="Wheelboard Logo"
            className="h-32 w-auto"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
          />
        </div>
        {/* Title */}
        <h2
          className="mb-2 text-center text-[1.5rem] font-extrabold text-[#1A1A1A] sm:text-2xl"
          style={{ letterSpacing: '-0.01em' }}
        >
          Manage Your Fleet, Smarter.
        </h2>
        {/* Subtitle */}
        <p
          className="mb-6 text-center text-base font-medium text-[#3d3552]"
          style={{ opacity: 0.85, letterSpacing: '-0.01em' }}
        >
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
            className="mb-3 h-12 w-auto rounded-md shadow-sm transition hover:shadow-lg"
            style={{ maxWidth: 180, background: '#fff' }}
          />
        </a>

        <div className="flex w-full justify-center">
          <span className="text-md mt-[-8px] italic text-gray-500">
            (coming soon)
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-b from-[#f9faff] to-[#f6f7fd]"
    >
      {/* Decorative elements */}
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        src="/ball-blue.png"
        alt=""
        className="absolute bottom-[-10vw] right-[160px] z-0 hidden h-auto w-[55vw] max-w-[340px] md:bottom-[-5%] md:right-[10%] md:block md:w-[260px] lg:bottom-[30px] lg:right-[160px] lg:w-[320px] lg:max-w-none"
        aria-hidden="true"
      />

      <motion.img
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        src="/curve-line-up.png"
        alt=""
        className="pointer-events-none absolute left-1/4 top-[30%] z-10 hidden w-[100vw] max-w-[1020px] -translate-x-1/2 select-none md:block md:opacity-50 lg:opacity-90"
        aria-hidden="true"
      />

      <motion.img
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        src="/curve-line-down.png"
        alt=""
        className="pointer-events-none absolute left-1/4 top-[58%] z-10 hidden w-[70vw] max-w-[1020px] -translate-x-1/2 select-none md:block md:opacity-50 lg:opacity-90"
        aria-hidden="true"
      />

      {/* Desktop Layout - ONLY on lg+ screens */}
      <div className="hidden w-full lg:block">
        <DesktopHeroView
          setShowDemoModal={setShowDemoModal}
          setShowDownloadModal={setShowDownloadModal}
        />
      </div>

      {/* Tablet Layout - ONLY on md-lg screens */}
      <div className="hidden w-full md:block lg:hidden">
        <TabletHeroView
          setShowDemoModal={setShowDemoModal}
          setShowDownloadModal={setShowDownloadModal}
        />
      </div>

      {/* Mobile Layout - ONLY on xs-sm screens */}
      <div className="block w-full md:hidden">
        <MobileHeroView
          setShowDemoModal={setShowDemoModal}
          setShowDownloadModal={setShowDownloadModal}
        />
      </div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <>
            {/* Modern Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{
                backdropFilter: 'blur(8px)',
                background:
                  'linear-gradient(120deg, rgba(30,41,59,0.65) 0%, rgba(0,82,204,0.25) 100%)',
              }}
              onClick={() => setShowDemoModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="z-60 fixed inset-0 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoModal onClose={() => setShowDemoModal(false)} />
            </motion.div>
          </>
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

const VideoModal = ({ onClose }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef(null);

  // Prevent scroll bleed when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Pause video on close
  useEffect(() => {
    return () => {
      if (videoRef.current) videoRef.current.pause();
    };
  }, []);

  // Responsive sizing for 16:9
  const maxW = Math.min(window.innerWidth * 0.96, 900);
  const maxH = Math.min(window.innerHeight * 0.88, 540);
  let width = maxW,
    height = (width * 9) / 16;
  if (height > maxH) {
    height = maxH;
    width = (height * 16) / 9;
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        fontFamily: 'Inter, Satoshi, SF Pro, Arial, sans-serif',
      }}
    >
      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="relative flex flex-col items-center rounded-2xl bg-white shadow-2xl"
        style={{
          width,
          height: height + 80, // extra for caption and controls
          maxWidth: '98vw',
          maxHeight: '98vh',
          pointerEvents: 'auto',
          boxShadow: '0 8px 32px 0 rgba(0,82,204,0.10)',
          border: '1.5px solid #F6F7FD',
          padding: 0,
          overflow: 'visible',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-400 transition hover:text-red-400 focus:ring-2 focus:ring-[#FF7A00]"
          aria-label="Close"
          style={{
            background: 'rgba(246,247,253,0.7)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            outline: 'none',
            border: 'none',
            boxShadow: '0 2px 8px 0 rgba(0,82,204,0.06)',
          }}
        >
          &times;
        </button>
        {/* Video Container */}
        <div
          className="mt-8 flex items-center justify-center overflow-hidden rounded-xl bg-black"
          style={{
            width: width - 32,
            height: height - 32,
            background: '#000',
            boxShadow: '0 2px 16px 0 rgba(0,82,204,0.10)',
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            src="/wheelboard.mp4"
            controls
            autoPlay
            muted={isMuted}
            playsInline
            className="rounded-xl bg-black"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: '#000',
              outline: 'none',
            }}
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                } else {
                  videoRef.current.pause();
                }
              }
            }}
          />
          {/* Unmute/Mute Toggle */}
          <button
            onClick={() => setIsMuted((m) => !m)}
            className="absolute bottom-3 left-3 rounded-full bg-white/80 p-2 text-[#000000] shadow transition hover:bg-[#FF7A00]/90 hover:text-white focus:ring-2 focus:ring-[#000000]"
            style={{
              border: 'none',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              // Mute icon
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 9L5 13H2v-2h3l4-4v8l-4-4H2v2h3l4 4V9z"
                  fill="currentColor"
                />
                <line
                  x1="16"
                  y1="8"
                  x2="22"
                  y2="16"
                  stroke="#FF7A00"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              // Unmute icon
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 9L5 13H2v-2h3l4-4v8l-4-4H2v2h3l4 4V9z"
                  fill="currentColor"
                />
                <path
                  d="M16 8c1.5 1.5 1.5 6 0 7.5"
                  stroke="#000000"
                  strokeWidth="2"
                />
                <path
                  d="M19 5c3 3 3 11 0 14"
                  stroke="#FF7A00"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
        {/* Caption */}
        <div className="mb-4 mt-4 flex w-full justify-center">
          <span
            className="text-center text-sm font-medium text-[#3d3552] sm:text-base"
            style={{
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              color: '#3d3552',
              opacity: 0.85,
            }}
          >
            Experience how Wheelboard works
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
