/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Supabase Cloud Database Integration & Sync Engine
   ========================================================================== */

const SUPABASE_URL = 'https://yttzgafjhujjhwkcmasb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dHpnYWZqaHVqamh3a2NtYXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjI4OTYsImV4cCI6MjEwMjE5ODg5Nn0.v_j4uxRiyox4FrBxPy6Bcmwf4uLqDFCWUWOeMoR9oUs';

const SUPABASE_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

/**
 * 1. Fetch latest products from Supabase cloud database
 */
window.fetchSupabaseProducts = async function() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`, {
      method: 'GET',
      headers: SUPABASE_HEADERS
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(`Supabase Cloud: ${data.length} ta mahsulot yuklandi ☁️✅`);
        return data;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch error:', err.message);
  }
  return null;
};

/**
 * 2. Upsert single product (Create or Update) in Supabase cloud
 */
window.upsertSupabaseProduct = async function(product) {
  if (!product || !product.id) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        ...SUPABASE_HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(product)
    });
    if (res.ok || res.status === 201 || res.status === 200 || res.status === 204) {
      console.log(`Supabase: "${product.name}" bulutga saqlandi ✅`);
      return true;
    } else {
      const errTxt = await res.text();
      console.warn('Supabase upsert status:', res.status, errTxt);
    }
  } catch (err) {
    console.warn('Supabase upsert failed:', err.message);
  }
  return false;
};

/**
 * 3. Delete product permanently from Supabase cloud
 */
window.deleteSupabaseProduct = async function(productId) {
  if (!productId) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
      method: 'DELETE',
      headers: SUPABASE_HEADERS
    });
    if (res.ok || res.status === 204 || res.status === 200) {
      console.log(`Supabase: Mahsulot ID #${productId} bulutdan o'chirildi 🗑️✅`);
      return true;
    }
  } catch (err) {
    console.warn('Supabase delete failed:', err.message);
  }
  return false;
};

/**
 * 4. Sync full array of products to Supabase cloud
 */
window.syncAllProductsToSupabase = async function(products) {
  if (!Array.isArray(products) || products.length === 0) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        ...SUPABASE_HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(products)
    });
    if (res.ok || res.status === 201 || res.status === 200 || res.status === 204) {
      console.log(`Supabase: Barcha ${products.length} ta mahsulot bulutga sinxronlandi ☁️🚀`);
      return true;
    }
  } catch (err) {
    console.warn('Supabase bulk sync failed:', err.message);
  }
  return false;
};

/**
 * 5. Pull latest live products from Supabase and update local storage & UI
 */
window.pullLatestFromSupabase = async function() {
  const cloudProducts = await window.fetchSupabaseProducts();
  if (cloudProducts && Array.isArray(cloudProducts) && cloudProducts.length > 0) {
    window.allProductsList = cloudProducts;
    localStorage.setItem('texnomart_all_products', JSON.stringify(cloudProducts));
    if (window.renderCatalogGrid) window.renderCatalogGrid();
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    if (window.renderOmborTab) window.renderOmborTab();
    if (window.renderChegirmaTab) window.renderChegirmaTab();
    if (window.renderAccountingTab) window.renderAccountingTab();
    if (typeof updateSidebarBadges === 'function') updateSidebarBadges();
    return true;
  }
  return false;
};
