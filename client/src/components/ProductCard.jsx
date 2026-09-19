import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  // Store selected choices for each variety (e.g., { "Color": "Mocha", "Size": "M" })
  const [selectedVarieties, setSelectedVarieties] = useState(() => {
    const initial = {};
    if (product.varieties && Array.isArray(product.varieties)) {
      product.varieties.forEach((v) => {
        if (v.options && v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
    }
    return initial;
  });

  const handleVarietyChange = (name, value) => {
    setSelectedVarieties((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddToCart = () => {
    // Bundle the selected varieties into a readable string (e.g. "Mocha / M")
    const selectionString = Object.entries(selectedVarieties)
      .map(([name, val]) => `${name}: ${val}`)
      .join(', ');
      
    onAddToCart(product, selectionString);
  };

  return (
    <div className="product-card">
      <div className="product-card-img-wrapper">
        {product.featured && <span className="product-featured-badge">Featured</span>}
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="product-card-img" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/placeholder.svg';
          }}
        />
      </div>

      <div className="product-card-content">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-description">{product.description}</p>

        {/* Dynamic Varieties Selectors */}
        {product.varieties && product.varieties.length > 0 && (
          <div className="product-card-variety-selector">
            {product.varieties.map((v) => (
              <div key={v.name} style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                  {v.name}
                </label>
                <select
                  className="variety-select"
                  value={selectedVarieties[v.name] || ''}
                  onChange={(e) => handleVarietyChange(v.name, e.target.value)}
                >
                  {v.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price}</span>
          <button 
            onClick={handleAddToCart} 
            className="btn btn-primary btn-add-cart"
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingCart size={14} style={{ marginRight: '6px' }} />
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
