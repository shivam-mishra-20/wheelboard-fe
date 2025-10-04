import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
} from 'react-icons/fa';
import ContactFormModal from './ContactFormModal';
import InfoModal from './InfoModal';

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    title: '',
    content: '',
  });
  const router = useRouter();

  // Social media links
  const socialLinks = {
    linkedin: 'https://www.linkedin.com/company/wheelboard-solutions/',
    instagram:
      'https://www.instagram.com/wheelboard_solutions?igsh=MXJzaDdvcW4yOHRnYQ==',
    whatsapp: 'https://wa.me/7420861942',
    facebook: 'https://www.facebook.com/share/14HFAMYoBZa/',
    twitter: 'https://twitter.com/wheelboard',
  };

  // Content for different pages
  const pageContent = {
    support: {
      title: 'Customer Support',
      content: (
        <div className="space-y-4">
          <p>
            Our customer support team is available 24/7 to assist you with any
            questions or concerns you may have about our products and services.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Contact Options:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Email: hello@wheelboard.in</li>
              <li>Phone: 020‑67320492</li>
              <li>What's app for chat- 7420861942</li>
            </ul>
          </div>
          <p>
            For urgent matters, please call our support hotline for immediate
            assistance.
          </p>
        </div>
      ),
    },
    help: {
      title: 'Help Center',
      content: (
        <div className="space-y-4">
          <p>
            Welcome to the Wheelboard Help Center. Find answers to frequently
            asked questions and learn how to make the most of our services.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Popular Help Topics:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Getting Started with Wheelboard</li>
              <li>Managing Your Account</li>
              <li>Tracking Shipments</li>
              <li>Understanding Analytics</li>
              <li>Troubleshooting Common Issues</li>
            </ul>
          </div>
          <p>
            Can't find what you're looking for? Contact our support team for
            personalized assistance.
          </p>
        </div>
      ),
    },
    articles: {
      title: 'Resource Articles',
      content: (
        <div className="space-y-4">
          <p>
            Explore our collection of articles covering industry insights, best
            practices, and detailed guides on logistics and transportation
            management.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Featured Articles:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>5 Ways to Optimize Your Supply Chain</li>
              <li>The Future of Logistics: Trends to Watch</li>
              <li>Sustainable Practices in Transportation</li>
              <li>Understanding Last-Mile Delivery Challenges</li>
              <li>Implementing Effective Route Planning</li>
            </ul>
          </div>
          <p>
            New articles are published weekly. Check back often for the latest
            content.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms and Conditions',
      content: (
        <div className="space-y-4">
          <p>
            By using the Wheelboard platform and services, you agree to comply
            with and be bound by the following terms and conditions of use.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Key Points:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                License: Wheelboard grants you a limited, non-exclusive,
                non-transferable license to use the platform.
              </li>
              <li>
                User Accounts: You are responsible for maintaining the
                confidentiality of your account information.
              </li>
              <li>
                Prohibited Uses: The platform may not be used for any illegal or
                unauthorized purpose.
              </li>
              <li>
                Intellectual Property: All content included on the platform is
                the property of Wheelboard or its content suppliers.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4">
          <p>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our platform.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Information We Collect:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Personal Data: Name, email address, phone number, and billing
                information.
              </li>
              <li>
                Usage Data: Information on how you access and use our services.
              </li>
              <li>
                Device Data: Information about your device, browser type, and IP
                address.
              </li>
            </ul>
          </div>
          <p>We do not sell your personal information to third parties.</p>
        </div>
      ),
    },
    tracking: {
      title: 'Shipment Tracking',
      content: (
        <div className="space-y-4">
          <p>
            Our advanced shipment tracking system provides real-time updates on
            the location and status of your cargo throughout its journey.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Key Features:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Real-time GPS tracking with minute-by-minute updates</li>
              <li>Automated notifications for status changes</li>
              <li>Detailed shipment history and delivery confirmation</li>
              <li>
                Integration with major carriers and transportation partners
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    routes: {
      title: 'Route Tracking',
      content: (
        <div className="space-y-4">
          <p>
            Monitor and optimize transportation routes with our comprehensive
            route tracking technology.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Capabilities:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Dynamic route optimization based on traffic and weather
                conditions
              </li>
              <li>Historical route analysis for improved planning</li>
              <li>Driver performance metrics and safety monitoring</li>
              <li>Fuel consumption tracking and efficiency reporting</li>
            </ul>
          </div>
        </div>
      ),
    },
    freight: {
      title: 'Freight Management',
      content: (
        <div className="space-y-4">
          <p>
            Streamline your freight operations with our comprehensive management
            system designed for businesses of all sizes.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Our Solution Includes:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Carrier selection and rate negotiation tools</li>
              <li>Automated document management and customs processing</li>
              <li>Load planning and capacity optimization</li>
              <li>Freight audit and payment reconciliation</li>
            </ul>
          </div>
        </div>
      ),
    },
    analytics: {
      title: 'Real-Time Analytics',
      content: (
        <div className="space-y-4">
          <p>
            Make data-driven decisions with our powerful real-time analytics
            platform that transforms transportation data into actionable
            insights.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Analytics Capabilities:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Interactive dashboards with customizable metrics</li>
              <li>Predictive analytics for demand forecasting</li>
              <li>Performance benchmarking against industry standards</li>
              <li>Cost analysis and optimization recommendations</li>
            </ul>
          </div>
        </div>
      ),
    },
    tyre: {
      title: 'Tire management',
      content: (
        <div className="space-y-4">
          <p>
            Optimize your fleet performance with our tire management solutions:{' '}
            <b>“Onsite tire maintenance”</b> directly on vehicles and{' '}
            <b>“Comprehensive End-of-Life Tire”</b> (ELT) management
          </p>
          <div>
            <h4 className="mb-2 font-medium">Benefits:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Operational cost saving</li>
              <li>Optimize tyre performance</li>
              <li>Enhanced safety</li>
              <li>Reduced vehicle downtime</li>
              <li>Sustainable ‘End-of-Life Tire’ (ELT) management</li>
            </ul>
          </div>
        </div>
      ),
    },
    skill: {
      title: 'Skill management',
      content: (
        <div className="space-y-4">
          <p>
            Enhance your fleet efficiency with our Skill management platform.
            Connect with right skill for your unique operations.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Benefits:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Find skilled drivers, delivering efficiency and safety.</li>
              <li>
                Overcome challenges like, Driver shortage and vehicle idling.
              </li>
              <li>Build workforce that fits your operation.</li>
              <li>
                Performance analytics helps you to Track and enhance your team
                skill.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    consultation: {
      title: 'Strategic Solutions',
      content: (
        <div className="space-y-4">
          <p>
            Get expert advice tailored to your operation needs. Our service
            enables you to focus on business growth, while we manage all
            operational complexities, ensuring a sustainable success.
          </p>
          <div>
            <h4 className="mb-2 font-medium">Benefits:</h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>Fleet optimization strategies</li>
              <li>Technology integration support</li>
              <li>Sustainable solutions for operational challenges.</li>
              <li>Key value insights and reporting</li>
            </ul>
          </div>
        </div>
      ),
    },
  };

  // Updated navigation handler
  const handleNavigation = (path, modalContent = null) => {
    // If modal content is provided, show the modal instead of navigating
    if (modalContent) {
      setInfoModal({
        isOpen: true,
        title: modalContent.title,
        content: modalContent.content,
      });
      return;
    }

    // Using window.location for external links and anchor links
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else if (path.startsWith('/admin')) {
      // Use Next.js router for admin routes (if such pages exist)
      router.push(path);
    } else {
      // For other internal links
      if (path.startsWith('#')) {
        // in-page anchor
        const el = document.getElementById(path.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push(path);
      }
    }
  };

  const closeInfoModal = () => {
    setInfoModal({ ...infoModal, isOpen: false });
  };

  return (
    <footer className="rounded-t-3xl bg-[#272627] px-4 py-8 font-poppins text-white sm:rounded-t-4xl sm:px-6 sm:py-10 lg:px-16 lg:py-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Main Footer Layout - Two Columns Side by Side on larger screens */}
        <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-14">
          {/* Left Column: Logo, Tagline & Contact Form */}
          <div className="mb-8 w-full lg:mb-0 lg:w-1/3">
            {/* Logo & Tagline */}
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center sm:mb-4">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src="/Logo.png"
                  alt="Wheelboard Logo"
                  className="h-12 w-12 rounded-full bg-white object-cover p-0 sm:h-16 sm:w-16"
                />
                <h4 className="ml-3 text-xl font-semibold">Wheelboard</h4>
              </div>
              <p className="mb-5 text-sm text-gray-400 sm:mb-6 sm:text-base">
                Empowering Growth, Connecting Success.
              </p>

              <div className="mb-6 flex space-x-3 sm:mb-8 sm:space-x-4">
                {[
                  {
                    icon: FaLinkedin,
                    href: socialLinks.linkedin,
                  },
                  {
                    icon: FaInstagram,
                    href: socialLinks.instagram,
                  },
                  {
                    icon: FaWhatsapp,
                    href: socialLinks.whatsapp,
                  },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-[#333333] transition-all duration-300 hover:bg-[#444444] sm:h-10 sm:w-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="text-sm text-white sm:text-base" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex w-full items-center"
            >
              <div className="w-200 relative">
                <input
                  type="text"
                  placeholder="Have more query? Connect with us!"
                  className="w-full rounded-full bg-[#393839] py-2.5 pl-4 pr-24 text-sm text-gray-200 placeholder-gray-400 focus:outline-none sm:py-3 sm:pl-5 sm:pr-32 sm:text-base"
                  readOnly
                  onClick={() => setIsContactModalOpen(true)}
                />

                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="absolute bottom-1 right-1 top-1 rounded-full px-3 text-xs font-medium text-white transition-all sm:px-5 sm:text-sm"
                  style={{
                    background:
                      'linear-gradient(90deg, #3A344F 0%, #746E8B 100%)',
                  }}
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Navigation Links */}
          <div className="mt-2 w-full pt-2 sm:mt-0 lg:w-2/3">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-4 md:gap-8">
              {/* Getting Started Column */}
              <div className="mb-4 sm:mb-0">
                <h5 className="mb-3 text-sm font-medium sm:mb-4 sm:text-base">
                  Getting Started
                </h5>
                <ul className="space-y-2 text-xs text-gray-300 sm:space-y-3 sm:text-sm">
                  <li
                    onClick={() => handleNavigation(null, pageContent.support)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Support
                  </li>
                  <li
                    onClick={() => handleNavigation(null, pageContent.help)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Help
                  </li>
                  <li
                    onClick={() => handleNavigation(null, pageContent.articles)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Article
                  </li>
                </ul>
              </div>

              {/* Social Column */}
              <div className="mb-4 sm:mb-0">
                <h5 className="mb-3 text-sm font-medium sm:mb-4 sm:text-base">
                  Social
                </h5>
                <ul className="space-y-2 text-xs text-gray-300 sm:space-y-3 sm:text-sm">
                  <li
                    onClick={() => handleNavigation(socialLinks.instagram)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Instagram
                  </li>
                  <li
                    onClick={() => handleNavigation(socialLinks.linkedin)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    LinkedIn
                  </li>
                  <li
                    onClick={() => handleNavigation(socialLinks.facebook)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Facebook
                  </li>
                  <li
                    onClick={() => handleNavigation(socialLinks.twitter)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Twitter
                  </li>
                </ul>
              </div>

              {/* Legal Column */}
              <div className="mb-4 sm:mb-0">
                <h5 className="mb-3 text-sm font-medium sm:mb-4 sm:text-base">
                  Legal
                </h5>
                <ul className="space-y-2 text-xs text-gray-300 sm:space-y-3 sm:text-sm">
                  <li
                    onClick={() => handleNavigation(null, pageContent.terms)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Terms and Condition
                  </li>
                  <li
                    onClick={() => handleNavigation(null, pageContent.privacy)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Privacy Policy
                  </li>
                </ul>
              </div>

              {/* Services Column */}
              <div>
                <h5 className="mb-3 text-sm font-medium sm:mb-4 sm:text-base">
                  Services
                </h5>
                <ul className="space-y-2 text-xs text-gray-300 sm:space-y-3 sm:text-sm">
                  <li
                    onClick={() => handleNavigation(null, pageContent.tyre)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Tire Management
                  </li>
                  <li
                    onClick={() => handleNavigation(null, pageContent.skill)}
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Skill Management
                  </li>
                  <li
                    onClick={() =>
                      handleNavigation(null, pageContent.consultation)
                    }
                    className="cursor-pointer py-0.5 transition-colors duration-200 hover:text-white"
                  >
                    Strategic Solutions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mb-2 mt-6 text-center text-xs text-gray-500 sm:mb-4 sm:mt-8">
          Wheelboard 2024 © All Rights Reserved
        </p>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={infoModal.isOpen}
        onClose={closeInfoModal}
        title={infoModal.title}
        content={infoModal.content}
      />
    </footer>
  );
};

export default Footer;
