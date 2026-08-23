(() => {
  const M = window.MJ_MENU;
  if (!M?.products) return;

  const COFFEE_STANDARD = "SCA / WCR sensory taxonomy";
  const TEA_STANDARD = "Official producer notes · ISO 3103 reference";
  const NO_DECLARED_NOTES = new Set(["Java House — Kenya AA", "Barista & Co. — Gourmet"]);

  const COLORS = ["#d8bb83", "#b9955c", "#8d6f45", "#d5c39d", "#79614a", "#a88462", "#665746", "#caa876"];
  const CATEGORIES = {
    coffee: {
      floral: ["Floral", "زهري"], fruity: ["Fruity", "فاكهي"], sweet: ["Sweet", "حلو"],
      nutty: ["Nutty / Cocoa", "مكسرات / كاكاو"], spices: ["Spices", "بهارات"], roasted: ["Roasted", "محمص"],
      fermented: ["Sour / Fermented", "حامضي / متخمر"], green: ["Green / Vegetative", "أخضر / نباتي"],
      mouthfeel: ["Texture / Mouthfeel", "القوام / الملمس"], finish: ["Finish", "النهاية"], aroma: ["Aroma", "العطر"], other: ["Other", "أخرى"]
    },
    tea: {
      floral: ["Floral", "زهري"], fruity: ["Fruity", "فاكهي"], citrus: ["Citrus", "حمضيات"], sweet: ["Sweet", "حلو"],
      herbal: ["Herbal", "عشبي"], fresh: ["Fresh / Mint", "منعش / نعناع"], spices: ["Spiced", "بهاري"],
      green: ["Green / Vegetal", "أخضر / نباتي"], roasted: ["Roasted / Nutty", "محمص / جوزي"], mouthfeel: ["Texture / Mouthfeel", "القوام / الملمس"],
      finish: ["Finish", "النهاية"], aroma: ["Aroma", "العطر"], other: ["Other", "أخرى"]
    }
  };

  const RULES = {
    coffee: [
      ["floral", /floral|jasmine|rose|blossom|flower/i],
      ["fruity", /fruit|fruity|berry|blueberry|blackcurrant|currant|grape|plum|cherry|apple|peach|tropical|pineapple|citrus|lemon|orange|lime/i],
      ["sweet", /sweet|caramel|vanilla|honey|sugar|molasses|toffee/i],
      ["nutty", /cocoa|chocolate|nut|almond|hazelnut|peanut/i],
      ["spices", /spice|spicy|cinnamon|clove|cardamom|pepper/i],
      ["roasted", /roast|roasted|smoky|tobacco|malt/i],
      ["fermented", /ferment|wine|winey|acetic|sour/i],
      ["green", /green|vegetal|vegetative|herbal|peapod/i],
      ["mouthfeel", /creamy|cream|silky|body|bodied|smooth|dense|round|texture/i],
      ["finish", /finish|aftertaste|clean finish/i],
      ["aroma", /aroma|aromatic/i]
    ],
    tea: [
      ["floral", /floral|jasmine|rose|blossom|flower|lavender/i],
      ["citrus", /citrus|lemon|orange|lime|bergamot/i],
      ["fruity", /fruit|fruity|berry|strawberry|raspberry|blackcurrant|cherry|peach|apple|banana|passion|grape|pineapple|mango/i],
      ["fresh", /fresh|mint|menthol|cooling/i],
      ["herbal", /herbal|chamomile|moringa|lemongrass|rooibos|mate/i],
      ["sweet", /sweet|vanilla|caramel|honey|sugar|cream/i],
      ["spices", /spice|spiced|ginger|turmeric|cinnamon|clove|cardamom|pepper/i],
      ["green", /green tea|green|vegetal|grassy|grass/i],
      ["roasted", /roast|roasted|nut|nutty|toasted/i],
      ["mouthfeel", /smooth|creamy|silky|body|bodied|soft|delicate|texture/i],
      ["finish", /finish|aftertaste|clean/i],
      ["aroma", /aroma|aromatic/i]
    ]
  };

  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = (s = "") => String(s).toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  const ar = () => document.documentElement.lang === "ar";
  const tr = (en, arabic) => ar() ? arabic : en;

  function splitProfile(s) {
    return String(s || "").split(/\s*[·•|;]\s*|\s*,\s*/).map(x => x.trim()).filter(Boolean);
  }

  function identifyProduct(modal) {
    const title = norm(modal.querySelector(".modalTitleRow h2, h2")?.textContent || "");
    if (!title) return null;
    return M.products.find(p => {
      const candidates = [p.nameEn, p.nameAr, p._displayBase?.en, p._displayBase?.ar,
        p._maker?.en && `${p._displayBase?.en || p.nameEn} - ${p._maker.en}`,
        p._maker?.ar && `${p._displayBase?.ar || p.nameAr} - ${p._maker.ar}`].filter(Boolean).map(norm);
      return candidates.some(c => c.length >= 3 && (title === c || title.includes(c) || c.includes(title)));
    }) || null;
  }

  function classify(note, kind) {
    for (const [key, re] of RULES[kind]) if (re.test(note)) return key;
    return "other";
  }

  function profileData(product) {
    const kind = product.cat === "specialty" ? "coffee" : product.cat === "tea" ? "tea" : null;
    if (!kind) return null;
    if (NO_DECLARED_NOTES.has(product.nameEn)) return { kind, pending: true, notesEn: [], notesAr: [], families: [] };
    const notesEn = splitProfile(product.profileEn);
    const notesAr = splitProfile(product.profileAr);
    const usable = notesEn.filter(n => n.length > 1 && !/^medium roast$|^hand roasted$|^beans?$|^whole beans?$|^decaf$/i.test(n));
    if (!usable.length) return { kind, pending: true, notesEn: [], notesAr: [], families: [] };

    const counts = new Map();
    usable.forEach(note => {
      const k = classify(note, kind);
      counts.set(k, (counts.get(k) || 0) + 1);
    });
    const total = usable.length;
    const families = [...counts.entries()]
      .map(([key, count], i) => ({ key, count, pct: Math.round(count * 100 / total), color: COLORS[i % COLORS.length] }))
      .sort((a,b) => b.count - a.count || a.key.localeCompare(b.key));

    const declaredText = `${product.profileEn || ""} ${product.descEn || ""}`;
    const explicit = [];
    const attributes = [
      [/acidity|acidic/i, ["Acidity", "الحموضة"]],
      [/body|bodied|texture|mouthfeel|creamy|silky|dense/i, ["Body / Mouthfeel", "القوام / الملمس"]],
      [/finish|aftertaste/i, ["Finish", "النهاية"]],
      [/aroma|aromatic/i, ["Aroma", "العطر"]],
      [/sweet|sweetness|caramel|honey|sugar/i, ["Sweetness", "الحلاوة"]]
    ];
    attributes.forEach(([re, label]) => { if (re.test(declaredText)) explicit.push(label); });
    return { kind, pending: false, notesEn: usable, notesAr, families, explicit };
  }

  function conic(families) {
    let start = 0;
    const stops = families.map(f => {
      const end = start + f.pct;
      const s = `${f.color} ${start}% ${end}%`;
      start = end;
      return s;
    });
    if (start < 100) stops.push(`#2a251f ${start}% 100%`);
    return `conic-gradient(from -28deg, ${stops.join(",")})`;
  }

  function familyLabel(kind, key) {
    const pair = CATEGORIES[kind][key] || CATEGORIES[kind].other;
    return tr(pair[0], pair[1]);
  }

  function pendingMarkup(product, kind) {
    return `<section class="v4Sensory" data-v4-sensory>
      <div class="v4SensoryHead"><div><div class="v4SensoryEyebrow">V4 · ${esc(tr("Sensory profile", "الملف الحسي"))}</div><h3>${esc(tr("Official sensory notes", "الإيحاءات الحسية الرسمية"))}</h3><p>${esc(tr("Placed directly below the product description.", "موجودة مباشرة تحت وصف المنتج."))}</p></div><div class="v4SensoryStandard">${esc(kind === "coffee" ? COFFEE_STANDARD : TEA_STANDARD)}</div></div>
      <div class="v4SensoryPanel"><div class="v4PanelTitle"><b>${esc(tr("Awaiting official tasting descriptors", "بانتظار إيحاءات تذوق رسمية"))}</b></div><div class="v4SensoryFoot">${esc(tr("No sensory percentages or tasting notes were generated because no verified official descriptors are stored for this product.", "لم يتم إنشاء نسب أو إيحاءات تذوق لأن المنتج لا يحتوي حاليًا على إيحاءات رسمية موثقة في البيانات."))}</div></div>
    </section>`;
  }

  function markup(product) {
    const d = profileData(product);
    if (!d) return "";
    if (d.pending) return pendingMarkup(product, d.kind);
    const notes = ar() && d.notesAr.length === d.notesEn.length ? d.notesAr : d.notesEn;
    const legend = d.families.map(f => `<div class="v4Family"><i class="v4FamilyDot" style="--dot:${f.color}"></i><div class="v4FamilyText"><b>${esc(familyLabel(d.kind, f.key))}</b><small>${esc(tr(`${f.count} of ${d.notesEn.length} declared notes`, `${f.count} من ${d.notesEn.length} إيحاءات معلنة`))}</small></div><strong class="v4FamilyPct">${f.pct}%</strong></div>`).join("");
    const explicit = d.explicit?.length ? `<div class="v4Explicit">${d.explicit.map(pair => `<span>${esc(tr(pair[0],pair[1]))}</span>`).join("")}</div>` : "";
    return `<section class="v4Sensory" data-v4-sensory>
      <div class="v4SensoryHead"><div><div class="v4SensoryEyebrow">V4 · ${esc(tr("Sensory profile", "الملف الحسي"))}</div><h3>${esc(tr("Official sensory signature", "البصمة الحسية الرسمية"))}</h3><p>${esc(tr("Declared tasting notes, organized without inventing intensity scores.", "الإيحاءات المعلنة مرتبة بصريًا بدون اختراع درجات شدة."))}</p></div><div class="v4SensoryStandard">${esc(d.kind === "coffee" ? COFFEE_STANDARD : TEA_STANDARD)}</div></div>
      <div class="v4DeclaredLabel">${esc(tr("Declared notes", "الإيحاءات المعلنة"))}</div><div class="v4DeclaredNotes">${notes.map(n => `<span class="v4DeclaredNote">${esc(n)}</span>`).join("")}</div>
      <div class="v4SensoryGrid"><div class="v4SensoryPanel"><div class="v4PanelTitle"><b>${esc(tr("Sensory distribution", "توزيع الإيحاءات"))}</b><span>${esc(tr("by declared descriptors", "حسب الإيحاءات المعلنة"))}</span></div><div class="v4DonutWrap"><div class="v4Donut" style="--v4-conic:${conic(d.families)}"><div class="v4DonutCenter"><strong>${d.notesEn.length}</strong><span>${esc(tr("official descriptors", "إيحاءات رسمية"))}</span></div></div></div>${explicit}</div><div class="v4SensoryPanel"><div class="v4PanelTitle"><b>${esc(tr("Flavor families", "عائلات النكهة"))}</b><span>${esc(tr("share of declared notes", "نسبة الإيحاءات المعلنة"))}</span></div><div class="v4FamilyList">${legend}</div></div></div>
      <div class="v4SensoryFoot"><b>${esc(tr("Method:", "المنهج:"))}</b> ${esc(d.kind === "coffee" ? tr("Official product/roaster descriptors are classified into SCA/WCR-style sensory families. Percentages show the share of declared descriptors, not measured flavor intensity or a competition score.", "تُصنّف إيحاءات المنتج/المحمصة الرسمية إلى عائلات حسية وفق منطق SCA/WCR. النسب تمثل حصة كل عائلة من الإيحاءات المعلنة، وليست قياس شدة أو درجة مسابقة.") : tr("Official producer descriptors are grouped for display. ISO 3103 is a tea sensory-preparation reference; it is not presented here as a universal tea flavor wheel. Percentages show descriptor distribution only.", "تُجمع إيحاءات الشركة الرسمية للعرض. معيار ISO 3103 مرجع لتحضير الشاي للاختبارات الحسية وليس عجلة نكهة عالمية للشاي. النسب هنا لتوزيع الإيحاءات فقط."))}</div>
    </section>`;
  }

  function attach(modal) {
    if (!modal || modal.querySelector("[data-v4-sensory]")) return;
    const product = identifyProduct(modal);
    if (!product || !["specialty","tea"].includes(product.cat)) return;
    const story = modal.querySelector(".modalContent .story");
    if (!story) return;
    story.insertAdjacentHTML("afterend", markup(product));
  }

  const scan = () => document.querySelectorAll(".productModal").forEach(attach);
  const observer = new MutationObserver(() => requestAnimationFrame(scan));
  observer.observe(document.documentElement, { childList:true, subtree:true });
  document.addEventListener("click", () => setTimeout(scan, 20), true);
  setTimeout(scan, 0);

  window.MJ_V4_SENSORY = { profileData };
})();
