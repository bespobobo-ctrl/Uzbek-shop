/* ==========================================================================
   TEXNOMART / UZBEKSHOP - Toast Notification & Action Service
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
  let color = 'var(--tm-yellow)';
  if (type === 'info') { icon = 'ℹ'; color = '#38bdf8'; }
  if (type === 'warning') { icon = '⚠️'; color = '#fbbf24'; }
  if (type === 'danger') { icon = '✕'; color = '#f87171'; }

  toast.innerHTML = `
    <span style="font-size:1.1rem; color:${color}; flex-shrink:0;">${icon}</span>
    <div style="flex:1; font-weight:600; font-size:0.9rem;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => toast.remove(), 350);
  }, 3400);
}

// Interactive Toast with Undo Action
function showActionToast(message, actionText, actionCallback, duration = 6000) {
  let container = document.getElementById('toastNotificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastNotificationContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item toast-action-item';
  toast.style.cssText = `
    background: #0f172a;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 1.25rem;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  `;

  toast.innerHTML = `
    <span style="font-size:1.2rem; flex-shrink:0;">🗑️</span>
    <div style="flex:1; font-weight:600; font-size:0.88rem; line-height:1.3;">${message}</div>
    <button id="toastActionBtn" style="
      background: #FBC100;
      color: #000000;
      border: none;
      font-weight: 800;
      font-size: 0.82rem;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    ">${actionText}</button>
    <div class="toast-progress-bar" style="
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: #FBC100;
      width: 100%;
      transition: width ${duration}ms linear;
    "></div>
  `;

  container.appendChild(toast);

  // Trigger progress bar shrink
  setTimeout(() => {
    const pb = toast.querySelector('.toast-progress-bar');
    if (pb) pb.style.width = '0%';
  }, 50);

  const actionBtn = toast.querySelector('#toastActionBtn');
  let isHandled = false;

  if (actionBtn) {
    actionBtn.onclick = () => {
      if (isHandled) return;
      isHandled = true;
      toast.remove();
      if (typeof actionCallback === 'function') actionCallback();
    };
  }

  setTimeout(() => {
    if (!isHandled) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => toast.remove(), 350);
    }
  }, duration);
}

window.showToast = showToast;
window.showActionToast = showActionToast;
