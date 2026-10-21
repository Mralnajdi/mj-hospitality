/* Corrections from the complete edition review; no machine recipes extrapolated. */
(() => {
 const M=window.MJ_MENU,E=window.MJ_EXTRA,S=window.MJ_SOURCES;
 const name='EA Decaf De Cana',p=M.products.find(p=>p.nameEn===name),s=S.products[name];
 Object.assign(s,{source:'https://entiregoods.shop/products/methods-roastery-ea-decaf-de-cana',profileEn:'Lemon · Tea-like · Sweet · Delicate',profileAr:'ليمون · شبيه بالشاي · حلو · رقيق',descEn:'Colombian washed Caturra/Castillo, medium roasted and grown at 1,200–2,100 m. The matching EA Decaf De Cana listing describes a sweet, clean, delicate cup with lemon and tea notes.',descAr:'قهوة كولومبية مغسولة من كاتورا وكاستيو، بتحميص متوسط وعلى ارتفاع ١٢٠٠–٢١٠٠ متر. يصف إدراج EA Decaf De Cana المطابق كوبًا حلوًا ونظيفًا ورقيقًا بإيحاءات الليمون والشاي.',checked:'2026-10-21'});
 Object.assign(p,{profileEn:s.profileEn,profileAr:s.profileAr,descEn:s.descEn,descAr:s.descAr});
 E.products[name]={facts:[['Origin','Colombia','المنشأ','كولومبيا'],['Varietal','Caturra / Castillo','السلالة','كاتورا / كاستيو'],['Process','Washed','المعالجة','مغسولة'],['Elevation','1,200–2,100 m','الارتفاع','١٢٠٠–٢١٠٠ م'],['Roast','Medium','التحميص','متوسط'],['Caffeine','Decaffeinated — not caffeine-free','الكافيين','منزوعة الكافيين — ليست خالية تمامًا منه']]};
 const punch=S.products['Pink Bourbon Punch'];
 Object.assign(punch,{profileEn:'Apple · Blackberry · Blueberry · Plum · Malic acidity',profileAr:'تفاح · بلاك بيري · توت أزرق · برقوق · حموضة الماليك',descEn:'Colombian Pink Bourbon from Fresno, Tolima, grown at 1,500 m. The roaster’s published package lists apple, blackberry, blueberry, plum and malic acidity, with anaerobic and aerobic processing.',descAr:'بينك بوربون كولومبي من فريسنو، توليما، على ارتفاع ١٥٠٠ متر. تذكر العبوة المنشورة من المحمصة إيحاءات التفاح والبلاك بيري والتوت الأزرق والبرقوق وحموضة الماليك، ومعالجة لاهوائية وهوائية.',checked:'2026-10-21'});
 const punchFacts=E.products['Pink Bourbon Punch'].facts;
 for(const f of punchFacts){if(f[0]==='Process'){f[1]='Anaerobic and aerobic';f[3]='لاهوائية وهوائية';}if(f[0]==='Notes'){f[1]=punch.profileEn;f[3]=punch.profileAr;}}
 E.products['Marani'].facts.push(['Ingredients','Green tea, flavouring, marigold blossoms and rose petals','المكونات','شاي أخضر، نكهة، أزهار القطيفة وبتلات الورد']);
 const sencha=M.products.find(p=>p.nameEn==='Sencha Sleepless Organic');
 sencha.labelEn='Sleepless Sencha';sencha.labelAr='سينشا الصحوة';
 Object.assign(S.products['Sencha Sleepless Organic'],{profileEn:'Lemon · Green tea · Mate · Guarana',profileAr:'ليمون · شاي أخضر · ماته · غوارانا',descEn:'A green-tea blend with green mate, orange peel, lemongrass, guarana and natural flavour. The current manufacturer listing specifies conventional cultivation.',descAr:'مزيج شاي أخضر مع الماته الأخضر وقشر البرتقال وعشبة الليمون والغوارانا ونكهة طبيعية. يذكر إدراج الشركة الحالي زراعة تقليدية.',brew:{device:'Tea preparation',gpl:13,temp:90,time:'2 min'},checked:'2026-10-21'});
 // An old machine formulation is not an official preparation reference.
 for(const product of M.products){
   const src=S.products[product.nameEn];
   if(src) { for(const k of ["profileEn","profileAr","descEn","descAr"]) if(src[k]!==undefined) product[k]=src[k]; }
   if(src) src.sourceKind=String(src.source||'').startsWith('package://')?'package':'web';
   if(src) { delete src.machineRecipe; delete src.customRecipe; }
   if(product.cat==='arabic'){
     const f=E.products[product.nameEn]?.facts||[];
     if(!f.some(x=>/allergen/i.test(x[0]))) f.push(['Allergens','Contains milk derivatives','مسببات الحساسية','تحتوي على مشتقات الحليب']);
   }
 }
 window.MJ_EDITION.version=15;
})();
