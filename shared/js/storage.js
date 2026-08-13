/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Storage & State Manager
   ========================================================================== */

const STORAGE_KEYS = {
  CART: 'texnomart_cart',
  WISHLIST: 'texnomart_wishlist',
  COMPARE: 'texnomart_compare'
};

function getStorageData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function setStorageData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  updateHeaderBadges();
}

function findProductById(id) {
  if (window.allProductsList && window.allProductsList.length > 0) {
    return window.allProductsList.find(p => p.id === id);
  }
  return null;
}

/* ================= CART OPERATIONS ================= */
function getCart() { return getStorageData(STORAGE_KEYS.CART); }

function addToCart(product) {
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  setStorageData(STORAGE_KEYS.CART, cart);
  showToast(`"${product.name}" savatchaga qo'shildi!`);
}

function addToCartById(id) {
  const p = findProductById(id);
  if (p) addToCart(p);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  setStorageData(STORAGE_KEYS.CART, cart);
  if (window.renderCartDrawer) window.renderCartDrawer();
}

function updateCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    setStorageData(STORAGE_KEYS.CART, cart);
    if (window.renderCartDrawer) window.renderCartDrawer();
  }
}

function clearCart() {
  setStorageData(STORAGE_KEYS.CART, []);
  if (window.renderCartDrawer) window.renderCartDrawer();
}

/* ================= WISHLIST OPERATIONS ================= */
function getWishlist() { return getStorageData(STORAGE_KEYS.WISHLIST); }

function toggleWishlist(product) {
  if (!product) return;
  let wishlist = getWishlist();
  const index = wishlist.findIndex(item => item.id === product.id);
  if (index >= 0) {
    wishlist.splice(index, 1);
    showToast(`"${product.name}" sevimlilardan o'chirildi!`, 'info');
  } else {
    wishlist.push(product);
    showToast(`"${product.name}" sevimlilarga qo'shildi!`);
  }
  setStorageData(STORAGE_KEYS.WISHLIST, wishlist);
  if (window.renderWishlistDrawer) window.renderWishlistDrawer();
}

function toggleWishlistById(id) {
  const p = findProductById(id);
  if (p) toggleWishlist(p);
}

/* ================= COMPARE OPERATIONS ================= */
function getCompare() { return getStorageData(STORAGE_KEYS.COMPARE); }

function toggleCompare(product) {
  if (!product) return;
  let compare = getCompare();
  const index = compare.findIndex(item => item.id === product.id);
  if (index >= 0) {
    compare.splice(index, 1);
    showToast(`"${product.name}" taqqoslashdan olib tashlandi!`, 'info');
  } else {
    if (compare.length >= 4) {
      showToast("Maksimal 4 ta mahsulotni taqqoslash mumkin", "warning");
      return;
    }
    compare.push(product);
    showToast(`"${product.name}" taqqoslashga qo'shildi!`);
  }
  setStorageData(STORAGE_KEYS.COMPARE, compare);
  if (window.renderCompareModal) window.renderCompareModal();
}

function toggleCompareById(id) {
  const p = findProductById(id);
  if (p) toggleCompare(p);
}

function updateHeaderBadges() {
  const cart = getCart();
  const wishlist = getWishlist();
  const compare = getCompare();

  const cartCountEl = document.getElementById('cartBadgeCount');
  const wishlistCountEl = document.getElementById('wishlistBadgeCount');
  const compareCountEl = document.getElementById('compareBadgeCount');

  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCountEl) cartCountEl.textContent = cartTotalQty;
  if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
  if (compareCountEl) compareCountEl.textContent = compare.length;
}

function formatUZS(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderBadges();
});
