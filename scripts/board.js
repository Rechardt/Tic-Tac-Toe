let cells = Array.from(document.getElementsByClassName('cell'))
let playerText = document.getElementById('playerText')
let turnText = document.getElementById('turnText')
const restartButton = document.getElementById('restart')

let singlePlayer = false;

function checkGameType() {
    const urlParams = new URLSearchParams(window.location.search)
    let gameType = parseInt(urlParams.get('value'))
    console.log(gameType)
    if (gameType === 1) {
        singlePlayer = true;
    }
}

const players = ['O', 'X']
const MAX_MOVES = 9
let currentPlayer = 1
let spaces = Array(9).fill(null)
let moveCount = 0;

function cellClicked(cell) {
    // Retrive the cell of the id that was clicked
    const id = cell.target.id

    // Check if cell already occupied
    if (spaces[id] !== null) {
        return;
    }

    // set the current cell to the player
    spaces[id] = currentPlayer
    cell.target.innerText = players[currentPlayer]

    let winningCells = playerHasWon()
    if (winningCells !== false) {
        // game over someone has won
        finishGame(winningCells);
        return
    } else if (moveCount === 8) {
        draw()
        return
    }

    turnText.innerText = players[1-currentPlayer] + '\'s TURN'

    moveCount++

    // swap who plays next
    currentPlayer = 1-currentPlayer
    if (singlePlayer && currentPlayer !== 1) {
        setTimeout(cpuTurn(), 1500) // slight delay for better UX
    }
}

function finishGame(winningCells) {
    turnText.style.color = "white"
    playerText.innerText = players[currentPlayer] + " WINS"

    for(const space of winningCells) {
        cells[space].style.color = "green"
    }

    cells.forEach(cell => cell.removeEventListener('click', cellClicked))
}

function draw() {
    turnText.style.color = "white"
    playerText.innerText = "DRAW"

    cells.forEach(cell => cell.removeEventListener('click', cellClicked))
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
    turnText.innerText = players[currentPlayer] + '\'s TURN';
}

const winningCombos = [
    // horizontal wins
    [0,1,2],
    [3,4,5],
    [6,7,8],
    // vertical wins
    [0,3,6],
    [1,4,7],
    [2,5,8],
    // diagonal wins
    [0,4,8],
    [2,4,6]
]

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition

        if(spaces[a] !== null && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            console.log("winning spaces are: " + condition)
            return [a,b,c]
        }
    }
    return false
}

function restart() {
    spaces.fill(null)
    moveCount = 0;

    cells.forEach( cell => {
        cell.innerText = ''
        cell.style.backgroundColor=''
        cell.style.color = 'black'
    })

    playerText.innerHTML = 'Tic Tac Toe'

    currentPlayer = 1;
    turnText.innerHTML = "X's TURN";
    turnText.style.color = 'black';

    cells.forEach(cell => cell.addEventListener('click', cellClicked))
}

// MAIN
checkGameType()

cells.forEach(cell => cell.addEventListener('click', cellClicked))

restartButton.addEventListener('click', restart)