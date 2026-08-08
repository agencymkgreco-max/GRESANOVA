/* ================================================
   GRESANOVA — Galería Script
   Water Reflection Engine + Filters + Lightbox
   ================================================ */

/* ═══════════════════════════════════════════════════
   WATER REFLECTION ENGINE
   - Toma píxeles inferiores de cada <img>
   - Los dibuja invertidos en el <canvas> de abajo
   - Aplica desplazamiento horizontal por fila (onda sinusoidal)
   - Shimmers: líneas horizontales brillantes animadas
   - Tinte azul oscuro para simular profundidad
═══════════════════════════════════════════════════ */

const WAVE_AMP   = 2.5;
const WAVE_FREQ  = 0.045;
const WAVE_SPEED = 0.016;
const REF_HEIGHT = 80;

let time = 0;
const reflections = [];

function initBlock(block) {
  const img    = block.querySelector('img');
  const canvas = block.querySelector('.reflection-canvas');
  if (!img || !canvas) return;

  const doSetup = () => {
    if (!img.naturalWidth) return;
    const w = img.offsetWidth || 400;
    const h = REF_HEIGHT;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Bottom 40% of image, flipped vertically
    const srcH   = Math.floor(img.naturalHeight * 0.4);
    const srcY   = img.naturalHeight - srcH;
    const off    = document.createElement('canvas');
    off.width    = img.naturalWidth;
    off.height   = srcH;
    const offCtx = off.getContext('2d');
    offCtx.translate(0, srcH);
    offCtx.scale(1, -1);
    offCtx.drawImage(img, 0, srcY, img.naturalWidth, srcH, 0, 0, img.naturalWidth, srcH);
    reflections.push({ canvas, ctx, off, w, h });
  };

  if (img.complete && img.naturalWidth > 0) {
    doSetup();
  } else {
    img.addEventListener('load', doSetup);
    img.addEventListener('error', () => {
      const w = 400, h = REF_HEIGHT;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      const off = document.createElement('canvas');
      off.width = w; off.height = h;
      const offCtx = off.getContext('2d');
      const grad = offCtx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0a1a2a');
      grad.addColorStop(1, '#050810');
      offCtx.fillStyle = grad;
      offCtx.fillRect(0, 0, w, h);
      reflections.push({ canvas, ctx, off, w, h });
    });
  }
}

function renderLoop() {
  time += WAVE_SPEED;
  reflections.forEach(({ canvas, ctx, off, w, h }) => {
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      const t  = y / h;
      const ph = t * Math.PI * 4;
      const dx = Math.sin(time + ph) * WAVE_AMP
               + Math.sin(time * 1.6 + ph * 0.7) * (WAVE_AMP * 0.45);
      const srcRow = Math.floor(t * (off.height - 1));
      ctx.drawImage(off, 0, srcRow, off.width, 1, dx, y, w, 1);
    }
    ctx.fillStyle = 'rgba(0, 15, 35, 0.30)';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      const sy   = ((time * 0.35 + i * 0.85) % 1.0) * h;
      const alph = (Math.sin(time * 2.2 + i * 1.8) * 0.5 + 0.5) * 0.2;
      const len  = 0.3 + Math.sin(time + i) * 0.2;
      const gx0  = w * (0.5 - len);
      const gx1  = w * (0.5 + len);
      const sg   = ctx.createLinearGradient(gx0, sy, gx1, sy);
      sg.addColorStop(0,   `rgba(160,235,255,0)`);
      sg.addColorStop(0.5, `rgba(160,235,255,${alph})`);
      sg.addColorStop(1,   `rgba(160,235,255,0)`);
      ctx.fillStyle = sg;
      ctx.fillRect(gx0, sy - 0.5, gx1 - gx0, 1.5);
    }
  });
  requestAnimationFrame(renderLoop);
}

// Boot reflections
document.querySelectorAll('.photo-block').forEach(initBlock);
requestAnimationFrame(renderLoop);

window.addEventListener('resize', () => {
  reflections.length = 0;
  document.querySelectorAll('.photo-block').forEach(initBlock);
});

/* ══════════════════════════
   FILTER TABS
══════════════════════════ */
const allBlocks = Array.from(document.querySelectorAll('.photo-block'));

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    allBlocks.forEach(b => {
      b.style.display = (f === 'all' || b.dataset.filter === f) ? '' : 'none';
    });
  });
});

/* ══════════════════════════
   LIGHTBOX
══════════════════════════ */
const lb    = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTag = document.getElementById('lbTag');

allBlocks.forEach(block => {
  block.addEventListener('click', () => {
    const img = block.querySelector('img');
    if (!img || !img.src) return;
    lbImg.src = img.src;
    lbTag.textContent = `// ${block.dataset.cat} · ${block.dataset.title}`;
    lb.classList.add('open');
  });
});

document.getElementById('lbClose').addEventListener('click', () => lb.classList.remove('open'));
lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });

/* ══════════════════════════
   SCROLL REVEAL
══════════════════════════ */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
