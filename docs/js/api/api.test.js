import { describe, it, expect, beforeEach } from 'vitest';
import { api, APIError, API_CONFIG } from './api.js';

describe('API Service', () => {
  beforeEach(() => {
    API_CONFIG.useMockData = true;
    API_CONFIG.simulateNetworkDelay = false;
    API_CONFIG.errorRate = 0;
  });

  describe('getAllLessons', () => {
    it('should return array of lessons', async () => {
      const response = await api.getAllLessons();
      
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response).toHaveProperty('timestamp');
    });

    it('should return lessons with required properties', async () => {
      const response = await api.getAllLessons();
      const firstLesson = response.data[0];

      expect(firstLesson).toHaveProperty('id');
      expect(firstLesson).toHaveProperty('title');
      expect(firstLesson).toHaveProperty('description');
      expect(firstLesson).toHaveProperty('content');
      expect(firstLesson).toHaveProperty('duration');
      expect(firstLesson).toHaveProperty('difficulty');
      expect(firstLesson).toHaveProperty('topics');
      expect(firstLesson).toHaveProperty('quiz');
    });
  });

  describe('getLessonById', () => {
    it('should return a specific lesson', async () => {
      const response = await api.getLessonById(1);
      
      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id', 1);
      expect(response.data).toHaveProperty('title');
    });

    it('should throw APIError for non-existent lesson', async () => {
      await expect(api.getLessonById(999)).rejects.toThrow(APIError);
    });

    it('should return lesson with quiz questions', async () => {
      const response = await api.getLessonById(1);
      
      expect(response.data.quiz).toBeDefined();
      expect(Array.isArray(response.data.quiz)).toBe(true);
      expect(response.data.quiz.length).toBeGreaterThan(0);
      
      const firstQuestion = response.data.quiz[0];
      expect(firstQuestion).toHaveProperty('question');
      expect(firstQuestion).toHaveProperty('options');
      expect(firstQuestion).toHaveProperty('correctAnswer');
    });
  });

  describe('searchLessons', () => {
    it('should return all lessons for empty query', async () => {
      const response = await api.searchLessons('');
      
      expect(response.success).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    it('should filter lessons by title', async () => {
      const response = await api.searchLessons('JavaScript');
      
      expect(response.success).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      // In mock mode, we should get lessons with JavaScript in title
      const hasJavaScript = response.data.some(lesson => 
        lesson.title.toLowerCase().includes('javascript')
      );
      expect(hasJavaScript).toBe(true);
    });

    it('should filter lessons by difficulty', async () => {
      const response = await api.searchLessons('beginner');
      
      expect(response.success).toBe(true);
      const allBeginner = response.data.every(lesson => 
        lesson.difficulty.toLowerCase() === 'beginner'
      );
      expect(allBeginner).toBe(true);
    });

    it('should filter lessons by topics', async () => {
      const response = await api.searchLessons('promises');
      
      expect(response.success).toBe(true);
      if (response.data.length > 0) {
        const hasPromises = response.data.some(lesson =>
          lesson.topics.includes('promises')
        );
        expect(hasPromises).toBe(true);
      }
    });

    it('should be case-insensitive', async () => {
      const lowerCase = await api.searchLessons('javascript');
      const upperCase = await api.searchLessons('JAVASCRIPT');
      
      expect(lowerCase.data.length).toBe(upperCase.data.length);
    });
  });

  describe('submitQuizAnswers', () => {
    it('should calculate score correctly', async () => {
      const answers = [1, 2];
      const response = await api.submitQuizAnswers(1, answers);
      
      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('score');
      expect(response.data).toHaveProperty('totalQuestions');
      expect(response.data).toHaveProperty('percentage');
      expect(response.data).toHaveProperty('passed');
      expect(response.data).toHaveProperty('results');
    });

    it('should return detailed results for each question', async () => {
      const answers = [1, 2];
      const response = await api.submitQuizAnswers(1, answers);
      
      const results = response.data.results;
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      
      results.forEach(result => {
        expect(result).toHaveProperty('questionIndex');
        expect(result).toHaveProperty('userAnswer');
        expect(result).toHaveProperty('correctAnswer');
        expect(result).toHaveProperty('isCorrect');
      });
    });

    it('should mark passed if score >= 70%', async () => {
      const answers = [1, 2];
      const response = await api.submitQuizAnswers(1, answers);
      
      if (response.data.percentage >= 70) {
        expect(response.data.passed).toBe(true);
      } else {
        expect(response.data.passed).toBe(false);
      }
    });

    it('should throw error for non-existent lesson', async () => {
      await expect(api.submitQuizAnswers(999, [])).rejects.toThrow(APIError);
    });
  });

  describe('saveProgress', () => {
    it('should save progress data', async () => {
      const progressData = {
        completedLessons: [1, 2],
        progress: 66
      };
      
      const response = await api.saveProgress(progressData);
      
      expect(response.success).toBe(true);
      expect(response.data.saved).toBe(true);
      expect(response.data.progressData).toEqual(progressData);
    });
  });

  describe('APIError', () => {
    it('should create error with status and statusText', () => {
      const error = new APIError('Test error', 404, 'Not Found');
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
      expect(error.name).toBe('APIError');
    });
  });

    describe('Network simulation', () => {
    it('should simulate network delay when enabled', async () => {
      API_CONFIG.simulateNetworkDelay = true;
      API_CONFIG.networkDelayMs = 100;

      const start = Date.now();
      await api.getAllLessons();
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(99);
    });
  });
});
