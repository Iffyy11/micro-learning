# Source Tree - Upload 2

This document shows the complete source code structure for the modular architecture implementation.

## Project Root
```
micro-learning/
├── package.json                    # NPM configuration with Vitest
├── vitest.config.js               # Test configuration
├── README.md                       # Project documentation
├── docs/                          # Application code
│   ├── index.html                 # Entry HTML (updated for modules)
│   ├── css/
│   │   ├── tokens.css            # Design tokens
│   │   └── base.css              # Base styles
│   ├── js/
│   │   ├── app.js                # Main application entry point ⭐
│   │   ├── a11y.js               # Accessibility helpers (legacy)
│   │   ├── store/
│   │   │   ├── state.js          # State store with Observer pattern ⭐
│   │   │   └── state.test.js     # State unit tests ⭐
│   │   ├── router/
│   │   │   └── router.js         # Hash-based routing system ⭐
│   │   ├── components/
│   │   │   ├── Lesson.js         # Lesson component factory ⭐
│   │   │   ├── Quiz.js           # Quiz component factory ⭐
│   │   │   └── Progress.js       # Progress component factory ⭐
│   │   └── utils/
│   │       ├── validation.js     # Validation utilities ⭐
│   │       ├── validation.test.js # Validation tests ⭐
│   │       ├── arrays.js         # Array utilities ⭐
│   │       ├── arrays.test.js    # Array tests ⭐
│   │       └── dom.js            # DOM utilities ⭐
│   └── views/                     # Static HTML pages (legacy)
│       ├── lesson1.html
│       ├── lesson2.html
│       └── form.html
├── evidence/
│   ├── module-structure.md        # Module documentation ⭐
│   ├── source-tree.md            # This file ⭐
│   └── evidence lighthouse accessibility.html
└── wireframes/                    # Design wireframes
    └── *.png
```

⭐ = New files for Upload 2

## Module Statistics

### Code Organization
- **Total Modules:** 13 ES6 modules
- **Components:** 3 factory-based components
- **Utilities:** 3 utility modules with pure functions
- **Tests:** 3 test suites with 30+ test cases
- **Lines of Code:** ~1,500 lines (excluding tests)

### Module Types
1. **Core Application** (1 module)
   - `app.js` - Main entry point and orchestration

2. **State Management** (1 module)
   - `store/state.js` - Centralized state with Observer pattern

3. **Routing** (1 module)
   - `router/router.js` - Hash-based SPA routing

4. **Components** (3 modules)
   - `components/Lesson.js` - Lesson display and navigation
   - `components/Quiz.js` - Interactive quizzes with grading
   - `components/Progress.js` - Progress tracking and achievements

5. **Utilities** (3 modules)
   - `utils/validation.js` - Pure validation functions
   - `utils/arrays.js` - Pure array manipulation functions
   - `utils/dom.js` - DOM helper functions

6. **Tests** (3 modules)
   - `utils/validation.test.js` - 20+ validation tests
   - `utils/arrays.test.js` - 15+ array utility tests
   - `store/state.test.js` - 12+ state management tests

## Import Relationships

### Level 0 (No Dependencies)
```
utils/validation.js
utils/arrays.js
utils/dom.js
```

### Level 1 (Depends on Level 0)
```
store/state.js
  └── (uses utils/arrays.js internally for calculations)
```

### Level 2 (Depends on Level 0-1)
```
router/router.js
  └── store/state.js

components/Lesson.js
  ├── store/state.js
  └── router/router.js

components/Quiz.js
  ├── store/state.js
  └── utils/validation.js
```

### Level 3 (Depends on Level 0-2)
```
components/Progress.js
  ├── store/state.js
  └── components/Lesson.js
```

### Level 4 (Top Level)
```
app.js
  ├── router/router.js
  ├── store/state.js
  ├── components/Lesson.js
  ├── components/Quiz.js
  ├── components/Progress.js
  └── utils/dom.js
```

## Key Design Decisions

### 1. Factory Pattern over Classes
- Components use factory functions (e.g., `createLesson()`)
- More flexible than class-based components
- Easier to test and compose

### 2. Centralized State
- Single source of truth in `store/state.js`
- Observer pattern for reactive updates
- LocalStorage persistence

### 3. Hash-based Routing
- No server configuration required
- Works with GitHub Pages
- Browser back/forward support

### 4. Pure Utility Functions
- All utilities in `utils/` are pure functions
- Easy to test in isolation
- No side effects

### 5. Test Colocation
- Tests live next to source files
- Easy to find and maintain
- Vitest for fast test execution

## Running the Application

### Development Server
```bash
npm install
npm run dev
```

### Running Tests
```bash
npm test              # Run tests in watch mode
npm run test:ui       # Open test UI
npm run test:coverage # Generate coverage report
```

## Evidence for Upload 2

✅ **Module Structure** - See directory tree above
✅ **Class/Factory Design** - Factory functions in components/
✅ **State Store** - Observer pattern in store/state.js
✅ **Routing** - Hash-based routing in router/router.js
✅ **Core UI Logic** - Main app orchestration in app.js
✅ **Tests for Pure Functions** - 3 test suites with 47+ tests
✅ **Module Import Graph** - See module-structure.md
