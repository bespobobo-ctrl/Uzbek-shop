/* Header Component Logic */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (window.filterProductsBySearch) {
        window.filterProductsBySearch(e.target.value);
      }
    });
  }

  // Explicit Auth Button Click Listener
  const authBtn = document.getElementById('openUserAuthBtn');
  if (authBtn) {
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.openAuthModal) {
        window.openAuthModal();
      }
    });
  }
});

// Delegated Global Click Listener for instant auth popup
document.addEventListener('click', (e) => {
  const target = e.target.closest('#openUserAuthBtn, #headerUserBtnText, #headerUserBtnIcon, .open-auth-trigger');
  if (target) {
    e.preventDefault();
    if (window.openAuthModal) {
      window.openAuthModal();
    }
  }
});
