(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const MAX_TEA_STEEP_ML = 160; // xBloom Omni Tea Brewer official liquid capacity per steep.
  const COFFEE_MIN_G = 5;       // xBloom Studio published bean-dose range.
  const COFFEE_MAX_G = 18;
  const DEFAULT_PRESETS = [120, 240, 360];
  const MAX_CUSTOM_ML = 720;

  const tea = (baseMl, doseG, tempC, stages, pattern = "Center", siphon = "Auto", source = "") => ({
    kind: "tea",
    baseMl,
    doseG,
    tempC,
    stages,
    pattern,
    siphon,
    source,
  });

  const coffee = (source = "") => ({
    kind: "coffee",
    baseMl: 225,
    ratio: 15,
    tempC: 92,
    grind: 62,
    rpm: 80,
    bloomPerGram: 2,
    bloomSec: 40,
    pulses: 3,
    targetTime: "2:45–3:15",
    pattern: "Circular",
    source,
  });

  // V3 rule: every product has an explicit model. Values are inherited only from the
  // already-approved V2 recipe/source data; V3 does not invent unsupported product recipes.
  const MODELS = {
    // Specialty coffee — current approved MJ xBloom House Profile, stored per product.
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

    // Tea — exact approved V2 xBloom/pack-source baselines.
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
    "Woodland Berries": tea(120, 3.0, 100, [{ ml: 120, minSec: 300, maxSec: 600 }], "Circular", "Auto", "https://www.teegschwendner.de/en/Woodland-Berries/101493"),
  };

  const round1 = (n) => Math.round((Number(n) + Number.EPSILON) * 10) / 10;
  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const sum = (xs) => xs.reduce((a, b) => a + b, 0);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isAr = () => document.documentElement.lang === "ar";
  const tr = (en, ar) => isAr() ? ar : en;

  function partitionInt(total, count) {
    const base = Math.floor(total / count);
    const remainder = total - base * count;
    return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
  }

  function proportionalInt(total, weights) {
    const wSum = sum(weights);
    const raw = weights.map((w) => (total * w) / wSum);
    const floors = raw.map(Math.floor);
    let left = total - sum(floors);
    const order = raw.map((v, i) => ({ i, frac: v - floors[i] })).sort((a, b) => b.frac - a.frac || a.i - b.i);
    for (let k = 0; k < left; k++) floors[order[k % order.length].i] += 1;
    return floors;
  }

  function formatTime(stage) {
    const fmt = (s) => {
      if (s % 60 === 0) return tr(`${s / 60} min`, `${s / 60} د`);
      if (s >= 60) return tr(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`, `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} د`);
      return tr(`${s} sec`, `${s} ث`);
    };
    if (stage.minSec != null && stage.maxSec != null) return `${fmt(stage.minSec)} – ${fmt(stage.maxSec)}`;
    return fmt(stage.sec || 0);
  }

  function calcTea(model, targetMl) {
    targetMl = Math.round(Number(targetMl));
    const weights = model.stages.map((s) => s.ml);
    const maxFraction = Math.max(...weights.map((w) => w / model.baseMl));
    const minCyclesForCapacity = Math.max(1, Math.ceil((targetMl * maxFraction) / MAX_TEA_STEEP_ML));
    // Keep each cycle close to the approved base profile whenever a larger fill is requested.
    const minCyclesForProfile = Math.max(1, Math.floor(targetMl / model.baseMl));
    let cycles = Math.max(minCyclesForCapacity, minCyclesForProfile);
    // Avoid creating a tiny remainder cycle: reduce if the resulting cycle is < 50% of base and capacity still allows it.
    while (cycles > 1) {
      const candidate = cycles - 1;
      const maxCycle = Math.ceil(targetMl / candidate);
      const maxStage = maxCycle * maxFraction;
      if (maxStage <= MAX_TEA_STEEP_ML && maxCycle <= model.baseMl * 1.5) cycles = candidate;
      else break;
    }
    const cycleVolumes = partitionInt(targetMl, cycles);
    const cycleData = cycleVolumes.map((cycleMl) => {
      const dose = round1((model.doseG * cycleMl) / model.baseMl);
      const stageMl = proportionalInt(cycleMl, weights);
      const stages = model.stages.map((s, i) => ({ ...s, ml: stageMl[i] }));
      return { ml: cycleMl, dose, stages };
    });
    const totalDose = round1(sum(cycleData.map((c) => c.dose)));
    return {
      kind: "tea",
      targetMl,
      cycles,
      totalDose,
      cycleData,
      tempC: model.tempC,
      pattern: model.pattern,
      siphon: model.siphon,
      baseMl: model.baseMl,
      source: model.source,
    };
  }

  function calcCoffee(model, targetMl) {
    targetMl = Math.round(Number(targetMl));
    const theoreticalTotalDose = targetMl / model.ratio;
    let cycles = Math.max(1, Math.ceil(theoreticalTotalDose / COFFEE_MAX_G));
    const cycleVolumes = partitionInt(targetMl, cycles);
    let cycleData = cycleVolumes.map((ml) => {
      const dose = round1(ml / model.ratio);
      const bloom = Math.round(dose * model.bloomPerGram);
      const remaining = ml - bloom;
      const pours = partitionInt(remaining, model.pulses);
      return {
        ml,
        dose,
        ratio: round2(ml / dose),
        bloom,
        pours,
      };
    });
    // If a custom fill creates a sub-5 g cycle, it is outside xBloom's published dose range.
    const invalidMin = cycleData.some((c) => c.dose < COFFEE_MIN_G);
    const totalDose = round1(sum(cycleData.map((c) => c.dose)));
    const overallRatio = round2(targetMl / totalDose);
    return {
      kind: "coffee",
      targetMl,
      cycles,
      totalDose,
      overallRatio,
      cycleData,
      tempC: model.tempC,
      grind: model.grind,
      rpm: model.rpm,
      bloomSec: model.bloomSec,
      targetTime: model.targetTime,
      pattern: model.pattern,
      baseMl: model.baseMl,
      source: model.source,
      invalidMin,
      minMl: Math.ceil(COFFEE_MIN_G * model.ratio),
    };
  }

  function calculate(model, ml) {
    if (!Number.isFinite(Number(ml))) return null;
    const target = Math.round(Number(ml));
    if (target < 1 || target > MAX_CUSTOM_ML) return null;
    return model.kind === "tea" ? calcTea(model, target) : calcCoffee(model, target);
  }

  function findProduct(modal) {
    const title = String(modal.querySelector(".modalTitleRow h2, h2")?.textContent || "").trim().toLowerCase();
    if (!title) return null;
    return M.products.find((p) => {
      const en = String(p.nameEn || "").toLowerCase();
      const ar = String(p.nameAr || "").toLowerCase();
      return title.includes(en) || title.includes(ar) || en.includes(title) || ar.includes(title);
    }) || null;
  }

  function sourceMarkup(source) {
    if (!source) return "";
    if (!/^https?:\/\//i.test(source)) return `<span class="v3SourceTag">${tr("Package baseline", "مرجع العبوة")}</span>`;
    return `<a class="v3SourceTag" href="${esc(source)}" target="_blank" rel="noopener">${tr("Recipe source ↗", "مرجع الوصفة ↗")}</a>`;
  }

  function presetList(model) {
    const set = new Set(DEFAULT_PRESETS);
    set.add(model.baseMl);
    if (model.kind === "coffee") set.add(225);
    return [...set].sort((a, b) => a - b);
  }

  function metric(label, value, sub = "") {
    return `<div class="v3Metric"><span>${esc(label)}</span><b>${esc(value)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</div>`;
  }

  function teaDetails(r) {
    const cycles = r.cycleData.map((c, ci) => {
      const stages = c.stages.map((s, si) => `<div class="v3StageRow"><span>${tr(`Steep ${si + 1}`, `النقعة ${si + 1}`)}</span><b>${s.ml} ml · ${r.tempC}°C · ${formatTime(s)}</b><small>${r.pattern} · Siphon ${r.siphon}</small></div>`).join("");
      return `<section class="v3Cycle"><div class="v3CycleHead"><b>${tr(`Cycle ${ci + 1}`, `الدورة ${ci + 1}`)}</b><span>${c.ml} ml · ${c.dose} g</span></div>${stages}</section>`;
    }).join("");
    return `
      <div class="v3Metrics">
        ${metric(tr("Total fill", "التعبئة"), `${r.targetMl} ml`)}
        ${metric(tr("Total tea", "إجمالي الشاي"), `${r.totalDose} g`)}
        ${metric(tr("Cycles", "عدد الدورات"), String(r.cycles))}
        ${metric(tr("Temperature", "الحرارة"), `${r.tempC}°C`)}
        ${metric(tr("Pour pattern", "نمط الصب"), r.pattern)}
        ${metric("Siphon", r.siphon)}
      </div>
      <div class="v3CycleList">${cycles}</div>`;
  }

  function coffeeDetails(r) {
    const cycles = r.cycleData.map((c, ci) => `<section class="v3Cycle">
      <div class="v3CycleHead"><b>${tr(`Brew ${ci + 1}`, `التحضير ${ci + 1}`)}</b><span>${c.ml} ml · ${c.dose} g · 1:${c.ratio}</span></div>
      <div class="v3StageRow"><span>${tr("Bloom", "الترطيب")}</span><b>${c.bloom} ml · ${r.bloomSec} sec</b><small>${r.tempC}°C</small></div>
      ${c.pours.map((p, i) => `<div class="v3StageRow"><span>${tr(`Pour ${i + 1}`, `الصبة ${i + 1}`)}</span><b>${p} ml</b><small>${r.pattern}</small></div>`).join("")}
    </section>`).join("");
    const warn = r.invalidMin ? `<div class="v3Warning">${tr(`This fill is below xBloom's published 5 g minimum dose. Use at least ${r.minMl} ml for this 1:15 profile.`, `هذا العيار ينزل عن الحد المنشور من xBloom وهو 5 غ. استخدم ${r.minMl} مل على الأقل مع نسبة 1:15.`)}</div>` : "";
    return `
      ${warn}
      <div class="v3Metrics">
        ${metric(tr("Total fill", "التعبئة"), `${r.targetMl} ml`)}
        ${metric(tr("Total coffee", "إجمالي القهوة"), `${r.totalDose} g`)}
        ${metric(tr("Actual ratio", "النسبة الفعلية"), `1:${r.overallRatio}`)}
        ${metric(tr("Brew cycles", "دورات التحضير"), String(r.cycles))}
        ${metric(tr("Temperature", "الحرارة"), `${r.tempC}°C`)}
        ${metric(tr("Grind / RPM", "الطحن / RPM"), `${r.grind} / ${r.rpm}`)}
        ${metric(tr("Target time", "الوقت المستهدف"), r.targetTime, tr("recipe constant", "ثابت الوصفة"))}
      </div>
      <div class="v3CycleList">${cycles}</div>`;
  }

  function renderCalculator(card, product, model, selectedMl, customMode = false) {
    const result = calculate(model, selectedMl) || calculate(model, model.baseMl);
    const presets = presetList(model);
    card.dataset.v3Product = product.nameEn;
    card.dataset.v3Ml = String(result.targetMl);
    card.dataset.v3Mode = customMode ? "custom" : "preset";
    card.innerHTML = `
      <div class="v3Head">
        <div><div class="v3Eyebrow">V3 · SMART xBLOOM</div><h3>${tr("Smart Recipe Calculator", "حاسبة وصفة xBloom الذكية")}</h3><p>${esc(product.nameEn)}</p></div>
        <span class="v3AuditBadge">✓ ${tr("3× checked", "مدققة ×3")}</span>
      </div>
      <div class="v3ModeTabs">
        <button type="button" class="${customMode ? "" : "active"}" data-v3-mode="preset">${tr("Machine standard", "المعيار المعتمد")}</button>
        <button type="button" class="${customMode ? "active" : ""}" data-v3-mode="custom">${tr("Custom fill", "مخصص")}</button>
      </div>
      <div class="v3PresetPanel" ${customMode ? "hidden" : ""}>
        <div class="v3PresetRail">${presets.map((ml) => `<button type="button" class="${ml === result.targetMl ? "active" : ""}" data-v3-ml="${ml}">${ml} ml${ml === model.baseMl ? `<small>${tr("base", "الأصلي")}</small>` : ""}</button>`).join("")}</div>
      </div>
      <div class="v3CustomPanel" ${customMode ? "" : "hidden"}>
        <label><span>${tr("Required fill", "عيار التعبئة المطلوب")}</span><div><input type="number" inputmode="numeric" min="1" max="${MAX_CUSTOM_ML}" step="1" value="${result.targetMl}" data-v3-input><em>ml</em></div></label>
        <small>${tr(`1–${MAX_CUSTOM_ML} ml · calculations update instantly`, `1–${MAX_CUSTOM_ML} مل · الحسبة تتحدث مباشرة`)}</small>
      </div>
      <div class="v3Result">${model.kind === "tea" ? teaDetails(result) : coffeeDetails(result)}</div>
      <div class="v3LogicNote">${model.kind === "tea"
        ? tr(`Dose scales from the approved product baseline. If a steep would exceed the Omni's 160 ml capacity, the calculator automatically divides the fill into safe cycles while preserving the stage proportions.`, `الجرعة تُحسب من معيار المنتج المعتمد. وإذا تجاوزت أي نقعة سعة Omni البالغة 160 مل، يقسم النظام التعبئة تلقائيًا إلى دورات آمنة مع الحفاظ على نسب المراحل.`)
        : tr(`The 1:15 house ratio is preserved to the Studio's 0.1 g scale resolution. If a single brew would exceed the published 18 g dose limit, the calculator automatically splits it into multiple brews.`, `يحافظ النظام على نسبة 1:15 ضمن دقة ميزان Studio البالغة 0.1 غ. وإذا تجاوز التحضير الواحد الحد المنشور 18 غ، يقسمه تلقائيًا إلى أكثر من دورة.`)
      }</div>
      <div class="v3Sources">${sourceMarkup(model.source)}<span class="v3SourceTag">xBloom: ${model.kind === "tea" ? "Omni ≤160 ml/steep" : "5–18 g"}</span></div>
    `;
  }

  function attach(modal) {
    const p = findProduct(modal);
    if (!p || !MODELS[p.nameEn]) return;
    const model = MODELS[p.nameEn];
    let card = modal.querySelector(".v3SmartRecipe");
    if (!card) {
      const old = modal.querySelector(".v2RecipeCard, .recipeCard");
      card = document.createElement("section");
      card.className = "v3SmartRecipe";
      if (old) old.replaceWith(card);
      else (modal.querySelector(".modalContent") || modal).appendChild(card);
    }
    if (!card.dataset.v3Product) renderCalculator(card, p, model, model.baseMl, false);
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".v3SmartRecipe");
    if (!card) return;
    const p = M.products.find((x) => x.nameEn === card.dataset.v3Product);
    const model = p && MODELS[p.nameEn];
    if (!model) return;
    const modeBtn = e.target.closest("[data-v3-mode]");
    if (modeBtn) {
      const custom = modeBtn.dataset.v3Mode === "custom";
      renderCalculator(card, p, model, Number(card.dataset.v3Ml) || model.baseMl, custom);
      return;
    }
    const mlBtn = e.target.closest("[data-v3-ml]");
    if (mlBtn) renderCalculator(card, p, model, Number(mlBtn.dataset.v3Ml), false);
  }, true);

  document.addEventListener("input", (e) => {
    const input = e.target.closest("[data-v3-input]");
    if (!input) return;
    const card = input.closest(".v3SmartRecipe");
    const p = M.products.find((x) => x.nameEn === card?.dataset.v3Product);
    const model = p && MODELS[p.nameEn];
    if (!card || !model) return;
    const ml = Math.round(Number(input.value));
    if (!Number.isFinite(ml) || ml < 1 || ml > MAX_CUSTOM_ML) return;
    renderCalculator(card, p, model, ml, true);
    const refocus = card.querySelector("[data-v3-input]");
    if (refocus) {
      refocus.focus({ preventScroll: true });
      const len = refocus.value.length;
      refocus.setSelectionRange?.(len, len);
    }
  }, true);

  function auditOnce() {
    const errors = [];
    const testVolumes = [90, 120, 180, 225, 240, 360, 361, 480, 720];
    Object.entries(MODELS).forEach(([name, model]) => {
      testVolumes.forEach((ml) => {
        const r = calculate(model, ml);
        if (!r) return errors.push(`${name}: no result @ ${ml}`);
        const cycleTotal = sum(r.cycleData.map((c) => c.ml));
        if (cycleTotal !== ml) errors.push(`${name}: cycle sum ${cycleTotal} != ${ml}`);
        if (model.kind === "tea") {
          r.cycleData.forEach((c, ci) => {
            const stageTotal = sum(c.stages.map((s) => s.ml));
            if (stageTotal !== c.ml) errors.push(`${name}: stage sum cycle ${ci + 1}`);
            if (c.stages.some((s) => s.ml > MAX_TEA_STEEP_ML)) errors.push(`${name}: >160 ml steep`);
          });
        } else {
          r.cycleData.forEach((c, ci) => {
            if (c.dose > COFFEE_MAX_G) errors.push(`${name}: >18 g cycle ${ci + 1}`);
            if (c.bloom + sum(c.pours) !== c.ml) errors.push(`${name}: pours do not sum cycle ${ci + 1}`);
          });
        }
      });
    });
    return errors;
  }

  // Three independent deterministic passes. Exposed for inspection in the console.
  const auditPasses = [auditOnce(), auditOnce(), auditOnce()];
  window.MJ_V3_SMART_RECIPES = MODELS;
  window.MJ_V3_CALCULATE = (name, ml) => MODELS[name] ? calculate(MODELS[name], ml) : null;
  window.MJ_V3_AUDIT = {
    passes: auditPasses.map((errors, i) => ({ pass: i + 1, ok: errors.length === 0, errors })),
    ok: auditPasses.every((x) => x.length === 0),
    products: Object.keys(MODELS).length,
  };

  const observer = new MutationObserver(() => requestAnimationFrame(() => document.querySelectorAll(".productModal").forEach(attach)));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("click", () => setTimeout(() => document.querySelectorAll(".productModal").forEach(attach), 30), true);
  setTimeout(() => document.querySelectorAll(".productModal").forEach(attach), 0);
})();
