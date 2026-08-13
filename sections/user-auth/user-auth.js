/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Admin Personal Cabinet & Telegram Bot Integration
   ========================================================================== */

const ADMIN_SESSION_KEY = 'texnomart_admin_logged';
const TELEGRAM_CHAT_ID_KEY = 'texnomart_telegram_chat_id';
let isAdminLoggedIn = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY)) || false;
let uploadedImageBase64 = "";

let storeOrdersList = JSON.parse(localStorage.getItem('texnomart_orders')) || [
  { id: 1001, customer: "Sardor Rahimov", phone: "+998 90 123 45 67", address: "Toshkent sh., Yunusobod 12", product: "iPhone 15 Pro 128GB", amount: 14200000, date: "2026-08-12", status: "Bajarildi", statusType: "success" },
  { id: 1002, customer: "Jahongir Aliyev", phone: "+998 93 987 65 43", address: "Samarqand sh., Registon ko'ch.", product: "MacBook Air M2", amount: 12800000, date: "2026-08-13", status: "Yetkazilmoqda", statusType: "warning" }
];

function toggleAuthModal(open) {
  const modal = document.getElementById('authModalOverlay');
  if (modal) {
    if (open) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      renderAdminCabinetView();
    } else {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
    }
  }
}

window.openAuthModal = function() {
  toggleAuthModal(true);
};

window.closeAuthModal = function() {
  toggleAuthModal(false);
};

function renderAdminCabinetView() {
  const loginView = document.getElementById('authLoginFormView');
  const adminDashboardView = document.getElementById('authAdminDashboardView');

  if (isAdminLoggedIn) {
    if (loginView) loginView.style.display = 'none';
    if (adminDashboardView) {
      adminDashboardView.classList.add('active');
      renderAccountingTab();
      renderOrdersTab();
      renderProductsPriceTab();
    }
  } else {
    if (loginView) loginView.style.display = 'block';
    if (adminDashboardView) adminDashboardView.classList.remove('active');
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const username = document.getElementById('authUsernameInput').value;
  const password = document.getElementById('authPasswordInput').value;

  if (password === '123' || (username === '123' && password === '123')) {
    isAdminLoggedIn = true;
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(true));
    updateHeaderProfileButton();
    renderAdminCabinetView();
    showToast("Xush kelibsiz! Boshqaruv va Telegram Bot paneli faollashtirildi.", "success");
  } else {
    showToast("Noto'g'ri login yoki parol! (Parol: 123)", "danger");
  }
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(false));
  updateHeaderProfileButton();
  renderAdminCabinetView();
  showToast("Boshqaruv panelidan chiqdingiz.", "info");
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

/* ================= 1. BUXGALTERIYA & TELEGRAM BOT SOZLAMASI ================= */
function renderAccountingTab() {
  const container = document.getElementById('accountingTabContent');
  if (!container) return;

  const currentChatId = localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || "";

  container.innerHTML = `
    <div class="kpi-cards-grid">
      <div class="kpi-card">
        <div class="kpi-card-icon">💰</div>
        <div class="kpi-card-title">Bir oylik jami savdo</div>
        <div class="kpi-card-value">${formatUZS(148500000)}</div>
        <div class="kpi-card-trend"><span>↑</span> +18.4% o'sish</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card-icon">📲</div>
        <div class="kpi-card-title">Telegram Bot Statusi</div>
        <div class="kpi-card-value" style="font-size:1.1rem; color:#16a34a;">🟢 Faol (8932753943)</div>
        <div class="kpi-card-trend"><span>⚡</span> Instant Buyurtma Xabari</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card-icon">📈</div>
        <div class="kpi-card-title">Oylik sof foyda</div>
        <div class="kpi-card-value">${formatUZS(22400000)}</div>
        <div class="kpi-card-trend"><span>↑</span> Foyda 15.1%</div>
      </div>
    </div>

    <!-- Telegram Bot Chat ID Configuration Card -->
    <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:18px; padding:1.5rem; margin-top:1.5rem;">
      <h4 style="font-weight:800; color:#166534; font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
        📲 Telegram Botga Buyurtma Yuborish Sozlamasi
      </h4>
      <p style="font-size:0.85rem; color:#15803d; margin-bottom:1rem;">
        Buyurtma tushganda Telegramingizga zudlik bilan xabar kelishi uchun <b>Chat ID</b> raqamingizni kiriting:
      </p>
      <div style="display:flex; gap:0.75rem;">
        <input type="text" id="tgAdminChatIdInput" value="${currentChatId}" placeholder="Masalan: 123456789" style="flex:1; padding:0.75rem 1rem; border:1px solid #86efac; border-radius:10px; font-weight:700;">
        <button onclick="saveTelegramChatId()" style="background:#16a34a; color:#ffffff; font-weight:800; padding:0.75rem 1.5rem; border-radius:10px; cursor:pointer;">💾 Chat ID Saqlash</button>
      </div>
    </div>
  `;
}

