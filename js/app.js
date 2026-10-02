/* Kyber redesign — app: i18n, router, pages, motion */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let RM = FX.RM;
  const K = 'https://kyber.tech';
  const DOCS = 'https://kyber-27201e.gitlab.io/';
  const GL = 'https://gitlab.com/kyber/kyber';
  const CLONE = 'git clone https://gitlab.com/kyber/kyber.git';
  const REPO = { stars: 83, forks: 35, last: '2026-06-24T19:28:39Z', live: false };
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
    const r = await fetch(`i18n/${l}.json?v=1790917086`); if (!r.ok) throw new Error('lang'); return (cache[l] = await r.json());
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
    try { const u = new URL(location.href); if (l === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch (e) { }
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
  const btnSales = (cls = 'btn--ghost') => `<a class="btn ${cls} magnetic" href="#/connect">${T('common.talkSales')} ${ARR}</a>`;
  const STAR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color:var(--warn)"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  const btnStar = (cls = 'btn--ghost') => `<a class="btn ${cls} magnetic" href="${GL}" target="_blank" rel="noopener">${STAR} ${T('common.star')} <span class="mono js-stars" style="opacity:.7">${REPO.stars}</span></a>`;
  const relTime = (iso) => { try { const d = (Date.parse(iso) - Date.now()) / 864e5; const rtf = new Intl.RelativeTimeFormat(LANG, { numeric: 'auto' }); const a = Math.abs(d); return a < 1 ? rtf.format(Math.round(d * 24), 'hour') : a < 31 ? rtf.format(Math.round(d), 'day') : rtf.format(Math.round(d / 30), 'month'); } catch (e) { return iso.slice(0, 10); } };
  const btnDocs = (cls = 'btn--ghost') => `<a class="btn ${cls}" href="${DOCS}" target="_blank" rel="noopener">${T('common.viewDocs')} ${ARRUR}</a>`;

  const ctaBlock = () => `
  <section class="sec" style="padding-bottom:0">
    <div class="wrap">
      <div class="cta">
        <div class="ccard ccard--accent rv" data-tilt>
          <div style="display:flex;justify-content:space-between;gap:1rem;align-items:center">${kicker('cta.devKicker')}<span class="stars">${STAR}<span class="js-stars">${REPO.stars}</span> · AGPL v3</span></div>
          <div><h3>${T('cta.devTitle')}</h3>
            <div class="clone"><code class="mono">${CLONE}</code><button data-copy="${CLONE}">${T('common.copy')}</button></div></div>
          <div class="btns">${btnSdk()} ${btnStar()} ${btnDocs()}</div>
        </div>
        <div class="ccard rv" data-tilt>
          <canvas class="bgfx" data-fx="mini-field"></canvas>
          <div>${kicker('cta.entKicker')}</div>
          <h3>${T('cta.entTitle')}</h3>
          <div class="btns"><a class="btn btn--solid magnetic" href="#/connect">${T('nav.connect')} ${ARR}</a></div>
        </div>
      </div>
    </div>
    <div class="bigwrap"><div class="bigline" data-fx="bigline">${T('cta.bigLine')} <span class="serif">8 ms</span> ${T('cta.bigLine')} <span class="serif">8 ms</span></div></div>
  </section>`;

  const ossBlock = () => `
  <section class="sec" id="oss" style="padding-top:0"><div class="wrap oss">
    <div>
      ${kicker('home.ossKicker')}
      <h2 class="h-display split" style="margin-top:1rem">${T('home.ossTitle')}</h2>
      <p class="lead rv" style="margin-top:1.4rem">${T('home.ossLead')}</p>
      <ol class="oss__steps rv">
        <li><span class="n">01</span><b>${T('home.ossStep1')}</b><a href="${GL}" target="_blank" rel="noopener">GitLab ${ARRUR}</a></li>
        <li><span class="n">02</span><b>${T('home.ossStep2')}</b><a href="${DOCS}" target="_blank" rel="noopener">${T('ui.docs')} ${ARRUR}</a></li>
        <li><span class="n">03</span><b>${T('home.ossStep3')}</b><a href="#/sdk">SDK ${ARR}</a></li>
      </ol>
      <div class="btns">${btnSdk('btn--accent')} ${btnStar()}</div>
    </div>
    <div class="rv">
      <div class="term" data-tilt>
        <div class="term__bar"><i></i><i></i><i></i>
          <div class="term__tabs" role="tablist"><button role="tab" aria-selected="true" data-tab="0">clone</button><button role="tab" aria-selected="false" data-tab="1">docs</button><button role="tab" aria-selected="false" data-tab="2">session</button></div>
          <span>~/kyber</span><button data-copy="${CLONE}">${T('common.copy')}</button></div>
        <pre class="js-term"></pre>
      </div>
      <div class="repo">
        <div><small>${T('home.ossStars')}</small><b class="js-stars">${REPO.stars}</b></div>
        <div><small>${T('home.ossForks')}</small><b class="js-forks">${REPO.forks}</b></div>
        <div><small>${T('home.ossUpdated')}</small><b class="js-last" style="font-size:var(--t-sm)">${relTime(REPO.last)}</b></div>
        <div><small>${T('home.ossLicence')}</small><b>AGPL v3</b></div>
      </div>
      <div class="repo__live mono"><i></i><span class="js-livestate">${T('home.ossSnapshot')} · 2026-10-02</span> · <a href="https://gitlab.com/kyber" target="_blank" rel="noopener">gitlab.com/kyber</a></div>
      ${releaseCard()}
    </div>
  </div>
  <div class="wrap" style="margin-top:4rem">
    <div class="sechead"><div><span class="kicker">${T('home.ossRepos')}</span></div><p class="lead rv" style="font-size:var(--t-base)">${T('home.ossRepoLead')}</p></div>
    ${repoWall()}
  </div></section>`;

  const REPOS = [['kyber/kyber', 'rk_kyber', 'docs'], ['kyber/core/kysdk', 'rk_kysdk', 'core'], ['kyber/core/kyctl', 'rk_kyctl', 'core'], ['kyber/core/kymux', 'rk_kymux', 'core'], ['kyber/core/kynput', 'rk_kynput', 'core'], ['kyber/core/kymedia', 'rk_kymedia', 'core'], ['kyber/core/kyutil', 'rk_kyutil', 'core'], ['kyber/apps/kyber-desktop', 'rk_desktop', 'apps'], ['kyber/apps/kyber-web', 'rk_web', 'apps'], ['kyber/apps/kyber-installer', 'rk_installer', 'apps']];
  const REPOSNAP = { 'kyber/kyber': [83, '2026-06-24'], 'kyber/core/kysdk': [2, '2026-08-19'], 'kyber/core/kyctl': [2, '2026-08-19'], 'kyber/core/kymux': [1, '2026-08-19'], 'kyber/core/kynput': [1, '2026-08-19'], 'kyber/core/kymedia': [1, '2026-08-19'], 'kyber/core/kyutil': [1, '2026-08-19'], 'kyber/apps/kyber-desktop': [16, '2026-08-19'], 'kyber/apps/kyber-web': [4, '2026-08-19'], 'kyber/apps/kyber-installer': [8, '2026-08-19'] };
  const repoWall = () => `<div class="repos">${REPOS.map(([path, k, grp]) => { const [st, last] = REPOSNAP[path]; const name = path.split('/').pop(); return `<a class="repo-c rv" data-tilt href="https://gitlab.com/${path}" target="_blank" rel="noopener" data-repo="${path}"><div class="repo-c__h"><span class="mono grp">${grp}/</span><b class="mono">${name}</b><span class="dotok" title="active"></span></div><p>${T('home.' + k)}</p><div class="repo-c__m mono"><span>★ <span class="js-rs">${st}</span></span><span class="js-rl">${last}</span></div></a>`; }).join('')}</div>`;
  const REL = { tag: '0.28.0-1', date: '2026-08-19', url: 'https://gitlab.com/kyber/apps/kyber-installer/-/releases/0.28.0-1', file: 'kyber-installer-win64-0.28.0.exe', dl: 'https://gitlab.com/api/v4/projects/78083474/packages/generic/kyber-installer/0.28.0/kyber-installer-win64-0.28.0.exe' };
  const releaseCard = () => `<div class="relcard rv"><div><span class="mono faint">${T('home.ossLatest')} · ${T('home.ossInstaller')}</span><b class="mono js-reltag">${REL.tag}</b><span class="mono faint js-reldate">${REL.date}</span></div><div class="btns"><a class="btn btn--accent btn--sm js-reldl" href="${REL.dl}" rel="noopener">${T('home.ossDownload')} .exe</a><a class="btn btn--ghost btn--sm js-relurl" href="${REL.url}" target="_blank" rel="noopener">${T('sdk.readNotes')} ${ARRUR}</a></div></div>`;

  const TL = [['2001', 't2001'], ['2003', 't2003'], ['2004', 't2004'], ['2006', 't2006'], ['2008', 't2008'], ['2009', 't2009'], ['2012', 't2012'], ['2020', 't2020', 1], ['2022', 't2022', 1], ['2023', 't2023', 1], ['2025', 't2025', 1], ['2026', 't2026a', 1], ['2026', 't2026b']];
  const vlcBlock = () => `
  <section class="tl" id="tl"><div class="tl__pin">
    <div class="wrap">
      <div class="sechead"><div>${kicker('home.tlKicker')}<h2 class="h1 split">${T('home.tlTitle')}</h2></div><p class="lead rv">${T('home.vlcLead')}</p></div>
    </div>
    <div class="tl__track" id="tlTrack">${TL.map(([y, k, kb]) => `<div class="tl__item${kb ? ' k' : ''}"><div class="yr">${y}</div><div class="rail"></div><p>${T('home.' + k)}</p></div>`).join('')}</div>
    <div class="wrap"><p class="tl__hint mono">${T('home.vlcAlso')}</p></div>
  </div></section>
  <section class="sec" style="padding-top:2rem"><div class="wrap">
    <div class="vstats">
      <div class="rv"><div class="vlc__num"><span data-count="7">0</span><sup>B+</sup></div><p>${T('home.vlcS1')}</p></div>
      <div class="rv"><div class="vlc__num"><span data-count="500">0</span><sup>M</sup></div><p>${T('home.vlcS2')}</p></div>
      <div class="rv"><div class="vlc__num">~<span data-count="1000">0</span></div><p>${T('home.vlcS3')}</p></div>
      <div class="rv"><div class="vlc__num accent"><span data-count="8">0</span><sup>ms</sup></div><p>${T('home.vlcS4')}</p></div>
    </div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sechead"><div>${kicker('home.proofKicker')}<h2 class="h1 split">${T('home.proofTitle')}</h2></div></div>
    <div class="proof">
      <a class="rv" data-tilt href="${K}/article/first-fundraising-announcement/" target="_blank" rel="noopener"><span class="mono">01</span><b>${T('home.proof1t')}</b><p>${T('home.proof1d')}</p></a>
      <a class="rv" data-tilt href="${K}/article/avatar-medical-and-kyber-awarded/" target="_blank" rel="noopener"><span class="mono">02</span><b>${T('home.proof2t')}</b><p>${T('home.proof2d')}</p></a>
      <a class="rv" data-tilt href="${K}/article/kyberatvivatech/" target="_blank" rel="noopener"><span class="mono">03</span><b>${T('home.proof3t')}</b><p>${T('home.proof3d')}</p></a>
      <a class="rv" data-tilt href="${K}/article/first-fundraising-announcement/" target="_blank" rel="noopener"><span class="mono">04</span><b>${T('home.proof4t')}</b><p>${T('home.proof4d')}</p></a>
    </div>
  </div></section>`;

  const LEADS = [['SL', 'simon', 'Simon Latapie', 'https://www.linkedin.com/in/simon-latapie-120bb4119'], ['JZ', 'julien', 'Julien Zouein', 'https://www.linkedin.com/in/julien-zouein'], ['IG', 'ilhan', 'Ilhan Gendron', 'https://www.linkedin.com/in/ilhangendron'], ['NH', 'natacha', 'Natacha Holtzhausser', 'https://www.linkedin.com/in/natachaholtzhausser']];
  const LI = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>';
  const teamBlock = (full) => `
  <section class="sec" id="team" style="padding-top:0"><div class="wrap">
    <div class="sechead"><div>${kicker('team.kicker')}<h2 class="h1 split">${T('team.title')}</h2></div><p class="lead rv">${T('team.lead')}</p></div>
    <div class="team">
      <article class="jb rv" data-tilt>
        <div class="jb__img"><img src="img/jb.webp" alt="Jean-Baptiste Kempf" loading="lazy"><span class="scanbar"></span></div>
        <div class="jb__body">
          <h3>Jean-Baptiste Kempf</h3><span class="role">${T('team.jbRole')}</span>
          <p>${T('team.jbBio')}</p>
          ${full ? `<p class="mono" style="font-size:var(--t-xs);color:var(--faint)">${T('team.jbAwards')}</p>` : ''}
          <blockquote>“${T('team.jbQuote')}”</blockquote>
          <div class="jb__links">
            <a class="chip" href="https://www.linkedin.com/in/jbkempf" target="_blank" rel="noopener">${LI} LinkedIn</a>
            <a class="chip" href="https://jbkempf.com/" target="_blank" rel="noopener">jbkempf.com ↗</a>
            <a class="chip" href="https://en.wikipedia.org/wiki/Jean-Baptiste_Kempf" target="_blank" rel="noopener">Wikipedia ↗</a>
            <a class="chip" href="https://techcrunch.com/2026/06/19/he-made-your-free-video-player-run-smoothly-now-hes-doing-that-for-robots/" target="_blank" rel="noopener">TechCrunch ↗</a>
          </div>
          <a class="jb__credit" href="https://commons.wikimedia.org/wiki/File:Jean-Baptiste_Kempf_par_Axelle_Manfrini,_Janvier_2021,_Paris.jpg" target="_blank" rel="noopener">${T('team.photo')}</a>
        </div>
      </article>
      <div class="leads">
        ${LEADS.map(([ini, k, n, u], i) => `<a class="lead-card rv" data-tilt href="${u}" target="_blank" rel="noopener"><div class="avatar" style="--a:${i * 90}deg">${ini}</div><div><h4>${n}</h4><span class="role">${T('team.' + k + 'Role')}</span><p>${T('team.' + k + 'Bio')}</p></div><span class="li">${LI} LinkedIn ↗</span></a>`).join('')}
        <div class="team__count rv"><b>25+</b><p>${T('team.lead')}</p><a class="btn btn--ghost btn--sm" href="#/about" data-anchor="careers">${T('team.join')} ${ARR}</a></div>
      </div>
    </div>
    ${full ? `
    <h3 class="h2" style="margin-top:5rem">${T('team.investors')}</h3>
    <div class="inv">
      <a class="rv" href="https://lsvp.com/" target="_blank" rel="noopener"><b>Lightspeed</b><span>${T('team.inv1')} · Antoine Moyroud</span></a>
      <a class="rv" href="https://www.ovni.vc/" target="_blank" rel="noopener"><b>OVNI Capital</b><span>${T('team.inv2')}</span></a>
      <a class="rv" href="https://www.kimaventures.com/" target="_blank" rel="noopener"><b>Kima Ventures</b><span>${T('team.inv3')}</span></a>
    </div>
    <h3 class="h2" style="margin-top:5rem">${T('team.press')}</h3>
    <div class="press">
      <a class="rv" href="https://techcrunch.com/2026/06/19/he-made-your-free-video-player-run-smoothly-now-hes-doing-that-for-robots/" target="_blank" rel="noopener"><small>TechCrunch · 19.06.2026</small><h4>He made your free video player run smoothly. Now he’s doing that for robots.</h4></a>
      <a class="rv" href="https://thenextweb.com/news/vlc-developer-kyber-5-million-lightspeed-robotics-remote-control" target="_blank" rel="noopener"><small>The Next Web · 2026</small><h4>The developer behind VLC’s 6 billion downloads now…</h4></a>
      <a class="rv" href="https://techcrunch.com/2026/08/31/vlc-crosses-7-billion-downloads/" target="_blank" rel="noopener"><small>TechCrunch · 31.08.2026</small><h4>VLC crosses 7 billion downloads</h4></a>
    </div>` : ''}
  </div></section>`;

  const faqBlock = () => `
  <section class="sec"><div class="wrap faq">
    <div><span class="kicker">FAQ</span><h2 class="h1 split" style="margin-top:1rem">${T('faq.title')}</h2>
      <a class="btn btn--ghost" style="margin-top:2rem" href="#/connect">${T('common.contactUs')} ${ARR}</a></div>
    <div>${[1, 2, 3, 4, 5].map(i => `<details class="rv"><summary>${T('faq.q' + i)}<i></i></summary><div class="ans">${linkify(T('faq.a' + i))}</div></details>`).join('')}</div>
  </div></section>`;
  const linkify = (s) => s.replace(/gitlab\.com\/kyber\/kyber|r\/kyber/g, (m) => m.startsWith('gitlab') ? '<a class="accent" href="https://gitlab.com/kyber/kyber#where-to-start" target="_blank" rel="noopener">gitlab.com/kyber/kyber</a>' : '<a class="accent" href="https://www.reddit.com/r/kyber/" target="_blank" rel="noopener">r/kyber</a>');

  /* ---------------- pages ---------------- */
  function pageHome() {
    const lats = [[8, '--accent', 'lat1'], [75, '--accent2', 'lat2'], [220, '--warn', 'lat3'], [450, '--hot', 'lat4']];
    const plats = ['Windows', 'Linux', 'macOS', 'Android', 'iOS', 'Meta Quest', 'Apple Vision Pro', 'ROS', 'Unity', 'Unreal', 'Vulkan', 'D3D11', 'Web', 'Starlink'];
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
            <div class="btns rv">${btnSdk('btn--accent')} ${btnStar()}</div>
          </div>
          <div class="hud rv">
            <div title="${T('common.measured')}"><small>${T('home.hudFrame')}</small><b class="accent"><span class="js-p50">16.7</span> ms</b><canvas class="spark" id="spark" aria-hidden="true"></canvas><small class="hud__sub"><span class="js-hz">60</span> Hz · p95 <span class="js-p95">—</span> ms</small></div>
            <div title="${T('common.measured')}"><small>${T('home.hudInput')}</small><b><span class="js-input">—</span></b><small class="hud__sub js-inputhint">${T('home.hudTap')}</small></div>
            <div><small>${T('home.hudClaim')}</small><b>8–10 ms</b><small class="hud__sub">${T('home.hudClaimNote')} · QUIC/HTTP3</small></div>
          </div>
        </div>
      </div>
    </section>
    <div class="marq" aria-hidden="true"><div class="marq__t">${[...plats, ...plats].map(p => `<span>${p}</span>`).join('')}</div></div>

    <section class="mani"><div class="wrap">
      <div class="mani__meta"><span class="kicker">01 / ${T('home.statsKicker')}</span><span class="mono muted" dir="ltr" style="font-size:var(--t-xs)">200 ms → 8 ms</span></div>
      <p class="mani__text" id="mani">${T('home.manifesto')}</p>
    </div></section>

    ${ossBlock()}
    <section class="sec" id="play"><div class="wrap play">
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
        <div class="play__read"><b class="mono" id="playErr">0</b><small class="mono">${T('ui.pxDrift')}</small></div>
        <span class="play__hint mono">${T('home.playHint')}</span>
      </div>
      <p class="mono note-s" style="grid-column:1/-1">${T('home.playNote')}</p>
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
          <div class="tag mono"><i></i>REC · ${T('ui.frame')} <span class="js-frame">0</span></div>
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
          ${[1, 2, 3, 4, 5].map((i) => `<div class="pnode"><span class="mono">0${i}</span><b>${T('home.p' + i)}</b></div>`).join('')}
        </div>
      </div>
      <div class="pipe__total"><b><span id="pipeTotal">0</span><small style="font-size:.35em">–10 ms</small></b><span>${T('home.pipeFits')}</span></div>
      <div class="ruler" id="ruler">
        <div class="ruler__row"><span>${T('home.pipeFrame')} <em class="mono">· ${T('common.measured')}</em></span><div class="ruler__bar"><i class="js-rframe" style="--c:var(--ink)"></i></div><b class="mono"><span class="js-p50">16.7</span> ms</b></div>
        <div class="ruler__row"><span>${T('home.pipeKyber')}</span><div class="ruler__bar"><i style="--c:var(--accent);--w:5%"></i></div><b class="mono">8–10 ms</b></div>
        <div class="ruler__row"><span>${T('home.pipeCall')}</span><div class="ruler__bar"><i style="--c:var(--hot);--w:100%"></i></div><b class="mono">100–200 ms</b></div>
      </div>
    </div></div></section>

    ${vlcBlock()}
    ${teamBlock(false)}
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
        <div class="hudline"><span class="chip">8–10 ms · ${T('home.hudClaimNote')}</span><span class="chip">${T('tech.sVideo')} · ${T('tech.sAudio')} · ${T('tech.sControl')} · ${T('tech.sTelemetry')}</span><span class="chip">QUIC/HTTP3 · E2E</span></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:var(--sec)"><div class="wrap">
      <div class="sechead"><div>${kicker('solution.capabilities')}<h2 class="h1 split">${T(P('capTitle'))}</h2></div></div>
      <div class="caps">${[1, 2, 3].map(i => `<article class="cap rv" data-tilt><div class="viz">${capViz[i - 1]}</div><h3 class="h3">${T(P('c' + i + 't'))}</h3><p>${T(P('c' + i + 'd'))}</p></article>`).join('')}</div>
    </div></section>

    ${get(EN, `solutions.${slug}.xTitle`) ? `<section class="sec" style="padding-top:0"><div class="wrap">
      <h2 class="h1 split">${T(P('xTitle'))}</h2>
      <div class="xloop">${[1, 2, 3].map(i => `<div class="rv"><span class="mono">0${i}</span><h3 class="h3">${T(P('x' + i + 't'))}</h3><p>${T(P('x' + i + 'd'))}</p></div>`).join('<i class="xarrow" aria-hidden="true">→</i>')}</div>
    </div></section>` : ''}
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
      <div class="thr" id="thr" data-note="${T('home.hudClaimNote')}">${bars.map(([l, v, c]) => `<div class="thr__row" style="--c:var(${c})"><span>${l}</span><div class="bar"><i data-w="${v / 300 * 100}"></i></div><b>${v} ms</b></div>`).join('')}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">${T('common.measured')}</span><h2 class="h1 split">${T('tech.scopeTitle')}</h2></div><p class="lead rv">${T('tech.scopeLead')}</p></div>
      <div class="scope rv">
        <canvas id="scopeCv" role="img" aria-label="${T('tech.scopeTitle')}"></canvas>
        <div class="scope__m">
          <div><small>${T('tech.scopeFrame')}</small><b class="mono"><span class="js-p50">—</span> ms</b></div>
          <div><small>${T('tech.scopeJitter')}</small><b class="mono"><span class="js-jit">—</span> ms</b></div>
          <div><small>${T('tech.scopeHz')}</small><b class="mono"><span class="js-hz">—</span> Hz</b></div>
          <div><small>${T('tech.scopeInput')}</small><b class="mono"><span class="js-input">—</span></b></div>
          <div><small>${T('tech.scopeLong')}</small><b class="mono js-long">0</b></div>
        </div>
        <p class="mono note-s">${T('tech.scopeTry')}</p>
      </div>
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
        <div class="rv"><svg viewBox="0 0 400 140" fill="none">${Array.from({ length: 25 }, (_, i) => `<path d="M20 ${8 + i * 5} H380" stroke="var(--hot)" stroke-opacity=".5" stroke-dasharray="${2 + i % 4} ${3 + i % 3}"/>`).join('')}</svg><b>${T('tech.connLegacy')}</b><p>${T('tech.connLegacyD')}</p></div>
        <div class="rv"><svg viewBox="0 0 400 140" fill="none"><path d="M20 70 H380" stroke="var(--accent)" stroke-width="3" style="filter:drop-shadow(0 0 8px var(--accent))"/><circle r="6" fill="var(--accent)"><animate attributeName="cx" values="20;380" dur="1.2s" repeatCount="indefinite"/><animate attributeName="cy" values="70;70" dur="1.2s" repeatCount="indefinite"/></circle><text x="20" y="110" font-family="Geist Mono" font-size="12" fill="var(--muted)">QUIC / HTTP3 · E2E</text></svg><b>Kyber</b><p>${T('tech.sVideo')} · ${T('tech.sAudio')} · ${T('tech.sControl')} · ${T('tech.sTelemetry')}</p></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">05</span><h2 class="h1 split">${T('tech.prioTitle')}</h2></div><p class="lead rv">${T('tech.prioLead')}</p></div>
      <div class="prio">
        <div class="prio__box rv"><b>${T('tech.prioMedia')}</b><canvas id="prioA"></canvas><p>${T('tech.prioMediaList')}</p></div>
        <div class="prio__box rv"><b>${T('tech.prioCtrl')}</b><canvas id="prioB"></canvas><p>${T('tech.prioCtrlList')}</p></div>
      </div>
      <div class="insp rv">
        <div class="insp__h"><b class="mono">${T('tech.inspTitle')}</b><span class="chip">${T('common.schematic')}</span><label class="insp__loss"><input type="checkbox" id="inspLoss"> ${T('tech.inspLoss')}</label></div>
        <div class="tablewrap"><table class="insp__t mono"><thead><tr><th>${T('tech.inspStream')}</th><th>${T('tech.inspSeq')}</th><th>${T('tech.inspAge')}</th><th>${T('tech.inspState')}</th></tr></thead><tbody id="inspBody"></tbody></table></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">06</span><h2 class="h1 split">${T('tech.netTitle')}</h2></div><p class="lead rv">${T('tech.netLead')}</p></div>
      <div class="net">
        <div class="net__view rv"><canvas id="netCv"></canvas></div>
        <div class="net__panel rv">
          <div class="net__metric"><span>${T('tech.netQuality')}</span><b id="nQ">1080p</b></div>
          <div class="net__metric"><span>${T('tech.netLoss')}</span><b id="nL" style="color:var(--warn)">0%</b></div>
          <div class="net__metric"><span>${T('tech.netLatency')}</span><b class="accent" id="nC">8–10 ms</b></div><p class="mono note-s">${T('tech.netNote')}</p>
          <label><span class="mono muted" style="font-size:var(--t-xs)">${T('tech.netSlider')}</span><input type="range" class="range" id="netR" min="0" max="100" value="100" style="margin-top:1rem"></label>
        </div>
      </div>
      <div class="tri">${[1, 2, 3].map(i => `<div class="rv"><b>${T('tech.n' + i + 't')}</b><p>${T('tech.n' + i + 'd')}</p></div>`).join('')}</div>
      <div class="fec rv" id="fec">
        <div class="fec__head"><div><h3 class="h2">${T('tech.fecTitle')}</h3><p class="muted" style="margin-top:.6rem;max-width:60ch">${T('tech.fecLead')}</p></div><span class="chip">${T('tech.fecModel')}</span></div>
        <div class="fec__row">${[0, 1, 2, 3].map(i => `<button type="button" class="fec__pk" data-pk="${i}" aria-pressed="false"><small class="mono">P${i}</small><b class="mono">0x00</b></button>`).join('')}<span class="fec__x mono">⊕</span><button type="button" class="fec__pk par" data-pk="4" aria-pressed="false"><small class="mono">XOR</small><b class="mono">0x00</b></button></div>
        <div class="fec__foot"><div><div class="fec__out" data-out role="status"></div><code class="mono fec__eq" data-eq dir="ltr"></code></div><div style="display:flex;gap:.6rem;align-items:center"><span class="mono note-s">${T('tech.fecDrop')}</span><button type="button" class="btn btn--ghost btn--sm" data-reset>${T('tech.fecReset')}</button></div></div>
      </div>
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
        <thead><tr><th></th><th>Kyber</th><th>WebRTC</th></tr></thead>
        <tbody>
          <tr><td>${T('tech.cmpDesigned')}</td><td class="k">${T('tech.kDesigned')}</td><td class="o">${T('tech.wDesigned')}</td></tr>
          <tr><td>${T('tech.cmpOptimizes')}</td><td class="k">${T('tech.kOpt')}</td><td class="o">${T('tech.wOpt')}</td></tr>
          <tr><td>${T('tech.cmpLate')}</td><td class="k">${T('tech.kLate')}</td><td class="o">${T('tech.wLate')}</td></tr>
          <tr><td>${T('tech.cmpCtrl')}</td><td class="k">${T('tech.kCtrl')}</td><td class="o">${T('tech.wCtrl')}</td></tr>
        </tbody></table><p class="mono note-s" style="margin-top:1rem">${T('tech.cmpNote')}</p></div>
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
      <div class="sechead"><div>${kicker('home.vlcKicker')}<h2 class="h1 split">${T('about.teamTitle')}</h2></div><p class="lead rv">${T('about.teamLead')}</p></div>
    </div></section>
    ${vlcBlock()}
    ${teamBlock(true)}
    <section class="sec" style="padding-top:0"><div class="wrap">
      <h2 class="h1 split">${T('about.valuesTitle')}</h2>
      <div class="vals">${[1, 2, 3, 4, 5].map(i => `<div class="val rv"><span class="mono">0${i}</span><h3>${T('about.v' + i + 't')}</h3><p>${T('about.v' + i + 'd')}</p></div>`).join('')}</div>
    </div></section>
    <section class="sec" id="careers" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('footer.careers')}<h2 class="h1 split">${T('about.careersTitle')}</h2></div><p class="lead rv">${T('about.careersLead')}</p></div>
      <div class="jobs">${jobs.map(([k, u]) => `<a class="job rv" href="${K}${u}" target="_blank" rel="noopener"><h3>${T('about.' + k)}</h3><span class="chip">${T('about.contract')}</span><span class="chip">${T(k === 'j5' ? 'about.jobLocFde' : 'about.jobLoc')}</span><span class="go">${ARRUR}</span></a>`).join('')}</div>
      <p class="mono stackline rv"><span class="accent">$</span> cat stack.txt → ${T('about.stackLine')}</p>
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
          <div class="btns rv" style="margin-top:2rem"><a class="btn btn--accent magnetic" href="${K}/get-the-sdk/" target="_blank" rel="noopener">${T('sdk.download')} ${ARRUR}</a> ${btnStar()} ${btnDocs()}</div></div>
        <div class="term rv"><div class="term__bar"><i></i><i></i><i></i><span>~/kyber — zsh</span><button id="copyBtn">${T('sdk.copy')}</button></div><pre id="termPre"></pre></div>
      </div>
    </div></section>
    <section class="sec" style="padding-top:2rem"><div class="wrap">
      <div class="kits">${[1, 2, 3].map(i => `<div class="kit rv" data-tilt>${ICO[[3, 5, 0][i - 1]]}<h3>${T('sdk.k' + i + 't')}</h3><p>${T('sdk.k' + i + 'd')}</p></div>`).join('')}</div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">README</span><h2 class="h1 split">${T('sdk.matTitle')}</h2></div><p class="lead rv">${T('sdk.matLead')}</p></div>
      ${matrix()}
      <div class="bind rv"><b class="mono">${T('sdk.bindTitle')}</b><p>${T('sdk.bindD')}</p></div>
      <div style="margin-top:2rem">${releaseCard()}</div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">CHANGELOG</span><h2 class="h1 split">${T('sdk.clTitle')}</h2></div><p class="lead rv">${T('sdk.clLead')}</p></div>
      ${microscope()}
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div><span class="kicker">${T('home.ossRepos')}</span></div><p class="lead rv" style="font-size:var(--t-base)">${T('home.ossRepoLead')}</p></div>
      ${repoWall()}
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

  function matrix() {
    const ok = `<span class="m ok">${T('sdk.ok')}</span>`, al = `<span class="m al">${T('sdk.alpha')}</span>`, so = `<span class="m so">${T('sdk.soon')}</span>`, na = '<span class="m na">—</span>';
    const rows = [['Windows', ok, ok], ['macOS', ok, al], ['Linux (X11)', ok, ok], ['Linux (Wayland)', so, so], [t('ui.webBrowser'), ok, na], ['Android', so, na], ['iOS', so, na]];
    return `<div class="tablewrap rv"><table class="cmp mat"><thead><tr><th></th><th>${T('sdk.client')}</th><th>${T('sdk.server')}</th></tr></thead><tbody>${rows.map(r => `<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table><p class="note-s" style="margin-top:1rem">${T('sdk.matNotes')}</p></div>`;
  }
  function microscope() {
    const R = [
      ['0.28', '2026-08-20', '/article/v-028/', [['r28a', 'macOS host · ScreenCaptureKit · VideoToolbox'], ['r28b', 'click → video rect only'], ['r28c', 'backend = "libavconv"'], ['r28d', 'Position → kynput_Position']]],
      ['0.27', '2026-06-26', '/article/v-027/', [['r27a', '[kycontroller] multi_client = true'], ['r27b', 'server · network · browser'], ['r27c', 'auth = OIDC']]],
      ['0.26', '2026-05-13', '/article/v-026/', [['r26a', 'FFmpeg 8.1 · AMF · VAAPI']]],
      ['0.25', '2026-03-31', '/article/v-025/', [['r25a', 'IPv6 · DRM/KMS · kyctl jwt']]]
    ];
    return `<div class="micro">${R.map(([v, d, u, items], n) => `<details class="micro__r rv"${n === 0 ? ' open' : ''}><summary><b class="mono">v${v}</b><span class="mono faint">${d}</span><span class="micro__c mono">${items.length} ${T('ui.changes')}</span><i></i></summary>
      <ul>${items.map(([k, code]) => `<li><span>${T('sdk.' + k)}</span><code class="mono" dir="ltr">${esc(code)}</code></li>`).join('')}</ul>
      <a class="accent mono" href="${K}${u}" target="_blank" rel="noopener">${T('sdk.readNotes')} ↗</a></details>`).join('')}</div>`;
  }

  function pageSimple() {
    const big = (href, ico, k, ext) => `<a class="sbtn" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><span class="sbtn__i" aria-hidden="true">${ico}</span><span><b>${T('simple.' + k)}</b><small>${T('simple.' + k + 'd')}</small></span></a>`;
    return `
    <section class="simple"><div class="simple__in">
      <h1>${T('simple.title')}</h1>
      <div class="simple__lang"><label for="sLang">${T('simple.langLabel')}</label><select id="sLang">${LANGS.map(([c, n]) => `<option value="${c}"${c === LANG ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
      <h2>${T('simple.what')}</h2><p>${T('simple.whatD')}</p>
      <h2>${T('simple.do')}</h2>
      <div class="sbtns">
        ${big(REL.dl, '⬇', 'b1', false)}
        ${big(GL, '</>', 'b2', true)}
        ${big(DOCS, '?', 'b3', true)}
        ${big('mailto:contact@kyber.tech', '✉', 'b4', false)}
      </div>
      <h2>${T('simple.uses')}</h2>
      <ul class="simple__uses">${[1, 2, 3, 4].map(i => `<li>${T('simple.u' + i)}</li>`).join('')}</ul>
      <h2>${T('simple.who')}</h2><p>${T('simple.whoD')}</p>
      <a class="sback" href="#/">← ${T('simple.back')}</a>
    </div></section>`;
  }

  function pageBlog() {
    const cover = (p) => p.i ? `<img src="${img(p.i)}" alt="" loading="lazy">` : `<div style="position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(circle at 30% 20%,color-mix(in oklab,var(--accent) 22%,transparent),transparent 60%),repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px 28px),var(--bg2)"><span class="mono" style="font-size:clamp(2.6rem,6vw,4.6rem);letter-spacing:-.04em;color:var(--ink)">v${p.v}</span></div>`;
    return `
    <section class="phero"><div class="wrap">
      ${kicker('blog.kicker')}<h1 class="phero__title split">${T('blog.title')}</h1>
      <div class="filters" role="group">
        <button aria-pressed="true" data-f="*">${T('blog.all')}</button><button aria-pressed="false" data-f="r">${T('blog.releases')}</button><button aria-pressed="false" data-f="a">${T('blog.announcements')}</button>
      </div>
      <div class="posts" id="posts">${POSTS.map((p, i) => `<a data-tilt class="post rv${i === 0 ? ' post--feat' : ''}" data-c="${p.c}" href="${K}${p.u}" target="_blank" rel="noopener"><div class="post__img">${cover(p)}</div><div class="post__b"><div class="post__m"><span>${T(p.c === 'r' ? 'blog.releases' : 'blog.announcements')}</span><span>${fmtDate(p.d)}</span></div><h3>${T('blog.' + p.k)}</h3><div class="post__m"><span>${p.m} ${T('common.minRead')}</span><span>${T('common.readArticle')} ${ARRUR}</span></div></div></a>`).join('')}</div>
    </div></section>
    ${ctaBlock()}`;
  }

  const RICO = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7 10l3 2-3 2" /></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 20h18M6 16V9M11 16V5M16 16v-4M21 16V8"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M6 10v5c3 2 9 2 12 0v-5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19V5h11l5 5v9z"/><path d="M8 13h8M8 16h5M15 5v5h5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 13h18"/></svg>'
  ];
  let FS = null;
  const freshFS = () => ({ step: 0, role: null, name: '', email: '', company: '', need: [], stack: null, lat: 20, scale: null, timeline: null, job: null, link: '', phone: '', channel: null, day: null, time: null, note: '' });
  function pageConnect() {
    if (!FS) FS = freshFS();
    const jobs = ['j1', 'j2', 'j3', 'j4', 'j5'];
    const days = []; const d0 = new Date(); let d = new Date(d0); d.setDate(d.getDate() + 1);
    while (days.length < 10) { if (d.getDay() % 6 !== 0) days.push(new Date(d)); d.setDate(d.getDate() + 1); }
    const fmtD = (x, o) => { try { return new Intl.DateTimeFormat(LANG, o).format(x); } catch (e) { return x.toDateString(); } };
    const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return 'UTC'; } })();
    const pill = (grp, val, label, multi) => `<button type="button" class="pill" data-g="${grp}" data-v="${esc(val)}"${multi ? ' data-multi="1"' : ''} aria-pressed="false">${label}</button>`;
    const fld = (id, k, type = 'text', full) => `<div class="fld${full ? ' full' : ''}"><input id="f_${id}" data-k="${id}" type="${type}" placeholder=" " autocomplete="${{ name: 'name', email: 'email', company: 'organization', link: 'url' }[id] || 'off'}"><label for="f_${id}">${T(k)}</label></div>`;
    return `
    <section class="phero" style="padding-bottom:var(--sec)"><div class="wrap flow">
      <aside class="flow__aside">
        ${kicker('flow.kicker')}
        <h1 class="phero__title split" style="font-size:clamp(2.4rem,1rem + 4.4vw,5.6rem)">${T('flow.title')}</h1>
        <p class="lead rv">${T('flow.lead')}</p>
        <ol class="steps rv">${[1, 2, 3, 4].map(i => `<li data-st="${i - 1}"><span class="n">0${i}</span><span>${T('flow.s' + i)}</span></li>`).join('')}</ol>
        <div class="flow__bar"><i id="flowBar"></i></div>
        <div class="tick-row rv"><a class="accent" href="${GL}" target="_blank" rel="noopener">GitLab ↗</a><a class="accent" href="https://www.reddit.com/r/kyber/" target="_blank" rel="noopener">r/kyber ↗</a><a class="accent" href="https://www.linkedin.com/company/kyber-tech/" target="_blank" rel="noopener">LinkedIn ↗</a></div>
      </aside>
      <div class="panel rv" id="panel">
        <div class="stage" data-s="0">
          <h2 class="q">${T('flow.q1')}</h2>
          <div class="roles">${[1, 2, 3, 4, 5, 6].map(i => `<button type="button" class="chipbtn" data-g="role" data-v="r${i}" aria-pressed="false">${RICO[i - 1]}<span>${T('flow.r' + i)}</span></button>`).join('')}</div>
          <div class="hintbox" id="devHint" hidden><span>${T('flow.devHint')}</span><a class="btn btn--accent btn--sm" href="#/sdk">${T('common.getSdk')} ${ARR}</a></div>
          <div class="grid2">${fld('name', 'flow.name')}${fld('email', 'flow.email', 'email')}${fld('company', 'flow.company', 'text', true)}</div>
        </div>
        <div class="stage" data-s="1">
          <div class="grp" data-show="nojob">
            <h2 class="q">${T('flow.q2')}</h2>
            <div class="pills">${SOL.map(x => pill('need', x, T(`solutions.${x}.name`), 1)).join('')}${pill('need', 'other', T('flow.other'), 1)}</div>
            <p class="qs">${T('flow.q2b')}</p>
            <div class="pills">${[1, 2, 3, 4].map(i => pill('stack', 'st' + i, T('flow.st' + i))).join('')}</div>
            <p class="qs">${T('flow.q2c')}</p>
            <div class="latpick"><div class="latpick__val"><b id="latVal">20 ms</b><span id="latTxt"></span></div><input type="range" class="range" id="latR" min="5" max="250" value="20"></div>
            <p class="qs">${T('flow.q2d')}</p>
            <div class="pills">${['1–10', '10–100', '100–1k', '1k+'].map(v => pill('scale', v, v + ' ' + T('flow.machines'))).join('')}</div>
            <p class="qs">${T('flow.q2e')}</p>
            <div class="pills">${[1, 2, 3].map(i => pill('timeline', 'tl' + i, T('flow.tl' + i))).join('')}</div>
          </div>
          <div class="grp" data-show="job" hidden>
            <h2 class="q">${T('flow.jobQ')}</h2>
            <div class="pills">${jobs.map(j => pill('job', j, T('about.' + j))).join('')}</div>
            <div class="grid2">${fld('link', 'flow.linkedin', 'url', true)}</div>
            <div class="hintbox"><span>${T('about.stackLine')}</span><a class="btn btn--accent btn--sm" id="jobGo" href="${K}/about#careers" target="_blank" rel="noopener">${T('flow.jobApply')} ${ARRUR}</a></div>
          </div>
        </div>
        <div class="stage" data-s="2">
          <h2 class="q">${T('flow.q3')}</h2>
          <div class="pills">${[1, 2, 3, 4].map(i => pill('channel', 'c' + i, T('flow.c' + i))).join('')}</div>
          <div class="grp" data-show="phone"><div class="grid2">${fld('phone', 'flow.phone', 'tel', true)}</div></div>
          <div class="grp" data-show="when">
            <p class="qs">${T('flow.q3b')}</p>
            <div class="days">${days.map(x => `<button type="button" class="day" data-g="day" data-v="${x.toISOString().slice(0, 10)}" aria-pressed="false"><small>${fmtD(x, { weekday: 'short' })}</small><b>${fmtD(x, { day: 'numeric' })}</b><small>${fmtD(x, { month: 'short' })}</small></button>`).join('')}</div>
            <p class="qs">${T('flow.q3c')}</p>
            <div class="pills">${['morning', 'afternoon', 'evening'].map(v => pill('time', v, T('flow.' + v))).join('')}</div>
            <div class="tzline"><span>${T('flow.tz')}: ${esc(tz)}</span><span>${T('flow.parisTime')}: <b id="parisNow" style="direction:ltr;display:inline-block">--:--</b></span></div>
          </div>
          <div class="grid2"><div class="fld full"><textarea id="f_note" data-k="note" placeholder=" "></textarea><label for="f_note">${T('flow.note')}</label></div></div>
        </div>
        <div class="stage" data-s="3">
          <h2 class="q">${T('flow.review')}</h2>
          <dl class="sum" id="sum"></dl>
          <p class="mono" style="font-size:var(--t-xs);color:var(--faint);margin-top:1rem">${T('contact.demoNote')}</p>
        </div>
        <div class="flow__nav">
          <button type="button" class="btn btn--ghost btn--sm" id="fBack">${T('common.back2')}</button>
          <span class="flow__err" id="fErr" role="alert">${T('flow.required')}</span>
          <button type="button" class="btn btn--accent magnetic" id="fNext">${T('common.continue')} ${ARR}</button>
        </div>
        <div class="doneview" role="status">
          <div class="pulse-ring"><i></i><i></i><i></i><b>✓</b></div>
          <div class="big">${T('flow.done')}</div>
          <div class="ms mono" id="doneMs"></div>
          <p>${T('flow.doneLead')}</p>
          <div class="btns"><a class="btn btn--accent" id="fMail" href="mailto:contact@kyber.tech">${T('flow.sendEmail')} ${ARR}</a> ${btnSdk('btn--ghost')} <button type="button" class="btn btn--ghost" id="fRestart">${T('flow.restart')}</button></div>
        </div>
      </div>
    </div></section>`;
  }

  function initFlow(main) {
    const panel = $('#panel', main); if (!panel) return;
    const st = FS; const G = window.gsap;
    const stages = $$('.stage', panel), stepsEl = $$('.steps li', main), bar = $('#flowBar', main), err = $('#fErr', main);
    const isJob = () => st.role === 'r6';
    const sync = () => {
      $$('[data-g]', panel).forEach(b => { const g = b.dataset.g, v = b.dataset.v; const cur = st[g]; b.setAttribute('aria-pressed', Array.isArray(cur) ? cur.includes(v) : cur === v); });
      $$('[data-k]', panel).forEach(i => { if (document.activeElement !== i) i.value = st[i.dataset.k] || ''; });
      $('#devHint', panel).hidden = st.role !== 'r1';
      $$('[data-show="nojob"]', panel).forEach(e => e.hidden = isJob()); $$('[data-show="job"]', panel).forEach(e => e.hidden = !isJob());
      $$('[data-show="when"]', panel).forEach(e => e.hidden = st.channel === 'c3');
      $$('[data-show="phone"]', panel).forEach(e => e.hidden = st.channel !== 'c2');
      const jg = $('#jobGo', panel); if (jg) { const J = { j1: '/job/senior-windows-systems-developer', j2: '/job/3ddxr-developpper', j3: '/job/network-systems-developer', j4: '/job/sdr-developpper', j5: '/job/forward-deployed-engineer' }; jg.href = K + (J[st.job] || '/about#careers'); }
      const lr = $('#latR', panel); lr.value = st.lat; $('#latVal', panel).textContent = st.lat + ' ms';
      const lk = st.lat <= 10 ? 'lat1' : st.lat <= 100 ? 'lat2' : st.lat <= 300 ? 'lat3' : 'lat4'; $('#latTxt', panel).textContent = '≈ ' + t('home.' + lk);
    };
    const show = (n, dir = 1) => {
      st.step = n;
      stages.forEach((x, i) => x.classList.toggle('on', i === n));
      stepsEl.forEach((x, i) => { x.classList.toggle('on', i === n); x.classList.toggle('done', i < n); });
      bar.style.width = (n / 3 * 100) + '%';
      $('#fBack', main).style.visibility = n ? 'visible' : 'hidden';
      $('#fNext', main).innerHTML = (n === 3 ? T('flow.send') : T('common.continue')) + ' ' + ARR;
      err.classList.remove('on');
      if (n === 3) renderSum();
      const cur = stages[n];
      if (G && !RM) G.fromTo(cur.children, { opacity: 0, y: 24 * dir, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7, stagger: .04, ease: 'expo.out' });
    };
    const valid = (n) => {
      if (n === 0) return st.role && st.name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(st.email);
      if (n === 1) return isJob() ? !!st.job : (st.need.length && st.timeline);
      if (n === 2) return st.channel && (st.channel !== 'c2' || st.phone.trim().length > 5) && (st.channel === 'c3' || (st.day && st.time));
      return true;
    };
    const renderSum = () => {
      const role = st.role ? t('flow.' + st.role) : '—';
      const need = isJob() ? t('about.' + st.job) : [st.need.map(x => x === 'other' ? t('flow.other') : t(`solutions.${x}.name`)).join(', '), st.stack ? t('flow.' + st.stack) : '', st.lat + ' ms', st.scale ? st.scale + ' ' + t('flow.machines') : '', st.timeline ? t('flow.' + st.timeline) : ''].filter(Boolean).join(' · ');
      let when = st.channel ? t('flow.' + st.channel) : '—';
      if (st.channel !== 'c3' && st.day) { try { when += ' · ' + new Intl.DateTimeFormat(LANG, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(st.day + 'T12:00')); } catch (e) { when += ' · ' + st.day; } if (st.time) when += ' · ' + t('flow.' + st.time); }
      const rows = [[t('flow.summaryRole'), `${esc(role)}<br><span class="muted">${esc(st.name)} · ${esc(st.email)}${st.company ? ' · ' + esc(st.company) : ''}${st.phone ? ' · ' + esc(st.phone) : ''}</span>`, 0], [t('flow.summaryNeed'), esc(need) + (st.link ? `<br><span class="muted">${esc(st.link)}</span>` : ''), 1], [t('flow.summaryWhen'), esc(when) + (st.note ? `<br><span class="muted">“${esc(st.note)}”</span>` : ''), 2]];
      $('#sum', panel).innerHTML = rows.map(([k, v, s2]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd><button type="button" data-goto="${s2}">${T('flow.edit')}</button></div>`).join('');
    };
    panel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-g]');
      if (b) { const g = b.dataset.g, v = b.dataset.v; if (b.dataset.multi) { const a = st[g]; const i = a.indexOf(v); i < 0 ? a.push(v) : a.splice(i, 1); } else st[g] = st[g] === v && g !== 'role' ? null : v; sync(); err.classList.remove('on'); return; }
      const go = e.target.closest('[data-goto]'); if (go) show(+go.dataset.goto, -1);
    });
    panel.addEventListener('input', (e) => { const k = e.target.dataset.k; if (k) st[k] = e.target.value; if (e.target.id === 'latR') { st.lat = +e.target.value; sync(); } });
    panel.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); $('#fNext', main).click(); } });
    $('#fBack', main).addEventListener('click', () => show(Math.max(0, st.step - 1), -1));
    $('#fNext', main).addEventListener('click', () => {
      if (!valid(st.step)) { err.classList.add('on'); if (G) G.fromTo(stages[st.step], { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)' }); return; }
      if (st.step < 3) return show(st.step + 1);
      const nb = $('#fNext', main); nb.textContent = t('flow.sending'); nb.disabled = true;
      const sumTxt = $$('#sum > div', panel).map(r => r.querySelector('dt').textContent + ': ' + r.querySelector('dd').innerText.replace(/\n/g, ' — ')).join('\n') + (st.phone ? '\n' + t('flow.phone') + ': ' + st.phone : '');
      $('#fMail', main).href = 'mailto:contact@kyber.tech?subject=' + encodeURIComponent('Kyber — ' + (st.company || st.name)) + '&body=' + encodeURIComponent(sumTxt);
      const tSend = performance.now();
      setTimeout(() => { panel.classList.add('sent'); $('#doneMs', main).textContent = t('ui.proto') + ' · 0 B · ' + (performance.now() - tSend).toFixed(0) + ' ms'; stepsEl.forEach(x => { x.classList.remove('on'); x.classList.add('done'); }); bar.style.width = '100%'; if (G && !RM) G.from($('.doneview', panel).children, { opacity: 0, y: 30, stagger: .08, duration: .9, ease: 'expo.out' }); }, 650);
    });
    $('#fRestart', main).addEventListener('click', () => { FS = freshFS(); route(true); });
    const pn = $('#parisNow', main); const tick = () => { try { pn.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(new Date()); } catch (e) { } }; tick(); const id = setInterval(tick, 15000); on(() => clearInterval(id));
    sync(); show(st.step || 0);
  }

  /* ---------------- chrome (nav panels, footer) ---------------- */
  const A = { size: 0, contrast: false, motion: false, font: false, links: false, big: false };
  const SIZES = [100, 115, 130, 150];
  function applyA11y(rerender) {
    const h = document.documentElement;
    h.style.fontSize = A.size ? SIZES[A.size] + '%' : '';
    ['contrast', 'motion', 'font', 'links', 'big'].forEach(k => h.classList.toggle('a11y-' + k, A[k]));
    if (A.font && !document.getElementById('font-atk')) { const l = document.createElement('link'); l.id = 'font-atk'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap'; document.head.appendChild(l); }
    const was = RM; FX.setRM(A.motion); RM = FX.RM;
    $$('#a11yPanel [data-a]').forEach(b => b.setAttribute('aria-checked', A[b.dataset.a]));
    $$('#a11yPanel [data-size]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.size === A.size));
    if (rerender && was !== RM) route(true);
    else window.ScrollTrigger && ScrollTrigger.refresh();
  }
  function renderA11y() {
    const sw = (k) => `<button type="button" class="a11y__sw" role="switch" data-a="${k}" aria-checked="${A[k]}"><span>${T('a11y.' + k)}</span><i aria-hidden="true"></i></button>`;
    $('#a11yPanel').innerHTML = `
      <div class="a11y__h"><b>${T('a11y.title')}</b><button type="button" class="a11y__x" data-close aria-label="${T('a11y.close')}">✕</button></div>
      <div class="a11y__grp"><span>${T('a11y.text')}</span><div class="a11y__sizes">${SIZES.map((v, i) => `<button type="button" data-size="${i}" aria-pressed="${A.size === i}" style="font-size:${.8 + i * .14}rem">A</button>`).join('')}</div></div>
      ${sw('contrast')}${sw('motion')}${sw('font')}${sw('links')}${sw('big')}
      <a class="a11y__simple" href="#/simple"><b>${T('a11y.simple')}</b><small>${T('a11y.simpleD')}</small></a>
      <button type="button" class="a11y__reset" data-reset>${T('a11y.reset')}</button>`;
    $('#a11yBtn').setAttribute('aria-label', t('a11y.open'));
    $('#topBtn').setAttribute('aria-label', t('a11y.top'));
  }
  function initA11y() {
    const btn = $('#a11yBtn'), panel = $('#a11yPanel');
    const open = (o) => { panel.hidden = !o; btn.setAttribute('aria-expanded', o); if (o) $('button,a', panel)?.focus(); };
    btn.addEventListener('click', () => open(panel.hidden));
    panel.addEventListener('click', (e) => {
      const s = e.target.closest('[data-a]'); if (s) { A[s.dataset.a] = !A[s.dataset.a]; applyA11y(true); return; }
      const z = e.target.closest('[data-size]'); if (z) { A.size = +z.dataset.size; applyA11y(); return; }
      if (e.target.closest('[data-reset]')) { Object.assign(A, { size: 0, contrast: false, motion: false, font: false, links: false, big: false }); applyA11y(true); return; }
      if (e.target.closest('[data-close]')) { open(false); btn.focus(); return; }
      if (e.target.closest('.a11y__simple')) open(false);
    });
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { open(false); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!panel.hidden && !e.target.closest('#a11yPanel,#a11yBtn')) open(false); });
    const top = $('#topBtn');
    top.addEventListener('click', () => { scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); $('#main').focus({ preventScroll: true }); });
    addEventListener('scroll', () => top.classList.toggle('on', scrollY > innerHeight * .8), { passive: true });
  }

  function renderChrome() {
    renderA11y();
    $('#ddPanel').innerHTML = `<div class="dd__intro"><span class="kicker">${T('nav.solutions')}</span><p>${T('nav.solutionsLead')}</p><a class="btn btn--solid btn--sm" href="#/technology">${T('nav.technology')} ${ARR}</a></div>
      <div class="dd__grid">${SOL.map(s => `<a class="dd__item" href="#/solutions/${s}"><img src="${img(s)}" alt=""><span><b>${T(`solutions.${s}.name`)}</b><small>${T(`solutions.${s}.short`)}</small></span></a>`).join('')}</div>`;
    $('#langList').innerHTML = LANGS.map(([c, n]) => `<li><button role="option" data-l="${c}" aria-selected="${c === LANG}" lang="${c}"><span>${n}</span><span class="mono">${c.toUpperCase()}</span></button></li>`).join('');
    $('#mnav').innerHTML = `
      <div><a class="big" href="#/">Kyber</a><a class="big" href="#/technology">${T('nav.technology')}</a><a class="big" href="#/sdk">${T('nav.sdk')}</a><a class="big" href="#/about">${T('nav.about')}</a><a class="big" href="#/blog">${T('nav.blog')}</a><a class="big" href="#/connect">${T('nav.connect')}</a></div>
      <div><div class="kicker">${T('nav.solutions')}</div><div class="sub">${SOL.map(s => `<a href="#/solutions/${s}">${T(`solutions.${s}.name`)}</a>`).join('')}</div></div>
      <div class="btns">${btnSdk('btn--accent')}</div>
      <div class="mtools"><label class="mtools__lang"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg><span class="sr-only">${T('nav.language')}</span><select data-mlang aria-label="${T('nav.language')}">${LANGS.map(([c, n]) => `<option value="${c}" ${c === LANG ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <button type="button" class="iconbtn" data-mtheme aria-label="${T('nav.theme')}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button><button type="button" class="iconbtn mono" data-open-console aria-label="${T('common.console')}">›_</button></div>`;
    $('#ftr').innerHTML = `
      <div class="ftr__top">
        <div class="ftr__brand"><svg viewBox="0 0 18.1 18.7" width="34" fill="currentColor" aria-hidden="true"><path d="M12.79 18.605h5.233v-4.652l-5.232-4.65-5.233 4.65zM2.326 9.302l5.232-4.65V0H0v18.605h7.558V9.302zM18.023.0h-5.232L7.558 4.651v4.651h5.233l5.232-4.65z"/></svg><p>${T('footer.tagline')}</p></div>
        <div><h4>${T('footer.product')}</h4><ul><li><a href="#/technology">${T('nav.technology')}</a></li><li><a href="#/sdk">${T('common.getSdk')}</a></li><li><a href="${K}/get-the-sdk/" target="_blank" rel="noopener">${T('footer.getApp')}</a></li><li><a href="${DOCS}" target="_blank" rel="noopener">${T('footer.docs')}</a></li></ul></div>
        <div><h4>${T('nav.solutions')}</h4><ul>${SOL.map(s => `<li><a href="#/solutions/${s}">${T(`solutions.${s}.name`)}</a></li>`).join('')}</ul></div>
        <div><h4>${T('footer.company')}</h4><ul><li><a href="#/about">${T('nav.about')}</a></li><li><a href="#/about" data-anchor="careers">${T('footer.careers')}</a></li><li><a href="#/blog">${T('nav.blog')}</a></li><li><a href="#/connect">${T('nav.connect')}</a></li><li><a href="${GL}" target="_blank" rel="noopener">GitLab ↗</a></li><li><a href="https://www.linkedin.com/company/kyber-tech/" target="_blank" rel="noopener">LinkedIn ↗</a></li></ul></div>
        <div><h4>${T('footer.community')}</h4><ul><li><a href="${GL}" target="_blank" rel="noopener">GitLab ↗</a></li><li><a href="https://discord.gg/ztJ76bkYNm" target="_blank" rel="noopener">Discord ↗</a></li><li><a href="${REL.url}" target="_blank" rel="noopener">${T('footer.installer')} ↗</a></li><li><a href="mailto:contact@kyber.tech">contact@kyber.tech</a></li></ul>
          <h4 style="margin-top:1.6rem">${T('footer.legal')}</h4><ul><li><a href="${K}/legal/privacy-policy/" target="_blank" rel="noopener">${T('footer.privacy')}</a></li><li><a href="${K}/legal/cookies-policy/" target="_blank" rel="noopener">${T('footer.cookies')}</a></li><li><a href="${K}/legal/terms-of-service/" target="_blank" rel="noopener">${T('footer.terms')}</a></li></ul></div>
      </div>
      <div class="ftr__mark" aria-hidden="true"><svg viewBox="0 0 93 24" fill="currentColor">${$('.hdr__logo svg').innerHTML.replace(/<defs>.*?<\/defs>/s,'').replace('url(#kshine)','currentColor')}</svg></div>
      <div class="ftr__bot"><span>Kyber ©2026 · ${T('footer.rights')} · ${T('footer.cities')}</span><button class="conhint mono" type="button" data-open-console>›_ <span class="kb-only">${T('con.hint')}</span><span class="touch-only">${T('common.console')}</span></button><span>${T('footer.proposal')}</span></div>`;
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
      if (el.classList.contains('hero__title')) {
        // "single clock" reveal: words arrive out of sync, then lock onto one timeline
        G.set(words, { yPercent: () => G.utils.random(-130, 130), opacity: 0, filter: 'blur(12px)' });
        G.to(words, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', stagger: { each: .07, from: 'random' }, delay: .1,
          onComplete: () => { G.fromTo(el, { textShadow: '0 0 0px transparent' }, { keyframes: [{ scale: 1.012, duration: .12 }, { scale: 1, duration: .5, ease: 'expo.out' }] }); } });
        return;
      }
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
    FX.magnetic(main); FX.spotlight(main); FX.tilt(main);
    initFlow(main); applyRepo();
    // kicker scramble
    if (ST && !RM) $$('.kicker', main).forEach(k => ST.create({ trigger: k, start: 'top 92%', once: true, onEnter: () => FX.scramble(k) }));
    // terminal tabs
    const tp = $('.js-term', main);
    if (tp) {
      const TABS = [
        [['c', '# Open source core · AGPL v3'], ['p', '$ ', CLONE], ['o', "Cloning into 'kyber'..."], ['p', '$ ', 'cd kyber && ls'], ['o', 'README.md  docs/  …']],
        [['c', '# Architecture, guides and API reference'], ['p', '$ ', 'open ' + DOCS], ['p', '$ ', 'open ' + GL + '#where-to-start']],
        [['c', '# demo session readout'], ['k', '▸ kyber  ', 'transport  quic/h3 · 1 port · e2e'], ['k', '▸ kyber  ', 'streams    video · audio · control · telemetry'], ['k', '▸ kyber  ', 'clock      unified · drift 0.00 ms'], ['s', '▸ kyber  ', 'latency    8.4 ms glass-to-glass ✓']]
      ];
      const html = (l) => l[0] === 'c' ? `<span class="c">${esc(l[1])}</span>` : l[0] === 'o' ? `<span class="c">${esc(l[1])}</span>` : l[0] === 'p' ? `<span class="p">${l[1]}</span>${esc(l[2])}` : `<span class="${l[0]}">${l[1]}</span>${esc(l[2])}`;
      let tmr; const typeTab = (n) => {
        clearTimeout(tmr); const lines = TABS[n]; let i = 0, c = 0; const out = [];
        if (RM) { tp.innerHTML = lines.map(html).join('\n'); return; }
        const step = () => {
          if (i >= lines.length) { tp.innerHTML = out.join('\n') + '\n<span class="caret"></span>'; return; }
          const l = lines[i]; const pre = l.length === 3 ? l[1] : ''; const body = l.length === 3 ? l[2] : l[1]; c += 3;
          const part = body.slice(0, c); const fake = l.length === 3 ? [l[0], pre, part] : [l[0], part];
          tp.innerHTML = [...out, html(fake)].join('\n') + '<span class="caret"></span>';
          if (c >= body.length) { out.push(html(l)); i++; c = 0; tmr = setTimeout(step, 160); } else tmr = setTimeout(step, 16);
        }; step();
      };
      const tabs = $$('.term__tabs button', main);
      tabs.forEach(b => b.addEventListener('click', () => { tabs.forEach(x => x.setAttribute('aria-selected', x === b)); typeTab(+b.dataset.tab); }));
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { typeTab(0); io.disconnect(); } }); io.observe(tp);
      on(() => { clearTimeout(tmr); io.disconnect(); });
    }
    // VLC → Kyber timeline
    const tl = $('#tl', main);
    if (tl) {
      const track = $('#tlTrack', tl), items = $$('.tl__item', tl);
      if (ST && G && !RM && innerWidth > 760) {
        const rtl = document.documentElement.dir === 'rtl';
        const dist = () => Math.max(0, track.scrollWidth - innerWidth + 40);
        G.to(track, { x: () => (rtl ? 1 : -1) * dist(), ease: 'none', scrollTrigger: { trigger: tl, start: 'top top', end: () => '+=' + (dist() + innerHeight * .4), pin: $('.tl__pin', tl), scrub: .6, invalidateOnRefresh: true,
          onUpdate: (sx) => { const k = sx.progress * (items.length - .2); items.forEach((it, i) => it.classList.toggle('on', i <= k)); } } });
      } else items.forEach(i => i.classList.add('on'));
    }

    // hero
    const gl = $('#heroGl', main); if (gl) on(FX.hero(gl));
    // real metrics bindings (frame interval, jitter, input delay)
    const fmt1 = (v) => (v == null ? '—' : num(v, { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
    const bindM = () => {
      const m = FX.metrics;
      $$('.js-p50', main).forEach(e => e.textContent = fmt1(m.p50));
      $$('.js-p95', main).forEach(e => e.textContent = fmt1(m.p95));
      $$('.js-jit', main).forEach(e => e.textContent = fmt1(m.p95 - m.p50));
      $$('.js-hz', main).forEach(e => e.textContent = m.hz);
      $$('.js-long', main).forEach(e => e.textContent = m.longF);
      $$('.js-frame', main).forEach(e => e.textContent = m.frames);
      if (m.inputNext != null) { $$('.js-input', main).forEach(e => e.textContent = fmt1(m.inputNext) + ' ms'); $$('.js-inputhint', main).forEach(e => e.style.visibility = 'hidden'); }
      $$('.js-rframe', main).forEach(e => e.style.setProperty('--w', Math.min(100, m.p50 / 200 * 100) + '%'));
    };
    bindM(); on(FX.onMetrics(bindM));
    if ($('#spark', main)) on(FX.realSpark($('#spark', main)));
    if ($('#scopeCv', main)) on(FX.scope($('#scopeCv', main)));
    if ($('#inspBody', main)) on(FX.inspector($('#inspBody', main), { delivered: t('tech.stDelivered'), skipped: t('tech.stSkipped'), retx: t('tech.stRetx'), acked: t('tech.stAcked') }, $('#inspLoss', main)));
    if ($('#fec', main)) FX.fec($('#fec', main), { ok: t('tech.fecOk'), fail: t('tech.fecFail'), intact: t('tech.fecIntact') });
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
        total.textContent = Math.round(Math.min(1, p * 1.1) * 8);
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

  function applyRepo() {
    $$('.js-stars').forEach(e => e.textContent = num(REPO.stars));
    $$('.js-forks').forEach(e => e.textContent = num(REPO.forks));
    $$('.js-last').forEach(e => e.textContent = relTime(REPO.last));
    $$('.js-livestate').forEach(e => e.textContent = REPO.live ? t('home.ossLiveOk') + ' · ' + REPO.at.toLocaleTimeString('en-GB') : t('home.ossSnapshot') + ' · 2026-10-02');
    $$('[data-repo]').forEach(a => { const v = REPOSNAP[a.dataset.repo]; if (v) { a.querySelector('.js-rs').textContent = v[0]; a.querySelector('.js-rl').textContent = v[1]; } });
    $$('.js-reltag').forEach(e => e.textContent = REL.tag); $$('.js-reldate').forEach(e => e.textContent = REL.date);
    $$('.js-reldl').forEach(e => e.href = REL.dl); $$('.js-relurl').forEach(e => e.href = REL.url);
  }
  async function fetchRepo() {
    try {
      const r = await fetch('https://gitlab.com/api/v4/projects/kyber%2Fkyber'); if (!r.ok) return;
      const d = await r.json(); REPO.stars = d.star_count ?? REPO.stars; REPO.forks = d.forks_count ?? REPO.forks; REPO.last = d.last_activity_at || REPO.last; REPO.live = true; REPO.at = new Date(); applyRepo();
    } catch (e) { }
    try {
      const r = await fetch('https://gitlab.com/api/v4/groups/kyber/projects?include_subgroups=true&per_page=50'); if (r.ok) { (await r.json()).forEach(p => { if (REPOSNAP[p.path_with_namespace]) REPOSNAP[p.path_with_namespace] = [p.star_count, (p.last_activity_at || '').slice(0, 10)]; }); applyRepo(); }
    } catch (e) { }
    try {
      const r = await fetch('https://gitlab.com/api/v4/projects/78083474/releases?per_page=1'); if (r.ok) { const [x] = await r.json(); if (x) { REL.tag = x.tag_name; REL.date = (x.released_at || '').slice(0, 10); REL.url = x._links?.self || REL.url; const a = (x.assets?.links || []).find(l => /\.exe$/.test(l.name)); if (a) { REL.dl = a.url; REL.file = a.name; } applyRepo(); } }
    } catch (e) { }
  }

  /* ---------------- router ---------------- */
  let first = true, lastPath = null, pendingAnchor = null;
  function parse() { const h = location.hash.replace(/^#\/?/, ''); return h.split('?')[0]; }
  async function route(force) {
    const path = parse();
    if (path === 'play' || path === 'main' || path === 'careers') return; // in-page anchors
    if (!force && path === lastPath) return;
    const doWipe = !first && !RM && window.gsap;
    const wipe = $('#wipe');
    if (doWipe) await gsap.fromTo(wipe, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .16, ease: 'power2.in' });
    cleanups.forEach(f => { try { f && f(); } catch (e) { } }); cleanups = [];
    window.ScrollTrigger && ScrollTrigger.getAll().forEach(s => s.kill());
    const main = $('#main');
    let html, active = path.split('/')[0];
    if (path.startsWith('solutions/') && SOL.includes(path.split('/')[1])) html = pageSolution(path.split('/')[1]);
    else if (path === 'technology') html = pageTech();
    else if (path === 'about') html = pageAbout();
    else if (path === 'sdk') html = pageSdk();
    else if (path === 'blog') html = pageBlog();
    else if (path === 'simple') { html = pageSimple(); active = 'simple'; }
    else if (path === 'contact' || path === 'connect') { html = pageConnect(); active = 'connect'; }
    else { html = pageHome(); active = ''; }
    main.innerHTML = html;
    document.documentElement.classList.toggle('is-simple', path === 'simple');
    const sl = $('#sLang', main); if (sl) sl.addEventListener('change', () => setLang(sl.value));
    $$('.hdr__nav>a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#/' + active && active));
    $('.dd').classList.toggle('is-active', active === 'solutions');
    closeMenus();
    const anchor = pendingAnchor; pendingAnchor = null;
    if (!force || lastPath !== path) { lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0); }
    lastPath = path;
    animate(main);
    if (window.ScrollTrigger) { ScrollTrigger.sort && ScrollTrigger.sort(); ScrollTrigger.refresh(); }
    const rf = () => window.ScrollTrigger && ScrollTrigger.refresh();
    document.fonts && document.fonts.ready.then(rf);
    $$('img', main).forEach(im => !im.complete && im.addEventListener('load', rf, { once: true }));
    setTimeout(rf, 1200);
    if (anchor) setTimeout(() => { const el = document.getElementById(anchor); el && (lenis ? lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView()); }, 300);
    if (doWipe) gsap.fromTo(wipe, { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', duration: .22, ease: 'power2.out' });
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
    $('#mnav').addEventListener('change', (e) => { if (e.target.matches('[data-mlang]')) { closeMenus(); setLang(e.target.value); } });
    $('#mnav').addEventListener('click', (e) => { if (e.target.closest('[data-mtheme]')) $('#themeBtn').click(); if (e.target.closest('[data-open-console]')) closeMenus(); });
    $('#langList').addEventListener('click', (e) => { const b = e.target.closest('button[data-l]'); if (!b) return; closeMenus(); setLang(b.dataset.l); });
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
      if (a.dataset.anchor) pendingAnchor = a.dataset.anchor;
      if (href === '#play' || href === '#main') { e.preventDefault(); const el = document.querySelector(href); lenis ? lenis.scrollTo(el, { offset: -60 }) : el.scrollIntoView({ behavior: 'smooth' }); }
      else if (href === location.hash || (href === '#/' && !parse())) { e.preventDefault(); if (a.dataset.anchor) route(true); else lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }); closeMenus(); }
    });
    // copy buttons (delegated)
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-copy]'); if (!b) return;
      try { navigator.clipboard && navigator.clipboard.writeText(b.dataset.copy); } catch (x) { }
      const o = b.textContent; b.textContent = t('common.copied'); setTimeout(() => b.textContent = t('common.copy'), 1500);
    });
    // theme
    $('#themeBtn').addEventListener('click', (e) => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      const apply = () => { document.documentElement.dataset.theme = next; $('meta[name="theme-color"]').content = next === 'dark' ? '#040706' : '#eef3f1'; };
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
      const p = parse(); const hideDock = p === 'sdk' || p === 'connect' || p === 'contact';
      $('#dock').classList.toggle('on', y > innerHeight * .8 && !hideDock && h - y > 300);
    };
    // smooth scroll
    if (false && window.Lenis) {
      lenis = new Lenis({ lerp: .11, smoothWheel: true });
      lenis.on('scroll', (e) => {
        window.ScrollTrigger && ScrollTrigger.update(); onScroll(e.scroll);
        const m = $('.marq__t'); if (m && m.getAnimations) { const a = m.getAnimations()[0]; if (a) a.playbackRate = 1 + Math.min(6, Math.abs(e.velocity || 0) * .25); }
      });
      if (window.gsap) { gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
      else { const r = (t) => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
    } else addEventListener('scroll', () => onScroll(scrollY), { passive: true });
    // header ping
    const ping = $('#ping'); FX.onMetrics((m) => { ping.textContent = m.p50.toFixed(1); });
    FX.cursor();
    FX.magnetic(document.querySelector('.hdr'));
    addEventListener('hashchange', () => route());
  }


  /* ---------------- external link interstitial ---------------- */
  function initExternal() {
    const m = document.createElement('div'); m.className = 'xm'; m.id = 'xm'; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'xmT');
    document.body.appendChild(m);
    let target = null, last = null;
    const kind = (u) => u.protocol === 'mailto:' ? 'mail' : /\.(exe|zip|dmg|pkg|msi)$/i.test(u.pathname) ? 'file' : /(^|\.)kyber\.tech$/.test(u.hostname) ? 'kyber' : /gitlab\.(com|io)$/.test(u.hostname) ? 'gitlab' : 'other';
    const open = (a) => {
      const u = new URL(a.href, location.href); target = a; last = document.activeElement;
      const k = kind(u); const dest = u.protocol === 'mailto:' ? u.pathname : u.hostname + (u.pathname.length > 1 ? u.pathname.replace(/\/$/, '') : '');
      m.innerHTML = `<div class="xm__card" role="document">
        <div class="xm__sig" aria-hidden="true"><i></i><i></i><i></i></div>
        <span class="kicker">${T('ext.kicker')}</span>
        <h2 id="xmT">${T('ext.title')}</h2>
        <p class="xm__kind">${T('ext.k_' + k)}</p>
        <code class="xm__dest mono" dir="ltr">${esc(dest.length > 70 ? dest.slice(0, 67) + '…' : dest)}</code>
        <p class="xm__note">${T('ext.note')}</p>
        <div class="xm__btns"><button type="button" class="btn btn--ghost" data-stay>${T('ext.stay')}</button><button type="button" class="btn btn--accent" data-go>${T('ext.go')} ${ARRUR}</button></div>
      </div>`;
      m.hidden = false; document.documentElement.classList.add('xm-open'); requestAnimationFrame(() => $('[data-go]', m).focus());
    };
    const close = () => { m.hidden = true; document.documentElement.classList.remove('xm-open'); last && last.focus && last.focus(); };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]'); if (!a || m.contains(a)) return;
      const href = a.getAttribute('href'); if (!href || href.startsWith('#')) return;
      let u; try { u = new URL(href, location.href); } catch (x) { return; }
      if (u.origin === location.origin && u.protocol !== 'mailto:') return;
      e.preventDefault(); e.stopPropagation(); open(a);
    }, true);
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('[data-stay]')) return close();
      if (e.target.closest('[data-go]')) { const a = target; close(); if (!a) return; const u = new URL(a.href, location.href); if (u.protocol === 'mailto:' || a.hasAttribute('download') || !a.target) location.href = a.href; else window.open(a.href, '_blank', 'noopener'); }
    });
    document.addEventListener('keydown', (e) => { if (!m.hidden && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } if (!m.hidden && e.key === 'Tab') { const f = $$('button', m); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 + f.length : 1)) % f.length].focus(); } }, true);
  }

  /* ---------------- developer console ---------------- */
  function initConsole() {
    const el = document.createElement('div'); el.className = 'con'; el.id = 'con'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Console'); el.hidden = true;
    el.innerHTML = `<div class="con__bar"><i></i><i></i><i></i><span class="mono">kyber@browser: ~</span><button class="mono" data-x>esc</button></div><div class="con__out mono" role="log" aria-live="polite"></div><label class="con__in mono"><span>❯</span><input spellcheck="false" autocomplete="off" aria-label="command"></label>`;
    document.body.appendChild(el);
    const out = $('.con__out', el), inp = $('input', el); const hist = []; let hi = 0;
    const print = (txt, cls = '') => { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = txt; out.appendChild(d); out.scrollTop = out.scrollHeight; };
    const f1 = (v) => v == null ? '—' : v.toFixed(2);
    const CMD = {
      help: () => ['help            this list', 'metrics         live frame timing + input delay (this tab)', 'perf            resources this page loaded, with real timings', 'lag <ms|off>    ghost cursor trailing you by <ms> — feel 200 ms', 'repos           Kyber repositories (GitLab)', 'release         latest Windows installer', 'sdk             how to start', 'jobs            open positions', 'theme [dark|light]   switch theme', 'lang <code>     en fr de es pt zh ja hi ar he', 'goto <page>     technology sdk about blog connect', 'whoami          what your browser tells us (stays local)', 'clear · exit'].forEach(l => print(l)),
      metrics: () => { const m = FX.metrics; print(`frame p50 ${f1(m.p50)} ms · p95 ${f1(m.p95)} ms · jitter ${f1(m.p95 - m.p50)} ms`); print(`refresh ≈ ${m.hz} Hz · frames ${m.frames} · long frames (>50 ms) ${m.longF}`); print(`last input → next frame ${m.inputNext == null ? '— (press a key)' : f1(m.inputNext) + ' ms'} · handler delay ${f1(m.input)} ms`); print('kyber end-to-end target: 8–10 ms (optimal conditions)', 'dim'); },
      perf: () => { const nav = performance.getEntriesByType('navigation')[0]; if (nav) print(`navigation  ttfb ${f1(nav.responseStart)} ms · dom ${f1(nav.domContentLoadedEventEnd)} ms · boot ${f1(window.__boot || 0)} ms`); performance.getEntriesByType('resource').slice(-14).forEach(r => print(`${(r.duration).toFixed(1).padStart(7)} ms  ${r.transferSize === 0 ? 'cache' : (r.transferSize / 1024).toFixed(1) + ' kB'}  ${r.name.replace(location.origin, '').split('?')[0].slice(-58)}`)); },
      lag: (a) => { const v = a === 'off' ? 0 : Math.max(0, Math.min(2000, +a || 200)); FX.lag = v; print(v ? `ghost cursor now trails you by ${v} ms. move around. 'lag off' to stop.` : 'ghost cursor off.'); },
      repos: () => REPOS.forEach(([pth]) => { const v = REPOSNAP[pth]; print(`★${String(v[0]).padStart(3)}  ${v[1]}  gitlab.com/${pth}`); }),
      release: () => { print(`${REL.tag}  ${REL.date}  ${REL.file}`); print(REL.url, 'dim'); },
      sdk: () => { print('$ ' + CLONE); print('docs   ' + DOCS); print('build  gitlab.com/kyber/apps/kyber-desktop'); print('embed  gitlab.com/kyber/core/kysdk  (Rust · C via cbindgen · JS via wasm-bindgen)'); },
      jobs: () => ['j1', 'j2', 'j3', 'j4', 'j5'].forEach(j => print('· ' + t('about.' + j))),
      theme: (a) => { const n = a || (document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); document.documentElement.dataset.theme = n; print('theme → ' + n); },
      lang: (a) => { if (!a) return print('lang <code>'); setLang(a); print('lang → ' + a); },
      goto: (a) => { location.hash = '#/' + (a || ''); print('route → /' + (a || '')); },
      whoami: () => { print(`lang ${navigator.language} · tz ${Intl.DateTimeFormat().resolvedOptions().timeZone}`); print(`viewport ${innerWidth}×${innerHeight} @${devicePixelRatio}x · ${FX.metrics.hz} Hz · cores ${navigator.hardwareConcurrency || '?'}`); print(`webtransport ${'WebTransport' in window ? 'yes' : 'no'} · webcodecs ${'VideoEncoder' in window ? 'yes' : 'no'} · webgpu ${'gpu' in navigator ? 'yes' : 'no'}`); print('nothing leaves this tab.', 'dim'); },
      clear: () => { out.innerHTML = ''; }, exit: () => close(), sudo: () => print('nice try. latency is not negotiable.', 'dim'), vlc: () => print('▲ 7B+ downloads. the cone approves.', 'dim'), ping: () => { const t0 = performance.now(); fetch('i18n/en.json', { cache: 'no-store' }).then(() => print(`HTTP round trip to this site: ${(performance.now() - t0).toFixed(1)} ms (not Kyber — your network + CDN)`)); }
    };
    const run = (line) => { print('❯ ' + line, 'cmd'); const [c, ...a] = line.trim().split(/\s+/); if (!c) return; (CMD[c] || (() => print(`${c}: command not found — try help`, 'err')))(a.join(' ')); };
    const open = () => { el.hidden = false; if (!out.childElementCount) { print('kyber console · ' + t('con.welcome'), 'dim'); print(`boot ${Math.round(window.__boot || 0)} ms · frame p50 ${FX.metrics.p50.toFixed(1)} ms · ${FX.metrics.hz} Hz`, 'dim'); } requestAnimationFrame(() => inp.focus()); };
    const close = () => { el.hidden = true; $('#conBtn')?.focus(); };
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const v = inp.value; inp.value = ''; if (v.trim()) { hist.push(v); hi = hist.length; } run(v); }
      else if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); inp.value = hist[hi] || ''; e.preventDefault(); }
      else if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; e.preventDefault(); }
      else if (e.key === 'Escape') close();
      else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(CMD).find(k => k.startsWith(inp.value)); if (m) inp.value = m + ' '; }
    });
    $('[data-x]', el).addEventListener('click', close);
    document.addEventListener('pointerdown', (e) => { if (!el.hidden && !e.target.closest('#con,#conBtn,[data-open-console]')) close(); }, true);
    $('#conBtn').addEventListener('click', () => el.hidden ? open() : close());
    document.addEventListener('click', (e) => { if (e.target.closest('[data-open-console]')) { e.preventDefault(); e.stopPropagation(); el.hidden ? open() : close(); } }, true);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.hidden) { e.preventDefault(); close(); } }, true);
    addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable]')) return;
      const k = (e.key || '').toLowerCase();
      const plainK = k === 'k' && !e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey;
      const cmdK = k === 'k' && (e.metaKey || e.ctrlKey);
      if (e.key === 'Escape' && !el.hidden) { e.preventDefault(); close(); return; }
      if (plainK || cmdK || e.key === '`') { e.preventDefault(); el.hidden ? open() : close(); }
    });
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const loaderNum = $('#loaderNum'), bar = $('#loaderBar');
    const q = new URLSearchParams(location.search).get('lang');
    const want = q || 'en';
    const loadP = (async () => { EN = await load('en'); await setLang(want, false); })();
    ui(); initConsole(); initA11y(); initExternal();
    await loadP;
    route(true);
    window.__boot = performance.now();
    loaderNum.textContent = Math.round(window.__boot); bar.style.width = '100%';
    setTimeout(() => $('#loader').classList.add('done'), 120);
    fetchRepo();
  }
  boot();
})();
