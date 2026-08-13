/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Catalog Component & Data Manager
   ========================================================================== */

const PRODUCTS_STORAGE_KEY = 'texnomart_all_products';

const fallbackProductsData = [
  { id: 101, name: "Smartfon Apple iPhone 15 Pro 128GB Natural Titanium", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Apple", price: 14200000, oldPrice: 15800000, monthlyPrice: 1450000, stock: 12, rating: 4.9, reviews: 128, badge: "SUPER NARX", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "A17 Pro chip, Titanium korpus, 48 MP Action kamera va Dynamic Island." },
  { id: 102, name: "Smartfon Samsung Galaxy S24 Ultra 12/512GB Titanium Black", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Samsung", price: 15900000, oldPrice: 17200000, monthlyPrice: 1620000, stock: 8, rating: 4.9, reviews: 94, badge: "0-0-12", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Galaxy AI imkoniyatlari, 200MP kamera va Snapdragon 8 Gen 3." },
  { id: 103, name: "Noutbuk Apple MacBook Air 13 M2 8/256GB Midnight", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "Apple", price: 12800000, oldPrice: 14100000, monthlyPrice: 1290000, stock: 5, rating: 4.8, reviews: 65, badge: "HIT SOTUV", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "M2 protsessor, Liquid Retina ekrani va ingichka dizayn." },
  { id: 104, name: "Noutbuk ASUS TUF Gaming F15 i5-12500H RTX 3050 16GB", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "ASUS", price: 9800000, oldPrice: 10900000, monthlyPrice: 990000, stock: 14, rating: 4.7, reviews: 42, badge: "AKSIYA", badgeColor: "red", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Kuchli o'yin noutbuki, 144Hz IPS ekran va harbiylarcha baquvvat korpus." },
  { id: 105, name: "Televizor Artel 55AU90G 4K UHD Smart Android TV", category: "tv-audio", categoryName: "TV va Audio", brand: "Artel", price: 4800000, oldPrice: 5300000, monthlyPrice: 490000, stock: 20, rating: 4.6, reviews: 88, badge: "0% TO'LOV", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "55 dyuymli 4K UHD tasvirlash va Android TV." },
  { id: 106, name: "Muzlatgich LG GR-B569BLCZ No Frost Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "LG", price: 8600000, oldPrice: 9400000, monthlyPrice: 870000, stock: 7, rating: 4.9, reviews: 31, badge: "TOP KAFOLAT", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Smart Inverter kompressor, Total No Frost va A++ sinf." },
  { id: 107, name: "Kir yuvish mashinasi Bosch WAN24200ME 8 kg Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "Bosch", price: 6200000, oldPrice: 6900000, monthlyPrice: 630000, stock: 3, rating: 4.9, reviews: 56, badge: "GERMAN QUALITY", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "EcoSilence Drive vositasi va gigiyenik bug'da yuvish." },
  { id: 108, name: "Konditsioner Haier Tundra Inverter 12 HSU-12H", category: "iqlim", categoryName: "Iqlim texnikasi", brand: "Haier", price: 4300000, oldPrice: 4800000, monthlyPrice: 440000, stock: 18, rating: 4.7, reviews: 29, badge: "BEPUL O'RNATISH", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1631545806604-e34988f57fa5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Inverter dvigatel va jim ishlash rejimi." }
];

// Synchronously initialize window.allProductsList immediately (never empty!)
window.allProductsList = (function() {
  try {
    var stored = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY));
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
  } catch(e) {}
  return JSON.parse(JSON.stringify(fallbackProductsData));
})();

let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentSortOrder = 'default';

async function initCatalogData() {
  try {
    // Try loading fresh json from server
    try {
      const res = await fetch('./data/products.json');
      if (res.ok) {
        const fetchedData = await res.json();
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          // Merge with any custom stock/price values from localStorage
          const localMap = {};
          (window.allProductsList || []).forEach(p => { localMap[p.id] = p; });
          
          window.allProductsList = fetchedData.map(p => {
            if (localMap[p.id]) {
              return { ...p, ...localMap[p.id] };
            }
            return p;
          });
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
        }
      }
    } catch (e) {
      console.warn('Network fetch for products.json skipped, using local data');
    }

    // Ensure stock on all items
    window.allProductsList.forEach(p => { if (typeof p.stock !== 'number') p.stock = 10; });

    renderCatalogGrid();
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    if (window.renderAdminDashboardTabs) window.renderAdminDashboardTabs();
  } catch (err) {
    console.error('Catalog init error:', err);
  }
}

window.saveProductsToStorage = function() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
};

function getFilteredProductsList() {
  return (window.allProductsList || []).filter(item => {
    const matchCat = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;
    const matchSearch = item.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                        (item.description && item.description.toLowerCase().includes(currentSearchQuery.toLowerCase()));
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (currentSortOrder === 'price-low') return a.price - b.price;
    if (currentSortOrder === 'price-high') return b.price - a.price;
    if (currentSortOrder === 'monthly') return a.monthlyPrice - b.monthlyPrice;
    if (currentSortOrder === 'rating') return b.rating - a.rating;
    return a.id - b.id;
  });
}

function renderCatalogGrid() {
  const container = document.getElementById('mainProductsGrid');
  if (!container) return;

  const items = getFilteredProductsList();
  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <h3>Mahsulotlar topilmadi</h3>
        <p>Boshqa kategoriya yoki qidiruv so'rovini tanlab ko'ring.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(product => renderSingleProductCardHTML(product)).join('');
}

window.filterProductsBySearch = function(query) {
  currentSearchQuery = query;
  renderCatalogGrid();
};

document.addEventListener('DOMContentLoaded', () => {
  initCatalogData();

  const categoryBtns = document.querySelectorAll('.cat-pill-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.getAttribute('data-cat');
      renderCatalogGrid();
    });
  });

  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortOrder = e.target.value;
      renderCatalogGrid();
    });
  }
});
