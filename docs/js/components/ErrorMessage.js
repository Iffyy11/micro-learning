export function ErrorMessage(options = {}) {
  const {
    title = 'Something went wrong',
    message = 'An error occurred. Please try again.',
    type = 'error',
    retry = null,
    dismiss = null,
    fullScreen = false
  } = options;

  const typeClasses = {
    error: 'error-message-error',
    warning: 'error-message-warning',
    info: 'error-message-info'
  };

  const typeIcons = {
    error: '⚠️',
    warning: '⚡',
    info: 'ℹ️'
  };

  const html = `
    <div class="error-message ${typeClasses[type]} ${fullScreen ? 'error-fullscreen' : ''}" role="alert" aria-live="assertive">
      <div class="error-content">
        <div class="error-icon">${typeIcons[type]}</div>
        <div class="error-details">
          <h3 class="error-title">${title}</h3>
          <p class="error-text">${message}</p>
        </div>
      </div>
      <div class="error-actions">
        ${retry ? '<button class="btn btn-primary error-retry" aria-label="Retry">Try Again</button>' : ''}
        ${dismiss ? '<button class="btn btn-secondary error-dismiss" aria-label="Dismiss">Dismiss</button>' : ''}
      </div>
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
        
        if (retry) {
          const retryBtn = container.querySelector('.error-retry');
          if (retryBtn) {
            retryBtn.addEventListener('click', retry);
          }
        }
        
        if (dismiss) {
          const dismissBtn = container.querySelector('.error-dismiss');
          if (dismissBtn) {
            dismissBtn.addEventListener('click', dismiss);
          }
        }
      }
    }
  };
}

export function showErrorToast(message, duration = 5000) {
  const existingToast = document.querySelector('.error-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.innerHTML = `
    <div class="error-toast-content">
      <span class="error-toast-icon">⚠️</span>
      <span class="error-toast-message">${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('error-toast-show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('error-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function showNetworkError(retry) {
  return ErrorMessage({
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your connection and try again.',
    type: 'error',
    retry,
    fullScreen: true
  });
}

export function showNotFoundError(message = 'The requested resource was not found.') {
  return ErrorMessage({
    title: '404 - Not Found',
    message,
    type: 'warning',
    fullScreen: true
  });
}
