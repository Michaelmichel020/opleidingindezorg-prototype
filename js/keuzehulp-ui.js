/* ============================================================
   keuzehulp-ui.js — Presentation interactivity for the Keuzehulp wizard
   WP NOTE: this is a demo layer for the wireframe. The external developer
   replaces or wraps this with the real wizard state engine. The HTML
   markup (data-screen, data-value, .kh-option, data-multi) is the
   contract — animations and conditionals here are reference behaviour.

   Supports multiple .kh-wizard instances on a single page (e.g. the
   standalone /keuzehulp/ page plus the wizard inside the floating widget).
   Each instance gets its own state, its own scoped DOM queries and its
   own apply-modal.
   ============================================================ */

(function () {
  'use strict';

  function initWizard(root) {
    if (root.dataset.khInit === 'true') return;
    root.dataset.khInit = 'true';

    // ---------- Flow definition (screen IDs are the contract) ----------
    const FLOW = ['start', 'naam', '1', '2', '3', 'contact', '4', '5', '6', 'loading', 'result', 'bedankt'];

    // Progress is only visible on screens 1..6 — current = parseInt(screenId).
    const PROGRESS_SCREENS = ['1', '2', '3', '4', '5', '6'];

    // ---------- State (presentation only, no real scoring) ----------
    const state = {
      voornaam: '',
      answers: Object.create(null),
    };

    // ---------- DOM (scoped to this root) ----------
    const $screens = Array.from(root.querySelectorAll('.kh-screen'));
    const $progress = root.querySelector('.kh-progress');
    const $progressSteps = $progress ? Array.from($progress.querySelectorAll('.kh-progress__step')) : [];
    const $progressLabels = $progress ? Array.from($progress.querySelectorAll('.kh-progress__labels span')) : [];
    const modal = root.querySelector('.kh-modal');

    let currentIndex = 0;

    function screenEl(id) {
      return root.querySelector('.kh-screen[data-screen="' + id + '"]');
    }

    // ---------- Screen navigation ----------
    function goTo(id) {
      const idx = FLOW.indexOf(id);
      if (idx === -1) return;
      currentIndex = idx;
      activateScreen(id);
      updateProgress(id);

      if (id === 'loading') {
        setTimeout(() => goTo('result'), 1800);
      }
    }

    function next() {
      const id = FLOW[currentIndex];
      captureInputs(id);
      if (id === 'naam') applyPersonalisation();
      const nextId = FLOW[Math.min(currentIndex + 1, FLOW.length - 1)];
      goTo(nextId);
    }

    function prev() {
      const id = FLOW[currentIndex];
      if (id === 'loading' || id === 'result' || id === 'bedankt') return;
      const prevId = FLOW[Math.max(currentIndex - 1, 0)];
      goTo(prevId);
    }

    function activateScreen(id) {
      $screens.forEach(s => s.classList.remove('is-active'));
      const el = screenEl(id);
      if (!el) return;
      el.classList.add('is-active');
      const title = el.querySelector('.kh-title, .kh-loading__title, .kh-thanks__title');
      if (title) {
        title.setAttribute('tabindex', '-1');
        requestAnimationFrame(() => {
          try { title.focus({ preventScroll: true }); } catch (e) { title.focus(); }
        });
      }
    }

    function updateProgress(id) {
      if (!$progress) return;
      const showProgress = PROGRESS_SCREENS.indexOf(id) !== -1;
      $progress.hidden = !showProgress;
      if (!showProgress) return;

      const step = parseInt(id, 10);
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
        t.textContent = state.voornaam || '[Voornaam]';
      });
    }

    // ---------- Capture inputs on screen change ----------
    function captureInputs(id) {
      const el = screenEl(id);
      if (!el) return;
      el.querySelectorAll('input').forEach(inp => {
        if (inp.name && inp.type !== 'checkbox') state.answers[inp.name] = inp.value;
      });
    }

    // ---------- Option selection (single + multi) ----------
    root.addEventListener('click', function (e) {
      const opt = e.target.closest('.kh-option');
      if (!opt || !root.contains(opt)) return;
      const group = opt.closest('.kh-options');
      if (!group) return;

      const multi = group.getAttribute('data-multi') === 'true';
      const value = opt.getAttribute('data-value');
      const screenContainer = opt.closest('.kh-screen');
      if (!screenContainer) return;
      const screenId = screenContainer.getAttribute('data-screen');

      // Niveau-grid sits inside screen 4 — give it its own answer key.
      const groupKey = group.classList.contains('kh-options--niveau') ? '4-niveau' : screenId;

      if (multi) {
        const wasSelected = opt.classList.toggle('is-selected');
        opt.setAttribute('aria-pressed', wasSelected ? 'true' : 'false');
        const current = Array.isArray(state.answers[groupKey]) ? state.answers[groupKey].slice() : [];
        const idx = current.indexOf(value);
        if (wasSelected && idx === -1) current.push(value);
        if (!wasSelected && idx !== -1) current.splice(idx, 1);
        state.answers[groupKey] = current;
      } else {
        group.querySelectorAll('.kh-option').forEach(o => {
          o.classList.remove('is-selected');
          o.setAttribute('aria-pressed', 'false');
        });
        opt.classList.add('is-selected');
        opt.setAttribute('aria-pressed', 'true');
        state.answers[groupKey] = value;
        handleConditionals(screenId, value);
      }
    });

    // ---------- Conditional reveals ----------
    function handleConditionals(screenId, value) {
      const screen = screenEl(screenId);
      if (!screen) return;

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

    // ---------- Nav buttons (delegated, scoped to root) ----------
    root.addEventListener('click', function (e) {
      const nextBtn = e.target.closest('[data-action="next"]');
      if (nextBtn && root.contains(nextBtn)) {
        e.preventDefault();
        next();
        return;
      }
      const prevBtn = e.target.closest('[data-action="prev"]');
      if (prevBtn && root.contains(prevBtn)) {
        e.preventDefault();
        prev();
        return;
      }
      const goBtn = e.target.closest('[data-action="goto"]');
      if (goBtn && root.contains(goBtn)) {
        e.preventDefault();
        goTo(goBtn.getAttribute('data-target'));
        return;
      }
      const applyBtn = e.target.closest('[data-action="apply"]');
      if (applyBtn && root.contains(applyBtn)) {
        e.preventDefault();
        openApplyModal(applyBtn.getAttribute('data-org'));
        return;
      }
      const startBtn = e.target.closest('[data-action="start"]');
      if (startBtn && root.contains(startBtn)) {
        e.preventDefault();
        goTo('naam');
        return;
      }
    });

    // ---------- Apply modal (scoped) ----------
    function openApplyModal(orgValue) {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'false');

      const emailIn = modal.querySelector('[data-modal-field="email"]');
      const phoneIn = modal.querySelector('[data-modal-field="telefoon"]');
      const nameIn  = modal.querySelector('[data-modal-field="voornaam"]');
      if (emailIn && state.answers.email)    emailIn.value = state.answers.email;
      if (phoneIn && state.answers.telefoon) phoneIn.value = state.answers.telefoon;
      if (nameIn  && state.voornaam)         nameIn.value  = state.voornaam;

      if (orgValue) {
        modal.querySelectorAll('[data-modal-org]').forEach(cb => {
          cb.checked = cb.getAttribute('data-modal-org') === orgValue;
        });
      }

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
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
          closeApplyModal();
        }
      });
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

    // ---------- Init ----------
    goTo('start');
  }

  // Initialise every .kh-wizard on the page (standalone + float).
  function bootAll() {
    document.querySelectorAll('.kh-wizard').forEach(initWizard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();
