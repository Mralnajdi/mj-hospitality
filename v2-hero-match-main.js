(() => {
  const HERO = {
    home: "assets/4k-v2/hero-mj-signature.jpg",
    arabic: "assets/heroes-v4/arabic-natural-qahwa.webp",
    specialty: "assets/4k-v2/hero-mj-signature.jpg",
    tea: "assets/4k-v2/hero-mj-signature.jpg",
    sparkling: "assets/home-v2/sparkling-mj-v2.webp"
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
    hero.style.setProperty("--hero-bg",`url("${src}")`);
    if(img.getAttribute("src")!==src) img.setAttribute("src",src);
    img.removeAttribute("srcset");
    img.setAttribute("sizes","100vw");
    img.setAttribute("loading","eager");
    img.setAttribute("fetchpriority","high");
    img.setAttribute("decoding","async");
    img.setAttribute("draggable","false");
    img.style.transform="none";
    img.style.filter="none";
    hero.querySelectorAll(".heroExplore,.heroCta,.exploreBtn").forEach(el=>el.remove());
  }

  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("hashchange",()=>setTimeout(apply,0));
  document.addEventListener("click",()=>setTimeout(apply,20),true);
  setTimeout(apply,0);
})();