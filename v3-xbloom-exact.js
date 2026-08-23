(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const MAX_TEA_STEEP_ML = 160;
  const COFFEE_MIN_G = 5;
  const COFFEE_MAX_G = 18;
  const MAX_CUSTOM_ML = 720;
  const RECIPE_HUB_URL = "https://collective.xbloom.com/";
  const DEFAULT_PRESETS = [120, 240, 360];

  const tea = (baseMl, doseG, tempC, stages, pattern = "Center", siphon = "Auto", source = "", shareLinks = {}) => ({
    kind: "tea", baseMl, doseG, tempC, stages, pattern, siphon, source, shareLinks
  });
  const coffee = (source = "", shareLinks = {}) => ({
    kind: "coffee", baseMl: 225, ratio: 15, tempC: 92, grind: 62, rpm: 80,
    bloomPerGram: 2, bloomSec: 40, pulses: 3, mainPattern: "Circular",
    bloomPattern: "Center", flowRate: null, pauseSec: null,
    agitationBefore: false, agitationAfter: false, targetTime: "2:45–3:15",
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

    "Sencha Sleepless Organic": tea(120, 1.6, 90, [{ ml: 120, sec: 120 }], "Center", "Auto", "https://www.teegschwendner.de/en/Sleepless-Sencha/101596"),
    "Moroccan Mint Organic": tea(120, 1.3, 90, [{ ml: 120, sec: 120 }], "Center", "Auto", "https://www.teegschwendner.de/en/Morrocan-Mint-organic/100949"),
    "Japanese Cherry": tea(180, 3.0, 90, [{ ml: 90, sec: 35 }, { ml: 90, sec: 45 }], "Center", "Auto", "https://www.teegschwendner.de/en/Japanese-Cherry/100941"),
    "Le Touareg Organic": tea(120, 1.3, 90, [{ ml: 120, sec: 120 }], "Center", "Auto", "https://www.teegschwendner.de/en/Le-Touareg-organic/100915"),
    "Marani": tea(180, 3.0, 90, [{ ml: 90, sec: 60 }, { ml: 90, sec: 75 }], "Center", "Auto", "https://www.teegschwendner.de/en/Marani/100953"),
    "Chinese Royal Jasmine Rolls": tea(180, 3.0, 80, [{ ml: 90, sec: 75 }, { ml: 90, sec: 90 }], "Center", "Auto", "https://www.teegschwendner.de/en/China-Royal-Jasmine-Curls/100937"),
    "White Tea Lemon & Vanilla": tea(180, 3.0, 70, [{ ml: 90, sec: 90 }, { ml: 90, sec: 120 }], "Center", "Auto", "package://TeeGschwendner-1041"),
    "White Tea Jasmine Blossoms": tea(180, 3.0, 70, [{ ml: 90, sec: 90 }, { ml: 90, sec: 120 }], "Center", "Auto", "package://TeeGschwendner-1038"),
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

  const sum = (xs) => xs.reduce((a, b) => a + b, 0);
  const round1 = (n) => Math.round((Number(n) + Number.EPSILON) * 10) / 10;
  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const isAr = () => document.documentElement.lang === "ar";
  const tr = (en, ar) => isAr() ? ar : en;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = (s = "") => String(s).toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();

  function partitionInt(total, count) {
    const base = Math.floor(total / count), rem = total - base * count;
    return Array.from({ length: count }, (_, i) => base + (i < rem ? 1 : 0));
  }
  function proportionalInt(total, weights) {
    const ws = sum(weights), raw = weights.map(w => total * w / ws), floors = raw.map(Math.floor);
    let left = total - sum(floors);
    const order = raw.map((v, i) => ({ i, f: v - floors[i] })).sort((a,b) => b.f - a.f || a.i - b.i);
    for (let k = 0; k < left; k++) floors[order[k % order.length].i]++;
    return floors;
  }
  function distributeTenths(totalExact, weights) {
    const totalTenths = Math.round(totalExact * 10), ws = sum(weights);
    const raw = weights.map(w => totalTenths * w / ws), floors = raw.map(Math.floor);
    let left = totalTenths - sum(floors);
    const order = raw.map((v, i) => ({ i, f: v - floors[i] })).sort((a,b) => b.f - a.f || a.i - b.i);
    for (let k = 0; k < left; k++) floors[order[k % order.length].i]++;
    return floors.map(x => x / 10);
  }
  function teaCycles(model, targetMl) {
    const weights = model.stages.map(s => s.ml);
    const maxFraction = Math.max(...weights.map(w => w / model.baseMl));
    const capacityCycles = Math.max(1, Math.ceil((targetMl * maxFraction) / MAX_TEA_STEEP_ML));
    const profileCycles = Math.max(1, Math.floor(targetMl / model.baseMl));
    let cycles = Math.max(capacityCycles, profileCycles);
    while (cycles > 1) {
      const candidate = cycles - 1, maxCycle = Math.ceil(targetMl / candidate), maxStage = maxCycle * maxFraction;
      if (maxStage <= MAX_TEA_STEEP_ML && maxCycle <= model.baseMl * 1.5) cycles = candidate; else break;
    }
    return cycles;
  }
  function calcTea(model, targetMl) {
    targetMl = Math.round(Number(targetMl));
    const cycles = teaCycles(model, targetMl), cycleVolumes = partitionInt(targetMl, cycles);
    const doses = distributeTenths((model.doseG * targetMl) / model.baseMl, cycleVolumes);
    const stageWeights = model.stages.map(s => s.ml);
    const cycleData = cycleVolumes.map((ml, i) => {
      const stageMl = proportionalInt(ml, stageWeights);
      return { ml, dose: doses[i], stages: model.stages.map((s, j) => ({ ...s, ml: stageMl[j] })) };
    });
    return { kind: "tea", targetMl, cycles, totalDose: round1(sum(doses)), cycleData, tempC: model.tempC, pattern: model.pattern, siphon: model.siphon, baseMl: model.baseMl, source: model.source };
  }
  function calcCoffee(model, targetMl) {
    targetMl = Math.round(Number(targetMl));
    const exactTotalDose = targetMl / model.ratio;
    const cycles = Math.max(1, Math.ceil(exactTotalDose / COFFEE_MAX_G));
    const cycleVolumes = partitionInt(targetMl, cycles), doses = distributeTenths(exactTotalDose, cycleVolumes);
    const cycleData = cycleVolumes.map((ml, i) => {
      const dose = doses[i], bloom = Math.min(ml, Math.round(dose * model.bloomPerGram));
      const pours = partitionInt(ml - bloom, model.pulses);
      return { ml, dose, ratio: round2(ml / dose), bloom, pours };
    });
    const totalDose = round1(sum(doses));
    return { kind: "coffee", targetMl, cycles, totalDose, overallRatio: round2(targetMl / totalDose), cycleData,
      tempC: model.tempC, grind: model.grind, rpm: model.rpm, bloomSec: model.bloomSec, targetTime: model.targetTime,
      baseMl: model.baseMl, source: model.source, invalidMin: cycleData.some(c => c.dose < COFFEE_MIN_G), minMl: Math.ceil(COFFEE_MIN_G * model.ratio) };
  }
  function calculate(model, ml) {
    const target = Math.round(Number(ml));
    if (!Number.isFinite(target) || target < 1 || target > MAX_CUSTOM_ML) return null;
    return model.kind === "tea" ? calcTea(model, target) : calcCoffee(model, target);
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

  function ord(n) {
    const map = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
    return map[n - 1] || `${n}th`;
  }

  function teaScreen(product, model, r) {
    const steeps = [];
    r.cycleData.forEach((cycle, ci) => cycle.stages.forEach((s, si) => steeps.push({ ...s, cycle: ci + 1, localIndex: si + 1 })));
    const totalStageMl = sum(steeps.map(s => s.ml));
    return `<div class="xbiScreen xbiTea">
      <div class="xbiOmniNotice"><span>${tr("Please use with Omni Brewer.", "استخدم مع Omni Brewer")}</span><b>?</b></div>
      <div class="xbiMachinePresets">
        ${[120,240,360].map(v => `<div class="${v===r.targetMl ? "selected" : ""}"><i></i><span>~${v}ml</span></div>`).join("")}
      </div>
      <div class="xbiTeaDose"><span>Tea</span><div><em>g</em><b>${r.totalDose.toFixed(1)}</b></div></div>
      <div class="xbiSectionTitle"><h4>Steeps <span>~${totalStageMl}/</span><small>~${r.targetMl}ml</small></h4></div>
      <div class="xbiActualBackdrop xbiActualTea" aria-hidden="true"></div>
      <div class="xbiStages">
        ${steeps.map((s, i) => `<details class="xbiStage" ${i===0 ? "open" : ""}>
          <summary><b>${ord(i+1)} Steep</b><i></i></summary>
          <div class="xbiFields">
            <div><span>Volume</span><em>ml</em><b>${s.ml}</b></div>
            <div><span>Temperature</span><em>°C</em><b>${r.tempC}</b></div>
            <div><span>Steeping</span><em>s</em><b>${s.minSec != null ? `${s.minSec}–${s.maxSec}` : (s.sec || 0)}</b></div>
            <div><span>Siphon water refill</span><em></em><b>${esc(r.siphon)}</b></div>
            <div><span>Pour pattern</span><em></em><b>${esc(r.pattern)}</b></div>
          </div>
        </details>`).join("")}
      </div>
    </div>`;
  }

  function coffeeStages(cycle, model, r) {
    return [
      { name: "Bloom", ml: cycle.bloom, sec: r.bloomSec, pattern: model.bloomPattern },
      ...cycle.pours.map((ml, i) => ({ name: `Pour ${i + 2}`, ml, sec: model.pauseSec, pattern: model.mainPattern }))
    ];
  }
  function coffeeScreen(product, model, r) {
    const blocks = r.cycleData.map((cycle, ci) => {
      const stages = coffeeStages(cycle, model, r);
      return `<div class="xbiCoffeeBrew">
        ${r.cycles > 1 ? `<div class="xbiBrewLabel">${tr(`Brew ${ci+1}`, `التحضير ${ci+1}`)} · ${cycle.ml}ml · ${cycle.dose.toFixed(1)}g</div>` : ""}
        <div class="xbiPoursTitle"><h4>Pours <span>${cycle.ml}/</span><small>${cycle.ml}ml</small></h4></div>
        <div class="xbiPourCards">
          ${stages.map((s, i) => {
            const pct = Math.round((s.ml / cycle.ml) * 1000) / 10;
            const flow = model.flowRate == null ? "—" : `${model.flowRate}ml/s`;
            return `<details class="xbiPour" ${i===0 ? "open" : ""}>
              <summary>
                <div><span>${esc(s.name)}</span><strong>${pct}%</strong></div>
                <div class="xbiPourSummary"><b>${s.ml}ml</b><b>${r.tempC}°C</b><b>${flow}</b><i>◉</i></div>
              </summary>
              <div class="xbiPourFields">
                <div><span>Volume</span><b>${s.ml} ml</b></div>
                <div><span>Temperature</span><b>${r.tempC}°C</b></div>
                <div><span>Flow rate</span><b class="${model.flowRate == null ? "muted" : ""}">${flow}</b></div>
                <div><span>Pausing</span><b class="${s.sec == null ? "muted" : ""}">${s.sec == null ? "—" : `${s.sec}s`}</b></div>
                <div><span>Pour pattern</span><b>${esc(s.pattern || "—")}</b></div>
                <div><span>Agitation before</span><b>${model.agitationBefore ? "ON" : "OFF"}</b></div>
                <div><span>Agitation after</span><b>${model.agitationAfter ? "ON" : "OFF"}</b></div>
              </div>
            </details>`;
          }).join("")}
        </div>
      </div>`;
    }).join("");
    const warning = r.invalidMin ? `<div class="xbiWarn">${tr(`Use at least ${r.minMl} ml to stay at or above xBloom's published 5 g minimum dose.`, `استخدم ${r.minMl} مل على الأقل حتى لا تقل الجرعة عن حد xBloom المنشور 5 غ.`)}</div>` : "";
    return `<div class="xbiScreen xbiCoffee">
      <div class="xbiCoffeeTop"><h4>Coffee</h4><div>Grinder: <b>ON</b><span>OFF</span></div></div>
      <div class="xbiToolRow"><div><i class="pod"></i><span>xPod</span></div><div class="selected"><i class="omni"></i><span>Omni</span></div><div><i class="other"></i><span>Other</span></div></div>
      <div class="xbiCoffeeStats">
        <div><span>Dose</span><em>g</em><b>${r.totalDose.toFixed(1)}</b></div>
        <div><span>Coffee : Water Ratio</span><small>${r.targetMl}ml</small><b>1:${r.overallRatio}</b></div>
        <div><span>Grind Size</span><small>Setting</small><b>${r.grind}</b></div>
        <div><span>Grinder Speed</span><em>RPM</em><b>${r.rpm}</b></div>
      </div>
      ${warning}
      <div class="xbiActualBackdrop xbiActualCoffee" aria-hidden="true"></div>
      ${blocks}
    </div>`;
  }

  function sourceMarkup(model) {
    if (!model.source) return "";
    if (!/^https?:\/\//i.test(model.source)) return `<span>${tr("Package baseline", "مرجع العبوة")}</span>`;
    return `<a href="${esc(model.source)}" target="_blank" rel="noopener">${tr("Recipe source", "مرجع الوصفة")} ↗</a>`;
  }
  function recipeText(product, model, r) {
    const lines = [product.nameEn, `${r.targetMl} ml`, ""];
    if (model.kind === "tea") {
      lines.push(`Tea: ${r.totalDose.toFixed(1)} g`);
      let idx = 1;
      r.cycleData.forEach(c => c.stages.forEach(s => lines.push(`${ord(idx++)} Steep: ${s.ml} ml | ${r.tempC}°C | ${s.minSec != null ? `${s.minSec}-${s.maxSec}s` : `${s.sec}s`} | Siphon ${r.siphon} | ${r.pattern}`)));
    } else {
      lines.push(`Dose: ${r.totalDose.toFixed(1)} g`, `Ratio: 1:${r.overallRatio}`, `Grind: ${r.grind}`, `RPM: ${r.rpm}`);
      r.cycleData.forEach((c, ci) => coffeeStages(c, model, r).forEach(s => lines.push(`${r.cycles > 1 ? `Brew ${ci+1} · ` : ""}${s.name}: ${s.ml} ml | ${r.tempC}°C | ${s.pattern || "—"}`)));
    }
    return lines.join("\n");
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); ta.remove(); return ok;
    }
  }

  function presets(model) {
    const set = new Set(DEFAULT_PRESETS); set.add(model.baseMl); if (model.kind === "coffee") set.add(225);
    return [...set].sort((a,b) => a-b);
  }
  function renderShell(card, product, model) {
    const list = presets(model);
    card.dataset.product = product.nameEn;
    card.dataset.ml = String(model.baseMl);
    card.innerHTML = `<div class="xbiHeader"><div><small>V3 · xBloom</small><h3>${tr("xBloom Recipe Builder", "مُنشئ وصفة xBloom")}</h3><p>${esc(product.nameEn)}</p></div><span>✓ 3×</span></div>
      <div class="xbiMode"><button type="button" data-mode="preset" class="active">${tr("Machine standard", "المعيار المعتمد")}</button><button type="button" data-mode="custom">${tr("Custom fill", "مخصص")}</button></div>
      <div class="xbiPresets">${list.map(v => `<button type="button" data-ml="${v}" class="${v===model.baseMl ? "active" : ""}"><b>${v}</b><span>ml</span>${v===model.baseMl ? `<small>${tr("base", "الأصلي")}</small>` : ""}</button>`).join("")}</div>
      <div class="xbiCustom" hidden><label><span>${tr("Required fill", "عيار التعبئة المطلوب")}</span><div><input type="number" inputmode="numeric" min="1" max="${MAX_CUSTOM_ML}" step="1" value="${model.baseMl}" data-custom><em>ml</em></div></label></div>
      <div class="xbiDynamic"></div>
      <div class="xbiActions"><button type="button" data-copy>${tr("Save as", "حفظ كنسخة")}</button><button type="button" data-hub>${tr("Open Recipe Hub", "فتح Recipe Hub")}</button></div>
      <div class="xbiStatus" aria-live="polite"></div>
      <div class="xbiMeta">${sourceMarkup(model)}<span>${model.kind === "tea" ? "Omni ≤160 ml / steep" : "Studio 5–18 g / brew"}</span></div>`;
    update(card, product, model, model.baseMl, false);
    bind(card, product, model);
  }
  function update(card, product, model, ml, preserveInput = false) {
    const r = calculate(model, ml); if (!r) return false;
    card.dataset.ml = String(r.targetMl);
    card.querySelector(".xbiDynamic").innerHTML = model.kind === "tea" ? teaScreen(product, model, r) : coffeeScreen(product, model, r);
    card.querySelectorAll("[data-ml]").forEach(b => b.classList.toggle("active", Number(b.dataset.ml) === r.targetMl));
    if (!preserveInput) card.querySelector("[data-custom]").value = String(r.targetMl);
    return true;
  }
  function bind(card, product, model) {
    const modePreset = card.querySelector('[data-mode="preset"]'), modeCustom = card.querySelector('[data-mode="custom"]');
    const presetsEl = card.querySelector(".xbiPresets"), customEl = card.querySelector(".xbiCustom"), input = card.querySelector("[data-custom]");
    const stop = e => e.stopPropagation();
    card.addEventListener("pointerdown", e => { if (e.target.closest("button,input,summary,a,label")) stop(e); }, true);
    modePreset.addEventListener("click", e => { e.preventDefault(); stop(e); modePreset.classList.add("active"); modeCustom.classList.remove("active"); presetsEl.hidden=false; customEl.hidden=true; });
    modeCustom.addEventListener("click", e => { e.preventDefault(); stop(e); modeCustom.classList.add("active"); modePreset.classList.remove("active"); customEl.hidden=false; presetsEl.hidden=true; setTimeout(() => input.focus({preventScroll:true}),0); });
    card.querySelectorAll("[data-ml]").forEach(btn => btn.addEventListener("click", e => { e.preventDefault(); stop(e); update(card, product, model, Number(btn.dataset.ml)); }));
    input.addEventListener("input", () => { const ml = Math.round(Number(input.value)); if (Number.isFinite(ml) && ml>=1 && ml<=MAX_CUSTOM_ML) update(card, product, model, ml, true); });
    input.addEventListener("change", () => { let ml = Math.round(Number(input.value)); if (!Number.isFinite(ml)) ml=model.baseMl; ml=Math.max(1,Math.min(MAX_CUSTOM_ML,ml)); input.value=String(ml); update(card,product,model,ml,true); });
    card.querySelector("[data-copy]").addEventListener("click", async e => { e.preventDefault(); stop(e); const r=calculate(model,Number(card.dataset.ml)); const ok=await copyText(recipeText(product,model,r)); card.querySelector(".xbiStatus").textContent=ok?tr("Recipe settings copied.","تم نسخ إعدادات الوصفة."):tr("Copy failed.","تعذر النسخ."); });
    card.querySelector("[data-hub]").addEventListener("click", async e => {
      e.preventDefault(); stop(e);
      const r=calculate(model,Number(card.dataset.ml));
      const exact=model.shareLinks?.[String(r.targetMl)] || model.shareLinks?.[r.targetMl];
      const target=exact || RECIPE_HUB_URL;
      const opened=window.open(target,"_blank","noopener");
      await copyText(recipeText(product,model,r));
      card.querySelector(".xbiStatus").textContent=exact?tr("Opening the saved xBloom recipe…","جاري فتح وصفة xBloom المحفوظة…"):tr("Settings copied. Recipe Hub opened in the browser.","تم نسخ الإعدادات وفتح Recipe Hub في المتصفح.");
      if (!opened) window.location.href=target;
    });
  }
  function attach(modal) {
    if (modal.dataset.xbiExact === "1") return;
    const product=identifyProduct(modal), model=product && MODELS[product.nameEn]; if (!product || !model) return;
    modal.dataset.xbiExact="1";
    modal.querySelectorAll(".v3XbloomV2,.v3XbloomBuilder,.v3SmartRecipe,.v2RecipeCard,.recipeCard").forEach(x => x.remove());
    const card=document.createElement("section"); card.className="xbiBuilder";
    (modal.querySelector(".modalContent") || modal).appendChild(card);
    renderShell(card,product,model);
  }

  function auditPass() {
    const errors=[];
    for (const [name,model] of Object.entries(MODELS)) {
      for (let ml=1; ml<=MAX_CUSTOM_ML; ml++) {
        const r=calculate(model,ml); if (!r) { errors.push(`${name}: no result ${ml}`); continue; }
        if (sum(r.cycleData.map(c=>c.ml))!==ml) errors.push(`${name}: cycle sum ${ml}`);
        if (model.kind==="tea") r.cycleData.forEach((c,ci)=>{ if (sum(c.stages.map(s=>s.ml))!==c.ml) errors.push(`${name}: stage sum ${ml}/${ci}`); if (c.stages.some(s=>s.ml>MAX_TEA_STEEP_ML)) errors.push(`${name}: >160 ${ml}/${ci}`); });
        else r.cycleData.forEach((c,ci)=>{ if (c.dose>COFFEE_MAX_G+.0001) errors.push(`${name}: >18g ${ml}/${ci}`); if (c.bloom+sum(c.pours)!==c.ml) errors.push(`${name}: pour sum ${ml}/${ci}`); });
      }
    }
    return errors;
  }
  const audits=[auditPass(),auditPass(),auditPass()];
  window.MJ_V3_EXACT={models:MODELS,calculate:(name,ml)=>MODELS[name]?calculate(MODELS[name],ml):null,audit:audits.map((e,i)=>({pass:i+1,ok:e.length===0,errors:e})),ok:audits.every(e=>e.length===0)};

  const obs=new MutationObserver(()=>requestAnimationFrame(()=>document.querySelectorAll(".productModal").forEach(attach)));
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("click",()=>setTimeout(()=>document.querySelectorAll(".productModal").forEach(attach),20),true);
  setTimeout(()=>document.querySelectorAll(".productModal").forEach(attach),0);
})();