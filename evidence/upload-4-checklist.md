# Upload 4 - Evidence Checklist

## Required Deliverables

### ✅ Code Implementation

- [x] Input validation functions (`validation.js`)
- [x] XSS defenses (CSP, sanitization)
- [x] Code-splitting with dynamic imports (`app.js`)
- [x] Image/asset optimization strategy
- [x] CI pipeline configuration (`.github/workflows/ci.yml`)
- [x] All tests passing (64/64)

### 📸 Screenshots Needed

#### 1. CI Pipeline Running
**Capture:**
- GitHub Actions workflow executing
- All jobs (test, build, security, performance) passing
- Test results showing 64 tests passed
- Green checkmarks for each stage

**How to get:**
1. Push code to GitHub
2. Go to Actions tab
3. Screenshot workflow run

#### 2. Test Results
**Capture:**
- Terminal showing `npm test -- --run`
- Output showing "Test Files  5 passed (5)"
- Output showing "Tests  64 passed (64)"
- Duration and coverage stats

**Command:**
```bash
npm test -- --run
```

#### 3. DevTools Performance Trace
**Capture:**
- Network tab showing module loading
- Performance tab with timeline
- Coverage tab showing code utilization
- Console showing no CSP violations

**Steps:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Record page load
4. Screenshot timeline showing:
   - Initial load
   - Lazy module loading
   - Network waterfall

#### 4. Bundle Size Analysis
**Capture:**
- File sizes in docs/js/ directory
- Before/after code-splitting comparison
- Network tab showing separate chunk loading

**Command:**
```bash
# Windows PowerShell
Get-ChildItem -Path docs/js -Recurse -File | Select-Object Name, Length | Format-Table
```

#### 5. Security Features Demo
**Capture:**
- Console showing CSP policy
- XSS attempt being blocked
- Sanitized output example
- Network tab showing HTTPS connections

**Test XSS:**
1. Try entering `<script>alert('xss')</script>` in search
2. Show sanitized output in console
3. Screenshot

### 📝 Code Excerpts Needed

Include in logbook:

1. **Input Validation** (`validation.js` lines 40-65)
```javascript
export function sanitizeHTML(str) { ... }
export function validateURL(url) { ... }
export function sanitizeInput(input, maxLength) { ... }
```

2. **Code Splitting** (`app.js` lines 1-40)
```javascript
// Dynamic imports
async loadLessonModule() { ... }
async loadQuizModule() { ... }
```

3. **CSP Header** (`index.html` line 6)
```html
<meta http-equiv="Content-Security-Policy" content="..." />
```

4. **CI Pipeline** (`.github/workflows/ci.yml` lines 1-50)
```yaml
name: CI Pipeline
jobs:
  test: ...
  build: ...
  security: ...
```

### 📊 Performance Metrics

**Capture:**
- Lighthouse report
- Network waterfall
- Bundle size comparison
- Test execution time

### 🔍 How to Capture Network Panel

1. Open DevTools (F12)
2. Go to Network tab
3. Clear (🚫 icon)
4. Reload page (Ctrl+R)
5. Screenshot showing:
   - Initial HTML load
   - app.js load
   - Lazy-loaded modules (Lesson.js, Quiz.js, Progress.js)
   - Total transfer size
   - DOMContentLoaded time
   - Load time

### 🔒 Security Audit Screenshot

**Command:**
```bash
npm audit
```

**Capture:**
- Terminal output showing "found 0 vulnerabilities"
- Package versions
- Audit summary

### ⚡ Performance Comparison

**Before Code-Splitting:**
- All modules loaded immediately
- Larger initial bundle

**After Code-Splitting:**
- Core modules only on initial load
- Lazy-loaded components on demand
- Smaller initial bundle

**Screenshot both scenarios**

---

## File Locations

### Source Code
- `docs/js/utils/validation.js` - Security functions
- `docs/js/app.js` - Code-splitting implementation
- `docs/index.html` - CSP meta tag
- `.github/workflows/ci.yml` - CI pipeline
- `docs/PERFORMANCE.md` - Performance documentation

### Test Files
- `docs/js/utils/validation.test.js` - Security tests
- `docs/js/api/api.test.js` - API tests
- `docs/js/store/state.test.js` - State tests
- `docs/js/utils/arrays.test.js` - Utility tests
- `docs/js/utils/debounce.test.js` - Performance tests

### Documentation
- `evidence/upload-4-documentation.md` - Main documentation
- `docs/PERFORMANCE.md` - Performance guide
- `README.md` - Project overview

---

## Commands Reference

```bash
# Run tests
npm test

# Run tests in CI mode
npm test -- --run

# Generate coverage
npm run test:coverage

# Security audit
npm audit

# Check file sizes (PowerShell)
Get-ChildItem -Path docs/js -Recurse -File | Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}} | Format-Table

# Run linter
npm run lint

# Build
npm run build
```

---

## Evidence Organization

### Recommended Structure
```
evidence/
├── upload-4-screenshots/
│   ├── 01-ci-pipeline-running.png
│   ├── 02-all-tests-passing.png
│   ├── 03-devtools-performance.png
│   ├── 04-network-waterfall.png
│   ├── 05-code-coverage.png
│   ├── 06-security-audit.png
│   ├── 07-xss-prevention-demo.png
│   ├── 08-bundle-size-comparison.png
│   └── 09-lighthouse-score.png
├── upload-4-code-snippets.md
└── upload-4-documentation.md
```

---

## Explanation Points

When documenting, explain:

1. **Why CSP?** - Prevents inline script injection
2. **Why code-splitting?** - Reduces initial load time
3. **Why sanitization?** - Prevents XSS attacks
4. **Why CI pipeline?** - Ensures code quality
5. **Why multiple test stages?** - Catches different issues
6. **Why IndexedDB?** - Offline support
7. **Why dynamic imports?** - Better performance

---

## Quality Checklist

Before submitting:

- [ ] All tests passing (64/64)
- [ ] No console errors
- [ ] CSP enabled and working
- [ ] Code-splitting demonstrable
- [ ] CI pipeline configured
- [ ] Documentation complete
- [ ] Screenshots captured
- [ ] Code excerpts included
- [ ] Performance metrics recorded
- [ ] Security features documented

---

## Tips for Demonstrating

### For Code-Splitting
1. Open Network tab
2. Navigate to home
3. Click Lessons - watch Lesson.js load
4. Click Quiz - watch Quiz.js load
5. Show separate chunk requests

### For XSS Protection
1. Open Console tab
2. Try: `document.body.innerHTML = '<img src=x onerror=alert(1)>'`
3. Show CSP blocks it
4. Try search with `<script>alert('xss')</script>`
5. Show sanitized output

### For CI Pipeline
1. Make a small change
2. Commit and push
3. Show GitHub Actions running
4. Show all checks passing
5. Show test output

---

## Next Steps

1. **Capture all screenshots** ✅
2. **Create code snippets document** 📝
3. **Write explanations** 💬
4. **Organize in ZIP file** 📦
5. **Create PDF summary** 📄
6. **Submit** 🚀

