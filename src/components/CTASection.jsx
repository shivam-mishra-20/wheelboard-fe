import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContactFormModal from './ContactFormModal';

const CTASection = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  const renderDesktopView = () => {
    return (
      <section className="relative z-20 mx-auto mb-16 hidden h-[240px] max-w-[75%] overflow-hidden rounded-3xl bg-[#1E3A8A] p-8 font-poppins text-white shadow-xl sm:block md:h-[220px] md:p-10">
        <img
          src="/live-truck.gif"
          alt="Logistics Truck"
          className="absolute bottom-[-120px] right-[8%] z-40 w-[50%] max-w-[440px]"
        />
        {/* Background gradient */}
        <div className="absolute inset-0 z-0 rounded-3xl bg-gradient-to-r from-[#102266] to-[#1f3bb3]"></div>

        {/* Curves background image */}
        <div className="absolute inset-0 z-10 overflow-hidden rounded-3xl">
          <img
            src="/curves-bg.png"
            alt="Background curves"
            className="pl-50 absolute h-full w-full object-cover opacity-100"
          />
        </div>

        {/* Content container */}
        <div className="rounded-4xl relative z-20 flex h-full items-center px-2 md:px-6">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 max-w-md pr-4"
          >
            <h2 className="text-2xl font-bold leading-tight md:text-3xl">
              Ready to Revolutionize your{' '}
              <span className="text-[#FF6B35]">Logistics Operations?</span>
            </h2>
            <p className="mt-2 max-w-[90%] text-sm leading-relaxed text-gray-200">
              Join countless other businesses that have streamlined their
              logistics with our cutting-edge solution
            </p>
            <button
              onClick={handleOpenContactModal}
              className="mt-5 rounded-full bg-[#FF6B35] px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-orange-600"
            >
              Contact us
            </button>
          </motion.div>
        </div>
      </section>
    );
  };

  const renderMobileView = () => {
    return (
      <section
        className="relative z-20 mx-auto mb-16 block overflow-hidden rounded-3xl bg-[#1E3A8A] p-6 font-poppins text-white shadow-xl sm:hidden"
        style={{
          maxWidth: '92%',
          height: 'auto',
          minHeight: '200px',
          paddingBottom: '90px',
        }}
      >
        {/* Background gradient - same as desktop */}
        <div className="absolute inset-0 z-0 rounded-3xl bg-gradient-to-r from-[#102266] to-[#1f3bb3]"></div>

        {/* Curves background image for mobile */}
        <div className="absolute inset-0 z-10 overflow-hidden rounded-3xl">
          <img
            src="/curves-bg.png"
            alt="Background curves"
            className="w-200 rotate-22 absolute h-full object-cover pb-32 opacity-100"
          />
        </div>

        {/* Content container - improved layout */}
        <div className="relative z-20 flex h-full flex-col justify-center pt-2">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 w-[100%]"
          >
            <h2 className="text-lg font-bold leading-tight">
              Ready to Revolutionize your{' '}
              <span className="text-[#FF6B35]">Logistics Operations?</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-200">
              Join countless other businesses that have streamlined their
              logistics with our cutting-edge solution
            </p>
            <button
              onClick={handleOpenContactModal}
              className="mt-4 rounded-full bg-[#FF6B35] px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-orange-600"
            >
              Contact us
            </button>
          </motion.div>
        </div>

        {/* Better positioned truck image */}
        <img
          src="/live-truck.gif"
          alt="Logistics Truck"
          className="absolute bottom-[-25%] right-[-5%] z-40 w-[50%]"
          style={{ maxWidth: '380px', minWidth: '280px' }}
        />
      </section>
    );
  };

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default CTASection;
