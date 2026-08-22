(() => {
  const HERO = {
    home: "assets/heroes-v4/home-natural-qahwa.webp",
    arabic: "assets/heroes-v4/arabic-natural-qahwa.webp",
    specialty: "assets/heroes-v2/specialty.webp",
    tea: "assets/heroes-v2/tea.webp",
    sparkling: "assets/heroes-v5/sparkling-grounded-carafe.webp"
  };

  function routeKey(){
    const route=(location.hash.slice(1)||"/").replace(/^([^/])/,"/$1");
    const m=route.match(/^\/collection\/(arabic|specialty|tea|sparkling)/);
    return m?m[1]:"home";
  }

  function apply(){
    const hero=document.querySelector(".hero");
    const img=hero?.querySelector(":scope > img");
    if(!hero||!img)return;
    const key=routeKey();
    const src=HERO[key]||HERO.home;
    hero.dataset.v2Hero=key;
    if(img.getAttribute("src")!==src) img.setAttribute("src",src);
    img.removeAttribute("srcset");
    img.setAttribute("sizes","100vw");
    img.setAttribute("loading","eager");
    img.setAttribute("fetchpriority","high");
    img.setAttribute("decoding","async");
    img.setAttribute("draggable","false");
    img.style.imageRendering="auto";
  }

  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("hashchange",()=>setTimeout(apply,0));
  document.addEventListener("click",()=>setTimeout(apply,20),true);
  setTimeout(apply,0);
})();