/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Hero Banner & Benefit Cards Interactive Logic
   ========================================================================== */

function openHeroModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeHeroModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const cardDelivery = document.getElementById('heroCardDelivery');
  const cardWarranty = document.getElementById('heroCardWarranty');
  const cardReturns = document.getElementById('heroCardReturns');

  if (cardDelivery) cardDelivery.addEventListener('click', () => openHeroModal('deliveryModalOverlay'));
  if (cardWarranty) cardWarranty.addEventListener('click', () => openHeroModal('warrantyModalOverlay'));
  if (cardReturns) cardReturns.addEventListener('click', () => openHeroModal('returnsModalOverlay'));

  // Close Buttons
  document.querySelectorAll('.hero-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hero-modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });
});
