import React from 'react';
import {
  FiUsers,
  FiBox,
  FiCompass,
  FiBarChart2,
  FiGlobe,
  FiHeadphones,
} from 'react-icons/fi';

const WhyChoose = () => {
  const features = [
    {
      title: 'Hire and Manage Right skill',
      description:
        'Connect with right professional for operations, when you need them most.',
      Icon: FiUsers,
      image: '/Hire.png',
    },
    {
      title: 'Solution For Operational Challenges',
      description:
        'Strategic solutions that match your unique operational needs.',
      Icon: FiBox,
      image: '/challenges.png',
    },
    {
      title: 'Manage your Tires',
      description:
        'Save cost, reduce downtime, and drive toward a more efficient, safer, and sustainable future.‘Let us maintain and manage your tires’',
      Icon: FiCompass,
      image: '/tires.png',
    },
    {
      title: 'Smart Dashboard',
      description:
        'Unique operational value through data-driven insights that power intelligent decision making.',
      Icon: FiBarChart2,
      image: '/dashboard.png',
    },
    {
      title: 'Value Network',
      description:
        'Connect, Promote, Grow. Accelerate innovation together through Collaborative Culture.',
      Icon: FiGlobe,
      image: '/network.png',
    },
    {
      title: '24/7 Customer Support',
      description:
        'Fast and reliable customer assistance, Any time you need us!',
      Icon: FiHeadphones,
      image: '/support.png',
    },
  ];

  return (
    <section id="why-choose" className="mt-10 bg-white px-4 md:px-10">
      {/* Heading */}
      <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
        <h2 className="text-3xl font-bold text-[#535353] md:text-4xl">
          Why Choose <span className="text-[#EF4444]">Wheelboard</span> ?
        </h2>
        <p className="mt-2 text-lg font-bold text-gray-700 md:text-xl">
          Smart Operations, Sustainable growth, Greater Value
        </p>
        <p className="mt-2 text-base font-semibold leading-relaxed text-gray-600">
          Our integrated approach simplifies operations,
          <br />
          so you can focus on your core business — while we drive sustainable,
          long-term success.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-10 px-2 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, Icon, image }, idx) => (
          <div
            key={idx}
            className="animate-fadeIn hover-colored-shadow relative mx-auto flex min-h-[190px] max-w-[360px] overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm transition-all duration-500 hover:border-blue-300"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Left Side (Text) */}
            <div className="group flex w-1/2 flex-col justify-center p-5">
              <Icon className="mb-3 h-7 w-7 transform text-[#0052CC] transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF6D1B]" />
              <h3 className="mb-1 text-[15px] font-semibold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-[#0052CC]">
                {title}
              </h3>
              <p className="text-[12px] leading-snug text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                {description}
              </p>
            </div>

            {/* Right Side (Image) */}
            <div className="relative flex w-1/2 items-end justify-end overflow-hidden pb-0 pr-0">
              <img
                src={image}
                alt={title}
                className="pointer-events-none max-h-[220px] w-[110%] select-none object-contain transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .hover-colored-shadow {
          transition: box-shadow 0.3s ease-in-out;
        }
        .hover-colored-shadow:hover {
          box-shadow:
            0 10px 25px -5px rgba(0, 82, 204, 0.3),
            0 8px 10px -6px rgba(0, 82, 204, 0.2);
        }
      `}</style>
    </section>
  );
};

export default WhyChoose;
