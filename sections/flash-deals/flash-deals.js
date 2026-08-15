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

  let products = [];
  try {
    const raw = localStorage.getItem('texnomart_all_products');
    products = (raw !== null) ? JSON.parse(raw) : (window.allProductsList || []);
  } catch(e) {
    products = window.allProductsList || [];
  }

  // STRICT 100% MATCH: Only show products that have isFlashDeal === true (configured in Admin Panel)
  const flashProducts = products.filter(p => p.isFlashDeal === true);

  if (!flashProducts || flashProducts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1.5rem; background:#ffffff; border-radius:18px; border:1.5px dashed #cbd5e1; grid-column:1/-1;">
        <span style="font-size:2.5rem; display:block; margin-bottom:0.5rem;">🔥</span>
        <h4 style="font-weight:800; font-size:1.15rem; color:#0f172a; margin-bottom:0.25rem;">Hozircha kunlik maxsus chegirmalar yangilanmoqda</h4>
        <p style="color:#64748b; font-size:0.88rem;">Admin panel orqali yangi tovarlar chegirmaga qo'shilganda bu yerda avtomatik aks etadi.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="flash-deals-grid">
      ${flashProducts.map(item => {
        const discountPercent = item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 15;
        const monthly = item.monthlyPrice || Math.round(item.price / 12);
        return `
          <div class="flash-deal-card">
            <div class="flash-card-badge">-${discountPercent}% CHEGIRMA</div>
            <div class="flash-card-actions">
              <button class="card-action-btn" onclick="toggleWishlistById(${item.id})">❤️</button>
              <button class="card-action-btn" onclick="toggleCompareById(${item.id})">⚖️</button>
            </div>
            <img src="${item.image}" alt="${item.name}" class="flash-card-img" onerror="this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'">
            <div class="flash-card-body">
              <div class="flash-installment-pill">12 oy / ${(typeof formatUZS === 'function' ? formatUZS(monthly) : monthly.toLocaleString('uz-UZ') + " so'm")} / oy</div>
              <h4 class="flash-card-title">${item.name}</h4>
              <div class="flash-card-rating">★ ${item.rating || 4.9} (${item.reviews || 120} izoh)</div>
              <div class="flash-card-price-row">
                <div>
                  <div class="flash-current-price">${(typeof formatUZS === 'function' ? formatUZS(item.price) : item.price.toLocaleString('uz-UZ') + " so'm")}</div>
                  <div class="flash-old-price">${(typeof formatUZS === 'function' ? formatUZS(item.oldPrice || Math.round(item.price * 1.18)) : (item.oldPrice || Math.round(item.price * 1.18)).toLocaleString('uz-UZ') + " so'm")}</div>
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
