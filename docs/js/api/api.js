const MOCK_LESSONS = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    description: "Fundamentals: variables, control flow, and functions.",
    content: "This lesson covers the basics of JavaScript: declaring variables, using functions, and control flow statements (if, switch, loops). You'll write small snippets and run them in the browser console.",
    duration: "12 min",
    difficulty: "beginner",
    topics: ["javascript", "basics", "syntax"],
    quiz: [
      { question: "What keyword declares a block-scoped variable?", options: ["var", "let", "const", "function"], correctAnswer: 1 },
      { question: "Which structure repeats code while a condition is true?", options: ["if", "for", "switch", "try"], correctAnswer: 1 }
    ]
  },
  {
    id: 2,
    title: "ES Modules & Imports",
    description: "Organize code using import/export and default exports.",
    content: "ES Modules help keep code modular and reusable. Learn the difference between named and default exports, and how to import functions, objects, and classes across files.",
    duration: "18 min",
    difficulty: "intermediate",
    topics: ["modules", "import", "export"],
    quiz: [
      { question: "How do you export a named function?", options: ["export function f(){}", "module.exports = f", "export default function f(){}", "include f"], correctAnswer: 0 },
      { question: "How do you import a default export?", options: ["import {x} from './x'", "import x from './x'", "require('./x')", "include './x'"], correctAnswer: 1 }
    ]
  },
  {
    id: 3,
    title: "Asynchronous JavaScript",
    description: "Promises, async/await and handling network requests.",
    content: "Understand Promises and the async/await syntax. Learn how to fetch data, handle errors, and run parallel requests with Promise.all.",
    duration: "22 min",
    difficulty: "intermediate",
    topics: ["promises", "async/await", "fetch"],
    quiz: [
      { question: "Which method turns a callback into a Promise?", options: ["Promise.resolve", "new Promise", "async function", "setTimeout"], correctAnswer: 1 },
      { question: "What does Promise.all do?", options: ["Runs functions in sequence", "Runs promises in parallel and waits for all", "Cancels promises", "Retries promises"], correctAnswer: 1 }
    ]
  },
  {
    id: 4,
    title: "DOM Manipulation Basics",
    description: "Selecting and updating elements, event listeners.",
    content: "Learn how to select DOM elements, update text and attributes, and attach event listeners to make interactive UIs.",
    duration: "15 min",
    difficulty: "beginner",
    topics: ["dom", "events", "selectors"],
    quiz: [
      { question: "Which method selects an element by CSS selector?", options: ["getElementById", "querySelector", "getElementsByClassName", "select"], correctAnswer: 1 },
      { question: "Which event fires when a user clicks an element?", options: ["keydown", "submit", "click", "focus"], correctAnswer: 2 }
    ]
  },
  {
    id: 5,
    title: "Performance Fundamentals",
    description: "Minimize render time and reduce layout thrashing.",
    content: "This lesson covers techniques to improve front-end performance: batching DOM updates, using requestAnimationFrame, and avoiding expensive layout thrashing.",
    duration: "20 min",
    difficulty: "intermediate",
    topics: ["performance", "rendering", "optimization"],
    quiz: [
      { question: "What helps avoid layout thrashing?", options: ["Frequent DOM reads/writes", "Batching reads and writes", "Multiple synchronous style changes", "Using inline styles"], correctAnswer: 1 },
      { question: "Which API schedules visual updates before paint?", options: ["setTimeout", "requestAnimationFrame", "Promise", "fetch"], correctAnswer: 1 }
    ]
  },
  {
    id: 6,
    title: "Accessibility Basics",
    description: "Improve UX with semantic HTML and ARIA.",
    content: "Learn accessible patterns: use semantic elements, provide ARIA labels where needed, and ensure keyboard navigability and sufficient contrast.",
    duration: "14 min",
    difficulty: "beginner",
    topics: ["a11y", "semantic-html", "aria"],
    quiz: [
      { question: "What improves screen reader support?", options: ["Non-semantic divs", "Aria-labels and semantic tags", "Only CSS", "Inline scripts"], correctAnswer: 1 },
      { question: "Which key should move keyboard focus?", options: ["Tab", "Space", "Enter", "Alt"], correctAnswer: 0 }
    ]
  },
  {
    id: 7,
    title: "Testing JavaScript",
    description: "Unit tests with simple frameworks and testable design.",
    content: "Understand how to write unit tests, organize small testable functions, and run tests with minimal tooling.",
    duration: "18 min",
    difficulty: "intermediate",
    topics: ["testing", "unit-tests", "vitest"],
    quiz: [
      { question: "Why write unit tests?", options: ["To slow development", "To verify behavior and prevent regressions", "To obfuscate code", "To avoid reviews"], correctAnswer: 1 },
      { question: "Which is a unit testing tool used here?", options: ["Vitest", "Lighthouse", "Webpack", "ESLint"], correctAnswer: 0 }
    ]
  },
  {
    id: 8,
    title: "Basic Web Security",
    description: "Defend against common client-side issues like XSS.",
    content: "Learn simple client-side security practices: sanitize untrusted HTML, use Content Security Policy, and avoid unsafe inline scripts.",
    duration: "16 min",
    difficulty: "intermediate",
    topics: ["security", "xss", "csp"],
    quiz: [
      { question: "What reduces XSS risk?", options: ["Using innerHTML with user input", "Sanitizing/safe APIs", "Allowing all scripts", "Disabling CSP"], correctAnswer: 1 },
      { question: "What does CSP stand for?", options: ["Client-side Policy", "Content Security Policy", "Content Styling Practice", "Cross Site Policy"], correctAnswer: 1 }
    ]
  }
];

