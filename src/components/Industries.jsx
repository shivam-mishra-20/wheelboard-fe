import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
} from 'framer-motion';
import { FaTruck, FaHardHat, FaMountain, FaIndustry } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Industries = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const carouselRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const slides = [
    {
      id: 1,
      image: '/logistics-professional.jpg',
      alt: 'Logistics professional organizing cargo',
    },
    { id: 2, image: '/truck-01.jpg', alt: 'Delivery truck on highway' },
    { id: 3, image: '/Bus.jpg', alt: 'Commercial passenger bus' },
    { id: 4, image: '/mining-truck.jpg', alt: 'Heavy mining dump truck' },
    { id: 5, image: '/excavator.jpg', alt: 'Construction excavator' },
    {
      id: 6,
      image: '/Yellow-truck.jpg',
      alt: 'Construction crane lifting materials',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      setWidth(innerWidth);
      setIsMobile(innerWidth < 640);
      setIsTablet(innerWidth >= 640 && innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const getSlidePosition = (index) => {
    if (isMobile) {
      return index === currentIndex ? 'center' : 'hidden';
    }

    const diff = (index - currentIndex + slides.length) % slides.length;

    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === slides.length - 1) return 'left';
    if (diff === 2) return 'farRight';
    if (diff === slides.length - 2) return 'farLeft';
    return 'hidden';
  };

  // Auto-scroll functionality
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    let interval;
    if (autoScroll) {
      interval = setInterval(() => {
        nextSlide();
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScroll, currentIndex]);

  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  // Apply stacked card position values to match the reference image
  const getSlideStyles = (position) => {
    // Base styles
    const styles = {
      transformOrigin: 'center center',
      transform: `perspective(1200px)`,
      aspectRatio: '16/9',
    };

    // Position-specific styles
    if (position === 'center') {
      return {
        ...styles,
        width: isMobile ? '90%' : isTablet ? '55%' : '50%',
        zIndex: 30,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
        outline: '2px solid rgba(0, 0, 0, 0.08)',
      };
    } else if (position === 'left') {
      return {
        ...styles,
        width: isMobile ? '0' : isTablet ? '40%' : '38%',
        zIndex: 20,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        filter: 'brightness(0.9)',
      };
    } else if (position === 'right') {
      return {
        ...styles,
        width: isMobile ? '0' : isTablet ? '40%' : '38%',
        zIndex: 20,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        filter: 'brightness(0.9)',
      };
    } else if (position === 'farLeft' || position === 'farRight') {
      return {
        ...styles,
        width: isMobile ? '0' : '30%',
        zIndex: 10,
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.05)',
        filter: 'brightness(0.85)',
      };
    }

    return {
      ...styles,
      width: '0%',
      opacity: 0,
    };
  };

  // Handle swipe gestures with parallax effect
  const handleDragStart = () => {
    controls.stop();
  };

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
    controls.start({ x: 0 });
  };

  // Update service card background colors
  const serviceCards = [
    {
      title: 'Logistics',
      icon: <FaTruck className="text-3xl text-white" />,
      description:
        'Unlock full potential of your Fleet with Wheelboard smart dashboard. Plan, Grow Sustainably- all without any initial investment.',
      bgColor: 'from-[#000000] to-[#000000]',
      bgImage: '/red-truck.png',
    },
    {
      title: 'Construction',
      icon: <FaHardHat className="text-3xl font-bold text-white" />,
      description:
        'Drive Efficiency. Enhanced Safety. Optimize Asset Utilization',
      bgColor: 'from-[#FF7A00] to-[#FF7A00]',
      bgImage: '/bulldozer.png',
    },
    {
      title: 'Mining',
      icon: <FaMountain className="text-3xl text-white" />,
      description:
        'Empower your fleet operations with the right skills and actionable, data-driven insights.',
      bgColor: 'from-[#333333] to-[#333333]',
      bgImage: '/mining-truck.jpg',
    },
  ];

  // Render mobile view
  const renderMobileView = () => {
    return (
      <div className="py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#535353]">
            Industries <span className="text-[#EF4444]">we Serve</span>
          </h2>
          <p className="text-lg font-semibold text-[#535353]">
            Specialized logistics solutions
            <br />
            across various sectors
          </p>
        </div>

        {/* Service Cards - Mobile */}
        <div className="mb-10 flex flex-col gap-4">
          {serviceCards.map((card, index) => (
            <div
              key={index}
              className="relative transform overflow-hidden rounded-xl p-5 text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Background image with overlay */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.bgImage})` }}
              />

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 z-10 bg-gradient-to-br ${card.bgColor} opacity-85`}
              />

              {/* Card content */}
              <div className="relative z-20">
                <div className="icons">{card.icon}</div>
                <h3 className="text-shadow-sm mb-2 text-xl font-bold">
                  {card.title}
                </h3>
                <p className="text-shadow-sm text-sm opacity-95">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel - Mobile */}
        <div className="relative pb-12 pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="mx-auto aspect-video w-full overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].alt}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots - Mobile */}
          <div className="absolute -bottom-2 left-0 right-0 z-10 mt-4 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'h-[8px] w-[8px] bg-[#000000]'
                    : 'h-[6px] w-[6px] bg-gray-300'
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutoScroll(false);
                  setTimeout(() => setAutoScroll(true), 5000);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render desktop view
  const renderDesktopView = () => {
    return (
      <div className="mt-0">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-[#535353] md:text-4xl">
            Industries <span className="text-[#EF4444]">we Serve</span>
          </h2>
          <div className="mx-auto mt-6 max-w-2xl text-[#535353]">
            <p className="text-center text-xl font-semibold text-[#535353] md:text-2xl">
              Specialized logistics solutions
              <br />
              across various sectors
            </p>
          </div>
        </div>

        {/* Service Cards - Desktop */}
        <div className="mb-16 grid grid-cols-3 gap-6">
          {serviceCards.map((card, index) => (
            <div
              key={index}
              className="relative transform overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.bgImage})` }}
              />

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 z-10 bg-gradient-to-br ${card.bgColor} opacity-80`}
              />

              {/* 3D elements - subtle abstract shapes */}
              <div className="absolute bottom-0 right-0 z-10 h-32 w-32 translate-x-16 translate-y-16 rotate-12 transform rounded-full bg-white opacity-10"></div>
              <div className="absolute left-0 top-0 z-10 h-20 w-20 -translate-x-10 -translate-y-10 transform rounded-full bg-white opacity-10"></div>

              {/* Content with 3D effect */}
              <div className="relative z-20">
                <div className="icons">{card.icon}</div>
                <h3 className="text-shadow mb-2 text-xl font-bold">
                  {card.title}
                </h3>
                <p className="text-shadow-sm text-sm opacity-90">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Carousel - Desktop */}
        <div
          className="relative overflow-hidden py-20"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={carouselRef}
            className="relative h-[420px] w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {slides.map((slide, index) => {
                const position = getSlidePosition(index);
                const slideStyles = getSlideStyles(position);

                return (
                  <motion.div
                    key={slide.id}
                    className="absolute overflow-hidden rounded-[32px] shadow-2xl"
                    initial={false}
                    animate={{
                      left:
                        position === 'center'
                          ? '50%'
                          : position === 'left'
                            ? '22%'
                            : position === 'right'
                              ? '78%'
                              : position === 'farLeft'
                                ? '5%'
                                : position === 'farRight'
                                  ? '95%'
                                  : '150%',
                      x: '-50%',
                      scale:
                        position === 'center'
                          ? 1
                          : position === 'left' || position === 'right'
                            ? 0.85
                            : 0.7,
                      zIndex: slideStyles.zIndex,
                      opacity:
                        position === 'hidden'
                          ? 0
                          : position === 'center'
                            ? 1
                            : position === 'left' || position === 'right'
                              ? 0.9
                              : 0.75,
                      rotateY:
                        position === 'left'
                          ? 25
                          : position === 'right'
                            ? -25
                            : position === 'farLeft'
                              ? 35
                              : position === 'farRight'
                                ? -35
                                : 0,
                    }}
                    transition={{
                      type: 'tween',
                      ease: 'easeInOut',
                      duration: 0.6,
                    }}
                    whileHover={
                      position !== 'hidden'
                        ? {
                            scale:
                              position === 'center'
                                ? 1.02
                                : position === 'left'
                                  ? 0.88
                                  : position === 'right'
                                    ? 0.88
                                    : 0.73,
                            translateX:
                              position === 'left'
                                ? '-10px'
                                : position === 'right'
                                  ? '10px'
                                  : '0px',
                            opacity:
                              position === 'center'
                                ? 1
                                : position === 'left' || position === 'right'
                                  ? 0.95
                                  : 0.8,
                            transition: { duration: 0.3, ease: 'easeOut' },
                          }
                        : {}
                    }
                    style={{
                      width: slideStyles.width,
                      aspectRatio: slideStyles.aspectRatio,
                      transformOrigin: slideStyles.transformOrigin,
                      boxShadow: slideStyles.boxShadow,
                      outline: slideStyles.outline,
                      transform: slideStyles.transform,
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                      draggable={false}
                      style={{ filter: slideStyles.filter || 'none' }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation controls - Desktop */}
          <div className="absolute -bottom-4 left-0 right-0 z-40 flex flex-col items-center gap-3 pb-6">
            <div className="flex items-center gap-10">
              <button
                onClick={() => {
                  prevSlide();
                  setAutoScroll(false);
                  setTimeout(() => setAutoScroll(true), 5000);
                }}
                className="rounded-full bg-white bg-opacity-30 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-opacity-50 hover:text-black focus:outline-none"
                aria-label="Previous slide"
              >
                <IoIosArrowBack size={20} />
              </button>

              <div className="flex items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    className={`rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? 'h-[10px] w-[10px] bg-[#000000] shadow-md'
                        : 'h-[8px] w-[8px] bg-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setAutoScroll(false);
                      setTimeout(() => setAutoScroll(true), 5000);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  nextSlide();
                  setAutoScroll(false);
                  setTimeout(() => setAutoScroll(true), 5000);
                }}
                className="rounded-full bg-white bg-opacity-30 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-opacity-50 hover:text-black focus:outline-none"
                aria-label="Next slide"
              >
                <IoIosArrowForward size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="industries" className="mx-auto max-w-7xl px-4 py-4 pb-8">
      <div className="rounded-3xl border border-gray-100 bg-white bg-opacity-80 p-6 shadow-xl backdrop-blur-md backdrop-filter md:p-8">
        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>
    </section>
  );
};

export default Industries;
