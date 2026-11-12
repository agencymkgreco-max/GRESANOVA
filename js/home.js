
(() => {
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a,b,t) => a + (b-a)*t;
const clamp = (v,a,b) => v<a?a:v>b?b:v;

/* ── Secuencia de entrada ─────────────────────────────── */
addEventListener('load', () => {
  document.body.classList.add('rdy');
  setTimeout(() => document.getElementById('scale').classList.add('on'), 400);
});
document.body.classList.add('rdy'); // por si load ya pasó

/* ── Nav ──────────────────────────────────────────────── */
const nav = document.getElementById('nav'), burger = document.getElementById('burger'), drawer = document.getElementById('drawer');
burger.addEventListener('click', () => {
  const on = drawer.classList.toggle('on');
  burger.classList.toggle('on', on);
  burger.setAttribute('aria-expanded', on);
});
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  drawer.classList.remove('on'); burger.classList.remove('on'); burger.setAttribute('aria-expanded','false');
}));

/* ── Reveals ──────────────────────────────────────────── */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.14, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ── Contadores y barras calibradas ───────────────────── */
const countUp = el => {
  const to = +el.dataset.to, t0 = performance.now(), dur = 1400;
  const step = now => {
    const p = clamp((now-t0)/dur, 0, 1), e = 1-Math.pow(1-p, 3);
    el.textContent = Math.round(e*to);
    if (p < 1) requestAnimationFrame(step);
  };
  RM ? el.textContent = to : requestAnimationFrame(step);
};
const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.querySelectorAll('[data-to]').forEach(countUp);
  e.target.querySelectorAll('[data-fill]').forEach(b => b.style.width = b.dataset.fill + '%');
  io2.unobserve(e.target);
}), {threshold:.4});
document.querySelectorAll('.met,.diag-cell,.delta').forEach(el => io2.observe(el));

/* ── Foco de luz en tarjetas (superficie maquinada) ───── */
if (matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX-r.left)+'px');
      c.style.setProperty('--my', (e.clientY-r.top)+'px');
    });
  });
}

/* ── Escala calibrada: mapa real del documento ─────────── */
const scale = document.getElementById('scale'), needle = document.getElementById('needle'), read = document.getElementById('read');
const SECTS = [['hero','Inicio'],['diagnostico','Diagnóstico'],['servicios','Servicios'],['sistema','Sistema'],
               ['especialidades','Especialidades'],['contexto','Contexto'],['nosotros','Nosotros'],['contacto','Contacto']];
const marks = SECTS.map(([id,label]) => {
  const el = document.getElementById(id); if (!el) return null;
  const item = document.createElement('div'); item.className = 'scale-item';
  const t = document.createElement('span'); t.className = 'scale-tick maj';
  const l = document.createElement('a'); l.className = 'scale-lbl'; l.textContent = label; l.href = '#'+id;
  item.append(t,l); scale.append(item);
  return {el,t,l,item};
}).filter(Boolean);
// marcas menores cada 4% para que se lea como escala
for (let i=0;i<=100;i+=4){
  const t = document.createElement('span'); t.className='scale-tick'; t.style.top = i+'%'; t.style.opacity='.22';
  scale.append(t);
}
const layout = () => {
  const H = document.documentElement.scrollHeight;
  marks.forEach(m => {
    const p = clamp(m.el.offsetTop / H, 0, 1) * 100;
    m.t.style.top = p+'%'; m.l.style.top = p+'%';
  });
};

/* ── Bucle de scroll: parallax + escala + pista fijada ── */
const heroBg = document.getElementById('heroBg');
const pin = document.querySelector('[data-pin]'), stage = pin.querySelector('.stage'), track = document.getElementById('track');
const progFill = document.getElementById('progFill'), steps = [...track.children];
let trackX = 0, targetX = 0, pinned = false;

const trackOverflow = () => {
  const last = track.lastElementChild, gut = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const contentW = (last.offsetLeft - track.offsetLeft) + last.offsetWidth + gut;
  return Math.max(0, contentW - innerWidth);
};
const sizePin = () => {
  pinned = innerWidth > 900 && !RM;
  if (!pinned) { pin.style.height=''; track.style.transform=''; return; }
  pin.style.height = (innerHeight + trackOverflow() * 1.15) + 'px';
  // marcas de etapa en la barra de avance
  const rail = document.getElementById('progRail');
  if (!rail.dataset.t) {
    steps.forEach((s,i) => { const t=document.createElement('span'); t.className='prog-t';
      t.style.left = (i/(steps.length-1)*100)+'%'; rail.append(t); });
    rail.dataset.t = 1;
  }
};

