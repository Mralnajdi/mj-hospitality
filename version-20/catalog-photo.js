/* Read original image dimensions, including future assets, after loading. */
(() => {
 function enhance(){document.querySelectorAll('.productTile .productImage>img').forEach(img=>{
  if(img.dataset.mjPhotoFill)return;img.dataset.mjPhotoFill='true';
  const fit=()=>{if(img.naturalWidth&&img.naturalHeight)img.parentElement.style.setProperty('--mj-image-ratio',img.naturalWidth+'/'+img.naturalHeight);};
  img.addEventListener('load',fit);fit();
 });}
 let queued=false;
 new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance();});}).observe(document.getElementById('main'),{childList:true,subtree:true});
 enhance();
})();
