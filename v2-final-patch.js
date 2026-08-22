(() => {
  const M = window.MJ_MENU;
  const S = window.MJ_SOURCES;
  if (!M || !S?.products) return;
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
})();