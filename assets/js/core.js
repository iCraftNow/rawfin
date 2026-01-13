/**
 * Core JavaScript - Essential functionality
 * Loads first and initializes all other modules
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('🚀 Rawfin initializing...');

    // Initialize all core features
    initServiceWorker();
    initIntersectionObserver();
    initSmoothScroll();
    initMobileMenu();
    initLazyLoading();

    // Load non-critical modules
    loadNonCriticalModules();

    console.log('✅ Rawfin initialized');
  }

  /**
   * Register Service Worker for PWA functionality
   */
  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('✅ Service Worker registered:', registration.scope);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000); // Check every hour
          })
          .catch(error => {
            console.log('❌ Service Worker registration failed:', error);
          });
      });
    }
  }

  /**
   * Intersection Observer for scroll animations
   */
  function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in')
        .forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once visible
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in')
      .forEach(el => observer.observe(el));
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Ignore empty anchors
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }

  /**
   * Mobile menu toggle (if implemented in future)
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('open');
      });
    }
  }

  /**
   * Lazy load images
   */
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for browsers that don't support native lazy loading
      const images = document.querySelectorAll('img[data-src]');

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Load non-critical JavaScript modules
   */
  function loadNonCriticalModules() {
    // Delay loading non-critical modules for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadModules);
    } else {
      setTimeout(loadModules, 1000);
    }

    function loadModules() {
      // Analytics
      if (typeof RawfinAnalytics !== 'undefined') {
        new RawfinAnalytics();
      }

      // Animations
      loadScript('/assets/js/animations.js');
    }
  }

  /**
   * Utility: Load external script
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Utility: Debounce function
   */
  window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /**
   * Utility: Throttle function
   */
  window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  /**
   * Handle online/offline status
   */
  window.addEventListener('online', () => {
    console.log('✅ Back online');
    showNotification('You are back online', 'success');
  });

  window.addEventListener('offline', () => {
    console.log('⚠️ Offline');
    showNotification('You are offline. Some features may be unavailable.', 'warning');
  });

  /**
   * Simple notification system
   */
  window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');

    document.body.appendChild(notification);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      notification.classList.add('notification-exit');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  };

  /**
   * Handle errors globally
   */
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Don't show user-facing errors for now, just log them
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  /**
   * Expose core utilities globally
   */
  window.Rawfin = {
    version: '1.0.0',
    showNotification,
    debounce: window.debounce,
    throttle: window.throttle,
    loadScript
  };

})();
