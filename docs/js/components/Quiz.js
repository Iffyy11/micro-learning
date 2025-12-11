/**
 * Quiz Component Factory
 * Creates and manages quiz components
 */

import { store, stateUtils } from '../store/state.js';
import { validateAnswer, sanitizeHTML } from '../utils/validation.js';

/**
 * Quiz data repository
 */
export const quizData = {
  'caching-basics': {
    id: 'caching-basics',
    title: 'Quiz — Caching Basics',
    questions: [
      {
        id: 'q1',
        text: 'What is caching?',
        options: [
          { value: 'a', text: 'A method of storing data for faster access', correct: true },
          { value: 'b', text: 'A type of malware', correct: false },
          { value: 'c', text: 'A data encryption process', correct: false }
        ]
      },
      {
        id: 'q2',
        text: 'Which type of cache is fastest?',
        options: [
          { value: 'a', text: 'Disk cache', correct: false },
          { value: 'b', text: 'Memory cache', correct: true },
          { value: 'c', text: 'Network cache', correct: false }
        ]
      },
      {
        id: 'q3',
        text: 'What is cache invalidation?',
        options: [
          { value: 'a', text: 'Deleting all files', correct: false },
          { value: 'b', text: 'Removing outdated cached data', correct: true },
          { value: 'c', text: 'Compressing cache', correct: false }
        ]
      }
    ]
  }
};

/**
 * Factory function to create a Quiz component
 * @param {string} quizId - Quiz identifier
 * @returns {Object} Quiz component with methods
 */
export function createQuiz(quizId) {
  const quiz = quizData[quizId];
  
  if (!quiz) {
    return null;
  }

  let answers = {};
  let submitted = false;

  return {
    id: quiz.id,
    title: quiz.title,
    
    /**
     * Render quiz to DOM
     * @param {HTMLElement} container - Target container element
     */
    render(container) {
      if (!container) return;
      
      container.innerHTML = `
        <div class="quiz-container">
          <h1>${sanitizeHTML(quiz.title)}</h1>
          <p class="helper-text">Use Tab to move between options. Select with Space or Enter.</p>
          
          <form class="quiz-form" id="quiz-form">
            ${quiz.questions.map((q, index) => this.renderQuestion(q, index)).join('')}
            
            <button type="submit" class="btn btn-primary">Submit Answers</button>
          </form>
          
          <div id="quiz-results" class="quiz-results" role="status" aria-live="polite"></div>
        </div>
      `;
      
      this.attachEventListeners(container);
    },
    
    /**
     * Render a single question
     * @param {Object} question - Question data
     * @param {number} index - Question index
     * @returns {string} HTML string
     */
    renderQuestion(question, index) {
      return `
        <fieldset class="quiz-fieldset">
          <legend class="question-title">Q${index + 1}: ${sanitizeHTML(question.text)}</legend>
          
          ${question.options.map(option => `
            <div class="form-group">
              <input 
                type="radio" 
                id="${question.id}-${option.value}" 
                name="${question.id}" 
                value="${option.value}"
                ${answers[question.id] === option.value ? 'checked' : ''}
              >
              <label for="${question.id}-${option.value}">${sanitizeHTML(option.text)}</label>
            </div>
          `).join('')}
        </fieldset>
      `;
    },
    
    /**
     * Attach event listeners
     * @param {HTMLElement} container - Container element
     */
    attachEventListeners(container) {
      const form = container.querySelector('#quiz-form');
      
      if (form) {
        // Track answer changes
        form.addEventListener('change', (e) => {
          if (e.target.type === 'radio') {
            answers[e.target.name] = e.target.value;
            stateUtils.saveQuizAnswer(e.target.name, e.target.value);
          }
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitQuiz();
        });
      }
    },
    
    /**
     * Submit quiz and show results
     */
    submitQuiz() {
      if (submitted) return;
      
      const results = this.gradeQuiz();
      submitted = true;
      
      this.displayResults(results);
    },
    
    /**
     * Grade the quiz
     * @returns {Object} Results with score and details
     */
    gradeQuiz() {
      let correct = 0;
      const details = [];
      
      quiz.questions.forEach(question => {
        const userAnswer = answers[question.id];
        const correctOption = question.options.find(opt => opt.correct);
        const isCorrect = userAnswer === correctOption.value;
        
        if (isCorrect) correct++;
        
        details.push({
          question: question.text,
          userAnswer: userAnswer,
          correct: isCorrect,
          correctAnswer: correctOption.value
        });
      });
      
      return {
        score: correct,
        total: quiz.questions.length,
        percentage: Math.round((correct / quiz.questions.length) * 100),
        details
      };
    },
    
    /**
     * Display quiz results
     * @param {Object} results - Graded results
     */
    displayResults(results) {
      const resultsContainer = document.querySelector('#quiz-results');
      if (!resultsContainer) return;
      
      resultsContainer.innerHTML = `
        <div class="results-summary ${results.percentage >= 70 ? 'pass' : 'fail'}">
          <h2>Results</h2>
          <p class="score">Score: ${results.score}/${results.total} (${results.percentage}%)</p>
          <p class="message">${results.percentage >= 70 ? '✓ Great job!' : 'Keep learning!'}</p>
        </div>
        
        <div class="results-details">
          <h3>Review</h3>
          ${results.details.map((detail, index) => `
            <div class="result-item ${detail.correct ? 'correct' : 'incorrect'}">
              <p><strong>Q${index + 1}:</strong> ${detail.question}</p>
              <p>${detail.correct ? '✓ Correct!' : `✗ Incorrect. Correct answer: ${detail.correctAnswer}`}</p>
            </div>
          `).join('')}
        </div>
      `;
      
      // Scroll to results
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    /**
     * Reset quiz
     */
    reset() {
      answers = {};
      submitted = false;
    },
    
    /**
     * Get quiz data
     * @returns {Object}
     */
    getData() {
      return { ...quiz };
    }
  };
}

/**
 * Get all available quizzes
 * @returns {Array} Array of quiz metadata
 */
export function getAllQuizzes() {
  return Object.values(quizData).map(quiz => ({
    id: quiz.id,
    title: quiz.title
  }));
}
