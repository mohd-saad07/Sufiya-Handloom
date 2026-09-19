import React from 'react';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handleLinkClick = (e, pageId) => {
    e.preventDefault();
    setActivePage(pageId);
    window.location.hash = pageId === 'home' ? '' : pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col footer-about">
            <h2 className="nav-brand" style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '16px' }}>
              SUFIYA HANDLOOM
              <span className="nav-brand-sub" style={{ fontSize: '0.6rem' }}>DUPATTAS & STOLES</span>
            </h2>
            <p>
              Weaving heritage and style since 2026. Creators of artisanal stoles, dupattas, and high-quality hijabs designed to fit modern lifestyles.
            </p>
            <div className="footer-socials">
              <a 
                href="https://www.instagram.com/zaidansari0006?igsi=Y2ZlcjRjM25icGN3" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Policies (Directly nearby Sufiya Handloom details) */}
          <div className="footer-col">
            <h3>POLICIES</h3>
            <ul className="footer-links">
              <li><a href="#return-policy" onClick={(e) => handleLinkClick(e, 'return-policy')}>Return Policy</a></li>
              <li><a href="#terms-conditions" onClick={(e) => handleLinkClick(e, 'terms-conditions')}>Terms and Conditions</a></li>
              <li><a href="#shipping-policy" onClick={(e) => handleLinkClick(e, 'shipping-policy')}>Shipping Policy</a></li>
              <li><a href="#privacy-policy" onClick={(e) => handleLinkClick(e, 'privacy-policy')}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div className="footer-col">
            <h3>Explore</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'home')}>Home</a></li>
              <li><a href="#products" onClick={(e) => handleLinkClick(e, 'products')}>Products</a></li>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>About Us</a></li>
              <li><a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')}>Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Quick Collections */}
          <div className="footer-col">
            <h3>Collections</h3>
            <ul className="footer-links">
              <li><a href="#products" onClick={(e) => handleLinkClick(e, 'products')}>Hijabs</a></li>
              <li><a href="#products" onClick={(e) => handleLinkClick(e, 'products')}>Dupattas</a></li>
              <li><a href="#products" onClick={(e) => handleLinkClick(e, 'products')}>Stoles</a></li>
              <li><a href="#products" onClick={(e) => handleLinkClick(e, 'products')}>Muslim Ethnic Wear</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Summary */}
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="footer-links" style={{ gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(250, 247, 242, 0.7)' }}>
                <Phone size={14} className="contact-card-icon" />
                <span>+91 9026220094</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(250, 247, 242, 0.7)' }}>
                <Mail size={14} className="contact-card-icon" />
                <a href="mailto:sufiyahandloom0@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                  sufiyahandloom0@gmail.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'rgba(250, 247, 242, 0.7)' }}>
                <MapPin size={14} className="contact-card-icon" style={{ marginTop: '3px' }} />
                <span>Sufiya Handloom, Infront of Muslim Musafir khana, Barabanki, Uttar Pradesh - 225001, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Sufiya Handloom. All rights reserved.</p>
          <p>
            <a 
              href="#admin" 
              className="footer-admin-link"
              onClick={(e) => handleLinkClick(e, 'admin')}
              id="admin-dashboard-link"
            >
              Admin Portal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
