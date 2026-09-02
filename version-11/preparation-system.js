(() => {
  'use strict';

  const MENU = window.MJ_MENU;
  if (!MENU) return;

  const PRODUCTS = MENU.products || [];
  const SOURCES = window.MJ_SOURCES?.products || {};
  const FIXED_VOLUMES = [120, 240, 360];
  const STEP_ML = 5;

  // Only recipes whose product identity and machine values are verified are stored here.
  // Missing values stay null: Edition 11 never fills an unknown field by assumption.
  const COFFEE_RECIPES = {
    'Bourbon Sidra Sakura': {
      hot: {
        labelEn: 'Sidra Sakura Bourbon',
        labelAr: 'سيدرا ساكورا بوربون',
        masterMl: 255,
        doseG: 17,
        ratio: 15,
        grind: 50,
        rpm: 120,
        shareUrl: null,
        pours: [
          { name: 'Bloom',  ml: 60, tempC: 90, sec: null, flow: null, pause: null, pattern: null, agitationBefore: null, agitationAfter: null },
          { name: 'Pour 2', ml: 60, tempC: 90, sec: null, flow: null, pause: null, pattern: null, agitationBefore: null, agitationAfter: null },
          { name: 'Pour 3', ml: 50, tempC: 90, sec: null, flow: null, pause: null, pattern: null, agitationBefore: null, agitationAfter: null },
          { name: 'Pour 4', ml: 45, tempC: 85, sec: null, flow: null, pause: null, pattern: null, agitationBefore: null, agitationAfter: null },
          { name: 'Pour 5', ml: 40, tempC: 85, sec: null, flow: null, pause: null, pattern: null, agitationBefore: null, agitationAfter: null }
        ],
        evidenceEn: 'Verified from the saved xBloom recipe screenshot.',
        evidenceAr: 'موثقة من لقطة وصفة xBloom المحفوظة.'
      }
    }
  };

  const METHODS_PAGES = {
    'CGLE Tres Dragones': 'https://methods.coffee/products/cgle-tres-dragones',
    'Pink Bourbon Punch': 'https://methods.coffee/products/pink-bourbon-punch',
    'Bourbon Sidra Sakura': 'https://methods.coffee/products/bourbon-sidra-sakura',
    'EA Decaf De Cana': 'https://methods.coffee/products/ea-decaf-de-cana',
    'Methods Roastery – Honey Double Fermentation': 'https://methods.coffee/products/honey-double-fermentation-pink-bourbon-exclusive-lot'
  };

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);
  const norm = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
  const isAr = () => document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const tr = (en, ar) => isAr() ? ar : en;
  const round = (n, digits = 2) => Number(Number(n).toFixed(digits));
  const fmt = (n, digits = 2) => {
    if (n == null || n === '' || Number.isNaN(Number(n))) return '—';
    return Number(n).toFixed(digits).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '').replace(/\.$/, '');
  };

  function sourceFor(product) {
    return SOURCES[product.nameEn] || null;
  }

  function officialRecipeUrl(product) {
    return METHODS_PAGES[product.nameEn] || sourceFor(product)?.source || '';
  }

  function resolveProduct(modal) {
    const title = norm(modal.querySelector('.modalTitleRow h2, .modalContent h2, h2')?.textContent);
    if (!title) return null;
    return PRODUCTS.find(p => {
      const names = [p.nameEn, p.nameAr, p._displayBase?.en, p._displayBase?.ar].filter(Boolean).map(norm);
      return names.some(name => title === name || (name.length > 3 && (title.includes(name) || name.includes(title))));
    }) || null;
  }

  function isCompatible(product) {
    return product?.cat === 'specialty' || product?.cat === 'tea';
  }

  function teaMaster(product, mode) {
    if (mode !== 'hot') return null;
    const brew = sourceFor(product)?.brew;
    if (!brew || !Number.isFinite(Number(brew.gpl))) return null;
    return {
      kind: 'tea',
      masterMl: 1000,
      gpl: Number(brew.gpl),
      tempC: Number.isFinite(Number(brew.temp)) ? Number(brew.temp) : null,
      steepTime: brew.time || null,
      shareUrl: null,
      sourceUrl: sourceFor(product)?.source || '',
      evidenceEn: 'Official manufacturer preparation reference.',
      evidenceAr: 'مرجع التحضير الرسمي من الشركة.'
    };
  }

  function coffeeMaster(product, mode) {
    return COFFEE_RECIPES[product.nameEn]?.[mode] || null;
  }

  function masterFor(product, mode) {
    if (product.cat === 'tea') return teaMaster(product, mode);
    if (product.cat === 'specialty') return coffeeMaster(product, mode);
    return null;
  }

  function quantizePours(pours, targetMl) {
    if (!Array.isArray(pours) || !pours.length || !Number.isFinite(Number(targetMl))) return [];
    const target = Number(targetMl);
    const originalTotal = pours.reduce((sum, p) => sum + Number(p.ml || 0), 0);
    if (originalTotal <= 0 || target % STEP_ML !== 0) return [];

    const raw = pours.map((p, index) => {
      const exact = Number(p.ml || 0) / originalTotal * target;
      const base = Math.max(Number(p.ml || 0) > 0 ? STEP_ML : 0, Math.floor(exact / STEP_ML) * STEP_ML);
      return { index, exact, base, frac: exact - base };
    });

    let sum = raw.reduce((s, x) => s + x.base, 0);
    while (sum > target) {
      const candidates = raw.filter(x => x.base > STEP_ML).sort((a,b) => a.frac - b.frac || b.base - a.base);
      if (!candidates.length) break;
      candidates[0].base -= STEP_ML;
      sum -= STEP_ML;
    }
    while (sum < target) {
      const candidates = [...raw].sort((a,b) => b.frac - a.frac || a.index - b.index);
      if (!candidates.length) break;
      candidates[0].base += STEP_ML;
      candidates[0].frac -= STEP_ML;
      sum += STEP_ML;
    }

    if (sum !== target) return [];
    return pours.map((p, i) => ({ ...p, ml: raw[i].base }));
  }

  function scaledRecipe(product, mode, targetMl) {
    const master = masterFor(product, mode);
    if (!master) return null;

    if (master.kind === 'tea') {
      return {
        kind: 'tea',
        master,
        targetMl,
        doseG: round(master.gpl * targetMl / 1000, 2),
        tempC: master.tempC,
        steepTime: master.steepTime,
        shareUrl: targetMl === master.masterMl ? master.shareUrl : null,
        sourceUrl: master.sourceUrl
      };
    }

    const ratio = Number(master.ratio) || (master.masterMl / master.doseG);
    const pours = quantizePours(master.pours, targetMl);
    if (!pours.length) return null;
    return {
      kind: 'coffee',
      master,
      targetMl,
      doseG: round(targetMl / ratio, 1),
      ratio,
      grind: master.grind ?? null,
      rpm: master.rpm ?? null,
      pours,
      shareUrl: targetMl === master.masterMl ? master.shareUrl : null,
      sourceUrl: officialRecipeUrl(product)
    };
  }

  function injectStyles() {
    if (document.getElementById('v11PrepStyles')) return;
    const style = document.createElement('style');
    style.id = 'v11PrepStyles';
    style.textContent = `
      .productModal .v6PrepHub{display:none!important}
      .v11Prep{margin:20px 0 0;border:1px solid rgba(211,171,96,.33);border-radius:22px;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.012));color:#eee6d9}
      .v11Head{padding:20px 18px 8px;text-align:center}.v11Kicker{color:#cfa45b;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.v11Head h3{margin:6px 0 3px;font-size:1.35rem;color:#f5ebdc}.v11Head p{margin:0;color:rgba(255,255,255,.52);font-size:.82rem}
      .v11Body{padding:14px 18px 19px}.v11Label{display:block;margin:2px 0 9px;color:#d7ae67;font-size:.79rem;font-weight:700}
      .v11Volumes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.v11Choice,.v11Mode{appearance:none;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.025);color:#d9d0c3;border-radius:13px;padding:12px 8px;font:inherit;font-weight:650}.v11Choice.active,.v11Mode.active{border-color:#d4a654;background:linear-gradient(180deg,#dcb262,#b98236);color:#15110b;box-shadow:0 5px 18px rgba(190,132,48,.16)}
      .v11ModeRow{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}.v11Mode[disabled]{opacity:.35;cursor:not-allowed}.v11OriginNote{margin:10px 0 0;padding:10px 12px;border-radius:12px;background:rgba(211,171,96,.06);border:1px solid rgba(211,171,96,.13);color:rgba(255,255,255,.62);font-size:.77rem;line-height:1.6;text-align:center}
      .v11Summary{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px;margin-top:15px}.v11Metric{padding:11px 8px;border:1px solid rgba(255,255,255,.075);border-radius:13px;background:rgba(255,255,255,.025);text-align:center;min-width:0}.v11Metric small{display:block;color:rgba(255,255,255,.45);font-size:.66rem;margin-bottom:5px}.v11Metric b{display:block;color:#f1d59d;font-size:.94rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .v11SectionTitle{display:flex;align-items:center;gap:10px;margin:18px 0 9px;color:#d9ae62;font-weight:700;font-size:.86rem}.v11SectionTitle:before,.v11SectionTitle:after{content:"";height:1px;flex:1;background:rgba(211,171,96,.22)}
      .v11Pours{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:8px}.v11Pour{border:1px solid rgba(211,171,96,.18);border-radius:14px;padding:11px;background:rgba(255,255,255,.018);text-align:center}.v11Pour strong{color:#e5bc73}.v11Pour dl{display:grid;grid-template-columns:1fr 1fr;gap:5px 8px;margin:8px 0 0;font-size:.73rem}.v11Pour dt{color:rgba(255,255,255,.43);text-align:start}.v11Pour dd{margin:0;color:#eee4d6;text-align:end}
      .v11Message{margin-top:14px;padding:14px;border:1px dashed rgba(255,255,255,.14);border-radius:14px;color:rgba(255,255,255,.64);font-size:.84rem;line-height:1.7}.v11Message b{color:#e7c481}
      .v11Action{display:flex;align-items:center;justify-content:center;width:100%;box-sizing:border-box;margin-top:15px;padding:14px 16px;border:1px solid #d0a252;border-radius:14px;background:linear-gradient(180deg,#e0b861,#c98d38);color:#17110a;text-decoration:none;font-weight:800;font-size:.94rem}.v11Action.fallback{background:rgba(211,171,96,.08);color:#e1bd7a}.v11Action[aria-disabled="true"]{opacity:.42;pointer-events:none}
      .v11ScaleNote{margin-top:10px;color:rgba(255,255,255,.48);font-size:.73rem;line-height:1.55;text-align:center}
      .v11Custom{margin-top:15px}.v11CustomGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.v11Field{display:flex;flex-direction:column;gap:5px;min-width:0}.v11Field span{font-size:.68rem;color:rgba(255,255,255,.48)}.v11Field input,.v11Field select{width:100%;box-sizing:border-box;padding:10px 9px;border-radius:10px;border:1px solid rgba(255,255,255,.11);background:#0b0a08;color:#f1e9dc;font:inherit;font-size:.82rem}
      .v11CustomPours{margin-top:12px}.v11CustomPour{display:grid;grid-template-columns:1.15fr repeat(7,minmax(62px,.75fr)) 34px;gap:6px;margin-top:7px;align-items:end}.v11CustomPour input,.v11CustomPour select{min-width:0;width:100%;box-sizing:border-box;padding:8px 6px;border-radius:9px;border:1px solid rgba(255,255,255,.10);background:#0b0a08;color:#eee5d8;font:inherit;font-size:.72rem}.v11Remove{appearance:none;border:1px solid rgba(255,255,255,.10);background:transparent;color:#d9a95e;border-radius:9px;height:34px}.v11CustomActions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.v11MiniBtn{appearance:none;border:1px solid rgba(211,171,96,.30);background:rgba(211,171,96,.07);color:#e4c17d;border-radius:11px;padding:9px 12px;font:inherit;font-size:.78rem}.v11State{min-height:1.1em;margin-top:8px;color:#b9aa91;font-size:.73rem}
      @media(max-width:760px){.v11Body{padding:13px}.v11Volumes{grid-template-columns:repeat(2,1fr)}.v11Summary{grid-template-columns:repeat(3,1fr)}.v11CustomGrid{grid-template-columns:repeat(2,1fr)}.v11CustomPour{grid-template-columns:repeat(2,minmax(0,1fr));padding:9px;border:1px solid rgba(255,255,255,.07);border-radius:12px}.v11Remove{grid-column:1/-1}.v11Pours{grid-template-columns:1fr 1fr}}
      @media(max-width:390px){.v11Summary{grid-template-columns:repeat(2,1fr)}.v11Pours{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function metric(label, value) {
    return `<div class="v11Metric"><small>${esc(label)}</small><b>${esc(value ?? '—')}</b></div>`;
  }

  function recipeSummary(recipe) {
    if (recipe.kind === 'tea') {
      return [
        metric(tr('Tea','الشاي'), `${fmt(recipe.doseG)} g`),
        metric(tr('Water','الماء'), `${recipe.targetMl} ml`),
        metric(tr('Temperature','الحرارة'), recipe.tempC == null ? '—' : `${recipe.tempC}°C`),
        metric(tr('Steep','النقع'), recipe.steepTime || '—'),
        metric(tr('Reference','المرجع'), `${recipe.master.gpl} g/L`),
        metric(tr('Stages','المراحل'), '1')
      ].join('');
    }
    const temps = [...new Set(recipe.pours.map(p => p.tempC).filter(v => v != null))];
    return [
      metric(tr('Dose','الجرعة'), `${fmt(recipe.doseG,1)} g`),
      metric(tr('Water','الماء'), `${recipe.targetMl} ml`),
      metric('Ratio', `1:${fmt(recipe.ratio,1)}`),
      metric(tr('Grind','الطحن'), recipe.grind ?? '—'),
      metric('RPM', recipe.rpm ?? '—'),
      metric(tr('Pours','الصبات'), String(recipe.pours.length))
    ].join('') + (temps.length ? `<div class="v11ScaleNote">${esc(tr('Temperatures preserved from the master recipe: ','درجات الحرارة محفوظة من الوصفة الأصلية: '))}${esc(temps.map(x=>`${x}°C`).join(' · '))}</div>` : '');
  }

  function pourCards(recipe) {
    if (recipe.kind === 'tea') {
      return `<div class="v11Pour"><strong>${esc(tr('Official steep','النقع الرسمي'))}</strong><dl><dt>${esc(tr('Volume','الحجم'))}</dt><dd>${recipe.targetMl} ml</dd><dt>${esc(tr('Temperature','الحرارة'))}</dt><dd>${recipe.tempC == null ? '—' : `${recipe.tempC}°C`}</dd><dt>${esc(tr('Time','الوقت'))}</dt><dd>${esc(recipe.steepTime || '—')}</dd></dl></div>`;
    }
    return recipe.pours.map((p, i) => `<div class="v11Pour"><strong>${i+1}. ${esc(p.name || `Pour ${i+1}`)}</strong><dl><dt>ml</dt><dd>${esc(p.ml)}</dd><dt>°C</dt><dd>${p.tempC == null ? '—' : esc(p.tempC)}</dd><dt>${esc(tr('Time','الوقت'))}</dt><dd>${p.sec == null ? '—' : `${esc(p.sec)}s`}</dd><dt>${esc(tr('Flow','التدفق'))}</dt><dd>${p.flow ?? '—'}</dd><dt>${esc(tr('Pattern','النمط'))}</dt><dd>${esc(p.pattern || '—')}</dd><dt>${esc(tr('Agit. before','تحريك قبل'))}</dt><dd>${p.agitationBefore ?? '—'}</dd><dt>${esc(tr('Agit. after','تحريك بعد'))}</dt><dd>${p.agitationAfter ?? '—'}</dd><dt>${esc(tr('Pause','توقف'))}</dt><dd>${p.pause ?? '—'}</dd></dl></div>`).join('');
  }

  function customKey(product, mode) {
    return `mj-v11-custom:${product.nameEn}:${mode}`;
  }

  function defaultCustom(product, mode) {
    const master = masterFor(product, mode);
    if (product.cat === 'tea') {
      return {
        kind:'tea', doseG: master?.gpl ? round(master.gpl * 120 / 1000,2) : '', waterMl:120,
        tempC: master?.tempC ?? '', steepTime: master?.steepTime || '', siphon:'Auto', pattern:'Centered',
        stages:[{name:'Steep 1',ml:120,tempC:master?.tempC ?? '',sec:'',flow:'',pause:'',pattern:'Centered',agitationBefore:'',agitationAfter:''}]
      };
    }
    return {
      kind:'coffee', doseG: master?.doseG ?? '', waterMl: master?.masterMl ?? 240, ratio: master?.ratio ?? '',
      grind: master?.grind ?? '', rpm: master?.rpm ?? '',
      pours: master?.pours?.map(p => ({...p})) || [{name:'Bloom',ml:'',tempC:'',sec:'',flow:'',pause:'',pattern:'Centered',agitationBefore:'',agitationAfter:''}]
    };
  }

  function loadCustom(product, mode) {
    try { return JSON.parse(localStorage.getItem(customKey(product,mode))) || defaultCustom(product,mode); }
    catch { return defaultCustom(product,mode); }
  }

  function customPourRow(pour, index) {
    return `<div class="v11CustomPour" data-v11-pour="${index}">
      <input data-f="name" value="${esc(pour.name || `Pour ${index+1}`)}" aria-label="Stage">
      <input data-f="ml" inputmode="decimal" value="${esc(pour.ml ?? '')}" placeholder="ml">
      <input data-f="tempC" inputmode="decimal" value="${esc(pour.tempC ?? '')}" placeholder="°C">
      <input data-f="sec" inputmode="decimal" value="${esc(pour.sec ?? '')}" placeholder="sec">
      <input data-f="flow" inputmode="decimal" value="${esc(pour.flow ?? '')}" placeholder="Flow">
      <input data-f="pause" inputmode="decimal" value="${esc(pour.pause ?? '')}" placeholder="Pause">
      <select data-f="pattern"><option ${pour.pattern==='Centered'?'selected':''}>Centered</option><option ${pour.pattern==='Spiral'?'selected':''}>Spiral</option><option ${pour.pattern==='Circular'?'selected':''}>Circular</option></select>
      <input data-f="agitationBefore" inputmode="decimal" value="${esc(pour.agitationBefore ?? '')}" placeholder="Agit. before">
      <input data-f="agitationAfter" inputmode="decimal" value="${esc(pour.agitationAfter ?? '')}" placeholder="Agit. after">
      <button class="v11Remove" type="button" data-v11-remove aria-label="Remove">×</button>
    </div>`;
  }

  function renderCustom(section, product, mode) {
    const c = loadCustom(product,mode);
    const host = section.querySelector('[data-v11-content]');
    const common = product.cat === 'tea'
      ? `<div class="v11CustomGrid">
          <label class="v11Field"><span>${esc(tr('Tea amount (g)','كمية الشاي (g)'))}</span><input data-v11-field="doseG" inputmode="decimal" value="${esc(c.doseG)}"></label>
          <label class="v11Field"><span>${esc(tr('Water (ml)','الماء (ml)'))}</span><input data-v11-field="waterMl" type="number" value="${esc(c.waterMl)}"></label>
          <label class="v11Field"><span>${esc(tr('Temperature °C','الحرارة °C'))}</span><input data-v11-field="tempC" inputmode="decimal" value="${esc(c.tempC)}"></label>
          <label class="v11Field"><span>${esc(tr('Steeping time','مدة النقع'))}</span><input data-v11-field="steepTime" value="${esc(c.steepTime)}"></label>
          <label class="v11Field"><span>Siphon water refill</span><select data-v11-field="siphon"><option ${c.siphon==='Auto'?'selected':''}>Auto</option><option ${c.siphon==='On'?'selected':''}>On</option><option ${c.siphon==='Off'?'selected':''}>Off</option></select></label>
          <label class="v11Field"><span>Pour pattern</span><select data-v11-field="pattern"><option ${c.pattern==='Centered'?'selected':''}>Centered</option><option ${c.pattern==='Spiral'?'selected':''}>Spiral</option><option ${c.pattern==='Circular'?'selected':''}>Circular</option></select></label>
        </div>`
      : `<div class="v11CustomGrid">
          <label class="v11Field"><span>${esc(tr('Dose (g)','الجرعة (g)'))}</span><input data-v11-field="doseG" inputmode="decimal" value="${esc(c.doseG)}"></label>
          <label class="v11Field"><span>${esc(tr('Water (ml)','الماء (ml)'))}</span><input data-v11-field="waterMl" type="number" value="${esc(c.waterMl)}"></label>
          <label class="v11Field"><span>Ratio</span><input data-v11-field="ratio" inputmode="decimal" value="${esc(c.ratio)}"></label>
          <label class="v11Field"><span>${esc(tr('Grind','الطحن'))}</span><input data-v11-field="grind" inputmode="decimal" value="${esc(c.grind)}"></label>
          <label class="v11Field"><span>RPM</span><input data-v11-field="rpm" inputmode="decimal" value="${esc(c.rpm)}"></label>
        </div>`;
    const pours = product.cat === 'tea' ? (c.stages || []) : (c.pours || []);
    host.innerHTML = `<div class="v11Custom">${common}<div class="v11SectionTitle">${esc(tr('Fully editable stages','الصبات والمراحل — تعديل كامل'))}</div><div class="v11CustomPours" data-v11-custom-pours>${pours.map(customPourRow).join('')}</div><div class="v11CustomActions"><button class="v11MiniBtn" type="button" data-v11-add>${esc(tr('Add stage','إضافة صبة / مرحلة'))}</button><button class="v11MiniBtn" type="button" data-v11-save>${esc(tr('Save Custom','حفظ Custom'))}</button><button class="v11MiniBtn" type="button" data-v11-copy>${esc(tr('Copy settings','نسخ الإعدادات'))}</button></div><div class="v11State" data-v11-state></div></div>`;

    host.querySelector('[data-v11-add]')?.addEventListener('click', () => {
      const wrap = host.querySelector('[data-v11-custom-pours]');
      const idx = wrap.querySelectorAll('[data-v11-pour]').length;
      wrap.insertAdjacentHTML('beforeend', customPourRow({name:product.cat==='tea'?`Steep ${idx+1}`:`Pour ${idx+1}`,ml:'',tempC:'',sec:'',flow:'',pause:'',pattern:'Centered',agitationBefore:'',agitationAfter:''}, idx));
      bindRemoveButtons(host);
    });
    bindRemoveButtons(host);

    const collect = () => {
      const val = key => host.querySelector(`[data-v11-field="${key}"]`)?.value ?? '';
      const rows = [...host.querySelectorAll('[data-v11-pour]')].map(row => {
        const f = key => row.querySelector(`[data-f="${key}"]`)?.value ?? '';
        return {name:f('name'),ml:f('ml'),tempC:f('tempC'),sec:f('sec'),flow:f('flow'),pause:f('pause'),pattern:f('pattern'),agitationBefore:f('agitationBefore'),agitationAfter:f('agitationAfter')};
      });
      if (product.cat === 'tea') return {kind:'tea',doseG:val('doseG'),waterMl:val('waterMl'),tempC:val('tempC'),steepTime:val('steepTime'),siphon:val('siphon'),pattern:val('pattern'),stages:rows};
      return {kind:'coffee',doseG:val('doseG'),waterMl:val('waterMl'),ratio:val('ratio'),grind:val('grind'),rpm:val('rpm'),pours:rows};
    };
    const state = () => host.querySelector('[data-v11-state]');
    host.querySelector('[data-v11-save]')?.addEventListener('click', () => {
      localStorage.setItem(customKey(product,mode), JSON.stringify(collect()));
      state().textContent = tr('Saved on this device.','تم حفظ الوصفة على هذا الجهاز.');
    });
    host.querySelector('[data-v11-copy]')?.addEventListener('click', async () => {
      const text = JSON.stringify(collect(), null, 2);
      try { await navigator.clipboard.writeText(text); state().textContent = tr('Settings copied.','تم نسخ الإعدادات.'); }
      catch { state().textContent = text; }
    });
  }

  function bindRemoveButtons(host) {
    host.querySelectorAll('[data-v11-remove]').forEach(btn => {
      btn.onclick = () => btn.closest('[data-v11-pour]')?.remove();
    });
  }

  function renderFixed(section, product, mode, volume) {
    const host = section.querySelector('[data-v11-content]');
    const master = masterFor(product,mode);
    const sourceUrl = officialRecipeUrl(product);

    if (!master) {
      host.innerHTML = `<div class="v11Message"><b>${esc(tr('No invented numbers.','بدون أي أرقام مفترضة.'))}</b><br>${esc(tr('The roaster/manufacturer recipe for this exact product and mode is not stored with complete verified machine values yet. Automatic scaling is disabled until the master recipe is verified.','وصفة المحمصة/الشركة لهذا المنتج وهذا النوع من التحضير ليست محفوظة لدينا بأرقام الجهاز كاملة وموثقة حتى الآن؛ لذلك تم تعطيل التحويل التلقائي بدل اختلاق أي قيمة.'))}</div>${sourceUrl ? `<a class="v11Action fallback" href="${esc(sourceUrl)}" target="_blank" rel="noopener">${esc(tr('Open official roaster recipe','فتح وصفة المحمصة الرسمية'))}</a>` : ''}`;
      return;
    }

    const recipe = scaledRecipe(product,mode,volume);
    if (!recipe) {
      host.innerHTML = `<div class="v11Message">${esc(tr('This master recipe cannot be scaled safely to the selected volume under the current xBloom step constraints.','لا يمكن تحويل الوصفة الأصلية إلى الكمية المختارة بأمان ضمن قيود خطوات xBloom الحالية.'))}</div>`;
      return;
    }

    const isOriginal = Number(volume) === Number(master.masterMl);
    const actionUrl = recipe.shareUrl || sourceUrl;
    const actionDirect = Boolean(recipe.shareUrl);
    host.innerHTML = `
      <div class="v11OriginNote">${esc(isOriginal ? tr(`Original verified recipe · ${master.masterMl} ml`,`الوصفة الأصلية الموثقة · ${master.masterMl} ml`) : tr(`Auto-scaled from the verified ${master.masterMl} ml master recipe to ${volume} ml`,`تم التحويل تلقائيًا من الوصفة الأصلية الموثقة ${master.masterMl} ml إلى ${volume} ml`))}</div>
      <div class="v11Summary">${recipeSummary(recipe)}</div>
      <div class="v11SectionTitle">${esc(tr(recipe.kind==='tea'?'Preparation stage':'Pour details',recipe.kind==='tea'?'مرحلة التحضير':'تفاصيل الصبات'))}</div>
      <div class="v11Pours">${pourCards(recipe)}</div>
      <div class="v11ScaleNote">${esc(recipe.kind==='coffee' ? tr('Only dose and water distribution are scaled. Grind, RPM, temperatures and any known machine parameters remain exactly as the verified master recipe. Pour volumes are quantized to 5 ml and forced to sum exactly to the selected volume.','يتم تغيير الجرعة وكميات الماء فقط. الطحن وRPM والحرارة وأي إعدادات جهاز موثقة تبقى كما هي في الوصفة الأصلية. كميات الصبات تضبط على خطوات 5 ml ويجب أن يساوي مجموعها الحجم المختار تمامًا.') : tr('Tea amount is calculated directly from the manufacturer g/L reference. Temperature and steeping time remain unchanged.','كمية الشاي محسوبة مباشرة من معيار الشركة g/L، بينما الحرارة ومدة النقع تبقيان كما هما دون تغيير.'))}</div>
      ${actionUrl ? `<a class="v11Action ${actionDirect?'':'fallback'}" href="${esc(actionUrl)}" target="_blank" rel="noopener">${esc(actionDirect ? tr('Open this exact recipe in xBloom','فتح هذه الوصفة نفسها في xBloom') : tr('Open official recipe source','فتح مصدر الوصفة الرسمي'))}</a>` : ''}
      ${!actionDirect ? `<div class="v11ScaleNote">${esc(tr('A direct xBloom import button appears only when the exact share-h5 recipe URL is verified.','زر الاستيراد المباشر إلى xBloom لا يظهر إلا عند توثيق رابط share-h5 الخاص بالوصفة نفسها.'))}</div>` : ''}`;
  }

  function buildSection(product) {
    const section = document.createElement('section');
    section.className = 'v11Prep';
    section.dataset.v11Product = product.nameEn;
    const hasColdMaster = Boolean(masterFor(product,'cold'));
    section.innerHTML = `
      <div class="v11Head"><span class="v11Kicker">MJ · ${esc(tr('Unified preparation','التحضير الموحد'))}</span><h3>${esc(tr('Preparation','قسم التحضير'))}</h3><p>${esc(tr('One place for volume, hot/cold, the complete recipe, pours and Custom.','مكان واحد للكمية، حار/بارد، الوصفة الكاملة، الصبات وCustom.'))}</p></div>
      <div class="v11Body">
        <span class="v11Label">1 · ${esc(tr('Choose quantity','اختر الكمية'))}</span>
        <div class="v11Volumes">${FIXED_VOLUMES.map((v,i)=>`<button class="v11Choice ${i===1?'active':''}" type="button" data-v11-volume="${v}">${v} ml</button>`).join('')}<button class="v11Choice" type="button" data-v11-volume="custom">Custom</button></div>
        <span class="v11Label" style="margin-top:14px">2 · ${esc(tr('Choose preparation','اختر نوع التحضير'))}</span>
        <div class="v11ModeRow"><button class="v11Mode active" type="button" data-v11-mode="hot">🔥 ${esc(tr('Hot','حار'))}</button><button class="v11Mode" type="button" data-v11-mode="cold" ${hasColdMaster?'':'data-v11-no-master="1"'}>❄️ ${esc(tr('Cold','بارد'))}</button></div>
        <div data-v11-content></div>
      </div>`;

    let selectedVolume = 240;
    let selectedMode = 'hot';
    const render = () => {
      section.querySelectorAll('[data-v11-volume]').forEach(b => b.classList.toggle('active', String(b.dataset.v11Volume) === String(selectedVolume)));
      section.querySelectorAll('[data-v11-mode]').forEach(b => b.classList.toggle('active', b.dataset.v11Mode === selectedMode));
      if (selectedVolume === 'custom') renderCustom(section,product,selectedMode);
      else renderFixed(section,product,selectedMode,Number(selectedVolume));
    };
    section.querySelectorAll('[data-v11-volume]').forEach(btn => btn.addEventListener('click', () => { selectedVolume = btn.dataset.v11Volume === 'custom' ? 'custom' : Number(btn.dataset.v11Volume); render(); }));
    section.querySelectorAll('[data-v11-mode]').forEach(btn => btn.addEventListener('click', () => { selectedMode = btn.dataset.v11Mode; render(); }));
    render();
    return section;
  }

  function enhance() {
    injectStyles();
    const modal = document.querySelector('.productModal');
    if (!modal) return;
    const product = resolveProduct(modal);
    if (!product || !isCompatible(product)) return;

    modal.querySelectorAll('.v6PrepHub').forEach(el => { el.style.display = 'none'; });
    const existing = modal.querySelector('.v11Prep');
    if (existing?.dataset.v11Product === product.nameEn) return;
    modal.querySelectorAll('.v11Prep').forEach(el => el.remove());

    const section = buildSection(product);
    const oldHub = modal.querySelector('.v6PrepHub');
    if (oldHub) oldHub.insertAdjacentElement('beforebegin', section);
    else {
      const anchor = modal.querySelector('.v6CompanyCard, .experience, .modalContent .story');
      if (anchor) anchor.insertAdjacentElement('afterend', section);
      else modal.querySelector('.modalContent')?.appendChild(section);
    }
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; enhance(); });
  };
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',schedule,true);
  window.addEventListener('hashchange',schedule);
  schedule();

  // Expose pure helpers for Edition 11 QA without exposing mutable UI state.
  window.MJ_V11_PREP = { quantizePours, scaledRecipe, masterFor, FIXED_VOLUMES:[...FIXED_VOLUMES] };
})();
