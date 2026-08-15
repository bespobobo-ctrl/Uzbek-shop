/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Compare Component Logic & Manager
   ========================================================================== */

function toggleCompareModal(open) {
  const modal = document.getElementById('compareModalOverlay');
  if (modal) {
    if (open) {
      modal.classList.add('active');
      window.renderCompareModal();
    } else {
      modal.classList.remove('active');
    }
  }
}

window.openCompareModal = function() {
  toggleCompareModal(true);
};

window.closeCompareModal = function() {
  toggleCompareModal(false);
};

window.clearAllCompare = function() {
  const currentList = getCompare();
  if (!currentList || currentList.length === 0) {
    if (window.showToast) showToast("Taqqoslash ro'yxati allaqachon bo'sh!", 'info');
    return;
  }
  setStorageData(STORAGE_KEYS.COMPARE, []);
  if (window.showToast) showToast("Taqqoslash ro'yxati to'liq tozalandi! 🧹", 'success');
  window.renderCompareModal();
};

window.removeCompareItem = function(id) {
  let compare = getCompare();
  const item = compare.find(p => p.id === id);
  compare = compare.filter(p => p.id !== id);
  setStorageData(STORAGE_KEYS.COMPARE, compare);
  if (window.showToast) showToast(`"${item ? item.name : 'Mahsulot'}" taqqoslashdan olib tashlandi.`, 'info');
  window.renderCompareModal();
};

window.renderCompareModal = function() {
  const container = document.getElementById('compareTableContainer');
  const clearBtn = document.getElementById('clearCompareBtn');
  if (!container) return;

  const compareList = getCompare();

  // Control Clear All button visibility
  if (clearBtn) {
    clearBtn.style.display = compareList.length > 0 ? 'inline-flex' : 'none';
  }

  if (compareList.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3.5rem 1.5rem; color:var(--text-muted);">
        <div style="font-size:3.5rem; margin-bottom:1rem; opacity:0.8;">⚖️</div>
        <h4 style="font-weight:800; font-size:1.2rem; color:var(--tm-dark); margin-bottom:0.4rem;">Taqqoslash ro'yxati bo'sh</h4>
        <p style="font-size:0.9rem; color:#64748b; margin-bottom:1.5rem;">Katalogdan mahsulotlarni ⚖️ belgisini bosib taqqoslashga qo'shing.</p>
        <button onclick="toggleCompareModal(false)" style="padding:0.75rem 1.5rem; background:var(--tm-yellow); font-weight:800; border:none; border-radius:10px; cursor:pointer; font-size:0.9rem;">
          🛍️ Tovarlarni Ko'rish
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table class="compare-table">
        <thead>
          <tr>
            <th style="min-width:140px; text-align:left; background:#f8fafc; font-weight:800;">Parametr</th>
            ${compareList.map(item => `
              <th style="min-width:200px; position:relative; vertical-align:top; padding:1.25rem 1rem;">
                <button onclick="removeCompareItem(${item.id})" title="Taqqoslashdan o'chirish" style="position:absolute; top:8px; right:8px; width:26px; height:26px; border-radius:50%; background:#fee2e2; color:#dc2626; border:none; cursor:pointer; font-size:0.8rem; display:inline-flex; align-items:center; justify-content:center; transition:all 0.2s ease;">
                  ✕
                </button>
                <img src="${item.image}" alt="${item.name}" style="width:80px; height:80px; object-fit:contain; border-radius:8px; margin-bottom:0.75rem; background:#ffffff; padding:4px;">
                <div style="font-size:0.88rem; font-weight:700; line-height:1.35; color:#0f172a; margin-bottom:0.5rem;">
                  ${item.name}
                </div>
                <button onclick="addToCartById(${item.id}); toggleCompareModal(false);" style="width:100%; padding:0.45rem 0.75rem; background:#0f172a; color:#ffffff; font-size:0.78rem; font-weight:700; border:none; border-radius:8px; cursor:pointer; margin-top:0.35rem;">
                  🛒 Savatchaga
                </button>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:700; background:#f8fafc; text-align:left;">Narx</td>
            ${compareList.map(item => `<td style="font-weight:800; font-size:1.05rem; color:#0f172a;">${formatUZS(item.price)}</td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight:700; background:#f8fafc; text-align:left;">Oylik to'lov (12 oy)</td>
            ${compareList.map(item => `<td style="font-weight:700; color:#d97706; background:#fffbeb;">${formatUZS(item.monthlyPrice || Math.round(item.price / 12))} / oy</td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight:700; background:#f8fafc; text-align:left;">Kategoriya</td>
            ${compareList.map(item => `<td>${item.categoryName || item.category || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight:700; background:#f8fafc; text-align:left;">Reyting</td>
            ${compareList.map(item => `<td style="color:#eab308; font-weight:700;">★ ${item.rating || 4.9} <span style="color:#64748b; font-weight:400;">(${item.reviews || 42} izoh)</span></td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight:700; background:#f8fafc; text-align:left;">Brend</td>
            ${compareList.map(item => `<td style="font-weight:700;">${item.brand || 'UzbekShop'}</td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight:700; background:#f8fafc; text-align:left;">Mavjudligi</td>
            ${compareList.map(item => `<td style="color:#16a34a; font-weight:700;">🟢 Omborda bor (${item.stock || 12} dona)</td>`).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openCompareBtn');
  const closeBtn = document.getElementById('closeCompareBtn');

  if (openBtn) openBtn.addEventListener('click', () => toggleCompareModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleCompareModal(false));
});
