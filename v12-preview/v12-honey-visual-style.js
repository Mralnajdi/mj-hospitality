(() => {
  const NAME_EN = "Methods Roastery – Honey Double Fermentation";
  const NAME_AR = "ميثودز روستري – هني دبل فيرمنتيشن";

  // Keep the new coffee inside the established MJ specialty-coffee visual language.
  // This uses the closest existing Pink Bourbon MJ editorial visual rather than a retail package image.
  const IMAGE = "assets/products-v5/06-pink-bourbon-punch-mj.webp";

  const product = window.MJ_MENU?.products?.find(p => p?.nameEn === NAME_EN);
  if (product) {
    product.image = IMAGE;
    product._visual = IMAGE;
  }

  function repair(root = document) {
    root.querySelectorAll?.('img').forEach(img => {
      const alt = (img.getAttribute('alt') || '').trim();
      const src = img.getAttribute('src') || '';
      const isHoney = alt === NAME_EN || alt === NAME_AR;
      const isOldRetailImage = src.includes('Package-sticker-HONEY-DOUBLE');
      if (isHoney || isOldRetailImage || (src.includes('undefined.webp') && img.closest?.('.productTile, .productModal, .modal, article'))) {
        if (isHoney || isOldRetailImage) {
          img.src = IMAGE;
          img.removeAttribute('srcset');
        }
      }
    });
  }

  repair();
  const observer = new MutationObserver(() => repair());
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'alt'] });
})();
