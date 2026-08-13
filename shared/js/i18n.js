/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Language Switcher (UZ / RU i18n Engine)
   ========================================================================== */

const LANG_STORAGE_KEY = 'texnomart_current_lang';
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'uz';

const translations = {
  uz: {
    "top_stores": "Bizning do'konlarimiz",
    "top_b2b": "Yuridik shaxslar uchun",
    "top_payments": "To'lov usullari",
    "top_callcenter": "Aloqa markazi",
    "catalog_btn": "Catalog",
    "search_placeholder": "Mahsulotlarni qidirish (iPhone, Smart TV, LG muzlatgich)...",
    "nav_wishlist": "Sevimlilar",
    "nav_compare": "Taqqoslash",
    "nav_cart": "Savatcha",
    "nav_login": "Kirish",
    "nav_cabinet": "Kabinet",
    "hero_badge": "0-0-12 MUDDATLI TO'LOV",
    "hero_title": "Barcha Smartfonlar va Texnikalar <span>0% Oldindan To'lov</span> Bilan!",
    "hero_desc": "Texnomart kafolati, bepul yetkazib berish xizmati va hamyonbop 12 oylik to'lov rejasi.",
    "hero_cta": "Xarid Xilishni Boshlash →",
    "card_delivery_title": "Bepul Yetkazib Berish",
    "card_delivery_desc": "O'zbekiston bo'ylab 24 soat ichida yetkazamiz",
    "card_warranty_title": "1 Yillik Rasmiy Kafolat",
    "card_warranty_desc": "Barcha mahsulotlarga to'liq servis kafolati",
    "card_returns_title": "30 Kun Qaytarish Kafolati",
    "card_returns_desc": "Mahsulot yoqmasa 30 kun ichida almashtirish",
    "flash_title": "🔥 Kun Taklifi & Super Chegirmalar",
    "flash_timer_text": "Tugashiga:",
    "cat_all": "Barcha Tovar",
    "cat_smartphones": "📱 Smartfonlar",
    "cat_laptops": "💻 Kompyuterlar",
    "cat_tv": "📺 TV va Audio",
    "cat_appliances": "🧺 Maishiy Texnika",
    "cat_climate": "❄️ Iqlim",
    "sort_label": "Saralash:",
    "sort_default": "Odatiy",
    "sort_price_low": "Narx: Arzondan qimmatga",
    "sort_price_high": "Narx: Qimmatdan arzonga",
    "sort_monthly": "Oylik to'lov bo'yicha",
    "sort_rating": "Reyting bo'yicha",
    "footer_categories": "Kategoriyalar",
    "footer_help": "Mijozlarga Yordam",
    "footer_contact": "Bog'lanish",
    "footer_rights": "© 2026 UzbekShop TexnoMart. Barcha huquqlar himoyalangan."
  },
  ru: {
    "top_stores": "Наши магазины",
    "top_b2b": "Для юридических лиц",
    "top_payments": "Способы оплаты",
    "top_callcenter": "Колл-центр",
    "catalog_btn": "Каталог",
    "search_placeholder": "Поиск товаров (iPhone, Smart TV, холодильники)...",
    "nav_wishlist": "Избранное",
    "nav_compare": "Сравнение",
    "nav_cart": "Корзина",
    "nav_login": "Войти",
    "nav_cabinet": "Кабинет",
    "hero_badge": "0-0-12 РАССРОЧКА",
    "hero_title": "Все Смартфоны и Техника с <span>0% Первоначальным Взносом</span>!",
    "hero_desc": "Гарантия Техномарт, бесплатная доставка и выгодный план рассрочки на 12 месяцев.",
    "hero_cta": "Начать покупки →",
    "card_delivery_title": "Бесплатная Доставка",
    "card_delivery_desc": "Доставим по всему Узбекистану в течение 24 часов",
    "card_warranty_title": "1 Год Официальной Гарантии",
    "card_warranty_desc": "Полное сервисное обслуживание на все товары",
    "card_returns_title": "30 Дней Гарантии Возврата",
    "card_returns_desc": "Обмен или возврат в течение 30 дней",
    "flash_title": "🔥 Предложение дня и Супер Скидки",
    "flash_timer_text": "До конца:",
    "cat_all": "Все товары",
    "cat_smartphones": "📱 Смартфоны",
    "cat_laptops": "💻 Компьютеры",
    "cat_tv": "📺 ТВ и Аудио",
    "cat_appliances": "🧺 Бытовая техника",
    "cat_climate": "❄️ Климат",
    "sort_label": "Сортировка:",
    "sort_default": "По умолчанию",
    "sort_price_low": "Сначала дешевле",
    "sort_price_high": "Сначала дороже",
    "sort_monthly": "По ежемесячному платежу",
    "sort_rating": "По рейтингу",
    "footer_categories": "Категории",
    "footer_help": "Помощь покупателям",
    "footer_contact": "Контакты",
    "footer_rights": "© 2026 UzbekShop TexnoMart. Все права защищены."
  }
};

/**
 * Toggle Language UZ <-> RU
 */
function toggleLanguage() {
  currentLang = currentLang === 'uz' ? 'ru' : 'uz';
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  applyLanguage(currentLang);
  showToast(currentLang === 'uz' ? "Til O'zbekchaga o'zgartirildi 🇺🇿" : "Язык изменен на Русский 🇷🇺", 'info');
}

/**
 * Apply selected language to page elements
 */
function applyLanguage(lang) {
  const dict = translations[lang] || translations.uz;

  // Update Language Button Text
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.textContent = lang === 'uz' ? "O'Z / РУ" : "РУ / O'Z";
  });

  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);

  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', toggleLanguage);
  });
});
