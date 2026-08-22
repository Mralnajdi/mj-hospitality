# MJ Beverage Source Audit

Checked: 2026-08-22

Scope: 38 menu products, official product descriptions, preparation parameters, xBloom workflow, and device-integration limits.

## Findings

- 24 products have a matching first-party product source; 14 require the user's photographed package or saved recipe as the controlling reference.
- Existing editorial copy conflicted with official sources for CGLE Tres Dragones, Pink Bourbon Punch, EA Decaf De Cana, and Java House Kenya AA. These fields must not be presented as official until corrected.
- TeeGschwendner product pages publish grams per litre, temperature, and steep time. The UI scales grams arithmetically for 120/240/360 ml and labels 240/360 ml as multiple 120 ml Omni Tea Brewer steeps.
- xBloom documents recipe creation, sharing, app-based Bluetooth sending, and A/B/C presets. No public web API, SDK, URL contract, or Bluetooth protocol was found that permits GitHub Pages to start a machine directly.
- Supported website action: open a genuine xBloom share/app link or copy verified settings. Actual sending and Start occur inside the xBloom app over Bluetooth; A/B/C must first be synced in the app.

## Primary sources

- xBloom recipe creation: https://tbdxsupport.zendesk.com/hc/en-us/articles/27094427432987-How-do-I-create-a-new-recipe
- xBloom creative modes and app Start: https://tbdxsupport.zendesk.com/hc/en-us/articles/25198266531355-Three-Creative-Modes
- xBloom Omni Tea Brewer: https://tbdxsupport.zendesk.com/hc/en-us/articles/34937798170779-xBloom-Omni-Tea-Brewer-A-How-to-Guide
- xBloom Auto Mode: https://tbdxsupport.zendesk.com/hc/en-us/articles/31951971970459-What-Is-Auto-Mode-and-How-Do-You-Use-It
- Product-specific sources are stored beside each verified record in `source-data.js`.

## Data rule

Never infer a recipe setting. Missing exact parameters are shown as requiring validation from the package, a saved xBloom recipe, or a matching official product page.
