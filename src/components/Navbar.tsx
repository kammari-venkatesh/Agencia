import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container navbar">
          <Link to="/" className="navbar-logo">Veltrix</Link>
          <button className="menu-toggle-btn" onClick={() => setIsOpen(true)}>
            <Menu size={20} color="#fff" />
          </button>
        </div>
      </header>

      {/* Full Screen Overlay */}
      <div className={`nav-overlay ${isOpen ? 'open' : ''}`}>
        <div className="container nav-overlay-header">
          <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>Veltrix</Link>
          <button className="menu-toggle-btn" onClick={() => setIsOpen(false)}>
            <X size={20} color="#fff" />
          </button>
        </div>
        <div className="container nav-overlay-content">
          <nav className="nav-vertical-links">
            <a href="#works" onClick={() => setIsOpen(false)}>Works</a>
            <a href="#services" onClick={() => setIsOpen(false)}>Services</a>
            <a href="#faq" onClick={() => setIsOpen(false)}>FAQ</a>
            <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
            <a href="#template" onClick={() => setIsOpen(false)}>Get Template</a>
          </nav>
          <div className="nav-overlay-right">
            <div className="small-stacked-text text-right">
              GROW<br/>YOUR BRAND<br/>BEYOND<br/>BOUNDARIES
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
