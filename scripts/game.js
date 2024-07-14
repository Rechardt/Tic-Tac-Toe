const players = ['O', 'X'];
const MAX_MOVES = 8;
let currentPlayer = 1;
let spaces = Array(9).fill(null);
let moveCount = 0;
let singlePlayer = false;

// AI Related Constants
const MAX_EVAL = 1000;
const MIN_EVAL =  -1000;
let bestMove = null;

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
        setTimeout(cpuTurn, 500); // slight delay for better UX
    }
}

function finishGame(winningCells) {
    displayWinner(players[currentPlayer], winningCells);
}

function draw() {
    displayDraw();
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

function cpuTurn() {
    // Create a copy of the board
    var boardCopy = spaces.slice();
    console.log("NEW CPU TURN")
    console.log(boardCopy);

    bestMove = null;
    var depth = moveCount;
    alphabeta(currentPlayer, depth, boardCopy, MIN_EVAL, MAX_EVAL, true);
    console.log("new best move", bestMove)

    // Choose next move
    if (bestMove === null) {
        console.log("ERROR: BestMove null");
        return;
    }

    // Set the selected cell to the CPU player
    spaces[bestMove] = currentPlayer;
    cells[bestMove].innerText = players[currentPlayer];

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
}

function alphabeta(player, depth, board, alpha, beta, firstMove) {
    console.log(`AlphaBeta Depth: ${depth}, Player: ${players[player]}, Alpha Beta: (${alpha},${beta})`);
    var opponent = 1 - player;

    // Check if the opponent won
    if (checkBoardWin(board, opponent)) {
        return -1000 + depth; // favor losing later
    }

    var bestEval = MIN_EVAL;

    if (!board.includes(null)) {
        return 0; // DRAW
    }
    
    for (var i in board) {
        if (board[i] === null) {
            board[i] = player; // make a move
            // console.log(board)
            var score = -alphabeta(opponent, depth + 1, board, -beta, -alpha, false);
            console.log(`WE CAME BACK! Depth: ${depth}, Player: ${players[player]}`);
            board[i] = null; // undo the move
    
            if (score > bestEval) {
                console.log(`${score} was > than ${bestEval}`)
                if (firstMove) {
                    bestMove = i; // Track the best move at the root depth
                    console.log("updated bestMove:", i)
                }
                bestEval = score;
                if (bestEval > alpha) {
                    alpha = bestEval;
                    if (alpha >= beta) {
                    console.log(`${alpha} >= ${beta}`)
                    return alpha;
                    }
                }
            }
        }
    }

    return alpha;
}

function checkBoardWin(board, player) {
    for (const condition of winningCombos) {
        var [a, b, c] = condition;
        if (board[a] === player && board[a] === board[b] && board[a] === board[c]) {
            // console.log(board)
            return true;
        }
    }
    return false;
}
