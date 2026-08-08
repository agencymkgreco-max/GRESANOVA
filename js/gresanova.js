/* ═══════════════════════════════════════════════════════════════
   GRESANOVA · comportamiento compartido
   Todos los módulos se activan solo si su marcado existe en la página.
   ═══════════════════════════════════════════════════════════════ */
(() => {
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOVER = matchMedia('(hover:hover)').matches;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

document.body.classList.add('rdy');

/* ── Menú ─────────────────────────────────────────────────── */
const nav = $('.nav'), burger = $('#burger'), drawer = $('#drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const on = drawer.classList.toggle('on');
    burger.classList.toggle('on', on);
    burger.setAttribute('aria-expanded', on);
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    drawer.classList.remove('on'); burger.classList.remove('on');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

/* ── El menú cambia de piel según la banda que tiene detrás ── */
const darkBands = $$('.band-dark');
const syncNav = () => {
  if (!nav) return;
  const probe = (nav.offsetHeight || 66) * 0.55;
  const onDark = darkBands.some(b => {
    const r = b.getBoundingClientRect();
    return r.top <= probe && r.bottom >= probe;
  });
  nav.classList.toggle('on-dark', onDark);
  if (drawer) drawer.classList.toggle('band-dark', onDark);
};

/* ── Revelados al entrar en pantalla ──────────────────────── */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.14, rootMargin:'0px 0px -8% 0px'});
$$('.rv').forEach(el => io.observe(el));

/* ── Contadores y barras calibradas ───────────────────────── */
const countUp = el => {
  const to = parseFloat(el.dataset.to), dec = (el.dataset.dec | 0);
  if (RM) { el.textContent = to.toFixed(dec); return; }
  const t0 = performance.now(), dur = 1400;
  const step = now => {
    const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (e * to).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.querySelectorAll('[data-to]').forEach(countUp);
  e.target.querySelectorAll('[data-fill]').forEach(b => b.style.width = b.dataset.fill + '%');
  io2.unobserve(e.target);
}), {threshold:.35});
$$('.met,.diag-cell,.plot-wide,.ctx-stats,.barlist,.stat-card').forEach(el => io2.observe(el));

/* ── Revelado por palabra (desenfoque + ascenso + escala) ─── */
const splitWords = el => {
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      if (!n.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (!t.trim()) { frag.appendChild(document.createTextNode(t)); return; }
        const w = document.createElement('span'); w.className = 'wd';
        const i = document.createElement('span'); i.className = 'wd-i'; i.textContent = t;
        w.appendChild(i); frag.appendChild(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
  });
  walk(el);
  el.querySelectorAll('.wd-i').forEach((w, i) => w.style.transitionDelay = (i * 0.056).toFixed(3) + 's');
};
const titles = $$('[data-split]');
titles.forEach(splitWords);
const first = $('.hero [data-split], .phead [data-split]');
if (first) setTimeout(() => first.classList.add('on'), 240);
const ioW = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('on'); ioW.unobserve(e.target); }
}), {threshold:.3, rootMargin:'0px 0px -6% 0px'});
titles.forEach(t => { if (t !== first) ioW.observe(t); });

/* ── Foco de luz sobre las tarjetas ───────────────────────── */
if (HOVER) $$('.card,.soc').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

/* ── Escala calibrada: mapa real del documento ────────────── */
const scale = $('#scale');
let marks = [];
if (scale) {
  const needle = $('#needle');
  $$('#scale [data-sect]').forEach(() => {});
  const ids = (scale.dataset.sects || '').split(',').filter(Boolean);
  marks = ids.map(pair => {
    const [id, label] = pair.split('|');
    const el = document.getElementById(id); if (!el) return null;
    const item = document.createElement('div'); item.className = 'scale-item';
    const t = document.createElement('span'); t.className = 'scale-tick maj';
    const l = document.createElement('a'); l.className = 'scale-lbl'; l.textContent = label; l.href = '#' + id;
    item.append(t, l); scale.append(item);
    return {el, t, l, item};
  }).filter(Boolean);
  for (let i = 0; i <= 100; i += 4) {
    const t = document.createElement('span');
    t.className = 'scale-tick'; t.style.top = i + '%'; t.style.opacity = '.2';
    scale.append(t);
  }
  setTimeout(() => scale.classList.add('on'), 700);
}
const layoutScale = () => {
  const H = document.documentElement.scrollHeight;
  marks.forEach(m => {
    const p = clamp(m.el.offsetTop / H, 0, 1) * 100;
    m.t.style.top = p + '%'; m.l.style.top = p + '%';
  });
};

