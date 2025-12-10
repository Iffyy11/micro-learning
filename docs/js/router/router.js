import { store } from '../store/state.js';

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.defaultRoute = '/';
    
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  register(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path) {
    window.location.hash = path;
  }

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
      this.navigate(this.defaultRoute);
    }
  }

  matchRoute(path) {
    if (this.routes.has(path)) {
      return { route: path, params: {} };
    }

    for (const [route] of this.routes) {
      const params = this.extractParams(route, path);
      if (params) {
        return { route, params };
      }
    }

    return { route: null, params: {} };
  }

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

  getCurrentRoute() {
    return this.currentRoute;
  }

  setDefaultRoute(path) {
    this.defaultRoute = path;
  }
}

export const router = new Router();

export const routes = {
  HOME: '/',
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lesson/:id',
  QUIZ: '/quiz',
  PROGRESS: '/progress'
};

export function initializeRoutes(handlers) {
  router.register(routes.HOME, handlers.home || (() => {}));
  router.register(routes.LESSONS, handlers.lessons || (() => {}));
  router.register(routes.LESSON_DETAIL, handlers.lessonDetail || (() => {}));
  router.register(routes.QUIZ, handlers.quiz || (() => {}));
  router.register(routes.PROGRESS, handlers.progress || (() => {}));
}
