/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Catalog Component & Data Manager (Senior Dev Refactored)
   ========================================================================== */

const PRODUCTS_STORAGE_KEY = 'texnomart_all_products';
window.allProductsList = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY)) || [];

let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentSortOrder = 'default';

const fallbackProductsData = [
  { id: 101, name: "Smartfon Apple iPhone 15 Pro 128GB Natural Titanium", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Apple", price: 14200000, oldPrice: 15800000, monthlyPrice: 1450000, rating: 4.9, reviews: 128, badge: "SUPER NARX", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "A17 Pro chip, Titanium korpus, 48 MP Action kamera va Dynamic Island." },
  { id: 102, name: "Smartfon Samsung Galaxy S24 Ultra 12/512GB Titanium Black", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Samsung", price: 15900000, oldPrice: 17200000, monthlyPrice: 1620000, rating: 4.9, reviews: 94, badge: "0-0-12", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Galaxy AI imkoniyatlari, 200MP kamera va Snapdragon 8 Gen 3." },
  { id: 103, name: "Noutbuk Apple MacBook Air 13 M2 8/256GB Midnight", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "Apple", price: 12800000, oldPrice: 14100000, monthlyPrice: 1290000, rating: 4.8, reviews: 65, badge: "HIT SOTUV", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "M2 protsessor, Liquid Retina ekrani va ingichka dizayn." },
  { id: 104, name: "Noutbuk ASUS TUF Gaming F15 i5-12500H RTX 3050 16GB", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "ASUS", price: 9800000, oldPrice: 10900000, monthlyPrice: 990000, rating: 4.7, reviews: 42, badge: "AKSIYA", badgeColor: "red", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Kuchli o'yin noutbuki, 144Hz IPS ekran va harbiylarcha baquvvat korpus." }
];

async function initCatalogData() {
  try {
    if (!window.allProductsList || window.allProductsList.length === 0) {
      try {
        const res = await fetch('./data/products.json');
        if (res.ok) {
          window.allProductsList = await res.json();
        } else {
          window.allProductsList = fallbackProductsData;
        }
      } catch (e) {
        window.allProductsList = fallbackProductsData;
      }
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
    }
    renderCatalogGrid();
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  } catch (err) {
    console.error('Catalog init error:', err);
  }
}

window.saveProductsToStorage = function() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
};

function getFilteredProductsList() {
  return window.allProductsList.filter(item => {
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
