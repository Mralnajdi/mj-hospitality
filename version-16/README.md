# MJ Hospitality — Edition 16

Independent review edition. All previous editions are preserved.

## Edition 16 request

- All 51 products remain. Only the displayed word Capsules / كبسولات was removed from Zill Kenya, including product navigation. Product source and preparation facts remain intact.
- All 25 teas have a teapot as the serving vessel. Seventeen former cup/glass presentations were replaced with new matching black-and-gold teapot photos. The eight existing teapot presentations remain.
- The serving-image corrections for Fairview Premium, Kaldi, Java and Barista from edition 15 are retained.

## Changes

- All 51 product keys remain present, without duplicates (4 Arabic, 16 specialty, 25 tea/herbal, 6 sparkling).
- Presentation image selection is keyed by product identity rather than upload order; the four sideways package photos no longer override the serving artwork.
- Six presentation photos were corrected with built-in image generation: Kaldi (caramel/coffee), Java (coffee only), Pink Bourbon Punch (black coffee, not red juice), Ethiopia Finara (cherry/blackcurrant), Marani (green tea, marigold and rose; no mint), Honey Double (a distinct coffee photo).
- Chamomile and One for All presentation assignments were corrected. Every beverage card uses a serving presentation, not a package photo.
- Modal identity is taken directly from the card’s stable product ID. Substring matching was removed. A delayed close handler can no longer erase a newly opened product.
- Brand names and descriptions are no longer altered by global word deletion.
- Replaced blanket product health claims with factual product descriptors in the same card panel.
- Product links identify their actual source. Package-only records say “Collection package” rather than suggesting a web source.
- Removed layered legacy recipe/sensory builders that could append unrelated or guessed content. Capsule products show Zill compatibility instead of xBloom settings. Verified tea ratios and personal Custom fields remain separate.
- Made the four primary navigation states consistent. Fixed the stale “three expressions” heading after the fourth Arabic coffee was added.
- Runtime scripts and styles are stored inside this edition; no runtime CDN dependency on mutable scripts.

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

## Artwork

Built-in image-generation prompt set: preserve MJ glassware, black stone and warm gold lighting; correct each of the six scene subjects and props to the product above; no package imagery, additional ingredients in the beverage or text beyond MJ. Images are designed serving illustrations, not documentary product or package photos. Project assets are saved in `version-16/assets/`.

## Validation

Syntax, all 51 unique product keys, source-kind attribution and local asset-path checks passed. Live browser review results will be recorded after deployment. `qa-mobile.html` provides a 393 × 852 CSS-pixel review frame.
