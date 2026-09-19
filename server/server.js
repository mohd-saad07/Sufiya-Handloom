const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const { supabase, isSupabaseConfigured, bucketName } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) for production deployment
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());

// Set up image upload directory and static serving (for local fallback)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Configure Multer for File Uploads in Memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// PROTECTED: Image Upload Endpoint (Supabase Storage with Local Disk Fallback)
app.post('/api/upload', authMiddleware, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Image upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname) || '.jpg';
    const fileName = `img-${uniqueSuffix}${ext}`;

    // 1. Try Supabase Storage if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: true
          });

        if (!error) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

          console.log(`Image uploaded to Supabase Storage (${bucketName}/${fileName})`);
          return res.json({
            message: 'Image uploaded successfully to Supabase Storage',
            imageUrl: publicUrlData.publicUrl
          });
        }

        console.warn('Supabase Storage upload warning (falling back to disk):', error.message);
      } catch (storageErr) {
        console.warn('Supabase Storage error (falling back to disk):', storageErr.message);
      }
    }

    // 2. Local disk fallback
    try {
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
      const imageUrl = `/uploads/${fileName}`;
      res.json({ message: 'Image uploaded successfully to local storage', imageUrl });
    } catch (diskErr) {
      console.error('Failed to save file to local disk:', diskErr.message);
      res.status(500).json({ message: 'Failed to save uploaded image' });
    }
  });
});

const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Helper function to format product attributes consistently
function formatProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    description: p.description || '',
    price: Number(p.price),
    imageUrl: p.image_url || p.imageUrl || '/assets/placeholder.png',
    featured: Boolean(p.featured),
    category: p.category || 'General',
    varieties: p.varieties || [],
    createdAt: p.created_at ? Number(p.created_at) : (p.createdAt || Date.now())
  };
}

// Helper functions for local DB reading/writing (fallback)
function readProducts() {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, returning empty array:', err.message);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database file:', err.message);
    throw err;
  }
}

// PUBLIC: Get all products (Supabase with local fallback)
app.get('/api/products', async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data.map(formatProduct));
    } catch (err) {
      console.warn('Supabase products fetch failed, falling back to local products.json:', err.message);
    }
  }

  const products = readProducts();
  res.json(products);
});

// PUBLIC: Get single product
app.get('/api/products/:id', async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return res.json(formatProduct(data));
      }
    } catch (err) {
      console.warn('Supabase single product fetch failed, falling back to local file:', err.message);
    }
  }

  const products = readProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// PROTECTED: Add new product
app.post('/api/products', authMiddleware, async (req, res) => {
  const { title, description, price, imageUrl, featured, category, varieties } = req.body;
  
  if (!title || !price) {
    return res.status(400).json({ message: 'Title and price are required' });
  }

  const newProduct = {
    id: 'prod_' + Date.now(),
    title,
    description: description || '',
    price: Number(price),
    imageUrl: imageUrl || '/assets/placeholder.png',
    featured: featured || false,
    category: category || 'General',
    varieties: varieties || [],
    createdAt: Date.now()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          id: newProduct.id,
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.price,
          image_url: newProduct.imageUrl,
          featured: newProduct.featured,
          category: newProduct.category,
          varieties: newProduct.varieties,
          created_at: newProduct.createdAt
        }])
        .select()
        .single();

      if (error) throw error;

      // Sync local file as backup
      try {
        const localProducts = readProducts();
        localProducts.unshift(newProduct);
        writeProducts(localProducts);
      } catch (e) {}

      return res.status(201).json({ message: 'Product added successfully to Supabase', product: formatProduct(data) });
    } catch (err) {
      console.warn('Supabase product insert failed, writing to local file:', err.message);
    }
  }

  const products = readProducts();
  products.unshift(newProduct);
  writeProducts(products);

  res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

// PROTECTED: Edit existing product
app.put('/api/products/:id', authMiddleware, async (req, res) => {
  const { title, description, price, imageUrl, featured, category, varieties } = req.body;

  if (isSupabaseConfigured() && supabase) {
    try {
      const updatePayload = {};
      if (title !== undefined) updatePayload.title = title;
      if (description !== undefined) updatePayload.description = description;
      if (price !== undefined) updatePayload.price = Number(price);
      if (imageUrl !== undefined) updatePayload.image_url = imageUrl;
      if (featured !== undefined) updatePayload.featured = featured;
      if (category !== undefined) updatePayload.category = category;
      if (varieties !== undefined) updatePayload.varieties = varieties;

      const { data, error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', req.params.id)
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Sync local backup
        try {
          const localProducts = readProducts();
          const idx = localProducts.findIndex(p => p.id === req.params.id);
          if (idx !== -1) {
            localProducts[idx] = formatProduct(data);
            writeProducts(localProducts);
          }
        } catch (e) {}

        return res.json({ message: 'Product updated successfully in Supabase', product: formatProduct(data) });
      }
    } catch (err) {
      console.warn('Supabase product update failed, updating local file:', err.message);
    }
  }

  const products = readProducts();
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = {
    ...products[productIndex],
    title: title !== undefined ? title : products[productIndex].title,
    description: description !== undefined ? description : products[productIndex].description,
    price: price !== undefined ? Number(price) : products[productIndex].price,
    imageUrl: imageUrl !== undefined ? imageUrl : products[productIndex].imageUrl,
    featured: featured !== undefined ? featured : products[productIndex].featured,
    category: category !== undefined ? category : products[productIndex].category,
    varieties: varieties !== undefined ? varieties : products[productIndex].varieties
  };

  products[productIndex] = updatedProduct;
  writeProducts(products);

  res.json({ message: 'Product updated successfully', product: updatedProduct });
});

