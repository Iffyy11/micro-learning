/**
 * Router - Hash-based routing system
 * Handles navigation and view rendering without page reloads
 */

import { store } from '../store/state.js';

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.defaultRoute = '/';
    
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  /**
   * Register a route with its handler
   * @param {string} path - Route path (e.g., '/', '/lesson/:id')
   * @param {Function} handler - Route handler function (params) => void
   */
  register(path, handler) {
    this.routes.set(path, handler);
  }

  /**
   * Navigate to a route programmatically
   * @param {string} path - Route path
   */
  navigate(path) {
    window.location.hash = path;
  }

  /**
   * Handle route changes
   */
  handleRouteChange() {
    const hash = window.location.hash.slice(1) || this.defaultRoute;
    const { route, params } = this.matchRoute(hash);
    
    if (route) {
      this.currentRoute = hash;
      store.setState({ currentRoute: hash });
      
      const handler = this.routes.get(route);
      if (handler) {
        handler(params);
      }
    } else {
      // Route not found - redirect to default
      this.navigate(this.defaultRoute);
    }
  }

  /**
   * Match current path to registered routes
   * @param {string} path - Current path
   * @returns {Object} Matched route and parameters
   */
  matchRoute(path) {
    // First, try exact match
    if (this.routes.has(path)) {
      return { route: path, params: {} };
    }

    // Try pattern matching for dynamic routes
    for (const [route] of this.routes) {
      const params = this.extractParams(route, path);
      if (params) {
        return { route, params };
      }
    }

    return { route: null, params: {} };
  }

  /**
   * Extract parameters from dynamic routes
   * @param {string} pattern - Route pattern (e.g., '/lesson/:id')
   * @param {string} path - Actual path (e.g., '/lesson/1')
   * @returns {Object|null} Extracted parameters or null
   */
  extractParams(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }

    return params;
  }

  /**
   * Get current route
   * @returns {string} Current route path
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Set default route
   * @param {string} path - Default route path
   */
  setDefaultRoute(path) {
    this.defaultRoute = path;
  }
}

// Export singleton instance
export const router = new Router();

// Export route definitions for the application
export const routes = {
  HOME: '/',
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lesson/:id',
  QUIZ: '/quiz',
  PROGRESS: '/progress'
};

/**
 * Initialize application routes
 * @param {Object} handlers - Object mapping route names to handler functions
 */
export function initializeRoutes(handlers) {
  router.register(routes.HOME, handlers.home || (() => {}));
  router.register(routes.LESSONS, handlers.lessons || (() => {}));
  router.register(routes.LESSON_DETAIL, handlers.lessonDetail || (() => {}));
  router.register(routes.QUIZ, handlers.quiz || (() => {}));
  router.register(routes.PROGRESS, handlers.progress || (() => {}));
}
