/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Dual Telegram Bots Engine
   1-Bot: @Uzbekshoptexnomart_bot (Token: 8932753943:AAEgaPfDupiUUZRxm4fSkssuN4TPtti1cmo)
   2-Bot: @Yordamchishop_bot (Token: 8608763605:AAGKLo260tjBwaty9Q56yOLEAsxRHRgYzXg)
   ========================================================================== */

const TELEGRAM_BOTS = {
  CUSTOMER_BOT: {
    token: '8932753943:AAEgaPfDupiUUZRxm4fSkssuN4TPtti1cmo',
    username: '@Uzbekshoptexnomart_bot',
    name: 'UzbekshopTexnomart'
  },
  ASSISTANT_BOT: {
    token: '8608763605:AAGKLo260tjBwaty9Q56yOLEAsxRHRgYzXg',
    username: '@Yordamchishop_bot',
    name: 'Yordamchishop'
  }
};

// Send Message using specified Bot Token
async function sendTelegramDirect(botToken, chatId, text, replyMarkup = null) {
  if (!chatId) {
    return { ok: false, reason: 'NO_CHAT_ID' };
  }

  try {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    };

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Telegram Send Error:', error);
    return { ok: false, error: error.message };
  }
}

// 1. Dispatch New Order Notification to 2-Bot (@Yordamchishop_bot)
async function notifyTelegramNewOrder(order) {
  if (!order) return;

  const chatId = localStorage.getItem('texnomart_admin_bot_chat_id') || localStorage.getItem('texnomart_telegram_chat_id') || '';
  if (!chatId) return;

  const orderId = order.id || Date.now().toString().slice(-5);
  const customerName = order.customerName || order.customer || order.userName || 'Mijoz';
  const phone = order.phone || order.phoneNumber || '+998 90 000 00 00';
  const address = order.address || order.deliveryAddress || 'Toshkent shahri';
  const paymentMethod = order.paymentType || order.paymentMethod || 'Payme / Naqd';
  const totalSum = (order.amount || order.total || order.totalPrice || 0).toLocaleString('uz-UZ');

  let itemsText = '';
  if (order.items && Array.isArray(order.items) && order.items.length > 0) {
    itemsText = order.items.map((it, idx) => `  ${idx + 1}. <b>${it.name || it.title}</b> (${it.qty || it.quantity || 1}x) - ${(it.price || 0).toLocaleString('uz-UZ')} so'm`).join('\n');
  } else if (order.product) {
    itemsText = `  1. <b>${order.product}</b> (1x) - ${totalSum} so'm`;
  } else {
    itemsText = `  1. Texnomart Mahsulotlari`;
  }

  const message = `
🔔 <b>YANGI BUYURTMA QABUL QILINDI! #UZB-${orderId}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${customerName}
📞 <b>Telefon:</b> <code>${phone}</code>
📍 <b>Manzil:</b> ${address}
💳 <b>To'lov turi:</b> ${paymentMethod}
💰 <b>Jami summa:</b> <b>${totalSum} UZS</b>

📦 <b>Buyurtma tarkibi:</b>
${itemsText}

🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
━━━━━━━━━━━━━━━━━━━━
⚡ <i>Buyurtma holatini Telegram orqali boshqaring:</i>
  `.trim();

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '💳 To\'lovni Tasdiqlash', callback_data: `confirm_pay_${orderId}` },
        { text: '🚚 Kuryerga Topshirish', callback_data: `deliver_order_${orderId}` }
      ],
      [
        { text: '✅ Yetkazildi (Yakunlash)', callback_data: `completed_order_${orderId}` }
      ]
    ]
  };

  return await sendTelegramDirect(TELEGRAM_BOTS.ASSISTANT_BOT.token, chatId, message, inlineKeyboard);
}

// 2. Send 2FA SMS Security Code via 2-Bot (@Yordamchishop_bot)
async function sendTelegramSmsSecurityCode(phone, code) {
  const chatId = localStorage.getItem('texnomart_admin_bot_chat_id') || localStorage.getItem('texnomart_telegram_chat_id') || '';
  if (!chatId) return;

  const message = `
🔐 <b>UZBEKSHOP XAVFSIZLIK TASDIQLASH KODI</b>
━━━━━━━━━━━━━━━━━━━━
📞 <b>Admin raqami:</b> <code>${phone}</code>
⚡ <b>Tasdiqlash kodi:</b> <code>${code}</code>

⚠️ <i>Ushbu bir martalik kod barcha ma'lumotlarni o'chirish (Factory Reset) uchun yuborildi. Kodni begonalarga bermang!</i>
🕒 <b>Amal qilish muddati:</b> 60 soniya
  `.trim();

  return await sendTelegramDirect(TELEGRAM_BOTS.ASSISTANT_BOT.token, chatId, message);
}

// Global Exports
window.TELEGRAM_BOTS = TELEGRAM_BOTS;
window.sendTelegramDirect = sendTelegramDirect;
window.notifyTelegramNewOrder = notifyTelegramNewOrder;
window.sendTelegramSmsSecurityCode = sendTelegramSmsSecurityCode;
