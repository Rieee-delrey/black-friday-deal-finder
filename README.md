# DealHound

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Rieee-delrey/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Rieee-delrey/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

Black Friday 2026, without the fake discounts. DealHound is a static deal
finder with 35 real deals across 7 stores, each read in a named source and
checked on 27 Nov 2026. Every card shows the product, store, sale price,
usual price, discount, store link and check time, plus an honest verdict:
NEW LOW, STRONG, FAIR, or SKIP. Three products are compared across stores
so you can see who is actually cheapest, and two listings we checked and
rejected stay on the board so you can see the work.

## Use it

Open `app/index.html` in a desktop browser (or `node serve.ts` and visit
http://localhost:8080). No network, no build step, no images to download.

- **Search** — type a product, store or category
- **Filters** — category, store, minimum discount, verdict
- **Sort** — best deals first (verdict, then discount), biggest discount,
  most dollars saved, or lowest price
- **Deal pages** — click any deal for its full evidence and, where it
  exists, the same product's price at another store

## How we check

1. The price is read at the store or in a deals source that names the
   store, and the time and source are written on the deal.
2. The discount is computed from the two prices shown. If they do not add
   up, the deal does not go up.
3. NEW LOW means the cheapest price we can verify anywhere; STRONG means
   a big real cut; FAIR means a real cut, but small or seen before;
   SKIP means it is not a deal.
4. Prices move. Check the store link before you buy.

## Layout

- `main.ts` — the entry program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json`
- `app/index.html` — the page shell
- `app/style.css` — all of the look, no frameworks
- `app/data.js` — the 35 deals, the 2 rejected listings, and the helpers
  that compute discounts and money
- `app/app.js` — search, filters, sorting, the board and the compare strip
- `app/views.js` — the per-deal page on `#/deal/<id>`
- `serve.ts` — a tiny static server for local viewing and screenshots
