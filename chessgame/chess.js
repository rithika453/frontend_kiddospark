const UNI = {
    'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔',
    'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚'
};

let board = [
    'r','n','b','q','k','b','n','r',
    'p','p','p','p','p','p','p','p',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    'P','P','P','P','P','P','P','P',
    'R','N','B','Q','K','B','N','R'
];

let turn = 'w', selected = null, highlights = new Set(), hintsLeft = 3, gameOver = false;
let mode = 'bot', side = 'white', flipped = false;
let winsCount = 0; // track wins in session

function setMode(m) {
    mode = m;
    document.querySelectorAll('[id^="mode-"]').forEach(b => b.classList.remove('setup-selected'));
    document.getElementById('mode-'+m).classList.add('setup-selected');
}

function setSide(s) {
    side = s;
    flipped = (s === 'black');
    document.querySelectorAll('[id^="side-"]').forEach(b => b.classList.remove('setup-selected'));
    document.getElementById('side-'+s).classList.add('setup-selected');
    document.getElementById('startBtn').style.display = 'inline-block';
}

function startGame() {
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    render();
    if (mode === 'bot' && side === 'black') {
        setTimeout(botPlay, 800);
    }
}

function render() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    for (let i = 0; i < 64; i++) {
        const idx = flipped ? 63 - i : i;
        const r = Math.floor(idx / 8), c = idx % 8;
        const tile = document.createElement('div');
        tile.className = `tile ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
        if (selected === idx) tile.classList.add('selected');
        if (highlights.has(idx)) tile.classList.add('highlight');
        if (board[idx]) {
            const span = document.createElement('span');
            span.textContent = UNI[board[idx]];
            span.className = `piece ${board[idx] === board[idx].toUpperCase() ? 'white' : 'black'}`;
            tile.appendChild(span);
        }
        tile.onclick = () => !gameOver && handleMove(idx);
        boardEl.appendChild(tile);
    }
}

function handleMove(idx) {
    const p = board[idx];
    const isPlayerTurn = (mode === 'p2p') || (side === 'white' && turn === 'w') || (side === 'black' && turn === 'b');

    if (selected !== null && highlights.has(idx)) {
        if (board[idx].toUpperCase() === 'K') {
            const winner = turn === 'w' ? "White" : "Black";

            // ── Determine if the human player won ──
            const playerWon = (mode === 'p2p') ||
                              (side === 'white' && turn === 'w') ||
                              (side === 'black' && turn === 'b');

            board[idx] = board[selected];
            board[selected] = '';
            gameOver = true;
            render();

            // ── Save score: win = 100, loss = 10 ──
            const score = playerWon ? 100 : 10;
            if (typeof updateScore === 'function') updateScore('chessgame', score);

            setTimeout(() => alert(`🎉 Game Over! ${winner} wins!`), 100);
            return;
        }
        board[idx] = board[selected];
        board[selected] = '';
        selected = null;
        highlights.clear();
        turn = (turn === 'w' ? 'b' : 'w');
        render();
        updateStatus();
        if (!gameOver && mode === 'bot') setTimeout(botPlay, 600);
        return;
    }

    if (isPlayerTurn && p && ((turn === 'w' && p === p.toUpperCase()) || (turn === 'b' && p === p.toLowerCase()))) {
        selected = idx;
        highlights = getLegalMoves(idx);
        render();
    }
}

function getLegalMoves(idx) {
    const moves = new Set();
    const p = board[idx].toUpperCase();
    const isWhite = board[idx] === board[idx].toUpperCase();
    const r = Math.floor(idx / 8), c = idx % 8;

    const addMove = (nr, nc) => {
        if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return false;
        const tIdx = nr * 8 + nc;
        if (!board[tIdx]) { moves.add(tIdx); return true; }
        if (isWhite !== (board[tIdx] === board[tIdx].toUpperCase())) moves.add(tIdx);
        return false;
    };

    if (p === 'P') {
        const dir = isWhite ? -1 : 1;
        if (board[(r + dir) * 8 + c] === '') {
            moves.add((r + dir) * 8 + c);
            if (r === (isWhite ? 6 : 1) && board[(r + 2 * dir) * 8 + c] === '') moves.add((r + 2 * dir) * 8 + c);
        }
        for (let dc of [-1, 1]) {
            const nc = c + dc;
            if (nc >= 0 && nc <= 7) {
                const target = board[(r + dir) * 8 + nc];
                if (target && isWhite !== (target === target.toUpperCase())) moves.add((r + dir) * 8 + nc);
            }
        }
    } else if (p === 'N') {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(m => addMove(r + m[0], c + m[1]));
    } else if (p === 'K') {
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(m => addMove(r + m[0], c + m[1]));
    } else {
        const dirs = (p==='R') ? [[0,1],[0,-1],[1,0],[-1,0]] : (p==='B') ? [[1,1],[1,-1],[-1,1],[-1,-1]] : [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
        dirs.forEach(d => {
            for (let i=1; i<8; i++) if (!addMove(r + d[0]*i, c + d[1]*i)) break;
        });
    }
    return moves;
}

function botPlay() {
    const isBotTurn = (side === 'white' && turn === 'b') || (side === 'black' && turn === 'w');
    if (!isBotTurn || gameOver) return;
    let possible = [];
    for (let i = 0; i < 64; i++) {
        const p = board[i];
        if (p && ((turn === 'w' && p === p.toUpperCase()) || (turn === 'b' && p === p.toLowerCase()))) {
            let m = getLegalMoves(i);
            m.forEach(t => possible.push({f: i, t: t}));
        }
    }
    if (possible.length > 0) {
        let move = possible[Math.floor(Math.random() * possible.length)];
        if (board[move.t].toUpperCase() === 'K') {
            board[move.t] = board[move.f]; board[move.f] = '';
            gameOver = true; render();

            // ── Bot wins → player score = 10 (participated) ──
            if (typeof updateScore === 'function') updateScore('chessgame', 10);

            setTimeout(() => alert("🚩 Bot Wins! Better luck next time."), 100);
            return;
        }
        board[move.t] = board[move.f]; board[move.f] = '';
        turn = (turn === 'w' ? 'b' : 'w'); render(); updateStatus();
    }
}

function updateStatus() {
    const isBotTurn = (mode === 'bot') && ((side === 'white' && turn === 'b') || (side === 'black' && turn === 'w'));
    document.getElementById('status').innerText = gameOver ? "🚩 Game Over!" : (isBotTurn ? "🤖 Bot thinking..." : "✨ Your Turn");
}

function useHint() {
    if (hintsLeft <= 0 || gameOver) return;
    let allMoves = [];
    for (let i = 0; i < 64; i++) {
        if (board[i] && (turn === 'w' ? board[i] === board[i].toUpperCase() : board[i] === board[i].toLowerCase())) {
            let m = getLegalMoves(i);
            if (m.size > 0) allMoves.push({from: i, moves: m});
        }
    }
    if (allMoves.length > 0) {
        let r = allMoves[Math.floor(Math.random() * allMoves.length)];
        selected = r.from; highlights = r.moves;
        hintsLeft--; document.getElementById('hintCount').innerText = hintsLeft;
        render();
    }
}