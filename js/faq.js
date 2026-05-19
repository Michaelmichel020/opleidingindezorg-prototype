/* ============================================================
   faq.js — Accordion with smooth max-height transition
   opleidingindezorg.nl
   ============================================================ */
(function () {
  'use strict';

  var triggers = Array.prototype.slice.call(document.querySelectorAll('.faq__trigger'));
  if (!triggers.length) { return; }

  function closeItem(item) {
    item.classList.remove('is-open');
    var trg = item.querySelector('.faq__trigger');
    var pnl = item.querySelector('.faq__panel');
    if (trg) { trg.setAttribute('aria-expanded', 'false'); }
    if (pnl) { pnl.style.maxHeight = null; }
  }

  function openItem(item) {
    item.classList.add('is-open');
    var trg = item.querySelector('.faq__trigger');
    var pnl = item.querySelector('.faq__panel');
    if (trg) { trg.setAttribute('aria-expanded', 'true'); }
    if (pnl) { pnl.style.maxHeight = pnl.scrollHeight + 'px'; }
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq__item');
      var isOpen = item.classList.contains('is-open');

      /* Close all others */
      Array.prototype.slice.call(document.querySelectorAll('.faq__item.is-open')).forEach(closeItem);

      /* Open this one if it was not already open */
      if (!isOpen) { openItem(item); }
    });
  });

  /* Recalculate the height of an open item on resize */
  window.addEventListener('resize', function () {
    var open = document.querySelector('.faq__item.is-open .faq__panel');
    if (open) { open.style.maxHeight = open.scrollHeight + 'px'; }
  });
})();
