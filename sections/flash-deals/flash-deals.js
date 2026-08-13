/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Flash Deals (Kun Taklifi & Super Chegirmalar)
   ========================================================================== */

function initFlashTimer() {
  let hours = 14;
  let minutes = 29;
  let seconds = 49;

  setInterval(() => {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
      if (minutes < 0) {
        minutes = 59;
        hours--;
        if (hours < 0) {
          hours = 23;
        }
      }
    }

    const hEl = document.getElementById('flashTimerHours');
    const mEl = document.getElementById('flashTimerMins');
    const sEl = document.getElementById('flashTimerSecs');

    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function renderFlashDealsSection() {
  const container = document.getElementById('flashDealProductContainer');
  if (!container) return;

  const products = window.allProductsList || [];
  const flashProducts = products.filter(p => p.isFlashDeal || p.oldPrice > p.price);

  const displayList = flashProducts.length > 0 ? flashProducts : products.slice(0, 4);

  container.innerHTML = `
    <div class="flash-deals-grid">
      ${displayList.map(item => {
        const discountPercent = item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 12;
        return `
          <div class="flash-deal-card">
            <div class="flash-card-badge">-${discountPercent}% CHEGIRMA</div>
            <div class="flash-card-actions">
              <button class="card-action-btn" onclick="toggleWishlistById(${item.id})">❤️</button>
              <button class="card-action-btn" onclick="toggleCompareById(${item.id})">⚖️</button>
            </div>
            <img src="${item.image}" alt="${item.name}" class="flash-card-img">
            <div class="flash-card-body">
              <div class="flash-installment-pill">12 oy / ${formatUZS(item.monthlyPrice)} / oy</div>
              <h4 class="flash-card-title">${item.name}</h4>
              <div class="flash-card-rating">★ ${item.rating || 4.9} (${item.reviews || 120} izoh)</div>
              <div class="flash-card-price-row">
                <div>
                  <div class="flash-current-price">${formatUZS(item.price)}</div>
                  <div class="flash-old-price">${formatUZS(item.oldPrice || Math.round(item.price * 1.18))}</div>
                </div>
                <button class="flash-cart-btn" onclick="addToCartById(${item.id})">🛒 Savatchaga</button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Global scope listener
window.renderFlashDealsSection = renderFlashDealsSection;

document.addEventListener('DOMContentLoaded', () => {
  initFlashTimer();
  renderFlashDealsSection();
});
