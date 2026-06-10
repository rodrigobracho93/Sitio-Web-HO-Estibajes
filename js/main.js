/* ==========================================
   HO Estibajes - Main JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {

  // --- MOBILE NAV TOGGLE ---
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', function() {
      mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', mobile.classList.contains('open'));
    });
    document.addEventListener('click', function(e) {
      if (!toggle.contains(e.target) && !mobile.contains(e.target)) {
        mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- ACTIVE NAV LINK (mobile) ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function(link) {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // --- SCROLL REVEAL (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.animate');
  if (animateElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var anim = el.dataset.anim || 'fade-up';
          el.classList.add(anim);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    animateElements.forEach(function(el) { observer.observe(el); });
  } else {
    animateElements.forEach(function(el) { el.style.opacity = '1'; });
  }

  // --- BACK TO TOP ---
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- ACCORDION EXCLUSIVITY (about page) ---
  var detailsElements = document.querySelectorAll('details.accordion-item');
  if (detailsElements.length) {
    detailsElements.forEach(function(target) {
      target.addEventListener('click', function() {
        detailsElements.forEach(function(detail) {
          if (detail !== target) detail.removeAttribute('open');
        });
      });
    });
  }

  // --- PORTFOLIO FILTER ---
  var filterButtons = document.querySelectorAll('.filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');
  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterButtons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        portfolioItems.forEach(function(item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- LIGHTBOX ---
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && portfolioItems.length) {
    portfolioItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var src = item.getAttribute('data-src');
        var title = item.getAttribute('data-title');
        if (lightboxImg) lightboxImg.setAttribute('src', src);
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLightbox() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  // --- CONTACT FORM ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Generate captcha
    var n1 = Math.floor(Math.random() * 9) + 1;
    var n2 = Math.floor(Math.random() * 9) + 1;
    var captchaQ = document.getElementById('captchaQuestion');
    if (captchaQ) captchaQ.textContent = n1 + ' + ' + n2 + ' =';
    var totalRes = n1 + n2;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var successBox = document.getElementById('alertSuccess');
      var errorBox = document.getElementById('alertError');
      var userAns = parseInt(document.getElementById('txtCaptcha').value, 10);
      if (successBox) successBox.style.display = 'none';
      if (errorBox) errorBox.style.display = 'none';
      if (userAns !== totalRes) {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        document.getElementById('txtCaptcha').focus();
        // Regenerate captcha
        n1 = Math.floor(Math.random() * 9) + 1;
        n2 = Math.floor(Math.random() * 9) + 1;
        totalRes = n1 + n2;
        if (captchaQ) captchaQ.textContent = n1 + ' + ' + n2 + ' =';
        document.getElementById('txtCaptcha').value = '';
      } else {
        if (successBox) {
          successBox.style.display = 'block';
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
        // Reset captcha
        n1 = Math.floor(Math.random() * 9) + 1;
        n2 = Math.floor(Math.random() * 9) + 1;
        totalRes = n1 + n2;
        if (captchaQ) captchaQ.textContent = n1 + ' + ' + n2 + ' =';
      }
    });
  }

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- PERFORMANCE: load images with error handling ---
  document.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('error', function() {
      this.style.background = '#1A3A5C';
    });
  });

});
