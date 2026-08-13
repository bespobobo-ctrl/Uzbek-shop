/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Product Card Component Renderer (Optimized)
   ========================================================================== */

function renderSingleProductCardHTML(product) {
  const badgeHTML = product.badge ? `
    <span class="product-card-badge ${product.badgeColor || 'yellow'}">
      ${product.badge}
    </span>
  ` : '';

  const oldPriceHTML = product.oldPrice ? `
    <span class="old-price">${formatUZS(product.oldPrice)}</span>
  ` : '';

  return `
    <div class="product-card">
      <div class="product-card-image-wrap" onclick="openProductDetailModal(${product.id})">
        ${badgeHTML}
        <div class="card-top-actions">
          <button class="card-action-circle" title="Sevimlilarga qo'shish" onclick="event.stopPropagation(); toggleWishlistById(${product.id})">
            ❤️
          </button>
          <button class="card-action-circle" title="Taqqoslashga qo'shish" onclick="event.stopPropagation(); toggleCompareById(${product.id})">
            ⚖️
          </button>
        </div>
        <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">
      </div>

      <div class="product-card-content">
        <div class="monthly-installment-pill">
          12 oy / ${formatUZS(product.monthlyPrice)} / oy
        </div>

        <h3 class="product-card-title" onclick="openProductDetailModal(${product.id})" style="cursor:pointer;" title="Batafsil ma'lumot olish">
          ${product.name}
        </h3>

        <div class="product-card-rating">
          <span class="stars">★ ${product.rating || 4.9}</span>
          <span class="reviews">(${product.reviews || 45} izoh)</span>
        </div>

        <div class="product-card-bottom-row">
          <div class="price-box">
            <span class="current-price">${formatUZS(product.price)}</span>
            ${oldPriceHTML}
          </div>

          <button class="add-to-cart-yellow-btn" title="Savatchaga qo'shish" onclick="addToCartById(${product.id})">
            🛒
          </button>
        </div>
      </div>
    </div>
  `;
}
