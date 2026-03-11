/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Spectrum cleanup.
 * Selectors from captured DOM of https://spectrum.adobe.com
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove Spectrum web components that block parsing
    WebImporter.DOMUtils.remove(element, [
      'sp-overlay',
      'sp-search',
      'next-route-announcer',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable content: header, nav sidebar, footer, overlay
    WebImporter.DOMUtils.remove(element, [
      'header.layout_pageHeader__14PlU',
      'nav.layout_nav__fHtXU',
      'div.layout_overlay__QPkXc',
      '#feds-header',
      '#feds-footer',
      'link[href*="feds.css"]',
      'noscript',
      'iframe',
    ]);

    // Remove anchor hash links from headings (e.g. "#Principles")
    element.querySelectorAll('span.sub-header_headingAnchor__tckD0').forEach((el) => el.remove());

    // Remove version number badge (just the column, not the whole row which contains the heading)
    const versionEl = element.querySelector('.version-number_versionNumber__gC2oO');
    if (versionEl) {
      const col = versionEl.closest('.afg-col-xs-12');
      if (col) col.remove();
    }

    // Remove empty sp-divider elements
    element.querySelectorAll('sp-divider').forEach((el) => el.remove());
  }
}
