const startBtn = document.getElementById("startGame");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const fruitsGroup = document.getElementById("fruits");
const resultEl = document.getElementById("result");

let score = 0;
let timeLeft = 30;
let timer = null;
let spawnInterval = null;
let gameRunning = false;

function resetGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  fruitsGroup.innerHTML = "";
  resultEl.textContent = "";
}

function endGame() {
  gameRunning = false;
  clearInterval(timer);
  clearInterval(spawnInterval);
  resultEl.textContent = "Waktu habis. Skor kamu: " + score;
}

function spawnFruit() {
  if (!gameRunning) return;

  const positions = [
    { x: 88, y: 145 },
    { x: 268, y: 145 },
    { x: 448, y: 145 },
  ];

  const base = positions[Math.floor(Math.random() * positions.length)];
  const offsetX = (Math.random() - 0.5) * 20;
  const offsetY = (Math.random() - 0.5) * 15;

  const svgNS = "http://www.w3.org/2000/svg";
  const fruit = document.createElementNS(svgNS, "circle");
  fruit.setAttribute("cx", base.x + offsetX);
  fruit.setAttribute("cy", base.y + offsetY);
  fruit.setAttribute("r", 10);
  fruit.setAttribute("fill", "#FF7043");
  fruit.style.cursor = "pointer";

  fruit.addEventListener("click", () => {
    if (!gameRunning) return;
    score += 1;
    scoreEl.textContent = score;
    if (fruit.parentNode === fruitsGroup) {
      fruitsGroup.removeChild(fruit);
    }
  });

  fruitsGroup.appendChild(fruit);

  setTimeout(() => {
    if (fruit.parentNode === fruitsGroup && gameRunning) {
      fruitsGroup.removeChild(fruit);
    }
  }, 2000);
}

startBtn.addEventListener("click", () => {
  if (gameRunning) return;
  resetGame();
  gameRunning = true;

  timer = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  spawnInterval = setInterval(spawnFruit, 600);
});
