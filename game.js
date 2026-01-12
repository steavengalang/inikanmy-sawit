const startBtn = document.getElementById("startGame");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const fruitsGroup = document.getElementById("fruits");
const particlesGroup = document.getElementById("particles");
const gameOverlay = document.getElementById("gameOverlay");
const gameMessage = document.getElementById("gameMessage");

let score = 0;
let timeLeft = 30;
let level = 1;
let timer = null;
let spawnInterval = null;
let gameRunning = false;

const treePositions = [
  { x: 131, y: 220 },
  { x: 392, y: 210 },
  { x: 650, y: 225 }
];

function resetGame() {
  score = 0;
  timeLeft = 30;
  level = 1;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  levelEl.textContent = level;
  fruitsGroup.innerHTML = "";
  particlesGroup.innerHTML = "";
  gameOverlay.classList.remove("active");
}

function endGame() {
  gameRunning = false;
  clearInterval(timer);
  clearInterval(spawnInterval);
  
  gameMessage.innerHTML = `
    <div class="message-icon">${score >= 50 ? '🏆' : score >= 30 ? '🎉' : '👍'}</div>
    <div class="message-title">Waktu Habis!</div>
    <div class="message-desc">
      Skor Akhir: <strong>${score}</strong> | Level: <strong>${level}</strong>
      <br><br>
      ${score >= 50 ? 'Luar biasa! Kamu petani sawit profesional!' : 
        score >= 30 ? 'Bagus! Terus latih refleksmu!' : 
        'Coba lagi untuk skor lebih tinggi!'}
    </div>
  `;
  gameOverlay.classList.add("active");
  startBtn.textContent = "Main Lagi";
  startBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
    </svg>
    Main Lagi
  `;
}

function createParticle(x, y) {
  const svgNS = "http://www.w3.org/2000/svg";
  const colors = ["#FF5722", "#FF7043", "#FFC107", "#FF6F00"];
  
  for (let i = 0; i < 6; i++) {
    const particle = document.createElementNS(svgNS, "circle");
    const angle = (Math.PI * 2 * i) / 6;
    const distance = 20 + Math.random() * 15;
    const endX = x + Math.cos(angle) * distance;
    const endY = y + Math.sin(angle) * distance;
    
    particle.setAttribute("cx", x);
    particle.setAttribute("cy", y);
    particle.setAttribute("r", 3 + Math.random() * 3);
    particle.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
    particle.setAttribute("opacity", "1");
    
    particlesGroup.appendChild(particle);
    
    const animation = particle.animate([
      { cx: x, cy: y, opacity: 1, r: particle.getAttribute("r") },
      { cx: endX, cy: endY, opacity: 0, r: 0 }
    ], {
      duration: 400 + Math.random() * 200,
      easing: "ease-out"
    });
    
    animation.onfinish = () => {
      if (particle.parentNode === particlesGroup) {
        particlesGroup.removeChild(particle);
      }
    };
  }
}

function spawnFruit() {
  if (!gameRunning) return;

  const base = treePositions[Math.floor(Math.random() * treePositions.length)];
  const offsetX = (Math.random() - 0.5) * 30;
  const offsetY = (Math.random() - 0.5) * 25;

  const svgNS = "http://www.w3.org/2000/svg";
  const fruitGroup = document.createElementNS(svgNS, "g");
  fruitGroup.setAttribute("filter", "url(#gameShadow)");
  fruitGroup.style.cursor = "pointer";
  
  const fruit = document.createElementNS(svgNS, "circle");
  fruit.setAttribute("cx", base.x + offsetX);
  fruit.setAttribute("cy", base.y + offsetY);
  fruit.setAttribute("r", 11);
  fruit.setAttribute("fill", "#FF5722");
  
  const highlight = document.createElementNS(svgNS, "circle");
  highlight.setAttribute("cx", base.x + offsetX - 3);
  highlight.setAttribute("cy", base.y + offsetY - 3);
  highlight.setAttribute("r", 4);
  highlight.setAttribute("fill", "#FFE0B2");
  highlight.setAttribute("opacity", "0.7");
  
  fruitGroup.appendChild(fruit);
  fruitGroup.appendChild(highlight);

  const pulseAnimation = fruitGroup.animate([
    { transform: "scale(1)" },
    { transform: "scale(1.1)" },
    { transform: "scale(1)" }
  ], {
    duration: 800,
    iterations: Infinity
  });

  fruitGroup.addEventListener("click", (e) => {
    if (!gameRunning) return;
    e.stopPropagation();
    
    const cx = parseFloat(fruit.getAttribute("cx"));
    const cy = parseFloat(fruit.getAttribute("cy"));
    createParticle(cx, cy);
    
    score += level;
    scoreEl.textContent = score;
    
    if (score % 15 === 0 && level < 5) {
      level++;
      levelEl.textContent = level;
      clearInterval(spawnInterval);
      const newSpeed = Math.max(300, 600 - (level * 100));
      spawnInterval = setInterval(spawnFruit, newSpeed);
    }
    
    pulseAnimation.cancel();
    if (fruitGroup.parentNode === fruitsGroup) {
      fruitsGroup.removeChild(fruitGroup);
    }
  });

  fruitsGroup.appendChild(fruitGroup);

  setTimeout(() => {
    pulseAnimation.cancel();
    if (fruitGroup.parentNode === fruitsGroup && gameRunning) {
      fruitGroup.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: 200
      }).onfinish = () => {
        if (fruitGroup.parentNode === fruitsGroup) {
          fruitsGroup.removeChild(fruitGroup);
        }
      };
    }
  }, 2500 - (level * 200));
}

startBtn.addEventListener("click", () => {
  if (gameRunning) return;
  resetGame();
  gameRunning = true;
  startBtn.textContent = "Bermain...";
  startBtn.disabled = true;

  timer = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
      startBtn.disabled = false;
    }
  }, 1000);

  spawnInterval = setInterval(spawnFruit, 600);
});
