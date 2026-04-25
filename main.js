// =====================
// CURSOR
// =====================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a,button,.skill-pill,.project-card,.highlight-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});


// =====================
// PARTICLE BACKGROUND
// =====================
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = Math.random() * 200 + 100;
      this.age = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life) this.reset();
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }
  loop();
})();


// =====================
// 3D CARD TILT
// =====================
const card = document.getElementById('card3d');
if (card) {
  card.parentElement.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const rx2 = (e.clientY - cy) / 12, ry2 = -(e.clientX - cx) / 12;
    card.style.transform = `perspective(600px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;
  });
  card.parentElement.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
  });
}


// =====================
// ABOUT 3D CANVAS — rotating cube
// =====================
(function () {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  let angle = 0;
  const verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const faces = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];
  const faceColors = [
    'rgba(108,99,255,0.15)', 'rgba(56,189,248,0.12)',
    'rgba(167,139,250,0.1)', 'rgba(251,113,133,0.1)',
    'rgba(108,99,255,0.08)', 'rgba(56,189,248,0.08)'
  ];

  function project(v) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const x = v[0] * cos - v[2] * sin, z = v[0] * sin + v[2] * cos;
    const cos2 = Math.cos(angle * 0.5), sin2 = Math.sin(angle * 0.5);
    const y2 = v[1] * cos2 - z * sin2, z2 = v[1] * sin2 + z * cos2;
    const fov = 3.5, scale = W * 0.18 * fov / (fov + z2);
    return [W / 2 + x * scale, H / 2 + y2 * scale, z2];
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    angle += 0.005;
    const pts = verts.map(project);
    faces.forEach((f, i) => {
      ctx.beginPath();
      ctx.moveTo(pts[f[0]][0], pts[f[0]][1]);
      for (let j = 1; j < f.length; j++) ctx.lineTo(pts[f[j]][0], pts[f[j]][1]);
      ctx.closePath();
      ctx.fillStyle = faceColors[i];
      ctx.fill();
    });
    edges.forEach(e => {
      ctx.beginPath();
      ctx.moveTo(pts[e[0]][0], pts[e[0]][1]);
      ctx.lineTo(pts[e[1]][0], pts[e[1]][1]);
      ctx.strokeStyle = 'rgba(108,99,255,0.5)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167,139,250,0.9)';
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();


// =====================
// PROJECT CANVASES
// =====================
function drawProject1() {
  const canvas = document.getElementById('proj1');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 400, H = 200;
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, '#0a0a14');
  gradient.addColorStop(1, '#0f0a1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(108,99,255,0.3)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(i * 45, 0); ctx.lineTo(i * 45, H); ctx.stroke(); }
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, i * 40); ctx.lineTo(W, i * 40); ctx.stroke(); }
  const bars = [60, 90, 70, 110, 80, 95, 120, 75, 100, 85];
  bars.forEach((h, i) => {
    const grd = ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, 'rgba(108,99,255,0.9)');
    grd.addColorStop(1, 'rgba(56,189,248,0.5)');
    ctx.fillStyle = grd;
    ctx.fillRect(20 + i * 38, H - h - 10, 22, h);
    ctx.fillStyle = 'rgba(108,99,255,0.2)';
    ctx.fillRect(20 + i * 38, H - 10, 22, 8);
  });
  ctx.fillStyle = 'rgba(167,139,250,0.9)';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Network Topology', 14, 22);
}

function drawProject2() {
  const canvas = document.getElementById('proj2');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 400, H = 200;
  ctx.fillStyle = '#070712';
  ctx.fillRect(0, 0, W, H);
  const colors = ['rgba(56,189,248,0.7)', 'rgba(108,99,255,0.7)', 'rgba(251,113,133,0.7)', 'rgba(34,197,94,0.5)'];
  const data = [35, 25, 25, 15];
  let start = 0;
  const cx = W * 0.35, cy = H / 2, r = 68;
  data.forEach((d, i) => {
    const end = start + d / 100 * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath();
    ctx.fillStyle = colors[i]; ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r + 1, start, end); ctx.closePath();
    ctx.strokeStyle = 'rgba(5,5,8,0.8)'; ctx.lineWidth = 2; ctx.stroke();
    start = end;
  });
  ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2); ctx.fillStyle = '#070712'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('76%', cx, cy - 2); ctx.font = '8px sans-serif'; ctx.fillText('uptime', cx, cy + 10); ctx.textAlign = 'left';
  const labels = ['Users', 'Revenue', 'Traffic', 'Conv.'];
  labels.forEach((l, i) => {
    ctx.fillStyle = colors[i]; ctx.fillRect(W * 0.65, 60 + i * 28, 10, 10);
    ctx.fillStyle = 'rgba(200,200,230,0.8)'; ctx.font = '10px sans-serif'; ctx.fillText(l, W * 0.65 + 16, 70 + i * 28);
  });
}

function drawProject3() {
  const canvas = document.getElementById('proj3');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 400, H = 200;
  const grd = ctx.createLinearGradient(0, 0, W, H);
  grd.addColorStop(0, '#060610');
  grd.addColorStop(1, '#0a0616');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
  const tasks = [
    { x: 30, y: 35, w: 130, c: 'rgba(108,99,255,0.7)', l: 'Design system' },
    { x: 30, y: 70, w: 95, c: 'rgba(56,189,248,0.6)', l: 'API integration' },
    { x: 30, y: 105, w: 160, c: 'rgba(167,139,250,0.6)', l: 'User auth' },
    { x: 30, y: 140, w: 70, c: 'rgba(251,113,133,0.6)', l: 'Deploy' }
  ];
  tasks.forEach(t => {
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.roundRect(t.x, t.y, W - 60, 24, 4); ctx.fill();
    ctx.fillStyle = t.c; ctx.beginPath(); ctx.roundRect(t.x, t.y, t.w, 24, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '10px sans-serif'; ctx.fillText(t.l, t.x + 8, t.y + 16);
  });
  ctx.fillStyle = 'rgba(167,139,250,0.9)'; ctx.font = 'bold 11px sans-serif'; ctx.fillText('Library System', 14, 20);
}

// Draw canvases after DOM is ready
// Use requestAnimationFrame to ensure canvases are visible/sized before drawing
function initCanvases() {
  drawProject1();
  drawProject2();
  drawProject3();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initCanvases, 100));
} else {
  setTimeout(initCanvases, 100);
}


// =====================
// SCROLL REVEAL
// =====================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// =====================
// NAV SCROLL
// =====================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 50 ? 'rgba(5,5,8,0.92)' : 'rgba(5,5,8,0.6)';
});


// =====================
// HAMBURGER
// =====================
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('open');
});

function closeMobile() {
  document.getElementById('mobile-menu').classList.remove('open');
}


// =====================
// FORM SUBMIT
// =====================
function handleSubmit(btn) {
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = '#22c55e';
  }, 1200);
}


// =====================
// SMOOTH NAV ACTIVE STATE
// =====================
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--text)' : '';
  });
});
