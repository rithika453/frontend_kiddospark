// // const levels = [
// //     { id: 1, imgs: ["☀️", "🌻"], answer: "Sunflower", choices: ["Sunflower", "Rainfall", "Moonlight"] },
// //     { id: 2, imgs: ["👟", "⚽"], answer: "Football", choices: ["Basketball", "Football", "Tennis"] },
// //     { id: 3, imgs: ["🌧️", "🏹"], answer: "Rainbow", choices: ["Rainbow", "Snowman", "Rainfall"] },
// //     { id: 4, imgs: ["🥞", "🎂"], answer: "Pancake", choices: ["Cupcake", "Pancake", "Milkshake"] },
// //     { id: 5, imgs: ["🦷", "🪥"], answer: "Toothbrush", choices: ["Hairbrush", "Toothbrush", "Paintbrush"] },
// //     { id: 6, imgs: ["❄️", "⛄"], answer: "Snowman", choices: ["Snowman", "Fireman", "Rainman"] },
// //     { id: 7, imgs: ["🦋", "🌹"], answer: "Butterfly", choices: ["Butterfly", "Dragonfly", "Housefly"] },
// //     { id: 8, imgs: ["🌊", "🐚"], answer: "Seashell", choices: ["Seashell", "Seahorse", "Starfish"] },
// //     { id: 9, imgs: ["🌙", "💡"], answer: "Moonlight", choices: ["Sunlight", "Moonlight", "Torch"] },
// //     { id: 10, imgs: ["🍎", "🥧"], answer: "Applepie", choices: ["Applepie", "Donut", "Fruitcake"] }
// // ];

// // let unlockedLevels = parseInt(localStorage.getItem('kidGameProgress')) || 1;
// // let currentIdx = 0;

// // function initMenu() {
// //     const menu = document.getElementById('level-menu');
// //     menu.innerHTML = "";
// //     for (let i = 1; i <= 10; i++) {
// //         const card = document.createElement('div');
// //         card.className = `level-card ${i > unlockedLevels ? 'locked' : ''}`;
// //         card.innerText = i > unlockedLevels ? "🔒" : "Level " + i;
// //         if (i <= unlockedLevels) card.onclick = () => startGame(i - 1);
// //         menu.appendChild(card);
// //     }
// // }

// // function startGame(idx) {
// //     currentIdx = idx;
// //     document.getElementById('level-page').classList.add('hidden');
// //     document.getElementById('game-page').classList.remove('hidden');
    
// //     const level = levels[currentIdx];
// //     document.getElementById('level-title').innerText = "Level " + (currentIdx + 1);
// //     document.getElementById('question-box').innerHTML = `<span>${level.imgs[0]}</span> <span>+</span> <span>${level.imgs[1]}</span>`;

// //     const optionsBox = document.getElementById('options-container');
// //     optionsBox.innerHTML = "";
    
// //     // Shuffling choices for fun
// //     const shuffled = [...level.choices].sort(() => Math.random() - 0.5);
    
// //     shuffled.forEach(choice => {
// //         const btn = document.createElement('button');
// //         btn.className = "option-btn";
// //         btn.innerText = choice;
// //         btn.onclick = () => checkAnswer(choice, level.answer);
// //         optionsBox.appendChild(btn);
// //     });
// // }

// // function checkAnswer(userChoice, correct) {
// //     const modal = document.getElementById('message-modal');
// //     const modalTitle = document.getElementById('modal-title');
// //     const modalText = document.getElementById('modal-text');
// //     const modalBtn = document.getElementById('modal-btn');

// //     modal.classList.remove('hidden');

// //     if (userChoice === correct) {
// //         modalTitle.innerText = "🌟 Semma! 🌟";
// //         modalText.innerText = "Correct Answer! Adutha level pohlama?";
// //         modalBtn.innerText = "Next Level";
// //         modalBtn.onclick = () => {
// //             modal.classList.add('hidden');
// //             if (currentIdx < 9) {
// //                 // Unlock logic
// //                 if (currentIdx + 2 > unlockedLevels) {
// //                     unlockedLevels = currentIdx + 2;
// //                     localStorage.setItem('kidGameProgress', unlockedLevels);
// //                 }
// //                 startGame(currentIdx + 1); // Goes to next level
// //             } else {
// //                 alert("🏆 Super! Ellaa level-um mudichitinga!");
// //                 showLevels();
// //             }
// //         };
// //     } else {
// //         modalTitle.innerText = "🧐 Oops! 🧐";
// //         modalText.innerText = "Thappa pochu! Thirumba try pannunga.";
// //         modalBtn.innerText = "Try Again";
// //         modalBtn.onclick = () => modal.classList.add('hidden');
// //     }
// // }

