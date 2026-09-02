(() => {
  const style = document.createElement('style');
  style.id = 'v11PrecisionFixes';
  style.textContent = `
    .v11CustomPour{grid-template-columns:1.15fr repeat(8,minmax(62px,.75fr)) 34px}
    .v11Summary>.v11ScaleNote{grid-column:1/-1;margin:2px 0 0}
    .productModal .v11Prep + .v6PrepHub{display:none!important}
    @media(max-width:760px){.v11CustomPour{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);
})();
