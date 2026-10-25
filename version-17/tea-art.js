/* Edition 17: every tea is presented in a teapot, keyed by product identity. */
(() => {
 const media={
  'Sencha Sleepless Organic':'sencha','Moroccan Mint Organic':'mint',
  'Japanese Cherry':'cherry','Le Touareg Organic':'touareg','Marani':'marani',
  'Chinese Royal Jasmine Rolls':'pearls','White Tea Lemon & Vanilla':'lemonvanilla',
  'White Tea Jasmine Blossoms':'jasmine','Gourmet Herbal Tea':'herbal',
  'Mate Green Organic':'mate','Ginger–Turmeric':'gingerturmeric',
  'One for All':'oneforall','Chamomile':'chamomile','Peach Melba':'peach',
  'Berry Heaven':'berries','Strawberry–Moringa':'strawberry','Passion Fruit':'passion'
 };
 for(const p of window.MJ_MENU.products){
  if(p.cat!=='tea')continue;
  if(media[p.nameEn])p.presentationImage='version-17/assets/tea-'+media[p.nameEn]+'.png';
  else if(p.nameEn==='Cherry Banana Flip')p.presentationImage='assets/products-v2/24-cherry-banana-v2.webp';
  else if(p.nameEn==='Woodland Berries')p.presentationImage='assets/products-v2/28-woodland-berries-v2.webp';
  else if(!p.edition14)throw new Error('Missing teapot presentation: '+p.nameEn);
 }
})();
