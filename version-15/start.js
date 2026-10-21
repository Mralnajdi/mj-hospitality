(() => {
 async function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});}
 window.MJ_ART_READY.then(async()=>{
  for(const src of ['version-15/app.js','version-15/vendor/v2-hero-match-main.js','version-15/product-system.js','version-15/cards.js']) await load(src);
 }).catch(()=>{
  document.querySelector('#main').innerHTML='<p style="padding:40px;text-align:center">تعذّر تحميل المجموعة. يرجى تحديث الصفحة.<br>Unable to load the collection. Please refresh.</p>';
 });
})();
