/* Review data corrections; source recipes remain unchanged. */
(()=>{
 const products=window.MJ_MENU?.products||[];
 for(const p of products){if(/cascara|قشر البن/i.test([p.nameEn,p.nameAr].join(' '))){p.cat='specialty';p.subAr='اليمن';p.subEn='Yemen';p.isCascara=true;}}
 for(const p of products){if(/Zill Kenya/i.test(p.nameEn||''))p.presentationImage='assets/arabic-kenya-matched.webp';}
 const D=window.MJ_ICE_DATA;
 if(D)D.recipes=D.recipes.filter(r=>r.state==='quantified'&&r.ingredients?.length&&r.steps?.length);
 const flavourWords={
'mango-classic':['مانجو|زبادي|فانيلا','Mango|Yoghurt|Vanilla'],
'mango-natural':['مانجو','Mango'],
'mango-coconut-creamy':['مانجو|جوز الهند|فانيلا','Mango|Coconut|Vanilla'],
'mango-slush':['مانجو','Mango'],
'mango-chilli-name':['مانجو|جوز الهند|فلفل حار','Mango|Coconut|Chilli'],
'mango-royale':['مانجو|أناناس مشوي|زعفران','Mango|Grilled pineapple|Saffron'],
'cherry-basil':['كرز|ليمون|ريحان','Cherry|Lemon|Basil'],
'cherry-pomegranate':['كرز|رمان|فلفل وردي','Cherry|Pomegranate|Pink pepper'],
'cherry-pineapple':['كرز|أناناس|زنجبيل','Cherry|Pineapple|Ginger'],
'mango-coconut-milk':['مانجو|حليب نباتي|فانيلا','Mango|Plant milk|Vanilla'],
'mango-mint':['مانجو|ليمون|نعناع','Mango|Lemon|Mint'],
'mango-chilli-lemon':['مانجو|شطة خفيفة|ليمون','Mango|Mild chilli|Lemon'],
'mango-kiwi':['مانجو|كيوي|زنجبيل','Mango|Kiwi|Ginger'],
'cucumber':['خيار|ليمون|نعناع','Cucumber|Lemon|Mint'],
'mixed-berries':['توت مشكّل|ليمون','Mixed berries|Lemon'],
'banana-cocoa':['موز|كاكاو|قرفة','Banana|Cocoa|Cinnamon'],
'vanilla-almond-protein':['فانيلا|لوز|قرفة','Vanilla|Almond|Cinnamon'],
'dates-caramel':['تمر|كراميل مملح','Dates|Salted caramel'],
'yellow-watermelon':['رقي أصفر|ليمون','Yellow watermelon|Lemon'],
'jabuticaba':['جابوتيكابا|ليمون','Jabuticaba|Lemon'],
'evogen-caramel':['لوز|كراميل مملح','Almond|Salted caramel'],
'evogen-sandwich':['لوز|ساندويتش','Almond|Sandwich'],
'evogen-coffee':['لوز|فانيلا|كولد برو','Almond|Vanilla|Cold brew'],
'on-chocolate':['لوز|شوكولاتة','Almond|Chocolate'],
'ghost-cereal':['لوز|حليب الحبوب','Almond|Cereal milk']};
 if(D)for(const r of D.recipes){r.cardFlavours=flavourWords[r.id]?.map(x=>x.split('|'));}
 if(D)for(const r of D.recipes){if(!r.image){r.presentationOnly=true;r.image=r.id==='mango-slush'?'mango-slush-review':'mango';}}
})();