/* ── Pista horizontal fijada ──────────────────────────────── */
const pin = $('[data-pin]'), track = $('#track');
let pinned = false, trackX = 0, steps = [];
const trackOverflow = () => {
  if (!track || !track.lastElementChild) return 0;
  const last = track.lastElementChild, gut = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  return Math.max(0, (last.offsetLeft - track.offsetLeft) + last.offsetWidth + gut - innerWidth);
};
const sizePin = () => {
  if (!pin || !track) return;
  steps = [...track.children];
  pinned = innerWidth > 900 && !RM;
  if (!pinned) { pin.style.height = ''; track.style.transform = ''; return; }
  pin.style.height = (innerHeight + trackOverflow() * 1.15) + 'px';
  const rail = $('#progRail');
  if (rail && !rail.dataset.t) {
    steps.forEach((s, i) => {
      const t = document.createElement('span'); t.className = 'prog-t';
      t.style.left = (i / (steps.length - 1) * 100) + '%'; rail.append(t);
    });
    rail.dataset.t = 1;
  }
};

/* ── Bucle de scroll ──────────────────────────────────────── */
const heroBg = $('#heroBg'), needle = $('#needle'), read = $('#read'), progFill = $('#progFill');
const onFrame = () => {
  const y = scrollY;
  if (nav) nav.classList.toggle('stuck', y > 40);
  syncNav();
  if (heroBg && !RM && y < innerHeight * 1.3)
    heroBg.style.transform = `translate3d(0,${y * 0.13}px,0) scale(${1 + y / innerHeight * .045})`;

  if (scale) {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(y / max, 0, 1) : 0;
    if (needle) needle.style.top = (p * 100) + '%';
    if (read) read.textContent = String(Math.round(p * 100)).padStart(2, '0');
    marks.forEach(m => {
      const r = m.el.getBoundingClientRect();
      m.item.classList.toggle('act', r.top <= innerHeight * .45 && r.bottom > innerHeight * .45);
    });
  }
  if (pinned && pin && track) {
    const r = pin.getBoundingClientRect(), total = pin.offsetHeight - innerHeight;
    const pp = clamp(-r.top / total, 0, 1);
    trackX = lerp(trackX, -pp * trackOverflow(), .12);
    track.style.transform = `translate3d(${trackX}px,0,0)`;
    if (progFill) progFill.style.width = (pp * 100) + '%';
    const ai = Math.min(steps.length - 1, Math.floor(pp * steps.length * .999));
    steps.forEach((s, i) => s.classList.toggle('act', i === ai));
  }
  requestAnimationFrame(onFrame);
};
addEventListener('resize', () => { sizePin(); layoutScale(); });
sizePin(); layoutScale(); requestAnimationFrame(onFrame);
setTimeout(() => { sizePin(); layoutScale(); }, 800);

