(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const MAX_CUSTOM_ML = 720;
  const MAX_TEA_STEEP_ML = 160;
  const TEA_PRESETS = [120, 240, 360];
  const COFFEE_PRESETS = [120, 225, 240, 360];
  const SHARE_HOST = "https://share-h5.xbloom.com/";

  const tea = (baseMl, doseG, tempC, stages, pattern = "Centered", siphon = "Auto", source = "", shareLinks = {}) => ({
    kind: "tea", baseMl, doseG, tempC, stages, pattern, siphon, source, shareLinks
  });
  const coffee = (source = "", shareLinks = {}) => ({
    kind: "coffee", baseMl: 225, ratio: 15, tempC: 92, grind: 62, rpm: 80,
    bloomPerGram: 2, bloomSec: 40, mainPattern: "Circular", flowRate: null,
    source, shareLinks
  });

  const MODELS = {
    "Air Roastery – Ricardo": coffee("https://airroastery.com/en/product/ricardo-coffee-filter-250g/"),
    "CGLE Tres Dragones": coffee("https://methods.coffee/products/cgle-tres-dragones"),
    "Pink Bourbon Punch": coffee("https://methods.coffee/products/pink-bourbon-punch"),
    "Bourbon Sidra Sakura": coffee("https://methods.coffee/products/bourbon-sidra-sakura"),
    "EA Decaf De Cana": coffee("https://entiregoods.shop/products/methods-roastery-ea-decaf-de-cana"),
    "Entire Goods – Ethiopia Finara": coffee("https://entiregoods.shop/products/entire-goods-ethiopia-finara"),
    "Fairview Estate — Premium Kenyan Arabica": coffee("package://Fairview-Estate-Premium-Kenyan-Arabica"),
    "Fairview Estate — Kaldi City Roast": coffee("package://Fairview-Estate-Kaldi-City-Roast"),
    "Java House — Kenya AA": coffee("https://javahouseafrica.com/pantry-item/kenya-aa/"),
    "Barista & Co. — Gourmet": coffee("package://Barista-Co-Gourmet"),

    "Sencha Sleepless Organic": tea(120, 1.6, 90, [{ ml: 120, sec: 120 }], "Centered", "Auto", "https://www.teegschwendner.de/en/Sleepless-Sencha/101596"),
    "Moroccan Mint Organic": tea(120, 1.3, 90, [{ ml: 120, sec: 120 }], "Centered", "Auto", "https://www.teegschwendner.de/en/Morrocan-Mint-organic/100949"),
    "Japanese Cherry": tea(180, 3.0, 90, [{ ml: 90, sec: 35 }, { ml: 90, sec: 45 }], "Centered", "Auto", "https://www.teegschwendner.de/en/Japanese-Cherry/100941"),
    "Le Touareg Organic": tea(120, 1.3, 90, [{ ml: 120, sec: 120 }], "Centered", "Auto", "https://www.teegschwendner.de/en/Le-Touareg-organic/100915"),
    "Marani": tea(180, 3.0, 90, [{ ml: 90, sec: 60 }, { ml: 90, sec: 75 }], "Centered", "Auto", "https://www.teegschwendner.de/en/Marani/100953"),
    "Chinese Royal Jasmine Rolls": tea(180, 3.0, 80, [{ ml: 90, sec: 75 }, { ml: 90, sec: 90 }], "Centered", "Auto", "https://www.teegschwendner.de/en/China-Royal-Jasmine-Curls/100937"),
    "White Tea Lemon & Vanilla": tea(180, 3.0, 70, [{ ml: 90, sec: 90 }, { ml: 90, sec: 120 }], "Centered", "Auto", "package://TeeGschwendner-1041"),
    "White Tea Jasmine Blossoms": tea(180, 3.0, 70, [{ ml: 90, sec: 90 }, { ml: 90, sec: 120 }], "Centered", "Auto", "package://TeeGschwendner-1038"),
    "Gourmet Herbal Tea": tea(120, 0.8, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Gourmet-Herbal-Tea/1235"),
    "Mate Green Organic": tea(120, 1.3, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Mate-green-organic/1195"),
    "Ginger–Turmeric": tea(120, 2.0, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Ginger-Turmeric-organic/1243"),
    "One for All": tea(120, 0.7, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.teegschwendner.de/en/One-for-All/1111"),
    "Chamomile": tea(120, 1.5, 100, [{ ml: 120, sec: 300 }], "Circular", "Auto", "package://International-Mill-Chamomile-50g"),
    "Peach Melba": tea(90, 3.1, 100, [{ ml: 90, sec: 420 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Peach-Melba/101479"),
    "Cherry Banana Flip": tea(90, 3.4, 100, [{ ml: 90, sec: 420 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Cherry-Banana-Flip/101446"),
    "Berry Heaven": tea(120, 2.4, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.tgtea-kw.com/products/berry-heaven-no-1659"),
    "Strawberry–Moringa": tea(180, 4.3, 100, [{ ml: 90, sec: 240 }, { ml: 90, sec: 300 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Strawberry-Moringa/101453"),
    "Passion Fruit": tea(120, 2.4, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Passion-Fruit/101637"),
    "Woodland Berries": tea(120, 3.0, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Woodland-Berries/101493")
  };

  const sum = a => a.reduce((x, y) => x + y, 0);
  const round1 = n => Math.round((Number(n) + Number.EPSILON) * 10) / 10;
  const round2 = n => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = (s = "") => String(s).toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  const isAr = () => document.documentElement.lang === "ar";
  const tr = (en, ar) => isAr() ? ar : en;

  function partitionInt(total, count) {
    const base = Math.floor(total / count), rem = total - base * count;
    return Array.from({ length: count }, (_, i) => base + (i < rem ? 1 : 0));
  }
  function proportionalInt(total, weights) {
    const ws = sum(weights), raw = weights.map(w => total * w / ws), floors = raw.map(Math.floor);
    let left = total - sum(floors);
    const order = raw.map((v, i) => ({ i, f: v - floors[i] })).sort((a, b) => b.f - a.f || a.i - b.i);
    for (let k = 0; k < left; k++) floors[order[k % order.length].i]++;
    return floors;
  }
  function teaCycles(model, targetMl) {
    const weights = model.stages.map(s => s.ml);
    const maxFraction = Math.max(...weights.map(w => w / model.baseMl));
    const capacityCycles = Math.max(1, Math.ceil((targetMl * maxFraction) / MAX_TEA_STEEP_ML));
    const profileCycles = Math.max(1, Math.floor(targetMl / model.baseMl));
    return Math.max(capacityCycles, profileCycles);
  }
  function calcTea(model, targetMl) {
    targetMl = Math.round(Number(targetMl));
    const cycles = teaCycles(model, targetMl);
    const cycleVolumes = partitionInt(targetMl, cycles);
    const stageWeights = model.stages.map(s => s.ml);
    const steeps = [];
    cycleVolumes.forEach((ml, ci) => {
      const stageMl = proportionalInt(ml, stageWeights);
      model.stages.forEach((s, i) => steeps.push({ ...s, ml: stageMl[i], cycle: ci + 1 }));
    });
    return {
      kind: "tea", targetMl, totalDose: round1(model.doseG * targetMl / model.baseMl),
      steeps, tempC: model.tempC, pattern: model.pattern, siphon: model.siphon
    };
  }
  function coffeeSource(product) {
    const text = [product.nameEn, product.nameAr, product.subEn, product.subAr, product.descEn, product.descAr].filter(Boolean).join(" ").toLowerCase();
    return /\bxpod\b|capsule|كبسول/.test(text) ? "xpod" : "other";
  }
  function calcCoffee(model, product, targetMl) {
    targetMl = Math.round(Number(targetMl));
    const source = coffeeSource(product);
    const dose = source === "xpod" ? 15 : round1(targetMl / model.ratio);
    const ratio = round2(targetMl / dose);
    const bloom = Math.min(targetMl, Math.round(dose * model.bloomPerGram));
    const rest = Math.max(0, targetMl - bloom);
    const pours = [bloom, ...partitionInt(rest, 3)];
    return {
      kind: "coffee", targetMl, source, dose, ratio, grind: model.grind, rpm: model.rpm,
      tempC: model.tempC, bloomSec: model.bloomSec, flowRate: model.flowRate,
      pattern: model.mainPattern, pours
    };
  }
  function calculate(model, product, ml) {
    const target = Math.round(Number(ml));
    if (!Number.isFinite(target) || target < 1 || target > MAX_CUSTOM_ML) return null;
    return model.kind === "tea" ? calcTea(model, target) : calcCoffee(model, product, target);
  }

  function identifyProduct(modal) {
    const title = norm(modal.querySelector(".modalTitleRow h2, h2")?.textContent || "");
    if (!title) return null;
    return M.products.find(p => {
      const bEn = p._displayBase?.en || p.nameEn, bAr = p._displayBase?.ar || p.nameAr;
      const mEn = p._maker?.en || "", mAr = p._maker?.ar || "";
      const candidates = [p.nameEn,p.nameAr,bEn,bAr,mEn ? `${bEn} - ${mEn}` : "",mAr ? `${bAr} - ${mAr}` : ""].filter(Boolean).map(norm);
      return candidates.some(c => c.length >= 3 && (title === c || title.includes(c) || c.includes(title)));
    }) || null;
  }

  function timeValue(s) {
    const fmt = sec => sec >= 60 ? (sec % 60 ? `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}` : `${sec/60} min`) : `${sec}s`;
    return s.minSec != null && s.maxSec != null ? `${fmt(s.minSec)}–${fmt(s.maxSec)}` : fmt(s.sec || 0);
  }
  function ordinal(n) { return ["1st","2nd","3rd","4th","5th","6th","7th","8th"][n-1] || `${n}th`; }

  function sizeControls(kind, model, target) {
    const presets = kind === "tea" ? TEA_PRESETS : COFFEE_PRESETS;
    const custom = !presets.includes(target);
    return `<div class="xboSizeControls ${kind}">
      ${kind === "coffee" ? `<div class="xboSizeLabel">Recipe volume</div>` : ""}
      <div class="xboSizeButtons">${presets.map(v => `<button type="button" data-size="${v}" class="${v===target ? "active" : ""}"><b>${v}</b><span>ml</span></button>`).join("")}<button type="button" data-custom-toggle class="xboCustomButton ${custom ? "active" : ""}">Custom</button></div>
      <div class="xboCustomInput" ${custom ? "" : "hidden"}><input data-custom-input type="number" inputmode="numeric" min="1" max="${MAX_CUSTOM_ML}" step="1" value="${target}"><span>ml</span></div>
    </div>`;
  }

  function teaStageRows(s, r) {
    return `<div class="xboField"><span>Volume</span><em>ml</em><b>${s.ml}</b></div>
      <div class="xboField"><span>Temperature</span><em>°C</em><b>${r.tempC}</b></div>
      <div class="xboField"><span>Steeping</span><em>s</em><b>${s.minSec != null ? `${s.minSec}–${s.maxSec}` : (s.sec || 0)}</b></div>
      <div class="xboField"><span>Siphon water refill</span><em></em><b>${esc(r.siphon)}</b></div>
      <div class="xboPattern"><span>Pour pattern</span><b>${esc(r.pattern)}</b></div>`;
  }
  function renderTea(app, product, model, r) {
    app.innerHTML = `
      <div class="xboMachinePhoto" aria-hidden="true"></div>
      <div class="xboTeaNotice"><span>Please use with Omni Brewer.</span><b>?</b><i aria-hidden="true"></i></div>
      ${sizeControls("tea", model, r.targetMl)}
      <div class="xboTeaDose"><span>Tea</span><div><em>g</em><b>${r.totalDose.toFixed(1)}</b></div></div>
      <div class="xboSectionTitle"><h4>Steeps <span>~${sum(r.steeps.map(s=>s.ml))}/</span><small>~${r.targetMl}ml</small></h4></div>
      <div class="xboSteeps">${r.steeps.map((s, i) => `<details class="xboSteep" ${i===0 ? "open" : ""}><summary><b>${ordinal(i+1)} Steep</b><i></i></summary><div class="xboFields">${teaStageRows(s,r)}</div></details>`).join("")}</div>
      <div class="xboBottomActions"><button type="button" data-save-as>Save as</button><button type="button" data-save>Save</button></div>
      <div class="xboStatus" aria-live="polite"></div>`;
  }

  function percent(v, total) {
    const p = round1(v * 100 / total);
    return Number.isInteger(p) ? String(p) : p.toFixed(1);
  }
  function renderCoffee(app, product, model, r) {
    const selected = r.source;
    app.innerHTML = `
      <div class="xboMachinePhoto" aria-hidden="true"></div>
      <div class="xboCoffeeHead"><h4>Coffee</h4><div class="xboGrinder"><span>Grinder:</span><b>ON</b><em>OFF</em></div></div>
      <div class="xboSourceRow">
        <div class="${selected==="xpod" ? "selected" : ""}"><i class="xpod"></i><span>xPod</span></div>
        <div class="${selected==="omni" ? "selected" : ""}"><i class="omni"></i><span>Omni</span></div>
        <div class="${selected==="other" ? "selected" : ""}"><i class="other"></i><span>Other</span></div>
      </div>
      ${sizeControls("coffee", model, r.targetMl)}
      <div class="xboCoffeeField"><span>Dose</span><em>g</em><b>${r.dose}</b></div>
      <div class="xboCoffeeField ratio"><span>Coffee : Water Ratio</span><small>${r.targetMl}ml</small><b>1:${r.ratio}</b></div>
      <div class="xboCoffeeField"><span>Grind Size</span><em></em><b>${r.grind}</b></div>
      <div class="xboCoffeeField"><span>Grinder Speed</span><em>RPM</em><b>${r.rpm}</b></div>
      <div class="xboSectionTitle xboPoursTitle"><h4>Pours <span>${sum(r.pours)}/</span><small>${r.targetMl}ml</small></h4></div>
      <div class="xboPours">${r.pours.map((ml,i) => `<details class="xboPour" ${i===0 ? "open" : ""}><summary><div><span>${i===0 ? "Bloom" : `Pour ${i+1}`}</span><strong>${percent(ml,r.targetMl)}<small>%</small></strong></div><div class="xboPourSummary"><b>${ml}ml</b><b>${r.tempC}°C</b><b>${r.flowRate == null ? "—" : `${r.flowRate}ml/s`}</b><i>◉</i></div></summary><div class="xboPourDetails"><div><span>Volume</span><b>${ml} ml</b></div><div><span>Temperature</span><b>${r.tempC}°C</b></div><div><span>Flow rate</span><b>${r.flowRate == null ? "—" : `${r.flowRate} ml/s`}</b></div><div><span>Pause</span><b>${i===0 ? `${r.bloomSec}s` : "—"}</b></div><div><span>Pour pattern</span><b>${esc(r.pattern)}</b></div></div></details>`).join("")}</div>
      <div class="xboBottomActions"><button type="button" data-save-as>Save as</button><button type="button" data-save>Save</button></div>
      <div class="xboStatus" aria-live="polite"></div>`;
  }

  function recipeText(product, model, r) {
    const out = [product.nameEn, `${r.targetMl} ml`, ""];
    if (model.kind === "tea") {
      out.push(`Tea: ${r.totalDose.toFixed(1)} g`);
      r.steeps.forEach((s,i) => out.push(`${ordinal(i+1)} Steep: ${s.ml} ml | ${r.tempC}°C | ${timeValue(s)} | Siphon ${r.siphon} | ${r.pattern}`));
    } else {
      out.push(`Source: ${r.source === "xpod" ? "xPod" : "Whole beans / Other"}`, `Dose: ${r.dose} g`, `Ratio: 1:${r.ratio}`, `Grind: ${r.grind}`, `RPM: ${r.rpm}`);
      r.pours.forEach((ml,i) => out.push(`${i===0 ? "Bloom" : `Pour ${i+1}`}: ${ml} ml | ${r.tempC}°C | ${r.flowRate == null ? "Flow —" : `${r.flowRate} ml/s`} | ${r.pattern}`));
    }
    return out.join("\n");
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) {
      try {
        const ta=document.createElement("textarea"); ta.value=text; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); const ok=document.execCommand("copy"); ta.remove(); return ok;
      } catch (_) { return false; }
    }
  }

  function getShareLink(model, targetMl) {
    const link = model.shareLinks?.[String(targetMl)] || model.shareLinks?.[targetMl];
    return typeof link === "string" && link.startsWith(SHARE_HOST) ? link : null;
  }

  function bindBuilder(builder, product, model) {
    const app = builder.querySelector(".xboApp");
    const stop = e => e.stopPropagation();
    builder.addEventListener("pointerdown", e => { if (e.target.closest("button,input,summary,a")) stop(e); }, true);

    builder.addEventListener("click", async e => {
      const size = e.target.closest("[data-size]");
      if (size) {
        e.preventDefault(); stop(e);
        const ml = Number(size.dataset.size); builder.dataset.ml = String(ml); refresh(builder, product, model, ml); return;
      }
      const customToggle = e.target.closest("[data-custom-toggle]");
      if (customToggle) {
        e.preventDefault(); stop(e);
        const wrap = builder.querySelector(".xboCustomInput");
        if (wrap) { wrap.hidden = false; customToggle.classList.add("active"); setTimeout(()=>wrap.querySelector("input")?.focus({preventScroll:true}),0); }
        return;
      }
      if (e.target.closest("[data-save-as]")) {
        e.preventDefault(); stop(e);
        const r = calculate(model, product, Number(builder.dataset.ml));
        const ok = await copyText(recipeText(product, model, r));
        app.querySelector(".xboStatus").textContent = ok ? "Recipe copied." : "Copy failed.";
        return;
      }
      if (e.target.closest("[data-save]")) {
        e.preventDefault(); stop(e);
        const r = calculate(model, product, Number(builder.dataset.ml));
        const exact = getShareLink(model, r.targetMl);
        if (!exact) {
          await copyText(recipeText(product, model, r));
          app.querySelector(".xboStatus").textContent = tr("No xBloom share link exists for this exact recipe yet. I did not open a different recipe.", "لا يوجد رابط مشاركة xBloom لهذه الوصفة نفسها حتى الآن؛ لم أفتح وصفة مختلفة.");
          return;
        }
        window.location.href = exact;
      }
    });

    builder.addEventListener("input", e => {
      const input = e.target.closest("[data-custom-input]");
      if (!input) return;
      const ml = Math.round(Number(input.value));
      if (!Number.isFinite(ml) || ml < 1 || ml > MAX_CUSTOM_ML) return;
      builder.dataset.ml = String(ml); refresh(builder, product, model, ml, true);
    });
  }

  function refresh(builder, product, model, ml, preserveCustom = false) {
    const r = calculate(model, product, ml) || calculate(model, product, model.baseMl);
    builder.dataset.ml = String(r.targetMl);
    const app = builder.querySelector(".xboApp");
    if (model.kind === "tea") renderTea(app, product, model, r); else renderCoffee(app, product, model, r);
    const standard = (model.kind === "tea" ? TEA_PRESETS : COFFEE_PRESETS).includes(r.targetMl);
    if (!standard || preserveCustom) {
      const wrap = app.querySelector(".xboCustomInput"), btn = app.querySelector("[data-custom-toggle]");
      if (wrap) { wrap.hidden = false; const input = wrap.querySelector("input"); if (input && document.activeElement !== input) input.value = String(r.targetMl); }
      btn?.classList.add("active");
    }
    bindBuilder(builder, product, model);
  }

  function attach(modal) {
    if (modal.dataset.xboOfficial === "1") return;
    const product = identifyProduct(modal), model = product && MODELS[product.nameEn];
    if (!product || !model) return;
    modal.dataset.xboOfficial = "1";
    modal.querySelectorAll(".xbiBuilder,.v3XbloomV2,.v3XbloomBuilder,.v3SmartRecipe,.v2RecipeCard,.recipeCard").forEach(x => x.remove());
    const builder = document.createElement("section");
    builder.className = "xboBuilder";
    builder.dataset.ml = String(model.baseMl);
    builder.innerHTML = `<div class="xboApp ${model.kind === "tea" ? "xboTea" : "xboCoffee"}"></div>`;
    (modal.querySelector(".modalContent") || modal).appendChild(builder);
    refresh(builder, product, model, model.baseMl);
  }

  const observer = new MutationObserver(() => requestAnimationFrame(() => document.querySelectorAll(".productModal").forEach(attach)));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("click", () => setTimeout(() => document.querySelectorAll(".productModal").forEach(attach), 20), true);
  setTimeout(() => document.querySelectorAll(".productModal").forEach(attach), 0);

  window.MJ_XBLOOM_OFFICIAL = { MODELS, calculate: (name, ml) => {
    const p = M.products.find(x => x.nameEn === name), m = MODELS[name];
    return p && m ? calculate(m,p,ml) : null;
  }};
})();