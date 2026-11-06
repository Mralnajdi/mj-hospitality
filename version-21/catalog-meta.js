/* Creation provenance is separate from last modification and purchase date. */
(() => {
 const P=window.MJ_MENU.products,E=window.MJ_EXTRA.products;
 const importedNames=['Soil — Verde','Soil — Fazenda','Air Roastery — La Plata','Black Knight — Kitkat Infused','Black Knight — Yemen Cascara','SPEAK — Colombia Peach','SPEAK — Colombia Strawberry'];
 const firstImport={addedAt:'2026-10-28T19:02:01+03:00',addedBatch:'purchases-2cd40934916d',entrySource:'https://github.com/Mralnajdi/mj-hospitality/commit/2cd40934916d62155faf821b64e09df93bc25826'};
 const verifiedScores={
  'Jebla – KitKat':{value:87,system:'SCA',source:'https://jeblacoffeeroasters.com/products/romario-kitkat',sourceType:'roaster',checked:'2026-10-30'},
  'Jebla – Romario':{value:83,system:'SCA',source:'https://jeblacoffeeroasters.com/ar/products/%D8%B1%D9%88%D9%85%D8%A7%D8%B1%D9%8A%D9%88-%D8%A8%D8%B1%D8%A7%D8%B2%D9%8A%D9%84',sourceType:'roaster',checked:'2026-10-30'}
 };
 function latestBatch(products){
  const dated=products.filter(p=>typeof p.addedAt==='string'&&Number.isFinite(Date.parse(p.addedAt)));
  const latest=dated.reduce((best,p)=>!best||Date.parse(p.addedAt)>Date.parse(best.addedAt)?p:best,null);
  if(!latest)return [];
  return dated.filter(p=>latest.addedBatch?p.addedBatch===latest.addedBatch:p.addedAt===latest.addedAt);
 }
 function validScore(score){return !!score&&typeof score.value==='number'&&Number.isFinite(score.value)&&score.value>=0&&score.value<=100&&typeof score.source==='string'&&/^(https:\/\/|package:\/\/)/.test(score.source);}
 for(const p of P){
  if(importedNames.includes(p.nameEn)&&!p.addedAt)Object.assign(p,firstImport);
  p.cuppingScore=validScore(p.cuppingScore)?p.cuppingScore:verifiedScores[p.nameEn]||null;
  if(p.cuppingScore){
   const entry=E[p.nameEn]||(E[p.nameEn]={facts:[]}),score=p.cuppingScore;
   entry.facts=entry.facts.filter(f=>!/^sca score$|^cupping score$|^published cupping score$/i.test(f[0]));
   entry.facts.push(['Published cupping score',`${score.value} / 100${score.system?' · '+score.system:''}`,'تقييم التذوق المنشور',`${score.value} / 100${score.system?' · '+score.system:''}`]);
  }
 }
 const latest=new Set(latestBatch(P));
 P.forEach(p=>p.isLatestAddition=latest.has(p));
 window.MJ_CATALOG_META={latestBatch,validScore,latestNames:[...latest].map(p=>p.nameEn)};
})();
