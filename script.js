/* =========================================================
   Pedro Filiphi — site logic
   pedrofiliphi.com
   ========================================================= */

(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================
     1. INTRO + LOGO MORPH
     ===================================================== */
  const logomark = $('#logomark');
  const hdr = $('#hdr');

  requestAnimationFrame(() => logomark.classList.add('intro-go'));

  const showTextAt = reduceMotion ? 200 : 3100;
  setTimeout(() => {
    logomark.classList.add('show-text');
    logomark.classList.add('intro-done');
  }, showTextAt);

  const morphAt = reduceMotion ? 600 : 4000;
  setTimeout(() => {
    logomark.classList.add('in-header');
    document.body.classList.remove('is-loading');
    document.body.classList.add('hero-on');
  }, morphAt);

  /* =====================================================
     2. HERO CAROUSEL
     ===================================================== */
  const slides = $$('.hero__slide');
  if (slides.length > 1 && !reduceMotion) {
    let idx = 0;
    const carouselStart = morphAt + 2000;
    setTimeout(() => {
      setInterval(() => {
        const next = (idx + 1) % slides.length;
        // bring new slide to top during fade-in
        slides[next].style.zIndex = '2';
        slides[next].classList.add('is-on');
        // after fade-in completes, demote new to layer 1 and turn off old instantly (it's hidden behind new anyway)
        setTimeout(() => {
          slides[idx].classList.remove('is-on');
          slides[next].style.zIndex = '';
          idx = next;
        }, 2700);
      }, 5500);
    }, carouselStart);
  }

  /* =====================================================
     3. HEADER scroll + WhatsApp float + dark-section detection
     ===================================================== */
  const waFloat = $('.wa-float');
  const darkSections = $$('.intl, .ftr, .hero');
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('is-solid', y > 60);
    if (waFloat) waFloat.classList.toggle('is-on', y > window.innerHeight * 0.3);

    // detect if WA button is currently over a dark section
    if (waFloat && waFloat.classList.contains('is-on')) {
      const waRect = waFloat.getBoundingClientRect();
      const waCenterY = waRect.top + waRect.height / 2;
      let overDark = false;
      for (const sec of darkSections) {
        const r = sec.getBoundingClientRect();
        if (waCenterY >= r.top && waCenterY <= r.bottom) { overDark = true; break; }
      }
      waFloat.classList.toggle('over-dark', overDark);
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* =====================================================
     4. MOBILE DRAWER
     ===================================================== */
  const menuBtn    = $('#menuBtn');
  const drawer     = $('#drawer');
  const drawerClose = $('#drawerClose');

  const closeDrawer = () => {
    if (!menuBtn || !drawer) return;
    menuBtn.classList.remove('is-open');
    drawer.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-modal-open');
  };
  const openDrawer = () => {
    if (!menuBtn || !drawer) return;
    menuBtn.classList.add('is-open');
    drawer.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-modal-open');
  };

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    drawerClose?.addEventListener('click', closeDrawer);
    $$('.drawer__link').forEach(l => l.addEventListener('click', closeDrawer));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeDrawer();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  /* =====================================================
     5. WHATSAPP URL — language-aware initial message
     ===================================================== */
  const WA_BASE = 'https://wa.me/5548991880106';
  const WA_MSG = {
    pt: 'Olá, gostaria de conversar sobre uma demanda jurídica.',
    en: 'Hello, I would like to request an initial consultation.'
  };
  const updateWaLinks = (lng) => {
    const url = `${WA_BASE}?text=${encodeURIComponent(WA_MSG[lng] || WA_MSG.pt)}`;
    $$('a[href*="wa.me/5548991880106"]').forEach(a => { a.href = url; });
  };

  /* =====================================================
     6. LANGUAGE SWITCHER (PT ↔ EN)
     ===================================================== */
  const STORAGE_KEY = 'pfc-lang';
  let lang = 'pt';
  try { lang = localStorage.getItem(STORAGE_KEY) || 'pt'; } catch (e) {}

  const applyLang = (next) => {
    lang = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    document.documentElement.lang = next === 'en' ? 'en' : 'pt-BR';

    $$('[data-pt][data-en]').forEach(el => {
      if (el.hasAttribute('data-pt-html') && el.hasAttribute('data-en-html')) return;
      const txt = el.getAttribute('data-' + next);
      if (txt == null) return;
      if (txt.includes('<') || txt.includes('&middot;') || txt.includes('&amp;')) {
        el.innerHTML = txt;
      } else {
        el.textContent = txt;
      }
    });

    $$('[data-pt-html][data-en-html]').forEach(el => {
      const html = el.getAttribute('data-' + next);
      if (html != null) el.innerHTML = html;
    });

    $$('.lng-pt').forEach(s => s.classList.toggle('is-active', next === 'pt'));
    $$('.lng-en').forEach(s => s.classList.toggle('is-active', next === 'en'));

    updateWaLinks(next);
  };

  applyLang(lang);

  $$('#langBtn, #langBtnMobile, #langBtnMobileTop').forEach(btn => {
    btn.addEventListener('click', () => applyLang(lang === 'pt' ? 'en' : 'pt'));
  });

  /* =====================================================
     7. REVEAL ON SCROLL
     ===================================================== */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const parent = el.parentElement;
          let delay = 0;
          if (parent) {
            const peers = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
            const i = peers.indexOf(el);
            if (i >= 0 && peers.length > 1 && peers.length <= 6) delay = i * 0.08;
          }
          el.style.setProperty('--rd', delay + 's');
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* =====================================================
     8. SMOOTH ANCHOR SCROLL with header offset
     ===================================================== */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =====================================================
     9. LGPD MODAL
     ===================================================== */
  const lgpdModal = $('#lgpdModal');
  const openLgpd = () => {
    lgpdModal.classList.add('is-on');
    lgpdModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-modal-open');
  };
  const closeLgpd = () => {
    lgpdModal.classList.remove('is-on');
    lgpdModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-modal-open');
  };
  $('#openLgpd')?.addEventListener('click', openLgpd);
  $('#openLgpdFooter')?.addEventListener('click', openLgpd);
  $$('[data-close]').forEach(el => el.addEventListener('click', closeLgpd));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lgpdModal.classList.contains('is-on')) closeLgpd();
  });

  /* =====================================================
     10. CONTACT FORM (Formspree)
     ===================================================== */
  const form = $('#contactForm');
  const formMsg = $('#formMsg');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formMsg.classList.remove('is-error');

      const action = form.getAttribute('action');
      if (!action || action.includes('REPLACE_WITH_YOUR_FORMSPREE_ID')) {
        formMsg.classList.add('is-error');
        formMsg.textContent = lang === 'en'
          ? 'Form is not yet configured. Please use WhatsApp or e-mail in the meantime.'
          : 'Formulário ainda não configurado. Use WhatsApp ou e-mail por enquanto.';
        return;
      }

      try {
        formMsg.textContent = lang === 'en' ? 'Sending…' : 'Enviando…';
        const data = new FormData(form);
        const resp = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (resp.ok) {
          form.reset();
          formMsg.textContent = lang === 'en'
            ? 'Your message has been registered. A reply will be sent to the e-mail provided.'
            : 'Sua mensagem foi registrada. O retorno virá pelo e-mail informado.';
        } else {
          throw new Error('Submit failed');
        }
      } catch (err) {
        formMsg.classList.add('is-error');
        formMsg.textContent = lang === 'en'
          ? 'Something went wrong. Please try WhatsApp or e-mail.'
          : 'Algo deu errado. Por favor, use WhatsApp ou e-mail.';
      }
    });
  }

})();
