'use client';

import React, { useEffect, useRef } from 'react';

type LenisProviderProps = {
  children: React.ReactNode;
};

export default function LenisProvider({ children }: LenisProviderProps) {
  // use any to avoid missing library types at build time
  const lenisRef = useRef<unknown | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number;

    (async () => {
      try {
        const mod = await import('@studio-freight/lenis');
        const Lenis = mod?.default ?? mod;

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        const loop = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
      } catch (err) {
        // If the package isn't installed, fail silently — developer should `npm install @studio-freight/lenis`
        console.warn('Lenis not available:', err);
      }
    })();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      const maybe = lenisRef.current as { destroy?: () => void } | null;
      if (maybe && typeof maybe.destroy === 'function') maybe.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
