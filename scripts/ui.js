let cells = Array.from(document.getElementsByClassName('cell'))
let playerText = document.getElementById('playerText')
let turnText = document.getElementById('turnText')
const restartButton = document.getElementById('restart')

function updateTurnText() {
    turnText.innerText = players[currentPlayer] + '\'s TURN';
}

function displayWinner(winner, winningCells) {
    turnText.style.color = "white";
    playerText.innerText = winner + " WINS";
    winningCells.forEach(space => {
        cells[space].style.color = "green";
    });
    removeCellClickListeners();
}

function displayDraw() {
    turnText.style.color = "white";
    playerText.innerText = "DRAW";
    removeCellClickListeners();
}

function updateBoard() {
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.color = 'black';
    });
    playerText.innerHTML = 'Tic Tac Toe';
    turnText.style.color = 'black';
}

function addCellClickListeners() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
}

function removeCellClickListeners() {
    cells.forEach(cell => cell.removeEventListener('click', cellClicked));
}

function restart() {
    restartGame();
    updateBoard();
    addCellClickListeners();
}

restartButton.addEventListener('click', restart);