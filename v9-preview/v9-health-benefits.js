(() => {
  const M = window.MJ_MENU;
  if (!M) return;
  const P = M.products || [];
  const EXTRA = window.MJ_EXTRA?.products || {};
  const aliases = {
    "CGLE Tres Dragones": "Methods – CGLE Tres Dragones",
    "Pink Bourbon Punch": "Methods – Pink Bourbon Punch",
    "Bourbon Sidra Sakura": "Methods – Bourbon Sidra Sakura",
    "EA Decaf De Cana": "Methods – EA Decaf De Cana"
  };
  const isAr = () => document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";
  const tr = (en, ar) => isAr() ? ar : en;
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g," ").trim();
  const extraFor = (p) => EXTRA[p.nameEn] || EXTRA[aliases[p.nameEn]] || { facts: [] };
  const icons = {
    brain:`<svg viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3c1.2 0 2.2-.6 3-1.5.8.9 1.8 1.5 3 1.5a3 3 0 0 0 3-3v-1a3 3 0 0 0 2-3 3 3 0 0 0-2-3V7a3 3 0 0 0-3-3c-1.2 0-2.2.6-3 1.5C11.2 4.6 10.2 4 9 4Z"/><path d="M12 5.5V18.5M8 9h4M12 14h4"/></svg>`,
    shield:`<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    leaf:`<svg viewBox="0 0 24 24"><path d="M19 4C11 4 6 8 6 14c0 3 2 5 5 5 6 0 9-7 8-15Z"/><path d="M5 20c2-5 6-9 11-12"/></svg>`,
    heart:`<svg viewBox="0 0 24 24"><path d="M20.8 5.7a5 5 0 0 0-7.1 0L12 7.4l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.2a5 5 0 0 0 0-7.1Z"/></svg>`,
    stomach:`<svg viewBox="0 0 24 24"><path d="M9 4c0 5 1 6 4 7 2 .7 3 2 3 4.5A4.5 4.5 0 0 1 11.5 20C8 20 5 17.5 5 14c0-2.5 1.4-4.3 3.2-5.2C9 8.4 9.5 7 9 4Z"/><path d="M13 6c0 2 .8 3.2 2.5 3.8"/></svg>`,
    drop:`<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 15c.5 1.5 1.6 2.3 3.2 2.5"/></svg>`,
    moon:`<svg viewBox="0 0 24 24"><path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5Z"/></svg>`,
    flower:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.2"/><path d="M12 4c2.5 0 4 1.6 4 3.6S14.5 11 12 11 8 9.6 8 7.6 9.5 4 12 4Zm0 16c-2.5 0-4-1.6-4-3.6S9.5 13 12 13s4 1.4 4 3.4-1.5 3.6-4 3.6ZM4 12c0-2.5 1.6-4 3.6-4S11 9.5 11 12s-1.4 4-3.4 4S4 14.5 4 12Zm16 0c0 2.5-1.6 4-3.6 4S13 14.5 13 12s1.4-4 3.4-4S20 9.5 20 12Z"/></svg>`,
    info:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></svg>`
  };

  function factsFor(p){ return extraFor(p).facts || []; }
  function caffeineStatus(p){
    const f = factsFor(p).find(x => norm(x[0]) === 'caffeine' || String(x[2]||'').includes('الكافيين'));
    if (f){
      const v = norm(f[1]);
      if(v === '0 mg' || v.includes('caffeine-free') || v.includes('caffeine free')) return 'free';
      if(v.includes('decaf')) return 'decaf';
      if(v.includes('present') || v.includes('caffeine')) return 'caffeine';
    }
    if (/decaf/i.test(p.nameEn)) return 'decaf';
    if (p.cat === 'arabic' || p.cat === 'specialty') return 'caffeine';
    if (p.cat === 'tea') {
      if (p.subEn === 'Green Tea' || p.subEn === 'White Tea' || p.nameEn === 'Mate Green Organic' || p.nameEn === 'Sencha Sleepless Organic') return 'caffeine';
      return 'free';
    }
    return null;
  }

  const B = (icon,en,ar) => ({icon,en,ar});

  function coffeeBenefits(decaf=false){
    return decaf ? [
      B('shield','Provides coffee polyphenols with antioxidant activity.','يوفر بوليفينولات القهوة ذات النشاط المضاد للأكسدة.'),
      B('moon','Much lower caffeine load, so it is less stimulating than regular coffee.','حمولة كافيين أقل بكثير، لذلك هو أقل تنبيهًا من القهوة العادية.'),
      B('leaf','Still supplies naturally occurring coffee compounds such as chlorogenic acids.','يبقى مصدرًا لمركبات القهوة الطبيعية مثل أحماض الكلوروجينيك.')
    ] : [
      B('brain','Caffeine can temporarily increase alertness and reduce sleepiness.','الكافيين قد يزيد اليقظة مؤقتًا ويقلل النعاس.'),
      B('shield','Coffee is a source of polyphenols with antioxidant activity.','القهوة مصدر للبوليفينولات ذات النشاط المضاد للأكسدة.'),
      B('leaf','Coffee naturally provides small amounts of riboflavin and magnesium.','القهوة توفر طبيعيًا كميات محدودة من فيتامين B2 والمغنيسيوم.')
    ];
  }

  function greenTeaBenefits(){
    return [
      B('shield','Green tea provides catechin polyphenols with antioxidant activity.','الشاي الأخضر يوفر بوليفينولات الكاتيكين ذات النشاط المضاد للأكسدة.'),
      B('brain','Its caffeine can increase alertness and reduce sleepiness temporarily.','الكافيين فيه قد يزيد اليقظة ويقلل النعاس مؤقتًا.'),
      B('heart','Research suggests a small reduction in total and LDL cholesterol, though evidence is stronger for extracts.','تشير الأبحاث إلى خفض بسيط للكوليسترول الكلي وLDL، مع كون الدليل أقوى للمستخلصات.')
    ];
  }

  function whiteTeaBenefits(){
    return [
      B('shield','White tea comes from Camellia sinensis and supplies tea polyphenols.','الشاي الأبيض من نبات Camellia sinensis ويوفر بوليفينولات الشاي.'),
      B('brain','It naturally contains caffeine, which may improve alertness temporarily.','يحتوي طبيعيًا على الكافيين الذي قد يحسن اليقظة مؤقتًا.'),
      B('drop','As an unsweetened tea, it contributes to daily fluid intake.','كشاي غير محلى، يساهم في مدخول السوائل اليومي.')
    ];
  }

  function caffeineFreeInfusion(){
    return [
      B('moon','Caffeine-free, so it does not add a stimulant load in the evening.','خالٍ من الكافيين، لذلك لا يضيف حمولة منبهة في المساء.'),
      B('drop','As an unsweetened infusion, it contributes to daily fluid intake.','كمنقوع غير محلى، يساهم في مدخول السوائل اليومي.'),
      B('info','No specific therapeutic benefit is considered proven for this blend at tea-serving doses.','لا نعدّ لهذا المزيج فائدة علاجية محددة مثبتة بجرعات الشاي المعتادة.')
    ];
  }

  function healthBenefits(p){
    const status = caffeineStatus(p);
    if (p.cat === 'arabic' || p.cat === 'specialty') return coffeeBenefits(status === 'decaf');

    if (p.cat === 'tea') {
      if (p.nameEn === 'Sencha Sleepless Organic') return [
        B('brain','Green tea, mate and guarana provide caffeine that can increase alertness and reduce sleepiness.','الشاي الأخضر والماته والغوارانا توفر كافيين قد يزيد اليقظة ويقلل النعاس.'),
        B('shield','Green tea contributes catechin polyphenols with antioxidant activity.','الشاي الأخضر يضيف بوليفينولات الكاتيكين ذات النشاط المضاد للأكسدة.'),
        B('info','Because it is deliberately stimulating, it is better kept away from late evening if caffeine affects sleep.','لأنه منبّه بوضوح، يُفضّل تجنبه ليلًا إذا كان الكافيين يؤثر في نومك.')
      ];
      if (p.nameEn === 'Mate Green Organic') return [
        B('brain','Maté naturally contains caffeine that can increase alertness and reduce sleepiness.','الماته يحتوي طبيعيًا على الكافيين الذي قد يزيد اليقظة ويقلل النعاس.'),
        B('shield','Yerba maté contains plant polyphenols with antioxidant activity.','الماته يحتوي بوليفينولات نباتية ذات نشاط مضاد للأكسدة.'),
        B('drop','Unsweetened maté tea contributes to daily fluid intake.','الماته غير المحلى يساهم في مدخول السوائل اليومي.')
      ];
      if (p.nameEn === 'Ginger–Turmeric') return [
        B('stomach','Ginger has evidence for helping some types of nausea; most studies used supplements rather than tea.','للزنجبيل دليل على المساعدة في بعض أنواع الغثيان؛ ومعظم الدراسات استخدمت مكملات لا الشاي.'),
        B('shield','Ginger and turmeric contain bioactive plant compounds such as gingerols and curcuminoids.','الزنجبيل والكركم يحتويان مركبات نباتية فعالة مثل الجنجرولات والكركمينويدات.'),
        B('moon','Caffeine-free, so it can be used without adding a stimulant load.','خالٍ من الكافيين، لذلك يمكن تناوله دون إضافة حمولة منبهة.')
      ];
      if (p.nameEn === 'Chamomile') return [
        B('moon','Caffeine-free, so it does not add a stimulant load before sleep.','خالٍ من الكافيين، لذلك لا يضيف حمولة منبهة قبل النوم.'),
        B('flower','Preliminary research suggests chamomile extract may modestly help anxiety symptoms; evidence is not conclusive.','تشير أبحاث أولية إلى أن مستخلص البابونج قد يساعد بشكل محدود بعض أعراض القلق؛ والدليل غير حاسم.'),
        B('info','Chamomile has not been conclusively proven to treat insomnia.','لم يثبت بشكل حاسم أن البابونج يعالج الأرق.')
      ];
      if (p.nameEn === 'One for All') return [
        B('moon','Caffeine-free and suitable for people avoiding stimulants later in the day.','خالٍ من الكافيين ومناسب لمن يتجنب المنبهات في آخر اليوم.'),
        B('flower','It contains chamomile; evidence for anxiety relief is preliminary and not conclusive.','يحتوي البابونج؛ والدليل على تخفيف القلق أولي وغير حاسم.'),
        B('stomach','Mint and fennel are traditionally used for digestion, but evidence for this specific tea blend is limited.','يُستخدم النعناع والشمر تقليديًا للهضم، لكن الدليل على هذا المزيج نفسه محدود.')
      ];
      if (p.nameEn === 'Gourmet Herbal Tea') return [
        B('moon','Caffeine-free, so it does not add stimulant effects in the evening.','خالٍ من الكافيين، لذلك لا يضيف تأثيرات منبهة في المساء.'),
        B('drop','As an unsweetened herbal infusion, it contributes to fluid intake.','كمنقوع أعشاب غير محلى، يساهم في مدخول السوائل.'),
        B('info','No specific therapeutic effect is established for this lemongrass-vanilla blend.','لا توجد فائدة علاجية محددة مثبتة لهذا المزيج من عشب الليمون والفانيليا.')
      ];
      if (p.subEn === 'Green Tea') return greenTeaBenefits();
      if (p.subEn === 'White Tea') return whiteTeaBenefits();
      if (p.subEn === 'Fruit Infusions') return caffeineFreeInfusion();
      return caffeineFreeInfusion();
    }

    if (p.cat === 'sparkling') {
      const sugarFree = /Sugar-Free|دون سكر/i.test(`${p.profileEn||''} ${p.profileAr||''}`);
      return [
        B('drop', sugarFree ? 'With unsweetened sparkling water, it can support hydration without added sugar.' : 'Its health value depends mainly on how much water, sugar and concentrate are used.', sugarFree ? 'مع الماء الغازي غير المحلى، يمكن أن يدعم الترطيب دون سكر مضاف.' : 'قيمته الصحية تعتمد أساسًا على كمية الماء والسكر والتركيز المستخدم.'),
        B('leaf', sugarFree ? 'Sugar-free flavouring avoids added sugar from the flavour itself.' : 'The botanical or fruit flavour does not by itself prove a therapeutic benefit.', sugarFree ? 'النكهة الخالية من السكر تتجنب السكر المضاف من المنكّه نفسه.' : 'النكهة النباتية أو الفاكهية لا تعني بحد ذاتها وجود فائدة علاجية مثبتة.'),
        B('info','No specific medical or therapeutic benefit is claimed for this flavoured sparkling drink.','لا ننسب لهذا المشروب الغازي المنكّه فائدة طبية أو علاجية محددة.')
      ];
    }

    return [
      B('info','No specific health benefit has been established for this product.','لا توجد فائدة صحية محددة مثبتة لهذا المنتج.')
    ];
  }

  function patchCard(tile){
    const p = P.find(x => x._id === tile.dataset.product);
    if (!p) return;
    const benefits = tile.querySelector('.v8Benefits');
    const grid = tile.querySelector('.v8BenefitsGrid');
    const head = tile.querySelector('.v8BenefitsHead');
    if (!benefits || !grid || !head) return;
    const sig = `${p._id}|${isAr()?'ar':'en'}|health-v1`;
    if (benefits.dataset.v9Sig === sig) return;
    benefits.dataset.v9Sig = sig;
    head.innerHTML = `<span>${tr('Health benefits','الفائدة الصحية')}</span>${icons.leaf}`;
    benefits.setAttribute('aria-label', tr('Health benefits','الفائدة الصحية'));
    grid.innerHTML = healthBenefits(p).map(b => `<div class="v8BenefitItem">${icons[b.icon] || icons.leaf}<span>${tr(b.en,b.ar)}</span></div>`).join('');
  }

  function patchAll(){
    document.querySelectorAll('.productTile[data-product]').forEach(patchCard);
  }
  let q=false;
  const schedule=()=>{ if(q) return; q=true; requestAnimationFrame(()=>{q=false;patchAll();}); };
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',schedule,true);
  window.addEventListener('hashchange',schedule);
  setInterval(schedule,1000);
  patchAll();
})();