/**
 * Tests for array utilities
 */

import { describe, it, expect } from 'vitest';
import { 
  removeDuplicates, 
  calculatePercentage, 
  chunkArray, 
  shuffleArray,
  sortByProperty 
} from '../utils/arrays.js';

describe('Array Utilities', () => {
  describe('removeDuplicates', () => {
    it('should remove duplicate values', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(removeDuplicates([])).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBe(33);
      expect(calculatePercentage(2, 3)).toBe(67);
    });

    it('should handle zero total', () => {
      expect(calculatePercentage(5, 0)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculatePercentage(1, 6)).toBe(17);
    });
  });

  describe('chunkArray', () => {
    it('should chunk array into specified size', () => {
      expect(chunkArray([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
      expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle empty array', () => {
      expect(chunkArray([], 2)).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('shuffleArray', () => {
    it('should return array with same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.length).toBe(arr.length);
    });

    it('should contain all original elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('sortByProperty', () => {
    const data = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 }
    ];

    it('should sort by property ascending', () => {
      const sorted = sortByProperty(data, 'name', true);
      expect(sorted[0].name).toBe('Alice');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('should sort by property descending', () => {
      const sorted = sortByProperty(data, 'age', false);
      expect(sorted[0].age).toBe(35);
      expect(sorted[2].age).toBe(25);
    });

    it('should not modify original array', () => {
      const original = [...data];
      sortByProperty(data, 'name');
      expect(data).toEqual(original);
    });
  });
});
