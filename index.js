const stopwatch = document.querySelector(".stopwatch");
const hoursElement = document.querySelector(".hours");
const minutesElement = document.querySelector(".minutes");
const secondsElement = document.querySelector(".seconds");
const clockElement = document.querySelector(".clock");
const button = document.querySelector(".game");
const img = document.querySelector(".img");
let allowClick = true;

let hours = 0;
let minutes = 0;
let seconds = 0;
let clock = 40;
let intervalStopWatch;
let intervalTimer;

function setStopWatch() {
  seconds++;
  if (seconds <= 9) {
    secondsElement.innerHTML = seconds;
  }
  if (seconds > 9) {
    minutes++;
    minutesElement.innerHTML = minutes;
    seconds = 0;
    secondsElement.innerHTML = seconds;
  }
  if (minutes <= 9) {
    minutesElement.innerHTML = minutes;
  }
  if (minutes > 9) {
    hours++;
    hoursElement.innerHTML = hours;
    minutes = 0;
    minutesElement.innerHTML = minutes;
  }
  if (seconds === 9 && minutes === 9 && hours === 9) {
    secondsElement.innerHTML = 9;
    minutesElement.innerHTML = 9;
    hoursElement.innerHTML = 9;
    clearInterval(intervalStopWatch);
    clearInterval(intervalTimer);
  }
}

function restartGame() {
  button.addEventListener("mouseup", () => {
    startGame(16, 16, 15);
    restartTime();
  });
}

function restartTime() {
  allowClick = true;
  seconds = 0;
  minutes = 0;
  hours = 0;
  clock = 40;
  secondsElement.innerHTML = 0;
  minutesElement.innerHTML = 0;
  hoursElement.innerHTML = 0;
  clockElement.innerHTML = "0" + 40;
  clearInterval(intervalStopWatch);
  clearInterval(intervalTimer);
  img.src = "./image/smile.png";
}

function setTimer() {
  clock--;
  clockElement.innerHTML = "0" + clock;
}

restartGame();

function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
  const field = document.querySelector(".field");
  const cellsCount = WIDTH * HEIGHT;
  field.innerHTML = "<button></button>".repeat(cellsCount);
  const cells = [...field.children];
  let closedCount = cellsCount;

  const bombs = [...Array(cellsCount).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, BOMBS_COUNT);

  field.addEventListener("mousedown", () => {
    img.src = "./image/ou.png";
  });

  field.addEventListener("mouseup", () => {
    img.src = "./image/smile.png";
  });

  field.onmousedown = function (evt) {
    const index = cells.indexOf(evt.target);
    if (evt.which === 3) {
      cells[index].style.backgroundImage = "url('./image/flag.png')";
      cells[index].style.backgroundRepeat = "no-repeat";
      cells[index].style.backgroundSize = "contain";
      cells[index].style.border = "none";
      cells[index].disabled = true;
      img.src = "./image/smile.png";
    }
  };

  field.addEventListener("click", (evt) => {
    if (evt.target.tagName !== "BUTTON") {
      return;
    }

    const index = cells.indexOf(evt.target);
    const column = index % WIDTH;
    const row = Math.floor(index / WIDTH);
    open(row, column);

    if (!allowClick) return;
    intervalTimer = setInterval(setTimer, 60000);
    intervalStopWatch = setInterval(setStopWatch, 1000);
    allowClick = false;
  });

  function isValid(row, column) {
    return row >= 0 && row < HEIGHT && column >= 0 && column < WIDTH;
  }

  function getCount(row, column) {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (isBomb(row + y, column + x)) {
          count++;
        }
      }
    }
    return count;
  }

  function open(row, column) {
    if (!isValid(row, column)) return;
    const index = row * WIDTH + column;
    const cell = cells[index];
    if (cell.disabled === true) return;
    cell.disabled = true;

    if (isBomb(row, column)) {
      bombs.forEach((item, i) => {
        cells[item].style.backgroundImage = "url('./image/bomb.png')";
        cells[item].style.backgroundRepeat = "no-repeat";
        cells[item].style.backgroundSize = "contain";
        cells[item].style.border = "none";
      });

      cell.style.backgroundImage = "url('./image/bomb_red.png')";
      img.src = "./image/fail.png";

      cells.forEach((item) => {
        item.disabled = true;
      });

      clearInterval(intervalStopWatch);
      clearInterval(intervalTimer);
      alert("Вы проиграли!");
      return;
    }

    closedCount--;

    if (closedCount <= BOMBS_COUNT) {
      img.src = "./image/best.png";
      alert("Вы выиграли!");
    }

    const count = getCount(row, column);

    if (count === 1) {
      cell.style.color = "#0000FF";
    } else if (count === 2) {
      cell.style.color = "#008000";
    } else if (count === 3) {
      cell.style.color = "#FF0000";
    } else if (count === 4) {
      cell.style.color = "#00008B";
    } else if (count === 5) {
      cell.style.color = "#8B0000";
    } else if (count === 6) {
      cell.style.color = "#00CED1";
    } else if (count === 7) {
      cell.style.color = "#000000";
    } else if (count === 8) {
      cell.style.color = "#D3D3D3";
    }

    if (count !== 0) {
      cell.innerHTML = count;
      return;
    }

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        open(row + y, column + x);
      }
    }
  }

  function isBomb(row, column) {
    if (!isValid(row, column)) return false;
    const index = row * WIDTH + column;
    return bombs.includes(index);
  }
}

startGame(16, 16, 15);
