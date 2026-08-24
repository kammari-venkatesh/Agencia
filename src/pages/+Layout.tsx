import type { ReactNode } from 'react'
import '../index.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WebGLLoader from '../components/WebGLLoader'
import { SmoothScrollProvider } from '../motion/SmoothScroll'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <WebGLLoader />
      <div className="app-container">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  )
}
