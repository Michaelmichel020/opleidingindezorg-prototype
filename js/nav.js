/* ============================================================
   nav.js — Mega menu, hamburger, sticky header, active state
   opleidingindezorg.nl
   ============================================================ */
(function () {
  'use strict';

  var header      = document.getElementById('site-header');
  var navItems    = Array.prototype.slice.call(document.querySelectorAll('.nav__item[data-menu]'));
  var overlay     = document.getElementById('mega-overlay');
  var hamburger   = document.getElementById('nav-hamburger');
  var mobileNav   = document.getElementById('mobile-nav');
  var mobileBack  = document.getElementById('mobile-nav-backdrop');

  var HOVER_DELAY = 300;     // ms — hover intent
  var SCROLL_AT   = 80;      // px — sticky 'is-scrolled'
  var openTimer   = null;
  var closeTimer  = null;
  var activeMenu  = null;

  /* ---------- Mega menu ---------- */
  function megaFor(item) {
    return document.getElementById('mega-' + item.getAttribute('data-menu'));
  }
  function triggerFor(item) {
    return item.querySelector('.nav__trigger');
  }

  function openMenu(item) {
    if (activeMenu === item) { return; }
    closeMenu();
    var mega = megaFor(item);
    if (!mega) { return; }
    mega.classList.add('is-open');
    triggerFor(item).setAttribute('aria-expanded', 'true');
    if (overlay) { overlay.classList.add('is-open'); }
    activeMenu = item;
  }

  function closeMenu() {
    navItems.forEach(function (item) {
      var mega = megaFor(item);
      if (mega) { mega.classList.remove('is-open'); }
      triggerFor(item).setAttribute('aria-expanded', 'false');
    });
    if (overlay) { overlay.classList.remove('is-open'); }
    activeMenu = null;
  }

  navItems.forEach(function (item) {
    var trigger = triggerFor(item);
    var mega    = megaFor(item);

    /* Hover intent: 300ms delay before opening */
    item.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      openTimer = setTimeout(function () { openMenu(item); }, HOVER_DELAY);
    });
    item.addEventListener('mouseleave', function () {
      clearTimeout(openTimer);
      closeTimer = setTimeout(closeMenu, HOVER_DELAY - 100);
    });
    if (mega) {
      mega.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
      mega.addEventListener('mouseleave', function () {
        closeTimer = setTimeout(closeMenu, HOVER_DELAY - 100);
      });
    }

    /* Click toggle (touch / keyboard) */
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      clearTimeout(openTimer);
      if (activeMenu === item) { closeMenu(); }
      else { openMenu(item); }
    });
  });

  /* Escape closes everything */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeMenu();
      closeMobile();
    }
  });

  /* Click outside the mega menu closes it */
  document.addEventListener('click', function (e) {
    if (!activeMenu) { return; }
    if (!e.target.closest('.nav__item') && !e.target.closest('.mega')) {
      closeMenu();
    }
  });
  if (overlay) { overlay.addEventListener('click', closeMenu); }

  /* ---------- Sticky header ---------- */
  function onScroll() {
    if (!header) { return; }
    if (window.pageYOffset > SCROLL_AT) { header.classList.add('is-scrolled'); }
    else { header.classList.remove('is-scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav drawer ---------- */
  function openMobile() {
    if (!mobileNav) { return; }
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (mobileBack) { mobileBack.classList.add('is-open'); }
    if (hamburger) { hamburger.setAttribute('aria-expanded', 'true'); }
    document.body.classList.add('nav-locked');
  }
  function closeMobile() {
    if (!mobileNav) { return; }
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    if (mobileBack) { mobileBack.classList.remove('is-open'); }
    if (hamburger) { hamburger.setAttribute('aria-expanded', 'false'); }
    document.body.classList.remove('nav-locked');
  }
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileNav.classList.contains('is-open')) { closeMobile(); }
      else { openMobile(); }
    });
  }
  if (mobileBack) { mobileBack.addEventListener('click', closeMobile); }

  /* ---------- Active state on the current section ---------- */
  var SECTION_PATHS = {
    'werken-leren':  '/werken-en-leren/',
    'organisaties':  '/zorgorganisaties/',
    'scholen':       '/scholen/',
    'over-ons':      '/over-ons/'
  };
  var path = window.location.pathname;
  navItems.forEach(function (item) {
    var base = SECTION_PATHS[item.getAttribute('data-menu')];
    if (base && path.indexOf(base) !== -1) {
      item.classList.add('is-active');
    }
  });
  /* Mobile nav active state */
  Array.prototype.slice.call(document.querySelectorAll('.mobile-nav__item')).forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href !== '/' && path.indexOf(href) !== -1) {
      link.classList.add('is-active');
    }
  });
})();
