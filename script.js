// ─── HERO ENTRANCE ─────────────────────────────────────────
// (handled purely via CSS keyframe animations)

// ─── COUNTER ANIMATION ─────────────────────────────────────
function animateCount(el, target, duration = 1200) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.stat-num[data-count]');
let countersStarted = false;
const counterObserver = new IntersectionObserver((entries) => {
  if (entries.some(e => e.isIntersecting) && !countersStarted) {
    countersStarted = true;
    counters.forEach(el => {
      animateCount(el, parseInt(el.dataset.count));
    });
  }
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// ─── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const parent = entry.target.parentElement;
      const siblings = [...parent.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 70, 280));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── COPY TO CLIPBOARD ─────────────────────────────────────
document.querySelectorAll('.contact-link[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    });
  });
});

// ─── NAV ACTIVE HIGHLIGHT ──────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navAs.forEach(a => {
    const isActive = a.getAttribute('href') === `#${current}`;
    a.style.color = isActive ? 'var(--amber-lt)' : '';
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
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(18px)',
    gap: '1.25rem'
  });
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 640) navLinks.style.display = 'none';
  });
});

// ─── SUBTLE CARD TILT ON HOVER ─────────────────────────────
document.querySelectorAll('.research-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
