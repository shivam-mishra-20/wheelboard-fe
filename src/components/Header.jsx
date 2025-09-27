'use client';
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // motion used throughout
// Navigation links data moved outside component to avoid recreating on each render
const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  // { id: "why-choose", label: "Why Choose" },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'mission-vision', label: 'Mission & Vision' },
  { id: 'industries', label: 'Industries' },
  { id: 'partners', label: 'Partners' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

// Auth Popup Component
const AuthPopup = ({ isOpen, onClose, navigateTo }) => {
  // Prevent clicks inside the popup from closing it
  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            onClick={handlePopupClick}
          >
            <div className="flex flex-col p-6">
              <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
                Get Started Today
              </h2>
              <p className="mb-6 text-center text-gray-600">
                Choose your registration type
              </p>

              <motion.button
                className="mb-4 flex items-center justify-center rounded-xl bg-[#FF5A5F] py-5 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/login/professional')}
              >
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                Register as Professional
              </motion.button>

              <motion.button
                className="mb-4 flex items-center justify-center rounded-xl bg-[#1A202C] py-5 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/login/company')}
              >
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </span>
                Register as Company
              </motion.button>

              <motion.button
                className="mb-4 flex items-center justify-center rounded-xl bg-[#1A202C] py-5 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/login/business')}
              >
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </span>
                Register as Business
              </motion.button>

              <div className="mt-4 text-center text-gray-600">
                Already have an account?
                <motion.span
                  className="ml-1 cursor-pointer font-medium text-[#FF6D1B]"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigateTo('/login')}
                >
                  Sign in
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [temporaryExpanded, setTemporaryExpanded] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const [vw, setVw] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize viewport width and subscribe to resize
  useEffect(() => {
    const update = () =>
      setVw(typeof window !== 'undefined' ? window.innerWidth : 0);
    update();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    return undefined;
  }, []);

  // Centralized nav handler: routes to /partners or back to landing and scrolls to anchor
  const handleNavClick = (linkId) => {
    setActiveLink(linkId);
    // Partners has its own dedicated page
    if (linkId === 'partners') {
      // If already on partners, do nothing
      if (pathname !== '/partners') router.push('/partners');
      setIsOpen(false);
      return;
    }

    // For in-page anchors: if we're not on landing, go there first, then scroll
    const scrollToAnchor = () => {
      const el = document.getElementById(linkId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (pathname === '/' || pathname === '') {
      scrollToAnchor();
      setIsOpen(false);
      return;
    }

    // navigate to home then scroll after a small delay to allow DOM render
    router.push('/');
    setTimeout(scrollToAnchor, 140);
    setIsOpen(false);
  };

  // Handle scroll event to change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Reset temporary expanded state on scroll
      if (temporaryExpanded) {
        setTemporaryExpanded(false);
      }

      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track last scroll position using ref (if future logic needs direction)
      lastScrollYRef.current = window.scrollY;

      // Hide mobile menu on scroll
      if (isOpen) setIsOpen(false);

      // --- Active link highlight based on scroll ---
      // Get all section elements by id
      let currentSection = 'home';
      // Use NAV_LINKS (stable constant) here to avoid referencing navLinks before it's initialized
      for (const link of NAV_LINKS) {
        const section = document.getElementById(link.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            currentSection = link.id;
            break;
          }
        }
      }
      setActiveLink(currentSection);
    };

    // Bind only in browser
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      // Initialize last scroll position safely
      lastScrollYRef.current = window.scrollY || 0;
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
    return undefined;
  }, [isOpen, temporaryExpanded, isAuthPopupOpen]);

  // Handle logo click to temporarily expand navbar
  const handleLogoClick = () => {
    if (scrolled) {
      setTemporaryExpanded(true);
      // Auto collapse after 3 seconds if no interaction
      setTimeout(() => {
        setTemporaryExpanded(false);
      }, 3000);
    }
  };

  // Determine if navbar should appear expanded
  const isExpanded = !scrolled || temporaryExpanded;

  // Toggle auth popup
  const toggleAuthPopup = (e) => {
    e.preventDefault();
    setIsAuthPopupOpen(!isAuthPopupOpen);
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
  };

  // Update the renderDesktopNav function to match the image design
  const renderDesktopNav = () => (
    <nav className="hidden items-center justify-center space-x-8 md:flex">
      {NAV_LINKS.map((link) => (
        <motion.div
          key={link.id}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {link.id === 'partners' ? (
            <Link
              href="/partners"
              className={`relative text-sm font-medium ${
                activeLink === link.id
                  ? 'text-[#FF6D1B]'
                  : 'text-gray-700 hover:text-[#0052CC]'
              } transition-colors duration-300`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
              {activeLink === link.id && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#FF6D1B]"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ) : (
            <a
              href={`#${link.id}`}
              className={`relative text-sm font-medium ${
                activeLink === link.id
                  ? 'text-[#FF6D1B]'
                  : 'text-gray-700 hover:text-[#0052CC]'
              } transition-colors duration-300`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
              {activeLink === link.id && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#FF6D1B]"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </a>
          )}
        </motion.div>
      ))}
    </nav>
  );

  // Redesigned mobile navigation
  const renderMobileNav = () => (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-full z-50 bg-white shadow-lg"
          >
            <div className="space-y-2 px-4 py-2">
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.id === 'partners' ? (
                    <Link
                      href="/partners"
                      className={`block py-2 text-sm ${
                        activeLink === link.id
                          ? 'text-[#FF6D1B]'
                          : 'text-gray-700'
                      }`}
                      onClick={() => handleNavClick(link.id)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={`#${link.id}`}
                      className={`block py-2 text-sm ${
                        activeLink === link.id
                          ? 'text-[#FF6D1B]'
                          : 'text-gray-700'
                      }`}
                      onClick={() => handleNavClick(link.id)}
                    >
                      {link.label}
                    </a>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="pt-2"
              >
                <a
                  href="#register"
                  className="block w-full rounded-xl bg-[#EF4444] px-4 py-2 text-center text-sm font-medium text-white"
                  onClick={toggleAuthPopup}
                >
                  Register/Login
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Logo component
  const renderLogo = () => (
    <Link href="/" className="flex items-center">
      <img src="/Logo.png" alt="Wheelboard Logo" className="h-16 w-auto" />
      <span className="ml-0 font-poppins text-xl font-bold text-[#535353]">
        Wheelboard
      </span>
    </Link>
  );

  // Register/Login button
  const renderRegisterButton = () => (
    <motion.a
      href="#register"
      className="hidden rounded-xl bg-[#EF4444] px-6 py-2 text-sm font-medium text-white md:block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleAuthPopup}
    >
      Register/Login
    </motion.a>
  );

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            {renderLogo()}

            {/* Desktop Navigation */}
            {renderDesktopNav()}

            {/* Register/Login Button */}
            {renderRegisterButton()}

            {/* Mobile Navigation */}
            {renderMobileNav()}
          </div>
        </div>
      </header>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        navigateTo={(path) => {
          setIsAuthPopupOpen(false);
          router.push(path);
        }}
      />
    </>
  );
};

export default Header;
