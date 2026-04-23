import { lazy, Suspense, useEffect, useState, type ComponentProps } from 'react';

/**
 * The Plasma WebGL background pulls in the `ogl` library (the heaviest dep in
 * the app) and runs an expensive fragment shader. We:
 *   1) code-split it into its own chunk via `React.lazy`, and
 *   2) defer even triggering that chunk load until the browser is idle, so the
 *      hero text/buttons paint first. The `#0a0a0a` solid backing on
 *      `.hero-background` doubles as the placeholder.
 */
const Plasma = lazy(() => import('./Plasma'));

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export default function PlasmaLazy(props: ComponentProps<typeof Plasma>) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as IdleWindow;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    if (typeof w.requestIdleCallback === 'function') {
      idleHandle = w.requestIdleCallback(() => setShouldLoad(true), { timeout: 1500 });
    } else {
      timeoutHandle = window.setTimeout(() => setShouldLoad(true), 400);
    }

    return () => {
      if (idleHandle !== undefined && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <Plasma {...props} />
    </Suspense>
  );
}
