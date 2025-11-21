export class StateStore {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.subscribers = new Map();
  }

  getState() {
    return { ...this.state };
  }

  get(key) {
    return this.state[key];
  }

  setState(updates) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    this.notify(oldState, this.state);
  }

  subscribe(id, callback) {
    this.subscribers.set(id, callback);
    return () => this.unsubscribe(id);
  }

  unsubscribe(id) {
    this.subscribers.delete(id);
  }

  notify(oldState, newState) {
    this.subscribers.forEach(callback => {
      callback(oldState, newState);
    });
  }

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

export const store = new StateStore(defaultState);

export const stateUtils = {
  completeLesson(lessonId) {
    const completed = store.get('completedLessons') || [];
    if (!completed.includes(lessonId)) {
      store.setState({
        completedLessons: [...completed, lessonId],
        progress: calculateProgress([...completed, lessonId])
      });
    }
  },

  setCurrentLesson(lessonId) {
    store.setState({ currentLesson: lessonId });
  },

  saveQuizAnswer(questionId, answer) {
    const answers = store.get('quizAnswers') || {};
    store.setState({
      quizAnswers: { ...answers, [questionId]: answer }
    });
  },

  getProgress() {
    return store.get('progress') || 0;
  }
};

function calculateProgress(completedLessons) {
  const totalLessons = 10;
  return Math.round((completedLessons.length / totalLessons) * 100);
}
