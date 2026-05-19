/* ============================================================
   widget.js — Floating help widget
   opleidingindezorg.nl
   Opens a panel with three choices; each choice loads its content
   (keuzehulp / question form / application form) into the same panel.
   Field validation is handled by js/forms.js.
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
      /* reset a form view to its initial state (form shown, success hidden) */
      var form    = v.querySelector('.widget__form');
      var success = v.querySelector('.widget__success');
      var intro   = v.querySelector('.widget__view-intro');
      if (form)    { form.hidden = false; }
      if (success) { success.hidden = true; }
      if (intro)   { intro.hidden = false; }
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

  /* ---------- Widget forms: keep the submit inside the panel ----------
     js/forms.js validates and shows the field errors. After a valid
     submit we show an inline confirmation instead of navigating away. */
  Array.prototype.slice.call(widget.querySelectorAll('.widget__form')).forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      /* let forms.js finish its synchronous validation first */
      setTimeout(function () {
        if (form.querySelector('.is-invalid') ||
            form.querySelector('.form__error.is-visible')) {
          return;
        }
        var view    = form.closest('.widget__view');
        var success = view ? view.querySelector('.widget__success') : null;
        if (!success) { return; }
        var intro = view.querySelector('.widget__view-intro');
        form.reset();
        form.hidden = true;
        if (intro) { intro.hidden = true; }
        success.hidden = false;
        if (body) { body.scrollTop = 0; }
      }, 0);
    });
  });

  showView('menu');
})();
