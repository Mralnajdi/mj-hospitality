(() => {
  const M = window.MJ_MENU;
  if (!M?.products) return;

  const COFFEE_STANDARD = "SCA / WCR sensory taxonomy";
  const TEA_STANDARD = "Official producer notes · ISO 3103 reference";
  const NO_DECLARED_NOTES = new Set(["Java House — Kenya AA", "Barista & Co. — Gourmet"]);

  const PALETTE = {
    coffee: {
      floral: "#d35ca4", fruity: "#f05b63", sweet: "#e9b949", nutty: "#a86b42",
      spices: "#e27738", roasted: "#744536", fermented: "#a13f58", green: "#4ea86b",
      mouthfeel: "#4fa8a0", finish: "#7587d8", aroma: "#9c69d8", other: "#8f8173"
    },
    tea: {
      floral: "#d65db1", fruity: "#f56568", citrus: "#e6c83d", sweet: "#e5a942",
      herbal: "#5bae68", fresh: "#42b9a8", spices: "#e47d3b", green: "#7dbb4c",
      roasted: "#a8794c", mouthfeel: "#4b9fa0", finish: "#7089d8", aroma: "#a56bd5", other: "#8f8173"
    }
  };

  const CATEGORIES = {
    coffee: {
      floral:["Floral","زهري"], fruity:["Fruity","فاكهي"], sweet:["Sweet","حلو"],
      nutty:["Nutty / Cocoa","مكسرات / كاكاو"], spices:["Spices","بهارات"], roasted:["Roasted","محمص"],
      fermented:["Sour / Fermented","حامضي / متخمر"], green:["Green / Vegetative","أخضر / نباتي"],
      mouthfeel:["Texture / Mouthfeel","القوام / الملمس"], finish:["Finish","النهاية"], aroma:["Aroma","العطر"], other:["Other","أخرى"]
    },
    tea: {
      floral:["Floral","زهري"], fruity:["Fruity","فاكهي"], citrus:["Citrus","حمضيات"], sweet:["Sweet","حلو"],
      herbal:["Herbal","عشبي"], fresh:["Fresh / Mint","منعش / نعناع"], spices:["Spiced","بهاري"],
      green:["Green / Vegetal","أخضر / نباتي"], roasted:["Roasted / Nutty","محمص / جوزي"],
      mouthfeel:["Texture / Mouthfeel","القوام / الملمس"], finish:["Finish","النهاية"], aroma:["Aroma","العطر"], other:["Other","أخرى"]
    }
  };

  const RULES = {
    coffee: [
      ["floral",/floral|jasmine|rose|blossom|flower/i],
      ["fruity",/fruit|fruity|berry|blueberry|blackcurrant|currant|grape|plum|cherry|apple|peach|tropical|pineapple|citrus|lemon|orange|lime/i],
      ["sweet",/sweet|caramel|vanilla|honey|sugar|molasses|toffee/i],
      ["nutty",/cocoa|chocolate|nut|almond|hazelnut|peanut/i],
      ["spices",/spice|spicy|cinnamon|clove|cardamom|pepper/i],
      ["roasted",/roast|roasted|smoky|tobacco|malt/i],
      ["fermented",/ferment|wine|winey|acetic|sour/i],
      ["green",/green|vegetal|vegetative|herbal|peapod/i],
      ["mouthfeel",/creamy|cream|silky|body|bodied|smooth|dense|round|texture/i],
      ["finish",/finish|aftertaste|clean finish/i],
      ["aroma",/aroma|aromatic/i]
    ],
    tea: [
      ["floral",/floral|jasmine|rose|blossom|flower|lavender/i],
      ["citrus",/citrus|lemon|orange|lime|bergamot/i],
      ["fruity",/fruit|fruity|berry|strawberry|raspberry|blackcurrant|cherry|peach|apple|banana|passion|grape|pineapple|mango/i],
      ["fresh",/fresh|mint|menthol|cooling/i],
      ["herbal",/herbal|chamomile|moringa|lemongrass|rooibos|mate/i],
      ["sweet",/sweet|vanilla|caramel|honey|sugar|cream/i],
      ["spices",/spice|spiced|ginger|turmeric|cinnamon|clove|cardamom|pepper/i],
      ["green",/green tea|green|vegetal|grassy|grass/i],
      ["roasted",/roast|roasted|nut|nutty|toasted/i],
      ["mouthfeel",/smooth|creamy|silky|body|bodied|soft|delicate|texture/i],
      ["finish",/finish|aftertaste|clean/i],
      ["aroma",/aroma|aromatic/i]
    ]
  };

  const esc = (s="") => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = (s="") => String(s).toLowerCase().replace(/[–—]/g,"-").replace(/\s+/g," ").trim();
  const isAr = () => document.documentElement.lang === "ar";
  const tr = (en,ar) => isAr() ? ar : en;

  function splitProfile(s){
    return String(s||"").split(/\s*[·•|;]\s*|\s*,\s*/).map(x=>x.trim()).filter(Boolean);
  }

  function identifyProduct(modal){
    const title = norm(modal.querySelector(".modalTitleRow h2, h2")?.textContent || "");
    if(!title) return null;
    return M.products.find(p=>{
      const candidates=[p.nameEn,p.nameAr,p._displayBase?.en,p._displayBase?.ar,
        p._maker?.en && `${p._displayBase?.en||p.nameEn} - ${p._maker.en}`,
        p._maker?.ar && `${p._displayBase?.ar||p.nameAr} - ${p._maker.ar}`].filter(Boolean).map(norm);
      return candidates.some(c=>c.length>=3 && (title===c || title.includes(c) || c.includes(title)));
    }) || null;
  }

  function classify(note,kind){
    for(const [key,re] of RULES[kind]) if(re.test(note)) return key;
    return "other";
  }

  function familyLabel(kind,key){
    const pair=CATEGORIES[kind][key] || CATEGORIES[kind].other;
    return tr(pair[0],pair[1]);
  }

  function profileData(product){
    const kind=product.cat==="specialty"?"coffee":product.cat==="tea"?"tea":null;
    if(!kind) return null;
    if(NO_DECLARED_NOTES.has(product.nameEn)) return {kind,pending:true,notesEn:[],notesAr:[],families:[],explicit:[]};

    const notesEn=splitProfile(product.profileEn);
    const notesAr=splitProfile(product.profileAr);
    const usable=notesEn.filter(n=>n.length>1 && !/^medium roast$|^hand roasted$|^beans?$|^whole beans?$|^decaf$/i.test(n));
    if(!usable.length) return {kind,pending:true,notesEn:[],notesAr:[],families:[],explicit:[]};

    const counts=new Map();
    usable.forEach(note=>{
      const key=classify(note,kind);
      counts.set(key,(counts.get(key)||0)+1);
    });
    const total=usable.length;
    const families=[...counts.entries()].map(([key,count])=>({
      key,count,pct:Math.round(count*100/total),color:PALETTE[kind][key]||PALETTE[kind].other
    })).sort((a,b)=>b.count-a.count || a.key.localeCompare(b.key));

    const declaredText=`${product.profileEn||""} ${product.descEn||""}`;
    const explicit=[];
    [
      [/acidity|acidic/i,["Acidity","الحموضة"]],
      [/body|bodied|texture|mouthfeel|creamy|silky|dense/i,["Body / Mouthfeel","القوام / الملمس"]],
      [/finish|aftertaste/i,["Finish","النهاية"]],
      [/aroma|aromatic/i,["Aroma","العطر"]],
      [/sweet|sweetness|caramel|honey|sugar/i,["Sweetness","الحلاوة"]]
    ].forEach(([re,label])=>{ if(re.test(declaredText)) explicit.push(label); });

    return {kind,pending:false,notesEn:usable,notesAr,families,explicit};
  }

  function noteChip(note,kind){
    const key=classify(note,kind);
    const color=PALETTE[kind][key]||PALETTE[kind].other;
    return `<span class="v4DeclaredNote" style="--accent:${color}">${esc(note)}</span>`;
  }

  function pendingMarkup(kind){
    return `<section class="v4Sensory" data-v4-sensory>
      <div class="v4SensoryHead"><div><div class="v4SensoryEyebrow">V4 · ${esc(tr("Sensory profile","الملف الحسي"))}</div><h3>${esc(tr("Official sensory notes","الإيحاءات الحسية الرسمية"))}</h3><p>${esc(tr("Placed directly below the product description.","موجودة مباشرة تحت وصف المنتج."))}</p></div><div class="v4SensoryStandard">${esc(kind==="coffee"?COFFEE_STANDARD:TEA_STANDARD)}</div></div>
      <div class="v4Pending"><b>${esc(tr("Awaiting official tasting descriptors","بانتظار إيحاءات تذوق رسمية"))}</b><span>${esc(tr("No sensory chart was generated because verified official descriptors are not stored for this product.","لم يتم إنشاء رسم حسي لأن المنتج لا يحتوي حاليًا على إيحاءات رسمية موثقة في البيانات."))}</span></div>
    </section>`;
  }

  function markup(product){
    const d=profileData(product);
    if(!d) return "";
    if(d.pending) return pendingMarkup(d.kind);

    const notes=(isAr() && d.notesAr.length===d.notesEn.length)?d.notesAr:d.notesEn;
    const spectrum=d.families.map(f=>`<span class="v4SpectrumSeg" style="--accent:${f.color};width:${f.pct}%" title="${esc(familyLabel(d.kind,f.key))} ${f.pct}%"></span>`).join("");
    const bars=d.families.map(f=>`<div class="v4BarRow" style="--accent:${f.color}">
      <div class="v4BarTop"><div class="v4BarName"><i class="v4BarDot"></i><span>${esc(familyLabel(d.kind,f.key))}</span></div><strong class="v4BarPct">${f.pct}%</strong></div>
      <div class="v4BarTrack"><div class="v4BarFill" style="--pct:${f.pct}%"></div></div>
      <div class="v4BarMeta"><span>${esc(tr(`${f.count} of ${d.notesEn.length} declared notes`,`${f.count} من ${d.notesEn.length} إيحاءات معلنة`))}</span><strong>${esc(tr("descriptor share","حصة الإيحاءات"))}</strong></div>
    </div>`).join("");
    const explicit=d.explicit.length?`<div class="v4Explicit">${d.explicit.map(pair=>`<span>${esc(tr(pair[0],pair[1]))}</span>`).join("")}</div>`:"";

    return `<section class="v4Sensory" data-v4-sensory>
      <div class="v4SensoryHead"><div><div class="v4SensoryEyebrow">V4 · ${esc(tr("Sensory profile","الملف الحسي"))}</div><h3>${esc(tr("Official sensory signature","البصمة الحسية الرسمية"))}</h3><p>${esc(tr("Official descriptors visualized as a clear color spectrum — no invented intensity scores.","الإيحاءات الرسمية معروضة كطيف لوني واضح — بدون اختراع درجات شدة."))}</p></div><div class="v4SensoryStandard">${esc(d.kind==="coffee"?COFFEE_STANDARD:TEA_STANDARD)}</div></div>
      <div class="v4DeclaredLabel">${esc(tr("Declared notes","الإيحاءات المعلنة"))}</div>
      <div class="v4DeclaredNotes">${notes.map(n=>noteChip(n,d.kind)).join("")}</div>
      <div class="v4SensoryPanel">
        <div class="v4PanelTitle"><b>${esc(tr("Sensory spectrum","الطيف الحسي"))}</b><span>${esc(tr("share of official declared descriptors","نسبة الإيحاءات الرسمية المعلنة"))}</span></div>
        <div class="v4Spectrum" aria-label="${esc(tr("Sensory descriptor distribution","توزيع الإيحاءات الحسية"))}">${spectrum}</div>
        <div class="v4SpectrumScale"><span>0%</span><span>${d.notesEn.length} ${esc(tr("official descriptors","إيحاءات رسمية"))}</span><span>100%</span></div>
        <div class="v4FamilyBars">${bars}</div>${explicit}
      </div>
      <div class="v4SensoryFoot"><b>${esc(tr("Method:","المنهج:"))}</b> ${esc(d.kind==="coffee"?tr("Official product/roaster descriptors are classified into SCA/WCR-style sensory families. Bar length and percentage show only each family’s share of the declared descriptors — not measured flavor intensity or a competition score.","تُصنّف إيحاءات المنتج/المحمصة الرسمية إلى عائلات حسية وفق منطق SCA/WCR. طول الشريط والنسبة يمثلان فقط حصة العائلة من الإيحاءات المعلنة — وليسا قياس شدة أو درجة مسابقة."):tr("Official producer descriptors are grouped for display. ISO 3103 is a tea sensory-preparation reference, not a universal tea flavor wheel. Bar percentages show descriptor distribution only.","تُجمع إيحاءات الشركة الرسمية للعرض. معيار ISO 3103 مرجع لتحضير الشاي للاختبارات الحسية وليس عجلة نكهة عالمية للشاي. نسب الشرائط تمثل توزيع الإيحاءات فقط."))}</div>
    </section>`;
  }

  function attach(modal){
    if(!modal || modal.querySelector("[data-v4-sensory]")) return;
    const product=identifyProduct(modal);
    if(!product || !["specialty","tea"].includes(product.cat)) return;
    const story=modal.querySelector(".modalContent .story");
    if(!story) return;
    story.insertAdjacentHTML("afterend",markup(product));
  }

  const scan=()=>document.querySelectorAll(".productModal").forEach(attach);
  const observer=new MutationObserver(()=>requestAnimationFrame(scan));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("click",()=>setTimeout(scan,20),true);
  setTimeout(scan,0);

  window.MJ_V4_SENSORY={profileData};
})();
