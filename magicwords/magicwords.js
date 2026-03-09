const words = [
  // paths are relative to magicwords.html (same directory), so omit the extra "magicwords/" folder
  { word: "apple", image: "images/apple.jpg" },
  { word: "ball", image: "images/ball.jpg" },
  { word: "carrot", image: "images/carrot.jpg" },
  { word: "duck", image: "images/duck.jpg" },
  { word: "elephant", image: "images/elephant.jpg" },
  { word: "fish", image: "images/fish.jpg" },
  // the file is named "grape.jpg" (singular) so leave the word plural but the image path singular
  { word: "grapes", image: "images/grape.jpg" },
  { word: "hat", image: "images/hat.jpg" },
  { word: "ice cream", image: "images/icecream.jpg" },
  { word: "kite", image: "images/kite.jpg" },
  { word: "tree", image: "images/tree.jpg" },
  // the actual image filename has a double "l" at the end
  { word: "umbrella", image: "images/umbralla.jpg" }
];

let currentLevel = 0;
let currentColor = "red";

// two-layer setup: imageCanvas holds the picture, colorCanvas is for drawing
const imageCanvas = document.getElementById("imageCanvas");
const imageCtx = imageCanvas.getContext("2d");
const canvas = document.getElementById("colorCanvas");
const ctx = canvas.getContext("2d");
const img = new Image();

function loadWord() {
  document.getElementById("wordDisplay").innerText =
    words[currentLevel].word.toUpperCase();

  // clear both layers
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  document.getElementById("status").innerText =
    "Click Speak and say the word";
}

loadWord();

/* 🎤 VOICE */
function startListening() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Use Google Chrome for voice recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onstart = () => {
    document.getElementById("status").innerText = "Listening...";
  };

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript.toLowerCase().trim();

    console.log("Spoken:", spoken);

    if (spoken.includes(words[currentLevel].word)) {
      showImage();
    } else {
      document.getElementById("status").innerText =
        "❌ Wrong word! Try again.";
    }
  };
}

/* 🖼 IMAGE */
function showImage() {
  img.src = words[currentLevel].image;

  img.onload = () => {
    // draw on the background layer only
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
    document.getElementById("status").innerText =
      "🎨 Color the image!";
  };

  img.onerror = () => {
    document.getElementById("status").innerText =
      "❌ Image not found!";
  };
}

/* 🎨 COLOR */
function setColor(color) {
  // eraser uses special flag so drawing code can clear instead of fill
  if (color === 'eraser') {
    currentColor = null;
  } else {
    currentColor = color;
  }
}

let painting = false;

canvas.addEventListener("mousedown", () => painting = true);
canvas.addEventListener("mouseup", () => painting = false);
canvas.addEventListener("mouseleave", () => painting = false);

canvas.addEventListener("mousemove", (e) => {
  if (!painting) return;

  if (currentColor === null) {
    // erase by clearing a small circle
    ctx.clearRect(e.offsetX - 6, e.offsetY - 6, 12, 12);
  } else {
    ctx.fillStyle = currentColor;
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 6, 0, Math.PI * 2);
    ctx.fill();
  }
});

/* ➡ NEXT LEVEL */
function nextLevel() {
  if (currentLevel < words.length - 1) {
    currentLevel++;
    loadWord();
  } else {
    // finished all levels — record progress (levels completed)
    if (typeof updateScore === 'function') updateScore('magicwords', currentLevel + 1);
    alert("🎉 Congratulations! You completed all levels!");
    currentLevel = 0;
    loadWord();
  }
}
if (typeof updateScore === 'function') updateScore('magicwords', score);
