/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("snake");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

let rightBtn = document.querySelector(".rightBtn");
let leftBtn = document.querySelector(".leftBtn");
let topBtn = document.querySelector(".topBtn");
let bottomBtn = document.querySelector(".bottomBtn");
let startGame = document.querySelector(".start");
let restart = document.querySelector(".Restart");
let easy = document.querySelector(".easy");
let medium = document.querySelector(".medium");
let hard = document.querySelector(".hard");
let timer = document.querySelector(".timer h4");
let currentLevel = document.querySelector(".current-level p");
let CurrentLength = document.querySelector(".snake-length p");
let counterForWinner = document.querySelector(".wins-counter");
let counterForLoser = document.querySelector(".losses-counter");
let bestScoreElement = document.querySelector(".best-score");
let fillBar = document.querySelector(".fill-bar");
let gameStatusElement = document.querySelector(".game-status");
let snakeBodyeElement = document.querySelector(".snake-body div");
//start variables
let uiName = null;
let gameLoop;
let level = 1;
let foodCounter = 0;
let bestScore = 0;
let direction = null;
let winsCounter = 0;
let lossesCounter = 0;
let grow = false;
let speed = 250;
let count = 0;
let startTime = 0;
let gameStatus = false;
const food = {
  x: 200,

  y: 100,
};
let flagPLay = true;
let snakeBody = [
  { x: 90, y: 90 },
  { x: 70, y: 90 },
  { x: 50, y: 90 },
  { x: 30, y: 90 },
];
// end variables
function createSnake(snakeBody) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(food.x, food.y, 15, 0, Math.PI * 2);
  ctx.fill();
  for (let part of snakeBody) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(part.x, part.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

function moving(snakeBody, value) {
  if (value == "right") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const newHead = { x: snakeBody[0].x + 20, y: snakeBody[0].y };
    if (!grow) {
      snakeBody.pop();
    } else {
      grow = false;
    }
    snakeBody.unshift(newHead);
    createSnake(snakeBody);
  } else if (value == "left") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const newHead = { x: snakeBody[0].x - 20, y: snakeBody[0].y };
    if (!grow) {
      snakeBody.pop();
    } else {
      grow = false;
    }
    snakeBody.unshift(newHead);
    createSnake(snakeBody);
  } else if (value == "top") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const newHead = { x: snakeBody[0].x, y: snakeBody[0].y - 20 };
    if (!grow) {
      snakeBody.pop();
    } else {
      grow = false;
    }
    snakeBody.unshift(newHead);
    createSnake(snakeBody);
  } else if (value == "bottom") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const newHead = { x: snakeBody[0].x, y: snakeBody[0].y + 20 };
    if (!grow) {
      snakeBody.pop();
    } else {
      grow = false;
    }
    snakeBody.unshift(newHead);
    createSnake(snakeBody);
  }

  if (hasPlayerWon() == false) {
    restartGame();
    lossesCounter++;
    counterForLoser.textContent = lossesCounter;
  } else if (hasPlayerWon()) {
    level++;
    currentLevel.textContent = level;
    restartGame();
    winsCounter++;
    counterForWinner.textContent = winsCounter;
    bestScore = Math.max(bestScore, level * 10);
    bestScoreElement.textContent = bestScore;
    CurrentLength.textContent = snakeBody.length;
  }
}
function createFood(food) {
  food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
  food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
}
function eatingFood() {
  let dx = snakeBody[0].x - food.x;
  let dy = snakeBody[0].y - food.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance <= 25) {
    createFood(food);
    grow = true;
    foodCounter++;
    fillBar.style.width = (foodCounter / (level * 10)) * 100;
    CurrentLength.textContent = snakeBody.length;
  }
}

function hasPlayerWon() {
  let check =
    snakeBody[0].x > canvas.width - 2 ||
    snakeBody[0].x <= 0 ||
    snakeBody[0].y < 0 ||
    snakeBody[0].y > canvas.height;
  if (check) {
    return false;
  }
  if (snakeBody.length == level * 10 + 4) {
    return true;
  }
}
function restartGame() {
  let originalSnakeBody = [
    { x: 90, y: 90 },
    { x: 70, y: 90 },
    { x: 50, y: 90 },
    { x: 30, y: 90 },
  ];
  snakeBody = originalSnakeBody.map((part) => ({ ...part }));
  flagPLay = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  createFood(food);
  createSnake(snakeBody);
  direction = null;
  CurrentLength.textContent = snakeBody.length;
  foodCounter = 0;
  fillBar.style.width = (foodCounter / (level * 10)) * 100;
  gameStatus = false;
  gameStatusElement.textContent = "HOLDING";
  gameStatusElement.classList.remove("on");
  uiName = "right";
  updateUi(uiName);
  uiName = "easy";
  updateUi(uiName);
}

