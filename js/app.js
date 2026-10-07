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
  const LANGS = [["en", "English", "English"], ["zh", "简体中文", "Chinese (Simplified)"], ["hi", "हिन्दी", "Hindi"], ["es", "Español", "Spanish"], ["ar", "العربية", "Arabic"], ["fr", "Français", "French"], ["bn", "বাংলা", "Bengali"], ["pt", "Português", "Portuguese"], ["id", "Bahasa Indonesia", "Indonesian"], ["ur", "اردو", "Urdu"], ["ru", "Русский", "Russian"], ["de", "Deutsch", "German"], ["ja", "日本語", "Japanese"], ["pcm", "Naijá", "Nigerian Pidgin"], ["mr", "मराठी", "Marathi"], ["vi", "Tiếng Việt", "Vietnamese"], ["te", "తెలుగు", "Telugu"], ["sw", "Kiswahili", "Swahili"], ["ha", "Hausa", "Hausa"], ["tr", "Türkçe", "Turkish"], ["pa", "ਪੰਜਾਬੀ", "Punjabi"], ["fil", "Filipino", "Filipino (Tagalog)"], ["ta", "தமிழ்", "Tamil"], ["zh-Hant", "繁體中文", "Chinese (Traditional)"], ["fa", "فارسی", "Persian"], ["ko", "한국어", "Korean"], ["am", "አማርኛ", "Amharic"], ["th", "ไทย", "Thai"], ["jv", "Basa Jawa", "Javanese"], ["it", "Italiano", "Italian"], ["gu", "ગુજરાતી", "Gujarati"], ["kn", "ಕನ್ನಡ", "Kannada"], ["yo", "Yorùbá", "Yoruba"], ["bho", "भोजपुरी", "Bhojpuri"], ["pl", "Polski", "Polish"], ["my", "မြန်မာ", "Burmese"], ["or", "ଓଡ଼ିଆ", "Odia"], ["ml", "മലയാളം", "Malayalam"], ["uk", "Українська", "Ukrainian"], ["uz", "Oʻzbekcha", "Uzbek"], ["ro", "Română", "Romanian"], ["nl", "Nederlands", "Dutch"], ["ps", "پښتو", "Pashto"], ["az", "Azərbaycanca", "Azerbaijani"], ["su", "Basa Sunda", "Sundanese"], ["ne", "नेपाली", "Nepali"], ["ms", "Bahasa Melayu", "Malay"], ["zu", "isiZulu", "Zulu"], ["el", "Ελληνικά", "Greek"], ["he", "עברית", "Hebrew"]];
  const AUD = ["en", "fr", "de", "es", "pt", "zh", "ja", "hi", "ar", "he"];
  const RTL = ["ar", "he", "ur", "fa", "ps"];
  const SX = ["zh", "zh-Hant", "ja", "ko", "hi", "mr", "ne", "bho", "bn", "pa", "gu", "or", "ta", "te", "kn", "ml", "th", "my", "am", "ar", "ur", "fa", "ps", "he"];
  const FONTS = {"zh": "Noto+Sans+SC:wght@400;500;700", "zh-Hant": "Noto+Sans+TC:wght@400;500;700", "ja": "Noto+Sans+JP:wght@400;500;700", "ko": "Noto+Sans+KR:wght@400;500;700", "ar": "IBM+Plex+Sans+Arabic:wght@400;500;600", "he": "Heebo:wght@400;500;700", "hi": "Noto+Sans+Devanagari:wght@400;500;600", "mr": "Noto+Sans+Devanagari:wght@400;500;600", "ne": "Noto+Sans+Devanagari:wght@400;500;600", "bho": "Noto+Sans+Devanagari:wght@400;500;600", "bn": "Noto+Sans+Bengali:wght@400;500;600", "pa": "Noto+Sans+Gurmukhi:wght@400;500;600", "gu": "Noto+Sans+Gujarati:wght@400;500;600", "or": "Noto+Sans+Oriya:wght@400;500;600", "ta": "Noto+Sans+Tamil:wght@400;500;600", "te": "Noto+Sans+Telugu:wght@400;500;600", "kn": "Noto+Sans+Kannada:wght@400;500;600", "ml": "Noto+Sans+Malayalam:wght@400;500;600", "th": "Noto+Sans+Thai:wght@400;500;600", "my": "Noto+Sans+Myanmar:wght@400;500;600", "am": "Noto+Sans+Ethiopic:wght@400;500;600", "ur": "Noto+Nastaliq+Urdu:wght@400;500;600", "fa": "Vazirmatn:wght@400;500;600", "ps": "Noto+Naskh+Arabic:wght@400;500;600", "ru": "Inter:wght@400;500;600", "uk": "Inter:wght@400;500;600", "el": "Inter:wght@400;500;600", "vi": "Inter:wght@400;500;600"};
  const cache = {};
  let D = {}, EN = {}, LANG = 'en';
  const get = (o, k) => k.split('.').reduce((a, p) => (a && a[p] != null ? a[p] : undefined), o);
  const RTLFIX = (s) => RTL.includes(LANG) && typeof s === 'string' ? s.replace(/(\d+(?:[.,–-]\d+)*\s?ms)\b/g, '\u2066$1\u2069') : s;
  const t = (k) => { const v = get(D, k); return RTLFIX(v != null && v !== '' ? v : (get(EN, k) ?? '')); };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = (k) => esc(t(k));
  async function load(l) {
    if (cache[l]) return cache[l];
    const r = await fetch(`i18n/${l}.json?v=1791383595`); if (!r.ok) throw new Error('lang'); return (cache[l] = await r.json());
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
    const html = document.documentElement; html.lang = l; html.dir = RTL.includes(l) ? 'rtl' : 'ltr'; html.classList.toggle('sx', SX.includes(l));
    try { const u = new URL(location.href); if (l === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch (e) { }
    $('#langCode').textContent = l.split('-')[0].toUpperCase();
    $$('#langList button').forEach(b => b.setAttribute('aria-selected', b.dataset.l === l));
    document.title = t('meta.title');
    $$('[data-i]').forEach(e => e.textContent = t(e.dataset.i));
    $$('[data-ia]').forEach(e => e.setAttribute('aria-label', t(e.dataset.ia)));
    $$('[data-it]').forEach(e => e.setAttribute('title', t(e.dataset.it)));
    const cur = LANGS.find(x => x[0] === l); $$('.js-langname').forEach(e => e.textContent = cur ? cur[1] : l);
    renderChrome();
    if (rerender) route(true);
  }

  /* ---------------- icons ---------------- */
  const ARRL = '<svg class="arr arr--l" viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 7H1M6 2L1 7l5 5"/></svg>';
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
  POSTS.forEach(p => { p.s = p.u.split('/')[2]; });
  const HERO = {"first-fundraising-announcement": "img/blog/i_s_KC_Kk_Sk_4_K_e513736b94.webp", "v-027": "img/blog/Kyber_release_0_27_1_ed7beaae7e.webp", "v-026": "img/blog/Creative_Workstations_3_D_Video_CAD_21580c1546.webp", "v-025": "img/blog/364c68af5adda22e370fa317d1b86c73c6c627e0_0d0c48bdd8.webp", "avatar-medical-and-kyber-awarded": "img/blog/Kyber_and_Avatar_Medical_d0de18bd2e.webp", "kyberatvivatech": "img/blog/Design_sans_titre_1_cefe71b05b.webp", "v-028": "img/blog/Kyber_release_0_28_278d96fecc.webp"};
  const LEGAL = { privacy: 'doc-p', cookies: 'doc-c', terms: 'doc-t' };
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
  const repoWall = () => `<div class="repos">${REPOS.map(([path, k, grp]) => { const [st, last] = REPOSNAP[path]; const name = path.split('/').pop(); return `<a class="repo-c rv" data-tilt href="https://gitlab.com/${path}" target="_blank" rel="noopener" data-repo="${path}"><div class="repo-c__h"><span class="mono grp">${grp}/</span><b class="mono">${name}</b><span class="dotok" title="${T('ui.active')}"></span></div><p>${T('home.' + k)}</p><div class="repo-c__m mono"><span>★ <span class="js-rs">${st}</span></span><span class="js-rl">${last}</span></div></a>`; }).join('')}</div>`;
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
      <a class="rv" data-tilt href="#/blog/first-fundraising-announcement"><span class="mono">01</span><b>${T('home.proof1t')}</b><p>${T('home.proof1d')}</p></a>
      <a class="rv" data-tilt href="#/blog/avatar-medical-and-kyber-awarded"><span class="mono">02</span><b>${T('home.proof2t')}</b><p>${T('home.proof2d')}</p></a>
      <a class="rv" data-tilt href="#/blog/kyberatvivatech"><span class="mono">03</span><b>${T('home.proof3t')}</b><p>${T('home.proof3d')}</p></a>
      <a class="rv" data-tilt href="#/blog/first-fundraising-announcement"><span class="mono">04</span><b>${T('home.proof4t')}</b><p>${T('home.proof4d')}</p></a>
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
        ${LEADS.map(([ini, k, n, u], i) => `<a class="lead-card rv" data-tilt href="${u}" target="_blank" rel="noopener"><div class="avatar" style="--a:${i * 90}deg"><img src="img/${k}.webp" alt="${n}" loading="lazy" width="160" height="160"><span aria-hidden="true">${ini}</span></div><div><h4>${n}</h4><span class="role">${T('team.' + k + 'Role')}</span><p>${T('team.' + k + 'Bio')}</p></div><span class="li">${LI} LinkedIn ↗</span></a>`).join('')}
        <div class="team__count rv"><b>25+</b><p>${T('team.lead')}</p><a class="btn btn--ghost btn--sm" href="#/careers">${T('team.join')} ${ARR}</a></div>
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
      <div class="news">${POSTS.slice(0, 4).map(p => `<a class="rv" href="#/blog/${p.s}"><span class="d">${fmtDate(p.d)}</span><h3>${T('blog.' + p.k)}</h3><span class="meta"><span class="chip">${T(p.c === 'r' ? 'blog.releases' : 'blog.announcements')}</span>${ARRUR}</span></a>`).join('')}</div>
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
      <div class="jobs">${jobs.map(([k, u]) => `<a class="job rv" href="#/careers/${u.split('/').pop()}"><h3>${T('about.' + k)}</h3><span class="chip">${T('about.contract')}</span><span class="chip">${T(k === 'j5' ? 'about.jobLocFde' : 'about.jobLoc')}</span><span class="go">${ARRUR}</span></a>`).join('')}</div>
      <p class="mono stackline rv"><span class="accent">$</span> cat stack.txt → ${T('about.stackLine')}</p>
      <div class="btns rv" style="margin-top:1.4rem"><a class="btn btn--accent magnetic" href="#/careers">${T('car.kicker')} ${ARR}</a></div>
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
      <div class="phero__grid phero__grid--sdk" style="align-items:center">
        <div>${kicker('sdk.kicker')}${headline('sdk.titleA', 'sdk.titleB', 'phero__title phero__title--sdk')}<p class="lead rv">${T('sdk.lead')}</p>
          <button type="button" class="installcta rv" data-sdkm><span class="installcta__ico mono" aria-hidden="true">$_</span><span class="installcta__txt"><b>${T('sdkm.cta')}</b><small>${T('sdkm.ctaSub')}</small></span><span class="installcta__go" aria-hidden="true">${ARR}</span></button>
          <div class="btns rv" style="margin-top:1rem"><a class="btn btn--ghost magnetic" href="${GL}" target="_blank" rel="noopener">${T('sdk.download')} ${ARRUR}</a> ${btnStar()} ${btnDocs()}</div></div>
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
      <a class="accent mono" href="#/blog/${u.split('/')[2]}">${T('sdk.readNotes')} →</a></details>`).join('')}</div>`;
  }

  function pageSimple() {
    const big = (href, ico, k, ext) => `<a class="sbtn" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><span class="sbtn__i" aria-hidden="true">${ico}</span><span><b>${T('simple.' + k)}</b><small>${T('simple.' + k + 'd')}</small></span></a>`;
    const words = ['whatD', 'whatD2', 'whyD', 'h1', 'h2', 'h3', 'u1', 'u2', 'u3', 'u4', 'whoD', 'freeD'].map(k => t('simple.' + k)).join(' ');
    const cjk = (words.match(/[\u3040-\u30ff\u4e00-\u9fff]/g) || []).length; const mins = Math.max(1, Math.round(cjk ? cjk / 250 : words.split(/\s+/).length / 120));
    return `
    <section class="simple"><div class="simple__in">
      <h1>${T('simple.title')}</h1>
      <div class="simple__bar">
        <div class="simple__lang"><span class="simple__lbl" id="sLangL">${T('simple.langLabel')}</span><button type="button" class="sselect" data-langmodal aria-describedby="sLangL"><span>${(LANGS.find(x => x[0] === LANG) || [0, LANG])[1]}</span><svg viewBox="0 0 12 8" width="14" height="10" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
        <div class="simple__listen">
          <span class="simple__min"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${esc(fill(t('simple.read'), { n: num(mins) }))}</span>
          ${AUD.includes(LANG) ? `<button type="button" class="splay" id="sPlay" aria-label="${T('simple.listenAria')}" aria-pressed="false"><span class="splay__i" aria-hidden="true"><svg class="i-play" viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg><svg class="i-pause" viewBox="0 0 24 24" width="22" height="22"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg></span><span class="splay__t"><b id="sPlayL">${T('simple.listen')}</b><small id="sPlayTime" class="mono" dir="ltr"></small></span><i class="splay__bar" aria-hidden="true"><i id="sPlayBar"></i></i></button>
          <audio id="sAudio" preload="metadata" src="audio/simple-${LANG}.mp3?v=${window.__v || ''}"></audio>` : ''}
        </div>
      </div>
      <p class="simple__err" id="sErr" role="alert" hidden>${T('simple.audioErr')}</p>
      <h2>${T('simple.what')}</h2><p>${T('simple.whatD')}</p><p>${T('simple.whatD2')}</p>
      <h2>${T('simple.why')}</h2><p>${T('simple.whyD')}</p>
      <h2>${T('simple.how')}</h2>
      <ol class="simple__how">${[1, 2, 3].map(i => `<li><span aria-hidden="true">${num(i)}</span><p>${T('simple.h' + i)}</p></li>`).join('')}</ol>
      <h2>${T('simple.do')}</h2>
      <div class="sbtns">
        ${big(REL.dl, '⬇', 'b1', false)}
        ${big(GL, '</>', 'b2', true)}
        ${big(DOCS, '?', 'b3', true)}
        ${big('#/connect', '✉', 'b4', false)}
      </div>
      <h2>${T('simple.uses')}</h2>
      <ul class="simple__uses">${[1, 2, 3, 4].map(i => `<li>${T('simple.u' + i)}</li>`).join('')}</ul>
      <h2>${T('simple.who')}</h2><p>${T('simple.whoD')}</p>
      <h2>${T('simple.free')}</h2><p>${T('simple.freeD')}</p>
      <div class="sfoot"><a class="sback" href="#/">← ${T('simple.back')}</a><a class="sback" href="#/careers">${T('footer.careers')} →</a></div>
    </div></section>`;
  }
  function initSimple(main) {
    const btn = $('#sPlay', main); if (!btn) return; const au = $('#sAudio', main), L = $('#sPlayL', main), tm = $('#sPlayTime', main), bar = $('#sPlayBar', main), er = $('#sErr', main);
    const f = (x) => isFinite(x) ? `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}` : '';
    const upd = () => { const d = au.duration; tm.textContent = d ? (au.currentTime > 0 ? f(au.currentTime) + ' / ' : '') + f(d) : ''; bar.style.transform = `scaleX(${d ? au.currentTime / d : 0})`; };
    au.addEventListener('loadedmetadata', upd); au.addEventListener('timeupdate', upd);
    au.addEventListener('play', () => { btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true'); L.textContent = t('simple.pause'); });
    au.addEventListener('pause', () => { btn.classList.remove('on'); btn.setAttribute('aria-pressed', 'false'); L.textContent = au.ended || !au.currentTime ? t('simple.listen') : t('simple.resume'); });
    au.addEventListener('ended', () => { au.currentTime = 0; upd(); L.textContent = t('simple.listen'); });
    au.addEventListener('error', () => { er.hidden = false; btn.disabled = true; });
    btn.addEventListener('click', () => { if (au.paused) au.play().catch(() => { er.hidden = false; }); else au.pause(); });
    on(() => { au.pause(); au.removeAttribute('src'); au.load(); });
  }

  function pageBlog() {
    const cover = (p) => HERO[p.s] ? `<img src="${HERO[p.s]}" alt="" loading="lazy">` : p.i ? `<img src="${img(p.i)}" alt="" loading="lazy">` : `<div style="position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(circle at 30% 20%,color-mix(in oklab,var(--accent) 22%,transparent),transparent 60%),repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px 28px),var(--bg2)"><span class="mono" style="font-size:clamp(2.6rem,6vw,4.6rem);letter-spacing:-.04em;color:var(--ink)">v${p.v}</span></div>`;
    return `
    <section class="phero"><div class="wrap">
      ${kicker('blog.kicker')}<h1 class="phero__title split">${T('blog.title')}</h1>
      <div class="filters" role="group">
        <button aria-pressed="true" data-f="*">${T('blog.all')}</button><button aria-pressed="false" data-f="r">${T('blog.releases')}</button><button aria-pressed="false" data-f="a">${T('blog.announcements')}</button>
      </div>
      <div class="posts" id="posts">${POSTS.map((p, i) => `<a data-tilt class="post rv${i === 0 ? ' post--feat' : ''}" data-c="${p.c}" href="#/blog/${p.s}"><div class="post__img">${cover(p)}</div><div class="post__b"><div class="post__m"><span>${T(p.c === 'r' ? 'blog.releases' : 'blog.announcements')}</span><span>${fmtDate(p.d)}</span></div><h3>${T('blog.' + p.k)}</h3><div class="post__m"><span>${p.m} ${T('common.minRead')}</span><span>${T('common.readArticle')} ${ARR}</span></div></div></a>`).join('')}</div>
    </div></section>
    ${ctaBlock()}`;
  }

  const RICO = {
    r1: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
    r2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7 10l3 2-3 2" /></svg>',
    r3: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 20h18M6 16V9M11 16V5M16 16v-4M21 16V8"/></svg>',
    r7: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12l2.5 2.5a2 2 0 0 0 2.8 0L18 9.8"/><path d="M3 10l4-4 3 1 2-1 3 1 4-1 2 4-3 5-3 3-3 1-4-3-5-6z"/></svg>',
    r4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M6 10v5c3 2 9 2 12 0v-5"/></svg>',
    r5: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19l5-6 4 3 7-9"/><path d="M15 7h5v5"/></svg>',
    r8: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19V5h11l5 5v9z"/><path d="M8 13h8M8 16h5M15 5v5h5"/></svg>',
    r6: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 13h18"/></svg>'
  };
  const ROLES = ['r1', 'r2', 'r3', 'r7', 'r4', 'r5', 'r8', 'r6'];
  const BIZ = ['r1', 'r2', 'r3', 'r4', 'r7'], TALK = ['r5', 'r8'], NEEDS_CO = ['r2', 'r3', 'r7'];
  let FS = null;
  const freshFS = () => ({ step: 0, role: null, name: '', email: '', company: '', need: [], other: '', stack: null, lat: 20, scale: null, timeline: null, job: null, link: '', topic: null, org: '', phone: '', channel: null, office: null, day: null, time: null, note: '', consent: false, files: [], voice: null, tried: {} });
  const MAXF = 5, MAXB = 10 * 1024 * 1024, NOTE_MAX = 2000;
  const OKEXT = /\.(pdf|png|jpe?g|webp|gif|svg|heic|txt|md|rtf|docx?|odt|pptx?|odp|key|xlsx?|ods|csv|json|zip|7z|tar|gz|mp3|m4a|wav|ogg|webm|mp4|mov)$/i;
  const fmtB = (b) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k] ?? m);
  const EMAIL_DOMAINS = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'hotmail.fr', 'live.com', 'yahoo.com', 'yahoo.fr', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'orange.fr', 'free.fr', 'wanadoo.fr', 'laposte.net', 'sfr.fr', 'gmx.de', 'web.de', 'gmx.net', 'kyber.tech'];
  const PERSONAL = /^(gmail|googlemail|outlook|hotmail|live|yahoo|icloud|me|proton|protonmail|orange|free|wanadoo|laposte|sfr|gmx|web|aol|mail|yandex|qq|163)\./i;
  const lev = (a, b) => { const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] ? d[i - 2][j - 2] + 1 : 9); return d[m][n]; };
  const emailSuggest = (v) => {
    const m = /^([^@\s]+)@([^@\s]+)$/.exec(v.trim()); if (!m) return null; let dom = m[2].toLowerCase();
    const tl = dom.replace(/\.(con|cmo|ocm|comm|cm|co\.?m|vom|xom)$/, '.com').replace(/\.(fe|ffr)$/, '.fr'); if (tl !== dom && EMAIL_DOMAINS.includes(tl)) return m[1] + '@' + tl;
    if (EMAIL_DOMAINS.includes(dom)) return null;
    let best = null, bd = 3; EMAIL_DOMAINS.forEach(x => { const s = lev(dom, x); if (s < bd) { bd = s; best = x; } });
    return best && bd <= 2 ? m[1] + '@' + best : (tl !== dom ? m[1] + '@' + tl : null);
  };
  function pageConnect() {
    if (!FS) FS = freshFS();
    const jobs = ['j1', 'j2', 'j3', 'j4', 'j5'];
    const days = []; const d0 = new Date(); let d = new Date(d0); d.setDate(d.getDate() + 1);
    while (days.length < 10) { if (d.getDay() % 6 !== 0) days.push(new Date(d)); d.setDate(d.getDate() + 1); }
    const fmtD = (x, o) => { try { return new Intl.DateTimeFormat(LANG, o).format(x); } catch (e) { return x.toDateString(); } };
    const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return 'UTC'; } })();
    const pill = (grp, val, label, multi) => `<button type="button" class="pill" data-g="${grp}" data-v="${esc(val)}"${multi ? ' data-multi="1"' : ''} aria-pressed="false">${label}</button>`;
    const ferr = (f) => `<p class="ferr" id="e_${f}"><span><i aria-hidden="true">!</i><b></b></span></p>`;
    const fld = (id, k, type = 'text', full, extra = '') => `<div class="fld${full ? ' full' : ''}" data-f="${id}"><input id="f_${id}" data-k="${id}" type="${type}" placeholder=" " autocomplete="${{ name: 'name', email: 'email', company: 'organization', link: 'url', phone: 'tel', org: 'organization' }[id] || 'off'}"${type === 'email' ? ' inputmode="email" autocapitalize="off" spellcheck="false"' : ''}${type === 'tel' ? ' inputmode="tel"' : ''}${type === 'url' ? ' inputmode="url" autocapitalize="off" spellcheck="false"' : ''} aria-describedby="e_${id}"${extra}><label for="f_${id}" id="l_${id}">${T(k)}</label><span class="fld__ok" aria-hidden="true"></span>${ferr(id)}</div>`;
    const group = (f, qKey, inner, multi, tag = 'p', cls = 'qs') => `<${tag} class="${cls}" id="q_${f}">${T(qKey)}</${tag}><div class="vgroup" data-f="${f}" role="${multi ? 'group' : 'radiogroup'}" aria-labelledby="q_${f}" aria-describedby="e_${f}">${inner}</div>${ferr(f)}`;
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
      <form class="panel rv" id="panel" novalidate>
        <div class="stage" data-s="0">
          ${group('role', 'flow.q1', `<div class="roles">${ROLES.map(r => `<button type="button" class="chipbtn" data-g="role" data-v="${r}" aria-pressed="false">${RICO[r]}<span>${T('flow.' + r)}</span></button>`).join('')}</div>`, false, 'h2', 'q')}
          <div class="hintbox" id="devHint" hidden><span>${T('flow.devHint')}</span><a class="btn btn--accent btn--sm" href="#/sdk">${T('common.getSdk')} ${ARR}</a></div>
          <div class="grid2">${fld('name', 'flow.name')}${fld('email', 'flow.email', 'email')}${fld('company', 'flow.company', 'text', true)}</div>
        </div>
        <div class="stage" data-s="1">
          <div class="grp" data-show="biz">
            ${group('need', 'flow.q2', `<div class="pills">${SOL.map(x => pill('need', x, T(`solutions.${x}.name`), 1)).join('')}${pill('need', 'other', T('flow.other'), 1)}</div>`, true, 'h2', 'q')}
            <div class="grp" data-show="other"><div class="grid2" style="margin-top:.6rem">${fld('other', 'flow.otherWhat', 'text', true)}</div></div>
            <p class="qs" id="q_stack">${T('flow.q2b')} <small class="opt">${T('flow.optional')}</small></p>
            <div class="vgroup" data-f="stack" role="radiogroup" aria-labelledby="q_stack"><div class="pills">${[1, 2, 3, 4].map(i => pill('stack', 'st' + i, T('flow.st' + i))).join('')}</div></div>
            <p class="qs">${T('flow.q2c')}</p>
            <div class="latpick"><div class="latpick__val"><b id="latVal">20 ms</b><span id="latTxt"></span></div><input type="range" class="range" id="latR" min="5" max="250" value="20" aria-label="${T('flow.q2c')}"></div>
            <p class="qs" id="q_scale">${T('flow.q2d')} <small class="opt">${T('flow.optional')}</small></p>
            <div class="vgroup" data-f="scale" role="radiogroup" aria-labelledby="q_scale"><div class="pills">${['1–10', '10–100', '100–1k', '1k+'].map(v => pill('scale', v, v + ' ' + T('flow.machines'))).join('')}</div></div>
            ${group('timeline', 'flow.q2e', `<div class="pills">${[1, 2, 3].map(i => pill('timeline', 'tl' + i, T('flow.tl' + i))).join('')}</div>`)}
          </div>
          <div class="grp" data-show="talk" hidden>
            ${group('topic', 'flow.topicQ', `<div class="pills">${[1, 2, 3, 4, 5].map(i => pill('topic', 'tp' + i, T('flow.tp' + i))).join('')}</div>`, false, 'h2', 'q')}
            <div class="grid2">${fld('org', 'flow.org', 'text', true)}</div>
          </div>
          <div class="grp" data-show="job" hidden>
            ${group('job', 'flow.jobQ', `<div class="pills">${jobs.map(j => pill('job', j, T('about.' + j))).join('')}</div>`, false, 'h2', 'q')}
            <div class="grid2">${fld('link', 'flow.linkedin', 'url', true)}</div>
            <div class="hintbox"><span>${T('att.cvHint')}</span><a class="btn btn--ghost btn--sm" id="jobGo" href="#/careers">${T('flow.jobApply')} ${ARR}</a></div>
          </div>
        </div>
        <div class="stage" data-s="2">
          ${group('channel', 'flow.q3', `<div class="pills">${[1, 2, 3, 4].map(i => pill('channel', 'c' + i, T('flow.c' + i))).join('')}</div>`, false, 'h2', 'q')}
          <div class="grp" data-show="phone"><div class="grid2">${fld('phone', 'flow.phone', 'tel', true)}</div></div>
          <div class="grp" data-show="office">${group('office', 'flow.office', `<div class="pills">${[1, 2, 3].map(i => pill('office', 'of' + i, T('flow.of' + i))).join('')}</div>`)}</div>
          <div class="grp" data-show="when">
            ${group('day', 'flow.q3b', `<div class="days">${days.map(x => `<button type="button" class="day" data-g="day" data-v="${x.toISOString().slice(0, 10)}" aria-pressed="false" aria-label="${esc(fmtD(x, { weekday: 'long', day: 'numeric', month: 'long' }))}"><small>${fmtD(x, { weekday: 'short' })}</small><b>${fmtD(x, { day: 'numeric' })}</b><small>${fmtD(x, { month: 'short' })}</small></button>`).join('')}</div>`)}
            ${group('time', 'flow.q3c', `<div class="pills">${['morning', 'afternoon', 'evening'].map(v => pill('time', v, T('flow.' + v))).join('')}</div>`)}
            <div class="tzline"><span>${T('flow.tz')}: ${esc(tz)}</span><span>${T('flow.parisTime')}: <b id="parisNow" style="direction:ltr;display:inline-block">--:--</b></span></div>
          </div>
          <div class="grid2"><div class="fld full" data-f="note"><textarea id="f_note" data-k="note" placeholder=" " maxlength="${NOTE_MAX + 200}" aria-describedby="e_note"></textarea><label for="f_note">${T('flow.note')} <small class="opt">${T('flow.optional')}</small></label><span class="fld__count mono" id="noteCount" aria-hidden="true"></span>${ferr('note')}</div></div>
          <div class="att" data-f="files">
            <div class="att__head"><b>${T('att.title')}</b><span>${T('att.sub')}</span></div>
            <label class="att__drop" id="attDrop" tabindex="0" role="button" aria-describedby="attLim e_files">
              <input type="file" id="attIn" multiple hidden accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.svg,.heic,.txt,.md,.rtf,.doc,.docx,.odt,.ppt,.pptx,.odp,.key,.xls,.xlsx,.ods,.csv,.json,.zip,.7z,.tar,.gz,.mp3,.m4a,.wav,.ogg,.webm,.mp4,.mov">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
              <span>${fill(T('att.drop'), { browse: `<u>${T('att.browse')}</u>` })}</span>
              <small id="attLim">${T('att.limits')}</small>
            </label>
            <ul class="att__list" id="attList"></ul>
            ${ferr('files')}
            <div class="voice" data-f="voice" id="voice">
              <button type="button" class="voice__rec" id="vRec"><i class="voice__dot" aria-hidden="true"></i><span id="vRecL">${T('att.rec')}</span></button>
              <canvas class="voice__wave" id="vWave" width="320" height="40" aria-hidden="true"></canvas>
              <span class="voice__t mono" id="vTime">${T('att.recMax')}</span>
              <div class="voice__play" id="vPlay" hidden><audio id="vAudio" controls preload="metadata"></audio><button type="button" class="pill" id="vAgain">${T('att.recAgain')}</button><button type="button" class="pill" id="vDel">${T('att.recDelete')}</button></div>
            </div>
            ${ferr('voice')}
          </div>
        </div>
        <div class="stage" data-s="3">
          <h2 class="q">${T('flow.review')}</h2>
          <dl class="sum" id="sum"></dl>
          <div class="consent" data-f="consent"><label class="check"><input type="checkbox" id="f_consent" aria-describedby="e_consent"><span class="check__box" aria-hidden="true"></span><span>${fill(T('flow.consent'), { link: `<a href="#/legal/privacy">${T('flow.privacy')}</a>` })}</span></label>${ferr('consent')}</div>
          <p class="mono" style="font-size:var(--t-xs);color:var(--faint);margin-top:1rem">${T('contact.demoNote')}</p>
        </div>
        <div class="flow__nav">
          <button type="button" class="btn btn--ghost btn--sm" id="fBack">${T('common.back2')}</button>
          <button type="button" class="flow__err" id="fErr" tabindex="-1" aria-live="polite"></button>
          <button type="button" class="btn btn--accent magnetic" id="fNext">${T('common.continue')} ${ARR}</button>
        </div>
        <div class="doneview" role="status">
          <div class="pulse-ring"><i></i><i></i><i></i><b>✓</b></div>
          <div class="big">${T('flow.done')}</div>
          <div class="ms mono" id="doneMs"></div>
          <p>${T('flow.doneLead')}</p>
          <div class="donefiles" id="doneFiles" hidden></div>
          <div class="btns"><a class="btn btn--accent" id="fMail" href="mailto:contact@kyber.tech">${T('flow.sendEmail')} ${ARR}</a> ${btnSdk('btn--ghost')} <button type="button" class="btn btn--ghost" id="fRestart">${T('flow.restart')}</button></div>
        </div>
      </form>
    </div></section>`;
  }

  function initFlow(main) {
    const panel = $('#panel', main); if (!panel) return;
    const st = FS; const G = window.gsap;
    const stages = $$('.stage', panel), stepsEl = $$('.steps li', main), bar = $('#flowBar', main), errBtn = $('#fErr', main);
    const kind = () => isJob() ? 'job' : TALK.includes(st.role) ? 'talk' : 'biz';
    const isJob = () => st.role === 'r6';
    const rtl = () => document.documentElement.dir === 'rtl';
    /* ---------- roving focus inside choice groups: Tab = next field, arrows = move inside a group ---------- */
    const rove = () => $$('.vgroup', panel).forEach(g => { const bs = $$('[data-g]', g); if (!bs.length) return; const sel = bs.find(b => b.getAttribute('aria-pressed') === 'true'); const cur = bs.find(b => b.tabIndex === 0 && b !== sel); const act = sel || (cur && !g.contains(document.activeElement) ? bs[0] : cur) || bs[0]; bs.forEach(b => b.tabIndex = b === (g.contains(document.activeElement) ? document.activeElement : act) ? 0 : -1); });
    panel.addEventListener('keydown', (e) => {
      const b = e.target.closest('.vgroup [data-g]');
      if (b && ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        const bs = $$('[data-g]', b.closest('.vgroup')); let i = bs.indexOf(b); const fw = rtl() ? 'ArrowLeft' : 'ArrowRight', bw = rtl() ? 'ArrowRight' : 'ArrowLeft';
        i = e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : (e.key === fw || e.key === 'ArrowDown') ? (i + 1) % bs.length : (i - 1 + bs.length) % bs.length;
        e.preventDefault(); bs.forEach(x => x.tabIndex = -1); bs[i].tabIndex = 0; bs[i].focus();
        return;
      }
      if (e.key === 'Enter' && e.target.matches('input[data-k]')) { e.preventDefault(); nextField(e.target); }
    });
    const focusables = () => $$('.stage.on :is(input[data-k],textarea,[data-g][tabindex="0"],#attDrop,#vRec,#f_consent,input[type=range])', panel).filter(x => x.offsetParent !== null && !x.closest('[hidden]'));
    const nextField = (el) => { const f = focusables(); const i = f.indexOf(el); const n = f[i + 1]; if (n && !n.matches('[data-g]')) n.focus(); else $('#fNext', main).click(); };
    /* ---------- state -> UI ---------- */
    const sync = () => {
      $$('[data-g]', panel).forEach(b => { const g = b.dataset.g, v = b.dataset.v; const cur = st[g]; b.setAttribute('aria-pressed', Array.isArray(cur) ? cur.includes(v) : cur === v); });
      $$('[data-k]', panel).forEach(i => { if (document.activeElement !== i) i.value = st[i.dataset.k] || ''; });
      const k = kind();
      $('#devHint', panel).hidden = st.role !== 'r1';
      $$('[data-show="biz"]', panel).forEach(e => e.hidden = k !== 'biz'); $$('[data-show="talk"]', panel).forEach(e => e.hidden = k !== 'talk'); $$('[data-show="job"]', panel).forEach(e => e.hidden = k !== 'job');
      $$('[data-show="other"]', panel).forEach(e => e.hidden = !st.need.includes('other'));
      $$('[data-show="when"]', panel).forEach(e => e.hidden = st.channel === 'c3');
      $$('[data-show="phone"]', panel).forEach(e => e.hidden = st.channel !== 'c2');
      $$('[data-show="office"]', panel).forEach(e => e.hidden = st.channel !== 'c4');
      $('#l_email', panel).textContent = t(BIZ.includes(st.role) ? 'flow.email' : 'flow.emailAlt');
      $('#l_company', panel).innerHTML = T('flow.company') + (NEEDS_CO.includes(st.role) ? '' : ` <small class="opt">${T('flow.optional')}</small>`);
      const jg = $('#jobGo', panel); if (jg) { const J = { j1: '/job/senior-windows-systems-developer', j2: '/job/3ddxr-developpper', j3: '/job/network-systems-developer', j4: '/job/sdr-developpper', j5: '/job/forward-deployed-engineer' }; jg.href = J[st.job] ? '#/careers/' + J[st.job].split('/').pop() : '#/careers'; }
      const lr = $('#latR', panel); lr.value = st.lat; $('#latVal', panel).textContent = st.lat + ' ms';
      const lk = st.lat <= 10 ? 'lat1' : st.lat <= 100 ? 'lat2' : st.lat <= 300 ? 'lat3' : 'lat4'; $('#latTxt', panel).textContent = '≈ ' + t('home.' + lk);
      const nc = $('#noteCount', panel); const nl = st.note.length; nc.textContent = nl ? `${nl.toLocaleString(LANG)} / ${NOTE_MAX.toLocaleString(LANG)}` : ''; nc.classList.toggle('over', nl > NOTE_MAX);
      $('#f_consent', panel).checked = !!st.consent;
      renderFiles(); rove();
    };
    /* ---------- validation: one rule per case, one message per field ---------- */
    const rules = (n) => {
      const E = []; const add = (f, k, extra) => E.push({ f, msg: extra ? fill(t('fv.' + k), extra) : t('fv.' + k) });
      if (n === 0) {
        if (!st.role) add('role', 'roleReq');
        const nm = st.name.trim(); if (!nm) add('name', 'nameReq'); else if (!/\p{L}/u.test(nm)) add('name', 'nameBad'); else if (nm.replace(/\s/g, '').length < 2) add('name', 'nameShort');
        const em = st.email.trim();
        if (!em) add('email', 'emailReq');
        else if (/\s/.test(em)) add('email', 'emailSpace');
        else if (!em.includes('@')) add('email', 'emailNoAt');
        else if (em.split('@').length > 2 || em.startsWith('@')) add('email', 'emailBad');
        else { const dom = em.split('@')[1]; if (!dom || !/^[^.]+(\.[^.]+)*\.[\p{L}]{2,}$/u.test(dom) || /\.\./.test(dom)) add('email', 'emailDomain'); }
        if (NEEDS_CO.includes(st.role) && !st.company.trim()) add('company', 'companyReq');
      }
      if (n === 1) {
        const k = kind();
        if (k === 'biz') { if (!st.need.length) add('need', 'needReq'); if (st.need.includes('other') && st.other.trim().length < 3) add('other', 'otherReq'); if (!st.timeline) add('timeline', 'timelineReq'); }
        if (k === 'talk') { if (!st.topic) add('topic', 'topicReq'); }
        if (k === 'job') {
          if (!st.job) add('job', 'jobReq');
          const l = st.link.trim(); if (!l) add('link', 'linkReq');
          else { let ok = false; try { const u = new URL(/^https?:\/\//i.test(l) ? l : 'https://' + l); ok = /\.[a-z]{2,}$/i.test(u.hostname) && !/\s/.test(l); } catch (e) { } if (!ok) add('link', 'linkBad'); }
        }
      }
      if (n === 2) {
        if (!st.channel) add('channel', 'channelReq');
        if (st.channel === 'c2') { const p = st.phone.trim(); const dg = p.replace(/\D/g, ''); if (!p) add('phone', 'phoneReq'); else if (/[^\d\s+().\-]/.test(p) || (p.lastIndexOf('+') > 0)) add('phone', 'phoneBad'); else if (dg.length < 7) add('phone', 'phoneShort'); else if (dg.length > 15) add('phone', 'phoneLong'); }
        if (st.channel === 'c4' && !st.office) add('office', 'officeReq');
        if (st.channel && st.channel !== 'c3') { if (!st.day) add('day', 'dayReq'); if (!st.time) add('time', 'timeReq'); }
        if (st.note.length > NOTE_MAX) add('note', 'noteLong', { n: NOTE_MAX.toLocaleString(LANG) });
      }
      if (n === 3) { if (!st.consent) add('consent', 'consentReq'); }
      return E;
    };
    const wrapOf = (f) => $(`[data-f="${f}"]`, panel);
    const controlOf = (f) => { const w = wrapOf(f); if (!w) return null; return $('input[data-k],textarea,input[type=checkbox]', w) || $('[data-g][tabindex="0"]', w) || $('[data-g]', w); };
    const setErr = (f, msg, anim) => {
      const w = wrapOf(f), box = $('#e_' + f, panel); if (!w || !box) return;
      const was = w.classList.contains('is-invalid');
      w.classList.add('is-invalid'); w.classList.remove('is-valid');
      const c = controlOf(f); if (c && c.matches('input,textarea')) c.setAttribute('aria-invalid', 'true'); else w.setAttribute('aria-invalid', 'true');
      const b = $('b', box); if (b.textContent !== msg) { b.textContent = msg; if (was && !RM) box.animate([{ opacity: .3, transform: 'translateY(-3px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' }); }
      box.classList.add('on');
      if (anim && !RM) w.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 380, easing: 'ease-out' });
    };
    const clrErr = (f, ok) => { const w = wrapOf(f), box = $('#e_' + f, panel); if (!w) return; const had = w.classList.contains('is-invalid'); w.classList.remove('is-invalid'); w.removeAttribute('aria-invalid'); const c = controlOf(f); c?.removeAttribute?.('aria-invalid'); box?.classList.remove('on'); if (had && ok && w.classList.contains('fld')) { w.classList.add('is-valid'); setTimeout(() => w.classList.remove('is-valid'), 1600); } };
    const FIELDS = ['role', 'name', 'email', 'company', 'need', 'other', 'timeline', 'topic', 'job', 'link', 'channel', 'phone', 'office', 'day', 'time', 'note', 'consent'];
    const stageFields = (n) => FIELDS.filter(f => { const w = wrapOf(f); return w && stages[n].contains(w); });
    const summary = (E) => { if (!E.length) { errBtn.classList.remove('on'); errBtn.textContent = ''; return; } errBtn.textContent = E.length === 1 ? t('flow.fix1') : fill(t('flow.fixN'), { n: E.length }); errBtn.classList.add('on'); };
    const apply = (n, { anim = false, only = null } = {}) => {
      const E = rules(n); const bad = new Set(E.map(e => e.f));
      stageFields(n).forEach(f => { if (only && f !== only) return; const e = E.find(x => x.f === f); if (e) setErr(f, e.msg, anim); else clrErr(f, true); });
      if (st.tried[n]) summary(E);
      return E;
    };
    const emailHint = () => {
      const w = wrapOf('email'); let h = $('.fhint', w); const s = emailSuggest(st.email); const dom = (st.email.split('@')[1] || '').toLowerCase();
      const personal = !s && BIZ.includes(st.role) && st.role !== 'r1' && st.role !== 'r4' && PERSONAL.test(dom) && !rules(0).some(e => e.f === 'email');
      if (!s && !personal) { h?.remove(); return; }
      if (!h) { h = document.createElement('p'); h.className = 'fhint'; w.appendChild(h); }
      h.innerHTML = s ? `${esc(fill(t('flow.didYouMean'), { s: '§' })).replace('§', `<button type="button" class="fhint__fix" data-fix="${esc(s)}">${esc(s)}</button>`)}` : esc(t('flow.emailPersonal'));
    };
    /* ---------- steps ---------- */
    const show = (n, dir = 1, focus = false) => {
      st.step = n; clrErr('files'); clrErr('voice');
      stages.forEach((x, i) => { x.classList.toggle('on', i === n); x.inert = i !== n; });
      stepsEl.forEach((x, i) => { x.classList.toggle('on', i === n); x.classList.toggle('done', i < n); });
      bar.style.width = (n / 3 * 100) + '%';
      $('#fBack', main).style.visibility = n ? 'visible' : 'hidden';
      $('#fNext', main).innerHTML = (n === 3 ? T('flow.send') : T('common.continue')) + ' ' + ARR;
      summary([]);
      if (n === 3) renderSum();
      sync();
      const cur = stages[n];
      if (G && !RM) G.fromTo(cur.children, { opacity: 0, y: 24 * dir, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7, stagger: .04, ease: 'expo.out', clearProps: 'filter,transform' });
      if (focus) { const top = panel.getBoundingClientRect().top; if (top < 0 || top > innerHeight * .4) panel.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); setTimeout(() => focusables()[0]?.focus({ preventScroll: true }), 60); }
    };
    const goFirst = (E) => {
      const f = E[0].f; const w = wrapOf(f); const c = controlOf(f) || w;
      const r = w.getBoundingClientRect(); if (r.top < 90 || r.bottom > innerHeight - 40) w.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => c.focus({ preventScroll: true }), RM ? 0 : 280);
    };
    const renderSum = () => {
      const role = st.role ? t('flow.' + st.role) : '—'; const k = kind();
      const need = k === 'job' ? t('about.' + st.job) : k === 'talk' ? [t('flow.' + st.topic), st.org].filter(Boolean).join(' · ') : [st.need.map(x => x === 'other' ? (st.other.trim() || t('flow.other')) : t(`solutions.${x}.name`)).join(', '), st.stack ? t('flow.' + st.stack) : '', st.lat + ' ms', st.scale ? st.scale + ' ' + t('flow.machines') : '', st.timeline ? t('flow.' + st.timeline) : ''].filter(Boolean).join(' · ');
      let when = st.channel ? t('flow.' + st.channel) : '—';
      if (st.channel === 'c4' && st.office) when += ' · ' + t('flow.' + st.office);
      if (st.channel !== 'c3' && st.day) { try { when += ' · ' + new Intl.DateTimeFormat(LANG, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(st.day + 'T12:00')); } catch (e) { when += ' · ' + st.day; } if (st.time) when += ' · ' + t('flow.' + st.time); }
      const files = [...st.files.map(x => `${esc(x.name)} <span class="muted">(${fmtB(x.size)})</span>`), st.voice ? `${T('att.recLabel')} <span class="muted">(${st.voice.dur}s)</span>` : ''].filter(Boolean);
      const rows = [[t('flow.summaryRole'), `${esc(role)}<br><span class="muted">${esc(st.name)} · ${esc(st.email)}${st.company ? ' · ' + esc(st.company) : ''}${st.phone ? ' · ' + esc(st.phone) : ''}</span>`, 0], [t('flow.summaryNeed'), esc(need) + (st.link ? `<br><span class="muted">${esc(st.link)}</span>` : ''), 1], [t('flow.summaryWhen'), esc(when) + (st.note ? `<br><span class="muted">“${esc(st.note)}”</span>` : ''), 2]];
      if (files.length) rows.push([t('att.summaryFiles'), files.join('<br>'), 2]);
      $('#sum', panel).innerHTML = rows.map(([k2, v, s2]) => `<div><dt>${esc(k2)}</dt><dd>${v}</dd><button type="button" data-goto="${s2}">${T('flow.edit')}</button></div>`).join('');
    };
    /* ---------- attachments ---------- */
    let attT = 0; const attErr = (msgs) => { clearTimeout(attT); if (msgs.length) { setErr('files', msgs.join(' '), true); attT = setTimeout(() => clrErr('files'), 9000); } else clrErr('files'); };
    const addFiles = (list) => {
      const msgs = [];
      [...list].forEach(f => {
        if (st.files.length >= MAXF) { if (!msgs.includes(t('att.tooMany'))) msgs.push(t('att.tooMany')); return; }
        if (!OKEXT.test(f.name)) return msgs.push(fill(t('att.badType'), { f: f.name }));
        if (f.size === 0) return msgs.push(fill(t('att.empty'), { f: f.name }));
        if (f.size > MAXB) return msgs.push(fill(t('att.tooBig'), { f: f.name, s: fmtB(f.size) }));
        if (st.files.some(x => x.name === f.name && x.size === f.size)) return msgs.push(fill(t('att.dup'), { f: f.name }));
        st.files.push({ name: f.name, size: f.size, type: f.type, file: f });
      });
      renderFiles(true); attErr(msgs);
    };
    const renderFiles = (anim) => {
      const ul = $('#attList', panel); if (!ul) return;
      ul.innerHTML = st.files.map((f, i) => `<li${anim && i === st.files.length - 1 ? ' class="new"' : ''}><span class="att__ext mono">${esc((f.name.split('.').pop() || '').slice(0, 4).toUpperCase())}</span><span class="att__nm">${esc(f.name)}</span><span class="att__sz mono">${fmtB(f.size)}</span><button type="button" class="att__rm" data-rm="${i}" aria-label="${T('att.remove')} ${esc(f.name)}">✕</button></li>`).join('');
      $('#attDrop', panel).classList.toggle('full', st.files.length >= MAXF);
    };
    const drop = $('#attDrop', panel), inp = $('#attIn', panel);
    inp.addEventListener('change', () => { addFiles(inp.files); inp.value = ''; });
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inp.click(); } });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', (e) => { if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files); });
    /* ---------- voice note ---------- */
    const V = { rec: null, stream: null, chunks: [], t0: 0, raf: 0, timer: 0, an: null, ctx: null };
    const vRec = $('#vRec', panel), vL = $('#vRecL', panel), vT = $('#vTime', panel), vW = $('#vWave', panel), vP = $('#vPlay', panel), vA = $('#vAudio', panel);
    const voiceUI = () => { const has = !!st.voice; vP.hidden = !has; vRec.hidden = has; vW.hidden = has && !V.rec; if (has) { vA.src = st.voice.url; vT.textContent = st.voice.dur + 's'; } else if (!V.rec) { vT.textContent = t('att.recMax'); } };
    const stopRec = () => { if (V.rec && V.rec.state !== 'inactive') V.rec.stop(); };
    const draw = () => { const c = vW.getContext('2d'); const W = vW.width, H = vW.height; const buf = new Uint8Array(V.an.fftSize); const acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2c56f5'; const f = () => { V.an.getByteTimeDomainData(buf); c.clearRect(0, 0, W, H); c.strokeStyle = acc; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < buf.length; i += 8) { const x = i / buf.length * W, y = (buf[i] / 255) * H; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); V.raf = requestAnimationFrame(f); }; f(); };
    vRec.addEventListener('click', async () => {
      if (V.rec) return stopRec();
      clrErr('voice');
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return setErr('voice', t('att.recUnsupported'), true);
      try { V.stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch (e) { return setErr('voice', t(e && (e.name === 'NotFoundError' || e.name === 'OverconstrainedError') ? 'att.recNoMic' : (e && e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'att.recDenied' : 'att.recUnsupported'), true); }
      V.chunks = []; V.rec = new MediaRecorder(V.stream); V.t0 = performance.now();
      try { V.ctx = new (window.AudioContext || window.webkitAudioContext)(); V.an = V.ctx.createAnalyser(); V.an.fftSize = 1024; V.ctx.createMediaStreamSource(V.stream).connect(V.an); draw(); } catch (e) { }
      V.rec.ondataavailable = (e) => e.data.size && V.chunks.push(e.data);
      V.rec.onstop = () => {
        cancelAnimationFrame(V.raf); clearInterval(V.timer); V.stream.getTracks().forEach(x => x.stop()); V.ctx?.close?.();
        const dur = Math.max(1, Math.round((performance.now() - V.t0) / 1000)); const blob = new Blob(V.chunks, { type: V.rec.mimeType || 'audio/webm' });
        V.rec = null; panel.classList.remove('recording'); vRec.classList.remove('on'); vL.textContent = t('att.rec');
        if (blob.size) { if (st.voice) URL.revokeObjectURL(st.voice.url); st.voice = { blob, url: URL.createObjectURL(blob), dur, type: blob.type }; }
        voiceUI();
      };
      V.rec.start(250); panel.classList.add('recording'); vRec.classList.add('on'); vL.textContent = t('att.recStop'); vW.hidden = false;
      V.timer = setInterval(() => { const s = Math.round((performance.now() - V.t0) / 1000); vT.textContent = `${t('att.recording')} ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} / 2:00`; if (s >= 120) stopRec(); }, 250);
    });
    $('#vDel', panel).addEventListener('click', () => { if (st.voice) URL.revokeObjectURL(st.voice.url); st.voice = null; voiceUI(); vRec.focus(); });
    $('#vAgain', panel).addEventListener('click', () => { if (st.voice) URL.revokeObjectURL(st.voice.url); st.voice = null; voiceUI(); vRec.click(); });
    on(() => { stopRec(); });
    voiceUI();
    /* ---------- events ---------- */
    panel.addEventListener('click', (e) => {
      const fx = e.target.closest('[data-fix]'); if (fx) { st.email = fx.dataset.fix; sync(); emailHint(); apply(0, { only: 'email' }); $('#f_email', panel).focus(); return; }
      const rm = e.target.closest('[data-rm]'); if (rm) { st.files.splice(+rm.dataset.rm, 1); renderFiles(); clrErr('files'); (st.files.length ? $('.att__rm', panel) : drop).focus(); return; }
      const b = e.target.closest('[data-g]');
      if (b) {
        const g = b.dataset.g, v = b.dataset.v; if (b.dataset.multi) { const a = st[g]; const i = a.indexOf(v); i < 0 ? a.push(v) : a.splice(i, 1); } else st[g] = st[g] === v && g !== 'role' && g !== 'channel' ? null : v;
        sync(); bs(b); if (st.tried[st.step]) apply(st.step); else clrErr(g);
        if (g === 'role') emailHint();
        return;
      }
      const go = e.target.closest('[data-goto]'); if (go) return show(+go.dataset.goto, -1, true);
      if (e.target === errBtn) { const E = rules(st.step); if (E.length) goFirst(E); }
    });
    const bs = (b) => { const g = b.closest('.vgroup'); if (!g) return; $$('[data-g]', g).forEach(x => x.tabIndex = x === b ? 0 : -1); };
    panel.addEventListener('input', (e) => {
      const k = e.target.dataset.k; if (k) { st[k] = e.target.value; if (k === 'note') sync(); if (st.tried[st.step] || wrapOf(k)?.classList.contains('is-invalid')) apply(st.step, { only: k }); if (k === 'email') emailHint(); }
      if (e.target.id === 'latR') { st.lat = +e.target.value; sync(); }
    });
    panel.addEventListener('change', (e) => { if (e.target.id === 'f_consent') { st.consent = e.target.checked; if (st.tried[3]) apply(3); } });
    panel.addEventListener('focusout', (e) => { const k = e.target.dataset?.k; if (k && st[k] && String(st[k]).trim()) apply(st.step, { only: k }); });
    $('#fBack', main).addEventListener('click', () => show(Math.max(0, st.step - 1), -1, true));
    $('#fNext', main).addEventListener('click', () => {
      const n = st.step; st.tried[n] = true; const E = apply(n, { anim: true });
      if (E.length) { summary(E); goFirst(E); return; }
      if (n < 3) return show(n + 1, 1, true);
      const nb = $('#fNext', main); nb.textContent = t('flow.sending'); nb.disabled = true;
      const sumTxt = $$('#sum > div', panel).map(r => r.querySelector('dt').textContent + ': ' + r.querySelector('dd').innerText.replace(/\n/g, ' — ')).join('\n');
      $('#fMail', main).href = 'mailto:contact@kyber.tech?subject=' + encodeURIComponent('Kyber — ' + (st.company || st.name)) + '&body=' + encodeURIComponent(sumTxt);
      const df = $('#doneFiles', main);
      if (st.files.length || st.voice) { df.hidden = false; df.innerHTML = `<p>${T('att.doneFiles')}</p><ul>${st.files.map(f => `<li>${esc(f.name)} · ${fmtB(f.size)}</li>`).join('')}${st.voice ? `<li><a href="${st.voice.url}" download="kyber-voice-note.${/ogg/.test(st.voice.type) ? 'ogg' : /mp4|aac/.test(st.voice.type) ? 'm4a' : 'webm'}">${T('att.downloadVoice')}</a> · ${st.voice.dur}s</li>` : ''}</ul>`; }
      const tSend = performance.now();
      setTimeout(() => { panel.classList.add('sent'); $('#doneMs', main).textContent = t('ui.proto') + ' · 0 B · ' + (performance.now() - tSend).toFixed(0) + ' ms'; stepsEl.forEach(x => { x.classList.remove('on'); x.classList.add('done'); }); bar.style.width = '100%'; if (G && !RM) G.from($('.doneview', panel).children, { opacity: 0, y: 30, stagger: .08, duration: .9, ease: 'expo.out' }); $('#fMail', main).focus({ preventScroll: true }); }, 650);
    });
    $('#fRestart', main).addEventListener('click', () => { if (st.voice) URL.revokeObjectURL(st.voice.url); FS = freshFS(); route(true); });
    const pn = $('#parisNow', main); const tick = () => { try { pn.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(new Date()); } catch (e) { } }; tick(); const id = setInterval(tick, 15000); on(() => clearInterval(id));
    show(st.step || 0); emailHint();
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
      <div class="dd__grid">${SOL.map((s, i) => `<a class="dd__item" href="#/solutions/${s}" style="--i:${i}"><img src="${img(s)}" alt="" loading="lazy"><span class="dd__n">0${i + 1}</span><span><b>${T(`solutions.${s}.name`)}</b><small>${T(`solutions.${s}.short`)}</small></span></a>`).join('')}</div>`;
    $('#langList').innerHTML = LANGS.map(([c, n]) => `<li><button role="option" data-l="${c}" aria-selected="${c === LANG}" lang="${c}"><span>${n}</span><span class="mono">${c.toUpperCase()}</span></button></li>`).join('');
    $('#mnav').innerHTML = `
      <div><a class="big" href="#/">Kyber</a><a class="big" href="#/technology">${T('nav.technology')}</a><a class="big" href="#/sdk">${T('nav.sdk')}</a><a class="big" href="#/about">${T('nav.about')}</a><a class="big" href="#/careers">${T('footer.careers')}</a><a class="big" href="#/blog">${T('nav.blog')}</a><a class="big" href="#/connect">${T('nav.connect')}</a></div>
      <div><div class="kicker">${T('nav.solutions')}</div><div class="sub">${SOL.map(s => `<a href="#/solutions/${s}">${T(`solutions.${s}.name`)}</a>`).join('')}</div></div>
      <div class="btns">${btnSdk('btn--accent')}</div>
      <div class="mnav__legal"><a href="#/simple">${T('a11y.simple')}</a>${Object.keys(LEGAL).map(k => `<a href="#/legal/${k}">${T('footer.' + k)}</a>`).join('')}</div>
      <div class="mtools"><button type="button" class="mtools__lang" data-langmodal><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg><span class="js-langname">${(LANGS.find(x => x[0] === LANG) || [0, LANG])[1]}</span><svg class="chev" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>
        <button type="button" class="iconbtn" data-mtheme aria-label="${T('nav.theme')}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button><button type="button" class="iconbtn mono" data-open-console aria-label="${T('common.console')}">›_</button></div>`;
    $('#ftr').innerHTML = `
      <div class="ftr__top">
        <div class="ftr__brand"><svg viewBox="0 0 18.1 18.7" width="34" fill="currentColor" aria-hidden="true"><path d="M12.79 18.605h5.233v-4.652l-5.232-4.65-5.233 4.65zM2.326 9.302l5.232-4.65V0H0v18.605h7.558V9.302zM18.023.0h-5.232L7.558 4.651v4.651h5.233l5.232-4.65z"/></svg><p>${T('footer.tagline')}</p></div>
        <div><h4>${T('footer.product')}</h4><ul><li><a href="#/technology">${T('nav.technology')}</a></li><li><a href="#/sdk">${T('common.getSdk')}</a></li><li><a href="${K}/get-the-sdk/" target="_blank" rel="noopener">${T('footer.getApp')}</a></li><li><a href="${DOCS}" target="_blank" rel="noopener">${T('footer.docs')}</a></li><li><a href="#/simple">${T('a11y.simple')}</a></li></ul></div>
        <div><h4>${T('nav.solutions')}</h4><ul>${SOL.map(s => `<li><a href="#/solutions/${s}">${T(`solutions.${s}.name`)}</a></li>`).join('')}</ul></div>
        <div><h4>${T('footer.company')}</h4><ul><li><a href="#/about">${T('nav.about')}</a></li><li><a href="#/careers">${T('footer.careers')}</a></li><li><a href="#/blog">${T('nav.blog')}</a></li><li><a href="#/connect">${T('nav.connect')}</a></li><li><a href="${GL}" target="_blank" rel="noopener">GitLab ↗</a></li><li><a href="https://www.linkedin.com/company/kyber-tech/" target="_blank" rel="noopener">LinkedIn ↗</a></li></ul></div>
        <div><h4>${T('footer.community')}</h4><ul><li><a href="${GL}" target="_blank" rel="noopener">GitLab ↗</a></li><li><a href="https://discord.gg/ztJ76bkYNm" target="_blank" rel="noopener">Discord ↗</a></li><li><a href="${REL.url}" target="_blank" rel="noopener">${T('footer.installer')} ↗</a></li><li><a href="mailto:contact@kyber.tech">contact@kyber.tech</a></li></ul>
          <h4 style="margin-top:1.6rem">${T('footer.legal')}</h4><ul><li><a href="#/legal/privacy">${T('footer.privacy')}</a></li><li><a href="#/legal/cookies">${T('footer.cookies')}</a></li><li><a href="#/legal/terms">${T('footer.terms')}</a></li></ul></div>
      </div>
      <div class="ftr__mark" aria-hidden="true"><svg class="klogo klogo--ftr" viewBox="-2 -2 97 28" fill="currentColor"><defs><linearGradient id="kfoot" gradientUnits="userSpaceOnUse" x1="-80" y1="0" x2="-40" y2="0"><stop offset="0" stop-color="currentColor"/><stop offset=".5" style="stop-color:var(--accent)"/><stop offset="1" stop-color="currentColor"/></linearGradient></defs>${$('.hdr__logo svg').innerHTML.replace(/<defs>.*?<\/defs>/s,'').replace('url(#kshine)','url(#kfoot)')}</svg></div>
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
          const segs = []; segments(n.textContent).forEach(w => { if (segs.length && /^[\p{P}]+$/u.test(w) && !/^\s+$/.test(segs[segs.length - 1]) && /^[、。，．！？：；」』）\)\]！？,.!?:;…]+$/u.test(w)) segs[segs.length - 1] += w; else segs.push(w); });
          segs.forEach(w => {
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
    initFlow(main); initDoc(main); initSimple(main); initApply(main); applyRepo();
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
    const fl = $$('.filters:not(#roleFilter) button', main);
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

  /* ---------------- careers ---------------- */
  const JOBS = [
    { k: 'j1', s: 'senior-windows-systems-developer', cat: 'eng', loc: 'metaLoc' },
    { k: 'j2', s: '3ddxr-developpper', cat: 'eng', loc: 'metaLoc' },
    { k: 'j3', s: 'network-systems-developer', cat: 'eng', loc: 'metaLoc' },
    { k: 'j4', s: 'sdr-developpper', cat: 'eng', loc: 'metaLoc' },
    { k: 'j5', s: 'forward-deployed-engineer', cat: 'field', loc: 'metaLocFde' }
  ];
  const CICO = {
    e1: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>', e2: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M6 8.5v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2M12 13.5v2"/>',
    e3: '<circle cx="12" cy="12" r="9"/><path d="M8 8l8 8"/>', e4: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
    e5: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>', e6: '<path d="M4 14l4-4 3 3 5-6 4 4"/><path d="M4 20h16"/>'
  };
  const PICO = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const applyForm = (job) => {
    const f = (id, k, type = 'text', full, ac = 'off') => `<div class="fld${full ? ' full' : ''}" data-f="${id}"><input id="a_${id}" name="${id}" type="${type}" placeholder=" " autocomplete="${ac}"${type === 'email' ? ' inputmode="email" autocapitalize="off" spellcheck="false"' : ''}${id === 'linkedin' ? ' inputmode="url" autocapitalize="off" spellcheck="false"' : ''} aria-describedby="ae_${id}"><label for="a_${id}">${T('car.' + k)}</label><span class="fld__ok" aria-hidden="true"></span><p class="ferr" id="ae_${id}"><span><i aria-hidden="true">!</i><b></b></span></p></div>`;
    return `<form class="apply" id="applyForm" novalidate data-job="${job ? job.k : ''}">
      <div class="apply__in">
        ${job ? '' : `<div class="fld full" data-f="role"><select id="a_role" name="role" aria-describedby="ae_role"><option value="" selected disabled hidden></option>${JOBS.map(j => `<option value="${j.k}">${T('about.' + j.k)}</option>`).join('')}<option value="spont">${T('car.roleSpont')}</option></select><label for="a_role">${T('car.role')}</label><svg class="chev" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><p class="ferr" id="ae_role"><span><i aria-hidden="true">!</i><b></b></span></p></div>`}
        <div class="grid2">${f('first', 'first', 'text', false, 'given-name')}${f('last', 'last', 'text', false, 'family-name')}${f('email', 'email', 'email', true, 'email')}${f('linkedin', 'linkedin', 'text', false, 'url')}${f('location', 'location', 'text', false, 'address-level2')}</div>
        <div class="fld full" data-f="message" style="margin-top:.8rem"><textarea id="a_message" name="message" placeholder=" " aria-describedby="ae_message"></textarea><label for="a_message">${T('car.message')}</label><p class="ferr" id="ae_message"><span><i aria-hidden="true">!</i><b></b></span></p></div>
        <div class="apply__cv" data-f="cv">
          <label class="apply__drop" id="cvDrop" tabindex="0" role="button" aria-describedby="ae_cv"><input type="file" id="a_cv" accept=".pdf,application/pdf" hidden><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9 14l3-3 3 3"/></svg><span><b id="cvName">${T('car.cvAdd')}</b><small>${T('car.cv')} · ${T('car.cvD')} · ${T('flow.optional')}</small></span><button type="button" class="att__rm" id="cvRm" hidden aria-label="${T('att.remove')}">✕</button></label>
          <p class="ferr" id="ae_cv"><span><i aria-hidden="true">!</i><b></b></span></p>
        </div>
        <p class="apply__legal">${fill(T('car.privacy'), { link: `<a href="#/legal/privacy">${T('flow.privacy')}</a>` })}</p>
        <div class="apply__nav"><button type="button" class="flow__err" id="aErr" tabindex="-1" aria-live="polite"></button><button type="submit" class="btn btn--accent magnetic" id="aSend">${T('car.submit')} ${ARR}</button></div>
      </div>
      <div class="apply__done" role="status" hidden><div class="pulse-ring"><i></i><i></i><i></i><b>✓</b></div><h3>${T('car.doneT')}</h3><p>${T('car.doneD')}</p><a class="btn btn--accent" id="aMail" href="mailto:contact@kyber.tech">${T('car.doneMail')} ${ARR}</a></div>
    </form>`;
  };
  function initApply(main) {
    const form = $('#applyForm', main); if (!form) return;
    const S = { cv: null, tried: false };
    const val = (id) => ($('#a_' + id, form)?.value || '').trim();
    const rules = () => {
      const E = []; const add = (f, k, o) => E.push({ f, msg: o ? fill(t(k), o) : t(k) });
      if (!form.dataset.job && !val('role')) add('role', 'car.eRole');
      if (!val('first')) add('first', 'car.eFirst');
      if (!val('last')) add('last', 'car.eLast');
      const em = val('email'); if (!em) add('email', 'fv.emailReq'); else if (/\s/.test(em)) add('email', 'fv.emailSpace'); else if (!em.includes('@')) add('email', 'fv.emailNoAt'); else if (em.split('@').length > 2) add('email', 'fv.emailBad'); else if (!/^[^.]+(\.[^.]+)*\.[\p{L}]{2,}$/u.test(em.split('@')[1] || '')) add('email', 'fv.emailDomain');
      const li = val('linkedin'); if (!li) add('linkedin', 'car.eLinkedin'); else { let ok = false; try { const u = new URL(/^https?:\/\//i.test(li) ? li : 'https://' + li); ok = /\.[a-z]{2,}$/i.test(u.hostname) && !/\s/.test(li); } catch (e) { } if (!ok) add('linkedin', 'car.eLinkedinBad'); }
      if (!val('location')) add('location', 'car.eLocation');
      const m = val('message'); if (!m) add('message', 'car.eMessage'); else if (m.length < 30) add('message', 'car.eMessageShort');
      return E;
    };
    const W = (f) => $(`[data-f="${f}"]`, form);
    const setE = (f, msg, anim) => { const w = W(f); if (!w) return; w.classList.add('is-invalid'); w.classList.remove('is-valid'); const c = $('input,textarea,select', w); c?.setAttribute('aria-invalid', 'true'); const b = $('#ae_' + f + ' b', form); b.textContent = msg; $('#ae_' + f, form).classList.add('on'); if (anim && !RM) w.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'ease-out' }); };
    const clrE = (f, ok) => { const w = W(f); if (!w) return; const had = w.classList.contains('is-invalid'); w.classList.remove('is-invalid'); $('input,textarea,select', w)?.removeAttribute('aria-invalid'); $('#ae_' + f, form)?.classList.remove('on'); if (had && ok && f !== 'cv') { w.classList.add('is-valid'); setTimeout(() => w.classList.remove('is-valid'), 1500); } };
    const err = $('#aErr', form);
    const apply = (anim, only) => { const E = rules(); ['role', 'first', 'last', 'email', 'linkedin', 'location', 'message'].forEach(f => { if (only && f !== only) return; const e = E.find(x => x.f === f); e ? setE(f, e.msg, anim) : clrE(f, true); }); if (S.tried) { err.textContent = E.length ? (E.length === 1 ? t('flow.fix1') : fill(t('flow.fixN'), { n: E.length })) : ''; err.classList.toggle('on', !!E.length); } return E; };
    form.addEventListener('input', (e) => { const f = e.target.closest('[data-f]')?.dataset.f; if (f && (S.tried || W(f).classList.contains('is-invalid'))) apply(false, f); });
    form.addEventListener('change', (e) => { if (e.target.id === 'a_role' && S.tried) apply(false, 'role'); });
    form.addEventListener('focusout', (e) => { const f = e.target.closest('[data-f]')?.dataset.f; if (f && f !== 'cv' && val(f)) apply(false, f); });
    form.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); const fs = $$('input:not([hidden]):not([type=file]),select,textarea', form); const i = fs.indexOf(e.target); (fs[i + 1] || $('#aSend', form)).focus(); } });
    err.addEventListener('click', () => { const E = rules(); if (E.length) $('input,textarea,select', W(E[0].f))?.focus(); });
    const cvIn = $('#a_cv', form), drop = $('#cvDrop', form), nm = $('#cvName', form), rm = $('#cvRm', form);
    const setCv = (file) => { clrE('cv'); if (!file) { S.cv = null; nm.textContent = t('car.cvAdd'); rm.hidden = true; drop.classList.remove('has'); return; } if (!/\.pdf$/i.test(file.name)) return setE('cv', t('car.eCvType'), true); if (file.size > 10 * 1048576) return setE('cv', fill(t('car.eCvBig'), { s: fmtB(file.size) }), true); S.cv = file; nm.textContent = `${file.name} · ${fmtB(file.size)}`; rm.hidden = false; drop.classList.add('has'); };
    cvIn.addEventListener('change', () => { setCv(cvIn.files[0]); cvIn.value = ''; });
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cvIn.click(); } });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', (e) => { const fl = e.dataTransfer?.files?.[0]; if (fl) setCv(fl); });
    rm.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); setCv(null); drop.focus(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault(); S.tried = true; const E = apply(true);
      if (E.length) { const w = W(E[0].f); const r = w.getBoundingClientRect(); if (r.top < 90 || r.bottom > innerHeight - 40) w.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }); setTimeout(() => $('input,textarea,select', w)?.focus({ preventScroll: true }), RM ? 0 : 280); return; }
      const role = form.dataset.job || val('role'); const roleT = role === 'spont' ? t('car.roleSpont') : t('about.' + role);
      const body = [`${t('car.role')}: ${roleT}`, `${t('car.first')}: ${val('first')}`, `${t('car.last')}: ${val('last')}`, `${t('car.email')}: ${val('email')}`, `${t('car.linkedin')}: ${val('linkedin')}`, `${t('car.location')}: ${val('location')}`, '', val('message'), S.cv ? `\n${t('car.cv')}: ${S.cv.name}` : ''].join('\n');
      $('#aMail', form).href = 'mailto:contact@kyber.tech?subject=' + encodeURIComponent(`${roleT} — ${val('first')} ${val('last')}`) + '&body=' + encodeURIComponent(body);
      const sb = $('#aSend', form); sb.textContent = t('car.sending'); sb.disabled = true;
      setTimeout(() => { $('.apply__in', form).hidden = true; const d = $('.apply__done', form); d.hidden = false; if (window.gsap && !RM) gsap.from(d.children, { opacity: 0, y: 24, stagger: .08, duration: .8, ease: 'expo.out' }); $('#aMail', form).focus({ preventScroll: true }); }, 600);
    });
    main.addEventListener('click', (e) => { const g = e.target.closest('[data-goto-el]'); if (!g) return; e.preventDefault(); const el = document.getElementById(g.dataset.gotoEl); if (!el) return; scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: RM ? 'auto' : 'smooth' }); if (g.dataset.role) { const s2 = $('#a_role', main); if (s2) { s2.value = g.dataset.role; s2.dispatchEvent(new Event('change', { bubbles: true })); } } setTimeout(() => $('#applyForm input,#applyForm select', main)?.focus({ preventScroll: true }), RM ? 0 : 500); });
    const rf = $('#roleFilter', main); if (rf) rf.addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; $$('[data-cat]', rf).forEach(x => x.setAttribute('aria-pressed', x === b)); $$('.role', main).forEach(r => { const show = b.dataset.cat === '*' || r.dataset.cat === b.dataset.cat; r.hidden = !show; }); });
  }
  function pageCareers() {
    const people = [['jb', 'Jean-Baptiste Kempf', 'team.jbRole', 'jb.webp'], ...LEADS.map(([i, k, n]) => [k, n, 'team.' + k + 'Role', k + '.webp'])];
    return `
    <section class="phero car__hero"><div class="wrap">
      ${kicker('car.kicker')}${headline('car.titleA', 'car.titleB')}
      <p class="lead rv">${T('car.lead')}</p>
      <div class="btns rv" style="margin-top:2rem"><a class="btn btn--accent magnetic" href="#roles" data-goto-el="roles">${T('car.seeRoles')} ${ARR}</a><a class="btn btn--ghost" href="#apply" data-goto-el="apply" data-role="spont">${T('car.spont')}</a></div>
      <div class="car__stats rv">${[['26', 'st1'], ['25', 'st2'], ['3', 'st3'], ['7B+', 'st4']].map(([n, k]) => `<div><b class="mono">${n}</b><span>${T('car.' + k)}</span></div>`).join('')}</div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap car__mission">
      <div>${kicker('car.missionK')}<h2 class="h1 split">${T('car.missionT')}</h2></div>
      <p class="lead rv">${T('car.missionD')}</p>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('car.legacyK')}<h2 class="h1 split">${T('car.legacyT')}</h2></div><p class="lead rv">${T('car.legacyD')}</p></div>
      <ol class="car__line rv">${[1, 2, 3, 4].map(i => { const m = /^(\d{4})\s*[·:–—-]?\s*(.*)$/.exec(t('car.legacy' + i)) || ['', '', t('car.legacy' + i)]; return `<li><b class="mono">${esc(m[1])}</b><span>${esc(m[2])}</span></li>`; }).join('')}</ol>
      <div class="car__people">${people.map(([k, n, role, im]) => `<figure class="rv"><img src="img/${im}" alt="${esc(n)}" loading="lazy"><figcaption><b>${esc(n)}</b><span>${T(role)}</span></figcaption></figure>`).join('')}<a class="car__more rv" href="#/about"><b>+21</b><span>${T('car.teamD')}</span><span class="mono">${T('nav.about')} ${ARR}</span></a></div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('car.envK')}<h2 class="h1 split">${T('car.envT')}</h2></div></div>
      <div class="car__env">${[1, 2, 3, 4, 5, 6].map(i => `<div class="rv" data-tilt><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${CICO['e' + i]}</svg><h3>${T('car.e' + i + 't')}</h3><p>${T('car.e' + i + 'd')}</p></div>`).join('')}</div>
      <p class="mono stackline rv"><span class="accent">$</span> cat stack.txt → ${T('about.stackLine')}</p>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap car__split">
      <div>${kicker('car.perksK')}<h2 class="h1 split">${T('car.perksT')}</h2><ul class="car__perks">${[1, 2, 3, 4, 5, 6].map(i => `<li class="rv">${PICO}<span>${T('car.p' + i)}</span></li>`).join('')}</ul><p class="note-s rv">${T('car.perksNote')}</p></div>
      <div>${kicker('car.valuesK')}<div class="car__vals">${[1, 2, 3, 4, 5].map(i => `<div class="rv"><span class="mono">0${i}</span><div><h3>${T('about.v' + i + 't')}</h3><p>${T('about.v' + i + 'd')}</p></div></div>`).join('')}</div></div>
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('car.processK')}<h2 class="h1 split">${T('car.processT')}</h2></div></div>
      <ol class="car__proc">${[1, 2, 3].map(i => `<li class="rv"><span class="mono">0${i}</span><h3>${T('car.pr' + i + 't')}</h3><p>${T('car.pr' + i + 'd')}</p></li>`).join('')}</ol>
    </div></section>
    <section class="sec" id="roles" style="padding-top:0"><div class="wrap">
      <div class="sechead"><div>${kicker('car.rolesK')}<h2 class="h1 split">${T('car.rolesT')}</h2></div>
        <div class="filters" id="roleFilter" role="group"><button aria-pressed="true" data-cat="*">${T('car.fAll')} <span class="mono">${JOBS.length}</span></button><button aria-pressed="false" data-cat="eng">${T('car.fEng')} <span class="mono">${JOBS.filter(j => j.cat === 'eng').length}</span></button><button aria-pressed="false" data-cat="field">${T('car.fField')} <span class="mono">${JOBS.filter(j => j.cat === 'field').length}</span></button></div></div>
      <div class="roles2">${JOBS.map((j, i) => `<a class="role rv" data-cat="${j.cat}" href="#/careers/${j.s}"><span class="mono role__n">0${i + 1}</span><span class="role__t"><b>${T('about.' + j.k)}</b><small>${T(j.cat === 'eng' ? 'car.fEng' : 'car.fField')}</small></span><span class="role__m">${T('car.' + j.loc)}</span><span class="role__m">${T('car.metaContract')}</span><span class="role__go" aria-hidden="true">${ARR}</span></a>`).join('')}
        <div class="role role--open rv"><span class="role__t"><b>${T('car.noRole')}</b><small>${T('car.noRoleD')}</small></span><a class="btn btn--ghost btn--sm" href="#apply" data-goto-el="apply" data-role="spont">${T('car.spont')} ${ARR}</a></div>
      </div>
    </div></section>
    <section class="sec" id="apply" style="padding-top:0"><div class="wrap car__applywrap">
      <div>${kicker('car.applyK')}<h2 class="h1 split">${T('car.applyGen')}</h2><p class="lead rv">${T('car.noRoleD')}</p></div>
      ${applyForm(null)}
    </div></section>`;
  }
  async function pageJob(slug) {
    const j = JOBS.find(x => x.s === slug); if (!j) return null;
    const d = await loadDoc('job-' + slug, LANG); if (!d) return null;
    const { html } = prepBody(d.html); const title = t('about.' + j.k); window.__docTitle = title;
    const shareU = location.origin + location.pathname + '#/careers/' + slug;
    return `<div class="readbar" aria-hidden="true"><i id="readBar"></i></div>
    <section class="phero doc car__job"><div class="wrap">
      <a class="doc__back mono" href="#/careers">${ARRL} ${T('car.back')}</a>
      ${kicker(j.cat === 'eng' ? 'car.fEng' : 'car.fField')}
      <h1 class="phero__title split doc__title">${esc(title)}</h1>
      <div class="car__meta">${[['metaContract', '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>'], [j.loc, CICO.e5], ['metaPay', '<path d="M12 3v18M17 7.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 2.6 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3"/>']].map(([k, ic]) => `<span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${ic}</svg>${T('car.' + k)}</span>`).join('')}</div>
      <div class="btns" style="margin-top:1.6rem"><a class="btn btn--accent magnetic" href="#apply" data-goto-el="apply">${T('car.applyT')} ${ARR}</a><button type="button" class="btn btn--ghost" data-copylink="${esc(shareU)}">${T('car.share')}</button></div>
    </div></section>
    <section class="sec doc__wrap" style="padding-top:0"><div class="wrap car__jobgrid">
      <article class="doc__body prose" id="docBody">
        <h2>${T('car.aboutK')}</h2><p>${T('car.aboutD')}</p>
        ${html}
      </article>
      <aside class="car__applyside" id="apply"><div class="car__applycard"><span class="kicker">${T('car.applyK')}</span><h2>${T('car.applyT')}</h2><p class="mono">${esc(title)}</p>${applyForm(j)}</div></aside>
    </div></section>`;
  }

  /* ---------------- hosted articles + legal pages ---------------- */
  const DOCC = {};
  async function loadDoc(slug, lang) {
    const key = lang + '/' + slug; if (DOCC[key]) return DOCC[key];
    try { const r = await fetch(`content/${lang}/${slug}.json?v=${window.__v || ''}`); if (!r.ok) throw 0; return (DOCC[key] = await r.json()); } catch (e) { return lang === 'en' ? null : loadDoc(slug, 'en'); }
  }
  const fmtLong = (d) => { try { return new Intl.DateTimeFormat(LANG, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d)); } catch (e) { return d; } };
  const readMin = (html) => { const tx = html.replace(/<[^>]+>/g, ' '); const cjk = (tx.match(/[\u3040-\u30ff\u4e00-\u9fff]/g) || []).length; const w = tx.split(/\s+/).filter(Boolean).length; return Math.max(1, Math.round(cjk ? cjk / 450 + w / 230 : w / 230)); };
  const autoLink = (box, links) => {
    if (!links || !links.length) return;
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest('a,h1,h2,h3,code,pre') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    const used = {};
    nodes.forEach(n => {
      let txt = n.nodeValue; const frag = document.createDocumentFragment(); let changed = false;
      for (;;) {
        let best = null;
        links.forEach(([words, href]) => { if ((used[href] || 0) >= 2) return; words.forEach(w => { const i = txt.toLocaleLowerCase(LANG).indexOf(w.toLocaleLowerCase(LANG)); if (i >= 0 && (!best || i < best.i)) best = { i, w, href }; }); });
        if (!best) break;
        frag.appendChild(document.createTextNode(txt.slice(0, best.i)));
        const a = document.createElement('a'); a.href = best.href; a.className = 'autolink'; a.textContent = txt.substr(best.i, best.w.length); frag.appendChild(a);
        used[best.href] = (used[best.href] || 0) + 1; txt = txt.slice(best.i + best.w.length); changed = true;
      }
      if (changed) { frag.appendChild(document.createTextNode(txt)); n.replaceWith(frag); }
    });
  };
  const prepBody = (html, links) => {
    const box = document.createElement('div'); box.innerHTML = html; const toc = []; let i = 0; autoLink(box, links);
    box.querySelectorAll('h2,h3').forEach(h => { if (h.tagName === 'H2' && !i && /^kyber [\d.]+!?$/i.test(h.textContent.trim())) { h.classList.add('doc__kick'); return; } h.id = 'sec-' + (++i); if (h.tagName === 'H2' || !box.querySelector('h2:not(.doc__kick)')) toc.push([h.id, h.textContent.trim()]); });
    box.querySelectorAll('a[href]').forEach(a => { const h = a.getAttribute('href'); const m = /^https?:\/\/(www\.)?kyber\.tech\/article\/([^/?#]+)/.exec(h) || /^\/article\/([^/?#]+)/.exec(h); if (m) { a.setAttribute('href', '#/blog/' + (m[2] || m[1])); return; } const l = /kyber\.tech\/legal\/(privacy|cookies|terms)/.exec(h); if (l) { a.setAttribute('href', '#/legal/' + l[1]); return; } if (h.startsWith('/')) a.setAttribute('href', K + h); if (/^https?:/.test(a.getAttribute('href'))) { a.target = '_blank'; a.rel = 'noopener'; } });
    box.querySelectorAll('img').forEach(im => { im.loading = 'lazy'; im.decoding = 'async'; const f = document.createElement('figure'); im.replaceWith(f); f.appendChild(im); });
    box.querySelectorAll('table').forEach(tb => { const w = document.createElement('div'); w.className = 'tablewrap'; tb.replaceWith(w); w.appendChild(tb); });
    box.querySelectorAll('pre,code').forEach(c => c.setAttribute('dir', 'ltr'));
    return { html: box.innerHTML, toc };
  };
  async function pageDoc(kind, slug) {
    const src = kind === 'legal' ? LEGAL[slug] : slug;
    if (!src) return null;
    const [d, en] = await Promise.all([loadDoc(src, LANG), loadDoc(src, 'en')]);
    if (!d) return null;
    let links = null, legalDocs = null;
    if (kind === 'legal') {
      legalDocs = await Promise.all(Object.keys(LEGAL).map(async k => [k, await loadDoc(LEGAL[k], LANG), await loadDoc(LEGAL[k], 'en')]));
      const EXTRA = { privacy: ['Privacy Policy', 'Privacy Statement', 'privacy statement'], cookies: ['Cookie Policy', 'Cookies Policy'], terms: ['Terms of Service', 'Terms of Use'] };
      links = legalDocs.filter(([k, dl, de]) => k !== slug && (dl || de)).map(([k, dl, de]) => [[...new Set([dl?.title, de?.title, ...EXTRA[k]].filter(Boolean))].sort((a, b) => b.length - a.length), '#/legal/' + k]);
    }
    const { html, toc } = prepBody(d.html, links); d.title = d.title.charAt(0).toLocaleUpperCase(LANG) + d.title.slice(1); window.__docTitle = d.title;
    const shareU = location.origin + location.pathname + '#/' + kind + '/' + slug;
    const tocH = toc.length > 1 ? `<nav class="doc__toc" aria-label="${T('art.toc')}"><span class="kicker">${T('art.toc')}</span><ol>${toc.map(([id, tx], i) => `<li><a href="#${id}" data-toc="${id}"><span class="mono">${String(i + 1).padStart(2, '0')}</span>${esc(tx)}</a></li>`).join('')}</ol></nav>` : '';
    if (kind === 'legal') {
      return `<div class="readbar" aria-hidden="true"><i id="readBar"></i></div>
      <section class="phero doc doc--legal"><div class="wrap">
        <a class="doc__back mono" href="#/">${ARRL} Kyber</a>
        ${kicker('legal.kicker')}<h1 class="phero__title split doc__title">${esc(d.title)}</h1>
        <nav class="legaltabs" aria-label="${T('legal.kicker')}">${legalDocs.map(([k, dl, de], i) => { const ttl = (dl || de)?.title || t('footer.' + k); return `<a href="#/legal/${k}"${k === slug ? ' aria-current="page"' : ''}><span class="mono">0${i + 1}</span>${esc(ttl.charAt(0).toLocaleUpperCase(LANG) + ttl.slice(1))}</a>`; }).join('')}</nav>
        <div class="doc__meta mono"><span>${T('legal.updated')} · ${esc(fmtLong(d.updated || en.updated))}</span><span>${readMin(d.html)} ${T('common.minRead')}</span></div>
        ${LANG !== 'en' ? `<div class="doc__note"><span>${T('legal.notice')}</span><button type="button" class="pill" data-orig aria-pressed="false">${T('legal.original')}</button></div>` : ''}
      </div></section>
      <section class="sec doc__wrap" style="padding-top:0"><div class="wrap doc__grid">
        <aside class="doc__side">${tocH}<div class="doc__help"><span class="kicker">${T('legal.questions')}</span><a href="mailto:contact@kyber.tech" class="mono">contact@kyber.tech</a></div></aside>
        <article class="doc__body prose prose--legal" id="docBody" data-en="${esc(JSON.stringify(prepBody(en.html, links).html))}">${html}</article>
      </div></section>${ctaBlock()}`;
    }
    const i = POSTS.findIndex(p => p.s === slug); const prev = POSTS[i + 1], next = POSTS[i - 1]; const post = POSTS[i];
    const card = (p, lbl) => p ? `<a class="doc__nx" href="#/blog/${p.s}"><small class="mono">${T(lbl)}</small><b>${T('blog.' + p.k)}</b><span class="mono">${fmtDate(p.d)}</span>${HERO[p.s] ? `<img src="${HERO[p.s]}" alt="" loading="lazy">` : ''}</a>` : '<span></span>';
    const tag = post ? T(post.c === 'r' ? 'blog.releases' : 'blog.announcements') : esc(d.tag || '');
    return `<div class="readbar" aria-hidden="true"><i id="readBar"></i></div>
    <section class="phero doc"><div class="wrap">
      <a class="doc__back mono" href="#/blog">${ARRL} ${T('art.back')}</a>
      <div class="doc__meta mono"><span class="tag">${tag}</span><span>${esc(fmtLong(post ? post.d + 'T12:00' : d.date))}</span><span>${esc(d.author || '')}</span><span>${readMin(d.html)} ${T('common.minRead')}</span></div>
      <h1 class="phero__title split doc__title">${esc(d.title)}</h1>
      ${d.hero ? `<div class="doc__hero"><img src="${d.hero}" alt="" fetchpriority="high"></div>` : ''}
    </div></section>
    <section class="sec doc__wrap" style="padding-top:0"><div class="wrap doc__grid">
      <aside class="doc__side">${tocH}
        <div class="doc__share"><span class="kicker">${T('art.share')}</span><div><button type="button" class="pill" data-copylink="${esc(shareU)}">${T('art.copy')}</button><a class="pill" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareU)}" target="_blank" rel="noopener">LinkedIn</a><a class="pill" href="https://x.com/intent/post?url=${encodeURIComponent(shareU)}&text=${encodeURIComponent(d.title)}" target="_blank" rel="noopener">X</a></div></div>
      </aside>
      <article class="doc__body prose" id="docBody">
        ${d.quote ? `<blockquote class="doc__quote"><p>${esc(d.quote.trim().replace(/^[“”"«»„「『\s]+|[“”"«»„」』\s]+$/g, ''))}</p><footer class="mono">${esc(d.quoteBy || 'JBK')}</footer></blockquote>` : ''}
        ${html}
        <div class="doc__nav">${card(prev, 'art.prev')}${card(next, 'art.next')}</div>
      </article>
    </div></section>${ctaBlock()}`;
  }
  function initDoc(main) {
    const body = $('#docBody', main); if (!body) return;
    const bar = $('#readBar', main);
    const onS = () => { const r = body.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * .3 - r.top) / Math.max(1, r.height - innerHeight * .5))); bar.style.transform = `scaleX(${p})`; };
    addEventListener('scroll', onS, { passive: true }); on(() => removeEventListener('scroll', onS)); onS();
    const links = $$('[data-toc]', main);
    if (links.length) {
      const io = new IntersectionObserver((es) => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.dataset.toc === en.target.id)); }), { rootMargin: '-20% 0px -70% 0px' });
      links.forEach(a => { const h = document.getElementById(a.dataset.toc); h && io.observe(h); a.addEventListener('click', (e) => { e.preventDefault(); const t2 = document.getElementById(a.dataset.toc); t2 && scrollTo({ top: t2.getBoundingClientRect().top + scrollY - 96, behavior: RM ? 'auto' : 'smooth' }); }); });
      on(() => io.disconnect());
    }
    const cp = $('[data-copylink]', main); if (cp) cp.addEventListener('click', () => { navigator.clipboard?.writeText(cp.dataset.copylink); const o = cp.textContent; cp.textContent = t('art.copied'); setTimeout(() => cp.textContent = o, 1500); });
    const og = $('[data-orig]', main); if (og) { const tr = body.innerHTML; og.addEventListener('click', () => { const on2 = og.getAttribute('aria-pressed') !== 'true'; og.setAttribute('aria-pressed', on2); body.innerHTML = on2 ? JSON.parse(body.dataset.en) : tr; body.lang = on2 ? 'en' : LANG; body.dir = on2 ? 'ltr' : ''; og.textContent = t(on2 ? 'legal.translated' : 'legal.original'); }); }
  }

  async function route(force) {
    const path = parse();
    if (path === 'play' || path === 'main' || path === 'roles' || path === 'apply') return; // in-page anchors
    if (!force && path === lastPath) return;
    const doWipe = !first && !RM && window.gsap;
    const wipe = $('#wipe');
    if (doWipe) await gsap.fromTo(wipe, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .16, ease: 'power2.in' });
    cleanups.forEach(f => { try { f && f(); } catch (e) { } }); cleanups = [];
    window.ScrollTrigger && ScrollTrigger.getAll().forEach(s => s.kill());
    const main = $('#main'); window.__docTitle = null;
    let html, active = path.split('/')[0];
    if (path.startsWith('solutions/') && SOL.includes(path.split('/')[1])) html = pageSolution(path.split('/')[1]);
    else if (path === 'technology') html = pageTech();
    else if (path === 'about') html = pageAbout();
    else if (path === 'sdk') html = pageSdk();
    else if (path === 'blog') html = pageBlog();
    else if (path === 'careers') { html = pageCareers(); active = 'careers'; }
    else if (/^careers\/[\w-]+$/.test(path)) { html = await pageJob(path.split('/')[1]); active = 'careers'; if (!html) html = pageCareers(); }
    else if (/^(blog|legal)\/[\w-]+$/.test(path)) { const [k, sl] = path.split('/'); html = await pageDoc(k, sl); active = k === 'blog' ? 'blog' : ''; if (!html) { html = k === 'blog' ? pageBlog() : pageHome(); } }
    else if (path === 'simple') { html = pageSimple(); active = 'simple'; }
    else if (path === 'contact' || path === 'connect') { html = pageConnect(); active = 'connect'; }
    else { html = pageHome(); active = ''; }
    main.innerHTML = html;
    document.title = window.__docTitle ? window.__docTitle + ' — Kyber' : t('meta.title');
    document.documentElement.classList.toggle('is-simple', path === 'simple');
    $$('.hdr__nav>a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#/' + active && active));
    $('.dd').classList.toggle('is-active', active === 'solutions');
    closeMenus();
    const anchor = pendingAnchor; pendingAnchor = null;
    if (!force || lastPath !== path) toTop();
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
    dispatchEvent(new Event('scroll')); setTimeout(() => dispatchEvent(new Event('scroll')), 500);
  }

  /* ---------------- UI ---------------- */
  function closeMenus() {
    $('.dd').classList.remove('open'); $('.dd__btn').setAttribute('aria-expanded', false);
    $('.lang').classList.remove('open'); $('.lang__btn').setAttribute('aria-expanded', false);
    $('#mnav').classList.remove('open'); $('#mnav').setAttribute('aria-hidden', true); $('#burger').setAttribute('aria-expanded', false);
    document.body.style.overflow = ''; lenis && lenis.start();
  }
  let lenis = null;
  /* reliable scroll reset on page change: kills momentum (iOS/trackpads), beats scroll restoration and ScrollTrigger memory */
  let userMoved = false, topAt = 0;
  ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => { if (performance.now() - topAt > 450) userMoved = true; }, { passive: true }));
  function toTop() {
    userMoved = false; topAt = performance.now();
    const de = document.documentElement, prev = de.style.overflow;
    de.style.overflow = 'hidden'; // interrupts inertial scrolling
    if (lenis) lenis.scrollTo(0, { immediate: true });
    de.scrollTop = 0; document.body.scrollTop = 0; scrollTo({ top: 0, left: 0, behavior: 'instant' });
    de.style.overflow = prev;
    if (window.ScrollTrigger && ScrollTrigger.clearScrollMemory) ScrollTrigger.clearScrollMemory('manual');
    const again = () => { if (!userMoved && scrollY > 0) scrollTo({ top: 0, left: 0, behavior: 'instant' }); };
    requestAnimationFrame(() => requestAnimationFrame(again));
    [60, 180, 400, 900, 1400].forEach(ms => setTimeout(again, ms));
  }
  function ui() {
    const dd = $('.dd'), ddb = $('.dd__btn');
    let ddT;
    dd.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { clearTimeout(ddT); dd.classList.add('open'); ddb.setAttribute('aria-expanded', true); } });
    dd.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') ddT = setTimeout(() => { dd.classList.remove('open'); ddb.setAttribute('aria-expanded', false); }, 180); });
    ddb.addEventListener('click', () => { const o = !dd.classList.contains('open'); dd.classList.toggle('open', o); ddb.setAttribute('aria-expanded', o); });
    const lg = $('.lang'), lgb = $('.lang__btn');
    lgb.setAttribute('data-langmodal', ''); lgb.setAttribute('aria-haspopup', 'dialog');
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
      $('#dockS').classList.toggle('on', y <= innerHeight * .8 && p !== 'simple' && document.documentElement.classList.contains('dock-ready'));
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
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    setTimeout(() => { document.documentElement.classList.add('dock-ready'); dispatchEvent(new Event('scroll')); }, 1400);
    addEventListener('hashchange', () => route());
  }


  /* ---------------- external link interstitial ---------------- */


  /* ---------------- logo motion (header + footer) ----------------
     hover = short playful hop, click/tap = bigger burst. Leaving does nothing: animations always run to completion. */
  function initLogo() {
    const E = 'cubic-bezier(.3,1.6,.5,1)';
    const sweep = (grad, dur, times = 1) => { if (!grad || RM) return; const t0 = performance.now(); const f = (now) => { const p = Math.min(1, (now - t0) / dur); const q = (p * times) % 1 || (p === 1 ? 1 : 0); const x = -60 + q * 170; grad.setAttribute('x1', x); grad.setAttribute('x2', x + 40); if (p < 1) requestAnimationFrame(f); else { grad.setAttribute('x1', -80); grad.setAttribute('x2', -40); } }; requestAnimationFrame(f); };
    const make = (root, svg, grad, k) => {
      let busy = null; // 'hover' | 'click'
      const parts = () => $$('.klogo__mark path', svg); const word = () => $('.klogo__word', svg);
      const hover = () => {
        if (RM || busy) return; busy = 'hover'; const [a, b, c] = parts(); const A = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2c56f5';
        const o = { duration: 760, easing: 'ease-out' };
        a.animate([{ transform: 'none' }, { transform: `translate(${-2.4 * k}px,0)`, fill: A, offset: .25 }, { transform: 'none' }], { ...o, easing: E });
        b.animate([{ transform: 'none' }, { transform: `translate(${2 * k}px,${-2.4 * k}px) rotate(10deg)`, fill: A, offset: .3 }, { transform: 'none' }], { ...o, delay: 90, easing: E });
        c.animate([{ transform: 'none' }, { transform: `translate(${2 * k}px,${2.4 * k}px) rotate(-10deg)`, fill: A, offset: .3 }, { transform: 'none' }], { ...o, delay: 180, easing: E });
        const w = word().animate([{ transform: 'none' }, { transform: 'scale(1.04,.88)', offset: .25 }, { transform: 'translateY(-6%) scale(.97,1.06)', offset: .5 }, { transform: 'none' }], { duration: 700, delay: 120, easing: 'ease-in-out' });
        sweep(grad, 800);
        w.finished.then(() => { if (busy === 'hover') busy = null; }).catch(() => { });
      };
      const burst = () => {
        if (RM) return; svg.getAnimations({ subtree: true }).forEach(x => { if (!(x instanceof CSSAnimation)) x.cancel(); }); busy = 'click'; const [a, b, c] = parts(); const A = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2c56f5';
        const o = { duration: 1500, easing: 'cubic-bezier(.2,1.25,.35,1)' };
        a.animate([{ transform: 'none' }, { transform: `translate(${-7 * k}px,${-2 * k}px) rotate(-28deg)`, fill: A, offset: .22 }, { transform: `translate(${-7 * k}px,${-2 * k}px) rotate(-28deg)`, fill: A, offset: .38 }, { transform: 'none' }], o);
        b.animate([{ transform: 'none' }, { transform: `translate(${6 * k}px,${-7 * k}px) rotate(200deg)`, fill: A, offset: .22 }, { transform: `translate(${6 * k}px,${-7 * k}px) rotate(250deg)`, fill: A, offset: .38 }, { transform: 'rotate(360deg)' }], o);
        c.animate([{ transform: 'none' }, { transform: `translate(${6 * k}px,${7 * k}px) rotate(-200deg)`, fill: A, offset: .22 }, { transform: `translate(${6 * k}px,${7 * k}px) rotate(-250deg)`, fill: A, offset: .38 }, { transform: 'rotate(-360deg)' }], o);
        word().animate([{ transform: 'none' }, { transform: 'scale(1.08,.8)', offset: .12 }, { transform: 'translateY(-22%) scale(.94,1.1)', offset: .3 }, { transform: 'translateY(0) scale(1.06,.9)', offset: .48 }, { transform: 'translateY(-7%)', offset: .62 }, { transform: 'none' }], { duration: 1400, delay: 60, easing: 'ease-in-out' });
        const s = svg.animate([{ transform: 'none' }, { transform: 'scale(.94)', offset: .1 }, { transform: 'scale(1.03)', offset: .45 }, { transform: 'none' }], { duration: 1500, easing: 'ease-out' });
        sweep(grad, 1500, 2);
        s.finished.then(() => { busy = null; }).catch(() => { });
      };
      root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover(); });
      root.addEventListener('pointerdown', burst);
      root.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') burst(); });
    };
    // header
    const hl = $('.hdr__logo'); const g = $('#kshine');
    if (hl && g) {
      $$('animate', g).forEach(a => a.remove());
      make(hl, $('svg', hl), g, 1);
      // occasional idle sheen (independent of the pointer)
      setTimeout(function idle() { if (!document.hidden && !hl.matches(':hover')) sweep(g, 1300); setTimeout(idle, 8000); }, 1200);
    }
    // footer (re-rendered on language change)
    const ftr = $('#ftr'); let io = null;
    const bindFooter = () => {
      const mk = $('.ftr__mark', ftr); if (!mk || mk.dataset.bound) return; mk.dataset.bound = 1;
      io?.disconnect(); io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { mk.classList.add('is-in'); io.disconnect(); } }, { threshold: .35 }); io.observe(mk);
      make(mk, $('svg', mk), $('#kfoot', mk), .55);
    };
    bindFooter(); new MutationObserver(bindFooter).observe(ftr, { childList: true });
  }


  /* ---------------- language modal ---------------- */
  const ALIAS = { bn: 'bangla', fa: 'farsi', fil: 'tagalog pilipino', zh: 'mandarin putonghua chinese', 'zh-Hant': 'cantonese taiwan hong kong 粵語 廣東話', my: 'myanmar', pcm: 'pidgin naija', ms: 'malaysian', id: 'bahasa', ar: 'arabic', he: 'ivrit', el: 'hellenic', uz: 'ozbek', az: 'azeri', pa: 'panjabi', or: 'oriya', jv: 'jawa', su: 'sunda' };
  function initLangModal() {
    const m = document.createElement('div'); m.className = 'xm lm'; m.id = 'lm'; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'lmT');
    document.body.appendChild(m); let last = null;
    const norm = (x) => x.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const browser = (navigator.languages || [navigator.language || 'en']).map(x => { const lo = x.toLowerCase(); if (/^zh-(tw|hk|mo|hant)/.test(lo)) return 'zh-Hant'; if (lo.startsWith('tl')) return 'fil'; return lo.split('-')[0]; }).find(c => LANGS.some(x => x[0] === c));
    const item = ([c, n, e], i) => `<button type="button" class="lm__i${c === LANG ? ' on' : ''}" data-setlang="${c}"${c === LANG ? ' aria-current="true"' : ''} data-q="${esc(norm(n + ' ' + e + ' ' + c + ' ' + (ALIAS[c] || '')))}"><span class="lm__n" lang="${c}" dir="${RTL.includes(c) ? 'rtl' : 'ltr'}">${esc(n)}</span><span class="lm__e" lang="en" dir="ltr">${esc(e)}</span><span class="lm__c mono" dir="ltr">${String(i + 1).padStart(2, '0')}</span></button>`;
    const render = () => {
      const sug = browser && browser !== LANG ? LANGS.find(x => x[0] === browser) : null;
      m.innerHTML = `<div class="xm__card lm__card" role="document">
        <button type="button" class="sdkm__x iconbtn" data-close aria-label="${T('ui.close')}">✕</button>
        <span class="kicker">${T('nav.language')}</span>
        <h2 id="lmT">${T('lm.title')}</h2>
        <p class="lm__lead">${esc(fill(t('lm.lead'), { n: LANGS.length }))}</p>
        <div class="lm__search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" id="lmQ" placeholder="${T('lm.search')}" aria-label="${T('lm.search')}" autocomplete="off" spellcheck="false"></div>
        ${sug ? `<div class="lm__sug"><span>${T('lm.suggested')}</span><button type="button" class="pill" data-setlang="${sug[0]}" lang="${sug[0]}">${esc(sug[1])}</button></div>` : ''}
        <div class="lm__grid" id="lmG" role="list">${LANGS.map(item).join('')}</div>
        <p class="lm__none" id="lmNone" hidden></p>
      </div>`;
    };
    const open = () => { last = document.activeElement; closeMenus(); render(); m.hidden = false; document.documentElement.classList.add('modal-open'); requestAnimationFrame(() => { const q = $('#lmQ', m); if (matchMedia('(pointer:fine)').matches) q.focus(); else $('.lm__i.on', m)?.focus(); $('.lm__i.on', m)?.scrollIntoView({ block: 'center' }); }); };
    const close = () => { if (m.hidden) return; m.hidden = true; document.documentElement.classList.remove('modal-open'); last?.focus?.(); };
    document.addEventListener('click', (e) => { if (e.target.closest('[data-langmodal]')) { e.preventDefault(); e.stopPropagation(); open(); } }, true);
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) return close(); const b = e.target.closest('[data-setlang]'); if (b) { close(); if (b.dataset.setlang !== LANG) setLang(b.dataset.setlang); } });
    m.addEventListener('input', (e) => { if (e.target.id !== 'lmQ') return; const q = norm(e.target.value.trim()); let n = 0; $$('.lm__i', m).forEach(b => { const ok = !q || b.dataset.q.includes(q); b.hidden = !ok; if (ok) n++; }); const no = $('#lmNone', m); no.hidden = !!n; no.textContent = fill(t('lm.none'), { q: e.target.value.trim() }); });
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.id === 'lmQ') { const f = $$('.lm__i', m).find(b => !b.hidden); if (f) f.click(); return; }
      if (e.key === 'ArrowDown' && e.target.id === 'lmQ') { e.preventDefault(); $$('.lm__i', m).find(b => !b.hidden)?.focus(); return; }
      const b = e.target.closest('.lm__i'); if (!b || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault(); const vis = $$('.lm__i', m).filter(x => !x.hidden); const i = vis.indexOf(b); const cols = Math.max(1, Math.round($('#lmG', m).clientWidth / b.offsetWidth)); const rtl = document.documentElement.dir === 'rtl';
      const d = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: cols, ArrowUp: -cols }[e.key]; const n2 = vis[i + d]; if (n2) n2.focus(); else if (e.key === 'ArrowUp') $('#lmQ', m).focus();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !m.hidden) { e.preventDefault(); e.stopImmediatePropagation(); close(); } }, true);
  }

  /* ---------------- SDK install modal ---------------- */
  const INSTALL = {
    start: ['git clone https://gitlab.com/kyber/kyber.git', 'cd kyber', '# read “Where to start”, then pick a component', 'git clone https://gitlab.com/kyber/apps/kyber-desktop.git'],
    linux: ['git clone https://gitlab.com/kyber/apps/kyber-desktop.git && cd kyber-desktop', 'git submodule update --init --recursive', 'sudo apt-get build-dep -y vlc   # plus the packages listed in the README', "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh", 'rustup install 1.89.0 && rustup default 1.89.0', 'cargo install --locked cargo-c@0.10.15', './build-linux.sh'],
    mac: ['git clone https://gitlab.com/kyber/apps/kyber-desktop.git && cd kyber-desktop', 'git submodule update --init --recursive', "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh", 'cargo install --locked cargo-c@0.10.15', './build-macos.sh -a <arch>      # dev build', './build-macos.sh -p -a <arch>   # .app bundle'],
    win: ['# from a Linux machine (mingw-w64 cross-build)', 'git clone https://gitlab.com/kyber/apps/kyber-desktop.git && cd kyber-desktop', 'git submodule update --init --recursive', './build-win32.sh'],
    run: ['# on the machine you want to control (host)', './rootfs-x86_64-linux-gnu/run_kycontroller.sh', '', '# on your machine (client)', 'export WAYLAND_DISPLAY=""', './rootfs-x86_64-linux-gnu/run_kyclient.sh <host_ip>']
  };
  const INSTALL_TABS = [['start', 'tStart', 'dStart'], ['linux', 'tLinux', 'dLinux'], ['mac', 'tMac', 'dMac'], ['win', 'tWin', 'dWin'], ['run', 'tRun', 'dRun']];
  function initSdkModal() {
    const m = document.createElement('div'); m.className = 'xm sdkm'; m.id = 'sdkm'; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'sdkmT');
    document.body.appendChild(m);
    let tab = 'start', last = null;
    const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const copy = (txt, b) => { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).catch(() => { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } ta.remove(); }); const o = b.innerHTML; b.classList.add('ok'); b.textContent = t('sdkm.copied'); setTimeout(() => { b.classList.remove('ok'); b.innerHTML = o; }, 1400); };
    const body = () => {
      const lines = INSTALL[tab]; const d = INSTALL_TABS.find(x => x[0] === tab)[2];
      return `<p class="sdkm__d">${T('sdkm.' + d)}</p>
        ${tab === 'win' ? `<a class="btn btn--accent btn--sm sdkm__inst" href="${REL.dl}" target="_blank" rel="noopener">${T('sdkm.installer')} ${ARRUR}</a>` : ''}
        <div class="sdkm__term" dir="ltr"><div class="term__bar"><i></i><i></i><i></i><span>~/kyber — zsh</span><button type="button" class="sdkm__all" data-copyall>${T('sdkm.copyAll')}</button></div>
        <ol class="sdkm__lines">${lines.map((l, i) => l === '' ? '<li class="gap"></li>' : l.startsWith('#') ? `<li class="cmt"><code>${esc(l)}</code></li>` : `<li style="--i:${i}"><span class="pr">$</span><code>${esc(l)}</code><button type="button" class="sdkm__cp" data-cp="${i}" aria-label="${T('sdkm.copy')}"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg></button></li>`).join('')}</ol></div>`;
    };
    const render = () => {
      m.innerHTML = `<div class="xm__card sdkm__card" role="document">
        <button type="button" class="sdkm__x iconbtn" data-close aria-label="${T('ui.close')}">✕</button>
        <span class="kicker">${T('sdk.kicker')}</span>
        <h2 id="sdkmT">${T('sdkm.title')}</h2>
        <p class="sdkm__lead">${T('sdkm.lead')}</p>
        <div class="sdkm__tabs" role="tablist">${INSTALL_TABS.map(([k, l]) => `<button type="button" role="tab" aria-selected="${k === tab}" data-tab="${k}">${T('sdkm.' + l)}</button>`).join('')}</div>
        <div class="sdkm__body" role="tabpanel">${body()}</div>
        <div class="sdkm__foot"><a href="https://gitlab.com/kyber/apps/kyber-desktop#build" target="_blank" rel="noopener">${T('sdkm.readme')} ${ARRUR}</a><small>${T('sdkm.note')}</small></div>
      </div>`;
    };
    const open = () => { last = document.activeElement; render(); m.hidden = false; document.documentElement.classList.add('modal-open'); requestAnimationFrame(() => $('[aria-selected="true"]', m)?.focus()); };
    const close = () => { if (m.hidden) return; m.hidden = true; document.documentElement.classList.remove('modal-open'); last?.focus?.(); };
    document.addEventListener('click', (e) => { if (e.target.closest('[data-sdkm]')) { e.preventDefault(); open(); } }, true);
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('[data-close]')) return close();
      const tb = e.target.closest('[data-tab]'); if (tb) { tab = tb.dataset.tab; $$('[data-tab]', m).forEach(b => b.setAttribute('aria-selected', b === tb)); $('.sdkm__body', m).innerHTML = body(); return; }
      const cp = e.target.closest('[data-cp]'); if (cp) return copy(INSTALL[tab][+cp.dataset.cp], cp);
      const all = e.target.closest('[data-copyall]'); if (all) return copy(INSTALL[tab].filter(l => l && !l.startsWith('#')).map(l => l.replace(/\s+#.*$/, '')).join('\n'), all);
    });
    m.addEventListener('keydown', (e) => { const tb = e.target.closest('[data-tab]'); if (tb && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { const b = $$('[data-tab]', m); const i = b.indexOf(tb); const n = b[(i + (e.key === 'ArrowRight' ? 1 : b.length - 1)) % b.length]; n.click(); n.focus(); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !m.hidden) { e.preventDefault(); e.stopPropagation(); close(); } }, true);
  }

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
    document.addEventListener('keydown', (e) => { if (!m.hidden && e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); } if (!m.hidden && e.key === 'Tab') { const f = $$('button', m); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 + f.length : 1)) % f.length].focus(); } }, true);
  }

  /* ---------------- developer console ---------------- */
  function initConsole() {
    const el = document.createElement('div'); el.className = 'con'; el.id = 'con'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Console'); el.hidden = true;
    el.innerHTML = `<div class="con__bar"><i></i><i></i><i></i><span class="mono">kyber@browser: ~</span><button class="mono" data-x>esc</button></div><div class="con__out mono" role="log" aria-live="polite"></div><label class="con__in mono"><span>❯</span><input spellcheck="false" autocomplete="off" aria-label="${T('ui.command')}"></label>`;
    document.body.appendChild(el);
    const out = $('.con__out', el), inp = $('input', el); const hist = []; let hi = 0;
    const print = (txt, cls = '') => { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = txt; out.appendChild(d); out.scrollTop = out.scrollHeight; };
    const f1 = (v) => v == null ? '—' : v.toFixed(2);
    const CMD = {
      help: () => [['help', 'h_help'], ['metrics', 'h_metrics'], ['perf', 'h_perf'], ['lag <ms|off>', 'h_lag'], ['repos', 'h_repos'], ['release', 'h_release'], ['sdk', 'h_sdk'], ['jobs', 'h_jobs'], ['theme [dark|light]', 'h_theme'], ['lang <code>', 'h_lang'], ['goto <page>', 'h_goto'], ['whoami', 'h_whoami'], ['clear · exit', 'h_clear']].forEach(([c, k]) => print(c.padEnd(19) + ' ' + (k === 'h_lang' ? LANGS.map(x => x[0]).join(' ') : t('con.' + k)))),
      metrics: () => { const m = FX.metrics; print(`frame p50 ${f1(m.p50)} ms · p95 ${f1(m.p95)} ms · jitter ${f1(m.p95 - m.p50)} ms`); print(`refresh ≈ ${m.hz} Hz · frames ${m.frames} · long frames (>50 ms) ${m.longF}`); print(`last input → next frame ${m.inputNext == null ? '— (' + t('con.pressKey') + ')' : f1(m.inputNext) + ' ms'} · handler delay ${f1(m.input)} ms`); print(t('con.target'), 'dim'); },
      perf: () => { const nav = performance.getEntriesByType('navigation')[0]; if (nav) print(`navigation  ttfb ${f1(nav.responseStart)} ms · dom ${f1(nav.domContentLoadedEventEnd)} ms · boot ${f1(window.__boot || 0)} ms`); performance.getEntriesByType('resource').slice(-14).forEach(r => print(`${(r.duration).toFixed(1).padStart(7)} ms  ${r.transferSize === 0 ? 'cache' : (r.transferSize / 1024).toFixed(1) + ' kB'}  ${r.name.replace(location.origin, '').split('?')[0].slice(-58)}`)); },
      lag: (a) => { const v = a === 'off' ? 0 : Math.max(0, Math.min(2000, +a || 200)); FX.lag = v; print(v ? fill(t('con.lagOn'), { n: v }) : t('con.lagOff')); },
      repos: () => REPOS.forEach(([pth]) => { const v = REPOSNAP[pth]; print(`★${String(v[0]).padStart(3)}  ${v[1]}  gitlab.com/${pth}`); }),
      release: () => { print(`${REL.tag}  ${REL.date}  ${REL.file}`); print(REL.url, 'dim'); },
      sdk: () => { print('$ ' + CLONE); print('docs   ' + DOCS); print('build  gitlab.com/kyber/apps/kyber-desktop'); print('embed  gitlab.com/kyber/core/kysdk  (Rust · C via cbindgen · JS via wasm-bindgen)'); },
      jobs: () => ['j1', 'j2', 'j3', 'j4', 'j5'].forEach(j => print('· ' + t('about.' + j))),
      theme: (a) => { const n = a || (document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); document.documentElement.dataset.theme = n; print('theme → ' + n); },
      lang: (a) => { if (!a) return print('lang <code>'); setLang(a); print('lang → ' + a); },
      goto: (a) => { location.hash = '#/' + (a || ''); print('route → /' + (a || '')); },
      whoami: () => { print(`lang ${navigator.language} · tz ${Intl.DateTimeFormat().resolvedOptions().timeZone}`); print(`viewport ${innerWidth}×${innerHeight} @${devicePixelRatio}x · ${FX.metrics.hz} Hz · cores ${navigator.hardwareConcurrency || '?'}`); print(`webtransport ${'WebTransport' in window ? 'yes' : 'no'} · webcodecs ${'VideoEncoder' in window ? 'yes' : 'no'} · webgpu ${'gpu' in navigator ? 'yes' : 'no'}`); print(t('con.local'), 'dim'); },
      clear: () => { out.innerHTML = ''; }, exit: () => close(), sudo: () => print(t('con.sudo'), 'dim'), vlc: () => print('▲ ' + t('con.cone'), 'dim'), ping: () => { const t0 = performance.now(); fetch('i18n/en.json', { cache: 'no-store' }).then(() => print(fill(t('con.rtt'), { n: (performance.now() - t0).toFixed(1) }))); }
    };
    const run = (line) => { print('❯ ' + line, 'cmd'); const [c, ...a] = line.trim().split(/\s+/); if (!c) return; (CMD[c] || (() => print(fill(t('con.notFound'), { c }), 'err')))(a.join(' ')); };
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
    ui(); initConsole(); initA11y(); initExternal(); initSdkModal(); initLogo(); initLangModal();
    await loadP;
    route(true);
    window.__boot = performance.now();
    loaderNum.textContent = Math.round(window.__boot); bar.style.width = '100%';
    setTimeout(() => $('#loader').classList.add('done'), 120);
    fetchRepo();
  }
  boot();
})();
