// ─── SCROLL REVEAL ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 65, 250));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── COPY TO CLIPBOARD ─────────────────────────────────────
document.querySelectorAll('.contact-link[data-copy]').forEach(btn => {
  let timeout;
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;

    const doCopy = () => {
      btn.classList.add('copied');
      clearTimeout(timeout);
      timeout = setTimeout(() => btn.classList.remove('copied'), 2200);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(doCopy);
    } else {
      const ta = Object.assign(document.createElement('textarea'), {
        value: text, style: 'position:fixed;opacity:0'
      });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      doCopy();
    }
  });
});

// ─── NAV ACTIVE HIGHLIGHT ──────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--amber-lt)' : '';
  });
}, { passive: true });

// ─── MOBILE NAV ────────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  Object.assign(navLinks.style, {
    display: open ? 'none' : 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%', left: '0', right: '0',
    background: 'rgba(15,14,13,0.97)',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid #2c2b28',
    backdropFilter: 'blur(16px)',
    gap: '1.1rem'
  });
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 640) navLinks.style.display = 'none';
  });
});
