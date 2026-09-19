import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Products({ products, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories dynamically from products data
  const categories = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="section-padding animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h2 className="section-title">Our Collection</h2>
        <p className="section-subtitle-center">
          Browse our handwoven dupatta stoles and premium hijabs. Filter by category or search below.
        </p>

        {/* Search & Filter bar */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          marginBottom: '50px',
          alignItems: 'center'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '24px' }}
            />
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)' 
              }} 
            />
          </div>

          {/* Category Tabs */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px', 
            justifyContent: 'center',
            marginTop: '8px'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="btn"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.8rem',
                  borderRadius: '20px',
                  backgroundColor: selectedCategory === category ? 'var(--color-primary)' : 'var(--color-bg-light)',
                  color: selectedCategory === category ? 'var(--color-bg-base)' : 'var(--color-primary)',
                  fontWeight: '600'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>No products found</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Try modifying your search query or filters.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
