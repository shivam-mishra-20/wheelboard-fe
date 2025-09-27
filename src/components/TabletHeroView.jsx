const TabletHeroView = () => {
  return (
    <div className="container relative z-20 mx-auto flex flex-col items-center px-6 py-8">
      {/* Top: Phone Mockup - Centered on tablet */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          type: 'spring',
          stiffness: 60,
        }}
        className="relative mb-8 flex w-full justify-center"
      >
        <motion.div
          whileHover={{
            y: -10,
            transition: { duration: 0.5, ease: 'easeOut' },
          }}
          className="relative"
        >
          <motion.img
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            src="/mobile-ss.png"
            alt="App Preview"
            className="w-[240px] drop-shadow-xl"
          />

          {/* Screen shine effect */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0) 100%)',
                'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
              ],
              backgroundSize: '200% 200%',
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-[5px] z-10 rounded-[18px]"
          />

          {/* Floating feature indicators - repositioned for tablet */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: -55 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute left-0 top-1/4 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-purple-600 shadow-lg backdrop-blur-sm"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
            Live Tracking
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 55 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-1/3 right-0 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-purple-600 shadow-lg backdrop-blur-sm"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-500"></span>
            Real-time Data
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom: Text content - Full width on tablet */}
      <div className="relative z-20 mx-auto flex w-full max-w-[600px] flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 flex w-full flex-col items-center text-center"
        >
          <h1 className="relative z-10 mb-4 text-center text-[2.5rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1A1A1A]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="block"
            >
              Smart Logistics,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-2 mt-2 block text-[2.5rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0052CC]"
            >
              One Tap Away
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative z-10 mx-auto mb-6 mt-2 max-w-[500px] text-center text-base font-semibold text-[#3d3552]"
          >
            <span className="font-bold text-[#3d3552]">
              Transform your fleet into a safer, efficient, and sustainable
              ecosystem.
            </span>
            <br />
            Achieve sustainable growth through{' '}
            <span className="font-bold">Innovation, Intelligent insights</span>,
            and collaborative partnerships— all in one platform.
          </motion.p>

          {/* Buttons - centered on tablet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative z-10 mt-2 flex flex-row justify-center gap-4"
          >
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 6px 24px rgba(0, 82, 204, 0.25)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#download"
              className="rounded-lg bg-gradient-to-r from-[#0052CC] via-[#0052CC] to-[#FF6D1B] px-6 py-2.5 text-center font-semibold text-white shadow-[0_4px_24px_0_rgba(0,82,204,0.18)] transition"
              style={{ minWidth: 150 }}
            >
              Download the App
            </motion.a>
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 20px rgba(0, 82, 204, 0.12)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              href="#demo"
              className="rounded-lg border-2 border-[#0052CC] bg-transparent px-6 py-2.5 text-center font-semibold text-[#0052CC] shadow-[0_4px_24px_0_rgba(0,82,204,0.08)] transition"
              style={{ minWidth: 150 }}
            >
              Watch Demo
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative pink ball positioned differently for tablet */}
      <motion.img
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        src="/ball-pink.png"
        alt=""
        className="pointer-events-none absolute bottom-[-20%] left-1/4 z-0 h-auto w-[300px] select-none"
        aria-hidden="true"
      />
    </div>
  );
};
