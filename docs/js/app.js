// Core imports (always needed)
import { router, initializeRoutes, routes } from './router/router.js';
import { store } from './store/state.js';
import { qs } from './utils/dom.js';
import { api, APIError } from './api/api.js';
import { dbManager } from './storage/indexedDB.js';
import { LoadingSpinner, showLoadingOverlay, hideLoadingOverlay } from './components/LoadingSpinner.js';
import { ErrorMessage, showErrorToast, showNetworkError } from './components/ErrorMessage.js';
import { debounce } from './utils/debounce.js';

// Lazy-loaded modules (loaded on demand)
let LessonModule = null;
let QuizModule = null;
let ProgressModule = null;

class App {
  constructor() {
    this.container = null;
    this.currentComponent = null;
    this.lessons = [];
    this.isOnline = navigator.onLine;
  }

  // Lazy load modules on demand for performance
  async loadLessonModule() {
    if (!LessonModule) {
      LessonModule = await import('./components/Lesson.js');
    }
    return LessonModule;
  }

  async loadQuizModule() {
    if (!QuizModule) {
      QuizModule = await import('./components/Quiz.js');
    }
    return QuizModule;
  }

  async loadProgressModule() {
    if (!ProgressModule) {
      ProgressModule = await import('./components/Progress.js');
    }
    return ProgressModule;
  }

  async init() {
    console.log('🚀 Initializing Micro-Learning Portal...');
    
    this.container = qs('#app-content') || qs('main');
    
    if (!this.container) {
      console.error('No app container found');
      return;
    }

    showLoadingOverlay('Initializing app...');

    try {
      await dbManager.init();
      console.log('✓ IndexedDB initialized');
      
      await this.loadLessons();
      
      this.initRoutes();
      this.loadState();
      this.subscribeToState();
      this.setupNetworkListeners();
      
      console.log('✓ Application initialized');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      showErrorToast('Failed to initialize application');
    } finally {
      hideLoadingOverlay();
    }
  }

