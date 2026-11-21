// Builds the finished site: src/pages + src/templates + src/blog + tools.json + prices.json -> files in the repo root.
// Run:  node scripts/build.mjs        (no dependencies, Node 20+)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const rd = (p) => fs.readFileSync(p, "utf8");
const wr = (p, s) => { fs.mkdirSync(path.dirname(p) || ".", { recursive: true }); fs.writeFileSync(p, s); };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonSafe = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const cfg = JSON.parse(rd("tools.json"));
const T = cfg.tools, S = cfg.site, ADS = S.ads || {}, AN = S.analytics || {};
const clean = S.cleanUrls !== false;
const origin = S.live && S.url ? "https://" + S.url : "";
const today = new Date().toISOString().slice(0, 10);
const nice = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex");

// ---------- URLs ----------
const U = (name) => (name === "" ? "/" : clean ? "/" + name : "/" + name + ".html");
const pageNames = fs.readdirSync("src/pages").filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, ""));
const POSTDIR = "/blog/";
T.forEach((t) => { t.href = U(t.slug); });

// ---------- Data ----------
let PR = null;
try { PR = JSON.parse(rd("prices.json")); } catch { /* no prices yet: pages still work, they just have no pre-rendered rows */ }
const models = PR && Array.isArray(PR.models) ? PR.models.map((m) => ({ p: m.provider || "Other", n: m.name, i: m.in, o: m.out, c: m.ctx || 128 })).sort((a, b) => (a.p < b.p ? -1 : a.p > b.p ? 1 : a.n < b.n ? -1 : 1)) : [];
const provNames = new Set(models.map((m) => m.p));
const providers = (cfg.providers || []).filter((p) => provNames.has(p.name));
const glossary = JSON.parse(rd("src/glossary.json"));
const tips = JSON.parse(rd("src/tips.json"));
const TTJS = `<style>.tt{border-bottom:1px dotted var(--ac,#60a5fa);cursor:help;white-space:normal}.tt:focus{outline:2px solid var(--ac,#60a5fa);outline-offset:2px;border-radius:3px}.tt-pop{position:fixed;z-index:50;max-width:min(340px,calc(100vw - 16px));background:var(--sf,#111827);color:var(--tx,#e5e7eb);border:1px solid var(--bd,#243049);border-radius:10px;padding:10px 12px;font-size:13px;line-height:1.45;box-shadow:0 8px 24px rgba(0,0,0,.35);text-align:left;pointer-events:none}.tt-pop[hidden]{display:none}.tt-pop code{display:block;margin-top:6px;padding:6px 8px;background:rgba(127,127,127,.15);border-radius:6px;font-size:12px;white-space:pre-wrap;word-break:break-word}.terms dt{font-weight:600;margin-top:10px}.terms dd{margin:2px 0 0;color:var(--mu)}</style><script>(function(){var P=document.createElement("div");P.className="tt-pop";P.setAttribute("role","tooltip");P.hidden=true;document.body.appendChild(P);var C=null;
var T=0;function show(e){C=e;T=Date.now();P.innerHTML="";var t=document.createElement("div");t.textContent=e.getAttribute("data-tip");P.appendChild(t);var x=e.getAttribute("data-ex");if(x){var c=document.createElement("code");c.textContent=x;P.appendChild(c)}P.hidden=false;var r=e.getBoundingClientRect(),w=P.offsetWidth,h=P.offsetHeight,l=Math.max(8,Math.min(r.left+r.width/2-w/2,innerWidth-w-8)),y=r.top-h-8;if(y<8)y=r.bottom+8;P.style.left=l+"px";P.style.top=y+"px"}
function hide(){P.hidden=true;C=null}
document.addEventListener("mouseover",function(ev){var e=ev.target.closest&&ev.target.closest(".tt");if(e)show(e);else if(C&&!P.contains(ev.target))hide()});
document.addEventListener("focusin",function(ev){var e=ev.target.closest&&ev.target.closest(".tt");if(e)show(e)});
document.addEventListener("focusout",hide);
document.addEventListener("click",function(ev){var e=ev.target.closest&&ev.target.closest(".tt");if(e){if(C===e&&!P.hidden&&Date.now()-T>400)hide();else show(e)}else hide()});
document.addEventListener("keydown",function(ev){if(ev.key==="Escape")hide()});
addEventListener("scroll",hide,{passive:true});})();</script>`;
const bterms = JSON.parse(rd("src/blog-terms.json")); const btermMap = new Map(bterms.map((t) => [t.id, t]));
for (const t of tips) { if (!glossary.some((g) => g.id === t.g)) throw new Error("tips.json: unknown glossary id " + t.g); new RegExp(t.m, "i"); }
wr("assets/tips.js", "window.TIPS=" + JSON.stringify(tips.map((t) => ({ m: t.m, t: t.t, g: t.g, x: t.x, y: t.y || "" }))) + ";\n");
const tipsHash = sha(rd("assets/tips.js")).slice(0, 8);

const hrefFor = (s) => {
  const t = T.find((x) => x.slug === s); if (t) return t.href;
  if (s === "home") return "/";
  if (s === "blog") return POSTDIR;
  if (["glossary", "privacy", "terms", "how-it-works", "about", "tools"].includes(s)) return U(s);
  const pv = (cfg.providers || []).find((x) => x.slug === s); if (pv) return U(s);
  throw new Error("Unknown link target: " + s);
};

// ---------- Shared pieces ----------
const logo = rd("src/partials/logo.svg").trim(), logoIn = logo.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
const siteHtml = esc(S.name).replace(/^(\S+)\s+(.*)$/, "<i>$1</i> $2");
const link = (t) => `<a href="${t.href}"><span>${esc(t.name)}</span>${t.tag ? `<small>${esc(t.tag)}</small>` : ""}</a>`;
const card = (t) => `<a class="tc" href="${t.href}"><b>${esc(t.name)}</b><span>${esc(t.desc)}</span></a>`;
const menu = cfg.groups.map((g, i) => `<div class="sh-g"><i>${esc(g)}</i>${T.filter((t) => t.group == i && t.slug !== "model-prices").map(link).join("")}</div>`).join("") + `<a class="sh-all" href="${U("tools")}">Browse all tools &rarr;</a>`;
const grid = cfg.groups.map((g, i) => `<h3 class="gt">${esc(g)}</h3><div class="tg">${T.filter((t) => t.group == i).map(card).join("")}</div>`).join("");
const css = `<style>${rd("src/partials/shared.css")}</style>`;
const exportsHash = sha(rd("assets/exports.js")).slice(0, 8);
if (/example\.com$/.test(S.email || "")) console.warn("WARNING: set site.email in tools.json.");

const adsOn = !!(ADS.enabled && ADS.client);
const adBlock = (k) => adsOn ? `<aside class="ad" aria-label="Advertisement"><small>Advertisement</small><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(ADS.client)}"${(ADS.slots || {})[k] ? ` data-ad-slot="${esc(ADS.slots[k])}"` : ""} data-ad-format="auto" data-full-width-responsive="true"></ins></aside>` : "";
const adInit = adsOn ? 'document.querySelectorAll("ins.adsbygoogle").forEach(function(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}});' : "";
const adsNote = adsOn
  ? "This site shows ads served by Google AdSense and its partners. They may use cookies or similar technology to show and measure ads. You can manage personalised advertising at adssettings.google.com."
  : "The site shows no ads at the moment. If we add advertising in future, providers such as Google AdSense may use cookies to show and measure ads. We will update this page first.";
const anNote = !AN.provider
  ? "We do not use analytics or tracking cookies at the moment. If that changes, we will update this page first."
  : `We use ${AN.provider === "plausible" ? "Plausible Analytics, a cookie-free service," : AN.provider === "ga4" ? "Google Analytics" : "Cloudflare Web Analytics"} to count visits and see which pages are useful. It does not receive anything you paste or upload.`;
const analyticsHead = !AN.provider || !AN.id && AN.provider !== "plausible" ? "" :
  AN.provider === "plausible" ? `<script defer data-domain="${esc(S.url)}" src="https://plausible.io/js/script.js"></script>` :
  AN.provider === "ga4" ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(AN.id)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${esc(AN.id)}");</script>` :
  AN.provider === "cloudflare" ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(AN.id)}"}'></script>` : "";
