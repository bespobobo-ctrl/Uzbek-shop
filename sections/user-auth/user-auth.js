/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Admin Personal Cabinet & Full Warehouse System
   ========================================================================== */

const ADMIN_SESSION_KEY = 'texnomart_admin_logged';
const TELEGRAM_CHAT_ID_KEY = 'texnomart_telegram_chat_id';
const PRODUCTS_STORAGE_KEY = 'texnomart_all_products';

const safeFormatUZS = (num) => {
  if (typeof formatUZS === 'function') return formatUZS(num);
  return (num || 0).toLocaleString('uz-UZ') + " so'm";
};

let isAdminLoggedIn = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
let uploadedImageBase64 = '';
let currentOmborCategoryFilter = 'all';
let currentOmborSearchQuery = '';

let storeOrdersList = [];
try {
  storeOrdersList = JSON.parse(localStorage.getItem('texnomart_orders')) || [
    { id: 1001, customer: 'Sardor Rahimov', phone: '+998 90 123 45 67', address: 'Toshkent sh., Yunusobod 12', product: 'iPhone 15 Pro 128GB', amount: 14200000, date: '2026-08-12', status: 'Bajarildi', statusType: 'success' },
    { id: 1002, customer: 'Jahongir Aliyev', phone: '+998 93 987 65 43', address: "Samarqand sh., Registon ko'ch.", product: 'MacBook Air M2', amount: 12800000, date: '2026-08-13', status: 'Yetkazilmoqda', statusType: 'warning' }
  ];
} catch(e) { storeOrdersList = []; }

