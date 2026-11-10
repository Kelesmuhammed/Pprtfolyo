/**
 * Muhammed Keleş — Modern Portfolyo & Çalışma Alanı (main.js)
 * İçerik:
 * 1. Spotlight (İmleç Takipli) Kart Efekti
 * 2. Üst İlerleme Çubuğu (Scroll Progress) & Aktif Menü Takibi
 * 3. Canlı Yerel Saat (Düzce / Akçakoca)
 * 4. Typed.js, Isotope Filtreleme, GLightbox
 * 5. Çift E-Posta Tek Tıkla Kopyalama
 */
(function() {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener, { passive: true });
  };

  // 1. Spotlight (İmleç Takipli) Bento Kart Efekti
  const initSpotlightCards = () => {
    const cards = select('.spotlight-card', true);
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };
  window.addEventListener('DOMContentLoaded', initSpotlightCards);

  // 2. Üst Kaydırma İlerleme Çubuğu (Scroll Progress)
  const progressBar = select('#scrollProgress');
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener('load', updateScrollProgress);
  onscroll(document, updateScrollProgress);

  // 3. Canlı Yerel Saat (Düzce / Akçakoca - Europe/Istanbul)
  const clockEl = select('#localClock');
  const updateLocalClock = () => {
    if (!clockEl) return;
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      clockEl.textContent = timeStr;
    } catch (err) {
      const now = new Date();
      clockEl.textContent = now.toTimeString().slice(0, 8);
    }
  };
  updateLocalClock();
  setInterval(updateLocalClock, 1000);

  // 4. Sol Menü Aktif Bölüm Takibi (Scroll-Spy)
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 240;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  // Yumuşak Kaydırma
  const scrollto = (el) => {
    let target = select(el);
    if (!target) return;
    window.scrollTo({
      top: target.offsetTop,
      behavior: 'smooth'
    });
  };

  // Yukarı Çık Butonu
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 180) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  // Mobil Menü Aç / Kapat
  const closeMobileNav = () => {
    let body = select('body');
    if (body.classList.contains('mobile-nav-active')) {
      body.classList.remove('mobile-nav-active');
      let toggleIcon = select('.mobile-nav-toggle i');
      if (toggleIcon) {
        toggleIcon.classList.add('bi-list');
        toggleIcon.classList.remove('bi-x');
      }
    }
  };

  on('click', '.mobile-nav-toggle', function() {
    select('body').classList.toggle('mobile-nav-active');
    let icon = this.querySelector('i');
    if (icon) {
      icon.classList.toggle('bi-list');
      icon.classList.toggle('bi-x');
    }
  });

  on('click', '#sidebarBackdrop', closeMobileNav);

  on('click', '.scrollto', function(e) {
    if (this.hash && select(this.hash)) {
      e.preventDefault();
      closeMobileNav();
      scrollto(this.hash);
    }
  }, true);

  window.addEventListener('load', () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  // 5. Typed.js Başlatma
  const typed = select('.typed');
  if (typed && typeof Typed !== 'undefined') {
    let rawStrings = typed.getAttribute('data-typed-items') || '';
    let typedStrings = rawStrings.includes('|')
      ? rawStrings.split('|').map(s => s.trim())
      : rawStrings.split(',').map(s => s.trim());

    new Typed('.typed', {
      strings: typedStrings,
      loop: true,
      typeSpeed: 50,
      backSpeed: 26,
      backDelay: 2200
    });
  }

  // 6. Isotope Proje Filtreleme
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer && typeof Isotope !== 'undefined') {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-filters li', true);

      on('click', '#portfolio-filters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }
  });

  // 7. GLightbox (Tam Ekran Görsel İnceleme)
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.portfolio-lightbox'
    });
  }

  // 8. Çift E-Posta Tek Tıkla Kopyalama
  const copyButtons = select('.btn-copy', true);
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const emailToCopy = btn.getAttribute('data-copy');
      if (!emailToCopy) return;

      const triggerFeedback = () => {
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        btn.classList.add('copied');
        if (span) span.textContent = 'Kopyalandı';
        if (icon) icon.className = 'bi bi-check2';

        setTimeout(() => {
          btn.classList.remove('copied');
          if (span) span.textContent = 'Kopyala';
          if (icon) icon.className = 'bi bi-clipboard';
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailToCopy).then(triggerFeedback);
      } else {
        // Yedek kopyalama yöntemi
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        triggerFeedback();
      }
    });
  });

})();
