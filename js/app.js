/* Kyber redesign — app: i18n, router, pages, motion */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = FX.RM;
  const K = 'https://kyber.tech';
  document.documentElement.classList.add('js');

  /* ---------------- i18n ---------------- */
  const LANGS = [
    ['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'], ['pt', 'Português'],
    ['zh', '中文'], ['ja', '日本語'], ['hi', 'हिन्दी'], ['ar', 'العربية'], ['he', 'עברית']
  ];
  const FONTS = {
    zh: 'Noto+Sans+SC:wght@400;500;700', ja: 'Noto+Sans+JP:wght@400;500;700',
    ar: 'IBM+Plex+Sans+Arabic:wght@400;500;600', he: 'Heebo:wght@400;500;700', hi: 'Noto+Sans+Devanagari:wght@400;500;600'
  };
  const cache = {};
  let D = {}, EN = {}, LANG = 'en';
  const get = (o, k) => k.split('.').reduce((a, p) => (a && a[p] != null ? a[p] : undefined), o);
  const RTLFIX = (s) => (LANG === 'ar' || LANG === 'he') && typeof s === 'string' ? s.replace(/(\d+(?:[.,–-]\d+)*\s?ms)\b/g, '\u2066$1\u2069') : s;
  const t = (k) => { const v = get(D, k); return RTLFIX(v != null && v !== '' ? v : (get(EN, k) ?? '')); };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = (k) => esc(t(k));
  async function load(l) {
    if (cache[l]) return cache[l];
    const r = await fetch(`i18n/${l}.json`); if (!r.ok) throw new Error('lang'); return (cache[l] = await r.json());
  }
  function loadFont(l) {
    if (!FONTS[l] || document.getElementById('font-' + l)) return;
    const k = document.createElement('link'); k.id = 'font-' + l; k.rel = 'stylesheet';
    k.href = `https://fonts.googleapis.com/css2?family=${FONTS[l]}&display=swap`; document.head.appendChild(k);
  }
  async function setLang(l, rerender = true) {
    if (!LANGS.find(x => x[0] === l)) l = 'en';
    try { D = await load(l); } catch (e) { l = 'en'; D = EN; }
    LANG = l; loadFont(l);
    const html = document.documentElement; html.lang = l; html.dir = (l === 'ar' || l === 'he') ? 'rtl' : 'ltr';
    localStorage.setItem('kyber-lang', l);
    $('#langCode').textContent = l.toUpperCase();
    $$('#langList button').forEach(b => b.setAttribute('aria-selected', b.dataset.l === l));
    document.title = t('meta.title');
    $$('[data-i]').forEach(e => e.textContent = t(e.dataset.i));
    $$('[data-ia]').forEach(e => e.setAttribute('aria-label', t(e.dataset.ia)));
    renderChrome();
    if (rerender) route(true);
  }

  /* ---------------- icons ---------------- */
  const ARR = '<svg class="arr" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 7h12M8 2l5 5-5 5"/></svg>';
  const ARRUR = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11L11 3M4.5 3H11v6.5"/></svg>';
  const ICO = [
    '<svg class="ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="22" cy="22" r="17"/><path d="M22 22l9-6"/><circle cx="22" cy="22" r="2" fill="currentColor"/><path d="M22 5v4M39 22h-4M5 22h4"/></svg>',
    '<svg class="ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 12c5-6 9 6 14 0s9 6 14 0 9 6 10 0M3 22c5-6 9 6 14 0s9 6 14 0 9 6 10 0M3 32c5-6 9 6 14 0s9 6 14 0 9 6 10 0"/><path d="M22 4v36" stroke-dasharray="2 3"/></svg>',
    '<svg class="ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M22 4l15 6v11c0 9-6 16-15 19C13 37 7 30 7 21V10z"/><path d="M15 22l5 5 9-10"/></svg>',
    '<svg class="ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 10h10l6 12 6-12h10M6 34h32"/><circle cx="22" cy="22" r="3"/></svg>',
    '<svg class="ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 30l8-8 6 6 8-14 6 8 8-6"/><path d="M4 38h36" opacity=".5"/><circle cx="26" cy="14" r="2.5" fill="currentColor"/></svg>',
    '<svg class="ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="8" width="24" height="17" rx="2"/><rect x="30" y="14" width="10" height="20" rx="2"/><path d="M10 32h12M16 25v7"/></svg>'
  ];
  const SOL = ['remote-desktop', 'xr', 'robotics', 'drones', 'autonomous-vehicles', 'ai-agents'];
  const SOLURL = { 'remote-desktop': 'remote-desktop', xr: 'xr', robotics: 'robotics', drones: 'drones', 'autonomous-vehicles': 'autonomous-vehicles', 'ai-agents': 'ai-agents' };
  const img = (s) => `img/${s}.webp`;
  const POSTS = [
    { k: 'p1', d: '2026-09-28', m: 4, c: 'a', u: '/article/avatar-medical-and-kyber-awarded/', i: 'xr' },
    { k: 'p2', d: '2026-08-20', m: 8, c: 'r', u: '/article/v-028/', v: '0.28' },
    { k: 'p3', d: '2026-06-26', m: 6, c: 'r', u: '/article/v-027/', v: '0.27' },
    { k: 'p4', d: '2026-06-22', m: 5, c: 'a', u: '/article/kyberatvivatech/', i: 'about' },
    { k: 'p5', d: '2026-06-10', m: 4, c: 'a', u: '/article/first-fundraising-announcement/', i: 'robotics' },
    { k: 'p6', d: '2026-05-13', m: 3, c: 'r', u: '/article/v-026/', v: '0.26' },
    { k: 'p7', d: '2026-03-31', m: 2, c: 'r', u: '/article/v-025/', v: '0.25' }
  ];
  const fmtDate = (d) => { try { return new Intl.DateTimeFormat(LANG, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d + 'T12:00:00')); } catch (e) { return d; } };
  const num = (n, o) => { try { return new Intl.NumberFormat(LANG === 'ar' ? 'ar-u-nu-latn' : LANG, o).format(n); } catch (e) { return n; } };

  /* ---------------- shared blocks ---------------- */
  const headline = (a, b, cls = 'phero__title', tag = 'h1') => `<${tag} class="${cls} split">${T(a)} <span class="serif">${T(b)}</span></${tag}>`;
  const kicker = (k) => `<span class="kicker">${T(k)}</span>`;
  const btnSdk = (cls = 'btn--solid') => `<a class="btn ${cls} magnetic" href="#/sdk">${T('common.getSdk')} ${ARR}</a>`;
  const btnSales = (cls = 'btn--ghost') => `<a class="btn ${cls} magnetic" href="#/contact">${T('common.talkSales')} ${ARR}</a>`;
  const btnDocs = (cls = 'btn--ghost') => `<a class="btn ${cls}" href="${K}/Documentation/" target="_blank" rel="noopener">${T('common.viewDocs')} ${ARRUR}</a>`;

  const ctaBlock = () => `
  <section class="sec" style="padding-bottom:0">
    <div class="wrap">
      <div class="cta">
        <div class="ccard ccard--accent rv">
          <div>${kicker('cta.devKicker')}</div>
          <div><h3>${T('cta.devTitle')}</h3><p style="margin-top:1rem"><code>git clone https://gitlab.com/kyber/kyber.git</code></p></div>
          <div class="btns">${btnSdk()} ${btnDocs()}</div>
        </div>
        <div class="ccard rv">
          <canvas class="bgfx" data-fx="mini-field"></canvas>
          <div>${kicker('cta.entKicker')}</div>
          <h3>${T('cta.entTitle')}</h3>
          <div class="btns">${btnSales('btn--solid')}</div>
        </div>
      </div>
    </div>
    <div class="bigwrap"><div class="bigline" data-fx="bigline">${T('cta.bigLine')} <span class="serif">8 ms</span> ${T('cta.bigLine')} <span class="serif">8 ms</span></div></div>
  </section>`;

  const faqBlock = () => `
  <section class="sec"><div class="wrap faq">
    <div><span class="kicker">FAQ</span><h2 class="h1 split" style="margin-top:1rem">${T('faq.title')}</h2>
      <a class="btn btn--ghost" style="margin-top:2rem" href="#/contact">${T('common.contactUs')} ${ARR}</a></div>
    <div>${[1, 2, 3, 4, 5].map(i => `<details class="rv"><summary>${T('faq.q' + i)}<i></i></summary><div class="ans">${linkify(T('faq.a' + i))}</div></details>`).join('')}</div>
  </div></section>`;
  const linkify = (s) => s.replace(/gitlab\.com\/kyber\/kyber/g, '<a class="accent" href="https://gitlab.com/kyber/kyber#where-to-start" target="_blank" rel="noopener">gitlab.com/kyber/kyber</a>').replace(/r\/kyber/g, '<a class="accent" href="https://www.reddit.com/r/kyber/" target="_blank" rel="noopener">r/kyber</a>');

  /* ---------------- pages ---------------- */
  function pageHome() {
    const lats = [[8, '--accent', 'lat1'], [75, '--accent2', 'lat2'], [220, '--warn', 'lat3'], [450, '--hot', 'lat4']];
    const plats = ['Windows', 'Linux', 'macOS', 'Android', 'iOS', 'Meta Quest', 'Apple Vision Pro', 'ROS', 'Unity', 'Unreal', 'Vulkan', 'D3D11', 'Web', 'Starlink'];
    const stageMs = [1.2, 1.9, 2.8, 1.5, 0.8];
    return `
    <section class="hero" id="top">
      <canvas class="hero__gl" id="heroGl" aria-hidden="true"></canvas>
      <div class="hero__veil"></div>
      <div class="hero__in">
        ${kicker('home.eyebrow')}
        <h1 class="hero__title split">${T('home.titleA')} <span class="l2"><span class="serif">${T('home.titleB')}</span></span></h1>
        <div class="hero__row">
          <div>
            <p class="hero__lead rv">${T('home.lead')}</p>
            <div class="btns rv">${btnSdk('btn--accent')} <a class="btn btn--ghost" href="#play">${T('home.ctaSecondary')} ${ARR}</a></div>
          </div>
          <div class="hud rv" aria-hidden="true">
            <div><small>${T('home.hudLatency')}</small><b class="accent"><span id="hudMs">8.2</span> ms</b><canvas class="spark" id="spark"></canvas></div>
            <div><small>${T('home.hudClock')}</small><b id="hudClock">00:00:00.000</b></div>
            <div><small>QUIC · H3</small><b>1 port</b><small style="margin:.4rem 0 0">E2E · AES-GCM</small></div>
          </div>
        </div>
      </div>
    </section>
    <div class="marq" aria-hidden="true"><div class="marq__t">${[...plats, ...plats].map(p => `<span>${p}</span>`).join('')}</div></div>

    <section class="mani"><div class="wrap">
      <div class="mani__meta"><span class="kicker">01 / ${T('home.statsKicker')}</span><span class="mono muted" dir="ltr" style="font-size:var(--t-xs)">200 ms → 8 ms</span></div>
      <p class="mani__text" id="mani">${T('home.manifesto')}</p>
    </div></section>

    <section class="sec" id="play" style="padding-top:0"><div class="wrap play">
      <div>
        ${kicker('home.playKicker')}
        <h2 class="h1 split" style="margin-top:1rem">${T('home.playTitle')}</h2>
        <p class="lead" style="margin-top:1.2rem">${T('home.playLead')}</p>
        <div class="lat" role="group">
          ${lats.map(([ms, c, k], i) => `<button data-lat="${ms}" data-c="${c}" aria-pressed="${i === 0}" style="--c:var(${c})"><i class="dot"></i><span><b>${T('home.' + k)}</b><small>${T('home.' + k + 'd')}</small></span><span class="mono">${ms === 8 ? '8–10' : ms === 75 ? '50–100' : ms === 220 ? '150–300' : '300+'} ms</span></button>`).join('')}
        </div>
      </div>
      <div class="play__field rv" id="field">
        <canvas></canvas>
        <div class="play__read"><b class="mono" id="playErr">0</b><small class="mono">px drift</small></div>
        <span class="play__hint mono">${T('home.playHint')}</span>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead">
        <div>${kicker('home.statsKicker')}<h2 class="h1 split">${T('home.statsTitle')}</h2></div>
        <p class="lead rv">${T('home.statsLead')}</p>
      </div>
      <div class="feat">
        ${[1, 2, 3, 4, 5, 6].map(i => `<article class="fcard rv">${ICO[i - 1]}<div><span class="kicker">${T('home.f' + i + 'k')}</span><h3 class="h3">${T('home.f' + i + 't')}</h3><p>${T('home.f' + i + 'd')}</p></div></article>`).join('')}
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead">
        <div>${kicker('home.solKicker')}<h2 class="h1 split">${T('home.solTitle')}</h2></div>
        <p class="lead rv">${T('home.solLead')}</p>
      </div>
      <div class="show">
        <div class="show__list">
          ${SOL.map((s, i) => `<a class="show__item${i === 0 ? ' is-on' : ''}" href="#/solutions/${s}" data-i="${i}">
            <span class="n">0${i + 1}</span><h3>${T(`solutions.${s}.name`)}</h3><span class="go">${ARR}</span>
            <p>${T(`solutions.${s}.short`)} — ${T(`solutions.${s}.card`)}</p>
            <div class="thumb"><img src="${img(s)}" alt="" loading="lazy"></div></a>`).join('')}
        </div>
        <div class="show__stage" aria-hidden="true">
          ${SOL.map((s, i) => `<figure class="${i === 0 ? 'is-on' : ''}"><img src="${img(s)}" alt="" loading="lazy"><figcaption><span>${T(`solutions.${s}.name`)}</span><span>0${i + 1} / 06</span></figcaption></figure>`).join('')}
          <div class="scan"></div><div class="reticle"><i></i><i></i><i></i><i></i></div>
          <div class="tag mono"><i></i>${T('common.live')} · <span id="stageMs">8.4</span> ms</div>
        </div>
      </div>
    </div></section>

    <section class="pipe" id="pipe"><div class="pipe__pin"><div class="wrap">
      <div class="sechead">
        <div>${kicker('home.pipeKicker')}<h2 class="h1 split">${T('home.pipeTitle')}</h2></div>
        <p class="lead">${T('home.pipeLead')}</p>
      </div>
      <div class="pipe__track">
        <svg class="pipe__svg" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
          <path id="pipeBase" d="M10 40 C 120 10, 180 70, 300 40 S 480 10, 600 40 S 780 70, 990 40" fill="none" stroke="var(--line2)" stroke-width="1"/>
          <path id="pipeLine" d="M10 40 C 120 10, 180 70, 300 40 S 480 10, 600 40 S 780 70, 990 40" fill="none" stroke="var(--accent)" stroke-width="2" style="filter:drop-shadow(0 0 6px var(--accent))"/>
          <g id="pipePk"></g>
        </svg>
        <div class="pipe__nodes">
          ${[1, 2, 3, 4, 5].map((i) => `<div class="pnode"><span class="mono">0${i}</span><b>${T('home.p' + i)}</b><span class="t">+${num(stageMs[i - 1], { minimumFractionDigits: 1 })} ms</span></div>`).join('')}
        </div>
      </div>
      <div class="pipe__total"><b><span id="pipeTotal">0.0</span><small style="font-size:.35em"> ms</small></b><span>${T('home.statsLead')}</span></div>
    </div></div></section>

    <section class="sec vlc"><div class="wrap">
      ${kicker('home.vlcKicker')}
      <h2 class="h1 split" style="margin-top:1rem;max-width:20ch">${T('home.vlcTitle')}</h2>
      <p class="lead rv" style="margin-top:1.4rem">${T('home.vlcLead')}</p>
      <div class="vlc__grid">
        <div class="rv"><div class="vlc__num"><span data-count="20">0</span><sup>yrs</sup></div><p>${T('home.vlcStat1')}</p></div>
        <div class="rv"><div class="vlc__num"><span data-count="1">0</span><sup>B+</sup></div><p>${T('home.vlcStat2')}</p></div>
        <div class="rv"><div class="vlc__num accent"><span data-count="8">0</span><sup>ms</sup></div><p>${T('home.vlcStat3')}</p></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('home.newsKicker')}<h2 class="h1 split">${T('home.newsTitle')}</h2></div>
        <div style="justify-self:end"><a class="btn btn--ghost" href="#/blog">${T('nav.blog')} ${ARR}</a></div></div>
      <div class="news">${POSTS.slice(0, 4).map(p => `<a class="rv" href="${K}${p.u}" target="_blank" rel="noopener"><span class="d">${fmtDate(p.d)}</span><h3>${T('blog.' + p.k)}</h3><span class="meta"><span class="chip">${T(p.c === 'r' ? 'blog.releases' : 'blog.announcements')}</span>${ARRUR}</span></a>`).join('')}</div>
    </div></section>
    ${ctaBlock()}`;
  }

  const capViz = [
    `<svg viewBox="0 0 300 150" fill="none"><g stroke="var(--accent)" stroke-width="1.5"><path class="vz-w" d="M0 40 Q 37 10 75 40 T 150 40 T 225 40 T 300 40"/><path class="vz-w" style="animation-delay:-.6s" d="M0 75 Q 37 45 75 75 T 150 75 T 225 75 T 300 75" opacity=".7"/><path class="vz-w" style="animation-delay:-1.2s" d="M0 110 Q 37 80 75 110 T 150 110 T 225 110 T 300 110" opacity=".45"/></g><line x1="150" y1="10" x2="150" y2="140" stroke="var(--ink)" stroke-dasharray="3 4"/><circle cx="150" cy="40" r="4" fill="var(--accent)"/><circle cx="150" cy="75" r="4" fill="var(--accent)"/><circle cx="150" cy="110" r="4" fill="var(--accent)"/></svg>`,
    `<svg viewBox="0 0 300 150" fill="none"><path d="M0 100 L30 90 L50 120 L80 60 L100 95 L130 40 L150 110 L180 70 L210 100 L240 50 L270 90 L300 80" stroke="var(--hot)" stroke-width="1.2" opacity=".6" class="vz-j"/><path d="M0 60 H300" stroke="var(--accent)" stroke-width="2"/><circle r="5" fill="var(--accent)" class="vz-dot"><animate attributeName="cx" values="0;300" dur="2.4s" repeatCount="indefinite"/><animate attributeName="cy" values="60;60" dur="2.4s" repeatCount="indefinite"/></circle><text x="8" y="140" font-family="Geist Mono" font-size="11" fill="var(--muted)">8.4 ms · FEC</text></svg>`,
    `<svg viewBox="0 0 300 150" fill="none"><g stroke="var(--line2)">${Array.from({ length: 9 }, (_, i) => `<path d="M10 ${12 + i * 15} C 120 ${12 + i * 15}, 150 75, 200 75"/>`).join('')}</g><rect x="200" y="58" width="34" height="34" rx="6" stroke="var(--accent)" stroke-width="1.5"/><path d="M234 75 H300" stroke="var(--accent)" stroke-width="2"/><circle r="3.5" fill="var(--accent)"><animate attributeName="cx" values="234;300" dur="1s" repeatCount="indefinite"/><animate attributeName="cy" values="75;75" dur="1s" repeatCount="indefinite"/></circle><text x="204" y="112" font-family="Geist Mono" font-size="10" fill="var(--muted)">:443</text></svg>`
  ];

  function pageSolution(slug) {
    const P = (k) => `solutions.${slug}.${k}`;
    const idx = SOL.indexOf(slug); const next = SOL[(idx + 1) % SOL.length];
    return `
    <section class="phero"><div class="wrap">
      <span class="kicker">${T('solution.forLabel')} ${T(P('name'))}</span>
      ${headline(P('titleA'), P('titleB'))}
      <div class="phero__grid">
        <p class="lead rv">${T(P('lead'))}</p>
        <div class="btns rv" style="justify-content:flex-end">${btnSdk()} ${btnSales()}</div>
      </div>
      <div class="phero__media rv"><img src="${img(slug)}" alt="${T(P('name'))}" data-parallax>
        <div class="hudline"><span class="chip">● ${T('common.live')}</span><span class="chip">8–10 ms</span><span class="chip">${T('tech.sVideo')} · ${T('tech.sAudio')} · ${T('tech.sControl')} · ${T('tech.sTelemetry')}</span><span class="chip">QUIC/HTTP3 · E2E</span></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:var(--sec)"><div class="wrap">
      <div class="sechead"><div>${kicker('solution.capabilities')}<h2 class="h1 split">${T(P('capTitle'))}</h2></div></div>
      <div class="caps">${[1, 2, 3].map(i => `<article class="cap rv"><div class="viz">${capViz[i - 1]}</div><h3 class="h3">${T(P('c' + i + 't'))}</h3><p>${T(P('c' + i + 'd'))}</p></article>`).join('')}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('solution.benefits')}<h2 class="h1 split">${T(P('benTitle'))}</h2></div></div>
      <div class="bens">${[1, 2, 3, 4].map(i => `<div class="ben rv"><span class="n">0${i}</span><h3>${T(P('b' + i + 't'))}</h3><p>${T(P('b' + i + 'd'))}</p></div>`).join('')}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('solution.useCases')}<h2 class="h1 split">${T(P('useTitle'))}</h2></div></div>
      <div class="uses">${[1, 2, 3, 4, 5, 6].map(i => `<div class="use rv"><span class="mono">0${i}</span><div><h3>${T(P('u' + i + 't'))}</h3><p>${T(P('u' + i + 'd'))}</p></div></div>`).join('')}</div>
    </div></section>
    ${faqBlock()}
    <a class="nextsol" href="#/solutions/${next}"><div class="wrap"><span class="kicker">${T('common.next')}</span><div class="h-display" style="margin-top:1.2rem">${T(`solutions.${next}.name`)} →</div></div></a>
    ${ctaBlock()}`;
  }

  function pageTech() {
    const bars = [[T('tech.thrKyber'), 9, '--accent'], [T('tech.thrHuman'), 40, '--accent2'], ['WebRTC', 150, '--warn'], [T('home.lat3'), 300, '--hot']];
    return `
    <section class="phero"><div class="wrap">
      ${kicker('tech.kicker')}
      ${headline('tech.titleA', 'tech.titleB')}
      <div class="phero__grid"><p class="lead rv">${T('tech.lead')}</p><div class="btns rv" style="justify-content:flex-end">${btnSdk()} ${btnDocs()}</div></div>
    </div></section>

    <section class="sec" style="padding-top:2rem"><div class="wrap">
      <div class="sechead"><div><span class="kicker">01</span><h2 class="h1 split">${T('tech.thrTitle')}</h2></div><p class="lead rv">${T('tech.thrLead')}</p></div>
      <div class="thr" id="thr">${bars.map(([l, v, c]) => `<div class="thr__row" style="--c:var(${c})"><span>${l}</span><div class="bar"><i data-w="${v / 300 * 100}"></i></div><b>${v} ms</b></div>`).join('')}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">02</span><h2 class="h1 split">${T('tech.pushTitle')}</h2></div><p class="lead rv">${T('tech.pushLead')}</p></div>
      <div class="lanes">
        <div class="lane rv"><div class="lane__h"><b>${T('tech.pushBuffered')}</b><span class="mono" style="color:var(--hot)"><span id="laneA">180</span> ms</span></div><canvas id="laneCvA"></canvas></div>
        <div class="lane rv"><div class="lane__h"><b>${T('tech.pushKyber')}</b><span class="mono accent"><span id="laneB">8</span> ms</span></div><canvas id="laneCvB"></canvas></div>
      </div>
      <div class="pipe__nodes" style="margin-top:1rem">${[1, 2, 3, 4, 5].map(i => `<div class="pnode is-on"><b style="font-size:var(--t-sm)">${T('home.p' + i)}</b></div>`).join('')}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">03</span><h2 class="h1 split">${T('tech.clockTitle')}</h2></div><p class="lead rv">${T('tech.clockLead')}</p></div>
      <div class="clock rv"><svg viewBox="0 0 1000 300" id="clockSvg" aria-hidden="true"></svg></div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">04</span><h2 class="h1 split">${T('tech.connTitle')}</h2></div><p class="lead rv">${T('tech.connLead')}</p></div>
      <div class="arch" style="grid-template-columns:1fr 1fr">
        <div class="rv"><svg viewBox="0 0 400 140" fill="none">${Array.from({ length: 25 }, (_, i) => `<path d="M20 ${8 + i * 5} H380" stroke="var(--hot)" stroke-opacity=".5" stroke-dasharray="${2 + i % 4} ${3 + i % 3}"/>`).join('')}</svg><b>WebRTC / legacy</b><p>25 ports · STUN · TURN · ICE · SDP · ${T('tech.cmpMany')}</p></div>
        <div class="rv"><svg viewBox="0 0 400 140" fill="none"><path d="M20 70 H380" stroke="var(--accent)" stroke-width="3" style="filter:drop-shadow(0 0 8px var(--accent))"/><circle r="6" fill="var(--accent)"><animate attributeName="cx" values="20;380" dur="1.2s" repeatCount="indefinite"/><animate attributeName="cy" values="70;70" dur="1.2s" repeatCount="indefinite"/></circle><text x="20" y="110" font-family="Geist Mono" font-size="12" fill="var(--muted)">QUIC / HTTP3 · 1 port · E2E</text></svg><b>Kyber</b><p>${T('tech.sVideo')} · ${T('tech.sAudio')} · ${T('tech.sControl')} · ${T('tech.sTelemetry')}</p></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">05</span><h2 class="h1 split">${T('tech.prioTitle')}</h2></div><p class="lead rv">${T('tech.prioLead')}</p></div>
      <div class="prio">
        <div class="prio__box rv"><b>${T('tech.prioMedia')}</b><canvas id="prioA"></canvas><p>${T('tech.prioMediaList')}</p></div>
        <div class="prio__box rv"><b>${T('tech.prioCtrl')}</b><canvas id="prioB"></canvas><p>${T('tech.prioCtrlList')}</p></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">06</span><h2 class="h1 split">${T('tech.netTitle')}</h2></div><p class="lead rv">${T('tech.netLead')}</p></div>
      <div class="net">
        <div class="net__view rv"><canvas id="netCv"></canvas></div>
        <div class="net__panel rv">
          <div class="net__metric"><span>${T('tech.netQuality')}</span><b id="nQ">1080p</b></div>
          <div class="net__metric"><span>${T('tech.netLoss')}</span><b id="nL" style="color:var(--warn)">0%</b></div>
          <div class="net__metric"><span>${T('tech.netLatency')}</span><b class="accent" id="nC">8.2 ms</b></div>
          <label><span class="mono muted" style="font-size:var(--t-xs)">${T('tech.netSlider')}</span><input type="range" class="range" id="netR" min="0" max="100" value="100" style="margin-top:1rem"></label>
        </div>
      </div>
      <div class="tri">${[1, 2, 3].map(i => `<div class="rv"><b>${T('tech.n' + i + 't')}</b><p>${T('tech.n' + i + 'd')}</p></div>`).join('')}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">07</span><h2 class="h1 split">${T('tech.secTitle')}</h2></div></div>
      <div class="feat" style="margin-top:3rem">${[1, 2, 3].map(i => `<article class="fcard rv">${ICO[2]}<div><h3 class="h3">${T('tech.s' + i + 't')}</h3><p>${T('tech.s' + i + 'd')}</p></div></article>`).join('')}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">08</span><h2 class="h1 split">${T('tech.archTitle')}</h2></div></div>
      <div class="arch">
        ${archSvg(1)}${archSvg(2)}${archSvg(3)}
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">09</span><h2 class="h-display split">${T('tech.notTitleA')} <span class="serif">${T('tech.notTitleB')}</span></h2></div><p class="lead rv">${T('tech.notLead')}</p></div>
      <div class="tablewrap rv"><table class="cmp">
        <thead><tr><th></th><th>Kyber</th><th>WebRTC</th><th>Legacy remote desktop</th></tr></thead>
        <tbody>
          <tr><td>${T('tech.cmpLatency')}</td><td class="k">8–10 ms</td><td class="o">100–200 ms</td><td class="o">150–300 ms</td></tr>
          <tr><td>${T('tech.cmpClock')}</td><td class="k">✓</td><td class="o">—</td><td class="o">—</td></tr>
          <tr><td>${T('tech.cmpPorts')}</td><td class="k">${T('tech.cmpOne')}</td><td class="o">${T('tech.cmpMany')}</td><td class="o">${T('tech.cmpMany')}</td></tr>
          <tr><td>${T('tech.cmpPriority')}</td><td class="k">✓</td><td class="o">—</td><td class="o">—</td></tr>
          <tr><td>${T('tech.cmpIntegrate')}</td><td class="k">${T('tech.cmpWeeks')}</td><td class="o">${T('tech.cmpYears')}</td><td class="o">—</td></tr>
        </tbody></table></div>
    </div></section>
    ${ctaBlock()}`;
  }
  function archSvg(n) {
    const node = (x, y, c = 'var(--accent)') => `<rect x="${x - 14}" y="${y - 10}" width="28" height="20" rx="4" stroke="${c}" stroke-width="1.4" fill="var(--bg2)"/>`;
    let s = '';
    if (n === 1) s = `<path d="M60 60 H340" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 4" class="vz-flow"/>${node(60, 60)}${node(340, 60, 'var(--ink)')}`;
    if (n === 2) s = `${[20, 45, 70, 95].map(y => `<path d="M80 60 L320 ${y}" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="4 4" class="vz-flow"/>`).join('')}${node(80, 60, 'var(--ink)')}${[20, 45, 70, 95].map(y => node(320, y)).join('')}`;
    if (n === 3) s = `<path d="M40 60 H360" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 4" class="vz-flow"/>${node(40, 60)}${node(146, 60, 'var(--accent2)')}${node(253, 60, 'var(--accent2)')}${node(360, 60, 'var(--ink)')}`;
    return `<div class="rv"><svg viewBox="0 0 400 120" fill="none">${s}</svg><h3 class="h3">${T('tech.a' + n + 't')}</h3><p>${T('tech.a' + n + 'd')}</p></div>`;
  }

  function pageAbout() {
    const jobs = [['j1', '/job/senior-windows-systems-developer'], ['j2', '/job/3ddxr-developpper'], ['j3', '/job/network-systems-developer'], ['j4', '/job/sdr-developpper'], ['j5', '/job/forward-deployed-engineer']];
    return `
    <section class="phero"><div class="wrap">
      ${kicker('about.kicker')}
      ${headline('about.titleA', 'about.titleB')}
      <div class="phero__grid"><p class="lead rv">${T('about.lead')}</p></div>
      <div class="phero__media rv"><img src="${img('about')}" alt="Paris" data-parallax><div class="hudline"><span class="chip">48.8566° N, 2.3522° E</span><span class="chip">${T('about.hq')}</span></div></div>
    </div></section>
    <section class="sec"><div class="wrap story">
      <h2 class="h1 split">${T('about.storyTitle')}</h2>
      <div><p class="rv">${T('about.story1')}</p><p class="rv"><strong>${T('about.story2')}</strong></p></div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('home.vlcKicker')}<h2 class="h-display split">${T('about.teamTitle')}</h2></div><p class="lead rv">${T('about.teamLead')}</p></div>
      <div class="vlc__grid">
        <div class="rv"><div class="vlc__num"><span data-count="20">0</span><sup>yrs</sup></div><p>${T('home.vlcStat1')}</p></div>
        <div class="rv"><div class="vlc__num"><span data-count="1">0</span><sup>B+</sup></div><p>${T('home.vlcStat2')}</p></div>
        <div class="rv"><div class="vlc__num accent"><span data-count="8">0</span><sup>ms</sup></div><p>${T('home.vlcStat3')}</p></div>
      </div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <h2 class="h1 split">${T('about.valuesTitle')}</h2>
      <div class="vals">${[1, 2, 3, 4, 5].map(i => `<div class="val rv"><span class="mono">0${i}</span><h3>${T('about.v' + i + 't')}</h3><p>${T('about.v' + i + 'd')}</p></div>`).join('')}</div>
    </div></section>
    <section class="sec" id="careers" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('footer.careers')}<h2 class="h1 split">${T('about.careersTitle')}</h2></div><p class="lead rv">${T('about.careersLead')}</p></div>
      <div class="jobs">${jobs.map(([k, u]) => `<a class="job rv" href="${K}${u}" target="_blank" rel="noopener"><h3>${T('about.' + k)}</h3><span class="chip">${T('about.contract')}</span><span class="chip">${T('about.paris')}</span><span class="go">${ARRUR}</span></a>`).join('')}</div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">${T('about.hq')}</span><h2 class="h1 split">${T('about.officesTitle')}</h2></div><p class="lead rv">${T('about.officesLead')}</p></div>
      <div class="map rv">${worldSvg()}
        <div class="cities">
          <div><b>${T('about.paris')}</b><span class="mono" data-tz="Europe/Paris">--:--</span><small>${T('about.hq')}</small></div>
          <div><b>${T('about.sf')}</b><span class="mono" data-tz="America/Los_Angeles">--:--</span><small>UTC−8/−7</small></div>
          <div><b>${T('about.sg')}</b><span class="mono" data-tz="Asia/Singapore">--:--</span><small>UTC+8</small></div>
        </div>
      </div>
    </div></section>
    ${ctaBlock()}`;
  }
  function worldSvg() {
    const P = (lon, lat) => [(lon + 180) / 360 * 1000, (90 - lat) / 180 * 500];
    const [px, py] = P(2.35, 48.85), [sx, sy] = P(-122.4, 37.77), [gx, gy] = P(103.8, 1.35);
    let grid = '';
    for (let x = 0; x <= 1000; x += 20) for (let y = 40; y <= 460; y += 20) grid += `<circle cx="${x}" cy="${y}" r="1" />`;
    const arc = (a, b, c, d, h) => `M${a} ${b} Q ${(a + c) / 2} ${Math.min(b, d) - h} ${c} ${d}`;
    return `<svg viewBox="0 0 1000 500" aria-hidden="true" style="direction:ltr">
      <g fill="var(--line2)">${grid}</g>
      <g fill="none" stroke="var(--accent)" stroke-width="1.5">
        <path id="arc1" d="${arc(px, py, sx, sy, 120)}" class="vz-flow" stroke-dasharray="5 6"/>
        <path id="arc2" d="${arc(px, py, gx, gy, 140)}" class="vz-flow" stroke-dasharray="5 6"/>
      </g>
      ${[[px, py, 'Paris'], [sx, sy, 'SF'], [gx, gy, 'SG']].map(([x, y, n]) => `<g><circle cx="${x}" cy="${y}" r="16" fill="var(--accent)" opacity=".15"><animate attributeName="r" values="6;22;6" dur="2.4s" repeatCount="indefinite"/></circle><circle cx="${x}" cy="${y}" r="5" fill="var(--accent)"/><text x="${x + 12}" y="${y - 10}" font-family="Geist Mono" font-size="13" fill="var(--ink)">${n}</text></g>`).join('')}
      <circle r="4" fill="var(--ink)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#arc1"/></animateMotion></circle>
      <circle r="4" fill="var(--ink)"><animateMotion dur="3.6s" repeatCount="indefinite"><mpath href="#arc2"/></animateMotion></circle>
    </svg>`;
  }

  function pageSdk() {
    const plats = ['Windows', 'Linux', 'macOS', 'Android', 'iOS', 'Meta Quest', 'Apple Vision Pro', 'Web', 'ROS'];
    return `
    <section class="phero"><div class="wrap">
      <div class="phero__grid" style="align-items:center">
        <div>${kicker('sdk.kicker')}${headline('sdk.titleA', 'sdk.titleB')}<p class="lead rv">${T('sdk.lead')}</p>
          <div class="btns rv" style="margin-top:2rem"><a class="btn btn--accent magnetic" href="${K}/get-the-sdk/" target="_blank" rel="noopener">${T('sdk.download')} ${ARRUR}</a> ${btnDocs()}</div></div>
        <div class="term rv"><div class="term__bar"><i></i><i></i><i></i><span>~/kyber — zsh</span><button id="copyBtn">${T('sdk.copy')}</button></div><pre id="termPre"></pre></div>
      </div>
    </div></section>
    <section class="sec" style="padding-top:2rem"><div class="wrap">
      <div class="kits">${[1, 2, 3].map(i => `<div class="kit rv">${ICO[[3, 5, 0][i - 1]]}<h3>${T('sdk.k' + i + 't')}</h3><p>${T('sdk.k' + i + 'd')}</p></div>`).join('')}</div>
      <div style="margin-top:4rem">${kicker('sdk.platforms')}<div class="plats">${plats.map(p => `<span class="chip rv">${p}</span>`).join('')}</div></div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <h2 class="h1 split">${T('sdk.licTitle')}</h2>
      <div class="lic">
        <div class="rv"><span class="kicker">${T('sdk.licOpen')}</span><div class="price">${T('sdk.free')}</div><p>${T('sdk.licOpenD')}</p><div class="btns"><a class="btn btn--ghost" href="https://gitlab.com/kyber/kyber#where-to-start" target="_blank" rel="noopener">GitLab ${ARRUR}</a></div></div>
        <div class="rv hl"><span class="kicker">${T('sdk.licCom')}</span><div class="price">${T('sdk.custom')}</div><p>${T('sdk.licComD')}</p><div class="btns">${btnSales('btn--solid')}</div></div>
      </div>
    </div></section>
    ${faqBlock()}${ctaBlock()}`;
  }

  function pageBlog() {
    const cover = (p) => p.i ? `<img src="${img(p.i)}" alt="" loading="lazy">` : `<div style="position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(circle at 30% 20%,color-mix(in oklab,var(--accent) 22%,transparent),transparent 60%),repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px 28px),var(--bg2)"><span class="mono" style="font-size:clamp(2.6rem,6vw,4.6rem);letter-spacing:-.04em;color:var(--ink)">v${p.v}</span></div>`;
    return `
    <section class="phero"><div class="wrap">
      ${kicker('blog.kicker')}<h1 class="phero__title split">${T('blog.title')}</h1>
      <div class="filters" role="group">
        <button aria-pressed="true" data-f="*">${T('blog.all')}</button><button aria-pressed="false" data-f="r">${T('blog.releases')}</button><button aria-pressed="false" data-f="a">${T('blog.announcements')}</button>
      </div>
      <div class="posts" id="posts">${POSTS.map((p, i) => `<a class="post rv${i === 0 ? ' post--feat' : ''}" data-c="${p.c}" href="${K}${p.u}" target="_blank" rel="noopener"><div class="post__img">${cover(p)}</div><div class="post__b"><div class="post__m"><span>${T(p.c === 'r' ? 'blog.releases' : 'blog.announcements')}</span><span>${fmtDate(p.d)}</span></div><h3>${T('blog.' + p.k)}</h3><div class="post__m"><span>${p.m} ${T('common.minRead')}</span><span>${T('common.readArticle')} ${ARRUR}</span></div></div></a>`).join('')}</div>
    </div></section>
    ${ctaBlock()}`;
  }

  function pageContact() {
    const fld = (id, k, type = 'text', req = true, full = false) => `<div class="fld${full ? ' full' : ''}"><input id="${id}" name="${id}" type="${type}" placeholder=" " ${req ? 'required' : ''} autocomplete="${{ fn: 'given-name', ln: 'family-name', em: 'email', ph: 'tel' }[id] || 'off'}"><label for="${id}">${T(k)}${req ? ' *' : ''}</label><span class="em">${T(type === 'email' ? 'contact.invalidEmail' : 'contact.required')}</span></div>`;
    return `
    <section class="phero"><div class="wrap ctc">
      <div>${kicker('contact.kicker')}<h1 class="phero__title split" style="font-size:clamp(2.6rem,1rem + 5vw,6.4rem)">${T('contact.title')}</h1><p class="lead rv">${T('contact.lead')}</p>
        <div class="tick-row rv"><span>${T('footer.cities')}</span></div>
        <div class="tick-row rv"><a class="accent" href="https://www.linkedin.com/company/kyber-tech/" target="_blank" rel="noopener">LinkedIn ↗</a><a class="accent" href="https://gitlab.com/kyber/kyber" target="_blank" rel="noopener">GitLab ↗</a><a class="accent" href="https://www.reddit.com/r/kyber/" target="_blank" rel="noopener">r/kyber ↗</a></div>
      </div>
      <form class="form rv" id="form" novalidate>
        ${fld('fn', 'contact.first')}${fld('ln', 'contact.last')}${fld('em', 'contact.email', 'email')}${fld('ph', 'contact.phone', 'tel', false)}
        <div class="fld full"><select id="sj" name="sj"><option value="">${T('contact.subjectPh')}</option><option>${T('contact.s1')}</option><option>${T('contact.s2')}</option><option>${T('contact.s3')}</option></select><label for="sj">${T('contact.subject')}</label><svg class="chev" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" fill="none" stroke-width="1.5"/></svg></div>
        <div class="fld full"><textarea id="ms" name="ms" placeholder=" " required></textarea><label for="ms">${T('contact.message')} *</label><span class="em">${T('contact.required')}</span></div>
        <div class="row"><span class="note">${T('contact.demoNote')}</span><button class="btn btn--accent magnetic" type="submit">${T('contact.submit')} ${ARR}</button></div>
        <div class="ok" role="status"><span class="kicker">✓ 8 ms</span><p style="margin-top:1rem">${T('contact.thanks')}</p></div>
      </form>
    </div></section>`;
  }

  /* ---------------- chrome (nav panels, footer) ---------------- */
  function renderChrome() {
    $('#ddPanel').innerHTML = `<div class="dd__intro"><span class="kicker">${T('nav.solutions')}</span><p>${T('nav.solutionsLead')}</p><a class="btn btn--solid btn--sm" href="#/technology">${T('nav.technology')} ${ARR}</a></div>
      <div class="dd__grid">${SOL.map(s => `<a class="dd__item" href="#/solutions/${s}"><img src="${img(s)}" alt=""><span><b>${T(`solutions.${s}.name`)}</b><small>${T(`solutions.${s}.short`)}</small></span></a>`).join('')}</div>`;
    $('#langList').innerHTML = LANGS.map(([c, n]) => `<li><button role="option" data-l="${c}" aria-selected="${c === LANG}" lang="${c}"><span>${n}</span><span class="mono">${c.toUpperCase()}</span></button></li>`).join('');
    $('#mnav').innerHTML = `
      <div><a class="big" href="#/">Kyber</a><a class="big" href="#/technology">${T('nav.technology')}</a><a class="big" href="#/sdk">${T('nav.sdk')}</a><a class="big" href="#/about">${T('nav.about')}</a><a class="big" href="#/blog">${T('nav.blog')}</a><a class="big" href="#/contact">${T('nav.contact')}</a></div>
      <div><div class="kicker">${T('nav.solutions')}</div><div class="sub">${SOL.map(s => `<a href="#/solutions/${s}">${T(`solutions.${s}.name`)}</a>`).join('')}</div></div>
      <div class="btns">${btnSdk('btn--accent')}</div>`;
    $('#ftr').innerHTML = `
      <div class="ftr__top">
        <div class="ftr__brand"><svg viewBox="0 0 18.1 18.7" width="34" fill="currentColor" aria-hidden="true"><path d="M12.79 18.605h5.233v-4.652l-5.232-4.65-5.233 4.65zM2.326 9.302l5.232-4.65V0H0v18.605h7.558V9.302zM18.023.0h-5.232L7.558 4.651v4.651h5.233l5.232-4.65z"/></svg><p>${T('footer.tagline')}</p></div>
        <div><h4>${T('footer.product')}</h4><ul><li><a href="#/technology">${T('nav.technology')}</a></li><li><a href="#/sdk">${T('common.getSdk')}</a></li><li><a href="${K}/get-the-sdk/" target="_blank" rel="noopener">${T('footer.getApp')}</a></li><li><a href="${K}/Documentation/" target="_blank" rel="noopener">${T('footer.docs')}</a></li></ul></div>
        <div><h4>${T('nav.solutions')}</h4><ul>${SOL.map(s => `<li><a href="#/solutions/${s}">${T(`solutions.${s}.name`)}</a></li>`).join('')}</ul></div>
        <div><h4>${T('footer.company')}</h4><ul><li><a href="#/about">${T('nav.about')}</a></li><li><a href="#/about" data-anchor="careers">${T('footer.careers')}</a></li><li><a href="#/blog">${T('nav.blog')}</a></li><li><a href="#/contact">${T('nav.contact')}</a></li><li><a href="https://www.linkedin.com/company/kyber-tech/" target="_blank" rel="noopener">LinkedIn ↗</a></li></ul></div>
      </div>
      <div class="ftr__mark" aria-hidden="true"><svg viewBox="0 0 93 24" fill="currentColor">${$('.hdr__logo svg').innerHTML}</svg></div>
      <div class="ftr__bot"><span>Kyber ©2026 · ${T('footer.rights')} · ${T('footer.cities')}</span><span>${T('footer.proposal')}</span></div>`;
  }

  /* ---------------- motion per page ---------------- */
  let cleanups = [];
  const on = (fn) => cleanups.push(fn);
  const seg = (() => { try { return new Intl.Segmenter(undefined, { granularity: 'word' }); } catch (e) { return null; } })();
  function segments(text) {
    if (seg) { const s = new Intl.Segmenter(LANG, { granularity: 'word' }); return [...s.segment(text)].map(x => x.segment); }
    return text.split(/(\s+)/);
  }
  function splitWords(el) {
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          segments(n.textContent).forEach(w => {
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            const o = document.createElement('span'); o.className = 'w'; const i = document.createElement('span'); i.textContent = w; o.appendChild(i); frag.appendChild(o);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
      });
    };
    walk(el);
    return $$('.w>span', el);
  }

  function animate(main) {
    const G = window.gsap, ST = window.ScrollTrigger;
    // split headlines
    $$('.split', main).forEach((el, n) => {
      const words = splitWords(el);
      if (!G || RM) return;
      const inHero = el.closest('.hero,.phero');
      G.set(words, { yPercent: 110 });
      const tl = { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .045, delay: inHero ? .15 : 0 };
      if (inHero) G.to(words, tl); else G.to(words, { ...tl, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    // reveals
    if (G && !RM) {
      $$('.rv', main).forEach(el => G.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' }, delay: el.closest('.hero,.phero') ? .5 : 0 }));
      $$('[data-parallax]', main).forEach(el => G.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
      $$('.bigline', main).forEach(el => {
        const rtl = document.documentElement.dir === 'rtl';
        G.fromTo(el, { xPercent: rtl ? -5 : 5 }, { xPercent: rtl ? 30 : -30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    } else $$('.rv', main).forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });

    // counters
    $$('[data-count]', main).forEach(el => {
      const go = () => FX.count(el, +el.dataset.count, 1.8);
      if (ST && !RM) ST.create({ trigger: el, start: 'top 90%', once: true, onEnter: go }); else go();
    });
    FX.magnetic(main); FX.spotlight(main);

    // hero
    const gl = $('#heroGl', main); if (gl) on(FX.hero(gl));
    const hudMs = $('#hudMs', main);
    if (hudMs) {
      let cur = 8.2;
      const id = setInterval(() => {
        cur = 7.6 + Math.random() * 1.9; hudMs.textContent = num(cur, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        const s = $('#stageMs', main); if (s) s.textContent = cur.toFixed(1);
      }, 420); on(() => clearInterval(id));
      on(FX.spark($('#spark', main), () => cur));
      const clk = $('#hudClock', main);
      const t0 = performance.now();
      let raf; const tick = () => { const ms = performance.now() - t0; const d = new Date(ms); clk.textContent = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}.${String(d.getUTCMilliseconds()).padStart(3, '0')}`; raf = requestAnimationFrame(tick); }; tick(); on(() => cancelAnimationFrame(raf));
    }
    // mini fields in CTA cards
    $$('[data-fx="mini-field"]', main).forEach(cv => on(FX.hero(cv)));

    // manifesto
    const mani = $('#mani', main);
    if (mani) {
      const parts = segments(mani.textContent); mani.textContent = '';
      let prev = '';
      parts.forEach(p => {
        if (/^\s+$/.test(p)) { mani.appendChild(document.createTextNode(p)); return; }
        const s = document.createElement('span'); s.className = 'mw'; s.textContent = p;
        if (/200/.test(p) || (prev === 'hot' && /ms/i.test(p))) { s.classList.add('hot'); prev = 'hot'; }
        else if (/^[8８]$|^8\s?ms$/.test(p) || (prev === 'cool' && /ms/i.test(p))) { s.classList.add('cool'); prev = 'cool'; }
        else prev = /^\d+$/.test(p) ? prev : '';
        mani.appendChild(s);
      });
      const ws = $$('.mw', mani);
      if (G && !RM) G.to(ws, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: mani, start: 'top 75%', end: 'bottom 45%', scrub: true } });
      else ws.forEach(w => w.style.opacity = 1);
    }

    // playground
    const field = $('#field', main);
    if (field) {
      const err = $('#playErr', main);
      const pg = FX.playground(field, (e) => err.textContent = Math.round(e));
      on(pg.stop);
      $$('.lat button', main).forEach(b => b.addEventListener('click', () => {
        $$('.lat button', main).forEach(x => x.setAttribute('aria-pressed', x === b));
        pg.set(+b.dataset.lat, FX.color(b.dataset.c));
      }));
    }

    // solution showcase
    const items = $$('.show__item', main), figs = $$('.show__stage figure', main);
    if (items.length) {
      const setOn = (i) => { items.forEach((x, k) => x.classList.toggle('is-on', k === i)); figs.forEach((x, k) => x.classList.toggle('is-on', k === i)); };
      items.forEach((it, i) => { it.addEventListener('pointerenter', () => setOn(i)); it.addEventListener('focus', () => setOn(i)); if (ST && innerWidth > 900) ST.create({ trigger: it, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setOn(i) }); });
    }

    // pipeline
    const pipe = $('#pipe', main);
    if (pipe) {
      const line = $('#pipeLine', main), L = line.getTotalLength(); line.style.strokeDasharray = L; line.style.strokeDashoffset = L;
      const nodes = $$('.pnode', pipe), total = $('#pipeTotal', main); const cum = [1.2, 3.1, 5.9, 7.4, 8.2];
      const g = $('#pipePk', main); const pk = Array.from({ length: 7 }, () => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', 4); c.setAttribute('fill', 'var(--ink)'); g.appendChild(c); return c; });
      const base = $('#pipeBase', main);
      let prog = 0;
      const upd = (p) => {
        prog = p; line.style.strokeDashoffset = L * (1 - p);
        nodes.forEach((n, i) => n.classList.toggle('is-on', p >= i / 5 + .05));
        const v = Math.min(1, p * 1.08) * 8.2;
        total.textContent = num(v, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      };
      if (ST && G && !RM) {
        const pin = innerWidth > 760;
        ST.create({ trigger: pipe, start: pin ? 'top top' : 'top 70%', end: pin ? '+=140%' : 'bottom 60%', pin: pin ? $('.pipe__pin', pipe) : false, scrub: .6, onUpdate: (s) => upd(s.progress) });
      } else upd(1);
      const BL = base.getTotalLength();
      on(FX.loop(pipe, (now) => { pk.forEach((c, i) => { const f = ((now / 1600) + i / pk.length) % 1; const pt = base.getPointAtLength(f * BL); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('opacity', f < prog ? 1 : .25); }); }));
    }

    // tech page
    const thr = $('#thr', main);
    if (thr) $$('.bar i', thr).forEach(b => { const go = () => G ? G.to(b, { width: b.dataset.w + '%', duration: 1.6, ease: 'expo.out' }) : (b.style.width = b.dataset.w + '%'); ST && !RM ? ST.create({ trigger: thr, start: 'top 80%', once: true, onEnter: go }) : go(); });
    if ($('#laneCvA', main)) {
      const a = $('#laneA', main), b = $('#laneB', main);
      on(FX.lane($('#laneCvA', main), true, (m) => a.textContent = Math.round(m)));
      on(FX.lane($('#laneCvB', main), false, (m) => b.textContent = m.toFixed(1)));
      on(FX.priority($('#prioA', main), 'media')); on(FX.priority($('#prioB', main), 'ctrl'));
      const r = $('#netR', main); const q = () => r.value / 100;
      on(FX.network($('#netCv', main), q));
      const nq = $('#nQ', main), nl = $('#nL', main), nc = $('#nC', main);
      const upd = () => { const v = q(); const res = [144, 240, 360, 480, 720, 1080][Math.min(5, Math.floor(v * 5.99))]; nq.textContent = res + 'p'; nl.textContent = Math.round((1 - v) * 30) + '%'; };
      r.addEventListener('input', upd); upd();
      const id = setInterval(() => nc.textContent = (8 + Math.random() * 1.2).toFixed(1) + ' ms', 500); on(() => clearInterval(id));
      buildClock($('#clockSvg', main));
    }

    // about clocks
    const tz = $$('[data-tz]', main);
    if (tz.length) { const f = () => tz.forEach(e => { try { e.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: e.dataset.tz }).format(new Date()); } catch (x) { } }); f(); const id = setInterval(f, 1000); on(() => clearInterval(id)); }

    // sdk terminal
    const pre = $('#termPre', main);
    if (pre) {
      const lines = [
        ['c', '# Open source core · AGPL v3'],
        ['p', '$ ', 'git clone https://gitlab.com/kyber/kyber.git'],
        ['p', '$ ', 'cd kyber'],
        ['c', '# Follow the “where to start” guide'],
        ['p', '$ ', 'open https://gitlab.com/kyber/kyber#where-to-start'],
        ['', ''],
        ['c', '# demo session readout'],
        ['k', '▸ kyber  ', 'transport   quic/h3 · 1 port · e2e'],
        ['k', '▸ kyber  ', 'streams     video · audio · control · telemetry'],
        ['k', '▸ kyber  ', 'clock       unified  drift 0.00 ms'],
        ['s', '▸ kyber  ', 'latency     8.4 ms end-to-end ✓']
      ];
      const html = (l) => l[0] === 'c' ? `<span class="c">${esc(l[1])}</span>` : l[0] === 'p' ? `<span class="p">${l[1]}</span>${esc(l[2])}` : l[0] ? `<span class="${l[0]}">${l[1]}</span>${esc(l[2])}` : '';
      if (RM) pre.innerHTML = lines.map(html).join('\n');
      else {
        let i = 0, c = 0, out = []; let tmr;
        const step = () => {
          if (i >= lines.length) { pre.innerHTML = out.join('\n') + '\n<span class="caret"></span>'; return; }
          const l = lines[i]; const full = (l[1] || '') + (l[2] || '');
          c += 3; const part = full.slice(0, c);
          const fake = l[0] === 'p' || l[0] === 'k' || l[0] === 's' ? [l[0], part.slice(0, l[1].length), part.slice(l[1].length)] : [l[0], part];
          pre.innerHTML = [...out, html(fake)].join('\n') + '<span class="caret"></span>';
          if (c >= full.length) { out.push(html(l)); i++; c = 0; tmr = setTimeout(step, l[0] === 'k' || l[0] === 's' ? 120 : 260); } else tmr = setTimeout(step, 18);
        };
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { step(); io.disconnect(); } }); io.observe(pre);
        on(() => { clearTimeout(tmr); io.disconnect(); });
      }
      $('#copyBtn', main).addEventListener('click', (e) => { navigator.clipboard?.writeText('git clone https://gitlab.com/kyber/kyber.git'); e.target.textContent = t('sdk.copied'); setTimeout(() => e.target.textContent = t('sdk.copy'), 1600); });
    }

    // blog filters
    const fl = $$('.filters button', main);
    fl.forEach(b => b.addEventListener('click', () => {
      fl.forEach(x => x.setAttribute('aria-pressed', x === b));
      $$('#posts .post', main).forEach(p => { const show = b.dataset.f === '*' || p.dataset.c === b.dataset.f; p.style.display = show ? '' : 'none'; if (show && G) G.fromTo(p, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' }); });
      $('#posts .post', main).classList.toggle('post--feat', b.dataset.f !== 'r');
      ST && ST.refresh();
    }));

    // contact
    const form = $('#form', main);
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault(); let ok = true;
      $$('input[required],textarea[required]', form).forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)); i.closest('.fld').classList.toggle('err', bad); if (bad) ok = false; });
      if (ok) { form.classList.add('sent'); }
      else $('.fld.err input,.fld.err textarea', form)?.focus();
    });
  }

  function buildClock(svg) {
    const rows = [['tech.sVideo', 0], ['tech.sAudio', 1], ['tech.sControl', 2], ['tech.sTelemetry', 3]];
    const W = 1000, rowH = 62, x0 = 150;
    const path = (r, off) => { let d = ''; for (let x = x0; x <= W - 20; x += 6) { const y = 40 + r * rowH + Math.sin((x + off) / (22 + r * 6)) * 12 * (r === 2 ? .5 : 1) + (r === 3 ? Math.sin((x + off) / 7) * 3 : 0); d += (x === x0 ? 'M' : 'L') + x + ' ' + y.toFixed(1); } return d; };
    const offs = [0, 60, -45, 90];
    svg.innerHTML = `
      ${rows.map(([k, r]) => `<text x="0" y="${44 + r * rowH}">${esc(t(k))}</text><path data-r="${r}" fill="none" stroke="var(--accent)" stroke-width="1.6" opacity="${1 - r * .15}"/>`).join('')}
      ${Array.from({ length: 15 }, (_, i) => `<line x1="${x0 + i * 60}" y1="16" x2="${x0 + i * 60}" y2="270" stroke="var(--line)"/>`).join('')}
      <line id="clkNow" x1="600" y1="10" x2="600" y2="276" stroke="var(--ink)" stroke-dasharray="3 4"/>
      <text id="clkLbl" x="608" y="292" style="fill:var(--accent)">Δ drift 42.0 ms</text>`;
    const ps = $$('path[data-r]', svg), lbl = $('#clkLbl', svg);
    const st = { k: 1 };
    const draw = () => { ps.forEach((p, i) => p.setAttribute('d', path(i, offs[i] * st.k))); lbl.textContent = `Δ drift ${(42 * st.k).toFixed(1)} ms`; };
    draw();
    if (window.gsap && window.ScrollTrigger && !RM) gsap.to(st, { k: 0, ease: 'none', onUpdate: draw, scrollTrigger: { trigger: svg, start: 'top 80%', end: 'center 40%', scrub: true } });
    else { st.k = 0; draw(); }
  }

  /* ---------------- router ---------------- */
  let first = true, lastPath = null;
  function parse() { const h = location.hash.replace(/^#\/?/, ''); return h.split('?')[0]; }
  async function route(force) {
    const path = parse();
    if (path === 'play' || path === 'main' || path === 'careers') return; // in-page anchors
    if (!force && path === lastPath) return;
    const doWipe = !first && !RM && window.gsap;
    const wipe = $('#wipe');
    if (doWipe) await gsap.fromTo(wipe, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .45, ease: 'expo.in' });
    cleanups.forEach(f => { try { f && f(); } catch (e) { } }); cleanups = [];
    window.ScrollTrigger && ScrollTrigger.getAll().forEach(s => s.kill());
    const main = $('#main');
    let html, active = path.split('/')[0];
    if (path.startsWith('solutions/') && SOL.includes(path.split('/')[1])) html = pageSolution(path.split('/')[1]);
    else if (path === 'technology') html = pageTech();
    else if (path === 'about') html = pageAbout();
    else if (path === 'sdk') html = pageSdk();
    else if (path === 'blog') html = pageBlog();
    else if (path === 'contact') html = pageContact();
    else { html = pageHome(); active = ''; }
    main.innerHTML = html;
    $$('.hdr__nav>a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#/' + active && active));
    $('.dd').classList.toggle('is-active', active === 'solutions');
    closeMenus();
    const anchor = sessionStorage.getItem('kyber-anchor'); sessionStorage.removeItem('kyber-anchor');
    if (!force || lastPath !== path) { lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0); }
    lastPath = path;
    animate(main);
    window.ScrollTrigger && ScrollTrigger.refresh();
    const rf = () => window.ScrollTrigger && ScrollTrigger.refresh();
    document.fonts && document.fonts.ready.then(rf);
    $$('img', main).forEach(im => !im.complete && im.addEventListener('load', rf, { once: true }));
    setTimeout(rf, 1200);
    if (anchor) setTimeout(() => { const el = document.getElementById(anchor); el && (lenis ? lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView()); }, 300);
    if (doWipe) gsap.fromTo(wipe, { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', duration: .6, ease: 'expo.out', delay: .05 });
    first = false;
  }

  /* ---------------- UI ---------------- */
  function closeMenus() {
    $('.dd').classList.remove('open'); $('.dd__btn').setAttribute('aria-expanded', false);
    $('.lang').classList.remove('open'); $('.lang__btn').setAttribute('aria-expanded', false);
    $('#mnav').classList.remove('open'); $('#mnav').setAttribute('aria-hidden', true); $('#burger').setAttribute('aria-expanded', false);
    document.body.style.overflow = ''; lenis && lenis.start();
  }
  let lenis = null;
  function ui() {
    const dd = $('.dd'), ddb = $('.dd__btn');
    let ddT;
    dd.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { clearTimeout(ddT); dd.classList.add('open'); ddb.setAttribute('aria-expanded', true); } });
    dd.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') ddT = setTimeout(() => { dd.classList.remove('open'); ddb.setAttribute('aria-expanded', false); }, 180); });
    ddb.addEventListener('click', () => { const o = !dd.classList.contains('open'); dd.classList.toggle('open', o); ddb.setAttribute('aria-expanded', o); });
    const lg = $('.lang'), lgb = $('.lang__btn');
    lgb.addEventListener('click', (e) => { e.stopPropagation(); const o = !lg.classList.contains('open'); lg.classList.toggle('open', o); lgb.setAttribute('aria-expanded', o); });
    $('#langList').addEventListener('click', (e) => { const b = e.target.closest('button[data-l]'); if (!b) return; closeMenus(); const u = new URL(location); u.searchParams.delete('lang'); history.replaceState(null, '', u); setLang(b.dataset.l); });
    document.addEventListener('click', (e) => { if (!e.target.closest('.lang')) { lg.classList.remove('open'); lgb.setAttribute('aria-expanded', false); } if (!e.target.closest('.dd')) dd.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenus(); });
    $('#burger').addEventListener('click', () => {
      const m = $('#mnav'); const o = !m.classList.contains('open');
      m.classList.toggle('open', o); m.setAttribute('aria-hidden', !o); $('#burger').setAttribute('aria-expanded', o);
      document.body.style.overflow = o ? 'hidden' : ''; lenis && (o ? lenis.stop() : lenis.start());
    });
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const href = a.getAttribute('href');
      if (a.dataset.anchor) sessionStorage.setItem('kyber-anchor', a.dataset.anchor);
      if (href === '#play' || href === '#main') { e.preventDefault(); const el = document.querySelector(href); lenis ? lenis.scrollTo(el, { offset: -60 }) : el.scrollIntoView({ behavior: 'smooth' }); }
      else if (href === location.hash || (href === '#/' && !parse())) { e.preventDefault(); if (a.dataset.anchor) route(true); else lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }); closeMenus(); }
    });
    // theme
    $('#themeBtn').addEventListener('click', (e) => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      const apply = () => { document.documentElement.dataset.theme = next; localStorage.setItem('kyber-theme', next); $('meta[name="theme-color"]').content = next === 'dark' ? '#040706' : '#eef3f1'; };
      if (document.startViewTransition && !RM) {
        const r = e.currentTarget.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2;
        const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        const vt = document.startViewTransition(apply);
        vt.ready.then(() => document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] }, { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }));
      } else apply();
    });
    // header behaviour + progress
    let lastY = 0; const hdr = $('#hdr'), prog = $('#progress');
    const onScroll = (y) => {
      hdr.classList.toggle('is-scrolled', y > 30);
      hdr.classList.toggle('is-hidden', y > 400 && y > lastY + 2 && !$('#mnav').classList.contains('open'));
      if (y < lastY - 2) hdr.classList.remove('is-hidden');
      lastY = y;
      const h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    };
    // smooth scroll
    if (window.Lenis && !RM) {
      lenis = new Lenis({ lerp: .11, smoothWheel: true });
      lenis.on('scroll', (e) => { window.ScrollTrigger && ScrollTrigger.update(); onScroll(e.scroll); });
      if (window.gsap) { gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
      else { const r = (t) => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
    } else addEventListener('scroll', () => onScroll(scrollY), { passive: true });
    // header ping
    const ping = $('#ping'); setInterval(() => ping.textContent = (7.6 + Math.random() * 1.8).toFixed(1), 700);
    FX.cursor();
    FX.magnetic(document.querySelector('.hdr'));
    addEventListener('hashchange', () => route());
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const loaderNum = $('#loaderNum'), bar = $('#loaderBar');
    const q = new URLSearchParams(location.search).get('lang');
    const want = q || localStorage.getItem('kyber-lang') || 'en';
    const loadP = (async () => { EN = await load('en'); await setLang(want, false); })();
    ui();
    // loader: count latency down 200 → 8
    await new Promise(res => {
      if (RM || !window.gsap) return res();
      const o = { v: 200 }; gsap.to(o, { v: 8, duration: 1.3, ease: 'expo.inOut', onUpdate: () => { loaderNum.textContent = Math.round(o.v); bar.style.width = (100 - (o.v - 8) / 192 * 100) + '%'; }, onComplete: res });
    });
    await loadP;
    route(true);
    $('#loader').classList.add('done');
  }
  boot();
})();
