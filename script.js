const form = document.querySelector('#booking-form');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
document.querySelector('#year').textContent = new Date().getFullYear();
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul'); });
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));
const loadVideo = (video) => { if (video.dataset.loaded) return; video.src = video.dataset.src; video.dataset.loaded = 'true'; video.addEventListener('canplay', () => { video.classList.add('ready'); video.play().catch(() => {}); }, { once: true }); video.load(); };
const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { if (entry.isIntersecting) { loadVideo(entry.target); instance.unobserve(entry.target); } }), { rootMargin: '240px 0px' });
document.querySelectorAll('.lazy-video').forEach((video) => observer.observe(video));
if (form) form.addEventListener('submit', (event) => { event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; } const data = new FormData(form); const date = new Date(`${data.get('date')}T12:00:00`); const formatted = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(date); const message = ['Salut, Dani! Aș vrea să verific disponibilitatea pentru un eveniment.', '', `Nume: ${data.get('name')}`, `Telefon: ${data.get('phone')}`, `Eveniment: ${data.get('event')}`, `Data: ${formatted}`, `Locație: ${data.get('location')}`, data.get('message') ? `Detalii: ${data.get('message')}` : ''].filter(Boolean).join('\n'); window.open(`https://wa.me/40731390536?text=${encodeURIComponent(message)}`, '_blank', 'noopener'); });


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
