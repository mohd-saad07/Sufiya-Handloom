import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';
import { apiUrl } from '../config/api';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // { orderId, logged }
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Strict restriction for Phone Number: numbers only, max 10 digits
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: numericValue }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    const trimmedAddress = formData.address.trim();

    if (!trimmedName || !trimmedEmail || !cleanPhone || !trimmedAddress) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Strict Gmail validation regex: must end with @gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(trimmedEmail)) {
      setErrorMessage('Email address must be a valid Gmail account ending with "@gmail.com" (e.g. name@gmail.com).');
      return;
    }

    // Strict Phone Number Validation: Must be exactly 10 digits
    if (cleanPhone.length !== 10) {
      setErrorMessage('Phone Number must be a valid 10-digit mobile number containing numbers only.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerInfo: {
            name: trimmedName,
            email: trimmedEmail,
            phone: cleanPhone,
            address: trimmedAddress
          },
          cartItems: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            selectedVariety: item.selectedVariety
          })),
          totalAmount
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessInfo({
          orderId: data.orderId || 'ORD_' + Date.now(),
          logged: data.logged || false
        });
        onOrderSuccess(); // Reset the cart in the parent component
      } else {
        setErrorMessage(data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorMessage('Network error: Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Checkout Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {successInfo ? (
            <div className="modal-success-state animate-fade-in">
              <CheckCircle size={56} className="modal-success-icon" />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Order Placed Successfully!</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Thank you for shopping with Sufiya Handloom.
              </p>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '24px' }}>
                Order ID: <span style={{ color: 'var(--color-accent)' }}>{successInfo.orderId}</span>
              </p>
              
              <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '12px', borderRadius: '4px', fontSize: '0.8rem', textAlign: 'left', marginBottom: '24px' }}>
                <strong>What's Next:</strong> We have compiled your items and sent them directly to our processing team. {successInfo.logged ? 'Since this is a development build, the order details have been successfully written to the server logs.' : 'A confirmation email has been dispatched to the Sufiya Handloom admin.'}
              </div>

              <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
                Close & Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Order Summary box */}
              <div className="order-summary-box">
                <h3>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Total Items:</span>
                  <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Grand Total:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {errorMessage && (
                <div style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: '16px', fontWeight: '500', backgroundColor: 'rgba(176, 92, 85, 0.1)', padding: '10px 14px', borderRadius: '4px' }}>
                  {errorMessage}
                </div>
              )}

              {/* Form Inputs */}
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-name">Full Name *</label>
                <input
                  type="text"
                  id="checkout-name"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-email">Email Address (@gmail.com only) *</label>
                <input
                  type="email"
                  id="checkout-email"
                  name="email"
                  className="form-input"
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>
                  Must end with @gmail.com (e.g. name@gmail.com)
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-phone">Mobile Phone Number (Numbers only) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  id="checkout-phone"
                  name="phone"
                  className="form-input"
                  placeholder="10-digit mobile number (e.g. 9026220094)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>
                  Strictly 10 digits allowed (numbers only)
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-address">Delivery Address</label>
                <textarea
                  id="checkout-address"
                  name="address"
                  className="form-input"
                  rows="3"
                  placeholder="Complete shipping address with pincode"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '10px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={16} style={{ marginRight: '8px' }} />
                    Processing Order...
                  </>
                ) : 'Submit Order'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
