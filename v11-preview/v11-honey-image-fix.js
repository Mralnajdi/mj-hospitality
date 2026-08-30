(() => {
  const NAME_EN = "Methods Roastery – Honey Double Fermentation";
  const NAME_AR = "ميثودز روستري – هني دبل فيرمنتيشن";
  const IMAGE = "https://methods.coffee/cdn/shop/files/Package-sticker-HONEY-DOUBLE.png?v=1758796422&width=1200";

  const product = window.MJ_MENU?.products?.find(p => p?.nameEn === NAME_EN);
  if (product) {
    product.image = IMAGE;
    product._visual = IMAGE;
  }

  function repair(root = document) {
    root.querySelectorAll?.('img').forEach(img => {
      const alt = (img.getAttribute('alt') || '').trim();
      const src = img.getAttribute('src') || '';
      if (alt === NAME_EN || alt === NAME_AR || src.includes('undefined.webp')) {
        if (alt === NAME_EN || alt === NAME_AR || img.closest?.('.productTile, .productModal, .modal, article')) {
          img.src = IMAGE;
          img.removeAttribute('srcset');
        }
      }
    });
  }

  repair();
  const observer = new MutationObserver(() => repair());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
