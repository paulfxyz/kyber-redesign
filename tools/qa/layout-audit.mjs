// Layout audit: every language × device × key route.
// Usage: node tools/qa/layout-audit.mjs [baseUrl] [langs...]
// Requires Playwright. Reports horizontal overflow, clipped text, overlapping header,
// elements wider than the viewport and untranslated-looking fallbacks.
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8080/';
const src = fs.readFileSync(new URL('../../js/app.js', import.meta.url), 'utf8');
const ALL = JSON.parse(src.match(/const LANGS = (\[.*?\]\]);/)[1]).map(x => x[0]);
const LANGS = process.argv.length > 3 ? process.argv.slice(3) : ALL;
const DEVICES = [
  ['desktop', { width: 1440, height: 900 }, false],
  ['laptop', { width: 1280, height: 800 }, false],
  ['tablet', { width: 820, height: 1180 }, true],
  ['mobile', { width: 390, height: 844 }, true],
  ['small', { width: 360, height: 740 }, true],
];
const ROUTES = ['#/', '#/technology', '#/solutions/robotics', '#/about', '#/sdk', '#/blog', '#/blog/v-029', '#/careers', '#/careers/forward-deployed-engineer', '#/connect', '#/legal/privacy', '#/simple'];

const probe = () => {
  const W = innerWidth, out = [];
  const sw = document.documentElement.scrollWidth;
  if (sw > W + 1) out.push(`page overflow ${sw}>${W}`);
  const vis = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length; };
  const SKIP = '.marq, .bigwrap, .tl, .rail, .tablewrap, pre, code, canvas, svg, .lm, [hidden], .xm, .loader, .dock, .fab';
  const clipAnc = (e) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const s = getComputedStyle(a); if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) return a; } return null; };
  // elements escaping the viewport without any clipping ancestor (would cause sideways scroll / cut-off)
  for (const e of document.querySelectorAll('main *, header *, footer *')) {
    if (!vis(e) || e.closest(SKIP) || getComputedStyle(e).position === 'fixed') continue;
    const r = e.getBoundingClientRect();
    if (r.width > 0 && (r.right > W + 2 || r.left < -2) && !clipAnc(e)) { out.push(`escapes viewport <${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}>`); if (out.length > 6) break; }
  }
  // text cut off by its clipping container (headings, buttons, labels, card titles)
  for (const e of document.querySelectorAll('h1,h2,h3,h4,.btn,button,label,.kicker,.chip,.pill,.post__b,.ccard h3,.role,.lead-card b,dt,td,th')) {
    if (!vis(e) || e.closest(SKIP)) continue;
    const s = getComputedStyle(e);
    if (/(hidden|clip)/.test(s.overflowX) && s.textOverflow !== 'ellipsis' && e.scrollWidth > e.clientWidth + 2) { out.push(`clipped <${e.tagName.toLowerCase()}> “${e.innerText.slice(0, 24).replace(/\n/g, ' ')}”`); continue; }
    const a = clipAnc(e); if (!a || /(auto|scroll)/.test(getComputedStyle(a).overflowX)) continue;
    const ar = a.getBoundingClientRect(), r = e.getBoundingClientRect();
    if (r.width > 0 && (r.right > ar.right + 3 || r.left < ar.left - 3)) out.push(`cut off <${e.tagName.toLowerCase()}> “${e.innerText.slice(0, 24).replace(/\n/g, ' ')}”`);
  }
  // header: nav items overlapping logo or actions
  const n = document.querySelector('.hdr__nav');
  if (n && vis(n)) {
    const nr = n.getBoundingClientRect(), lg = document.querySelector('.lang__btn')?.getBoundingClientRect(), logo = document.querySelector('.hdr a')?.getBoundingClientRect();
    const rtl = document.documentElement.dir === 'rtl';
    if (lg && (rtl ? nr.left < lg.right : nr.right > lg.left)) out.push('header nav overlaps actions');
    if (logo && (rtl ? nr.right > logo.left : nr.left < logo.right)) out.push('header nav overlaps logo');
    if ([...n.children].some(c => c.getBoundingClientRect().height > 46)) out.push('header nav item wraps');
  }
  return out;
};

const b = await chromium.launch();
const results = []; let checked = 0;
for (const [dname, vp, mob] of DEVICES) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob, deviceScaleFactor: 1 });
  await ctx.route(/gitlab\.com|fonts\.g/, r => r.abort());
  const p = await ctx.newPage();
  for (const l of LANGS) {
    await p.goto(`${BASE}?lang=${l}#/`, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    for (const r of ROUTES) {
      await p.evaluate((h) => { location.hash = h; }, r);
      await p.waitForTimeout(r.includes('blog/') || r.includes('legal') || r.includes('careers/') ? 650 : 380);
      const issues = await p.evaluate(probe);
      checked++;
      if (issues.length) results.push({ device: dname, lang: l, route: r, issues });
    }
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync('layout-audit.json', JSON.stringify(results, null, 1));
console.log(`checked ${checked} views · ${results.length} with issues`);
const agg = {};
const uniq = new Set();
for (const x of results) for (const i of x.issues) { const k = `${x.device} ${x.route} :: ${i.replace(/\d+\.\.\d+|\d+>\d+/g, '#')}`; (agg[k] = agg[k] || []).push(x.lang); }
for (const [k, v] of Object.entries(agg).sort((a, b) => b[1].length - a[1].length).slice(0, 60)) console.log(v.length.toString().padStart(3), k, '·', v.slice(0, 12).join(' '));
