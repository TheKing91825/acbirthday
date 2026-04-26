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

  // 7. Wordle Game
  initWordle();

  // 8. Secret Nav Link to Memory Game
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.style.cursor = 'pointer';
    navLogo.addEventListener('click', () => {
      window.location.href = 'memory.html';
    });
  }

  // 9. Party Mode Toggle (Cake Emoji)
  const cakeBtn = document.getElementById('party-mode-btn');
  if (cakeBtn) {
    cakeBtn.addEventListener('click', () => {
      document.body.classList.toggle('party-mode');
    });
  }

  // 10. Modified Konami Code (Up, Up, Down, Down, Left, Right)
  const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  let codePosition = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === secretCode[codePosition]) {
      codePosition++;
      if (codePosition === secretCode.length) {
        document.body.classList.toggle('disco-mode');
        initConfetti();
        codePosition = 0;
      }
    } else {
      codePosition = 0;
    }
  });

  // 11. Shake to Celebrate (phone shake → confetti cannon)
  initShakeToConfetti();

  // 12. Time Capsule Messages (double-tap circular photos on home page)
  initTimeCapsule();

  // 13. Gravity Balloons (device tilt)
  initGravityBalloons();

  // 14. Golden Theme Unlock (tap Ajit → Alka → Family photo)
  initGoldenTheme();

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
  
  // Chai counting from October 12, 2002
  const chaiStartDate = new Date('2002-10-12');
  const today = new Date();
  const chaiDays = Math.ceil(Math.abs(today - chaiStartDate) / (1000 * 60 * 60 * 24));
  const chai = chaiDays * 2;
  
  statsContainer.innerHTML = `
    <p style="font-size: 1.2rem; margin-bottom: 1rem;">Ajit has brightened the world for <strong>${days.toLocaleString()}</strong> days and counting! 🌟</p>
    <ul style="list-style: none; padding: 0; font-size: 1.1rem; line-height: 1.8;">
      <li>🌅 That's <strong>${sunrises.toLocaleString()}</strong> sunrises</li>
      <li>❤️ <strong>${heartbeats.toLocaleString()}</strong> heartbeats (approx)</li>
      <li>☕ <strong>${chai.toLocaleString()}</strong> cups of chai (since Oct 12, 2002)</li>
    </ul>
  `;
}


/**
 * Wordle Game Implementation
 */
