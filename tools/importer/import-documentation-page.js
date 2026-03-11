/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import spectrumCleanupTransformer from './transformers/spectrum-cleanup.js';

// No parsers needed - documentation pages are 100% default content

// TRANSFORMER REGISTRY
const transformers = [
  spectrumCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'documentation-page',
  description: 'Spectrum documentation page - component specs, design guidelines, and foundation content',
  urls: [
    'https://spectrum.adobe.com/page/action-bar/',
    'https://spectrum.adobe.com/page/voice-and-tone/',
    'https://spectrum.adobe.com/page/color-fundamentals/',
  ],
  blocks: [],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. No blocks to parse - documentation pages are all default content

    // 3. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 4. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Generate sanitized path
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
