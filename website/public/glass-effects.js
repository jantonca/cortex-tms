/**
 * Cortex TMS - Glass Effects
 *
 * Interactive mouse-tracking effects for glass panels
 * - 3D tilt on hover
 * - Sheen cursor following
 * - Smooth transitions
 */

(function () {
  'use strict';

  /**
   * Initialize 3D tilt effect for glass panels
   * Applies subtle rotation based on mouse position
   */
  function initGlassTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach((element) => {
      const sheen = element.querySelector('.sheen');

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentage position (0 to 1)
        const xPct = x / rect.width;
        const yPct = y / rect.height;

        // Calculate rotation (centered at 0.5)
        const xRot = (yPct - 0.5) * -5; // Invert Y for natural tilt
        const yRot = (xPct - 0.5) * 5;

        // Apply 3D transform
        element.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.01)`;

        // Update sheen position
        if (sheen) {
          element.style.setProperty('--x', `${xPct * 100}%`);
          element.style.setProperty('--y', `${yPct * 100}%`);
        }
      });

      element.addEventListener('mouseleave', () => {
        // Reset transform
        element.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
      });
    });
  }

  /**
   * Initialize light tilt effect (sheen only, no rotation)
   * For elements that should have subtle interactivity
   */
  function initLightTilt() {
    const lightTiltElements = document.querySelectorAll('[data-tilt-light]');

    lightTiltElements.forEach((element) => {
      const sheen = element.querySelector('.sheen');

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update sheen position only
        if (sheen) {
          element.style.setProperty('--x', `${(x / rect.width) * 100}%`);
          element.style.setProperty('--y', `${(y / rect.height) * 100}%`);
        }
      });
    });
  }

  /**
   * Initialize bloom effect for glass-liquid-panel
   * Tracks cursor position for radial gradient bloom
   */
  function initBloomEffect() {
    const liquidPanels = document.querySelectorAll('.glass-liquid-panel');

    liquidPanels.forEach((element) => {
      const bloom = element.querySelector('.bloom');

      if (!bloom) return;

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update bloom position
        element.style.setProperty('--x', `${x}px`);
        element.style.setProperty('--y', `${y}px`);
      });
    });
  }

  /**
   * Initialize parallax scroll effect for liquid blobs
   * Makes blob elements move slower than scroll for depth
   */
  function initParallaxBlobs() {
    const blobs = document.querySelectorAll('.liquid-bg');

    if (blobs.length === 0) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      blobs.forEach((blob, index) => {
        // Different speeds for different blobs
        const speed = 0.3 + (index * 0.1);
        const yOffset = -(scrollY * speed);

        blob.style.transform = `translate(-50%, calc(-50% + ${yOffset}px))`;
      });
    });
  }

  /**
   * Add smooth fade-in animation for glass panels on page load
   */
  function initFadeIn() {
    const glassPanels = document.querySelectorAll('.glass-panel');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger animation delay
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    glassPanels.forEach((panel) => {
      // Set initial state
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(20px)';
      panel.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

      observer.observe(panel);
    });
  }

  /**
   * Debounce function for performance
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Initialize all glass effects
   */
  function init() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      console.log('Glass effects: Reduced motion mode active');
      return;
    }

    // Initialize effects
    initGlassTilt();
    initLightTilt();
    initBloomEffect();
    initParallaxBlobs();
    initFadeIn();

    console.log('Glass effects: Initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize on dynamic content changes (for SPA navigation)
  window.addEventListener('astro:page-load', init);
})();
