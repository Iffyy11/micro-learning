/**
 * State Store - Centralized state management with observer pattern
 * Manages application state and notifies subscribers of changes
 */

export class StateStore {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.subscribers = new Map();
  }

  /**
   * Get current state
   * @returns {Object} Current state object
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Get specific state value by key
   * @param {string} key - State key
   * @returns {any} State value
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Update state and notify subscribers
   * @param {Object} updates - Object with state updates
   */
  setState(updates) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Notify all subscribers
    this.notify(oldState, this.state);
  }

  /**
   * Subscribe to state changes
   * @param {string} id - Unique subscriber ID
   * @param {Function} callback - Called when state changes (oldState, newState) => void
   */
  subscribe(id, callback) {
    this.subscribers.set(id, callback);
    
    // Return unsubscribe function
    return () => this.unsubscribe(id);
  }

  /**
   * Unsubscribe from state changes
   * @param {string} id - Subscriber ID
   */
  unsubscribe(id) {
    this.subscribers.delete(id);
  }

  /**
   * Notify all subscribers of state change
   * @param {Object} oldState - Previous state
   * @param {Object} newState - New state
   */
  notify(oldState, newState) {
    this.subscribers.forEach(callback => {
      callback(oldState, newState);
    });
  }

  /**
   * Reset state to initial values
   * @param {Object} initialState - New initial state
   */
  reset(initialState = {}) {
    const oldState = { ...this.state };
    this.state = { ...initialState };
    this.notify(oldState, this.state);
  }
}

// Default application state
const defaultState = {
  currentLesson: null,
  completedLessons: [],
  quizAnswers: {},
  progress: 0,
  currentRoute: '/',
  user: {
    name: 'Guest',
    enrolled: false
  }
};

// Export singleton instance
export const store = new StateStore(defaultState);

// Export utility functions for common state operations
export const stateUtils = {
  /**
   * Mark a lesson as completed
   * @param {string} lessonId - Lesson identifier
   */
  completeLesson(lessonId) {
    const completed = store.get('completedLessons') || [];
    if (!completed.includes(lessonId)) {
      store.setState({
        completedLessons: [...completed, lessonId],
        progress: calculateProgress([...completed, lessonId])
      });
    }
  },

  /**
   * Set current active lesson
   * @param {string} lessonId - Lesson identifier
   */
  setCurrentLesson(lessonId) {
    store.setState({ currentLesson: lessonId });
  },

  /**
   * Save quiz answer
   * @param {string} questionId - Question identifier
   * @param {string} answer - User's answer
   */
  saveQuizAnswer(questionId, answer) {
    const answers = store.get('quizAnswers') || {};
    store.setState({
      quizAnswers: { ...answers, [questionId]: answer }
    });
  },

  /**
   * Get progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgress() {
    return store.get('progress') || 0;
  }
};

/**
 * Calculate progress based on completed lessons
 * @param {Array} completedLessons - Array of completed lesson IDs
 * @returns {number} Progress percentage
 */
function calculateProgress(completedLessons) {
  const totalLessons = 10; // Total lessons in the course
  return Math.round((completedLessons.length / totalLessons) * 100);
}
