(() => {
  const AR = () => document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const TEA_PARENT = 'TeaGschwendner';
  const SENCHA_SOURCE = 'https://www.teegschwendner.de/en/Sleepless-Sencha/101596';

  function isTeaGProduct(title) {
    const teaNames = [
      'Sencha Sleepless Organic','سينشا «الصحوة»','Moroccan Mint Organic','شاي النعناع المغربي','Japanese Cherry','الكرز الياباني','Le Touareg Organic','لو تواريغ','Marani','ماراني','Chinese Royal Jasmine Rolls','الياسمين الملكي الصيني','White Tea Lemon & Vanilla','الشاي الأبيض بالليمون والفانيليا','White Tea Jasmine Blossoms','الشاي الأبيض بزهور الياسمين','Gourmet Herbal Tea','شاي الأعشاب غورميه','Mate Green Organic','ماتيه أخضر عضوي','Ginger–Turmeric','زنجبيل وكركم','One for All','ون فور أول','Peach Melba','بيتش ميلبا','Cherry Banana Flip','كرز وموز','Berry Heaven','بيري هيفن','Strawberry–Moringa','الفراولة والمورينغا','Passion Fruit','باشن فروت','Woodland Berries','وودلاند بيري'
    ];
    return teaNames.some(n => title.includes(n));
  }

  function officialTitle() { return AR() ? 'طريقة التحضير الرسمية للمنتج (المعايير)' : 'Official product preparation (parameters)'; }

  function addOfficialHeading(pane) {
    if (!pane || pane.querySelector('.v6OfficialTitle')) return;
    const h = document.createElement('h4');
    h.className = 'v6RecipeTitle v6OfficialTitle';
    h.textContent = officialTitle();
    pane.prepend(h);
  }

  function renderSenchaOfficial(pane) {
    if (!pane || pane.dataset.senchaOfficial === '1') return;
    pane.dataset.senchaOfficial = '1';
    pane.innerHTML = `<h4 class="v6RecipeTitle v6OfficialTitle">${officialTitle()}</h4><div class="v6OfficialMeta"><div class="v6Metric"><small>${AR() ? 'المعيار الرسمي' : 'Official ratio'}</small><b>13 g / 1 L</b></div><div class="v6Metric"><small>${AR() ? 'درجة الحرارة' : 'Temperature'}</small><b>90°C</b></div><div class="v6Metric"><small>${AR() ? 'مدة النقع' : 'Steeping time'}</small><b>${AR() ? '2 دقيقة' : '2 min'}</b></div></div><table class="v6PrepTable"><thead><tr><th>${AR() ? 'الحجم' : 'Volume'}</th><th>${AR() ? 'كمية الشاي' : 'Tea amount'}</th><th>${AR() ? 'الحرارة' : 'Temp.'}</th><th>${AR() ? 'النقع' : 'Steep'}</th></tr></thead><tbody><tr class="v6OneL"><td>1 L</td><td>13 g</td><td>90°C</td><td>${AR() ? '2 دقيقة' : '2 min'}</td></tr><tr><td>360 ml</td><td>4.68 g</td><td>90°C</td><td>${AR() ? '2 دقيقة' : '2 min'}</td></tr><tr><td>240 ml</td><td>3.12 g</td><td>90°C</td><td>${AR() ? '2 دقيقة' : '2 min'}</td></tr><tr><td>120 ml</td><td>1.56 g</td><td>90°C</td><td>${AR() ? '2 دقيقة' : '2 min'}</td></tr></tbody></table><p class="v6Note">${AR() ? '1 لتر هو معيار TeaGschwendner الرسمي. كميات 360 / 240 / 120 مل محسوبة تناسبيًا من 13 غ/لتر فقط.' : '1 L is the official TeaGschwendner reference. The 360 / 240 / 120 ml doses are direct proportional calculations from 13 g/L only.'}</p><div class="v6Actions"><a class="v6Action secondary" href="${SENCHA_SOURCE}" target="_blank" rel="noopener">${AR() ? 'المصدر الرسمي لطريقة التحضير ↗' : 'Official preparation source ↗'}</a></div>`;
  }

  function patch() {
    const modal = document.querySelector('.productModal');
    if (!modal) return;
    const title = (modal.querySelector('.modalTitleRow h2, h2')?.textContent || '').trim();
    if (!title) return;
    if (isTeaGProduct(title)) {
      const company = modal.querySelector('.v6CompanyHead h3');
      if (company && company.textContent.trim() !== TEA_PARENT) company.textContent = TEA_PARENT;
    }
    const officialPane = modal.querySelector('.v6Pane[data-v6-pane="official"]');
    if (officialPane) {
      if (/Sencha Sleepless Organic|سينشا «الصحوة»/.test(title)) renderSenchaOfficial(officialPane);
      else addOfficialHeading(officialPane);
    }
  }

  const observer = new MutationObserver(() => queueMicrotask(patch));
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', () => queueMicrotask(patch), true);
  window.addEventListener('hashchange', () => queueMicrotask(patch));
  patch();
})();
