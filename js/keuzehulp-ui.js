/* ============================================================
   keuzehulp-ui.js — Presentation interactivity for the Keuzehulp wizard
   WP NOTE: this is a demo layer for the wireframe. The external developer
   replaces or wraps this with the real wizard state engine. The HTML
   markup (data-screen, data-value, .kh-option, data-multi) is the
   contract — animations and conditionals here are reference behaviour.
   ============================================================ */

(function () {
  'use strict';

  const root = document.querySelector('.kh-wizard');
  if (!root) return;

  // ---------- Flow definition (screen IDs are the contract) ----------
  const FLOW = ['start', 'naam', '1', '2', '3', 'contact', '4', '5', '6', 'loading', 'result', 'bedankt'];

  // Progress is only visible on screens 1..6 — current = parseInt(screenId).
  const PROGRESS_SCREENS = ['1', '2', '3', '4', '5', '6'];

  // ---------- State (presentation only, no real scoring) ----------
  const state = {
    voornaam: '',
    answers: Object.create(null), // {screenId: value | [values]}
  };

  // ---------- DOM helpers ----------
  const $screens = Array.from(root.querySelectorAll('.kh-screen'));
  const $progress = root.querySelector('.kh-progress');
  const $progressSteps = $progress ? Array.from($progress.querySelectorAll('.kh-progress__step')) : [];
  const $progressLabels = $progress ? Array.from($progress.querySelectorAll('.kh-progress__labels span')) : [];

  function screenEl(id) {
    return root.querySelector('.kh-screen[data-screen="' + id + '"]');
  }

  // ---------- Screen navigation ----------
  let currentIndex = 0;

  function goTo(id) {
    const idx = FLOW.indexOf(id);
    if (idx === -1) return;
    currentIndex = idx;
    activateScreen(id);
    updateProgress(id);

    // Special-case: the loading screen auto-advances to result.
    if (id === 'loading') {
      setTimeout(() => goTo('result'), 1800);
    }
  }

  function next() {
    const id = FLOW[currentIndex];
    // Before leaving, capture inputs that live in this screen.
    captureInputs(id);
    // Personalise upcoming [Voornaam] tokens when leaving the name screen.
    if (id === 'naam') applyPersonalisation();
    const nextId = FLOW[Math.min(currentIndex + 1, FLOW.length - 1)];
    goTo(nextId);
  }

  function prev() {
    const id = FLOW[currentIndex];
    if (id === 'loading' || id === 'result' || id === 'bedankt') return; // no back from result-flow
    const prevId = FLOW[Math.max(currentIndex - 1, 0)];
    goTo(prevId);
  }

  function activateScreen(id) {
    $screens.forEach(s => s.classList.remove('is-active'));
    const el = screenEl(id);
    if (el) {
      // Restart the entrance animation by toggling display via class.
      el.classList.add('is-active');
      // Move focus to the screen title for screen-reader users.
      const title = el.querySelector('.kh-title, .kh-loading__title, .kh-thanks__title');
      if (title) {
        title.setAttribute('tabindex', '-1');
        // Defer so the browser actually paints the new screen first.
        requestAnimationFrame(() => title.focus({ preventScroll: false }));
      }
    }
  }

  function updateProgress(id) {
    if (!$progress) return;
    const showProgress = PROGRESS_SCREENS.indexOf(id) !== -1;
    $progress.hidden = !showProgress;

    if (!showProgress) return;

    const step = parseInt(id, 10); // 1..6
    $progressSteps.forEach((el, i) => {
      el.classList.remove('is-done', 'is-current');
      const stepIndex = i + 1;
      if (stepIndex < step) el.classList.add('is-done');
      else if (stepIndex === step) el.classList.add('is-current');
    });
    $progressLabels.forEach((el, i) => {
      el.classList.toggle('is-current', i + 1 === step);
    });
  }

  // ---------- Personalisation ([Voornaam] -> entered name) ----------
  function applyPersonalisation() {
    const input = root.querySelector('[data-field="voornaam"]');
    if (input && input.value.trim()) {
      state.voornaam = input.value.trim().split(/\s+/)[0];
    }
    const tokens = root.querySelectorAll('[data-name-token]');
    tokens.forEach(t => {
      // Keep [Voornaam] placeholder if empty (per briefing: laat placeholders staan).
      t.textContent = state.voornaam || '[Voornaam]';
    });
  }

  // ---------- Capture inputs on screen change ----------
  function captureInputs(id) {
    const el = screenEl(id);
    if (!el) return;
    el.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="postal-code"], input').forEach(inp => {
      if (inp.name) state.answers[inp.name] = inp.value;
    });
  }

  // ---------- Option selection (single + multi) ----------
  root.addEventListener('click', function (e) {
    const opt = e.target.closest('.kh-option');
    if (!opt) return;
    const group = opt.closest('.kh-options');
    if (!group) return;

    const multi = group.getAttribute('data-multi') === 'true';
    const value = opt.getAttribute('data-value');
    const screenId = opt.closest('.kh-screen').getAttribute('data-screen');

    if (multi) {
      const wasSelected = opt.classList.toggle('is-selected');
      opt.setAttribute('aria-pressed', wasSelected ? 'true' : 'false');
      // Track as array.
      const current = Array.isArray(state.answers[screenId]) ? state.answers[screenId].slice() : [];
      const idx = current.indexOf(value);
      if (wasSelected && idx === -1) current.push(value);
      if (!wasSelected && idx !== -1) current.splice(idx, 1);
      state.answers[screenId] = current;
    } else {
      // Single-select: deselect siblings.
      group.querySelectorAll('.kh-option').forEach(o => {
        o.classList.remove('is-selected');
        o.setAttribute('aria-pressed', 'false');
      });
      opt.classList.add('is-selected');
      opt.setAttribute('aria-pressed', 'true');
      state.answers[screenId] = value;

      // Conditional reveals after selection.
      handleConditionals(screenId, value);
    }
  });

  // ---------- Conditional reveals ----------
  function handleConditionals(screenId, value) {
    const screen = screenEl(screenId);
    if (!screen) return;

    // Screen 1: "dicht bij huis" — postcode visible when "ja"
    if (screenId === '1') {
      const postcodeBlock = screen.querySelector('[data-conditional="postcode"]');
      if (postcodeBlock) {
        postcodeBlock.classList.toggle('is-visible', value === 'ja');
        if (value === 'ja') {
          const input = postcodeBlock.querySelector('input');
          if (input) setTimeout(() => input.focus(), 300);
        }
      }
    }

    // Screen 4: diploma — niveau-group visible when "ja"; alternate note on "nee".
    if (screenId === '4') {
      const noteDefault = screen.querySelector('[data-note="default"]');
      const noteNee     = screen.querySelector('[data-note="nee"]');
      const niveauBlock = screen.querySelector('[data-conditional="niveau"]');

      if (value === 'ja') {
        if (noteDefault) noteDefault.hidden = true;
        if (noteNee)     noteNee.hidden = true;
        if (niveauBlock) niveauBlock.classList.add('is-visible');
      } else if (value === 'nee') {
        if (noteDefault) noteDefault.hidden = true;
        if (noteNee)     noteNee.hidden = false;
        if (niveauBlock) niveauBlock.classList.remove('is-visible');
      } else {
        if (noteDefault) noteDefault.hidden = false;
        if (noteNee)     noteNee.hidden = true;
        if (niveauBlock) niveauBlock.classList.remove('is-visible');
      }
    }
  }

  // ---------- Nav buttons (delegated) ----------
  root.addEventListener('click', function (e) {
    const nextBtn = e.target.closest('[data-action="next"]');
    if (nextBtn) {
      e.preventDefault();
      next();
      return;
    }
    const prevBtn = e.target.closest('[data-action="prev"]');
    if (prevBtn) {
      e.preventDefault();
      prev();
      return;
    }
    const goBtn = e.target.closest('[data-action="goto"]');
    if (goBtn) {
      e.preventDefault();
      goTo(goBtn.getAttribute('data-target'));
      return;
    }
    const applyBtn = e.target.closest('[data-action="apply"]');
    if (applyBtn) {
      e.preventDefault();
      openApplyModal(applyBtn.getAttribute('data-org'));
      return;
    }
  });

  // ---------- Apply modal ----------
  const modal = document.querySelector('.kh-modal');
  function openApplyModal(orgValue) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');

    // Pre-fill contact data captured at the contact screen.
    const emailIn = modal.querySelector('[data-modal-field="email"]');
    const phoneIn = modal.querySelector('[data-modal-field="telefoon"]');
    const nameIn  = modal.querySelector('[data-modal-field="voornaam"]');
    if (emailIn && state.answers.email)    emailIn.value = state.answers.email;
    if (phoneIn && state.answers.telefoon) phoneIn.value = state.answers.telefoon;
    if (nameIn  && state.voornaam)         nameIn.value  = state.voornaam;

    // Pre-select the chosen org checkbox; leave the others unchecked.
    if (orgValue) {
      modal.querySelectorAll('[data-modal-org]').forEach(cb => {
        cb.checked = cb.getAttribute('data-modal-org') === orgValue;
      });
    }

    // Focus the close button for keyboard users.
    setTimeout(() => {
      const close = modal.querySelector('.kh-modal__close');
      if (close) close.focus();
    }, 50);
  }

  function closeApplyModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.matches('[data-modal-close], .kh-modal__backdrop')) {
        closeApplyModal();
      }
    });
    // ESC closes.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeApplyModal();
      }
    });
    // Submit -> bedankt screen.
    const form = modal.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        closeApplyModal();
        goTo('bedankt');
      });
    }
  }

  // ---------- Postcode formatter (1234 AB) ----------
  const postcodeInput = root.querySelector('.kh-input--postcode');
  if (postcodeInput) {
    postcodeInput.addEventListener('input', function () {
      let v = this.value.replace(/\s+/g, '').toUpperCase();
      if (v.length > 4) v = v.slice(0, 4) + ' ' + v.slice(4, 6);
      this.value = v;
    });
  }

  // ---------- "Start" CTA on the start screen ----------
  const startBtn = root.querySelector('[data-action="start"]');
  if (startBtn) {
    startBtn.addEventListener('click', function (e) {
      e.preventDefault();
      goTo('naam');
    });
  }

  // ---------- Init ----------
  goTo('start');
})();
