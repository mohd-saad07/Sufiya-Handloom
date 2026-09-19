import React, { useState, useEffect } from 'react';
import { ShieldCheck, RotateCcw, Truck, FileText, Lock } from 'lucide-react';

export default function Policies({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'return');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    let hash = 'return-policy';
    if (tabId === 'terms') hash = 'terms-conditions';
    if (tabId === 'shipping') hash = 'shipping-policy';
    if (tabId === 'privacy') hash = 'privacy-policy';
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="section-padding animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h2 className="section-title">Customer Care & Store Policies</h2>
        <p className="section-subtitle-center">
          Transparency, trust, and quality craftsmanship are at the core of Sufiya Handloom. Review our store policies below.
        </p>

        {/* Policy Tab Controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '40px',
          marginTop: '30px'
        }}>
          <button
            onClick={() => handleTabChange('return')}
            className="btn"
            style={{
              padding: '10px 22px',
              fontSize: '0.85rem',
              borderRadius: '24px',
              backgroundColor: activeTab === 'return' ? 'var(--color-primary)' : 'var(--color-bg-light)',
              color: activeTab === 'return' ? 'var(--color-bg-base)' : 'var(--color-primary)',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <RotateCcw size={16} /> Return Policy
          </button>

          <button
            onClick={() => handleTabChange('terms')}
            className="btn"
            style={{
              padding: '10px 22px',
              fontSize: '0.85rem',
              borderRadius: '24px',
              backgroundColor: activeTab === 'terms' ? 'var(--color-primary)' : 'var(--color-bg-light)',
              color: activeTab === 'terms' ? 'var(--color-bg-base)' : 'var(--color-primary)',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={16} /> Terms and Conditions
          </button>

          <button
            onClick={() => handleTabChange('shipping')}
            className="btn"
            style={{
              padding: '10px 22px',
              fontSize: '0.85rem',
              borderRadius: '24px',
              backgroundColor: activeTab === 'shipping' ? 'var(--color-primary)' : 'var(--color-bg-light)',
              color: activeTab === 'shipping' ? 'var(--color-bg-base)' : 'var(--color-primary)',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Truck size={16} /> Shipping Policy
          </button>

          <button
            onClick={() => handleTabChange('privacy')}
            className="btn"
            style={{
              padding: '10px 22px',
              fontSize: '0.85rem',
              borderRadius: '24px',
              backgroundColor: activeTab === 'privacy' ? 'var(--color-primary)' : 'var(--color-bg-light)',
              color: activeTab === 'privacy' ? 'var(--color-bg-base)' : 'var(--color-primary)',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Lock size={16} /> Privacy Policy
          </button>
        </div>

        {/* Policy Content Body */}
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          {/* TAB 1: RETURN POLICY */}
          {activeTab === 'return' && (
            <div className="policy-section animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--color-primary)' }}>
                <RotateCcw size={28} />
                <h3 style={{ fontSize: '1.6rem', margin: 0 }}>Return & Exchange Policy</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                At <strong>Sufiya Handloom</strong> (Barabanki, Uttar Pradesh), every item is handwoven with traditional techniques and inspected with extreme care. We want you to love your purchase. If you are not completely satisfied, we are here to assist with hassle-free returns and exchanges.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>1. Return Window</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Returns and replacement requests must be initiated within <strong>7 calendar days</strong> from the date of order delivery.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>2. Eligibility Criteria</h4>
              <ul style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '20px' }}>
                <li>Items must be unused, unwashed, free from perfume or stains, and in their original packaging with product tags attached.</li>
                <li>Custom-dyed or tailor-made garments prepared specifically to buyer specifications are non-returnable unless defective.</li>
                <li>Wholesale bulk purchases are subject to replacement in cases of verified manufacturing defects.</li>
              </ul>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>3. Damaged or Defective Items</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                If your parcel arrives damaged or you receive an incorrect item, please notify our team within <strong>48 hours</strong> of delivery. Share a photo or unboxing video via WhatsApp (<strong>+91 9026220094</strong>) or email (<strong><a href="mailto:sufiyahandloom0@gmail.com" style={{ color: 'inherit' }}>sufiyahandloom0@gmail.com</a></strong>) for priority replacement.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>4. Refund Processing</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Once your returned parcel is received at our Barabanki workshop and passes quality check, refunds will be credited back to your original payment method (UPI, Bank Account, or Credit Card) within <strong>5–7 business days</strong>.
              </p>
            </div>
          )}

          {/* TAB 2: TERMS AND CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="policy-section animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--color-primary)' }}>
                <FileText size={28} />
                <h3 style={{ fontSize: '1.6rem', margin: 0 }}>Terms and Conditions</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                Welcome to the <strong>Sufiya Handloom</strong> website. By browsing our website, placing an online order, or purchasing in bulk/wholesale, you agree to comply with and be bound by the following terms and conditions.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>1. Handloom Craftsmanship Notice</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Our stoles, dupattas, and hijabs are handcrafted by skilled artisans. Slight variations in thread weave, color shade, or zari borders are natural hallmarks of authentic handloom weaving and make every piece unique.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>2. Pricing & Currency</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                All prices listed on the website are in <strong>Indian Rupees (₹)</strong> and are inclusive of applicable GST taxes. We reserve the right to revise prices or discontinue products without prior notification.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>3. Wholesale & Retail Orders</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Sufiya Handloom operates as a manufacturer, wholesaler, and retailer under one roof. For commercial wholesale orders, specific custom quotes and delivery timelines apply upon order confirmation.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>4. Intellectual Property</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                All website design, product photography, brand imagery, text, and logo graphics belong exclusively to Sufiya Handloom. Reproduction or unauthorized commercial usage without written consent is strictly prohibited.
              </p>
            </div>
          )}

          {/* TAB 3: SHIPPING POLICY */}
          {activeTab === 'shipping' && (
            <div className="policy-section animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--color-primary)' }}>
                <Truck size={28} />
                <h3 style={{ fontSize: '1.6rem', margin: 0 }}>Shipping & Delivery Policy</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                We pack every Sufiya Handloom order with extreme care and ship worldwide from our workshop in Barabanki, Uttar Pradesh.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>1. Order Dispatch & Processing</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Standard retail orders are dispatched within <strong>24–48 hours</strong>. Bulk wholesale or custom-stitched orders are dispatched within <strong>3–5 business days</strong>.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>2. Delivery Timelines</h4>
              <ul style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '20px' }}>
                <li><strong>Local & Uttar Pradesh:</strong> 2 – 3 business days.</li>
                <li><strong>Rest of India:</strong> 4 – 6 business days via courier partners (Blue Dart, Delhivery, Speed Post).</li>
                <li><strong>International Delivery:</strong> 7 – 12 business days (subject to customs clearance).</li>
              </ul>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>3. Shipping Charges</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                We offer <strong>Free Delivery across India</strong> on all orders above ₹999. A minimal shipping charge of ₹60 applies to smaller orders below ₹999.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>4. Order Tracking</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Once your order is handed to our logistics partner, an automated AWB tracking link and Order ID will be sent to your email and phone number.
              </p>
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="policy-section animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--color-primary)' }}>
                <Lock size={28} />
                <h3 style={{ fontSize: '1.6rem', margin: 0 }}>Privacy Policy</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                Sufiya Handloom respects your privacy. We are committed to protecting your personal data and ensuring a safe shopping environment.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>1. Data We Collect</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                When you place an order or contact us, we collect essential details: Full Name, Delivery Address, Mobile Number, and Email Address.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>2. How We Use Your Data</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Your information is used strictly to process orders, deliver your parcel, send tracking notifications, and provide customer assistance. We do <strong>NOT</strong> sell, rent, or trade customer information to third parties.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>3. Payment & Data Security</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                All transactions are processed through encrypted payment gateways. Sufiya Handloom never stores your credit/debit card numbers or net banking passwords.
              </p>

              <h4 style={{ fontSize: '1.1rem', marginTop: '24px', marginBottom: '10px', color: 'var(--color-primary-dark)' }}>4. Contact & Inquiries</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                If you have questions regarding your data, email us at <strong><a href="mailto:sufiyahandloom0@gmail.com" style={{ color: 'inherit' }}>sufiyahandloom0@gmail.com</a></strong> or call <strong>+91 9026220094</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
