const MOCK_LESSONS = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    description: "Learn the fundamentals of JavaScript programming",
    content: "JavaScript is a versatile programming language that powers the web. It allows you to create interactive and dynamic content.",
    duration: "15 min",
    difficulty: "beginner",
    topics: ["variables", "functions", "loops"],
    quiz: [
      {
        question: "What is JavaScript primarily used for?",
        options: ["Styling web pages", "Adding interactivity", "Database management", "Server configuration"],
        correctAnswer: 1
      },
      {
        question: "Which keyword is used to declare a constant?",
        options: ["var", "let", "const", "static"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: "ES6 Modules",
    description: "Master modern JavaScript module patterns",
    content: "ES6 modules allow you to organize your code into reusable pieces. Use import/export to share functionality between files.",
    duration: "20 min",
    difficulty: "intermediate",
    topics: ["import", "export", "modules"],
    quiz: [
      {
        question: "How do you export a function in ES6?",
        options: ["module.exports", "export function", "exports =", "return function"],
        correctAnswer: 1
      },
      {
        question: "What is the correct import syntax?",
        options: ["include 'file'", "import from 'file'", "import { name } from 'file'", "require('file')"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 3,
    title: "Async JavaScript",
    description: "Handle asynchronous operations effectively",
    content: "Async/await makes asynchronous code look synchronous. Use try/catch for error handling and Promise.all for parallel operations.",
    duration: "25 min",
    difficulty: "advanced",
    topics: ["promises", "async/await", "fetch"],
    quiz: [
      {
        question: "What does async/await help with?",
        options: ["Synchronous code", "Asynchronous operations", "Variable declarations", "CSS styling"],
        correctAnswer: 1
      },
      {
        question: "How do you handle errors in async functions?",
        options: ["if/else", "try/catch", "switch", "throw only"],
        correctAnswer: 1
      }
    ]
  }
];

const API_CONFIG = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  retryAttempts: 3,
  retryDelay: 1000,
  useMockData: false,
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

const shouldSimulateError = () => {
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
      if (error instanceof APIError) throw error;
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
      if (error instanceof APIError) throw error;
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
          if (isCorrect) correctAnswers++;
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
      if (error instanceof APIError) throw error;
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
      if (error instanceof APIError) throw error;
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
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to search lessons', 500, error.message);
    }
  }
};

export { APIError, API_CONFIG };