function initWordle() {
  const grid = document.getElementById('wordle-grid');
  const keyboard = document.getElementById('wordle-keyboard');
  if (!grid || !keyboard) return;

  const targetWord = "PADRE";
  const maxGuesses = 6;
  const wordLength = 5;
  let currentGuess = "";
  let guesses = [];
  let isGameOver = false;

  // Build grid
  for (let i = 0; i < maxGuesses; i++) {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
    row.style.gap = '8px';
    
    for (let j = 0; j < wordLength; j++) {
      const tile = document.createElement('div');
      tile.className = 'wordle-tile';
      tile.id = `tile-${i}-${j}`;
      tile.style.border = '2px solid rgba(255, 255, 255, 0.2)';
      tile.style.display = 'flex';
      tile.style.justifyContent = 'center';
      tile.style.alignItems = 'center';
      tile.style.fontSize = '2rem';
      tile.style.fontWeight = 'bold';
      tile.style.textTransform = 'uppercase';
      tile.style.height = '60px';
      tile.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      row.appendChild(tile);
    }
    grid.appendChild(row);
  }

  // Build keyboard
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  keys.forEach(rowKeys => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'center';
    row.style.gap = '6px';
    
    rowKeys.forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = key;
      btn.id = `key-${key}`;
      btn.style.padding = key === 'ENTER' || key === 'DEL' ? '12px 10px' : '12px 0';
      btn.style.flex = key === 'ENTER' || key === 'DEL' ? '1.5' : '1';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      btn.style.color = 'white';
      btn.style.fontWeight = 'bold';
      btn.style.cursor = 'pointer';
      
      btn.addEventListener('click', () => handleKeyPress(key));
      row.appendChild(btn);
    });
    keyboard.appendChild(row);
  });

  // Handle physical keyboard
  document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    const key = e.key.toUpperCase();
    if (key === 'ENTER') {
      handleKeyPress('ENTER');
    } else if (key === 'BACKSPACE') {
      handleKeyPress('DEL');
    } else if (/^[A-Z]$/.test(key)) {
      handleKeyPress(key);
    }
  });

  function handleKeyPress(key) {
    if (isGameOver) return;
    
    const msg = document.getElementById('wordle-message');
    msg.textContent = '';

    if (key === 'DEL') {
      if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateGrid();
      }
    } else if (key === 'ENTER') {
      if (currentGuess.length < wordLength) {
        msg.textContent = 'Not enough letters';
      } else {
        submitGuess();
      }
    } else {
      if (currentGuess.length < wordLength) {
        currentGuess += key;
        updateGrid();
      }
    }
  }

  function updateGrid() {
    const rowIdx = guesses.length;
    for (let i = 0; i < wordLength; i++) {
      const tile = document.getElementById(`tile-${rowIdx}-${i}`);
      tile.textContent = currentGuess[i] || '';
      if (currentGuess[i]) {
        tile.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      } else {
        tile.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    }
  }

  function submitGuess() {
    const rowIdx = guesses.length;
    const guessArr = currentGuess.split('');
    const targetArr = targetWord.split('');
    
    // First pass: find exact matches (green)
    let exactMatches = 0;
    guessArr.forEach((char, i) => {
      const tile = document.getElementById(`tile-${rowIdx}-${i}`);
      const keyBtn = document.getElementById(`key-${char}`);
      
      if (char === targetArr[i]) {
        tile.style.backgroundColor = '#22c55e'; // Green
        tile.style.borderColor = '#22c55e';
        keyBtn.style.backgroundColor = '#22c55e';
        targetArr[i] = null; // Consume the letter
        guessArr[i] = null;
        exactMatches++;
      }
    });

    // Second pass: find partial matches (yellow) and misses (gray)
    guessArr.forEach((char, i) => {
      if (char === null) return; // already green
      
      const tile = document.getElementById(`tile-${rowIdx}-${i}`);
      const keyBtn = document.getElementById(`key-${char}`);
      const targetIdx = targetArr.indexOf(char);
      
      if (targetIdx > -1) {
        tile.style.backgroundColor = '#eab308'; // Yellow
        tile.style.borderColor = '#eab308';
        if (keyBtn.style.backgroundColor !== 'rgb(34, 197, 94)') { // Not already green
          keyBtn.style.backgroundColor = '#eab308';
        }
        targetArr[targetIdx] = null; // Consume the letter
      } else {
        tile.style.backgroundColor = '#475569'; // Gray
        tile.style.borderColor = '#475569';
        if (keyBtn.style.backgroundColor !== 'rgb(34, 197, 94)' && keyBtn.style.backgroundColor !== 'rgb(234, 179, 8)') {
          keyBtn.style.backgroundColor = '#475569';
        }
      }
    });

    guesses.push(currentGuess);
    
    if (exactMatches === wordLength) {
      gameWon();
    } else if (guesses.length === maxGuesses) {
      document.getElementById('wordle-message').textContent = `The word was ${targetWord}. But we'll let you in anyway!`;
      setTimeout(gameWon, 2000);
    }
    
    currentGuess = "";
  }

  function gameWon() {
    isGameOver = true;
    document.getElementById('wordle-message').textContent = 'Magnificent! Unlocking letter...';
    
    // Confetti effect
    initConfetti();

    setTimeout(() => {
      document.getElementById('wordle-container').style.display = 'none';
      document.getElementById('wordle-instructions').style.display = 'none';
      
      const letter = document.getElementById('letter-content');
      letter.style.display = 'block';
      
      // Scroll to letter smoothly
      letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
  }
}

/* ============================================
   EASTER EGG 11: SHAKE TO CELEBRATE
   Uses DeviceMotionEvent to detect phone shake
   ============================================ */
function initShakeToConfetti() {
  let lastX = null, lastY = null, lastZ = null;
  let lastShakeTime = 0;
  const SHAKE_THRESHOLD = 18;
  const COOLDOWN_MS = 3000;

  function handleMotion(e) {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;

    const { x, y, z } = acc;
    if (lastX === null) { lastX = x; lastY = y; lastZ = z; return; }

    const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
    lastX = x; lastY = y; lastZ = z;

    const now = Date.now();
    if (delta > SHAKE_THRESHOLD && now - lastShakeTime > COOLDOWN_MS) {
      lastShakeTime = now;
      // Fire a BIG confetti cannon — 3 bursts
      initConfetti();
      setTimeout(initConfetti, 400);
      setTimeout(initConfetti, 800);
    }
  }

  // iOS 13+ requires permission
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    // We'll ask permission on the first user interaction
    const askOnce = () => {
      DeviceMotionEvent.requestPermission().then(state => {
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      }).catch(() => {});
      document.removeEventListener('touchstart', askOnce);
    };
    document.addEventListener('touchstart', askOnce, { once: true });
  } else if (typeof DeviceMotionEvent !== 'undefined') {
    window.addEventListener('devicemotion', handleMotion);
  }
}

/* ============================================
   EASTER EGG 12: TIME CAPSULE MESSAGES
   Double-tap (or click) circular photos on home page
   ============================================ */
function initTimeCapsule() {
  // Messages for each family member's circular photo
  const capsules = {
    'ajit-circle':  { icon: '👑', message: 'The OG. 51 years of pure greatness. We love you, Dad!' },
    'alka-circle':  { icon: '❤️', message: 'The heart of our family. Always there, always loving. We love you, Mom!' },
    'abhay-circle': { icon: '🌍', message: 'Exploring the world, one adventure at a time. Keep going!' },
    'akshay-circle':{ icon: '😈', message: 'YOU THOUGHT 😈' },
  };

  // Build the overlay once
  const overlay = document.createElement('div');
  overlay.className = 'time-capsule-overlay';
  overlay.innerHTML = `
    <div class="time-capsule-card">
      <button class="tc-close">&times;</button>
      <span class="tc-icon" id="tc-icon"></span>
      <div class="tc-message" id="tc-message"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  function openCapsule(id) {
    const data = capsules[id];
    if (!data) return;
    document.getElementById('tc-icon').textContent = data.icon;
    document.getElementById('tc-message').textContent = data.message;
    overlay.classList.add('active');
  }

  function closeCapsule() {
    overlay.classList.remove('active');
  }

  overlay.querySelector('.tc-close').addEventListener('click', closeCapsule);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeCapsule(); });

  // Attach listeners to each circle
  Object.keys(capsules).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // Double-click for desktop
    el.addEventListener('dblclick', () => openCapsule(id));

    // Double-tap for mobile
    let lastTap = 0;
    el.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 350) {
        e.preventDefault();
        openCapsule(id);
      }
      lastTap = now;
    });
  });
}

/* ============================================
   EASTER EGG 13: GRAVITY BALLOONS
   Balloons drift based on device tilt (gyroscope)
   ============================================ */
function initGravityBalloons() {
  if (!window.DeviceOrientationEvent) return;

  let tiltX = 0, tiltY = 0;
  let animFrame;

  function handleOrientation(e) {
    // gamma = left/right tilt (-90 to 90), beta = front/back (-180 to 180)
    tiltX = (e.gamma || 0) / 45; // normalize to -1 .. 1
    tiltY = (e.beta  || 0) / 90; // normalize to -1 .. 1
  }

  function applyTilt() {
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((b, i) => {
      // Each balloon drifts at a slightly different rate for a natural effect
      const factor = 0.8 + (i % 3) * 0.4;
      const shiftX = tiltX * 30 * factor;
      const shiftY = tiltY * 15 * factor;
      b.style.marginLeft = `${shiftX}px`;
      b.style.marginTop  = `${shiftY}px`;
    });
    animFrame = requestAnimationFrame(applyTilt);
  }

  function startGravity() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          applyTilt();
        }
      }).catch(() => {});
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
      applyTilt();
    }
    document.removeEventListener('touchstart', startGravity);
  }

  // Start on first touch (handles iOS permission)
  document.addEventListener('touchstart', startGravity, { once: true });
}

/* ============================================
   EASTER EGG 14: GOLDEN THEME UNLOCK
   Tap sequence: Ajit card → Alka card → Family hero photo
   ============================================ */
function initGoldenTheme() {
  // The 3 elements to tap in order
  const sequence = ['ajit-circle', 'alka-circle', 'footer-family-photo'];
  let step = 0;
  let resetTimer;

  function handleTap(id) {
    if (id !== sequence[step]) {
      // Wrong element — reset
      step = 0;
      clearTimeout(resetTimer);
      return;
    }

    step++;
    clearTimeout(resetTimer);

    if (step === sequence.length) {
      // Sequence complete!
      step = 0;
      const isGolden = document.body.classList.toggle('golden-theme');
      showGoldenToast(isGolden ? '👑 Royal Gold Mode Unlocked!' : '🔵 Back to Normal');
    } else {
      // Reset if no next tap within 4 seconds
      resetTimer = setTimeout(() => { step = 0; }, 4000);
    }
  }

  sequence.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click',     () => handleTap(id));
    el.addEventListener('touchstart',() => handleTap(id), { passive: true });
  });

  // Also make the footer year span clickable
  const footerYear = document.getElementById('footer-family-photo');
  if (footerYear) footerYear.style.cursor = 'pointer';
}

function showGoldenToast(msg) {
  // Remove any existing toast
  const old = document.querySelector('.golden-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'golden-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
