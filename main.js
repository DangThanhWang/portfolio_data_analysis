/* ======= CURSOR ======= */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function trackRing() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(trackRing);
})();

document.querySelectorAll('a,button,.sk-card,.ach-card,.ct-card,.tl-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    cursor.style.background = 'var(--cy)';
    ring.style.opacity = '0';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--p)';
    ring.style.opacity = '1';
  });
});

/* ======= NAVBAR ======= */
const nav  = document.getElementById('nav');
const menu = document.getElementById('navMenu');
const ham  = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  nav.classList.toggle('up', window.scrollY > 40);
  updateActiveLink();
});

ham.addEventListener('click', () => {
  menu.classList.toggle('open');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

function updateActiveLink() {
  const y = window.scrollY + 130;
  document.querySelectorAll('section[id]').forEach(s => {
    const lnk = menu.querySelector(`a[href="#${s.id}"]`);
    if (!lnk) return;
    lnk.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
  });
}

/* ======= REVEAL ======= */
const revObs = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ======= COUNTER ======= */
function animNum(el) {
  const to  = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.dec || 0);
  const dur = 1700;
  const t0  = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = (e * to).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

const cntObs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) { animNum(e.target); cntObs.unobserve(e.target); }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.es-num').forEach(el => cntObs.observe(el));

/* ======= PARTICLE CANVAS ======= */
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
let pts = [], rid;

function resize() { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }

function initPts() {
  pts = [];
  const n = Math.min(Math.floor(cvs.width * cvs.height / 16000), 70);
  for (let i = 0; i < n; i++) {
    pts.push({
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height,
      r: Math.random() * 1.3 + 0.25,
      vx: (Math.random() - .5) * .25,
      vy: (Math.random() - .5) * .25,
      a: Math.random() * .4 + .08
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  /* lines */
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 95) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(139,92,246,${.065 * (1 - d / 95)})`;
        ctx.lineWidth = .55;
        ctx.stroke();
      }
    }
  }

  /* dots */
  pts.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(139,92,246,${p.a})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = cvs.width;
    if (p.x > cvs.width) p.x = 0;
    if (p.y < 0) p.y = cvs.height;
    if (p.y > cvs.height) p.y = 0;
  });

  rid = requestAnimationFrame(draw);
}

resize(); initPts(); draw();
window.addEventListener('resize', () => { cancelAnimationFrame(rid); resize(); initPts(); draw(); });
