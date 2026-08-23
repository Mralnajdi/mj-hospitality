(() => {
  const SOURCE_ORDER = ["xpod", "omni", "other"];
  const LABELS = { xpod: "xPod", omni: "Omni", other: "Other" };

  function builderFor(node) {
    return node?.closest?.(".xboBuilder") || null;
  }

  function sourceItems(builder) {
    return [...builder.querySelectorAll(".xboSourceRow > div")];
  }

  function ensureSemantics(builder) {
    const items = sourceItems(builder);
    items.forEach((item, i) => {
      const source = SOURCE_ORDER[i];
      if (!source) return;
      item.dataset.coffeeSource = source;
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", LABELS[source]);
    });
  }

  function renderSelection(builder) {
    ensureSemantics(builder);
    const chosen = builder.dataset.coffeeSource || sourceItems(builder).find((x) => x.classList.contains("selected"))?.dataset.coffeeSource || "other";
    builder.dataset.coffeeSource = chosen;
    sourceItems(builder).forEach((item) => {
      const active = item.dataset.coffeeSource === chosen;
      item.classList.toggle("selected", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setStatus(builder, source) {
    const status = builder.querySelector(".xboStatus");
    if (!status) return;
    if (source === "xpod") {
      status.textContent = "xPod selected — exact xPod brew values must come from that xPod recipe/RFID; no whole-bean values are substituted.";
    } else if (source === "omni") {
      status.textContent = "Omni selected — using the current own-bean recipe values.";
    } else {
      status.textContent = "Other selected — using the current own-bean recipe values.";
    }
  }

  function choose(builder, source) {
    if (!SOURCE_ORDER.includes(source)) return;
    builder.dataset.coffeeSource = source;
    renderSelection(builder);
    setStatus(builder, source);
  }

  document.addEventListener("pointerdown", (e) => {
    const item = e.target.closest?.(".xboSourceRow > div");
    if (!item) return;
    e.stopPropagation();
  }, true);

  document.addEventListener("click", (e) => {
    const item = e.target.closest?.(".xboSourceRow > div");
    if (!item) return;
    const builder = builderFor(item);
    if (!builder) return;
    e.preventDefault();
    e.stopPropagation();
    choose(builder, item.dataset.coffeeSource || SOURCE_ORDER[sourceItems(builder).indexOf(item)]);
  }, true);

  document.addEventListener("keydown", (e) => {
    const item = e.target.closest?.(".xboSourceRow > div");
    if (!item || (e.key !== "Enter" && e.key !== " ")) return;
    const builder = builderFor(item);
    if (!builder) return;
    e.preventDefault();
    choose(builder, item.dataset.coffeeSource || SOURCE_ORDER[sourceItems(builder).indexOf(item)]);
  }, true);

  // Preserve the selected preparation source when recipe volume/custom changes re-render the official-style panel.
  const observer = new MutationObserver((mutations) => {
    const builders = new Set();
    for (const m of mutations) {
      const b = builderFor(m.target);
      if (b) builders.add(b);
      m.addedNodes?.forEach?.((n) => {
        if (!(n instanceof Element)) return;
        const direct = n.matches?.(".xboBuilder") ? n : n.closest?.(".xboBuilder");
        if (direct) builders.add(direct);
        n.querySelectorAll?.(".xboBuilder").forEach((x) => builders.add(x));
      });
    }
    builders.forEach((b) => {
      if (b.querySelector(".xboSourceRow")) renderSelection(b);
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  function init() {
    document.querySelectorAll(".xboBuilder").forEach((b) => {
      if (b.querySelector(".xboSourceRow")) renderSelection(b);
    });
  }
  requestAnimationFrame(init);
  setTimeout(init, 80);
})();