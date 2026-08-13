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

let storeOrdersList = [];
try {
  storeOrdersList = JSON.parse(localStorage.getItem('texnomart_orders')) || [
    { id: 1001, customer: 'Sardor Rahimov', phone: '+998 90 123 45 67', address: 'Toshkent sh., Yunusobod 12', product: 'iPhone 15 Pro 128GB', amount: 14200000, date: '2026-08-12', status: 'Bajarildi', statusType: 'success' },
    { id: 1002, customer: 'Jahongir Aliyev', phone: '+998 93 987 65 43', address: "Samarqand sh., Registon ko'ch.", product: 'MacBook Air M2', amount: 12800000, date: '2026-08-13', status: 'Yetkazilmoqda', statusType: 'warning' }
  ];
} catch(e) { storeOrdersList = []; }

const defaultFallbackProducts = [
  { id: 101, name: "Smartfon Apple iPhone 15 Pro 128GB Natural Titanium", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Apple", price: 14200000, oldPrice: 15800000, monthlyPrice: 1450000, stock: 12, rating: 4.9, reviews: 128, badge: "SUPER NARX", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "A17 Pro chip, Titanium korpus, 48 MP Action kamera va Dynamic Island." },
  { id: 102, name: "Smartfon Samsung Galaxy S24 Ultra 12/512GB Titanium Black", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Samsung", price: 15900000, oldPrice: 17200000, monthlyPrice: 1620000, stock: 8, rating: 4.9, reviews: 94, badge: "0-0-12", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "Galaxy AI imkoniyatlari, 200MP kamera va Snapdragon 8 Gen 3." },
  { id: 103, name: "Noutbuk Apple MacBook Air 13 M2 8/256GB Midnight", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "Apple", price: 12800000, oldPrice: 14100000, monthlyPrice: 1290000, stock: 5, rating: 4.8, reviews: 65, badge: "HIT SOTUV", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "M2 protsessor, Liquid Retina ekrani va ingichka dizayn." },
  { id: 104, name: "Noutbuk ASUS TUF Gaming F15 i5-12500H RTX 3050 16GB", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "ASUS", price: 9800000, oldPrice: 10900000, monthlyPrice: 990000, stock: 14, rating: 4.7, reviews: 42, badge: "AKSIYA", badgeColor: "red", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Kuchli o'yin noutbuki, 144Hz IPS ekran va harbiylarcha baquvvat korpus." },
  { id: 105, name: "Televizor Artel 55AU90G 4K UHD Smart Android TV", category: "tv-audio", categoryName: "TV va Audio", brand: "Artel", price: 4800000, oldPrice: 5300000, monthlyPrice: 490000, stock: 20, rating: 4.6, reviews: 88, badge: "0% TO'LOV", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "55 dyuymli 4K UHD tasvirlash va Android TV." },
  { id: 106, name: "Muzlatgich LG GR-B569BLCZ No Frost Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "LG", price: 8600000, oldPrice: 9400000, monthlyPrice: 870000, stock: 7, rating: 4.9, reviews: 31, badge: "TOP KAFOLAT", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Smart Inverter kompressor, Total No Frost va A++ sinf." },
  { id: 107, name: "Kir yuvish mashinasi Bosch WAN24200ME 8 kg Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "Bosch", price: 6200000, oldPrice: 6900000, monthlyPrice: 630000, stock: 3, rating: 4.9, reviews: 56, badge: "GERMAN QUALITY", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "EcoSilence Drive vositasi va gigiyenik bug'da yuvish." },
  { id: 108, name: "Konditsioner Haier Tundra Inverter 12 HSU-12H", category: "iqlim", categoryName: "Iqlim texnikasi", brand: "Haier", price: 4300000, oldPrice: 4800000, monthlyPrice: 440000, stock: 18, rating: 4.7, reviews: 29, badge: "BEPUL O'RNATISH", badgeColor: "yellow", image: "https://images.unsplash.com/photo-1631545806604-e34988f57fa5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Inverter dvigatel va jim ishlash rejimi." }
];

/* =================== HELPER: Get Products (always fresh) =================== */
function getAdminProducts() {
  if (window.allProductsList && Array.isArray(window.allProductsList) && window.allProductsList.length > 0) {
    return window.allProductsList;
  }
  try {
    var stored = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY));
    if (Array.isArray(stored) && stored.length > 0) {
      window.allProductsList = stored;
      return window.allProductsList;
    }
  } catch(e) {}
  window.allProductsList = JSON.parse(JSON.stringify(defaultFallbackProducts));
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

window.renderOmborTab = function() { renderOmborTab(); };
window.renderChegirmaTab = function() { renderChegirmaTab(); };
window.renderOrdersTab = function() { renderOrdersTab(); };
window.renderAccountingTab = function() { renderAccountingTab(); };


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

/* =================== LOGIN / LOGOUT =================== */
function handleLoginSubmit(event) {
  if (event) event.preventDefault();
  const username = (document.getElementById('authUsernameInput')?.value || '').trim();
  const password = (document.getElementById('authPasswordInput')?.value || '').trim();
  if (password === '123' || username === 'admin' || username === '123') {
    isAdminLoggedIn = true;
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    updateHeaderProfileButton();
    renderAdminCabinetView();
    if (window.showToast) showToast('Xush kelibsiz! Boshqaruv paneli faollashtirildi 🟢', 'success');
  } else {
    if (window.showToast) showToast("Noto'g'ri login yoki parol! Test: 123 / 123", 'danger');
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
  if (isAdminLoggedIn) {
    if (loginView) loginView.style.display = 'none';
    if (dashView) {
      dashView.style.display = 'block';
      dashView.classList.add('active');
      window.renderAdminDashboardTabs();
    }
  } else {
    if (loginView) loginView.style.display = 'block';
    if (dashView) {
      dashView.style.display = 'none';
      dashView.classList.remove('active');
    }
  }
}

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

/* =================== TAB 2: BUYURTMALAR =================== */
function renderOrdersTab() {
  const container = document.getElementById('ordersTabContent');
  if (!container) return;
  const orders = JSON.parse(localStorage.getItem('texnomart_orders')) || storeOrdersList;

  if (!orders.length) {
    container.innerHTML = `<p style="padding:2rem; text-align:center; color:var(--text-muted);">Hozircha buyurtmalar yo'q.</p>`;
    return;
  }
  container.innerHTML = `
    <div style="margin-bottom:1rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
      <h3 style="font-weight:800; font-size:1.1rem;">📦 Jami Buyurtmalar: <span style="color:#ef4444;">${orders.length} ta</span></h3>
      <button onclick="clearAllOrders()" style="background:#fee2e2; color:#dc2626; font-weight:700; padding:0.5rem 1rem; border-radius:8px; font-size:0.85rem; cursor:pointer;">🗑️ Barchasini Tozalash</button>
    </div>
    <div class="table-responsive-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>#ID</th><th>Mijoz</th><th>Telefon</th><th>Manzil</th><th>Mahsulot</th><th>Summa</th><th>Sana</th><th>Holat</th></tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><b>#${o.id}</b></td>
              <td><b>${o.customer || '-'}</b></td>
              <td>${o.phone || '-'}</td>
              <td>${o.address || '-'}</td>
              <td>${o.product || '-'}</td>
              <td><b>${safeFormatUZS(o.amount)}</b></td>
              <td style="font-size:0.8rem;">${o.date || '-'}</td>
              <td><span class="order-status-pill ${o.statusType || 'warning'}">${o.status || 'Yangi'}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.clearAllOrders = function() {
  if (confirm("Barcha buyurtmalarni tozalashni xohlaysizmi?")) {
    localStorage.removeItem('texnomart_orders');
    storeOrdersList = [];
    renderOrdersTab();
    renderAccountingTab();
    if (window.showToast) showToast("Barcha buyurtmalar tozalandi.", 'info');
  }
};

/* =================== TAB 3: OMBOR (WAREHOUSE) =================== */
function renderOmborTab() {
  var container = document.getElementById('omborTabContent');
  if (!container) return;

  var products = getAdminProducts();
  console.log('renderOmborTab executing. Products count:', products.length);

  if (products.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:#64748b;">
        <div style="font-size:3rem; margin-bottom:1rem;">⏳</div>
        <h3 style="font-weight:800; margin-bottom:0.5rem;">Mahsulotlar yuklanmoqda...</h3>
        <p style="margin-bottom:1.5rem;">Web saytdagi mahsulotlar yuklangach bu yerda ko'rinadi.</p>
        <button onclick="renderOmborTabPublic()" style="background:#FBC100; color:#000; font-weight:800; padding:0.75rem 1.5rem; border-radius:12px; cursor:pointer; font-size:1rem;">
          🔄 Yangilash
        </button>
      </div>
    `;
    return;
  }

  var catEmoji = { smartfonlar:'📱', kompyuterlar:'💻', 'tv-audio':'📺', 'maishiy-texnika':'🧺', iqlim:'❄️' };
  var lowStock = products.filter(function(p){ return (p.stock||0) <= 5; }).length;
  var totalStock = products.reduce(function(s,p){ return s+(p.stock||0); }, 0);

  var rowsHtml = '';
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var stockNum = p.stock || 0;
    var stockColor = stockNum <= 3 ? '#dc2626' : stockNum <= 7 ? '#d97706' : '#16a34a';
    var stockLabel = stockNum <= 3 ? '🔴 Tugayapti!' : stockNum <= 7 ? '🟡 Kam qoldi' : '🟢 Yetarli';
    var discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    var emoji = catEmoji[p.category] || '📦';
    var catName = p.categoryName || p.category || '';
    var flashBg = p.isFlashDeal ? '#fef3c7' : '#f1f5f9';
    var flashColor = p.isFlashDeal ? '#b45309' : '#64748b';
    var flashLabel = p.isFlashDeal ? '🔥 Faol' : 'Yoq';
    var btnBg = p.isFlashDeal ? '#fee2e2' : '#dcfce7';
    var btnColor = p.isFlashDeal ? '#dc2626' : '#166534';
    var btnLabel = p.isFlashDeal ? 'Chegirmadan chiqar' : 'Kun Taklifiga qo\'sh';

    rowsHtml += `
      <tr id="omborRow_${p.id}">
        <td>
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <img src="${p.image}" style="width:44px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;" onerror="this.src='https://via.placeholder.com/44'">
            <div>
              <div style="font-weight:700;font-size:0.82rem;line-height:1.3;max-width:180px;">${p.name}</div>
              <div style="font-size:0.72rem;color:#64748b;">${p.brand || ''}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="background:#f1f5f9;padding:0.25rem 0.6rem;border-radius:20px;font-size:0.75rem;font-weight:700;">
            ${emoji} ${catName}
          </span>
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:0.4rem;">
            <input type="number" id="stockInput_${p.id}" value="${stockNum}" min="0" style="width:65px;padding:0.35rem 0.4rem;border:1.5px solid #e2e8f0;border-radius:8px;font-weight:800;text-align:center;font-size:0.9rem;color:${stockColor};">
            <button onclick="saveStock(${p.id})" style="background:#dbeafe;color:#1d4ed8;font-weight:700;padding:0.35rem 0.55rem;border-radius:8px;font-size:0.75rem;cursor:pointer;">💾</button>
          </div>
          <div style="font-size:0.7rem;color:${stockColor};font-weight:700;margin-top:2px;">${stockLabel}</div>
        </td>
        <td>
          <input type="number" id="priceInput_${p.id}" value="${p.price}" style="width:130px;padding:0.35rem 0.5rem;border:1.5px solid #e2e8f0;border-radius:8px;font-weight:800;font-size:0.85rem;">
          <div style="font-size:0.7rem;color:#64748b;margin-top:2px;">${safeFormatUZS(p.price)}</div>
        </td>
        <td>
          ${p.oldPrice && discountPct > 0
            ? `<span style="background:#fee2e2;color:#dc2626;padding:0.25rem 0.65rem;border-radius:20px;font-weight:800;font-size:0.8rem;">-${discountPct}%</span>
               <div style="font-size:0.7rem;color:#64748b;margin-top:2px;text-decoration:line-through;">${safeFormatUZS(p.oldPrice)}</div>`
            : `<span style="color:#64748b;font-size:0.8rem;">—</span>`}
        </td>
        <td>
          <span style="background:${flashBg};color:${flashColor};padding:0.3rem 0.7rem;border-radius:20px;font-size:0.78rem;font-weight:800;">${flashLabel}</span>
        </td>
        <td>
          <div style="display:flex;flex-direction:column;gap:0.4rem;">
            <button onclick="saveOmborPrice(${p.id})" style="background:#FBC100;color:#000;font-weight:800;padding:0.4rem 0.7rem;border-radius:8px;font-size:0.8rem;cursor:pointer;width:100%;">💾 Narxni Saqlash</button>
            <button onclick="toggleFlashFromOmbor(${p.id})" style="background:${btnBg};color:${btnColor};font-weight:800;padding:0.4rem 0.7rem;border-radius:8px;font-size:0.8rem;cursor:pointer;width:100%;">${btnLabel}</button>
            <button onclick="deleteProductById(${p.id})" style="background:#fee2e2;color:#dc2626;font-weight:800;padding:0.4rem 0.7rem;border-radius:8px;font-size:0.8rem;cursor:pointer;width:100%;">🗑️ O'chirish</button>
          </div>
        </td>
      </tr>
    `;
  }

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.25rem;">
      <div>
        <h3 style="font-weight:800;font-size:1.15rem;">🏪 Ombor — Barcha Mahsulotlar (${products.length} ta)</h3>
        <p style="font-size:0.85rem;color:#64748b;margin-top:0.2rem;">
          Jami ombor: <b>${totalStock} dona</b> &nbsp;|&nbsp;
          <span style="color:#ef4444;font-weight:700;">⚠️ Kam qolgan: ${lowStock} ta</span>
        </p>
      </div>
      <button onclick="renderOmborTabPublic()" style="background:#f1f5f9;color:#1e293b;font-weight:700;padding:0.5rem 1rem;border-radius:8px;font-size:0.85rem;cursor:pointer;">🔄 Yangilash</button>
    </div>
    <div class="table-responsive-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th style="min-width:240px;">📦 Mahsulot</th>
            <th>Kategoriya</th>
            <th>Ombor soni</th>
            <th>Joriy Narx</th>
            <th>Chegirma %</th>
            <th>Kun Taklifi</th>
            <th style="min-width:220px;">Amallar</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

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

window.deleteProductById = function(productId) {
  const products = getAdminProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx < 0) return;
  const item = products[idx];
  if (confirm('"' + item.name + '" ni o\'chirib tashlashni xohlaysizmi?')) {
    window.allProductsList.splice(idx, 1);
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    if (typeof window.deleteSupabaseProduct === 'function') window.deleteSupabaseProduct(productId);
    if (window.filterProductsBySearch) window.filterProductsBySearch('');
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    if(window.showToast) showToast('"' + item.name + '" o\'chirildi!', 'info');
    renderOmborTab();
    renderChegirmaTab();
    renderAccountingTab();
  }
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

/* =================== ADD NEW PRODUCT =================== */
function handleFileInputChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImageBase64 = e.target.result;
    const previewImg = document.getElementById('newProdImgPreview');
    const previewWrap = document.getElementById('newProdImgPreviewWrap');
    if (previewImg) previewImg.src = uploadedImageBase64;
    if (previewWrap) previewWrap.style.display = 'block';
    if(window.showToast) showToast('Rasm muvaffaqiyatli yuklandi!', 'success');
  };
  reader.readAsDataURL(file);
}

function handleAddNewProductSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('newProdName')?.value || '';
  const category = document.getElementById('newProdCategory')?.value || 'smartfonlar';
  const price = parseInt(document.getElementById('newProdPrice')?.value || '0');
  const stock = parseInt(document.getElementById('newProdStock')?.value || '10');
  const isFlash = document.getElementById('newProdIsFlash')?.checked || false;
  const imageUrl = document.getElementById('newProdImage')?.value || '';
  const desc = document.getElementById('newProdDesc')?.value || '';
  const finalImage = uploadedImageBase64 || imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
  const categoryNames = { smartfonlar:'Smartfonlar', kompyuterlar:'Kompyuterlar', 'tv-audio':'TV va Audio', 'maishiy-texnika':'Maishiy texnika', iqlim:'Iqlim texnikasi' };
  if (!name || !price) { if(window.showToast) showToast("Iltimos, nom va narxni kiriting!", 'danger'); return; }

  const newProduct = {
    id: Date.now(),
    name, category, categoryName: categoryNames[category] || 'Boshqa',
    brand: 'Yangi', price,
    oldPrice: Math.round(price * 1.18),
    monthlyPrice: Math.round(price / 12),
    stock: stock || 10,
    rating: 5.0, reviews: 0,
    isFlashDeal: isFlash,
    badge: isFlash ? 'SUPER CHEGIRMA' : 'YANGI',
    badgeColor: isFlash ? 'danger' : 'accent',
    image: finalImage, description: desc
  };

  if (!window.allProductsList) window.allProductsList = [];
  window.allProductsList.unshift(newProduct);
  if (window.saveProductsToStorage) window.saveProductsToStorage();
  if(window.showToast) showToast('"' + name + '" do\'konga qo\'shildi! 🎉', 'success');

  event.target.reset();
  uploadedImageBase64 = '';
  const previewWrap = document.getElementById('newProdImgPreviewWrap');
  if (previewWrap) previewWrap.style.display = 'none';

  if (window.filterProductsBySearch) window.filterProductsBySearch('');
  if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  renderOmborTab();
  renderChegirmaTab();
  renderAccountingTab();
}

/* =================== DOM READY =================== */
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderProfileButton();
  const loginForm = document.getElementById('authLoginForm');
  const addProdForm = document.getElementById('addNewProductForm');
  const fileInput = document.getElementById('newProdFileInput');
  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (addProdForm) addProdForm.addEventListener('submit', handleAddNewProductSubmit);
  if (fileInput) fileInput.addEventListener('change', handleFileInputChange);
});
