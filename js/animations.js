/* ============================================================
   animations.js — Scroll reveals, stagger, counter, parallax
   opleidingindezorg.nl — vanilla JS, no libraries
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Stagger: set index per child ---------- */
  Array.prototype.slice.call(document.querySelectorAll('.reveal--stagger')).forEach(function (group) {
    Array.prototype.slice.call(group.children).forEach(function (child, i) {
      child.style.setProperty('--stagger-index', i);
    });
  });

  /* ---------- IntersectionObserver: reveals ---------- */
  var revealEls = document.querySelectorAll(
    '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal--stagger'
  );

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.slice.call(revealEls).forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.slice.call(revealEls).forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Number counter ---------- */
  /* Markup: <span class="counter" data-count="8">0</span>            */
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) { return; }
    var suffix   = el.getAttribute('data-count-suffix') || '';
    var duration = 1400;
    var start    = null;

    if (reduceMotion) { el.textContent = target + suffix; return; }

    function tick(ts) {
      if (!start) { start = ts; }
      var progress = Math.min((ts - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) { requestAnimationFrame(tick); }
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('.counter[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      Array.prototype.slice.call(counters).forEach(runCounter);
    } else {
      var counterObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      Array.prototype.slice.call(counters).forEach(function (el) {
        counterObserver.observe(el);
      });
    }
  }

  /* ---------- Parallax ---------- */
  /* Markup: <div class="parallax" data-parallax-speed="0.3"> ... </div> */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('.parallax'));
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;

    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect  = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) { return; }
        var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
        var shift = (rect.top - vh / 2) * speed * -1;
        el.style.setProperty('--parallax-shift', shift.toFixed(1) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }
})();
