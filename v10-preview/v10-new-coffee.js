(() => {
  const M = window.MJ_MENU;
  if (!M || !Array.isArray(M.products)) return;

  const nameEn = "Methods Roastery – Honey Double Fermentation";
  const exists = M.products.some((p) => p && p.nameEn === nameEn);

  if (!exists) {
    M.products.push({
      cat: "specialty",
      subEn: "Colombia",
      subAr: "كولومبيا",
      nameEn,
      nameAr: "ميثودز روستري – هني دبل فيرمنتيشن",
      profileEn: "Strawberry · Mango · Peach · Passion Fruit · Ice Cream · Florals",
      profileAr: "فراولة · مانجو · خوخ · باشن فروت · آيس كريم · زهري",
      descEn: "A limited Colombian Pink Bourbon lot with honey double fermentation, expressive tropical fruit, soft florals and a dessert-like finish.",
      descAr: "دفعة محدودة من بينك بوربون الكولومبي بمعالجة Honey Double Fermentation، بطابع فاكهي استوائي واضح ولمسات زهرية ونهاية حلوة شبيهة بالحلويات.",
      serveEn: "Hot / Iced",
      serveAr: "ساخن / بارد",
      timeEn: "Morning / early afternoon",
      timeAr: "الصباح / العصر المبكر"
    });
  }

  window.MJ_EXTRA = window.MJ_EXTRA || { products: {} };
  window.MJ_EXTRA.products = window.MJ_EXTRA.products || {};
  window.MJ_EXTRA.products[nameEn] = {
    facts: [
      ["Origin", "Colombia", "المنشأ", "كولومبيا"],
      ["Region", "Pitalito, Huila", "المنطقة", "بيتاليتو، هويلا"],
      ["Type", "Single Origin", "النوع", "Single Origin"],
      ["Varietal", "Pink Bourbon", "السلالة", "Pink Bourbon"],
      ["Process", "Honey Double Fermentation", "المعالجة", "Honey Double Fermentation"],
      ["Roast", "Medium", "التحميص", "متوسط"],
      ["Elevation", "1,700 m", "الارتفاع", "1,700 م"],
      ["Notes", "Strawberry · mango · peach · passion fruit · ice cream · florals", "النوتات", "فراولة · مانجو · خوخ · باشن فروت · آيس كريم · زهري"],
      ["Caffeine", "Present — exact amount not published", "الكافيين", "موجود — الكمية الدقيقة غير منشورة"]
    ]
  };

  window.MJ_SOURCES = window.MJ_SOURCES || { products: {} };
  window.MJ_SOURCES.products = window.MJ_SOURCES.products || {};
  window.MJ_SOURCES.products[nameEn] = {
    verified: true,
    source: "https://methods.coffee/products/honey-double-fermentation-pink-bourbon-exclusive-lot",
    profileEn: "Strawberry · Mango · Peach · Passion Fruit · Floral",
    profileAr: "فراولة · مانجو · خوخ · باشن فروت · زهري",
    descEn: "Methods verifies a Colombia Pink Bourbon from Pitalito, Huila at 1,700 masl, processed with Honey Double Fermentation. The xPod listing identifies the roast as medium and additionally lists ice cream among the tasting notes.",
    descAr: "تؤكد ميثودز أنها قهوة Pink Bourbon من كولومبيا، بيتاليتو في هويلا، على ارتفاع 1,700 م، بمعالجة Honey Double Fermentation. كما يذكر إدراج xPod أن التحميص متوسط ويضيف نوتة الآيس كريم إلى النوتات المذكورة."
  };
})();
