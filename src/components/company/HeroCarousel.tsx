'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export default function HeroCarousel({
  slides,
  autoPlay = true,
  autoPlayDelay = 5000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const carouselRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Handle resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      setIsMobile(innerWidth < 640);
      setIsTablet(innerWidth >= 640 && innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoPlay || !autoScroll) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, autoScroll, nextSlide]);

  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 5000);
  };

  // Handle swipe gestures
  const handleDragStart = () => {
    controls.stop();
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
    controls.start({ x: 0 });
  };

  // Get slide position for stacked carousel effect
  const getSlidePosition = (index: number) => {
    if (isMobile) {
      return index === currentSlide ? 'center' : 'hidden';
    }

    const diff = (index - currentSlide + slides.length) % slides.length;

    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === slides.length - 1) return 'left';
    if (diff === 2) return 'farRight';
    if (diff === slides.length - 2) return 'farLeft';
    return 'hidden';
  };

  // Get slide styles based on position
  const getSlideStyles = (position: string) => {
    // Define the return type for slide styles
    type SlideStyle = {
      transformOrigin: string;
      transform: string;
      aspectRatio: string;
      width?: string;
      zIndex?: number;
      boxShadow?: string;
      outline?: string;
      filter?: string;
      opacity?: number;
    };

    // Base styles
    const styles: SlideStyle = {
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

  // Render mobile view
  const renderMobileView = () => {
    // Mobile will render the stacked carousel (touch-friendly) similar to desktop
    return (
      <div
        className="relative overflow-hidden py-0"
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        <motion.div
          ref={carouselRef}
          className="relative h-[220px] w-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ x }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {slides.map((slide, index) => {
              // compute position same way as desktop so mobile shows the stacked cards
              const diff =
                (index - currentSlide + slides.length) % slides.length;
              let position = 'hidden';
              if (diff === 0) position = 'center';
              else if (diff === 1) position = 'right';
              else if (diff === slides.length - 1) position = 'left';
              else if (diff === 2) position = 'farRight';
              else if (diff === slides.length - 2) position = 'farLeft';

              const slideStyles = getSlideStyles(position);

              // derive simple numeric/style values to avoid complex inline ternaries
              const leftVal =
                position === 'center'
                  ? '50%'
                  : position === 'left'
                    ? '18%'
                    : position === 'right'
                      ? '82%'
                      : position === 'farLeft'
                        ? '4%'
                        : position === 'farRight'
                          ? '96%'
                          : '150%';

              const scaleVal =
                position === 'center'
                  ? 1
                  : position === 'left' || position === 'right'
                    ? 0.86
                    : 0.72;
              const rotateYVal =
                position === 'left'
                  ? 20
                  : position === 'right'
                    ? -20
                    : position === 'farLeft'
                      ? 30
                      : position === 'farRight'
                        ? -30
                        : 0;
              const opacityVal =
                position === 'hidden'
                  ? 0
                  : position === 'center'
                    ? 1
                    : position === 'left' || position === 'right'
                      ? 0.95
                      : 0.8;

              return (
                <motion.div
                  key={slide.id}
                  className="absolute overflow-hidden rounded-[20px] shadow-xl"
                  initial={false}
                  animate={{
                    left: leftVal,
                    x: '-50%',
                    scale: scaleVal,
                    zIndex: slideStyles.zIndex || 0,
                    opacity: opacityVal,
                    rotateY: rotateYVal,
                  }}
                  transition={{
                    type: 'tween',
                    ease: 'easeInOut',
                    duration: 0.5,
                  }}
                  whileTap={{ scale: position === 'center' ? 0.995 : 0.96 }}
                  whileHover={position !== 'hidden' ? { translateY: -4 } : {}}
                  style={{
                    width: slideStyles.width || (isMobile ? '88%' : '50%'),
                    aspectRatio: slideStyles.aspectRatio || '16/9',
                    transformOrigin:
                      slideStyles.transformOrigin || 'center center',
                    boxShadow: slideStyles.boxShadow,
                    outline: slideStyles.outline,
                    transform: slideStyles.transform || 'perspective(1200px)',
                  }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="h-full w-full object-cover"
                      draggable={false}
                      style={{ filter: slideStyles.filter || 'none' }}
                      priority={index === currentSlide}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile navigation dots */}
        <div className="absolute -bottom-2 left-0 right-0 z-20 mt-4 flex items-center justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'h-[8px] w-[8px] bg-[#0052CC]'
                  : 'h-[6px] w-[6px] bg-gray-300'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render desktop view
  const renderDesktopView = () => {
    return (
      <div
        className="relative overflow-hidden py-24"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={carouselRef}
          className="relative h-[360px] w-[100%]"
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
                  className="absolute overflow-hidden rounded-[36px] shadow-2xl"
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
                    zIndex: slideStyles.zIndex || 0,
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
                    width: slideStyles.width || '0%',
                    aspectRatio: slideStyles.aspectRatio || '16/9',
                    transformOrigin:
                      slideStyles.transformOrigin || 'center center',
                    boxShadow: slideStyles.boxShadow,
                    outline: slideStyles.outline,
                    transform: slideStyles.transform || 'perspective(1200px)',
                  }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="h-full w-full object-cover"
                      draggable={false}
                      style={{ filter: slideStyles.filter || 'none' }}
                      priority={index === currentSlide}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>
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
                    currentSlide === index
                      ? 'h-[10px] w-[10px] bg-[#0052CC] shadow-md'
                      : 'h-[8px] w-[8px] bg-gray-300'
                  }`}
                  onClick={() => goToSlide(index)}
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
              className="rounded-full bg-white bg-opacity-20 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-opacity-50 hover:text-black focus:outline-none"
              aria-label="Next slide"
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative mb-10 overflow-auto md:mb-20">
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
}