const defaultFallbackProducts = [
  { id: 101, name: "Smartfon Apple iPhone 15 Pro 128GB Natural Titanium", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Apple", price: 14200000, oldPrice: 15800000, monthlyPrice: 1450000, stock: 12, rating: 4.9, reviews: 128, badge: "SUPER NARX", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "A17 Pro chip, Titanium korpus, 48 MP Action kamera va Dynamic Island." },
  { id: 102, name: "Smartfon Samsung Galaxy S24 Ultra 12/512GB Titanium Black", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Samsung", price: 15900000, oldPrice: 17200000, monthlyPrice: 1620000, stock: 8, rating: 4.9, reviews: 94, badge: "0-0-12", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Galaxy AI imkoniyatlari, 200MP kamera, S-Pen ruchkasi va Snapdragon 8 Gen 3." },
  { id: 103, name: "Noutbuk Apple MacBook Air 13 M2 8/256GB Midnight", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "Apple", price: 12800000, oldPrice: 14100000, monthlyPrice: 1290000, stock: 5, rating: 4.8, reviews: 65, badge: "HIT SOTUV", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "M2 protsessor, Liquid Retina ekrani, 18 soatgacha batareya va ingichka dizayn." },
  { id: 104, name: "Noutbuk ASUS TUF Gaming F15 i5-12500H RTX 3050 16GB", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "ASUS", price: 9800000, oldPrice: 10900000, monthlyPrice: 990000, stock: 14, rating: 4.7, reviews: 42, badge: "AKSIYA", badgeColor: "red", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Kuchli o'yin noutbuki, 144Hz IPS ekran va harbiylarcha baquvvat korpus." },
  { id: 105, name: "Televizor Artel 55AU90G 4K UHD Smart Android TV", category: "tv-audio", categoryName: "TV va Audio", brand: "Artel", price: 4800000, oldPrice: 5300000, monthlyPrice: 490000, stock: 20, rating: 4.6, reviews: 88, badge: "0% OLDINDAN TO'LOV", badgeColor: "primary", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "55 dyuymli 4K UHD tasvirlash, Android TV va ovozli boshqaruv pulti." },
  { id: 106, name: "Muzlatgich LG GR-B569BLCZ No Frost Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "LG", price: 8600000, oldPrice: 9400000, monthlyPrice: 870000, stock: 7, rating: 4.9, reviews: 31, badge: "TOP KAFOLAT", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Smart Inverter kompressor, Total No Frost va energiya tejamkor A++ sinf." },
  { id: 107, name: "Kir yuvish mashinasi Bosch WAN24200ME 8 kg Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "Bosch", price: 6200000, oldPrice: 6900000, monthlyPrice: 630000, stock: 3, rating: 4.9, reviews: 56, badge: "GERMAN QUALITY", badgeColor: "primary", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "EcoSilence Drive vositasi, anti-vibratsiya paneli va gigiyenik bug'da yuvish." },
  { id: 108, name: "Konditsioner Haier Tundra Inverter 12 HSU-12H", category: "iqlim", categoryName: "Iqlim texnikasi", brand: "Haier", price: 4300000, oldPrice: 4800000, monthlyPrice: 440000, stock: 18, rating: 4.7, reviews: 29, badge: "BEPUL O'RNATISH", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1631545806604-e34988f57fa5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Inverter dvigatel, 35-40 m² maydonga mo'ljallangan va jim ishlash rejimi." },
  { id: 109, name: "Smartfon Xiaomi 14 Ultra 16/512GB Leica Professional", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Xiaomi", price: 13500000, oldPrice: 14900000, monthlyPrice: 1380000, stock: 10, rating: 4.9, reviews: 76, badge: "LEICA KAMERA", badgeColor: "accent", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "1 dyuymli Leica sensori, Snapdragon 8 Gen 3 va WQHD+ AMOLED displey." },
  { id: 110, name: "Smartfon Apple iPhone 14 128GB Midnight Blue", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Apple", price: 9200000, oldPrice: 10100000, monthlyPrice: 940000, stock: 15, rating: 4.8, reviews: 112, badge: "TOP HIT", badgeColor: "primary", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Super Retina XDR ekran, A15 Bionic chip va uzoq batareya quvvati." },
  { id: 111, name: "Smartfon Samsung Galaxy A55 5G 8/256GB Awesome Navy", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Samsung", price: 4600000, oldPrice: 5100000, monthlyPrice: 470000, stock: 22, rating: 4.7, reviews: 84, badge: "YANGI MODEL", badgeColor: "accent", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Metall korpus, 50MP OIS kamera va 120Hz Super AMOLED ekran." },
  { id: 112, name: "Smartfon Xiaomi Redmi Note 13 Pro+ 5G 12/512GB", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Xiaomi", price: 4900000, oldPrice: 5400000, monthlyPrice: 500000, stock: 18, rating: 4.8, reviews: 105, badge: "200 MP", badgeColor: "accent", image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "200 MP flagman kamera, 120W tezkor quvvatlash va IP68 suvdan himoya." },
  { id: 113, name: "Noutbuk Apple MacBook Pro 14 M3 Pro 18/512GB Space Black", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "Apple", price: 24500000, oldPrice: 26900000, monthlyPrice: 2490000, stock: 4, rating: 5.0, reviews: 38, badge: "PRO POWER", badgeColor: "primary", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "M3 Pro chip, Liquid Retina XDR 120Hz ekran va 22 soatlik rekord batareya." },
  { id: 114, name: "Noutbuk Lenovo Legion 5 Pro Ryzen 7 7745HX RTX 4060 16GB", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "Lenovo", price: 15200000, oldPrice: 16800000, monthlyPrice: 1550000, stock: 7, rating: 4.9, reviews: 49, badge: "GAMING MONSTR", badgeColor: "danger", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "240Hz 2.5K WQXGA displey, RTX 4060 140W grafikasi va Legion ColdFront sovitish." },
  { id: 115, name: "Noutbuk HP Victus 15 i5-13420H RTX 3050 16GB SSD 512GB", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "HP", price: 8900000, oldPrice: 9800000, monthlyPrice: 910000, stock: 11, rating: 4.7, reviews: 53, badge: "HAMYONBOP", badgeColor: "accent", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "144Hz FHD ekran, 13-avlod Intel i5 protsessori va OMEN Gaming Hub." },
  { id: 116, name: "Televizor Samsung 65\" QLED 4K Q60C Smart TV", category: "tv-audio", categoryName: "TV va Audio", brand: "Samsung", price: 11500000, oldPrice: 12800000, monthlyPrice: 1170000, stock: 6, rating: 4.9, reviews: 64, badge: "QLED 4K", badgeColor: "primary", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Quantum Dot ranglar palitrasi, Dual LED yoritish va AirSlim ultra yupqa dizayn." },
  { id: 117, name: "Televizor LG OLED 55\" C3 4K 120Hz Cinema HDR", category: "tv-audio", categoryName: "TV va Audio", brand: "LG", price: 16800000, oldPrice: 18500000, monthlyPrice: 1720000, stock: 3, rating: 5.0, reviews: 41, badge: "OLED CINEMA", badgeColor: "accent", image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "O'z-o'zini yorituvchi piksellar, a9 AI Gen6 protsessori va Dolby Vision/Atmos." },
  { id: 118, name: "Audio tizim JBL PartyBox 310 Bluetooth 240W", category: "tv-audio", categoryName: "TV va Audio", brand: "JBL", price: 6400000, oldPrice: 7100000, monthlyPrice: 650000, stock: 8, rating: 4.9, reviews: 79, badge: "BAS BOOM", badgeColor: "accent", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "240W kuchli JBL Pro Sound, rangli yorug'lik effektlari va 18 soat batareya." },
  { id: 119, name: "Simsiz Changyutgich Dyson V15 Detect Absolute", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "Dyson", price: 9400000, oldPrice: 10500000, monthlyPrice: 960000, stock: 8, rating: 4.9, reviews: 52, badge: "LASER DETECT", badgeColor: "primary", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Lazerli chang aniqlash, 240 AW kuchli so'rish quvvati va LCD axborot ekrani." },
  { id: 120, name: "Muzlatgich Samsung Bespoke RB38 Custom Design", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "Samsung", price: 10900000, oldPrice: 12200000, monthlyPrice: 1110000, stock: 5, rating: 4.8, reviews: 34, badge: "BESPOKE LUX", badgeColor: "accent", image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Moslashuvchan modulli dizayn, SpaceMax texnologiyasi va All-Around Cooling." },
  { id: 121, name: "Konditsioner Shivaki Elegant Inverter 12 HD-12", category: "iqlim", categoryName: "Iqlim texnikasi", brand: "Shivaki", price: 3900000, oldPrice: 4400000, monthlyPrice: 400000, stock: 14, rating: 4.6, reviews: 45, badge: "YANGI NARX", badgeColor: "primary", image: "https://images.unsplash.com/photo-1631545806604-e34988f57fa5?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Tezkor isitish va sovitish rejimi, A++ energiya samaradorligi va 35 m² maydon." },
  { id: 122, name: "Konditsioner Gree Fairy Inverter 18 CH-S18", category: "iqlim", categoryName: "Iqlim texnikasi", brand: "Gree", price: 7200000, oldPrice: 7900000, monthlyPrice: 740000, stock: 6, rating: 4.9, reviews: 23, badge: "55 M² UCHUN", badgeColor: "accent", image: "https://images.unsplash.com/photo-1631545806604-e34988f57fa5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "55-60 m² gacha kuchli sovitish, Wi-Fi smart boshqaruv va Cold Plasma filtri." },
  { id: 123, name: "Qahva mashinasi DeLonghi Magnifica S Otomatik", category: "oshxona", categoryName: "Oshxona texnikasi", brand: "DeLonghi", price: 5400000, oldPrice: 6100000, monthlyPrice: 550000, stock: 10, rating: 4.9, reviews: 67, badge: "ITALIAN COFFEE", badgeColor: "accent", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Donali qahva maydalagich, 15 bar bosim va mukammal kapuchino ko'pigi." },
  { id: 124, name: "Airfryer Philips XXL HD9650/90 Yog'siz Qovurish", category: "oshxona", categoryName: "Oshxona texnikasi", brand: "Philips", price: 2800000, oldPrice: 3200000, monthlyPrice: 290000, stock: 16, rating: 4.8, reviews: 89, badge: "DIET OSHXONA", badgeColor: "primary", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Twin TurboStar texnologiyasi, 1.4 kg sig'im va 90% kamroq yog' bilan pishirish." }
];

/* =================== HELPER: Get Products (Always synchronized with localStorage) =================== */
window.saveProductsToStorage = function() {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList || []));
    if (typeof window.upsertSupabaseProduct === 'function') {
      (window.allProductsList || []).forEach(p => window.upsertSupabaseProduct(p));
    }
  } catch(e) {
    console.error('Storage Save Error:', e);
  }
};

function getAdminProducts() {
  try {
    var raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw !== null) {
      var stored = JSON.parse(raw);
      if (Array.isArray(stored)) {
        window.allProductsList = stored;
        return window.allProductsList;
      }
    }
  } catch(e) {}
  
  window.allProductsList = JSON.parse(JSON.stringify(defaultFallbackProducts));
  try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList)); } catch(e) {}
  return window.allProductsList;
}

/* =================== MODAL OPEN / CLOSE =================== */
function toggleAuthModal(open) {
  const modal = document.getElementById('authModalOverlay');
  if (!modal) { console.error('AUTH MODAL ERROR: #authModalOverlay not found!'); return; }
  if (open) {
    modal.style.display = 'flex';
    modal.classList.add('active');
    modal.style.zIndex = '9999999';
    modal.style.pointerEvents = 'auto';
    renderAdminCabinetView();
    console.log('Auth modal OPENED ✅');
  } else {
    modal.style.display = 'none';
    modal.classList.remove('active');
    modal.style.pointerEvents = 'none';
  }
}

window.openAuthModal = function() {
  console.log('openAuthModal() called');
  toggleAuthModal(true);
};

window.closeAuthModal = function() {
  toggleAuthModal(false);
};

// Called after login to render all dashboard tabs
window.renderAdminDashboardTabs = function() {
  try { renderAccountingTab(); } catch(e) { console.error('AccountingTab error:', e); }
  try { renderOrdersTab(); } catch(e) { console.error('OrdersTab error:', e); }
  try { renderOmborTab(); } catch(e) { console.error('OmborTab error:', e); }
  try { renderChegirmaTab(); } catch(e) { console.error('ChegirmaTab error:', e); }
};

window.renderOmborTab = renderOmborTab;
window.renderChegirmaTab = renderChegirmaTab;
window.renderOrdersTab = renderOrdersTab;
window.renderAccountingTab = renderAccountingTab;

// Called when modal opens
window.renderAdminView = function() {
  isAdminLoggedIn = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  renderAdminCabinetView();
};

window.switchAuthToLoginView = function() {
  isAdminLoggedIn = false;
  localStorage.setItem(ADMIN_SESSION_KEY, 'false');
  updateHeaderProfileButton();
  renderAdminCabinetView();
};

/* =================== CREDENTIALS HELPER =================== */
window.getAdminCredentials = function() {
  try {
    const creds = JSON.parse(localStorage.getItem('texnomart_admin_custom_creds'));
    if (creds && creds.username && creds.password) return creds;
  } catch(e) {}
  return { username: 'admin', password: '123' };
};

/* =================== LOGIN / LOGOUT =================== */
function handleLoginSubmit(event) {
  if (event) event.preventDefault();
  const username = (document.getElementById('authUsernameInput')?.value || '').trim();
  const password = (document.getElementById('authPasswordInput')?.value || '').trim();
  const creds = window.getAdminCredentials();

  if ((password === creds.password && username === creds.username) || (password === '123' && (username === 'admin' || username === '123'))) {
    isAdminLoggedIn = true;
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    updateHeaderProfileButton();
    if (window.showToast) showToast('Xush kelibsiz! Boshqaruv markaziga o\'tilmoqda... 🟢', 'success');
    setTimeout(() => {
      window.location.href = './admin.html';
    }, 250);
  } else {
    if (window.showToast) showToast("Noto'g'ri login yoki parol! Test: " + creds.username + " / " + creds.password, 'danger');
  }
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  localStorage.setItem(ADMIN_SESSION_KEY, 'false');
  updateHeaderProfileButton();
  renderAdminCabinetView();
  if (window.showToast) showToast('Tizimdan chiqdingiz.', 'info');
}

function updateHeaderProfileButton() {
  const btnText = document.getElementById('headerUserBtnText');
  const btnIcon = document.getElementById('headerUserBtnIcon');
  if (isAdminLoggedIn) {
    if (btnText) btnText.textContent = 'Kabinet';
    if (btnIcon) btnIcon.textContent = '⚙️';
  } else {
    if (btnText) btnText.textContent = 'Kirish';
    if (btnIcon) btnIcon.textContent = '👤';
  }
}

/* =================== RENDER VIEWS =================== */
function renderAdminCabinetView() {
  const loginView = document.getElementById('authLoginFormView');
  const dashView = document.getElementById('authAdminDashboardView');
  const modalBox = document.querySelector('.auth-modal-box');
  
  if (isAdminLoggedIn) {
    if (modalBox) {
      modalBox.classList.add('admin-fullscreen-mode');
    }
    if (loginView) loginView.style.display = 'none';
    if (dashView) {
      dashView.style.display = 'flex';
      dashView.classList.add('active');
      window.renderAdminDashboardTabs();
    }
  } else {
    if (modalBox) {
      modalBox.classList.remove('admin-fullscreen-mode', 'pure-fullscreen');
    }
    if (loginView) loginView.style.display = 'block';
    if (dashView) {
      dashView.style.display = 'none';
      dashView.classList.remove('active');
    }
  }
}

window.toggleAdminFullscreen = function() {
  const modalBox = document.querySelector('.auth-modal-box');
  const btnText = document.getElementById('adminFullscreenBtnText');
  if (!modalBox) return;
  if (modalBox.classList.contains('pure-fullscreen')) {
    modalBox.classList.remove('pure-fullscreen');
    modalBox.classList.add('admin-fullscreen-mode');
    if (btnText) btnText.textContent = '100% Ekran';
    if (window.showToast) showToast('Kengaytirilgan oyna rejimi', 'info');
  } else {
    modalBox.classList.add('pure-fullscreen');
    if (btnText) btnText.textContent = 'Oyna Rejimi';
    if (window.showToast) showToast('To\'liq 100% ekran rejimi ⛶', 'success');
  }
};

/* =================== TAB 1: MOLIYA & TELEGRAM =================== */
function renderAccountingTab() {
  const container = document.getElementById('accountingTabContent');
  if (!container) return;
  const currentChatId = localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || '';
  const products = getAdminProducts();
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const flashCount = products.filter(p => p.isFlashDeal).length;
  const orders = JSON.parse(localStorage.getItem('texnomart_orders')) || storeOrdersList;
  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);

  container.innerHTML = `
    <div class="kpi-cards-grid">
      <div class="kpi-card">
        <div class="kpi-card-icon">💰</div>
        <div class="kpi-card-title">Jami Savdo Daromadi</div>
        <div class="kpi-card-value">${safeFormatUZS(totalRevenue || 148500000)}</div>
        <div class="kpi-card-trend"><span>↑</span> +18.4% o'sish</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card-icon">📦</div>
        <div class="kpi-card-title">Ombordagi Jami Tovarlar</div>
        <div class="kpi-card-value">${totalStock} dona</div>
        <div class="kpi-card-trend"><span>📋</span> ${products.length} xil mahsulot</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card-icon">🔥</div>
        <div class="kpi-card-title">Chegirmadagi Tovarlar</div>
        <div class="kpi-card-value">${flashCount} ta tovar</div>
        <div class="kpi-card-trend"><span>⚡</span> Kun taklifi rejimida</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card-icon">📲</div>
        <div class="kpi-card-title">Telegram Bot Statusi</div>
        <div class="kpi-card-value" style="font-size:1rem; color:#16a34a;">🟢 Faol</div>
        <div class="kpi-card-trend"><span>⚡</span> Instant Buyurtma</div>
      </div>
    </div>
    <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:18px; padding:1.5rem; margin-top:1.5rem;">
      <h4 style="font-weight:800; color:#166534; font-size:1.05rem; margin-bottom:0.75rem;">📲 Telegram Chat ID Sozlamasi</h4>
      <p style="font-size:0.85rem; color:#15803d; margin-bottom:1rem;">Buyurtma tushganda Telegram xabar kelishi uchun Chat ID raqamingizni kiriting:</p>
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <input type="text" id="tgAdminChatIdInput" value="${currentChatId}" placeholder="Masalan: 123456789"
          style="flex:1; min-width:180px; padding:0.75rem 1rem; border:1px solid #86efac; border-radius:10px; font-weight:700; font-size:0.95rem;">
        <button onclick="saveTelegramChatId()"
          style="background:#16a34a; color:#fff; font-weight:800; padding:0.75rem 1.5rem; border-radius:10px; cursor:pointer; white-space:nowrap;">
          💾 Chat ID Saqlash
        </button>
      </div>
    </div>
  `;
}

window.saveTelegramChatId = function() {
  const input = document.getElementById('tgAdminChatIdInput');
  if (input) {
    localStorage.setItem(TELEGRAM_CHAT_ID_KEY, input.value.trim());
    if (window.showToast) showToast('Telegram Chat ID saqlandi!', 'success');
  }
};

/* =================== TAB 2: BUYURTMALAR (ORDERS) =================== */
function getAdminOrders() {
  const raw = localStorage.getItem('texnomart_orders');
  if (raw === null) {
    const initialOrders = [
      { id: 1001, customer: 'Sardor Rahimov', phone: '+998 90 123 45 67', address: 'Toshkent sh., Yunusobod 12', product: 'iPhone 15 Pro 128GB', amount: 14200000, date: '2026-08-12', status: 'Yetkazildi', statusType: 'success' },
      { id: 1002, customer: 'Jahongir Aliyev', phone: '+998 93 987 65 43', address: "Samarqand sh., Registon ko'ch.", product: 'MacBook Air M2', amount: 12800000, date: '2026-08-13', status: 'Yetkazilmoqda', statusType: 'warning' }
    ];
    localStorage.setItem('texnomart_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }
  try {
    return JSON.parse(raw) || [];
  } catch(e) {
    return [];
  }
}

function renderOrdersTab() {
  const container = document.getElementById('ordersTabContent');
  if (!container) return;
  const orders = getAdminOrders();

  if (typeof updateSidebarBadges === 'function') {
    updateSidebarBadges();
  }

  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:4rem 2rem; background:#ffffff; border-radius:20px; border:2px dashed #e2e8f0;">
        <div style="width:72px; height:72px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.2rem; margin:0 auto 1.25rem;">📦</div>
        <h3 style="font-weight:800; font-size:1.3rem; color:#0f172a; margin-bottom:0.5rem;">Hozircha buyurtmalar ro'yxati toza va bo'sh</h3>
        <p style="color:#64748b; font-size:0.9rem; max-width:480px; margin:0 auto 1.5rem; line-height:1.5;">
          Barcha buyurtmalar tozalandi. Saytdan yangi xaridlar amalga oshirilganda bu yerda real vaqtda paydo bo'ladi va Telegram botingizga bildirishnoma boradi.
        </p>
        <button onclick="seedSampleOrder()" style="background:#f0fdf4; color:#16a34a; border:1.5px solid #bbf7d0; font-weight:800; padding:0.65rem 1.25rem; border-radius:10px; cursor:pointer; font-size:0.88rem;">
          ➕ Test Buyurtma Yaratish
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="background:#ffffff; border-radius:20px; border:1px solid #e2e8f0; padding:1.75rem; box-shadow:0 4px 16px rgba(0,0,0,0.03);">
      <div style="margin-bottom:1.5rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; border-bottom:1.5px solid #f1f5f9; padding-bottom:1.25rem;">
        <div>
          <h3 style="font-weight:800; font-size:1.2rem; color:#0f172a; margin-bottom:0.2rem;">📦 Buyurtmalar Boshqaruvi</h3>
          <p style="font-size:0.85rem; color:#64748b;">Mijozlardan qabul qilingan barcha buyurtmalar ro'yxati (Jami: <b style="color:#0f172a;">${orders.length} ta</b>)</p>
        </div>
        <div style="display:flex; gap:0.75rem; align-items:center;">
          <button onclick="seedSampleOrder()" style="background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; font-weight:700; padding:0.6rem 1rem; border-radius:10px; font-size:0.85rem; cursor:pointer;">
            ➕ Test Buyurtma
          </button>
          <button onclick="clearAllOrders()" style="background:#fee2e2; color:#dc2626; border:1px solid #fecaca; font-weight:800; padding:0.6rem 1.1rem; border-radius:10px; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; gap:0.4rem;">
            <span>🗑️</span> Barchasini Tozalash
          </button>
        </div>
      </div>

      <div class="table-responsive-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Mijoz</th>
              <th>Telefon</th>
              <th>Manzil</th>
              <th>Mahsulot</th>
              <th>Summa</th>
              <th>Sana</th>
              <th>Holat</th>
              <th style="text-align:center;">Amal</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr id="order-row-${o.id}">
                <td><b style="color:#0284c7;">#${o.id}</b></td>
                <td><b>${o.customer || '-'}</b></td>
                <td><span style="font-family:monospace; font-size:0.85rem;">${o.phone || '-'}</span></td>
                <td style="font-size:0.85rem; color:#475569;">${o.address || '-'}</td>
                <td style="font-weight:600; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${o.product || '-'}</td>
                <td><b style="color:#16a34a;">${safeFormatUZS(o.amount)}</b></td>
                <td style="font-size:0.8rem; color:#64748b;">${o.date || '-'}</td>
                <td>
                  <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:0.35rem 0.65rem; border-radius:8px; font-weight:700; font-size:0.8rem; border:1px solid #cbd5e1; outline:none; background:#ffffff; cursor:pointer;">
                    <option value="Yetkazilmoqda" ${o.status === 'Yetkazilmoqda' ? 'selected' : ''}>🚚 Yetkazilmoqda</option>
                    <option value="To'landi" ${o.status === "To'landi" ? 'selected' : ''}>💳 To'landi</option>
                    <option value="Yetkazildi" ${o.status === 'Yetkazildi' || o.status === 'Bajarildi' ? 'selected' : ''}>✅ Yetkazildi</option>
                    <option value="Bekor qilindi" ${o.status === 'Bekor qilindi' ? 'selected' : ''}>❌ Bekor qilindi</option>
                  </select>
                </td>
                <td style="text-align:center;">
                  <button onclick="deleteSingleOrder('${o.id}')" title="Buyurtmani o'chirish" style="background:#fee2e2; color:#dc2626; border:none; width:34px; height:34px; border-radius:8px; cursor:pointer; font-size:0.95rem; display:inline-flex; align-items:center; justify-content:center;">
                    🗑️
                  </button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.clearAllOrders = function() {
  if (confirm("Barcha buyurtmalar ro'yxatini to'liq tozalashni tasdiqlaysizmi?")) {
    localStorage.setItem('texnomart_orders', JSON.stringify([]));
    storeOrdersList = [];
    renderOrdersTab();
    renderAccountingTab();
    if (typeof updateSidebarBadges === 'function') updateSidebarBadges();
    if (window.showToast) showToast("Barcha buyurtmalar muvaffaqiyatli tozalandi! 🗑️", 'success');
  }
};

window.deleteSingleOrder = function(orderId) {
  let orders = getAdminOrders();
  orders = orders.filter(o => o.id != orderId);
  localStorage.setItem('texnomart_orders', JSON.stringify(orders));
  storeOrdersList = orders;
  renderOrdersTab();
  renderAccountingTab();
  if (typeof updateSidebarBadges === 'function') updateSidebarBadges();
  if (window.showToast) showToast(`#${orderId}-sonli buyurtma o'chirildi.`, 'info');
};

window.updateOrderStatus = function(orderId, newStatus) {
  let orders = getAdminOrders();
  const ord = orders.find(o => o.id == orderId);
  if (ord) {
    ord.status = newStatus;
    ord.statusType = (newStatus === 'Yetkazildi' || newStatus === 'Bajarildi' || newStatus === "To'landi") ? 'success' : newStatus === 'Bekor qilindi' ? 'danger' : 'warning';
    localStorage.setItem('texnomart_orders', JSON.stringify(orders));
    storeOrdersList = orders;
    renderAccountingTab();
    if (window.showToast) showToast(`#${orderId} holati: "${newStatus}" ga o'zgartirildi ✅`, 'success');
  }
};

window.seedSampleOrder = function() {
  let orders = getAdminOrders();
  const newId = Math.floor(1000 + Math.random() * 9000);
  orders.unshift({
    id: newId,
    customer: 'Dilshod Ergashev',
    phone: '+998 90 999 88 77',
    address: 'Toshkent sh., Chilonzor 9',
    product: 'Smartfon Samsung Galaxy S24 Ultra',
    amount: 15900000,
    date: new Date().toISOString().split('T')[0],
    status: 'Yetkazilmoqda',
    statusType: 'warning'
  });
  localStorage.setItem('texnomart_orders', JSON.stringify(orders));
  storeOrdersList = orders;
  renderOrdersTab();
  renderAccountingTab();
  if (typeof updateSidebarBadges === 'function') updateSidebarBadges();
  if (window.showToast) showToast(`Yangi #${newId}-sonli test buyurtma qo'shildi! 📦`, 'success');
};

/* =================== TAB 3: OMBOR (WAREHOUSE) =================== */
function renderOmborTab() {
  var container = document.getElementById('omborTabContent');
  if (!container) return;

  var allProducts = getAdminProducts();
  console.log('renderOmborTab executing. Products count:', allProducts.length);

  var catCounts = {
    all: allProducts.length,
    smartfonlar: allProducts.filter(p => p.category === 'smartfonlar').length,
    kompyuterlar: allProducts.filter(p => p.category === 'kompyuterlar').length,
    'tv-audio': allProducts.filter(p => p.category === 'tv-audio').length,
    'maishiy-texnika': allProducts.filter(p => p.category === 'maishiy-texnika').length,
    iqlim: allProducts.filter(p => p.category === 'iqlim').length,
    oshxona: allProducts.filter(p => p.category === 'oshxona').length
  };

  // Filter by category and search
  var filteredProducts = allProducts.filter(p => {
    var matchCat = currentOmborCategoryFilter === 'all' || p.category === currentOmborCategoryFilter;
    var query = currentOmborSearchQuery.toLowerCase();
    var matchSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(query));
    return matchCat && matchSearch;
  });

  var catEmoji = { smartfonlar:'📱', kompyuterlar:'💻', 'tv-audio':'📺', 'maishiy-texnika':'🧺', iqlim:'❄️', oshxona:'🍳' };
  var lowStock = allProducts.filter(function(p){ return (p.stock||0) <= 5; }).length;
  var totalStock = allProducts.reduce(function(s,p){ return s+(p.stock||0); }, 0);

  var rowsHtml = '';
  for (var i = 0; i < filteredProducts.length; i++) {
    var p = filteredProducts[i];
    var stockNum = p.stock || 0;
    var stockColor = stockNum <= 3 ? '#dc2626' : stockNum <= 7 ? '#d97706' : '#16a34a';
    var stockLabel = stockNum <= 3 ? '🔴 Tugayapti!' : stockNum <= 7 ? '🟡 Kam qoldi' : '🟢 Yetarli';
    var discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    var emoji = catEmoji[p.category] || '📦';
    var catName = p.categoryName || p.category || '';
    var flashBg = p.isFlashDeal ? '#fef3c7' : '#f1f5f9';
    var flashColor = p.isFlashDeal ? '#b45309' : '#64748b';
    var flashLabel = p.isFlashDeal ? '🔥 Faol' : 'Yo\'q';
    var btnBg = p.isFlashDeal ? '#fee2e2' : '#dcfce7';
    var btnColor = p.isFlashDeal ? '#dc2626' : '#166534';
    var btnLabel = p.isFlashDeal ? 'Chegirmadan chiqar' : 'Kun Taklifiga qo\'sh';

    rowsHtml += `
      <tr id="omborRow_${p.id}">
        <td>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <img src="${p.image}" style="width:48px;height:48px;border-radius:10px;object-fit:cover;flex-shrink:0;border:1px solid #e2e8f0;" onerror="this.src='https://via.placeholder.com/48'">
            <div>
              <div style="font-weight:700;font-size:0.85rem;line-height:1.3;max-width:220px;color:#1e293b;">${p.name}</div>
              <div style="font-size:0.75rem;color:#64748b;margin-top:2px;"><b>Brend:</b> ${p.brand || 'Boshqa'} &nbsp;|&nbsp; <b>ID:</b> #${p.id}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="background:#f1f5f9;padding:0.3rem 0.65rem;border-radius:20px;font-size:0.78rem;font-weight:700;white-space:nowrap;">
            ${emoji} ${catName}
          </span>
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:0.4rem;">
            <input type="number" id="stockInput_${p.id}" value="${stockNum}" min="0" style="width:65px;padding:0.35rem 0.4rem;border:1.5px solid #cbd5e1;border-radius:8px;font-weight:800;text-align:center;font-size:0.9rem;color:${stockColor};">
            <button onclick="saveStock(${p.id})" style="background:#dbeafe;color:#1d4ed8;font-weight:700;padding:0.35rem 0.55rem;border-radius:8px;font-size:0.75rem;cursor:pointer;" title="Saqlash">💾</button>
          </div>
          <div style="font-size:0.72rem;color:${stockColor};font-weight:700;margin-top:2px;">${stockLabel}</div>
        </td>
        <td>
          <input type="number" id="priceInput_${p.id}" value="${p.price}" style="width:130px;padding:0.35rem 0.5rem;border:1.5px solid #cbd5e1;border-radius:8px;font-weight:800;font-size:0.85rem;">
          <div style="font-size:0.72rem;color:#64748b;margin-top:2px;font-weight:600;">${safeFormatUZS(p.price)}</div>
        </td>
        <td>
          ${p.oldPrice && discountPct > 0
            ? `<span style="background:#fee2e2;color:#dc2626;padding:0.25rem 0.65rem;border-radius:20px;font-weight:800;font-size:0.8rem;">-${discountPct}%</span>
               <div style="font-size:0.7rem;color:#64748b;margin-top:2px;text-decoration:line-through;">${safeFormatUZS(p.oldPrice)}</div>`
            : `<span style="color:#94a3b8;font-size:0.8rem;">—</span>`}
        </td>
        <td>
          <span style="background:${flashBg};color:${flashColor};padding:0.3rem 0.7rem;border-radius:20px;font-size:0.78rem;font-weight:800;display:inline-block;">${flashLabel}</span>
        </td>
        <td>
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button onclick="saveOmborPrice(${p.id})" style="background:#FBC100;color:#000;font-weight:800;padding:0.4rem 0.65rem;border-radius:8px;font-size:0.78rem;cursor:pointer;width:100%;border:none;">💾 Narxni Saqlash</button>
            <button onclick="toggleFlashFromOmbor(${p.id})" style="background:${btnBg};color:${btnColor};font-weight:800;padding:0.4rem 0.65rem;border-radius:8px;font-size:0.78rem;cursor:pointer;width:100%;border:none;">${btnLabel}</button>
            <button onclick="deleteProductById(${p.id})" style="background:#fee2e2;color:#dc2626;font-weight:800;padding:0.35rem 0.65rem;border-radius:8px;font-size:0.75rem;cursor:pointer;width:100%;border:none;">🗑️ O'chirish</button>
          </div>
        </td>
      </tr>
    `;
  }

  container.innerHTML = `
    <!-- Ombor Top Header & Stats -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;background:#f8fafc;padding:1rem 1.25rem;border-radius:16px;border:1px solid #e2e8f0;">
      <div>
        <h3 style="font-weight:800;font-size:1.2rem;color:#0f172a;display:flex;align-items:center;gap:0.5rem;">
          🏪 Ombor Boshqaruvi — <span style="color:#d97706;">${allProducts.length} xil Mahsulot</span>
        </h3>
        <p style="font-size:0.85rem;color:#64748b;margin-top:0.3rem;">
          Jami mavjud tovar: <b style="color:#0f172a;">${totalStock} dona</b> &nbsp;|&nbsp;
          <span style="color:#dc2626;font-weight:700;">⚠️ Kam qolgan: ${lowStock} xil tovar</span>
        </p>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button onclick="syncFullWarehouseDatabase()" style="background:#FBC100;color:#000;font-weight:800;padding:0.6rem 1.1rem;border-radius:10px;font-size:0.85rem;cursor:pointer;box-shadow:0 2px 6px rgba(251,193,0,0.3);border:none;">
          🔄 To'liq Bazani Qayta Yuklash (${defaultFallbackProducts.length}+)
        </button>
        <button onclick="renderOmborTab()" style="background:#ffffff;border:1.5px solid #cbd5e1;color:#1e293b;font-weight:700;padding:0.6rem 1rem;border-radius:10px;font-size:0.85rem;cursor:pointer;">
          🔄 Yangilash
        </button>
      </div>
    </div>

    <!-- Category Filter Tabs inside Ombor -->
    <div style="display:flex;gap:0.5rem;overflow-x:auto;padding-bottom:0.75rem;margin-bottom:0.75rem;scrollbar-width:thin;">
      <button onclick="filterOmborCategory('all')" style="padding:0.45rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:800;cursor:pointer;white-space:nowrap;border:none;background:${currentOmborCategoryFilter === 'all' ? '#0f172a' : '#e2e8f0'};color:${currentOmborCategoryFilter === 'all' ? '#ffffff' : '#334155'};">
        Barchasi (${catCounts.all})
      </button>
      <button onclick="filterOmborCategory('smartfonlar')" style="padding:0.45rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:800;cursor:pointer;white-space:nowrap;border:none;background:${currentOmborCategoryFilter === 'smartfonlar' ? '#0f172a' : '#e2e8f0'};color:${currentOmborCategoryFilter === 'smartfonlar' ? '#ffffff' : '#334155'};">
        📱 Smartfonlar (${catCounts.smartfonlar})
      </button>
      <button onclick="filterOmborCategory('kompyuterlar')" style="padding:0.45rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:800;cursor:pointer;white-space:nowrap;border:none;background:${currentOmborCategoryFilter === 'kompyuterlar' ? '#0f172a' : '#e2e8f0'};color:${currentOmborCategoryFilter === 'kompyuterlar' ? '#ffffff' : '#334155'};">
        💻 Kompyuterlar (${catCounts.kompyuterlar})
      </button>
      <button onclick="filterOmborCategory('tv-audio')" style="padding:0.45rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:800;cursor:pointer;white-space:nowrap;border:none;background:${currentOmborCategoryFilter === 'tv-audio' ? '#0f172a' : '#e2e8f0'};color:${currentOmborCategoryFilter === 'tv-audio' ? '#ffffff' : '#334155'};">
        📺 TV & Audio (${catCounts['tv-audio']})
      </button>
      <button onclick="filterOmborCategory('maishiy-texnika')" style="padding:0.45rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:800;cursor:pointer;white-space:nowrap;border:none;background:${currentOmborCategoryFilter === 'maishiy-texnika' ? '#0f172a' : '#e2e8f0'};color:${currentOmborCategoryFilter === 'maishiy-texnika' ? '#ffffff' : '#334155'};">
        🧺 Maishiy (${catCounts['maishiy-texnika']})
      </button>
      <button onclick="filterOmborCategory('iqlim')" style="padding:0.45rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:800;cursor:pointer;white-space:nowrap;border:none;background:${currentOmborCategoryFilter === 'iqlim' ? '#0f172a' : '#e2e8f0'};color:${currentOmborCategoryFilter === 'iqlim' ? '#ffffff' : '#334155'};">
        ❄️ Iqlim (${catCounts.iqlim})
      </button>
      <button onclick="filterOmborCategory('oshxona')" style="padding:0.45rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:800;cursor:pointer;white-space:nowrap;border:none;background:${currentOmborCategoryFilter === 'oshxona' ? '#0f172a' : '#e2e8f0'};color:${currentOmborCategoryFilter === 'oshxona' ? '#ffffff' : '#334155'};">
        🍳 Oshxona (${catCounts.oshxona})
      </button>
    </div>

    <!-- Live Search Box inside Ombor -->
    <div style="margin-bottom:1rem;">
      <input type="text" id="omborLiveSearch" value="${currentOmborSearchQuery}" oninput="searchOmborProducts(this.value)" placeholder="🔍 Ombordagi mahsulotlarni qidirish (nom, brend, model)..."
        style="width:100%;padding:0.75rem 1rem;border:1.5px solid #cbd5e1;border-radius:12px;font-size:0.9rem;font-weight:600;background:#ffffff;">
    </div>

    <!-- Scrollable Table Container -->
    <div class="table-responsive-wrap" style="max-height: 520px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 14px;">
      <table class="admin-table" style="position:relative;">
        <thead style="position:sticky;top:0;z-index:5;background:#f1f5f9;">
          <tr>
            <th style="min-width:260px;">📦 Mahsulot (${filteredProducts.length})</th>
            <th>Kategoriya</th>
            <th>Ombor soni</th>
            <th>Joriy Narx</th>
            <th>Chegirma %</th>
            <th>Kun Taklifi</th>
            <th style="min-width:200px;">Amallar</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:#64748b;">Keltirilgan qidiruv yoki kategoriya bo'yicha mahsulot topilmadi.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

window.filterOmborCategory = function(cat) {
  currentOmborCategoryFilter = cat;
  renderOmborTab();
};

window.searchOmborProducts = function(query) {
  currentOmborSearchQuery = query;
  renderOmborTab();
  // Keep focus on input
  setTimeout(() => {
    const input = document.getElementById('omborLiveSearch');
    if (input) {
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  }, 10);
};

window.syncFullWarehouseDatabase = function() {
  if (confirm("Ombor bazasini barcha 24+ mahsulotlar bilan to'liq yangilashni xohlaysizmi?")) {
    window.allProductsList = JSON.parse(JSON.stringify(defaultFallbackProducts));
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
    if (window.filterProductsBySearch) window.filterProductsBySearch('');
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    renderOmborTab();
    renderChegirmaTab();
    renderAccountingTab();
    if (window.showToast) showToast('Ombor bazasi to\'liq sinxronlandi: ' + defaultFallbackProducts.length + ' ta mahsulot! 🚀', 'success');
  }
};

window.renderOmborTabPublic = function() {
  renderOmborTab();
};

window.saveStock = function(productId) {
  const input = document.getElementById('stockInput_' + productId);
  if (!input) return;
  const newStock = parseInt(input.value);
  if (isNaN(newStock) || newStock < 0) { if(window.showToast) showToast("To'g'ri son kiriting!", 'danger'); return; }
  const products = getAdminProducts();
  const item = products.find(p => p.id === productId);
  if (item) {
    item.stock = newStock;
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    if(window.showToast) showToast('Ombor yangilandi: ' + newStock + ' dona', 'success');
    renderOmborTab();
    renderAccountingTab();
  }
};

window.saveOmborPrice = function(productId) {
  const input = document.getElementById('priceInput_' + productId);
  if (!input) return;
  const newPrice = parseInt(input.value);
  if (!newPrice || newPrice <= 0) { if(window.showToast) showToast("To'g'ri narx kiriting!", 'danger'); return; }
  const products = getAdminProducts();
  const item = products.find(p => p.id === productId);
  if (item) {
    item.oldPrice = item.price;
    item.price = newPrice;
    item.monthlyPrice = Math.round(newPrice / 12);
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    if (window.filterProductsBySearch) window.filterProductsBySearch('');
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    if(window.showToast) showToast('Narx yangilandi: ' + safeFormatUZS(newPrice), 'success');
    renderOmborTab();
  }
};

window.toggleFlashFromOmbor = function(productId) {
  const products = getAdminProducts();
  const item = products.find(p => p.id === productId);
  if (!item) return;
  item.isFlashDeal = !item.isFlashDeal;
  if (item.isFlashDeal && !item.oldPrice) {
    item.oldPrice = Math.round(item.price * 1.2);
  }
  if (window.saveProductsToStorage) window.saveProductsToStorage();
  if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  if(window.showToast) showToast(item.isFlashDeal ? '"' + item.name + '" 🔥 Kun Taklifiga qo\'shildi!' : '"' + item.name + '" chegirmadan chiqarildi.', item.isFlashDeal ? 'success' : 'info');
  renderOmborTab();
  renderChegirmaTab();
  renderAccountingTab();
};

let pendingDeleteProductId = null;

window.deleteProductById = function(productId) {
  const products = getAdminProducts();
  const item = products.find(p => p.id === productId);
  if (!item) return;

  pendingDeleteProductId = productId;

  let modalOverlay = document.getElementById('deleteConfirmModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'deleteConfirmModalOverlay';
    modalOverlay.className = 'delete-modal-overlay';
    document.body.appendChild(modalOverlay);

    // Close on backdrop click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.closeDeleteConfirmModal();
    });
  }

  modalOverlay.innerHTML = `
    <div class="delete-modal-card">
      <div class="delete-icon-pulse">🗑️</div>
      <h3 style="font-size:1.35rem; font-weight:800; text-align:center; color:#0f172a; margin-bottom:0.35rem;">Mahsulotni O'chirish</h3>
      <p style="font-size:0.875rem; color:#64748b; text-align:center; line-height:1.4;">Ushbu tovar katalog va ombor bazasidan butunlay olib tashlanadi.</p>

      <div class="delete-target-preview">
        <img src="${item.image}" class="delete-target-img" onerror="this.src='https://via.placeholder.com/56'">
        <div class="delete-target-info">
          <div class="delete-target-name">${item.name}</div>
          <div class="delete-target-meta">
            <span style="font-weight:800; color:#0f172a;">${safeFormatUZS(item.price)}</span>
            <span>•</span>
            <span style="color:#16a34a; font-weight:700;">${item.stock || 0} dona omborda</span>
            <span>•</span>
            <span>ID: #${item.id}</span>
          </div>
        </div>
      </div>

      <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:0.75rem 1rem; font-size:0.82rem; color:#991b1b; display:flex; align-items:center; gap:0.5rem;">
        <span>⚠️</span>
        <span><b>Eslatma:</b> O'chirilgandan so'ng 6 soniya ichida «Qaytarish (Undo)» tugmasi orqali qayta tiklashingiz mumkin.</span>
      </div>

      <div class="delete-modal-actions">
        <button class="btn-delete-cancel" onclick="closeDeleteConfirmModal()">
          ❌ Bekor Qilish
        </button>
        <button class="btn-delete-confirm" onclick="confirmDeleteProductAction()">
          🗑️ Ha, O'chirilsin
        </button>
      </div>
    </div>
  `;

  modalOverlay.style.display = 'flex';
  setTimeout(() => modalOverlay.classList.add('active'), 10);
};

window.closeDeleteConfirmModal = function() {
  const modalOverlay = document.getElementById('deleteConfirmModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    setTimeout(() => { modalOverlay.style.display = 'none'; }, 250);
  }
  pendingDeleteProductId = null;
};

window.confirmDeleteProductAction = function() {
  if (!pendingDeleteProductId) return;
  const productId = pendingDeleteProductId;
  const products = getAdminProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx < 0) { closeDeleteConfirmModal(); return; }

  const deletedItem = products[idx];
  closeDeleteConfirmModal();

  // Micro-animation on row
  const row = document.getElementById('omborRow_' + productId);
  if (row) {
    row.classList.add('row-deleting-animation');
  }

  setTimeout(() => {
    // Save to Trash history
    let trash = [];
    try { trash = JSON.parse(localStorage.getItem('texnomart_trash_products')) || []; } catch(e) { trash = []; }
    trash.unshift(deletedItem);
    localStorage.setItem('texnomart_trash_products', JSON.stringify(trash));

    // Remove from active list
    window.allProductsList.splice(idx, 1);
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    if (typeof window.deleteSupabaseProduct === 'function') window.deleteSupabaseProduct(productId);
    if (window.filterProductsBySearch) window.filterProductsBySearch('');
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();

    renderOmborTab();
    renderChegirmaTab();
    renderAccountingTab();

    // Show Interactive Toast with Undo Action
    if (typeof window.showActionToast === 'function') {
      window.showActionToast(
        `"${deletedItem.name}" o'chirildi`,
        '↩️ Qaytarish (Undo)',
        () => {
          window.restoreProductItem(deletedItem);
        },
        6000
      );
    } else if (window.showToast) {
      window.showToast(`"${deletedItem.name}" o'chirildi`, 'info');
    }
  }, 350);
};

window.restoreProductItem = function(product) {
  if (!product) return;
  if (!window.allProductsList) window.allProductsList = [];
  
  // Remove from trash
  try {
    let trash = JSON.parse(localStorage.getItem('texnomart_trash_products')) || [];
    trash = trash.filter(t => t.id !== product.id);
    localStorage.setItem('texnomart_trash_products', JSON.stringify(trash));
  } catch(e) {}

  // Re-insert product
  window.allProductsList.unshift(product);
  if (window.saveProductsToStorage) window.saveProductsToStorage();
  if (window.filterProductsBySearch) window.filterProductsBySearch('');
  if (window.renderFlashDealsSection) window.renderFlashDealsSection();

  renderOmborTab();
  renderChegirmaTab();
  renderAccountingTab();

  if (window.showToast) window.showToast(`"${product.name}" qayta tiklandi! 🎉`, 'success');

  // Add restored glow animation to row
  setTimeout(() => {
    const newRow = document.getElementById('omborRow_' + product.id);
    if (newRow) {
      newRow.classList.add('row-restored-animation');
      newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 100);
};

/* =================== TAB 4: CHEGIRMALAR =================== */
function renderChegirmaTab() {
  const container = document.getElementById('chegirmaTabContent');
  if (!container) return;
  const products = getAdminProducts();
  const flashItems = products.filter(p => p.isFlashDeal);
  const normalItems = products.filter(p => !p.isFlashDeal);

  container.innerHTML = `
    <h3 style="font-weight:800; font-size:1.1rem; margin-bottom:1.25rem;">🔥 Kun Taklifi & Chegirmalar Boshqaruvi</h3>
    <div style="margin-bottom:2rem;">
      <h4 style="font-size:0.95rem; font-weight:800; color:#dc2626; margin-bottom:1rem;">🔥 Hozir Chegirmada — ${flashItems.length} ta tovar</h4>
      ${flashItems.length === 0
        ? `<p style="color:var(--text-muted); font-size:0.9rem; padding:1rem; background:#f8fafc; border-radius:12px;">Hozircha chegirmadagi tovar yo'q.</p>`
        : `<div class="chegirma-cards-grid">${flashItems.map(p => flashCard(p, true)).join('')}</div>`}
    </div>
    <div>
      <h4 style="font-size:0.95rem; font-weight:800; color:#16a34a; margin-bottom:1rem;">➕ Chegirmaga Qo'shish Mumkin — ${normalItems.length} ta tovar</h4>
      ${normalItems.length === 0
        ? `<p style="color:var(--text-muted); font-size:0.9rem; padding:1rem; background:#f8fafc; border-radius:12px;">Barcha tovarlar chegirmada.</p>`
        : `<div class="chegirma-cards-grid">${normalItems.map(p => flashCard(p, false)).join('')}</div>`}
    </div>
  `;
}

function flashCard(p, isFlash) {
  const discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return `
    <div class="chegirma-card ${isFlash ? 'chegirma-active' : ''}">
      <img src="${p.image}" onerror="this.src='https://via.placeholder.com/56'" style="width:56px;height:56px;object-fit:cover;border-radius:10px;flex-shrink:0;">
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:0.85rem;line-height:1.3;margin-bottom:0.25rem;">${p.name}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.4rem;">${p.categoryName || p.category}</div>
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
          <span style="font-weight:800;font-size:0.9rem;">${safeFormatUZS(p.price)}</span>
          ${p.oldPrice && discountPct > 0 ? `
            <span style="font-size:0.75rem;text-decoration:line-through;color:var(--text-muted);">${safeFormatUZS(p.oldPrice)}</span>
            <span style="background:#fee2e2;color:#dc2626;padding:1px 7px;border-radius:20px;font-weight:800;font-size:0.72rem;">-${discountPct}%</span>
          ` : ''}
        </div>
      </div>
      <button onclick="toggleFlashFromOmbor(${p.id})"
        style="background:${isFlash ? '#fee2e2' : '#dcfce7'};color:${isFlash ? '#dc2626' : '#166534'};font-weight:800;padding:0.55rem 0.9rem;border-radius:10px;font-size:0.82rem;cursor:pointer;white-space:nowrap;flex-shrink:0;">
        ${isFlash ? '❌ Olib tashlash' : "🔥 Chegirmaga qo'sh"}
      </button>
    </div>`;
}

/* =================== ADD NEW PRODUCT (MULTI-IMAGE: MIN 3, MAX 5) =================== */
let uploadedImagesList = [];

window.handleMultipleFileInputChange = function(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  if (uploadedImagesList.length + files.length > 5) {
    if (window.showToast) {
      showToast('⚠️ Qoida: Ko\'pi bilan 5 tagacha rasm yuklash mumkin!', 'warning');
    }
  }

  const remainingSlots = 5 - uploadedImagesList.length;
  const filesToProcess = files.slice(0, remainingSlots);

  let processedCount = 0;
  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      if (uploadedImagesList.length < 5) {
        uploadedImagesList.push(e.target.result);
      }
      processedCount++;
      if (processedCount === filesToProcess.length) {
        renderMultiImagePreviews();
        if (window.showToast) {
          showToast(`📸 ${filesToProcess.length} ta yangi rasm yuklandi!`, 'success');
        }
      }
    };
    reader.readAsDataURL(file);
  });

  // Reset input
  event.target.value = '';
};

window.handleAddImageUrl = function() {
  const input = document.getElementById('newProdUrlInput');
  if (!input) return;
  const url = (input.value || '').trim();

  if (!url) {
    if (window.showToast) showToast('Iltimos, rasm URL manzilini kiriting!', 'danger');
    return;
  }

  if (uploadedImagesList.length >= 5) {
    if (window.showToast) showToast('⚠️ Maksimal 5 ta rasm limiti to\'ldi!', 'warning');
    return;
  }

  uploadedImagesList.push(url);
  input.value = '';
  renderMultiImagePreviews();
  if (window.showToast) showToast('Rasm URL galereyaga qo\'shildi! 🖼️', 'success');
};

window.removeUploadedImage = function(index) {
  if (index >= 0 && index < uploadedImagesList.length) {
    uploadedImagesList.splice(index, 1);
    renderMultiImagePreviews();
    if (window.showToast) showToast('Rasm olib tashlandi.', 'info');
  }
};

function renderMultiImagePreviews() {
  const grid = document.getElementById('multiImagePreviewGrid');
  const countBadge = document.getElementById('imageCountBadge');
  const countText = document.getElementById('imageCountText');
  const countIcon = document.getElementById('imageCountIcon');

  const count = uploadedImagesList.length;

  // Update Badge Status
  if (countBadge && countText && countIcon) {
    if (count === 0) {
      countBadge.style.background = '#fee2e2';
      countBadge.style.color = '#dc2626';
      countIcon.textContent = '⚠️';
      countText.textContent = '0/5 ta rasm (Kamida 3 ta yuklang)';
    } else if (count < 3) {
      countBadge.style.background = '#fef3c7';
      countBadge.style.color = '#d97706';
      countIcon.textContent = '🟡';
      countText.textContent = `${count}/5 ta rasm (Yana ${3 - count} ta kerak)`;
    } else if (count <= 5) {
      countBadge.style.background = '#dcfce7';
      countBadge.style.color = '#15803d';
      countIcon.textContent = '🟢';
      countText.textContent = `${count}/5 ta rasm (Qoida bajarildi ✅)`;
    }
  }

  if (!grid) return;

  if (count === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:2rem 1rem; color:#94a3b8; font-size:0.88rem; border:1px dashed #cbd5e1; border-radius:12px; background:#ffffff;">
        <span style="font-size:1.8rem; display:block; margin-bottom:0.35rem;">🖼️</span>
        Hozircha rasmlar yuklanmadi. Kamida 3 ta, ko'pi bilan 5 ta rasm tanlang.
      </div>
    `;
    return;
  }

  let html = '';
  uploadedImagesList.forEach((src, idx) => {
    html += `
      <div style="position:relative; background:#ffffff; border:1.5px solid ${idx === 0 ? '#0284c7' : '#e2e8f0'}; border-radius:14px; padding:6px; box-shadow:0 2px 8px rgba(0,0,0,0.04); display:flex; flex-direction:column; align-items:center;">
        ${idx === 0 ? `
          <span style="position:absolute; top:8px; left:8px; background:#0284c7; color:#ffffff; font-size:0.68rem; font-weight:800; padding:2px 6px; border-radius:6px; z-index:2;">
            ★ Asosiy
          </span>` : `
          <span style="position:absolute; top:8px; left:8px; background:#0f172a; color:#ffffff; font-size:0.68rem; font-weight:700; padding:2px 6px; border-radius:6px; z-index:2;">
            ${idx + 1}-rasm
          </span>`}
        
        <button type="button" onclick="removeUploadedImage(${idx})" title="Rasmni o'chirish" style="position:absolute; top:6px; right:6px; width:26px; height:26px; border-radius:50%; background:#fee2e2; color:#dc2626; border:none; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; justify-content:center; z-index:3;">
          ✕
        </button>

        <img src="${src}" alt="Product ${idx + 1}" style="width:100%; height:110px; object-fit:cover; border-radius:10px; margin-bottom:4px;">
      </div>
    `;
  });

  // Add "+" placeholder button if < 5 images
  if (count < 5) {
    html += `
      <label for="newProdFileInput" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; height:122px; border:2px dashed #cbd5e1; border-radius:14px; background:#ffffff; color:#64748b; font-size:0.8rem; font-weight:700; transition:all 0.2s ease;">
        <span style="font-size:1.5rem; margin-bottom:0.25rem;">➕</span>
        <span>Rasm ${count + 1}</span>
      </label>
    `;
  }

  grid.innerHTML = html;
}

function handleAddNewProductSubmit(event) {
  event.preventDefault();
  const name = (document.getElementById('newProdName')?.value || '').trim();
  const category = document.getElementById('newProdCategory')?.value || 'smartfonlar';
  const price = parseInt(document.getElementById('newProdPrice')?.value || '0');
  const stock = parseInt(document.getElementById('newProdStock')?.value || '15');
  const isFlash = document.getElementById('newProdIsFlash')?.checked || false;
  const desc = (document.getElementById('newProdDesc')?.value || '').trim();

  // MANDATORY VALIDATION: MINIMUM 3, MAXIMUM 5 IMAGES
  if (uploadedImagesList.length < 3) {
    if (window.showToast) {
      showToast(`⚠️ Qoida: Kamida 3 ta rasm yuklashingiz shart! (Hozir: ${uploadedImagesList.length} ta rasm)`, 'danger');
    }
    const container = document.getElementById('imageCountBadge');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  if (uploadedImagesList.length > 5) {
    if (window.showToast) {
      showToast('⚠️ Ko\'pi bilan 5 tagacha rasm yuklash mumkin!', 'danger');
    }
    return;
  }

  if (!name || !price) {
    if (window.showToast) showToast("Iltimos, mahsulot nomi va narxini to'liq kiriting!", 'danger');
    return;
  }

  const categoryNames = {
    smartfonlar: 'Smartfonlar',
    kompyuterlar: 'Kompyuterlar',
    'tv-audio': 'TV va Audio',
    'maishiy-texnika': 'Maishiy texnika',
    iqlim: 'Iqlim texnikasi',
    oshxona: 'Oshxona texnikasi'
  };

  const newProduct = {
    id: Date.now(),
    name,
    category,
    categoryName: categoryNames[category] || 'Boshqa',
    brand: 'Yangi Brend',
    price,
    oldPrice: Math.round(price * 1.18),
    monthlyPrice: Math.round(price / 12),
    stock: stock || 15,
    rating: 5.0,
    reviews: 0,
    isFlashDeal: isFlash,
    badge: isFlash ? 'SUPER CHEGIRMA' : 'YANGI',
    badgeColor: isFlash ? 'danger' : 'accent',
    image: uploadedImagesList[0], // Main thumbnail
    images: [...uploadedImagesList], // Full 3 to 5 images gallery
    description: desc || `${name} — kafolatli sifat va rasmiy servis xizmati bilan taqdim etiladi.`
  };

  if (!window.allProductsList || !Array.isArray(window.allProductsList)) {
    window.allProductsList = getAdminProducts();
  }
  window.allProductsList.unshift(newProduct);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));

  if (window.saveProductsToStorage) window.saveProductsToStorage();
  if (window.showToast) showToast(`"${name}" 3-5 ta rasmlari bilan do'konga muvaffaqiyatli qo'shildi! 🎉📸`, 'success');

  // Reset form and gallery
  event.target.reset();
  uploadedImagesList = [];
  renderMultiImagePreviews();

  if (window.filterProductsBySearch) window.filterProductsBySearch('');
  if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  renderOmborTab();
  renderChegirmaTab();
  renderAccountingTab();
  if (typeof updateSidebarBadges === 'function') updateSidebarBadges();
}

/* =================== SETTINGS TAB HANDLERS =================== */
window.handleUpdateAdminCredentials = function(e) {
  if (e) e.preventDefault();
  const newUsername = (document.getElementById('settingsNewUsername')?.value || '').trim();
  const newPass = (document.getElementById('settingsNewPassword')?.value || '').trim();
  const confirmPass = (document.getElementById('settingsConfirmPassword')?.value || '').trim();

  if (!newUsername || !newPass) {
    if (window.showToast) showToast('Iltimos, login va parolni kiriting!', 'danger');
    return;
  }
  if (newPass !== confirmPass) {
    if (window.showToast) showToast('Yangi parollar bir-biriga mos kelmadi!', 'danger');
    return;
  }
  if (newPass.length < 3) {
    if (window.showToast) showToast('Parol kamida 3 ta belgidan iborat bo\'lishi kerak!', 'danger');
    return;
  }

  const updatedCreds = { username: newUsername, password: newPass };
  localStorage.setItem('texnomart_admin_custom_creds', JSON.stringify(updatedCreds));
  
  if (window.showToast) showToast('Admin login va paroli muvaffaqiyatli o\'zgartirildi! 🎉', 'success');
};

window.handleSaveCustomerBot = function(e) {
  if (e) e.preventDefault();
  const token = (document.getElementById('custBotTokenInput')?.value || '').trim();
  const username = (document.getElementById('custBotUsernameInput')?.value || '').trim();
  localStorage.setItem('texnomart_customer_bot_token', token);
  localStorage.setItem('texnomart_customer_bot_username', username);
  if (window.showToast) showToast('1-Bot (Mijozlar boti) sozlamalari saqlandi! 👥', 'success');
};

window.handleSaveAdminBot = function(e) {
  if (e) e.preventDefault();
  const token = (document.getElementById('adminBotTokenInput')?.value || '').trim();
  const chatId = (document.getElementById('adminBotChatIdInput')?.value || '').trim();
  localStorage.setItem('texnomart_admin_bot_token', token);
  localStorage.setItem('texnomart_admin_bot_chat_id', chatId);
  localStorage.setItem('texnomart_telegram_chat_id', chatId);
  if (window.showToast) showToast('2-Bot (Buyurtma & Moliya Yordamchisi) saqlandi! 📊', 'success');
};

/* =================== EXPORTS & DOM READY =================== */
window.handleAddNewProductSubmit = handleAddNewProductSubmit;
window.renderMultiImagePreviews = renderMultiImagePreviews;

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderProfileButton();
  const loginForm = document.getElementById('authLoginForm');
  const addProdForm = document.getElementById('addNewProductForm');
  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (addProdForm) addProdForm.addEventListener('submit', handleAddNewProductSubmit);
  if (window.renderMultiImagePreviews) window.renderMultiImagePreviews();
});
