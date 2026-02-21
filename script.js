// ===== CURSOR PERSONALIZADO =====
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let rafId = null;
let isMoving = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  if (!isMoving) {
    isMoving = true;
    rafId = requestAnimationFrame(animateFollower);
  }
});

function animateFollower() {
  const dx = mouseX - followerX;
  const dy = mouseY - followerY;
  followerX += dx * 0.2;
  followerY += dy * 0.2;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
    rafId = requestAnimationFrame(animateFollower);
  } else {
    isMoving = false;
  }
}

// ===== TEMA OSCURO / CLARO =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Leer preferencia guardada
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateIcon(next);
});

function updateIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== NAVEGACIÓN SUAVE CON OFFSET =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== INTERSECTION OBSERVER — REVEAL SECCIONES =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== OBSERVER — TARJETAS DE PROYECTO =====
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.12}s`;
  cardObserver.observe(card);
});

// ===== OBSERVER — BARRAS DE HABILIDAD =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animate');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillSection = document.getElementById('habilidades');
if (skillSection) skillObserver.observe(skillSection);

// ===== DISCORD COPY =====
const discordBtn = document.getElementById('discord-copy');
const toast = document.getElementById('toast');

if (discordBtn) {
  discordBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('lleagy').then(() => {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    });
  });
}

// ===== LAZY LOAD SPLINE =====
const splineWrapper = document.getElementById('spline-wrapper');
if (splineWrapper) {
  const splineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Cargar script de Spline solo cuando sea visible
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.12.58/build/spline-viewer.js';
        script.onload = () => {
          const placeholder = document.getElementById('spline-placeholder');
          const viewer = document.createElement('spline-viewer');
          viewer.setAttribute('url', 'https://prod.spline.design/eKzfteJzDmvuy2XU/scene.splinecode');
          if (placeholder) placeholder.remove();
          splineWrapper.appendChild(viewer);
          const hint = document.createElement('div');
          hint.className = 'spline-hint';
          hint.innerHTML = '<i class="fas fa-mouse-pointer"></i> Mueve el ratón por aquí';
          splineWrapper.appendChild(hint);
        };
        document.head.appendChild(script);
        splineObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  splineObserver.observe(splineWrapper);
}
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.topnav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.background = link.getAttribute('href') === `#${current}` 
      ? 'var(--border)' : '';
    link.style.color = link.getAttribute('href') === `#${current}` 
      ? 'var(--text)' : '';
  });
}, { passive: true });
