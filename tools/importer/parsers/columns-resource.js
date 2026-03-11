/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-resource.
 * Base: columns. Source: https://spectrum.adobe.com
 * Extracts three-column layout (Principles, Resources, Implementations)
 * from .Getstarted-public section.
 * Generated: 2026-03-11
 */
export default function parse(element, { document }) {
  // Each column is a .afg-col-xs-12.afg-col-sm-4 child of the .afg-row
  const columns = element.querySelectorAll(':scope > .afg-col-xs-12.afg-col-sm-4, :scope > div > .afg-col-xs-12.afg-col-sm-4');

  if (columns.length === 0) return;

  // Build one row with N columns (matching Columns block library structure)
  const row = [];
  columns.forEach((col) => {
    const cellContent = [];

    // Extract heading (h3 in source)
    const heading = col.querySelector('h3, h2, [class*="subHeader"]');
    if (heading) {
      // Clone heading without anchor spans
      const h = heading.cloneNode(true);
      const anchors = h.querySelectorAll('span[class*="headingAnchor"]');
      anchors.forEach((a) => a.remove());
      cellContent.push(h);
    }

    // Extract paragraphs (description + links)
    const paragraphs = col.querySelectorAll(':scope > p, :scope > .markdown_mdParagraph__8S2FK');
    paragraphs.forEach((p) => {
      cellContent.push(p);
    });

    row.push(cellContent);
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-resource', cells });
  element.replaceWith(block);
}
