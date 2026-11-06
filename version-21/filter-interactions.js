/* Close local filters without changing the user's selections. */
(() => {
 if(window.MJ_EDITION)window.MJ_EDITION.version=21;
 document.addEventListener('click', e => {
  const done=e.target.closest('[data-hf-done]');
  if(done)done.closest('.hfMore').open=false;
  document.querySelectorAll('.hfFacet[open],.hfMore[open]').forEach(d=>{
   if(!d.contains(e.target))d.open=false;
  });
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape')document.querySelectorAll('.hfFacet[open],.hfMore[open]').forEach(d=>d.open=false);
 });
})();
