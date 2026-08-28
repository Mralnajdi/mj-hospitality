(() => {
  const M = window.MJ_MENU;
  if (!M) return;
  const P = M.products || [];
  const EXTRA = window.MJ_EXTRA?.products || {};
  const aliases = {
    "CGLE Tres Dragones": "Methods – CGLE Tres Dragones",
    "Pink Bourbon Punch": "Methods – Pink Bourbon Punch",
    "Bourbon Sidra Sakura": "Methods – Bourbon Sidra Sakura",
    "EA Decaf De Cana": "Methods – EA Decaf De Cana"
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const isAr = () => document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";
  const tr = (en, ar) => isAr() ? ar : en;
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g," ").trim();
  const extraFor = (p) => EXTRA[p.nameEn] || EXTRA[aliases[p.nameEn]] || { facts: [] };

  function injectStyles(){
    if(document.getElementById('v7CardStyles')) return;
    const s=document.createElement('style');
    s.id='v7CardStyles';
    s.textContent=`
      .productTile.v7Card{border-radius:25px;border-color:rgba(201,168,106,.23);background:linear-gradient(180deg,#11100e 0%,#0b0a08 100%);box-shadow:0 12px 34px rgba(0,0,0,.18);overflow:hidden}
      .productTile.v7Card:hover{border-color:rgba(201,168,106,.55);box-shadow:0 24px 64px rgba(0,0,0,.32)}
      .productTile.v7Card .productImage{aspect-ratio:16/10;border-bottom:1px solid rgba(201,168,106,.24);background:#090806}
      .productTile.v7Card .productImage img{object-fit:cover}
      .productTile.v7Card .quickView{display:none!important}
      .productTile.v7Card .productBody{padding:18px 18px 17px}
      .v7Title{margin:0;color:#fff8ee;font-family:Georgia,"Times New Roman",serif;font-size:clamp(20px,5.3vw,28px);line-height:1.16;font-weight:400}
      .v7Profile{margin:9px 0 0;color:#d7b878;font-size:11px;line-height:1.55;font-weight:500}
      .v7Description{margin:8px 0 0;color:#b9afa2;font-size:12px;line-height:1.72;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
      .v7Benefit{margin-top:14px;padding:11px 13px;border:1px solid rgba(201,168,106,.18);border-radius:15px;background:linear-gradient(90deg,rgba(201,168,106,.055),rgba(255,255,255,.012));display:flex;align-items:center;gap:9px;color:#d7cec0;font-size:11px;line-height:1.55}
      .v7BenefitIcon{flex:0 0 27px;width:27px;height:27px;border:1px solid rgba(201,168,106,.45);border-radius:50%;display:grid;place-items:center;color:#d8b779}
      .v7BenefitIcon svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
      .v7Benefit b{color:#d9b877;font-weight:600;margin-inline-end:4px}
      .v7MetaRow{margin-top:9px;display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;direction:ltr;justify-content:flex-start;white-space:nowrap}
      .v7MetaRow::-webkit-scrollbar{display:none}
      .v7MetaChip{direction:rtl;display:inline-flex;align-items:center;gap:5px;flex:0 0 auto;padding:5px 8px;border:1px solid rgba(201,168,106,.27);border-radius:999px;background:rgba(7,7,6,.5);color:#c9c0b4;font-size:9px;line-height:1}
      html[dir="ltr"] .v7MetaChip{direction:ltr}
      .v7MetaChip svg{width:13px;height:13px;fill:none;stroke:#d6ad65;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
      .v7MetaChip.caffeine-free,.v7MetaChip.decaf{border-color:rgba(201,168,106,.36);color:#e0d7c8}
      .v7MetaChip.caffeine{color:#e6d4b4}
      .v7MetaChip.time{color:#bcb2a5}
      .v7Card .productTags,.v7Card .micro,.v7Card .profile{display:none!important}
      @media(min-width:700px){.productGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.v7Description{font-size:12.5px}.v7MetaChip{font-size:9.5px}}
      @media(min-width:1100px){.productGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `;
    document.head.appendChild(s);
  }

  const icons={
    leaf:`<svg viewBox="0 0 24 24"><path d="M19 4C11 4 6 8 6 14c0 3 2 5 5 5 6 0 9-7 8-15Z"/><path d="M5 20c2-5 6-9 11-12"/></svg>`,
    free:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M6 18 18 6"/></svg>`,
    caffeine:`<svg viewBox="0 0 24 24"><path d="M5 8h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/></svg>`,
    decaf:`<svg viewBox="0 0 24 24"><path d="M5 8h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M4 4l16 16"/></svg>`,
    morning:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>`,
    afternoon:`<svg viewBox="0 0 24 24"><path d="M3 17h18M5 14a7 7 0 0 1 14 0"/><path d="M12 3v3M4.9 7.2 7 9M19.1 7.2 17 9"/></svg>`,
    evening:`<svg viewBox="0 0 24 24"><path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5Z"/></svg>`
  };

  function caffeineStatus(p){
    const facts=extraFor(p).facts||[];
    const f=facts.find(x=>norm(x[0])==='caffeine' || String(x[2]||'').includes('الكافيين'));
    if(f){
      const val=norm(f[1]);
      if(val==='0 mg' || val.includes('caffeine-free') || val.includes('caffeine free')) return 'free';
      if(val.includes('decaf')) return 'decaf';
      if(val.includes('present') || val.includes('caffeine')) return 'caffeine';
    }
    if(/decaf/i.test(p.nameEn)) return 'decaf';
    if(p.cat==='arabic' || p.cat==='specialty') return 'caffeine';
    return null;
  }

  function preferredTimes(p){
    const x=norm(`${p.timeEn||''} ${p.timeAr||''}`);
    const out=[];
    if(/anytime|أي وقت/.test(x)) return ['morning','afternoon','evening'];
    if(/daytime|النهار/.test(x)) return ['morning','afternoon'];
    if(/morning|الصباح/.test(x)) out.push('morning');
    if(/midday|afternoon|after lunch|early afternoon|الظهر|العصر|بعد الغداء/.test(x)) out.push('afternoon');
    if(/evening|night|المساء|الليل/.test(x)) out.push('evening');
    return [...new Set(out)];
  }

  function benefitFor(p,status,times){
    const evening=times.includes('evening'), morning=times.includes('morning');
    if(p.cat==='sparkling') return tr('Refreshing for chilled hospitality and serving over ice.','خيار منعش للضيافة الباردة والتقديم مع الثلج.');
    if(p.cat==='arabic') return tr('Ideal for traditional Arabic hospitality and a warm welcoming serve.','مناسب للضيافة العربية والتقديم التقليدي الدافئ.');
    if(status==='decaf') return tr('Keeps the specialty-coffee experience with a much lower caffeine load.','يحافظ على تجربة القهوة المختصة مع حمولة كافيين منخفضة جدًا.');
    if(p.cat==='specialty' && morning) return tr('A lively cup suited to starting the day and focused coffee moments.','كوب حيوي مناسب لبداية اليوم وجلسات القهوة المركزة.');
    if(p.cat==='tea' && status==='free' && evening) return tr('A caffeine-free choice suited to a calm afternoon or evening.','خيار دون كافيين مناسب للعصر أو المساء الهادئ.');
    if(p.cat==='tea' && status==='free') return tr('A caffeine-free option that is easy to enjoy through the day.','خيار دون كافيين سهل التقديم والاستمتاع به خلال اليوم.');
    if(p.cat==='tea' && status==='caffeine' && morning) return tr('A naturally caffeinated tea suited to a fresh start to the day.','شاي يحتوي كافيين طبيعي ومناسب لبداية منعشة لليوم.');
    if(p.cat==='tea') return tr('A refined tea choice for a relaxed hospitality moment.','خيار شاي راقٍ مناسب لجلسة ضيافة هادئة.');
    return tr('A polished hospitality choice matched to its recommended serving time.','خيار ضيافة راقٍ مناسب لوقت التقديم الموصى به.');
  }

  function chip(type){
    const map={
      free:[tr('Caffeine-Free','بدون كافيين'),'free','caffeine-free'],
      decaf:[tr('Decaf','ديكاف'),'decaf','decaf'],
      caffeine:[tr('Caffeine','كافيين'),'caffeine','caffeine'],
      morning:[tr('Morning','الصباح'),'morning','time'],
      afternoon:[tr('Afternoon','العصر'),'afternoon','time'],
      evening:[tr('Evening','المساء'),'evening','time']
    };
    const m=map[type];
    return m?`<span class="v7MetaChip ${m[2]}">${icons[m[1]]}<span>${esc(m[0])}</span></span>`:'';
  }

  function enhanceCard(tile){
    const p=P.find(x=>x._id===tile.dataset.product);
    if(!p) return;
    const lang=isAr()?'ar':'en';
    const sig=`${p._id}|${lang}`;
    if(tile.dataset.v7Sig===sig) return;
    tile.dataset.v7Sig=sig;
    tile.classList.add('v7Card');
    tile.querySelector('.quickView')?.remove();
    const body=tile.querySelector('.productBody');
    if(!body) return;
    const status=caffeineStatus(p);
    const times=preferredTimes(p);
    const ordered=[];
    if(status) ordered.push(status);
    ['morning','afternoon','evening'].forEach(t=>{if(times.includes(t)) ordered.push(t)});
    const profile=tr(p.profileEn||'',p.profileAr||'');
    const desc=tr(p.descEn||'',p.descAr||'');
    const benefit=benefitFor(p,status,times);
    body.innerHTML=`
      <h3 class="v7Title">${esc(tr(p.nameEn,p.nameAr))}</h3>
      ${profile?`<p class="v7Profile">${esc(profile)}</p>`:''}
      ${desc?`<p class="v7Description">${esc(desc)}</p>`:''}
      <div class="v7Benefit"><span class="v7BenefitIcon">${icons.leaf}</span><span><b>${esc(tr('Benefit:','الفائدة:'))}</b>${esc(benefit)}</span></div>
      ${ordered.length?`<div class="v7MetaRow" aria-label="${esc(tr('Caffeine and preferred time','الكافيين والفترة المفضلة'))}">${ordered.map(chip).join('')}</div>`:''}
    `;
  }

  function enhanceAll(){
    injectStyles();
    document.querySelectorAll('.productTile[data-product]').forEach(enhanceCard);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhanceAll()})};
  const obs=new MutationObserver(schedule);
  obs.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',schedule,true);
  window.addEventListener('hashchange',schedule);
  setInterval(schedule,1200);
  enhanceAll();
})();