const themes = {
    animal:      ["cat.png", "dog.png", "elephant.png", "lion.png", "tiger.png"],
    cartoon:     ["chota_bheem.png", "doreamon.png", "mickey_mouse.png", "shinchan.png", "tom_and_jerry.png"],
    educational: ["computer.png", "fruits.png", "refrigerator.png", "shoes.png", "teacher.png"],
    nature:      ["flowers.png", "forest.png", "mountain.png", "rainbow.png", "waterfalls.png"],
    places:      ["eiffel_tower.png", "pyramids.png", "red_fort.png", "statue_of_liberty.png", "taj_mahal.png"],
    vehicles:    ["bike.png", "car.png", "helicopter.png", "plane.png", "train.png"]
};

let currentLevel     = 3;   // Easy = 3×3
let sessionScore     = 0;   // cumulative score across levels
let currentImageSrc  = '';  // remember image for level progression

// ── Theme selected → reset to Easy, pick random image ──
function loadTheme(themeName) {
    currentLevel    = 3;
    sessionScore    = 0;
    const images    = themes[themeName];
    const idx       = Math.floor(Math.random() * images.length);
    currentImageSrc = "Jigsaw_images/" + themeName + "/" + images[idx];
    startPuzzle(currentImageSrc);
}

function startPuzzle(imageSrc) {
    currentImageSrc = imageSrc;
    const puzzleArea = document.getElementById("puzzleArea");
    puzzleArea.innerHTML = "";

    const rows        = currentLevel;
    const cols        = currentLevel;
    const pieceWidth  = 300 / cols;
    const pieceHeight = 300 / rows;

    let pieces = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            pieces.push({
                background:        `url(${imageSrc})`,
                backgroundPosition:`-${c * pieceWidth}px -${r * pieceHeight}px`,
                correctIndex:       r * cols + c
            });
        }
    }

    // Fisher-Yates shuffle
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    puzzleArea.style.display              = "grid";
    puzzleArea.style.gridTemplateColumns  = `repeat(${cols}, ${pieceWidth}px)`;
    puzzleArea.style.gridTemplateRows     = `repeat(${rows}, ${pieceHeight}px)`;

    pieces.forEach((piece, index) => {
        const div = document.createElement("div");
        div.className               = "piece";
        div.style.width             = pieceWidth  + "px";
        div.style.height            = pieceHeight + "px";
        div.style.backgroundImage   = piece.background;
        div.style.backgroundSize    = "300px 300px";
        div.style.backgroundPosition= piece.backgroundPosition;
        div.draggable               = true;
        div.dataset.index           = index;
        div.dataset.correctIndex    = piece.correctIndex;
        div.addEventListener("dragstart", dragStart);
        div.addEventListener("dragover",  dragOver);
        div.addEventListener("drop",      drop);
        puzzleArea.appendChild(div);
    });
}

// ── Drag & Drop ──
let dragged;

function dragStart(e) { dragged = e.target; }
function dragOver(e)  { e.preventDefault(); }

function drop(e) {
    e.preventDefault();
    if (dragged !== e.target) {
        const tempBg      = dragged.style.backgroundPosition;
        const tempCorrect = dragged.dataset.correctIndex;

        dragged.style.backgroundPosition = e.target.style.backgroundPosition;
        dragged.dataset.correctIndex      = e.target.dataset.correctIndex;

        e.target.style.backgroundPosition = tempBg;
        e.target.dataset.correctIndex      = tempCorrect;
    }
    checkWin(e.target.parentNode);
}

// ── Check win ──
function checkWin(puzzleArea) {
    const pieces = puzzleArea.querySelectorAll(".piece");
    let solved   = true;
    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.correctIndex) !== index) solved = false;
    });

    if (!solved) return;

    // 🎉 Confetti
    confetti({ particleCount: 150, spread: 70, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 150, spread: 70, origin: { x: 1, y: 0.6 } });

    // ── Score: level 3→100, 4→200, 5→300, cumulative ──
    const levelScore = currentLevel * 100;
    sessionScore    += levelScore;

    // ── Save per-user via updateScore (lowercase key 'jigsaw') ──
    if (typeof updateScore === 'function') updateScore('jigsaw', sessionScore);

    // Friendly win message
    const msg         = document.createElement("div");
    msg.className     = "win-msg";
    msg.textContent   = `🎉 Level ${currentLevel - 2} done! +${levelScore} pts  ⭐ Total: ${sessionScore}`;
    document.getElementById("puzzleCard").appendChild(msg);
    setTimeout(() => msg.remove(), 3000);

    nextLevel(currentImageSrc);
}

// ── Next Level ──
function nextLevel(imageSrc) {
    currentLevel++;
    if (currentLevel > 5) {
        // All 3 levels complete — final save already done in checkWin
        setTimeout(() => {
            alert(`🏆 You finished all 3 levels!\n⭐ Final Score: ${sessionScore}`);
            sessionScore = 0;
            currentLevel = 3;
        }, 200);
        return;
    }
    startPuzzle(imageSrc);
}