// // function showLevels() {
// //     document.getElementById('game-page').classList.add('hidden');
// //     document.getElementById('level-page').classList.remove('hidden');
// //     initMenu();
// // }

// // initMenu();
// // 10 Kids-friendly Levels
// const allLevels = [
//     { imgs: ["☀️", "🌻"], answer: "Sunflower", choices: ["Sunflower", "Raindrop", "Moonlight"] },
//     { imgs: ["👟", "⚽"], answer: "Football", choices: ["Basketball", "Football", "Tennis"] },
//     { imgs: ["🌧️", "🏹"], answer: "Rainbow", choices: ["Snowman", "Rainfall", "Rainbow"] },
//     { imgs: ["🥞", "🎂"], answer: "Pancake", choices: ["Pancake", "Cupcake", "Milkshake"] },
//     { imgs: ["🦷", "🪥"], answer: "Toothbrush", choices: ["Hairbrush", "Toothbrush", "Paintbrush"] },
//     // Level 6 to 10 - Medium Difficulty (4 Choices)
//     { imgs: ["❄️", "⛄"], answer: "Snowman", choices: ["Snowman", "Rainman", "Fireman", "Ice-man"] },
//     { imgs: ["🦋", "🌹"], answer: "Butterfly", choices: ["Dragonfly", "Housefly", "Butterfly", "Bee"] },
//     { imgs: ["🌊", "🐚"], answer: "Seashell", choices: ["Seashell", "Seahorse", "Seafood", "Fish"] },
//     { imgs: ["🌙", "💡"], answer: "Moonlight", choices: ["Sunlight", "Moonlight", "Starlight", "Flashlight"] },
//     { imgs: ["🍎", "🥧"], answer: "Applepie", choices: ["Applepie", "Fruitcake", "Donut", "Cookie"] }
// ];

// // Shuffling the levels so they are random every time you reset
// let shuffledLevels = [...allLevels].sort(() => Math.random() - 0.5);

// let unlockedLevels = parseInt(localStorage.getItem('kidLevels')) || 1;
// let currentIdx = 0;

// function initMenu() {
//     // Hide modal on menu load
//     document.getElementById('message-modal').classList.add('hidden');
    
//     const menu = document.getElementById('level-menu');
//     menu.innerHTML = "";
//     for (let i = 1; i <= 10; i++) {
//         const btn = document.createElement('div');
//         btn.className = `level-card ${i > unlockedLevels ? 'locked' : ''}`;
//         btn.innerText = i > unlockedLevels ? "🔒" : "Level " + i;
//         if (i <= unlockedLevels) btn.onclick = () => startGame(i - 1);
//         menu.appendChild(btn);
//     }
// }

// function startGame(idx) {
//     currentIdx = idx;
//     document.getElementById('level-page').classList.add('hidden');
//     document.getElementById('game-page').classList.remove('hidden');
    
//     const level = shuffledLevels[currentIdx];
//     document.getElementById('level-title').innerText = "Level " + (currentIdx + 1);
    
//     const box = document.getElementById('question-box');
//     box.innerHTML = `<span>${level.imgs[0]}</span> <span class="plus-sign">+</span> <span>${level.imgs[1]}</span>`;

//     const optionsBox = document.getElementById('options-container');
//     optionsBox.innerHTML = "";
    
//     // Shuffle the choices for that specific level
//     const shuffledChoices = [...level.choices].sort(() => Math.random() - 0.5);
    
//     shuffledChoices.forEach(choice => {
//         const btn = document.createElement('button');
//         btn.className = "option-btn";
//         btn.innerText = choice;
//         btn.onclick = () => check(choice, level.answer);
//         optionsBox.appendChild(btn);
//     });
// }

