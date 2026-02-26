/* ============================================================
   LEDGER — script.js
   1. Navbar scroll class
   2. Mobile menu toggle
   3. Reveal on scroll (IntersectionObserver)
   4. Ripple effect on .ripple-btn
   5. Download button → Ledger.apk
   6. Financial Health Score ring animation
   7. Hero staggered entry
   8. Subtle parallax on hero text
   9. Smooth anchor scroll
============================================================ */

(function () {
  'use strict';

  /* ── 1. NAVBAR ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  function checkNav() { navbar.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', checkNav, { passive: true });
  checkNav();

  /* ── 2. MOBILE MENU ───────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    document.querySelectorAll('.mobile-link').forEach(l =>
      l.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
  }

  /* ── 3. REVEAL ON SCROLL ──────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Stagger siblings slightly
      const siblings = Array.from(entry.target.parentElement
        .querySelectorAll('.reveal:not(.visible)'));
      const idx   = siblings.indexOf(entry.target);
      const delay = Math.max(0, idx * 75);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── 4. RIPPLE ────────────────────────────────────────── */
  function addRipple(e) {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement('span');
    span.classList.add('ripple');
    span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  }
  document.querySelectorAll('.ripple-btn').forEach(b => b.addEventListener('click', addRipple));

  /* ── 5. DOWNLOAD BUTTONS ──────────────────────────────── */
  ['heroDownloadBtn', 'mainDownloadBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { window.location.href = 'Ledger.apk'; });
  });

  /* ── 6. HEALTH RING ANIMATION ─────────────────────────── */
  const ringFg      = document.getElementById('ringFg');
  const ringScore   = document.getElementById('ringScore');
  const TARGET      = 78;
  const CIRC        = 2 * Math.PI * 110; // r=110 → ~691.15

  function animateRing() {
    const start = performance.now();
    const dur   = 2200;
    (function tick(now) {
      const p     = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);          // ease-out cubic
      const val   = Math.round(eased * TARGET);
      ringScore.textContent = val;
      ringFg.style.strokeDashoffset = CIRC - (val / 100) * CIRC;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  const healthSection = document.getElementById('health');
  if (healthSection && ringFg) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateRing();
        entries[0].target.__ringDone = true; // prevent double trigger
      }
    }, { threshold: 0.4 }).observe(healthSection);
  }

  /* ── 7. HERO STAGGERED ENTRY ──────────────────────────── */
  const heroEls = ['.hero-badge', '.hero-title', '.hero-sub', '.hero-actions', '.hero-stats'];
  heroEls.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.cssText = `opacity:0;transform:translateY(18px);transition:opacity .7s ease ${i * 0.1 + 0.1}s,transform .7s ease ${i * 0.1 + 0.1}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  });

  // Phone appears slightly later
  const phoneWrap = document.querySelector('.hero-phone-wrap');
  if (phoneWrap) {
    phoneWrap.style.cssText = 'opacity:0;transform:translateY(20px);transition:opacity .9s ease .5s,transform .9s ease .5s';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      phoneWrap.style.opacity = '1';
      phoneWrap.style.transform = 'translateY(0)';
    }));
  }

  /* ── 8. PARALLAX ──────────────────────────────────────── */
  const heroText = document.querySelector('.hero-text');
  window.addEventListener('scroll', () => {
    if (!heroText || window.scrollY > window.innerHeight) return;
    heroText.style.transform = `translateY(${window.scrollY * 0.09}px)`;
  }, { passive: true });

  /* ── 9. SMOOTH ANCHOR SCROLL ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 78, behavior: 'smooth' });
    });
  });

  /* Scroll-to-top button */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

})();
