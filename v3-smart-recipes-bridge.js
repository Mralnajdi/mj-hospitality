(() => {
  const M = window.MJ_MENU;
  if (!M) return;

  const norm = (s="") => String(s).toLowerCase().replace(/[–—]/g,"-").replace(/\s+/g," ").trim();

  function identify(title){
    const t = norm(title);
    return M.products.find((p) => {
      const candidates = [
        p.nameEn, p.nameAr,
        p._displayBase?.en, p._displayBase?.ar,
        p._maker?.en, p._maker?.ar
      ].filter(Boolean).map(norm);
      const baseEn = norm(p._displayBase?.en || p.nameEn);
      const baseAr = norm(p._displayBase?.ar || p.nameAr);
      return (baseEn && t.includes(baseEn)) || (baseAr && t.includes(baseAr)) || candidates.some((x)=>x.length>4 && t===x);
    }) || null;
  }

  function apply(){
    document.querySelectorAll(".productModal").forEach((modal) => {
      const h = modal.querySelector(".modalTitleRow h2, h2");
      if (!h) return;
      if (!h.querySelector("[data-v3-lookup]")) {
        const p = identify(h.textContent || "");
        if (p) {
          const alias = document.createElement("span");
          alias.hidden = true;
          alias.dataset.v3Lookup = "1";
          alias.textContent = ` ${p.nameEn} ${p.nameAr}`;
          h.appendChild(alias);
        }
      }
      const smart = modal.querySelector(".v3SmartRecipe");
      if (smart) modal.querySelectorAll(".v2RecipeCard,.recipeCard").forEach((x)=>x.remove());
    });
  }

  const obs = new MutationObserver(() => requestAnimationFrame(apply));
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("click",()=>setTimeout(apply,20),true);
  setTimeout(apply,0);
})();
