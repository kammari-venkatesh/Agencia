import type { ReactNode } from 'react'
import '../index.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { SmoothScrollProvider } from '../motion/SmoothScroll'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <div className="app-container">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  )
}
