import os

base_dir = '/Users/abhaychauhan/Library/CloudStorage/OneDrive-GeorgiaInstituteofTechnology/ACbirthday/acbirthday'

# 1. Update style.css
style_path = os.path.join(base_dir, 'style.css')
with open(style_path, 'a') as f:
    f.write("""
/* DISCO MODE & PARTY MODE */
@keyframes discoFlash {
  0% { background-color: #ff0000; }
  25% { background-color: #00ff00; }
  50% { background-color: #0000ff; }
  75% { background-color: #ff00ff; }
  100% { background-color: #ff0000; }
}

body.disco-mode {
  animation: discoFlash 0.5s infinite !important;
  background-image: none !important;
}

@keyframes partyBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-15px) scale(1.05); }
}

@keyframes partyColors {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

body.party-mode {
  animation: partyColors 2s infinite linear;
}

body.party-mode .glass-card {
  animation: partyBounce 0.5s infinite alternate ease-in-out;
}

body.party-mode .photo-placeholder {
  animation: partyBounce 0.6s infinite alternate ease-in-out;
}

/* MEMORY GAME STYLES */
.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .memory-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}

.memory-card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
}

.memory-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.memory-card.flipped .memory-card-inner {
  transform: rotateY(180deg);
}

.memory-card.matched .memory-card-inner {
  transform: rotateY(180deg);
  opacity: 0.7;
}

.memory-card-front, .memory-card-back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.memory-card-front {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.memory-card-back {
  transform: rotateY(180deg);
  background-color: var(--color-blue);
}

.memory-card-back img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
""")

# 2. Update main.js
main_js_path = os.path.join(base_dir, 'main.js')
with open(main_js_path, 'r') as f:
    js_content = f.read()

secret_features = """
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
        // Code entered!
        document.body.classList.toggle('disco-mode');
        initConfetti();
        codePosition = 0; // Reset
      }
    } else {
      codePosition = 0; // Reset if mistake
    }
  });
"""

if '// 8. Secret Nav Link' not in js_content:
    js_content = js_content.replace('initWordle();\n});', 'initWordle();\n' + secret_features + '\n});')
    with open(main_js_path, 'w') as f:
        f.write(js_content)

# 3. Add cake back to index.html
index_html_path = os.path.join(base_dir, 'index.html')
with open(index_html_path, 'r') as f:
    index_content = f.read()

cake_html = """
    <!-- Party Mode Cake Emoji (scaled up) -->
    <div id="party-mode-btn" style="font-size: 5rem; margin: var(--space-md) 0; animation: bounce 2s infinite ease-in-out; cursor: pointer; user-select: none;">
      🎂✨
    </div>

    <!-- Main Family Photo Placeholder -->"""

if 'id="party-mode-btn"' not in index_content:
    index_content = index_content.replace('<!-- Main Family Photo Placeholder -->', cake_html)
    with open(index_html_path, 'w') as f:
        f.write(index_content)

print("Site updated with secret features.")
