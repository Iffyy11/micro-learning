/**
 * Lesson Component Factory
 * Creates and manages lesson view components
 */

import { store, stateUtils } from '../store/state.js';
import { router } from '../router/router.js';
import { sanitizeHTML, sanitizeInput as _sanitizeInput } from '../utils/validation.js';

/**
 * Lesson data repository
 */
export const lessonData = {
  '1': {
    id: '1',
    title: 'Caching Basics',
    content: {
      intro: 'Caching stores frequently accessed data so it can be retrieved faster.',
      sections: [
        {
          title: 'Why caching matters',
          points: [
            'Reduces repeated network calls',
            'Improves responsiveness',
            'Decreases server load'
          ]
        },
        {
          title: 'Types of caching',
          points: [
            'Browser cache: stores HTML, CSS, JS, images.',
            'Memory cache: extremely fast (RAM-based).',
            'Disk cache: persistent storage but slower than memory.',
            'Application cache: custom caching logic.'
          ]
        }
      ],
      questions: [
        'What is the main benefit of caching?',
        'Name two types of caching.',
        'What does stale cache mean?'
      ]
    },
    nextLesson: '2',
    prevLesson: null
  },
  '2': {
    id: '2',
    title: 'Advanced Caching Strategies',
    content: {
      intro: 'Learn advanced techniques for cache invalidation and optimization.',
      sections: [
        {
          title: 'Cache Invalidation',
          points: [
            'Time-based expiration',
            'Event-based invalidation',
            'Manual cache clearing'
          ]
        }
      ],
      questions: [
        'When should you invalidate cache?',
        'What is cache stampede?'
      ]
    },
    nextLesson: null,
    prevLesson: '1'
  }
};

/**
 * Factory function to create a Lesson component
 * @param {string} lessonId - Lesson identifier
 * @returns {Object} Lesson component with methods
 */
export function createLesson(lessonId) {
  const lesson = lessonData[lessonId];
  
  if (!lesson) {
    return null;
  }

  return {
    id: lesson.id,
    title: lesson.title,
    
    /**
     * Render lesson content to DOM
     * @param {HTMLElement} container - Target container element
     */
    render(container) {
      if (!container) {return;}
      
      // sanitize content strings before rendering
      const safeIntro = sanitizeHTML(lesson.content.intro || '');
      container.innerHTML = `
        <article class="lesson">
          <h1 class="lesson-title">Lesson ${lesson.id} — ${lesson.title}</h1>
          
          <section class="lesson-content">
            <p class="lesson-intro">${safeIntro}</p>
            
            ${lesson.content.sections.map(section => `
              <div class="lesson-section">
                <h3>${sanitizeHTML(section.title)}</h3>
                <ul>
                  ${section.points.map(point => `<li>${sanitizeHTML(point)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
            
            <div class="lesson-questions">
              <h3>Quick Check Questions</h3>
              <ol>
                ${lesson.content.questions.map(q => `<li>${q}</li>`).join('')}
              </ol>
            </div>
          </section>
          
          <div class="lesson-nav">
            ${lesson.prevLesson ? `<button class="btn" data-nav="prev">Previous</button>` : ''}
            <button class="btn btn-primary" data-action="complete">Mark Complete</button>
            ${lesson.nextLesson ? `<button class="btn" data-nav="next">Next Lesson</button>` : ''}
          </div>
        </article>
      `;
      
      this.attachEventListeners(container);
    },
    
    /**
     * Attach event listeners to lesson elements
     * @param {HTMLElement} container - Container element
     */
    attachEventListeners(container) {
      // Navigation buttons
      const prevBtn = container.querySelector('[data-nav="prev"]');
      const nextBtn = container.querySelector('[data-nav="next"]');
      const completeBtn = container.querySelector('[data-action="complete"]');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          router.navigate(`/lesson/${lesson.prevLesson}`);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          router.navigate(`/lesson/${lesson.nextLesson}`);
        });
      }
      
      if (completeBtn) {
        completeBtn.addEventListener('click', () => {
          this.markComplete();
        });
      }
    },
    
    /**
     * Mark lesson as completed
     */
    markComplete() {
      stateUtils.completeLesson(lesson.id);
      
      // Show feedback
      const feedback = document.createElement('div');
      feedback.className = 'lesson-feedback';
      feedback.textContent = '✓ Lesson completed!';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      
      const container = document.querySelector('.lesson');
      if (container) {
        container.insertBefore(feedback, container.firstChild);
        setTimeout(() => feedback.remove(), 3000);
      }
    },
    
    /**
     * Check if lesson is completed
     * @returns {boolean}
     */
    isCompleted() {
      const completed = store.get('completedLessons') || [];
      return completed.includes(lesson.id);
    },
    
    /**
     * Get lesson data
     * @returns {Object}
     */
    getData() {
      return { ...lesson };
    }
  };
}

/**
 * Get all available lessons
 * @returns {Array} Array of lesson metadata
 */
export function getAllLessons() {
  return Object.values(lessonData).map(lesson => ({
    id: lesson.id,
    title: lesson.title
  }));
}
