/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Create element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Element attributes
 * @param {string|Array} content - Element content
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attrs = {}, content = '') {
  const element = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  if (Array.isArray(content)) {
    content.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  } else if (typeof content === 'string') {
    element.textContent = content;
  }
  
  return element;
}

/**
 * Query selector with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {HTMLElement|null} Found element
 */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query all with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {Array} Array of elements
 */
export function qsAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Add event listener with cleanup
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function addListener(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Show element
 * @param {HTMLElement} element - Element to show
 */
export function show(element) {
  element.style.display = '';
  element.removeAttribute('hidden');
}

/**
 * Hide element
 * @param {HTMLElement} element - Element to hide
 */
export function hide(element) {
  element.style.display = 'none';
  element.setAttribute('hidden', 'true');
}

/**
 * Toggle element visibility
 * @param {HTMLElement} element - Element to toggle
 */
export function toggle(element) {
  if (element.style.display === 'none' || element.hasAttribute('hidden')) {
    show(element);
  } else {
    hide(element);
  }
}
