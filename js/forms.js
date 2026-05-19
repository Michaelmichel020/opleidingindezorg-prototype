/* ============================================================
   forms.js — Validation, character counter, URL-param pre-fill
   opleidingindezorg.nl
   NOTE: in this prototype the forms do not submit any data. On a
         valid submit a redirect follows (method="get" action).
         In WordPress: Gravity Forms.
   ============================================================ */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- Character counter for textarea ---------- */
  Array.prototype.slice.call(document.querySelectorAll('.form__textarea[maxlength]')).forEach(function (ta) {
    var max   = ta.getAttribute('maxlength');
    var count = ta.parentNode.querySelector('.form__count');
    if (!count) { return; }
    function update() { count.textContent = ta.value.length + ' / ' + max; }
    ta.addEventListener('input', update);
    update();
  });

  /* ---------- URL parameter pre-fill (?org=slug) ---------- */
  var params = new URLSearchParams(window.location.search);
  var orgParam = params.get('org');
  if (orgParam) {
    var box = document.querySelector('#org-multiselect input[value="' + orgParam.replace(/"/g, '') + '"]');
    if (box) {
      box.checked = true;
      var label = box.closest('.form__checkbox-item');
      if (label) { label.style.background = 'var(--teal-bg)'; }
    }
  }

  /* ---------- Hidden source field ---------- */
  var sourceField = document.getElementById('form-source');
  if (sourceField) {
    sourceField.value = document.referrer || window.location.pathname;
  }

  /* ---------- Validation ---------- */
  function setError(field, message) {
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    var err = field.parentNode.querySelector('.form__error');
    if (err) {
      err.textContent = message;
      err.classList.add('is-visible');
    }
  }
  function clearError(field) {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    var err = field.parentNode.querySelector('.form__error');
    if (err) { err.classList.remove('is-visible'); }
  }

  function validateForm(form) {
    var ok = true;
    var firstInvalid = null;

    /* Required text fields + email + phone */
    Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]')).forEach(function (field) {
      if (field.type === 'checkbox') { return; }
      var val = (field.value || '').trim();
      clearError(field);

      if (!val) {
        setError(field, 'Dit veld is verplicht.');
        ok = false;
        firstInvalid = firstInvalid || field;
      } else if (field.type === 'email' && !EMAIL_RE.test(val)) {
        setError(field, 'Vul een geldig e-mailadres in.');
        ok = false;
        firstInvalid = firstInvalid || field;
      } else if (field.type === 'tel' && val.replace(/[\s\-]/g, '').length < 8) {
        setError(field, 'Vul een geldig telefoonnummer in.');
        ok = false;
        firstInvalid = firstInvalid || field;
      }
    });

    /* Required checkboxes (e.g. GDPR consent) */
    Array.prototype.slice.call(form.querySelectorAll('input[type="checkbox"][required]')).forEach(function (cb) {
      var group = cb.closest('.form__group') || cb.parentNode;
      var err   = group.querySelector('.form__error');
      if (!cb.checked) {
        ok = false;
        firstInvalid = firstInvalid || cb;
        if (err) { err.textContent = 'Je moet akkoord gaan om verder te gaan.'; err.classList.add('is-visible'); }
      } else if (err) {
        err.classList.remove('is-visible');
      }
    });

    /* At least one organization checked (org-multiselect) */
    var multiselect = form.querySelector('#org-multiselect');
    if (multiselect) {
      var anyChecked = multiselect.querySelector('input:checked');
      var msErr = multiselect.parentNode.querySelector('.form__error');
      if (!anyChecked) {
        ok = false;
        firstInvalid = firstInvalid || multiselect.querySelector('input');
        if (msErr) { msErr.textContent = 'Kies minstens één organisatie.'; msErr.classList.add('is-visible'); }
      } else if (msErr) {
        msErr.classList.remove('is-visible');
      }
    }

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  Array.prototype.slice.call(document.querySelectorAll('form.form')).forEach(function (form) {
    /* Live error correction */
    Array.prototype.slice.call(form.querySelectorAll('input, textarea')).forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.classList.contains('is-invalid')) { clearError(field); }
      });
    });

    form.addEventListener('submit', function (e) {
      if (!validateForm(form)) {
        e.preventDefault();
      }
      /* On a valid submit: the browser follows the action attribute (redirect). */
    });
  });
})();
