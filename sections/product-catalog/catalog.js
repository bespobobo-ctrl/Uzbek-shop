/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Catalog Component & Data Manager
   ========================================================================== */

const PRODUCTS_STORAGE_KEY = 'texnomart_all_products';
window.allProductsList = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY)) || [];

let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentSortOrder = 'default';

async function initCatalogData() {
  try {
    if (!window.allProductsList || window.allProductsList.length === 0) {
      const res = await fetch('./data/products.json');
      window.allProductsList = await res.json();
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
    }
    renderCatalogGrid();
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  } catch (err) {
    console.error('Catalog fetch error:', err);
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
