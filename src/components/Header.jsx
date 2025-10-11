'use client';
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockAPI } from '../lib/mockApi';
// Default navigation links for non-authenticated users
const DEFAULT_NAV_LINKS = [
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
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
            }}
            onClick={handlePopupClick}
          >
            <div className="flex flex-col p-8">
              <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
                Get Started
              </h2>
              <p className="mb-8 text-center text-sm text-gray-500">
                Choose your account type
              </p>

              <div className="space-y-3">
                <motion.button
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('/register/professional')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  <span>Professional</span>
                </motion.button>

                <motion.button
                  className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('/register/company')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  <span>Company</span>
                </motion.button>

                <motion.button
                  className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('/register/business')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  <span>Business</span>
                </motion.button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <motion.span
                  className="cursor-pointer font-semibold text-primary-500 hover:text-primary-600"
                  whileHover={{ scale: 1.05 }}
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
  const [userSession, setUserSession] = useState(null);
  const [currentNavLinks, setCurrentNavLinks] = useState(DEFAULT_NAV_LINKS);
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

  // Check for user session and update navigation
  useEffect(() => {
    const session = mockAPI.getCurrentSession();
    if (session && session.isAuthenticated) {
      setUserSession(session);
      setCurrentNavLinks(session.navigationLinks);
      // Set active link based on current pathname
      const currentPath = pathname;
      const matchingLink = session.navigationLinks.find(
        (link) => currentPath === link.href || currentPath.startsWith(link.href)
      );
      if (matchingLink) {
        setActiveLink(matchingLink.id);
      }
    } else {
      setUserSession(null);
      setCurrentNavLinks(DEFAULT_NAV_LINKS);
    }
  }, [pathname]);

  // Centralized nav handler: routes to different pages based on user session
  const handleNavClick = (linkId, href = null) => {
    setActiveLink(linkId);

    // If user is authenticated, navigate to the specific href
    if (userSession && href) {
      router.push(href);
      setIsOpen(false);
      return;
    }

    // For non-authenticated users, handle partners page separately
    if (linkId === 'partners') {
      if (pathname !== '/partners') router.push('/partners');
      setIsOpen(false);
      return;
    }

    // For in-page anchors on landing page
    const scrollToAnchor = () => {
      const el = document.getElementById(linkId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (pathname === '/' || pathname === '') {
      scrollToAnchor();
      setIsOpen(false);
      return;
    }

    // Navigate to home then scroll after a small delay to allow DOM render
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
      // Only do scroll-based active link detection for non-authenticated users on landing page
      if (!userSession && (pathname === '/' || pathname === '')) {
        let currentSection = 'home';
        for (const link of currentNavLinks) {
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
      }
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

  // Helper to construct profile path based on session user type
  const getProfilePath = () => {
    if (!userSession) return '/';
    // session shape may store user type on userSession.user.userType or userSession.userType
    const userType =
      (userSession.user && userSession.user.userType) ||
      userSession.userType ||
      'business';
    return `/${userType}/profile`;
  };

  // Toggle auth popup
  const toggleAuthPopup = (e) => {
    e.preventDefault();
    setIsAuthPopupOpen(!isAuthPopupOpen);
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
  };

  // Update the renderDesktopNav function to handle authenticated and non-authenticated users
  const renderDesktopNav = () => (
    <nav className="hidden items-center justify-center space-x-1 md:flex">
      {currentNavLinks.map((link) => (
        <motion.div
          key={link.id}
          whileHover={{ y: -1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {userSession ? (
            // Authenticated user navigation
            <Link
              href={link.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeLink === link.id
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => handleNavClick(link.id, link.href)}
            >
              {link.label}
              {activeLink === link.id && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-lg bg-primary-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ zIndex: -1 }}
                />
              )}
            </Link>
          ) : (
            // Non-authenticated user navigation
            <>
              {link.id === 'partners' ? (
                <Link
                  href="/partners"
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeLink === link.id
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.label}
                  {activeLink === link.id && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-lg bg-primary-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </Link>
              ) : (
                <a
                  href={`#${link.id}`}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeLink === link.id
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.label}
                  {activeLink === link.id && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-lg bg-primary-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </a>
              )}
            </>
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
              {currentNavLinks.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {userSession ? (
                    // Authenticated user mobile navigation
                    <Link
                      href={link.href}
                      className={`block py-2 text-sm ${
                        activeLink === link.id
                          ? 'text-[#FF7A00]'
                          : 'text-gray-700'
                      }`}
                      onClick={() => handleNavClick(link.id, link.href)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    // Non-authenticated user mobile navigation
                    <>
                      {link.id === 'partners' ? (
                        <Link
                          href="/partners"
                          className={`block py-2 text-sm ${
                            activeLink === link.id
                              ? 'text-[#FF7A00]'
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
                              ? 'text-[#FF7A00]'
                              : 'text-gray-700'
                          }`}
                          onClick={() => handleNavClick(link.id)}
                        >
                          {link.label}
                        </a>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="pt-2"
              >
                {userSession ? (
                  // Show user profile and logout for authenticated users
                  <div className="space-y-2">
                    <Link
                      href={getProfilePath()}
                      className="flex items-center space-x-3 px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-amber-500">
                        <img
                          src={userSession.profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/profile.png';
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {userSession.user.companyName}
                      </span>
                    </Link>
                    <button
                      onClick={async () => {
                        await mockAPI.logout();
                        setUserSession(null);
                        setCurrentNavLinks(DEFAULT_NAV_LINKS);
                        setIsOpen(false);
                        router.push('/');
                      }}
                      className="block w-full rounded-xl bg-gray-500 px-4 py-2 text-center text-sm font-medium text-white"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  // Show register/login for non-authenticated users
                  <a
                    href="#register"
                    className="block w-full rounded-xl bg-[#EF4444] px-4 py-2 text-center text-sm font-medium text-white"
                    onClick={toggleAuthPopup}
                  >
                    Register/Login
                  </a>
                )}
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

  // Register/Login button or User Profile
  const renderAuthSection = () => {
    if (userSession) {
      // Show user profile section when authenticated
      return (
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={getProfilePath()}
            className="flex items-center gap-3"
            onClick={() => {
              /* keep header state as-is; navigating will handle route change */
            }}
          >
            <span className="text-sm font-medium text-gray-700">
              {userSession.user.companyName}
            </span>
            <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
              <img
                src={userSession.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = '/profile.png';
                }}
              />
            </div>
          </Link>
          <button
            onClick={async () => {
              await mockAPI.logout();
              setUserSession(null);
              setCurrentNavLinks(DEFAULT_NAV_LINKS);
              router.push('/');
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      );
    }

    // Show register/login button when not authenticated
    return (
      <motion.button
        className="hidden rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md md:block"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleAuthPopup}
      >
        Get Started
      </motion.button>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? 'border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm'
            : 'border-transparent bg-white'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            {renderLogo()}

            {/* Desktop Navigation */}
            {renderDesktopNav()}

            {/* Register/Login Button or User Profile */}
            {renderAuthSection()}

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
