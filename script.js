document.addEventListener("DOMContentLoaded", () => {
    /* 1. Character Distribution Logic */
    const characters = document.querySelectorAll(".background-container img");
    
    if (characters.length > 0) {
        characters.forEach((img, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            
            // Randomly place away from the center 30%-70% zone
            const xPos = side === "left" 
                ? (Math.random() * 25)              // Left: 0% to 25%
                : (Math.random() * 25 + 70);        // Right: 70% to 95%
                
            const yPos = Math.random() * 80 + 5;    // Height: 5% to 85%

            img.style.left = `${xPos}%`;
            img.style.top = `${yPos}%`;
            img.style.animationDelay = `${index * 0.5}s`;
            img.style.opacity = "1";
        });
    }

    /* 2. Login Logic */
    const loginBtn = document.getElementById("loginBtn");
    const userInput = document.getElementById("userName");

    if (loginBtn) {
        loginBtn.addEventListener("click", performLogin);
    }
    
    // Allow Enter key for login
    if (userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") performLogin();
        });
    }

    function performLogin() {
        const name = userInput.value.trim();
        if (name !== "") {
            localStorage.setItem("playerName", name); // Store name for track page
            window.location.href = "game.html";
        } else {
            alert("Hey Champion! 🌟 Please enter your name to play!");
        }
    }
});

/* 3. Global Navigation Functions */
function goTrack() { window.location.href = "track.html"; }
function goBack() { window.location.href = "login.html"; }
function goHome() { window.location.href = "game.html"; }
function goChallenge() { alert("🚀 Challenge Mode Coming Soon!"); }