const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

function isSupabaseConfigured() {
  return (
    !!supabaseUrl &&
    !!supabaseKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseKey.includes('your-supabase')
  );
}

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('✅ Supabase Client initialized successfully with:', supabaseUrl);
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
    supabase = null;
  }
} else {
  console.log('ℹ️ Supabase credentials not set or incomplete. Running in local fallback mode.');
}

module.exports = {
  supabase,
  isSupabaseConfigured,
  bucketName: process.env.SUPABASE_BUCKET || 'product-images'
};
