function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

const levelSets = [
    {
        questions: [
            { imgs: ["☀️", "🌻"], answer: "Sunflower", choices: ["Sunflower", "Raindrop", "Moonlight"] },
            { imgs: ["👟", "⚽"], answer: "Football", choices: ["Basketball", "Football", "Tennis"] },
            { imgs: ["🌧️", "🏹"], answer: "Rainbow", choices: ["Snowman", "Rainfall", "Rainbow"] },
            { imgs: ["🥞", "🎂"], answer: "Pancake", choices: ["Pancake", "Cupcake", "Milkshake"] },
            { imgs: ["🦷", "🖌️"], answer: "Toothbrush", choices: ["Hairbrush", "Toothbrush", "Paintbrush"] },
            { imgs: ["❄️", "⛄"], answer: "Snowman", choices: ["Snowman", "Rainman", "Fireman"] }
        ]
    },
    {
        questions: [
            { imgs: ["🧈", "🦋"], answer: "Butterfly", choices: ["Dragonfly", "Housefly", "Butterfly"] },
            { imgs: ["🌊", "🐚"], answer: "Seashell", choices: ["Seashell", "Seahorse", "Seafood"] },
            { imgs: ["🌙", "💡"], answer: "Moonlight", choices: ["Sunlight", "Moonlight", "Starlight"] },
            { imgs: ["🍎", "🥧"], answer: "Applepie", choices: ["Applepie", "Fruitcake", "Donut"] },
            { imgs: ["🔥", "👨"], answer: "Fireman", choices: ["Fireman", "Superman", "Batman", "Iceman"] },
            { imgs: ["⭐", "🐟"], answer: "Starfish", choices: ["Goldfish", "Starfish", "Shark", "Whale"] }
        ]
    },
    {
        questions: [
            { imgs: ["👂", "💍"], answer: "Earring", choices: ["Necklace", "Earring", "Bracelet", "Watch"] },
            { imgs: ["🍯", "🐝"], answer: "Honeybee", choices: ["Honeybee", "Butterfly", "Beetle", "Ant"] },
            { imgs: ["🌲", "🍎"], answer: "Pineapple", choices: ["Apple", "Pineapple", "Mango", "Pen"] },
            { imgs: ["I", "🍦"], answer: "Icecream", choices: ["Chocolate", "Icecream", "Candy", "Cake"] },
            { imgs: ["🏠", "💼"], answer: "Homework", choices: ["Homework", "Schoolwork", "Artwork", "Hardwork"] },
            { imgs: ["🎹", "🔑"], answer: "Keyboard", choices: ["Keyboard", "Keypad", "Keyring", "Keylock"] }
        ]
    },
    {
        questions: [
            { imgs: ["💧", "🍈"], answer: "Watermelon", choices: ["Watermelon", "Pineapple", "Mango", "Grape"] },
            { imgs: ["🥛", "🍫"], answer: "Milkchocolate", choices: ["Milkchocolate", "Juice", "Tea", "Coffee"] },
            { imgs: ["🎥", "🏠"], answer: "Cinema", choices: ["School", "Cinema", "Park", "Mall", "Zoo"] },
            { imgs: ["🌍", "🏀"], answer: "Earthball", choices: ["Football", "Earthball", "Cricket", "Tennis", "Golf"] },
            { imgs: ["🖐️", "👜"], answer: "Handbag", choices: ["Schoolbag", "Handbag", "Suitcase", "Wallet"] },
            { imgs: ["i", "🧊"], answer: "Icecube", choices: ["Icecube", "Water", "Steam", "Rain", "Snow"] }
        ]
    },
    {
        questions: [
            { imgs: ["🍔", "👑"], answer: "Burgerking", choices: ["Burgerking", "Pizza", "KFC", "Subway", "Domino"] },
            { imgs: ["pop", "🌽"], answer: "Popcorn", choices: ["Popcorn", "Corn", "Chips", "Nuts", "Cake"] },
            { imgs: ["🦇", "👨"], answer: "Batman", choices: ["Batman", "Superman", "Spiderman", "Ironman", "Hulk"] },
            { imgs: ["🌧️", "🧥"], answer: "Raincoat", choices: ["Raincoat", "Sweater", "Shirt", "Overcoat"] },
            { imgs: ["🐄", "👦"], answer: "Cowboy", choices: ["Cowboy", "Farmboy", "Superboy", "Playboy"] },
            { imgs: ["🔥", "wood"], answer: "Firewood", choices: ["Firewood", "Plywood", "Softwood", "Hardwood"] }
        ]
    }
];

