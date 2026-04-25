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
// FORM SUBMIT (FIXED)
// =====================
function handleSubmit(btn) {
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = {
    first_name: document.getElementById('firstName').value,
    last_name: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  emailjs.send("service_cyb3snj", "template_gx2c0tx", data)
    .then(() => {
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = '#22c55e';
    })
    .catch(() => {
      btn.textContent = 'Failed ❌';
      btn.disabled = false;
    });
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