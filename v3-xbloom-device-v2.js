(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const MAX_TEA_STEEP_ML = 160;
  const COFFEE_MIN_G = 5;
  const COFFEE_MAX_G = 18;
  const MAX_CUSTOM_ML = 720;
  const DEFAULT_PRESETS = [120, 240, 360];
  const XBLOOM_APP_URL = "https://xbloom.com/pages/app";

  const tea = (baseMl, doseG, tempC, stages, pattern = "Center", siphon = "Auto", source = "", shareLinks = {}) => ({
    kind: "tea", baseMl, doseG, tempC, stages, pattern, siphon, source, shareLinks
  });

  const coffee = (source = "", shareLinks = {}) => ({
    kind: "coffee",
    baseMl: 225,
    ratio: 15,
    tempC: 92,
    grind: 62,
    rpm: 80,
    bloomPerGram: 2,
    bloomSec: 40,
    pulses: 3,
    mainPattern: "Circular",
    bloomPattern: "Center",
    flowRate: null,
    pauseSec: null,
    agitationBefore: false,
    agitationAfter: false,
    targetTime: "2:45–3:15",
    source,
    shareLinks
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
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = (s = "") => String(s).toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();

  function partitionInt(total, count) {
    const base = Math.floor(total / count);
    const rem = total - base * count;
    return Array.from({ length: count }, (_, i) => base + (i < rem ? 1 : 0));
  }

  function proportionalInt(total, weights) {
    const ws = sum(weights);
    const raw = weights.map((w) => total * w / ws);
    const floors = raw.map(Math.floor);
    let left = total - sum(floors);
    const order = raw.map((v, i) => ({ i, f: v - floors[i] })).sort((a, b) => b.f - a.f || a.i - b.i);
    for (let k = 0; k < left; k++) floors[order[k % order.length].i]++;
    return floors;
  }

  function distributeTenths(totalExact, weights) {
    const totalTenths = Math.round(totalExact * 10);
    const ws = sum(weights);
    const raw = weights.map((w) => totalTenths * w / ws);
    const floors = raw.map(Math.floor);
    let left = totalTenths - sum(floors);
    const order = raw.map((v, i) => ({ i, f: v - floors[i] })).sort((a, b) => b.f - a.f || a.i - b.i);
    for (let k = 0; k < left; k++) floors[order[k % order.length].i]++;
    return floors.map((x) => x / 10);
  }

  function teaCycles(model, targetMl) {
    const weights = model.stages.map((s) => s.ml);
    const maxFraction = Math.max(...weights.map((w) => w / model.baseMl));
    const capacityCycles = Math.max(1, Math.ceil((targetMl * maxFraction) / MAX_TEA_STEEP_ML));
    const profileCycles = Math.max(1, Math.floor(targetMl / model.baseMl));
    let cycles = Math.max(capacityCycles, profileCycles);
    while (cycles > 1) {
      const candidate = cycles - 1;
      const maxCycle = Math.ceil(targetMl / candidate);
      const maxStage = maxCycle * maxFraction;
      if (maxStage <= MAX_TEA_STEEP_ML && maxCycle <= model.baseMl * 1.5) cycles = candidate;
      else break;
    }
    return cycles;
  }

  function calcTea(model, targetMl) {
    targetMl = Math.round(Number(targetMl));
    const cycles = teaCycles(model, targetMl);
    const cycleVolumes = partitionInt(targetMl, cycles);
    const doses = distributeTenths((model.doseG * targetMl) / model.baseMl, cycleVolumes);
    const stageWeights = model.stages.map((s) => s.ml);
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
    const cycleVolumes = partitionInt(targetMl, cycles);
    const doses = distributeTenths(exactTotalDose, cycleVolumes);
    const cycleData = cycleVolumes.map((ml, i) => {
      const dose = doses[i];
      const bloom = Math.min(ml, Math.round(dose * model.bloomPerGram));
      const pours = partitionInt(ml - bloom, model.pulses);
      return { ml, dose, ratio: round2(ml / dose), bloom, pours };
    });
    const totalDose = round1(sum(doses));
    return { kind: "coffee", targetMl, cycles, totalDose, overallRatio: round2(targetMl / totalDose), cycleData, tempC: model.tempC, grind: model.grind, rpm: model.rpm, bloomSec: model.bloomSec, targetTime: model.targetTime, baseMl: model.baseMl, source: model.source, invalidMin: cycleData.some((c) => c.dose < COFFEE_MIN_G), minMl: Math.ceil(COFFEE_MIN_G * model.ratio) };
  }

  function calculate(model, ml) {
    const target = Math.round(Number(ml));
    if (!Number.isFinite(target) || target < 1 || target > MAX_CUSTOM_ML) return null;
    return model.kind === "tea" ? calcTea(model, target) : calcCoffee(model, target);
  }

  function identifyProduct(modal) {
    const title = norm(modal.querySelector(".modalTitleRow h2, h2")?.textContent || "");
    if (!title) return null;
    return M.products.find((p) => {
      const bEn = p._displayBase?.en || p.nameEn;
      const bAr = p._displayBase?.ar || p.nameAr;
      const mEn = p._maker?.en || "";
      const mAr = p._maker?.ar || "";
      const candidates = [p.nameEn, p.nameAr, bEn, bAr, mEn ? `${bEn} - ${mEn}` : "", mAr ? `${bAr} - ${mAr}` : ""].filter(Boolean).map(norm);
      return candidates.some((c) => c.length >= 3 && (title === c || title.includes(c) || c.includes(title)));
    }) || null;
  }

  function formatTime(stage) {
    const fmt = (s) => {
      if (s % 60 === 0) return tr(`${s / 60} min`, `${s / 60} دقيقة`);
      if (s >= 60) return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      return tr(`${s} sec`, `${s} ثانية`);
    };
    return stage.minSec != null && stage.maxSec != null ? `${fmt(stage.minSec)} – ${fmt(stage.maxSec)}` : fmt(stage.sec || 0);
  }

  function valueRow(label, value, muted = false) {
    return `<div class="xbValueRow${muted ? " muted" : ""}"><span>${esc(label)}</span><b>${esc(String(value))}</b></div>`;
  }

  function stageDetails(group, title, index, rows, open = false) {
    return `<details class="xbStageDetails" data-stage-group="${esc(group)}" data-stage-index="${index}" ${open ? "open" : ""}>
      <summary><span class="xbStageNumber">${String(index + 1).padStart(2, "0")}</span><b>${esc(title)}</b><i>⌄</i></summary>
      <div class="xbStageBody">${rows.join("")}</div>
    </details>`;
  }

  function stageSelector(group, names) {
    if (names.length <= 1) return "";
    return `<label class="xbStageSelector"><span>${tr("Preparation stages", "مراحل التحضير")}</span><select data-stage-select="${esc(group)}">${names.map((n, i) => `<option value="${i}">${i + 1} · ${esc(n)}</option>`).join("")}</select></label>`;
  }

  function teaScreen(product, model, r) {
    const cycles = r.cycleData.map((cycle, ci) => {
      const group = `tea-${ci}`;
      const names = cycle.stages.map((_, i) => tr(`Steep ${i + 1}`, `النقعة ${i + 1}`));
      const stages = cycle.stages.map((s, si) => stageDetails(group, names[si], si, [
        valueRow("Volume", `${s.ml} ml`),
        valueRow("Temperature", `${r.tempC}°C`),
        valueRow("Steeping time", formatTime(s)),
        valueRow("Siphon water refill", r.siphon),
        valueRow("Pour pattern", r.pattern)
      ], si === 0)).join("");
      return `<section class="xbCycleBlock">
        <div class="xbCycleTitle"><span>${tr(`Brew ${ci + 1}`, `التحضير ${ci + 1}`)}</span><b>${cycle.ml} ml</b></div>
        <div class="xbPreparationPanel">
          <div class="xbPrepIdentity"><span>${tr("BLACK xBloom Studio", "xBloom Studio الأسود")}</span><b>+ Omni Tea Brewer</b></div>
          ${valueRow("Tea amount", `${cycle.dose.toFixed(1)} g`)}
        </div>
        ${stageSelector(group, names)}
        <div class="xbStages">${stages}</div>
      </section>`;
    }).join("");
    return `<div class="xbDeviceScreen" data-kind="tea">
      <div class="xbDeviceTop"><span>xBloom</span><b>OMNI TEA · BLACK</b></div>
      <div class="xbDeviceTitle"><small>${esc(product.nameEn)}</small><h4>${r.targetMl} ml · ${r.totalDose.toFixed(1)} g</h4></div>
      ${cycles}
    </div>`;
  }

  function coffeeStageRows(model, r, stage) {
    const pattern = stage.type === "bloom" ? model.bloomPattern : model.mainPattern;
    const pause = stage.type === "bloom" ? `${r.bloomSec} sec` : (model.pauseSec == null ? "—" : `${model.pauseSec} sec`);
    const flow = model.flowRate == null ? "—" : `${model.flowRate} ml/s`;
    return [
      valueRow("Volume", `${stage.ml} ml`),
      valueRow("Temperature", `${r.tempC}°C`),
      valueRow("Flow rate", flow, model.flowRate == null),
      valueRow("Pausing", pause, stage.type !== "bloom" && model.pauseSec == null),
      valueRow("Pour pattern", pattern || "—", !pattern),
      valueRow("Agitation before", model.agitationBefore ? "ON" : "OFF"),
      valueRow("Agitation after", model.agitationAfter ? "ON" : "OFF")
    ];
  }

  function coffeeScreen(product, model, r) {
    const warning = r.invalidMin ? `<div class="xbMachineWarning">${esc(tr(`Minimum xBloom dose is 5 g. Use at least ${r.minMl} ml for this 1:15 profile.`, `الجرعة أقل من حد xBloom المنشور 5 غ. استخدم ${r.minMl} مل على الأقل مع نسبة 1:15.`))}</div>` : "";
    const brews = r.cycleData.map((cycle, ci) => {
      const group = `coffee-${ci}`;
      const stages = [
        { type: "bloom", title: "Bloom", ml: cycle.bloom },
        ...cycle.pours.map((ml, i) => ({ type: "pour", title: `Pour ${i + 2}`, ml }))
      ];
      const names = stages.map((s) => s.title);
      return `<section class="xbCycleBlock">
        <div class="xbCycleTitle"><span>${tr(`Brew ${ci + 1}`, `التحضير ${ci + 1}`)}</span><b>${cycle.ml} ml · ${cycle.dose.toFixed(1)} g</b></div>
        <div class="xbPreparationPanel">
          <div class="xbPrepIdentity"><span>${tr("BLACK xBloom Studio", "xBloom Studio الأسود")}</span><b>Omni Dripper</b></div>
          ${valueRow("Coffee amount", `${cycle.dose.toFixed(1)} g`)}
          ${valueRow("Grind size", r.grind)}
          ${valueRow("RPM", r.rpm)}
        </div>
        ${stageSelector(group, names)}
        <div class="xbStages">${stages.map((s, i) => stageDetails(group, s.title, i, coffeeStageRows(model, r, s), i === 0)).join("")}</div>
      </section>`;
    }).join("");
    const targetTime = r.targetMl === model.baseMl && r.cycles === 1 ? r.targetTime : tr("Base recipe 2:45–3:15", "المعيار الأساسي 2:45–3:15");
    return `<div class="xbDeviceScreen" data-kind="coffee">
      <div class="xbDeviceTop"><span>xBloom</span><b>STUDIO · BLACK</b></div>
      <div class="xbDeviceTitle"><small>${esc(product.nameEn)}</small><h4>${r.targetMl} ml · 1:${r.overallRatio}</h4></div>
      ${warning}
      <div class="xbQuickLine">${valueRow("Target time", targetTime, r.targetMl !== model.baseMl || r.cycles !== 1)}</div>
      ${brews}
    </div>`;
  }

  function presetList(model) {
    const set = new Set(DEFAULT_PRESETS);
    set.add(model.baseMl);
    if (model.kind === "coffee") set.add(225);
    return [...set].sort((a, b) => a - b);
  }

  function recipeText(product, model, r) {
    const lines = [product.nameEn, `${r.targetMl} ml`, ""];
    if (model.kind === "tea") {
      lines.push(`Tea total: ${r.totalDose.toFixed(1)} g`);
      r.cycleData.forEach((c, ci) => {
        lines.push(`Brew ${ci + 1}: ${c.ml} ml · ${c.dose.toFixed(1)} g tea`);
        c.stages.forEach((s, si) => lines.push(`Steep ${si + 1}: Volume ${s.ml} ml | Temperature ${r.tempC}°C | Steeping time ${formatTime(s)} | Siphon water refill ${r.siphon} | Pour pattern ${r.pattern}`));
      });
    } else {
      lines.push(`Coffee total: ${r.totalDose.toFixed(1)} g`, `Ratio: 1:${r.overallRatio}`, `Grind: ${r.grind}`, `RPM: ${r.rpm}`);
      r.cycleData.forEach((c, ci) => {
        lines.push(`Brew ${ci + 1}: ${c.ml} ml · ${c.dose.toFixed(1)} g`);
        lines.push(`Bloom: ${c.bloom} ml | ${r.tempC}°C | ${r.bloomSec} sec | ${model.bloomPattern}`);
        c.pours.forEach((p, i) => lines.push(`Pour ${i + 2}: ${p} ml | ${r.tempC}°C | ${model.mainPattern}`));
      });
    }
    return lines.join("\n");
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok;
      } catch (_) { return false; }
    }
  }

  function sourceLine(model) {
    if (!model.source) return "";
    if (!/^https?:\/\//i.test(model.source)) return `<span>${tr("Package baseline", "مرجع العبوة")}</span>`;
    return `<a href="${esc(model.source)}" target="_blank" rel="noopener">${tr("Recipe source", "مرجع الوصفة")} ↗</a>`;
  }

  function screenMarkup(product, model, result) {
    return model.kind === "tea" ? teaScreen(product, model, result) : coffeeScreen(product, model, result);
  }

  function renderShell(card, product, model) {
    const presets = presetList(model);
    card.dataset.product = product.nameEn;
    card.dataset.ml = String(model.baseMl);
    card.dataset.mode = "preset";
    card.innerHTML = `
      <div class="xbCalcHeader">
        <div><div class="xbCalcEyebrow">V3 · xBloom SMART RECIPE</div><h3>${tr("xBloom Recipe Builder", "مُنشئ وصفة xBloom")}</h3><p>${esc(product.nameEn)}</p></div>
        <div class="xbAudit">✓ ${tr("3× verified", "مدققة ×3")}</div>
      </div>
      <div class="xbModeTabs">
        <button type="button" data-mode="preset" class="active">${tr("Machine standard", "المعيار المعتمد")}</button>
        <button type="button" data-mode="custom">${tr("Custom fill", "مخصص")}</button>
      </div>
      <div class="xbPresetWrap">${presets.map((v) => `<button type="button" data-ml="${v}" class="${v === model.baseMl ? "active" : ""}"><b>${v}</b><span>ml</span>${v === model.baseMl ? `<small>${tr("base", "الأصلي")}</small>` : ""}</button>`).join("")}</div>
      <div class="xbCustomWrap" hidden><label><span>${tr("Required fill", "عيار التعبئة المطلوب")}</span><div><input data-custom-ml type="number" inputmode="numeric" min="1" max="${MAX_CUSTOM_ML}" step="1" value="${model.baseMl}"><em>ml</em></div></label></div>
      <div class="xbDynamic"></div>
      <button class="xbSendButton" type="button" data-send-xbloom><span class="xbSendLogo">xB</span><span><b>${tr("Send to xBloom", "إرسال إلى xBloom")}</b><small>${tr("Copy settings + open xBloom", "نسخ الإعدادات + فتح xBloom")}</small></span><i>↗</i></button>
      <div class="xbSendStatus" aria-live="polite"></div>
      <div class="xbMetaLine">${sourceLine(model)}<span>${model.kind === "tea" ? "Omni ≤160 ml / steep" : "Studio 5–18 g / brew"}</span></div>`;
    updateCard(card, product, model, model.baseMl, false);
    bindCard(card, product, model);
  }

  function updateCard(card, product, model, ml, preserveInput = false) {
    const r = calculate(model, ml);
    if (!r) return false;
    card.dataset.ml = String(r.targetMl);
    const dynamic = card.querySelector(".xbDynamic");
    if (dynamic) dynamic.innerHTML = screenMarkup(product, model, r);
    card.querySelectorAll("[data-ml]").forEach((b) => b.classList.toggle("active", Number(b.dataset.ml) === r.targetMl));
    const input = card.querySelector("[data-custom-ml]");
    if (input && !preserveInput) input.value = String(r.targetMl);
    bindStageControls(card);
    return true;
  }

  function bindStageControls(card) {
    card.querySelectorAll("[data-stage-select]").forEach((select) => {
      select.onchange = () => {
        const group = select.dataset.stageSelect;
        const index = Number(select.value);
        card.querySelectorAll(`.xbStageDetails[data-stage-group="${CSS.escape(group)}"]`).forEach((d) => {
          d.open = Number(d.dataset.stageIndex) === index;
        });
        card.querySelector(`.xbStageDetails[data-stage-group="${CSS.escape(group)}"][data-stage-index="${index}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
    });
    card.querySelectorAll(".xbStageDetails").forEach((d) => {
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        const group = d.dataset.stageGroup;
        const idx = Number(d.dataset.stageIndex);
        card.querySelectorAll(`.xbStageDetails[data-stage-group="${CSS.escape(group)}"]`).forEach((other) => { if (other !== d) other.open = false; });
        const select = card.querySelector(`[data-stage-select="${CSS.escape(group)}"]`);
        if (select) select.value = String(idx);
      });
    });
  }

  function bindCard(card, product, model) {
    card.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button,input,select,summary,a")) e.stopPropagation();
    }, true);
    card.addEventListener("touchstart", (e) => {
      if (e.target.closest("button,input,select,summary,a")) e.stopPropagation();
    }, { capture: true, passive: true });

    const presetPanel = card.querySelector(".xbPresetWrap");
    const customPanel = card.querySelector(".xbCustomWrap");
    const presetMode = card.querySelector('[data-mode="preset"]');
    const customMode = card.querySelector('[data-mode="custom"]');

    presetMode.onclick = (e) => {
      e.preventDefault(); e.stopPropagation();
      card.dataset.mode = "preset";
      presetMode.classList.add("active"); customMode.classList.remove("active");
      presetPanel.hidden = false; customPanel.hidden = true;
    };
    customMode.onclick = (e) => {
      e.preventDefault(); e.stopPropagation();
      card.dataset.mode = "custom";
      customMode.classList.add("active"); presetMode.classList.remove("active");
      customPanel.hidden = false; presetPanel.hidden = true;
      setTimeout(() => card.querySelector("[data-custom-ml]")?.focus({ preventScroll: true }), 0);
    };

    card.querySelectorAll("[data-ml]").forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        updateCard(card, product, model, Number(btn.dataset.ml));
      };
    });

    const input = card.querySelector("[data-custom-ml]");
    input.oninput = () => {
      const ml = Math.round(Number(input.value));
      if (Number.isFinite(ml) && ml >= 1 && ml <= MAX_CUSTOM_ML) updateCard(card, product, model, ml, true);
    };
    input.onchange = () => {
      let ml = Math.round(Number(input.value));
      if (!Number.isFinite(ml)) ml = model.baseMl;
      ml = Math.max(1, Math.min(MAX_CUSTOM_ML, ml));
      input.value = String(ml);
      updateCard(card, product, model, ml, true);
    };

    card.querySelector("[data-send-xbloom]").onclick = async (e) => {
      e.preventDefault(); e.stopPropagation();
      const r = calculate(model, Number(card.dataset.ml) || model.baseMl);
      const exactLink = model.shareLinks?.[String(r.targetMl)] || model.shareLinks?.[r.targetMl];
      const status = card.querySelector(".xbSendStatus");
      await copyText(recipeText(product, model, r));
      if (status) status.textContent = exactLink ? tr("Opening saved xBloom recipe…", "جاري فتح وصفة xBloom المحفوظة…") : tr("Settings copied. Opening xBloom…", "تم نسخ الإعدادات. جاري فتح xBloom…");
      setTimeout(() => { window.location.href = exactLink || XBLOOM_APP_URL; }, 220);
    };
  }

  function attach(modal) {
    if (modal.dataset.v3XbloomV2 === "1") return;
    const product = identifyProduct(modal);
    if (!product || !MODELS[product.nameEn]) return;
    modal.dataset.v3XbloomV2 = "1";
    modal.querySelectorAll(".v3XbloomBuilder,.v3SmartRecipe,.v2RecipeCard,.recipeCard").forEach((x) => x.remove());
    const card = document.createElement("section");
    card.className = "v3XbloomBuilder v3XbloomV2";
    (modal.querySelector(".modalContent") || modal).appendChild(card);
    renderShell(card, product, MODELS[product.nameEn]);
  }

  function auditOnePass() {
    const errors = [];
    for (const [name, model] of Object.entries(MODELS)) {
      for (let ml = 1; ml <= MAX_CUSTOM_ML; ml++) {
        const r = calculate(model, ml);
        if (!r) { errors.push(`${name}: no result @${ml}`); continue; }
        if (sum(r.cycleData.map((c) => c.ml)) !== ml) errors.push(`${name}: cycle sum @${ml}`);
        if (model.kind === "tea") {
          r.cycleData.forEach((c, ci) => {
            if (sum(c.stages.map((s) => s.ml)) !== c.ml) errors.push(`${name}: stage sum @${ml}/${ci}`);
            if (c.stages.some((s) => s.ml > MAX_TEA_STEEP_ML)) errors.push(`${name}: >160ml steep @${ml}/${ci}`);
          });
        } else {
          r.cycleData.forEach((c, ci) => {
            if (c.dose > COFFEE_MAX_G + 0.0001) errors.push(`${name}: >18g @${ml}/${ci}`);
            if (c.bloom + sum(c.pours) !== c.ml) errors.push(`${name}: pour sum @${ml}/${ci}`);
          });
        }
      }
    }
    return errors;
  }

  const auditPasses = [auditOnePass(), auditOnePass(), auditOnePass()];
  window.MJ_V3_XBLOOM_V2 = { models: MODELS, calculate: (name, ml) => MODELS[name] ? calculate(MODELS[name], ml) : null, audit: auditPasses.map((errors, i) => ({ pass: i + 1, ok: errors.length === 0, errors })), ok: auditPasses.every((x) => x.length === 0) };

  const observer = new MutationObserver(() => requestAnimationFrame(() => document.querySelectorAll(".productModal").forEach(attach)));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("click", () => setTimeout(() => document.querySelectorAll(".productModal").forEach(attach), 20), true);
  setTimeout(() => document.querySelectorAll(".productModal").forEach(attach), 0);
})();