// ============================================================
// Dominion Chihuahua Club – nav.js
// Shared nav for inner pages (committee, agm, etc.)
// ============================================================

// Sticky header shadow
const _hdr = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  _hdr?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile nav toggle
const _toggle   = document.querySelector('.nav__toggle');
const _navLinks = document.querySelector('.nav__links');

_toggle?.addEventListener('click', () => {
  const open = _navLinks.classList.toggle('open');
  _toggle.setAttribute('aria-expanded', String(open));
});

_navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    _navLinks.classList.remove('open');
    _toggle?.setAttribute('aria-expanded', 'false');
  });
});

// Dropdown menus
function initDropdowns() {
  document.querySelectorAll('.nav__item').forEach(item => {
    const btn = item.querySelector('.nav__dropdown-btn');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.nav__item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.nav__dropdown-btn')?.setAttribute('aria-expanded', 'false');
    });
  });
}

initDropdowns();

// Scroll reveal
const _revealEls = document.querySelectorAll('.reveal');
if (_revealEls.length) {
  const _revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        _revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  _revealEls.forEach(el => _revealObs.observe(el));
}
