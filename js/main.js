// ============================================================
// Dominion Chihuahua Club – main.js
// ============================================================

// --- Sticky header shadow ---
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// --- Mobile nav toggle ---
const toggle   = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

toggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

// --- Smooth scroll (fallback for older browsers) ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      document.querySelector(`.nav__links a[href="#${entry.target.id}"]`)?.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// --- Scroll reveal ---
const revealTargets = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

// --- Hero parallax ---
const heroBg = document.querySelector('.hero__bg');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

// Trigger hero loaded class
document.querySelector('.hero')?.classList.add('loaded');

// --- Join form ---
const joinForm = document.getElementById('join-form');
joinForm?.addEventListener('submit', e => {
  e.preventDefault();

  const required = joinForm.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
      field.style.borderColor = '#CE1126';
      valid = false;
    }
  });

  if (!valid) {
    joinForm.querySelector('[required]:invalid, [style*="CE1126"]')?.focus();
    return;
  }

  const btn = joinForm.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Application Sent! ✓';
  btn.style.cssText = 'background: #006847; border-color: #006847;';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = orig;
    btn.style.cssText = '';
    btn.disabled = false;
    joinForm.reset();
  }, 4000);
});

// --- Chihuahua placeholder images via Dog CEO API ---
async function loadChihuahuaImages() {
  try {
    const res  = await fetch('https://dog.ceo/api/breed/chihuahua/images/random/15');
    const data = await res.json();
    if (data.status !== 'success') return;

    const pool = data.message;
    let i = 0;
    const next = () => pool[i++ % pool.length];

    // Hero background
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
      const url = next();
      heroBg.style.backgroundImage = `url('${url}')`;
      heroBg.style.backgroundSize = 'cover';
      heroBg.style.backgroundPosition = 'center';
    }

    // Hero background only — real photos will replace other placeholders


  } catch (_) {
    // Keep gradient fallbacks silently
  }
}

loadChihuahuaImages();

// --- Video placeholder ---
document.querySelectorAll('.video-thumb').forEach(vp => {
  vp.addEventListener('click', () => {
    alert('Add your video to assets/videos/ and replace this element with a <video> or <iframe> embed.');
  });
});
