(() => {
  const PRODUCT = "Pink Bourbon Punch";
  const PAGE = "https://methods.coffee/products/pink-bourbon-punch";
  const APP = "https://xbloom.com/pages/download-app";
  const ar = () => document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";

  function patch() {
    const modal = document.querySelector('.productModal');
    if (!modal) return;
    const title = (modal.querySelector('.modalTitleRow h2')?.textContent || '').trim();
    if (!/Pink Bourbon Punch|بينك بوربون بانش/i.test(title)) return;

    const pane = modal.querySelector('.v6Pane[data-v6-pane="xbloom"]');
    if (pane && /Colombian Punch/.test(pane.textContent || '')) {
      pane.innerHTML = ar()
        ? `<div class="v6Empty"><b>وصفة xBloom من Methods متوفرة</b><br>لن نربط لقطة “Colombian Punch” بهذا المنتج قبل وجود تطابق صريح بين اسم المشاركة واسم المنتج. افتح وصفة المحمصة واستخدم أمر الإرسال/الاستيراد إلى xBloom.</div><div class="v6Actions"><a class="v6Action primary" href="${PAGE}" target="_blank" rel="noopener">إرسال / فتح وصفة Methods في xBloom ↗</a><a class="v6Action secondary" href="${APP}" target="_blank" rel="noopener">فتح تطبيق xBloom ↗</a></div>`
        : `<div class="v6Empty"><b>Methods xBloom recipe is available</b><br>The captured “Colombian Punch” recipe is not assigned to this product until an explicit product-to-share match is verified. Open the roaster recipe and use its xBloom send/import command.</div><div class="v6Actions"><a class="v6Action primary" href="${PAGE}" target="_blank" rel="noopener">Send / open Methods xBloom recipe ↗</a><a class="v6Action secondary" href="${APP}" target="_blank" rel="noopener">Open xBloom app ↗</a></div>`;
    }

    const savedKey = `mj-v6-custom:${PRODUCT}`;
    if (!localStorage.getItem(savedKey)) {
      const custom = modal.querySelector('.v6Pane[data-v6-pane="custom"]');
      if (custom && !custom.dataset.v6ClearedUnverified) {
        custom.dataset.v6ClearedUnverified = '1';
        ['dose','grind','rpm'].forEach(k => { const x=custom.querySelector(`[data-v6-field="${k}"]`); if(x) x.value=''; });
        const volume=custom.querySelector('[data-v6-field="volume"]'); if(volume) volume.value='240';
        custom.querySelectorAll('[data-v6-pour] input').forEach(x=>{ if(x.dataset.k==='name') return; x.value=''; });
      }
    }

    modal.querySelectorAll('[class*="xbo"]').forEach(el => {
      if (!el.closest('.v6PrepHub')) el.style.display = 'none';
    });
  }

  const obs = new MutationObserver(() => queueMicrotask(patch));
  obs.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',()=>queueMicrotask(patch),true);
  patch();
})();