const bands = [...document.querySelectorAll('.band-dark')];
const onFrame = () => {
  const y = scrollY;
  nav.classList.toggle('stuck', y > 40);
  // el menú y la escala cambian de piel según la banda (clara u oscura) que tengan detrás
  const overDark = yy => bands.some(b => { const r = b.getBoundingClientRect(); return r.top <= yy && r.bottom > yy; });
  nav.classList.toggle('on-light', !overDark(33));
  scale.classList.toggle('on-light', !overDark(innerHeight / 2));

  // parallax del fondo real
  if (!RM && y < innerHeight * 1.3) heroBg.style.transform = `translate3d(0,${y*0.14}px,0) scale(${1+y/innerHeight*0.045})`;

  // escala
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? clamp(y/max, 0, 1) : 0;
  needle.style.top = (p*100)+'%';
  read.textContent = String(Math.round(p*100)).padStart(2,'0');
  marks.forEach((m,i) => {
    const r = m.el.getBoundingClientRect();
    const act = r.top <= innerHeight*0.45 && r.bottom > innerHeight*0.45;
    m.item.classList.toggle('act', act);
  });

  // pista fijada
  if (pinned) {
    const r = pin.getBoundingClientRect();
    const total = pin.offsetHeight - innerHeight;
    const pp = clamp(-r.top / total, 0, 1);
    targetX = -pp * trackOverflow();
    trackX = lerp(trackX, targetX, .12);
    track.style.transform = `translate3d(${trackX}px,0,0)`;
    progFill.style.width = (pp*100)+'%';
    const ai = Math.min(steps.length-1, Math.floor(pp*steps.length*0.999));
    steps.forEach((s,i) => s.classList.toggle('act', i===ai));
  }
  requestAnimationFrame(onFrame);
};
addEventListener('resize', () => { sizePin(); layout(); });
sizePin(); layout(); requestAnimationFrame(onFrame);
setTimeout(() => { sizePin(); layout(); }, 900); // tras cargar fuentes

