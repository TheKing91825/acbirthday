document.addEventListener('DOMContentLoaded', () => {
  // 1. Confetti Burst on page load
  initConfetti();

  // 2. Scroll-triggered fade-in
  initIntersectionObserver();

  // 3. Lightbox for Gallery
  initLightbox();

  // 4. Active Nav Link Highlighting
  highlightActiveNav();

  // 5. Balloon & Sparkle Randomizer
  randomizeBackgroundDecorations();
  
  // 6. Days Alive Calculator (if the stats element exists on the page)
  updateDaysAliveStats();
});

/**
 * Creates a beautiful confetti burst on page load.
 * Stops generating new confetti after 3 seconds.
 */
function initConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Handle resize
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let particles = [];
  const colors = ['#fbbf24', '#fb7185', '#38bdf8', '#34d399', '#f8fafc', '#f472b6', '#a78bfa'];

  // Initialize particles from the center bottom
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height,
      r: Math.random() * 6 + 3,
      dx: Math.random() * 14 - 7,
      dy: Math.random() * -18 - 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: (Math.random() * 0.07) + 0.05
    });
  }

  let startTime = Date.now();
  let animationId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allFinished = true;
    
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleInc;
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.25; // gravity
      
      // Stop checking if it falls below the screen
      if (p.y < canvas.height + 50) {
        allFinished = false;
        
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
      }
    });

    if (Date.now() - startTime < 3500 || !allFinished) { 
       animationId = requestAnimationFrame(draw);
    } else {
       canvas.remove(); // Cleanup after confetti is done
       window.removeEventListener('resize', resizeCanvas);
    }
  }
  
  // Small delay before bursting
  setTimeout(() => {
    draw();
  }, 200);
}

/**
 * Fades in elements as they scroll into view
 */
function initIntersectionObserver() {
  const elements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/**
 * Simple Lightbox implementation for photo placeholders
 */
function initLightbox() {
  // Create lightbox HTML structure
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  
  const content = document.createElement('div');
  content.className = 'lightbox-content glass-card';
  
  const closeBtn = document.createElement('div');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&times;';
  
  lightbox.appendChild(content);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  // Attach to gallery items
  const galleryItems = document.querySelectorAll('.gallery .photo-placeholder, .photo-strip .photo-placeholder');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // For the placeholder phase, we just duplicate the placeholder into the lightbox
      content.innerHTML = item.innerHTML; 
      content.style.background = getComputedStyle(item).background;
      content.style.width = '400px';
      content.style.height = '400px';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.style.justifyContent = 'center';
      content.style.alignItems = 'center';
      
      lightbox.classList.add('active');
    });
  });

  // Close functionality
  const closeLightbox = () => lightbox.classList.remove('active');
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/**
 * Highlights the current page in the navigation
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
}

/**
 * Randomizes balloons and sparkles in the background
 */
function randomizeBackgroundDecorations() {
  // Balloons
  const balloonContainer = document.querySelector('.balloon-container');
  if (balloonContainer) {
    const balloonCount = parseInt(balloonContainer.dataset.count) || 8;
    const colors = ['var(--color-coral)', 'var(--color-gold)', 'var(--color-blue)', 'var(--color-green)'];
    
    for (let i = 0; i < balloonCount; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.left = `${Math.random() * 90 + 5}%`;
      b.style.animationDelay = `${Math.random() * 15}s`;
      b.style.animationDuration = `${12 + Math.random() * 10}s`;
      b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Make some balloons slightly smaller/larger
      const scale = 0.8 + Math.random() * 0.5;
      b.style.transform = `scale(${scale})`;
      
      balloonContainer.appendChild(b);
    }
  }

  // Sparkles
  const sparklesContainer = document.querySelector('.sparkles-container');
  if (sparklesContainer) {
    const sparkleCount = parseInt(sparklesContainer.dataset.count) || 20;
    
    for (let i = 0; i < sparkleCount; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 3}s`;
      s.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      sparklesContainer.appendChild(s);
    }
  }
}

/**
 * Calculates days alive and populates the fun facts section
 */
function calculateDaysAlive(birthdateString) {
  const birthdate = new Date(birthdateString);
  const today = new Date();
  const diffTime = Math.abs(today - birthdate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
}

function updateDaysAliveStats() {
  const statsContainer = document.getElementById('fun-facts-stats');
  if (!statsContainer) return;
  
  const birthdate = statsContainer.dataset.birthdate;
  if (!birthdate) return;
  
  const days = calculateDaysAlive(birthdate);
  const sunrises = days;
  const heartbeats = days * 100000;
  const chai = days * 2;
  
  statsContainer.innerHTML = `
    <p style="font-size: 1.2rem; margin-bottom: 1rem;">Ajit has brightened the world for <strong>${days.toLocaleString()}</strong> days and counting! 🌟</p>
    <ul style="list-style: none; padding: 0; font-size: 1.1rem; line-height: 1.8;">
      <li>🌅 That's <strong>${sunrises.toLocaleString()}</strong> sunrises</li>
      <li>❤️ <strong>${heartbeats.toLocaleString()}</strong> heartbeats (approx)</li>
      <li>☕ <strong>${chai.toLocaleString()}</strong> cups of chai (approx)</li>
    </ul>
  `;
}
