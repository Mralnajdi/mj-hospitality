(() => {
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

  // Current TeaGschwendner catalogue numbers where the present official listing
  // differs from the number on the user's older package / collection record.
  const currentCompanyNo = {
    "Chinese Royal Jasmine Rolls": "937",
    "Ginger–Turmeric": "1243"
  };

  const verifiedOrigin = {
    "Chinese Royal Jasmine Rolls": { en: "China", ar: "الصين" },
    "Mate Green Organic": { en: "Brazil", ar: "البرازيل" }
  };

  const aliases = {
    "CGLE Tres Dragones": "Methods – CGLE Tres Dragones",
    "Pink Bourbon Punch": "Methods – Pink Bourbon Punch",
    "Bourbon Sidra Sakura": "Methods – Bourbon Sidra Sakura",
    "EA Decaf De Cana": "Methods – EA Decaf De Cana"
  };

  const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();
  const isAr = () => document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

  function injectStyles() {
    if (document.getElementById("v5ProductDetailsStyles")) return;
    const style = document.createElement("style");
    style.id = "v5ProductDetailsStyles";
    style.textContent = `
      .v5Ingredients{margin:18px 0 0;padding:16px 18px;border:1px solid rgba(197,155,88,.22);border-radius:16px;background:rgba(255,255,255,.025)}
      .v5Ingredients small,.v5DataHead .eyebrow,.v5PrepHead .eyebrow{display:block;color:#c9a66b;letter-spacing:.12em;text-transform:uppercase;font-size:.72rem;margin-bottom:7px}
      .v5Ingredients p{margin:0;line-height:1.75;color:rgba(255,255,255,.84)}
      .v5DataCard,.v5PrepCard{margin:20px 0 0;padding:18px;border:1px solid rgba(197,155,88,.24);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.015));overflow:hidden}
      .v5DataHead,.v5PrepHead{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:13px}
      .v5DataHead h3,.v5PrepHead h3{margin:0;font-size:1.12rem;font-weight:650;color:#f2e7d3}
      .v5DataTable,.v5PrepTable{width:100%;border-collapse:separate;border-spacing:0;font-size:.94rem}
      .v5DataTable tr+tr td,.v5PrepTable tr+tr td,.v5PrepTable tr+tr th{border-top:1px solid rgba(255,255,255,.075)}
      .v5DataTable td,.v5PrepTable td,.v5PrepTable th{padding:12px 10px;vertical-align:top;text-align:start}
      .v5DataTable td:first-child{width:36%;color:rgba(255,255,255,.56);font-size:.82rem}
      .v5DataTable td:last-child{color:#f6efe4;font-weight:600;line-height:1.55}
      .v5DataTable a{color:#d8b77c;text-decoration:none;border-bottom:1px dotted rgba(216,183,124,.5)}
      .v5PrepTable thead th{color:rgba(255,255,255,.56);font-size:.76rem;font-weight:600;background:rgba(255,255,255,.025)}
      .v5PrepTable tbody td{color:#f3ecdf;font-weight:600}
      .v5PrepTable tbody td:first-child{color:#d8b77c}
      .v5PrepMeta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0 14px}
      .v5PrepMeta div{padding:11px 12px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.055)}
      .v5PrepMeta small{display:block;color:rgba(255,255,255,.5);font-size:.72rem;margin-bottom:4px}
      .v5PrepMeta b{color:#f3eadc;font-size:.9rem}
      .v5PrepNote{margin:13px 0 0;color:rgba(255,255,255,.63);font-size:.82rem;line-height:1.65}
      .v5SourceLink{display:inline-flex;margin-top:12px;color:#d8b77c;text-decoration:none;font-size:.85rem}
      .productModal .modalContent>.facts{display:none!important}
      .productModal .recipeCard{display:none!important}
      @media(max-width:640px){
        .v5DataCard,.v5PrepCard{padding:15px;margin-top:16px;border-radius:15px}
        .v5DataTable td{padding:11px 6px}.v5DataTable td:first-child{width:39%}
        .v5PrepTable{font-size:.84rem}.v5PrepTable td,.v5PrepTable th{padding:10px 6px}
        .v5PrepMeta{grid-template-columns:1fr}.v5DataHead,.v5PrepHead{align-items:flex-start;flex-direction:column}
      }
    `;
    document.head.appendChild(style);
  }

  function resolveProduct(title) {
    const list = window.MJ_MENU?.products || [];
    const n = norm(title);
    return list.find(p => norm(p.nameEn) === n || norm(p.nameAr) === n) || null;
  }

  function extraFor(p) {
    if (!p) return { facts: [] };
    const E = window.MJ_EXTRA?.products || {};
    return E[p.nameEn] || E[aliases[p.nameEn]] || { facts: [] };
  }

  function sourceFor(p) {
    if (!p) return null;
    return window.MJ_SOURCES?.products?.[p.nameEn] || null;
  }

  function translatedFact(f) {
    const ar = isAr();
    return {
      key: norm(ar ? (f[2] || f[0]) : f[0]),
      val: norm(ar ? (f[3] || f[1]) : f[1]),
      keyEn: norm(f[0])
    };
  }

  function makeIngredientsBlock(facts) {
    const ingredient = facts.find(f => /ingredients/i.test(String(f[0])) || String(f[2] || "").includes("المكونات"));
    if (!ingredient) return null;
    const tf = translatedFact(ingredient);
    const box = document.createElement("section");
    box.className = "v5Ingredients";
    box.innerHTML = `<small>${esc(isAr() ? "المكونات" : "Ingredients")}</small><p>${esc(tf.val)}</p>`;
    return box;
  }

  function makeDataCard(p, facts, source) {
    const ar = isAr();
    const rows = [];
    const seen = new Set();

    const push = (keyEn, keyAr, valEn, valAr = valEn, html = false) => {
      const key = ar ? keyAr : keyEn;
      const value = ar ? valAr : valEn;
      if (!value || seen.has(keyEn)) return;
      seen.add(keyEn);
      rows.push({ key, value, html });
    };

    const codeFact = facts.find(f => /product no\.?/i.test(String(f[0])) || String(f[2] || "").includes("رقم المنتج"));
    const packageCode = packageCodes[p.nameEn] || (codeFact ? String(codeFact[1]).replace(/^No\.?\s*/i, "") : "");
    if (packageCode) push("Product No.", "رقم المنتج", `No. ${packageCode}`);

    if (currentCompanyNo[p.nameEn] && currentCompanyNo[p.nameEn] !== packageCode) {
      push("Current company No.", "رقم الشركة الحالي", `No. ${currentCompanyNo[p.nameEn]}`);
    }

    if (p.cat === "tea") push("Tea type", "نوع الشاي", p.subEn, p.subAr);
    if (verifiedOrigin[p.nameEn]) push("Origin", "المنشأ", verifiedOrigin[p.nameEn].en, verifiedOrigin[p.nameEn].ar);

    facts.forEach(f => {
      const tf = translatedFact(f);
      if (/ingredients/i.test(tf.keyEn) || /product no\.?/i.test(tf.keyEn)) return;
      push(tf.keyEn, f[2] || tf.keyEn, f[1], f[3] || f[1]);
    });

    if (source?.source) {
      const label = ar ? "فتح صفحة الشركة الرسمية ↗" : "Open official product page ↗";
      push("Official source", "المصدر الرسمي", `<a href="${esc(source.source)}" target="_blank" rel="noopener">${esc(label)}</a>`, `<a href="${esc(source.source)}" target="_blank" rel="noopener">${esc(label)}</a>`, true);
    }

    const card = document.createElement("section");
    card.className = "v5DataCard";
    card.innerHTML = `<div class="v5DataHead"><div><span class="eyebrow">${esc(ar ? "بيانات المنتج" : "PRODUCT DETAILS")}</span><h3>${esc(ar ? "تفاصيل المنتج" : "Product information")}</h3></div></div><table class="v5DataTable"><tbody>${rows.map(r => `<tr><td>${esc(r.key)}</td><td>${r.html ? r.value : esc(r.value)}</td></tr>`).join("")}</tbody></table>`;
    return card;
  }

  function makePrepCard(p, source) {
    const ar = isAr();
    const b = source?.brew;
    const card = document.createElement("section");
    card.className = "v5PrepCard";

    if (!b) {
      card.innerHTML = `<div class="v5PrepHead"><div><span class="eyebrow">${esc(ar ? "التحضير" : "PREPARATION")}</span><h3>${esc(ar ? "لا توجد وصفة موثقة لهذا المنتج" : "No verified preparation profile")}</h3></div></div><p class="v5PrepNote">${esc(ar ? "لم نضع أرقامًا افتراضية أو تقديرية." : "No estimated or invented values are shown.")}</p>`;
      return card;
    }

    const dose = (v) => ((Number(b.gpl) * v) / 1000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    const rows = [120, 240, 360].map(v => `<tr><td>${v} ml</td><td>${dose(v)} g</td><td>${esc(b.temp)}°C</td><td>${esc(b.time)}</td></tr>`).join("");
    const sourceLink = source?.source ? `<a class="v5SourceLink" href="${esc(source.source)}" target="_blank" rel="noopener">${esc(ar ? "المصدر الرسمي للتحضير ↗" : "Official preparation source ↗")}</a>` : "";

    card.innerHTML = `
      <div class="v5PrepHead"><div><span class="eyebrow">${esc(ar ? "جدول التحضير" : "PREPARATION TABLE")}</span><h3>${esc(ar ? "مرجع الشركة الرسمي" : "Official manufacturer guide")}</h3></div></div>
      <div class="v5PrepMeta">
        <div><small>${esc(ar ? "المعيار الأساسي" : "Base ratio")}</small><b>${esc(b.gpl)} g / 1 L</b></div>
        <div><small>${esc(ar ? "درجة الحرارة" : "Temperature")}</small><b>${esc(b.temp)}°C</b></div>
        <div><small>${esc(ar ? "مدة النقع" : "Steeping time")}</small><b>${esc(b.time)}</b></div>
      </div>
      <table class="v5PrepTable">
        <thead><tr><th>${esc(ar ? "الحجم" : "Volume")}</th><th>${esc(ar ? "كمية الشاي" : "Tea amount")}</th><th>${esc(ar ? "الحرارة" : "Temp.")}</th><th>${esc(ar ? "النقع" : "Steep")}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="v5PrepNote">${esc(ar ? "مهم: 120 / 240 / 360 مل هنا تحويل نسبي فقط من معيار الشركة بالغرام لكل لتر. لم نعد نفترض أن 240 مل = نقعتين أو 360 مل = ثلاث نقعات، ولا نعرض مراحل xBloom إلا إذا كانت وصفة الجهاز معتمدة فعليًا." : "Important: 120 / 240 / 360 ml are proportional dose equivalents only from the manufacturer’s grams-per-litre guide. V5 no longer assumes 240 ml equals two steeps or 360 ml equals three steeps, and it does not invent xBloom stages without an approved device recipe.")}</p>
      ${sourceLink}`;
    return card;
  }

  function enhanceModal() {
    injectStyles();
    const modal = document.querySelector(".productModal");
    if (!modal) return;
    const title = norm(modal.querySelector(".modalTitleRow h2")?.textContent);
    if (!title) return;
    const p = resolveProduct(title);
    if (!p) return;

    const signature = `${p.nameEn}|${isAr() ? "ar" : "en"}`;
    if (modal.dataset.v5Enhanced === signature) return;
    modal.dataset.v5Enhanced = signature;

    modal.querySelectorAll(".v5Ingredients,.v5DataCard,.v5PrepCard").forEach(x => x.remove());

    const facts = extraFor(p).facts || [];
    const source = sourceFor(p);
    const story = modal.querySelector(".modalContent .story");
    const experience = modal.querySelector(".modalContent .experience");
    if (!story) return;

    const ingredients = makeIngredientsBlock(facts);
    if (ingredients) story.insertAdjacentElement("afterend", ingredients);

    const dataCard = makeDataCard(p, facts, source);
    (ingredients || story).insertAdjacentElement("afterend", dataCard);

    if (p.cat === "tea") {
      const prep = makePrepCard(p, source);
      if (experience) experience.insertAdjacentElement("afterend", prep);
      else dataCard.insertAdjacentElement("afterend", prep);
    }
  }

  const observer = new MutationObserver(() => queueMicrotask(enhanceModal));
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", () => queueMicrotask(enhanceModal), true);
  window.addEventListener("hashchange", () => queueMicrotask(enhanceModal));
  enhanceModal();
})();
