# Module Structure Documentation

## Overview
This project follows a modular architecture with ES6 modules, separating concerns into distinct layers.

## Directory Structure

```
docs/js/
├── app.js                  # Main application entry point
├── store/
│   ├── state.js           # State management (Observer pattern)
│   └── state.test.js      # State tests
├── router/
│   └── router.js          # Hash-based routing
├── components/
│   ├── Lesson.js          # Lesson component factory
│   ├── Quiz.js            # Quiz component factory
│   └── Progress.js        # Progress component factory
└── utils/
    ├── validation.js      # Validation utilities
    ├── validation.test.js # Validation tests
    ├── arrays.js          # Array utilities
    ├── arrays.test.js     # Array tests
    └── dom.js             # DOM utilities
```

## Module Import Graph

### Dependency Flow

```
app.js
  ├── router/router.js
  │   └── store/state.js
  ├── store/state.js
  ├── components/Lesson.js
  │   ├── store/state.js
  │   └── router/router.js
  ├── components/Quiz.js
  │   ├── store/state.js
  │   └── utils/validation.js
  ├── components/Progress.js
  │   ├── store/state.js
  │   └── components/Lesson.js
  └── utils/dom.js
```

### Module Responsibilities

#### Core Modules

**app.js** (Entry Point)
- Initializes the application
- Wires together routing and state
- Manages component lifecycle
- Handles localStorage persistence

**store/state.js** (State Management)
- Centralized state store with Observer pattern
- Subscribe/unsubscribe mechanism
- State utilities for common operations
- Pure function for state transformations

**router/router.js** (Routing)
- Hash-based client-side routing
- Route pattern matching (e.g., `/lesson/:id`)
- Navigation helpers
- Route registration system

#### Component Modules

**components/Lesson.js**
- Factory function for Lesson components
- Lesson data repository
- Render methods for lesson content
- Event handling for navigation and completion

**components/Quiz.js**
- Factory function for Quiz components
- Quiz data repository
- Answer validation and grading logic
- Results display

**components/Progress.js**
- Factory function for Progress component
- Progress calculation and display
- Achievement system
- State subscription for live updates

#### Utility Modules

**utils/validation.js** (Pure Functions)
- Input validation functions
- HTML sanitization
- Email validation
- Data integrity checks

**utils/arrays.js** (Pure Functions)
- Array manipulation utilities
- Sorting, filtering, chunking
- Percentage calculations
- Immutable operations

**utils/dom.js** (Helper Functions)
- DOM manipulation helpers
- Element creation utilities
- Event listener management
- Show/hide utilities

## Design Patterns

### 1. Factory Pattern
Components use factory functions instead of classes for flexibility:
```javascript
const lesson = createLesson('1');
lesson.render(container);
```

### 2. Observer Pattern
State management uses pub/sub for reactive updates:
```javascript
store.subscribe('component-id', (oldState, newState) => {
  // React to state changes
});
```

### 3. Module Pattern
ES6 modules for encapsulation and dependency management:
```javascript
export { createLesson, getAllLessons };
```

### 4. Singleton Pattern
Single instances of router and store:
```javascript
export const router = new Router();
export const store = new StateStore(defaultState);
```

## State Flow

1. User interacts with UI
2. Component triggers state update via `store.setState()`
3. Store notifies all subscribers
4. Subscribed components re-render if needed
5. State persisted to localStorage

## Routing Flow

1. User navigates (clicks link or browser back/forward)
2. Hash changes trigger `hashchange` event
3. Router matches hash to registered route
4. Route handler called with parameters
5. App renders appropriate component

## Testing Strategy

- **Unit tests** for pure functions (validation, arrays)
- **Integration tests** for state management
- **Vitest** as test runner with happy-dom for DOM testing
- Tests colocated with source files (`.test.js`)

## Key Features

✅ **ES6 Modules** - Modern import/export syntax
✅ **Factory Functions** - Flexible component creation
✅ **Observer Pattern** - Reactive state management
✅ **Hash Routing** - SPA navigation without page reloads
✅ **Pure Functions** - Testable utilities
✅ **LocalStorage** - State persistence
✅ **Accessibility** - ARIA attributes and keyboard nav
