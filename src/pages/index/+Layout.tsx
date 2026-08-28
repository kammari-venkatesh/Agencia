import type { ReactNode } from 'react'
import WebGLLoader from '../../components/WebGLLoader'

/**
 * Homepage-only layout. WebGL/Three.js stays out of the shared root layout so
 * /services/* never imports or modulepreloads the WebGL chunk.
 * position:fixed overlay is unchanged from the previous root-layout placement.
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WebGLLoader />
      {children}
    </>
  )
}
