(() => {
  'use strict';
  const style = document.createElement('style');
  style.id = 'v11PrecisionFixes';
  style.textContent = `
    .v11CustomPour{grid-template-columns:1.15fr repeat(8,minmax(62px,.75fr)) 34px}
    .v11Summary>.v11ScaleNote{grid-column:1/-1;margin:2px 0 0}
    .productModal .v11Prep + .v6PrepHub{display:none!important}
    @media(max-width:760px){.v11CustomPour{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  function secondsOnly(value){
    const s = String(value || '').trim();
    let m = s.match(/^(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*(?:min|mins|minute|minutes|د)$/i);
    if (m) return `${Math.round(Number(m[1])*60)}–${Math.round(Number(m[2])*60)}s`;
    m = s.match(/^(\d+(?:\.\d+)?)\s*(?:min|mins|minute|minutes|د)$/i);
    if (m) return `${Math.round(Number(m[1])*60)}s`;
    return s;
  }

  function normalizeTeaTimes(){
    const modal = document.querySelector('.productModal');
    if (!modal) return;
    const section = modal.querySelector('.v11Prep');
    if (!section) return;
    section.querySelectorAll('.v11Metric b,.v11Pour dd').forEach(el => {
      const next = secondsOnly(el.textContent);
      if (next !== el.textContent) el.textContent = next;
    });
    section.querySelectorAll('[data-v11-field="steepTime"]').forEach(input => {
      const next = secondsOnly(input.value);
      if (next !== input.value) input.value = next;
    });
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;normalizeTeaTimes();});};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',schedule,true);
  schedule();
})();
