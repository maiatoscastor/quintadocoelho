/* ─── Nav scroll ────────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── Hero parallax ─────────────────────────────────────────────────────── */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }
}, { passive: true });

/* ─── Mobile nav ────────────────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Fade-in on scroll ─────────────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ─── Animated counters ─────────────────────────────────────────────────── */
function animateCounter(el, target, prefix = '', suffix = '', duration = 1600) {
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, prefix, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

/* ─── Magnetic buttons ──────────────────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});

/* ─── Gallery lightbox ──────────────────────────────────────────────────── */
const galeriaItems = document.querySelectorAll('.galeria__item');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

const galleryImages = Array.from(galeriaItems).map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt,
}));
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
}
function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
}

galeriaItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft')  showPrev();
});
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
});

/* ─── Contact form → WhatsApp ───────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email    = document.getElementById('email').value.trim();
  const tipo     = document.getElementById('tipo').value;
  const data     = document.getElementById('data').value;
  const msg      = document.getElementById('mensagem').value.trim();

  const dataFmt = data
    ? new Date(data).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'A definir';

  const linhas = [
    `Olá, Quinta do Coelho! O meu nome é ${nome} e queria saber se existe possibilidade de agendar uma reunião para marcar um${/^[aeiouAEIOU]/.test(tipo) ? 'a' : ''} ${tipo.toLowerCase()} por volta do dia ${dataFmt}.`,
    ``,
    msg ? `${msg}` : null,
    ``,
    `*Contacto:* ${telefone}`,
    email ? `*Email:* ${email}` : null,
  ]
    .filter(l => l !== null)
    .join('\n');

  const texto = linhas;

  const url = `https://wa.me/351964605331?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
});

/* ─── Smooth scroll ─────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
