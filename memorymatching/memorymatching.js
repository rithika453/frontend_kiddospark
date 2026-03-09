let movesLeft = 0;
let score = 0;
let firstCard = null;
let lockBoard = false;

function startGame() {
  const level = document.getElementById("level").value;
  let gridSize;

  switch(level) {
    case "4": gridSize = 4; break; // Easy
    case "6": gridSize = 6; break; // Medium
    case "8": gridSize = 8; break; // Hard
    default: gridSize = 4;
  }

  movesLeft = gridSize * gridSize + 10;
  score = 0;

  updateStatus();
  generateBoard(gridSize, level);
}

function updateStatus() {
  document.getElementById("moves").textContent = "Moves Left: " + movesLeft;
  document.getElementById("score").textContent = "Score: " + score;
}

function generateBoard(size, level) {
  const board = document.getElementById("board");
  board.innerHTML = "";

  board.style.gridTemplateColumns = `repeat(${size}, 70px)`;
  board.style.gridTemplateRows = `repeat(${size}, 70px)`;

  let symbols = [];

  if (level === "4") {
    // Easy → images stored in memorymatching/images
    // filenames must exactly match what's on disk (see workspace listing)
    let images = [
      "cat.jpg",
      "dog.jpg",
      "lion.png",
      "tiger.png",
      "apple.png",
      "carrot.png",
      "pizza.png",
      "banana.png",
      "circle.png",
      "heart.png",
      "triangle.png",
      "star.png"
    ];
    for (let i = 0; i < (size*size)/2; i++) {
      symbols.push(images[i]);
      symbols.push(images[i]);
    }
  } else if (level === "6") {
    // Medium → 6 emojis
    let emojis = ["😊","🍎","🚗","⚽","🎵","🌸"];
    for (let i = 0; i < (size*size)/2; i++) {
      symbols.push(emojis[i % emojis.length]);
      symbols.push(emojis[i % emojis.length]);
    }
  } else if (level === "8") {
    // Hard → 8 emojis
    let emojis = ["🌍","🐠","🏰","🔥","🍩","🎲","⭐","🚀"];
    for (let i = 0; i < (size*size)/2; i++) {
      symbols.push(emojis[i % emojis.length]);
      symbols.push(emojis[i % emojis.length]);
    }
  }

  // Shuffle using Fisher‑Yates for better randomness
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  shuffle(symbols);

  // Create cards
  symbols.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.textContent = ""; // hidden initially
    card.addEventListener("click", () => flipCard(card, level));
    board.appendChild(card);
  });
}

function flipCard(card, level) {
  if (lockBoard || card.classList.contains("flipped")) return;
  if (movesLeft <= 0) return;

  card.classList.add("flipped");

  // Show image or emoji
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
      card.textContent = "";
      firstCard.classList.remove("flipped");
      firstCard.textContent = "";
      firstCard = null;
      lockBoard = false;
    }, 800);
  }

  updateStatus();

  // 🔑 Combined End Check
  const allCards = document.querySelectorAll(".card");
  const allMatched = Array.from(allCards).every(c => c.classList.contains("flipped"));

  if (allMatched) {
    // record high score
    if (typeof updateScore === 'function') updateScore('memorymatching', score);
    setTimeout(() => {
      alert("Good job! Play again?");
    }, 500);
  } else if (movesLeft <= 0) {
    if (typeof updateScore === 'function') updateScore('memorymatching', score);
    setTimeout(() => {
      alert("Game Over! No moves left.");
    }, 500);
  }
}
if (typeof updateScore === 'function') updateScore('memorymatching', score);