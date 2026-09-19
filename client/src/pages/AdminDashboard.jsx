import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LogOut, Package, Image as ImageIcon, Tag, DollarSign, Check, X, ShieldAlert, Upload, Loader } from 'lucide-react';
import { apiUrl } from '../config/api';

export default function AdminDashboard({ products, token, onLogout, refreshProducts }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'Hijab',
    featured: false
  });
  
  // State for the Variety Builder
  // Structure: [ { name: 'Color', options: 'White, Red, Blue' } ]
  const [varieties, setVarieties] = useState([]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormState({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      category: 'Hijab',
      featured: true // Default to true so newly created products display on home page
    });
    setVarieties([{ name: '', options: '' }]);
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormState({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      featured: product.featured
    });
    
    // Map varieties to comma-separated format
    const mappedVarieties = product.varieties.map(v => ({
      name: v.name,
      options: v.options.join(', ')
    }));
    setVarieties(mappedVarieties.length > 0 ? mappedVarieties : [{ name: '', options: '' }]);
    
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Direct Image File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    setErrorMessage('');

    try {
      const response = await fetch(apiUrl('/api/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setFormState(prev => ({ ...prev, imageUrl: data.imageUrl }));
        setSuccessMessage('Image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 2500);
      } else {
        setErrorMessage(data.message || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setErrorMessage('Network error while uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Variety Builder handlers
  const handleVarietyChange = (index, field, value) => {
    const updated = [...varieties];
    updated[index][field] = value;
    setVarieties(updated);
  };

  const handleAddVarietyRow = () => {
    setVarieties(prev => [...prev, { name: '', options: '' }]);
  };

  const handleRemoveVarietyRow = (index) => {
    setVarieties(prev => prev.filter((_, idx) => idx !== index));
  };

  // Form Submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formState.title || !formState.price) {
      setErrorMessage('Product Title and Price are required.');
      return;
    }

    // Process and validate varieties input
    const formattedVarieties = varieties
      .map(v => ({
        name: v.name.trim(),
        options: v.options.split(',').map(o => o.trim()).filter(Boolean)
      }))
      .filter(v => v.name && v.options.length > 0);

    const payload = {
      ...formState,
      price: Number(formState.price),
      varieties: formattedVarieties
    };

    const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl(endpoint), {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(editingProduct ? 'Product edited successfully!' : 'Product added successfully!');
        refreshProducts(); // Refresh products in parent App state
        setTimeout(() => {
          setModalOpen(false);
          setSuccessMessage('');
        }, 1200);
      } else {
        setErrorMessage(data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage('Network error: Could not complete transaction.');
    }
  };

  // Product Delete handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this product?')) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl(`/api/products/${productId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Product deleted successfully.');
        refreshProducts();
        setTimeout(() => setSuccessMessage(''), 2500);
      } else {
        setErrorMessage(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMessage('Connection error. Could not delete.');
    }
  };

  // Quick 1-Click Toggle for Homepage Featured Status
  const handleToggleFeatured = async (product) => {
    try {
      const response = await fetch(apiUrl(`/api/products/${product.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          featured: !product.featured
        })
      });

      if (response.ok) {
        setSuccessMessage(`Product "${product.title}" ${!product.featured ? 'added to' : 'removed from'} Featured Creations on Homepage.`);
        refreshProducts();
        setTimeout(() => setSuccessMessage(''), 2500);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Failed to update featured status.');
      }
    } catch (err) {
      console.error('Toggle featured error:', err);
      setErrorMessage('Connection error updating featured status.');
    }
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Sufiya Admin</h2>
        <ul className="admin-sidebar-menu">
          <li className="admin-menu-item active">
            <Package size={18} />
            <span>Manage Products</span>
          </li>
          <li>
            <button 
              onClick={onLogout} 
              className="admin-menu-item"
              style={{ width: '100%', textDecoration: 'none', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Dashboard Area */}
      <main className="admin-main-content">
        <div className="admin-page-header">
          <div>
            <h1 style={{ fontSize: '2rem' }}>Products Inventory</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Create, read, update, or delete products displayed on the public catalog.
            </p>
          </div>
          <button onClick={handleOpenAddModal} className="btn btn-primary" id="add-product-btn">
            <Plus size={16} style={{ marginRight: '6px' }} /> Add Product
          </button>
        </div>

        {/* Messaging banners */}
        {successMessage && (
          <div style={{ backgroundColor: 'rgba(93, 114, 96, 0.1)', color: 'var(--color-success)', padding: '12px 20px', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '20px', fontWeight: '500' }}>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div style={{ backgroundColor: 'rgba(176, 92, 85, 0.1)', color: 'var(--color-error)', padding: '12px 20px', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '20px', fontWeight: '500' }}>
            {errorMessage}
          </div>
        )}

        {/* Data Table */}
        <div className="admin-products-table-wrapper">
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
              <ShieldAlert size={40} style={{ marginBottom: '10px', color: 'var(--color-border)' }} />
              <p style={{ fontWeight: '500' }}>No products in database</p>
              <p style={{ fontSize: '0.85rem' }}>Click "Add Product" to create your first listing.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Featured</th>
                  <th style={{ width: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="admin-table-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/placeholder.svg';
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{product.title}</div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--color-text-muted)', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        maxWidth: '240px' 
                      }}>
                        {product.description}
                      </div>
                    </td>
                    <td><span className="badge">{product.category}</span></td>
                    <td style={{ fontWeight: 'bold' }}>₹{product.price}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        style={{
                          padding: '4px 12px',
                          fontSize: '0.8rem',
                          borderRadius: '16px',
                          backgroundColor: product.featured ? 'rgba(93, 114, 96, 0.15)' : 'var(--color-bg-light)',
                          color: product.featured ? 'var(--color-success)' : 'var(--color-text-muted)',
                          fontWeight: '600',
                          border: '1px solid ' + (product.featured ? 'var(--color-success)' : 'var(--color-border)'),
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.2s ease'
                        }}
                        title="Click to toggle whether this product appears in Featured Creations on Homepage"
                      >
                        {product.featured ? <><Check size={13} /> Featured</> : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions-cell">
                        <button 
                          onClick={() => handleOpenEditModal(product)} 
                          className="btn btn-admin-action btn-admin-edit"
                          aria-label="Edit Product"
                          id={`edit-btn-${product.id}`}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)} 
                          className="btn btn-admin-action btn-admin-delete"
                          aria-label="Delete Product"
                          id={`delete-btn-${product.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* CRUD Product Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="admin-modal-body">
                {/* Error Box */}
                {errorMessage && (
                  <div style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: '16px', fontWeight: '500' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Form Fields */}
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-title">Product Title *</label>
                  <input
                    type="text"
                    id="prod-title"
                    name="title"
                    className="form-input"
                    value={formState.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Georgette Silk Scarf"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-price">Price (₹) *</label>
                    <input
                      type="number"
                      id="prod-price"
                      name="price"
                      className="form-input"
                      value={formState.price}
                      onChange={handleInputChange}
                      placeholder="e.g. 850"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-category">Category</label>
                    <select
                      id="prod-category"
                      name="category"
                      className="form-input"
                      value={formState.category}
                      onChange={handleInputChange}
                    >
                      <option value="Hijab">Hijab</option>
                      <option value="Dupatta">Dupatta</option>
                      <option value="Stole">Stole</option>
                      <option value="Ethnic Wear">Ethnic Wear</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  
                  {/* File Upload Option */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <label 
                      htmlFor="prod-file-upload" 
                      className="btn btn-secondary" 
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 14px' }}
                    >
                      {uploadingImage ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
                      {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}
                    </label>
                    <input 
                      type="file" 
                      id="prod-file-upload" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      style={{ display: 'none' }} 
                      disabled={uploadingImage}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Select JPG, PNG, WEBP from your device
                    </span>
                  </div>

                  {/* Image URL Input Option */}
                  <input
                    type="text"
                    id="prod-img"
                    name="imageUrl"
                    className="form-input"
                    value={formState.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Or enter image URL e.g. https://... or /uploads/..."
                  />

                  {/* Live Image Preview */}
                  {formState.imageUrl && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--color-bg-light)', padding: '10px', borderRadius: '6px' }}>
                      <img 
                        src={formState.imageUrl} 
                        alt="Preview" 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/placeholder.svg';
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Image Preview</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
                          {formState.imageUrl}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-desc">Description</label>
                  <textarea
                    id="prod-desc"
                    name="description"
                    className="form-input"
                    rows="3"
                    value={formState.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about the fabric, craft, embroidery, etc."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Featured Creations (Homepage) Checkbox Toggle Card */}
                <div className="form-group" style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  backgroundColor: formState.featured ? 'rgba(93, 114, 96, 0.08)' : 'var(--color-bg-light)', 
                  padding: '14px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid ' + (formState.featured ? 'var(--color-success)' : 'var(--color-border)'),
                  marginTop: '10px',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="checkbox"
                    id="prod-featured"
                    name="featured"
                    checked={formState.featured}
                    onChange={handleInputChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', marginTop: '2px', accentColor: 'var(--color-primary)' }}
                  />
                  <div>
                    <label htmlFor="prod-featured" className="form-label" style={{ marginBottom: '2px', cursor: 'pointer', fontWeight: '600', color: 'var(--color-primary)' }}>
                      Display in "Featured Creations" on Homepage
                    </label>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                      When checked, this product will appear prominently in the Featured Creations section on the home page as well as the full catalog.
                    </div>
                  </div>
                </div>

                {/* Variety Builder Panel */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1rem' }}>Product Varieties (Colors, Sizes, etc.)</h3>
                    <button 
                      type="button" 
                      onClick={handleAddVarietyRow}
                      className="btn" 
                      style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: 'var(--color-bg-light)', color: 'var(--color-primary)' }}
                    >
                      + Add Variety Row
                    </button>
                  </div>
                  
                  {varieties.map((v, index) => (
                    <div key={index} className="variety-builder-row">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Variety Name (e.g. Color)"
                        value={v.name}
                        onChange={(e) => handleVarietyChange(index, 'name', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Options (comma separated, e.g. Rose, Olive, Teal)"
                        value={v.options}
                        onChange={(e) => handleVarietyChange(index, 'options', e.target.value)}
                        style={{ flex: 2 }}
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveVarietyRow(index)}
                        style={{ color: 'var(--color-error)' }}
                        aria-label="Remove Row"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '8px 20px' }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
