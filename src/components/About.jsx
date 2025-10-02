import React, { useState } from 'react';
import { motion } from 'framer-motion';

const aboutData = [
  {
    img: 'https://media.istockphoto.com/id/517416991/photo/truck-driver.jpg?s=612x612&w=0&k=20&c=e1sbLN1Xof1cibXNfRWwQGBk0Ji0FIUaXRFrtUZ7Nho=', // Driver in truck cab
    bgColor: 'from-[#000000] to-[#000000]',
    dotColor: 'bg-[#000000]',
    dotPosition: 'top-4 right-4',
  },
  {
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Analytics dashboard
    bgColor: 'from-[#FF7A00] to-[#FF7A00]',
    dotColor: 'bg-[#000000]',
    dotPosition: 'top-4 left-4',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqXW-_g3LE3jWjvvOnQPKEsRlOQFEEwOY44w&s', // Mechanic working on truck tire
    bgColor: 'from-[#000000] to-[#000000]',
    dotColor: 'bg-[#FF7A00]',
    dotPosition: 'top-4 right-4',
  },
  {
    img: 'https://media.istockphoto.com/id/184278815/photo/trucking-discussion.jpg?s=612x612&w=0&k=20&c=8HZvjBGVcz8uwwFMFLCB2o9X0aZ9IrnfaYyHdGCzFz8=', // Consultation
    bgColor: 'from-green-500 to-green-600',
    dotColor: 'bg-green-400',
    dotPosition: 'top-4 left-4',
  },
  {
    img: 'staring-man.jpg', // Tires and tools
    bgColor: 'from-orange-400 to-orange-500',
    dotColor: 'bg-orange-400',
    dotPosition: 'top-4 right-4',
  },
  {
    img: '/black-truck.png', // Strategic Solutions
    bgColor: 'from-gray-600 to-gray-700',
    dotColor: 'bg-gray-400',
    dotPosition: 'top-4 left-4',
  },
];

const cardVariants = {
  offscreen: {
    opacity: 0,
    y: 20,
    rotate: -2,
    scale: 0.98,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Helper to detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section
      id="about"
      className="relative flex min-h-fit items-center justify-center overflow-hidden bg-white py-10"
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Heading */}
        <div className="relative z-10 mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#535353] md:text-4xl">
            About <span className="text-[#EF4444]">Us</span>
          </h2>
          <p className="font-medium leading-relaxed text-gray-700">
            At <strong>Wheelboard</strong>, We are committed to transform the
            transport industry by{' '}
            <strong>"Promoting sustainable practices"</strong> Ensuring{' '}
            <strong>Safer</strong> and <strong>efficient operations</strong>{' '}
            that drive success for all stakeholders.
            <br />
            We pride ourselves on fostering a culture of collaboration,
            continuous learning, and excellence.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-8 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {aboutData.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex justify-center"
              style={{
                transformOrigin:
                  index % 2 === 0 ? 'left center' : 'right center',
                transform: `rotate(${index % 2 === 0 ? '-2deg' : '2deg'})`,
              }}
            >
              {/* Card Background with gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.bgColor} z-0 rotate-2 scale-[1.03] transform`}
              ></div>

              {/* Card Content */}
              <div
                className="relative z-10 aspect-video w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setActiveIndex(activeIndex === index ? null : index);
                  }
                }}
              >
                <img
                  src={item.img}
                  alt="about"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Enhanced Image Overlay with better hover description */}
                <div
                  className={`absolute inset-0 flex cursor-pointer flex-col justify-end bg-gradient-to-t from-black/80 via-black/60 to-transparent p-5 opacity-0 transition-all duration-300 hover:opacity-100`}
                >
                  <h4 className="mb-1 text-lg font-extrabold text-white transition-all duration-300">
                    {
                      [
                        'Driver Excellence',
                        'Smart Analytics',
                        'Onsite Tire Management',
                        'Expert Consultation',
                        'End-of-Life Tire (ELT) management',
                        'Strategic Solutions',
                      ][index]
                    }
                  </h4>
                  <p className="text-sm font-semibold text-white transition-all duration-300">
                    {
                      [
                        'Professional drivers delivering exceptional service and safety.',
                        'Data-driven insights to optimize your fleet operations.',
                        'Monitor tire health, usage patterns, and replacement cycles. This helps reduce downtime, improve tire life, and lower maintenance costs.',
                        'Expert guidance to overcome operational challenges.',
                        'Sustainable practice for disposal of worn-out tires.',
                        'Smarter planning to better resource utilization, Wheelboard helps you run your transport business more efficiently and effectively.',
                      ][index]
                    }
                  </p>
                </div>

                {/* Animated Colored Dot */}
                <div className="absolute z-20">
                  <div
                    className={`absolute ${item.dotPosition} h-6 w-6 rounded-full ${item.dotColor} animate-pulse border-2 border-white shadow-md`}
                  ></div>
                  <div
                    className={`absolute ${item.dotPosition} h-6 w-6 rounded-full ${item.dotColor} animate-ping border-2 border-white opacity-75 shadow-md`}
                    style={{
                      animationDuration: '3s',
                      animationDelay: `${index * 0.2}s`,
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
