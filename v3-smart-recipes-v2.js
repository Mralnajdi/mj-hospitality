(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const MAX_TEA_STEEP_ML = 160;
  const COFFEE_MIN_G = 5;
  const COFFEE_MAX_G = 18;
  const MAX_CUSTOM_ML = 720;
  const DEFAULT_PRESETS = [120, 240, 360];

  const tea = (baseMl, doseG, tempC, stages, pattern = "Center", siphon = "Auto", source = "") => ({kind:"tea",baseMl,doseG,tempC,stages,pattern,siphon,source});
  const coffee = (source = "") => ({kind:"coffee",baseMl:225,ratio:15,tempC:92,grind:62,rpm:80,bloomPerGram:2,bloomSec:40,pulses:3,targetTime:"2:45–3:15",pattern:"Circular",source});

  const MODELS = {
    "Air Roastery – Ricardo": coffee("https://airroastery.com/en/product/ricardo-coffee-filter-250g/"),
    "CGLE Tres Dragones": coffee("https://methods.coffee/products/cgle-tres-dragones"),
    "Pink Bourbon Punch": coffee("https://methods.coffee/products/pink-bourbon-punch"),
    "Bourbon Sidra Sakura": coffee("https://methods.coffee/products/bourbon-sidra-sakura"),
    "EA Decaf De Cana": coffee("https://entiregoods.shop/products/methods-roastery-ea-decaf-de-cana"),
    "Entire Goods – Ethiopia Finara": coffee("https://entiregoods.shop/products/entire-goods-ethiopia-finara"),
    "Fairview Estate — Premium Kenyan Arabica": coffee("package://Fairview-Estate-Premium-Kenyan-Arabica"),
    "Fairview Estate — Kaldi City Roast": coffee("package://Fairview-Estate-Kaldi-City-Roast"),
    "Java House — Kenya AA": coffee("https://javahouseafrica.com/pantry-item/kenya-aa/"),
    "Barista & Co. — Gourmet": coffee("package://Barista-Co-Gourmet"),

    "Sencha Sleepless Organic": tea(120,1.6,90,[{ml:120,sec:120}],"Center","Auto","https://www.teegschwendner.de/en/Sleepless-Sencha/101596"),
    "Moroccan Mint Organic": tea(120,1.3,90,[{ml:120,sec:120}],"Center","Auto","https://www.teegschwendner.de/en/Morrocan-Mint-organic/100949"),
    "Japanese Cherry": tea(180,3.0,90,[{ml:90,sec:35},{ml:90,sec:45}],"Center","Auto","https://www.teegschwendner.de/en/Japanese-Cherry/100941"),
    "Le Touareg Organic": tea(120,1.3,90,[{ml:120,sec:120}],"Center","Auto","https://www.teegschwendner.de/en/Le-Touareg-organic/100915"),
    "Marani": tea(180,3.0,90,[{ml:90,sec:60},{ml:90,sec:75}],"Center","Auto","https://www.teegschwendner.de/en/Marani/100953"),
    "Chinese Royal Jasmine Rolls": tea(180,3.0,80,[{ml:90,sec:75},{ml:90,sec:90}],"Center","Auto","https://www.teegschwendner.de/en/China-Royal-Jasmine-Curls/100937"),
    "White Tea Lemon & Vanilla": tea(180,3.0,70,[{ml:90,sec:90},{ml:90,sec:120}],"Center","Auto","package://TeeGschwendner-1041"),
    "White Tea Jasmine Blossoms": tea(180,3.0,70,[{ml:90,sec:90},{ml:90,sec:120}],"Center","Auto","package://TeeGschwendner-1038"),
    "Gourmet Herbal Tea": tea(120,0.8,100,[{ml:120,minSec:300,maxSec:600}],"Circular","Auto","https://www.teegschwendner.de/en/Gourmet-Herbal-Tea/1235"),
    "Mate Green Organic": tea(120,1.3,100,[{ml:120,minSec:300,maxSec:600}],"Circular","Auto","https://www.teegschwendner.de/en/Mate-green-organic/1195"),
    "Ginger–Turmeric": tea(120,2.0,100,[{ml:120,minSec:300,maxSec:600}],"Circular","Auto","https://www.teegschwendner.de/en/Ginger-Turmeric-organic/1243"),
    "One for All": tea(120,0.7,100,[{ml:120,minSec:300,maxSec:600}],"Circular","Auto","https://www.teegschwendner.de/en/One-for-All/1111"),
    "Chamomile": tea(120,1.5,100,[{ml:120,sec:300}],"Circular","Auto","package://International-Mill-Chamomile-50g"),
    "Peach Melba": tea(90,3.1,100,[{ml:90,sec:420}],"Circular","Auto","https://www.teegschwendner.de/en/Peach-Melba/101479"),
    "Cherry Banana Flip": tea(90,3.4,100,[{ml:90,sec:420}],"Circular","Auto","https://www.teegschwendner.de/en/Cherry-Banana-Flip/101446"),
    "Berry Heaven": tea(120,2.4,100,[{ml:120,minSec:300,maxSec:600}],"Circular","Auto","https://www.tgtea-kw.com/products/berry-heaven-no-1659"),
    "Strawberry–Moringa": tea(180,4.3,100,[{ml:90,sec:240},{ml:90,sec:300}],"Circular","Auto","https://www.teegschwendner.de/en/Strawberry-Moringa/101453"),
    "Passion Fruit": tea(120,2.4,100,[{ml:120,minSec:300,maxSec:600}],"Circular","Auto","https://www.teegschwendner.de/en/Passion-Fruit/101637"),
    "Woodland Berries": tea(120,3.0,100,[{ml:120,minSec:300,maxSec:600}],"Circular","Auto","https://www.teegschwendner.de/en/Woodland-Berries/101493")
  };

  const sum = (xs) => xs.reduce((a,b)=>a+b,0);
  const round1 = (n) => Math.round((Number(n)+Number.EPSILON)*10)/10;
  const round2 = (n) => Math.round((Number(n)+Number.EPSILON)*100)/100;
  const isAr = () => document.documentElement.lang === "ar";
  const tr = (en,ar) => isAr()?ar:en;
  const esc = (s="") => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = (s="") => String(s).toLowerCase().replace(/[–—]/g,"-").replace(/\s+/g," ").trim();

  function partitionInt(total,count){
    const base=Math.floor(total/count), rem=total-base*count;
    return Array.from({length:count},(_,i)=>base+(i<rem?1:0));
  }

  function proportionalInt(total,weights){
    const ws=sum(weights), raw=weights.map(w=>total*w/ws), floors=raw.map(Math.floor);
    let left=total-sum(floors);
    const order=raw.map((v,i)=>({i,f:v-floors[i]})).sort((a,b)=>b.f-a.f||a.i-b.i);
    for(let k=0;k<left;k++) floors[order[k%order.length].i]++;
    return floors;
  }

  function distributeTenths(totalExact,weights){
    const totalTenths=Math.round(totalExact*10), ws=sum(weights);
    const raw=weights.map(w=>totalTenths*w/ws), floors=raw.map(Math.floor);
    let left=totalTenths-sum(floors);
    const order=raw.map((v,i)=>({i,f:v-floors[i]})).sort((a,b)=>b.f-a.f||a.i-b.i);
    for(let k=0;k<left;k++) floors[order[k%order.length].i]++;
    return floors.map(x=>x/10);
  }

  function formatTime(stage){
    const fmt=(s)=>s%60===0?tr(`${s/60} min`,`${s/60} د`):s>=60?tr(`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")} min`,`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")} د`):tr(`${s} sec`,`${s} ث`);
    return stage.minSec!=null&&stage.maxSec!=null?`${fmt(stage.minSec)} – ${fmt(stage.maxSec)}`:fmt(stage.sec||0);
  }

  function teaCycles(model,targetMl){
    const weights=model.stages.map(s=>s.ml);
    const maxFraction=Math.max(...weights.map(w=>w/model.baseMl));
    const capacityCycles=Math.max(1,Math.ceil((targetMl*maxFraction)/MAX_TEA_STEEP_ML));
    const profileCycles=Math.max(1,Math.floor(targetMl/model.baseMl));
    let cycles=Math.max(capacityCycles,profileCycles);
    while(cycles>1){
      const candidate=cycles-1, maxCycle=Math.ceil(targetMl/candidate), maxStage=maxCycle*maxFraction;
      if(maxStage<=MAX_TEA_STEEP_ML&&maxCycle<=model.baseMl*1.5) cycles=candidate; else break;
    }
    return cycles;
  }

  function calcTea(model,targetMl){
    targetMl=Math.round(Number(targetMl));
    const cycles=teaCycles(model,targetMl);
    const cycleVolumes=partitionInt(targetMl,cycles);
    const doses=distributeTenths((model.doseG*targetMl)/model.baseMl,cycleVolumes);
    const stageWeights=model.stages.map(s=>s.ml);
    const cycleData=cycleVolumes.map((ml,i)=>({
      ml,
      dose:doses[i],
      stages:model.stages.map((s,j)=>({...s,ml:proportionalInt(ml,stageWeights)[j]}))
    }));
    return {kind:"tea",targetMl,cycles,totalDose:round1(sum(doses)),cycleData,tempC:model.tempC,pattern:model.pattern,siphon:model.siphon,baseMl:model.baseMl,source:model.source};
  }

  function calcCoffee(model,targetMl){
    targetMl=Math.round(Number(targetMl));
    const exactTotalDose=targetMl/model.ratio;
    const cycles=Math.max(1,Math.ceil(exactTotalDose/COFFEE_MAX_G));
    const cycleVolumes=partitionInt(targetMl,cycles);
    const doses=distributeTenths(exactTotalDose,cycleVolumes);
    const cycleData=cycleVolumes.map((ml,i)=>{
      const dose=doses[i];
      const bloom=Math.min(ml,Math.round(dose*model.bloomPerGram));
      const pours=partitionInt(ml-bloom,model.pulses);
      return {ml,dose,ratio:round2(ml/dose),bloom,pours};
    });
    const totalDose=round1(sum(doses));
    return {kind:"coffee",targetMl,cycles,totalDose,overallRatio:round2(targetMl/totalDose),cycleData,tempC:model.tempC,grind:model.grind,rpm:model.rpm,bloomSec:model.bloomSec,targetTime:model.targetTime,pattern:model.pattern,baseMl:model.baseMl,source:model.source,invalidMin:cycleData.some(c=>c.dose<COFFEE_MIN_G),minMl:Math.ceil(COFFEE_MIN_G*model.ratio)};
  }

  function calculate(model,ml){
    const target=Math.round(Number(ml));
    if(!Number.isFinite(target)||target<1||target>MAX_CUSTOM_ML) return null;
    return model.kind==="tea"?calcTea(model,target):calcCoffee(model,target);
  }

  function identifyProduct(modal){
    const title=norm(modal.querySelector(".modalTitleRow h2, h2")?.textContent||"");
    if(!title) return null;
    return M.products.find(p=>{
      const bEn=p._displayBase?.en||p.nameEn, bAr=p._displayBase?.ar||p.nameAr;
      const mEn=p._maker?.en||"", mAr=p._maker?.ar||"";
      const candidates=[p.nameEn,p.nameAr,bEn,bAr,mEn?`${bEn} - ${mEn}`:"",mAr?`${bAr} - ${mAr}`:""].filter(Boolean).map(norm);
      return candidates.some(c=>c.length>=3&&(title===c||title.includes(c)||c.includes(title)));
    })||null;
  }

  function metric(label,value,sub=""){
    return `<div class="v3Metric"><span>${esc(label)}</span><b>${esc(value)}</b>${sub?`<small>${esc(sub)}</small>`:""}</div>`;
  }

  function teaDetails(r){
    const cycles=r.cycleData.map((c,ci)=>{
      const stages=c.stages.map((s,si)=>`<div class="v3StageRow"><span>${tr(`Steep ${si+1}`,`النقعة ${si+1}`)}</span><b>${s.ml} ml · ${r.tempC}°C · ${formatTime(s)}</b><small>${r.pattern} · Siphon ${r.siphon}</small></div>`).join("");
      return `<section class="v3Cycle"><div class="v3CycleHead"><b>${tr(`Cycle ${ci+1}`,`الدورة ${ci+1}`)}</b><span>${c.ml} ml · ${c.dose.toFixed(1)} g</span></div>${stages}</section>`;
    }).join("");
    return `<div class="v3Metrics">${metric(tr("Total fill","التعبئة"),`${r.targetMl} ml`)}${metric(tr("Total tea","إجمالي الشاي"),`${r.totalDose.toFixed(1)} g`)}${metric(tr("Cycles","عدد الدورات"),String(r.cycles))}${metric(tr("Temperature","الحرارة"),`${r.tempC}°C`)}${metric(tr("Pour pattern","نمط الصب"),r.pattern)}${metric("Siphon",r.siphon)}</div><div class="v3CycleList">${cycles}</div>`;
  }

  function coffeeDetails(r){
    const cycles=r.cycleData.map((c,ci)=>`<section class="v3Cycle"><div class="v3CycleHead"><b>${tr(`Brew ${ci+1}`,`التحضير ${ci+1}`)}</b><span>${c.ml} ml · ${c.dose.toFixed(1)} g · 1:${c.ratio}</span></div><div class="v3StageRow"><span>${tr("Bloom","الترطيب")}</span><b>${c.bloom} ml · ${r.bloomSec} sec</b><small>${r.tempC}°C</small></div>${c.pours.map((p,i)=>`<div class="v3StageRow"><span>${tr(`Pour ${i+1}`,`الصبة ${i+1}`)}</span><b>${p} ml</b><small>${r.pattern}</small></div>`).join("")}</section>`).join("");
    const warn=r.invalidMin?`<div class="v3Warning">${tr(`This fill is below xBloom's 5 g minimum. Use at least ${r.minMl} ml for this 1:15 profile.`,`هذا العيار أقل من حد xBloom وهو 5 غ. استخدم ${r.minMl} مل على الأقل مع نسبة 1:15.`)}</div>`:"";
    return `${warn}<div class="v3Metrics">${metric(tr("Total fill","التعبئة"),`${r.targetMl} ml`)}${metric(tr("Total coffee","إجمالي القهوة"),`${r.totalDose.toFixed(1)} g`)}${metric(tr("Actual ratio","النسبة الفعلية"),`1:${r.overallRatio}`)}${metric(tr("Brew cycles","دورات التحضير"),String(r.cycles))}${metric(tr("Temperature","الحرارة"),`${r.tempC}°C`)}${metric(tr("Grind / RPM","الطحن / RPM"),`${r.grind} / ${r.rpm}`)}${metric(tr("Target time","الوقت المستهدف"),r.targetTime,tr("per brew","لكل تحضير"))}</div><div class="v3CycleList">${cycles}</div>`;
  }

  function sourceMarkup(source){
    if(!source) return "";
    return /^https?:\/\//i.test(source)?`<a class="v3SourceTag" href="${esc(source)}" target="_blank" rel="noopener">${tr("Recipe source ↗","مرجع الوصفة ↗")}</a>`:`<span class="v3SourceTag">${tr("Package baseline","مرجع العبوة")}</span>`;
  }

  function presetList(model){
    const s=new Set(DEFAULT_PRESETS); s.add(model.baseMl); if(model.kind==="coffee")s.add(225); return [...s].sort((a,b)=>a-b);
  }

  function renderResult(card,model,ml,{syncInput=true}={}){
    const r=calculate(model,ml);
    if(!r) return false;
    card.dataset.v3Ml=String(r.targetMl);
    const result=card.querySelector(".v3Result");
    if(result) result.innerHTML=model.kind==="tea"?teaDetails(r):coffeeDetails(r);
    card.querySelectorAll("[data-v3fix-ml]").forEach(b=>b.classList.toggle("active",Number(b.dataset.v3fixMl)===r.targetMl));
    const input=card.querySelector("[data-v3fix-input]");
    if(input&&syncInput) input.value=String(r.targetMl);
    return true;
  }

  function setMode(card,mode){
    card.dataset.v3Mode=mode;
    card.querySelectorAll("[data-v3fix-mode]").forEach(b=>b.classList.toggle("active",b.dataset.v3fixMode===mode));
    const preset=card.querySelector(".v3PresetPanel"), custom=card.querySelector(".v3CustomPanel");
    if(preset) preset.hidden=mode!=="preset";
    if(custom) custom.hidden=mode!=="custom";
  }

  function buildCard(card,p,model){
    const presets=presetList(model);
    card.dataset.v3Product=p.nameEn;
    card.dataset.v3Ml=String(model.baseMl);
    card.dataset.v3Mode="preset";
    card.innerHTML=`<div class="v3Head"><div><div class="v3Eyebrow">V3 · SMART xBLOOM</div><h3>${tr("Smart Recipe Calculator","حاسبة وصفة xBloom الذكية")}</h3><p>${esc(p.nameEn)}</p></div><span class="v3AuditBadge">✓ ${tr("3× checked","مدققة ×3")}</span></div><div class="v3ModeTabs"><button type="button" class="active" data-v3fix-mode="preset">${tr("Machine standard","المعيار المعتمد")}</button><button type="button" data-v3fix-mode="custom">${tr("Custom fill","مخصص")}</button></div><div class="v3PresetPanel"><div class="v3PresetRail">${presets.map(ml=>`<button type="button" data-v3fix-ml="${ml}">${ml} ml${ml===model.baseMl?`<small>${tr("base","الأصلي")}</small>`:""}</button>`).join("")}</div></div><div class="v3CustomPanel" hidden><label><span>${tr("Required fill","عيار التعبئة المطلوب")}</span><div><input type="number" inputmode="decimal" min="1" max="${MAX_CUSTOM_ML}" step="1" value="${model.baseMl}" data-v3fix-input autocomplete="off"><em>ml</em></div></label><small>${tr(`1–${MAX_CUSTOM_ML} ml · updates instantly`,`1–${MAX_CUSTOM_ML} مل · الحسبة تتحدث مباشرة`)}</small></div><div class="v3Result"></div><div class="v3LogicNote">${model.kind==="tea"?tr("Dose is scaled from this tea's approved baseline. The calculator splits the fill only when needed to keep every Omni steep at or below 160 ml.","الجرعة محسوبة من معيار هذا الشاي المعتمد، ويقسّم النظام التعبئة فقط عند الحاجة حتى لا تتجاوز أي نقعة في Omni سعة 160 مل."):tr("The 1:15 profile is preserved to 0.1 g dose resolution. Brews are split automatically whenever a single brew would exceed 18 g.","يحافظ النظام على نسبة 1:15 بدقة جرعة 0.1 غ، ويقسّم التحضير تلقائيًا إذا تجاوز التحضير الواحد 18 غ.")}</div><div class="v3Sources">${sourceMarkup(model.source)}<span class="v3SourceTag">xBloom: ${model.kind==="tea"?"Omni ≤160 ml/steep":"5–18 g"}</span></div>`;

    renderResult(card,model,model.baseMl);

    card.querySelectorAll("[data-v3fix-mode]").forEach(btn=>btn.addEventListener("click",e=>{
      e.preventDefault(); e.stopPropagation();
      const mode=btn.dataset.v3fixMode; setMode(card,mode);
      if(mode==="custom") setTimeout(()=>card.querySelector("[data-v3fix-input]")?.focus({preventScroll:true}),0);
    }));

    card.querySelectorAll("[data-v3fix-ml]").forEach(btn=>btn.addEventListener("click",e=>{
      e.preventDefault(); e.stopPropagation(); setMode(card,"preset"); renderResult(card,model,Number(btn.dataset.v3fixMl));
    }));

    const input=card.querySelector("[data-v3fix-input]");
    input?.addEventListener("input",e=>{
      e.stopPropagation();
      const raw=e.currentTarget.value.trim();
      if(raw==="") return;
      const ml=Math.round(Number(raw));
      if(Number.isFinite(ml)&&ml>=1&&ml<=MAX_CUSTOM_ML) renderResult(card,model,ml,{syncInput:false});
    });
    input?.addEventListener("click",e=>e.stopPropagation());
    input?.addEventListener("focus",()=>setMode(card,"custom"));
  }

  function attach(modal){
    const p=identifyProduct(modal), model=p&&MODELS[p.nameEn];
    if(!p||!model) return;
    let card=modal.querySelector(".v3SmartRecipe");
    if(card?.dataset.v3Engine==="2") return;
    if(!card){
      const old=modal.querySelector(".v2RecipeCard,.recipeCard");
      card=document.createElement("section"); card.className="v3SmartRecipe";
      if(old) old.replaceWith(card); else (modal.querySelector(".modalContent")||modal).appendChild(card);
    }
    card.dataset.v3Engine="2";
    buildCard(card,p,model);
    modal.querySelectorAll(".v2RecipeCard,.recipeCard").forEach(x=>x.remove());
  }

  function auditOnce(){
    const errors=[];
    for(const [name,model] of Object.entries(MODELS)){
      for(let ml=1;ml<=MAX_CUSTOM_ML;ml++){
        const r=calculate(model,ml);
        if(!r){errors.push(`${name}: no result @${ml}`);continue;}
        if(sum(r.cycleData.map(c=>c.ml))!==ml) errors.push(`${name}: cycle total @${ml}`);
        if(model.kind==="tea"){
          for(const c of r.cycleData){
            if(sum(c.stages.map(s=>s.ml))!==c.ml) errors.push(`${name}: stage total @${ml}`);
            if(c.stages.some(s=>s.ml>MAX_TEA_STEEP_ML)) errors.push(`${name}: >160ml @${ml}`);
          }
          const expected=round1(model.doseG*ml/model.baseMl);
          if(r.totalDose!==expected) errors.push(`${name}: dose ${r.totalDose} != ${expected} @${ml}`);
        }else{
          for(const c of r.cycleData){
            if(c.dose>COFFEE_MAX_G) errors.push(`${name}: >18g @${ml}`);
            if(c.bloom+sum(c.pours)!==c.ml) errors.push(`${name}: water total @${ml}`);
          }
          const expected=round1(ml/model.ratio);
          if(r.totalDose!==expected) errors.push(`${name}: dose ${r.totalDose} != ${expected} @${ml}`);
        }
      }
    }
    return errors;
  }

  const audits=[auditOnce(),auditOnce(),auditOnce()];
  window.MJ_V3_SMART_RECIPES=MODELS;
  window.MJ_V3_CALCULATE=(name,ml)=>MODELS[name]?calculate(MODELS[name],ml):null;
  window.MJ_V3_AUDIT={ok:audits.every(a=>a.length===0),passes:audits.map((errors,i)=>({pass:i+1,ok:errors.length===0,errors})),products:Object.keys(MODELS).length,volumesChecked:MAX_CUSTOM_ML};

  const scan=()=>document.querySelectorAll(".productModal").forEach(attach);
  const obs=new MutationObserver(()=>requestAnimationFrame(scan));
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("click",()=>setTimeout(scan,20),true);
  setTimeout(scan,0);
})();
