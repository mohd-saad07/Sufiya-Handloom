-- ====================================================================
-- Sufia Handloom Supabase Database Schema
-- Run this script in the Supabase Dashboard -> SQL Editor -> "New Query"
-- ====================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'General',
  varieties JSONB DEFAULT '[]'::jsonb,
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_info JSONB NOT NULL,
  cart_items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Products Table
-- Allow public read access to products
DROP POLICY IF EXISTS "Public can read products" ON public.products;
CREATE POLICY "Public can read products" 
ON public.products 
FOR SELECT 
USING (true);

-- Allow full access for inserts, updates, deletes (service role / authenticated API)
DROP POLICY IF EXISTS "Enable all operations for service role and anon" ON public.products;
CREATE POLICY "Enable all operations for service role and anon" 
ON public.products 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. Policies for Orders Table
-- Allow creation of orders by any user (checkout flow)
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Allow viewing and managing orders
DROP POLICY IF EXISTS "Enable all operations on orders" ON public.orders;
CREATE POLICY "Enable all operations on orders" 
ON public.orders 
FOR ALL 
USING (true)
WITH CHECK (true);

-- ====================================================================
-- 6. Storage Bucket for Uploaded Product Images
-- In Supabase Dashboard -> Storage:
-- 1. Click "New Bucket"
-- 2. Name it: product-images
-- 3. Check "Public bucket" (IMPORTANT so product images can be seen by customers!)
-- 4. Click Save.
-- 
-- Or run the SQL below to automatically create the bucket and public access:
-- ====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to view images in product-images bucket
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Allow inserting images
DROP POLICY IF EXISTS "Allow upload to product images" ON storage.objects;
CREATE POLICY "Allow upload to product images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow updating and deleting images
DROP POLICY IF EXISTS "Allow update and delete product images" ON storage.objects;
CREATE POLICY "Allow update and delete product images"
ON storage.objects
FOR ALL
USING (bucket_id = 'product-images');
