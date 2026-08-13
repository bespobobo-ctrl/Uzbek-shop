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
});
