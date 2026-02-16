let currentLevel = 1;
let moves = 0;
let gridSize = 11; 
let playerPos = { x: 1, y: 1 };
let targetPos = { x: gridSize - 2, y: gridSize - 2 };
let mazeLayout = [];

const themes = [
    { bg: "#a8e6cf", wall: "#2d5a27", path: "#f1f8e9", char: "🧚", goal: "💎" },
    { bg: "#ff8b94", wall: "#d63031", path: "#fff5f5", char: "🐱", goal: "🥛" },
    { bg: "#a29bfe", wall: "#6c5ce7", path: "#f1f0ff", char: "👽", goal: "🛸" },
    { bg: "#fab1a0", wall: "#e17055", path: "#fff3e0", char: "🐭", goal: "🧀" }
];

function goToMainHub() {
    window.location.href = "../game.html"; // Hub navigation
}

function applyTheme() {
    const themeIdx = Math.floor((currentLevel - 1) / 5) % themes.length;
    const theme = themes[themeIdx];
    document.documentElement.style.setProperty('--wall-color', theme.wall);
    document.documentElement.style.setProperty('--path-color', theme.path);
    return theme;
}

function generateMaze(size) {
    let maze = Array.from({ length: size }, () => Array(size).fill(1));
    function walk(x, y) {
        maze[y][x] = 0;
        const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => Math.random() - 0.5);
        for (let [dx, dy] of dirs) {
            let nx = x + dx, ny = y + dy;
            if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && maze[ny][nx] === 1) {
                maze[y + dy / 2][x + dx / 2] = 0;
                walk(nx, ny);
            }
        }
    }
    walk(1, 1);
    maze[targetPos.y][targetPos.x] = 0;
    return maze;
}

function drawMaze() {
    const theme = applyTheme();
    const container = document.getElementById('maze-container');
    
    // Cell size fixed at 28px to fill gap
    const cellSize = "28px";
    container.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize})`;
    container.innerHTML = '';

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + (mazeLayout[y][x] === 1 ? 'wall' : 'path');
            
            // Forced size for perfect grid
            cell.style.width = cellSize;
            cell.style.height = cellSize;
            
            if (x === playerPos.x && y === playerPos.y) cell.innerHTML = theme.char;
            else if (x === targetPos.x && y === targetPos.y) cell.innerHTML = theme.goal;
            
            container.appendChild(cell);
        }
    }
}

function move(dir) {
    let nx = playerPos.x, ny = playerPos.y;
    if (dir === 'up') ny--;
    if (dir === 'down') ny++;
    if (dir === 'left') nx--;
    if (dir === 'right') nx++;

    if (mazeLayout[ny] && mazeLayout[ny][nx] === 0) {
        playerPos.x = nx; playerPos.y = ny;
        moves++;
        document.getElementById('moveText').innerText = moves;
        drawMaze();
        if (playerPos.x === targetPos.x && playerPos.y === targetPos.y) {
            setTimeout(nextLevel, 200);
        }
    }
}

function nextLevel() {
    alert("✨ Level Complete!");
    currentLevel++;
    // gridSize limit to avoid scrolling
    if (currentLevel % 5 === 0 && gridSize < 15) gridSize += 2; 
    resetGame();
}

function resetGame() {
    moves = 0;
    playerPos = { x: 1, y: 1 };
    targetPos = { x: gridSize - 2, y: gridSize - 2 };
    document.getElementById('levelText').innerText = currentLevel;
    document.getElementById('moveText').innerText = moves;
    mazeLayout = generateMaze(gridSize);
    drawMaze();
}

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") move('up');
    if (e.key === "ArrowDown") move('down');
    if (e.key === "ArrowLeft") move('left');
    if (e.key === "ArrowRight") move('right');
});

resetGame();