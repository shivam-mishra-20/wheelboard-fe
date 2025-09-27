import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [transitionStage, setTransitionStage] = useState('loading'); // loading -> complete -> exit
  const containerRef = useRef(null);

  // Simulate loading progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingProgress < 100) {
        setLoadingProgress((prev) => Math.min(prev + 2, 100));
      } else {
        // Start transition sequence when loading is complete
        setTransitionStage('complete');
        setTimeout(() => {
          setTransitionStage('exit');
          setTimeout(() => {
            setIsVisible(false);
            if (onLoadingComplete) onLoadingComplete();
          }, 1000);
        }, 1000);
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [loadingProgress, onLoadingComplete]);

  // Call onLoadingComplete earlier for smoother page transition
  useEffect(() => {
    if (transitionStage === 'exit' && onLoadingComplete) {
      setTimeout(() => onLoadingComplete(), 300);
    }
  }, [transitionStage, onLoadingComplete]);

  // Generate network nodes
  const generateNetworkNodes = () => {
    const nodes = [];
    const nodeCount = 7;

    for (let i = 0; i < nodeCount; i++) {
      const x = 10 + (i % 3) * 40;
      const y = 20 + Math.floor(i / 3) * 40;
      nodes.push({
        id: i,
        x: `${x}%`,
        y: `${y}%`,
        size: 6 + Math.floor(Math.random() * 6),
        connections: [],
      });
    }

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      const possibleConnections = nodes.filter((n) => n.id !== i);
      const connectionCount = 1 + Math.floor(Math.random() * 2);

      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(
          Math.random() * possibleConnections.length
        );
        const targetId = possibleConnections[targetIndex].id;
        if (!nodes[i].connections.includes(targetId)) {
          nodes[i].connections.push(targetId);
        }
      }
    }

    return nodes;
  };

  const networkNodes = useRef(generateNetworkNodes());

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loading-container"
        ref={containerRef}
        initial={{ opacity: 1 }}
        animate={
          transitionStage === 'loading'
            ? { opacity: 1 }
            : transitionStage === 'complete'
              ? { opacity: 1 }
              : { opacity: [1, 0.6, 0] }
        }
        exit={{ opacity: 0 }}
        transition={{
          duration: transitionStage === 'exit' ? 1 : 0.5,
          ease: transitionStage === 'exit' ? [0.22, 1, 0.36, 1] : 'linear',
        }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white"
      >
        {/* Abstract logistics network visualization */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Network nodes */}
          {networkNodes.current.map((node) => (
            <React.Fragment key={node.id}>
              {/* Connection lines */}
              {node.connections.map((targetId) => {
                const target = networkNodes.current[targetId];
                return (
                  <svg
                    key={`${node.id}-${targetId}`}
                    className="absolute left-0 top-0 h-full w-full"
                    style={{ zIndex: 1 }}
                  >
                    <motion.line
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={node.id % 2 === 0 ? '#0052CC' : '#FF6D1B'}
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: [0, 1],
                        strokeOpacity: [0.1, 0.5, 0.1],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                      }}
                    />
                  </svg>
                );
              })}

              {/* Moving dots along connections */}
              {node.connections.map((targetId) => {
                const target = networkNodes.current[targetId];
                return (
                  <motion.div
                    key={`dot-${node.id}-${targetId}`}
                    className="absolute h-2 w-2 rounded-full"
                    style={{
                      left: 0,
                      top: 0,
                      backgroundColor:
                        node.id % 2 === 0 ? '#0052CC' : '#FF6D1B',
                      zIndex: 2,
                    }}
                    animate={{
                      left: [node.x, target.x],
                      top: [node.y, target.y],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                      delay: Math.random() * 2,
                    }}
                  />
                );
              })}

              {/* Node circles */}
              <motion.div
                className={`absolute flex items-center justify-center rounded-full ${
                  node.id % 3 === 0
                    ? 'bg-[#0052CC]'
                    : node.id % 3 === 1
                      ? 'bg-[#FF6D1B]'
                      : 'bg-gray-800'
                }`}
                style={{
                  width: `${node.size}px`,
                  height: `${node.size}px`,
                  left: node.x,
                  top: node.y,
                  marginLeft: `-${node.size / 2}px`,
                  marginTop: `-${node.size / 2}px`,
                  zIndex: 3,
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0px rgba(0,0,0,0.1)',
                    '0 0 10px rgba(0,0,0,0.2)',
                    '0 0 0px rgba(0,0,0,0.1)',
                  ],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </React.Fragment>
          ))}
        </div>

        {/* Floating geometric elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`geo-${i}`}
              className="absolute rounded-lg opacity-10"
              style={{
                width: 40 + Math.random() * 60,
                height: 40 + Math.random() * 60,
                background: i % 2 === 0 ? '#0052CC' : '#FF6D1B',
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                rotate: [0, 180],
                y: ['-10px', '10px'],
              }}
              transition={{
                duration: 8 + Math.random() * 7,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={
            transitionStage === 'exit'
              ? {
                  opacity: [1, 0.8, 0],
                  y: [-20, -40],
                  scale: [1, 0.85],
                }
              : { opacity: 1 }
          }
          transition={{
            duration: transitionStage === 'exit' ? 2.5 : 0.7,
            ease: transitionStage === 'exit' ? [0.19, 1, 0.22, 1] : 'easeOut', // Exponential ease for more dramatic effect
          }}
        >
          {/* Enhanced cinematic logo animation with "falling into" effect and continuous rotation */}
          <motion.div
            className="perspective-[800px] relative mb-14"
            animate={
              transitionStage === 'exit'
                ? {
                    scale: [1, 1.8, 5], // More extreme zoom
                    opacity: [1, 1, 0],
                    z: [0, 200, 600], // More extreme z movement
                    rotateY: [0, 3, 0, -3, 0], // Subtle rotation
                    filter: ['blur(0px)', 'blur(1px)', 'blur(8px)'], // Stronger blur at the end
                  }
                : transitionStage === 'complete'
                  ? {
                      scale: [0.97, 1.03, 0.97],
                      rotateY: [0, 1, 0, -1, 0],
                      rotate: 0, // Stop rotating when complete
                    }
                  : {
                      scale: [0.97, 1.03, 0.97],
                      rotateY: [0, 1, 0, -1, 0],
                      rotate: [0, 360], // Full rotation during loading
                    }
            }
            transition={{
              duration: transitionStage === 'exit' ? 3.2 : 4,
              ease:
                transitionStage === 'exit' ? [0.19, 1, 0.22, 1] : 'easeInOut',
              times: transitionStage === 'exit' ? [0, 0.7, 1] : [0, 0.5, 1],
              repeat: transitionStage === 'exit' ? 0 : Infinity,
              rotate: {
                duration: 8,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
              },
            }}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
              perspective: '1000px',
            }}
          >
            {/* Logo with enhanced shadow effect */}
            <div className="relative">
              {/* Larger logo size */}
              <motion.img
                src="/Logo.png"
                alt="Wheelboard Logo"
                className="relative z-10 h-36 w-36 object-contain" // Increased from w-24 h-24
                style={{
                  filter:
                    transitionStage === 'exit'
                      ? 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))'
                      : 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))',
                }}
              />

              {/* Enhanced glow effects */}
              {transitionStage === 'exit' && (
                <>
                  {/* Inner glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      scale: [0.8, 1.5, 4],
                    }}
                    transition={{
                      duration: 2.6,
                      ease: 'easeOut',
                      times: [0, 0.4, 1],
                      delay: 0.2,
                    }}
                    style={{
                      filter: 'blur(15px)',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,109,27,0.3) 40%, rgba(255,255,255,0) 70%)',
                      zIndex: 5,
                    }}
                  />

                  {/* Tunnel/portal effect */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.4, 0.7, 0],
                      scale: [0, 1, 8, 20],
                    }}
                    transition={{
                      duration: 3.0,
                      ease: 'easeInOut',
                      times: [0, 0.3, 0.7, 1],
                      delay: 0.5,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      background:
                        'radial-gradient(circle, #FF6D1B 0%, rgba(0,82,204,0.4) 30%, rgba(255,255,255,0) 70%)',
                      filter: 'blur(10px)',
                      zIndex: 4,
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>

          {/* Wheelboard Text */}
          <motion.div
            className="relative mb-10"
            animate={
              transitionStage === 'exit'
                ? { y: 20, opacity: 0 }
                : { y: 0, opacity: 1 }
            }
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-wider">
              <span className="text-[#0052CC]">Wheel</span>
              <span className="text-[#FF6D1B">board</span>
            </h1>

            {/* Tagline */}
            <motion.p
              className="mt-2 text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Streamlining your logistics operations
            </motion.p>
          </motion.div>

          {/* Enhanced loading progress indicator */}
          <motion.div
            className="relative w-72" // Wider than before
            animate={
              transitionStage === 'exit' || transitionStage === 'complete'
                ? { opacity: 0, y: 20 }
                : { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            {/* Enhanced progress track with pulsing glow */}
            <motion.div
              className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
              animate={{
                boxShadow: [
                  '0 0 2px rgba(0,82,204,0.3)',
                  '0 0 6px rgba(0,82,204,0.5)',
                  '0 0 2px rgba(0,82,204,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <motion.div
                className="h-full"
                style={{ width: `${loadingProgress}%` }}
                animate={{
                  background: [
                    'linear-gradient(90deg, #0052CC, #4C8EFF, #FF6D1B)',
                    'linear-gradient(90deg, #0052CC, #FF6D1B, #FF9A66)',
                    'linear-gradient(90deg, #0052CC, #4C8EFF, #FF6D1B)',
                  ],
                  boxShadow: [
                    '0 0 6px 2px rgba(0, 82, 204, 0.3)',
                    '0 0 12px 4px rgba(0, 82, 204, 0.5)',
                    '0 0 6px 2px rgba(0, 82, 204, 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* Loading text with additional info */}
            <div className="mt-3 flex items-center justify-between">
              <motion.div className="flex flex-col">
                <motion.span
                  className="text-xs font-medium text-gray-600"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Loading resources...
                </motion.span>
                <motion.span
                  className="text-[10px] text-gray-400"
                  animate={{
                    opacity: loadingProgress > 70 ? [0.5, 1, 0.5] : 0,
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {loadingProgress > 90
                    ? 'Finalizing...'
                    : loadingProgress > 70
                      ? 'Almost ready...'
                      : ''}
                </motion.span>
              </motion.div>

              {/* Percentage with progress animation */}
              <motion.div
                className="rounded-full bg-white/50 px-2 text-sm font-bold text-gray-800"
                animate={{
                  scale: loadingProgress % 10 === 0 ? [1, 1.15, 1] : 1,
                  backgroundColor:
                    loadingProgress === 100
                      ? [
                          'rgba(255,255,255,0.5)',
                          'rgba(255,109,27,0.1)',
                          'rgba(255,255,255,0.5)',
                        ]
                      : 'rgba(255,255,255,0.5)',
                }}
                transition={{ duration: 0.5 }}
              >
                {loadingProgress}%
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced transition effects */}
        {transitionStage === 'exit' && (
          <>
            <motion.div
              className="absolute inset-0 z-30 bg-white opacity-0"
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.8, times: [0, 0.5, 1] }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
              initial={{ width: 0, height: 0 }}
              animate={{
                width: '300vh',
                height: '300vh',
                transition: { duration: 1.2 },
              }}
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                zIndex: 20,
              }}
            />

            {/* Additional depth effect for cinematic quality */}
            <motion.div
              className="z-25 pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0.3, 0] }}
              transition={{
                duration: 2.5,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut',
              }}
            />

            {/* Vortex/tunnel effect to enhance "falling into logo" sensation */}
            <motion.div
              className="z-15 absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.8, times: [0, 0.6, 1] }}
              style={{
                background: `
                  radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.1) 60%, transparent 100%),
                  conic-gradient(
                    from 0deg at 50% 50%,
                    rgba(0, 82, 204, 0.1) 0deg,
                    rgba(255, 109, 27, 0.1) 90deg,
                    rgba(0, 82, 204, 0.1) 180deg,
                    rgba(255, 109, 27, 0.1) 270deg,
                    rgba(0, 82, 204, 0.1) 360deg
                  )
                `,
                transform: 'perspective(1000px) rotateX(5deg)',
                filter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            />

            {/* Subtle speed lines for forward motion effect */}
            <div className="z-15 pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{
                    width: `${30 + Math.random() * 40}%`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.3 + Math.random() * 0.3,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                  animate={{
                    scaleX: [0, 1, 0],
                    opacity: [0, 0.2 + Math.random() * 0.2, 0],
                    x: [0, 100, 200],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    repeat: 2,
                    repeatType: 'loop',
                    delay: Math.random() * 1.5,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
