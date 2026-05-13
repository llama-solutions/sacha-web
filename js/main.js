(function () {
  'use strict';

  const STORAGE_KEY = 'sacha-lang';
  const DEFAULT_LANG = 'fr';
  const SUPPORTED_LANGS = ['sr', 'it', 'fr'];

  let content = null;
  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = DEFAULT_LANG;

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    loadContent().then(function () {
      updatePageLang();
    });
  }

  function getContentBase() {
    var script = document.querySelector('script[src*="main.js"]');
    if (script && script.src) {
      try {
        return script.src.replace(/\/js\/main\.js(\?.*)?$/, '/');
      } catch (e) {}
    }
    return '';
  }

  async function loadContent() {
    if (content) return content;
    var base = getContentBase();
    var urls = [base + 'data/content.json'];
    if (base) urls.push('data/content.json');
    for (var i = 0; i < urls.length; i++) {
      try {
        var res = await fetch(urls[i]);
        if (!res.ok) continue;
        content = await res.json();
        return content;
      } catch (e) {}
    }
    console.warn('Could not load data/content.json. Use a local server (e.g. python -m http.server 8000).');
    return null;
  }

  function t(obj) {
    if (!obj || typeof obj !== 'object') return '';
    return obj[currentLang] != null ? obj[currentLang] : obj[DEFAULT_LANG] || '';
  }

  function updatePageLang() {
    if (!content) return;
    document.documentElement.lang = currentLang === 'sr' ? 'sr' : currentLang === 'it' ? 'it' : 'fr';
    document.querySelectorAll('.lang-switcher button').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
    var path = (window.location.pathname || '').split('/').pop() || 'index.html';
    if (path === 'tour-detail.html') path = 'tours.html';
    document.querySelectorAll('.nav-main a').forEach(function (a) {
      var href = (a.getAttribute('href') || '');
      var linkPath = href.split('/').pop() || '';
      a.classList.toggle('active', linkPath === path || (path === '' && linkPath === 'index.html'));
    });
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var val = getNested(content, key);
      if (val != null) el.textContent = typeof val === 'object' ? t(val) : String(val);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (!key) return;
      var val = getNested(content, key);
      if (val != null) el.innerHTML = typeof val === 'object' ? t(val) : String(val);
    });
    if (typeof window.renderPageContent === 'function') window.renderPageContent();
  }

  function getNested(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-switcher button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.dataset.lang);
      });
    });
  }

  function initMobileNav() {
    var toggle = document.getElementById('nav-menu-toggle');
    var panel = document.getElementById('site-nav-panel');
    var backdrop = document.getElementById('nav-backdrop');
    if (!toggle || !panel || !backdrop) return;

    var mqDesktop = window.matchMedia('(min-width: 901px)');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('nav-menu-open', open);
    }

    function closeMenu() {
      setOpen(false);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    backdrop.addEventListener('click', closeMenu);

    panel.addEventListener('click', function (e) {
      var el = e.target;
      if (!el || typeof el.closest !== 'function') return;
      if (el.closest('.nav-main a') || el.closest('.lang-switcher button')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      closeMenu();
      toggle.focus();
    });

    function onViewportNavModeChange() {
      if (mqDesktop.matches) closeMenu();
    }

    if (typeof mqDesktop.addEventListener === 'function') {
      mqDesktop.addEventListener('change', onViewportNavModeChange);
    } else if (typeof mqDesktop.addListener === 'function') {
      mqDesktop.addListener(onViewportNavModeChange);
    }
    window.addEventListener('resize', onViewportNavModeChange);
  }

  function init() {
    loadContent().then(function () {
      updatePageLang();
    });
    initLangSwitcher();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Sacha = window.Sacha || {};
  window.Sacha.lang = getLang;
  window.Sacha.setLang = setLang;
  window.Sacha.content = function () { return content; };
  window.Sacha.t = t;
  window.Sacha.loadContent = loadContent;
})();
