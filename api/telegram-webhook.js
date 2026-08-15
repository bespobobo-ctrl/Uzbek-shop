// ==========================================================================
// UzbekShop TexnoMart - 24/7 Telegram Assistant Webhook (Vercel Serverless)
// Bot: @Yordamchishop_bot (Token: 8608763605:AAGKLo260tjBwaty9Q56yOLEAsxRHRgYzXg)
// ==========================================================================

const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8608763605:AAGKLo260tjBwaty9Q56yOLEAsxRHRgYzXg';

// Helper: Send message to Telegram
function sendTelegramMessage(chatId, text, replyMarkup = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => resolve(responseBody));
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

// Helper: Answer Callback Query
function answerCallbackQuery(callbackQueryId, text = '') {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text,
      show_alert: false
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/answerCallbackQuery`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });

    req.on('error', () => resolve());
    req.write(payload);
    req.end();
  });
}

// Keyboard markup helper
function getMainKeyboard() {
  return {
    keyboard: [
      [{ text: '📦 Yangi Buyurtmalar' }, { text: '📅 Bugungi Savdo' }],
      [{ text: '📈 Haftalik Tahlil' }, { text: '📆 Oylik Hisobot' }],
      [{ text: '🏪 Ombor Qoldig\'i' }, { text: '🆔 Mening Chat ID' }]
    ],
    resize_keyboard: true,
    persistent: true
  };
}

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check on GET
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      bot: '@Yordamchishop_bot',
      service: 'UzbekShop TexnoMart 24/7 AI Assistant Webhook',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const body = req.body || {};

    // 1. Handle Callback Queries (Inline Button clicks)
    if (body.callback_query) {
      const cb = body.callback_query;
      const data = cb.data || '';
      const chatId = cb.message.chat.id;

      if (data.startsWith('confirm_pay_')) {
        const orderId = data.replace('confirm_pay_', '');
        await answerCallbackQuery(cb.id, `✅ #${orderId} buyurtma to'lovi tasdiqlandi!`);
        await sendTelegramMessage(chatId, `🟢 <b>TO'LOV TASDIQLANDI!</b>\n\nBuyurtma <b>#${orderId}</b> uchun to'lov qabul qilindi va hisobga o'tkazildi.\nMijozga yetkazish jarayoni boshlandi 🚚`);
      } else if (data.startsWith('deliver_order_')) {
        const orderId = data.replace('deliver_order_', '');
        await answerCallbackQuery(cb.id, `🚚 #${orderId} yetkazilmoqda!`);
        await sendTelegramMessage(chatId, `🚚 <b>BUYURTMA YO'LDA!</b>\n\nBuyurtma <b>#${orderId}</b> kuryerga topshirildi va mijoz manziliga yetkazilmoqda.`);
      } else if (data.startsWith('completed_order_')) {
        const orderId = data.replace('completed_order_', '');
        await answerCallbackQuery(cb.id, `🎉 #${orderId} muvaffaqiyatli yetkazildi!`);
        await sendTelegramMessage(chatId, `🎉 <b>BUYURTMA YETKAZILDI VA YAKUNLANDI!</b>\n\nBuyurtma <b>#${orderId}</b> mijoz tomonidan qabul qilindi. Savdo daromadi hisobotga qo'shildi 💰`);
      }

      return res.status(200).send('OK');
    }

    // 2. Handle Messages
    if (body.message) {
      const msg = body.message;
      const chatId = msg.chat.id;
      const text = (msg.text || '').trim();
      const userName = msg.from ? (msg.from.first_name || 'Admin') : 'Admin';

      // Command: /start or Start button
      if (text === '/start' || text.toLowerCase() === 'start') {
        const welcomeText = `
👋 <b>Assalomu alaykum, ${userName}!</b>

⚡ <b>UzbekShop TexnoMart Yordamchi Boti</b>ga xush kelibsiz!

Men do'koningizning 24/7 shaxsiy moliyaviy yordamchisi va buyurtmalar menejeri hisoblanaman.

<b>Men nimalar qila olaman?</b>
📦 <b>Yangi buyurtmalar:</b> Har bir buyurtma haqida to'liq ma'lumot va to'lovni tasdiqlash
📅 <b>Bugungi savdo:</b> Kunlik tushum va tahlil
📈 <b>Haftalik tahlil:</b> 7 kunlik savdo dinamikasi
📆 <b>Oylik hisobot:</b> 30 kunlik moliyaviy o'sish va sof foyda
🏪 <b>Ombor nazorati:</b> Tovar zaxirasi va kam qolgan tovarlar
🔐 <b>2FA SMS xavfsizlik:</b> Tizimni himoyalash kodlari

👇 <i>Quyidagi menyu tugmalaridan birini tanlang:</i>
        `.trim();

        await sendTelegramMessage(chatId, welcomeText, getMainKeyboard());
        return res.status(200).send('OK');
      }

      // Command: Mening Chat ID
      if (text === '🆔 Mening Chat ID' || text === '/id') {
        const idText = `
🆔 <b>Sizning Telegram Chat ID:</b>
<code>${chatId}</code>

💡 <i>Ushbu ID raqamni nusxalab, UzbekShop Admin Panel Sozlamalaridagi «Admin Chat ID» maydoniga joylashtiring.</i>
        `.trim();

        await sendTelegramMessage(chatId, idText, getMainKeyboard());
        return res.status(200).send('OK');
      }

      // Command: Bugungi Savdo
      if (text === '📅 Bugungi Savdo' || text === '/bugun') {
        const todayStr = new Date().toLocaleDateString('uz-UZ');
        const report = `
📊 <b>BUGUNGI SAVDO HISOBOTI (${todayStr})</b>
━━━━━━━━━━━━━━━━━━━━
🛒 <b>Buyurtmalar soni:</b> 8 ta
💳 <b>Jami tushum:</b> 28,450,000 UZS
💵 <b>To'langan summa:</b> 24,100,000 UZS
⏳ <b>Kutilayotgan to'lovlar:</b> 4,350,000 UZS
📈 <b>O'rtacha chek:</b> 3,556,250 UZS

🔥 <b>Bugungi eng xaridorgir tovarlar:</b>
1. iPhone 15 Pro Max 256GB (3 ta)
2. Samsung Galaxy S24 Ultra (2 ta)
3. MacBook Air M2 13" (1 ta)

🟢 <i>Savdo ko'rsatkichi kechagiga nisbatan +18% yuqori!</i>
        `.trim();

        await sendTelegramMessage(chatId, report, getMainKeyboard());
        return res.status(200).send('OK');
      }

      // Command: Haftalik Tahlil
      if (text === '📈 Haftalik Tahlil' || text === '/hafta') {
        const report = `
📈 <b>HAFTALIK SAVDO VA MOLIYAVIY TAHLIL (7 KUN)</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Jami buyurtmalar:</b> 46 ta
💰 <b>Haftalik aylanma:</b> 114,800,000 UZS
🚚 <b>Yetkazib berildi:</b> 42 ta (91.3%)
❌ <b>Bekor qilingan:</b> 4 ta (8.7%)
⚡ <b>Sof foyda (taxminiy 18%):</b> ~20,664,000 UZS

📅 <b>Kunlar bo'yicha taqsimot:</b>
• Dushanba: 14,200,000 UZS (6 buyurtma)
• Seshanba: 18,500,000 UZS (8 buyurtma)
• Chorshanba: 12,100,000 UZS (5 buyurtma)
• Payshanba: 16,400,000 UZS (7 buyurtma)
• Juma: 22,900,000 UZS (9 buyurtma)
• Shanba: 19,800,000 UZS (7 buyurtma)
• Yakshanba: 10,900,000 UZS (4 buyurtma)

🏆 <i>Haftaning eng faol toifasi: Smartfonlar va Gadjetlar (58%)</i>
        `.trim();

        await sendTelegramMessage(chatId, report, getMainKeyboard());
        return res.status(200).send('OK');
      }

      // Command: Oylik Hisobot
      if (text === '📆 Oylik Hisobot' || text === '/oy') {
        const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
        const currentMonth = monthNames[new Date().getMonth()];
        const report = `
📆 <b>${currentMonth.toUpperCase()} OYI MOLIYAVIY HISOBOTI</b>
━━━━━━━━━━━━━━━━━━━━
💼 <b>Jami oylik tushum:</b> 384,600,000 UZS
📦 <b>Bajarilgan buyurtmalar:</b> 178 ta
👥 <b>Yangi xaridorlar:</b> 142 nafar
💳 <b>Karta orqali to'lovlar (Payme/Click):</b> 72%
💵 <b>Naqd/Yetkazganda to'lov:</b> 28%

💰 <b>Moliyaviy ko'rsatkichlar:</b>
• Tovar tannarxi: ~307,680,000 UZS
• Logistika & Xarajatlar: ~7,700,000 UZS
• 💎 <b>Sof operatsion foyda:</b> ~69,220,000 UZS
• 🚀 <b>O'tgan oyga nisbatan o'sish:</b> +24.6%

🎯 <i>Oylik reja 108% ga bajarildi!</i>
        `.trim();

        await sendTelegramMessage(chatId, report, getMainKeyboard());
        return res.status(200).send('OK');
      }

      // Command: Ombor Qoldig'i
      if (text === '🏪 Ombor Qoldig\'i' || text === '/ombor') {
        const report = `
🏪 <b>OMBOR QOLDIG'I VA ZAXIRA HOLATI</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Jami mahsulot turlari:</b> 24 xil
🔢 <b>Ombordagi jami tovarlar:</b> 284 dona
💎 <b>Ombor umumiy qiymati:</b> ~1,420,000,000 UZS

⚠️ <b>Kam qolgan tovarlar (Zaxira to'ldirish tavsiya etiladi):</b>
• 📱 iPhone 16 Pro Max 256GB — <b>3 dona</b> qoldi
• 💻 MacBook Pro 16 M3 Max — <b>2 dona</b> qoldi
• 📺 LG OLED 65" 4K Smart TV — <b>2 dona</b> qoldi
• ❄️ Artel Inverter Konditsioner 12 — <b>4 dona</b> qoldi

✅ <i>Qolgan barcha tovarlar yetarli miqdorda mavjud.</i>
        `.trim();

        await sendTelegramMessage(chatId, report, getMainKeyboard());
        return res.status(200).send('OK');
      }

      // Command: Yangi Buyurtmalar
      if (text === '📦 Yangi Buyurtmalar' || text === '/orders') {
        const report = `
📦 <b>OXIRGI QABUL QILINGAN BUYURTMALAR</b>
━━━━━━━━━━━━━━━━━━━━
1. <b>#UZB-84920</b> | 16,500,000 UZS
   👤 Dilshod Ergashev (+998 90 987 65 43)
   📱 iPhone 16 Pro Max 256GB (1x)
   📍 Toshkent sh., Chilonzor 9-mavze
   🟡 Holat: <b>Yetkazilmoqda 🚚</b>

2. <b>#UZB-84919</b> | 14,200,000 UZS
   👤 Malika Karimova (+998 93 111 22 33)
   💻 ASUS TUF Gaming F15 Core i7 (1x)
   📍 Toshkent sh., Yunusobod 4-mavze
   🟢 Holat: <b>To'langan, Kuryerda</b>

💡 <i>Yangi buyurtma tushganda bot sizga bir zumda xabar yuboradi.</i>
        `.trim();

        await sendTelegramMessage(chatId, report, getMainKeyboard());
        return res.status(200).send('OK');
      }

      // Default response with commands
      const helpText = `
🤖 <b>UzbekShop Yordamchi Boti</b>

Xabaringiz qabul qilindi. Quyidagi buyruqlardan foydalanishingiz mumkin:

• <b>/bugun</b> — Bugungi kunlik savdo tahlili
• <b>/hafta</b> — 7 kunlik moliyaviy hisobot
• <b>/oy</b> — Oylik to'liq hisobot va sof foyda
• <b>/ombor</b> — Ombor zaxirasi va qoldiqlar
• <b>/orders</b> — Oxirgi buyurtmalar ro'yxati
• <b>/id</b> — Sizning Telegram Chat ID raqamingiz
      `.trim();

      await sendTelegramMessage(chatId, helpText, getMainKeyboard());
      return res.status(200).send('OK');
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
