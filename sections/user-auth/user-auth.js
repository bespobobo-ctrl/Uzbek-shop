/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Admin Personal Cabinet & Full Warehouse System
   ========================================================================== */

const ADMIN_SESSION_KEY = 'texnomart_admin_logged';
const TELEGRAM_CHAT_ID_KEY = 'texnomart_telegram_chat_id';

const safeFormatUZS = (num) => {
  if (typeof formatUZS === 'function') return formatUZS(num);
  return (num || 0).toLocaleString('uz-UZ') + " so'm";
};

let isAdminLoggedIn = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY)) || false;
let uploadedImageBase64 = '';

let storeOrdersList = JSON.parse(localStorage.getItem('texnomart_orders')) || [
  { id: 1001, customer: 'Sardor Rahimov', phone: '+998 90 123 45 67', address: 'Toshkent sh., Yunusobod 12', product: 'iPhone 15 Pro 128GB', amount: 14200000, date: '2026-08-12', status: 'Bajarildi', statusType: 'success' },
  { id: 1002, customer: 'Jahongir Aliyev', phone: '+998 93 987 65 43', address: 'Samarqand sh., Registon ko\'ch.', product: 'MacBook Air M2', amount: 12800000, date: '2026-08-13', status: 'Yetkazilmoqda', statusType: 'warning' }
];

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
  console.log('openAuthModal() called from user-auth.js');
  toggleAuthModal(true);
};

window.closeAuthModal = function() {
  toggleAuthModal(false);
};

// Called from inline script after login to render all dashboard tabs
window.renderAdminDashboardTabs = function() {
  renderAccountingTab();
  renderOrdersTab();
  renderOmborTab();
  renderChegirmaTab();
};

// Called when modal opens to show correct view (login vs dashboard)
window.renderAdminView = function() {
  var stored = localStorage.getItem('texnomart_admin_logged');
  isAdminLoggedIn = stored === 'true';
  renderAdminCabinetView();
};

window.switchAuthToLoginView = function() {
  isAdminLoggedIn = false;
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(false));
  updateHeaderProfileButton();
  renderAdminCabinetView();
};

/* =================== LOGIN / LOGOUT =================== */
function handleLoginSubmit(event) {
  event.preventDefault();
  const username = (document.getElementById('authUsernameInput')?.value || '').trim();
  const password = (document.getElementById('authPasswordInput')?.value || '').trim();

  if (password === '123' || username === 'admin' || (username === '123' && password === '123')) {
    isAdminLoggedIn = true;
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(true));
    updateHeaderProfileButton();
    renderAdminCabinetView();
    showToast('Xush kelibsiz! Boshqaruv paneli faollashtirildi 🟢', 'success');
  } else {
    showToast("Noto'g'ri login yoki parol! Test: 123 / 123", 'danger');
  }
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(false));
  updateHeaderProfileButton();
  renderAdminCabinetView();
  showToast('Tizimdan chiqdingiz.', 'info');
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
      dashView.classList.add('active');
      dashView.style.display = 'block';
      renderAccountingTab();
      renderOrdersTab();
      renderOmborTab();
      renderChegirmaTab();
    }
  } else {
    if (loginView) loginView.style.display = 'block';
    if (dashView) {
      dashView.classList.remove('active');
      dashView.style.display = 'none';
    }
  }
}

