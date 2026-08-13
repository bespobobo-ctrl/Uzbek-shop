/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Telegram Bot API & Telegram Mini App Integration
   ========================================================================== */

const TELEGRAM_BOT_TOKEN = "8932753943:AAEgaPfDupiUUZRxm4fSkssuN4TPtti1cmo";
const TELEGRAM_CHAT_ID_KEY = "texnomart_telegram_chat_id";

// Initialize Telegram WebApp (Mini App)
function initTelegramMiniApp() {
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Auto-expand full screen on mobile devices
      
      // Adapt header color to Telegram theme
      if (tg.themeParams && tg.themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg', tg.themeParams.bg_color);
      }
      
      // Auto-fill customer info if available from Telegram profile
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        const nameInput = document.getElementById('checkoutName');
        if (nameInput && !nameInput.value) {
          nameInput.value = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        }
      }
    } catch (e) {
      console.log('Telegram WebApp Init notice:', e);
    }
  }
}

/**
 * Send New Order Notification to Telegram Bot
 */
async function sendOrderToTelegramBot(orderData) {
  const chatId = localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || "";

  const itemsFormatted = orderData.items.map(item => `• ${item.name} (${item.qty} ta) - ${formatUZS(item.price * item.qty)}`).join('\n');

  const textMessage = `
🛍️ <b>YANGI BUYURTMA #${orderData.id}!</b>

👤 <b>Mijoz:</b> ${orderData.customer}
📞 <b>Telefon:</b> ${orderData.phone}
📍 <b>Manzil:</b> ${orderData.address}
💳 <b>To'lov usuli:</b> ${orderData.paymentType === 'cash' ? "Eshik oldida naqd yoki karta" : orderData.paymentType === 'installment' ? "12 oyga bo'lib to'lash" : "Click / Payme"}

📦 <b>BUYURTMA TARKIBI:</b>
${itemsFormatted}

💰 <b>JAMI SUMMA:</b> <b>${formatUZS(orderData.total)}</b>
⏱️ <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}
  `.trim();

  // If Admin configured Chat ID, send directly via Telegram Bot API
  if (chatId) {
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: textMessage,
          parse_mode: 'HTML'
        })
      });
      console.log('Telegram order notification sent to chat_id:', chatId);
    } catch (err) {
      console.error('Telegram notification fetch error:', err);
    }
  }
}

// Global Exports
window.sendOrderToTelegramBot = sendOrderToTelegramBot;

document.addEventListener('DOMContentLoaded', () => {
  initTelegramMiniApp();
});
