import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckoutClick 
}) {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            <ShoppingBag size={20} />
            Shopping Cart ({cartItems.length})
          </h2>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close Cart">
            <X size={24} />
          </button>
        </div>

        {/* Content list */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty-message">
              <ShoppingBag size={48} strokeWidth={1.5} />
              <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '8px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Browse our collections and add products to start shopping.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartId} className="cart-item">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="cart-item-img" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/placeholder.svg';
                  }}
                />
                
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  {item.selectedVariety && (
                    <p className="cart-item-variety">{item.selectedVariety}</p>
                  )}
                  
                  <div className="cart-item-controls">
                    {/* Qty Selector */}
                    <div className="cart-qty-selector">
                      <button 
                        className="cart-qty-btn"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button 
                        className="cart-qty-btn"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="cart-item-price-calc">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  <button 
                    className="cart-item-remove-btn"
                    onClick={() => onRemoveItem(item.cartId)}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="cart-summary-row" style={{ fontWeight: 'bold' }}>
              <span>Total Price</span>
              <span className="cart-summary-total">₹{subtotal}</span>
            </div>
            
            <button 
              onClick={onCheckoutClick} 
              className="btn btn-primary btn-checkout"
              id="place-order-btn"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
