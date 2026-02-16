const allLevels = [
    { imgs: ["☀️", "🌻"], answer: "Sunflower", choices: ["Sunflower", "Raindrop", "Moonlight"] },
    { imgs: ["👟", "⚽"], answer: "Football", choices: ["Basketball", "Football", "Tennis"] },
    { imgs: ["🌧️", "🏹"], answer: "Rainbow", choices: ["Snowman", "Rainfall", "Rainbow"] },
    { imgs: ["🥞", "🎂"], answer: "Pancake", choices: ["Pancake", "Cupcake", "Milkshake"] },
    { imgs: ["🦷", "🖌️"], answer: "Toothbrush", choices: ["Hairbrush", "Toothbrush", "Paintbrush"] },
    { imgs: ["❄️", "⛄"], answer: "Snowman", choices: ["Snowman", "Rainman", "Fireman"] },
    { imgs: ["🧈", "🦋"], answer: "Butterfly", choices: ["Dragonfly", "Housefly", "Butterfly"] },
    { imgs: ["🌊", "🐚"], answer: "Seashell", choices: ["Seashell", "Seahorse", "Seafood"] },
    { imgs: ["🌙", "💡"], answer: "Moonlight", choices: ["Sunlight", "Moonlight", "Starlight"] },
    { imgs: ["🍎", "🥧"], answer: "Applepie", choices: ["Applepie", "Fruitcake", "Donut"] },
    { imgs: ["🔥", "👨"], answer: "Fireman", choices: ["Fireman", "Superman", "Batman", "Iceman"] },
    { imgs: ["⭐", "🐟"], answer: "Starfish", choices: ["Goldfish", "Starfish", "Shark", "Whale"] },
    { imgs: ["👂", "💍"], answer: "Earring", choices: ["Necklace", "Earring", "Bracelet", "Watch"] },
    { imgs: ["🍯", "🐝"], answer: "Honeybee", choices: ["Honeybee", "Butterfly", "Beetle", "Ant"] },
    { imgs: ["🌲", "🍎"], answer: "Pineapple", choices: ["Apple", "Pineapple", "Mango", "Pen"] },
    { imgs: ["I", "🍦"], answer: "Icecream", choices: ["Chocolate", "Icecream", "Candy", "Cake"] },
    { imgs: ["🏠", "💼"], answer: "Homework", choices: ["Homework", "Schoolwork", "Artwork", "Hardwork"] },
    { imgs: ["🎹", "🔑"], answer: "Keyboard", choices: ["Keyboard", "Keypad", "Keyring", "Keylock"] },
    { imgs: ["💧", "🍈"], answer: "Watermelon", choices: ["Watermelon", "Pineapple", "Mango", "Grape"] },
    { imgs: ["🥛", "🍫"], answer: "Milkchocolate", choices: ["Milkchocolate", "Juice", "Tea", "Coffee"] },
    { imgs: ["🎥", "🏠"], answer: "Cinema", choices: ["School", "Cinema", "Park", "Mall"] },
    { imgs: ["🌍", "🏀"], answer: "Earthball", choices: ["Football", "Earthball", "Cricket", "Tennis"] },
    { imgs: ["🖐️", "👜"], answer: "Handbag", choices: ["Schoolbag", "Handbag", "Suitcase", "Wallet"] },
    { imgs: ["i", "🧊"], answer: "Icecube", choices: ["Icecube", "Water", "Steam", "Rain"] },
    { imgs: ["🍔", "👑"], answer: "Burgerking", choices: ["Burgerking", "Pizza", "KFC", "Subway"] },
    { imgs: ["pop", "🌽"], answer: "Popcorn", choices: ["Popcorn", "Corn", "Chips", "Nuts"] },
    { imgs: ["蝙", "👨"], answer: "Batman", choices: ["Batman", "Superman", "Spiderman", "Ironman"] },
    { imgs: ["🌧️", "🧥"], answer: "Raincoat", choices: ["Raincoat", "Sweater", "Shirt", "Overcoat"] },
    { imgs: ["🐄", "👦"], answer: "Cowboy", choices: ["Cowboy", "Farmboy", "Superboy", "Playboy"] },
    { imgs: ["🔥", "🪵"], answer: "Firewood", choices: ["Firewood", "Plywood", "Softwood", "Hardwood"] }
];

let unlockedLevels = 1; 
let currentIdx = 0;

function initMenu() {
    document.getElementById('message-modal').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
    document.getElementById('game-page').classList.add('hidden');
    
    const menu = document.getElementById('level-menu');
    menu.innerHTML = "";
    
    for (let i = 1; i <= allLevels.length; i++) {
        const btn = document.createElement('div');
        btn.className = `level-card ${i > unlockedLevels ? 'locked' : ''}`;
        btn.innerText = i > unlockedLevels ? "🔒" : i;
        if (i <= unlockedLevels) btn.onclick = () => startGame(i - 1);
        menu.appendChild(btn);
    }
}

function startGame(idx) {
    currentIdx = idx;
    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    const level = allLevels[currentIdx];
    document.getElementById('level-title').innerText = "Level " + (currentIdx + 1);
    
    const box = document.getElementById('question-box');
    box.innerHTML = `<span>${level.imgs[0]}</span> <span class="plus-sign">+</span> <span>${level.imgs[1]}</span>`;

    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = "";
    const choices = [...level.choices].sort(() => Math.random() - 0.5);
    
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerText = choice;
        btn.onclick = () => check(choice, level.answer);
        optionsBox.appendChild(btn);
    });
}

function check(choice, correct) {
    const modal = document.getElementById('message-modal');
    modal.classList.remove('hidden');

    if (choice === correct) {
        document.getElementById('modal-title').innerText = "🌟 Super! 🌟";
        document.getElementById('modal-text').innerText = "Correct Answer!";
        const btn = document.getElementById('modal-btn');
        btn.innerText = "Next Level";
        
        if (currentIdx + 2 > unlockedLevels) {
            unlockedLevels = currentIdx + 2;
        }

        btn.onclick = () => {
            modal.classList.add('hidden');
            if (currentIdx < allLevels.length - 1) {
                startGame(currentIdx + 1);
            } else {
                alert("🏆 You finished all levels!");
                showLevels();
            }
        };
    } else {
        document.getElementById('modal-title').innerText = "🧐 Oops! 🧐";
        document.getElementById('modal-text').innerText = "Try again!";
        const btn = document.getElementById('modal-btn');
        btn.innerText = "Retry";
        btn.onclick = () => modal.classList.add('hidden');
    }
}

function showLevels() {
    initMenu();
}

initMenu();