window.saveTelegramChatId = function() {
  const input = document.getElementById('tgAdminChatIdInput');
  if (input) {
    const val = input.value.trim();
    localStorage.setItem(TELEGRAM_CHAT_ID_KEY, val);
    showToast(`Telegram Chat ID (${val || 'o\'chirildi'}) muvaffaqiyatli saqlandi!`, 'success');
  }
};

/* ================= 2. TUSHGAN BUYURTMALAR ================= */
function renderOrdersTab() {
  const container = document.getElementById('ordersTabContent');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('texnomart_orders')) || storeOrdersList;

  if (orders.length === 0) {
    container.innerHTML = `<p style="padding:2rem; text-align:center; color:var(--text-muted);">Hozircha buyurtmalar yo'q.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mijoz Ismi</th>
            <th>Telefon</th>
            <th>Manzil</th>
            <th>Mahsulot</th>
            <th>Summa</th>
            <th>Holat</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><b>#${o.id}</b></td>
              <td><b>${o.customer}</b></td>
              <td>${o.phone}</td>
              <td>${o.address}</td>
              <td>${o.product}</td>
              <td><b style="color:var(--tm-dark);">${formatUZS(o.amount)}</b></td>
              <td><span class="order-status-pill ${o.statusType}">${o.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ================= 3. MAHSULOTLAR, NARX EDIT, CHEGIRMA VA O'CHIRISH ================= */
function renderProductsPriceTab() {
  const container = document.getElementById('productsPriceTabContent');
  if (!container) return;

  const products = window.allProductsList || [];

  if (products.length === 0) {
    container.innerHTML = `<p style="padding:2rem; text-align:center; color:var(--text-muted);">Do'konda mahsulotlar yo'q. Yangi mahsulot qo'shing!</p>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Mahsulot</th>
            <th>Kategoriya</th>
            <th>Joriy Narxi</th>
            <th>Super Chegirma Statusi</th>
            <th>Boshqaruv Amallari</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td style="display:flex; align-items:center; gap:0.75rem;">
                <img src="${p.image}" style="width:46px; height:46px; object-fit:cover; border-radius:8px;">
                <div>
                  <div style="font-weight:700;">${p.name}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${p.brand || 'UzbekShop'}</div>
                </div>
              </td>
              <td><span class="badge-pill dark">${p.categoryName}</span></td>
              <td>
                <input type="number" class="price-input-styled" id="priceInput_${p.id}" value="${p.price}">
              </td>
              <td>
                <button class="flash-toggle-btn ${p.isFlashDeal ? 'active' : ''}" onclick="toggleFlashDealStatus(${p.id})">
                  ${p.isFlashDeal ? '🔥 Chegirmada (Aktiv)' : '⚡ Chegirmaga Qo\'shish'}
                </button>
              </td>
              <td style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                <button class="save-price-btn-styled" onclick="saveUpdatedPrice(${p.id})">💾 Saqlash</button>
                <button class="delete-product-btn-styled" onclick="deleteProductById(${p.id})">🗑️ O'chirish</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.toggleFlashDealStatus = function(productId) {
  const item = window.allProductsList.find(p => p.id === productId);
  if (item) {
    item.isFlashDeal = !item.isFlashDeal;
    if (item.isFlashDeal) {
      item.oldPrice = Math.round(item.price * 1.2);
      showToast(`"${item.name}" Super Chegirmaga (Kun taklifi) qo'shildi! 🔥`, "success");
    } else {
      showToast(`"${item.name}" Super Chegirmadan olindi.`, "info");
    }
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    renderProductsPriceTab();
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  }
};

