/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Supabase Cloud Database Integration SDK
   ========================================================================== */

const SUPABASE_URL = 'https://yttzgafjhujjhwkcmasb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dHpnYWZqaHVqamh3a2NtYXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjI4OTYsImV4cCI6MjEwMjE5ODg5Nn0.v_j4uxRiyox4FrBxPy6Bcmwf4uLqDFCWUWOeMoR9oUs';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dHpnYWZqaHVqamh3a2NtYXNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjYyMjg5NiwiZXhwIjoyMTAyMTk4ODk2fQ.JDShpQHdz7bzm26I3AHsTSA47KUBLPhmJ3woAwBocDY';

window.supabaseClient = null;

// Initialize Supabase JS Client if SDK script is loaded
if (window.supabase && typeof window.supabase.createClient === 'function') {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase Cloud Database Client Initialized 🚀');
}

/**
 * Fetch products from Supabase database
 * Returns array of products or null if table/network not ready
 */
window.fetchSupabaseProducts = async function() {
  if (!window.supabaseClient) return null;
  try {
    const { data, error } = await window.supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.warn('Supabase fetch products warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase products fetch failed:', err.message);
    return null;
  }
};

/**
 * Sync single product upsert (insert or update) to Supabase
 */
window.upsertSupabaseProduct = async function(product) {
  if (!window.supabaseClient) return false;
  try {
    const { error } = await window.supabaseClient
      .from('products')
      .upsert([product]);
    
    if (error) {
      console.warn('Supabase upsert product error:', error.message);
      return false;
    }
    console.log('Supabase product synced ✅:', product.name);
    return true;
  } catch (err) {
    console.warn('Supabase upsert error:', err.message);
    return false;
  }
};

/**
 * Delete product from Supabase
 */
window.deleteSupabaseProduct = async function(productId) {
  if (!window.supabaseClient) return false;
  try {
    const { error } = await window.supabaseClient
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.warn('Supabase delete product error:', error.message);
      return false;
    }
    console.log('Supabase product deleted ✅ ID:', productId);
    return true;
  } catch (err) {
    console.warn('Supabase delete error:', err.message);
    return false;
  }
};

/**
 * Save new order to Supabase
 */
window.saveSupabaseOrder = async function(orderData) {
  if (!window.supabaseClient) return false;
  try {
    const { error } = await window.supabaseClient
      .from('orders')
      .insert([orderData]);
    
    if (error) {
      console.warn('Supabase save order error:', error.message);
      return false;
    }
    console.log('Supabase order saved ✅');
    return true;
  } catch (err) {
    console.warn('Supabase save order error:', err.message);
    return false;
  }
};
