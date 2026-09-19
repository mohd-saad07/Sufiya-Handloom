import React from 'react';

export default function About() {
  return (
    <div className="section-padding animate-fade-in">
      <div className="container">
        <h2 className="section-title">Our Story & Craft</h2>
        <p className="section-subtitle-center">
          Keeping traditional Indian handloom practices alive, one thread at a time.
        </p>

        <div className="about-grid" style={{ marginTop: '40px' }}>
          {/* About Image */}
          <div className="about-img-wrapper">
            <img
              src="/assets/handloom_weaver.png"
              alt="Artisanal Handloom Weaving"
              className="about-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/placeholder.svg';
              }}
            />
          </div>

          {/* About Text */}
          <div className="about-text-content">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>The Legacy of Sufiya Handloom</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Since many years, Sufiya Handloom has been weaving tradition, faith, and fashion together from the heart of Barabanki, Uttar Pradesh. What began as a small handloom workshop has grown into a trusted name across manufacturing, wholesale, and retail — known for quality craftsmanship, honest pricing, and a deep understanding of what our customers truly need.
              As a manufacturer, wholesaler, and retailer under one roof, we control every step of the process — from selecting the finest fabrics to the final finishing touch — so you always get authentic quality at the best possible price, whether you're buying one piece or ordering in bulk.            </p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Unlike mass-manufactured fast fashion, we emphasize slow, deliberate production. Every pattern is drawn out, every color chosen to match modern neutral palettes , and every thread carefully aligned on the wooden loom. This process results in scarves with unmatched drape, softness, and durability.
            </p>

            <div className="about-mission">
              "Our mission is to bridge traditional handloom craftsmanship with modern aesthetic demands, providing high-fidelity, premium ethnic garments to customers worldwide while sustaining fair wages for our master weavers."
            </div>

            <p style={{ color: 'var(--color-text-muted)' }}>
              When you purchase a Sufiya Handloom product, you are not just buying a piece of clothing; you are adopting a piece of textile history. Thank you for supporting slow fashion and keeping our weavers' community thriving.
            </p>
          </div>
        </div>

        {/* Visit Our Workshop & Store */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', textAlign: 'center' }}>Visit Our Store & Workshop</h3>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Sufiya Handloom, Infront of Muslim Musafir Khana, Satti Bazar, Barabanki, Uttar Pradesh - 225001, India
          </p>

          <div className="contact-map-wrapper" style={{ height: '380px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <iframe
              title="Sufiya Handloom Store Location - Barabanki"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28455.95586768894!2d81.14835417605093!3d26.93538935991835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399961bb822d87af%3A0xf899d29401569624!2sCSC%2FSAHAJ%20JAN%20SEWA%20KENDRA%2C%20SATTI%20BAZAR%20BARABANKI.!5e0!3m2!1sen!2sin!4v1787384575892!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
