const features = [
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Real-time Tracking',
    description:
      'Monitor your entire fleet in real-time with GPS tracking and live updates.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: 'Analytics Dashboard',
    description:
      'Get insights into fleet performance, fuel consumption, and cost optimization.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: 'Route Optimization',
    description:
      'AI-powered route planning to reduce fuel costs and improve delivery times.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    title: 'Driver Management',
    description:
      'Manage driver profiles, performance metrics, and safety scores in one place.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Job Scheduling',
    description:
      'Automate job assignments and schedule deliveries with smart algorithms.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
        />
      </svg>
    ),
    title: 'Maintenance Alerts',
    description:
      'Preventive maintenance scheduling to keep your fleet running smoothly.',
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-poppins text-3xl font-bold text-primary-accent md:text-4xl">
            Everything You Need to Manage Your Fleet
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Comprehensive fleet management tools designed to streamline
            operations, reduce costs, and improve efficiency across your entire
            organization.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-transparent bg-gray-50 p-6 transition-all duration-300 hover:border-primary-secondary/20 hover:bg-white hover:shadow-lg"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary-button/10 transition-colors group-hover:bg-primary-button/20">
                <div className="text-primary-button">{feature.icon}</div>
              </div>
              <h3 className="mb-3 font-poppins text-xl font-semibold text-primary-accent">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary-bg to-primary-secondary/50 p-8 md:p-12">
            <h3 className="mb-4 font-poppins text-2xl font-bold text-primary-accent md:text-3xl">
              Ready to Transform Your Fleet Management?
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-gray-600">
              Join thousands of companies already using WheelBoard to optimize
              their fleet operations and reduce costs.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-lg bg-primary-button px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-button/90">
                Start Free Trial
              </button>
              <button className="rounded-lg border border-primary-accent px-8 py-3 font-semibold text-primary-accent transition-colors hover:bg-primary-accent hover:text-white">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
