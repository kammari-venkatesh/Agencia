import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import '../index.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { SmoothScrollProvider } from '../motion/SmoothScroll'
import { isAdminPath } from '../admin/paths'

export default function Layout({ children }: { children: ReactNode }) {
  const { urlPathname } = usePageContext()

  // Admin pages provide their own chrome (pages/admin/+Layout.tsx); Layout is cumulative in Vike.
  if (isAdminPath(urlPathname)) return <>{children}</>

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
