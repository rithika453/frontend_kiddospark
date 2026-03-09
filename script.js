document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       CHARACTER POSITIONING
       - On every page load, positions are RANDOMIZED
       - Login box zone is BLOCKED (centre of screen)
       - Characters are placed with collision detection so they
         NEVER overlap each other or the login box
    ============================================================ */

    const characters = document.querySelectorAll(".background-container img");

    if (characters.length > 0) {

        /* -- Character size (px) used for collision math -- */
        const CHAR_W = 120;
        const CHAR_H = 140;

        /* -- Viewport dimensions -- */
        const VW = window.innerWidth;
        const VH = window.innerHeight;

        const toXpct = px => (px / VW * 100).toFixed(2);
        const toYpct = px => (px / VH * 100).toFixed(2);

        /* -------------------------------------------------------
           BLOCKED ZONE — login box + generous margin
        ------------------------------------------------------- */
        const loginCX = VW / 2;
        const loginCY = VH / 2;
        const LOGIN_BLOCK = {
            x1: loginCX - 280,
            y1: loginCY - 230,
            x2: loginCX + 280,
            y2: loginCY + 230
        };

        /* -------------------------------------------------------
           SIDE ZONES — characters only go left or right of box
        ------------------------------------------------------- */
        const LEFT_MAX_X  = LOGIN_BLOCK.x1 - CHAR_W - 10;
        const RIGHT_MIN_X = LOGIN_BLOCK.x2 + 10;
        const RIGHT_MAX_X = VW - CHAR_W - 10;
        const MIN_Y       = 10;
        const MAX_Y       = VH - CHAR_H - 10;

        /* -------------------------------------------------------
           COLLISION CHECK — returns true if two rects overlap
        ------------------------------------------------------- */
        const PAD = 20;

        function overlaps(ax, ay, bx, by, bw, bh) {
            return !(
                ax + CHAR_W + PAD < bx      ||
                bx + bw     + PAD < ax      ||
                ay + CHAR_H + PAD < by      ||
                by + bh     + PAD < ay
            );
        }

        /* -------------------------------------------------------
           SHUFFLE array in place (Fisher-Yates)
        ------------------------------------------------------- */
        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        /* -------------------------------------------------------
           PLACE ALL CHARACTERS with collision detection
        ------------------------------------------------------- */
        const MAX_ATTEMPTS = 300;
        const placed = [];
        const charArray = shuffle(Array.from(characters));

        charArray.forEach((img, index) => {
            let ok = false;

            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {

                /* Alternate: even → left side, odd → right side */
                let x, y;
                if (index % 2 === 0) {
                    x = Math.random() * Math.max(1, LEFT_MAX_X);
                } else {
                    x = RIGHT_MIN_X + Math.random() * Math.max(1, RIGHT_MAX_X - RIGHT_MIN_X);
                }
                y = MIN_Y + Math.random() * Math.max(1, MAX_Y - MIN_Y);

                /* Reject if inside login box zone */
                if (overlaps(x, y,
                    LOGIN_BLOCK.x1, LOGIN_BLOCK.y1,
                    LOGIN_BLOCK.x2 - LOGIN_BLOCK.x1,
                    LOGIN_BLOCK.y2 - LOGIN_BLOCK.y1)) continue;

                /* Reject if overlaps another character */
                let clash = false;
                for (const p of placed) {
                    if (overlaps(x, y, p.x, p.y, CHAR_W, CHAR_H)) {
                        clash = true;
                        break;
                    }
                }
                if (clash) continue;

                /* Safe — apply position */
                img.style.left           = toXpct(x) + '%';
                img.style.top            = toYpct(y) + '%';
                img.style.animationDelay = (index * 0.35) + 's';
                img.style.opacity        = '1';
                placed.push({ x, y });
                ok = true;
                break;
            }

            /* No safe spot found — hide rather than overlap */
            if (!ok) img.style.display = 'none';
        });
    }

    /* ============================================================
       LOGIN LOGIC
    ============================================================ */
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

/* ============================================================
   GLOBAL NAVIGATION
============================================================ */
function goTrack()     { window.location.href = "track.html";     }
function goBack()      { window.location.href = "login.html";     }
function goChallenge() { window.location.href = "challenge.html"; }

/* ============================================================
   UNIVERSAL SCORE TRACKER
   Call this from any game when a round ends:
   updateScore('maze', 150);
   
   Keys saved to localStorage:
     <gameKey>_score   → best score ever
     <gameKey>_recent  → most recent score
     <gameKey>_date    → date last played
============================================================ */
function updateScore(gameKey, newScore) {
    const scoreKey  = gameKey + '_score';
    const recentKey = gameKey + '_recent';
    const dateKey   = gameKey + '_date';

    const prevBest = parseInt(localStorage.getItem(scoreKey) || '0');

    // Update best score only if new score is higher
    if (newScore > prevBest) {
        localStorage.setItem(scoreKey, newScore);
    }

    // Always update recent score and date
    localStorage.setItem(recentKey, newScore);
    localStorage.setItem(dateKey, new Date().toLocaleDateString());
}

/* Alias used by some games */
window.sendScore = updateScore;