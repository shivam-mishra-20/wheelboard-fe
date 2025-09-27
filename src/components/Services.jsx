import React from 'react';
import { FaUserTie, FaCog, FaLightbulb } from 'react-icons/fa';

// Updated services with React icons
const services = [
  {
    icon: FaUserTie,
    iconColor: '#0052CC',
    title: 'Skill Management',
    description: 'Build workforce that fits your operation',
  },
  {
    icon: FaCog,
    iconColor: '#FF6D1B',
    title: 'Tyre Management',
    description: 'We maintain and manage your tires',
  },
  {
    icon: FaLightbulb,
    iconColor: '#333333',
    title: 'Strategic Solutions',
    description: 'We manage your operational complexities',
  },
];

const highlightStyle = 'text-[#FF6D1B] font-semibold';
const blueStyle = 'text-[#0052CC] font-bold';

const Services = () => (
  <section id="services" className="bg-white py-10 md:py-10">
    <div className="mx-auto max-w-5xl px-4">
      {/* Heading with fade-in animation */}
      <div className="animate-fade-in mb-14 text-center">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#535353] md:text-4xl">
          Our <span className="text-[#EF4444]">Services</span>
        </h2>
        {/* Subheading */}
        <div className="mb-2 text-center text-lg font-semibold text-[#535353]">
          Comprehensive Services, One Platform.
        </div>
        {/* Description */}
        <div className="mx-auto mb-10 max-w-3xl text-center text-gray-700">
          Our services span across&nbsp;
          <span className={highlightStyle}>‘Skill management</span>,&nbsp;
          <span className={highlightStyle}>Tire management</span> and&nbsp;
          <span className={highlightStyle}>Strategic solutions</span>
          &nbsp;that, delivers operational excellence and positions us as your
          partner for success.
        </div>
      </div>

      {/* Cards with improved layout */}
      <div className="flex flex-col items-stretch justify-center gap-8 md:flex-row">
        {services.map((service, idx) => {
          // Glare effect setup
          const overlayRef = React.useRef(null);
          const glareColor = '#ffffff';
          const glareOpacity = 0.5;
          const glareAngle = -45;
          const glareSize = 250;
          const transitionDuration = 650;
          // Convert hex to rgba
          const hex = glareColor.replace('#', '');
          let rgba = glareColor;
          if (/^[\dA-Fa-f]{6}$/.test(hex)) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
          } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
          }
          const overlayStyle = {
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(${glareAngle}deg,
      hsla(0,0%,0%,0) 60%,
      ${rgba} 70%,
      hsla(0,0%,0%,0) 100%)`,
            backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '-100% -100%, 0 0',
            pointerEvents: 'none',
            borderRadius: '2rem',
            zIndex: 1,
          };
          const animateIn = () => {
            const el = overlayRef.current;
            if (!el) return;
            el.style.transition = 'none';
            el.style.backgroundPosition = '-100% -100%, 0 0';
            el.offsetHeight; // force reflow
            el.style.transition = `${transitionDuration}ms ease`;
            el.style.backgroundPosition = '100% 100%, 0 0';
          };
          const animateOut = () => {
            const el = overlayRef.current;
            if (!el) return;
            el.style.transition = `${transitionDuration}ms ease`;
            el.style.backgroundPosition = '-100% -100%, 0 0';
          };
          return (
            <div
              key={idx}
              className="animate-slide-up relative flex flex-1 flex-col items-center rounded-[2rem] px-6 py-8 text-center transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              style={{
                minWidth: 260,
                maxWidth: 340,
                minHeight: 260,
                animationDelay: `${idx * 200}ms`,
                animationFillMode: 'both',
              }}
              onMouseEnter={animateIn}
              onMouseLeave={animateOut}
            >
              {/* Glare overlay */}
              <div ref={overlayRef} style={overlayStyle} />

              {/* Card background rectangle */}
              <img
                src="/Rectangle 7.png"
                alt=""
                className="absolute inset-0 z-0 h-full w-full rounded-[2rem] object-cover"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                aria-hidden="true"
                draggable={false}
              />

              {/* Glassy overlay for frosted glass effect */}
              <div className="absolute inset-0 z-[1] rounded-[2rem] bg-white/30 backdrop-blur-[2px]"></div>

              {/* Content with enhanced styling */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Icon with animation */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl">
                  <service.icon
                    size={28}
                    color={service.iconColor}
                    className="transition-transform duration-500 hover:rotate-12"
                  />
                </div>

                <div className="mb-2 text-lg font-semibold text-gray-800 md:text-xl">
                  {service.title}
                </div>

                <div className="text-base text-gray-600">
                  {service.description}
                </div>

                {/* Learn more button */}
                <button className="mt-5 translate-y-4 transform rounded-full border border-white/20 bg-white/50 px-4 py-2 font-medium text-blue-600 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md group-hover:translate-y-0 group-hover:opacity-100">
                  Learn More
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* CSS animations */}
    <style jsx>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fadeIn 1s ease-out forwards;
      }

      .animate-slide-up {
        animation: slideUp 0.8s ease-out forwards;
        opacity: 0;
      }
    `}</style>
  </section>
);

export default Services;
