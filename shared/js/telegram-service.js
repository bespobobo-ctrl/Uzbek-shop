/* ==========================================================================
   TEXNOMART / UZBEKSHOP - 24/7 Telegram AI Assistant Service
   Bot: @Yordamchishop_bot (Token: 8608763605:AAGKLo260tjBwaty9Q56yOLEAsxRHRgYzXg)
   ========================================================================== */

const TELEGRAM_CONFIG = {
  BOT_TOKEN: '8608763605:AAGKLo260tjBwaty9Q56yOLEAsxRHRgYzXg',
  BOT_USERNAME: '@Yordamchishop_bot',
  DEFAULT_CHAT_ID: localStorage.getItem('texnomart_admin_bot_chat_id') || localStorage.getItem('texnomart_telegram_chat_id') || ''
};

// Send Raw Message to Telegram
async function sendRawTelegramNotification(text, replyMarkup = null, customChatId = null) {
  const token = localStorage.getItem('texnomart_admin_bot_token') || TELEGRAM_CONFIG.BOT_TOKEN;
  const chatId = customChatId || localStorage.getItem('texnomart_admin_bot_chat_id') || localStorage.getItem('texnomart_telegram_chat_id') || TELEGRAM_CONFIG.DEFAULT_CHAT_ID;

  if (!chatId) {
    console.warn('Telegram Chat ID hali kiritilmagan. Sozlamalar bo\'limidan Chat ID kiriting.');
    return { ok: false, reason: 'NO_CHAT_ID' };
  }

  try {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    };

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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

// 1. Send Rich New Order Notification with Action Buttons
async function notifyTelegramNewOrder(order) {
  if (!order) return;

  const orderId = order.id || Date.now().toString().slice(-5);
  const customerName = order.customerName || order.userName || 'Hurmatli Mijoz';
  const phone = order.phone || order.phoneNumber || '+998 90 000 00 00';
  const address = order.address || order.deliveryAddress || 'Toshkent shahri';
  const paymentMethod = order.paymentMethod || 'Payme / Naqd';
  const totalSum = (order.amount || order.totalPrice || 0).toLocaleString('uz-UZ');

  let itemsText = '';
  if (order.items && Array.isArray(order.items) && order.items.length > 0) {
    itemsText = order.items.map((it, idx) => `  ${idx + 1}. <b>${it.name || it.title}</b> (${it.quantity || 1}x) - ${(it.price || 0).toLocaleString('uz-UZ')} so'm`).join('\n');
  } else if (order.productName) {
    itemsText = `  1. <b>${order.productName}</b> (1x) - ${totalSum} so'm`;
  } else {
    itemsText = `  1. Texnomart Mahsulotlari (Jami)`;
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
⚡ <i>Quyidagi tugmalar orqali buyurtma holatini darhol o'zgartiring:</i>
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

  return await sendRawTelegramNotification(message, inlineKeyboard);
}

// 2. Send 2FA SMS Security Code
async function sendTelegramSmsSecurityCode(phone, code) {
  const message = `
🔐 <b>UZBEKSHOP XAVFSIZLIK TASDIQLASH KODI</b>
━━━━━━━━━━━━━━━━━━━━
📞 <b>Admin raqami:</b> <code>${phone}</code>
⚡ <b>Tasdiqlash kodi:</b> <code>${code}</code>

⚠️ <i>Ushbu bir martalik kod ma'lumotlarni tozalash (Factory Reset) uchun yuborildi. Kodni begonalarga bermang!</i>
🕒 <b>Amal qilish muddati:</b> 60 soniya
  `.trim();

  return await sendRawTelegramNotification(message);
}

// 3. Send Delivery / Status Update
async function notifyTelegramOrderStatus(orderId, newStatus) {
  const statusEmoji = {
    'Yetkazilmoqda': '🚚',
    'Bajarildi': '✅',
    'To\'langan': '💳',
    'Bekor qilindi': '❌'
  };

  const emoji = statusEmoji[newStatus] || '📦';
  const message = `
${emoji} <b>BUYURTMA HOLATI O'ZGARDI!</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Buyurtma ID:</b> #UZB-${orderId}
🟡 <b>Yangi holat:</b> <b>${newStatus}</b>
🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
  `.trim();

  return await sendRawTelegramNotification(message);
}

// Export Globally
window.TELEGRAM_CONFIG = TELEGRAM_CONFIG;
window.notifyTelegramNewOrder = notifyTelegramNewOrder;
window.sendTelegramSmsSecurityCode = sendTelegramSmsSecurityCode;
window.notifyTelegramOrderStatus = notifyTelegramOrderStatus;
window.sendRawTelegramNotification = sendRawTelegramNotification;
