/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Top Bar Interactive Modals Logic
   ========================================================================== */

let selectedCityName = localStorage.getItem('texnomart_user_city') || 'Toshkent';

function updateSelectedCityDisplay() {
  const cityLabel = document.getElementById('selectedCityName');
  if (cityLabel) cityLabel.textContent = selectedCityName;
}

function openTopBarModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeTopBarModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

window.selectCity = function(cityName) {
  selectedCityName = cityName;
  localStorage.setItem('texnomart_user_city', cityName);
  updateSelectedCityDisplay();
  closeTopBarModal('cityModalOverlay');
  showToast(`Sizning shahringiz ${cityName} ga o'zgartirildi!`, 'info');
};

document.addEventListener('DOMContentLoaded', () => {
  updateSelectedCityDisplay();

  // Top Bar Triggers
  const cityBtn = document.getElementById('citySelectorBtn');
  const storesBtn = document.getElementById('topLinkStores');
  const b2bBtn = document.getElementById('topLinkB2B');
  const paymentsBtn = document.getElementById('topLinkPayments');

  if (cityBtn) cityBtn.addEventListener('click', () => openTopBarModal('cityModalOverlay'));
  if (storesBtn) storesBtn.addEventListener('click', () => openTopBarModal('storesModalOverlay'));
  if (b2bBtn) b2bBtn.addEventListener('click', () => openTopBarModal('b2bModalOverlay'));
  if (paymentsBtn) paymentsBtn.addEventListener('click', () => openTopBarModal('paymentsModalOverlay'));

  // Close Buttons
  document.querySelectorAll('.topbar-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.topbar-modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // B2B Form Submission
  const b2bForm = document.getElementById('b2bSubmitForm');
  if (b2bForm) {
    b2bForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const compName = document.getElementById('b2bCompanyName').value;
      showToast(`Rahmat! "${compName}" uchun B2B ariza qabul qilindi. Tez orada bog'lanamiz!`, 'success');
      closeTopBarModal('b2bModalOverlay');
      b2bForm.reset();
    });
  }
});
