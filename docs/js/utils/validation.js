/**
 * Validation Utilities
 * Pure functions for data validation
 */

/**
 * Validate quiz answer
 * @param {string} questionId - Question identifier
 * @param {string} answer - User's answer
 * @returns {boolean} Whether answer is valid
 */
export function validateAnswer(questionId, answer) {
  return typeof questionId === 'string' && 
         questionId.length > 0 && 
         typeof answer === 'string' && 
         answer.length > 0;
}

/**
 * Validate lesson ID
 * @param {string} lessonId - Lesson identifier
 * @returns {boolean} Whether lesson ID is valid
 */
export function validateLessonId(lessonId) {
  return typeof lessonId === 'string' && /^[0-9]+$/.test(lessonId);
}

/**
 * Validate progress value
 * @param {number} progress - Progress percentage
 * @returns {boolean} Whether progress is valid
 */
export function validateProgress(progress) {
  return typeof progress === 'number' && 
         progress >= 0 && 
         progress <= 100;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Whether email is valid
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

/**
 * Sanitize HTML string to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') {return '';}
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate URL to prevent javascript: and data: schemes
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is safe
 */
export function validateURL(url) {
  if (typeof url !== 'string') {return false;}
  const normalized = url.trim().toLowerCase();
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  return !dangerousProtocols.some(proto => normalized.startsWith(proto));
}

/**
 * Sanitize user input for safe display
 * @param {string} input - User input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input, maxLength = 1000) {
  if (typeof input !== 'string') {return '';}
  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);
  // Remove any control characters (use Unicode category for control characters)
  // Using Unicode property escape to avoid embedding raw control-byte escapes in the regex
  sanitized = sanitized.replace(/\p{Cc}/gu, '');
  return sanitizeHTML(sanitized);
}

/**
 * Validate quiz answer index
 * @param {number} answerIndex - Answer index
 * @param {number} maxOptions - Maximum number of options
 * @returns {boolean} Whether answer index is valid
 */
export function validateAnswerIndex(answerIndex, maxOptions = 4) {
  return Number.isInteger(answerIndex) && 
         answerIndex >= 0 && 
         answerIndex < maxOptions;
}
