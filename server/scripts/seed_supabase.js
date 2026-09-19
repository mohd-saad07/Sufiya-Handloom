const fs = require('fs');
const path = require('path');
const { supabase, isSupabaseConfigured } = require('../config/supabase');

async function seed() {
  console.log('🚀 Starting Supabase Data Migration for Sufia Handloom...');

  if (!isSupabaseConfigured() || !supabase) {
    console.error('❌ Supabase is not configured! Please check your SUPABASE_URL and SUPABASE_KEY in server/.env');
    process.exit(1);
  }

  const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
  if (!fs.existsSync(productsFilePath)) {
    console.error('❌ products.json file not found at:', productsFilePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(productsFilePath, 'utf8');
  const products = JSON.parse(raw);

  console.log(`📦 Found ${products.length} products in products.json. Preparing to sync...`);

  const records = products.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description || '',
    price: Number(p.price),
    image_url: p.imageUrl,
    featured: Boolean(p.featured),
    category: p.category || 'General',
    varieties: p.varieties || [],
    created_at: p.createdAt || Date.now()
  }));

  try {
    const { data, error } = await supabase
      .from('products')
      .upsert(records, { onConflict: 'id' });

    if (error) {
      console.error('❌ Error inserting products into Supabase:', error.message);
      console.error('Hint: Make sure you ran server/supabase_schema.sql in the Supabase SQL Editor first!');
      process.exit(1);
    }

    console.log(`✅ Successfully migrated ${records.length} products to Supabase!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

seed();
