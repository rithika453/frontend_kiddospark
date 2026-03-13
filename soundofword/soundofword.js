const allLevels = [
    { word: "cow",      hint: 'This animal says "Moo"',        audioId: "cowSound",      img: "images/cow.jpg" },
    { word: "dog",      hint: 'This animal says "Bow Bow"',    audioId: "dogSound",      img: "images/dog.jpg" },
    { word: "cat",      hint: 'This animal says "Meow"',       audioId: "catSound",      img: "images/cat.jpg" },
    { word: "sheep",    hint: 'This animal says "Baa"',        audioId: "sheepSound",    img: "images/sheep.jpg" },
    { word: "goat",     hint: 'This animal says "Maa"',        audioId: "goatSound",     img: "images/goat.jpg" },
    { word: "rabbit",   hint: 'This animal hops quietly',      audioId: "rabbitSound",   img: "images/rabbit.jpg" },
    { word: "elephant", hint: 'This animal trumpets loudly',   audioId: "elephantSound", img: "images/elephant.jpg" },
    { word: "pig",      hint: 'This animal says "Oink"',       audioId: "pigSound",      img: "images/pig.jpg" },
    { word: "horse",    hint: 'This animal says "Neigh"',      audioId: "horseSound",    img: "images/horse.jpg" },
    { word: "donkey",   hint: 'This animal says "Hee-Haw"',    audioId: "donkeySound",   img: "images/donkey.jpg" },
    { word: "lion",     hint: 'This animal roars loudly',      audioId: "lionSound",     img: "images/lion.png" },
    { word: "tiger",    hint: 'This animal growls fiercely',   audioId: "tigerSound",    img: "images/tiger.png" }
];

let unlockedLevels = 1;
let currentIdx     = 0;
let activeAudio    = null;
let sessionScore   = 0;   // ── score tracker

function initMenu() {
    document.getElementById('message-modal').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');

    const menu = document.getElementById('level-menu');
    menu.innerHTML = "";

    for (let i = 1; i <= allLevels.length; i++) {
        const btn = document.createElement('div');
        btn.className = `level-card ${i > unlockedLevels ? 'locked' : ''}`;
        btn.innerText = i > unlockedLevels ? "🔒" : i;
        if (i <= unlockedLevels) btn.onclick = () => startGame(i - 1);
        menu.appendChild(btn);
    }
}

function startGame(idx) {
    currentIdx = idx;
    if (activeAudio) { activeAudio.pause(); activeAudio.currentTime = 0; }

    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');

    const level = allLevels[currentIdx];
    document.getElementById('level-title').innerText = `Level ${currentIdx + 1}  ⭐ Score: ${sessionScore}`;
    document.getElementById('hint-text').innerText   = level.hint;

    activeAudio = document.getElementById(level.audioId);
    if (activeAudio) {
        activeAudio.loop = true;
        activeAudio.play().catch(() => {});
    }

    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = "";

    generateChoices(level).forEach(animal => {
        const imgBtn    = document.createElement('img');
        imgBtn.src      = animal.img;
        imgBtn.className = "animal-option-img";
        imgBtn.onclick  = () => checkResult(animal.word === level.word);
        optionsBox.appendChild(imgBtn);
    });
}

function playCurrentAudio() {
    if (activeAudio) activeAudio.play();
}

function generateChoices(correct) {
    let others = allLevels.filter(l => l.word !== correct.word);
    let shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 2);
    return [correct, ...shuffled].sort(() => 0.5 - Math.random());
}

function checkResult(isCorrect) {
    const modal    = document.getElementById('message-modal');
    const modalBtn = document.getElementById('modal-btn');
    modal.classList.remove('hidden');

    if (isCorrect) {
        if (activeAudio) activeAudio.pause();

        // ── +10 points per correct answer ──
        sessionScore += 10;

        // ── Save immediately (per-user via updateScore) ──
        if (typeof updateScore === 'function') updateScore('soundofword', sessionScore);

        document.getElementById('modal-title').innerText = "🌟 Correct! 🌟";
        document.getElementById('modal-text').innerText  = `+10 pts! Total: ${sessionScore} ⭐`;

        if (currentIdx + 2 > unlockedLevels) unlockedLevels = currentIdx + 2;

        const isLast = currentIdx >= allLevels.length - 1;
        modalBtn.innerText = isLast ? "🏆 Finish!" : "Next Level ➡️";
        modalBtn.onclick = () => {
            modal.classList.add('hidden');
            if (!isLast) {
                startGame(currentIdx + 1);
            } else {
                // All levels done — final save
                if (typeof updateScore === 'function') updateScore('soundofword', sessionScore);
                alert(`🏆 You finished all levels!\n⭐ Final Score: ${sessionScore}`);
                sessionScore = 0;
                initMenu();
            }
        };

    } else {
        document.getElementById('modal-title').innerText = "🧐 Oops! 🧐";
        document.getElementById('modal-text').innerText  = "Wrong! Try again.";
        modalBtn.innerText = "Retry 🔄";
        modalBtn.onclick   = () => modal.classList.add('hidden');
    }
}

window.onload = initMenu;