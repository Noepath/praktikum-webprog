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

/* ========== INITIALIZE ALL FUNCTIONS ========== */
document.addEventListener('DOMContentLoaded', () => {
  setupSectionObserver();
  setupSmoothScroll();
  
  // Set initial active link based on current scroll position
  if (window.scrollY < 100) {
    const homeLink = document.querySelector('.nav__link[href="#home"]');
    if (homeLink) {
      homeLink.classList.add('active-link');
    }
  }
});