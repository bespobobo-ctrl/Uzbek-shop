/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Checkout Modal & Direct Telegram Dispatcher
   ========================================================================== */

window.openCheckoutModal = function() {
  const modal = document.getElementById('checkoutModalOverlay');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);

    // Calculate cart total inside checkout
    let cart = [];
    try {
      cart = (window.getStorageData ? window.getStorageData('cart') : JSON.parse(localStorage.getItem('texnomart_cart'))) || [];
    } catch(e) { cart = []; }

    let total = 0;
    cart.forEach(item => { total += ((item.price || 0) * (item.qty || 1)); });

    const totalDisplay = document.getElementById('checkoutOrderTotalDisplay');
    if (totalDisplay) {
      totalDisplay.textContent = (typeof formatUZS === 'function') ? formatUZS(total) : total.toLocaleString('uz-UZ') + " so'm";
    }
  }
};

window.closeCheckoutModal = function() {
  const modal = document.getElementById('checkoutModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 250);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tmCheckoutForm');
  const cancelBtn = document.getElementById('cancelCheckoutBtn');

  if (cancelBtn) cancelBtn.addEventListener('click', closeCheckoutModal);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // EXACT USER TYPED VALUES
      const name = (document.getElementById('checkoutName')?.value || '').trim();
      const phone = (document.getElementById('checkoutPhone')?.value || '').trim();
      const address = (document.getElementById('checkoutAddress')?.value || '').trim();
      const paymentType = document.getElementById('checkoutPaymentType')?.value || 'cash';

      if (!name || !phone || !address) {
        if (window.showToast) showToast('Iltimos, ismingiz, telefoningiz va manzilingizni to\'liq kiriting!', 'danger');
        return;
      }

      // Get exact cart items
      let cart = [];
      try {
        cart = (window.getStorageData ? window.getStorageData('cart') : JSON.parse(localStorage.getItem('texnomart_cart'))) || [];
      } catch(e) { cart = []; }

      let total = 0;
      cart.forEach(item => { total += ((item.price || 0) * (item.qty || 1)); });

      // If cart is empty, fallback to catalog featured product or warn
      if (!cart || cart.length === 0) {
        const catalogProducts = window.allProductsList || [];
        const sampleProd = catalogProducts[0] || { name: "Tanlangan Mahsulot", price: 14200000 };
        cart = [{ id: sampleProd.id, name: sampleProd.name, qty: 1, price: sampleProd.price }];
        total = sampleProd.price;
      }

      const newOrderId = Math.floor(1000 + Math.random() * 9000);
      const paymentLabels = {
        cash: '💵 Eshik oldida naqd yoki karta',
        installment: '📄 12 oyga bo\'lib to\'lash',
        online: '💳 Click / Payme'
      };

      const orderData = {
        id: newOrderId,
        customer: name,
        phone: phone,
        address: address,
        paymentType: paymentLabels[paymentType] || paymentType,
        items: cart,
        amount: total,
        total: total,
        date: new Date().toISOString().split('T')[0],
        status: "Yetkazilmoqda",
        statusType: "warning"
      };

      // 1. Dispatch exact user values to Telegram Bot API (@Yordamchishop_bot)
      if (window.notifyTelegramNewOrder) {
        await window.notifyTelegramNewOrder(orderData);
      } else if (window.sendOrderToTelegramBot) {
        await window.sendOrderToTelegramBot(orderData);
      }

      // 2. Push exact user values to Admin Orders List (texnomart_orders)
      let existingOrders = [];
      try {
        existingOrders = JSON.parse(localStorage.getItem('texnomart_orders')) || [];
      } catch(e) { existingOrders = []; }

      existingOrders.unshift({
        id: newOrderId,
        customer: name,
        phone: phone,
        address: address,
        product: cart.map(i => `${i.name} (${i.qty}x)`).join(', '),
        amount: total,
        date: new Date().toISOString().split('T')[0],
        status: "Yetkazilmoqda",
        statusType: "warning"
      });

      localStorage.setItem('texnomart_orders', JSON.stringify(existingOrders));

      if (window.showToast) {
        showToast(`Rahmat, ${name}! #${newOrderId}-sonli buyurtmangiz Telegram boti va tizimga yuborildi! 📲`, 'success');
      }

      if (window.clearCart) window.clearCart();
      closeCheckoutModal();
      form.reset();
    });
  }
});