const API_CONFIG = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  retryAttempts: 3,
  retryDelay: 1000,
  useMockData: true,
  networkDelayMs: 0,
  errorRate: 0
};

class APIError extends Error {
  constructor(message, status, statusText) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
  }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const _shouldSimulateError = () => {
  return Math.random() < API_CONFIG.errorRate;
};

async function fetchWithRetry(url, options = {}, retries = API_CONFIG.retryAttempts) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status,
        response.statusText
      );
    }
    
    return await response.json();
  } catch (error) {
    if (retries > 0 && (error.status >= 500 || error.name === 'TypeError' || error.name === 'AbortError')) {
      console.warn(`Retry attempt ${API_CONFIG.retryAttempts - retries + 1} for ${url}`);
      await sleep(API_CONFIG.retryDelay);
      return fetchWithRetry(url, options, retries - 1);
    }
    
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408, 'Request Timeout');
    }
    
    throw error;
  }
}

export const api = {
  async getAllLessons() {
    try {
      if (API_CONFIG.useMockData) {
        await sleep(API_CONFIG.networkDelayMs);
        return {
          success: true,
          data: MOCK_LESSONS,
          timestamp: Date.now()
        };
      }

      const posts = await fetchWithRetry(`${API_CONFIG.baseURL}/posts`);
      
      const lessons = posts.slice(0, 10).map((post, index) => {
        const difficulties = ['beginner', 'intermediate', 'advanced'];
        const topics = [
          ['javascript', 'basics', 'syntax'],
          ['async', 'promises', 'fetch'],
          ['modules', 'import', 'export'],
          ['dom', 'events', 'manipulation'],
          ['functions', 'closures', 'scope']
        ];
        
        return {
          id: post.id,
          title: post.title.split(' ').slice(0, 4).join(' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: post.body.slice(0, 100) + '...',
          content: post.body,
          duration: `${Math.floor(Math.random() * 10) + 10} min`,
          difficulty: difficulties[index % 3],
          topics: topics[index % 5],
          quiz: [
            {
              question: `What is the main topic of this lesson?`,
              options: ['JavaScript', 'Python', 'Java', 'C++'],
              correctAnswer: 0
            },
            {
              question: `How long does this lesson take?`,
              options: ['5 min', '10-20 min', '30 min', '1 hour'],
              correctAnswer: 1
            }
          ]
        };
      });
      
      return {
        success: true,
        data: lessons,
        timestamp: Date.now()
      };
    } catch (error) {
      if (error instanceof APIError) {throw error;}
      throw new APIError('Failed to fetch lessons', 500, error.message);
    }
  },

  async getLessonById(id) {
    try {
      if (API_CONFIG.useMockData) {
        await sleep(API_CONFIG.networkDelayMs);
        const lesson = MOCK_LESSONS.find(l => l.id === parseInt(id));
        if (!lesson) {
          throw new APIError('Lesson not found', 404, 'Not Found');
        }
        return {
          success: true,
          data: lesson,
          timestamp: Date.now()
        };
      }

      const post = await fetchWithRetry(`${API_CONFIG.baseURL}/posts/${id}`);
      
      const difficulties = ['beginner', 'intermediate', 'advanced'];
      const topics = [
        ['javascript', 'basics', 'syntax'],
        ['async', 'promises', 'fetch'],
        ['modules', 'import', 'export'],
        ['dom', 'events', 'manipulation'],
        ['functions', 'closures', 'scope']
      ];
      
      const lesson = {
        id: post.id,
        title: post.title.split(' ').slice(0, 4).join(' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: post.body.slice(0, 100) + '...',
        content: post.body,
        duration: `${Math.floor(Math.random() * 10) + 10} min`,
        difficulty: difficulties[post.id % 3],
        topics: topics[post.id % 5],
        quiz: [
          {
            question: `What is the main topic of "${post.title}"?`,
            options: ['JavaScript', 'Python', 'Java', 'C++'],
            correctAnswer: 0
          },
          {
            question: `How would you rate the difficulty?`,
            options: ['Easy', 'Medium', 'Hard', 'Expert'],
            correctAnswer: 1
          }
        ]
      };
      
      return {
        success: true,
        data: lesson,
        timestamp: Date.now()
      };
    } catch (error) {
      if (error instanceof APIError) {throw error;}
      throw new APIError('Failed to fetch lesson', 500, error.message);
    }
  },

  async submitQuizAnswers(lessonId, answers) {
    try {
      // Check if lesson exists first (in mock mode)
      if (API_CONFIG.useMockData) {
        const lesson = MOCK_LESSONS.find(l => l.id === parseInt(lessonId));
        if (!lesson) {
          throw new APIError('Lesson not found', 404, 'Not Found');
        }
        await sleep(API_CONFIG.networkDelayMs);
        
        const totalQuestions = lesson.quiz.length;
        let correctAnswers = 0;
        const results = answers.map((answer, index) => {
          const isCorrect = answer === lesson.quiz[index].correctAnswer;
          if (isCorrect) {correctAnswers++;}
          return {
            questionIndex: index,
            userAnswer: answer,
            correctAnswer: lesson.quiz[index].correctAnswer,
            isCorrect
          };
        });
        
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        return {
          success: true,
          data: {
            id: Date.now(),
            lessonId,
            score: correctAnswers,
            totalQuestions,
            percentage,
            passed: percentage >= 70,
            results
          },
          timestamp: Date.now()
        };
      }
      
      const response = await fetchWithRetry(`${API_CONFIG.baseURL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          answers,
          timestamp: Date.now()
        })
      });
      
      const totalQuestions = 2;
      const correctAnswers = answers.filter(a => a === 0 || a === 1).length;
      const score = Math.min(correctAnswers, totalQuestions);
      const percentage = Math.round((score / totalQuestions) * 100);
      
      return {
        success: true,
        data: {
          id: response.id,
          lessonId,
          score,
          totalQuestions,
          percentage,
          passed: percentage >= 70,
          results: answers.map((answer, index) => ({
            questionIndex: index,
            userAnswer: answer,
            correctAnswer: index % 2,
            isCorrect: answer === (index % 2)
          }))
        },
        timestamp: Date.now()
      };
    } catch (error) {
      if (error instanceof APIError) {throw error;}
      throw new APIError('Failed to submit quiz', 500, error.message);
    }
  },

  async saveProgress(progressData) {
    try {
      const response = await fetchWithRetry(`${API_CONFIG.baseURL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'progress',
          ...progressData,
          timestamp: Date.now()
        })
      });
      
      return {
        success: true,
        data: {
          id: response.id,
          saved: true,
          progressData
        },
        timestamp: Date.now()
      };
    } catch (error) {
      if (error instanceof APIError) {throw error;}
      throw new APIError('Failed to save progress', 500, error.message);
    }
  },

  async searchLessons(query) {
    try {
      if (API_CONFIG.useMockData) {
        await sleep(API_CONFIG.networkDelayMs / 2);
        const normalizedQuery = query.toLowerCase().trim();
        if (!normalizedQuery) {
          return {
            success: true,
            data: MOCK_LESSONS,
            timestamp: Date.now()
          };
        }
        const filtered = MOCK_LESSONS.filter(lesson => 
          lesson.title.toLowerCase().includes(normalizedQuery) ||
          lesson.description.toLowerCase().includes(normalizedQuery) ||
          lesson.topics.some(topic => topic.toLowerCase().includes(normalizedQuery)) ||
          lesson.difficulty.toLowerCase().includes(normalizedQuery)
        );
        return {
          success: true,
          data: filtered,
          query: normalizedQuery,
          timestamp: Date.now()
        };
      }

      const allLessons = await this.getAllLessons();
      const normalizedQuery = query.toLowerCase().trim();
      
      if (!normalizedQuery) {
        return allLessons;
      }
      
      const filtered = allLessons.data.filter(lesson => 
        lesson.title.toLowerCase().includes(normalizedQuery) ||
        lesson.description.toLowerCase().includes(normalizedQuery) ||
        lesson.content.toLowerCase().includes(normalizedQuery) ||
        lesson.topics.some(topic => topic.toLowerCase().includes(normalizedQuery)) ||
        lesson.difficulty.toLowerCase().includes(normalizedQuery)
      );
      
      return {
        success: true,
        data: filtered,
        query: normalizedQuery,
        timestamp: Date.now()
      };
    } catch (error) {
      if (error instanceof APIError) {throw error;}
      throw new APIError('Failed to search lessons', 500, error.message);
    }
  }
};

export { APIError, API_CONFIG };