// function check(choice, correct) {
//     const modal = document.getElementById('message-modal');
//     const modalTitle = document.getElementById('modal-title');
//     const modalText = document.getElementById('modal-text');
//     const modalBtn = document.getElementById('modal-btn');

//     modal.classList.remove('hidden');

//     if (choice === correct) {
//         modalTitle.innerText = "🌟 Great! 🌟";
//         modalText.innerText = "Correct Answer!";
//         modalBtn.innerText = "Next Level";
        
//         // Progress unlock
//         if (currentIdx + 2 > unlockedLevels && unlockedLevels < 10) {
//             unlockedLevels = currentIdx + 2;
//             localStorage.setItem('kidLevels', unlockedLevels);
//         }

//         modalBtn.onclick = () => {
//             modal.classList.add('hidden');
//             if (currentIdx < 9) {
//                 startGame(currentIdx + 1); // Move to next unique level
//             } else {
//                 alert("🏆 Super! Ella level-um mudichitinga!");
//                 showLevels();
//             }
//         };
//     } else {
//         modalTitle.innerText = "🧐 Oops! 🧐";
//         modalText.innerText = "Try Again!";
//         modalBtn.innerText = "Retry";
//         modalBtn.onclick = () => modal.classList.add('hidden');
//     }
// }

// function showLevels() {
//     document.getElementById('game-page').classList.add('hidden');
//     document.getElementById('level-page').classList.remove('hidden');
//     initMenu();
// }

// initMenu();
// utility: Fisher-Yates shuffle used throughout the script
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// wrap questions into sets of 5 or 6 so each "level" has multiple prompts
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
            { imgs: ["🔥", "wood"], answer: "Firewood", choices: ["Firewood", "Plywood", "Softwood", "Hardwood"] },
        ]
    }
];
// Page refresh panna progress reset aagum
let unlockedLevels = 1; 
let currentIdx = 0;            // current level index
let questionIdx = 0;           // current question within level

// create shuffled copy of levels and shuffle questions inside each level
let shuffledLevelSets = levelSets.map(level => ({
    questions: [...level.questions].sort(() => Math.random() - 0.5)
}));

// shuffle the order of the level sets themselves too
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

    // update title with question progress
    document.getElementById('level-title').innerText =
        `Level ${currentIdx + 1} — Question ${questionIdx + 1} of ${level.questions.length}`;

    const box = document.getElementById('question-box');
    box.innerHTML = `<span>${q.imgs[0]}</span> <span class="plus-sign">+</span> <span>${q.imgs[1]}</span>`;

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
    const modal = document.getElementById('message-modal');
    modal.classList.remove('hidden');

    if (choice === correct) {
        document.getElementById('modal-title').innerText = "🌟 Super! 🌟";
        document.getElementById('modal-text').innerText = "Correct Answer!";
        const btn = document.getElementById('modal-btn');
        // change label depending on whether there are more questions in this level
        if (questionIdx < shuffledLevelSets[currentIdx].questions.length - 1) {
            btn.innerText = "Next Question";
        } else {
            btn.innerText = "Next Level";
        }
        
        // unlock next level if we're at last question of current level
        if (questionIdx === shuffledLevelSets[currentIdx].questions.length - 1) {
            if (currentIdx + 2 > unlockedLevels && unlockedLevels < shuffledLevelSets.length) {
                unlockedLevels = currentIdx + 2;
            }
        }

        btn.onclick = () => {
            modal.classList.add('hidden');
            // advance to next question or next level
            if (questionIdx < shuffledLevelSets[currentIdx].questions.length - 1) {
                questionIdx++;
                showQuestion();
            } else if (currentIdx < shuffledLevelSets.length - 1) {
                startGame(currentIdx + 1);
            } else {
                alert("🏆 You finished all levels!");
                showLevels();
            }
        };
    } else {
        document.getElementById('modal-title').innerText = "🧐 Oops! 🧐";
        document.getElementById('modal-text').innerText = "Try again";
        const btn = document.getElementById('modal-btn');
        btn.innerText = "Retry";
        btn.onclick = () => modal.classList.add('hidden');
    }
}

function showLevels() {
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
    initMenu();
}

initMenu();
if (typeof updateScore === 'function') updateScore('connection', score);