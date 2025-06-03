console.log("Script connected");

const trainStationEl = document.querySelector(".train-station");
const currentScoreEl = document.querySelector(".current-score");
const gameLevelEl = document.querySelector(".game-level");
const gameSpeedEl = document.querySelector(".game-speed");
const highScoreEl = document.querySelector(".high-score");
const arrowControlsEl = document.querySelectorAll(".arrow-controls i");

let gameOver = false;
let currentScore = 0;
let trainX = Math.floor(Math.random() * 27) + 2, // Random X between 2 and 29
    trainY = Math.floor(Math.random() * 27) + 2; // Random Y between 2 and 29
let trainCars = [];
let coalX, coalY;
let velocityX = 0,
    velocityY = 0;
let setIntervalId;
let gameSpeed = 250; // Speed of the game in milliseconds
let gameLevel = 1; // Level variable to track the current level

// Using window.localStorage to store the high score variable
// Get the high score from localStorage
let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerHTML = `High Score: ${highScore}`;

// Change coal position randomly
const changeCoalPosition = () => {
    coalX = Math.floor(Math.random() * 30) + 1; // Random X between 1 and 30
    coalY = Math.floor(Math.random() * 30) + 1; // Random Y between 1 and 30
};

const changeTrainDirection = (event) => {
    // Change direction based on arrow key pressed
    // Using logical AND to ensure the train doesn't reverse direction
    // This prevents the train from reversing direction immediately
    if (event.key === "ArrowUp" && velocityY !== 1) {
        velocityY = -1;
        velocityX = 0;
    } else if (event.key === "ArrowDown" && velocityY !== -1) {
        velocityY = 1;
        velocityX = 0;
    } else if (event.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (event.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }

    // initGame();
};

// Add event listeners to arrow controls
// Passes key dataset value as an object to changeTrainDirection
arrowControlsEl.forEach((button) => {
    button.addEventListener("click", () => {
        changeTrainDirection({ key: button.dataset.key });
    });
});

// Function to handle gave over condition
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert(
        `Game Over! You reached Level: ${gameLevel}, with a score of: ${currentScore} Press OK to restart the game.`
    );
    currentScore = 0;
    currentScoreEl.innerHTML = `Score: ${currentScore}`;
    location.reload(); // Reload the page to restart the game
};

// Function to initialise the game
const initGame = () => {
    if (gameOver) return handleGameOver();

    // console.log(Math.max(50, gameSpeed - 10));
    // Place coal on the train station
    let divHtmlMarkup = `<div class="coal" style="grid-area: ${coalY} / ${coalX}"></div>`;

    // Check if the train has reached the coal
    if (trainX === coalX && trainY === coalY) {
        const carriageType = Math.floor(Math.random() * 5) + 1; // Randomly select a carriage type
        // const carriageType = 4; // Randomly select a carriage type
        // console.log(`Carriage Type: ${carriageType.toString()}`);
        // const carraigeArray = [coalX, coalY, carriageType.toString()];
        // console.log(carraigeArray);

        // If the train reaches the coal, add a new car to the train
        trainCars.push([coalX, coalY, carriageType.toString()]); // Add new car with type
        // trainCars.push(carraigeArray); // Add new car with type
        // console.log(trainCars);
        // Update the current score
        currentScore++;
        currentScoreEl.innerHTML = `Score: ${currentScore}`;
        console.log(`Score: ${currentScore}`);

        // If the train has 5 or more cars, increase the game speed
        if (currentScore % 5 === 0) {
            gameSpeed = Math.max(50, gameSpeed - 20); // Ensure speed doesn't go below 50ms
            clearInterval(setIntervalId);
            setIntervalId = setInterval(initGame, gameSpeed);
            gameLevelEl.innerHTML = `Level: ${++gameLevel}`;
            gameSpeedEl.innerHTML = `Speed: ${gameSpeed}ms`;
        }

        // Update high score if current score exceeds it
        if (currentScore > highScore) {
            highScore = currentScore;
            // Store the new high score in localStorage
            // Using window.localStorage to store the high score variable
            localStorage.setItem("highScore", highScore);
            highScoreEl.innerHTML = `High Score: ${highScore}`;
        }

        // Change coal position after collecting
        changeCoalPosition();
    }

    for (let index = trainCars.length - 1; index > 0; index--) {
        // Move each train car to the position of the previous car
        trainCars[index][0] = trainCars[index - 1][0];
        trainCars[index][1] = trainCars[index - 1][1];
        //trainCars[index] = trainCars[index - 1];
    }
    // Initialize train cars if not already done
    // if (!trainCars.length) {
    trainCars[0] = [trainX, trainY, "1"]; // First car is the engine
    // }

    // Update the train position based on velocity
    trainX += velocityX;
    trainY += velocityY;

    // Ensure the train stays within bounds
    if (trainX <= 0 || trainX > 30 || trainY <= 0 || trainY > 30) {
        // Reset the game if the train goes out of bounds
        return (gameOver = true);
    }

    // Add div elements for train cars
    for (let index = 0; index < trainCars.length; index++) {
        // Create div for train engine first
        if (index === 0) {
            divHtmlMarkup += `<div class="engine" style="grid-area: ${trainCars[index][1]} / ${trainCars[index][0]}"></div>`;
        } else {
            divHtmlMarkup += `<div class="carriage${trainCars[index][2] ? trainCars[index][2] : "3"}
                " style="grid-area: ${trainCars[index][1]} / ${trainCars[index][0]}"></div>`;
            // console.log(divHtmlMarkup);
        }
        // Ensure train does not collide with itself
        if (index > 0 && trainX === trainCars[index][0] && trainY === trainCars[index][1]) {
            return (gameOver = true);
        }
    }
    trainStationEl.innerHTML = divHtmlMarkup;
};

// Initialize the game
// Set initial coal position
changeCoalPosition();
// Start the game loop
// Using setInterval to call initGame every gameSpeed milliseconds
setIntervalId = setInterval(initGame, gameSpeed);
// Add event listener for keydown events to change train direction
// This will allow the train to change direction based on arrow keys
document.addEventListener("keydown", changeTrainDirection);
