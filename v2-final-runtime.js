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

  const displayName = (p, l) => clean(l === "ar" ? p.nameAr : p.nameEn);
  const findProductFromModal = (modal) => {
    const title = clean(modal.querySelector("h2")?.textContent || "");
    if (!title) return null;
    const l = lang();
    return M.products.find((p) =>
      displayName(p,l) === title ||
      displayName(p,"en") === title ||
      displayName(p,"ar") === title
    ) || null;
  };

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
      coffee: l==="ar" ? "MJ · xBloom House Profile" : "MJ · xBloom House Profile",
      tea: l==="ar" ? "xBloom Omni" : "xBloom Omni",
      sparkling: l==="ar" ? "Sparkling Bar" : "Sparkling Bar",
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
    enforceImageRules(document);
    removeForbiddenCopy(document);
  }

  const obs = new MutationObserver(() => requestAnimationFrame(applyAll));
  obs.observe(document.documentElement, {childList:true,subtree:true});
  document.addEventListener("click", () => setTimeout(applyAll, 30), true);
  window.addEventListener("hashchange", () => setTimeout(applyAll, 30));
  setTimeout(applyAll, 0);
})();