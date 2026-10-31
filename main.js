/* Cardinal Land Company — main.js
   Plain JavaScript, no dependencies. Everything here degrades gracefully:
   the site works without it (the form posts normally to Formspree). */
(function () {
  'use strict';

  var PHONE_DISPLAY = '717-715-4262';
  var EMAIL = 'Joe.Lesher@CardinalLand.com';

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var label = toggle.querySelector('.nav-toggle-label');
    function setNav(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) { label.textContent = open ? 'Close' : 'Menu'; }
    }
    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ---- "I have received an offer" pre-check ------------------------------
     Links with data-prefill-offer (the callout box) and visits to #offer
     tick the box so the visitor does not have to. */
  var offerBox = document.getElementById('received-offer');
  var assessment = document.getElementById('assessment');
  function prefillOffer() {
    if (offerBox) { offerBox.checked = true; }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-prefill-offer]'), function (el) {
    el.addEventListener('click', prefillOffer);
  });
  if (window.location.hash === '#offer' && offerBox) {
    prefillOffer();
    if (assessment) {
      // Let the browser land on the form section rather than the checkbox itself.
      window.setTimeout(function () { assessment.scrollIntoView(); }, 0);
    }
  }

  /* ---- Assessment form: submit to Formspree without a page reload ------- */
  var form = document.getElementById('assessment-form');
  if (form && window.fetch && window.FormData) {
    var status = document.getElementById('form-status');
    var submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending'; }
      if (status) { status.textContent = ''; status.className = 'form-status'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) { throw new Error('Request failed: ' + res.status); }
        showThanks();
      }).catch(function () {
        if (status) {
          status.textContent = 'Something went wrong and your request was not sent. ' +
            'Please call ' + PHONE_DISPLAY + ' or email ' + EMAIL + '.';
          status.className = 'form-status error';
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      });
    });

    function showThanks() {
      var nameField = form.elements.namedItem('name');
      var first = nameField && nameField.value ? nameField.value.trim().split(/\s+/)[0] : '';
      var box = document.createElement('div');
      box.className = 'callout form-thanks';
      box.setAttribute('role', 'status');
      box.setAttribute('tabindex', '-1');

      var title = document.createElement('p');
      title.className = 'callout-title';
      title.textContent = first ? 'Thank you, ' + first + '.' : 'Thank you.';

      var body = document.createElement('p');
      body.appendChild(document.createTextNode(
        'We received your request. Joe will look over what you sent and call you to talk it through. ' +
        'If you would rather not wait, call '));
      var tel = document.createElement('a');
      tel.href = 'tel:+17177154262';
      tel.textContent = PHONE_DISPLAY;
      body.appendChild(tel);
      body.appendChild(document.createTextNode('.'));

      box.appendChild(title);
      box.appendChild(body);
      form.parentNode.replaceChild(box, form);
      box.focus();
    }
  }

  /* ---- Mobile quick-contact bar: step aside while the form is on screen -- */
  var bar = document.querySelector('.mobile-bar');
  if (bar && assessment && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.12 });
    io.observe(assessment);
  }
})();
