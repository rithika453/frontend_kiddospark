// --- Game setup flow ---
let gameMode = 'bot'; 
let playerSide = 'white'; 

// NEW: Character map for text pieces
const UNI = {
    // White Pieces (Uppercase)
    'P': '♙', // Pawn
    'R': '♖', // Rook
    'N': '♘', // Knight
    'B': '♗', // Bishop
    'Q': '♕', // Queen
    'K': '♔', // King
    // Black Pieces (Lowercase)
    'p': '♟', 
    'r': '♜',
    'n': '♞',
    'b': '♝',
    'q': '♛',
    'k': '♚'
};


// Helper function to handle button selection state
function selectButton(buttonId, groupSelector) {
    const group = document.querySelectorAll(groupSelector);
    group.forEach(btn => btn.classList.remove('setup-selected'));
    const button = document.getElementById(buttonId);
    if (button) button.classList.add('setup-selected');
}

function setMode(mode) {
    gameMode = mode;
    // Apply visual state
    selectButton(`mode-${mode}`, '#setupScreen button:nth-child(2), #setupScreen button:nth-child(3)');
}

function setSide(side) {
    playerSide = side;
    
    // 1. Apply visual state immediately to confirm the click
    selectButton(`side-${side}`, '#setupScreen button:nth-child(5), #setupScreen button:nth-child(6), #setupScreen button:nth-child(7)');
    
    // 2. Use setTimeout to delay the screen transition by 200ms.
    setTimeout(() => {
        document.getElementById('setupScreen').style.display = 'none';
        document.getElementById('rulesScreen').style.display = 'flex';
    }, 200); 
}

// Function to set the initial visual style for default selections on load
function initializeSetupStyles() {
    // FIX: Corrected the quotes in the function calls
    selectButton(`mode-${gameMode}`, '#setupScreen button:nth-child(2), #setupScreen button:nth-child(3)');
    selectButton(`side-${playerSide}`, '#setupScreen button:nth-child(5), #setupScreen button:nth-child(6), #setupScreen button:nth-child(7)');
}

