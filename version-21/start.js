(() => {
 async function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});}
 window.MJ_ART_READY.then(async()=>{
  for(const src of ['version-21/app.js?rev=21.1.3','version-21/vendor/v2-hero-match-main.js?rev=20261106-cairo-fullbleed','version-21/product-system.js?rev=20261106-release21','version-21/cards.js?rev=20261106-approved']) await load(src);
 }).catch(()=>{
  document.querySelector('#main').innerHTML='<p style="padding:40px;text-align:center">تعذّر تحميل المجموعة. يرجى تحديث الصفحة.<br>Unable to load the collection. Please refresh.</p>';
 });
})();
