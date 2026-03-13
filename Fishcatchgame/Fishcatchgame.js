const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const levelUpText = document.getElementById('levelUpText');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let fishes = [];
let isGameOver = false;
let gameStarted = false;
let currentLevel = 0;

const API_BASE = "http://localhost:4000";

const bgImage = new Image();
bgImage.src = 'background.jpg';

const fishSources = [
    'images/Fish1.png', 'images/Fish2.png', 'images/Fish3.png',
    'images/Fish4.png', 'images/Fish5.png', 'images/Fish6.png',
    'images/Fish7.png', 'images/Fish8.png', 'images/Fish9.png',
    'images/Fish10.png'
];

const fishImages = fishSources.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

class Fish {
    constructor() {
        this.fishIndex = Math.floor(Math.random() * fishImages.length);
        this.image     = fishImages[this.fishIndex];
        this.width     = (this.fishIndex === 9) ? 95 : 75;
        this.height    = (this.fishIndex === 9) ? 75 : 55;
        this.direction = Math.random() < 0.5 ? 'L2R' : 'R2L';

        let baseSpeed = 0.7 + (currentLevel * 0.3);
        if (this.direction === 'R2L') {
            this.x     = canvas.width + 100;
            this.speed = Math.random() * 0.8 + baseSpeed;
        } else {
            this.x     = -100;
            this.speed = -(Math.random() * 0.8 + baseSpeed);
        }
        this.y = Math.random() * (canvas.height - 140) + 70;
    }

    update() { this.x -= this.speed; this.draw(); }

    draw() {
        if (this.image.complete && this.image.naturalWidth !== 0) {
            ctx.save();
            if (this.direction === 'L2R') {
                ctx.translate(this.x + this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(this.image, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = this.fishIndex === 9 ? 'gold' : 'orange';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

// ── Save score: localStorage (per-user) + backend ──
async function saveScoreToDB(finalScore) {
    // ── Per-user localStorage save via updateScore ──
    if (typeof updateScore === 'function') {
        updateScore('fishcatchgame', finalScore);
    }

    // ── Backend save ──
    const username = localStorage.getItem('kp_username') ||
                     localStorage.getItem('playerName');
    if (!username) { console.warn("User not logged in. Backend score not saved."); return; }

    const payload = { username, gameName: "fishcatchgame", score: finalScore };
    try {
        const response = await fetch(`${API_BASE}/api/game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) console.log("Score saved to backend ✨");
    } catch (err) {
        console.warn("Backend not reachable (score saved locally):", err.message);
    }
}

function showLevelUpPopUp(level) {
    levelUpText.innerText = `LEVEL ${level} UP!`;
    levelUpText.classList.remove('hidden');
    levelUpText.style.animation = 'none';
    levelUpText.offsetHeight;
    levelUpText.style.animation = null;
    setTimeout(() => levelUpText.classList.add('hidden'), 1500);
}

function checkLevelUp() {
    let oldLevel = currentLevel;
    if      (score >= 150) currentLevel = 3;
    else if (score >= 100) currentLevel = 2;
    else if (score >= 50)  currentLevel = 1;

    if (currentLevel > oldLevel) {
        levelDisplay.innerText = currentLevel + 1;
        showLevelUpPopUp(currentLevel + 1);
    }
}

function checkCatch(e) {
    if (!gameStarted || isGameOver) return;
    const rect   = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = 0; i < fishes.length; i++) {
        if (mouseX > fishes[i].x && mouseX < fishes[i].x + fishes[i].width &&
            mouseY > fishes[i].y && mouseY < fishes[i].y + fishes[i].height) {
            score += (fishes[i].fishIndex === 9) ? 30 : 10;
            scoreDisplay.innerText = score;
            fishes.splice(i, 1);
            checkLevelUp();
            break;
        }
    }
}

canvas.addEventListener('mousedown', checkCatch);

function startGame() {
    gameStarted  = true;
    isGameOver   = false;
    score        = 0;
    currentLevel = 0;
    fishes       = [];
    scoreDisplay.innerText = score;
    levelDisplay.innerText = "1";
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    animate();
}

function resetGame() { location.reload(); }

function animate() {
    if (isGameOver || !gameStarted) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImage.complete && bgImage.naturalWidth !== 0) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#005a9c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    let spawnRate = Math.max(40, 80 - (currentLevel * 10));
    if (gameFrame % spawnRate === 0) fishes.push(new Fish());

    for (let i = 0; i < fishes.length; i++) {
        fishes[i].update();

        if ((fishes[i].direction === 'R2L' && fishes[i].x + fishes[i].width < 0) ||
            (fishes[i].direction === 'L2R' && fishes[i].x > canvas.width)) {

            isGameOver = true;
            gameOverScreen.classList.remove('hidden');

            // ── Save score on game over ──
            saveScoreToDB(score);
            return;
        }
    }
    gameFrame++;
    requestAnimationFrame(animate);
}