function updateUi(uiName) {
  switch (uiName) {
    case "right":
      leftBtn.classList.remove("active");
      topBtn.classList.remove("active");
      bottomBtn.classList.remove("active");
      rightBtn.classList.add("active");
      break;
    case "left":
      rightBtn.classList.remove("active");
      topBtn.classList.remove("active");
      bottomBtn.classList.remove("active");
      leftBtn.classList.add("active");
      break;
    case "top":
      leftBtn.classList.remove("active");
      rightBtn.classList.remove("active");
      bottomBtn.classList.remove("active");
      topBtn.classList.add("active");
      break;
    case "bottom":
      leftBtn.classList.remove("active");
      topBtn.classList.remove("active");
      rightBtn.classList.remove("active");
      bottomBtn.classList.add("active");
      break;
    case "restart":
      leftBtn.classList.remove("active");
      topBtn.classList.remove("active");
      bottomBtn.classList.remove("active");
      rightBtn.classList.add("active");
      hard.classList.remove("active");
      medium.classList.remove("active");
      easy.classList.add("active");
      break;
    case "easy":
      hard.classList.remove("active");
      medium.classList.remove("active");
      easy.classList.add("active");
      break;
    case "medium":
      hard.classList.remove("active");
      easy.classList.remove("active");
      medium.classList.add("active");
      break;
    case "hard":
      easy.classList.remove("active");
      medium.classList.remove("active");
      hard.classList.add("active");
      break;

    default:
      break;
  }
}
function startLoop(speed) {
  clearInterval(gameLoop);
  gameLoop = setInterval(() => {
    if (flagPLay) {
      switch (direction) {
        case "right":
          moving(snakeBody, "right");

          break;
        case "left":
          moving(snakeBody, "left");

          break;
        case "top":
          moving(snakeBody, "top");

          break;
        case "bottom":
          moving(snakeBody, "bottom");

          break;
        default:
          break;
      }
      if (startTime > 0) {
        let elapsed = Date.now() - startTime;

        let totalSeconds = Math.floor(elapsed / 1000);
        let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
          2,
          "0",
        );
        let seconds = String(totalSeconds % 60).padStart(2, "0");
        timer.textContent = `${hours}:${minutes}:${seconds}`;
      }
    }

    eatingFood();
    if (gameStatus) {
      gameStatusElement.textContent = "PLAYING";
      gameStatusElement.classList.add("on");
    }
  }, speed);
}

startLoop(speed);

// start styles
rightBtn.classList.add("active");
easy.classList.add("active");

//end styles

rightBtn.addEventListener("click", () => {
  direction = "right";
  uiName = "right";
  updateUi(uiName);
});
leftBtn.addEventListener("click", () => {
  direction = "left";
  uiName = "left";
  updateUi(uiName);
});
topBtn.addEventListener("click", () => {
  direction = "top";
  uiName = "top";
  updateUi(uiName);
});
bottomBtn.addEventListener("click", () => {
  direction = "bottom";
  uiName = "bottom";
  updateUi(uiName);
});
startGame.addEventListener("click", () => {
  createSnake(snakeBody);
  flagPLay = true;
  direction = "right";
  CurrentLength.textContent = snakeBody.length;
  gameStatus = true;
  startTime = Date.now();
});
restart.addEventListener("click", () => {
  restartGame();
  uiName = "restart";
  updateUi(uiName);
});
easy.addEventListener("click", () => {
  speed = 250;
  startLoop(speed);
  uiName = "easy";
  updateUi(uiName);
});
medium.addEventListener("click", () => {
  speed = 150;
  startLoop(speed);
  uiName = "medium";
  updateUi(uiName);
});
hard.addEventListener("click", () => {
  speed = 80;
  startLoop(speed);
  uiName = "hard";
  updateUi(uiName);
});

function resizeCanvas() {
  canvas.width = snakeBodyeElement.clientWidth;
  canvas.height = snakeBodyeElement.clientHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
  resizeCanvas();
});
window.addEventListener("orientationchange", resizeCanvas);
