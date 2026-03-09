const themes = {
 // folder names must match actual directories under Jigsaw_images
 animal: ["cat.png", "dog.png", "elephant.png", "lion.png", "tiger.png"],
 cartoon: ["chota_bheem.png", "doreamon.png", "mickey_mouse.png", "shinchan.png", "tom_and_jerry.png"],
 educational: ["computer.png", "fruits.png", "refrigerator.png", "shoes.png", "teacher.png"],
 nature: ["flowers.png", "forest.png", "mountain.png", "rainbow.png", "waterfalls.png"],
 places: ["eiffel_tower.png", "pyramids.png", "red_fort.png", "statue_of_liberty.png", "taj_mahal.png"],
 vehicles: ["bike.png", "car.png", "helicopter.png", "plane.png", "train.png"]
};

let currentLevel = 3; // always start at Easy

// When a theme is selected → reset to Easy and pick random image
function loadTheme(themeName) {
 currentLevel = 3; // ✅ reset to Easy level
 const images = themes[themeName];
 const randomIndex = Math.floor(Math.random() * images.length);
 // images are stored inside Jigsaw_images/<themeName>/ within this folder
 const randomImage = "Jigsaw_images/" + themeName + "/" + images[randomIndex];
 startPuzzle(randomImage);
}

function startPuzzle(imageSrc) {
 const puzzleArea = document.getElementById("puzzleArea");
 puzzleArea.innerHTML = "";

 const rows = currentLevel;
 const cols = currentLevel;
 const pieceWidth = 300 / cols;
 const pieceHeight = 300 / rows;

 // Create pieces
 let pieces = [];
 for (let r = 0; r < rows; r++) {
 for (let c = 0; c < cols; c++) {
 pieces.push({
 background: `url(${imageSrc})`,
 backgroundPosition: `-${c * pieceWidth}px -${r * pieceHeight}px`,
 correctIndex: r * cols + c
 });
 }
 }

 // Shuffle pieces
 pieces.sort(() => Math.random() - 0.5);

 // Render pieces
 puzzleArea.style.display = "grid";
 puzzleArea.style.gridTemplateColumns = `repeat(${cols}, ${pieceWidth}px)`;
 puzzleArea.style.gridTemplateRows = `repeat(${rows}, ${pieceHeight}px)`;

 pieces.forEach((piece, index) => {
  const div = document.createElement("div");
 div.className = "piece";
  div.style.width = pieceWidth + "px";
   div.style.height = pieceHeight + "px";
   div.style.backgroundImage = piece.background;
   div.style.backgroundSize = "300px 300px";
    div.style.backgroundPosition = piece.backgroundPosition;
     div.draggable = true;
 div.dataset.index = index;
div.dataset.correctIndex = piece.correctIndex;
 div.addEventListener("dragstart", dragStart);
 div.addEventListener("dragover", dragOver);
 div.addEventListener("drop", drop);

 puzzleArea.appendChild(div);
 });
}

/* --- Backend integration & simple auth UI --- */
const API_BASE = window.API_BASE || 'http://localhost:4000';
let currentUser = null;

function initAuthUI() {
  const card = document.querySelector('.game-card');
  // create login area if not exists
  if (document.getElementById('authArea')) return;

  const auth = document.createElement('div');
  auth.id = 'authArea';
  auth.style.margin = '8px 0 6px';
  auth.innerHTML = `
    <input id="usernameInput" placeholder="Enter your name" style="padding:8px 10px;border-radius:8px;border:1px solid #eee;margin-right:8px;" />
    <button id="loginBtn">Login</button>
    <div id="userInfo" style="margin-top:10px;font-size:14px;color:#444"></div>
  `;
  card.insertBefore(auth, card.querySelector('#themes'));

  document.getElementById('loginBtn').addEventListener('click', () => {
    const name = document.getElementById('usernameInput').value.trim();
    loginUser(name);
  });

  // try auto-login from previous session
  const saved = localStorage.getItem('kp_username');
  if (saved) {
    document.getElementById('usernameInput').value = saved;
    loginUser(saved);
  }
}

