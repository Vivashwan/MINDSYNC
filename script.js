const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

// Get the mute button element
const muteButton = document.getElementById("muteButton");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
  { name: "alex", image: "./icons/alex.png" },
  { name: "alexander", image: "./icons/alexander.png" },
  { name: "angryKetchup", image: "./icons/angryKetchup.png" },
  { name: "blackWomenProfile", image: "./icons/blackWomenProfile.png" },
  { name: "blueKid", image: "./icons/blueKid.png" },
  { name: "brinjal", image: "./icons/brinjal.png" },
  { name: "brownMan", image: "./icons/brownMan.png" },
  { name: "clock", image: "./icons/clock.png" },
  { name: "confusedEarth", image: "./icons/confusedEarth.png" },
  { name: "confusedFrankenstein", image: "./icons/confusedFrankenstein.png" },
  { name: "cuteAstronaut", image: "./icons/cuteAstronaut.png" },
  { name: "cuteBottle", image: "./icons/cuteBottle.png" },
  { name: "cuteCatAstronaut", image: "./icons/cuteCatAstronaut.png" },
  { name: "cuteChineseDragon", image: "./icons/cuteChineseDragon.png" },
  { name: "cuteEdible", image: "./icons/cuteEdible.png" },
  { name: "cuteHouse", image: "./icons/cuteHouse.png" },
  { name: "cuteJellyfish", image: "./icons/cuteJellyfish.png" },
  { name: "cuteKnight", image: "./icons/cuteKnight.png" },
  { name: "cuteMonster", image: "./icons/cuteMonster.png" },
  { name: "cutePinkBabyGirl", image: "./icons/cutePinkBabyGirl.png" },
  { name: "cuteRabbit", image: "./icons/cuteRabbit.png" },
  { name: "cuteStore", image: "./icons/cuteStore.png" },
  { name: "dollars", image: "./icons/dollars.png" },
  { name: "frenchFries", image: "./icons/frenchFries.png" },
  { name: "happyBurger", image: "./icons/happyBurger.png" },
  { name: "happyGhost", image: "./icons/happyGhost.png" },
  { name: "happySun", image: "./icons/happySun.png" },
  { name: "happyYellowStar", image: "./icons/happyYellowStar.png" },
  { name: "pinkGiftBox", image: "./icons/pinkGiftBox.png" },
  { name: "prayingGirl", image: "./icons/prayingGirl.png" },
  { name: "teaWithMarshmallows", image: "./icons/teaWithMarshmallows.png" },
  { name: "toaster", image: "./icons/toaster.png" },
  { name: "whiteGiftBox", image: "./icons/whiteGiftBox.png" },
  { name: "wideEyedOwl", image: "./icons/wideEyedOwl.png" },
];

const music = [
  { name: "ForestWalk", url: "./backgroundMusic/ForestWalk.mp3" },
  { name: "Moment", url: "./backgroundMusic/Moment.mp3" },
  { name: "OutOfTime", url: "./backgroundMusic/OutOfTime.mp3" },
  { name: "PerfectBeauty", url: "./backgroundMusic/PerfectBeauty.mp3" },
  { name: "Permafrost", url: "./backgroundMusic/Permafrost.mp3" },
  { name: "PulsarRetroPop", url: "./backgroundMusic/PulsarRetroPop.mp3" },
  { name: "Relaxing", url: "./backgroundMusic/Relaxing.mp3" },
  { name: "SunsetLandscape", url: "./backgroundMusic/SunsetLandscape.mp3" },
  { name: "WalkAround", url: "./backgroundMusic/WalkAround.mp3" },
  { name: "WondrousWaters", url: "./backgroundMusic/WondrousWaters.mp3" },
];

// Function to play music
function playMusic() {
  const randomIndex = Math.floor(Math.random() * music.length);
  const selectedMusic = music[randomIndex];
  const audio = new Audio(selectedMusic.url);

  // Play the selected music
  audio.play();

  // Automatically play the next song when the current song ends
  audio.addEventListener("ended", function () {
    let nextIndex;
    if (randomIndex === music.length - 1) {
      // If the current song is the last song in the array, play the first song
      nextIndex = 0;
    } else {
      // Otherwise, play the next song
      nextIndex = randomIndex + 1;
    }
    // Create a new Audio element for the next song and play it
    const nextMusic = music[nextIndex];
    const nextAudio = new Audio(nextMusic.url);
    nextAudio.play();

    // Remove the event listener to prevent multiple event bindings
    audio.removeEventListener("ended", arguments.callee);
  });
}

