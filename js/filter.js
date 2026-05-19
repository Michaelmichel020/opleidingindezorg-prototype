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

  /* ---------- Result count + filter dropdowns (placeholder) ---------- */
  /* The result count is derived from the organisations actually rendered, so
     it never hardcodes a total: adding an organisation updates it on its own.
     In WordPress this value is $query->found_posts. The dropdowns are visual
     only; the PHP developer connects them to a WP_Query with a tax_query. */
  var countEl = document.getElementById('org-count');

  function orgCount() {
    return grid ? grid.querySelectorAll('.org-card').length : 0;
  }
  function renderCount(suffix) {
    if (countEl) {
      countEl.textContent = orgCount() + ' organisaties' + (suffix || '');
    }
  }
  renderCount();

  var selects = Array.prototype.slice.call(document.querySelectorAll('.filterbar__select'));
  selects.forEach(function (sel) {
    sel.addEventListener('change', function () {
      renderCount(', filter wordt actief in de WordPress-versie');
      /* TODO: connect filter to WP_Query (tax_query org_type / bbl_niveau / werkplek) */
    });
  });
})();
