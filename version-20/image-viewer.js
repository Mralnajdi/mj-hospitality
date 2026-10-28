(() => {
 const tr=(a,e)=>document.documentElement.lang==='ar'?a:e;
 const dialog=document.createElement('dialog');dialog.className='nativeViewer';dialog.setAttribute('aria-label','Image');
 dialog.innerHTML='<div class="nativeToolbar"><button data-fit></button><button data-native>100%</button><a data-original target="_blank" rel="noopener"></a><span data-resolution></span><button data-close aria-label="Close">×</button></div><div class="nativeCanvas"><img alt=""></div>';
 document.body.append(dialog);
 const photo=dialog.querySelector('img'),canvas=dialog.querySelector('.nativeCanvas');let active;
 function fit(){dialog.classList.remove('nativeSize');canvas.scrollTop=canvas.scrollLeft=0;}
 function open(img){active=document.activeElement;photo.src=img.currentSrc||img.src;photo.alt=img.alt;dialog.querySelector('[data-fit]').textContent=tr('ملاءمة الشاشة','Fit');dialog.querySelector('[data-original]').textContent=tr('فتح الأصل ↗','Open original ↗');dialog.querySelector('[data-original]').href=photo.src;dialog.querySelector('[data-resolution]').textContent=img.naturalWidth+' × '+img.naturalHeight;fit();dialog.showModal();document.body.classList.add('nativeViewerOpen');}
 dialog.querySelector('[data-fit]').onclick=fit;dialog.querySelector('[data-native]').onclick=()=>dialog.classList.add('nativeSize');dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.classList.remove('nativeViewerOpen');active?.focus()});
 function add(){document.querySelectorAll('.hero>img,.iceDetailMedia>img,.iceEditorialScene>img,.modalVisual>img').forEach(img=>{if(img.dataset.nativeViewer)return;img.dataset.nativeViewer='true';const p=img.parentElement;if(!p)return;const b=document.createElement('button');b.className='nativeImageButton';b.type='button';b.textContent='⤢';b.setAttribute('aria-label',tr('عرض الصورة الأصلية','View original image'));b.title=tr('عرض الصورة الأصلية','View original image');b.onclick=e=>{e.preventDefault();e.stopPropagation();open(img)};p.classList.add('nativeImageHost');p.append(b);});}
 new MutationObserver(add).observe(document.querySelector('#main'),{subtree:true,childList:true});new MutationObserver(add).observe(document.body,{childList:true});add();
})();
