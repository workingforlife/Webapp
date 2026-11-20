// One-off: rebuilds the "changes" log in prices.json from the git history of prices.json.
// Run from the repo root with full history available:  node scripts/backfill-price-changes.mjs
// Safe to re-run: it replaces the whole log with what the history shows. The daily update job keeps it going after that.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { diffModels, formatPrices, MAX_EVENTS } from "./price-diff.mjs";

const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const commits = git("log", "--format=%H", "--reverse", "--", "prices.json").split("\n").filter(Boolean);
const snaps = [];
for (const c of commits) { try { const j = JSON.parse(git("show", `${c}:prices.json`)); if (Array.isArray(j.models) && j.updated) snaps.push(j); } catch { /* skip unreadable versions */ } }
if (snaps.length < 2) { console.error("Need at least two versions of prices.json in the git history."); process.exit(1); }
let changes = [];
for (let i = 1; i < snaps.length; i++) changes.push(...diffModels(snaps[i - 1].models, snaps[i].models, snaps[i].updated));
const cur = JSON.parse(fs.readFileSync("prices.json", "utf8"));
const last = snaps[snaps.length - 1];
// If the working copy is newer than the last commit, add what changed since then.
if (cur.updated !== last.updated || JSON.stringify(cur.models) !== JSON.stringify(last.models)) changes.push(...diffModels(last.models, cur.models, cur.updated));
if (changes.length > MAX_EVENTS) changes = changes.slice(-MAX_EVENTS);
fs.writeFileSync("prices.json", formatPrices({ updated: cur.updated, source: cur.source, models: cur.models, trackedSince: snaps[0].updated, changes }));
console.log(`Wrote ${changes.length} change events from ${snaps.length} snapshots, tracked since ${snaps[0].updated}`);
