(() => {
  'use strict';
  const errors = [];
  const warnings = [];
  const prep = window.MJ_V11_PREP;
  const products = window.MJ_MENU?.products || [];

  const fail = (msg) => errors.push(msg);
  const warn = (msg) => warnings.push(msg);

  if (!prep) {
    fail('MJ_V11_PREP helper is missing.');
  } else {
    const sidra = products.find(p => p.nameEn === 'Bourbon Sidra Sakura');
    if (!sidra) fail('Bourbon Sidra Sakura product is missing.');
    else {
      [120,240,360].forEach(volume => {
        const r = prep.scaledRecipe(sidra,'hot',volume);
        if (!r) return fail(`Sidra scaling failed at ${volume} ml.`);
        const sum = r.pours.reduce((s,p) => s + Number(p.ml || 0),0);
        if (sum !== volume) fail(`Pour total ${sum} != ${volume} ml.`);
        if (r.pours.some(p => Number(p.ml) % 5 !== 0)) fail(`A pour is not on a 5 ml step at ${volume} ml.`);
        const expectedDose = Number((volume / 15).toFixed(1));
        if (Math.abs(Number(r.doseG) - expectedDose) > 0.001) fail(`Dose/ratio mismatch at ${volume} ml.`);
        if (r.grind !== 50 || r.rpm !== 120) fail(`Machine parameters changed during scaling at ${volume} ml.`);
      });
    }

    products.filter(p => p.cat === 'tea').forEach(product => {
      const master = prep.masterFor(product,'hot');
      if (!master) return;
      [120,240,360].forEach(volume => {
        const r = prep.scaledRecipe(product,'hot',volume);
        if (!r) fail(`Tea scaling failed: ${product.nameEn} ${volume} ml.`);
        else {
          const expected = Number((Number(master.gpl) * volume / 1000).toFixed(2));
          if (Math.abs(Number(r.doseG) - expected) > 0.001) fail(`Tea g/L mismatch: ${product.nameEn} ${volume} ml.`);
          if (r.tempC !== master.tempC || r.steepTime !== master.steepTime) fail(`Tea fixed parameters changed: ${product.nameEn}.`);
        }
      });
    });
  }

  const domAudit = () => {
    document.querySelectorAll('.productModal').forEach(modal => {
      const sections = modal.querySelectorAll('.v11Prep');
      if (sections.length > 1) fail('More than one Edition 11 preparation section is visible in a product modal.');
      sections.forEach(section => {
        const customSelectors = section.querySelectorAll('.v11Choice[data-v11-volume="custom"]');
        if (customSelectors.length !== 1) fail(`Expected exactly one top Custom selector; found ${customSelectors.length}.`);
        section.querySelectorAll('a.v11Action').forEach(link => {
          if (/exact recipe|هذه الوصفة نفسها/i.test(link.textContent || '') && !/^https:\/\/share-h5\.xbloom\.com\//i.test(link.href)) {
            fail('A direct xBloom action is not backed by a share-h5.xbloom.com URL.');
          }
        });
      });
    });
    window.MJ_V11_QA = { ok: errors.length === 0, errors:[...new Set(errors)], warnings:[...new Set(warnings)] };
    if (errors.length) console.error('[MJ V11 QA]', window.MJ_V11_QA);
    else console.info('[MJ V11 QA] PASS', window.MJ_V11_QA);
  };

  domAudit();
  setTimeout(domAudit,800);
})();