window.saveUpdatedPrice = function(productId) {
  const input = document.getElementById(`priceInput_${productId}`);
  if (!input) return;

  const newPrice = parseInt(input.value);
  if (!newPrice || newPrice <= 0) {
    showToast("Iltimos, to'g'ri narx kiriting", "danger");
    return;
  }

  const item = window.allProductsList.find(p => p.id === productId);
  if (item) {
    item.price = newPrice;
    item.monthlyPrice = Math.round(newPrice / 12);
    showToast(`"${item.name}" narxi ${formatUZS(newPrice)}ga o'zgartirildi!`, "success");
    if (window.saveProductsToStorage) window.saveProductsToStorage();
    if (window.filterProductsBySearch) window.filterProductsBySearch('');
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    renderProductsPriceTab();
  }
};

window.deleteProductById = function(productId) {
  const index = window.allProductsList.findIndex(p => p.id === productId);
  if (index >= 0) {
    const item = window.allProductsList[index];
    if (confirm(`Rostdan ham "${item.name}" mahsulotini do'kondan o'chirib tashlamoqchimisiz?`)) {
      window.allProductsList.splice(index, 1);
      showToast(`"${item.name}" do'kondan o'chirib tashlandi!`, "info");
      if (window.saveProductsToStorage) window.saveProductsToStorage();
      renderProductsPriceTab();
      if (window.filterProductsBySearch) window.filterProductsBySearch('');
      if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    }
  }
};

function handleFileInputChange(event) {
  const file = event.target.files[0];
  const previewImg = document.getElementById('newProdImgPreview');
  const previewWrap = document.getElementById('newProdImgPreviewWrap');

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImageBase64 = e.target.result;
      if (previewImg) previewImg.src = uploadedImageBase64;
      if (previewWrap) previewWrap.style.display = 'block';
      showToast("Rasm muvaffaqiyatli yuklandi!", "success");
    };
    reader.readAsDataURL(file);
  }
}

function handleAddNewProductSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('newProdName').value;
  const category = document.getElementById('newProdCategory').value;
  const price = parseInt(document.getElementById('newProdPrice').value);
  const isFlash = document.getElementById('newProdIsFlash') ? document.getElementById('newProdIsFlash').checked : false;
  const imageUrlInput = document.getElementById('newProdImage').value;
  const desc = document.getElementById('newProdDesc').value;

  const finalImage = uploadedImageBase64 || imageUrlInput || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80";

  const categoryNames = {
    "smartfonlar": "Smartfonlar",
    "kompyuterlar": "Kompyuterlar",
    "tv-audio": "TV va Audio",
    "maishiy-texnika": "Maishiy texnika",
    "iqlim": "Iqlim texnikasi"
  };

  const newProduct = {
    id: Date.now(),
    name: name,
    category: category,
    categoryName: categoryNames[category] || "Boshqa",
    brand: "Yangi",
    price: price,
    oldPrice: Math.round(price * 1.18),
    monthlyPrice: Math.round(price / 12),
    rating: 5.0,
    reviews: 1,
    isFlashDeal: isFlash,
    badge: isFlash ? "SUPER CHEGIRMA" : "YANGI",
    badgeColor: "yellow",
    image: finalImage,
    description: desc
  };

  window.allProductsList.unshift(newProduct);
  if (window.saveProductsToStorage) window.saveProductsToStorage();
  showToast(`Yangi mahsulot "${name}" ${isFlash ? 'Super Chegirma bilan ' : ''}do'konga qo'shildi!`, "success");
  
  event.target.reset();
  uploadedImageBase64 = "";
  const previewWrap = document.getElementById('newProdImgPreviewWrap');
  if (previewWrap) previewWrap.style.display = 'none';

  renderProductsPriceTab();
  if (window.filterProductsBySearch) window.filterProductsBySearch('');
  if (window.renderFlashDealsSection) window.renderFlashDealsSection();
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderProfileButton();

  const openBtn = document.getElementById('openUserAuthBtn');
  const closeBtn = document.getElementById('closeAuthModalBtn');
  const loginForm = document.getElementById('authLoginForm');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const modalOverlay = document.getElementById('authModalOverlay');
  const addProdForm = document.getElementById('addNewProductForm');
  const fileInput = document.getElementById('newProdFileInput');

  if (openBtn) openBtn.addEventListener('click', () => toggleAuthModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleAuthModal(false));
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) toggleAuthModal(false);
    });
  }

  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (logoutBtn) logoutBtn.addEventListener('click', handleAdminLogout);
  if (addProdForm) addProdForm.addEventListener('submit', handleAddNewProductSubmit);
  if (fileInput) fileInput.addEventListener('change', handleFileInputChange);

  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      adminTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) activeContent.style.display = 'block';
    });
  });
});
