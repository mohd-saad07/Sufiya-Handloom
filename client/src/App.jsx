import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Policies from './pages/Policies';
import { apiUrl } from './config/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sufiya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('adminToken') || '';
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('sufiya_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch products from backend Express API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/products'));
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hash-based Client Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'products') {
        setActivePage('products');
      } else if (hash === 'about') {
        setActivePage('about');
      } else if (hash === 'contact') {
        setActivePage('contact');
      } else if (['return-policy', 'terms-conditions', 'shipping-policy', 'privacy-policy', 'policies'].includes(hash)) {
        setActivePage(hash);
      } else if (hash === 'admin') {
        const adminSession = sessionStorage.getItem('adminToken') || token;
        setActivePage(adminSession ? 'admin-dashboard' : 'admin');
      } else {
        setActivePage('home');
      }
      
      // Close side overlays on route change
      setCartOpen(false);
      setCheckoutOpen(false);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Trigger on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [token]);

  // Cart operations
  const handleAddToCart = (product, selectedVariety) => {
    setCart((prevCart) => {
      // Create a unique identifier based on product ID and selected variety combo
      const cartId = `${product.id}_${selectedVariety || 'default'}`;
      const existingItemIndex = prevCart.findIndex(item => item.cartId === cartId);

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, {
          cartId,
          id: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          selectedVariety,
          quantity: 1
        }];
      }
    });
    // Automatically open cart drawer to show customer confirmation
    setCartOpen(true);
  };

  const handleUpdateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveItem = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Auth Operations
  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setActivePage('admin-dashboard');
    window.location.hash = 'admin';
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setActivePage('home');
    window.location.hash = '';
  };

  // Render Page Content based on Router State
  const renderPage = () => {
    if (loading && products.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '100px 24px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: '600' }}>Loading Sufiya Handloom...</div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Loading catalog details from database.</p>
        </div>
      );
    }

    switch (activePage) {
      case 'products':
        return <Products products={products} onAddToCart={handleAddToCart} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'return-policy':
        return <Policies initialTab="return" />;
      case 'terms-conditions':
        return <Policies initialTab="terms" />;
      case 'shipping-policy':
        return <Policies initialTab="shipping" />;
      case 'privacy-policy':
        return <Policies initialTab="privacy" />;
      case 'policies':
        return <Policies initialTab="return" />;
      case 'admin':
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            products={products} 
            token={token} 
            onLogout={handleLogout} 
            refreshProducts={fetchProducts} 
          />
        );
      case 'home':
      default:
        return (
          <Home 
            products={products} 
            onAddToCart={handleAddToCart} 
            setActivePage={setActivePage} 
          />
        );
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        cartCount={totalCartCount} 
        toggleCart={() => setCartOpen(true)} 
      />

      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>

      <Footer setActivePage={setActivePage} />

      {/* Cart Drawer Panel Overlay */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutClick={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Checkout Form Modal */}
      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={handleClearCart}
      />
    </div>
  );
}
