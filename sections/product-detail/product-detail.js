/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Product Detail Modal & Installment Selector
   ========================================================================== */

let selectedInstallmentMonths = 12;

function openProductDetailModal(productId) {
  const products = window.allProductsList || [];
  const item = products.find(p => p.id === productId);
  if (!item) return;

  selectedInstallmentMonths = 12;
  const modal = document.getElementById('productDetailModalOverlay');
  const container = document.getElementById('productDetailModalContent');
  if (!modal || !container) return;

  const oldPriceHTML = item.oldPrice ? `<div class="detail-old-price">${formatUZS(item.oldPrice)}</div>` : '';

  container.innerHTML = `
    <div class="product-detail-grid">
      <!-- Gallery Column -->
      <div class="product-detail-gallery">
        <div class="main-detail-img-box">
          <img src="${item.image}" alt="${item.name}">
        </div>
      </div>

      <!-- Information Column -->
      <div class="product-detail-info">
        <h2 class="product-detail-title">${item.name}</h2>
        
        <div class="product-detail-meta">
          <span>⭐ ${item.rating || 4.9} (${item.reviews || 128} ta izoh)</span>
          <span>• Bo'lim: <b>${item.categoryName || 'Elektronika'}</b></span>
          <span class="stock-status-pill">✅ Omborda mavjud</span>
        </div>

        <!-- Price Display -->
        <div class="detail-price-box">
          <div class="detail-current-price">${formatUZS(item.price)}</div>
          ${oldPriceHTML}
        </div>

        <!-- Interactive Installment Calculator -->
        <div class="installment-calculator-box">
          <h5>⚡ Muddatli to'lov muddatini tanlang (0% Oldindan to'lov):</h5>
          <div class="installment-months-grid">
            <div class="installment-month-btn" onclick="selectInstallmentMonth(this, ${item.price}, 3)">
              <div class="m-title">3 OY</div>
              <div class="m-price">${formatUZS(Math.round(item.price / 3))}</div>
            </div>
            <div class="installment-month-btn" onclick="selectInstallmentMonth(this, ${item.price}, 6)">
              <div class="m-title">6 OY</div>
              <div class="m-price">${formatUZS(Math.round(item.price / 6))}</div>
            </div>
            <div class="installment-month-btn active" onclick="selectInstallmentMonth(this, ${item.price}, 12)">
              <div class="m-title">12 OY</div>
              <div class="m-price">${formatUZS(Math.round(item.price / 12))}</div>
            </div>
            <div class="installment-month-btn" onclick="selectInstallmentMonth(this, ${item.price}, 24)">
              <div class="m-title">24 OY</div>
              <div class="m-price">${formatUZS(Math.round(item.price / 24))}</div>
            </div>
          </div>
          <div id="selectedPlanHint" style="font-size:0.8rem; color:#b45309; font-weight:700; margin-top:0.6rem; text-align:center;">
            Tanlangan reja: 12 oyga oyiga ${formatUZS(Math.round(item.price / 12))} dan
          </div>
        </div>

        <!-- Specifications Table -->
        <table class="specs-table">
          <tbody>
            <tr>
              <td>Brend:</td>
              <td>${item.brand || 'UzbekShop Guarantee'}</td>
            </tr>
            <tr>
              <td>Rasmiy Kafolat:</td>
              <td>1 Yil Servis Kafolati</td>
            </tr>
            <tr>
              <td>Yetkazib Berish:</td>
              <td>Bepul (24 soat ichida)</td>
            </tr>
            <tr>
              <td>Mahsulot kodi (SKU):</td>
              <td>#TM-${item.id}</td>
            </tr>
          </tbody>
        </table>

        <!-- Actions Row -->
        <div class="detail-actions-row">
          <button class="detail-add-cart-btn" onclick="addCustomInstallmentToCart(${item.id})">🛒 Savatchaga Qo'shish</button>
          <button class="detail-icon-action-btn" onclick="toggleWishlistById(${item.id})">❤️</button>
          <button class="detail-icon-action-btn" onclick="toggleCompareById(${item.id})">⚖️</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

window.selectInstallmentMonth = function(btnElement, totalPrice, months) {
  const container = btnElement.parentElement;
  container.querySelectorAll('.installment-month-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  selectedInstallmentMonths = months;

  const monthlyPrice = Math.round(totalPrice / months);
  const hint = document.getElementById('selectedPlanHint');
  if (hint) {
    hint.textContent = `Tanlangan reja: ${months} oyga oyiga ${formatUZS(monthlyPrice)} dan`;
  }
  showToast(`${months} oylik muddatli to'lov rejasi tanlandi!`, 'info');
};

window.addCustomInstallmentToCart = function(productId) {
  addToCartById(productId);
  closeProductDetailModal();
};

function closeProductDetailModal() {
  const modal = document.getElementById('productDetailModalOverlay');
  if (modal) modal.classList.remove('active');
}

// Attach to window
window.openProductDetailModal = openProductDetailModal;
window.closeProductDetailModal = closeProductDetailModal;

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeProductDetailBtn');
  const overlay = document.getElementById('productDetailModalOverlay');

  if (closeBtn) closeBtn.addEventListener('click', closeProductDetailModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeProductDetailModal();
    });
  }
});