/* ── Bruma volumétrica del hero (luz, no neón) ────────── */
(() => {
  const cv = document.getElementById('haze'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let w, h, dust = [];
  const LIGHTS = [
    {x:.72,y:.20,r:.66,c:[124,164,194],a:.20,sx:.00012,sy:.00009},
    {x:.18,y:.80,r:.60,c:[96,126,150],a:.15,sx:-.00009,sy:.00013},
    {x:.60,y:.55,r:.36,c:[196,142,48],a:.075,sx:.00015,sy:-.00007}
  ];
  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio||1, 1.5);
    w = cv.width = Math.max(1, r.width*d|0); h = cv.height = Math.max(1, r.height*d|0);
    dust = Array.from({length: innerWidth<700?18:38}, () => ({
      x: Math.random()*w, y: Math.random()*h, z: Math.random(),
      vx: (Math.random()-.5)*.12, vy: -.05-Math.random()*.12
    }));
  };
  size(); addEventListener('resize', size);
  let t = 0;
  const draw = () => {
    t += 16;
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation = 'lighter';
    LIGHTS.forEach(L => {
      const cx = (L.x + Math.sin(t*L.sx)*.05)*w, cy = (L.y + Math.cos(t*L.sy)*.05)*h;
      const g = ctx.createRadialGradient(cx,cy,0,cx,cy,L.r*Math.max(w,h));
      g.addColorStop(0, `rgba(${L.c.join(',')},${L.a})`);
      g.addColorStop(.45, `rgba(${L.c.join(',')},${L.a*.28})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    });
    // polvo en suspensión: profundidad por tamaño y opacidad
    dust.forEach(d => {
      d.x += d.vx*(.4+d.z); d.y += d.vy*(.4+d.z);
      if (d.y < -10) { d.y = h+10; d.x = Math.random()*w; }
      if (d.x < -10) d.x = w+10; if (d.x > w+10) d.x = -10;
      ctx.beginPath();
      ctx.arc(d.x, d.y, .4+d.z*1.5, 0, 6.283);
      ctx.fillStyle = `rgba(214,225,232,${.05+d.z*.16})`;
      ctx.fill();
    });
    if (!RM && vis) requestAnimationFrame(draw);
  };
  let vis = true;
  new IntersectionObserver(es => es.forEach(e => {
    const was = vis; vis = e.isIntersecting;
    if (vis && !was && !RM) requestAnimationFrame(draw);
  }), {threshold:0}).observe(cv);
  draw();
})();

/* ── Registrador gráfico: la utilidad antes y después ─── */
(() => {
  const cv = document.getElementById('trace'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const CSS = getComputedStyle(document.documentElement);
  const onDark = !!cv.closest('.band-dark') || !document.body.classList.contains('claro');
  const C = onDark
    ? { grid:'rgba(255,255,255,.055)', axis:'rgba(255,255,255,.16)', flat:'#98A5AE',
        sig:CSS.getPropertyValue('--signal-hi').trim()||'#E4B15C', dim:'#7F8D97',
        mk:'rgba(228,177,92,.4)', mkT:'rgba(228,177,92,.75)', glow:'rgba(228,177,92,.85)' }
    : { grid:'rgba(20,25,29,.09)', axis:'rgba(20,25,29,.30)', flat:'#6B767E',
        sig:getComputedStyle(document.body).getPropertyValue('--acc-chart').trim()||'#B36B00', dim:'#566169',
        mk:`rgba(${getComputedStyle(document.body).getPropertyValue('--acc-rgb').trim()||'156,90,0'},.55)`,
        mkT:getComputedStyle(document.body).getPropertyValue('--acc').trim()||'#9C5A00',
        glow:`rgba(${getComputedStyle(document.body).getPropertyValue('--acc-rgb').trim()||'156,90,0'},.5)` };
  let W,H,PAD;
  const N = 13;
  const before = [9.4,8.8,9.9,8.2,9.1,7.6,8.9,8.1,7.4,8.6,7.9,7.1,8.2];
  const after  = [9.4,8.8,9.9,11.6,14.2,17.1,19.4,22.0,24.3,26.1,27.8,29.2,30.6];
  const MAXY = 34;

  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio||1, 2);
    cv.width = r.width*d; cv.height = r.width*d*0.625;
    ctx.setTransform(d,0,0,d,0,0);
    W = r.width; H = r.width*0.625; PAD = {l:30,r:14,t:12,b:24};
  };
  const X = i => PAD.l + (W-PAD.l-PAD.r) * (i/(N-1));
  const Y = v => PAD.t + (H-PAD.t-PAD.b) * (1 - v/MAXY);

  const frame = () => {
    ctx.clearRect(0,0,W,H);
    ctx.lineWidth = 1;
    // rejilla horizontal + etiquetas
    ctx.font = '500 10px "IBM Plex Mono", monospace'; ctx.textBaseline='middle';
    for (let v=0; v<=30; v+=10) {
      ctx.strokeStyle = C.grid; ctx.beginPath();
      ctx.moveTo(PAD.l, Y(v)+.5); ctx.lineTo(W-PAD.r, Y(v)+.5); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.textAlign='right'; ctx.fillText(v+'%', PAD.l-8, Y(v));
    }
    // eje y meses
    ctx.strokeStyle = C.axis; ctx.beginPath();
    ctx.moveTo(PAD.l+.5, PAD.t); ctx.lineTo(PAD.l+.5, H-PAD.b); ctx.lineTo(W-PAD.r, H-PAD.b); ctx.stroke();
    ctx.textAlign='center';
    [0,3,6,9,12].forEach(m => { ctx.fillStyle=C.dim; ctx.fillText('M'+m, X(m), H-PAD.b+11);
      ctx.strokeStyle=C.axis; ctx.beginPath(); ctx.moveTo(X(m)+.5,H-PAD.b); ctx.lineTo(X(m)+.5,H-PAD.b+4); ctx.stroke(); });
  };

  const path = (arr, n, color, width) => {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin='round'; ctx.lineCap='round';
    ctx.beginPath();
    for (let i=0; i<=n && i<arr.length; i++) {
      const x = X(i), y = Y(arr[i]);
      i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    }
    // fracción del último tramo
    const f = n - Math.floor(n), i0 = Math.floor(n);
    if (f > 0 && i0+1 < arr.length) ctx.lineTo(lerp(X(i0),X(i0+1),f), lerp(Y(arr[i0]),Y(arr[i0+1]),f));
    ctx.stroke();
  };

  const marker = alpha => {
    const x = X(3);
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.strokeStyle = C.mk; ctx.setLineDash([2,3]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x+.5, PAD.t); ctx.lineTo(x+.5, H-PAD.b); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = C.mkT; ctx.font='500 9px "IBM Plex Mono", monospace';
    ctx.textAlign='left'; ctx.fillText('IMPLEMENTACIÓN', x+6, PAD.t+6);
    ctx.restore();
  };

  const head = (arr, n, glow) => {
    const i0 = Math.min(arr.length-1, Math.floor(n)), f = n-i0;
    const x = i0+1 < arr.length ? lerp(X(i0),X(i0+1),f) : X(i0);
    const y = i0+1 < arr.length ? lerp(Y(arr[i0]),Y(arr[i0+1]),f) : Y(arr[i0]);
    ctx.save();
    ctx.shadowColor = C.glow; ctx.shadowBlur = 8*glow;
    ctx.fillStyle = C.sig; ctx.beginPath(); ctx.arc(x,y,2.4,0,6.283); ctx.fill();
    ctx.restore();
  };

  let prog = 0, playing = false, t0 = 0;
  const render = now => {
    if (!t0) t0 = now;
    const el = (now - t0)/1000;
    prog = RM ? N-1 : clamp(el/2.0,0,1) * (N-1);
    frame();
    marker(clamp((prog-2.4)/1.2,0,1));
    path(before, Math.min(prog, N-1), C.flat, 1);
    path(after,  Math.min(prog, N-1), C.sig, 1.6);
    if (prog >= N-1) head(after, N-1, .85 + Math.sin(now/620)*.45);
    else head(after, prog, 1);
    if (prog < N-1 || !RM) requestAnimationFrame(render);
  };
  const start = () => { if (playing) return; playing = true; requestAnimationFrame(render); };
  size(); frame();
  addEventListener('resize', () => { size(); if (!playing) frame(); });
  new IntersectionObserver((es,o) => es.forEach(e => { if (e.isIntersecting) { start(); o.disconnect(); } }),
    {threshold:.3}).observe(cv);
})();


/* ── Revelado por palabra: desenfoque, ascenso y escala ──── */
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
  [...el.querySelectorAll('.wd-i')].forEach((w, i) => w.style.transitionDelay = (i * 0.058).toFixed(3) + 's');
};
const titles = [document.querySelector('h1[data-split]'),
  ...document.querySelectorAll('.head h2, .stage-head h2, .guar-in h2, .cta-grid h2')].filter(Boolean);
titles.forEach(splitWords);
const h1 = document.querySelector('h1[data-split]');
if (h1) setTimeout(() => h1.classList.add('on'), 260);
const ioW = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('on'); ioW.unobserve(e.target); }
}), {threshold:.3, rootMargin:'0px 0px -6% 0px'});
titles.forEach(t => { if (t !== h1) ioW.observe(t); });

/* ── Globo de puntos con halo atmosférico ─────────────────── */
(() => {
  const cv = document.getElementById('globe'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const PTS = [], STARS = [];
  // retícula de latitud/longitud: la estructura de meridianos se ve al girar
  for (let la = -86; la <= 86; la += 4) {
    const rad = la * Math.PI / 180, r = Math.cos(rad), y = Math.sin(rad);
    const n = Math.max(8, Math.round(64 * r));
    for (let k = 0; k < n; k++) {
      const lo = (k / n) * Math.PI * 2;
      PTS.push([Math.cos(lo) * r, y, Math.sin(lo) * r]);
    }
  }
  for (let i = 0; i < 90; i++) STARS.push([Math.random(), Math.random(), Math.random() * .5 + .2]);
  // marcadores: posiciones aproximadas de referencia
  const MK = [[19.4,-99.1],[18.9,-99.2],[40.7,-74.0],[51.5,-0.1],[35.7,139.7],[-23.5,-46.6]];
  const toXYZ = (la, lo) => { const a = la*Math.PI/180, b = lo*Math.PI/180;
    return [Math.cos(a)*Math.sin(b), Math.sin(a), Math.cos(a)*Math.cos(b)]; };
  const MKP = MK.map(m => toXYZ(m[0], m[1]));

  let W, H, R, dpr = 1;
  const size = () => {
    const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = Math.max(1, r.width * dpr); H = cv.height = Math.max(1, r.width * dpr);
    R = W * 0.335;
  };
  size(); addEventListener('resize', size);

  let ang = 0, run = false;
  const draw = () => {
    ang += 0.0022;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;

    ctx.globalCompositeOperation = 'lighter';
    STARS.forEach(st => {
      ctx.fillStyle = `rgba(206,218,226,${st[2] * .35})`;
      ctx.fillRect(st[0] * W, st[1] * H, dpr, dpr);
    });
    // halo atmosférico: el borde encendido detrás de la esfera
    const halo = ctx.createRadialGradient(cx, cy, R * .90, cx, cy, R * 1.42);
    halo.addColorStop(0, 'rgba(226,170,66,.72)');
    halo.addColorStop(.10, 'rgba(206,150,52,.46)');
    halo.addColorStop(.30, 'rgba(184,130,44,.20)');
    halo.addColorStop(.62, 'rgba(170,120,40,.06)');
    halo.addColorStop(1, 'rgba(192,139,44,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.42, 0, 6.283); ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
    // cuerpo opaco para que el halo quede solo en el borde
    const body = ctx.createRadialGradient(cx - R * .32, cy - R * .38, R * .06, cx, cy, R);
    body.addColorStop(0, '#10161C'); body.addColorStop(.62, '#080B0E'); body.addColorStop(1, '#040608');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R * .995, 0, 6.283); ctx.fill();

    const sa = Math.sin(ang), ca = Math.cos(ang);
    PTS.forEach(p => {
      const x = p[0] * ca - p[2] * sa, z = p[0] * sa + p[2] * ca, y = p[1];
      if (z < 0) return;
      const sx = cx + x * R, sy = cy - y * R;
      const d = 0.30 + z * 0.70;
      ctx.fillStyle = `rgba(202,216,226,${(0.13 + z * 0.55).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(sx, sy, 1.5 * dpr * d, 0, 6.283); ctx.fill();
    });
    // marcadores latón con pulso
    const t = performance.now() / 1000;
    MKP.forEach((p, i) => {
      const x = p[0] * ca - p[2] * sa, z = p[0] * sa + p[2] * ca, y = p[1];
      if (z < .08) return;
      const sx = cx + x * R, sy = cy - y * R;
      const ph = (t * .45 + i * .3) % 1;
      ctx.strokeStyle = `rgba(228,177,92,${(1 - ph) * .5 * z})`;
      ctx.lineWidth = dpr; ctx.beginPath();
      ctx.arc(sx, sy, (2 + ph * 11) * dpr, 0, 6.283); ctx.stroke();
      ctx.fillStyle = `rgba(240,208,146,${.85 * z})`;
      ctx.beginPath(); ctx.arc(sx, sy, 2.1 * dpr, 0, 6.283); ctx.fill();
    });
    if (run) requestAnimationFrame(draw);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    run = e.isIntersecting && !RM;
    if (run) requestAnimationFrame(draw); else draw();
  }), {threshold:.05});
  io.observe(cv);
  draw();
})();

