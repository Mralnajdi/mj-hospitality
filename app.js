(async()=>{
  const M=window.MJ_MENU,E=window.MJ_EXTRA||{products:{}};
  if(!M)return;
  const app=document.getElementById('app'),main=document.getElementById('main');
  const back=document.getElementById('backBtn'),langBtn=document.getElementById('langBtn'),searchBtn=document.getElementById('searchBtn');
  const C=M.cats,P=M.products,order=['arabic','specialty','tea','sparkling'];
  const A={
    home:'assets/heroes-v3/home-mj-finjan.webp',
    categories:{arabic:'assets/heroes-v3/arabic-mj-finjan.webp',specialty:'assets/heroes-v2/specialty.webp',tea:'assets/heroes-v2/tea.webp',sparkling:'assets/heroes-v2/sparkling.webp'}
  };
  let lang=localStorage.getItem('mj_lang')||'en',modalProduct=null,modalFromHistory=false,lastFocus=null,lockedScroll=0;
  const clean=s=>String(s??'').replace(/\b(?:Zill|Seleco)\b/gi,'').replace(/(?:زِل|زل|سيليكو|سيليو)/g,'').replace(/\s{2,}/g,' ').trim();
  const ar=()=>lang==='ar',t=(en,a)=>clean(ar()?a:en);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const slug=s=>s.toLowerCase().normalize('NFKD').replace(/[–—&]/g,'-').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const productAssets=[
    '01-zill-shagra','02-zill-original','03-zill-ghamjah','04-air-ricardo','05-tres-dragones','06-pink-bourbon-punch','07-bourbon-sidra-sakura','08-ea-decaf','09-ethiopia-finara','10-sencha-sleepless','11-moroccan-mint','12-japanese-cherry','13-le-touareg','14-marani','15-jasmine-rolls','16-white-lemon-vanilla','17-white-jasmine','18-gourmet-herbal','19-mate-green','20-ginger-turmeric','21-one-for-all','22-chamomile','23-peach-melba','24-cherry-banana','25-berry-heaven','26-strawberry-moringa','27-passion-fruit','28-woodland-berries','29-seleco-cola','30-seleco-raspberry-lemon','31-rosemary-cucumber','32-hibiscus','33-raspberry-blackcurrant','34-cucumber-mint','35-fairview-premium','36-fairview-kaldi','37-java-house-kenya-aa','38-barista-gourmet'
  ];
  const arabicProductAssets=['assets/products-v3/arabic-shagra-mj.webp','assets/products-v3/arabic-original-mj.webp','assets/products-v3/arabic-ghamjah-mj.webp'];
  P.forEach((p,i)=>{p._id=slug(p.nameEn);p._index=i;p._sprite=[i%6,Math.floor(i/6)];p._visual=arabicProductAssets[i]||`assets/products-v2/${productAssets[i]}.webp`});
  const aliases={'CGLE Tres Dragones':'Methods – CGLE Tres Dragones','Pink Bourbon Punch':'Methods – Pink Bourbon Punch','Bourbon Sidra Sakura':'Methods – Bourbon Sidra Sakura','EA Decaf De Cana':'Methods – EA Decaf De Cana'};
  const extra=p=>E.products?.[p.nameEn]||E.products?.[aliases[p.nameEn]]||{facts:[]};
  const facts=p=>extra(p).facts||[];
  const route=()=>{let h=location.hash.slice(1)||'/';return h.startsWith('/')?h:'/'+h};
  const go=path=>{closeModal(false);route()===path?render():location.hash=path};
  const imageFor=p=>p._visual||p.image||A.categories[p.cat]||A.home;
  const visualFor=(p,modal=false)=>`<img src="${imageFor(p)}" alt="${esc(t(p.nameEn,p.nameAr))}" loading="${modal?'eager':'lazy'}" decoding="async">`;
  const tagMeta={
    morning:{icon:'sun',en:'Morning',ar:'الصباح'},evening:{icon:'moon',en:'Evening',ar:'المساء'},
    caffeine:{icon:'bean',en:'Caffeine',ar:'كافيين'},decaf:{icon:'decaf',en:'Decaf',ar:'ديكاف'},
    caffeinefree:{icon:'free',en:'Caffeine-Free',ar:'بدون كافيين'},iced:{icon:'ice',en:'Iced',ar:'بارد'}
  };
  const icon=n=>({sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>',moon:'<svg viewBox="0 0 24 24"><path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5Z"/></svg>',bean:'<svg viewBox="0 0 24 24"><path d="M18.4 4.8c3.1 3.1 1.4 9.8-2.4 13.6S5.5 23.9 2.4 20.8 1 11 4.8 7.2 15.3 1.7 18.4 4.8Z"/><path d="M4.8 19c4.2-1.8 5.2-7.5 12.4-12.4"/></svg>',decaf:'<svg viewBox="0 0 24 24"><path d="M5 8h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M4 4l16 16"/></svg>',free:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m6 18 12-12"/></svg>',ice:'<svg viewBox="0 0 24 24"><path d="M12 2v20M4.2 6.5l15.6 11M19.8 6.5l-15.6 11M8 4l4 3 4-3M8 20l4-3 4 3"/></svg>'}[n]||'');
  function productTags(p){
    const out=[],time=(p.timeEn+' '+p.timeAr).toLowerCase(),serve=(p.serveEn+' '+p.serveAr).toLowerCase();
    if(/morning|الصباح/.test(time))out.push('morning');
    if(/evening|المساء/.test(time))out.push('evening');
    if(/iced|cold|بارد|ثلج/.test(serve))out.push('iced');
    const cf=facts(p).find(f=>String(f[0]).toLowerCase()==='caffeine');
    if(cf){const v=String(cf[1]).toLowerCase();if(v.trim()==='0 mg')out.push('caffeinefree');else if(v.includes('decaf'))out.push('decaf');else if(v.includes('present'))out.push('caffeine')}
    return out;
  }
  function tagButton(k,filter=false){const m=tagMeta[k];return `<button class="moodTag ${filter?'filterTag':''}" type="button" data-tag="${k}" aria-label="${esc(t(m.en,m.ar))}" title="${esc(t(m.en,m.ar))}"><span aria-hidden="true">${icon(m.icon)}</span><b>${esc(t(m.en,m.ar))}</b></button>`}
  function categorySwitcher(active){return `<nav class="categorySwitcher" aria-label="${esc(t('Collections','الأقسام'))}">${order.map(k=>`<button type="button" class="${k===active?'active':''}" data-go="/collection/${k}"><span>${esc(t(C[k].en,C[k].ar))}</span><i>${String(P.filter(p=>p.cat===k).length).padStart(2,'0')}</i></button>`).join('')}</nav>`}
  function setText(){
    document.documentElement.lang=lang;document.documentElement.dir=ar()?'rtl':'ltr';app.dir=ar()?'rtl':'ltr';
    langBtn.textContent=ar()?'EN':'عربي';
    document.querySelector('.brandCopy').innerHTML=ar()?'مجموعة<br><b>الضيافة الخاصة</b>':'PRIVATE<br><b>HOSPITALITY COLLECTION</b>';
    const map={home:['Home','الرئيسية'],arabic:['Arabic','عربية'],coffee:['Coffee','قهوة'],tea:['Tea','شاي'],spark:['Sparkling','غازية']};
    document.querySelectorAll('[data-nav-label]').forEach(x=>x.textContent=t(...map[x.dataset.navLabel]));
  }
  function hero(k,title,desc,home=false){
    const img=home?A.home:A.categories[k];
    return `<section class="hero interactiveHero" data-depth><img src="${img}" alt="${esc(title)}"><div class="shade"></div><div class="heroCopy"><div class="eyebrow">MJ · ${esc(t('Private Hospitality','الضيافة الخاصة'))}</div><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p></div><button class="heroExplore" type="button" data-scroll-catalog>${esc(t('Explore the collection','استكشف المجموعة'))}<span>↓</span></button></section>`;
  }
  function home(){
    const homeCategoryImages={arabic:'assets/home-v2/arabic-mj.webp',specialty:'assets/home-v2/specialty-mj.webp',tea:'assets/home-v2/tea-mj.webp',sparkling:'assets/home-v2/sparkling-mj.webp'};
    const cards=order.map((k,i)=>{const c=C[k],image=homeCategoryImages[k];return `<article class="categoryCard tiltCard revealCard" tabindex="0" role="button" data-go="/collection/${k}"><img src="${image}" alt="${esc(t(c.en,c.ar))}" loading="lazy" decoding="async"><div class="cardGlow" aria-hidden="true"></div><div class="cardCopy"><div class="eyebrow">0${i+1}</div><h3>${esc(t(c.en,c.ar))}</h3><p>${esc(t(c.subEn,c.subAr))}</p><span class="enterArrow">↗</span></div></article>`}).join('');
    const moods=['morning','evening','caffeine','caffeinefree','iced'].map(k=>{const m=tagMeta[k];return `<button class="moodTag homeMoodChoice" type="button" data-go="/discover/${k}"><span aria-hidden="true">${icon(m.icon)}</span><b>${esc(t(m.en,m.ar))}</b></button>`}).join('');
    main.innerHTML=hero('arabic',t('The art of hosting.','فن الضيافة.'),t('A private beverage collection shaped around mood, ritual and detail.','مجموعة مشروبات خاصة صُممت حول المزاج والطقس والتفاصيل.'),true)+`<section class="homeMoodBar" aria-label="${esc(t('Discover by mood','اكتشف حسب المزاج'))}"><div class="eyebrow">${esc(t('Discover by mood','اكتشف حسب المزاج'))}</div><div class="homeMoodChoices">${moods}</div></section><section class="section" id="catalog"><div class="sectionHead"><div><div class="eyebrow">${esc(t('The collection','المجموعة'))}</div><h2 class="title">${esc(t('Choose your experience','اختر تجربتك'))}</h2></div></div><p class="desc">${esc(t('Enter one collection and discover every product without unnecessary steps.','ادخل المجموعة واكتشف جميع منتجاتها من دون خطوات زائدة.'))}</p><div class="categoryGrid">${cards}</div></section>`;
    bindCommon();
  }
  function groupProducts(items){const groups=[];for(const p of items){let g=groups.find(x=>x.en===p.subEn);if(!g){g={en:p.subEn,ar:p.subAr,items:[]};groups.push(g)}g.items.push(p)}return groups}
  function productCard(p){
    const tags=productTags(p).map(k=>tagButton(k)).join('');
    return `<article class="productTile tiltCard" tabindex="0" role="button" data-product="${p._id}" data-tags="${productTags(p).join(' ')}"><div class="productImage">${visualFor(p)}<span class="quickView">${esc(t('Quick view','عرض سريع'))} ↗</span></div><div class="productBody"><div class="productTitleRow"><h3>${esc(t(p.nameEn,p.nameAr))}</h3></div><div class="tagRail productTags">${tags}</div><p class="profile">${esc(t(p.profileEn,p.profileAr))}</p><p class="micro">${esc(t(p.serveEn,p.serveAr))} · ${esc(t(p.timeEn,p.timeAr))}</p></div></article>`;
  }
  function filterBar(){return `<div class="filterDock" aria-label="${esc(t('Mood filters','فلاتر المزاج'))}"><div class="filterIntro"><span>${esc(t('Filter by mood','صفِّ حسب المزاج'))}</span><b id="resultCount"></b></div><div class="filterTags">${['morning','evening','caffeine','caffeinefree','iced'].map(k=>tagButton(k,true)).join('')}<button class="clearFilters" type="button" data-clear-filters>${esc(t('Clear','مسح'))}</button></div></div>`}
  function collection(k,preFilter){
    const c=C[k];if(!c)return home();const items=P.filter(p=>p.cat===k),groups=groupProducts(items);
    const body=k==='arabic'?`<section class="directProducts"><div class="groupHeader static"><div><span class="eyebrow">${esc(t('Three expressions','ثلاثة أنواع'))}</span><h2>${esc(t('Light · Original · Dark','الفاتحة · الأصلية · الغامقة'))}</h2></div><span class="groupCount">${items.length}</span></div><div class="productGrid">${items.map(productCard).join('')}</div></section>`:groups.map((g,i)=>`<details class="collectionGroup" open data-group><summary><div><span class="eyebrow">0${i+1}</span><h2>${esc(t(g.en,g.ar))}</h2></div><div class="summaryMeta"><span class="groupCount">${g.items.length}</span><span class="accordionIcon">⌄</span></div></summary><div class="productGrid">${g.items.map(productCard).join('')}</div></details>`).join('');
    main.innerHTML=hero(k,t(c.en,c.ar),t(c.subEn,c.subAr))+categorySwitcher(k)+`<section class="section catalogSection" id="catalog">${filterBar()}<div class="catalogTools"><div><div class="eyebrow">${esc(t('All products','كل المنتجات'))}</div><h2 class="title">${esc(t('Explore without leaving the page','اكتشف من دون مغادرة الصفحة'))}</h2></div>${k==='arabic'?'':`<button class="btn" type="button" data-toggle-groups>${esc(t('Close all','إغلاق الكل'))}</button>`}</div><div class="groupsWrap">${body}</div><p class="emptyState" hidden>${esc(t('No products match these filters.','لا توجد منتجات تطابق هذه الفلاتر.'))}</p></section>`;
    bindCommon();bindCatalog(preFilter);
  }
  function all(preFilter){
    main.innerHTML=`<section class="searchHero"><div class="eyebrow">${esc(t('Full collection','المجموعة الكاملة'))}</div><h1 class="title">${esc(t('Find your next experience','ابحث عن تجربتك القادمة'))}</h1><label class="searchBox"><span>⌕</span><input id="q" type="search" autocomplete="off" placeholder="${esc(t('Search by product, origin or flavour…','ابحث بالمنتج أو المنشأ أو النكهة…'))}"></label></section><section class="section catalogSection" id="catalog">${filterBar()}<div class="groupsWrap">${order.map(k=>`<details class="collectionGroup" open data-group><summary><div><span class="eyebrow">MJ</span><h2>${esc(t(C[k].en,C[k].ar))}</h2></div><div class="summaryMeta"><span class="groupCount">${P.filter(p=>p.cat===k).length}</span><span class="accordionIcon">⌄</span></div></summary><div class="productGrid">${P.filter(p=>p.cat===k).map(productCard).join('')}</div></details>`).join('')}</div><p class="emptyState" hidden>${esc(t('No matching products.','لا توجد منتجات مطابقة.'))}</p></section>`;
    bindCommon();bindCatalog(preFilter,true);
  }
  function hotspotLabels(p){return t(p.profileEn,p.profileAr).split('·').map(x=>x.trim()).filter(Boolean).slice(0,3)}
  function modalMarkup(p){
    const fs=facts(p),labels=hotspotLabels(p),tags=productTags(p).map(k=>tagButton(k)).join('');
    const dots=labels.map((x,i)=>`<button class="hotspot hs${i+1}" type="button" aria-label="${esc(x)}"><i></i><span>${esc(x)}</span></button>`).join('');
    const fhtml=fs.length?fs.map(f=>`<div class="fact"><div class="factKey">${esc(t(f[0],f[2]))}</div><div class="factVal">${esc(t(f[1],f[3]))}</div></div>`).join(''):`<div class="fact"><div class="factKey">${esc(t('Reference','المرجع'))}</div><div class="factVal">${esc(t('Documented collection profile','ملف المجموعة الموثق'))}</div></div>`;
    return `<div class="modalBackdrop" data-close-modal></div><section class="productModal" role="dialog" aria-modal="true" aria-label="${esc(t(p.nameEn,p.nameAr))}"><div class="dragHandle" aria-hidden="true"></div><button class="modalClose" type="button" data-close-modal aria-label="${esc(t('Close','إغلاق'))}">×</button><div class="modalVisual" data-modal-visual>${visualFor(p,true)}${dots}<div class="visualHint">${esc(t('Touch the flavour points','المس نقاط النكهة'))}</div></div><div class="modalContent"><div class="eyebrow">${esc(t(C[p.cat].en,C[p.cat].ar))} · ${esc(t(p.subEn,p.subAr))}</div><div class="modalTitleRow"><h2>${esc(t(p.nameEn,p.nameAr))}</h2></div><div class="tagRail modalTags">${tags}</div><p class="profile">${esc(t(p.profileEn,p.profileAr))}</p><p class="story">${esc(t(p.descEn,p.descAr))}</p><div class="experience"><div class="xp"><small>${esc(t('Best serve','أفضل تقديم'))}</small><div>${esc(t(p.serveEn,p.serveAr))}</div></div><div class="xp"><small>${esc(t('Best time','أفضل وقت'))}</small><div>${esc(t(p.timeEn,p.timeAr))}</div></div></div><div class="facts">${fhtml}</div><div class="modalNav"><button type="button" data-modal-prev>← ${esc(t('Previous','السابق'))}</button><button type="button" data-modal-next>${esc(t('Next','التالي'))} →</button></div></div></section>`;
  }
  function openModal(id,push=true){
    const p=P.find(x=>x._id===id);if(!p)return;lastFocus=document.activeElement;modalProduct=p;if(push)modalFromHistory=true;
    let root=document.getElementById('modalRoot');if(!root){root=document.createElement('div');root.id='modalRoot';document.body.appendChild(root)}
    root.innerHTML=modalMarkup(p);root.className='modalRoot open';
    if(!document.body.classList.contains('modalOpen')){lockedScroll=scrollY;document.body.style.top=`-${lockedScroll}px`;document.body.classList.add('modalOpen')}
    if(push)history.pushState({mjModal:id},'');
    bindModal();setTimeout(()=>root.querySelector('.modalClose')?.focus(),30);
  }
  function closeModal(useHistory=true){
    const root=document.getElementById('modalRoot');if(!root?.classList.contains('open'))return;
    root.classList.remove('open');document.body.classList.remove('modalOpen');document.body.style.top='';scrollTo(0,lockedScroll);modalProduct=null;
    setTimeout(()=>{root.innerHTML='';lastFocus?.focus?.()},280);
    if(useHistory&&modalFromHistory){modalFromHistory=false;history.back()}
  }
  function moveModal(dir){if(!modalProduct)return;const visible=[...document.querySelectorAll('.productTile:not([hidden])')].map(x=>P.find(p=>p._id===x.dataset.product)).filter(Boolean);let i=visible.findIndex(p=>p._id===modalProduct._id);if(i<0)return;openModal(visible[(i+dir+visible.length)%visible.length]._id,false)}
  function bindModal(){
    const root=document.getElementById('modalRoot');root.querySelectorAll('[data-close-modal]').forEach(x=>x.onclick=()=>closeModal());
    root.querySelector('[data-modal-prev]').onclick=()=>moveModal(-1);root.querySelector('[data-modal-next]').onclick=()=>moveModal(1);
    root.querySelectorAll('.hotspot').forEach(x=>x.onclick=()=>{root.querySelectorAll('.hotspot').forEach(y=>y.classList.toggle('active',x===y))});
    const sheet=root.querySelector('.productModal');let start=0,drag=false;
    sheet.addEventListener('pointerdown',e=>{if(innerWidth>699||e.target.closest('button'))return;start=e.clientY;drag=true;sheet.setPointerCapture(e.pointerId)});
    sheet.addEventListener('pointermove',e=>{if(!drag)return;const d=Math.max(0,e.clientY-start);sheet.style.transform=`translateY(${d}px)`});
    sheet.addEventListener('pointerup',e=>{if(!drag)return;const d=e.clientY-start;drag=false;sheet.style.transform='';if(d>100)closeModal()});
  }
  function bindCatalog(preFilter,withSearch=false){
    const active=new Set(preFilter?[preFilter]:[]),tiles=[...document.querySelectorAll('.productTile')];
    function run(){
      const q=withSearch?(document.getElementById('q')?.value||'').trim().toLowerCase():'';let visible=0;
      tiles.forEach(tile=>{const p=P.find(x=>x._id===tile.dataset.product),tags=tile.dataset.tags.split(' ').filter(Boolean);const tagOk=[...active].every(k=>tags.includes(k));const searchOk=!q||[p.nameEn,p.nameAr,p.subEn,p.subAr,p.profileEn,p.profileAr,p.descEn,p.descAr].join(' ').toLowerCase().includes(q);tile.hidden=!(tagOk&&searchOk);if(!tile.hidden)visible++});
      document.querySelectorAll('[data-group]').forEach(g=>g.hidden=![...g.querySelectorAll('.productTile')].some(x=>!x.hidden));
      document.getElementById('resultCount').textContent=t(`${visible} shown`,`${visible} ظاهر`);document.querySelector('.emptyState').hidden=visible>0;
      document.querySelectorAll('.filterTag').forEach(x=>x.classList.toggle('active',active.has(x.dataset.tag)));
    }
    document.querySelectorAll('.filterTag').forEach(x=>x.onclick=()=>{active.has(x.dataset.tag)?active.delete(x.dataset.tag):active.add(x.dataset.tag);run()});
    document.querySelector('[data-clear-filters]').onclick=()=>{active.clear();if(withSearch)document.getElementById('q').value='';run()};
    if(withSearch)document.getElementById('q').addEventListener('input',run);
    document.querySelector('[data-toggle-groups]')?.addEventListener('click',e=>{const gs=[...document.querySelectorAll('[data-group]')],open=gs.some(g=>g.open);gs.forEach(g=>g.open=!open);e.currentTarget.textContent=open?t('Open all','فتح الكل'):t('Close all','إغلاق الكل')});
    document.querySelectorAll('[data-group]').forEach(g=>{const key=`mj_group_${route()}_${g.querySelector('h2')?.textContent}`;const saved=sessionStorage.getItem(key);if(saved!==null)g.open=saved==='1';g.addEventListener('toggle',()=>sessionStorage.setItem(key,g.open?'1':'0'))});
    run();
  }
  function bindCommon(){
    document.querySelectorAll('[data-go]').forEach(x=>{x.onclick=()=>go(x.dataset.go);x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(x.dataset.go)}}});
    document.querySelectorAll('[data-product]').forEach(x=>{x.onclick=e=>{if(!e.target.closest('.moodTag'))openModal(x.dataset.product)};x.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('.moodTag')){e.preventDefault();openModal(x.dataset.product)}}});
    document.querySelectorAll('.productTile .moodTag').forEach(x=>x.onclick=e=>{e.stopPropagation();const dock=document.querySelector(`.filterTag[data-tag="${x.dataset.tag}"]`);dock?.click();dock?.scrollIntoView({behavior:'smooth',block:'center'})});
    document.querySelector('[data-scroll-catalog]')?.addEventListener('click',()=>document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'}));
    document.querySelectorAll('.tiltCard').forEach(card=>{card.addEventListener('pointermove',e=>{if(matchMedia('(pointer:coarse)').matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--rx',`${((e.clientY-r.top)/r.height-.5)*-4}deg`);card.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-.5)*5}deg`)});card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')})});
    document.querySelectorAll('.categoryCard').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',`${(x-.5)*-14}px`);card.style.setProperty('--my',`${(y-.5)*-12}px`);card.style.setProperty('--gx',`${x*100}%`);card.style.setProperty('--gy',`${y*100}%`)});card.addEventListener('pointerleave',()=>{card.style.setProperty('--mx','0px');card.style.setProperty('--my','0px')});card.addEventListener('pointerdown',()=>card.classList.add('pressed'));card.addEventListener('pointerup',()=>card.classList.remove('pressed'));card.addEventListener('pointercancel',()=>card.classList.remove('pressed'))});
    const reveals=document.querySelectorAll('.revealCard');if(reveals.length){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.16});reveals.forEach((x,i)=>{x.style.setProperty('--delay',`${i*80}ms`);observer.observe(x)})}
    const ih=document.querySelector('.interactiveHero');ih?.addEventListener('pointermove',e=>{if(matchMedia('(pointer:coarse)').matches)return;const r=ih.getBoundingClientRect();ih.style.setProperty('--hx',`${((e.clientX-r.left)/r.width-.5)*-9}px`);ih.style.setProperty('--hy',`${((e.clientY-r.top)/r.height-.5)*-7}px`)});ih?.addEventListener('pointerleave',()=>{ih.style.setProperty('--hx','0px');ih.style.setProperty('--hy','0px')});
  }
  function render(){
    setText();const r=route(),a=r.split('/').filter(Boolean);back.hidden=r==='/';
    document.querySelectorAll('.bottomNav button').forEach(b=>{const x=b.dataset.active;b.classList.toggle('active',x==='/'?r==='/':r.startsWith(x))});
    if(r==='/')home();else if(a[0]==='collection'&&a[1])collection(a[1]);else if(a[0]==='discover'&&a[1])all(a[1]);else if(a[0]==='all')all();else home();
    scrollTo({top:0,behavior:'auto'});
  }
  back.onclick=()=>history.length>1?history.back():go('/');document.getElementById('brandBtn').onclick=()=>go('/');searchBtn.onclick=()=>go('/all');
  langBtn.onclick=()=>{lang=ar()?'en':'ar';localStorage.setItem('mj_lang',lang);render()};
  document.querySelectorAll('.bottomNav [data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  addEventListener('hashchange',render);addEventListener('popstate',()=>{if(modalProduct)closeModal(false)});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&modalProduct)closeModal();if(e.key==='ArrowLeft'&&modalProduct)moveModal(-1);if(e.key==='ArrowRight'&&modalProduct)moveModal(1)});
  if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));render();
})();
