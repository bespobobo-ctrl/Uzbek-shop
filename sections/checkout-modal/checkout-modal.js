/* Checkout Modal Component Logic */
window.openCheckoutModal = function() {
  const modal = document.getElementById('checkoutModalOverlay');
  if (modal) modal.classList.add('active');
};

window.closeCheckoutModal = function() {
  const modal = document.getElementById('checkoutModalOverlay');
  if (modal) modal.classList.remove('active');
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tmCheckoutForm');
  const cancelBtn = document.getElementById('cancelCheckoutBtn');

  if (cancelBtn) cancelBtn.addEventListener('click', closeCheckoutModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('checkoutName').value;
      showToast(`Rahmat, ${name}! Buyurtmangiz Texnomart tomonidan qabul qilindi.`, 'success');
      clearCart();
      closeCheckoutModal();
      form.reset();
    });
  }
});
