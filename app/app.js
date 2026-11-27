// DealHound board: search, filters, sorting and the compare strip.
// Runs with no network: every deal is already in data.js.

import { deals, rejected, CATEGORIES, STORES, VERDICT_RANK, discountOf, savedOf, money, CHECKED_AT } from "./data.js";
import { renderDetail } from "./views.js";

const grid = document.getElementById("grid");
const countLine = document.getElementById("count-line");
const searchBox = document.getElementById("search");
const categorySel = document.getElementById("category");
const storeSel = document.getElementById("store");
const discountSel = document.getElementById("discount");
const verdictSel = document.getElementById("verdict");
const sortSel = document.getElementById("sort");

for (const c of CATEGORIES) {
  const o = document.createElement("option");
  o.value = c; o.textContent = c;
  categorySel.appendChild(o);
}
for (const s of STORES) {
  const o = document.createElement("option");
  o.value = s; o.textContent = s;
  storeSel.appendChild(o);
}

function verdictClass(v) {
  return "verdict-" + v.toLowerCase().replace(" ", "-");
}

function dealCard(d) {
  const pct = discountOf(d);
  const saved = savedOf(d);
  const per = d.per ? d.per : "";
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML =
    '<span class="badge ' + verdictClass(d.verdict) + '">' + d.verdict + "</span>" +
    '<h3><a href="#/deal/' + d.id + '">' + escapeHtml(d.title) + "</a></h3>" +
    '<p class="meta">' + escapeHtml(d.store) + " &middot; " + escapeHtml(d.category) + "</p>" +
    '<p class="price">' + money(d.price) + per +
      ' <span class="was">' + money(d.was) + per + "</span>" +
      ' <span class="pct">-' + pct + "%</span></p>" +
    '<p class="saved">You save ' + money(saved) + per + "</p>" +
    '<p class="evidence">' + escapeHtml(d.evidence) + "</p>" +
    '<p class="check">Checked ' + shortTime(d.checked) + " &middot; " + escapeHtml(d.source) + "</p>" +
    '<p><a class="store-link" href="' + d.url + '" target="_blank" rel="noopener">View at ' + escapeHtml(d.store) + " &rarr;</a></p>";
  return el;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function shortTime(iso) {
  return iso.slice(0, 10) + " " + iso.slice(11, 16) + " UTC";
}

function applyFilters() {
  const q = searchBox.value.trim().toLowerCase();
  const cat = categorySel.value;
  const store = storeSel.value;
  const minPct = Number(discountSel.value || 0);
  const verdict = verdictSel.value;
  let list = deals.filter((d) => {
    if (q && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    if (cat && d.category !== cat) return false;
    if (store && d.store !== store) return false;
    if (discountOf(d) < minPct) return false;
    if (verdict && d.verdict !== verdict) return false;
    return true;
  });
  const sort = sortSel.value;
  if (sort === "best") {
    list.sort((a, b) => (VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict]) || (discountOf(b) - discountOf(a)));
  } else if (sort === "discount") {
    list.sort((a, b) => discountOf(b) - discountOf(a));
  } else if (sort === "saved") {
    list.sort((a, b) => savedOf(b) - savedOf(a));
  } else if (sort === "price") {
    list.sort((a, b) => a.price - b.price);
  }
  grid.replaceChildren(...list.map(dealCard));
  countLine.textContent = list.length + " of " + deals.length + " deals";
  return list;
}

function renderCompare() {
  const wrap = document.getElementById("compare-rows");
  const rows = deals.filter((d) => d.also && d.also.length);
  wrap.replaceChildren(...rows.map((d) => {
    const cells = [{ store: d.store, price: d.price }].concat(d.also);
    const best = Math.min(...cells.map((c) => c.price));
    const row = document.createElement("div");
    row.className = "compare-row";
    row.innerHTML = "<h3>" + escapeHtml(d.title) + "</h3>" +
      cells.map((c) => '<p class="' + (c.price === best ? "best" : "") + '">' +
        escapeHtml(c.store) + ": <strong>" + money(c.price) + "</strong>" +
        (c.price === best ? " &mdash; cheapest" : "") + "</p>").join("") +
      '<p><a href="#/deal/' + d.id + '">Why this is real &rarr;</a></p>';
    return row;
  }));
}

function renderRejected() {
  const wrap = document.getElementById("rejected-rows");
  wrap.replaceChildren(...rejected.map((d) => {
    const row = document.createElement("div");
    row.className = "rejected-row";
    row.innerHTML = "<h3>" + escapeHtml(d.title) + " &mdash; " + escapeHtml(d.store) + "</h3>" +
      '<p class="evidence">' + escapeHtml(d.evidence) + "</p>" +
      '<p class="check">Checked ' + shortTime(d.checked) + " &middot; " + escapeHtml(d.source) + "</p>";
    return row;
  }));
}

function route() {
  const hash = location.hash || "#/";
  const detail = document.getElementById("detail");
  const board = document.getElementById("board");
  if (hash.startsWith("#/deal/")) {
    const id = hash.slice(7);
    const d = deals.find((x) => x.id === id);
    board.hidden = true;
    detail.hidden = false;
    renderDetail(detail, d || null);
    window.scrollTo(0, 0);
  } else {
    detail.hidden = true;
    board.hidden = false;
    applyFilters();
  }
}

for (const el of [searchBox, categorySel, storeSel, discountSel, verdictSel, sortSel]) {
  el.addEventListener("input", () => { if (!document.getElementById("board").hidden) applyFilters(); });
}
window.addEventListener("hashchange", route);

document.getElementById("checked-line").textContent =
  "All prices checked " + shortTime(CHECKED_AT) + " in the sources named on each deal. Discounts are computed from the listed prices.";
renderCompare();
renderRejected();
route();
