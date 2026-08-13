/* ==========================================================================
   UY SHOP - Application Bootstrapper
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const productsContainer = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const cartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');

  // Load products
  await fetchProducts();
  renderProducts(productsContainer);
  updateCartBadge();
  renderCartItems();

  // Category Filtering
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-category');
      setCategoryFilter(category);
      renderProducts(productsContainer);
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      setSearchFilter(e.target.value);
      renderProducts(productsContainer);
    });
  }

  // Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      setSortOption(e.target.value);
      renderProducts(productsContainer);
    });
  }

  // Cart Drawer Toggles
  if (cartBtn) {
    cartBtn.addEventListener('click', () => toggleCartDrawer(true));
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) toggleCartDrawer(false);
    });
  }

  // Checkout Modal Toggles
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openCheckoutModal);
  }
  if (cancelCheckoutBtn) {
    cancelCheckoutBtn.addEventListener('click', closeCheckoutModal);
  }
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleOrderSubmit);
  }
});

/**
 * Global helper called from inline product card button
 */
function handleAddToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (product) {
    addToCart(product);
    showToast(`"${product.name}" savatchaga qo'shildi!`, "success");
  }
}
