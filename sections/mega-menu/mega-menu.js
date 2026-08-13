/* Mega Menu Component Logic */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('openMegaMenuBtn');
  const megaMenu = document.getElementById('megaMenuOverlay');

  if (toggleBtn && megaMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      megaMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!megaMenu.contains(e.target) && e.target !== toggleBtn) {
        megaMenu.classList.remove('active');
      }
    });
  }
});