/* ── Botón con inercia ────────────────────────────────── */
if (matchMedia('(hover:hover)').matches && !RM) {
  const m = document.getElementById('magnet');
  if (m) {
    m.addEventListener('pointermove', e => {
      const r = m.getBoundingClientRect();
      const dx = (e.clientX - (r.left+r.width/2))/r.width, dy = (e.clientY - (r.top+r.height/2))/r.height;
      m.style.transform = `translate(${dx*7}px,${dy*5}px)`;
    });
    m.addEventListener('pointerleave', () => m.style.transform = '');
  }
}

/* ── Formulario → WhatsApp (sin backend, funciona hoy) ── */
const form = document.getElementById('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const v = id => (document.getElementById(id).value || '').trim();
  if (!v('n') || !v('a')) {
    document.getElementById('fnote').textContent = 'Falta tu nombre o qué quieres resolver';
    document.getElementById('fnote').style.color = 'var(--oxide)';
    return;
  }
  const msg = [
    'Hola GRESANOVA, quiero agendar un diagnóstico.',
    '', 'Nombre: ' + v('n'),
    v('e') ? 'Empresa: ' + v('e') : null,
    'Equipo: ' + v('t'),
    '', 'Qué quiero resolver:', v('a')
  ].filter(x => x !== null).join('\n');
  window.open('https://wa.me/527775417367?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  document.getElementById('sbt').textContent = 'WhatsApp abierto';
  document.getElementById('fnote').textContent = 'Si no se abrió, escríbenos al +52 777 541 7367';
});
})();
