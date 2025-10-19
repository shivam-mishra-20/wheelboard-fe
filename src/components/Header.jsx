'use client';
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockAPI } from '../lib/mockApi';
import {
  FiMenu,
  FiX,
  FiUser,
  FiHome,
  FiInfo,
  FiHelpCircle,
  FiMail,
  FiBriefcase,
  FiTarget,
  FiUsers,
  FiLogOut,
  FiChevronRight,
  FiLayers,
} from 'react-icons/fi';
import { Building2 } from 'lucide-react';

// Default navigation links for non-authenticated users with icons
const DEFAULT_NAV_LINKS = [
  { id: 'home', label: 'Home', icon: <FiHome className="mr-2" /> },
  { id: 'about', label: 'About Us', icon: <FiInfo className="mr-2" /> },
  { id: 'services', label: 'Services', icon: <FiBriefcase className="mr-2" /> },
  {
    id: 'mission-vision',
    label: 'Mission & Vision',
    icon: <FiTarget className="mr-2" />,
  },
  {
    id: 'industries',
    label: 'Industries',
    icon: <FiLayers className="mr-2" />,
  },
  { id: 'partners', label: 'Partners', icon: <FiUsers className="mr-2" /> },
  { id: 'faq', label: 'FAQ', icon: <FiHelpCircle className="mr-2" /> },
  { id: 'contact', label: 'Contact', icon: <FiMail className="mr-2" /> },
];

