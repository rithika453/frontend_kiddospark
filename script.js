document.addEventListener("DOMContentLoaded", () => {

    const characters = document.querySelectorAll(".background-container img");

    if (characters.length > 0) {
        const CHAR_W = 120;
        const CHAR_H = 140;

        /* -- Viewport dimensions -- */
        const VW = window.innerWidth;
        const VH = window.innerHeight;

        const toXpct = px => (px / VW * 100).toFixed(2);
        const toYpct = px => (px / VH * 100).toFixed(2);
        const loginCX = VW / 2;
        const loginCY = VH / 2;
        const LOGIN_BLOCK = {
            x1: loginCX - 280,
            y1: loginCY - 230,
            x2: loginCX + 280,
            y2: loginCY + 230
        };
        const LEFT_MAX_X  = LOGIN_BLOCK.x1 - CHAR_W - 10;
        const RIGHT_MIN_X = LOGIN_BLOCK.x2 + 10;
        const RIGHT_MAX_X = VW - CHAR_W - 10;
        const MIN_Y       = 10;
        const MAX_Y       = VH - CHAR_H - 10;
        const PAD = 20;

        function overlaps(ax, ay, bx, by, bw, bh) {
            return !(
                ax + CHAR_W + PAD < bx      ||
                bx + bw     + PAD < ax      ||
                ay + CHAR_H + PAD < by      ||
                by + bh     + PAD < ay
            );
        }
        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

     
        const MAX_ATTEMPTS = 300;
        const placed = [];
        const charArray = shuffle(Array.from(characters));

        charArray.forEach((img, index) => {
            let ok = false;

            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {

                let x, y;
                if (index % 2 === 0) {
                    x = Math.random() * Math.max(1, LEFT_MAX_X);
                } else {
                    x = RIGHT_MIN_X + Math.random() * Math.max(1, RIGHT_MAX_X - RIGHT_MIN_X);
                }
                y = MIN_Y + Math.random() * Math.max(1, MAX_Y - MIN_Y);

                if (overlaps(x, y,
                    LOGIN_BLOCK.x1, LOGIN_BLOCK.y1,
                    LOGIN_BLOCK.x2 - LOGIN_BLOCK.x1,
                    LOGIN_BLOCK.y2 - LOGIN_BLOCK.y1)) continue;

                let clash = false;
                for (const p of placed) {
                    if (overlaps(x, y, p.x, p.y, CHAR_W, CHAR_H)) {
                        clash = true;
                        break;
                    }
                }
                if (clash) continue;

         
                img.style.left           = toXpct(x) + '%';
                img.style.top            = toYpct(y) + '%';
                img.style.animationDelay = (index * 0.35) + 's';
                img.style.opacity        = '1';
                placed.push({ x, y });
                ok = true;
                break;
            }

            if (!ok) img.style.display = 'none';
        });
    }
    const loginBtn  = document.getElementById("loginBtn");
    const userInput = document.getElementById("userName");

    if (loginBtn)  loginBtn.addEventListener("click", performLogin);
    if (userInput) userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") performLogin();
    });

    function performLogin() {
        const name = userInput.value.trim();
        if (name !== "") {
            localStorage.setItem("playerName", name);
            window.location.href = "game.html";
        } else {
            alert("Hey Champion! 🌟 Please enter your name to play!");
        }
    }
});

function goTrack()     { window.location.href = "track.html";     }
function goBack()      { window.location.href = "login.html";     }
function goChallenge() { window.location.href = "challenge.html"; }
function updateScore(gameKey, newScore) {
    const user = (localStorage.getItem('playerName') || 
                  localStorage.getItem('kp_username') || 'guest').toLowerCase().trim();
    const prefix    = user + '_' + gameKey;
    const scoreKey  = prefix + '_score';
    const recentKey = prefix + '_recent';
    const dateKey   = prefix + '_date';

    const prevBest = parseInt(localStorage.getItem(scoreKey) || '0');
    if (newScore > prevBest) {
        localStorage.setItem(scoreKey, newScore);
    }
    localStorage.setItem(recentKey, newScore);
    localStorage.setItem(dateKey, new Date().toLocaleDateString());
}
window.sendScore = updateScore;