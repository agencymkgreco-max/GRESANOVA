/* ================================================
   GRESANOVA — Splash Page Script
   Koi + Eagle animados que siguen el cursor
   ================================================ */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursorEl = document.getElementById('custom-cursor');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let smooth = { x: canvas.width / 2, y: canvas.height / 2 };
let time = 0;
let koiAngle = 0;
let eagleAngle = Math.PI;

// ── Audio atmosférico ──────────────────────────────
let audioStarted = false;
function startAudio() {
  if (audioStarted) return;
  audioStarted = true;
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  [[55, 0.03], [82.4, 0.018], [110, 0.012], [164.8, 0.008], [220, 0.006]].forEach(([freq, vol], i) => {
    const osc = ac.createOscillator(), gain = ac.createGain(), filter = ac.createBiquadFilter();
    const lfo = ac.createOscillator(), lfoG = ac.createGain();
    osc.type = ['sine', 'sine', 'triangle', 'triangle', 'sine'][i];
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 500 + i * 80;
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ac.currentTime + 3);
    lfo.frequency.value = 0.07 + i * 0.04;
    lfoG.gain.value = 1.5 + i;
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    lfo.start();
  });
}
document.addEventListener('mousemove', startAudio, { once: true });

// ── Partículas ─────────────────────────────────────
const particles = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.8 + 0.3,
  vy: -(Math.random() * 0.35 + 0.08),
  vx: (Math.random() - 0.5) * 0.2,
  op: Math.random() * 0.45 + 0.08,
  hue: Math.random() > 0.5 ? 'rgba(255,30,180,' : 'rgba(255,180,0,'
}));

