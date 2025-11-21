/**
 * Array Utilities
 * Pure functions for array manipulation
 */

/**
 * Remove duplicates from array
 * @param {Array} arr - Input array
 * @returns {Array} Array with duplicates removed
 */
export function removeDuplicates(arr) {
  return [...new Set(arr)];
}

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentage(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Chunk array into smaller arrays
 * @param {Array} arr - Input array
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param {Array} arr - Input array
 * @returns {Array} Shuffled array
 */
export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sort array of objects by property
 * @param {Array} arr - Array of objects
 * @param {string} key - Property key to sort by
 * @param {boolean} ascending - Sort direction
 * @returns {Array} Sorted array
 */
export function sortByProperty(arr, key, ascending = true) {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
}
