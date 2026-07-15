// =========================================================
// Z.ai National AI Hackathon — Bangladesh 2026
// Premium interactions · v2
// =========================================================

(function () {
  'use strict';

  // ---------- Scroll progress bar ----------
  const progress = document.getElementById('scrollProgress');
  const header = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = pct + '%';

    if (header) header.classList.toggle('scrolled', scrollTop > 8);
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 600);
  }

  let rafId = null;
  window.addEventListener('scroll', function () {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      onScroll();
      rafId = null;
    });
  }, { passive: true });
  onScroll();

  // ---------- Mobile nav ----------
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 720px)').matches) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Back-to-top ----------
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Reveal on scroll (IntersectionObserver) ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(function () { el.classList.add('is-visible'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Active nav link ----------
  const navLinks = Array.from(document.querySelectorAll('.nav__menu a[href^="#"]'));
  const sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  // ---------- Animated counters ----------
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = Math.round(target * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { counterIO.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = (c.dataset.prefix || '') + c.dataset.target + (c.dataset.suffix || '');
    });
  }

  // ---------- 3D tilt effect on cards ----------
  const tiltCards = document.querySelectorAll('.card--tilt, .track-card--tilt');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !reducedMotion) {
    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const maxTilt = 6;
        card.style.transform = 'translateY(-4px) perspective(900px) rotateX(' + (-dy * maxTilt) + 'deg) rotateY(' + (dx * maxTilt) + 'deg)';
        card.style.setProperty('--mx', (x / rect.width * 100) + '%');
        card.style.setProperty('--my', (y / rect.height * 100) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ---------- Custom cursor glow ----------
  const cursor = document.getElementById('cursorGlow');
  if (cursor && isFinePointer && !reducedMotion) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      document.body.classList.add('cursor-active');
    });
    document.addEventListener('mouseleave', function () {
      document.body.classList.remove('cursor-active');
    });
  }

  // ---------- FAQ single-open ----------
  const faq = document.querySelector('.faq');
  if (faq) {
    faq.addEventListener('toggle', function (e) {
      if (e.target.open) {
        faq.querySelectorAll('details[open]').forEach(function (d) {
          if (d !== e.target) d.open = false;
        });
      }
    }, true);
  }

  // ---------- Smooth anchor offset (in case scroll-padding-top is overridden) ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = (header ? header.offsetHeight : 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.pushState(null, '', href);
    });
  });

})();