function startGame() {
    document.getElementById('rulesScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex'; 
    reset(); // initialize board
    
    if (playerSide === 'random') {
        // ENHANCEMENT: Random side logic consolidated and set playerSide definitively
        playerSide = Math.random() < 0.5 ? 'white' : 'black';
    }
    
    if (playerSide === 'black') {
        flipped = true;
        render();
        if (gameMode === 'bot') setTimeout(botMove, 500);
    } else {
        flipped = false;
        render();
    }
    
    // ENHANCEMENT: Display the final choice after random selection
    statusEl.textContent = `${playerSide === 'white' ? 'You start as White!' : 'You start as Black!'} White to move.`;
    
    // NEW FEATURE: Render coordinates after the board is initialized
    renderCoordinates();
}

// Add an event listener to call the new initializer when the page loads
document.addEventListener('DOMContentLoaded', initializeSetupStyles);


// --- Chess engine ---
const START = [
    'r','n','b','q','k','b','n','r',
    'p','p','p','p','p','p','p','p',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    'P','P','P','P','P','P','P','P',
    'R','N','B','Q','K','B','N','R'
];

let board = [...START];
let turn = 'w';
let selected = null;
let highlights = new Set();
let captures = new Set();
let flipped = false;
let gameOver = false;

// Castling flags
let whiteKingMoved = false;
let whiteRookAMoved = false; // a1
let whiteRookHMoved = false; // h1
let blackKingMoved = false;
let blackRookAMoved = false; // a8
let blackRookHMoved = false; // h8

// ENHANCEMENT: Add global variables for last move tracking
let lastMoveFrom = -1;
let lastMoveTo = -1;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const flipBtn = document.getElementById('flipBtn');
// NEW FEATURE: Coordinate elements
const ranksEl = document.getElementById('ranks');
const filesEl = document.getElementById('files');


resetBtn.addEventListener('click', () => {
    reset();
    // If user chose black vs bot, let bot start
    if (gameMode === 'bot' && playerSide === 'black') setTimeout(botMove, 500);
});

flipBtn.addEventListener('click', () => {
    flipped = !flipped;
    render();
    // NEW FEATURE: Re-render coordinates on flip
    renderCoordinates();
});

// Helpers
const idxToRC = (i) => ({ r: Math.floor(i / 8), c: i % 8 });
const rcToIdx = (r, c) => r * 8 + c;
const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
const isWhite = (p) => p && p === p.toUpperCase();
const pieceColor = (p) => (isWhite(p) ? 'w' : 'b');
// ENHANCEMENT: Helper to check if it's the player's turn (only relevant for bot mode)
const isPlayerTurn = () => gameMode === 'user' || (gameMode === 'bot' && turn === (playerSide === 'white' ? 'w' : 'b'));


// NEW FEATURE: Coordinate Rendering
function renderCoordinates() {
    ranksEl.innerHTML = '';
    filesEl.innerHTML = '';
    
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    // Ranks (1-8)
    const rankOrder = flipped ? [...ranks] : [...ranks].reverse();
    rankOrder.forEach(r => {
        const span = document.createElement('span');
        span.textContent = r;
        ranksEl.appendChild(span);
    });

    // Files (A-H)
    const fileOrder = flipped ? [...files].reverse() : [...files];
    fileOrder.forEach(f => {
        const span = document.createElement('span');
        span.textContent = f;
        filesEl.appendChild(span);
    });
}


function render() {
    boardEl.innerHTML = '';
    // ENHANCEMENT: The order array now correctly maps model to visual index for both orientations
    const order = [...Array(64).keys()];
    
    order.forEach((modelIndex) => {
        // Determine the visual position (row/col) based on current orientation
        const visualR = flipped ? 7 - Math.floor(modelIndex / 8) : Math.floor(modelIndex / 8);
        const visualC = flipped ? 7 - (modelIndex % 8) : modelIndex % 8;
        const r = visualR;
        const c = visualC;

        const tile = document.createElement('div');
        // ENHANCEMENT: Use visual position (r, c) for color calculation
        tile.className = 'tile ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
        tile.dataset.index = modelIndex;

        if (selected === modelIndex) tile.classList.add('selected');
        if (highlights.has(modelIndex)) tile.classList.add('highlight');
        if (captures.has(modelIndex)) tile.classList.add('capture');
        // ENHANCEMENT: Highlight the last move
        if (modelIndex === lastMoveFrom || modelIndex === lastMoveTo) {
            tile.classList.add('last-move');
        }

        const p = board[modelIndex];
        if (p) {
            const span = document.createElement('span');
            span.textContent = UNI[p]; 
            span.className = `piece ${pieceColor(p) === 'w' ? 'white' : 'black'}`;
            tile.appendChild(span);
        }

        tile.addEventListener('click', onTileClick);
        boardEl.appendChild(tile);
    });
}

function onTileClick(e) {
    // ENHANCEMENT: Prevent moves if it's the bot's turn
    if (gameOver || (gameMode === 'bot' && turn !== (playerSide === 'white' ? 'w' : 'b'))) return; 
    
    const idx = Number(e.currentTarget.dataset.index);
    const p = board[idx];

    // Execute a highlighted move
    if (selected !== null && (highlights.has(idx) || captures.has(idx))) {
        executeMove(selected, idx);
        clearSelection();
        render();

        // Bot move if enabled and it's bot's turn
        if (!gameOver && gameMode === 'bot' && turn !== (playerSide === 'white' ? 'w' : 'b')) {
            setTimeout(botMove, 500);
        }
        return;
    }

    // FIX: Only check if the piece belongs to the current 'turn' (w or b).
    const pieceIsTurnColor = pieceColor(p) === turn;

    if (p && pieceIsTurnColor) {
        selected = idx;
        // ENHANCEMENT: Clear highlights/captures before calculating new ones
        clearSelection(); 
        selected = idx;
        const { moves, caps } = legalMovesFor(idx, board);
        highlights = new Set(moves);
        captures = new Set(caps);
        render();
        return;
    }

    // Otherwise clear selection
    clearSelection();
    render();
}

function clearSelection() {
    selected = null;
    highlights.clear();
    captures.clear();
}

function executeMove(from, to) {
    const p = board[from];
    const target = board[to];

    // King capture ends game immediately (simpler rule, but not standard checkmate)
    if (target && target.toLowerCase() === 'k') {
        board[to] = p;
        board[from] = '';
        gameOver = true;
        statusEl.textContent = `${isWhite(p) ? 'White' : 'Black'} wins. Opponent king captured. 👑`;
        return;
    }

    // ENHANCEMENT: Update last move for UI
    lastMoveFrom = from;
    lastMoveTo = to;
    
    // Track rook/king movement for castling legality
    trackCastleFlags(from, p);

    // Pawn promotion (auto queen)
    const { r: toR } = idxToRC(to);
    if (p === 'P' && toR === 0) {
        board[to] = 'Q'; board[from] = '';
        statusEl.textContent = `${isWhite(p) ? 'White' : 'Black'} promotes to Queen! 👸`;
    } else if (p === 'p' && toR === 7) {
        board[to] = 'q'; board[from] = '';
        statusEl.textContent = `${isWhite(p) ? 'White' : 'Black'} promotes to Queen! 👸`;
    } else {
        board[to] = p; board[from] = '';
    }

    // If castling move, move the rook accordingly
    handleCastleRookMove(from, to, p);

    // Switch turn and update status
    turn = (turn === 'w') ? 'b' : 'w';
    updateStatus();
}

function updateStatus() {
    if (gameOver) return;
    const inCheck = isKingInCheck(turn, board);
    
    // ENHANCEMENT: Correctly determine checkmate/stalemate
    if (noLegalMoves(turn, board)) {
        if (inCheck) {
            statusEl.textContent = `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins! 🏆`;
        } else {
            statusEl.textContent = `Stalemate. Game is a draw. 🤝`;
        }
        gameOver = true;
        return;
    }
    
    const turnColor = turn === 'w' ? 'White' : 'Black';
    if (inCheck) {
        statusEl.textContent = `${turnColor} to move. King in check! 🚨`;
    } else {
        statusEl.textContent = `${turnColor} to move.`;
    }
}

function trackCastleFlags(from, p) {
    if (p === 'K') whiteKingMoved = true;
    if (p === 'R') {
        const { r, c } = idxToRC(from);
        if (r === 7 && c === 0) whiteRookAMoved = true;
        if (r === 7 && c === 7) whiteRookHMoved = true;
    }
    if (p === 'k') blackKingMoved = true;
    if (p === 'r') {
        const { r, c } = idxToRC(from);
        if (r === 0 && c === 0) blackRookAMoved = true;
        if (r === 0 && c === 7) blackRookHMoved = true;
    }
}

function handleCastleRookMove(from, to, p) {
    // Index mapping: 0=a8 ... 63=h1, e1=60, g1=62, c1=58; e8=4, g8=6, c8=2
    if (p === 'K' && from === 60) {
        if (to === 62) { board[61] = 'R'; board[63] = ''; whiteRookHMoved = true; } // Kingside
        else if (to === 58) { board[59] = 'R'; board[56] = ''; whiteRookAMoved = true; } // Queenside
    }
    if (p === 'k' && from === 4) {
        if (to === 6) { board[5] = 'r'; board[7] = ''; blackRookHMoved = true; } // Kingside
        else if (to === 2) { board[3] = 'r'; board[0] = ''; blackRookAMoved = true; } // Queenside
    }
}

// Legal moves for a piece at idx in state
function legalMovesFor(idx, state) {
    const p = state[idx];
    if (!p) return { moves: [], caps: [] };
    const color = pieceColor(p);
    const { r, c } = idxToRC(idx);
    const moves = [];
    const caps = [];

    function simulateAndPush(destIdx) {
        const tmp = [...state];
        const captured = tmp[destIdx];
        
        // Simulate pawn promotion for legality check
        const { r: toR } = idxToRC(destIdx);
        if (p === 'P' && toR === 0) tmp[destIdx] = 'Q'; 
        else if (p === 'p' && toR === 7) tmp[destIdx] = 'q';
        else tmp[destIdx] = p;
        tmp[idx] = '';
        
        const simTmp = handleCastleSim(idx, destIdx, p, tmp);
        
        if (!isKingInCheck(color, simTmp)) {
            if (captured) caps.push(destIdx); else moves.push(destIdx);
        }
    }
    
    // Pawn
    if (p === 'P' || p === 'p') {
        const dir = p === 'P' ? -1 : 1;
        const startRow = p === 'P' ? 6 : 1;

        // Forward 1
        if (inBounds(r + dir, c) && !state[rcToIdx(r + dir, c)]) {
            simulateAndPush(rcToIdx(r + dir, c));
            // Forward 2 from start
            if (r === startRow && !state[rcToIdx(r + 2*dir, c)]) {
                simulateAndPush(rcToIdx(r + 2*dir, c));
            }
        }
        // Diagonal captures
        for (const dc of [-1, 1]) {
            const nr = r + dir, nc = c + dc;
            if (!inBounds(nr, nc)) continue;
            const di = rcToIdx(nr, nc);
            if (state[di] && pieceColor(state[di]) !== color) simulateAndPush(di);
        }
        // En passant omitted
    }

    // Knight
    if (p.toLowerCase() === 'n') {
        const steps = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
        for (const [dr, dc] of steps) {
            const nr = r + dr, nc = c + dc;
            if (!inBounds(nr, nc)) continue;
            const di = rcToIdx(nr, nc);
            if (!state[di] || pieceColor(state[di]) !== color) simulateAndPush(di);
        }
    }

    // Bishop/Rook/Queen
    const isB = p.toLowerCase() === 'b';
    const isR = p.toLowerCase() === 'r';
    const isQ = p.toLowerCase() === 'q';
    if (isB || isR || isQ) {
        const dirs = [];
        if (isB || isQ) dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
        if (isR || isQ) dirs.push([1,0],[-1,0],[0,1],[0,-1]);
        for (const [dr, dc] of dirs) {
            let nr = r + dr, nc = c + dc;
            while (inBounds(nr, nc)) {
                const di = rcToIdx(nr, nc);
                if (!state[di]) {
                    simulateAndPush(di);
                } else {
                    if (pieceColor(state[di]) !== color) simulateAndPush(di);
                    break;
                }
                nr += dr; nc += dc;
            }
        }
    }

    // King + castling
    if (p.toLowerCase() === 'k') {
        const steps = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
        for (const [dr, dc] of steps) {
            const nr = r + dr, nc = c + dc;
            if (!inBounds(nr, nc)) continue;
            const di = rcToIdx(nr, nc);
            if (!state[di] || pieceColor(state[di]) !== color) simulateAndPush(di);
        }
        // Castling legality check:
        if (p === 'K' && idx === 60 && !whiteKingMoved) {
            // Kingside (O-O)
            if (!state[61] && !state[62] && state[63] === 'R' && !whiteRookHMoved) {
                if (!isSquareAttackedState(60, 'w', state) &&
                    !isSquareAttackedState(61, 'w', state) &&
                    !isSquareAttackedState(62, 'w', state)) simulateAndPush(62);
            }
            // Queenside (O-O-O)
            if (!state[59] && !state[58] && !state[57] && state[56] === 'R' && !whiteRookAMoved) {
                if (!isSquareAttackedState(60, 'w', state) &&
                    !isSquareAttackedState(59, 'w', state) &&
                    !isSquareAttackedState(58, 'w', state)) simulateAndPush(58);
            }
        }
        if (p === 'k' && idx === 4 && !blackKingMoved) {
            // Kingside (O-O)
            if (!state[5] && !state[6] && state[7] === 'r' && !blackRookHMoved) {
                if (!isSquareAttackedState(4, 'b', state) &&
                    !isSquareAttackedState(5, 'b', state) &&
                    !isSquareAttackedState(6, 'b', state)) simulateAndPush(6);
            }
            // Queenside (O-O-O)
            if (!state[3] && !state[2] && !state[1] && state[0] === 'r' && !blackRookAMoved) {
                if (!isSquareAttackedState(4, 'b', state) &&
                    !isSquareAttackedState(3, 'b', state) &&
                    !isSquareAttackedState(2, 'b', state)) simulateAndPush(2);
            }
        }
    }

    // Unique lists
    const uniqMoves = [];
    const uniqCaps = [];
    const all = [...new Set([...moves, ...caps])];
    for (const d of all) {
        if (state[d] && state[d].toLowerCase() !== 'k') uniqCaps.push(d); else if (!state[d]) uniqMoves.push(d);
    }
    return { moves: uniqMoves, caps: uniqCaps };
}

function handleCastleSim(from, to, p, tmp) {
    const arr = [...tmp];
    if (p === 'K' && from === 60) {
        if (to === 62) { arr[61] = 'R'; arr[63] = ''; }
        else if (to === 58) { arr[59] = 'R'; arr[56] = ''; }
    }
    if (p === 'k' && from === 4) {
        if (to === 6) { arr[5] = 'r'; arr[7] = ''; }
        else if (to === 2) { arr[3] = 'r'; arr[0] = ''; }
    }
    return arr;
}

function isKingInCheck(color, state) {
    const king = color === 'w' ? 'K' : 'k';
    let kIdx = -1;
    for (let i = 0; i < 64; i++) if (state[i] === king) { kIdx = i; break; }
    if (kIdx === -1) return false; // king captured already
    return isSquareAttackedState(kIdx, color, state);
}

function isSquareAttackedState(idx, color, state) {
    const opp = color === 'w' ? 'b' : 'w';
    const { r, c } = idxToRC(idx);

    // Pawn attacks
    const pawnDir = opp === 'w' ? -1 : 1;
    for (const dc of [-1, 1]) {
        const nr = r + pawnDir, nc = c + dc;
        if (inBounds(nr, nc)) {
            const p = state[rcToIdx(nr, nc)];
            if (opp === 'w' && p === 'P') return true;
            if (opp === 'b' && p === 'p') return true;
        }
    }
    // Knight
    const kSteps = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    for (const [dr, dc] of kSteps) {
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc)) {
            const p = state[rcToIdx(nr, nc)];
            if (opp === 'w' && p === 'N') return true;
            if (opp === 'b' && p === 'n') return true;
        }
    }
    // Sliding pieces
    const dirs = [
        [1,0],[-1,0],[0,1],[0,-1],
        [1,1],[1,-1],[-1,1],[-1,-1]
    ];
    for (let d = 0; d < dirs.length; d++) {
        const [dr, dc] = dirs[d];
        let nr = r + dr, nc = c + dc;
        while (inBounds(nr, nc)) {
            const p = state[rcToIdx(nr, nc)];
            if (p) {
                if (opp === 'w') {
                    if ((d < 4 && p === 'R') || (d >= 4 && p === 'B') || p === 'Q') return true;
                } else {
                    if ((d < 4 && p === 'r') || (d >= 4 && p === 'b') || p === 'q') return true;
                }
                break;
            }
            nr += dr; nc += dc;
        }
    }
    // King adjacency
    const adj = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    for (const [dr, dc] of adj) {
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc)) {
            const p = state[rcToIdx(nr, nc)];
            if (opp === 'w' && p === 'K') return true;
            if (opp === 'b' && p === 'k') return true;
        }
    }
    return false;
}

