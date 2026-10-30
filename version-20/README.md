# MJ Hospitality — Edition 20

Standalone edition based on Edition 19. Earlier editions remain unchanged.

## Filter release

All five collections have two filter groups: Type & preparation / Flavour & character.
Beverage families are explicitly mapped to the existing sourced profiles, not inferred from roast, origin, fermentation or acidity. Fruit does not imply citrus. Arabic spice families use the stated blend ingredients. Tea families describe flavour, not the botanical type of tea.

Within each beverage row selections are OR; rows are combined with AND. Ice cream retains single collection/device/program/character choices, with multiple sensory selections combined by OR. Both filter groups combine with search and saved/quantified controls. Unrepresented options are omitted. Counts on chips show the collection totals; the result count shows the combined selections.

Beverage selections survive language and route changes within the session. Ice cream selections and filtered previous/next order survive detail/list navigation. Clear resets all controls.

Machine filters indicate the preparation equipment, not the existence of an exact saved machine recipe. xBloom machine values remain product-specific in the existing detail tabs.

## References

- Stored official product URLs and package evidence: `vendor/source-data.js`, `products.js`, `reviewed-data.js`.
- Specialty Coffee Association flavour wheel: https://sca.coffee/store/flavor-wheel
- World Coffee Research sensory lexicon: https://worldcoffeeresearch.org/resources/sensory-lexicon
- Taiwan Tea Research and Extension Station aroma wheel: https://www.tbrs.gov.tw/en/ws.php?id=4868&print=Y
- xBloom Studio: https://xbloom.com/products/xbloom-studio
- xBloom Omni Tea Brewer guide: https://xbloom.com/blogs/news/how-to-use-omni-tea-brewer

## Verification

- All 51 beverage profiles mapped to the represented family set.
- All 38 existing recipe records retained; ingredient/name-based sensory mapping.
- JavaScript syntax and literal local asset references checked.
- Browser: cross-group filters, recipe navigation, reset and Arabic/English persistence.
- Responsive browser checks: all five collections at iframe widths 393, 820, 1024 and 1280; no horizontal overflow.

## Remaining content work

This is the filter release. Recipe quantities, photographs and source image dimensions are inherited from Edition 19. It does not complete the 17 name-only recipe entries, the three partial notebook notes, or provide higher-resolution source photos. No image was upscaled or represented as native 4K.

## In-place ribbon update

Two horizontal scrolling ribbons replace expanded filter panels. All options remain directly available; filter dimensions and original AND/OR behavior remain. Added three source-complete Ninja Swirl recipes: natural mango, coconut mango and the manufacturer’s optional chilli variation. Sources linked per recipe. Twenty-four quantified records and fourteen name-only records remain. All images are still below native 4K; audited dimensions are not represented as 4K. Native source generation requires a currently unavailable higher-resolution path.

## 29 October review

- Stock controls on all 58 beverage products: physical left beneath image, immediate quantity/unit/availability changes and faded unavailable images. Quantities are owner-entered; initial stock is unset. Stock is saved locally in this browser, not synced to other devices or visitors.
- Stock units: grams, millilitres, capsule count, pieces. Empty quantity permits availability-only status; zero means unavailable. Product and detail indicators share one record.
- Added source-verified official Ninja Deluxe Mango Slushi (142 g frozen mango / 355 ml nectar; processing liquid to manufacturer MAX FILL). 25 quantified and 13 name-only recipe records; three partial notebook notes remain.
- All 66 version-specific raster files decode successfully. Native 4K is NOT fulfilled: source dimensions remain below 3840 pixels. No enlargement is claimed as recovered detail.

## 30 October image and stock correction

- Replaced the seven new-purchase bag pictures with seven individual black/gold MJ serving photographs, keeping original package evidence and product sources. New generated artwork dimensions: 1672 × 941; not native 4K. No enlargement or recovered-detail claim.
- Original-image viewer fits below a wrapping mobile toolbar; ignores unloaded images.
- Capsules and pieces require whole-number quantities; grams and millilitres allow decimals.
- Existing stock is preserved under mj-inventory-v1. Data remains browser-local.
- Existing recipe completeness limitations above still apply.