/* =================== TAB 1: MOLIYA & TELEGRAM =================== */
function renderAccountingTab() {
  const container = document.getElementById('accountingTabContent');
  if (!container) return;
  const currentChatId = localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || '';

  const products = window.allProductsList || [];
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
        <div class="kpi-card-value" style="font-size:1rem; color:#16a34a;">🟢 Faol (8932753943)</div>
        <div class="kpi-card-trend"><span>⚡</span> Instant Buyurtma</div>
      </div>
    </div>
    <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:18px; padding:1.5rem; margin-top:1.5rem;">
      <h4 style="font-weight:800; color:#166534; font-size:1.05rem; margin-bottom:0.75rem;">
        📲 Telegram Chat ID Sozlamasi
      </h4>
      <p style="font-size:0.85rem; color:#15803d; margin-bottom:1rem;">
        Buyurtma tushganda Telegram xabar kelishi uchun Chat ID raqamingizni kiriting:
      </p>
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
    showToast(`Telegram Chat ID saqlandi!`, 'success');
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
      <button onclick="clearAllOrders()" style="background:#fee2e2; color:#dc2626; font-weight:700; padding:0.5rem 1rem; border-radius:8px; font-size:0.85rem; cursor:pointer;">
        🗑️ Barchasini Tozalash
      </button>
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
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><b>#${o.id}</b></td>
              <td><b>${o.customer || '-'}</b></td>
              <td>${o.phone || '-'}</td>
              <td>${o.address || '-'}</td>
              <td>${o.product || '-'}</td>
              <td><b style="color:var(--tm-dark);">${safeFormatUZS(o.amount)}</b></td>
              <td style="font-size:0.8rem;">${o.date || '-'}</td>
              <td><span class="order-status-pill ${o.statusType || 'warning'}">${o.status || 'Yangi'}</span></td>
            </tr>
          `).join('')}
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
    showToast("Barcha buyurtmalar tozalandi.", 'info');
  }
};

/* =================== TAB 3: OMBOR (WAREHOUSE) =================== */
function renderOmborTab() {
  const container = document.getElementById('omborTabContent');
  if (!container) return;
  const products = window.allProductsList || [];

  const categoryEmojis = {
    smartfonlar: '📱', kompyuterlar: '💻', 'tv-audio': '📺',
    'maishiy-texnika': '🧺', iqlim: '❄️'
  };

  const lowStockItems = products.filter(p => (p.stock || 0) <= 5).length;

  container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem;">
      <div>
        <h3 style="font-weight:800; font-size:1.15rem;">🏪 Ombor — Mahsulotlar Boshqaruvi</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">
          Jami: <b>${products.length} mahsulot</b> |
          <span style="color:#ef4444; font-weight:700;">⚠️ Kam qolgan: ${lowStockItems} ta</span>
        </p>
      </div>
    </div>
    <div class="table-responsive-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th style="min-width:220px;">Mahsulot</th>
            <th>Kategoriya</th>
            <th>Ombor (dona)</th>
            <th>Joriy Narx</th>
            <th>Chegirma Narxi</th>
            <th>Status</th>
            <th style="min-width:200px;">Amallar</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => {
            const stockNum = p.stock || 0;
            const stockColor = stockNum <= 3 ? '#dc2626' : stockNum <= 7 ? '#d97706' : '#16a34a';
            const discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            return `
            <tr>
              <td>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                  <img src="${p.image}" style="width:44px; height:44px; border-radius:8px; object-fit:cover; flex-shrink:0;">
                  <div>
                    <div style="font-weight:700; font-size:0.85rem; line-height:1.3; max-width:160px;">${p.name}</div>
                    <div style="font-size:0.72rem; color:var(--text-muted);">${p.brand || 'UzbekShop'}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge-pill dark" style="font-size:0.72rem;">
                  ${categoryEmojis[p.category] || '📦'} ${p.categoryName}
                </span>
              </td>
              <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <input type="number" id="stockInput_${p.id}" value="${stockNum}" min="0"
                    style="width:70px; padding:0.4rem 0.5rem; border:1.5px solid var(--border); border-radius:8px; font-weight:800; text-align:center; font-size:0.9rem; color:${stockColor};">
                  <button onclick="saveStock(${p.id})"
                    style="background:#e0f2fe; color:#0369a1; font-weight:700; padding:0.4rem 0.6rem; border-radius:8px; font-size:0.75rem; cursor:pointer; white-space:nowrap;">
                    💾 Saqlash
                  </button>
                </div>
                <div style="font-size:0.72rem; color:${stockColor}; font-weight:700; margin-top:3px;">
                  ${stockNum <= 3 ? '🔴 Tugayapti!' : stockNum <= 7 ? '🟡 Kam qoldi' : '🟢 Yetarli'}
                </div>
              </td>
              <td>
                <input type="number" id="priceInput_${p.id}" value="${p.price}"
                  style="width:120px; padding:0.4rem 0.6rem; border:1.5px solid var(--border); border-radius:8px; font-weight:800; font-size:0.88rem;">
              </td>
              <td>
                <div style="font-size:0.85rem; font-weight:700; color:#dc2626;">
                  ${p.oldPrice ? safeFormatUZS(p.oldPrice) : '—'}
                </div>
                ${discountPct > 0 ? `<span style="font-size:0.7rem; background:#fee2e2; color:#dc2626; padding:1px 6px; border-radius:4px; font-weight:800;">-${discountPct}%</span>` : ''}
              </td>
              <td>
                ${p.isFlashDeal
                  ? `<span style="background:#fef3c7; color:#b45309; padding:0.3rem 0.7rem; border-radius:20px; font-size:0.78rem; font-weight:800;">🔥 Chegirmada</span>`
                  : `<span style="background:#f1f5f9; color:#64748b; padding:0.3rem 0.7rem; border-radius:20px; font-size:0.78rem; font-weight:700;">Odatiy</span>`}
              </td>
              <td>
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                  <button onclick="saveOmborPrice(${p.id})"
                    style="background:var(--tm-yellow); color:#000; font-weight:800; padding:0.45rem 0.75rem; border-radius:8px; font-size:0.8rem; cursor:pointer;">
                    💾 Narx
                  </button>
                  <button onclick="toggleFlashFromOmbor(${p.id})"
                    style="background:${p.isFlashDeal ? '#fee2e2' : '#dcfce7'}; color:${p.isFlashDeal ? '#dc2626' : '#166534'}; font-weight:800; padding:0.45rem 0.75rem; border-radius:8px; font-size:0.8rem; cursor:pointer;">
                    ${p.isFlashDeal ? '❌ Chegirmadan chiqar' : '🔥 Chegirmaga qo\'sh'}
                  </button>
                  <button onclick="deleteProductById(${p.id})"
                    style="background:#fee2e2; color:#dc2626; font-weight:800; padding:0.45rem 0.6rem; border-radius:8px; font-size:0.8rem; cursor:pointer;">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.saveStock = function(productId) {
  const input = document.getElementById(`stockInput_${productId}`);
  if (!input) return;
  const newStock = parseInt(input.value);
  if (isNaN(newStock) || newStock < 0) { showToast("To'g'ri son kiriting!", 'danger'); return; }
  const item = window.allProductsList.find(p => p.id === productId);
  if (item) {
    item.stock = newStock;
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    showToast(`Ombor yangilandi: ${item.name} → ${newStock} dona`, 'success');
    renderOmborTab();
    renderAccountingTab();
  }
};

window.saveOmborPrice = function(productId) {
  const input = document.getElementById(`priceInput_${productId}`);
  if (!input) return;
  const newPrice = parseInt(input.value);
  if (!newPrice || newPrice <= 0) { showToast("To'g'ri narx kiriting!", 'danger'); return; }
  const item = window.allProductsList.find(p => p.id === productId);
  if (item) {
    item.price = newPrice;
    item.monthlyPrice = Math.round(newPrice / 12);
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    if (window.filterProductsBySearch) window.filterProductsBySearch('');
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    showToast(`Narx yangilandi: ${item.name} → ${safeFormatUZS(newPrice)}`, 'success');
    renderOmborTab();
  }
};

window.toggleFlashFromOmbor = function(productId) {
  const item = window.allProductsList.find(p => p.id === productId);
  if (!item) return;
  item.isFlashDeal = !item.isFlashDeal;
  if (item.isFlashDeal) {
    if (!item.oldPrice) item.oldPrice = Math.round(item.price * 1.2);
    showToast(`"${item.name}" 🔥 Kun Taklifiga qo'shildi!`, 'success');
  } else {
    showToast(`"${item.name}" chegirmadan chiqarildi.`, 'info');
  }
  if (window.saveProductsToStorage) window.saveProductsToStorage();
  if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  renderOmborTab();
  renderChegirmaTab();
  renderAccountingTab();
};

window.deleteProductById = function(productId) {
  const idx = window.allProductsList.findIndex(p => p.id === productId);
  if (idx >= 0) {
    const item = window.allProductsList[idx];
    if (confirm(`"${item.name}" ni o'chirib tashlashni xohlaysizmi?`)) {
      window.allProductsList.splice(idx, 1);
      if (window.saveProductsToStorage) window.saveProductsToStorage();
      if (window.filterProductsBySearch) window.filterProductsBySearch('');
      if (window.renderFlashDealsSection) window.renderFlashDealsSection();
      showToast(`"${item.name}" o'chirildi!`, 'info');
      renderOmborTab();
      renderChegirmaTab();
      renderAccountingTab();
    }
  }
};

/* =================== TAB 4: CHEGIRMALAR =================== */
function renderChegirmaTab() {
  const container = document.getElementById('chegirmaTabContent');
  if (!container) return;
  const products = window.allProductsList || [];
  const flashItems = products.filter(p => p.isFlashDeal);
  const normalItems = products.filter(p => !p.isFlashDeal);

  container.innerHTML = `
    <h3 style="font-weight:800; font-size:1.1rem; margin-bottom:1.25rem;">🔥 Chegirmalar Boshqaruvi</h3>

    <!-- Currently on sale -->
    <div style="margin-bottom:2rem;">
      <h4 style="font-size:0.95rem; font-weight:800; color:#dc2626; margin-bottom:1rem;">
        🔥 Hozir Chegirmada (${flashItems.length} ta tovar)
      </h4>
      ${flashItems.length === 0
        ? `<p style="color:var(--text-muted); font-size:0.9rem;">Hozircha chegirmadagi tovar yo'q.</p>`
        : `<div class="chegirma-cards-grid">
          ${flashItems.map(p => flashProductCard(p, true)).join('')}
        </div>`
      }
    </div>

    <!-- Not on sale (can be added) -->
    <div>
      <h4 style="font-size:0.95rem; font-weight:800; color:#16a34a; margin-bottom:1rem;">
        ➕ Chegirmaga Qo'shish Mumkin (${normalItems.length} ta tovar)
      </h4>
      ${normalItems.length === 0
        ? `<p style="color:var(--text-muted); font-size:0.9rem;">Barcha tovarlar chegirmada.</p>`
        : `<div class="chegirma-cards-grid">
          ${normalItems.map(p => flashProductCard(p, false)).join('')}
        </div>`
      }
    </div>
  `;
}

function flashProductCard(p, isFlash) {
  const discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return `
    <div class="chegirma-card ${isFlash ? 'chegirma-active' : ''}">
      <img src="${p.image}" style="width:56px; height:56px; object-fit:cover; border-radius:10px; flex-shrink:0;">
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700; font-size:0.85rem; line-height:1.3; margin-bottom:0.3rem;">${p.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem;">${p.categoryName}</div>
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <span style="font-weight:800; font-size:0.9rem; color:var(--tm-dark);">${safeFormatUZS(p.price)}</span>
          ${p.oldPrice && discountPct > 0 ? `<span style="font-size:0.75rem; text-decoration:line-through; color:var(--text-muted);">${safeFormatUZS(p.oldPrice)}</span>
          <span style="background:#fee2e2; color:#dc2626; padding:1px 7px; border-radius:20px; font-weight:800; font-size:0.72rem;">-${discountPct}%</span>` : ''}
        </div>
      </div>
      <button onclick="toggleFlashFromOmbor(${p.id})"
        style="background:${isFlash ? '#fee2e2' : '#dcfce7'}; color:${isFlash ? '#dc2626' : '#166534'};
        font-weight:800; padding:0.55rem 0.9rem; border-radius:10px; font-size:0.82rem; cursor:pointer; white-space:nowrap; flex-shrink:0;">
        ${isFlash ? '❌ Olib tashlash' : '🔥 Chegirmaga qo\'sh'}
      </button>
    </div>
  `;
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
    showToast('Rasm muvaffaqiyatli yuklandi!', 'success');
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
  const categoryNames = { smartfonlar: 'Smartfonlar', kompyuterlar: 'Kompyuterlar', 'tv-audio': 'TV va Audio', 'maishiy-texnika': 'Maishiy texnika', iqlim: 'Iqlim texnikasi' };

  if (!name || !price) { showToast("Iltimos, nom va narxni kiriting!", 'danger'); return; }

  const newProduct = {
    id: Date.now(),
    name, category,
    categoryName: categoryNames[category] || 'Boshqa',
    brand: 'Yangi',
    price,
    oldPrice: Math.round(price * 1.18),
    monthlyPrice: Math.round(price / 12),
    stock: stock || 10,
    rating: 5.0,
    reviews: 0,
    isFlashDeal: isFlash,
    badge: isFlash ? 'SUPER CHEGIRMA' : 'YANGI',
    badgeColor: isFlash ? 'danger' : 'accent',
    image: finalImage,
    description: desc
  };

  window.allProductsList.unshift(newProduct);
  if (window.saveProductsToStorage) window.saveProductsToStorage();
  showToast(`"${name}" do'konga qo'shildi! 🎉`, 'success');

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

  const closeBtn = document.getElementById('closeAuthModalBtn');
  const loginForm = document.getElementById('authLoginForm');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const modalOverlay = document.getElementById('authModalOverlay');
  const addProdForm = document.getElementById('addNewProductForm');
  const fileInput = document.getElementById('newProdFileInput');

  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); window.closeAuthModal(); });
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) window.closeAuthModal(); });
  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (logoutBtn) logoutBtn.addEventListener('click', handleAdminLogout);
  if (addProdForm) addProdForm.addEventListener('submit', handleAddNewProductSubmit);
  if (fileInput) fileInput.addEventListener('change', handleFileInputChange);

  // Tab navigation
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      const target = document.getElementById(targetTab);
      if (target) target.style.display = 'block';
    });
  });
});
