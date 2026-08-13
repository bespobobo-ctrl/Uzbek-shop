/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Checkout Modal & Telegram Dispatcher
   ========================================================================== */

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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('checkoutName').value;
      const phone = document.getElementById('checkoutPhone').value;
      const address = document.getElementById('checkoutAddress').value;
      const paymentType = document.getElementById('checkoutPaymentType').value;

      const cart = window.getStorageData ? window.getStorageData('cart') : [];
      let total = 0;
      cart.forEach(item => { total += (item.price * item.qty); });

      const newOrderId = Math.floor(1000 + Math.random() * 9000);

      const orderData = {
        id: newOrderId,
        customer: name,
        phone: phone,
        address: address,
        paymentType: paymentType,
        items: cart.length > 0 ? cart : [{ name: "Tanlangan Tovar", qty: 1, price: total || 14200000 }],
        amount: total || 14200000,
        total: total || 14200000,
        date: new Date().toISOString().split('T')[0],
        status: "Yetkazilmoqda",
        statusType: "warning"
      };

      // 1. Dispatch to Telegram Bot API
      if (window.sendOrderToTelegramBot) {
        await window.sendOrderToTelegramBot(orderData);
      }

      // 2. Push to Admin Orders List
      let existingOrders = JSON.parse(localStorage.getItem('texnomart_orders')) || [];
      existingOrders.unshift({
        id: newOrderId,
        customer: name,
        phone: phone,
        address: address,
        product: cart.map(i => i.name).join(', ') || "Tovar",
        amount: total || 14200000,
        date: new Date().toISOString().split('T')[0],
        status: "Yetkazilmoqda",
        statusType: "warning"
      });
      localStorage.setItem('texnomart_orders', JSON.stringify(existingOrders));

      showToast(`Rahmat, ${name}! #${newOrderId}-sonli buyurtmangiz Telegram boti va tizimga yuborildi! 📲`, 'success');

      if (window.clearCart) window.clearCart();
      closeCheckoutModal();
      form.reset();
    });
  }
});
