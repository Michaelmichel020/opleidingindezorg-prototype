/* ============================================================
   widget.js — Floating help widget
   opleidingindezorg.nl
   Opens a panel with three choices; each choice loads its content
   (keuzehulp / question form / application form) into the same panel.
   The forms submit normally and redirect to a thank-you page;
   field validation is handled by js/forms.js.
   ============================================================ */
(function () {
  'use strict';

  var widget = document.getElementById('help-widget');
  if (!widget) { return; }

  var launcher = document.getElementById('widget-launcher');
  var views    = Array.prototype.slice.call(widget.querySelectorAll('.widget__view'));
  var body     = widget.querySelector('.widget__body');

  /* ---------- View switching ---------- */
  function showView(name) {
    views.forEach(function (v) {
      v.hidden = (v.getAttribute('data-view') !== name);
    });
    widget.setAttribute('data-view', name);
    if (body) { body.scrollTop = 0; }
  }

  /* ---------- Open / close ---------- */
  function openPanel() {
    widget.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
  }
  function closePanel() {
    widget.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', function () {
    if (widget.classList.contains('is-open')) { closePanel(); }
    else { openPanel(); }
  });

  widget.addEventListener('click', function (e) {
    var choice = e.target.closest('[data-goto]');
    if (choice) { showView(choice.getAttribute('data-goto')); return; }
    if (e.target.closest('[data-widget-back]'))  { showView('menu'); return; }
    if (e.target.closest('[data-widget-close]')) { closePanel(); return; }
  });

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && widget.classList.contains('is-open')) {
      closePanel();
    }
  });

  showView('menu');
})();
