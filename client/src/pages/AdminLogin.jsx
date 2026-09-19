import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { apiUrl } from '../config/api';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('saad1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token in sessionStorage
        sessionStorage.setItem('adminToken', data.token);
        onLoginSuccess(data.token);
      } else {
        setError(data.message || 'Incorrect password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failed. Make sure the Node.js server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '75vh', padding: '60px 24px' }}>
      <div className="admin-login-card animate-slide-up">
        <div className="admin-login-header">
          <div style={{
            display: 'inline-flex',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-light)',
            color: 'var(--color-primary)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Lock size={22} />
          </div>
          <h2>Admin Access</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Please enter your password to access the product management dashboard.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(176, 92, 85, 0.1)',
            color: 'var(--color-error)',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" htmlFor="admin-pass">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="admin-pass"
              className="form-input"
              style={{ paddingRight: '44px' }}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                color: 'var(--color-text-muted)'
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={16} style={{ marginRight: '8px' }} />
                Authenticating...
              </>
            ) : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
