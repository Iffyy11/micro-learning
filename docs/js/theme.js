(function(){
  // theme.js - simple theme switcher with persistence
  const THEMES = ['theme-default','theme-wireframe','theme-warm'];
  const storageKey = 'microlearning:theme';

  function apply(theme) {
    // apply theme to <body> so pages that pre-set body classes are respected
    document.body.classList.remove(...THEMES);
    if (theme) {document.body.classList.add(theme);}
    // update toggle buttons if present
    const btns = document.querySelectorAll('.theme-toggle button[data-theme]');
    btns.forEach(b=> b.setAttribute('aria-pressed', b.getAttribute('data-theme')===theme ? 'true' : 'false'));
  }

  function init() {
    const saved = localStorage.getItem(storageKey);
    const initial = saved || (document.body.classList.contains('theme-warm') ? 'theme-warm' : 'theme-default');
    apply(initial);

    // attach listeners
    document.addEventListener('click', e=>{
      const btn = e.target.closest && e.target.closest('.theme-toggle button[data-theme]');
      if (!btn) {return;}
      const t = btn.getAttribute('data-theme');
      localStorage.setItem(storageKey, t);
      apply(t);
    });

    // allow keyboard arrow navigation between theme buttons
    document.addEventListener('keydown', e=>{
      const active = document.activeElement;
      if (!active || !active.closest) {return;}
      const wrap = active.closest('.theme-toggle');
      if (!wrap) {return;}
      const btns = Array.from(wrap.querySelectorAll('button[data-theme]'));
      const idx = btns.indexOf(active);
      if (idx===-1) {return;}
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); const next = btns[(idx+1)%btns.length]; next.focus();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); const prev = btns[(idx-1+btns.length)%btns.length]; prev.focus();
      }
    });
  }

  if (document.readyState === 'loading') {document.addEventListener('DOMContentLoaded', init);}
  else {init();}
})();
