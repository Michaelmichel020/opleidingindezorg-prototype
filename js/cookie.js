/* ============================================================
   cookie.js — Cookie notice
   opleidingindezorg.nl
   Shows the notice until a choice is made; the choice is stored
   in localStorage so the notice does not return.
   NB: this is a prototype. In WordPress, use a consent plugin
   (Complianz / CookieYes) that also blocks the actual scripts.
   ============================================================ */
(function () {
  'use strict';

  var notice = document.getElementById('cookie-notice');
  if (!notice) { return; }

  var KEY = 'oiz-cookie-consent';

  function hasConsent() {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  }
  function store(consent) {
    try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch (e) {}
    notice.hidden = true;
  }
  function showView(name) {
    Array.prototype.slice.call(notice.querySelectorAll('.cookie__view')).forEach(function (v) {
      v.hidden = (v.getAttribute('data-cookie-view') !== name);
    });
  }

  /* Show the notice on first visit (no stored choice yet). */
  if (!hasConsent()) { notice.hidden = false; }

  notice.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cookie]');
    if (!btn) { return; }
    var action = btn.getAttribute('data-cookie');

    if (action === 'customize') {
      showView('settings');
      return;
    }
    if (action === 'accept-all') {
      store({ functioneel: true, analytisch: true, marketing: true });
      return;
    }
    if (action === 'save') {
      var consent = { functioneel: true };
      Array.prototype.slice.call(notice.querySelectorAll('[data-cookie-cat]')).forEach(function (cb) {
        consent[cb.getAttribute('data-cookie-cat')] = cb.checked;
      });
      store(consent);
      return;
    }
  });
})();
