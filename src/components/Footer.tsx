import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">Veltrix</div>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <span className="footer-col-label">Main</span>
              <nav className="footer-nav">
                <a href="#">Works</a>
                <a href="#">Services</a>
                <a href="#">Processes</a>
                <a href="#">Testimonials</a>
              </nav>
            </div>

            <div className="footer-col">
              <span className="footer-col-label">More</span>
              <nav className="footer-nav">
                <a href="#">FAQ</a>
                <a href="#">Contact</a>
              </nav>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-credit">Created by Lunis Design</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