// Auth Popup Component - Refined
const AuthPopup = ({ isOpen, onClose, navigateTo }) => {
  // Prevent clicks inside the popup from closing it
  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 350,
            }}
            onClick={handlePopupClick}
          >
            <div className="relative flex flex-col p-8">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>

              <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
                Get Started
              </h2>
              <p className="mb-8 text-center text-sm text-gray-500">
                Choose your account type
              </p>

              <div className="space-y-3">
                <motion.button
                  className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('/register/professional')}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-3 h-5 w-5" />
                    <span>Professional</span>
                  </div>
                  <FiChevronRight className="ml-2 opacity-70" />
                </motion.button>

                <motion.button
                  className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('/register/company')}
                >
                  <div className="flex items-center">
                    <Building2 className="mr-3 h-5 w-5" />
                    <span>Company</span>
                  </div>
                  <FiChevronRight className="ml-2 opacity-70" />
                </motion.button>

                <motion.button
                  className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('/register/business')}
                >
                  <div className="flex items-center">
                    <FiBriefcase className="mr-3 h-5 w-5" />
                    <span>Business</span>
                  </div>
                  <FiChevronRight className="ml-2 opacity-70" />
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [currentNavLinks, setCurrentNavLinks] = useState(DEFAULT_NAV_LINKS);
  const lastScrollYRef = useRef(0);
  const [vw, setVw] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Initialize viewport width and subscribe to resize - optimized
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

  // Check for user session and update navigation - memoized with useCallback
  const updateSessionAndNavigation = useCallback(() => {
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

  useEffect(() => {
    updateSessionAndNavigation();
  }, [updateSessionAndNavigation]);

  // Centralized nav handler - improved and memoized
  const handleNavClick = useCallback(
    (linkId, href = null) => {
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
        if (el) {
          const headerHeight = headerRef.current
            ? headerRef.current.offsetHeight
            : 64;
          const elementPosition =
            el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
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
    },
    [userSession, pathname, router]
  );

  // Optimized scroll handler using useCallback and throttling
  const handleScroll = useCallback(() => {
    if (temporaryExpanded) {
      setTemporaryExpanded(false);
    }

    if (window.scrollY > 10) {
      if (!scrolled) setScrolled(true);
    } else {
      if (scrolled) setScrolled(false);
    }

    lastScrollYRef.current = window.scrollY;

    // Hide mobile menu on scroll
    if (isOpen) setIsOpen(false);

    // Active link highlight based on scroll - only for landing page
    if (!userSession && (pathname === '/' || pathname === '')) {
      const headerHeight = headerRef.current
        ? headerRef.current.offsetHeight
        : 64;

      let currentSection = 'home';
      let closestSectionDistance = Infinity;

      for (const link of currentNavLinks) {
        const section = document.getElementById(link.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top - headerHeight);

          if (
            distance < closestSectionDistance &&
            rect.top <= headerHeight + 100
          ) {
            closestSectionDistance = distance;
            currentSection = link.id;
          }
        }
      }

      if (currentSection !== activeLink) {
        setActiveLink(currentSection);
      }
    }
  }, [
    scrolled,
    temporaryExpanded,
    isOpen,
    userSession,
    pathname,
    currentNavLinks,
    activeLink,
  ]);

  // Throttled scroll event listener
  useEffect(() => {
    let timeoutId = null;
    const throttledScrollHandler = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100); // Throttle to every 100ms
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', throttledScrollHandler);
      lastScrollYRef.current = window.scrollY || 0;
      return () => {
        window.removeEventListener('scroll', throttledScrollHandler);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [handleScroll]);

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
  const getProfilePath = useCallback(() => {
    if (!userSession) return '/';
    const userType =
      (userSession.user && userSession.user.userType) ||
      userSession.userType ||
      'business';
    return `/${userType}/profile`;
  }, [userSession]);

  // Toggle auth popup
  const toggleAuthPopup = useCallback(
    (e) => {
      e.preventDefault();
      setIsAuthPopupOpen(!isAuthPopupOpen);
      // Close mobile menu if open
      if (isOpen) setIsOpen(false);
    },
    [isAuthPopupOpen, isOpen]
  );

  // Handle logout - memoized
  const handleLogout = useCallback(async () => {
    await mockAPI.logout();
    setUserSession(null);
    setCurrentNavLinks(DEFAULT_NAV_LINKS);
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
    router.push('/');
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProfileDropdownOpen]);

  // Redesigned desktop navigation with icons
  const renderDesktopNav = () => (
    <nav className="hidden items-center justify-center space-x-1 md:flex">
      {currentNavLinks.map((link) => (
        <motion.div
          key={link.id}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {userSession ? (
            // Authenticated user navigation
            <Link
              href={link.href}
              className={`group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeLink === link.id
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => handleNavClick(link.id, link.href)}
            >
              {link.icon && (
                <span
                  className={`${activeLink === link.id ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'} mr-1.5 transition-colors`}
                >
                  {link.icon}
                </span>
              )}
              <span>{link.label}</span>
              {activeLink === link.id && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-2/3 rounded-full bg-primary-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          ) : (
            // Non-authenticated user navigation
            <>
              {link.id === 'partners' ? (
                <Link
                  href="/partners"
                  className={`group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeLink === link.id
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.icon && (
                    <span
                      className={`${activeLink === link.id ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'} transition-colors`}
                    >
                      {link.icon}
                    </span>
                  )}
                  <span>{link.label}</span>
                  {activeLink === link.id && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-2/3 rounded-full bg-primary-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              ) : (
                <a
                  href={`#${link.id}`}
                  className={`group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeLink === link.id
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.icon && (
                    <span
                      className={`${activeLink === link.id ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'} transition-colors`}
                    >
                      {link.icon}
                    </span>
                  )}
                  <span>{link.label}</span>
                  {activeLink === link.id && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-2/3 rounded-full bg-primary-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
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

  // Redesigned mobile navigation with improved animations
  const renderMobileNav = () => (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute left-0 right-0 top-full z-50 -mt-1 rounded-b-2xl bg-white shadow-lg"
          >
            <motion.div
              className="max-h-[80vh] overflow-y-hidden py-3"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
                closed: {},
              }}
            >
              {currentNavLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 },
                  }}
                  className="px-4"
                >
                  {userSession ? (
                    // Authenticated user mobile navigation
                    <Link
                      href={link.href}
                      className={`flex items-center space-x-3 rounded-xl px-3 py-3 ${
                        activeLink === link.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleNavClick(link.id, link.href)}
                    >
                      <span
                        className={
                          activeLink === link.id
                            ? 'text-primary-500'
                            : 'text-gray-500'
                        }
                      >
                        {link.icon || <FiChevronRight size={16} />}
                      </span>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ) : (
                    // Non-authenticated user mobile navigation
                    <>
                      {link.id === 'partners' ? (
                        <Link
                          href="/partners"
                          className={`flex items-center space-x-3 rounded-xl px-3 py-3 ${
                            activeLink === link.id
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => handleNavClick(link.id)}
                        >
                          <span
                            className={
                              activeLink === link.id
                                ? 'text-primary-500'
                                : 'text-gray-500'
                            }
                          >
                            {link.icon || <FiChevronRight size={16} />}
                          </span>
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      ) : (
                        <a
                          href={`#${link.id}`}
                          className={`flex items-center space-x-3 rounded-xl px-3 py-3 ${
                            activeLink === link.id
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => handleNavClick(link.id)}
                        >
                          <span
                            className={
                              activeLink === link.id
                                ? 'text-primary-500'
                                : 'text-gray-500'
                            }
                          >
                            {link.icon || <FiChevronRight size={16} />}
                          </span>
                          <span className="font-medium">{link.label}</span>
                        </a>
                      )}
                    </>
                  )}
                </motion.div>
              ))}

              {/* Auth section in mobile menu */}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 10 },
                }}
                className="mt-3 border-t border-gray-100 px-4 pt-3"
              >
                {userSession ? (
                  // Show user profile and logout for authenticated users
                  <div className="space-y-3 p-2">
                    <Link
                      href={getProfilePath()}
                      className="flex items-center space-x-3 rounded-xl px-3 py-3 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-amber-500 ring-2 ring-gray-200">
                        <img
                          src={userSession.profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/profile.png';
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {userSession.user.companyName}
                        </span>
                        <span className="text-xs text-gray-500">
                          View profile
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-rose-600"
                    >
                      <FiLogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  // Show register/login for non-authenticated users
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleAuthPopup}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-center text-sm font-medium text-white shadow-md"
                  >
                    <FiUser size={16} />
                    <span>Get Started</span>
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Enhanced logo component with subtle animation
  const renderLogo = () => (
    <Link
      href="/"
      className="group flex items-center gap-2 transition-all duration-300"
      onClick={handleLogoClick}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0"
      >
        <img
          src="/Logo.png"
          alt="Wheelboard Logo"
          className="h-12 w-auto transition-all duration-300 group-hover:brightness-110 sm:h-12 md:h-14"
        />
      </motion.div>
      <span className="font-poppins text-lg font-bold text-gray-800 transition-all duration-300 group-hover:text-primary-600 sm:text-xl md:text-xl">
        Wheelboard
      </span>
    </Link>
  );

  // Register/Login button or User Profile with Dropdown - enhanced
  const renderAuthSection = () => {
    if (userSession) {
      // Show user profile section with dropdown when authenticated
      return (
        <div className="relative hidden md:block" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-gray-50"
          >
            <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 transition-all duration-200 group-hover:border-primary-100 group-hover:shadow-md">
              <img
                src={userSession.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = '/profile.png';
                }}
              />
            </div>
            <span className="hidden text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900 xl:block">
              {userSession.user.companyName}
            </span>
            <motion.div
              animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronRight className="rotate-90 text-gray-400" size={16} />
            </motion.div>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isProfileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                <Link
                  href={getProfilePath()}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <FiUser size={16} className="text-gray-500" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Show register/login button when not authenticated
    return (
      <motion.button
        className="hidden items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md md:flex"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={toggleAuthPopup}
      >
        <FiUser size={16} />
        <span>Get Started</span>
      </motion.button>
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-gray-200 bg-white/95 backdrop-blur-sm'
            : 'border-transparent bg-white'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          {userSession ? (
            // Logged in layout: Profile left, Nav center, Logo right
            <div className="flex h-16 items-center justify-between">
              {/* Left side - User Profile (Desktop only) */}
              <div className="hidden md:block">{renderAuthSection()}</div>

              {/* Center - Desktop Navigation */}
              <div className="hidden md:flex md:flex-1 md:justify-center">
                {renderDesktopNav()}
              </div>

              {/* Mobile - Logo on left */}
              <div className="md:hidden">{renderLogo()}</div>

              {/* Right side - Logo (Desktop only) */}
              <div className="hidden md:block">{renderLogo()}</div>

              {/* Mobile Navigation Toggle */}
              {renderMobileNav()}
            </div>
          ) : (
            // Not logged in layout: Logo left, Nav center, Get Started right
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
          )}
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
