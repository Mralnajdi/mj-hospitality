(() => {
 const media={
  'Fairview Estate — Premium Kenyan Arabica':'assets/products-v5/35-fairview-premium-mj.webp',
  'Fairview Estate — Kaldi City Roast':'version-17/assets/kaldi.png',
  'Java House — Kenya AA':'version-17/assets/java.png',
  'Pink Bourbon Punch':'version-17/assets/pink.png',
  'Entire Goods – Ethiopia Finara':'version-17/assets/finara.png',
  'Marani':'version-17/assets/marani.png',
  'Methods Roastery – Honey Double Fermentation':'version-17/assets/honey.png',
  'One for All':'assets/products-v5/22-chamomile-mj.webp',
  'Chamomile':'assets/products-v5/21-one-for-all-mj.webp',
  'Barista & Co. — Gourmet':'assets/products-v5/38-barista-gourmet-mj.webp'
 };
 for(const p of window.MJ_MENU.products) if(media[p.nameEn]) p.presentationImage=media[p.nameEn];
})();
