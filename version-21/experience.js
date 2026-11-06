(() => {
 const header=document.querySelector('.topbar');
 const size=()=>document.documentElement.style.setProperty('--mj-header-height',Math.ceil(header.getBoundingClientRect().height)+'px');
 new ResizeObserver(size).observe(header);size();
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||document.querySelector('dialog[open]')||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(!location.hash.startsWith('#/icecream/'))return;
  const dir=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
  if(dir){e.preventDefault();document.querySelector(`[data-ice-move="${document.documentElement.dir==='rtl'?-dir:dir}"]`)?.click();}
 });
})();
