const animals = [
  { word: "cow", hint: 'This animal says "Moo"', soundId: "cowSound", img: "cow.png" },
  { word: "dog", hint: 'This animal says "Bow Bow"', soundId: "dogSound", img: "dog.png" },
  { word: "cat", hint: 'This animal says "Meow"', soundId: "catSound", img: "cat.png" },
  { word: "sheep", hint: 'This animal says "Baa"', soundId: "sheepSound", img: "sheep.png" },
  { word: "goat", hint: 'This animal says "Maa"', soundId: "goatSound", img: "goat.png" },
  { word: "rabbit", hint: 'This animal hops quietly', soundId: "rabbitSound", img: "rabbit.png" },
  { word: "elephant", hint: 'This animal trumpets loudly', soundId: "elephantSound", img: "elephant.png" },
  { word: "pig", hint: 'This animal says "Oink"', soundId: "pigSound", img: "pig.png" },
  { word: "horse", hint: 'This animal says "Neigh"', soundId: "horseSound", img: "horse.png" },
  { word: "donkey", hint: 'This animal says "Hee-Haw"', soundId: "donkeySound", img: "donkey.png" },
  { word: "lion", hint: 'This animal roars loudly', soundId: "lionSound", img: "lion.png" },
  { word: "tiger", hint: 'This animal growls fiercely', soundId: "tigerSound", img: "tiger.png" }
];

let currentIndex = 0;

function loadAnimal() {
  const currentAnimal = animals[currentIndex];
  document.getElementById("hint").textContent = "Hint: " + currentAnimal.hint;
  document.getElementById("guessInput").value = "";
  document.getElementById("result").textContent = "";
  document.getElementById("animalDisplay").classList.add("hidden");
}

document.getElementById("submitBtn").addEventListener("click", () => {
  const guess = document.getElementById("guessInput").value.toLowerCase();
  const result = document.getElementById("result");
  const display = document.getElementById("animalDisplay");
  const image = document.getElementById("animalImage");
  const word = document.getElementById("animalWord");

  const currentAnimal = animals[currentIndex];

  if (guess === currentAnimal.word) {
    result.textContent = "Correct! 🎉";

    // Play sound
    const sound = document.getElementById(currentAnimal.soundId);
    if (sound) {
      sound.currentTime = 0; // restart from beginning
      sound.play();
    }

    // Show animal picture and word
    image.src = currentAnimal.img;
    image.alt = currentAnimal.word;
    word.textContent = currentAnimal.word.toUpperCase();
    display.classList.remove("hidden");

    // Move to next animal after 2 seconds
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % animals.length;
      loadAnimal();
    }, 2000);
  } else {
    result.textContent = "Oops! Try again.";
    display.classList.add("hidden");
  }
});

// Start the game
loadAnimal();