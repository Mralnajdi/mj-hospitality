/* Edition 20. Explicit sensory families from the stored product profiles.
 * No acidity, machine compatibility or recipe is inferred from a fruit name.
 * Each dimension is OR; different dimensions are AND.
 */
(() => {
 const labels={
  fruit:['فاكهي','Fruity'],citrus:['حمضيات','Citrus'],floral:['زهري','Floral'],
  chocolateNuts:['شوكولاتة ومكسرات','Chocolate & nuts'],caramelHoney:['كراميل وعسل','Caramel & honey'],spice:['توابل','Spices'],
  green:['نباتي وعشبي','Vegetal & herbal'],sweetCream:['حلو وكريمي','Sweet & creamy'],
  cardamom:['هيل','Cardamom'],saffron:['زعفران','Saffron'],clove:['قرنفل','Clove'],
  berries:['توت','Berries'],botanical:['خيار وأعشاب','Cucumber & herbs'],hibiscus:['كركديه','Hibiscus'],cola:['كولا','Cola'],
  chocolate:['شوكولاتة','Chocolate'],vanillaCream:['فانيلا وقشطة','Vanilla & cream'],caramelDates:['كراميل وتمر','Caramel & dates'],nuts:['مكسرات','Nuts'],
  hot:['حار','Hot'],iced:['بارد','Iced'],caffeine:['بكافيين','Caffeinated'],decaf:['منزوع الكافيين','Decaffeinated'],caffeinefree:['بدون كافيين','Caffeine-free'],
  morning:['الصباح','Morning'],evening:['المساء','Evening'],filter:['فلتر','Filter'],espresso:['إسبريسو','Espresso'],
  zill:['آلة قهوة زِل','Zill Coffee machine'],xbloom:['xBloom Studio','xBloom Studio'],manual:['تحضير يدوي','Manual preparation']
 };
 const map={
  'Zill Shagra':['cardamom','saffron'], 'Zill Original':['cardamom','saffron','clove'], 'Zill Ghamjah':['cardamom'], 'Zill Kenya Capsules':['cardamom','saffron','clove'],
  'Air Roastery – Ricardo':['chocolateNuts'], 'CGLE Tres Dragones':['fruit','chocolateNuts','caramelHoney'], 'Pink Bourbon Punch':['fruit'],
  'Bourbon Sidra Sakura':['fruit'], 'EA Decaf De Cana':['citrus'], 'Entire Goods – Ethiopia Finara':['fruit'],
  'Fairview Estate — Premium Kenyan Arabica':['citrus','floral'], 'Fairview Estate — Kaldi City Roast':['caramelHoney'],
  'Java House — Kenya AA':['fruit','spice'], 'Barista & Co. — Gourmet':['chocolateNuts','caramelHoney','citrus'],
  'Methods Roastery – Honey Double Fermentation':['fruit','floral'], 'Jebla – Zorro':['fruit','chocolateNuts'],
  'Jebla – KitKat':['chocolateNuts','caramelHoney'], 'Jebla – Romario':['chocolateNuts','caramelHoney'],
  'Jebla – Qayel Ali':['fruit','spice','caramelHoney'], 'Stockroom – Ethiopia Omran':['fruit'],
  'Sencha Sleepless Organic':['citrus','green'], 'Moroccan Mint Organic':['green'], 'Japanese Cherry':['fruit'],
  'Le Touareg Organic':['green'], 'Marani':['fruit','citrus','floral'], 'Chinese Royal Jasmine Rolls':['floral'],
  'White Tea Lemon & Vanilla':['citrus','sweetCream'], 'White Tea Jasmine Blossoms':['floral'], 'Gourmet Herbal Tea':['green','sweetCream','citrus'],
  'Mate Green Organic':['green'], 'Ginger–Turmeric':['spice'], 'One for All':['green','floral'], 'Chamomile':['floral'],
  'Peach Melba':['fruit','sweetCream'], 'Cherry Banana Flip':['fruit'], 'Berry Heaven':['fruit'],
  'Strawberry–Moringa':['fruit','citrus','green'], 'Passion Fruit':['fruit'], 'Woodland Berries':['fruit'],
  'Ginger Lemongrass Organic':['spice','citrus','green'], 'Grenoille Peaches & Cream':['fruit','sweetCream'],
  'Ayurveda Kapha Organic':['spice','green'], 'Pineapple Mango':['fruit'], 'China Yin Zhen Organic':['green','sweetCream'],
  'Nabta – Hibiscus':['floral'],
  'Cola':['cola'], 'Raspberry Lemon':['berries','citrus'], 'Rosemary Cucumber':['botanical'],
  'Hibiscus':['hibiscus'], 'Raspberry & Blackcurrant':['berries'], 'Cucumber & Mint':['botanical']
 };
 const familyOrder={arabic:['cardamom','saffron','clove'],specialty:['fruit','citrus','floral','chocolateNuts','caramelHoney','spice'],tea:['fruit','citrus','floral','green','spice','sweetCream'],sparkling:['citrus','berries','botanical','hibiscus','cola']};
 function beverage(p,tags){
  const serve=(p.serveEn||'').toLowerCase(), source=window.MJ_SOURCES?.products?.[p.nameEn];
  const temperature=[...(/\bhot\b/.test(serve)?['hot']:[]),...(/iced|cold|chilled|ice|sparkling water/.test(serve)?['iced']:[])];
  const preparation=[...(/\bfilter\b/.test(serve)?['filter']:[]),...(/\bespresso\b/.test(serve)?['espresso']:[])];
  const device=p.cat==='arabic'?['zill']:p.cat==='sparkling'?['manual']:['specialty','tea'].includes(p.cat)?['xbloom']:[];
  return {kind:[p.subEn],temperature,preparation,device,caffeine:tags.filter(x=>['caffeine','decaf','caffeinefree'].includes(x)),time:tags.filter(x=>['morning','evening'].includes(x)),sensory:p.sensoryKeys||map[p.nameEn]||[]};
 }
 function matches(values,selected){return Object.entries(selected).every(([key,keys])=>!keys.length||keys.some(k=>(values[key]||[]).includes(k)));}
 function iceSensory(r){
  // Quantified recipes use ingredients; notebook names use only their explicit titles.
  const text=(r.state==='quantified'?r.ingredients.map(i=>i.name?.[1]||'').join(' '):r.title[1]).toLowerCase();
  const out=[];
  if(/mango|papaya|pineapple|cherry|berr|banana|watermelon|jabuticaba|cucumber|prickly pear/.test(text))out.push('fruit');
  if(/cocoa|chocolate|ice cream sandwich/.test(text))out.push('chocolate');
  if(/vanilla|yoghurt|yogurt|cereal milk/.test(text)||(r.state==='quantified'&&/\bcream\b/.test(text)))out.push('vanillaCream');
  if(/caramel|\bdates\b/.test(text))out.push('caramelDates');
  if(/almond|cashew|pistachio|hazelnut/.test(text))out.push('nuts');
  return out;
 }
 window.MJ_FILTERS={labels,map,familyOrder,beverage,matches,iceSensory};
})();
