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
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
