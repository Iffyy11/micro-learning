/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import { 
  validateAnswer, 
  validateLessonId, 
  validateProgress, 
  validateEmail,
  sanitizeHTML 
} from '../utils/validation.js';

describe('Validation Utilities', () => {
  describe('validateAnswer', () => {
    it('should return true for valid answer', () => {
      expect(validateAnswer('q1', 'a')).toBe(true);
      expect(validateAnswer('question-1', 'option-b')).toBe(true);
    });

    it('should return false for invalid answer', () => {
      expect(validateAnswer('', 'a')).toBe(false);
      expect(validateAnswer('q1', '')).toBe(false);
      expect(validateAnswer(null, 'a')).toBe(false);
      expect(validateAnswer('q1', null)).toBe(false);
    });
  });

  describe('validateLessonId', () => {
    it('should return true for valid lesson ID', () => {
      expect(validateLessonId('1')).toBe(true);
      expect(validateLessonId('123')).toBe(true);
    });

    it('should return false for invalid lesson ID', () => {
      expect(validateLessonId('abc')).toBe(false);
      expect(validateLessonId('1a')).toBe(false);
      expect(validateLessonId('')).toBe(false);
      expect(validateLessonId(null)).toBe(false);
    });
  });

  describe('validateProgress', () => {
    it('should return true for valid progress', () => {
      expect(validateProgress(0)).toBe(true);
      expect(validateProgress(50)).toBe(true);
      expect(validateProgress(100)).toBe(true);
    });

    it('should return false for invalid progress', () => {
      expect(validateProgress(-1)).toBe(false);
      expect(validateProgress(101)).toBe(false);
      expect(validateProgress('50')).toBe(false);
      expect(validateProgress(null)).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('sanitizeHTML', () => {
    it('should escape HTML entities', () => {
      expect(sanitizeHTML('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(sanitizeHTML('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
    });

    it('should handle plain text', () => {
      expect(sanitizeHTML('Hello World')).toBe('Hello World');
    });
  });
});
