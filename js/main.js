/**
 * main.js — RBYHACK
 * Nav, scroll animations, ripple, cursor glow, parallax, Formspree
 */
(function () {
  const FORMSPREE = 'https://formspree.io/f/mnjyedqj';

  // ===== NAVIGATION =====
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== CURSOR GLOW =====
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const updateGlow = () => {
      cursorGlow.style.transform = `translate(${mx - 175}px, ${my - 175}px)`;
      requestAnimationFrame(updateGlow);
    };
    updateGlow();
  }

  // ===== BUTTON RIPPLE =====
  document.querySelectorAll('.btn, .skill-badge').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ===== PARALLAX =====
  const gridOverlay = document.querySelector('.grid-overlay');
  if (gridOverlay) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      gridOverlay.style.transform = `translateY(${offset * 0.03}px)`;
    }, { passive: true });
  }

  // ===== SCROLL ANIMATIONS =====
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .timeline-item').forEach(el => {
    animationObserver.observe(el);
  });

  // ===== FORMSPREE =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const success = contactForm.querySelector('.form-success');
      const error = contactForm.querySelector('.form-error');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span>';
      if (success) success.style.display = 'none';
      if (error) error.style.display = 'none';

      try {
        const formData = new FormData(contactForm);
        const resp = await fetch(FORMSPREE, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });

        if (resp.ok) {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          if (success) {
            success.style.display = 'flex';
            setTimeout(() => { success.style.display = 'none'; }, 5000);
          }
        } else {
          throw new Error('Formspree error');
        }
      } catch (err) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (error) {
          error.style.display = 'flex';
          setTimeout(() => { error.style.display = 'none'; }, 5000);
        }
      }
    });
  }
})();
