import { lazy, Suspense, type ComponentProps } from 'react';

/**
 * The Plasma WebGL background pulls in the `ogl` library, which is the
 * single heaviest dependency in the app but is only used for the hero
 * decoration. Loading it in its own chunk lets the hero content (text,
 * buttons, layout) paint immediately while the canvas streams in moments
 * later. The `#0a0a0a` solid backing on `.hero-background` doubles as the
 * placeholder during that window — no visible pop-in.
 */
const Plasma = lazy(() => import('./Plasma'));

export default function PlasmaLazy(props: ComponentProps<typeof Plasma>) {
  return (
    <Suspense fallback={null}>
      <Plasma {...props} />
    </Suspense>
  );
}
