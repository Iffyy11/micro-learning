export function LoadingSpinner(options = {}) {
  const {
    size = 'medium',
    text = 'Loading...',
    fullScreen = false
  } = options;

  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const html = `
    <div class="loading-spinner ${fullScreen ? 'loading-fullscreen' : ''}" role="status" aria-live="polite">
      <div class="spinner ${sizeClasses[size]}">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      ${text ? `<p class="loading-text">${text}</p>` : ''}
    </div>
  `;

  return {
    render: () => html,
    show: (container) => {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (container) {
        container.innerHTML = html;
      }
    },
    hide: (container) => {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (container) {
        const spinner = container.querySelector('.loading-spinner');
        if (spinner) {
          spinner.remove();
        }
      }
    }
  };
}

export function showLoadingOverlay(text = 'Loading...') {
  const existingOverlay = document.querySelector('.loading-overlay');
  if (existingOverlay) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = LoadingSpinner({ size: 'large', text, fullScreen: true }).render();
  document.body.appendChild(overlay);
  
  document.body.style.overflow = 'hidden';
}

export function hideLoadingOverlay() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
}
