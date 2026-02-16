const words = ["APPLE", "BANANA", "CAT", "DOG", "ELEPHANT", "FLOWER", "SUN"];
let currentWordIndex = 0;
let canvas = document.getElementById('colorCanvas');
let ctx = canvas.getContext('2d');
let drawingColor = 'black';

// Canvas drawing logic
let drawing = false;
canvas.onmousedown = () => drawing = true;
canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
canvas.onmousemove = (e) => {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawingColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
};

function setColor(color) {
    drawingColor = color;
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    document.getElementById('status').innerText = "Listening...";

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toUpperCase();
        const target = words[currentWordIndex];
        
        if (transcript.includes(target)) {
            document.getElementById('status').innerText = "✅ Correct! Now draw it!";
            document.getElementById('status').style.color = "green";
        } else {
            document.getElementById('status').innerText = "❌ Try again! You said: " + transcript;
            document.getElementById('status').style.color = "red";
        }
    };
    recognition.start();
}

function nextLevel() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    document.getElementById('wordDisplay').innerText = words[currentWordIndex];
    document.getElementById('status').innerText = "Click Speak and say the word";
    document.getElementById('status').style.color = "#636e72";
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear drawing
}

// Initial word
document.getElementById('wordDisplay').innerText = words[currentWordIndex];