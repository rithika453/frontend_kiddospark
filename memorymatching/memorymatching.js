let movesLeft = 0;
let score = 0;
let firstCard = null;
let lockBoard = false;

function startGame() {
  const level = document.getElementById("level").value;
  let gridSize;

  switch(level) {
    case "4": gridSize = 4; break;
    case "6": gridSize = 6; break;
    case "8": gridSize = 8; break;
    default:  gridSize = 4;
  }

  movesLeft = gridSize * gridSize + 10;
  score     = 0;

  updateStatus();
  generateBoard(gridSize, level);
}

function updateStatus() {
  document.getElementById("moves").textContent = movesLeft;
  document.getElementById("score").textContent = score;
}

function generateBoard(size, level) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${size}, 70px)`;
  board.style.gridTemplateRows    = `repeat(${size}, 70px)`;

  let symbols = [];

  if (level === "4") {
    let images = [
      "cat.jpg","dog.jpg","lion.png","tiger.png",
      "apple.png","carrot.png","pizza.png","banana.png",
      "circle.png","heart.png","triangle.png","star.png"
    ];
    for (let i = 0; i < (size * size) / 2; i++) {
      symbols.push(images[i]);
      symbols.push(images[i]);
    }
  } else if (level === "6") {
    let emojis = ["😊","🍎","🚗","⚽","🎵","🌸"];
    for (let i = 0; i < (size * size) / 2; i++) {
      symbols.push(emojis[i % emojis.length]);
      symbols.push(emojis[i % emojis.length]);
    }
  } else if (level === "8") {
    let emojis = ["🌍","🐠","🏰","🔥","🍩","🎲","⭐","🚀"];
    for (let i = 0; i < (size * size) / 2; i++) {
      symbols.push(emojis[i % emojis.length]);
      symbols.push(emojis[i % emojis.length]);
    }
  }

  // Fisher-Yates shuffle
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }

  symbols.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.textContent    = "";
    card.addEventListener("click", () => flipCard(card, level));
    board.appendChild(card);
  });
}

function flipCard(card, level) {
  if (lockBoard || card.classList.contains("flipped")) return;
  if (movesLeft <= 0) return;

  card.classList.add("flipped");

  if (level === "4") {
    card.innerHTML = `<img src="images/${card.dataset.symbol}" width="60" height="60">`;
  } else {
    card.textContent = card.dataset.symbol;
  }

  if (!firstCard) {
    firstCard = card;
    return;
  }

  movesLeft--;

  if (card.dataset.symbol === firstCard.dataset.symbol) {
    score += 20;
    firstCard = null;
  } else {
    lockBoard = true;
    setTimeout(() => {
      card.classList.remove("flipped");
      card.textContent      = "";
      firstCard.classList.remove("flipped");
      firstCard.textContent = "";
      firstCard  = null;
      lockBoard  = false;
    }, 800);
  }

  updateStatus();

  // ── Save score after every move ──
  if (typeof updateScore === 'function') updateScore('memorymatching', score);

  const allCards   = document.querySelectorAll(".card");
  const allMatched = Array.from(allCards).every(c => c.classList.contains("flipped"));

  if (allMatched) {
    // Win — final save
    if (typeof updateScore === 'function') updateScore('memorymatching', score);
    setTimeout(() => showResult(true), 500);
  } else if (movesLeft <= 0) {
    // Lose — final save
    if (typeof updateScore === 'function') updateScore('memorymatching', score);
    setTimeout(() => showResult(false), 500);
  }
}

function showResult(isWin) {
  document.getElementById('resultEmoji').textContent = isWin ? '🎉' : '😢';
  document.getElementById('resultTitle').textContent = isWin ? 'Amazing!' : 'Game Over!';
  document.getElementById('resultScore').textContent = '🏆 Score: ' + score;
  document.getElementById('resultOverlay').style.display = 'flex';
}