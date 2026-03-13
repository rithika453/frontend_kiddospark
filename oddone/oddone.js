const rawData = [
    { items: ["🍎", "🍌", "🍇", "🥕"], names: ["Apple", "Banana", "Grapes", "Carrot"], correct: "Carrot" },
    { items: ["🦁", "🐯", "🐱", "🪑"], names: ["Lion", "Tiger", "Cat", "Table"], correct: "Table" },
    { items: ["🚗", "🚌", "🚐", "🍰"], names: ["Car", "Bus", "Van", "Cake"], correct: "Cake" },
    { items: ["☀️", "🌙", "⭐", "💡"], names: ["Sun", "Moon", "Star", "Lamp"], correct: "Lamp" },
    { items: ["🖊️", "✏️", "🧽", "🐟"], names: ["Pen", "Pencil", "Eraser", "Fish"], correct: "Fish" },
    { items: ["🐶", "🐺", "🦊", "🦜"], names: ["Dog", "Wolf", "Fox", "Parrot"], correct: "Parrot" },
    { items: ["✈️", "🐦", "🚀", "🚲"], names: ["Plane", "Bird", "Rocket", "Bike"], correct: "Bike" },
    { items: ["👦", "👧", "👩", "👨‍🏫"], names: ["Brother", "Sister", "Mother", "Teacher"], correct: "Teacher" },
    { items: ["🥛", "🧃", "💧", "🪨"], names: ["Milk", "Juice", "Water", "Stone"], correct: "Stone" },
    { items: ["⏰", "⌚", "⏲️", "🥛"], names: ["Clock", "Watch", "Timer", "Glass"], correct: "Glass" }
];

let gamePool = [];
let currentIdx  = 0;
let totalPoints = 0;
let correctCount = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function initGame() {
    gamePool     = shuffle([...rawData]).slice(0, 10);
    currentIdx   = 0;
    totalPoints  = 0;
    correctCount = 0;
    showQuestion();
}

function showQuestion() {
    const q = gamePool[currentIdx];
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = "";
    document.getElementById('nextBtn').style.display = "none";
    document.getElementById('score').innerText        = totalPoints;
    document.getElementById('currentLevel').innerText = currentIdx + 1;

    let options = [];
    for (let i = 0; i < 4; i++) {
        options.push({ icon: q.items[i] || "❓", name: q.names[i] });
    }
    options = shuffle(options);

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerHTML = `<span class="emoji">${opt.icon}</span><span class="word">${opt.name}</span>`;
        btn.onclick = () => checkAns(btn, opt.name, q.correct);
        optionsDiv.appendChild(btn);
    });
}

function checkAns(btn, selected, correct) {
    const allBtns = document.querySelectorAll('.btn');
    allBtns.forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
        totalPoints += 5;
        correctCount++;
    } else {
        btn.classList.add('wrong');
        totalPoints = Math.max(0, totalPoints - 1);
        allBtns.forEach(b => {
            if (b.innerText.includes(correct)) b.classList.add('correct');
        });
    }

    document.getElementById('score').innerText = totalPoints;

    // ── Save score immediately after every answer ──
    if (typeof updateScore === 'function') updateScore('oddone', totalPoints);

    document.getElementById('nextBtn').style.display = "block";
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < 10) {
        showQuestion();
    } else {
        finishGame();
    }
}

function finishGame() {
    // ── Final save on game over ──
    if (typeof updateScore === 'function') updateScore('oddone', totalPoints);

    document.querySelector('.game-box').innerHTML = `
        <h2 style="color:#6c5ce7;font-size:28px;margin-bottom:10px;">🎉 GAME OVER!</h2>
        <p style="font-size:20px;font-weight:bold;margin-bottom:6px;">Final Score: ${totalPoints} pts</p>
        <p style="font-size:15px;color:#888;margin-bottom:20px;">Correct: ${correctCount} / 10</p>
        <button onclick="location.reload()"
            style="background:#00b894;color:white;width:100%;padding:14px;
                   border:none;border-radius:20px;font-size:18px;font-weight:bold;
                   box-shadow:0 6px 0 #008f71;cursor:pointer;">
            🔄 Play Again
        </button>
        <button onclick="window.location.href='../game.html'"
            style="margin-top:10px;background:#6c5ce7;color:white;width:100%;padding:14px;
                   border:none;border-radius:20px;font-size:18px;font-weight:bold;
                   box-shadow:0 6px 0 #4a3aab;cursor:pointer;">
            ⬅ Back to Games
        </button>
    `;
}

initGame();