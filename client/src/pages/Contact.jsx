import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      console.log('Contact form submitted:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="section-padding animate-fade-in">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle-center">
          Have queries about custom bulk orders, wholesale, or product variety? Drop us a line.
        </p>

        <div className="contact-grid">
          {/* Details & Map */}
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Store & Studio Details</h3>

            <div className="contact-info-cards">
              <div className="contact-card-item">
                <Phone className="contact-card-icon" size={20} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Call Us</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>+91 9026220094</p>
                </div>
              </div>

              <div className="contact-card-item">
                <Mail className="contact-card-icon" size={20} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Email Us</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    <a href="mailto:sufiyahandloom0@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                      sufiyahandloom0@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-card-item">
                <MapPin className="contact-card-icon" size={20} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Our Location</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Sufiya Handloom , Infront of Muslim Musafir khana, Barabanki , Uttar Pradesh - 225001, India
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div className="contact-map-wrapper">
              <iframe
                title="Sufiya Handloom Store Location - Barabanki"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28455.95586768894!2d81.14835417605093!3d26.93538935991835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399961bb822d87af%3A0xf899d29401569624!2sCSC%2FSAHAJ%20JAN%20SEWA%20KENDRA%2C%20SATTI%20BAZAR%20BARABANKI.!5e0!3m2!1sen!2sin!4v1787384575892!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ border: 0 }}
              />
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="contact-form-card">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Send Us a Message</h3>

            {isSubmitted ? (
              <div style={{ backgroundColor: 'rgba(93, 114, 96, 0.1)', color: 'var(--color-success)', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--color-success)' }}>Thank You!</h4>
                <p style={{ fontSize: '0.9rem' }}>Your message has been sent successfully. We will get back to you shortly.</p>
                <button onClick={() => setIsSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '16px', fontSize: '0.8rem', padding: '6px 16px' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-input"
                    rows="5"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Message <Send size={14} style={{ marginLeft: '8px' }} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
