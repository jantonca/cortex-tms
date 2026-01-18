/**
 * Automatically add target="_blank" and rel="noopener noreferrer" to all external links
 * This improves UX by preserving documentation context when users click external links
 */
(function setupExternalLinks() {
  function updateExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach((link) => {
      try {
        const url = new URL(link.href);

        // Only modify external links (not same origin)
        if (url.origin !== window.location.origin) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (e) {
        // Skip invalid URLs
      }
    });
  }

  // Run on initial page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateExternalLinks);
  } else {
    updateExternalLinks();
  }

  // Re-run when navigating between pages (for SPA navigation)
  document.addEventListener('astro:page-load', updateExternalLinks);
})();
