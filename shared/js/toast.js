/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Toast Notification Service
   ========================================================================== */

function showToast(message, type = 'success') {
  let container = document.getElementById('toastNotificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastNotificationContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';

  let icon = '✓';
  if (type === 'info') icon = 'ℹ';
  if (type === 'warning') icon = '⚠️';
  if (type === 'danger') icon = '✕';

  toast.innerHTML = `
    <span style="font-size:1.1rem; color:var(--tm-yellow);">${icon}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
