/* ============================================================
   filter.js — Organisation overview & "andere organisaties" block
   opleidingindezorg.nl
   - grid / list view toggle (org overview + open-dagen agenda)
   - organisation filters: work client-side here.
   WORDPRESS: replace the filtering with a WP_Query tax_query on the
   org_type / bbl_niveau / werkplek taxonomies; the result count then
   comes from $query->found_posts.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Grid / list view toggle ----------
     The org overview uses #org-grid, the open-dagen agenda #agenda-grid. */
  var viewGrid = document.getElementById('org-grid') ||
                 document.getElementById('agenda-grid');
  var viewButtons = Array.prototype.slice.call(
    document.querySelectorAll('.filterbar__view button'));

  if (viewGrid && viewButtons.length) {
    viewButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        viewButtons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        viewGrid.classList.toggle('org-grid--list',
          btn.getAttribute('data-view') === 'list');
      });
    });
  }

  /* ---------- Organisation filters ----------
     Each .filterbar filters the .org-grid inside the same <section>. */
  function has(list, value) {
    return (' ' + (list || '') + ' ').indexOf(' ' + value + ' ') > -1;
  }

  Array.prototype.slice.call(document.querySelectorAll('.filterbar'))
    .forEach(function (bar) {
      var section = bar.closest('section');
      var grid = section && section.querySelector('.org-grid');
      if (!grid) { return; }

      var cards = Array.prototype.slice.call(grid.querySelectorAll('.org-card'));
      var selects = Array.prototype.slice.call(
        bar.querySelectorAll('.filterbar__select[data-filter]'));
      if (!cards.length || !selects.length) { return; }

      var countEl = document.getElementById('org-count');

      /* Empty-state message, created once and kept just after the grid. */
      var emptyEl = document.createElement('p');
      emptyEl.className = 'org-grid-empty';
      emptyEl.setAttribute('role', 'status');
      emptyEl.hidden = true;
      emptyEl.textContent =
        'Geen organisaties gevonden met deze filters. Pas je selectie aan.';
      grid.parentNode.insertBefore(emptyEl, grid.nextSibling);

      function apply() {
        var type = '', niveau = '', werkplek = '';
        selects.forEach(function (sel) {
          var f = sel.getAttribute('data-filter');
          if (f === 'type') { type = sel.value; }
          else if (f === 'niveau') { niveau = sel.value; }
          else if (f === 'werkplek') { werkplek = sel.value; }
        });

        var visible = 0;
        cards.forEach(function (card) {
          var show =
            (!type     || card.getAttribute('data-org-type') === type) &&
            (!niveau   || has(card.getAttribute('data-org-niveaus'), niveau)) &&
            (!werkplek || has(card.getAttribute('data-org-werkplek'), werkplek));
          card.hidden = !show;
          if (show) { visible++; }
        });

        if (countEl) {
          countEl.textContent = visible +
            (visible === 1 ? ' organisatie' : ' organisaties');
        }
        emptyEl.hidden = visible !== 0;
      }

      selects.forEach(function (sel) { sel.addEventListener('change', apply); });
      apply(); /* sets the initial result count */
    });
})();
