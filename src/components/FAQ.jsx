import React, { useState } from 'react';

const FAQ = () => {
  // Split FAQs into two columns
  const faqs = [
    {
      question: 'What is Wheelboard and how does it support?',
      answer:
        'Wheelboard is a smart, all-in-one service platform built to optimize fleet operations for the transport industry. We offer a range of solutions including Skill Management, Tire Management, and Strategic Operational Support. Our platform also helps you build your value network by connecting with potential stakeholders and partners.',
    },
    {
      question: 'How does Wheelboard’s Skill Management system work?',
      answer:
        'Our Skill Management system helps you to Connect with right skill for operations, when You need them most. It includes tools for skill mapping, training recommendations, and performance tracking to ensure your workforce is always aligned with operational needs.',
    },
    {
      question: 'What benefits does Tire Management offer to fleet operators?',
      answer:
        'Wheelboard’s Tire Management service offers ‘onsite tire maintenance directly on vehicles and comprehensive End-of-Life Tire (ELT) management. This proactive approach helps reduce vehicle downtime, extend tire lifespan, and significantly lower overall operational costs by ensuring timely maintenance and disposal of worn-out tires.',
    },
    {
      question: 'Can Wheelboard help solve day-to-day operational challenges?',
      answer:
        'Yes, Wheelboard provides data-driven insights and customizable tools to address key operational challenges in the transport industry. Our solutions help tackle issues such as skilled driver shortages, trip scheduling and monitoring, Asset utilization, route planning, trip efficiency, expense tracking, intransit vehicle service requirements.',
    },
    {
      question:
        'Is Wheelboard suitable for small and medium-sized transport businesses?',
      answer:
        "Absolutely. Our solutions are scalable and designed to fit fleets of all sizes. Whether you're managing a few vehicles or a large fleet, Wheelboard adapts to your operational complexity and growth needs..",
    },
    {
      question: 'How can I get started with Wheelboard’s services?',
      answer:
        "Reach out to our team for a quick consultation. We will understand your current operations and recommend the right mix of services to help you optimize fleet performance and drive sustainable growth. Whether you're just starting out or scaling up, we're here to support your journey every step of the way..",
    },
  ];

  // Split into two columns
  const col1 = faqs.slice(0, 3);
  const col2 = faqs.slice(3, 6);

  // Track open index for each column
  const [openIndexes, setOpenIndexes] = useState([null, null]);

  const toggleFAQ = (col, idx) => {
    setOpenIndexes((prev) => [
      col === 0 ? (prev[0] === idx ? null : idx) : prev[0],
      col === 1 ? (prev[1] === idx ? null : idx) : prev[1],
    ]);
  };

  // Helper to render a column
  const renderColumn = (faqsCol, colIdx) =>
    faqsCol.map((faq, idx) => (
      <div
        key={idx}
        className="mb-6 rounded-2xl border border-white/40 bg-white/40 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(255,94,95,0.2)]"
        style={{
          boxShadow:
            '0 8px 32px 0 rgba(255,94,95,0.15), 0 1.5px 4px 0 rgba(0,0,0,0.07)',
        }}
      >
        <button
          onClick={() => toggleFAQ(colIdx, idx)}
          className="flex w-full items-center justify-between px-6 py-5 text-left text-lg font-semibold text-gray-800 focus:outline-none"
        >
          <span>{faq.question}</span>
          <span className="ml-6 select-none text-2xl transition-transform duration-300">
            {openIndexes[colIdx] === idx ? (
              <span className="text-[#ff5e5f]">–</span>
            ) : (
              <span className="text-[#ff5e5f]">+</span>
            )}
          </span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            openIndexes[colIdx] === idx
              ? 'max-h-40 px-6 py-4 opacity-100'
              : 'max-h-0 px-6 py-0 opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.7) 60%, rgba(255,94,95,0.1) 100%)',
            borderRadius: '0 0 1rem 1rem',
          }}
        >
          <p className="text-base text-[#545454]">{faq.answer}</p>
        </div>
      </div>
    ));

  return (
    <section
      id="faq"
      className="min-h-fit bg-white py-10 font-poppins"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-3 text-center text-4xl font-bold text-[#545454] drop-shadow-lg">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mb-14 max-w-2xl text-center text-lg text-[#545454]">
          Find answers to common questions about our products and services
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <div>{renderColumn(col1, 0)}</div>
          <div>{renderColumn(col2, 1)}</div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
