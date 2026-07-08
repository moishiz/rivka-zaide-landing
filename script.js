// מעבדות רבקה זיידה — אינטראקציות
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* סליידר לפני/אחרי */
  document.querySelectorAll('[data-ba]').forEach(function (slider) {
    var range = slider.querySelector('.ba-range');
    if (!range) return;
    var set = function (v) {
      slider.style.setProperty('--pos', v + '%');
    };
    range.addEventListener('input', function () { set(range.value); });
    set(range.value);
  });

  /* חשיפת גלילה */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ספירת מספרים בפס האמון */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target.toLocaleString('he-IL') + suffix;
      return;
    }
    var start = null;
    var dur = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('he-IL') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* טופס ליד — שולח לוואטסאפ העסקי (ללא שרת).
     כשמחברים CRM/פיקסל — מחליפים את הלוגיקה כאן. */
  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var severity = document.getElementById('severity').value;
      var city = document.getElementById('city').value.trim();
      var msg = 'היי, אשמח לתאם אבחון חינם.\nשם: ' + name +
        '\nטלפון: ' + phone +
        '\nמצב: ' + severity +
        (city ? '\nעיר: ' + city : '');
      window.open('https://wa.me/97237764414?text=' + encodeURIComponent(msg), '_blank');
    });
  }
})();
