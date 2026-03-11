/**
 * Metadata block - content is consumed by aem.js decorateSections.
 * The block itself should not render anything.
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section) section.remove();
}
