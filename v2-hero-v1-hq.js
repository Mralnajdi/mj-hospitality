(() => {
  const HERO_HQ = {
    home: "assets/4k/hero-main.jpg",
    arabic: "assets/4k/arabic.jpg",
    specialty: "assets/4k/specialty.jpg",
    tea: "assets/4k/tea.jpg",
    sparkling: "assets/4k/sparkling.jpg"
  };

  function routeKey(){
    const route=(location.hash.slice(1)||"/").replace(/^([^/])/,"/$1");
    const m=route.match(/^\/collection\/(arabic|specialty|tea|sparkling)/);
    return m ? m[1] : "home";
  }

  function apply(){
    const hero=document.querySelector(".hero");
    const img=hero?.querySelector(":scope > img");
    if(!hero||!img) return;
    const key=routeKey();
    const src=HERO_HQ[key];
    hero.dataset.v2Hero=key;
    if(src && img.getAttribute("src")!==src) img.setAttribute("src",src);
    img.removeAttribute("srcset");
    img.setAttribute("sizes","100vw");
    img.setAttribute("loading","eager");
    img.setAttribute("decoding","async");
    img.setAttribute("fetchpriority","high");
    img.setAttribute("draggable","false");
    img.style.transform="none";
    img.style.filter="none";
    img.style.imageRendering="auto";
    hero.querySelectorAll(".heroExplore,.heroCta,.exploreBtn").forEach(el=>el.remove());
  }

  new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("hashchange",()=>setTimeout(apply,0));
  document.addEventListener("DOMContentLoaded",apply);
  setTimeout(apply,0);
})();
