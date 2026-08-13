/* ==========================================================================
   UY SHOP - UI Interactions & Notifications
   ========================================================================== */

/**
 * Display toast notification at bottom right
 */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Toggle cart drawer visibility
 */
function toggleCartDrawer(isOpen) {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    if (isOpen) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

/**
 * Open checkout modal
 */
function openCheckoutModal() {
  if (cartItems.length === 0) {
    showToast("Savatchangiz bo'sh. Mahsulot qo'shing!", "danger");
    return;
  }

  toggleCartDrawer(false);
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * Close checkout modal
 */
function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * Process order form submission
 */
function handleOrderSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  if (!name || !phone || !address) {
    showToast("Iltimos, barcha maydonlarni to'ldiring", "danger");
    return;
  }

  // Simulate order creation
  showToast(`Rahmat, ${name}! Buyurtmangiz qabul qilindi. Operator tez orada bog'lanadi.`, "success");
  
  clearCart();
  closeCheckoutModal();
  event.target.reset();
}
