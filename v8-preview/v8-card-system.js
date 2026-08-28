(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const P = M.products || [];
  const EXTRA = window.MJ_EXTRA?.products || {};
  const SOURCES = window.MJ_SOURCES?.products || {};
  const aliases = {
    "CGLE Tres Dragones": "Methods – CGLE Tres Dragones",
    "Pink Bourbon Punch": "Methods – Pink Bourbon Punch",
    "Bourbon Sidra Sakura": "Methods – Bourbon Sidra Sakura",
    "EA Decaf De Cana": "Methods – EA Decaf De Cana"
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const isAr = () => document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";
  const tr = (en, ar) => isAr() ? ar : en;
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const extraFor = (p) => EXTRA[p.nameEn] || EXTRA[aliases[p.nameEn]] || { facts: [] };
  const sourceFor = (p) => SOURCES[p.nameEn] || null;

  const icons = {
    leaf:`<svg viewBox="0 0 24 24"><path d="M19 4C11 4 6 8 6 14c0 3 2 5 5 5 6 0 9-7 8-15Z"/><path d="M5 20c2-5 6-9 11-12"/></svg>`,
    free:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M6 18 18 6"/></svg>`,
    caffeine:`<svg viewBox="0 0 24 24"><path d="M5 8h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/></svg>`,
    decaf:`<svg viewBox="0 0 24 24"><path d="M5 8h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M4 4l16 16"/></svg>`,
    morning:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>`,
    afternoon:`<svg viewBox="0 0 24 24"><path d="M3 17h18M5 14a7 7 0 0 1 14 0"/><path d="M12 3v3M4.9 7.2 7 9M19.1 7.2 17 9"/></svg>`,
    evening:`<svg viewBox="0 0 24 24"><path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5Z"/></svg>`,
    shield:`<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    flower:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.2"/><path d="M12 4c2.5 0 4 1.6 4 3.6S14.5 11 12 11 8 9.6 8 7.6 9.5 4 12 4Zm0 16c-2.5 0-4-1.6-4-3.6S9.5 13 12 13s4 1.4 4 3.4-1.5 3.6-4 3.6ZM4 12c0-2.5 1.6-4 3.6-4S11 9.5 11 12s-1.4 4-3.4 4S4 14.5 4 12Zm16 0c0 2.5-1.6 4-3.6 4S13 14.5 13 12s1.4-4 3.4-4S20 9.5 20 12Z"/></svg>`,
    sparkle:`<svg viewBox="0 0 24 24"><path d="m12 3 1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3Z"/><path d="m19 15 .7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z"/></svg>`,
    pin:`<svg viewBox="0 0 24 24"><path d="M12 21s6-6.1 6-11a6 6 0 1 0-12 0c0 4.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg>`,
    process:`<svg viewBox="0 0 24 24"><path d="M5 7h10M15 7l-2-2M15 7l-2 2M19 17H9M9 17l2-2M9 17l2 2"/></svg>`,
    roast:`<svg viewBox="0 0 24 24"><path d="M18.4 4.8c3.1 3.1 1.4 9.8-2.4 13.6S5.5 23.9 2.4 20.8 1 11 4.8 7.2 15.3 1.7 18.4 4.8Z"/><path d="M4.8 19c4.2-1.8 5.2-7.5 12.4-12.4"/></svg>`,
    clock:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    temp:`<svg viewBox="0 0 24 24"><path d="M10 5a2 2 0 1 1 4 0v9.1a4 4 0 1 1-4 0V5Z"/><path d="M12 9v7"/></svg>`,
    cup:`<svg viewBox="0 0 24 24"><path d="M5 7h12v6a6 6 0 0 1-6 6 6 6 0 0 1-6-6V7Z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/></svg>`,
    type:`<svg viewBox="0 0 24 24"><path d="M5 18c4-1 8-5 10-11 3 5 2 10-2 12-3 1.5-6 .8-8-1Z"/><path d="M5 20c2-5 5-8 10-11"/></svg>`
  };

  function injectStyles(){
    if (document.getElementById("v8CardStyles")) return;
    const s = document.createElement("style");
    s.id = "v8CardStyles";
    s.textContent = `
      .productTile.v8Card{border-radius:28px;border:1px solid rgba(201,168,106,.30);background:linear-gradient(180deg,#0d0c0a 0%,#090806 100%);box-shadow:0 18px 54px rgba(0,0,0,.24);overflow:hidden;transform:none!important}
      .productTile.v8Card:hover{border-color:rgba(218,177,101,.62);box-shadow:0 28px 78px rgba(0,0,0,.38)}
      .productTile.v8Card .productImage{aspect-ratio:16/11;border:0;background:#070605;overflow:hidden}
      .productTile.v8Card .productImage img{width:100%;height:100%;object-fit:cover;object-position:center;transform:none}
      .productTile.v8Card:hover .productImage img{transform:scale(1.018);filter:saturate(1.04)}
      .productTile.v8Card .quickView{display:none!important}
      .productTile.v8Card .productBody{padding:0 16px 17px;text-align:center}
      .v8TopMeta{margin:14px 0 0;border:1px solid rgba(201,168,106,.26);border-radius:16px;background:linear-gradient(90deg,rgba(201,168,106,.045),rgba(255,255,255,.018));display:flex;align-items:center;gap:0;overflow-x:auto;scrollbar-width:none;direction:ltr;white-space:nowrap}
      .v8TopMeta::-webkit-scrollbar,.v8Specs::-webkit-scrollbar{display:none}
      .v8TopChip{direction:rtl;flex:1 0 auto;min-width:78px;display:inline-flex;justify-content:center;align-items:center;gap:7px;padding:10px 12px;color:#e6ded1;font-size:10px;line-height:1;border-inline-end:1px solid rgba(201,168,106,.20)}
      .v8TopChip:last-child{border-inline-end:0}
      html[dir="ltr"] .v8TopChip{direction:ltr}
      .v8TopChip svg{width:18px;height:18px;fill:none;stroke:#d9aa59;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}
      .v8Title{margin:22px 2px 0;color:#fff7eb;font-family:Georgia,"Times New Roman",serif;font-size:clamp(24px,6vw,34px);line-height:1.17;font-weight:400;text-align:center}
      .v8Divider{display:flex;justify-content:center;align-items:center;gap:11px;margin:11px auto 0;color:#c79a4f;width:74%}
      .v8Divider:before,.v8Divider:after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,rgba(205,164,91,.8))}
      .v8Divider:after{background:linear-gradient(90deg,rgba(205,164,91,.8),transparent)}
      .v8Divider svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
      .v8Description{margin:14px auto 0;max-width:760px;color:#c1b8ab;font-size:12px;line-height:1.82;text-align:center}
      .v8Benefits{margin:17px 0 0;border:1px solid rgba(201,168,106,.24);border-radius:18px;background:linear-gradient(180deg,rgba(201,168,106,.045),rgba(255,255,255,.01));padding:13px 12px 14px}
      .v8BenefitsHead{display:flex;align-items:center;justify-content:flex-end;gap:7px;color:#dcb469;font-size:12px;margin-bottom:10px;text-align:right}
      html[dir="ltr"] .v8BenefitsHead{justify-content:flex-start;text-align:left}
      .v8BenefitsHead svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5}
      .v8BenefitsGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}
      .v8BenefitItem{min-width:0;padding:4px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:#eee5d8;font-size:10px;line-height:1.45;text-align:center;border-inline-end:1px solid rgba(201,168,106,.18)}
      .v8BenefitItem:last-child{border-inline-end:0}
      .v8BenefitItem svg{width:25px;height:25px;fill:none;stroke:#d7a650;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}
      .v8Specs{margin:11px 0 0;border:1px solid rgba(201,168,106,.23);border-radius:16px;background:linear-gradient(90deg,rgba(201,168,106,.04),rgba(255,255,255,.012));display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;direction:ltr;white-space:nowrap}
      .v8Spec{direction:rtl;min-width:86px;flex:1 0 auto;padding:10px 8px;display:inline-flex;align-items:center;justify-content:center;gap:6px;color:#d6cdbf;font-size:9px;line-height:1.2;border-inline-end:1px solid rgba(201,168,106,.18)}
      .v8Spec:last-child{border-inline-end:0}
      html[dir="ltr"] .v8Spec{direction:ltr}
      .v8Spec svg{width:16px;height:16px;fill:none;stroke:#d6a44e;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}
      .v8Card .productTags,.v8Card .micro,.v8Card .profile,.v8Card .productTitleRow{display:none!important}
      @media(min-width:700px){.productGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.productTile.v8Card .productBody{padding:0 18px 19px}.v8Description{font-size:12.5px}.v8BenefitItem{font-size:10.5px}.v8TopChip{font-size:10.5px}}
      @media(min-width:1180px){.productGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:390px){.productTile.v8Card .productBody{padding:0 12px 14px}.v8TopMeta{margin-top:11px}.v8TopChip{min-width:71px;padding:9px 9px;font-size:9px}.v8Title{font-size:25px;margin-top:18px}.v8Description{font-size:11px}.v8Benefits{padding:11px 8px 12px}.v8BenefitItem{padding:3px 5px;font-size:9px}.v8BenefitItem svg{width:22px;height:22px}.v8Spec{min-width:78px;font-size:8.5px}}
    `;
    document.head.appendChild(s);
  }

  function factsFor(p){ return extraFor(p).facts || []; }

  function fact(p, keys){
    const wanted = keys.map(norm);
    const f = factsFor(p).find(x => wanted.includes(norm(x[0])) || wanted.some(k => norm(x[0]).includes(k)) || wanted.some(k => norm(x[2] || '').includes(k)));
    if (!f) return null;
    return { en:String(f[1] ?? ''), ar:String(f[3] ?? f[1] ?? ''), keyEn:String(f[0] ?? ''), keyAr:String(f[2] ?? f[0] ?? '') };
  }

  function caffeineStatus(p){
    const f = fact(p,["caffeine","الكافيين"]);
    if (f){
      const v = norm(f.en);
      if (v === "0 mg" || v.includes("caffeine-free") || v.includes("caffeine free") || v.includes("without caffeine")) return "free";
      if (v.includes("decaf")) return "decaf";
      if (v.includes("present") || v.includes("caffeine")) return "caffeine";
    }
    if (/decaf/i.test(p.nameEn)) return "decaf";
    if (p.cat === "arabic" || p.cat === "specialty") return "caffeine";
    const sub = norm(`${p.subEn || ''} ${p.subAr || ''}`);
    if (/green tea|white tea|شاي أخضر|الشاي الأخضر|شاي أبيض|الشاي الأبيض|mate|ماته/.test(sub) || /mate/i.test(p.nameEn)) return "caffeine";
    if (/fruit tea|herbal|infusion|أعشاب|عشبي|فواكه/.test(sub)) return "free";
    return null;
  }

  function preferredTimes(p){
    const x = norm(`${p.timeEn || ''} ${p.timeAr || ''}`);
    const out=[];
    if (/anytime|all day|أي وقت|طوال اليوم/.test(x)) return ["morning","afternoon","evening"];
    if (/daytime|النهار/.test(x)) return ["morning","afternoon"];
    if (/morning|الصباح/.test(x)) out.push("morning");
    if (/midday|afternoon|after lunch|early afternoon|الظهر|العصر|بعد الظهر|بعد الغداء/.test(x)) out.push("afternoon");
    if (/evening|night|المساء|الليل/.test(x)) out.push("evening");
    return [...new Set(out)];
  }

  function topChip(type){
    const map = {
      free:[tr("Caffeine-Free","بدون كافيين"),"free"],
      decaf:[tr("Decaf","ديكاف"),"decaf"],
      caffeine:[tr("Caffeine","كافيين"),"caffeine"],
      morning:[tr("Morning","الصباح"),"morning"],
      afternoon:[tr("Afternoon","العصر"),"afternoon"],
      evening:[tr("Evening","المساء"),"evening"]
    };
    const m=map[type];
    return m ? `<span class="v8TopChip">${icons[m[1]]}<span>${esc(m[0])}</span></span>` : "";
  }

  function flavorDescriptor(p){
    const profile = tr(p.profileEn || "", p.profileAr || "");
    if (profile) return profile.split("·").map(s=>s.trim()).filter(Boolean).slice(0,2).join(" · ");
    return tr(p.subEn || M.cats?.[p.cat]?.en || "", p.subAr || M.cats?.[p.cat]?.ar || "");
  }

  function benefitsFor(p,status,times){
    const desc = norm(`${p.descEn || ''} ${p.descAr || ''}`);
    const serve = norm(`${p.serveEn || ''} ${p.serveAr || ''}`);
    const flavor = flavorDescriptor(p);
    const b=[];
    const add=(icon,en,ar)=>{ if(b.length<3) b.push({icon,en,ar}); };

    if (p.cat === "tea") {
      if (status === "free") add("free","Caffeine-free choice","خيار بدون كافيين");
      else if (status === "caffeine") add("caffeine","Naturally caffeinated tea","شاي بكافيين طبيعي");
      else if (status === "decaf") add("decaf","Lower-caffeine choice","خيار منخفض الكافيين");

      if (times.includes("evening")) add("flower","Suited to a calm evening serve","مناسب لتقديم مسائي هادئ");
      else if (times.includes("morning")) add("morning","Suited to a fresh morning serve","مناسب لبداية صباحية منعشة");
      else add("flower","Refined tea hospitality","ضيافة شاي راقية");

      if (/hot|iced|cold|ساخن|بارد/.test(serve)) add("sparkle","Flexible hot or cold serving","مرن للتقديم ساخنًا أو باردًا");
      else add("sparkle", flavor || "Distinctive aroma and flavour", flavor || "طابع عطري ونكهة مميزة");
    } else if (p.cat === "specialty") {
      add("sparkle", flavor || "Clear specialty flavour profile", flavor || "نوتات قهوة مختصة واضحة");
      if (times.includes("morning")) add("morning","Well suited to the morning coffee ritual","مناسب لروتين القهوة الصباحي");
      else add("cup","Designed for a focused coffee serve","مناسب لجلسة قهوة مركزة");
      if (status === "decaf") add("decaf","Decaf while preserving the coffee experience","ديكاف مع الحفاظ على تجربة القهوة");
      else add("cup","Specialty hospitality cup","كوب ضيافة مختصة");
    } else if (p.cat === "arabic") {
      add("cup","Traditional Arabic hospitality","ضيافة عربية تقليدية");
      add("sparkle","Warm aromatic serving ritual","تقديم دافئ بطابع عطري");
      add("shield","Consistent capsule-based preparation","تحضير ثابت وسهل بالكبسولة");
    } else if (p.cat === "sparkling") {
      add("sparkle","Refreshing chilled serve","تقديم بارد ومنعش");
      if (/ice|iced|cold|بارد|ثلج/.test(serve)) add("cup","Ideal with ice","مناسب مع الثلج");
      else add("cup","Easy hospitality serve","سهل للتقديم في الضيافة");
      add("flower", flavor || "Distinctive flavour profile", flavor || "نكهة مميزة");
    } else {
      add("sparkle","Refined hospitality choice","خيار ضيافة راقٍ");
      add("cup","Easy serving experience","تجربة تقديم سهلة");
      add("flower", flavor || "Distinctive profile", flavor || "طابع مميز");
    }

    while (b.length < 3) add("leaf","Distinctive collection profile","طابع مميز ضمن المجموعة");
    return b.slice(0,3);
  }

  function translatedTime(s){
    if (!s) return "";
    if (!isAr()) return String(s);
    return String(s).replace(/minutes?/gi,"د").replace(/mins?/gi,"د").replace(/min/gi,"د");
  }

  function specItem(icon,label){
    if (!label) return "";
    return `<span class="v8Spec">${icons[icon] || icons.type}<span>${esc(label)}</span></span>`;
  }

  function specItems(p,status){
    const src = sourceFor(p);
    const brew = src?.brew;
    const items=[];
    const add=(icon,label)=>{ if(label && items.length<5) items.push({icon,label}); };
    const origin=fact(p,["origin","المنشأ"]);
    const process=fact(p,["process","المعالجة"]);
    const roast=fact(p,["roast","التحميص"]);
    const yieldFact=fact(p,["yield","الإنتاج"]);

    if (p.cat === "tea") {
      add("type", tr(p.subEn || "Tea", p.subAr || "شاي"));
      if (status) add(status === "free" ? "free" : status === "decaf" ? "decaf" : "caffeine", status === "free" ? tr("Caffeine-Free","بدون كافيين") : status === "decaf" ? tr("Decaf","ديكاف") : tr("Caffeine","كافيين"));
      if (brew?.time) add("clock", translatedTime(brew.time));
      if (brew?.temp != null) add("temp", `${brew.temp}°C`);
      add("cup", tr(p.serveEn || "", p.serveAr || ""));
    } else if (p.cat === "specialty") {
      if (origin) add("pin", tr(origin.en,origin.ar));
      if (status) add(status === "decaf" ? "decaf" : "caffeine", status === "decaf" ? tr("Decaf","ديكاف") : tr("Caffeine","كافيين"));
      if (process) add("process", tr(process.en,process.ar));
      if (roast) add("roast", tr(roast.en,roast.ar));
      add("cup", tr(p.serveEn || "",p.serveAr || ""));
    } else if (p.cat === "arabic") {
      if (roast) add("roast", tr(roast.en,roast.ar)); else add("type", tr(p.subEn || "Arabic Coffee",p.subAr || "قهوة عربية"));
      if (status) add("caffeine", tr("Caffeine","كافيين"));
      if (yieldFact) add("cup", tr(yieldFact.en,yieldFact.ar));
      add("clock", tr(p.timeEn || "",p.timeAr || ""));
      add("cup", tr(p.serveEn || "",p.serveAr || ""));
    } else {
      add("type", tr(p.subEn || M.cats?.[p.cat]?.en || "",p.subAr || M.cats?.[p.cat]?.ar || ""));
      if (status) add(status === "free" ? "free" : status === "decaf" ? "decaf" : "caffeine", status === "free" ? tr("Caffeine-Free","بدون كافيين") : status === "decaf" ? tr("Decaf","ديكاف") : tr("Caffeine","كافيين"));
      if (origin) add("pin",tr(origin.en,origin.ar));
      add("clock",tr(p.timeEn || "",p.timeAr || ""));
      add("cup",tr(p.serveEn || "",p.serveAr || ""));
    }

    return items.slice(0,5);
  }

  function descriptionFor(p){
    const src=sourceFor(p);
    return tr(src?.descEn || p.descEn || "", src?.descAr || p.descAr || "");
  }

  function enhanceCard(tile){
    const p=P.find(x=>x._id===tile.dataset.product);
    if(!p) return;
    const sig=`${p._id}|${isAr()?"ar":"en"}`;
    if(tile.dataset.v8Sig===sig) return;
    tile.dataset.v8Sig=sig;
    tile.classList.add("v8Card");
    tile.classList.remove("v7Card");
    tile.querySelector(".quickView")?.remove();
    const body=tile.querySelector(".productBody");
    if(!body) return;

    const status=caffeineStatus(p);
    const times=preferredTimes(p);
    const top=[];
    if(status) top.push(status);
    ["morning","afternoon","evening"].forEach(t=>{ if(times.includes(t)) top.push(t); });
    const benefits=benefitsFor(p,status,times);
    const specs=specItems(p,status);
    const desc=descriptionFor(p);

    body.innerHTML=`
      ${top.length ? `<div class="v8TopMeta" aria-label="${esc(tr("Caffeine and preferred time","الكافيين والفترة المفضلة"))}">${top.map(topChip).join("")}</div>` : ""}
      <h3 class="v8Title">${esc(tr(p.nameEn,p.nameAr))}</h3>
      <div class="v8Divider" aria-hidden="true">${icons.leaf}</div>
      ${desc ? `<p class="v8Description">${esc(desc)}</p>` : ""}
      <section class="v8Benefits" aria-label="${esc(tr("Benefits","الفائدة"))}">
        <div class="v8BenefitsHead"><span>${esc(tr("Benefits","الفائدة"))}</span>${icons.leaf}</div>
        <div class="v8BenefitsGrid">${benefits.map(b=>`<div class="v8BenefitItem">${icons[b.icon] || icons.leaf}<span>${esc(tr(b.en,b.ar))}</span></div>`).join("")}</div>
      </section>
      ${specs.length ? `<div class="v8Specs" aria-label="${esc(tr("Product serving details","بيانات المنتج والتقديم"))}">${specs.map(s=>specItem(s.icon,s.label)).join("")}</div>` : ""}
    `;
  }

  function enhanceAll(){
    injectStyles();
    document.querySelectorAll(".productTile[data-product]").forEach(enhanceCard);
  }

  let queued=false;
  const schedule=()=>{ if(queued) return; queued=true; requestAnimationFrame(()=>{queued=false;enhanceAll();}); };
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  document.addEventListener("click",schedule,true);
  window.addEventListener("hashchange",schedule);
  setInterval(schedule,1200);
  enhanceAll();
})();