(() => {
  const SELECTOR = ".v3XbloomBuilder [data-ml], .v3XbloomBuilder [data-mode]";
  const starts = new Map();

  function interactiveTarget(node) {
    return node?.closest?.(SELECTOR) || null;
  }

  document.addEventListener("pointerdown", (e) => {
    const btn = interactiveTarget(e.target);
    if (!btn) return;
    starts.set(e.pointerId, { btn, x: e.clientX, y: e.clientY });
  }, true);

  document.addEventListener("pointercancel", (e) => {
    starts.delete(e.pointerId);
  }, true);

  document.addEventListener("pointerup", (e) => {
    const s = starts.get(e.pointerId);
    starts.delete(e.pointerId);
    if (!s || !s.btn?.isConnected) return;
    const dx = Math.abs(e.clientX - s.x);
    const dy = Math.abs(e.clientY - s.y);
    if (dx > 10 || dy > 10) return; // preserve horizontal scrolling of preset rail

    // Safari/iOS can occasionally swallow the click after a scrollable touch target.
    // Fire a fallback click after the native click window. If native click already ran,
    // this second activation is idempotent; mode buttons removed by re-render are ignored.
    const btn = s.btn;
    setTimeout(() => {
      if (btn.isConnected) btn.click();
    }, 70);
  }, true);

  // Make the custom field reliably editable on iOS even inside the draggable product sheet.
  document.addEventListener("pointerdown", (e) => {
    const input = e.target.closest?.(".v3XbloomBuilder [data-custom-ml]");
    if (!input) return;
    e.stopPropagation();
  }, true);

  document.addEventListener("click", (e) => {
    const input = e.target.closest?.(".v3XbloomBuilder [data-custom-ml]");
    if (!input) return;
    input.focus({ preventScroll: true });
  }, true);
})();