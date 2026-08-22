(() => {
  const M = window.MJ_MENU;
  const S = window.MJ_SOURCES;
  const E = window.MJ_EXTRA || (window.MJ_EXTRA = {products:{}});
  if (!M || !S?.products) return;
  E.products ||= {};

  const p = M.products.find(x => x.nameEn === "Bourbon Sidra Sakura");
  const s = S.products["Bourbon Sidra Sakura"] || (S.products["Bourbon Sidra Sakura"] = {});
  Object.assign(s, {
    verified: true,
    source: "https://methods.coffee/products/bourbon-sidra-sakura",
    profileEn: "Tropical · Red Grapes · Creamy · Vanilla",
    profileAr: "استوائي · عنب أحمر · كريمي · فانيليا",
    descEn: "Colombian Bourbon Sidra processed Anaerobic Washed. The photographed collection pack records tropical fruit, red grape, creamy texture and vanilla as the tasting profile.",
    descAr: "بوربون سيدرا كولومبية بمعالجة Anaerobic Washed. وتسجل عبوة المجموعة المصوّرة الفواكه الاستوائية والعنب الأحمر والقوام الكريمي والفانيليا كملف التذوق."
  });
  if (p) Object.assign(p, {
    profileEn: s.profileEn,
    profileAr: s.profileAr,
    descEn: s.descEn,
    descAr: s.descAr
  });

  const makers = {
    "Zill Shagra": ["Zill Coffee", "زِل"],
    "Zill Original": ["Zill Coffee", "زِل"],
    "Zill Ghamjah": ["Zill Coffee", "زِل"],

    "Air Roastery – Ricardo": ["Air Roastery", "محمصة إير"],
    "CGLE Tres Dragones": ["Methods Roastery", "محمصة Methods"],
    "Pink Bourbon Punch": ["Methods Roastery", "محمصة Methods"],
    "Bourbon Sidra Sakura": ["Methods Roastery", "محمصة Methods"],
    "EA Decaf De Cana": ["Methods Roastery", "محمصة Methods"],
    "Entire Goods – Ethiopia Finara": ["Entire Goods", "Entire Goods"],
    "Fairview Estate — Premium Kenyan Arabica": ["Fairview Estate", "Fairview Estate"],
    "Fairview Estate — Kaldi City Roast": ["Fairview Estate", "Fairview Estate"],
    "Java House — Kenya AA": ["Java House", "Java House"],
    "Barista & Co. — Gourmet": ["Barista & Co.", "Barista & Co."],

    "Sencha Sleepless Organic": ["TeaGschwendner", "TeaGschwendner"],
    "Moroccan Mint Organic": ["TeaGschwendner", "TeaGschwendner"],
    "Japanese Cherry": ["TeaGschwendner", "TeaGschwendner"],
    "Le Touareg Organic": ["TeaGschwendner", "TeaGschwendner"],
    "Marani": ["TeaGschwendner", "TeaGschwendner"],
    "Chinese Royal Jasmine Rolls": ["TeaGschwendner", "TeaGschwendner"],
    "White Tea Lemon & Vanilla": ["TeaGschwendner", "TeaGschwendner"],
    "White Tea Jasmine Blossoms": ["TeaGschwendner", "TeaGschwendner"],
    "Gourmet Herbal Tea": ["TeaGschwendner", "TeaGschwendner"],
    "Mate Green Organic": ["TeaGschwendner", "TeaGschwendner"],
    "Ginger–Turmeric": ["TeaGschwendner", "TeaGschwendner"],
    "One for All": ["TeaGschwendner", "TeaGschwendner"],
    "Chamomile": ["International Mill", "International Mill"],
    "Peach Melba": ["TeaGschwendner", "TeaGschwendner"],
    "Cherry Banana Flip": ["TeaGschwendner", "TeaGschwendner"],
    "Berry Heaven": ["TeaGschwendner", "TeaGschwendner"],
    "Strawberry–Moringa": ["TeaGschwendner", "TeaGschwendner"],
    "Passion Fruit": ["TeaGschwendner", "TeaGschwendner"],
    "Woodland Berries": ["TeaGschwendner", "TeaGschwendner"],

    "Cola": ["Seleco", "Seleco"],
    "Raspberry Lemon": ["Seleco", "Seleco"],
    "Rosemary Cucumber": ["Seleco", "Seleco"],
    "Hibiscus": ["Seleco", "Seleco"],
    "Raspberry & Blackcurrant": ["Seleco", "Seleco"],
    "Cucumber & Mint": ["Seleco", "Seleco"]
  };

  M.products.forEach(item => {
    const maker = makers[item.nameEn];
    if (!maker) return;
    item._maker = {en: maker[0], ar: maker[1]};
    const ex = E.products[item.nameEn] || (E.products[item.nameEn] = {facts:[]});
    ex.facts ||= [];
    ex.facts = ex.facts.filter(f => !/^(Roaster|Company|Brand|Roaster \/ Company)$/i.test(String(f?.[0] || "")) && !/^(المحمصة|الشركة|العلامة|المحمصة \/ الشركة)$/.test(String(f?.[2] || "")));
    let labelEn = "Company / Brand", labelAr = "الشركة / العلامة";
    if (item.cat === "specialty") { labelEn = "Roaster / Company"; labelAr = "المحمصة / الشركة"; }
    if (item.cat === "sparkling") { labelEn = "Company"; labelAr = "الشركة"; }
    ex.facts.unshift([labelEn, maker[0], labelAr, maker[1]]);
  });
})();