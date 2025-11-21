/**
 * Main Application Entry Point
 * Initializes routing, state management, and core UI logic
 */

import { router, initializeRoutes, routes } from './router/router.js';
import { store } from './store/state.js';
import { createLesson, getAllLessons } from './components/Lesson.js';
import { createQuiz } from './components/Quiz.js';
import { createProgress } from './components/Progress.js';
import { qs } from './utils/dom.js';

/**
 * Main application class
 */
class App {
  constructor() {
    this.container = null;
    this.currentComponent = null;
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('🚀 Initializing Micro-Learning Portal...');
    
    // Get main content container
    this.container = qs('#app-content') || qs('main');
    
    if (!this.container) {
      console.error('No app container found');
      return;
    }

    // Initialize routes
    this.initRoutes();
    
    // Load initial state from localStorage
    this.loadState();
    
    // Subscribe to state changes
    this.subscribeToState();
    
    console.log('✓ Application initialized');
  }

  /**
   * Initialize application routes
   */
  initRoutes() {
    initializeRoutes({
      home: () => this.renderHome(),
      lessons: () => this.renderLessonsList(),
      lessonDetail: (params) => this.renderLesson(params.id),
      quiz: () => this.renderQuiz('caching-basics'),
      progress: () => this.renderProgress()
    });
  }

  /**
   * Render home page
   */
  renderHome() {
    const lessons = getAllLessons();
    const completedLessons = store.get('completedLessons') || [];
    const progress = store.get('progress') || 0;
    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    
    this.container.innerHTML = `
      <section class="hero">
        <h2>Welcome to Micro-Learning Portal</h2>
        <p>Master new skills in just a few minutes a day. Our bite-sized lessons are designed to fit into your busy schedule, making learning accessible and efficient.</p>
      </section>

      <section class="quick-actions">
        <div class="card-grid">
          <div class="stat-card-large blue">
            <h3>Learning Progress</h3>
            <div class="stat-number">${completedCount} / ${totalLessons}</div>
            <div class="stat-label">Lessons completed</div>
            <div style="background: rgba(255,255,255,0.3); height: 8px; border-radius: 4px; margin-top: 1rem; overflow: hidden;">
              <div style="background: white; height: 100%; width: ${progress}%;"></div>
            </div>
          </div>

          <div class="stat-card-large orange">
            <h3>Daily Streak 🔥</h3>
            <div class="stat-number">7 Days</div>
            <div class="stat-label">Keep it going!</div>
            <a href="#/progress" style="color: white; text-decoration: underline; margin-top: 1rem; display: inline-block; opacity: 0.9;">View all achievements →</a>
          </div>
        </div>
      </section>

      <section style="margin-top: 3rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div class="card">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">📖</div>
            <h3>Quick Lessons</h3>
            <p>Complete focused lessons in just 5-10 minutes</p>
          </div>

          <div class="card">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">📈</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed stats</p>
          </div>

          <div class="card">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏆</div>
            <h3>Test Knowledge</h3>
            <p>Reinforce learning with quick quizzes</p>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render lessons list
   */
  renderLessonsList() {
    const lessons = getAllLessons();
    const completedLessons = store.get('completedLessons') || [];
    
    this.container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <h1>Lessons</h1>
        
        <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-top: 2rem;">
          <h2 style="margin-top: 0;">All Lessons</h2>
          
          <div style="margin: 1.5rem 0;">
            <input type="text" placeholder="Search lessons..." class="search-input" style="margin-bottom: 1rem;">
            
            <div class="filter-group">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Category</label>
                <select class="filter-select">
                  <option>All</option>
                  <option>Performance</option>
                  <option>Database</option>
                  <option>Infrastructure</option>
                </select>
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Difficulty</label>
                <select class="filter-select">
                  <option>All</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 2rem;">
            ${lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const difficulties = ['beginner', 'intermediate', 'intermediate', 'advanced'];
              const categories = ['Performance', 'Database', 'Performance', 'Infrastructure'];
              const times = [5, 6, 7, 8];
              
              return `
                <div class="lesson-card">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                      <h3>
                        ${isCompleted ? '<span class="check-icon">✓</span>' : ''}
                        Lesson ${lesson.id}: ${lesson.title}
                      </h3>
                      <p>Learn the fundamentals of ${lesson.title.toLowerCase()} and how it improves application performance.</p>
                      
                      <div class="lesson-meta">
                        <span class="time">⏱ ${times[index] || 5} min</span>
                        <span class="tag ${difficulties[index] || 'beginner'}">${difficulties[index] || 'Beginner'}</span>
                        <span class="tag category">${categories[index] || 'General'}</span>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-left: 2rem;">
                      <span class="bookmark-icon">🔖</span>
                      <a href="#/lesson/${lesson.id}" class="btn-study">
                        📚 Study
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render specific lesson
   * @param {string} lessonId - Lesson identifier
   */
  renderLesson(lessonId) {
    // Cleanup previous component
    if (this.currentComponent?.destroy) {
      this.currentComponent.destroy();
    }

    const lesson = createLesson(lessonId);
    
    if (!lesson) {
      this.container.innerHTML = `
        <div class="error-message">
          <h2>Lesson Not Found</h2>
          <p>The lesson you're looking for doesn't exist.</p>
          <a href="#/" class="btn">Back to Home</a>
        </div>
      `;
      return;
    }

    lesson.render(this.container);
    this.currentComponent = lesson;
  }

  /**
   * Render quiz
   * @param {string} quizId - Quiz identifier
   */
  renderQuiz(quizId) {
    // Cleanup previous component
    if (this.currentComponent?.destroy) {
      this.currentComponent.destroy();
    }

    const quiz = createQuiz(quizId);
    
    if (!quiz) {
      this.container.innerHTML = `
        <div class="error-message">
          <h2>Quiz Not Found</h2>
          <p>The quiz you're looking for doesn't exist.</p>
          <a href="#/" class="btn">Back to Home</a>
        </div>
      `;
      return;
    }

    quiz.render(this.container);
    this.currentComponent = quiz;
  }

  /**
   * Render progress page
   */
  renderProgress() {
    // Cleanup previous component
    if (this.currentComponent?.destroy) {
      this.currentComponent.destroy();
    }

    const progress = createProgress();
    progress.render(this.container);
    this.currentComponent = progress;
  }

  /**
   * Subscribe to state changes
   */
  subscribeToState() {
    store.subscribe('app', (oldState, newState) => {
      // Save state to localStorage
      this.saveState();
      
      // Log state changes in development
      console.log('State updated:', { oldState, newState });
    });
  }

  /**
   * Load state from localStorage
   */
  loadState() {
    try {
      const savedState = localStorage.getItem('microLearningState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        store.setState(parsedState);
        console.log('✓ State loaded from localStorage');
      }
    } catch (error) {
      console.warn('Failed to load state:', error);
    }
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      const state = store.getState();
      localStorage.setItem('microLearningState', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
  });
} else {
  const app = new App();
  app.init();
}

// Export for testing
export { App };
