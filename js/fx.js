/* Kyber redesign — visual effects library */
(function () {
  const FX = {};
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  FX.RM = RM;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const hex2rgb = (h) => {
    h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  };
  FX.color = css;
  const isRTL = () => document.documentElement.dir === 'rtl';

  // visibility-aware RAF loop
  function loop(el, fn) {
    let raf = 0, vis = true, alive = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf && alive) raf = requestAnimationFrame(tick); }, { rootMargin: '100px' });
    io.observe(el);
    let last = performance.now();
    function tick(now) {
      raf = 0; if (!alive) return;
      const dt = Math.min(64, now - last); last = now;
      fn(now, dt);
      if (vis) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { alive = false; io.disconnect(); cancelAnimationFrame(raf); };
  }
  FX.loop = loop;

  function fitCanvas(cv, maxDpr = 2) {
    const d = Math.min(maxDpr, devicePixelRatio || 1);
    const r = cv.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    return { w, h, d, cw: r.width, ch: r.height };
  }
  FX.fit = fitCanvas;

  /* ---------------- HERO: WebGL signal field ---------------- */
  FX.hero = function (cv) {
    const gl = cv.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return () => {};
    const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
    const fs = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 c1;uniform vec3 c2;uniform float mi;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
void main(){
 vec2 uv=gl_FragCoord.xy/r;float asp=r.x/r.y;vec2 p=vec2(uv.x*asp,uv.y);
 float N=floor(r.y/ (r.x<800.?11.:13.));
 float id=floor(uv.y*N);float acc=0.;float hot=0.;
 vec2 mp=vec2(m.x*asp,m.y);
 for(int k=-3;k<=3;k++){
  float li=id+float(k);float ly=(li+.5)/N;
  float env=smoothstep(-.1,.6,uv.x)*smoothstep(1.1,.4,uv.x);
  float d=distance(vec2(p.x,ly),mp);
  float bump=exp(-d*d*14.)*.075*mi;
  float wave=(n(vec2(p.x*1.8+t*.11,li*.23+t*.05))-.5)*.085*env+sin(p.x*5.-t*.9+li*.31)*.005;
  float yy=ly+wave+bump;
  float dist=abs(uv.y-yy)*r.y;
  float line=smoothstep(1.25,0.,dist);
  float sel=step(.82,h(vec2(li,7.)));
  float pk=fract(t*(.07+.08*h(vec2(li,3.)))+h(vec2(li,1.)));
  float px=pk*(asp+.6)-.3;
  float tail=p.x<px? exp(-(px-p.x)*7.):exp(-(p.x-px)*60.);
  float g=tail*sel;
  float fade=smoothstep(.0,.45,ly)*smoothstep(1.02,.7,ly);
  acc+=line*(.13+bump*7.)*fade;
  hot+=line*g*fade;
 }
 vec3 col=mix(c1,c2,uv.x*.9+.05);
 float a=clamp(acc+hot,0.,1.);
 vec3 o=col*acc+mix(col,vec3(1.),.35)*hot;
 gl_FragColor=vec4(o,a);
}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(pr, n);
    const ur = U('r'), ut = U('t'), um = U('m'), uc1 = U('c1'), uc2 = U('c2'), umi = U('mi');
    const mouse = { x: .7, y: .6, tx: .7, ty: .6, i: 0, ti: 0 };
    const onMove = (e) => {
      const r = cv.getBoundingClientRect(); const pt = e.touches ? e.touches[0] : e;
      mouse.tx = (pt.clientX - r.left) / r.width; mouse.ty = 1 - (pt.clientY - r.top) / r.height; mouse.ti = 1;
    };
    const onLeave = () => { mouse.ti = 0; };
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    let t0 = performance.now();
    const stop = loop(cv, (now) => {
      const { w, h } = fitCanvas(cv, 1.5);
      gl.viewport(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08; mouse.i += (mouse.ti - mouse.i) * .05;
      if (!mouse.ti) { const tt = now / 1000; mouse.tx = .62 + Math.cos(tt * .3) * .22; mouse.ty = .62 + Math.sin(tt * .41) * .14; mouse.ti = 0; mouse.i += (.55 - mouse.i) * .02; }
      gl.uniform2f(ur, w, h); gl.uniform1f(ut, RM ? 10 : (now - t0) / 1000);
      gl.uniform2f(um, mouse.x, mouse.y); gl.uniform1f(umi, mouse.i);
      gl.uniform3fv(uc1, hex2rgb(css('--accent'))); gl.uniform3fv(uc2, hex2rgb(css('--accent2')));
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
    return () => { stop(); removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); };
  };

  /* ---------------- Sparkline for HUD ---------------- */
  FX.spark = function (cv, getVal) {
    const ctx = cv.getContext('2d'); const pts = [];
    return loop(cv, () => {
      const { w, h, d } = fitCanvas(cv);
      pts.push(getVal()); if (pts.length > 60) pts.shift();
      ctx.clearRect(0, 0, w, h); ctx.lineWidth = 1.2 * d; ctx.strokeStyle = css('--accent'); ctx.beginPath();
      pts.forEach((v, i) => { const x = i / 59 * w, y = h - (v - 6) / 5 * h; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    });
  };

  /* ---------------- Pointer FX: zero-lag native cursor + idle signal + click sparks ---------------- */
  FX.cursor = function () {
    const cv = document.getElementById('fxlayer'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (fine) document.body.classList.add('has-cursor');
    let x = -99, y = -99, lastMove = 0, lastWave = 0, inside = false;
    const waves = [], sparks = [];
    const col = () => css('--accent');
    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; lastMove = performance.now(); inside = true; }, { passive: true });
    document.addEventListener('pointerleave', () => inside = false);
    addEventListener('pointerdown', (e) => {
      if (RM) return;
      const n = e.pointerType === 'touch' ? 14 : 20;
      for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5.5; sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, len: 6 + Math.random() * 12, hot: Math.random() < .25 }); }
      waves.push({ x: e.clientX, y: e.clientY, r: 4, life: 1, strong: true });
    }, { passive: true });
    let running = false;
    function frame(now) {
      const d = Math.min(2, devicePixelRatio || 1);
      if (cv.width !== innerWidth * d || cv.height !== innerHeight * d) { cv.width = innerWidth * d; cv.height = innerHeight * d; }
      ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
      // idle signal: once the pointer rests, emit soft concentric pings
      if (fine && inside && !RM && now - lastMove > 420 && now - lastWave > 1100) { waves.push({ x, y, r: 6, life: 1 }); lastWave = now; }
      const c = col();
      ctx.lineCap = 'round';
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i]; w.r += w.strong ? 3.2 : 1.1; w.life -= w.strong ? .035 : .012;
        if (w.life <= 0) { waves.splice(i, 1); continue; }
        ctx.strokeStyle = c; ctx.globalAlpha = w.life * (w.strong ? .8 : .45); ctx.lineWidth = w.strong ? 1.6 : 1;
        ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.stroke();
        if (!w.strong) { ctx.globalAlpha = w.life * .25; ctx.beginPath(); ctx.arc(w.x, w.y, w.r * .55, 0, Math.PI * 2); ctx.stroke(); }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]; p.x += p.vx; p.y += p.vy; p.vx *= .92; p.vy = p.vy * .92 + .12; p.life -= .03;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        const sp = Math.hypot(p.vx, p.vy) || 1;
        ctx.strokeStyle = p.hot ? css('--hot') : c; ctx.globalAlpha = p.life; ctx.lineWidth = 1.6 * p.life + .4;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx / sp * p.len * p.life, p.y - p.vy / sp * p.len * p.life); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    if (!running) { running = true; requestAnimationFrame(frame); }
  };
  FX.tilt = function (scope) {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches || RM) return;
    scope.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateZ(0)`;
        el.style.setProperty('--gx', (px + .5) * 100 + '%'); el.style.setProperty('--gy', (py + .5) * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  };
  FX.magnetic = function (scope) {
    if (!matchMedia('(hover:hover)').matches || RM) return;
    scope.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2; el.style.transform = `translate(${dx * .25}px,${dy * .35}px)`; });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  };
  FX.spotlight = function (scope) {
    scope.querySelectorAll('.fcard').forEach(el => el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
  };

  /* ---------------- Latency playground ---------------- */
  FX.playground = function (field, onRead) {
    const cv = field.querySelector('canvas'); const ctx = cv.getContext('2d');
    const st = { lat: 8, color: css('--accent'), samples: [], lastInput: 0, trail: [] };
    const add = (x, y, t) => { st.samples.push({ x, y, t }); if (st.samples.length > 600) st.samples.splice(0, 200); };
    const move = (e) => { const r = cv.getBoundingClientRect(); add(e.clientX - r.left, e.clientY - r.top, performance.now()); st.lastInput = performance.now(); };
    field.addEventListener('pointermove', move); field.addEventListener('pointerdown', move);
    function at(t) {
      const s = st.samples; if (!s.length) return null;
      if (t <= s[0].t) return s[0];
      for (let i = s.length - 1; i > 0; i--) { if (s[i - 1].t <= t) { const a = s[i - 1], b = s[i]; const k = b.t === a.t ? 1 : Math.min(1, (t - a.t) / (b.t - a.t)); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }; } }
      return s[s.length - 1];
    }
    let errAvg = 0;
    const stop = loop(field, (now) => {
      const { w, h, d, cw, ch } = fitCanvas(cv);
      ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, cw, ch);
      if (now - st.lastInput > 1600) { // autopilot
        const tt = now / 1000; add(cw / 2 + Math.sin(tt * 1.3) * cw * .32, ch / 2 + Math.sin(tt * 2.1) * ch * .28, now);
      }
      const me = st.samples[st.samples.length - 1] || { x: cw / 2, y: ch / 2 };
      const jitter = st.lat > 50 ? (Math.random() - .5) * st.lat * .12 : 0;
      const m = at(now - st.lat - jitter) || me;
      st.trail.push({ x: m.x, y: m.y }); if (st.trail.length > 40) st.trail.shift();
      // user trail
      ctx.lineWidth = 1; ctx.strokeStyle = css('--faint'); ctx.beginPath();
      const s = st.samples.slice(-50); s.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
      // error vector
      ctx.setLineDash([3, 4]); ctx.strokeStyle = st.color; ctx.globalAlpha = .7; ctx.beginPath(); ctx.moveTo(me.x, me.y); ctx.lineTo(m.x, m.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      // machine trail
      st.trail.forEach((p, i) => { ctx.globalAlpha = i / st.trail.length * .35; ctx.fillStyle = st.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fill(); });
      ctx.globalAlpha = 1;
      // machine ring
      ctx.strokeStyle = st.color; ctx.lineWidth = 2; ctx.shadowColor = st.color; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(m.x, m.y, 22, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m.x - 30, m.y); ctx.lineTo(m.x - 14, m.y); ctx.moveTo(m.x + 14, m.y); ctx.lineTo(m.x + 30, m.y); ctx.moveTo(m.x, m.y - 30); ctx.lineTo(m.x, m.y - 14); ctx.moveTo(m.x, m.y + 14); ctx.lineTo(m.x, m.y + 30); ctx.stroke();
      ctx.shadowBlur = 0;
      // user dot
      ctx.fillStyle = css('--ink'); ctx.beginPath(); ctx.arc(me.x, me.y, 6, 0, 7); ctx.fill();
      const err = Math.hypot(me.x - m.x, me.y - m.y); errAvg += (err - errAvg) * .1;
      onRead && onRead(errAvg);
    });
    return { set(lat, color) { st.lat = lat; st.color = color; }, stop };
  };

  /* ---------------- Push vs pull lanes ---------------- */
  FX.lane = function (cv, buffered, onTime) {
    const ctx = cv.getContext('2d'); const stages = 5; let packets = []; let spawn = 0; let ms = 0;
    return loop(cv, (now, dt) => {
      const { w, h, d, cw, ch } = fitCanvas(cv); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, cw, ch);
      const rtl = isRTL(); const X = (x) => rtl ? cw - x : x;
      const seg = cw / stages; const accent = css('--accent'), hot = css('--hot'), line = css('--line2');
      for (let i = 0; i < stages; i++) {
        ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.strokeRect(X(i * seg + 6) - (rtl ? seg - 12 : 0), ch / 2 - 18, seg - 12, 36);
        if (buffered) { // buffer slots
          ctx.fillStyle = css('--faint'); for (let k = 0; k < 4; k++) ctx.fillRect(X(i * seg + seg - 22 - k * 7) - (rtl ? 4 : 0), ch / 2 + 22, 4, 6);
        }
      }
      spawn -= dt; if (spawn <= 0) { packets.push({ x: 0, wait: 0, stage: 0 }); spawn = buffered ? 260 : 120; }
      const sp = cw / (buffered ? 2400 : 300); // px per ms
      packets.forEach(p => {
        const stage = Math.floor(p.x / seg);
        if (buffered && stage !== p.stage && stage < stages) { p.stage = stage; p.wait = 380; }
        if (p.wait > 0) p.wait -= dt; else p.x += sp * dt * (buffered ? 3.2 : 1);
      });
      packets = packets.filter(p => p.x < cw);
      packets.forEach(p => {
        const col = buffered ? hot : accent; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10;
        ctx.fillRect(X(p.x) - 4, ch / 2 - 4 + (p.wait > 0 ? 0 : 0), 8, 8); ctx.shadowBlur = 0;
      });
      ms += ((buffered ? 180 + Math.random() * 40 : 8 + Math.random() * 1.6) - ms) * .05;
      onTime && onTime(ms);
    });
  };

  /* ---------------- Priority demo ---------------- */
  FX.priority = function (cv, mode) {
    const ctx = cv.getContext('2d'); let items = []; let sp = 0; const keys = ['W', 'A', 'S', 'D', '↑', '⏎', 'Q', 'E'];
    return loop(cv, (now, dt) => {
      const { d, cw, ch } = fitCanvas(cv); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, cw, ch);
      const rtl = isRTL(); const X = (x) => rtl ? cw - x : x;
      const accent = css('--accent'), faint = css('--faint'), ink = css('--ink');
      sp -= dt;
      if (sp <= 0) { items.push({ x: 0, y: 20 + Math.random() * (ch - 60), drop: mode === 'media' && Math.random() < .55, a: 1, k: keys[Math.floor(Math.random() * keys.length)], vy: 0 }); sp = mode === 'media' ? 90 : 420; }
      items.forEach(it => {
        it.x += dt * (mode === 'media' ? .28 : .22);
        if (it.drop && it.x > cw * .45) { it.vy += .02 * dt; it.y += it.vy; it.a -= .002 * dt; }
      });
      items = items.filter(it => it.x < cw + 30 && it.a > 0 && it.y < ch + 40);
      // gate line
      ctx.strokeStyle = css('--line2'); ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(X(cw * .45), 8); ctx.lineTo(X(cw * .45), ch - 8); ctx.stroke(); ctx.setLineDash([]);
      items.forEach(it => {
        ctx.globalAlpha = Math.max(0, it.a);
        if (mode === 'media') {
          ctx.fillStyle = it.drop ? faint : accent; ctx.fillRect(X(it.x) - 14, it.y, 28, 18);
          ctx.fillStyle = css('--bg2'); ctx.fillRect(X(it.x) - 10, it.y + 4, 20, 10);
        } else {
          const done = it.x > cw - 40;
          ctx.strokeStyle = accent; ctx.fillStyle = done ? accent : 'transparent'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.roundRect(X(it.x) - 16, it.y, 32, 30, 6); ctx.fill(); ctx.stroke();
          ctx.fillStyle = done ? css('--accent-ink') : ink; ctx.font = '500 13px Geist Mono, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it.k, X(it.x), it.y + 15);
        }
        ctx.globalAlpha = 1;
      });
    });
  };

  /* ---------------- Network degradation scene ---------------- */
  FX.network = function (cv, getQ) {
    const ctx = cv.getContext('2d'); const off = document.createElement('canvas'); const o = off.getContext('2d');
    return loop(cv, (now) => {
      const { d, cw, ch } = fitCanvas(cv, 1.5); const q = getQ(); // 0..1
      const scale = 0.04 + Math.pow(q, 1.6) * 0.96;
      const W = Math.max(12, Math.round(cw * scale)), H = Math.max(8, Math.round(ch * scale));
      off.width = W; off.height = H; const t = now / 1000;
      // scene: perspective grid + drone
      o.fillStyle = '#05080f'; o.fillRect(0, 0, W, H);
      const g = o.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d1a2e'); g.addColorStop(.55, '#05080f'); o.fillStyle = g; o.fillRect(0, 0, W, H * .55);
      o.strokeStyle = 'rgba(141,180,255,.55)'; o.lineWidth = Math.max(.5, W / 600);
      const hz = H * .55;
      for (let i = -12; i <= 12; i++) { o.beginPath(); o.moveTo(W / 2 + i * W * .02, hz); o.lineTo(W / 2 + i * W * .22, H); o.stroke(); }
      for (let j = 0; j < 14; j++) { const z = ((j + (t * 1.4) % 1) / 14); const y = hz + Math.pow(z, 2.2) * (H - hz); o.globalAlpha = z; o.beginPath(); o.moveTo(0, y); o.lineTo(W, y); o.stroke(); }
      o.globalAlpha = 1;
      // drone
      const dx = W * (.5 + Math.sin(t * .7) * .2), dy = H * (.36 + Math.sin(t * 1.3) * .05), s = W / 22;
      o.fillStyle = '#e9f1f3'; o.strokeStyle = '#e9f1f3'; o.lineWidth = Math.max(1, s / 6);
      o.beginPath(); o.moveTo(dx - s, dy - s * .5); o.lineTo(dx + s, dy + s * .5); o.moveTo(dx + s, dy - s * .5); o.lineTo(dx - s, dy + s * .5); o.stroke();
      [[-1, -.5], [1, .5], [1, -.5], [-1, .5]].forEach(([a, b]) => { o.beginPath(); o.ellipse(dx + a * s, dy + b * s, s * .55, s * .14, 0, 0, 7); o.fill(); });
      o.fillStyle = '#8db4ff'; o.beginPath(); o.arc(dx, dy, s * .28, 0, 7); o.fill();
      // reticle
      o.strokeStyle = 'rgba(255,91,58,.9)'; o.lineWidth = Math.max(1, W / 500); o.strokeRect(dx - s * 1.8, dy - s * 1.3, s * 3.6, s * 2.6);
      // draw upscaled
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = q > .55; ctx.drawImage(off, 0, 0, cv.width, cv.height);
      // packet loss artifacts
      const loss = (1 - q) * .3; ctx.fillStyle = 'rgba(5,8,15,.9)';
      for (let k = 0; k < loss * 40; k++) { if (Math.random() < .5) { const bh = cv.height / 18; ctx.fillRect(0, Math.floor(Math.random() * 18) * bh, cv.width * (.2 + Math.random() * .8), bh * .4); } }
      // HUD text
      ctx.setTransform(d, 0, 0, d, 0, 0); ctx.font = '500 12px Geist Mono, monospace'; ctx.fillStyle = '#8db4ff'; ctx.textAlign = 'left';
      ctx.fillText('CTRL ⟶ ' + (8 + Math.random() * 1.2).toFixed(1) + ' ms', 14, 22);
      ctx.fillStyle = 'rgba(228,243,241,.7)'; ctx.fillText(Math.round(scale * 1080) + 'p · FEC ' + (q < .9 ? 'ON' : 'IDLE'), 14, 40);
    });
  };

  /* ---------------- Count up ---------------- */
  FX.count = function (el, to, dur = 1.6, dec = 0) {
    const o = { v: 0 };
    if (!window.gsap || RM) { el.textContent = to.toFixed(dec); return; }
    gsap.to(o, { v: to, duration: dur, ease: 'power3.out', onUpdate: () => el.textContent = o.v.toFixed(dec) });
  };

  /* ---------------- Text scramble ---------------- */
  FX.scramble = function (el) {
    if (RM) return; const fin = el.textContent; const ch = '01<>/_-=+*#%ms';
    if (!/^[\x00-\x7F]*$/.test(fin)) return; // latin only
    let f = 0; const tot = 18;
    const id = setInterval(() => { f++; el.textContent = fin.split('').map((c, i) => (i < (f / tot) * fin.length || c === ' ') ? c : ch[Math.floor(Math.random() * ch.length)]).join(''); if (f >= tot) { clearInterval(id); el.textContent = fin; } }, 30);
  };

  window.FX = FX;
})();
