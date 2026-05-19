/* ============================================================
   footer.js — Expandable footer grid
   opleidingindezorg.nl
   ============================================================ */
(function () {
  'use strict';

  var footer = document.getElementById('site-footer');
  var toggle = document.getElementById('footer-toggle');
  if (!footer || !toggle) { return; }

  toggle.addEventListener('click', function () {
    var isOpen = footer.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();
