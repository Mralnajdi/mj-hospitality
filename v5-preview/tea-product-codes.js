(() => {
  const codes = new Map([
    ["Sencha Sleepless Organic", "1596"],
    ["سينشا «الصحوة»", "1596"],
    ["Moroccan Mint Organic", "949"],
    ["شاي النعناع المغربي", "949"],
    ["Japanese Cherry", "941"],
    ["الكرز الياباني", "941"],
    ["Le Touareg Organic", "915"],
    ["لو تواريغ", "915"],
    ["Marani", "953"],
    ["ماراني", "953"],
    ["Chinese Royal Jasmine Rolls", "934"],
    ["لفائف الياسمين الملكي الصيني", "934"],
    ["White Tea Lemon & Vanilla", "1041"],
    ["الشاي الأبيض بالليمون والفانيليا", "1041"],
    ["White Tea Jasmine Blossoms", "1038"],
    ["الشاي الأبيض بزهور الياسمين", "1038"],
    ["Gourmet Herbal Tea", "1235"],
    ["غورميه هيربل تي", "1235"],
    ["Mate Green Organic", "1195"],
    ["الماته الأخضر العضوي", "1195"],
    ["Ginger–Turmeric", "1244"],
    ["الزنجبيل والكركم", "1244"],
    ["One for All", "1111"],
    ["ون فور أول", "1111"],
    ["Peach Melba", "1479"],
    ["بيتش ميلبا", "1479"],
    ["Cherry Banana Flip", "1446"],
    ["تشيري بنانا فليب", "1446"],
    ["Berry Heaven", "1659"],
    ["بيري هيفن", "1659"],
    ["Strawberry–Moringa", "1453"],
    ["الفراولة والمورينغا", "1453"],
    ["Passion Fruit", "1637"],
    ["باشن فروت", "1637"],
    ["Woodland Berries", "1493"],
    ["وودلاند بيري", "1493"]
  ]);

  function applyProductCode() {
    const modal = document.querySelector(".productModal");
    if (!modal) return;

    const title = modal.querySelector(".modalTitleRow h2")?.textContent?.trim();
    if (!title) return;

    const code = codes.get(title);
    const existing = modal.querySelector(".productCodeFact");

    if (!code) {
      existing?.remove();
      return;
    }
    if (existing) return;

    const facts = modal.querySelector(".modalContent > .facts");
    if (!facts) return;

    const isArabic = document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";
    const row = document.createElement("div");
    row.className = "fact productCodeFact";
    row.innerHTML = `<div class="factKey">${isArabic ? "كود المنتج" : "Product Code"}</div><div class="factVal">${code}</div>`;
    facts.prepend(row);
  }

  const observer = new MutationObserver(applyProductCode);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", () => queueMicrotask(applyProductCode), true);
  window.addEventListener("hashchange", () => queueMicrotask(applyProductCode));
  applyProductCode();
})();