function noLegalMoves(color, state) {
    for (let i = 0; i < 64; i++) {
        const p = state[i];
        if (!p) continue;
        if (pieceColor(p) !== color) continue;
        const { moves, caps } = legalMovesFor(i, state);
        if (moves.length || caps.length) return false;
    }
    return true;
}

// Bot: simple heuristic to prefer captures and checks
function botMove() {
    if (gameOver || turn !== 'b' || gameMode !== 'bot') return;

    const movesList = [];
    for (let i = 0; i < 64; i++) {
        const p = board[i];
        if (!p || pieceColor(p) !== 'b') continue;
        const { moves, caps } = legalMovesFor(i, board);
        for (const d of moves) {
            let score = 0.5; // Small score for non-capture moves
            // ENHANCEMENT: Check for promotion
            if (p === 'p' && idxToRC(d).r === 7) score += 5; 
            movesList.push({ from: i, to: d, score });
        }
        for (const d of caps) {
            const captured = board[d];
            let score = 1;
            // prioritize capturing higher value pieces
            const val = { 'P':1,'N':3,'B':3,'R':5,'Q':9,'K':100 }; // Use uppercase for white pieces
            score += val[captured] || 0;
            
            // check if move gives check
            const tmp = [...board];
            tmp[d] = p; tmp[i] = '';
            // ENHANCEMENT: Simulate pawn promotion for bot score calculation
            if (p === 'p' && idxToRC(d).r === 7) tmp[d] = 'q';
            
            const sim = handleCastleSim(i, d, p, tmp);
            if (isKingInCheck('w', sim)) score += 2;
            movesList.push({ from: i, to: d, score });
        }
    }

    if (movesList.length === 0) return;

    // Pick best score, tie-break randomly
    const maxScore = Math.max(...movesList.map(m => m.score));
    const candidates = movesList.filter(m => m.score === maxScore);
    const choice = candidates[Math.floor(Math.random() * candidates.length)];

    executeMove(choice.from, choice.to);
    render();
}

function reset() {
    board = [...START];
    turn = 'w';
    selected = null;
    highlights.clear();
    captures.clear();
    
    // ENHANCEMENT: Reset last move highlights
    lastMoveFrom = -1;
    lastMoveTo = -1;
    
    flipped = (playerSide === 'black'); // keep orientation after reset
    gameOver = false;

    whiteKingMoved = false;
    whiteRookAMoved = false;
    whiteRookHMoved = false;
    blackKingMoved = false;
    blackRookAMoved = false;
    blackRookHMoved = false;

    statusEl.textContent = 'White to move.';
    render();
    renderCoordinates(); // Renders coordinates correctly on reset
}