// ── Koi ───────────────────────────────────────────
function drawKoi(cx, cy, angle, t) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(1.3, 1.3);
  const tw = Math.sin(t * 3.5) * 10;

  ctx.shadowBlur = 25; ctx.shadowColor = 'rgba(0,220,255,0.8)';
  ctx.beginPath();
  ctx.moveTo(-22, 0);
  ctx.bezierCurveTo(-34, tw - 13, -46, tw - 20, -54, tw - 7);
  ctx.bezierCurveTo(-46, tw, -46, tw + 14, -54, tw + 7);
  ctx.bezierCurveTo(-46, tw + 20, -34, tw + 13, -22, 0);
  ctx.strokeStyle = 'rgba(0,230,255,0.9)'; ctx.lineWidth = 1.5; ctx.stroke();

  for (let i = 1; i <= 6; i++) {
    const f = i / 7;
    ctx.beginPath();
    ctx.moveTo(-22, (f - 0.5) * 16);
    ctx.lineTo(-54, tw + (f - 0.5) * 14);
    ctx.strokeStyle = `rgba(0,230,255,${0.15 + f * 0.25})`; ctx.lineWidth = 0.7; ctx.stroke();
  }

  ctx.shadowColor = 'rgba(0,200,255,0.7)';
  ctx.beginPath();
  ctx.moveTo(-12, -12);
  ctx.bezierCurveTo(-6, -28 + Math.sin(t * 2.5) * 4, 8, -27 + Math.sin(t * 2.5) * 4, 14, -12);
  ctx.strokeStyle = 'rgba(0,220,255,0.85)'; ctx.lineWidth = 1.3; ctx.stroke();

  for (let i = 0; i < 7; i++) {
    const px = -12 + i * 4.3;
    ctx.beginPath(); ctx.moveTo(px, -12); ctx.lineTo(px + 0.5, -23 + Math.sin(t * 2.5) * 3);
    ctx.strokeStyle = 'rgba(0,220,255,0.35)'; ctx.lineWidth = 0.6; ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(2, 10); ctx.bezierCurveTo(12, 23, 22, 26, 28, 16);
  ctx.bezierCurveTo(20, 12, 10, 10, 2, 10);
  ctx.strokeStyle = 'rgba(0,210,255,0.6)'; ctx.lineWidth = 1; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-12, 10); ctx.bezierCurveTo(-18, 22, -28, 24, -30, 14);
  ctx.bezierCurveTo(-22, 10, -14, 10, -12, 10);
  ctx.strokeStyle = 'rgba(0,210,255,0.55)'; ctx.lineWidth = 1; ctx.stroke();

  [[3, 10, 10, 22], [8, 11, 16, 23], [14, 11, 22, 21]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(0,200,255,0.25)'; ctx.lineWidth = 0.6; ctx.stroke();
  });

  ctx.shadowBlur = 32; ctx.shadowColor = 'rgba(255,30,180,0.95)';
  ctx.beginPath(); ctx.ellipse(0, 0, 30, 13, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,30,180,0.95)'; ctx.lineWidth = 2.2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(28, 0);
  ctx.strokeStyle = 'rgba(255,80,220,0.45)'; ctx.lineWidth = 1; ctx.stroke();

  ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(0,230,255,0.95)';
  const circuits = [
    [[-18, 0], [18, 0]], [[-18, 0], [-18, -7]], [[-18, -7], [-8, -7]],
    [[0, 0], [0, -9]], [[0, -9], [10, -9]], [[10, -9], [10, 0]],
    [[18, 0], [18, -5]], [[18, -5], [26, -5]],
    [[-18, 4], [-18, 9]], [[-18, 9], [2, 9]], [[2, 9], [2, 4]],
    [[12, 4], [12, 9]], [[12, 9], [24, 9]],
    [[-8, -7], [0, -7]], [[10, -9], [16, -9]]
  ];
  circuits.forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    ctx.strokeStyle = 'rgba(0,230,255,0.75)'; ctx.lineWidth = 0.9; ctx.stroke();
  });

  [[-18, -7], [-8, -7], [0, -9], [10, -9], [18, -5], [-18, 9], [2, 9], [12, 9], [16, -9]].forEach(([px, py]) => {
    ctx.beginPath(); ctx.arc(px, py, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,240,255,1)'; ctx.fill();
  });

  const pulse = (Math.sin(t * 4) + 1) / 2;
  [[-10, -7], [5, -9], [15, -5], [-14, 9], [8, 9]].forEach(([px, py]) => {
    ctx.beginPath(); ctx.arc(px, py, 1.3 + pulse * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,80,255,${0.4 + pulse * 0.6})`; ctx.fill();
  });

  ctx.shadowBlur = 35; ctx.shadowColor = 'rgba(255,30,180,1)';
  ctx.beginPath(); ctx.ellipse(30, -1, 10, 10, 0.2, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,30,180,0.9)'; ctx.lineWidth = 2; ctx.stroke();

  ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(0,220,255,0.7)';
  [[39, 3, 48, -3], [39, 5, 49, 12]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(0,220,255,0.7)'; ctx.lineWidth = 0.8; ctx.stroke();
  });

  ctx.shadowBlur = 22; ctx.shadowColor = 'rgba(255,255,255,1)';
  ctx.beginPath(); ctx.arc(33, -3, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,200,1)'; ctx.fill();
  ctx.beginPath(); ctx.arc(33, -3, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#000'; ctx.fill();
  ctx.restore();
}

// ── Águila ────────────────────────────────────────
function drawEagle(cx, cy, angle, t) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(1.35, 1.35);
  const flap = Math.sin(t * 4) * 15;
  const gold = 'rgba(255,200,0,', goldBright = 'rgba(255,230,80,', amber = 'rgba(255,150,0,';

  ctx.shadowBlur = 40; ctx.shadowColor = 'rgba(255,190,0,0.85)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-15, -5 - flap, -35, -16 - flap, -55, -8 - flap);
  ctx.bezierCurveTo(-44, 0, -28, 4, -14, 2);
  ctx.bezierCurveTo(-7, 1, 0, 0, 0, 0);
  ctx.strokeStyle = amber + '0.9)'; ctx.lineWidth = 2; ctx.stroke();

  for (let i = 0; i < 9; i++) {
    const t2 = i / 9, bx = -55 * t2, by = (-8 - flap) * t2;
    ctx.beginPath(); ctx.moveTo(bx * 0.85, by * 0.85); ctx.lineTo(bx * 0.85 - 5 * (1 - t2), by * 0.85 + 9 * (1 - t2));
    ctx.strokeStyle = amber + `${0.35 + t2 * 0.45})`; ctx.lineWidth = 1; ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(15, -5 - flap, 35, -16 - flap, 55, -8 - flap);
  ctx.bezierCurveTo(44, 0, 28, 4, 14, 2);
  ctx.bezierCurveTo(7, 1, 0, 0, 0, 0);
  ctx.strokeStyle = amber + '0.9)'; ctx.lineWidth = 2; ctx.stroke();

  for (let i = 0; i < 9; i++) {
    const t2 = i / 9, bx = 55 * t2, by = (-8 - flap) * t2;
    ctx.beginPath(); ctx.moveTo(bx * 0.85, by * 0.85); ctx.lineTo(bx * 0.85 + 5 * (1 - t2), by * 0.85 + 9 * (1 - t2));
    ctx.strokeStyle = amber + `${0.35 + t2 * 0.45})`; ctx.lineWidth = 1; ctx.stroke();
  }

  ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(255,200,0,0.9)';
  ctx.beginPath();
  ctx.moveTo(-8, 0); ctx.bezierCurveTo(-10, 10, -7, 20, -5, 30);
  ctx.bezierCurveTo(-2, 34, 2, 34, 5, 30); ctx.bezierCurveTo(7, 20, 10, 10, 8, 0);
  ctx.closePath(); ctx.strokeStyle = gold + '0.9)'; ctx.lineWidth = 2; ctx.stroke();

  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.moveTo(-5 + i * 2, 3 + i * 4);
    ctx.bezierCurveTo(-5 + i * 2 - 2, 7 + i * 4, -3 + i * 2, 7 + i * 4, -5 + i * 2 + 2, 3 + i * 4 + 5);
    ctx.strokeStyle = goldBright + `0.${25 + i * 5})`; ctx.lineWidth = 0.8; ctx.stroke();
  }

  ctx.shadowColor = 'rgba(255,150,0,0.8)';
  [[-12, 28, -16, 42], [-6, 30, -8, 44], [0, 31, 0, 45], [6, 30, 8, 44], [12, 28, 16, 42]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = amber + '0.85)'; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 2, y2 + 3); ctx.moveTo(x2, y2); ctx.lineTo(x2 + 2, y2 + 3);
    ctx.strokeStyle = gold + '0.5)'; ctx.lineWidth = 0.7; ctx.stroke();
  });

  ctx.shadowColor = 'rgba(255,200,0,0.7)';
  [[-5, 29], [5, 29]].forEach(([lx, ly]) => {
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + 12);
    ctx.strokeStyle = gold + '0.85)'; ctx.lineWidth = 1.8; ctx.stroke();
    [[-5, ly + 12], [-1, ly + 13], [3, ly + 12], [-2, ly + 15]].forEach(([tx, ty]) => {
      ctx.beginPath(); ctx.moveTo(lx, ly + 12); ctx.lineTo(tx, ty);
      ctx.strokeStyle = goldBright + '0.7)'; ctx.lineWidth = 1; ctx.stroke();
    });
  });

  ctx.shadowBlur = 25; ctx.shadowColor = 'rgba(255,220,60,0.9)';
  ctx.beginPath(); ctx.moveTo(-6, 0); ctx.bezierCurveTo(-8, -8, -7, -16, -2, -22);
  ctx.bezierCurveTo(2, -26, 6, -24, 7, -20); ctx.bezierCurveTo(8, -16, 7, -8, 6, 0);
  ctx.closePath(); ctx.strokeStyle = gold + '0.9)'; ctx.lineWidth = 1.8; ctx.stroke();

  ctx.shadowBlur = 35; ctx.shadowColor = 'rgba(255,230,80,1)';
  ctx.beginPath(); ctx.arc(1, -25, 9, 0, Math.PI * 2);
  ctx.strokeStyle = goldBright + '0.95)'; ctx.lineWidth = 2; ctx.stroke();

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(1 + Math.cos(a) * 9, -25 + Math.sin(a) * 9);
    ctx.lineTo(1 + Math.cos(a) * 13, -25 + Math.sin(a) * 13);
    ctx.strokeStyle = goldBright + '0.2)'; ctx.lineWidth = 0.7; ctx.stroke();
  }

  ctx.shadowBlur = 20; ctx.shadowColor = 'rgba(255,220,50,0.9)';
  ctx.beginPath(); ctx.moveTo(7, -28);
  ctx.bezierCurveTo(14, -30, 18, -26, 16, -22); ctx.bezierCurveTo(14, -19, 10, -20, 8, -22);
  ctx.strokeStyle = goldBright + '0.95)'; ctx.lineWidth = 2; ctx.stroke();

  const sw = Math.sin(t * 3) * 5;
  ctx.shadowBlur = 18; ctx.shadowColor = 'rgba(80,255,60,0.85)';
  ctx.beginPath(); ctx.moveTo(14, -22);
  ctx.bezierCurveTo(18 + sw, -14, 13 - sw, -4, 18 + sw, 4);
  ctx.bezierCurveTo(14 - sw, 10, 20 + sw, 17, 15, 22);
  ctx.strokeStyle = 'rgba(80,255,60,0.9)'; ctx.lineWidth = 2.5; ctx.stroke();

  ctx.beginPath(); ctx.ellipse(16.5, 23, 3.5, 2.5, 0.3, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(80,255,60,0.85)'; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(14, -22); ctx.lineTo(12, -18);
  ctx.moveTo(17, -16); ctx.lineTo(14, -12);
  ctx.moveTo(18, -6); ctx.lineTo(14, -2);
  ctx.strokeStyle = 'rgba(60,220,40,0.35)'; ctx.lineWidth = 0.7; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(15, 25); ctx.lineTo(12, 29);
  ctx.moveTo(15, 25); ctx.lineTo(18, 29);
  ctx.strokeStyle = 'rgba(255,40,40,0.9)'; ctx.lineWidth = 0.9; ctx.stroke();

  ctx.shadowBlur = 28; ctx.shadowColor = 'rgba(255,255,200,1)';
  ctx.beginPath(); ctx.arc(4, -26, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,180,0.98)'; ctx.fill();
  ctx.beginPath(); ctx.arc(4, -26, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#000'; ctx.fill();
  ctx.beginPath(); ctx.arc(4.5, -26.5, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
  ctx.restore();
}

// ── Loop principal ────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  time += 0.016;
  smooth.x += (mouse.x - smooth.x) * 0.055;
  smooth.y += (mouse.y - smooth.y) * 0.055;

  ctx.fillStyle = 'rgba(0,0,0,0.17)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.y < -10) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    ctx.shadowBlur = 8; ctx.shadowColor = p.hue + '0.5)';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.hue + p.op + ')'; ctx.fill();
    ctx.shadowBlur = 0;
  });

  ctx.save();
  ctx.strokeStyle = 'rgba(255,30,180,0.04)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(smooth.x, smooth.y, 140, 68, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,185,0,0.04)';
  ctx.beginPath(); ctx.ellipse(smooth.x, smooth.y, 200, 95, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  koiAngle += 0.013;
  drawKoi(smooth.x + Math.cos(koiAngle) * 140, smooth.y + Math.sin(koiAngle) * 68, koiAngle + Math.PI, time);

  eagleAngle += 0.009;
  drawEagle(smooth.x + Math.cos(eagleAngle) * 200, smooth.y + Math.sin(eagleAngle) * 95, eagleAngle + Math.PI, time);
}

// ── Eventos ───────────────────────────────────────
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top = e.clientY + 'px';
});

document.addEventListener('touchmove', e => {
  e.preventDefault();
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animate();
