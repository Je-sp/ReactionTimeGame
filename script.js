// Variables for tracking state
let waitingToStart = true;
let gameStarted = false;
let startTime = 0;
let endTime = 0;
let fastestTime = null;
let averageTime = null;
let lastTime = null;
let reactionTimes = [];

// DOM Elements
const gameArea = document.getElementById('gameArea');
const gameMessage = document.getElementById('gameMessage');
const resultDisplay = document.getElementById('resultDisplay');
const resultTime = document.getElementById('resultTime');
const falseStart = document.getElementById('falseStart');
const fastestDisplay = document.getElementById('fastest');
const averageDisplay = document.getElementById('average');
const lastDisplay = document.getElementById('last');
const resetButton = document.getElementById('resetButton');
const historyItems = document.getElementById('historyItems');
const clearHistoryButton = document.getElementById('clearHistory');
const historyContent = document.getElementById('historyContent');
const instructionsModal = document.getElementById('instructionsModal');
const startFromInstructions = document.getElementById('startFromInstructions');
const closeInstructions = document.getElementById('closeInstructions');
const historyToggle = document.getElementById('historyToggle');

// Utility Functions
function setGameMessage(message) {
  gameMessage.innerHTML = `<p id="gameInstruction">${message}</p>`;
}

function updateStats() {
  fastestDisplay.textContent = fastestTime !== null ? `${fastestTime}ms` : '--';
  averageDisplay.textContent = averageTime !== null ? `${averageTime.toFixed(1)}ms` : '--';
  lastDisplay.textContent = lastTime !== null ? `${lastTime}ms` : '--';
}

function updateHistory() {
  if (reactionTimes.length > 0) {
    clearHistoryButton.style.display = 'block';
    historyItems.innerHTML = reactionTimes
      .map((time, index) => `<div class="history-item"><span class="attempt-number">Attempt ${index + 1}</span><span class="attempt-time">${time}ms</span></div>`)
      .join('');
  } else {
    historyItems.innerHTML = '<p class="no-history">No history yet. Complete an attempt to see it here.</p>';
    clearHistoryButton.style.display = 'none';
  }
}

// Game Logic
function startGame() {
  if (!waitingToStart) return;

  waitingToStart = false;
  setGameMessage('Get ready...');
  falseStart.style.display = 'none';
  resultDisplay.style.display = 'none';

  // Wait a random time before allowing the user to tap
  const randomDelay = Math.random() * 3000 + 1000;
  setTimeout(() => {
    if (!waitingToStart) {
      gameStarted = true;
      gameArea.classList.add('ready');
      setGameMessage('Tap now!');
      startTime = Date.now();
    }
  }, randomDelay);
}

function handleReaction() {
  if (gameStarted) {
    // Successful reaction
    endTime = Date.now();
    const reactionTime = endTime - startTime;

    reactionTimes.push(reactionTime);
    lastTime = reactionTime;

    if (fastestTime === null || reactionTime < fastestTime) {
      fastestTime = reactionTime;
    }

    averageTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;

    gameStarted = false;
    waitingToStart = true;

    gameArea.classList.remove('ready');
    setGameMessage('Tap when the color changes');
    resultDisplay.style.display = 'block';
    resultTime.textContent = reactionTime;

    updateStats();
    updateHistory();
  } else if (!waitingToStart) {
    // False start
    gameStarted = false;
    waitingToStart = true;

    gameArea.classList.remove('ready');
    setGameMessage('Tap when the color changes');
    falseStart.style.display = 'block';
  }
}

function resetGame() {
  waitingToStart = true;
  gameStarted = false;
  startTime = 0;
  endTime = 0;
  fastestTime = null;
  averageTime = null;
  lastTime = null;
  reactionTimes = [];

  gameArea.classList.remove('ready');
  setGameMessage('Tap when the color changes');
  falseStart.style.display = 'none';
  resultDisplay.style.display = 'none';

  updateStats();
  updateHistory();
}

function clearHistory() {
  reactionTimes = [];
  updateStats();
  updateHistory();
}

// Event Listeners
gameArea.addEventListener('click', () => {
  if (waitingToStart) {
    startGame();
  } else {
    handleReaction();
  }
});

resetButton.addEventListener('click', resetGame);

clearHistoryButton.addEventListener('click', clearHistory);

historyToggle.addEventListener('click', () => {
  const isOpen = historyContent.style.display === 'block';
  historyContent.style.display = isOpen ? 'none' : 'block';
  historyToggle.querySelector('.chevron-down').classList.toggle('open', !isOpen);
});

startFromInstructions.addEventListener('click', () => {
  instructionsModal.style.display = 'none';
});

closeInstructions.addEventListener('click', () => {
  instructionsModal.style.display = 'none';
});

// Initialize
updateStats();
updateHistory();