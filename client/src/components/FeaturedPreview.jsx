import React from 'react';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedPreview({ products, onAddToCart, onViewAllClick }) {
  // Sort featured products newest-first (createdAt descending or reverse array order)
  const featuredProducts = [...products]
    .filter(p => p.featured)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (featuredProducts.length === 0) {
    return null; // Don't show anything if there are no featured products
  }

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <div className="container">
        <h2 className="section-title">Featured Creations</h2>
        <p className="section-subtitle-center">
          Handpicked premium stoles and hijabs representing our finest artisanal weaves.
        </p>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button onClick={onViewAllClick} className="btn btn-secondary">
            View Full Collection <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>
    </section>
  );
}
