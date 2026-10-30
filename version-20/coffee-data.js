/* Specialty metadata. Degrees are published values, never inferred from brew style. */
(() => {
 const M=window.MJ_MENU,E=window.MJ_EXTRA,S=window.MJ_SOURCES;
 const research={
 "Air Roastery – Ricardo": {
  "roastEn": "3/5",
  "roastAr": "٣/٥",
  "roastKey": "level3of5",
  "sourceUrl": "https://airroastery.com/en/product/ricardo-coffee-filter-250g/",
  "sourceType": "official",
  "evidence": "Roast Level: 3/5. Retain exact numeric scale; do not infer Medium. Entire Goods also calls Ricardo Medium but primary numeric source takes precedence."
 },
 "CGLE Tres Dragones": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://entiregoods.shop/products/methods-roastery-cgle-tres-dragones",
  "sourceType": "retailer",
  "evidence": "Product table: Roast: Medium. Official Methods page instead says Roast Type: Filter Whole Bean; that is not a degree."
 },
 "Pink Bourbon Punch": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://entiregoods.shop/products/methods-roastery-pink-bourbon-punch",
  "sourceType": "retailer",
  "evidence": "Product table: Roast: Medium. Official Methods page only labels Filter Whole Bean."
 },
 "Bourbon Sidra Sakura": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "roastType": "Filter Whole Bean",
  "sourceUrl": "https://methods.coffee/collections/coffee/products/bourbon-sidra-sakura",
  "sourceType": "official",
  "evidence": "Inspected official page says Roast Type: Filter Whole Bean, not light/medium/dark. Anaerobic Washed is processing, not roast.",
  "roastTypeEn": "Filter roast",
  "roastTypeAr": "تحميص فلتر"
 },
 "EA Decaf De Cana": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://entiregoods.shop/products/methods-roastery-ea-decaf-de-cana",
  "sourceType": "retailer",
  "evidence": "Product table: Roast: Medium."
 },
 "Entire Goods – Ethiopia Finara": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://entiregoods.shop/products/entire-goods-ethiopia-finara",
  "sourceType": "official",
  "evidence": "Inspected product page gives Natural Grade 1, Heirloom and tasting notes. No roast degree found."
 },
 "Fairview Estate — Premium Kenyan Arabica": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://www.fairviewestate.co.ke/faq/",
  "sourceType": "official",
  "evidence": "FAQ explicitly offers Arabica Premium Coffee Medium Roast (250g/500g). Existing user's package-backed Medium fact matches this variant; Fairview also sells a separate Dark variant, so do not generalize across variants."
 },
 "Fairview Estate — Kaldi City Roast": {
  "roastEn": "Kaldi City Roast",
  "roastAr": "كالدي سيتي",
  "roastKey": "city",
  "sourceUrl": "https://www.fairviewestate.co.ke/product-category/arabica-roasted/",
  "sourceType": "official",
  "evidence": "Official catalog names Kaldi City Roast separately from Medium and Dark products. Retain named profile; do not map City automatically to Medium."
 },
 "Java House — Kenya AA": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://javahouseafrica.com/pantry-item/kenya-aa/",
  "sourceType": "official",
  "evidence": "Official text: Medium roast, medium ground."
 },
 "Barista & Co. — Gourmet": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "package://Barista-Co-Gourmet",
  "sourceType": "package",
  "evidence": "Existing package-backed data has no roast degree. Searches of exact Barista & Co Gourmet returned Gourmet Roast as product name without light/medium/dark degree; no degree verified."
 },
 "Methods Roastery – Honey Double Fermentation": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://entiregoods.shop/products/methods-roastery-honey-double-fermentation",
  "sourceType": "retailer",
  "evidence": "Exact product table: Roast Medium; Process Honey Double Fermentation. Product sold as xPod; official Methods page says Filter Whole Bean without degree."
 },
 "Jebla – Zorro": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://jeblacoffeeroasters.com/ar/products/zorro-colombia",
  "sourceType": "official",
  "evidence": "Official product endpoint inaccessible during inspection; official catalog lists Zorro but no degree. No exact degree found through searches."
 },
 "Jebla – KitKat": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://jeblacoffeeroasters.com/ar/products/romario-kitkat",
  "sourceType": "official",
  "evidence": "Official endpoint inaccessible during inspection. No exact degree verified. Do not copy roast from Black Knight KitKat; distinct roaster/product."
 },
 "Jebla – Romario": {
  "roastEn": "Not stated for whole beans",
  "roastAr": "غير مذكور للبن الكامل",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://entiregoods.shop/collections/xpod",
  "sourceType": "retailer",
  "evidence": "Exact Jebla Roastery - Romario entry says Roast Medium; Brazil, Natural, notes Caramel Chocolate Nuts. Official whole-bean page gives no degree. Official Romario drip-bag product says medium-to-dark but is a different format; do not transfer that value. Whole-bean degree left unverified; xPod/drip variants are not copied."
 },
 "Jebla – Qayel Ali": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://jeblacoffeeroasters.com/ar/products/%D8%A7%D9%84%D9%82%D9%8A%D9%84-%D8%B9%D9%84%D9%8A-%D8%A7%D9%84%D9%8A%D9%85%D9%86",
  "sourceType": "official",
  "evidence": "Inspected official page lists DQ processing, Bourbon/Typica, altitude, notes and espresso/filter suitability; no roast degree."
 },
 "Stockroom – Ethiopia Omran": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://stockroomcoffee.com/products/ethiopia-omran-filter-espresso-250-gram",
  "sourceType": "official",
  "evidence": "Official page lists Sidama, Omran, Heirloom, Natural anaerobic, raspberry passion fruit blackcurrant and 2300m. No roast degree."
 },
 "Soil — Verde": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "roastType": "Omni (retailer classification only)",
  "sourceUrl": "https://soilroasters.com/products/verde",
  "sourceType": "official",
  "evidence": "Official page inspected and searched without finding degree. Retailer Spresso says suitable for espresso and drip, anaerobic honey process; neither establishes roast degree. Retailer source: https://spresso.ae/products/soil-colombia-verde-250g"
 },
 "Soil — Fazenda": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://www.nahdionline.com/en-sa/soil-coffee-beans-brazil-natural-filter-espresso-250-gm/pdp/104125342",
  "sourceType": "retailer",
  "evidence": "Exact Soil Brazil 250g product overview names Fazenda and explicitly says Roast Level Medium; Natural (Sun-Dried); Chocolate Nuts Sweet Toffee. Official Soil page uses image-based description and no text degree found."
 },
 "Air Roastery — La Plata": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "roastType": "Filter",
  "sourceUrl": "https://airroastery.com/en/product-category/filter-coffee-beans/",
  "sourceType": "official",
  "evidence": "Official La Plata entry: Colombia, Anaerobic, 1800–2200, Caturra/Castillo, berries strawberry maple syrup jam peach kiwi. No roast degree published in inspected entry. Filter is not a light/medium/dark degree.",
  "roastTypeEn": "Filter roast",
  "roastTypeAr": "تحميص فلتر"
 },
 "Black Knight — Kitkat Infused": {
  "roastEn": "Medium",
  "roastAr": "متوسط",
  "roastKey": "medium",
  "sourceUrl": "https://rafahiacoffee.com/en/kit-kat-brazil-black-knight-250g/p904960930",
  "sourceType": "retailer",
  "evidence": "Exact Black Knight Brazil KitKat 250g: Treatment Infusion; Notes Chocolate Vanilla Caramel Hazelnut; Roast Medium. Independently corroborated by https://spresso.ae/products/black-knight-brazil-kitkat-250g (Roast Medium)."
 },
 "SPEAK — Colombia Peach": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://coffeetoolskw.com/products/colombia-peach-250g",
  "sourceType": "retailer",
  "evidence": "Inspected product lists Speak, Colombia, Infused, Peach Honey Vanilla; no roast degree. Official Speak special collection confirms identity but no degree."
 },
 "SPEAK — Colombia Strawberry": {
  "roastEn": "Not stated",
  "roastAr": "غير مذكور",
  "roastKey": "roastUnknown",
  "sourceUrl": "https://coffeetoolskw.com/products/colombia-strawberry-250g",
  "sourceType": "retailer",
  "evidence": "Inspected product lists Speak, Colombia, Infused, Strawberry Vanilla; no roast degree. Official Speak special collection confirms identity but no degree."
 }
};
 const brands={
  'CGLE Tres Dragones':['Methods Roastery','ميثودز روستري'],
  'Pink Bourbon Punch':['Methods Roastery','ميثودز روستري'],
  'Bourbon Sidra Sakura':['Methods Roastery','ميثودز روستري'],
  'EA Decaf De Cana':['Methods Roastery','ميثودز روستري'],
  'Entire Goods – Ethiopia Finara':['Entire Goods','إنتاير غودز'],
  'Methods Roastery – Honey Double Fermentation':['Methods Roastery','ميثودز روستري']
 };
 const processLabels={
  'natural':['Natural','مجففة'], 'natural grade 1':['Natural · Grade 1','مجففة · درجة أولى'],
  'washed':['Washed','مغسولة'],'fully washed':['Fully washed','مغسولة بالكامل'],
  'semi-washed':['Semi-washed','نصف مغسولة'],
  'anaerobic washed':['Anaerobic washed','مغسولة لاهوائية'],
  'natural anaerobic':['Natural anaerobic','مجففة لاهوائية'],
  'anaerobic and aerobic':['Anaerobic & aerobic','لاهوائية وهوائية'],
  'anaerobic':['Anaerobic','لاهوائية'],
  'honey double fermentation':['Honey · double fermentation','عسلية · تخمير مزدوج'],
  'anaerobic honey':['Anaerobic honey','عسلية لاهوائية'],
  'infusion':['Infused','منقّعة'],'infused':['Infused','منقّعة'],
  'co-fermentation':['Co-fermentation','تخمير مشترك'],
  'dq':['DQ','DQ']
 };
 const processKeys=text=>{
  const s=String(text||'').toLowerCase(),keys=[];
  if(/semi.washed/.test(s))keys.push('semiwashed');
  else if(/washed/.test(s))keys.push('washed');
  if(/natural/.test(s))keys.push('natural');
  if(/honey/.test(s))keys.push('honey');
  if(/anaerobic/.test(s))keys.push('anaerobic');
  if(/infus/.test(s))keys.push('infused');
  if(/co.ferment/.test(s))keys.push('cofermented');
  if(s==='dq')keys.push('dq');
  return keys.length?keys:['processUnknown'];
 };
 for(const p of M.products.filter(p=>p.cat==='specialty')){
  const entry=E.products[p.nameEn]||(E.products[p.nameEn]={facts:[]});
  const r=research[p.nameEn]||{},src=S.products[p.nameEn]||{};
  if(p.nameEn==='Jebla – Romario'){r.sourceUrl=src.source;r.sourceType='official';}
  const facts=entry.facts||[];
  if(p.nameEn==='Soil — Fazenda'&&!facts.some(f=>/^process$/i.test(f[0])))facts.push(['Process','Natural','المعالجة','مجففة']);
  if(p.nameEn==='Soil — Verde'&&!facts.some(f=>/^process$/i.test(f[0])))facts.push(['Process','Anaerobic honey','المعالجة','عسلية لاهوائية']);
  const process=facts.find(f=>/^process$/i.test(f[0]));
  const raw=process?.[1]||'';
  const translated=processLabels[raw.toLowerCase()]||[raw||'Not stated',process?.[3]||'غير مذكورة'];
  const roastEn=r.roastEn||'Not stated',roastAr=r.roastAr||'غير مذكورة';
  entry.facts=facts.filter(f=>!/^roast$|^roast degree$|^roast type$/i.test(f[0]));
  entry.facts.push(['Roast degree',roastEn,'درجة التحميص',roastAr]);
  if(r.roastTypeEn)entry.facts.push(['Roast type',r.roastTypeEn,'نوع التحميص',r.roastTypeAr]);
  if(process){process[1]=translated[0];process[3]=translated[1];}
  else entry.facts.push(['Process',translated[0],'المعالجة',translated[1]]);
  if(p.nameEn==='Soil — Verde'){src.profileEn='Apple · Lime · Sugarcane';src.profileAr='تفاح · لايم · قصب السكر';p.profileEn=src.profileEn;p.profileAr=src.profileAr;}
  const brand=brands[p.nameEn]||[p.brandEn||p.brand||p.nameEn.split(/ [–—] /)[0],p.brandAr||(p.nameAr||'').split(/ [–—] /)[0]];
  p.coffeeMeta={
   processEn:translated[0],processAr:translated[1],processKeys:processKeys(raw),
   roastEn,roastAr,roastKey:r.roastKey||'roastUnknown',
   roastTypeEn:r.roastTypeEn||'',roastTypeAr:r.roastTypeAr||'',
   roastSource:r.sourceUrl||'',roastSourceType:r.sourceType||'',roastEvidence:r.evidence||'',
   processSource:p.nameEn==='Soil — Verde'?'https://spresso.ae/products/soil-colombia-verde-250g':p.nameEn==='Soil — Fazenda'?'https://www.nahdionline.com/en-sa/soil-coffee-beans-brazil-natural-filter-espresso-250-gm/pdp/104125342':'',
   checked:'2026-10-30',brandEn:brand[0],brandAr:brand[1],
   notesEn:src.profileEn||facts.find(f=>/^notes$/i.test(f[0]))?.[1]||p.profileEn||'',notesAr:src.profileAr||facts.find(f=>/^notes$/i.test(f[0]))?.[3]||p.profileAr||''
  };
 }
})();
