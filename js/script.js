/* ========== NAVIGATION SCROLL EFFECT ========== */
const header = document.getElementById('header');

// Add shadow to header on scroll
function scrollHeader() {
  if (window.scrollY >= 50) {
    header.classList.add('scroll-header');
  } else {
    header.classList.remove('scroll-header');
  }
}
window.addEventListener('scroll', scrollHeader);

/* ========== FRAMER MOTION-STYLE ANIMATION ENGINE ========== */
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  // Separate hero (above fold) elements from scroll-triggered elements
  const heroElements = [];
  const scrollElements = [];
  
  animatedElements.forEach(el => {
    const isHero = el.closest('#home') || el.classList.contains('header');
    if (isHero) {
      heroElements.push(el);
    } else {
      scrollElements.push(el);
    }
  });

  // --- Phase 1: Animate hero/header elements on page load with stagger ---
  animateHeroOnLoad(heroElements);

  // --- Phase 2: Animate remaining elements on scroll ---
  if (scrollElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    scrollElements.forEach(el => observer.observe(el));
  }
}

function animateHeroOnLoad(elements) {
  // Header slides down first
  const headerEl = document.querySelector('.header[data-animate]');
  if (headerEl) {
    setTimeout(() => {
      headerEl.classList.add('anim-visible');
    }, 100);
  }

  // Animate nav items with stagger
  const navItems = document.querySelectorAll('.nav__item');
  const navCta = document.querySelector('.nav__cta');
  
  navItems.forEach((item, i) => {
    item.classList.add('anim-nav');
    item.style.animationDelay = `${400 + i * 120}ms`;
  });

  if (navCta) {
    navCta.classList.add('anim-nav');
    navCta.style.animationDelay = `${400 + navItems.length * 120}ms`;
  }

  // Animate hero content elements
  const heroContent = elements.filter(el => !el.classList.contains('header'));
  heroContent.forEach((el, i) => {
    const baseDelay = 800; // start after header
    const extraDelay = parseInt(el.dataset.delay || '0');
    
    setTimeout(() => {
      el.classList.add('anim-visible');
    }, baseDelay + extraDelay);
  });
}

/* ========== ACTIVE LINK ON SCROLL ========== */
function setupSectionObserver() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav__link');

  // Intersection Observer for detecting which section is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active-link class from all links
        navLinks.forEach(link => {
          link.classList.remove('active-link');
        });

        // Get the ID of the visible section
        const id = entry.target.getAttribute('id');

        // Add active-link class to corresponding navigation link
        const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active-link');
        }
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '-80px 0px -80px 0px'
  });

  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
}

/* ========== SMOOTH SCROLL FOR NAVIGATION LINKS ========== */
function setupSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav__link, .nav__cta');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Check if it's an internal link
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ========== MOBILE NAV TOGGLE ========== */
function setupMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('show-menu');
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('show-menu');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('show-menu');
    }
  });
}

/* ========== INITIALIZE ALL FUNCTIONS ========== */
document.addEventListener('DOMContentLoaded', () => {
  setupScrollAnimations();
  setupSectionObserver();
  setupSmoothScroll();
  setupCertificateCards();
  setupLightbox();
  setupContactForm();
  setupMobileNav();
  
  // Set initial active link based on current scroll position
  if (window.scrollY < 100) {
    const homeLink = document.querySelector('.nav__link[href="#home"]');
    if (homeLink) {
      homeLink.classList.add('active-link');
    }
  }
});

/* ========== CERTIFICATE CARD STACK & SPREAD ANIMATION ========== */
function setupCertificateCards() {
  const container = document.querySelector('.certificate__content');
  const cards = document.querySelectorAll('.certificate__card');
  if (!cards.length || !container) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCardSpread(container, cards);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  observer.observe(container);
}

function animateCardSpread(container, cards) {
  const containerRect = container.getBoundingClientRect();
  const centerX = containerRect.width / 2;
  const centerY = containerRect.height / 2;

  // Calculate offset from each card's natural position to the container center
  const offsets = Array.from(cards).map(card => {
    const rect = card.getBoundingClientRect();
    return {
      x: centerX - (rect.left - containerRect.left + rect.width / 2),
      y: centerY - (rect.top - containerRect.top + rect.height / 2)
    };
  });

  const total = cards.length;
  const mid = (total - 1) / 2;

  // Phase 0: Hide all cards below center (starting point for rise animation)
  cards.forEach((card, i) => {
    const deckOffset = (i - mid) * 3;
    const deckRotation = (i - mid) * 2.5;
    card.style.transition = 'none';
    card.style.transform =
      `translate(${offsets[i].x + deckOffset}px, ${offsets[i].y + 200}px) rotate(${deckRotation}deg) scale(0.85)`;
    card.style.opacity = '0';
    card.style.zIndex = `${total - i}`;
    card.classList.add('stacked');
  });

  // Double rAF ensures the browser paints Phase 0 before starting Phase 1
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      // Phase 1: Rise up – cards appear and slide up to center as a stacked deck
      cards.forEach((card, i) => {
        const deckOffset = (i - mid) * 3;
        const deckRotation = (i - mid) * 2.5;
        card.style.transition =
          'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease';
        card.style.transform =
          `translate(${offsets[i].x + deckOffset}px, ${offsets[i].y + deckOffset}px) rotate(${deckRotation}deg) scale(0.92)`;
        card.style.opacity = '1';
      });

      // Phase 2: Spread cards out to their grid positions with stagger
      const staggerDelay = 60;
      const riseDelay = 800;  // wait for rise animation to finish
      const spreadDelay = 250; // brief pause to show the deck after rise

      setTimeout(() => {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition =
              'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease';
            card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
          }, i * staggerDelay);
        });

        // Phase 3: Clean up inline styles and hand over to CSS classes
        const totalAnimDuration = (total - 1) * staggerDelay + 600;
        setTimeout(() => {
          cards.forEach(card => {
            card.style.transition = '';
            card.style.transform = '';
            card.style.opacity = '';
            card.style.zIndex = '';
            card.classList.remove('stacked');
            card.classList.add('revealed');
          });
        }, totalAnimDuration);
      }, riseDelay + spreadDelay);

    }); // end inner rAF
  }); // end outer rAF
}

/* ========== LIGHTBOX FOR CERTIFICATES ========== */
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const cards = document.querySelectorAll('.certificate__card');

  if (!lightbox || !cards.length) return;

  // Open lightbox on card click
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      if (imgSrc) {
        lightboxImage.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Clear src after transition
    setTimeout(() => {
      lightboxImage.src = '';
    }, 350);
  }

  lightboxClose.addEventListener('click', closeLightbox);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ========== CONTACT FORM — OPEN GMAIL COMPOSE ========== */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    const body = `Hi, my name is ${name} (${email}).\n\n${message}`;

    // Open Gmail compose in a new tab
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=faridsyahfadillah@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailURL, '_blank');
  });
}