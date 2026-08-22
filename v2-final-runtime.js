(() => {
  const M = window.MJ_MENU;
  const S = window.MJ_SOURCES;
  if (!M || !S) return;

  const esc = (s="") => String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  const lang = () => document.documentElement.lang === "ar" ? "ar" : "en";
  const clean = (s="") => String(s)
    .replace(/\b(?:Zill|Seleco)\b/gi,"")
    .replace(/(?:زِل|زل|سيليكو)/g,"")
    .replace(/\s+/g," ").trim();

  const baseName = (p,l) => p?._displayBase?.[l] || clean(l === "ar" ? p?.nameAr : p?.nameEn);
  const makerName = (p,l) => p?._maker?.[l] || "";
  const formattedName = (p,l) => {
    const base = baseName(p,l);
    const maker = makerName(p,l);
    return maker ? `${base} - ${maker}` : base;
  };

  const findProductFromModal = (modal) => {
    const title = String(modal.querySelector("h2")?.textContent || "").trim();
    if (!title) return null;
    return M.products.find((p) =>
      title === formattedName(p,"en") ||
      title === formattedName(p,"ar") ||
      title === baseName(p,"en") ||
      title === baseName(p,"ar") ||
      title === clean(p.nameEn) ||
      title === clean(p.nameAr)
    ) || null;
  };

  function applySimpleTitles(root=document) {
    root.querySelectorAll(".v2MakerLine").forEach(el => el.remove());
    const l = lang();
    root.querySelectorAll(".productTile[data-product]").forEach((tile) => {
      const p = M.products.find(x => x._id === tile.dataset.product);
      const h = tile.querySelector(".productTitleRow h3");
      if (p && h) h.textContent = formattedName(p,l);
    });
    root.querySelectorAll(".productModal").forEach((modal) => {
      const p = findProductFromModal(modal);
      const h = modal.querySelector(".modalTitleRow h2");
      if (p && h) h.textContent = formattedName(p,l);
    });
  }

  function fitHeroToNaturalRatio(root=document) {
    root.querySelectorAll(".hero").forEach((hero) => {
      const img = hero.querySelector(":scope > img");
      if (!img) return;
      const apply = () => {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const width = Math.round(hero.getBoundingClientRect().width || window.innerWidth || img.naturalWidth);
        if (!width) return;
        const height = Math.round(width * (img.naturalHeight / img.naturalWidth));
        hero.style.height = `${height}px`;
        hero.style.minHeight = `${height}px`;
        const copy = hero.querySelector(".heroCopy");
        if (copy) {
          copy.style.height = `${height}px`;
          copy.style.minHeight = "0px";
        }
      };
      if (img.complete && img.naturalWidth) apply();
      else img.addEventListener("load", apply, {once:true});
    });
  }

  const sourceLink = (source, l) => {
    if (!/^https?:\/\//i.test(source || "")) {
      return `<span class="v2SourceTag">${l==="ar" ? "موثّق من العبوة" : "Package verified"}</span>`;
    }
    return `<a class="v2SourceLink" href="${esc(source)}" target="_blank" rel="noopener">${l==="ar" ? "المصدر الموثق ↗" : "Verified source ↗"}</a>`;
  };

  function customRecipeMarkup(p) {
    const l = lang();
    const s = S.products[p.nameEn] || {};
    const r = s.recipe;
    if (!r) return "";
    const title = l==="ar" ? r.titleAr : r.titleEn;
    const device = l==="ar" ? r.deviceAr : r.deviceEn;
    const basis = l==="ar" ? r.basisAr : r.basisEn;
    const metrics = (r.metrics || []).map((m) => {
      const key = l==="ar" ? m[2] : m[0];
      const val = l==="ar" ? m[3] : m[1];
      return `<div class="v2Metric"><span>${esc(key)}</span><b>${esc(val)}</b></div>`;
    }).join("");
    const steps = (l==="ar" ? r.stepsAr : r.stepsEn) || [];
    const stepHtml = steps.map((step,i) =>
      `<li><span>${i+1}</span><p>${esc(step)}</p></li>`
    ).join("");
    const kindLabel = {
      zill: l==="ar" ? "نظام زِل الرسمي" : "Official Zill system",
      coffee: "MJ · xBloom House Profile",
      tea: "xBloom Omni",
      sparkling: "Sparkling Bar",
    }[r.kind] || "MJ";
    const deviceSource = r.kind === "coffee"
      ? `<a class="v2SourceLink secondary" href="https://xbloom.com/pages/xbloom-studio" target="_blank" rel="noopener">${l==="ar" ? "مرجع جهاز xBloom ↗" : "xBloom device reference ↗"}</a>`
      : r.kind === "tea"
      ? `<a class="v2SourceLink secondary" href="https://entiregoods.shop/products/omni-tea-brewer" target="_blank" rel="noopener">${l==="ar" ? "مرجع Omni Tea Brewer ↗" : "Omni Tea Brewer reference ↗"}</a>`
      : "";

    return `<section class="recipeCard v2RecipeCard" data-v2-final="1">
      <div class="v2RecipeHead">
        <div>
          <div class="v2Eyebrow">${esc(kindLabel)}</div>
          <h3>${esc(title)}</h3>
          <p>${l==="ar" ? "الجهاز" : "Device"}: <strong>${esc(device)}</strong></p>
        </div>
        <div class="v2Verified">✓ ${l==="ar" ? "معتمد" : "Verified"}</div>
      </div>
      <div class="v2Metrics">${metrics}</div>
      <div class="v2Steps">
        <h4>${l==="ar" ? "آلية العمل" : "Preparation workflow"}</h4>
        <ol>${stepHtml}</ol>
      </div>
      ${basis ? `<p class="v2Basis">${esc(basis)}</p>` : ""}
      <div class="v2Sources">${sourceLink(s.source,l)}${deviceSource}</div>
    </section>`;
  }

  function removeProductNumbers(modal) {
    modal.querySelectorAll(".fact,.detailItem,.specItem").forEach((node) => {
      const t = node.textContent || "";
      if (/Product\s*No\.|رقم\s*المنتج/i.test(t)) node.remove();
      if (/^(Roaster|Company|Brand|Roaster \/ Company|Company \/ Brand)/i.test(t.trim())) node.remove();
      if (/^(المحمصة|الشركة|العلامة|المحمصة \/ الشركة|الشركة \/ العلامة)/.test(t.trim())) node.remove();
    });
  }

  function applyRecipe(modal) {
    if (!modal || modal.dataset.v2FinalApplied === "1") return;
    const p = findProductFromModal(modal);
    if (!p) return;
    const html = customRecipeMarkup(p);
    if (!html) return;
    const old = modal.querySelector(".recipeCard");
    if (old) old.outerHTML = html;
    else {
      const target = modal.querySelector(".productBody,.modalBody,.productDetails") || modal;
      target.insertAdjacentHTML("beforeend", html);
    }
    removeProductNumbers(modal);
    modal.dataset.v2FinalApplied = "1";
  }

  function enforceImageRules(root=document) {
    root.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (src.includes("products-v5/29-cola-mj.webp")) img.src = "assets/products-v2/29-seleco-cola.webp";
      if (src.includes("products-v5/31-rosemary-cucumber-mj.webp")) img.src = "assets/products-v2/31-rosemary-cucumber.webp";
      if (src.includes("home-v2/sparkling-mj-v2.webp") || src.includes("home-v2/sparkling-mj.webp")) {
        img.src = "assets/categories/sparkling.jpg";
      }
    });
    root.querySelectorAll("[style*='sparkling-mj']").forEach((el) => {
      el.style.backgroundImage = "url('assets/categories/sparkling.jpg')";
    });
  }

  function removeForbiddenCopy(root=document) {
    const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      if (/^(SCRIPT|STYLE)$/i.test(n.parentElement?.tagName || "")) return;
      n.nodeValue = n.nodeValue
        .replace(/\bConcentrated\b/gi, "Bold")
        .replace(/مركزات|مركزة|مركز/g, "قوية");
    });
  }

  function applyAll() {
    document.querySelectorAll(".productModal").forEach(applyRecipe);
    applySimpleTitles(document);
    document.querySelectorAll(".productModal").forEach(removeProductNumbers);
    enforceImageRules(document);
    fitHeroToNaturalRatio(document);
    removeForbiddenCopy(document);
  }

  const obs = new MutationObserver(() => requestAnimationFrame(applyAll));
  obs.observe(document.documentElement, {childList:true,subtree:true});
  document.addEventListener("click", () => setTimeout(applyAll, 30), true);
  window.addEventListener("hashchange", () => setTimeout(applyAll, 30));
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fitHeroToNaturalRatio(document), 80);
  });
  setTimeout(applyAll, 0);
})();