  async loadLessons() {
    try {
      const cachedLessons = await dbManager.getLessons();
      
      if (cachedLessons && cachedLessons.length > 0) {
        this.lessons = cachedLessons;
        console.log('✓ Loaded lessons from IndexedDB cache');
      }
      
      if (this.isOnline) {
        const response = await api.getAllLessons();
        this.lessons = response.data;
        await dbManager.saveLessons(this.lessons);
        console.log('✓ Fetched fresh lessons from API');
      }
      
      store.setState({ lessons: this.lessons });
    } catch (error) {
      console.error('Failed to load lessons:', error);
      if (this.lessons.length === 0) {
        showErrorToast('Failed to load lessons');
      }
    }
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      showErrorToast('Back online! 🎉', 3000);
      this.loadLessons();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      showErrorToast('You are offline. Using cached data.', 5000);
    });
  }

  initRoutes() {
    initializeRoutes({
      home: () => this.renderHome(),
      lessons: () => this.renderLessonsList(),
      lessonDetail: (params) => this.renderLessonAsync(params.id),
      quiz: () => this.renderQuiz('caching-basics'),
      progress: () => this.renderProgress()
    });
  }

  renderHome() {
    const lessons = this.lessons.length > 0 ? this.lessons : [];
    const completedLessons = store.get('completedLessons') || [];
    const progress = store.get('progress') || 0;
    const totalLessons = lessons.length || 10;
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

  async renderLessonsList() {
    const { getAllLessons } = await this.loadLessonModule();
    const lessons = this.lessons.length > 0 ? this.lessons : getAllLessons();
    const completedLessons = store.get('completedLessons') || [];
    
    this.container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <h1>Lessons</h1>
        
        <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-top: 2rem;">
          <h2 style="margin-top: 0;">All Lessons</h2>
          
          <div style="margin: 1.5rem 0;">
            <input 
              type="text" 
              id="lesson-search" 
              placeholder="🔍 Search lessons..." 
              class="search-input" 
              style="margin-bottom: 1rem;"
              aria-label="Search lessons">
            
            <div class="filter-group">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Category</label>
                <select class="filter-select" id="category-filter">
                  <option>All</option>
                  <option>Performance</option>
                  <option>Database</option>
                  <option>Infrastructure</option>
                </select>
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Difficulty</label>
                <select class="filter-select" id="difficulty-filter">
                  <option>All</option>
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                </select>
              </div>
            </div>
          </div>
          
          <div id="lessons-container">
            ${this.renderLessonsGrid(lessons, completedLessons)}
          </div>
        </div>
      </div>
    `;
    
    this.setupSearch();
  }

  renderLessonsGrid(lessons, completedLessons) {
    if (lessons.length === 0) {
      return '<p style="text-align: center; color: #666; padding: 2rem;">No lessons found.</p>';
    }
    
    return lessons.map((lesson) => {
      const isCompleted = completedLessons.includes(lesson.id);
      
      return `
        <div class="lesson-card" data-lesson-id="${lesson.id}">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h3>
                ${isCompleted ? '<span class="check-icon">✓</span>' : ''}
                Lesson ${lesson.id}: ${lesson.title}
              </h3>
              <p>${lesson.description}</p>
              
              <div class="lesson-meta">
                <span class="time">⏱ ${lesson.duration}</span>
                <span class="tag ${lesson.difficulty}">${lesson.difficulty}</span>
                ${lesson.topics ? lesson.topics.map(t => `<span class="tag category">${t}</span>`).join('') : ''}
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
    }).join('');
  }

  setupSearch() {
    const searchInput = qs('#lesson-search');
    const categoryFilter = qs('#category-filter');
    const difficultyFilter = qs('#difficulty-filter');
    const container = qs('#lessons-container');

    if (!searchInput || !container) return;

    const performSearch = debounce(async (query) => {
      try {
        container.innerHTML = LoadingSpinner({ text: 'Searching...' }).render();
        
        const response = await api.searchLessons(query);
        let filteredLessons = response.data;
        
        const selectedCategory = categoryFilter?.value;
        const selectedDifficulty = difficultyFilter?.value;
        
        if (selectedCategory && selectedCategory !== 'All') {
          filteredLessons = filteredLessons.filter(l => 
            l.topics?.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()))
          );
        }
        
        if (selectedDifficulty && selectedDifficulty !== 'All') {
          filteredLessons = filteredLessons.filter(l => 
            l.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
          );
        }
        
        const completedLessons = store.get('completedLessons') || [];
        container.innerHTML = this.renderLessonsGrid(filteredLessons, completedLessons);
        
      } catch (error) {
        console.error('Search failed:', error);
        const errorMsg = ErrorMessage({
          title: 'Search Failed',
          message: 'Unable to search lessons. Please try again.',
          type: 'error',
          retry: () => performSearch(query)
        });
        container.innerHTML = errorMsg.render();
      }
    }, 400);

    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        performSearch(searchInput.value);
      });
    }

    if (difficultyFilter) {
      difficultyFilter.addEventListener('change', () => {
        performSearch(searchInput.value);
      });
    }
  }

  async renderLessonAsync(lessonId) {
    const { createLesson } = await this.loadLessonModule();
    
    if (this.currentComponent?.destroy) {
      this.currentComponent.destroy();
    }

    this.container.innerHTML = LoadingSpinner({ 
      size: 'large', 
      text: 'Loading lesson...' 
    }).render();

    try {
      const response = await api.getLessonById(lessonId);
      const lessonData = response.data;
      
      this.container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
          <div class="breadcrumb">
            <a href="#/">Home</a> / <a href="#/lessons">Lessons</a> / ${lessonData.title}
          </div>
          
          <article class="lesson-content">
            <header>
              <h1>${lessonData.title}</h1>
              <div class="lesson-meta">
                <span class="time">⏱ ${lessonData.duration}</span>
                <span class="tag ${lessonData.difficulty}">${lessonData.difficulty}</span>
              </div>
            </header>
            
            <div class="content">
              <p>${lessonData.content}</p>
              
              ${lessonData.topics ? `
                <div style="margin-top: 2rem;">
                  <h3>Topics Covered:</h3>
                  <ul>
                    ${lessonData.topics.map(topic => `<li>${topic}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            
            <footer style="margin-top: 3rem; display: flex; justify-content: space-between;">
              <button class="btn btn-secondary" onclick="window.history.back()">← Back</button>
              <button class="btn btn-primary" id="complete-lesson-btn">
                Complete Lesson ✓
              </button>
            </footer>
          </article>
        </div>
      `;
      
      const completeBtn = qs('#complete-lesson-btn');
      if (completeBtn) {
        completeBtn.addEventListener('click', async () => {
          await this.completeLesson(lessonId);
          showErrorToast('Lesson completed! 🎉', 3000);
          window.location.hash = '#/lessons';
        });
      }
      
    } catch (error) {
      console.error('Failed to load lesson:', error);
      
      if (error.status === 404) {
        const errorMsg = ErrorMessage({
          title: 'Lesson Not Found',
          message: 'The lesson you are looking for does not exist.',
          type: 'warning',
          dismiss: () => window.location.hash = '#/lessons'
        });
        errorMsg.show(this.container);
      } else {
        const errorMsg = showNetworkError(() => this.renderLessonAsync(lessonId));
        errorMsg.show(this.container);
      }
    }
  }

  async completeLesson(lessonId) {
    const completedLessons = store.get('completedLessons') || [];
    
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      store.setState({ completedLessons });
      
      const progress = Math.round((completedLessons.length / this.lessons.length) * 100);
      store.setState({ progress });
      
      await dbManager.saveProgress({
        id: 'current-progress',
        completedLessons,
        progress,
        lastUpdated: Date.now()
      });
      
      await api.saveProgress({ completedLessons, progress });
    }
  }

  /**
   * Render quiz
   * @param {string} quizId - Quiz identifier
   */
  async renderQuiz(quizId) {
    const { createQuiz } = await this.loadQuizModule();
    
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
  async renderProgress() {
    const { createProgress } = await this.loadProgressModule();
    
    // Cleanup previous component
    if (this.currentComponent?.destroy) {
      this.currentComponent.destroy();
    }

    const progress = createProgress();
    progress.render(this.container);
    this.currentComponent = progress;
  }

  subscribeToState() {
    store.subscribe('app', async (oldState, newState) => {
      this.saveState();
      
      if (newState.completedLessons !== oldState.completedLessons) {
        await dbManager.saveProgress({
          id: 'current-progress',
          completedLessons: newState.completedLessons,
          progress: newState.progress,
          lastUpdated: Date.now()
        });
      }
      
      console.log('State updated:', { oldState, newState });
    });
  }

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

  saveState() {
    try {
      const state = store.getState();
      localStorage.setItem('microLearningState', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();
  });
} else {
  const app = new App();
  app.init();
}

export { App };
