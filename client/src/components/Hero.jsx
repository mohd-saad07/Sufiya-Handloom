import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ onShopClick }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content animate-slide-up">
            <span className="hero-subtitle">Est. 2026 • Artisanal Handlooms</span>
            <h1 className="hero-title">
              Crafted Elegance for the <span>Modern Woman</span>
            </h1>
            <p className="hero-description">
              Discover our exclusive collection of handwoven stoles, premium georgette hijabs, exquisite silk dupattas, and luxurious Muslim ethnic wear. Woven with care and tradition.
            </p>
            <div className="hero-actions">
              <button onClick={onShopClick} className="btn btn-primary btn-accent">
                Shop Our Products <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
              <button 
                onClick={() => {
                  window.location.hash = 'about';
                  window.dispatchEvent(new HashChangeEvent('hashchange'));
                }} 
                className="btn btn-secondary"
              >
                Our Story
              </button>
            </div>
          </div>
          <div className="hero-image-container animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80" 
              alt="Sufiya Handloom Premium Collection" 
              className="hero-image" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
