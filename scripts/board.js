let cells = Array.from(document.getElementsByClassName('cell'))
let playerText = document.getElementById('playerText')
let turnText = document.getElementById('turnText')
const restartButton = document.getElementById('restart')


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
        turnText.style.color = "white"
        playerText.innerText = players[currentPlayer] + " WINS"

        for(const space of winningCells) {
            console.log(space + ". making " + cells[space] + " green")
            cells[space].style.color = "green"
        }

        cells.forEach(cell => cell.removeEventListener('click', cellClicked))
        return;
    }

    turnText.innerText = players[1-currentPlayer] + '\'s TURN'

    // swap who plays next
    currentPlayer = 1-currentPlayer


    moveCount++

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

cells.forEach(cell => cell.addEventListener('click', cellClicked))

restartButton.addEventListener('click', restart)

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