import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer">
        <div className="footer-left">
          <div className="footer-logo">
            Veltrix<span>.</span>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Veltrix Agency. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <div className="footer-nav">
            <a href="#">Works</a>
            <a href="#">Services</a>
            <a href="#">Process</a>
            <a href="#">Testimonials</a>
          </div>
          <div className="footer-nav">
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
            <a href="#">Get Template</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