let unlockedLevels = 1;
let currentIdx = 0;
let questionIdx = 0;
let sessionScore = 0;      // ← tracks score for this session

let shuffledLevelSets = levelSets.map(level => ({
    questions: [...level.questions].sort(() => Math.random() - 0.5)
}));
shuffle(shuffledLevelSets);

function initMenu() {
    document.getElementById('message-modal').classList.add('hidden');
    const menu = document.getElementById('level-menu');
    menu.innerHTML = "";
    for (let i = 1; i <= shuffledLevelSets.length; i++) {
        const btn = document.createElement('div');
        btn.className = `level-card ${i > unlockedLevels ? 'locked' : ''}`;
        btn.innerText = i > unlockedLevels ? "🔒" : i;
        if (i <= unlockedLevels) btn.onclick = () => startGame(i - 1);
        menu.appendChild(btn);
    }
}

function startGame(idx) {
    currentIdx = idx;
    questionIdx = 0;
    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    document.getElementById('level-title').innerText = "Level " + (currentIdx + 1);
    showQuestion();
}

function showQuestion() {
    const level = shuffledLevelSets[currentIdx];
    const q = level.questions[questionIdx];

    document.getElementById('level-title').innerText =
        `Level ${currentIdx + 1} — Q ${questionIdx + 1}/${level.questions.length}`;

    const box = document.getElementById('question-box');
    box.innerHTML = `<span>${q.imgs[0]}</span><span class="plus-sign">+</span><span>${q.imgs[1]}</span>`;

    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = "";
    const shuffledChoices = [...q.choices].sort(() => Math.random() - 0.5);
    shuffledChoices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerText = choice;
        btn.onclick = () => check(choice, q.answer);
        optionsBox.appendChild(btn);
    });
}

function check(choice, correct) {
    const modal    = document.getElementById('message-modal');
    const modalBtn = document.getElementById('modal-btn');
    modal.classList.remove('hidden');

    const isLastQuestion = questionIdx === shuffledLevelSets[currentIdx].questions.length - 1;
    const isLastLevel    = currentIdx  === shuffledLevelSets.length - 1;

    if (choice === correct) {
        // ── Add 10 points per correct answer ──
        sessionScore += 10;

        // ── Save to localStorage immediately (per-user via updateScore) ──
        if (typeof updateScore === 'function') {
            updateScore('connection', sessionScore);
        }

        document.getElementById('modal-title').innerText = "🌟 Super! 🌟";
        document.getElementById('modal-text').innerText  =
            `Correct! +10 pts 🎉  (Total: ${sessionScore})`;

        // unlock next level at last question
        if (isLastQuestion && currentIdx + 2 > unlockedLevels && unlockedLevels < shuffledLevelSets.length) {
            unlockedLevels = currentIdx + 2;
        }

        if (!isLastQuestion) {
            modalBtn.innerText = "Next Question ➡️";
        } else if (!isLastLevel) {
            modalBtn.innerText = "Next Level 🚀";
        } else {
            modalBtn.innerText = "Finish 🏆";
        }

        modalBtn.onclick = () => {
            modal.classList.add('hidden');
            if (!isLastQuestion) {
                questionIdx++;
                showQuestion();
            } else if (!isLastLevel) {
                startGame(currentIdx + 1);
            } else {
                // All levels done — final save already happened above
                alert(`🏆 You finished all levels! Final Score: ${sessionScore}`);
                showLevels();
            }
        };

    } else {
        document.getElementById('modal-title').innerText = "🧐 Oops!";
        document.getElementById('modal-text').innerText  = "Try again!";
        modalBtn.innerText = "Retry 🔄";
        modalBtn.onclick = () => modal.classList.add('hidden');
    }
}

function showLevels() {
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
    initMenu();
}

initMenu();