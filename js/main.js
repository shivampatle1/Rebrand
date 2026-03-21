/* =============================================
   DR. PRIYADARSHINI LINGARAJ – MAIN JS
   ============================================= */


  /* ─── PAGE PRELOADER ─── */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      // Small delay to appreciate the smooth animation
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 600);
    } else {
      // Fallback if preloader is missing from HTML
      document.body.classList.add('loaded');
    }
  });

document.addEventListener('DOMContentLoaded', () => {

  /* ─── STICKY HEADER ─── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ─── MOBILE NAV ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ─── ACTIVE NAV LINK ─── */
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── ANIMATED COUNTERS ─── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 2200;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current >= target) clearInterval(timer);
      }, 16);
    };

    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObs.observe(c));
  }

  /* ─── TESTIMONIAL CAROUSEL ─── */
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (track && prevBtn && nextBtn) {
    let current = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const getVisible = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3;

    const updateCarousel = () => {
      const visible = getVisible();
      const maxIndex = Math.max(0, cards.length - visible);
      current = Math.min(current, maxIndex);
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
      const visible = getVisible();
      if (current < cards.length - visible) {
        current++;
        updateCarousel();
      } else {
        current = 0;
        updateCarousel();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (current > 0) {
        current--;
        updateCarousel();
      } else {
        current = cards.length - getVisible();
        updateCarousel();
      }
    });

    window.addEventListener('resize', updateCarousel);

    // Auto-scroll
    let autoInterval = setInterval(() => {
      const visible = getVisible();
      current = current < cards.length - visible ? current + 1 : 0;
      updateCarousel();
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoInterval));
    track.addEventListener('mouseleave', () => {
      autoInterval = setInterval(() => {
        const visible = getVisible();
        current = current < cards.length - visible ? current + 1 : 0;
        updateCarousel();
      }, 5000);
    });
  }

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => {
      revealObs.observe(el);
    });

    // Handle Staggering Parents
    document.querySelectorAll('.stagger-parent').forEach(parent => {
      parent.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.setProperty('--stagger-index', i);
      });
    });
  }

  /* ─── CAREER JOURNEY PROGRESS ANIMATION ─── */
  const careerLine = document.querySelector('.career-progress-line');
  const careerItems = document.querySelectorAll('.career-step-item');
  const careerWrapper = document.querySelector('.career-steps-wrapper');

  if (careerWrapper && careerLine) {
    const updateCareerProgress = () => {
      const windowHeight = window.innerHeight;
      const rect = careerWrapper.getBoundingClientRect();
      
      // Trigger point
      const triggerPoint = windowHeight * 0.75;
      let progress = triggerPoint - rect.top;
      
      // Progress clamping
      const totalHeight = rect.height;
      let finalHeight = Math.max(0, Math.min(progress, totalHeight));
      
      // Set line height
      careerLine.style.height = `${finalHeight}px`;

      // Activate markers and items
      careerItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < triggerPoint) {
           item.classList.add('active');
        } else {
           item.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', updateCareerProgress);
    window.addEventListener('resize', updateCareerProgress);
    updateCareerProgress();
  }

  /* ─── APPOINTMENT FORM ─── */
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('formSuccess');
      if (success) {
        success.style.display = 'block';
        form.reset();
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    });
  }

  /* ─── SMOOTH PAGE TRANSITIONS ─── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('tel') && !href.startsWith('mailto') && !href.startsWith('javascript')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';
        setTimeout(() => { window.location.href = href; }, 200);
      });
    }
  });
  /* ─── INITIALIZE LUCIDE ICONS ─── */
  if (window.lucide) {
    lucide.createIcons();
  }

});
