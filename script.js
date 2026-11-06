const form = document.querySelector('#booking-form');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const WHATSAPP = 'https://wa.me/40731390536';
document.querySelector('#year').textContent = new Date().getFullYear();

/* ========================================
   MENIU MOBIL
======================================== */

const setMenu = (open) => { nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul'); };
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });
document.addEventListener('click', (event) => { if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false); });

/* ========================================
   VIDEO: încărcare leneșă + pauză în afara ecranului
======================================== */

const loadVideo = (video) => { if (video.dataset.loaded) return; video.src = video.dataset.src; video.dataset.loaded = 'true'; video.addEventListener('loadeddata', () => video.classList.add('ready'), { once: true }); video.load(); };
const videoObserver = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => { if (isIntersecting) { loadVideo(target); target.play().catch(() => {}); } else if (target.dataset.loaded) { target.pause(); } }), { rootMargin: '200px 0px' });
document.querySelectorAll('.lazy-video').forEach((video) => videoObserver.observe(video));

/* ========================================
   GALERIE: filtre pe categorii
======================================== */

const filters = document.querySelectorAll('.filter-chip');
filters.forEach((chip) => chip.addEventListener('click', () => {
  const category = chip.dataset.filter;
  filters.forEach((other) => other.setAttribute('aria-pressed', String(other === chip)));
  document.querySelectorAll('.gallery-item').forEach((item) => { item.hidden = category !== 'all' && item.dataset.category !== category; });
}));

/* ========================================
   YOUTUBE: iframe-ul se încarcă doar la click
======================================== */

document.querySelectorAll('.youtube-frame[data-video]').forEach((frame) => frame.querySelector('.youtube-play').addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${frame.dataset.video}?start=${frame.dataset.start || 0}&autoplay=1`;
  iframe.title = 'DJ Dani set YouTube';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  frame.replaceChildren(iframe);
}, { once: true }));

/* ========================================
   WIDGET RECENZII: se încarcă doar când secțiunea se apropie
======================================== */

const reviewsWidget = document.querySelector('#reviews-widget-372');
if (reviewsWidget) {
  const loadWidget = () => { const script = document.createElement('script'); script.src = 'https://starwall.io/embed/hH5RHPOK4oReMRum3GStqKy2oVnr63FK/widget.js'; script.async = true; document.body.appendChild(script); };
  new IntersectionObserver((entries, instance) => { if (entries.some((entry) => entry.isIntersecting)) { instance.disconnect(); loadWidget(); } }, { rootMargin: '800px 0px' }).observe(reviewsWidget);
  // Pe touch, swipe-ul îl face browserul (vezi style.css): oprim gesturile caruselului Starwall
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    const stopCarouselGesture = (event) => { if (event.target.closest('.reviews-widget__reviews-container')) event.stopPropagation(); };
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach((type) => reviewsWidget.addEventListener(type, stopCarouselGesture, { capture: true, passive: true }));
  }
}

/* ========================================
   FORMULAR BOOKING → WHATSAPP
======================================== */

if (form) {
  const dateInput = form.querySelector('[name="date"]');
  const eventSelect = form.querySelector('[name="event"]');
  const status = form.querySelector('.form-status');
  const today = new Date();
  dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  // Click pe un tip de eveniment → îl preselectăm în formular
  document.querySelectorAll('[data-event]').forEach((link) => link.addEventListener('click', () => { eventSelect.value = link.dataset.event; }));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    const formatted = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${data.get('date')}T12:00:00`));
    const message = ['Salut, Dani! Aș vrea să verific disponibilitatea pentru un eveniment.', '', `Nume: ${data.get('name')}`, `Telefon: ${data.get('phone')}`, `Eveniment: ${data.get('event')}`, `Data: ${formatted}`, `Locație: ${data.get('location')}`, data.get('message') ? `Detalii: ${data.get('message')}` : ''].filter(Boolean).join('\n');
    const url = `${WHATSAPP}?text=${encodeURIComponent(message)}`;
    // Unele browsere mobile blochează ferestrele noi: deschidem în aceeași filă
    if (!window.open(url, '_blank', 'noopener')) window.location.href = url;
    status.hidden = false;
    status.innerHTML = `Am deschis WhatsApp. Nu s-a deschis? <a href="${url}" target="_blank" rel="noreferrer">Încearcă din nou</a> sau sună la <a href="tel:+40731390536">0731 390 536</a>.`;
  });
}

/* ========================================
   STICKY NAVBAR SCROLL STATE
======================================== */

(() => {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  // Starea inițială, inclusiv la refresh în mijlocul paginii
  updateHeader();

  // Listener pasiv: nu blochează scroll-ul
  window.addEventListener("scroll", updateHeader, {
    passive: true
  });
})();

/* ========================================
   CTA MOBIL: ascuns când formularul e pe ecran
======================================== */

(() => {
  const booking = document.querySelector('#booking');
  if (!booking) return;
  new IntersectionObserver(([entry]) => document.body.classList.toggle('booking-visible', entry.isIntersecting), { threshold: 0.15 }).observe(booking);
})();
