/* ============================================================
   filter.js — Org overview: view toggle + filter placeholder
   opleidingindezorg.nl
   NOTE: in this prototype the filters are visual only, not functional.
         The grid/list toggle does work.
   ============================================================ */
(function () {
  'use strict';

  var grid = document.getElementById('org-grid');

  /* ---------- Grid / list view toggle ---------- */
  var viewButtons = Array.prototype.slice.call(document.querySelectorAll('.filterbar__view button'));
  if (grid && viewButtons.length) {
    viewButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        viewButtons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        var view = btn.getAttribute('data-view');
        grid.classList.toggle('org-grid--list', view === 'list');
      });
    });
  }

  /* ---------- Filter dropdowns (placeholder) ---------- */
  /* In the prototype the dropdowns only show the number of results.
     The PHP developer will later connect this to a WP_Query with tax_query. */
  var selects = Array.prototype.slice.call(document.querySelectorAll('.filterbar__select'));
  var countEl = document.getElementById('org-count');
  selects.forEach(function (sel) {
    sel.addEventListener('change', function () {
      if (countEl) {
        countEl.textContent = '8 organisaties, filter wordt actief in de WordPress-versie';
      }
      /* <!-- TODO: connect filter to WP_Query (tax_query org_type / bbl_niveau / werkplek) --> */
    });
  });
})();
