/* Wishlist Component Logic */
function toggleWishlistModal(open) {
  const modal = document.getElementById('wishlistModalOverlay');
  if (modal) {
    if (open) {
      modal.classList.add('active');
      window.renderWishlistDrawer();
    } else {
      modal.classList.remove('active');
    }
  }
}

window.renderWishlistDrawer = function() {
  const container = document.getElementById('wishlistItemsContainer');
  if (!container) return;

  const wishlist = getWishlist();
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--text-muted);">
        ❤️ Sevimlilar ro'yxati bo'sh
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist.map(item => `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 0; border-bottom:1px solid var(--border);">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <img src="${item.image}" style="width:50px; height:50px; border-radius:4px; object-fit:cover;">
        <div>
          <div style="font-weight:700; font-size:0.9rem;">${item.name}</div>
          <div style="font-weight:800; color:var(--tm-dark);">${formatUZS(item.price)}</div>
        </div>
      </div>
      <button class="badge-pill yellow" onclick='addToCart(${JSON.stringify(item).replace(/'/g, "&apos;")})'>🛒 Savatga</button>
    </div>
  `).join('');
};

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openWishlistBtn');
  const closeBtn = document.getElementById('closeWishlistBtn');

  if (openBtn) openBtn.addEventListener('click', () => toggleWishlistModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleWishlistModal(false));
});
