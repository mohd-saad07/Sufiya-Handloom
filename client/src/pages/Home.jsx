import React from 'react';
import Hero from '../components/Hero';
import FeaturedPreview from '../components/FeaturedPreview';
import { Award, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

export default function Home({ products, onAddToCart, setActivePage }) {
  const handleShopNowClick = () => {
    setActivePage('products');
    window.location.hash = 'products';
  };

  const highlights = [
    {
      icon: <Award size={28} />,
      title: 'Artisanal Authenticity',
      description: '100% handwoven designs sourced directly from local master weavers keeping heritage alive.'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Premium Fabrics',
      description: 'Finest quality georgette, modal cotton, and Chanderi silk carefully selected for exceptional comfort.'
    },
    {
      icon: <HeartHandshake size={28} />,
      title: 'Made with Love',
      description: 'Each scarf, hijab, and dupatta undergoes rigorous quality checks and holds a piece of our weaver’s heart.'
    },
    {
      icon: <Truck size={28} />,
      title: 'Reliable Shipping',
      description: 'We pack with extreme care and ship worldwide. Your order arrives fresh and beautifully gift-wrapped.'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <Hero onShopClick={handleShopNowClick} />

      {/* Why Choose Us */}
      <section className="section-padding highlights-section">
        <div className="container">
          <h2 className="section-title">The Sufiya Standard</h2>
          <p className="section-subtitle-center">
            Dedicated to providing the highest quality handlooms while supporting our artisan communities.
          </p>
          
          <div className="highlights-grid">
            {highlights.map((item, idx) => (
              <div key={idx} className="highlight-card">
                <div className="highlight-icon">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Preview Products Row */}
      <FeaturedPreview 
        products={products} 
        onAddToCart={onAddToCart} 
        onViewAllClick={handleShopNowClick} 
      />
    </div>
  );
}
