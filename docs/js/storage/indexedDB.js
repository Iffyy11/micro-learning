const DB_NAME = 'MicroLearningDB';
const DB_VERSION = 1;
const STORES = {
  LESSONS: 'lessons',
  PROGRESS: 'progress',
  QUIZ_RESULTS: 'quizResults',
  USER_DATA: 'userData'
};

class IndexedDBManager {
  constructor() {
    this.db = null;
    this.isSupported = this.checkSupport();
  }

  checkSupport() {
    return 'indexedDB' in window;
  }

  async init() {
    if (!this.isSupported) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      return false;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORES.LESSONS)) {
          const lessonStore = db.createObjectStore(STORES.LESSONS, { keyPath: 'id' });
          lessonStore.createIndex('difficulty', 'difficulty', { unique: false });
          lessonStore.createIndex('title', 'title', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          db.createObjectStore(STORES.PROGRESS, { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains(STORES.QUIZ_RESULTS)) {
          const quizStore = db.createObjectStore(STORES.QUIZ_RESULTS, { keyPath: 'id', autoIncrement: true });
          quizStore.createIndex('lessonId', 'lessonId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.USER_DATA)) {
          db.createObjectStore(STORES.USER_DATA, { keyPath: 'key' });
        }

        console.log('IndexedDB stores created');
      };
    });
  }

  async add(storeName, data) {
    if (!this.db) {await this.init();}
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, data) {
    if (!this.db) {await this.init();}
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    if (!this.db) {await this.init();}
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    if (!this.db) {await this.init();}
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    if (!this.db) {await this.init();}
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    if (!this.db) {await this.init();}
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveLessons(lessons) {
    const promises = lessons.map(lesson => this.put(STORES.LESSONS, lesson));
    return Promise.all(promises);
  }

  async getLessons() {
    return this.getAll(STORES.LESSONS);
  }

  async saveProgress(progressData) {
    return this.put(STORES.PROGRESS, {
      ...progressData,
      timestamp: Date.now()
    });
  }

  async getProgress() {
    return this.getAll(STORES.PROGRESS);
  }

  async saveQuizResult(lessonId, result) {
    return this.add(STORES.QUIZ_RESULTS, {
      lessonId,
      ...result,
      timestamp: Date.now()
    });
  }

  async getQuizResultsByLesson(lessonId) {
    if (!this.db) {await this.init();}
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.QUIZ_RESULTS], 'readonly');
      const store = transaction.objectStore(STORES.QUIZ_RESULTS);
      const index = store.index('lessonId');
      const request = index.getAll(lessonId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveUserData(key, value) {
    return this.put(STORES.USER_DATA, { key, value, timestamp: Date.now() });
  }

  async getUserData(key) {
    const result = await this.get(STORES.USER_DATA, key);
    return result ? result.value : null;
  }
}

const dbManager = new IndexedDBManager();

export { dbManager, STORES };
export default dbManager;