// PROTECTED: Delete product
app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;

      // Sync local backup
      try {
        const localProducts = readProducts();
        const filtered = localProducts.filter(p => p.id !== req.params.id);
        writeProducts(filtered);
      } catch (e) {}

      return res.json({ message: 'Product deleted successfully from Supabase' });
    } catch (err) {
      console.warn('Supabase product delete failed, deleting from local file:', err.message);
    }
  }

  const products = readProducts();
  const filteredProducts = products.filter(p => p.id !== req.params.id);

  if (products.length === filteredProducts.length) {
    return res.status(404).json({ message: 'Product not found' });
  }

  writeProducts(filteredProducts);
  res.json({ message: 'Product deleted successfully' });
});

// PUBLIC: Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.ADMIN_PASSWORD || 'sufiya_handloom_admin_2026';

  if (password === expectedPassword) {
    const token = jwt.sign(
      { username: 'admin' },
      process.env.JWT_SECRET || 'sufiya_handloom_secret_key_2026_xyz',
      { expiresIn: '12h' }
    );
    return res.json({ message: 'Login successful', token });
  }

  res.status(401).json({ message: 'Invalid password' });
});

// PUBLIC: Order processing (Checkout order mailer)
app.post('/api/orders', async (req, res) => {
  const { customerInfo, cartItems, totalAmount } = req.body;

  if (!customerInfo || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Missing order details' });
  }

  // Create a structured summary for logs and email
  const orderId = 'ORD_' + Date.now();
  console.log(`\n=================== NEW ORDER RECEIVED (${orderId}) ===================`);
  console.log('Customer Details:', customerInfo);
  console.log('Cart Items:', JSON.stringify(cartItems, null, 2));
  console.log('Total Price:', totalAmount);
  console.log('===================================================================\n');

  // Prepare email body
  const cartHTML = cartItems.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.title} (${item.selectedVariety || 'Default'})</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
      <h2 style="background-color: #5c3a21; color: #fff; padding: 15px; margin-top: 0; border-radius: 4px 4px 0 0;">New Order Recieved: Sufiya Handloom</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      
      <h3>Customer Information</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 5px; font-weight: bold; width: 120px;">Name:</td><td>${customerInfo.name}</td></tr>
        <tr><td style="padding: 5px; font-weight: bold;">Email:</td><td>${customerInfo.email}</td></tr>
        <tr><td style="padding: 5px; font-weight: bold;">Phone:</td><td>${customerInfo.phone}</td></tr>
        <tr><td style="padding: 5px; font-weight: bold;">Address:</td><td>${customerInfo.address}</td></tr>
      </table>

      <h3>Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f7f3eb;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center; width: 60px;">Qty</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right; width: 80px;">Unit Price</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right; width: 90px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${cartHTML}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold; background-color: #f7f3eb;">
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Grand Total:</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${totalAmount}</td>
          </tr>
        </tfoot>
      </table>
      
      <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        This is an automated notification generated by the SUFIYA HANDLOOM server.
      </p>
    </div>
  `;

  // Save order to Supabase orders table
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error: orderDbErr } = await supabase.from('orders').insert([{
        id: orderId,
        customer_info: customerInfo,
        cart_items: cartItems,
        total_amount: Number(totalAmount),
        status: 'pending',
        created_at: Date.now()
      }]);
      if (orderDbErr) {
        console.warn('Could not save order to Supabase table:', orderDbErr.message);
      } else {
        console.log(`✅ Order ${orderId} permanently recorded in Supabase orders table.`);
      }
    } catch (orderSaveErr) {
      console.warn('Supabase order record error:', orderSaveErr.message);
    }
  }

  // Only try to send email if user has updated the credentials from default placeholder
  const isSmtpConfigured = process.env.SMTP_USER && 
                            process.env.SMTP_USER !== 'your_gmail_here@gmail.com' &&
                            process.env.SMTP_PASS && 
                            process.env.SMTP_PASS !== 'your_gmail_app_password_here';

  if (!isSmtpConfigured) {
    return res.json({
      message: 'Order placed successfully! (Recorded to Supabase; SMTP offline/not configured: logged to server console)',
      orderId,
      logged: true
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Sufiya Handloom Server" <${process.env.SMTP_USER || 'sufiyahandloom0@gmail.com'}>`,
      to: process.env.RECEIVER_EMAIL || 'sufiyahandloom0@gmail.com',
      subject: `New Sufiya Handloom Order - ${customerInfo.name}`,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order Email sent successfully for Order ${orderId}`);
    res.json({ message: 'Order placed successfully! Email sent to Admin.', orderId });
  } catch (error) {
    console.error('Nodemailer error sending email:', error.message);
    res.json({
      message: 'Order placed and recorded successfully, but there was a server error sending the email notification.',
      orderId,
      error: error.message
    });
  }
});

// PROTECTED: Get all orders (for Admin Dashboard)
app.get('/api/orders', authMiddleware, async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data);
    } catch (err) {
      console.warn('Supabase orders fetch error:', err.message);
    }
  }
  res.json([]);
});

// Health check endpoint for Render monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sufiya Handloom API',
    supabaseConnected: isSupabaseConfigured() && !!supabase,
    timestamp: new Date().toISOString()
  });
});

// Root check
app.get('/', (req, res) => {
  res.send('Sufiya Handloom API Server is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