const adsHead = adsOn ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(ADS.client)}" crossorigin="anonymous"></script>` : "";

const shared = (s) => s
  .replaceAll("{{LOGO_SVG}}", () => logo).replaceAll("{{LOGO_JSON}}", () => JSON.stringify(logoIn)).replaceAll("{{SITE_HTML}}", () => siteHtml)
  .replaceAll("{{TAGLINE}}", () => esc(S.tagline)).replaceAll("{{SITE_DESC}}", () => esc(S.description || S.tagline))
  .replaceAll("{{SITE_JSON}}", () => JSON.stringify(S.name)).replaceAll("{{SITE_URL_JSON}}", () => JSON.stringify(S.url || ""))
  .replaceAll("{{EMAIL}}", () => esc(S.email || "")).replaceAll("{{SITE}}", () => esc(S.name))
  .replaceAll("{{MENU}}", () => menu).replaceAll("{{YEAR}}", () => new Date().getFullYear())
  .replaceAll("{{SEARCH_URL}}", () => "/assets/search.json?v=" + searchHash).replaceAll("{{TIPS_URL}}", () => "/assets/tips.js?v=" + tipsHash).replaceAll("{{GLOSSARY_URL_JSON}}", () => JSON.stringify(U("glossary")))
  .replaceAll("{{AD_INIT}}", () => adInit).replaceAll("{{EXPORTS_URL}}", () => "/assets/exports.js?v=" + exportsHash)
  .replaceAll("{{TODAY_NICE}}", () => nice(today)).replaceAll("{{ANALYTICS_NOTE}}", () => esc(anNote)).replaceAll("{{ADS_NOTE}}", () => esc(adsNote))
  .replaceAll("{{PRICES_DATE}}", () => (PR && PR.updated) || "recently");
const header = rd("src/partials/header.html").trim(), footer = rd("src/partials/footer.html").trim();
const dataLine = models.length ? `Price catalog refreshed ${PR.updated} · ${models.length} models · ${provNames.size} providers · not checked against provider billing` : "Prices come from an open-source catalog and are refreshed daily.";

