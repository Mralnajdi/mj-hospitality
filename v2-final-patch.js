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
    "Zill Shagra": ["Zill Coffee", "زِل", "Shagra", "الشقرا"],
    "Zill Original": ["Zill Coffee", "زِل", "Original", "الأصلية"],
    "Zill Ghamjah": ["Zill Coffee", "زِل", "Ghamjah", "الغامجة"],

    "Air Roastery – Ricardo": ["Air Roastery", "إير روستاري", "Ricardo", "ريكاردو"],
    "CGLE Tres Dragones": ["Methods Roastery", "ميثودز", "Tres Dragones", "تريس دراغونز"],
    "Pink Bourbon Punch": ["Methods Roastery", "ميثودز", "Pink Bourbon Punch", "بينك بوربون بانش"],
    "Bourbon Sidra Sakura": ["Methods Roastery", "ميثودز", "Bourbon Sidra Sakura", "بوربون سيدرا ساكورا"],
    "EA Decaf De Cana": ["Methods Roastery", "ميثودز", "EA Decaf De Cana", "ديكاف دي كانا"],
    "Entire Goods – Ethiopia Finara": ["Entire Goods", "إنتاير غودز", "Ethiopia Finara", "إثيوبيا فينارا"],
    "Fairview Estate — Premium Kenyan Arabica": ["Fairview Estate", "فيرفيو إستيت", "Premium Kenyan Arabica", "أرابيكا كينية فاخرة"],
    "Fairview Estate — Kaldi City Roast": ["Fairview Estate", "فيرفيو إستيت", "Kaldi City Roast", "كالدي سيتي روست"],
    "Java House — Kenya AA": ["Java House", "جافا هاوس", "Kenya AA", "كينيا إيه إيه"],
    "Barista & Co. — Gourmet": ["Barista & Co.", "باريستا آند كو", "Gourmet", "غورميه"],

    "Sencha Sleepless Organic": ["TeaGschwendner", "تي غشفيندنر", "Sencha Sleepless Organic", "سينشا الصحوة العضوي"],
    "Moroccan Mint Organic": ["TeaGschwendner", "تي غشفيندنر", "Moroccan Mint Organic", "النعناع المغربي العضوي"],
    "Japanese Cherry": ["TeaGschwendner", "تي غشفيندنر", "Japanese Cherry", "الكرز الياباني"],
    "Le Touareg Organic": ["TeaGschwendner", "تي غشفيندنر", "Le Touareg Organic", "لو تواريغ العضوي"],
    "Marani": ["TeaGschwendner", "تي غشفيندنر", "Marani", "ماراني"],
    "Chinese Royal Jasmine Rolls": ["TeaGschwendner", "تي غشفيندنر", "Chinese Royal Jasmine Rolls", "لفائف الياسمين الملكي الصيني"],
    "White Tea Lemon & Vanilla": ["TeaGschwendner", "تي غشفيندنر", "White Tea Lemon & Vanilla", "الشاي الأبيض بالليمون والفانيليا"],
    "White Tea Jasmine Blossoms": ["TeaGschwendner", "تي غشفيندنر", "White Tea Jasmine Blossoms", "الشاي الأبيض بزهور الياسمين"],
    "Gourmet Herbal Tea": ["TeaGschwendner", "تي غشفيندنر", "Gourmet Herbal Tea", "شاي الأعشاب الفاخر"],
    "Mate Green Organic": ["TeaGschwendner", "تي غشفيندنر", "Mate Green Organic", "الماته الأخضر العضوي"],
    "Ginger–Turmeric": ["TeaGschwendner", "تي غشفيندنر", "Ginger–Turmeric", "الزنجبيل والكركم"],
    "One for All": ["TeaGschwendner", "تي غشفيندنر", "One for All", "وان فور أول"],
    "Chamomile": ["International Mill", "إنترناشونال ميل", "Chamomile", "البابونج"],
    "Peach Melba": ["TeaGschwendner", "تي غشفيندنر", "Peach Melba", "خوخ ميلبا"],
    "Cherry Banana Flip": ["TeaGschwendner", "تي غشفيندنر", "Cherry Banana Flip", "تشيري بنانا فليب"],
    "Berry Heaven": ["TeaGschwendner", "تي غشفيندنر", "Berry Heaven", "جنة التوت"],
    "Strawberry–Moringa": ["TeaGschwendner", "تي غشفيندنر", "Strawberry–Moringa", "الفراولة والمورينغا"],
    "Passion Fruit": ["TeaGschwendner", "تي غشفيندنر", "Passion Fruit", "باشن فروت"],
    "Woodland Berries": ["TeaGschwendner", "تي غشفيندنر", "Woodland Berries", "توت الغابة"],

    "Cola": ["Seleco", "سيليو", "Cola", "كولا"],
    "Raspberry Lemon": ["Seleco", "سيليو", "Raspberry Lemon", "توت العليق والليمون"],
    "Rosemary Cucumber": ["Seleco", "سيليو", "Rosemary Cucumber", "إكليل الجبل والخيار"],
    "Hibiscus": ["Seleco", "سيليو", "Hibiscus", "كركديه"],
    "Raspberry & Blackcurrant": ["Seleco", "سيليو", "Raspberry & Blackcurrant", "توت العليق والكشمش الأسود"],
    "Cucumber & Mint": ["Seleco", "سيليو", "Cucumber & Mint", "الخيار والنعناع"]
  };

  M.products.forEach(item => {
    const maker = makers[item.nameEn];
    if (!maker) return;
    item._maker = {en: maker[0], ar: maker[1]};
    item._displayBase = {en: maker[2], ar: maker[3]};

    const ex = E.products[item.nameEn] || (E.products[item.nameEn] = {facts:[]});
    ex.facts ||= [];
    ex.facts = ex.facts.filter(f =>
      !/^(Roaster|Company|Brand|Roaster \/ Company|Company \/ Brand)$/i.test(String(f?.[0] || "")) &&
      !/^(المحمصة|الشركة|العلامة|المحمصة \/ الشركة|الشركة \/ العلامة)$/.test(String(f?.[2] || ""))
    );
  });
})();