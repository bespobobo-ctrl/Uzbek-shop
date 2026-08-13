/* ==========================================================================
   UY SHOP - Products Module
   ========================================================================== */

let productsData = [];
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

/**
 * Format currency to Uzbek So'm (UZS)
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

/**
 * Load products from JSON file or fallback array
 */
async function fetchProducts() {
  try {
    const response = await fetch('./data/products.json');
    if (!response.ok) throw new Error('Data fetch failed');
    productsData = await response.json();
  } catch (error) {
    console.warn('Fallback to local array due to fetch error:', error);
  }
  return productsData;
}

/**
 * Filter and sort products based on current state
 */
function getFilteredProducts() {
  return productsData.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (currentSort === 'price-low') return a.price - b.price;
    if (currentSort === 'price-high') return b.price - a.price;
    if (currentSort === 'rating') return b.rating - a.rating;
    return a.id - b.id;
  });
}

/**
 * Render HTML star rating
 */
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '★';
  }
  if (rating % 1 !== 0) starsHtml += '½';
  return `<span class="star-rating">${starsHtml}</span> (${rating})`;
}

/**
 * Render product cards inside grid container
 */
function renderProducts(productsContainerElement) {
  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    productsContainerElement.innerHTML = `
      <div class="no-products">
        <h3>Mahsulotlar topilmadi</h3>
        <p>Qidiruv shartlarini o'zgartirib ko'ring yoki boshqa bo'limni tanlang.</p>
      </div>
    `;
    return;
  }

  productsContainerElement.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category-tag">${product.categoryName}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-meta">
          ${renderStars(product.rating)}
          <span>• ${product.reviews} izoh</span>
        </div>
        <div class="product-footer">
          <div class="price-container">
            <span class="current-price">${formatCurrency(product.price)}</span>
            ${product.oldPrice ? `<span class="old-price">${formatCurrency(product.oldPrice)}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})" title="Savatchaga qo'shish">
            🛒
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Set active category filter
 */
function setCategoryFilter(category) {
  currentCategory = category;
}

/**
 * Set search query
 */
function setSearchFilter(query) {
  searchQuery = query;
}

/**
 * Set sort option
 */
function setSortOption(sortOption) {
  currentSort = sortOption;
}