// ---------- Blog ----------
const inline = (s) => { // code spans are lifted out first so Markdown inside backticks is shown as typed
  const keep = [];
  const t = esc(s).replace(/(`{1,2})\s?([^`]+?)\s?\1(?!`)/g, (_, _q, c) => { keep.push(`<code>${c}</code>`); return `\u0000${keep.length - 1}\u0000`; });
  return inlineText(t).replace(/\u0000(\d+)\u0000/g, (_, n) => keep[+n]);
};
const inlineText = (s) => s
  .replace(/\[\[tip:([a-z0-9-]+)(?:::([^\]]+))?\]\]/g, (_, id, label) => { const t = btermMap.get(id); if (!t) throw new Error("blog-terms.json: unknown term " + id); return `<span class="tt" tabindex="0" role="button" aria-label="Explain ${esc(t.term)}" data-tip="${esc(t.def)}"${t.ex ? ` data-ex="${esc(t.ex)}"` : ""}>${label || esc(t.term)}</span>`; })
  .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<i>$2</i>")
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    if (u.startsWith("tool:") || u.startsWith("page:")) u = hrefFor(u.split(":")[1]);
    else if (u.startsWith("post:")) u = (clean ? POSTDIR + u.slice(5) : POSTDIR + u.slice(5) + ".html");
    return `<a href="${u}"${/^https?:/.test(u) ? ' rel="noopener"' : ""}>${t}</a>`;
  });
const imgSize = (src) => { // read width and height from a local PNG or JPEG so the page does not jump while images load
  try {
    const f = fs.readFileSync("." + src.split("?")[0]);
    if (f[0] === 0x89 && f[1] === 0x50) return [f.readUInt32BE(16), f.readUInt32BE(20)];
    let i = 2; while (i < f.length) { if (f[i] !== 0xff) { i++; continue; } const k = f[i + 1]; if (k >= 0xc0 && k <= 0xcf && k !== 0xc4 && k !== 0xc8 && k !== 0xcc) return [f.readUInt16BE(i + 7), f.readUInt16BE(i + 5)]; i += 2 + f.readUInt16BE(i + 2); }
  } catch { /* missing file: caught below */ }
  throw new Error("Blog image not found or unreadable: " + src);
};
const verOf = (n) => (n.match(/\d+/g) || []).map(Number);
const cmpVer = (a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (b[i] || 0) - (a[i] || 0); if (d) return d; } return 0; };
// Latest model of each family for a provider, straight from prices.json (so it updates with the daily price job).
function apiBlock(prov) {
  const ms = models.filter((m) => m.p === prov); if (!ms.length) return "";
  const fam = {}; for (const m of ms) { const k = m.n.replace(/[-\d.]+$/, "").replace(/-\d.*$/, ""); (fam[k] = fam[k] || []).push(m); }
  const rows = Object.values(fam).map((a) => a.sort((x, y) => cmpVer(verOf(x.n), verOf(y.n)))[0]).sort((a, b) => b.i - a.i || (a.n < b.n ? -1 : 1));
  return `<div class="ov"><table><thead><tr><th>Model</th><th>Input $/1M</th><th>Output $/1M</th><th>Context (K)</th></tr></thead><tbody>${rows.map((m) => `<tr><td>${esc(m.n)}</td><td>${m.i}</td><td>${m.o}</td><td>${m.c}</td></tr>`).join("")}</tbody></table></div><p class="note">Prices verified ${PR.updated} &middot; newest model in each ${esc(prov)} family &middot; <a href="${hrefFor("model-prices")}">compare all models</a>.</p>`;
}
const figure = (alt, src, cap) => { const [w, h] = imgSize(src); return `<figure><img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">${cap ? `<figcaption>${inline(cap)}</figcaption>` : ""}</figure>`; };
function md(src) {
  const out = [], L = src.replace(/\r/g, "").split("\n");
  for (let i = 0; i < L.length;) {
    const l = L[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if (/^```/.test(l)) { const code = []; i++; while (i < L.length && !/^```/.test(L[i])) code.push(L[i++]); i++; out.push(`<pre style="background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:14px 16px;overflow:auto;font-size:.92em;line-height:1.5;white-space:pre-wrap;margin:0 0 14px"><code style="background:none;border:0;padding:0">${esc(code.join("\n"))}</code></pre>`); }
    else if (/^\[\[toc\]\]\s*$/.test(l)) { out.push("<!--toc-->"); i++; }
    else if (/^\[\[terms\]\]\s*$/.test(l)) { const ids = [...new Set([...src.matchAll(/\[\[tip:([a-z0-9-]+)/g)].map((x) => x[1]))].filter((id) => btermMap.has(id)); if (ids.length) out.push(`<h2 id="terms-used">Terms used in this guide</h2><dl class="terms">${ids.map((id) => { const t = btermMap.get(id); return `<dt>${esc(t.term)}</dt><dd>${esc(t.def)}${t.ex ? ` <code>${esc(t.ex.replace(/\n/g, " "))}</code>` : ""}</dd>`; }).join("")}</dl>`); i++; }
    else if ((m = l.match(/^\[\[api-prices\s+([^\]]+)\]\]\s*$/))) { out.push(apiBlock(m[1].trim())); i++; }
    else if (/^!\[[^\]]*\]\(/.test(l)) { const figs = []; while (i < L.length && (m = L[i].match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$/))) { figs.push(figure(m[1], m[2], m[3])); i++; } if (!figs.length) throw new Error("Bad image line: " + l); out.push(figs.length > 1 ? `<div class="shots">${figs.join("")}</div>` : figs[0]); }
    else if ((m = l.match(/^(#{2,3})\s+(.*)$/))) { const id = m[2].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); out.push(`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`); i++; }
    else if (/^\|/.test(l)) { const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]); const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()); const head = cells(rows[0]), body = rows.slice(2).map(cells); out.push(`<div class="ov"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); }
    else if (/^[-*]\s+/.test(l)) { const it = []; while (i < L.length && /^[-*]\s+/.test(L[i])) it.push(L[i++].replace(/^[-*]\s+/, "")); out.push(`<ul>${it.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`); }
    else if (/^\d+\.\s+/.test(l)) { const it = []; while (i < L.length && /^\d+\.\s+/.test(L[i])) it.push(L[i++].replace(/^\d+\.\s+/, "")); out.push(`<ol>${it.map((x) => `<li>${inline(x)}</li>`).join("")}</ol>`); }
    else if (/^>\s?/.test(l)) { const q = []; while (i < L.length && /^>\s?/.test(L[i])) q.push(L[i++].replace(/^>\s?/, "")); out.push(`<blockquote><p>${inline(q.join(" "))}</p></blockquote>`); }
    else { const p = []; while (i < L.length && L[i].trim() && !/^(#{2,3}\s|\||[-*]\s|\d+\.\s|>|!\[|\[\[api-prices)/.test(L[i])) p.push(L[i++]); out.push(`<p>${inline(p.join(" "))}</p>`); }
  }
  return out.join("\n");
}
const posts = fs.existsSync("src/blog") ? fs.readdirSync("src/blog").filter((f) => f.endsWith(".md")).map((f) => {
  const raw = rd("src/blog/" + f).replace(/\r/g, ""), fm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fm) throw new Error(f + ": missing front matter");
  const meta = {}; fm[1].split("\n").forEach((x) => { const k = x.indexOf(":"); if (k > 0) meta[x.slice(0, k).trim()] = x.slice(k + 1).trim(); });
  for (const k of ["title", "description", "date"]) if (!meta[k]) throw new Error(f + ": missing " + k);
  const slug = f.replace(/\.md$/, "");
  if (meta.checked && !/^\d{4}-\d{2}-\d{2}$/.test(meta.checked)) throw new Error(f + ": checked must be YYYY-MM-DD");
  return { slug, ...meta, hasApi: /^\[\[api-prices/m.test(fm[2]), tools: (meta.tools || "").split(",").map((x) => x.trim()).filter(Boolean), body: md(fm[2]).replace("<!--toc-->", () => { const hs = [...md(fm[2].replace(/^\[\[toc\]\].*$/m, "")).matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)]; return hs.length ? `<nav class="toc" id="toc" aria-label="Contents"><b>In this guide</b><ul>${hs.map((h) => `<li><a href="#${h[1]}">${h[2]}</a></li>`).join("")}</ul></nav>` : ""; }), faq: faqOf(fm[2].replace(/^\[\[terms\]\]\s*$/m, "")), words: fm[2].split(/\s+/).length, path: clean ? POSTDIR + slug : POSTDIR + slug + ".html" };
}).sort((a, b) => (a.date < b.date ? 1 : -1)) : [];
const TX = fs.existsSync("src/tool-extras.json") ? JSON.parse(rd("src/tool-extras.json")) : {};
const AUTO = fs.existsSync("src/auto-tips.json") ? JSON.parse(rd("src/auto-tips.json")) : [];
function autoTip(html, p) { // wraps the first plain-text use of a glossary term in a tooltip, at most 5 per guide, never inside links, headings, code or tables
  const skip = new Set(["a", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "button", "summary", "table", "script", "style", "nav", "figure"]), tm = [];
  for (const a of AUTO) { const g = glossary.find((x) => x.id === a.g); if (!g) throw new Error("auto-tips.json: unknown glossary id " + a.g); if (!new RegExp(a.re, a.cs ? "" : "i").test(p.title)) tm.push({ re: new RegExp("(?<![\\w-])(" + a.re + ")(?![\\w-])", a.cs ? "" : "i"), g }); }
  let left = Math.max(0, 5 - (html.match(/class="tt"/g) || []).length); const used = new Set(), parts = html.split(/(<[^>]+>)/), stack = [];
  for (let i = 0; i < parts.length && left > 0; i++) {
    const s = parts[i];
    if (s.startsWith("<")) { const m = s.match(/^<(\/?)([a-z0-9]+)/i); if (!m) continue; const n = m[2].toLowerCase(); if (/\/>$/.test(s) || ["br", "img", "hr", "input"].includes(n)) continue; if (m[1]) { const k = stack.lastIndexOf(n); if (k >= 0) stack.length = k; } else stack.push(/class="tt"/.test(s) ? "tt" : n); continue; }
    if (!s.trim() || stack.some((t) => skip.has(t) || t === "tt") || !stack.some((t) => t === "p" || t === "li")) continue;
    for (const t of tm) { if (used.has(t.g.id)) continue; const m = s.match(t.re); if (!m) continue; used.add(t.g.id); left--; parts[i] = s.slice(0, m.index) + `<span class="tt" tabindex="0" role="button" aria-label="Explain ${esc(t.g.term)}" data-tip="${esc(t.g.short)}">${m[1]}</span>` + s.slice(m.index + m[0].length); break; }
  }
  return parts.join("");
}
posts.forEach((p) => { p.body = autoTip(p.body, p); });
function faqOf(src) { // "### Question" + answer paragraphs under a "## Frequently asked questions" heading -> FAQPage structured data
  const i = src.search(/^## Frequently asked questions/m); if (i < 0) return [];
  const sec = src.slice(i).split(/\n(?=## )/)[0], qs = [];
  for (const part of sec.split(/\n(?=### )/).slice(1)) { const [q, ...a] = part.split("\n"); const txt = a.join(" ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim(); if (txt) qs.push({ "@type": "Question", name: q.replace(/^###\s+/, "").trim(), acceptedAnswer: { "@type": "Answer", text: txt } }); }
  return qs;
}
const daysAgo = (d) => Math.floor((Date.parse(today) - Date.parse(d)) / 864e5);
const postCard = (p) => `<a class="post" href="${p.path}"><b>${esc(p.title)}</b><span>${esc(p.description)}</span><time datetime="${p.date}">${nice(p.date)}</time></a>`;

// ---------- Blog index: topics, start-here, cards ----------
const BT = fs.existsSync("src/blog-topics.json") ? JSON.parse(rd("src/blog-topics.json")) : { topics: [], startHere: [], readIf: {} };
const postBy = new Map(posts.map((p) => [p.slug, p]));
const touch = (p) => (p.updated && p.updated > p.date ? p.updated : p.date);
const byNew = (a, b) => (touch(a) < touch(b) ? 1 : touch(a) > touch(b) ? -1 : a.title < b.title ? -1 : 1);
const byDate = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title < b.title ? -1 : 1);
const thumbOf = (p) => (fs.existsSync(`assets/blog/${p.slug}-thumb.jpg`) ? `/assets/blog/${p.slug}-thumb.jpg` : "");
const readMin = (p) => Math.max(1, Math.round(p.words / 200));
const topicOf = new Map(); // slug -> [id, name]; filled after the topic list is built (see below)
const bCard = (p, more, num) => { const th = thumbOf(p), ri = (BT.readIf || {})[p.slug], tp = topicOf.get(p.slug) || ["more", "More guides"];
  return `<a class="bc${more ? " more" : ""}" href="${p.path}" data-t="${tp[0]}" data-d="${p.date}" data-u="${touch(p)}" data-m="${readMin(p)}" data-n="${esc(p.title.toLowerCase())}" data-k="${esc((p.title + " " + p.description + " " + tp[1]).toLowerCase())}">${th ? `<img src="${th}" width="640" height="360" alt="" loading="lazy" decoding="async">` : ""}<span class="bx">${num ? `<span class="nb" aria-hidden="true">${num}</span>` : ""}<span class="btg">${esc(tp[1])}</span><b>${esc(p.title)}</b><span class="bd">${esc(p.description)}</span>${ri ? `<span class="ri"><em>Read this if</em> ${esc(ri)}</span>` : ""}<span class="bm">${readMin(p)} min read<span class="bmd"> &middot; ${p.updated && p.updated > p.date ? "Updated " + nice(p.updated) : nice(p.date)}</span></span></span></a>`; };
const startPosts = (BT.startHere || []).map((s) => postBy.get(s)).filter(Boolean).slice(0, 5);
const blogTopics = (BT.topics || []).map((t) => ({ ...t, ord: t.slugs.map((s) => postBy.get(s)).filter(Boolean), ps: t.slugs.map((s) => postBy.get(s)).filter(Boolean).sort(byNew) })).filter((t) => t.ps.length);
{ const placed = new Set(blogTopics.flatMap((t) => t.ps.map((p) => p.slug))), rest = posts.filter((p) => !placed.has(p.slug));
  if (rest.length) { console.warn("blog-topics.json: no topic for " + rest.map((p) => p.slug).join(", ")); blogTopics.push({ id: "more", name: "More guides", ord: rest.slice(), ps: rest.sort(byNew) }); }
  for (const t of blogTopics) for (const p of t.ps) topicOf.set(p.slug, [t.id, t.name]); }
const LIM = 6, FLAT = 12;
const blogIndexBody = () => `<div class="bf" id="bfw" hidden><input id="bf" type="search" placeholder="Filter guides, e.g. JSON or price" aria-label="Filter guides" autocomplete="off"><label class="bsel">Sort by <select id="bso"><option value="new">Newest first</option><option value="upd">Recently updated</option><option value="topic">By topic</option><option value="old">Oldest first</option><option value="az">A to Z</option><option value="short">Shortest read first</option></select></label><span id="bc" aria-live="polite"></span></div>
<div class="bchips" id="bch" role="group" aria-label="Topics" hidden><a href="#" data-t="all" class="on">All</a>${blogTopics.map((t) => `<a href="#t-${t.id}" data-t="${t.id}" data-name="${esc(t.name)}">${esc(t.name)}<i>${t.ps.length}</i></a>`).join("")}</div>
${startPosts.length ? `<section class="bs0" id="bst" aria-label="Start here"><div class="bsh"><h2>Start here</h2><p class="bsub">Five guides that cover the basics, in the order most people need them.</p></div><div class="sg">${startPosts.map((p, i) => bCard(p, false, i + 1)).join("")}</div></section>` : ""}
<div class="bh"><h2>All guides</h2><span id="bsl">Newest first</span></div>
<div class="bl" id="bl">${[...posts].sort(byDate).map((p, i) => bCard(p, i >= FLAT)).join("")}</div>
<p class="bn" id="bn" hidden>No guide matches that. Try a shorter word, or <a href="${U("tools")}">browse the tools</a>.</p>
<noscript><style>.bc.more{display:flex}.bmore{display:none}</style></noscript>
<script>(function(){var LIM=${LIM},FL=${FLAT},root=document.body,box=document.getElementById("bl"),f=document.getElementById("bf"),so=document.getElementById("bso"),ch=[].slice.call(document.querySelectorAll("#bch a")),st=document.getElementById("bst"),n=document.getElementById("bn"),c=document.getElementById("bc"),tp="all",open={};
var sl=document.getElementById("bsl");document.getElementById("bfw").hidden=false;document.getElementById("bch").hidden=false;
var TO=ch.filter(function(a){return a.dataset.t!=="all"}).map(function(a){return{id:a.dataset.t,name:a.dataset.name}});
var it=[].slice.call(box.querySelectorAll(".bc")).map(function(e){return{e:e,d:e.dataset.d,u:e.dataset.u,m:+e.dataset.m,n:e.dataset.n,t:e.dataset.t,k:e.dataset.k}});
var C={"new":function(a,b){return b.d.localeCompare(a.d)||a.n.localeCompare(b.n)},upd:function(a,b){return b.u.localeCompare(a.u)||b.d.localeCompare(a.d)||a.n.localeCompare(b.n)},old:function(a,b){return a.d.localeCompare(b.d)||a.n.localeCompare(b.n)},az:function(a,b){return a.n.localeCompare(b.n)},"short":function(a,b){return a.m-b.m||a.n.localeCompare(b.n)}};
function btn(label,fn){var b=document.createElement("button");b.type="button";b.className="bmore";b.textContent=label;b.addEventListener("click",fn);return b}
function run(){var q=f.value.trim().toLowerCase().split(" ").filter(Boolean),fl=tp!=="all"||q.length>0,sort=so.value,nodes=[];
var L=it.filter(function(x){return(tp==="all"||x.t===tp)&&q.every(function(t){return x.k.indexOf(t)>-1})});
root.classList.toggle("bytopic",sort==="topic");it.forEach(function(x){x.e.classList.remove("more")});
if(sort==="topic"){TO.forEach(function(g){var G=L.filter(function(x){return x.t===g.id}).sort(C.upd);if(!G.length)return;var h=document.createElement("h2");h.className="bth";h.id="t-"+g.id;h.appendChild(document.createTextNode(g.name));var s=document.createElement("span");s.textContent=G.length;h.appendChild(s);nodes.push(h);G.forEach(function(x,i){if(!fl&&!open[g.id]&&i>=LIM)x.e.classList.add("more");nodes.push(x.e)});if(!fl&&G.length>LIM)nodes.push(btn(open[g.id]?"Show fewer":"Show "+(G.length-LIM)+" more",function(){open[g.id]=!open[g.id];run()}))})}
else{L.sort(C[sort]);L.forEach(function(x,i){if(!fl&&!open.flat&&i>=FL)x.e.classList.add("more");nodes.push(x.e)});if(!fl&&L.length>FL)nodes.push(btn(open.flat?"Show fewer":"Show "+(L.length-FL)+" more",function(){open.flat=!open.flat;run()}))}
box.innerHTML="";nodes.forEach(function(x){box.appendChild(x)});
if(st)st.hidden=fl||sort!=="new";sl.textContent=fl?L.length+" of "+it.length+" guides, "+so.options[so.selectedIndex].text.toLowerCase():so.options[so.selectedIndex].text;n.hidden=L.length>0;c.textContent=fl?L.length+" of "+it.length+" guides":"";ch.forEach(function(a){a.classList.toggle("on",a.dataset.t===tp)})}
ch.forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();tp=a.dataset.t;try{history.replaceState(null,"",tp==="all"?location.pathname:"#t-"+tp)}catch(x){}run()})});
f.addEventListener("input",run);so.addEventListener("change",run);
if(location.hash.indexOf("#t-")===0){var id=location.hash.slice(3);if(ch.some(function(a){return a.dataset.t===id}))tp=id}run()})();</script>`;
const landGuides = () => { const lat = [...posts].sort(byDate).slice(0, 3);
  return posts.length ? `<h2 class="sec">Guides</h2><p class="sub">Plain-English guides to AI costs, tokens and prompts.</p><div class="gdw">${startPosts.length ? `<div><h3>Start here</h3><ul>${startPosts.map((p) => `<li><a href="${p.path}">${esc(p.title)}</a><small>${readMin(p)} min read</small></li>`).join("")}</ul></div>` : ""}<div><h3>Latest</h3><ul>${lat.map((p) => `<li><a href="${p.path}">${esc(p.title)}</a><small>${nice(p.date)}</small></li>`).join("")}</ul></div></div><p class="sub" style="margin-top:14px"><a href="${POSTDIR}" style="color:var(--ac2)">Browse all ${posts.length} guides by topic &rarr;</a></p>` : ""; };

// ---------- Render ----------
function render(h, o) {
  const m0 = h.match(/^<!--slug:([\w-]*)-->\r?\n/);
  if (m0) h = h.slice(m0[0].length);
  const t = T.find((x) => x.slug == (o.slug ?? (m0 && m0[1]))) || {};
  const rel = T.filter((x) => x.slug != t.slug && x.group == t.group).concat(T.filter((x) => x.slug != t.slug && x.group != t.group)).slice(0, 3);
  const guides = t.slug ? posts.filter((x) => x.tools.includes(t.slug) && x.guide !== "no").map((x, i) => ({ x, i, k: x.tools.indexOf(t.slug) })).sort((a, b) => a.k - b.k || b.i - a.i).slice(0, 3).map((r) => r.x) : [];
  const toks = []; h = h.replace(/<script src="(https:\/\/cdn\.jsdelivr\.net\/npm\/gpt-tokenizer[^"]+)"[^>]*><\/script>/g, (_, u) => { toks.push(u); return ""; });
  h = h.replaceAll("{{HEADER}}", () => header).replaceAll("{{FOOTER}}", () => footer).replaceAll("{{SHARED_CSS}}", () => css)
    .replaceAll("{{GRID}}", () => grid)
    .replaceAll("{{TOOL_CSS}}", () => `<style>${rd("src/partials/tool.css")}</style>`)
    .replaceAll("{{PROSE_CSS}}", () => `<style>${rd("src/partials/prose.css")}</style>`)
    .replaceAll("{{PRICES_JS}}", () => rd("src/partials/prices.js"))
    .replaceAll("{{ESTIMATE_JS}}", () => rd("src/partials/estimate.js"))
    .replaceAll("{{RELATED}}", () => adBlock("bottom") + (guides.length ? `<style>.rel .posts{display:grid;gap:12px}.rel .post{display:block;background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:16px;text-decoration:none;color:var(--tx)}.rel .post:hover{border-color:var(--ac)}.rel .post b{display:block;font-size:18px;margin-bottom:4px}.rel .post span{color:var(--mu);font-size:14px}.rel .post time{display:block;color:var(--mu2);font-size:12px;margin-top:6px}</style><div class="rel"><h3>Learn more: guides for this tool</h3><div class="posts">${guides.map(postCard).join("")}</div></div>` : "") + `<div class="rel"><h3>Related tools</h3><div class="tg">${rel.map(card).join("")}</div></div>`)
    .replace(/\{\{AD:(\w+)\}\}/g, (_, k) => adBlock(k))
    .replaceAll("{{LATEST_POSTS}}", () => landGuides())
    .replaceAll("{{DATA_LINE}}", () => esc(dataLine))
    .replaceAll("{{TITLE}}", () => esc(o.title || (t.name ? `${t.title || t.name} | ${S.name}` : S.name)))
    .replaceAll("{{DESC}}", () => esc(o.desc || t.desc || S.description || S.tagline));
  h = shared(h).replace(/\{\{HREF:([\w-]+)\}\}/g, (_, s) => hrefFor(s));
  const title = (h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "", dm = h.match(/<meta name="description" content="([^"]*)"/), desc = dm ? dm[1] : esc(S.description || S.tagline);
  const url = origin ? origin + o.path : "";
  if (o.crumbs) {
    const cr = o.crumbs, html = `<nav class="crumbs" aria-label="Breadcrumb"${o.narrow ? ' style="max-width:760px"' : ""}>${cr.map((c, i) => (i < cr.length - 1 ? `<a href="${c[1]}">${esc(c[0])}</a><span>&rsaquo;</span>` : `<span style="margin:0">${esc(c[0])}</span>`)).join("")}</nav>`;
    h = h.replace(/<main/, () => html + "<main");
    if (origin) o.ld = (o.ld || []).concat({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: cr.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: origin + c[1] })) });
  }
  let meta = '<script>try{var t=localStorage.getItem("aub-theme");if(t==="light")document.documentElement.dataset.theme="light"}catch(e){}</script><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><meta name="theme-color" content="#05070d"><meta property="og:type" content="' + (o.ogType || "website") + '"><meta property="og:site_name" content="' + esc(S.name) + '"><meta property="og:title" content="' + title + '"><meta property="og:description" content="' + desc + '"><meta name="twitter:card" content="summary_large_image">';
  meta += o.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="max-image-preview:large">';
  if (o.noindex) { /* no canonical or social tags for noindex pages */ }
  else if (origin) meta += '<link rel="canonical" href="' + url + '"><meta property="og:url" content="' + url + '"><meta property="og:image" content="' + origin + (o.image || "/og-image.png") + '"' + (o.image ? "" : '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"') + '>';
  if (toks.length) meta += "<script>window.TOKLIBS=" + JSON.stringify(toks) + ";</script>";
  meta += analyticsHead + adsHead;
  if (origin && !o.noindex) for (const l of o.ld || []) meta += '<script type="application/ld+json">' + jsonSafe(l) + "</script>";
  h = h.replace("</head>", () => meta + "</head>");
  const left = h.match(/\{\{[A-Z_]+(?::[\w-]+)?\}\}/); // only our UPPERCASE placeholders; prompt templates use lowercase {{vars}}
  if (left) throw new Error(`${o.path}: unreplaced placeholder ${left[0]}`);
  return h;
}

const outputs = []; // [file, html, urlPath, inSitemap]
const emit = (file, html, p, inMap = true) => { wr(file, html); outputs.push([file, html, p, inMap]); console.log("built " + file); };

// ---------- Price highlights (static, for readers and search engines) ----------
function highlights() {
  if (!models.length) return "";
  const paid = models.filter((m) => m.i > 0 && m.o > 0);
  const tbl = (title, note, rows, cols) => `<div class="card"><h2 style="margin:0 0 4px;font-size:18px">${title}</h2><p class="note" style="margin:0 0 8px">${note}</p><div class="ov"><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div></div>`;
  const r = (m) => `<tr><td>${esc(m.n)}</td><td>${esc(m.p)}</td><td>${m.i}</td><td>${m.o}</td><td>${m.c}</td></tr>`;
  const cols = ["Model", "Provider", "Input $/1M", "Output $/1M", "Context (K)"];
  const cheapIn = paid.slice().sort((a, b) => a.i - b.i || a.o - b.o).slice(0, 8).map(r);
  const cheapOut = paid.slice().sort((a, b) => a.o - b.o || a.i - b.i).slice(0, 8).map(r);
  const big = models.slice().sort((a, b) => b.c - a.c || a.i - b.i).slice(0, 8).map(r);
  const per = providers.map((pv) => paid.filter((m) => m.p === pv.name).sort((a, b) => a.i - b.i)[0]).filter(Boolean).map(r);
  return tbl("Cheapest Models by Input Price", "Models with the lowest price per million input tokens. Zero-priced entries are left out.", cheapIn, cols) +
    tbl("Cheapest Models by Output Price", "Output tokens cost more than input, so this ranking matters for chatbots and writing tasks.", cheapOut, cols) +
    tbl("Largest Context Windows", "The models that can take the most text in a single request.", big, cols) +
    (per.length ? tbl("Cheapest Model from Each Major Provider", `By input price. See each provider's full list: ${providers.map((x) => `<a href="${U(x.slug)}">${esc(x.label || x.name)}</a>`).join(", ")}.`, per, cols) : "");
}

// Static default view for the Model Picker (2,000 input + 500 output tokens, 10,000 requests a month), so the page has real content before its script runs.
const PICK_EX = /audio|tts|realtime|search|deep-research|embed|image|moderation|transcribe|whisper/i;
function pickerDefault() {
  if (!PR || !Array.isArray(PR.models)) return "";
  const qi = 2000, qo = 500, qr = 10000, mo = (n) => "$" + (n > 0 && n < 0.01 ? n.toFixed(5) : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const R = PR.models.filter((m) => m.in > 0 && m.out > 0 && !PICK_EX.test(m.name) && (m.ctx || 128) * 1000 >= qi + qo)
    .map((m) => { const per = (qi * m.in + qo * m.out) / 1e6; return { m, per, mo: per * qr }; })
    .sort((a, b) => a.mo - b.mo || ((a.m.provider || "Other") + a.m.name < (b.m.provider || "Other") + b.m.name ? -1 : 1));
  const rows = R.slice(0, 10).map((r, k) => `<tr><td>${k + 1}</td><td>${esc(r.m.provider || "Other")}</td><td class="mdl">${esc(r.m.name)}</td><td class="n">${Math.round(r.m.ctx || 128).toLocaleString("en-US")}</td><td class="n">${r.m.in}</td><td class="n">${r.m.out}</td><td class="n">${mo(r.per)}</td><td class="n"><b>${mo(r.mo)}</b></td></tr>`).join("");
  return rows ? `<div class="card"><h2>Cheapest ten for the example workload</h2><p class="note">2,000 input and 500 output tokens per request, 10,000 requests a month. Change the numbers above to see your own. Price catalog refreshed ${PR.updated}, not checked against provider billing.</p><div class="ov tw"><table><thead><tr><th>#</th><th>Provider</th><th>Model</th><th class="n">Context (K)</th><th class="n">Input $/1M</th><th class="n">Output $/1M</th><th class="n">Per request</th><th class="n">Per month</th></tr></thead><tbody>${rows}</tbody></table></div></div>` : "";
}

// Static view for the Price Change Tracker (last 30 days of the log, newest first), so the page has real content before its script runs.
const chgNice = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const chgPr = (n) => "$" + +(+n).toFixed(4), chgK = (n) => Math.round(n).toLocaleString("en-US");
function chgKind(e) {
  if (e.t !== "price") return e.t;
  let dn = 0, up = 0;
  for (const f of ["in", "out", "cr"]) { const a = e[f]; if (a && a[0] != null && a[1] != null) { if (a[1] < a[0]) dn++; else if (a[1] > a[0]) up++; } }
  return dn && !up ? "cut" : up && !dn ? "up" : "mix";
}
const CHG_KIND = { cut: ["Price cut", "cut"], up: ["Price increase", "up"], mix: ["Price change", "mix"], added: ["New model", "new"], removed: ["Removed", "rem"], context: ["Context change", "ctx"] };
function chgDetail(e) {
  if (e.t === "added" || e.t === "removed") return (e.t === "added" ? "" : "Last listed at ") + `input ${chgPr(e.in)} · output ${chgPr(e.out)}` + (e.cr != null ? ` · cache read ${chgPr(e.cr)}` : "") + ` per 1M · context ${chgK(e.ctx)}K`;
  const L = { in: "Input", out: "Output", cr: "Cache read" }, p = [];
  for (const f of ["in", "out", "cr"]) {
    const a = e[f]; if (!a) continue;
    if (a[0] == null) p.push(`${L[f]} now ${chgPr(a[1])}`);
    else if (a[1] == null) p.push(`${L[f]} no longer listed`);
    else { const x = a[0] > 0 ? Math.round((a[1] / a[0] - 1) * 100) : null; p.push(`${L[f]} ${chgPr(a[0])} → ${chgPr(a[1])}` + (x == null ? "" : ` (${x > 0 ? "+" : ""}${x}%)`)); }
  }
  if (e.ctx) p.push(`Context ${chgK(e.ctx[0])}K → ${chgK(e.ctx[1])}K`);
  return p.join(" · ");
}
const chgMeta = () => PR && Array.isArray(PR.changes) ? `Tracking since ${chgNice(PR.trackedSince || PR.updated)} · last checked ${chgNice(PR.updated)} · ${PR.changes.length} changes recorded` : "Loading the change history.";
function chgStatic() {
  if (!PR || !Array.isArray(PR.changes)) return "";
  const cut = new Date(new Date(PR.updated + "T00:00:00Z").getTime() - 30 * 864e5).toISOString().slice(0, 10);
  const R = PR.changes.filter((e) => e.d > cut).sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : a.p < b.p ? -1 : 1)).slice(0, 10);
  if (!R.length) return `<div class="card"><p>No price changes were recorded in the last 30 days. Tracking began on ${chgNice(PR.trackedSince || PR.updated)}.</p></div>`;
  return `<div class="card"><h2>Changes in the last 30 days, newest first</h2><div class="ov tw"><table><thead><tr><th>Date</th><th>Provider</th><th>Model</th><th>Change</th><th>Details</th></tr></thead><tbody>${R.map((e) => { const K = CHG_KIND[chgKind(e)]; return `<tr><td class="dt" data-label="Date">${chgNice(e.d)}</td><td data-label="Provider">${esc(e.p)}</td><td class="mdl" data-label="Model">${e.n.map(esc).join(", ")}</td><td data-label="Change"><span class="tg ${K[1]}">${K[0]}</span></td><td class="dtl" data-label="Details">${esc(chgDetail(e))}</td></tr>`; }).join("")}</tbody></table></div></div>`;
}

// ---------- Search index and All Tools page ----------
const searchIdx = [
  ...T.map((t) => ["Tool", t.name, t.href, t.desc, t.tag || ""]),
  ...posts.map((p) => ["Guide", p.title, p.path, p.description]),
  ...(cfg.providers || []).filter((x) => provNames.has(x.name)).map((x) => ["Prices", `${x.label || x.name} API pricing`, U(x.slug), `Price per million input and output tokens for ${x.models || x.name + " models"}.`]),
  ...glossary.map((g) => ["Glossary", g.term, U("glossary") + "#" + g.id, g.short]),
];
wr("assets/search.json", JSON.stringify(searchIdx));
const searchHash = sha(JSON.stringify(searchIdx)).slice(0, 8);
const toolsPage = () => {
  const jump = `<p class="jp">${cfg.groups.map((g, i) => T.some((t) => t.group == i) ? `<a href="#g${i}">${esc(g)}</a>` : "").join("")}</p>`;
  const cardHtml = (t) => { const gd = posts.filter((p) => p.tools.includes(t.slug)).slice(0, 2);
    return `<article class="tcd" data-k="${esc((t.name + " " + t.desc + " " + (t.when || "") + " " + (t.tag || "")).toLowerCase())}"><h3><a href="${t.href}">${esc(t.name)}</a></h3><p>${esc(t.desc)}</p>${t.when ? `<p class="wh"><b>Use it when</b> ${esc(t.when.charAt(0).toLowerCase() + t.when.slice(1))}</p>` : ""}${gd.length ? `<p class="gd"><b>Guides</b> ${gd.map((p) => `<a href="${p.path}">${esc(p.title)}</a>`).join("")}</p>` : ""}</article>`; };
  return jump + cfg.groups.map((g, i) => { const ts = T.filter((t) => t.group == i); return ts.length ? `<section class="tgp" id="g${i}"><h2>${esc(g)}</h2><div class="tcl">${ts.map(cardHtml).join("")}</div></section>` : ""; }).join("");
};

// ---------- Pages ----------
const org = { "@type": "Organization", name: S.name, url: origin + "/", logo: origin + "/logo.svg" };
for (const f of fs.readdirSync("src/pages").filter((f) => f.endsWith(".html"))) {
  let h = rd("src/pages/" + f); const name = f.replace(/\.html$/, "");
  const m = h.match(/^<!--slug:([\w-]*)-->\r?\n/), slug = m ? m[1] : "", t = T.find((x) => x.slug == slug);
  const isHome = name === "index", p = isHome ? "/" : U(name), ld = [];
  const rows = models.map((x) => `<tr><td data-label="Compare"><input type="checkbox" data-k="${esc(x.p + "|" + x.n)}" aria-label="Compare ${esc(x.n)}"></td><td data-label="Provider">${esc(x.p)}</td><td data-label="Model">${esc(x.n)}</td><td data-label="Input $/1M">${x.i}</td><td data-label="Output $/1M">${x.o}</td><td data-label="Context (K)">${x.c}</td></tr>`).join("");
  if (t && name !== "tools") { // shared tool-page extras: privacy badge, example and share buttons, how-to steps, next step, FAQ heading
    const x = TX[slug] || {}, nx = x.next && T.find((s) => s.slug === x.next[0]);
    const row = (x.private === false ? "" : '<span class="pv">Runs in your browser. Nothing you enter is uploaded.</span>') + (x.sample ? '<button type="button" class="b s" data-ex>Try an example</button>' : "") + (x.share ? '<button type="button" class="b s" data-sl>Copy link with my input</button>' : "");
    if (row) h = h.replace(/(<p class="lead">[\s\S]*?<\/p>)/, (m) => m + `<div class="tp">${row}<span class="tn" role="status" aria-live="polite"></span></div>`);
    if (x.steps) h = h.replace('<div class="about">', () => `<div class="about"><h2>How to Use</h2><ol>${x.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`);
    if (nx) h = h.replace('<div class="about">', () => `<p class="nx"><b>Next:</b> <a href="${nx.href}">${esc(x.next[1])}</a> <span>${esc(nx.name)}</span></p><div class="about">`);
    h = h.replace("<h2>Questions</h2>", '<h2 id="faq">Frequently Asked Questions</h2>');
    if (x.sample || x.share) h = h.replace("</body>", () => `<script>window.TOOLX=${JSON.stringify({ sample: x.sample, share: x.share })}</script><script>${rd("src/partials/toolx.js")}</script></body>`);
    h = h.replace("</head>", () => `<style>.tp{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:-4px 0 14px}.tp .b{margin:0;padding:6px 12px;font-size:13px}.pv{font-size:13px;color:var(--mu)}.pv:before{content:"\\1F512\\00a0"}.tn{font-size:13px;color:var(--mu)}.nx{margin:18px 0 6px;padding:10px 14px;border:1px solid var(--bd);border-radius:10px;background:var(--sf);font-size:15px}.nx a{color:var(--ac2);font-weight:600}.nx span{color:var(--mu2);font-size:13px;margin-left:6px}.about ol{padding-left:22px}</style></head>`);
  }
  if (name === "tools") h = h.replaceAll("{{TOOLS_PAGE}}", () => toolsPage()).replaceAll("{{TOOL_COUNT}}", () => String(T.length));
  h = h.replaceAll("{{PRICE_ROWS}}", () => rows || '<tr><td colspan="6">Prices load in a moment.</td></tr>')
    .replaceAll("{{PRICES_META}}", () => models.length ? `Last updated ${PR.updated} · ${models.length} models from ${provNames.size} providers · refreshed daily` : "Prices are refreshed daily from an open-source catalog.")
    .replaceAll("{{PRICE_HIGHLIGHTS}}", () => highlights())
    .replaceAll("{{PICKER_DEFAULT}}", () => pickerDefault())
    .replaceAll("{{PRICE_CHANGES_STATIC}}", () => chgStatic()).replaceAll("{{CHANGES_META}}", () => chgMeta())
    .replaceAll("{{PRICE_COUNT}}", () => models.length ? `${models.length} of ${models.length} models` : "")
    .replaceAll("{{PROVIDER_LINKS}}", () => providers.map((x) => `<a href="${U(x.slug)}">${esc(x.name)} API Pricing</a>`).join(" &middot; "));
  if (isHome) ld.push({ "@context": "https://schema.org", "@type": "WebSite", name: S.name, url: origin + "/", description: S.description }, { "@context": "https://schema.org", ...org });
  else if (name === "tools") ld.push({ "@context": "https://schema.org", "@type": "CollectionPage", name: "All Tools", url: origin + p, isPartOf: { "@type": "WebSite", name: S.name, url: origin + "/" }, mainEntity: { "@type": "ItemList", itemListElement: T.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, url: origin + x.href })) } });
  else if (name === "about") ld.push({ "@context": "https://schema.org", "@type": "AboutPage", name: "About " + S.name, url: origin + p, publisher: org });
  else if (t) ld.push({ "@context": "https://schema.org", "@type": "WebApplication", name: t.name, url: origin + p, description: t.desc, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: org });
  { const un = (s) => s.replace(/<[^>]+>/g, " ").replace(/&middot;/g, "·").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim(); const qs = []; for (const m of h.matchAll(/<details class="q"[^>]*><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)) { const q = un(m[1]), a = un(m[2]); if (q && a && !/\{\{|\[\[/.test(q + a)) qs.push({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }); } if (qs.length && name !== "404") ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qs }); }
  const crumbs = isHome || name === "404" ? null : [["Home", "/"], [t ? t.name : (name === "privacy" ? "Privacy Policy" : name === "terms" ? "Terms of Use" : name === "how-it-works" ? "How It Works" : name === "about" ? "About" : name === "tools" ? "All Tools" : name), p]];
  const title = !t && name === "tools" ? `All Tools | ${S.name}` : !t && name === "privacy" ? `Privacy Policy | ${S.name}` : !t && name === "terms" ? `Terms of Use | ${S.name}` : !t && name === "404" ? `Page Not Found | ${S.name}` : !t && name === "about" ? `About ${S.name}` : undefined;
  emit(f, render(h, { path: p, crumbs, ld, title, desc: name === "tools" ? "Every free AI Utility Belt tool in one place: costs, tokens, prompts, documents and JSON, with what each is for and the guides that go with it." : undefined, narrow: !t && name !== "tools", noindex: name === "404" }), p, name !== "404");
}

// ---------- Glossary ----------
{
  const list = glossary.slice().sort((a, b) => a.term.localeCompare(b.term)).map((g) => `<dt id="${g.id}">${esc(g.term)}</dt><dd><span class="s">${esc(g.short)}</span><br>${esc(g.long)}</dd>`).join("");
  const p = U("glossary");
  emit("glossary.html", render(rd("src/templates/glossary.html").replaceAll("{{GLOSSARY_LIST}}", () => list), { path: p, title: `AI Cost and Token Glossary | ${S.name}`, desc: "Plain-English definitions of tokens, context windows, prompt caching, chunking and other terms used in LLM pricing and prompt work.", crumbs: [["Home", "/"], ["Glossary", p]], narrow: true, ld: [{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: "AI Cost and Token Glossary", hasDefinedTerm: glossary.map((g) => ({ "@type": "DefinedTerm", name: g.term, description: g.short, url: origin + p + "#" + g.id })) }] }), p);
}

// ---------- Blog ----------
if (posts.length) {
  emit("blog/index.html", render(rd("src/templates/blog-index.html").replaceAll("{{BLOG_BODY}}", () => blogIndexBody()).replaceAll("{{BLOG_COUNT}}", () => String(posts.length)), { path: POSTDIR, title: `Blog: AI Cost, Token and Prompt Guides | ${S.name}`, desc: "Plain-English guides to LLM pricing, tokens, context windows, prompts and cutting AI costs, grouped by topic with a start-here list.", crumbs: [["Home", "/"], ["Blog", POSTDIR]], narrow: false, ld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Blog", url: origin + POSTDIR, isPartOf: { "@type": "WebSite", name: S.name, url: origin + "/" }, mainEntity: { "@type": "ItemList", itemListElement: posts.slice().sort(byDate).map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.title, url: origin + x.path })) } }] }), POSTDIR);
  for (const p of posts) {
    const tools = p.tools.map((s) => T.find((t) => t.slug === s)).filter(Boolean), more = (() => { const use = {}; posts.forEach((x) => x.tools.forEach((k) => (use[k] = (use[k] || 0) + 1))); const cur = (p.related || "").split(",").map((k) => k.trim()).map((k) => posts.find((x) => x.slug === k)).filter((x) => x && x.slug !== p.slug); const rest = posts.filter((x) => x.slug !== p.slug && !cur.includes(x)).map((x, i) => ({ x, i, n: x.tools.filter((k) => p.tools.includes(k)).reduce((m, k) => m + 1 / use[k], 0) })).sort((a, b) => b.n - a.n || a.i - b.i).map((r) => r.x); return cur.concat(rest).slice(0, 2); })();
    const tp = topicOf.get(p.slug), tord = (blogTopics.find((x) => x.id === (tp || [])[0]) || { ord: [] }).ord, ti = tord.findIndex((x) => x.slug === p.slug);
    const krc = (q, lab) => `<a class="kr" href="${q.path}"><small>${lab}</small><b>${esc(q.title)}</b><span>${readMin(q)} min read</span></a>`;
    const keep = tord.length > 1 && ti >= 0 ? `<nav class="krw" aria-label="Keep reading"><h2>Keep reading: ${esc(tp[1])}</h2><div class="krg">${ti > 0 ? krc(tord[ti - 1], "Previous in this topic") : ""}${ti < tord.length - 1 ? krc(tord[ti + 1], "Next in this topic") : ""}</div></nav>` : "";
    const topBtn = tools.length ? `<p class="tb"><span>Try it</span>${tools.slice(0, 2).map((t) => `<a href="${t.href}">${esc(t.name)}</a>`).join("")}</p>` : "";
    const trust = `<aside class="trust"><b>How we check our numbers</b><p>Numbers in this guide come from our own tests and calculations, from the price catalog described on <a href="${U("how-it-works")}">How It Works</a>, or from sources linked in the text. Spotted a mistake? <a href="mailto:${esc(S.email || "")}?subject=${encodeURIComponent("Correction: " + p.title)}">Email us</a> and we will correct it and update the date.</p></aside>`;
    let h = rd("src/templates/article.html")
      .replaceAll("{{POST_TITLE}}", () => esc(p.title))
      .replaceAll("{{POST_UPDATED}}", () => p.updated && p.updated > p.date ? ` &middot; Updated <time datetime="${p.updated}">${nice(p.updated)}</time>` : "")
      .replaceAll("{{POST_TOPIC}}", () => tp ? ` &middot; <a href="${POSTDIR}#t-${tp[0]}">${esc(tp[1])}</a>` : "")
      .replaceAll("{{POST_TOPBTN}}", () => topBtn).replaceAll("{{POST_TRUST}}", () => trust).replaceAll("{{POST_NAV}}", () => keep).replaceAll("{{POST_DATE}}", () => p.date).replaceAll("{{POST_DATE_NICE}}", () => nice(p.date))
      .replaceAll("{{POST_META2}}", () => p.checked ? `<p class="meta dates">Subscription prices checked <time datetime="${p.checked}">${nice(p.checked)}</time>${p.hasApi && PR ? ` &middot; <span class="apiu">API prices updated <time datetime="${PR.updated}">${nice(PR.updated)}</time></span>` : ""}</p>` : "")
      .replaceAll("{{POST_STALE}}", () => p.checked && daysAgo(p.checked) > (Number(p.stale) || 30) ? `<div class="stale" role="note"><b>These prices may be out of date.</b> The subscription prices below were last checked on ${nice(p.checked)}. Check the current price on the official page before you subscribe.</div>` : "")
      .replaceAll("{{POST_HERO}}", () => { if (!p.image) return ""; const [w, h] = imgSize(p.image); return `<figure class="hero-img"><img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" width="${w}" height="${h}" fetchpriority="high" decoding="async"></figure>`; })
      .replaceAll("{{POST_READ}}", () => Math.max(1, Math.round(p.words / 200))).replaceAll("{{POST_BODY}}", () => p.body + (p.body.includes('class="tt"') ? TTJS : ""))
      .replaceAll("{{POST_TOOLS}}", () => `<div class="tg" style="margin-top:6px">${tools.map(card).join("")}</div>`)
      .replaceAll("{{MORE_POSTS}}", () => more.length ? `<div class="prose" style="padding-top:0"><h2>More Guides</h2><div class="posts">${more.map(postCard).join("")}</div></div>` : "");
    emit(`blog/${p.slug}.html`, render(h, { path: p.path, title: `${p.title} | ${S.name}`, desc: p.description, ogType: "article", image: p.image, crumbs: [["Home", "/"], ["Blog", POSTDIR], [p.title, p.path]], narrow: true, ld: [{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: [p.hasApi && PR ? PR.updated : p.checked || p.updated || p.date, p.updated || ""].sort().pop(), mainEntityOfPage: origin + p.path, image: origin + (p.image || "/og-image.png"), author: org, publisher: { ...org } }].concat(p.faq.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq }] : []) }), p.path);
  }
}

// ---------- Provider price pages ----------
for (const pv of providers) {
  const ms = models.filter((m) => m.p === pv.name), p = U(pv.slug);
  const rows = ms.map((m) => `<tr><td>${esc(m.n)}</td><td>${m.i}</td><td>${m.o}</td><td>${m.c}</td></tr>`).join("");
  const others = providers.filter((x) => x.slug !== pv.slug).map((x) => `<a href="${U(x.slug)}">${esc(x.name)}</a>`).join(" &middot; ");
  const lab = pv.label || pv.name;
  const h = rd("src/templates/provider.html").replaceAll("{{PROV_NAME}}", () => esc(lab)).replaceAll("{{PROV_COUNT}}", () => ms.length).replaceAll("{{PROV_ROWS}}", () => rows)
    .replaceAll("{{PROV_INTRO}}", () => `${esc(lab)} models are sold through the ${esc(pv.name)} API. This page lists every ${esc(pv.name)} model in the ${esc(S.name)} price catalog with its price per million input and output tokens and its context window. The prices are refreshed daily.`)
    .replaceAll("{{PROV_LINKS}}", () => others + (others ? " &middot; " : "") + `<a href="${hrefFor("model-prices")}">Compare all providers</a>`);
  emit(pv.slug + ".html", render(h, { path: p, title: `${lab} API Pricing: Price per 1M Tokens | ${S.name}`, desc: `Current ${lab} API prices per million input and output tokens and context window for ${ms.length} models. Updated daily.`, crumbs: [["Home", "/"], ["Model Prices", hrefFor("model-prices")], [`${lab} API Pricing`, p]], narrow: true, ld: [] }), p);
}

// ---------- robots, sitemap, ads.txt, .htaccess ----------
const stateFile = "scripts/lastmod.json";
let state = {}; try { state = JSON.parse(rd(stateFile)); } catch { /* first run */ }
const nextState = {};
for (const [, html, p, inMap] of outputs) { if (!inMap) continue; const h = sha(html.replace(/(prices verified|price catalog refreshed)[^<]*/gi, "").replace(/api prices updated\s*<time[^>]*>[^<]*/gi, "").replace(/"dateModified":"[^"]*"/g, "")); const prev = state[p]; nextState[p] = prev && prev.h === h ? prev : { h, d: today }; }
wr("robots.txt", "User-agent: *\nAllow: /\n" + (origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ""));
if (origin) {
  wr("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + outputs.filter((o) => o[3]).map((o) => `<url><loc>${origin}${o[2]}</loc><lastmod>${nextState[o[2]].d}</lastmod></url>`).join("\n") + "\n</urlset>\n");
  wr(stateFile, JSON.stringify(nextState, null, 1) + "\n");
} else if (fs.existsSync("sitemap.xml")) fs.unlinkSync("sitemap.xml");
if (adsOn) wr("ads.txt", `google.com, ${ADS.client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`); else if (fs.existsSync("ads.txt")) fs.unlinkSync("ads.txt");

// Send www.<host> to <host> so search engines see one version of every URL (canonical tags and the sitemap use the bare host).
let wwwRule = "";
if (origin) { const host = new URL(origin).host; if (!/^www\./i.test(host) && /\./.test(host) && !/^(localhost|\d)/.test(host)) wwwRule = `# www -> bare host (one version of every URL)\nRewriteCond %{HTTP_HOST} ^www\\.${host.replace(/\./g, "\\.")}$ [NC]\nRewriteRule ^ ${origin}%{REQUEST_URI} [R=301,L,QSA]\n`; }
wr(".htaccess", `# Generated by scripts/build.mjs. Edit the build script, not this file.
ErrorDocument 404 /404.html
# Keep repo helper files and page templates out of the public site
RedirectMatch 404 ^/(scripts|src|\\.github)(/|$)
RedirectMatch 404 ^/(README\\.md|tools\\.json)$
RedirectMatch 404 ^/404/?$
${clean ? `
RewriteEngine On
${wwwRule}# Old page names
RewriteRule ^prompt-trimmer(\\.html)?$ /prompt-token-optimizer [R=301,L]
# /index.html and /anything.html -> clean URL
RewriteRule ^(.*/)?index\\.html$ /$1 [R=301,L]
RewriteCond %{THE_REQUEST} ^[A-Z]+\\s/+(.+?)\\.html[\\s?]
RewriteRule ^ /%1 [R=301,L]
# Serve /anything from anything.html
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+?)/?$ $1.html [L]
` : ""}
<IfModule mod_headers.c>
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/plain application/xml
</IfModule>
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType image/png "access plus 1 month"
ExpiresByType image/svg+xml "access plus 1 month"
ExpiresByType image/x-icon "access plus 1 month"
ExpiresByType application/javascript "access plus 1 week"
ExpiresByType text/javascript "access plus 1 week"
ExpiresByType application/json "access plus 1 hour"
ExpiresByType text/html "access plus 10 minutes"
</IfModule>
`);
console.log(origin ? `robots.txt, sitemap.xml (${outputs.filter((o) => o[3]).length} URLs) and .htaccess written for ${origin}` : "site.live is false: no sitemap or canonical tags");
