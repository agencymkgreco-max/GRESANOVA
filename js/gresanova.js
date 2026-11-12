/* GRESANOVA · comportamiento de las subpáginas (equipo, galería, impacto)
   Menú, revelados, contadores, barras, bruma del encabezado y títulos por palabra. */
(() => {
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v,a,b) => v<a?a:v>b?b:v;

/* entrada */
document.body.classList.add('rdy');

/* menú */
const nav = document.getElementById('nav'), burger = document.getElementById('burger'), drawer = document.getElementById('drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const on = drawer.classList.toggle('on');
    burger.classList.toggle('on', on);
    burger.setAttribute('aria-expanded', on);
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    drawer.classList.remove('on'); burger.classList.remove('on'); burger.setAttribute('aria-expanded','false');
  }));
}

/* revelados */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.14, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* contadores (con decimales opcionales: data-dec) y barras */
const countUp = el => {
  const to = +el.dataset.to, dec = +(el.dataset.dec || 0), t0 = performance.now(), dur = 1400;
  const fmt = v => dec ? v.toFixed(dec) : Math.round(v);
  if (RM) { el.textContent = fmt(to); return; }
  const step = now => {
    const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(e * to);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const t = e.target;
  if (t.dataset.to !== undefined) countUp(t);
  if (t.dataset.fill !== undefined) t.style.width = t.dataset.fill + '%';
  io2.unobserve(t);
}), {threshold:.3});
document.querySelectorAll('[data-to],[data-fill]').forEach(el => io2.observe(el));

/* títulos con revelado por palabra */
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
const titles = [...new Set([...document.querySelectorAll('[data-split], .head h2, .guar-in h2, .cta-grid h2')])];
titles.forEach(splitWords);
const h1 = document.querySelector('h1[data-split]');
if (h1) setTimeout(() => h1.classList.add('on'), 260);
const ioW = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('on'); ioW.unobserve(e.target); }
}), {threshold:.3, rootMargin:'0px 0px -6% 0px'});
titles.forEach(t => { if (t !== h1) ioW.observe(t); });

/* bruma del encabezado */
(() => {
  const cv = document.getElementById('haze'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let w, h, dust = [], vis = true, t = 0;
  const LIGHTS = [
    {x:.72,y:.20,r:.66,c:[124,164,194],a:.20,sx:.00012,sy:.00009},
    {x:.18,y:.80,r:.60,c:[96,126,150],a:.15,sx:-.00009,sy:.00013},
    {x:.60,y:.55,r:.36,c:[196,142,48],a:.075,sx:.00015,sy:-.00007}
  ];
  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.5);
    w = cv.width = Math.max(1, r.width * d | 0); h = cv.height = Math.max(1, r.height * d | 0);
    dust = Array.from({length: innerWidth < 700 ? 18 : 38}, () => ({
      x: Math.random()*w, y: Math.random()*h, z: Math.random(),
      vx: (Math.random()-.5)*.12, vy: -.05-Math.random()*.12 }));
  };
  size(); addEventListener('resize', size);
  const draw = () => {
    t += 16; ctx.clearRect(0,0,w,h); ctx.globalCompositeOperation = 'lighter';
    LIGHTS.forEach(L => {
      const cx = (L.x + Math.sin(t*L.sx)*.05)*w, cy = (L.y + Math.cos(t*L.sy)*.05)*h;
      const g = ctx.createRadialGradient(cx,cy,0,cx,cy,L.r*Math.max(w,h));
      g.addColorStop(0, `rgba(${L.c.join(',')},${L.a})`);
      g.addColorStop(.45, `rgba(${L.c.join(',')},${L.a*.28})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    });
    dust.forEach(d => {
      d.x += d.vx*(.4+d.z); d.y += d.vy*(.4+d.z);
      if (d.y < -10) { d.y = h+10; d.x = Math.random()*w; }
      if (d.x < -10) d.x = w+10; if (d.x > w+10) d.x = -10;
      ctx.beginPath(); ctx.arc(d.x, d.y, .4+d.z*1.5, 0, 6.283);
      ctx.fillStyle = `rgba(214,225,232,${.05+d.z*.16})`; ctx.fill();
    });
    if (!RM && vis) requestAnimationFrame(draw);
  };
  new IntersectionObserver(es => es.forEach(e => {
    const was = vis; vis = e.isIntersecting;
    if (vis && !was && !RM) requestAnimationFrame(draw);
  }), {threshold:0}).observe(cv);
  draw();
})();

/* scroll: menú pegado, piel clara/oscura y parallax del fondo */
const heroBg = document.getElementById('heroBg');
const bands = [...document.querySelectorAll('.band-dark')];
const overDark = yy => bands.some(b => { const r = b.getBoundingClientRect(); return r.top <= yy && r.bottom > yy; });
let ticking = false;
const onScroll = () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    if (nav) { nav.classList.toggle('stuck', y > 40); nav.classList.toggle('on-light', !overDark(33)); }
    if (heroBg && !RM && y < innerHeight * 1.3) heroBg.style.transform = `translate3d(0,${y*0.14}px,0) scale(${1+y/innerHeight*0.045})`;
    ticking = false;
  });
};
addEventListener('scroll', onScroll, {passive:true});
addEventListener('resize', onScroll);
onScroll();
})();