/* ── Bruma volumétrica del hero ───────────────────────────── */
(() => {
  const cv = $('#haze'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let w, h, dust = [], vis = true;
  const LIGHTS = [
    {x:.72,y:.20,r:.66,c:[124,164,194],a:.20,sx:.00012,sy:.00009},
    {x:.18,y:.80,r:.60,c:[96,126,150],a:.15,sx:-.00009,sy:.00013},
    {x:.60,y:.55,r:.36,c:[196,142,48],a:.075,sx:.00015,sy:-.00007}
  ];
  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.5);
    w = cv.width = Math.max(1, r.width * d | 0); h = cv.height = Math.max(1, r.height * d | 0);
    dust = Array.from({length: innerWidth < 700 ? 16 : 34}, () => ({
      x: Math.random() * w, y: Math.random() * h, z: Math.random(),
      vx: (Math.random() - .5) * .12, vy: -.05 - Math.random() * .12
    }));
  };
  size(); addEventListener('resize', size);
  let t = 0;
  const draw = () => {
    t += 16; ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    LIGHTS.forEach(L => {
      const cx = (L.x + Math.sin(t * L.sx) * .05) * w, cy = (L.y + Math.cos(t * L.sy) * .05) * h;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, L.r * Math.max(w, h));
      g.addColorStop(0, `rgba(${L.c.join(',')},${L.a})`);
      g.addColorStop(.45, `rgba(${L.c.join(',')},${L.a * .28})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });
    dust.forEach(d => {
      d.x += d.vx * (.4 + d.z); d.y += d.vy * (.4 + d.z);
      if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
      if (d.x < -10) d.x = w + 10; if (d.x > w + 10) d.x = -10;
      ctx.beginPath(); ctx.arc(d.x, d.y, .4 + d.z * 1.5, 0, 6.283);
      ctx.fillStyle = `rgba(214,225,232,${.05 + d.z * .16})`; ctx.fill();
    });
    if (!RM && vis) requestAnimationFrame(draw);
  };
  new IntersectionObserver(es => es.forEach(e => {
    const was = vis; vis = e.isIntersecting;
    if (vis && !was && !RM) requestAnimationFrame(draw);
  }), {threshold:0}).observe(cv);
  draw();
})();

/* ── Registrador gráfico: utilidad antes y después ────────── */
(() => {
  const cv = $('#trace'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const cs = getComputedStyle(document.documentElement);
  const dark = cv.closest('.band-dark');
  const C = {
    grid: dark ? 'rgba(255,255,255,.06)' : 'rgba(20,25,29,.07)',
    axis: dark ? 'rgba(255,255,255,.16)' : 'rgba(20,25,29,.18)',
    flat: dark ? '#98A5AE' : '#8B98A2',
    sig:  dark ? '#E4B15C' : '#B07C1F',
    dim:  dark ? '#7A8892' : '#5E6B75'
  };
  const N = 13, MAXY = 34;
  const before = [9.4,8.8,9.9,8.2,9.1,7.6,8.9,8.1,7.4,8.6,7.9,7.1,8.2];
  const after  = [9.4,8.8,9.9,11.6,14.2,17.1,19.4,22.0,24.3,26.1,27.8,29.2,30.6];
  let W, H, PAD;
  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    cv.width = r.width * d; cv.height = r.width * d * .625;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    W = r.width; H = r.width * .625; PAD = {l:30, r:14, t:12, b:24};
  };
  const X = i => PAD.l + (W - PAD.l - PAD.r) * (i / (N - 1));
  const Y = v => PAD.t + (H - PAD.t - PAD.b) * (1 - v / MAXY);
  const frame = () => {
    ctx.clearRect(0, 0, W, H); ctx.lineWidth = 1;
    ctx.font = '500 8px "IBM Plex Mono", monospace'; ctx.textBaseline = 'middle';
    for (let v = 0; v <= 30; v += 10) {
      ctx.strokeStyle = C.grid; ctx.beginPath();
      ctx.moveTo(PAD.l, Y(v) + .5); ctx.lineTo(W - PAD.r, Y(v) + .5); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.textAlign = 'right'; ctx.fillText(v + '%', PAD.l - 8, Y(v));
    }
    ctx.strokeStyle = C.axis; ctx.beginPath();
    ctx.moveTo(PAD.l + .5, PAD.t); ctx.lineTo(PAD.l + .5, H - PAD.b); ctx.lineTo(W - PAD.r, H - PAD.b); ctx.stroke();
    ctx.textAlign = 'center';
    [0,3,6,9,12].forEach(m => {
      ctx.fillStyle = C.dim; ctx.fillText('M' + m, X(m), H - PAD.b + 11);
      ctx.strokeStyle = C.axis; ctx.beginPath();
      ctx.moveTo(X(m) + .5, H - PAD.b); ctx.lineTo(X(m) + .5, H - PAD.b + 4); ctx.stroke();
    });
  };
  const path = (arr, n, color, width) => {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= n && i < arr.length; i++) { const x = X(i), y = Y(arr[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    const f = n - Math.floor(n), i0 = Math.floor(n);
    if (f > 0 && i0 + 1 < arr.length) ctx.lineTo(lerp(X(i0), X(i0+1), f), lerp(Y(arr[i0]), Y(arr[i0+1]), f));
    ctx.stroke();
  };
  const marker = a => {
    const x = X(3); ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = C.sig; ctx.setLineDash([2,3]); ctx.globalAlpha = a * .45; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x + .5, PAD.t); ctx.lineTo(x + .5, H - PAD.b); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = a * .9;
    ctx.fillStyle = C.sig; ctx.font = '500 8px "IBM Plex Mono", monospace';
    ctx.textAlign = 'left'; ctx.fillText('IMPLEMENTACIÓN', x + 6, PAD.t + 6); ctx.restore();
  };
  const head = (arr, n, glow) => {
    const i0 = Math.min(arr.length - 1, Math.floor(n)), f = n - i0;
    const x = i0 + 1 < arr.length ? lerp(X(i0), X(i0+1), f) : X(i0);
    const y = i0 + 1 < arr.length ? lerp(Y(arr[i0]), Y(arr[i0+1]), f) : Y(arr[i0]);
    ctx.save(); ctx.shadowColor = C.sig; ctx.shadowBlur = 8 * glow;
    ctx.fillStyle = C.sig; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.283); ctx.fill(); ctx.restore();
  };
  let playing = false, t0 = 0;
  const render = now => {
    if (!t0) t0 = now;
    const prog = RM ? N - 1 : clamp((now - t0) / 2000, 0, 1) * (N - 1);
    frame(); marker(clamp((prog - 2.4) / 1.2, 0, 1));
    path(before, Math.min(prog, N-1), C.flat, 1);
    path(after, Math.min(prog, N-1), C.sig, 1.7);
    head(after, Math.min(prog, N-1), prog >= N-1 ? .85 + Math.sin(now/620)*.45 : 1);
    if (prog < N - 1 || !RM) requestAnimationFrame(render);
  };
  size(); frame();
  addEventListener('resize', () => { size(); if (!playing) frame(); });
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { playing = true; requestAnimationFrame(render); o.disconnect(); }
  }), {threshold:.3}).observe(cv);
})();

/* ── Globo de puntos con halo atmosférico ─────────────────── */
(() => {
  const cv = $('#globe'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const PTS = [], STARS = [];
  for (let la = -86; la <= 86; la += 4) {
    const rad = la * Math.PI / 180, r = Math.cos(rad), y = Math.sin(rad);
    const n = Math.max(8, Math.round(64 * r));
    for (let k = 0; k < n; k++) {
      const lo = (k / n) * Math.PI * 2;
      PTS.push([Math.cos(lo) * r, y, Math.sin(lo) * r]);
    }
  }
  for (let i = 0; i < 90; i++) STARS.push([Math.random(), Math.random(), Math.random() * .5 + .2]);
  const toXYZ = (la, lo) => { const a = la*Math.PI/180, b = lo*Math.PI/180;
    return [Math.cos(a)*Math.sin(b), Math.sin(a), Math.cos(a)*Math.cos(b)]; };
  const MKP = [[19.4,-99.1],[18.9,-99.2],[40.7,-74.0],[51.5,-.1],[35.7,139.7],[-23.5,-46.6]].map(m => toXYZ(m[0], m[1]));
  let W, H, R, dpr = 1, ang = 0, run = false;
  const size = () => {
    const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = Math.max(1, r.width * dpr); H = cv.height = Math.max(1, r.width * dpr); R = W * .335;
  };
  size(); addEventListener('resize', size);
  const draw = () => {
    ang += .0022; ctx.clearRect(0, 0, W, H);
    const cx = W/2, cy = H/2;
    ctx.globalCompositeOperation = 'lighter';
    STARS.forEach(st => { ctx.fillStyle = `rgba(206,218,226,${st[2]*.35})`; ctx.fillRect(st[0]*W, st[1]*H, dpr, dpr); });
    const halo = ctx.createRadialGradient(cx, cy, R*.90, cx, cy, R*1.42);
    halo.addColorStop(0,'rgba(226,170,66,.72)'); halo.addColorStop(.10,'rgba(206,150,52,.46)');
    halo.addColorStop(.30,'rgba(184,130,44,.20)'); halo.addColorStop(.62,'rgba(170,120,40,.06)');
    halo.addColorStop(1,'rgba(192,139,44,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R*1.42, 0, 6.283); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    const body = ctx.createRadialGradient(cx - R*.32, cy - R*.38, R*.06, cx, cy, R);
    body.addColorStop(0,'#10161C'); body.addColorStop(.62,'#080B0E'); body.addColorStop(1,'#040608');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R*.995, 0, 6.283); ctx.fill();
    const sa = Math.sin(ang), ca = Math.cos(ang);
    PTS.forEach(p => {
      const x = p[0]*ca - p[2]*sa, z = p[0]*sa + p[2]*ca, y = p[1];
      if (z < 0) return;
      const d = .30 + z*.70;
      ctx.fillStyle = `rgba(202,216,226,${(.13 + z*.55).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(cx + x*R, cy - y*R, 1.5*dpr*d, 0, 6.283); ctx.fill();
    });
    const t = performance.now()/1000;
    MKP.forEach((p, i) => {
      const x = p[0]*ca - p[2]*sa, z = p[0]*sa + p[2]*ca, y = p[1];
      if (z < .08) return;
      const sx = cx + x*R, sy = cy - y*R, ph = (t*.45 + i*.3) % 1;
      ctx.strokeStyle = `rgba(228,177,92,${(1-ph)*.5*z})`; ctx.lineWidth = dpr;
      ctx.beginPath(); ctx.arc(sx, sy, (2 + ph*11)*dpr, 0, 6.283); ctx.stroke();
      ctx.fillStyle = `rgba(240,208,146,${.85*z})`;
      ctx.beginPath(); ctx.arc(sx, sy, 2.1*dpr, 0, 6.283); ctx.fill();
    });
    if (run) requestAnimationFrame(draw);
  };
  new IntersectionObserver(es => es.forEach(e => {
    run = e.isIntersecting && !RM;
    if (run) requestAnimationFrame(draw); else draw();
  }), {threshold:.05}).observe(cv);
  draw();
})();

/* ── Botón con inercia ────────────────────────────────────── */
if (HOVER && !RM) {
  const m = $('#magnet');
  if (m) {
    m.addEventListener('pointermove', e => {
      const r = m.getBoundingClientRect();
      m.style.transform = `translate(${((e.clientX - (r.left + r.width/2)) / r.width) * 7}px,${((e.clientY - (r.top + r.height/2)) / r.height) * 5}px)`;
    });
    m.addEventListener('pointerleave', () => m.style.transform = '');
  }
}

/* ── Formulario → WhatsApp (sin backend) ──────────────────── */
const form = $('#form');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const v = id => (document.getElementById(id)?.value || '').trim();
  const note = $('#fnote');
  if (!v('n') || !v('a')) {
    note.textContent = 'Falta tu nombre o qué quieres resolver';
    note.style.color = 'var(--oxide)'; return;
  }
  const msg = ['Hola GRESANOVA, quiero agendar un diagnóstico.', '',
    'Nombre: ' + v('n'), v('e') ? 'Empresa: ' + v('e') : null, 'Equipo: ' + v('t'),
    '', 'Qué quiero resolver:', v('a')].filter(x => x !== null).join('\n');
  open('https://wa.me/527775417367?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  $('#sbt').textContent = 'WhatsApp abierto';
  note.textContent = 'Si no se abrió, escríbenos al +52 777 541 7367';
});

/* ── Galería: visor ───────────────────────────────────────── */
const gal = $('.gal');
if (gal) {
  const box = document.createElement('div');
  box.className = 'lightbox'; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '<button class="lb-x" aria-label="Cerrar">&times;</button><img alt="">';
  document.body.appendChild(box);
  const img = box.querySelector('img');
  const close = () => { box.classList.remove('on'); box.setAttribute('aria-hidden', 'true'); };
  gal.querySelectorAll('img').forEach(i => i.addEventListener('click', () => {
    img.src = i.src; img.alt = i.alt;
    box.classList.add('on'); box.setAttribute('aria-hidden', 'false');
  }));
  box.addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
})();
