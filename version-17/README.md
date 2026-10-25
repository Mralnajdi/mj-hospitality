# MJ Hospitality — Edition 17

New ice cream collection at `#/icecream`. Adds only `version-17/`; previous editions remain intact.

## Ice cream content

- Nine complete quantity-and-method records, seven shared between machines and displayed once. Ingredient checkboxes, machine-specific programs, device filtering, flavour filtering, search, saved recipes, copy and print. Arabic/English throughout.
- Four notebook records: Classic Mango from the supplied recipe PDF; Date & Salted Caramel, Yellow Watermelon and Jabuticaba from recovered personal recipe records.
- Five clearly labelled adaptations of Ninja's 415 ml almond milk + one label-serving protein base. These are not claimed to have been personally tested: Evogen Salted Caramel, Ice Cream Sandwich, Vanilla Cold Brew; ON Double Rich Chocolate; GHOST Cereal Milk.
- Twenty additional names retained as a separate flavour notebook, without invented quantities: seventeen remaining mango names from the PDF and three incomplete recent records.
- Six protein products listed. Applied Nutrition BEEF-XP Mixed Berry is inventory only, without an invented ice cream base.
- Shared mango/date batches are explicitly scaled by 473/709 for Swirl. MAX FILL remains controlling; do not automatically top up. Swirl scoop-only recipes remain SCOOP; protein adaptations use SOFT SERVE → CREAMiFIT. Device selection survives a language change.
- Official device names: Ninja CREAMi Deluxe 10-in-1; Ninja Swirl by CREAMi 13-in-1. Actual device photos appear separately below recipe photos, not inside the approved food compositions.

## Visual direction and responsive layout

User-approved natural editorial food styling: large hand-scooped dessert centered in charcoal ceramic MJ bowl, sparse relevant ingredient scatter, soft side light, charcoal stone, restrained gold. Nine distinct 1536 × 1024 food illustrations in WebP, not documentary recipe photos. The design does not claim native 4K resolution. Full photo framing, two-column cards on larger screens and one column on phones. No floating ingredient effects or unrelated bar props.

Twelve low-resolution beverage atlas crops replaced by independent higher-resolution artwork. All 51 beverage products retained (4 Arabic, 16 specialty, 25 tea, 6 sparkling). All tea serving photos remain teapots. Only displayed Capsules/كبسولات text is removed for Zill Kenya; product retained.

## Preparation sources

- Supplied `وصفات نينجا كريمي الفاخرة.pdf`: Classic Mango quantities and eighteen mango names; not eighteen complete recipes.
- https://ninjakitchenapac.zendesk.com/hc/en-au/articles/15978391315471-NC701-Ninja-Swirl-by-CREAMi-FAQ
- https://ninjakitchen.co.uk/product/ninja-creami-deluxe-10-in-1-ice-cream-and-frozen-drink-maker-nc501uk-zidNC501UK
- Official device photographs: https://www.ninjakitchen.ie/products/ninja-creami-deluxe-10-in-1-ice-cream-and-frozen-drink-maker-nc501uk and https://www.ninjakitchen.ie/products/ninja-swirl-by-creami-13-in-1-soft-serve-ice-cream-maker-nc701uk

## Source corrections verified during this review

- Pink Bourbon Punch: the manufacturer’s package image lists apple, blackberry, blueberry, plum and malic acidity; it does not list the previous peach/jasmine profile. The processing label states anaerobic and aerobic.
  https://methods.coffee/products/pink-bourbon-punch
  https://methods.coffee/cdn/shop/files/Package-sticker-PINK-BOURBON-PUNCH.png?v=1758796443&width=1600
- EA Decaf De Cana: the matching retailer product lists lemon/tea, washed Caturra/Castillo, medium roast and 1200–2100 m. The roaster’s current URL has a different displayed title, so the two listings are not mixed.
  https://entiregoods.shop/products/methods-roastery-ea-decaf-de-cana
- Sleepless Sencha: current manufacturer listing says conventional cultivation. Removed the unsupported Organic display label; retained the product key and No.1596. Preparation is 13 g/L, 90°C, 2 min.
  https://www.teegschwendner.de/en/Sleepless-Sencha/101596
- Marani: green tea, flavouring, marigold blossoms and rose petals, 12 g/L, 90°C, 2 min.
  https://www.teegschwendner.de/en/Marani/100953
- Finara: cherry/blackcurrant, Ethiopia, Sel Heirloom, Natural Grade 1, 2021 m.
  https://entiregoods.shop/products/entire-goods-ethiopia-finara
- Java House: aromatic, fruity, rich; medium roast.
  https://javahouseafrica.com/pantry-item/kenya-aa/
- Zill capsule ingredient/allergen notices were checked against product pages. Contains milk derivatives.
  https://www.zillcoffee.com/products/shagra-zill-capsules
  https://www.zillcoffee.com/products/zill-capsules-saffron
  https://www.zillcoffee.com/ar/products/kenya-zill-capsules

All other records retain their attributed web or collection-package source. Source retention is not a claim that every external page was re-fetched in this review.

## Artwork prompts and provenance

Built-in image generation, not CLI. Food assets `assets/ice-{mango,dates,watermelon,jabuticaba,caramel,sandwich,coffee,chocolate,cereal}.webp`. Approved mango reference supplied the composition and style. Prompt family: three naturally imperfect hand-scooped portions in charcoal ceramic MJ bowl with delicate gold rim, soft side-window food light, dark honed stone and empty charcoal backdrop; calm margins; modest relevant ingredient scatter; no appliances, floating props, sauces, flowers or unrelated garnish. Each variant specifies its actual flavour/color and relevant ingredient props. Protein variants show powder and almonds representing the almond-milk base, without inventing cookies/candy/cereal mix-ins. Jabuticaba fruit represents syrup flavour; it does not replace the ingredient list. Illustrations do not communicate measured quantities.

Independent beverage replacement assets `assets/hd-*.webp`: subject-correct black coffee, Arabic dallah, or round glass teapot, matching existing black/gold MJ collection. Source device product images are official vendor photographs, not generated.

## Validation

JavaScript syntax and local reference checks; recipe IDs, images and device programs; complete 51-product identity retention. Browser review at CSS iframe widths 393/820/1024/1280 showed no horizontal overflow. Search, category filters, saved recipe toggling, language switching, hero scroll and machine quantity switching reviewed. Public deployment is verified separately at handoff.
