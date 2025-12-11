/**
 * Array utility functions
 */

/**
 * Remove duplicate values from an array
 * @param {Array} arr - The array to process
 * @returns {Array} Array with duplicates removed
 */
export function removeDuplicates(arr) {
  return [...new Set(arr)];
}

/**
 * Calculate percentage and round to nearest integer
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {number} Percentage rounded to nearest integer
 */
export function calculatePercentage(value, total) {
  if (total === 0) {return 0;}
  return Math.round((value / total) * 100);
}

/**
 * Split array into chunks of specified size
 * @param {Array} arr - The array to chunk
 * @param {number} size - The chunk size
 * @returns {Array} Array of chunks
 */
export function chunkArray(arr, size) {
  if (arr.length === 0) {return [];}
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array using Fisher-Yates algorithm (returns new array)
 * @param {Array} arr - The array to shuffle
 * @returns {Array} New shuffled array
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
 * @param {Array} arr - The array to sort
 * @param {string} property - The property to sort by
 * @param {boolean} ascending - Sort order (default: true)
 * @returns {Array} New sorted array
 */
export function sortByProperty(arr, property, ascending = true) {
  const sorted = [...arr];
  sorted.sort((a, b) => {
    if (a[property] < b[property]) {return ascending ? -1 : 1;}
    if (a[property] > b[property]) {return ascending ? 1 : -1;}
    return 0;
  });
  return sorted;
}
