/* Cart Drawer Component Logic */

function toggleCartDrawer(open) {
  const overlay = document.getElementById('cartDrawerOverlay');
  if (overlay) {
    if (open) {
      overlay.classList.add('active');
      window.renderCartDrawer();
    } else {
      overlay.classList.remove('active');
    }
  }
}

window.renderCartDrawer = function() {
  const listEl = document.getElementById('cartDrawerItemsList');
  const subtotalEl = document.getElementById('cartDrawerSubtotal');
  const totalEl = document.getElementById('cartDrawerTotal');

  if (!listEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
        <div style="font-size:3rem; margin-bottom:1rem;">🛒</div>
        <h3>Savatchangiz bo'sh</h3>
        <p>Katalogga o'tib mahsulot tanlang</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatUZS(0);
    if (totalEl) totalEl.textContent = formatUZS(0);
    return;
  }

  listEl.innerHTML = cart.map(item => `
    <div class="cart-drawer-item">
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1;">
        <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.25rem;">${item.name}</div>
        <div style="color:var(--tm-dark); font-weight:800; font-size:0.9rem; margin-bottom:0.4rem;">${formatUZS(item.price)}</div>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <button style="background:var(--bg-alt); padding:2px 8px; border-radius:4px; font-weight:800;" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span style="font-weight:700; min-width:20px; text-align:center;">${item.quantity}</span>
          <button style="background:var(--bg-alt); padding:2px 8px; border-radius:4px; font-weight:800;" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button style="color:var(--text-light); font-size:1.2rem;" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  if (subtotalEl) subtotalEl.textContent = formatUZS(total);
  if (totalEl) totalEl.textContent = formatUZS(total);
};

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openCartBtn');
  const closeBtn = document.getElementById('closeCartDrawerBtn');
  const overlay = document.getElementById('cartDrawerOverlay');
  const checkoutBtn = document.getElementById('cartDrawerCheckoutBtn');

  if (openBtn) openBtn.addEventListener('click', () => toggleCartDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleCartDrawer(false));
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) toggleCartDrawer(false);
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (getCart().length === 0) {
        showToast("Savatchangiz bo'sh!", "warning");
        return;
      }
      toggleCartDrawer(false);
      if (window.openCheckoutModal) window.openCheckoutModal();
    });
  }
});
