import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { easeIOS, menuContainer, menuItem, menuOverlay } from '../motion/variants';
import { getLenis } from '../motion/SmoothScroll';
import './Navbar.css';

const navSections: { label: string; id: string }[] = [
  { label: 'Works', id: 'works' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faqs' },
  { label: 'Contact', id: 'contact' },
  { label: 'About', id: 'about' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Lock scroll while the overlay is open — keeps the iPhone-style UX feel.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev || '';
    }
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [isOpen]);

  // Close overlay on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const goToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const scrollToId = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (location.pathname === '/') {
      void navigate({ pathname: '/', hash: `#${id}` });
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToId);
      });
    } else {
      void navigate({ pathname: '/', hash: `#${id}` });
    }
  };

  const goHome = (e: React.MouseEvent) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      void navigate({ pathname: '/' }, { replace: true });
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container navbar">
          <Link to="/" className="navbar-logo" onClick={goHome}>Veltrix</Link>
          <motion.button
            type="button"
            className="menu-toggle-btn"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.3, ease: easeIOS }}
            aria-label="Open navigation"
          >
            <Menu size={20} color="#fff" />
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nav-overlay"
            key="nav-overlay"
            variants={menuOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="container nav-overlay-header">
              <Link to="/" className="navbar-logo" onClick={goHome}>Veltrix</Link>
              <motion.button
                type="button"
                className="menu-toggle-btn"
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.3, ease: easeIOS }}
                aria-label="Close navigation"
              >
                <X size={20} color="#fff" />
              </motion.button>
            </div>
            <motion.div
              className="container nav-overlay-content"
              variants={menuContainer}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <nav className="nav-vertical-links">
                {navSections.map((item) => (
                  <motion.a
                    key={item.id}
                    href={`/#${item.id}`}
                    onClick={(e) => goToSection(e, item.id)}
                    variants={menuItem}
                    whileHover={{ opacity: 1, x: 8 }}
                    transition={{ duration: 0.4, ease: easeIOS }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <motion.div className="nav-overlay-right" variants={menuItem}>
                <div className="small-stacked-text text-right">
                  GROW<br />YOUR BRAND<br />BEYOND<br />BOUNDARIES
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
