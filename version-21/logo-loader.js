/* Shared startup, route and product-detail loader. */
(()=>{const el=document.getElementById('mjLogoLoader');if(!el)return;const gold=el.querySelector('.mjLoaderGold');let id=0,active=true,started=performance.now(),finishing=-1,safety;
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const fill=p=>el.style.setProperty('--mj-unfilled',(100-p)+'%');
const hide=()=>{active=false;clearTimeout(safety);el.classList.add('done');document.getElementById('app')?.removeAttribute('aria-busy')};
const arm=()=>{clearTimeout(safety);safety=setTimeout(()=>{fill(100);hide()},12000)};
const start=()=>{id++;active=true;finishing=-1;started=performance.now();gold.style.transition='none';fill(0);el.classList.remove('done');gold.getBoundingClientRect();gold.style.removeProperty('transition');document.getElementById('app')?.setAttribute('aria-busy','true');arm()};
const ready=async host=>{if(!active||finishing===id)return;const run=id;finishing=run;fill(35);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));if(run!==id)return;
const img=host?.querySelector('.hero>img,.iceDetailMedia>img,.modalVisual>img');await Promise.race([!img||img.complete?Promise.resolve():new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true})}),new Promise(r=>setTimeout(r,5000))]);
if(run!==id||!active)return;const min=run===0?650:180;await new Promise(r=>setTimeout(r,reduced()?0:Math.max(0,min-(performance.now()-started))));if(run!==id||!active)return;fill(100);await new Promise(r=>setTimeout(r,reduced()?0:650));if(run===id&&active)hide()};
window.MJ_LOADING={start,ready};document.getElementById('app')?.setAttribute('aria-busy','true');arm();
})();