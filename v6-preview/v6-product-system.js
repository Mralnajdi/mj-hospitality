(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const PRODUCTS = M.products || [];
  const EXTRA = window.MJ_EXTRA?.products || {};
  const SOURCES = window.MJ_SOURCES?.products || {};
  const XBLOOM_APP = "https://xbloom.com/pages/download-app";
  const TEAG_KW = "https://www.tgtea-kw.com";

  const aliases = {
    "CGLE Tres Dragones": "Methods – CGLE Tres Dragones",
    "Pink Bourbon Punch": "Methods – Pink Bourbon Punch",
    "Bourbon Sidra Sakura": "Methods – Bourbon Sidra Sakura",
    "EA Decaf De Cana": "Methods – EA Decaf De Cana"
  };

  const companyMap = {
    "Air Roastery – Ricardo": { en: "Air Roastery", ar: "Air Roastery" },
    "CGLE Tres Dragones": { en: "Methods Academy & Roastery", ar: "Methods Academy & Roastery" },
    "Pink Bourbon Punch": { en: "Methods Academy & Roastery", ar: "Methods Academy & Roastery" },
    "Bourbon Sidra Sakura": { en: "Methods Academy & Roastery", ar: "Methods Academy & Roastery" },
    "EA Decaf De Cana": { en: "Methods Academy & Roastery", ar: "Methods Academy & Roastery" },
    "Entire Goods – Ethiopia Finara": { en: "Entire Goods", ar: "Entire Goods" },
    "Fairview Estate — Premium Kenyan Arabica": { en: "Fairview Estate", ar: "Fairview Estate" },
    "Fairview Estate — Kaldi City Roast": { en: "Fairview Estate", ar: "Fairview Estate" },
    "Java House — Kenya AA": { en: "Java House", ar: "Java House" },
    "Barista & Co. — Gourmet": { en: "Barista & Co.", ar: "Barista & Co." },
    "Chamomile": { en: "International Mill", ar: "International Mill" }
  };

  const methodsPages = {
    "CGLE Tres Dragones": "https://methods.coffee/products/cgle-tres-dragones",
    "Pink Bourbon Punch": "https://methods.coffee/products/pink-bourbon-punch",
    "Bourbon Sidra Sakura": "https://methods.coffee/products/bourbon-sidra-sakura",
    "EA Decaf De Cana": "https://methods.coffee/products/ea-decaf-de-cana"
  };

  /* Exact recipe recovered from the user's xBloom shared-recipe screenshot.
     Do not extrapolate this recipe to any other coffee. */
  const exactXbloom = {
    "Pink Bourbon Punch": {
      recipeName: "Colombian Punch",
      by: "Methods Roastery",
      sourceType: "xPod",
      ratio: "1:17",
      totalMl: 255,
      doseG: 15,
      grind: 65,
      rpm: 120,
      pours: [
        { name: "Bloom", ml: 50, tempC: 95, sec: 20 },
        { name: "Pour 2", ml: 70, tempC: 95, sec: 17 },
        { name: "Pour 3", ml: 70, tempC: 94, sec: 15 },
        { name: "Pour 4", ml: 65, tempC: 92, sec: 15 }
      ],
      recipePage: methodsPages["Pink Bourbon Punch"]
    }
  };

  const packageCodes = {
    "Sencha Sleepless Organic": "1596",
    "Moroccan Mint Organic": "949",
    "Japanese Cherry": "941",
    "Le Touareg Organic": "915",
    "Marani": "953",
    "Chinese Royal Jasmine Rolls": "934",
    "White Tea Lemon & Vanilla": "1041",
    "White Tea Jasmine Blossoms": "1038",
    "Gourmet Herbal Tea": "1235",
    "Mate Green Organic": "1195",
    "Ginger–Turmeric": "1244",
    "One for All": "1111",
    "Peach Melba": "1479",
    "Cherry Banana Flip": "1446",
    "Berry Heaven": "1659",
    "Strawberry–Moringa": "1453",
    "Passion Fruit": "1637",
    "Woodland Berries": "1493"
  };

  const currentCatalogueCodes = {
    "Chinese Royal Jasmine Rolls": "937",
    "Ginger–Turmeric": "1243"
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
  const ar = () => document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";
  const tr = (en, aa) => ar() ? aa : en;
  const slug = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[–—&]/g,"-").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

  function companyFor(p) {
    if (p.cat === "tea") return p.nameEn === "Chamomile" ? companyMap.Chamomile : { en: "Tea G Kuwait · TeaGschwendner", ar: "Tea G الكويت · TeaGschwendner" };
    if (p.cat === "arabic") return { en: "Zill", ar: "زِل" };
    if (p.cat === "sparkling") return { en: /Seleco/i.test(p.nameEn) ? "Seleco" : "MJ Beverage Bar", ar: /Seleco/i.test(p.nameEn) ? "Seleco" : "MJ Beverage Bar" };
    return companyMap[p.nameEn] || { en: p.subEn || "Producer", ar: p.subAr || "المنتج" };
  }

  function extraFor(p) {
    return EXTRA[p.nameEn] || EXTRA[aliases[p.nameEn]] || { facts: [] };
  }

  function sourceFor(p) {
    return SOURCES[p.nameEn] || null;
  }

  function teaKuwaitUrl(p) {
    const code = packageCodes[p.nameEn] || getProductCode(extraFor(p).facts || []);
    if (p.nameEn === "Berry Heaven") return `${TEAG_KW}/products/berry-heaven-no-1659`;
    const q = code ? `No.${code}` : p.nameEn;
    return `${TEAG_KW}/search?q=${encodeURIComponent(q)}`;
  }

  function officialProductUrl(p) {
    if (p.cat === "tea" && p.nameEn !== "Chamomile") return teaKuwaitUrl(p);
    if (methodsPages[p.nameEn]) return methodsPages[p.nameEn];
    const src = sourceFor(p)?.source;
    return /^https?:\/\//.test(src || "") ? src : "";
  }

  function recipeSourceUrl(p) {
    if (methodsPages[p.nameEn]) return methodsPages[p.nameEn];
    const src = sourceFor(p)?.source;
    return /^https?:\/\//.test(src || "") ? src : officialProductUrl(p);
  }

  function getProductCode(facts) {
    const f = facts.find(x => /product no\.?/i.test(String(x[0])) || String(x[2] || "").includes("رقم المنتج"));
    return f ? String(f[1]).replace(/^No\.?\s*/i, "").trim() : "";
  }

  function translatedFact(f) {
    return {
      keyEn: norm(f[0]),
      key: norm(ar() ? (f[2] || f[0]) : f[0]),
      value: norm(ar() ? (f[3] || f[1]) : f[1])
    };
  }

  function resolveProduct(modal) {
    const title = norm(modal.querySelector(".modalTitleRow h2, h2")?.textContent);
    if (!title) return null;
    return PRODUCTS.find(p => {
      const names = [p.nameEn, p.nameAr, p._displayBase?.en, p._displayBase?.ar].filter(Boolean).map(norm);
      return names.some(n => title === n || (n.length > 3 && (title.includes(n) || n.includes(title))));
    }) || null;
  }

  function injectStyles() {
    if (document.getElementById("v6Styles")) return;
    const style = document.createElement("style");
    style.id = "v6Styles";
    style.textContent = `
      .productModal .facts,.productModal .recipeCard,.productModal .modalNav{display:none!important}
      .v6Ingredients,.v6CompanyCard,.v6PrepHub,.v6Navigator{border:1px solid rgba(204,164,96,.26);background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.014));border-radius:20px}
      .v6Ingredients{margin:18px 0 0;padding:16px 18px}.v6Ingredients small,.v6Kicker{display:block;color:#cda968;letter-spacing:.13em;text-transform:uppercase;font-size:.72rem;margin-bottom:7px}.v6Ingredients p{margin:0;line-height:1.75;color:rgba(255,255,255,.86)}
      .v6CompanyCard{margin:18px 0 0;padding:19px;overflow:hidden}.v6CompanyHead{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:12px}.v6CompanyHead h3{margin:0;color:#f3eadb;font-size:1.25rem}.v6CompanyHead a{color:#d8b779;text-decoration:none;font-size:.82rem;white-space:nowrap}
      .v6InfoTable{width:100%;border-collapse:collapse}.v6InfoTable td{padding:12px 8px;text-align:start;vertical-align:top;border-top:1px solid rgba(255,255,255,.075)}.v6InfoTable tr:first-child td{border-top:0}.v6InfoTable td:first-child{width:37%;color:rgba(255,255,255,.52);font-size:.82rem}.v6InfoTable td:last-child{color:#f5ede1;font-weight:600;line-height:1.55}
      .v6PrepHub{margin:20px 0 0;overflow:hidden}.v6PrepHubHead{padding:19px 19px 0}.v6PrepHubHead h3{margin:0 0 5px;font-size:1.3rem;color:#f5eddf}.v6PrepHubHead p{margin:0;color:rgba(255,255,255,.57);font-size:.83rem;line-height:1.55}
      .v6Tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:15px 18px;border-bottom:1px solid rgba(255,255,255,.07)}.v6Tab{appearance:none;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);color:rgba(255,255,255,.6);border-radius:12px;padding:11px 7px;font:inherit;font-size:.83rem}.v6Tab.active{border-color:rgba(209,171,104,.55);background:rgba(209,171,104,.11);color:#efd7aa}.v6Pane{padding:18px}.v6Pane[hidden]{display:none!important}
      .v6OfficialMeta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:13px}.v6Metric{border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);border-radius:13px;padding:11px}.v6Metric small{display:block;color:rgba(255,255,255,.5);font-size:.7rem;margin-bottom:4px}.v6Metric b{color:#f5eddf;font-size:.92rem}
      .v6PrepTable,.v6XTable{width:100%;border-collapse:collapse}.v6PrepTable th,.v6PrepTable td,.v6XTable th,.v6XTable td{padding:10px 7px;text-align:start;border-top:1px solid rgba(255,255,255,.07)}.v6PrepTable thead th,.v6XTable thead th{border-top:0;color:rgba(255,255,255,.48);font-size:.72rem;font-weight:600;background:rgba(255,255,255,.02)}.v6PrepTable td,.v6XTable td{color:#f3eadc;font-weight:600;font-size:.87rem}.v6PrepTable td:first-child,.v6XTable td:first-child{color:#d8b779}.v6OneL{background:rgba(209,171,104,.075)}
      .v6Note{margin:13px 0 0;color:rgba(255,255,255,.58);font-size:.8rem;line-height:1.65}.v6Actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.v6Action{appearance:none;border:1px solid rgba(209,171,104,.38);background:rgba(209,171,104,.095);color:#e7c98e;text-decoration:none;border-radius:12px;padding:11px 13px;font:inherit;font-size:.82rem}.v6Action.primary{background:#d0aa68;color:#17120b;border-color:#d0aa68;font-weight:700}.v6Action.secondary{border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.035);color:#eee6da}
      .v6XHead{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:13px}.v6XHead .v6Metric{min-width:0}.v6RecipeTitle{margin:0 0 12px;color:#f3eadc;font-size:1.05rem}.v6RecipeBadge{display:inline-flex;padding:5px 9px;border-radius:999px;background:rgba(209,171,104,.12);color:#dcb976;font-size:.72rem;margin-inline-start:7px}
      .v6Empty{padding:14px;border:1px dashed rgba(255,255,255,.13);border-radius:14px;color:rgba(255,255,255,.62);line-height:1.7;font-size:.86rem}
      .v6CustomGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v6Field{display:flex;flex-direction:column;gap:5px}.v6Field span{font-size:.72rem;color:rgba(255,255,255,.5)}.v6Field input,.v6Field select{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.11);background:#0d0c09;color:#f4eddf;border-radius:11px;padding:11px;font:inherit}.v6CustomPours{margin-top:12px}.v6PourRow{display:grid;grid-template-columns:1.25fr repeat(3,.8fr);gap:6px;margin-top:6px}.v6PourRow input{min-width:0;border:1px solid rgba(255,255,255,.1);background:#0d0c09;color:#f4eddf;border-radius:9px;padding:9px;font:inherit;font-size:.8rem}.v6SaveState{margin-top:8px;color:#b8a889;font-size:.75rem;min-height:1.1em}
      .v6Navigator{margin:20px 0 0;padding:15px}.v6NavTitle{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px}.v6NavTitle b{color:#f1e8db}.v6NavTitle small{color:rgba(255,255,255,.45)}.v6ProductRail{display:flex;overflow-x:auto;gap:7px;padding-bottom:4px;scrollbar-width:none}.v6ProductRail::-webkit-scrollbar{display:none}.v6ProductChip{flex:0 0 auto;appearance:none;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.025);color:rgba(255,255,255,.65);border-radius:999px;padding:9px 12px;font:inherit;font-size:.78rem;max-width:210px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v6ProductChip.active{background:rgba(209,171,104,.13);border-color:rgba(209,171,104,.5);color:#ebce98}.v6PrevNext{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}.v6Move{appearance:none;text-align:start;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);border-radius:13px;padding:11px;color:#eee6d9;font:inherit}.v6Move small{display:block;color:rgba(255,255,255,.42);font-size:.68rem;margin-bottom:3px}.v6Move b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.8rem}
      @media(max-width:640px){.v6CompanyCard,.v6Pane,.v6PrepHubHead{padding:15px}.v6Tabs{padding:12px 14px}.v6OfficialMeta,.v6XHead{grid-template-columns:1fr}.v6CustomGrid{grid-template-columns:1fr 1fr}.v6PourRow{grid-template-columns:1.2fr repeat(3,.72fr)}.v6CompanyHead{align-items:flex-start;flex-direction:column}.v6InfoTable td{padding:11px 6px}.v6InfoTable td:first-child{width:39%}.v6PrepTable,.v6XTable{font-size:.8rem}.v6PrepTable th,.v6PrepTable td,.v6XTable th,.v6XTable td{padding:9px 5px}}
    `;
    document.head.appendChild(style);
  }

  function ingredientsBlock(facts) {
    const f = facts.find(x => /ingredients/i.test(String(x[0])) || String(x[2] || "").includes("المكونات"));
    if (!f) return null;
    const tf = translatedFact(f);
    const el = document.createElement("section");
    el.className = "v6Ingredients";
    el.innerHTML = `<small>${esc(tr("Ingredients","المكونات"))}</small><p>${esc(tf.value)}</p>`;
    return el;
  }

  function companyCard(p, facts) {
    const company = companyFor(p);
    const rows = [];
    const seen = new Set();
    const push = (id, keyEn, keyAr, valueEn, valueAr = valueEn) => {
      if (!valueEn || seen.has(id)) return;
      seen.add(id);
      rows.push([tr(keyEn,keyAr), ar() ? valueAr : valueEn]);
    };
    const code = packageCodes[p.nameEn] || getProductCode(facts);
    if (code) push("code","Product No.","رقم المنتج",`No. ${code}`);
    const current = currentCatalogueCodes[p.nameEn];
    if (current && current !== code) push("current-code","Current catalogue No.","رقم الكتالوج الحالي",`No. ${current}`);
    if (p.cat === "tea") push("tea-type","Tea type","نوع الشاي",p.subEn,p.subAr);

    facts.forEach(f => {
      const tf = translatedFact(f);
      if (/ingredients/i.test(tf.keyEn) || /product no\.?/i.test(tf.keyEn)) return;
      const id = tf.keyEn.toLowerCase();
      push(id, f[0], f[2] || f[0], f[1], f[3] || f[1]);
    });

    const url = officialProductUrl(p);
    const el = document.createElement("section");
    el.className = "v6CompanyCard";
    el.innerHTML = `<div class="v6CompanyHead"><div><span class="v6Kicker">${esc(tr("Producer / official source","المنتج / المصدر الرسمي"))}</span><h3>${esc(tr(company.en,company.ar))}</h3></div>${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(p.cat === "tea" ? tr("Kuwait official site ↗","الموقع الكويتي الرسمي ↗") : tr("Official page ↗","الصفحة الرسمية ↗"))}</a>` : ""}</div><table class="v6InfoTable"><tbody>${rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</tbody></table>`;
    return el;
  }

  function doseFromGpl(gpl, ml) {
    const n = Number(gpl) * Number(ml) / 1000;
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
  }

  function officialPane(p, source) {
    const b = source?.brew;
    if (p.cat === "tea" && b) {
      const sizes = [1000,360,240,120];
      return `<div class="v6OfficialMeta"><div class="v6Metric"><small>${esc(tr("Official ratio","المعيار الرسمي"))}</small><b>${esc(b.gpl)} g / 1 L</b></div><div class="v6Metric"><small>${esc(tr("Temperature","الحرارة"))}</small><b>${esc(b.temp)}°C</b></div><div class="v6Metric"><small>${esc(tr("Steeping time","مدة النقع"))}</small><b>${esc(b.time)}</b></div></div><table class="v6PrepTable"><thead><tr><th>${esc(tr("Volume","الحجم"))}</th><th>${esc(tr("Tea","كمية الشاي"))}</th><th>${esc(tr("Temp.","الحرارة"))}</th><th>${esc(tr("Steep","النقع"))}</th></tr></thead><tbody>${sizes.map(v=>`<tr class="${v===1000?'v6OneL':''}"><td>${v===1000?'1 L':`${v} ml`}</td><td>${doseFromGpl(b.gpl,v)} g</td><td>${esc(b.temp)}°C</td><td>${esc(b.time)}</td></tr>`).join("")}</tbody></table><p class="v6Note">${esc(tr("1 L is the manufacturer reference. The smaller volumes are direct proportional dose conversions only; they are not being presented as xBloom steep counts.","1 لتر هو مرجع الشركة الأساسي. الأحجام الأصغر تحويل مباشر للجرعة فقط، وليست عدد مراحل xBloom."))}</p>${recipeSourceUrl(p)?`<div class="v6Actions"><a class="v6Action secondary" href="${esc(p.cat==='tea'?teaKuwaitUrl(p):recipeSourceUrl(p))}" target="_blank" rel="noopener">${esc(tr("Official preparation source ↗","مصدر التحضير الرسمي ↗"))}</a></div>`:""}`;
    }

    const exact = exactXbloom[p.nameEn];
    if (exact) {
      return `<div class="v6Empty"><b>${esc(tr("Roaster official xBloom recipe","وصفة xBloom الرسمية من المحمصة"))}</b><br>${esc(tr("The exact machine settings are shown in the xBloom tab so the company preparation and the machine recipe stay separate.","الإعدادات الحرفية موجودة في تبويب xBloom حتى تبقى طريقة المحمصة وإعدادات الجهاز منفصلتين بوضوح."))}</div>`;
    }

    const rurl = recipeSourceUrl(p);
    if (p.cat === "specialty" && rurl) {
      return `<div class="v6Empty">${esc(tr("This roaster publishes an xBloom recipe for the product. V6 links to the roaster recipe rather than inventing settings that have not been recovered verbatim in the collection yet.","المحمصة تنشر وصفة xBloom لهذا المنتج. V6 يربط إلى وصفة المحمصة بدل اختراع أرقام لم تُسترجع حرفيًا بعد داخل المجموعة."))}</div><div class="v6Actions"><a class="v6Action primary" href="${esc(rurl)}" target="_blank" rel="noopener">${esc(tr("Open roaster recipe ↗","فتح وصفة المحمصة ↗"))}</a></div>`;
    }

    return `<div class="v6Empty">${esc(tr("No separate manufacturer preparation numbers are documented for this item in the collection.","لا توجد أرقام تحضير مستقلة موثقة من الشركة لهذا المنتج داخل المجموعة."))}</div>`;
  }

  function exactCoffeeRecipeMarkup(r) {
    return `<h4 class="v6RecipeTitle">${esc(r.recipeName)} <span class="v6RecipeBadge">${esc(tr("Exact shared recipe","وصفة مشاركة حرفية"))}</span></h4><div class="v6XHead"><div class="v6Metric"><small>${esc(tr("Dose","الجرعة"))}</small><b>${r.doseG} g</b></div><div class="v6Metric"><small>${esc(tr("Water / ratio","الماء / النسبة"))}</small><b>${r.totalMl} ml · ${esc(r.ratio)}</b></div><div class="v6Metric"><small>${esc(tr("Grind / RPM","الطحنة / RPM"))}</small><b>${r.grind} · ${r.rpm} RPM</b></div></div><table class="v6XTable"><thead><tr><th>${esc(tr("Stage","المرحلة"))}</th><th>ml</th><th>°C</th><th>${esc(tr("Time","الوقت"))}</th></tr></thead><tbody>${r.pours.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.ml}</td><td>${x.tempC}°C</td><td>${x.sec}s</td></tr>`).join("")}</tbody></table><p class="v6Note">${esc(tr(`Shared by ${r.by}. Values are reproduced without scaling or automatic recalculation.`,`مشاركة من ${r.by}. القيم معروضة حرفيًا بدون تكبير أو إعادة حساب تلقائية.`))}</p><div class="v6Actions"><a class="v6Action primary" href="${esc(r.recipePage)}" target="_blank" rel="noopener">${esc(tr("Send / open roaster xBloom recipe ↗","إرسال / فتح وصفة المحمصة في xBloom ↗"))}</a><a class="v6Action secondary" href="${XBLOOM_APP}" target="_blank" rel="noopener">${esc(tr("Open xBloom app ↗","فتح تطبيق xBloom ↗"))}</a></div>`;
  }

  function teaMachineMarkup(p, source) {
    const b = source?.brew;
    if (!b) return `<div class="v6Empty">${esc(tr("No verified xBloom machine values are stored for this tea yet.","لا توجد قيم xBloom موثقة محفوظة لهذا الشاي حتى الآن."))}</div>`;
    const dose120 = doseFromGpl(b.gpl,120);
    return `<h4 class="v6RecipeTitle">${esc(tr("xBloom Omni reference","مرجع xBloom Omni"))}</h4><div class="v6XHead"><div class="v6Metric"><small>${esc(tr("Tea amount · 120 ml","كمية الشاي · 120 مل"))}</small><b>${dose120} g</b></div><div class="v6Metric"><small>${esc(tr("Temperature","الحرارة"))}</small><b>${esc(b.temp)}°C</b></div><div class="v6Metric"><small>${esc(tr("Company steep","نقع الشركة"))}</small><b>${esc(b.time)}</b></div></div><p class="v6Note">${esc(tr("xBloom states that one Omni steep is about 120 ml. Only the values directly supported by the product preparation reference are prefilled here. Siphon refill and pour pattern are left to the selected xBloom recipe or your Custom profile rather than guessed.","توضح xBloom أن النقعة الواحدة في Omni تقارب 120 مل. تم تعبئة القيم المدعومة مباشرة من مرجع المنتج فقط؛ أما Siphon refill وPour pattern فتُترك لوصفة xBloom المختارة أو لوصفة Custom بدل التخمين."))}</p><div class="v6Actions"><a class="v6Action primary" href="${XBLOOM_APP}" target="_blank" rel="noopener">${esc(tr("Open xBloom tea recipes ↗","فتح وصفات الشاي في xBloom ↗"))}</a></div>`;
  }

  function xbloomPane(p, source) {
    const exact = exactXbloom[p.nameEn];
    if (exact) return exactCoffeeRecipeMarkup(exact);
    if (p.cat === "tea") return teaMachineMarkup(p, source);
    if (p.cat === "specialty") {
      const rurl = recipeSourceUrl(p);
      return `<div class="v6Empty"><b>${esc(tr("Roaster xBloom recipe available","وصفة xBloom من المحمصة متوفرة"))}</b><br>${esc(tr("Open the roaster recipe below to use its xBloom send/import command. Exact values are not duplicated here until their shared recipe has been recovered verbatim.","افتح وصفة المحمصة أدناه واستخدم أمر الإرسال/الاستيراد إلى xBloom. لن نكرر أرقامًا هنا قبل استرجاع وصفة المشاركة حرفيًا."))}</div><div class="v6Actions">${rurl?`<a class="v6Action primary" href="${esc(rurl)}" target="_blank" rel="noopener">${esc(tr("Send / open xBloom recipe ↗","إرسال / فتح وصفة xBloom ↗"))}</a>`:""}<a class="v6Action secondary" href="${XBLOOM_APP}" target="_blank" rel="noopener">${esc(tr("Open xBloom app ↗","فتح تطبيق xBloom ↗"))}</a></div>`;
    }
    return `<div class="v6Empty">${esc(tr("This product is not prepared on xBloom in the current collection workflow.","هذا المنتج لا يُحضّر على xBloom ضمن آلية المجموعة الحالية."))}</div>`;
  }

  function customKey(p) { return `mj-v6-custom:${p.nameEn}`; }

  function defaultCustom(p, source) {
    if (p.cat === "tea") {
      const b = source?.brew;
      return { kind:"tea", dose:b?doseFromGpl(b.gpl,120):"", volume:120, temp:b?.temp||90, steep:b?.time||"", siphon:"Auto", pattern:"Centered" };
    }
    const exact = exactXbloom[p.nameEn];
    return exact ? { kind:"coffee", dose:exact.doseG, volume:exact.totalMl, grind:exact.grind, rpm:exact.rpm, pours:exact.pours.map(x=>({...x})) } : { kind:"coffee", dose:"", volume:240, grind:"", rpm:"", pours:[{name:"Bloom",ml:"",tempC:"",sec:""},{name:"Pour 2",ml:"",tempC:"",sec:""},{name:"Pour 3",ml:"",tempC:"",sec:""},{name:"Pour 4",ml:"",tempC:"",sec:""}] };
  }

  function loadCustom(p, source) {
    try { const x = JSON.parse(localStorage.getItem(customKey(p))); return x || defaultCustom(p,source); } catch(e) { return defaultCustom(p,source); }
  }

  function customPane(p, source) {
    const c = loadCustom(p,source);
    if (p.cat !== "tea" && p.cat !== "specialty") return `<div class="v6Empty">${esc(tr("Custom xBloom profiles apply to tea and specialty coffee.","وصفات xBloom المخصصة مخصصة للشاي والقهوة المختصة."))}</div>`;
    if (p.cat === "tea") {
      return `<div class="v6CustomGrid"><label class="v6Field"><span>${esc(tr("Tea amount (g)","كمية الشاي (g)"))}</span><input data-v6-field="dose" inputmode="decimal" value="${esc(c.dose)}"></label><label class="v6Field"><span>${esc(tr("Volume (ml)","الحجم (ml)"))}</span><input data-v6-field="volume" type="number" inputmode="numeric" value="${esc(c.volume)}"></label><label class="v6Field"><span>${esc(tr("Temperature °C","الحرارة °C"))}</span><input data-v6-field="temp" type="number" value="${esc(c.temp)}"></label><label class="v6Field"><span>${esc(tr("Steeping time","مدة النقع"))}</span><input data-v6-field="steep" value="${esc(c.steep)}"></label><label class="v6Field"><span>Siphon water refill</span><select data-v6-field="siphon"><option ${c.siphon==='Auto'?'selected':''}>Auto</option><option ${c.siphon==='On'?'selected':''}>On</option><option ${c.siphon==='Off'?'selected':''}>Off</option></select></label><label class="v6Field"><span>Pour pattern</span><select data-v6-field="pattern"><option ${c.pattern==='Centered'?'selected':''}>Centered</option><option ${c.pattern==='Circular'?'selected':''}>Circular</option></select></label></div><div class="v6Actions"><button class="v6Action primary" type="button" data-v6-save>${esc(tr("Save Custom","حفظ Custom"))}</button><button class="v6Action secondary" type="button" data-v6-copy>${esc(tr("Copy recipe","نسخ الوصفة"))}</button><button class="v6Action secondary" type="button" data-v6-send>${esc(tr("Send / open in xBloom","إرسال / فتح في xBloom"))}</button></div><div class="v6SaveState" data-v6-state></div>`;
    }
    const pours = (c.pours || []).map((x,i)=>`<div class="v6PourRow" data-v6-pour="${i}"><input data-k="name" value="${esc(x.name||`Pour ${i+1}`)}" aria-label="stage"><input data-k="ml" inputmode="decimal" value="${esc(x.ml)}" placeholder="ml"><input data-k="tempC" inputmode="decimal" value="${esc(x.tempC)}" placeholder="°C"><input data-k="sec" inputmode="decimal" value="${esc(x.sec)}" placeholder="sec"></div>`).join("");
    return `<div class="v6CustomGrid"><label class="v6Field"><span>${esc(tr("Dose (g)","الجرعة (g)"))}</span><input data-v6-field="dose" inputmode="decimal" value="${esc(c.dose)}"></label><label class="v6Field"><span>${esc(tr("Water (ml)","الماء (ml)"))}</span><input data-v6-field="volume" type="number" inputmode="numeric" value="${esc(c.volume)}"></label><label class="v6Field"><span>${esc(tr("Grind size","حجم الطحن"))}</span><input data-v6-field="grind" inputmode="numeric" value="${esc(c.grind)}"></label><label class="v6Field"><span>RPM</span><input data-v6-field="rpm" inputmode="numeric" value="${esc(c.rpm)}"></label></div><div class="v6CustomPours"><span class="v6Kicker">${esc(tr("Pours · stage / ml / °C / sec","الصبات · المرحلة / ml / °C / sec"))}</span>${pours}</div><div class="v6Actions"><button class="v6Action primary" type="button" data-v6-save>${esc(tr("Save Custom","حفظ Custom"))}</button><button class="v6Action secondary" type="button" data-v6-copy>${esc(tr("Copy recipe","نسخ الوصفة"))}</button><button class="v6Action secondary" type="button" data-v6-send>${esc(tr("Send / open in xBloom","إرسال / فتح في xBloom"))}</button></div><div class="v6SaveState" data-v6-state></div>`;
  }

  function prepHub(p, source) {
    const el = document.createElement("section");
    el.className = "v6PrepHub";
    el.innerHTML = `<div class="v6PrepHubHead"><span class="v6Kicker">MJ · ${esc(tr("Preparation hub","مركز التحضير"))}</span><h3>${esc(tr("Official method + xBloom","الطريقة الرسمية + xBloom"))}</h3><p>${esc(tr("Manufacturer reference stays separate from the machine recipe. Custom is yours and is saved on this device.","مرجع الشركة منفصل عن وصفة الجهاز. Custom خاص بك ويُحفظ على هذا الجهاز."))}</p></div><div class="v6Tabs"><button class="v6Tab active" type="button" data-v6-tab="official">${esc(tr("Official","التحضير الرسمي"))}</button><button class="v6Tab" type="button" data-v6-tab="xbloom">xBloom</button><button class="v6Tab" type="button" data-v6-tab="custom">Custom</button></div><div class="v6Pane" data-v6-pane="official">${officialPane(p,source)}</div><div class="v6Pane" data-v6-pane="xbloom" hidden>${xbloomPane(p,source)}</div><div class="v6Pane" data-v6-pane="custom" hidden>${customPane(p,source)}</div>`;
    return el;
  }

  function sameGroup(p) {
    let list = PRODUCTS.filter(x => x.cat === p.cat && x.subEn === p.subEn);
    if (list.length < 2) list = PRODUCTS.filter(x => x.cat === p.cat);
    return list;
  }

  function openTarget(target) {
    const id = target._id || slug(target.nameEn);
    const tile = document.querySelector(`.productTile[data-product="${CSS.escape(id)}"]`);
    if (!tile) return;
    const close = document.querySelector(".productModal .modalClose");
    if (close) close.click();
    setTimeout(()=>tile.click(),90);
  }

  function navigator(p) {
    const list = sameGroup(p);
    if (list.length < 2) return null;
    const idx = Math.max(0,list.indexOf(p));
    const prev = list[(idx-1+list.length)%list.length], next = list[(idx+1)%list.length];
    const el = document.createElement("section");
    el.className = "v6Navigator";
    el.innerHTML = `<div class="v6NavTitle"><b>${esc(tr("Same collection","نفس المجموعة"))}</b><small>${idx+1} / ${list.length}</small></div><div class="v6ProductRail">${list.map((x,i)=>`<button class="v6ProductChip ${i===idx?'active':''}" type="button" data-v6-target="${esc(x.nameEn)}">${esc(ar()?x.nameAr:x.nameEn)}</button>`).join("")}</div><div class="v6PrevNext"><button class="v6Move" type="button" data-v6-target="${esc(prev.nameEn)}"><small>${esc(tr("Previous","السابق"))}</small><b>← ${esc(ar()?prev.nameAr:prev.nameEn)}</b></button><button class="v6Move" type="button" data-v6-target="${esc(next.nameEn)}"><small>${esc(tr("Next","التالي"))}</small><b>${esc(ar()?next.nameAr:next.nameEn)} →</b></button></div>`;
    el.querySelectorAll("[data-v6-target]").forEach(b=>b.addEventListener("click",()=>{const t=PRODUCTS.find(x=>x.nameEn===b.dataset.v6Target);if(t)openTarget(t);}));
    return el;
  }

  function collectCustom(p, hub) {
    if (p.cat === "tea") return {kind:"tea",dose:hub.querySelector('[data-v6-field="dose"]')?.value||"",volume:Number(hub.querySelector('[data-v6-field="volume"]')?.value||0),temp:Number(hub.querySelector('[data-v6-field="temp"]')?.value||0),steep:hub.querySelector('[data-v6-field="steep"]')?.value||"",siphon:hub.querySelector('[data-v6-field="siphon"]')?.value||"Auto",pattern:hub.querySelector('[data-v6-field="pattern"]')?.value||"Centered"};
    return {kind:"coffee",dose:hub.querySelector('[data-v6-field="dose"]')?.value||"",volume:Number(hub.querySelector('[data-v6-field="volume"]')?.value||0),grind:hub.querySelector('[data-v6-field="grind"]')?.value||"",rpm:hub.querySelector('[data-v6-field="rpm"]')?.value||"",pours:[...hub.querySelectorAll('[data-v6-pour]')].map(r=>({name:r.querySelector('[data-k="name"]')?.value||"",ml:r.querySelector('[data-k="ml"]')?.value||"",tempC:r.querySelector('[data-k="tempC"]')?.value||"",sec:r.querySelector('[data-k="sec"]')?.value||""}))};
  }

  function customText(p, data) {
    if (data.kind === "tea") return `${p.nameEn} — Custom xBloom\nTea: ${data.dose} g\nVolume: ${data.volume} ml\nTemperature: ${data.temp}°C\nSteeping: ${data.steep}\nSiphon water refill: ${data.siphon}\nPour pattern: ${data.pattern}`;
    return `${p.nameEn} — Custom xBloom\nDose: ${data.dose} g\nWater: ${data.volume} ml\nGrind: ${data.grind}\nRPM: ${data.rpm}\n${data.pours.map((x,i)=>`${x.name||`Pour ${i+1}`}: ${x.ml} ml · ${x.tempC}°C · ${x.sec}s`).join("\n")}`;
  }

  function bindHub(hub,p) {
    hub.querySelectorAll("[data-v6-tab]").forEach(btn=>btn.addEventListener("click",()=>{
      const tab=btn.dataset.v6Tab;
      hub.querySelectorAll("[data-v6-tab]").forEach(x=>x.classList.toggle("active",x===btn));
      hub.querySelectorAll("[data-v6-pane]").forEach(x=>x.hidden=x.dataset.v6Pane!==tab);
    }));
    const state=()=>hub.querySelector("[data-v6-state]");
    hub.querySelector("[data-v6-save]")?.addEventListener("click",()=>{const d=collectCustom(p,hub);localStorage.setItem(customKey(p),JSON.stringify(d));if(state())state().textContent=tr("Saved on this device.","تم الحفظ على هذا الجهاز.");});
    hub.querySelector("[data-v6-copy]")?.addEventListener("click",async()=>{const d=collectCustom(p,hub);const txt=customText(p,d);try{await navigator.clipboard.writeText(txt);if(state())state().textContent=tr("Recipe copied.","تم نسخ الوصفة.");}catch(e){if(state())state().textContent=txt;}});
    hub.querySelector("[data-v6-send]")?.addEventListener("click",async()=>{const d=collectCustom(p,hub);try{await navigator.clipboard.writeText(customText(p,d));}catch(e){};window.open(XBLOOM_APP,"_blank","noopener");if(state())state().textContent=tr("Custom settings copied; xBloom opened so you can save/import and Start from the app.","تم نسخ إعدادات Custom وفتح xBloom لحفظ/إدخال الوصفة ثم Start من التطبيق.");});
  }

  function bindSwipe(modal,p) {
    if (modal.dataset.v6Swipe) return;
    modal.dataset.v6Swipe="1";
    let x0=null,y0=null;
    modal.addEventListener("touchstart",e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY;},{passive:true});
    modal.addEventListener("touchend",e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=y0=null;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.25)return;const list=sameGroup(p),idx=list.indexOf(p);if(idx<0)return;const target=dx<0?list[(idx+1)%list.length]:list[(idx-1+list.length)%list.length];openTarget(target);},{passive:true});
  }

  function hideLegacyXbloom(modal) {
    modal.querySelectorAll('[class*="xbo"]').forEach(el=>{if(!el.closest('.v6PrepHub')){const top=el.closest('[class*="xbo"]');if(top) top.style.display='none';}});
  }

  function enhance() {
    injectStyles();
    const modal=document.querySelector(".productModal");
    if(!modal)return;
    const p=resolveProduct(modal);if(!p)return;
    const sig=`${p.nameEn}|${ar()?'ar':'en'}`;
    if(modal.dataset.v6===sig)return;
    modal.dataset.v6=sig;
    modal.querySelectorAll('.v6Ingredients,.v6CompanyCard,.v6PrepHub,.v6Navigator').forEach(x=>x.remove());
    hideLegacyXbloom(modal);
    const facts=extraFor(p).facts||[],source=sourceFor(p),story=modal.querySelector('.modalContent .story'),experience=modal.querySelector('.modalContent .experience');
    if(!story)return;
    const ing=ingredientsBlock(facts);if(ing)story.insertAdjacentElement('afterend',ing);
    const company=companyCard(p,facts);(ing||story).insertAdjacentElement('afterend',company);
    const hub=prepHub(p,source);if(experience)experience.insertAdjacentElement('afterend',hub);else company.insertAdjacentElement('afterend',hub);bindHub(hub,p);
    const nav=navigator(p);if(nav)hub.insertAdjacentElement('afterend',nav);
    bindSwipe(modal,p);
  }

  const obs=new MutationObserver(()=>queueMicrotask(enhance));
  obs.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',()=>queueMicrotask(enhance),true);
  window.addEventListener('hashchange',()=>queueMicrotask(enhance));
  enhance();
})();
