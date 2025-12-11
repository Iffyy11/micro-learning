// a11y.js — skip-link focus and accessible nav toggle (small, dependency-free)
document.addEventListener("DOMContentLoaded", () => {
  // Skip link behavior
  const skip = document.querySelector(".skip-link");
  const main = document.querySelector("main");
  if (skip && main) {
    skip.addEventListener("click", (_e) => {
      // Ensure the element can receive focus, then focus it
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    });
  }

  // Nav toggle (mobile)
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
      // Move focus into nav when opening
      if (!expanded) {
        const firstLink = nav.querySelector("a");
        if (firstLink) {firstLink.focus();}
      }
    });
  }

  // Simple keyboard helper: escape closes nav
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        if (navToggle) {navToggle.setAttribute("aria-expanded", "false");}
        navToggle?.focus();
      }
    }
  });
});
