// Shared helpers for the price change log kept inside prices.json ("changes"). Node 20+, no dependencies.
// An event describes one change seen between two daily snapshots. Models with identical changes are grouped.
//   t: "price" (input, output or cache-read price changed), "context", "added", "removed"
//   price and context changes carry [old, new] pairs; added and removed carry the plain values.
const key = (m) => m.provider + "|" + m.name;
const val = (x) => (x === undefined ? null : x);
export const MAX_EVENTS = 1500;

export function diffModels(prev, next, date) {
  const a = new Map(prev.map((m) => [key(m), m])), b = new Map(next.map((m) => [key(m), m])), raw = [];
  for (const [k, m] of b) {
    const o = a.get(k);
    if (!o) { raw.push({ d: date, p: m.provider, t: "added", n: m.name, in: m.in, out: m.out, ...(m.cr != null ? { cr: m.cr } : {}), ctx: m.ctx }); continue; }
    const price = ["in", "out", "cr"].some((f) => val(o[f]) !== val(m[f])), ctx = o.ctx !== m.ctx;
    if (!price && !ctx) continue;
    const e = { d: date, p: m.provider, t: price ? "price" : "context", n: m.name };
    for (const f of ["in", "out", "cr"]) if (val(o[f]) !== val(m[f])) e[f] = [val(o[f]), val(m[f])];
    if (ctx) e.ctx = [o.ctx, m.ctx];
    raw.push(e);
  }
  for (const [k, o] of a) if (!b.has(k)) raw.push({ d: date, p: o.provider, t: "removed", n: o.name, in: o.in, out: o.out, ...(o.cr != null ? { cr: o.cr } : {}), ctx: o.ctx });
  const groups = new Map();
  for (const e of raw) { const { n, ...rest } = e, s = JSON.stringify(rest); if (!groups.has(s)) groups.set(s, { rest, n: [] }); groups.get(s).n.push(n); }
  return [...groups.values()].map(({ rest, n }) => { const { d, p, t, ...vals } = rest; return { d, p, n: n.sort(), t, ...vals }; })
    .sort((x, y) => x.d.localeCompare(y.d) || x.p.localeCompare(y.p) || x.n[0].localeCompare(y.n[0]));
}

// Same layout as before for the models, with the change log after them.
export function formatPrices({ updated, source, models, trackedSince, changes }) {
  const lines = models.map((m) => "  " + JSON.stringify(m));
  let out = `{\n "updated": "${updated}",\n "source": "${source}",\n "count": ${models.length},\n "models": [\n${lines.join(",\n")}\n ]`;
  if (trackedSince) out += `,\n "trackedSince": "${trackedSince}",\n "changes": [\n${changes.map((e) => "  " + JSON.stringify(e)).join(",\n")}\n ]`;
  return out + "\n}\n";
}
