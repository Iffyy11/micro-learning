/**
 * Progress Component Factory
 * Displays user progress and achievements
 */

import { store } from '../store/state.js';
import { getAllLessons } from './Lesson.js';

/**
 * Factory function to create a Progress component
 * @returns {Object} Progress component with methods
 */
export function createProgress() {
  return {
    /**
     * Render progress view to DOM
     * @param {HTMLElement} container - Target container element
     */
    render(container) {
      if (!container) {return;}
      
      const completedLessons = store.get('completedLessons') || [];
      const progress = store.get('progress') || 0;
      const allLessons = getAllLessons();
      const totalLessons = allLessons.length;
      const avgScore = 100; // Mock data
      const totalPoints = 100; // Mock data
      
      container.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto;">
          <h1>Progress</h1>
          
          <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-top: 2rem;">
            <h2 style="margin-top: 0;">Your Learning Progress</h2>
            
            <div class="progress-summary">
              <div class="progress-stat blue">
                <div style="font-size: 2rem; color: var(--clr-accent); margin-bottom: 0.5rem;">📈</div>
                <h3 style="color: var(--clr-accent); margin: 0;">Completion Rate</h3>
                <h2>${progress}%</h2>
                <p>${completedLessons.length} of ${totalLessons} lessons</p>
              </div>
              
              <div class="progress-stat green">
                <div style="font-size: 2rem; color: var(--clr-green); margin-bottom: 0.5rem;">🎯</div>
                <h3 style="color: var(--clr-green); margin: 0;">Average Score</h3>
                <h2>${avgScore}%</h2>
                <p>Across all quizzes</p>
              </div>
              
              <div class="progress-stat purple">
                <div style="font-size: 2rem; color: var(--clr-purple); margin-bottom: 0.5rem;">✅</div>
                <h3 style="color: var(--clr-purple); margin: 0;">Total Points</h3>
                <h2>${totalPoints}</h2>
                <p>Points earned</p>
              </div>
            </div>
            
            <div class="progress-bar-section">
              <h3>Overall Progress</h3>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: var(--clr-text);">Learning Journey</span>
                <span style="font-weight: 600;">${completedLessons.length} of ${totalLessons} lessons completed</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
              </div>
            </div>
            
            <div style="margin-top: 3rem;">
              <h3>Lesson Status</h3>
              ${allLessons.map(lesson => {
                const isCompleted = completedLessons.includes(lesson.id);
                return `
                  <div class="lesson-status-item">
                    <div class="lesson-status-info">
                      <div class="lesson-status-icon ${isCompleted ? 'completed' : 'not-started'}">
                        ${isCompleted ? '✓' : '○'}
                      </div>
                      <div class="lesson-status-text">
                        <h4>Lesson ${lesson.id}: ${lesson.title}</h4>
                        <p>${isCompleted ? 'Completed' : 'Not Started'}</p>
                      </div>
                    </div>
                    ${isCompleted ? '<div class="lesson-quiz-score">Quiz: 100%</div>' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          ${this.renderAchievements(completedLessons.length)}
        </div>
      `;
      
      this.subscribeToUpdates(container);
    },
    
    /**
     * Render achievements section
     * @param {number} completedCount - Number of completed lessons
     * @returns {string} HTML string
     */
    renderAchievements(completedCount) {
      const achievements = [
        { title: 'First Steps', desc: 'Complete your first lesson', threshold: 1, icon: '📖', color: 'blue', emoji: '⭐' },
        { title: 'Knowledge Seeker', desc: 'Complete 5 lessons', threshold: 5, icon: '🎯', color: 'purple', emoji: '⭐' },
        { title: 'Master Learner', desc: 'Complete all lessons', threshold: 8, icon: '🏆', color: 'orange', emoji: '⭐' },
        { title: 'Perfect Score', desc: 'Get 100% on any quiz', threshold: 1, icon: '⭐', color: 'purple', emoji: '⭐' },
        { title: 'Quiz Master', desc: 'Get 100% on 3 quizzes', threshold: 3, icon: '🏅', color: 'orange', emoji: '⭐' },
        { title: 'Hot Streak', desc: 'Maintain a 7-day learning streak', threshold: 7, icon: '🔥', color: 'orange', emoji: '⭐' },
        { title: 'Dedication', desc: 'Maintain a 30-day learning streak', threshold: 30, icon: '⚡', color: 'green', emoji: '⭐' },
        { title: 'High Achiever', desc: 'Maintain an average score above 80%', threshold: 80, icon: '✅', color: 'green', emoji: '⭐' }
      ];
      
      // Simulate some unlocked achievements
      const unlockedAchievements = [0, 3, 5, 7]; // Indices of unlocked achievements
      
      return `
        <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-top: 2rem;">
          <h2>Your Achievements</h2>
          <p style="color: var(--clr-text); margin-bottom: 1rem;">Unlocked ${unlockedAchievements.length} of ${achievements.length} achievements</p>
          
          <div style="background: #E5E7EB; height: 12px; border-radius: 20px; overflow: hidden; margin-bottom: 2rem;">
            <div style="background: linear-gradient(90deg, var(--clr-accent), var(--clr-purple)); height: 100%; width: ${(unlockedAchievements.length / achievements.length) * 100}%; border-radius: 20px;"></div>
          </div>
          
          <div class="achievement-grid">
            ${achievements.map((achievement, index) => {
              const earned = unlockedAchievements.includes(index);
              return `
                <div class="achievement ${earned ? `earned ${achievement.color}` : 'locked'}">
                  <div class="achievement-icon">${achievement.icon}</div>
                  <h3>${achievement.title} ${earned ? achievement.emoji : ''}</h3>
                  <p>${achievement.desc}</p>
                  ${earned ? '<div class="unlock-badge">Unlocked ✓</div>' : `<div style="margin-top: 1rem; color: var(--clr-text); font-size: 0.85rem;">Progress ${index === 1 ? completedCount + '/5' : '...'}</div>`}
                </div>
              `;
            }).join('')}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem;">
            <div class="points-card" style="background: linear-gradient(135deg, var(--clr-purple), #BA68C8); padding: 2rem; border-radius: 16px;">
              <h3 class="points-card-title" style="margin: 0 0 1rem; font-size: 1.125rem; opacity: 0.95;">Total Points</h3>
              <div class="points-card-value" style="font-size: 3rem; font-weight: 700;">100</div>
              <p class="points-card-desc" style="margin: 0.5rem 0 0; opacity: 0.95;">Keep learning to earn more points!</p>
            </div>

            <div class="streak-card" style="background: linear-gradient(135deg, var(--clr-orange), var(--clr-orange-light)); padding: 2rem; border-radius: 16px;">
              <h3 class="streak-card-title" style="margin: 0 0 1rem; font-size: 1.125rem; opacity: 0.95;">Current Streak 🔥</h3>
              <div class="streak-card-value" style="font-size: 3rem; font-weight: 700;">7</div>
              <p class="streak-card-desc" style="margin: 0.5rem 0 0; opacity: 0.95;">Days in a row</p>
            </div>
          </div>
        </div>
      `;
    },
    
    /**
     * Subscribe to state updates and re-render when progress changes
     * @param {HTMLElement} container - Container element
     */
    subscribeToUpdates(container) {
      const _unsubscribe = store.subscribe('progress-component', (oldState, newState) => {
        if (oldState.progress !== newState.progress || 
            oldState.completedLessons.length !== newState.completedLessons.length) {
          this.render(container);
        }
      });
      
      // Store unsubscribe function for cleanup
      container.dataset.unsubscribe = 'progress-component';
    },
    
    /**
     * Cleanup component
     */
    destroy() {
      store.unsubscribe('progress-component');
    }
  };
}
