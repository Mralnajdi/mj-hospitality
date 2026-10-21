/* Render the twelve selected presentations from a shared source without duplicating it in memory. */
window.MJ_ART_READY=new Promise((resolve,reject)=>{
 const photo=new Image();
 photo.onload=()=>{
  try {
   const products=window.MJ_MENU.products.filter(p=>p.edition14);
   if(products.length!==12)throw new Error('Presentation mapping mismatch');
   const canvas=document.createElement('canvas');canvas.width=828;canvas.height=619;
   const ctx=canvas.getContext('2d');
   const w=photo.naturalWidth/3,h=photo.naturalHeight/4;
   for(const p of products){
    if(!Number.isInteger(p.artIndex)||p.artIndex<0||p.artIndex>11)throw new Error('Invalid presentation index');
    ctx.clearRect(0,0,828,619);
    ctx.drawImage(photo,(p.artIndex%3)*w+2,Math.floor(p.artIndex/3)*h+2,w-4,h-4,0,0,828,619);
    p.image=canvas.toDataURL('image/webp',.92);
   }
   resolve();
  } catch(e){reject(e);}
 };
 photo.onerror=()=>reject(new Error('Unable to load presentation images'));
 photo.src='version-16/assets/presentations.png';
});