async function loginUser(username) {
  if (!username) return alert('Please enter a username');
  try {
    const res = await fetch(API_BASE + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    currentUser = data.user;
    localStorage.setItem('kp_username', username);
    renderUserInfo();
  } catch (err) {
    console.error(err);
    alert('Could not contact server. Make sure backend is running.');
  }
}

function renderUserInfo() {
  const info = document.getElementById('userInfo');
  if (!currentUser) {
    info.textContent = '';
    return;
  }
  let html = `<div><strong>Hi, ${currentUser.username}!</strong> Your games:</div>`;
  if (!currentUser.games || currentUser.games.length === 0) {
    html += '<div style="margin-top:6px;color:#777">No plays yet — start a puzzle!</div>';
  } else {
    html += '<ul style="text-align:left;margin:8px 0 0;padding-left:16px;">';
    currentUser.games.forEach(g => {
      html += `<li style="margin-bottom:6px"><strong>${g.gameName}</strong> — High: ${g.highScore} / Last: ${g.lastScore} / Played: ${g.timesPlayed}</li>`;
    });
    html += '</ul>';
  }
  info.innerHTML = html;
}

// Use the global sendScore (defined in script.js) to report scores.

// Initialize auth UI on load
window.addEventListener('DOMContentLoaded', () => initAuthUI());

// Drag & Drop logic
let dragged;

function dragStart(e) {
 dragged = e.target;
}

function dragOver(e) {
 e.preventDefault();
}

function drop(e) {
 e.preventDefault();
 if (dragged !== e.target) {
let tempBg = dragged.style.backgroundPosition;
 let tempCorrect = dragged.dataset.correctIndex;

 dragged.style.backgroundPosition = e.target.style.backgroundPosition;
 dragged.dataset.correctIndex = e.target.dataset.correctIndex;

e.target.style.backgroundPosition = tempBg;
    e.target.dataset.correctIndex = tempCorrect;
 }

 checkWin(e.target.parentNode);
}

// Check if puzzle solved
function checkWin(puzzleArea) {
 const pieces = puzzleArea.querySelectorAll(".piece");
 let solved = true;
 pieces.forEach((piece, index) => {
 if (parseInt(piece.dataset.correctIndex) !== index) {
 solved = false;
}
 });

 if (solved) {
 // 🎉 Confetti effect from both sides
 confetti({
 particleCount: 150,
 spread: 70,
 origin: { x: 0, y: 0.6 }
 });
 confetti({
 particleCount: 150,
 spread: 70,
 origin: { x: 1, y: 0.6 }
 });

// 🎉 Friendly message
 const msg = document.createElement("div");
 msg.textContent = "🎉 You completed this level!";
 msg.style.fontSize = "24px";
 msg.style.color = "#4CAF50";
 msg.style.marginTop = "15px";
 msg.style.fontWeight = "bold";
 msg.style.textAlign = "center";
 document.body.appendChild(msg);

 // Fade out message after 3 seconds
    setTimeout(() => {
    msg.remove();
   }, 3000);

 // Move to next level
 // compute a simple score for this level (higher level => higher score)
 const score = currentLevel * 100;
 // report score to backend (non-blocking)
 if (typeof window.sendScore === 'function') window.sendScore('Jigsaw', score);
 nextLevel(pieces[0].style.backgroundImage.slice(5, -2));
 }
}

// Next Level progression
function nextLevel(imageSrc) {
 currentLevel++;
 if (currentLevel > 5) {
 alert("🏆 You finished all 3 levels!");
 currentLevel = 3; // reset back to Easy
 }
 startPuzzle(imageSrc);
}
// This line already exists in your Jigsaw_puzzle.js:
if (typeof window.sendScore === 'function') window.sendScore('Jigsaw', score);
// To record a score, call updateScore('Jigsaw_puzzle', SOME_VALUE)
// after level completion. Ensure ../script.js is loaded in HTML.

