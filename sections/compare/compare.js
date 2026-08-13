/* Compare Component Logic */
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

window.renderCompareModal = function() {
  const container = document.getElementById('compareTableContainer');
  if (!container) return;

  const compareList = getCompare();
  if (compareList.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--text-muted);">
        ⚖️ Taqqoslash uchun mahsulotlar tanlanmagan
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="compare-table">
      <thead>
        <tr>
          <th>Parametr</th>
          ${compareList.map(item => `
            <th>
              <img src="${item.image}" style="width:70px; height:70px; object-fit:cover; border-radius:4px;"><br>
              ${item.name}
            </th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Narx</b></td>
          ${compareList.map(item => `<td style="font-weight:800; color:var(--tm-dark);">${formatUZS(item.price)}</td>`).join('')}
        </tr>
        <tr>
          <td><b>Oylik to'lov</b></td>
          ${compareList.map(item => `<td>${formatUZS(item.monthlyPrice)} / oy</td>`).join('')}
        </tr>
        <tr>
          <td><b>Reyting</b></td>
          ${compareList.map(item => `<td>★ ${item.rating} (${item.reviews})</td>`).join('')}
        </tr>
        <tr>
          <td><b>Brend</b></td>
          ${compareList.map(item => `<td>${item.brand || '-'}</td>`).join('')}
        </tr>
      </tbody>
    </table>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openCompareBtn');
  const closeBtn = document.getElementById('closeCompareBtn');

  if (openBtn) openBtn.addEventListener('click', () => toggleCompareModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleCompareModal(false));
});
