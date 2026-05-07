/* ═══════════════════════════════════════════
   KUNAL PATIL — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════ */

// ─── PRELOADER ───
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
  }, 2000);
});

// ─── HAMBURGER MENU ───
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ─── CUSTOM CURSOR ───
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .project-card, .cert-card, .pill').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});
document.addEventListener('mousedown', () => dot.classList.add('clicked'));
document.addEventListener('mouseup', () => dot.classList.remove('clicked'));

// ─── CURSOR TRAIL ───
const trails = [];
const TRAIL_COUNT = 20;
for (let i = 0; i < TRAIL_COUNT; i++) {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    width:${6 - i * 0.2}px; height:${6 - i * 0.2}px;
    border-radius:50%; left:0; top:0;
    background:rgba(0,245,255,${0.6 - i * 0.03});
    transform:translate(-50%,-50%);
    transition: opacity 0.3s;
  `;
  document.body.appendChild(t);
  trails.push({ el: t, x: 0, y: 0 });
}

function animateTrails() {
  let px = mouseX, py = mouseY;
  trails.forEach((t, i) => {
    const delay = 0.15 + i * 0.05;
    t.x += (px - t.x) * delay;
    t.y += (py - t.y) * delay;
    t.el.style.left = t.x + 'px';
    t.el.style.top = t.y + 'px';
    px = t.x; py = t.y;
  });
  requestAnimationFrame(animateTrails);
}
animateTrails();

// ─── PARTICLE CANVAS ───
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.8 ? '#7b2fff' : '#00f5ff';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Mouse repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.x += dx / dist * 1.5;
      this.y += dy / dist * 1.5;
    }
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = Array.from({ length: 150 }, () => new Particle());

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── TYPEWRITER ───
const phrases = [
  'Founding Engineer',
  'Full Stack & AI Product Engineer',
  'React.js & Next.js Developer',
  'Mobile App Developer',
  'AI Product Builder',
  'Cloud & DevOps Engineer',
  'React Native Developer'
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      setTimeout(() => { deleting = true; typeLoop(); }, 2000);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 50 : 80);
}
function typeLoop() { typeWriter(); }
typeWriter();

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // active link
  document.querySelectorAll('section[id]').forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + section.id);
      });
    }
  });
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── REVEAL ON SCROLL ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Animate skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const level = fill.closest('.skill-bar-item').dataset.level;
        fill.style.width = level + '%';
      });
      // Animate counters
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        let count = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count;
          if (count >= target) clearInterval(timer);
        }, 40);
      });
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => observer.observe(el));

// ─── 3D TILT EFFECT ON PROJECT CARDS ───
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 10;
    const rotY = (x / rect.width) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── COUNTER ANIMATION FOR HERO STATS ───
function startHeroCounters() {
  document.querySelectorAll('.hero-stats [data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let count = 0;
    const timer = setInterval(() => {
      count = Math.min(count + 1, target);
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, 80);
  });
}
setTimeout(startHeroCounters, 800);

// ─── PROFILE IMAGE FALLBACK ───
const profileImg = document.getElementById('profileImg');
const placeholder = document.getElementById('avatarPlaceholder');
if (profileImg) {
  profileImg.onload = () => { if (placeholder) placeholder.style.display = 'none'; };
  profileImg.onerror = () => {
    profileImg.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  };
}

// ─── BACK TO TOP ───
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── CONTACT FORM ───
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'MESSAGE SENT ✓';
  btn.style.background = '#00ff88';
  btn.style.color = '#020b18';
  setTimeout(() => {
    btn.innerHTML = 'SEND MESSAGE <span class="btn-arrow">→</span>';
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
});

// ─── MAGNETIC BUTTON EFFECT ───
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ─── SCROLL PROGRESS BAR ───
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (!scrollProgress) return;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = scrolled + '%';
});

// ─── SPOTLIGHT CURSOR EFFECT ───
document.querySelectorAll('.spotlight').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  });
});

// ─── HERO GRID PARALLAX ───
const heroGrid = document.querySelector('.hero-grid');
window.addEventListener('mousemove', e => {
  if (!heroGrid) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  heroGrid.style.transform = `translate(${x}px, ${y}px)`;
});

// ─── SECTION GLOW ON ENTRY ───
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.style.transition = 'background 0.8s';
  });
}, { threshold: 0.3 });
document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

console.log('%c KUNAL PATIL — PORTFOLIO ', 'background:#020b18;color:#00f5ff;font-size:14px;padding:8px 16px;border:1px solid #00f5ff;font-family:monospace;letter-spacing:3px;');
console.log('%c Founding Engineer | Full Stack & AI Product Engineer ', 'color:#7b2fff;font-size:11px;font-family:monospace;');