// Event listener for the "Start Game" button
startButton.addEventListener("click", () => {
  playMusic();
});

function playMatchSound() {
  const matchAudio = new Audio("./gameSounds/MarimbaBloop.mp3");
  matchAudio.play();
}

function toggleMute() {
  // Loop through all audio elements and toggle their mute state
  document.querySelectorAll("audio").forEach((audio) => {
    audio.muted = !audio.muted;
  });
}

let movesCount = 0,
  winCount = 0;

//For timer
const timeGenerator = () => {
  if (minutes === 0 && seconds === 0) {
    result.innerHTML = "<h2>Game Over! You Lost</h2>";
    stopGame();
    return;
  } else {
    if (seconds === 0) {
      minutes -= 1;
      seconds = 59;
    } else {
      seconds -= 1;
    }
  }

  // Format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

const length = 8; // Length of the grid
const breadth = 10; // Breadth of the grid

//Pick random objects from the items array
const generateRandom = (length = 8, breadth = 10) => {
  // Temporary array
  let tempArray = [...items];
  // Initializes cardValues array
  let cardValues = [];
  // Calculate total number of cards needed
  const totalCards = (length * breadth) / 2;
  // Random object selection
  for (let i = 0; i < totalCards; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    // Push the randomly selected item into cardValues twice to create a pair
    cardValues.push(tempArray[randomIndex]);
    cardValues.push(tempArray[randomIndex]);
    // Remove the selected object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

gameContainer.style.gridTemplateColumns = `repeat(${breadth}, auto)`;

const matrixGenerator = (cardValues, rows = 6, cols = 12) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // Simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < rows * cols; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${cols}, auto)`;

  // Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // If selected card is already matched or flipped, do nothing
      if (
        card.classList.contains("matched") ||
        card.classList.contains("flipped")
      ) {
        return;
      }
      // If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        // Flip the clicked card
        card.classList.add("flipped");
        // If it is the first card (!firstCard since firstCard is initially false)
        if (!firstCard) {
          // So current card will become firstCard
          firstCard = card;
          // Current card's value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Increment moves since user selected second card
          movesCounter();
          // SecondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            // If both cards match add matched class so these cards would be ignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // Set firstCard to false since next card would be first now
            firstCard = false;
            // WinCount increment as user found a correct match
            winCount += 1;
            // Check if winCount == half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
            playMatchSound();
          } else {
            // If the cards don't match
            // Flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 59;
  minutes = 4;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

muteButton.addEventListener("click", toggleMute);

// cards.forEach((card) => {
//   card.addEventListener("click", () => {
//     // If selected card is already matched or flipped, do nothing
//     if (
//       card.classList.contains("matched") ||
//       card.classList.contains("flipped")
//     ) {
//       return;
//     }

//     //flip the clicked card
//     card.classList.add("flipped");

//     //if it is the first card (!firstCard since firstCard is initially false)
//     if (!firstCard) {
//       //so the current card will become firstCard
//       firstCard = card;
//       //current card's value becomes firstCardValue
//       firstCardValue = card.getAttribute("data-card-value");
//     } else {
//       //increment moves since the user selected the second card
//       movesCounter();
//       //secondCard and value
//       secondCard = card;
//       let secondCardValue = card.getAttribute("data-card-value");
//       if (firstCardValue == secondCardValue) {
//         //if both cards match, add matched class so these cards would be ignored next time
//         firstCard.classList.add("matched");
//         secondCard.classList.add("matched");
//         //set firstCard to false since the next card would be the first now
//         firstCard = false;
//         //winCount increment as the user found a correct match
//         winCount += 1;
//         //check if winCount == half of cardValues
//         if (winCount == Math.floor(cardValues.length / 2)) {
//           result.innerHTML = `<h2>You Won</h2>
//                     <h4>Moves: ${movesCount}</h4>`;
//           stopGame();
//         }
//       } else {
//         //if the cards don't match
//         //flip the cards back to normal after a delay
//         setTimeout(() => {
//           firstCard.classList.remove("flipped");
//           secondCard.classList.remove("flipped");
//         }, 900);
//         //reset firstCard and secondCard
//         firstCard = false;
//         secondCard = false;
//       }
//     }
//   });
// });
