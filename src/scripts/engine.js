const state = {
  view: {
    squares: document.querySelectorAll('.square'),
    enemy: document.querySelector('.enemy'),
    timeLeft: document.querySelector('#time-left'),
    score: document.querySelector('#score'),
    finalScore: document.querySelector('#final-score'),
    gameOver: document.querySelector('.game-over'),
    restart: document.querySelector('#restart'),
    ranking: document.querySelector('#ranking'),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 5,
    ranking: []
  },
  actions: {
    timerID: setInterval(getRandomSquare, 1000),
    countDownID: setInterval(countDown, 1000),
  }
}

function playSound(soundName) {
  let audio = new Audio(`./src/sounds/${soundName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}
function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;
  if (state.values.currentTime <= 0) {
    clearInterval(state.actions.timerID);
    clearInterval(state.actions.countDownID);
    gameOver();
  }
}
function atualizarRanking() {
  if(!localStorage.getItem("ranking-detona-ralph")){
    localStorage.setItem("ranking-detona-ralph", JSON.stringify([]));
  }
  state.values.ranking = JSON.parse(localStorage.getItem("ranking-detona-ralph"));
  state.values.ranking.push(state.values.result);

  state.values.ranking.sort(function(a, b) {
    return b - a;
  });
  state.values.ranking = state.values.ranking.slice(0, 10);
  localStorage.setItem("ranking-detona-ralph", JSON.stringify(state.values.ranking));
  state.values.ranking = JSON.parse(localStorage.getItem("ranking-detona-ralph"));
  state.values.ranking.forEach((score, index) => {
    state.view.ranking.innerHTML += `<li>${index + 1}º - ${score}</li>`;
  });
}

function getRandomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove('enemy')
  })

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add('enemy');
  state.values.hitPosition = randomSquare.id;
}
function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {

        state.values.result++;
        state.view.score.textContent = state.values.result;
        playSound("hit");
        state.values.hitPosition = null;
      }
    })
  })
}



function gameOver() {
  playSound("game-over");
  state.view.gameOver.style.display = "flex";
  state.view.finalScore.textContent = state.values.result;
  
  atualizarRanking();
  state.view.restart.addEventListener("click", () => {
    location.reload();
  })
}

function init() {
  addListenerHitBox();
}
init();

