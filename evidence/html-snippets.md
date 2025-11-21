# HTML Snippets (Upload 1 Evidence)

This document contains short excerpts from my code demonstrating
semantic structure, accessibility features, and layout elements
required for Upload 1.

---

## 1. Skip Link
```html
<a class="skip-link" href="#main">Skip to main content</a>

## 2. SEMANTIC HEADER AND NAVIGATION
<header class="site-header" role="banner">
  <div class="container header-inner">
    <h1 class="logo">Micro-Learning Portal</h1>
  </div>
</header>

<nav class="primary-nav" aria-label="Primary navigation">
  <ul class="nav-list">
    <li><a href="../index.html">Home</a></li>
    <li><a href="lesson1.html">Lessons</a></li>
    <li><a href="form.html">Progress</a></li>
  </ul>
</nav>

## 3.MAIN CONTENT LANDMARK
<main id="main" class="main-content container" role="main" tabindex="-1">
  <h2>Learn fast. Learn anywhere.</h2>
  <p>Short lessons designed for quick progress.</p>
</main>

## 4.QUIZ PAGE
<form action="#" method="post" class="quiz-form"
      onsubmit="event.preventDefault(); alert('Answer submitted!');">
  <fieldset class="quiz-fieldset">
    <legend>Q1: What is caching?</legend>

    <div class="form-group">
      <input type="radio" id="q1a" name="q1" value="a">
      <label for="q1a">A method of storing data for faster access</label>
    </div>
  </fieldset>
</form>

## 5.Responsive card grid
<div class="card-grid">
  <a href="views/lesson1.html" class="card">
    <h3>Start a lesson</h3>
    <p>Jump into the first module.</p>
  </a>
</div>

## 6.Buttons
<div class="lesson-nav">
  <a class="btn" href="lesson0.html">Previous</a>
  <a class="btn" href="lesson2.html">Next</a>
</div>

## 7.Accessibility
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="../index.html">Home</a></li>
    <li>Lesson 1</li>
  </ol>
</nav>
