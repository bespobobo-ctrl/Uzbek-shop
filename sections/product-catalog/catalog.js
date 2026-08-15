/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Catalog Component & Data Manager
   ========================================================================== */

const PRODUCTS_STORAGE_KEY = 'texnomart_all_products';

const fallbackProductsData = [
  { id: 101, name: "Smartfon Apple iPhone 15 Pro 128GB Natural Titanium", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Apple", price: 14200000, oldPrice: 15800000, monthlyPrice: 1450000, stock: 12, rating: 4.9, reviews: 128, badge: "SUPER NARX", badgeColor: "accent", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "A17 Pro chip, Titanium korpus, 48 MP Action kamera va Dynamic Island." },
  { id: 102, name: "Smartfon Samsung Galaxy S24 Ultra 12/512GB Titanium Black", category: "smartfonlar", categoryName: "Smartfonlar", brand: "Samsung", price: 15900000, oldPrice: 17200000, monthlyPrice: 1620000, stock: 8, rating: 4.9, reviews: 94, badge: "0-0-12", badgeColor: "primary", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Galaxy AI imkoniyatlari, 200MP kamera, S-Pen ruchkasi va Snapdragon 8 Gen 3." },
  { id: 103, name: "Noutbuk Apple MacBook Air 13 M2 8/256GB Midnight", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "Apple", price: 12800000, oldPrice: 14100000, monthlyPrice: 1290000, stock: 5, rating: 4.8, reviews: 65, badge: "HIT SOTUV", badgeColor: "accent", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "M2 protsessor, Liquid Retina ekrani, 18 soatgacha batareya va ingichka dizayn." },
  { id: 104, name: "Noutbuk ASUS TUF Gaming F15 i5-12500H RTX 3050 16GB", category: "kompyuterlar", categoryName: "Kompyuterlar", brand: "ASUS", price: 9800000, oldPrice: 10900000, monthlyPrice: 990000, stock: 14, rating: 4.7, reviews: 42, badge: "AKSIYA", badgeColor: "danger", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Kuchli o'yin noutbuki, 144Hz IPS ekran va harbiylarcha baquvvat korpus." },
  { id: 105, name: "Televizor Artel 55AU90G 4K UHD Smart Android TV", category: "tv-audio", categoryName: "TV va Audio", brand: "Artel", price: 4800000, oldPrice: 5300000, monthlyPrice: 490000, stock: 20, rating: 4.6, reviews: 88, badge: "0% OLDINDAN TO'LOV", badgeColor: "primary", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "55 dyuymli 4K UHD tasvirlash, Android TV va ovozli boshqaruv pulti." },
  { id: 106, name: "Muzlatgich LG GR-B569BLCZ No Frost Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "LG", price: 8600000, oldPrice: 9400000, monthlyPrice: 870000, stock: 7, rating: 4.9, reviews: 31, badge: "TOP KAFOLAT", badgeColor: "accent", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Smart Inverter kompressor, Total No Frost va energiya tejamkor A++ sinf." },
  { id: 107, name: "Kir yuvish mashinasi Bosch WAN24200ME 8 kg Inverter", category: "maishiy-texnika", categoryName: "Maishiy texnika", brand: "Bosch", price: 6200000, oldPrice: 6900000, monthlyPrice: 630000, stock: 3, rating: 4.9, reviews: 56, badge: "GERMAN QUALITY", badgeColor: "primary", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80", isFlashDeal: true, description: "EcoSilence Drive vositasi, anti-vibratsiya paneli va gigiyenik bug'da yuvish." },
  { id: 108, name: "Konditsioner Haier Tundra Inverter 12 HSU-12H", category: "iqlim", categoryName: "Iqlim texnikasi", brand: "Haier", price: 4300000, oldPrice: 4800000, monthlyPrice: 440000, stock: 18, rating: 4.7, reviews: 29, badge: "BEPUL O'RNATISH", badgeColor: "accent", image: "https://images.unsplash.com/photo-1631545806604-e34988f57fa5?auto=format&fit=crop&w=600&q=80", isFlashDeal: false, description: "Inverter dvigatel, 35-40 m² maydonga mo'ljallangan va jim ishlash rejimi." },
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

// Synchronously initialize window.allProductsList immediately from localStorage (or seed once)
window.allProductsList = (function() {
  try {
    var raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw !== null) {
      var stored = JSON.parse(raw);
      if (Array.isArray(stored)) {
        return stored;
      }
    }
  } catch(e) {}
  var initial = JSON.parse(JSON.stringify(fallbackProductsData));
  try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initial)); } catch(e) {}
  return initial;
})();

let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentSortOrder = 'default';

async function initCatalogData() {
  try {
    // 1. Retrieve products directly from unified storage
    var raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw !== null) {
      try {
        var stored = JSON.parse(raw);
        if (Array.isArray(stored)) {
          window.allProductsList = stored;
        }
      } catch(e) {}
    } else {
      window.allProductsList = JSON.parse(JSON.stringify(fallbackProductsData));
      try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList)); } catch(e) {}
    }

    // Ensure stock field on all items
    window.allProductsList.forEach(p => { if (typeof p.stock !== 'number') p.stock = 10; });

    renderCatalogGrid();
    if (window.renderFlashDealsSection) window.renderFlashDealsSection();
    if (window.renderAdminDashboardTabs) window.renderAdminDashboardTabs();
    console.log('Catalog synchronized: ' + window.allProductsList.length + ' mahsulot ✅');
  } catch (err) {
    console.error('Catalog init error:', err);
  }
}

window.saveProductsToStorage = function() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
  // Sync to Supabase in background if enabled
  if (typeof window.upsertSupabaseProduct === 'function') {
    (window.allProductsList || []).forEach(p => {
      window.upsertSupabaseProduct(p);
    });
  }
};

window.forceSyncFullCatalog = function() {
  window.allProductsList = JSON.parse(JSON.stringify(fallbackProductsData));
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.allProductsList));
  renderCatalogGrid();
  if (window.renderFlashDealsSection) window.renderFlashDealsSection();
  if (window.renderAdminDashboardTabs) window.renderAdminDashboardTabs();
  if (window.showToast) window.showToast('Baza to\'liq yangilandi: ' + window.allProductsList.length + ' ta tovar! 🚀', 'success');
};

function getFilteredProductsList() {
  return (window.allProductsList || []).filter(item => {
    const matchCat = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;
    const matchSearch = item.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                        (item.description && item.description.toLowerCase().includes(currentSearchQuery.toLowerCase()));
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (currentSortOrder === 'price-low') return a.price - b.price;
    if (currentSortOrder === 'price-high') return b.price - a.price;
    if (currentSortOrder === 'monthly') return a.monthlyPrice - b.monthlyPrice;
    if (currentSortOrder === 'rating') return b.rating - a.rating;
    return a.id - b.id;
  });
}

function renderCatalogGrid() {
  const container = document.getElementById('mainProductsGrid');
  if (!container) return;

  const items = getFilteredProductsList();
  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <h3>Mahsulotlar topilmadi</h3>
        <p>Boshqa kategoriya yoki qidiruv so'rovini tanlab ko'ring.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(product => renderSingleProductCardHTML(product)).join('');
}

window.filterProductsBySearch = function(query) {
  currentSearchQuery = query;
  renderCatalogGrid();
};

document.addEventListener('DOMContentLoaded', () => {
  initCatalogData();

  const categoryBtns = document.querySelectorAll('.cat-pill-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.getAttribute('data-cat');
      renderCatalogGrid();
    });
  });

  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortOrder = e.target.value;
      renderCatalogGrid();
    });
  }
});
