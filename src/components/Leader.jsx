import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Leader = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth < 768 ? <MobileView /> : <DesktopView />;
};

const DesktopView = () => {
  return (
    <section className="py-10 font-poppins">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-4xl font-bold text-[#535353]">
          Meet <span className="text-[#EF4444]">Our Leader</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
          The experts behind Wheelboard's success story.
        </p>

        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
          {/* Profile Card */}
          <div className="group relative h-auto w-full max-w-xs overflow-hidden rounded-3xl bg-white shadow-md backdrop-blur-md transition-all duration-500 hover:scale-[1.02]">
            <div className="relative z-10 rounded-3xl bg-white p-6 text-center">
              <div className="flex items-center justify-center">
                <img
                  src="/profile-pic.png"
                  alt="Saloni Singh"
                  className="w-30 h-30 rounded-full object-fill"
                />
              </div>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                Saloni Singh
              </h3>
              <p className="mb-4 font-medium text-[#FF7A00]">
                Co-founder & CEO
              </p>
              <div className="rounded-xl border border-gray-100 bg-white/80 px-4 py-3 text-sm text-gray-800 shadow-inner">
                Building an ecosystem <br />
                <span className="font-semibold text-gray-900">
                  'grounded in{' '}
                  <span className="text-[#000000]">Empowerment</span>,<br />
                  driven by <span className="text-[#000000]">Efficiency</span>,
                  <br />
                  united by{' '}
                  <span className="text-[#FF7A00]">Shared Success'</span>
                </span>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <a
                  href="https://www.linkedin.com/in/saloni-singh-8571621ba/#:~:text=www.linkedin.com/in/saloni-singh-8571621ba"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-xl text-[#0052CC] hover:text-[#FF6D1B]"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="mailto:Saloni@wheelboard.in"
                  aria-label="Email"
                  className="text-xl text-gray-600 hover:text-gray-900"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>

            {/* Subtle border gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-100 via-transparent to-pink-100 p-[1px] opacity-70" />
          </div>

          {/* Visionary Leadership */}
          <div className="w-full max-w-2xl rounded-2xl border border-orange-200 bg-white p-8 shadow-sm">
            <h4 className="mb-4 text-2xl font-bold text-gray-900">
              Visionary Leadership
            </h4>
            <p className="mb-4 text-gray-700">
              As the co-founder of{' '}
              <span className="font-semibold text-[#FF6D1B]">
                Wheelboard Solutions
              </span>
              , Saloni has a vision to transforming transport Industry. Her
              mission is to build a thriving ecosystem where growth and success
              are shared, and every service delivered, contributes positively to
              society and the environment.
            </p>
            <p className="mb-4 text-gray-800">
              "Transport is more than movement, it's a force for empowerment,
              sustainability, and shared success."
            </p>
            <p className="mb-1 text-gray-800">
              At{' '}
              <span className="font-semibold text-[#FF6D1B]">Wheelboard</span>,
              we're building an ecosystem where every stakeholder thrives."
            </p>
            <p className="mt-4 font-medium text-gray-800">
              — Saloni Singh
              <br />
              <span className="text-sm text-gray-500">
                Co-founder & CEO, Wheelboard
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MobileView = () => {
  return (
    <section className="py-10 font-poppins">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#535353]">
          Meet <span className="text-[#EF4444]">Our Leader</span>
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600">
          The experts behind Wheelboard's success story.
        </p>

        <div className="flex flex-col items-center gap-6">
          {/* Profile Card - Mobile */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-md">
            <div className="relative z-10 rounded-3xl p-6 text-center">
              <div className="flex items-center justify-center">
                <img
                  src="/profile-pic.png"
                  alt="Saloni Singh"
                  className="w-30 h-30 rounded-full object-fill"
                />
              </div>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                Saloni Singh
              </h3>
              <p className="mb-3 font-medium text-[#FF7A00]">
                Co-founder & CEO
              </p>
              <div className="mb-3 rounded-xl border border-gray-100 bg-white/80 px-4 py-3 text-sm text-gray-800 shadow-inner">
                Building an ecosystem <br />
                <span className="font-semibold text-gray-900">
                  'grounded in{' '}
                  <span className="text-[#000000]">Empowerment</span>, driven by{' '}
                  <span className="text-[#000000]">Efficiency</span>, united by{' '}
                  <span className="text-[#FF7A00]">Shared Success'</span>
                </span>
              </div>
              <div className="mt-3 flex justify-center gap-4">
                <a
                  href="https://www.linkedin.com/in/saloni-singh-8571621ba/#:~:text=www.linkedin.com/in/saloni-singh-8571621ba"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-xl text-[#0052CC] hover:text-[#FF6D1B]"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="mailto:Saloni@wheelboard.in"
                  aria-label="Email"
                  className="text-xl text-gray-600 hover:text-gray-900"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>

            {/* Subtle border gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-100 via-transparent to-gray-100 p-[1px] opacity-70" />
          </div>

          {/* Visionary Leadership - Mobile */}
          <div className="w-full max-w-sm rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
            <h4 className="mb-3 text-xl font-bold text-gray-900">
              Visionary Leadership
            </h4>
            <p className="mb-3 text-sm text-gray-700">
              As the co-founder of{' '}
              <span className="font-semibold text-[#FF6D1B]">
                Wheelboard Solutions
              </span>
              , Saloni has a vision to transforming transport Industry. Her
              mission is to build a thriving ecosystem where growth and success
              are shared.
            </p>
            <p className="mb-2 text-sm text-gray-800">
              "Transport is more than movement, it's a force for empowerment,
              sustainability, and shared success."
            </p>
            <p className="mb-2 text-sm text-gray-800">
              At{' '}
              <span className="font-semibold text-[#FF6D1B]">Wheelboard</span>,
              we're building an ecosystem where every stakeholder thrives."
            </p>
            <p className="mt-3 text-sm font-medium text-gray-800">
              — Saloni Singh
              <br />
              <span className="text-xs text-gray-500">
                Co-founder & CEO, Wheelboard
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leader;
