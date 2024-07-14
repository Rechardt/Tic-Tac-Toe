const players = ['O', 'X'];
const MAX_MOVES = 8;
let currentPlayer = 1;
let spaces = Array(9).fill(null);
let moveCount = 0;
let singlePlayer = false;

const winningCombos = [
    [0,1,2], [3,4,5], [6,7,8], // horizontal wins
    [0,3,6], [1,4,7], [2,5,8], // vertical wins
    [0,4,8], [2,4,6]           // diagonal wins
];

function checkGameType() {
    const urlParams = new URLSearchParams(window.location.search);
    let gameType = parseInt(urlParams.get('value'));
    if (gameType === 1) {
        singlePlayer = true;
    }
}

function cellClicked(cell) {
    // Retrive the cell of the id that was clicked
    const id = cell.target.id;

    // Check if cell already occupied
    if (spaces[id] !== null) {
        return;
    }

    // set the current cell to the player
    spaces[id] = currentPlayer;
    cell.target.innerText = players[currentPlayer];

    let winningCells = playerHasWon();
    if (winningCells !== false) {
        finishGame(winningCells);
        return;
    } else if (moveCount === MAX_MOVES) {
        draw();
        return;
    }

    moveCount++;

    // swap who plays next
    currentPlayer = 1-currentPlayer;

    updateTurnText();

    if (singlePlayer && currentPlayer !== 1) {
        setTimeout(cpuTurn(), 1500); // slight delay for better UX
    }
}

function finishGame(winningCells) {
    displayWinner(players[currentPlayer], winningCells);
}

function draw() {
    displayDraw();
}

function cpuTurn() {
    // Get all indices where the value is null
    const emptyIndices = spaces
                        .map((value, index) => (value === null ? index : -1))
                        .filter(index => index !== -1);

    // If there are no empty spaces, return null
    if (emptyIndices.length === 0) {
        return null;
    }

    // Pick a random index from the emptyIndices array
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    const cellId = emptyIndices[randomIndex];

    // Set the selected cell to the CPU player
    spaces[cellId] = currentPlayer;
    cells[cellId].innerText = players[currentPlayer];

    let winningCells = playerHasWon();
    if (winningCells !== false) {
        // game over someone has won
        finishGame(winningCells);
        return;
    }

    moveCount++;

    // Swap who plays next
    currentPlayer = 1 - currentPlayer;
    updateTurnText();
    turnText.innerText = players[currentPlayer] + '\'s TURN';
}

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;
        if (spaces[a] !== null && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c];
        }
    }
    return false;
}

function restartGame() {
    spaces.fill(null);
    moveCount = 0;
    currentPlayer = 1;
    updateBoard();
    updateTurnText();
}