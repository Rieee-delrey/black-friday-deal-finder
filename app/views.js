// DealHound detail view: one deal, its full evidence and its cross-store
// comparison, on a hash route (#/deal/<id>).

import { discountOf, savedOf, money } from "./data.js";

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function shortTime(iso) {
  return iso.slice(0, 10) + " " + iso.slice(11, 16) + " UTC";
}

export function renderDetail(detail, d) {
  if (!d) {
    detail.innerHTML = '<p><a href="#/">&larr; Back to all deals</a></p><h2>Deal not found</h2><p>This deal is not on the board.</p>';
    return;
  }
  const pct = discountOf(d);
  const saved = savedOf(d);
  const per = d.per ? d.per : "";
  let compare = "";
  if (d.also && d.also.length) {
    const cells = [{ store: d.store, price: d.price }].concat(d.also);
    const best = Math.min(...cells.map((c) => c.price));
    compare = "<h3>Same product, compared across stores</h3><ul class=\"compare-list\">" +
      cells.map((c) => "<li class=\"" + (c.price === best ? "best" : "") + "\">" +
        escapeHtml(c.store) + ": <strong>" + money(c.price) + "</strong>" +
        (c.price === best ? " &mdash; cheapest" : "") + "</li>").join("") + "</ul>";
  }
  detail.innerHTML =
    '<p><a href="#/">&larr; Back to all deals</a></p>' +
    '<span class="badge verdict-' + d.verdict.toLowerCase().replace(" ", "-") + '">' + d.verdict + "</span>" +
    "<h2>" + escapeHtml(d.title) + "</h2>" +
    '<p class="meta">' + escapeHtml(d.store) + " &middot; " + escapeHtml(d.category) + "</p>" +
    '<p class="price big">' + money(d.price) + per +
      ' <span class="was">' + money(d.was) + per + "</span>" +
      ' <span class="pct">-' + pct + "%</span></p>" +
    '<p class="saved">You save ' + money(saved) + per + "</p>" +
    "<h3>Why this is really a deal</h3>" +
    '<p class="evidence">' + escapeHtml(d.evidence) + "</p>" +
    compare +
    "<h3>Checked</h3>" +
    '<p class="check">Price checked ' + shortTime(d.checked) + ". Source: " + escapeHtml(d.source) + ". " +
    "The link below goes to the store's search for this product, so you can confirm the price yourself.</p>" +
    '<p><a class="store-link" href="' + d.url + '" target="_blank" rel="noopener">View at ' + escapeHtml(d.store) + " &rarr;</a></p>";
}
