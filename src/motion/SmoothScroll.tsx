import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

/**
 * Global Lenis instance. Use `getLenis()?.scrollTo(...)` anywhere to
 * programmatically scroll through the same smooth inertial pipeline that
 * drives wheel/trackpad input.
 */
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Mounts Lenis once at the app root. Skips init entirely when the user has
 * requested reduced motion so anchor navigation stays instantaneous.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Opt out of the browser's default scroll restoration so every reload
    // starts at the top of the page instead of visibly "snapping" back to
    // the previous scroll position after React mounts (which reads as the
    // hero section auto-scrolling).
    const originalRestoration =
      typeof history !== 'undefined' ? history.scrollRestoration : undefined;
    if (originalRestoration !== undefined) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const restoreRestoration = () => {
      if (originalRestoration !== undefined) {
        history.scrollRestoration = originalRestoration;
      }
    };

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReduced) {
      return restoreRestoration;
    }

    const lenis = new Lenis({
      // Shorter virtual scroll + ease-out quad keeps the smooth feel while
      // eliminating the sticky tail that made every wheel tick feel slow.
      duration: 0.85,
      easing: (t: number) => 1 - Math.pow(1 - t, 2),
      smoothWheel: true,
      // Native touch inertia on mobile is better than Lenis's smoothed version.
      syncTouch: false,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.2,
    });

    lenisInstance = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
      restoreRestoration();
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScrollProvider;
