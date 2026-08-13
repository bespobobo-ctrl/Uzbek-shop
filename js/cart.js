/* ==========================================================================
   UY SHOP - Cart Manager
   ========================================================================== */

const CART_STORAGE_KEY = 'uyshop_cart_items';
let cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

/**
 * Save current cart state to LocalStorage
 */
function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  updateCartBadge();
}

/**
 * Add product to cart
 */
function addToCart(product) {
  const existing = cartItems.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  saveCart();
  renderCartItems();
}

/**
 * Remove product from cart
 */
function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  saveCart();
  renderCartItems();
}

/**
 * Change quantity of an item
 */
function updateQuantity(productId, delta) {
  const item = cartItems.find(item => item.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    renderCartItems();
  }
}

/**
 * Clear all items in cart
 */
function clearCart() {
  cartItems = [];
  saveCart();
  renderCartItems();
}

/**
 * Calculate total quantity of items
 */
function getCartCount() {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculate subtotal price
 */
function getCartTotal() {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Update total item count on header badge
 */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = getCartCount();
  }
}

/**
 * Render items inside cart drawer
 */
function renderCartItems() {
  const cartContainer = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');

  if (!cartContainer) return;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🛒</div>
        <h3>Savatchangiz bo'sh</h3>
        <p>Xarid qilishni boshlash uchun mahsulot tanlang</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(0);
    if (cartTotalEl) cartTotalEl.textContent = formatCurrency(0);
    return;
  }

  cartContainer.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
        <div class="cart-quantity-controls">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="O'chirish">✕</button>
    </div>
  `).join('');

  const total = getCartTotal();
  if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(total);
  if (cartTotalEl) cartTotalEl.textContent = formatCurrency(total);
}
