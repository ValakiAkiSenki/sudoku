let boardSize = 9;

let currentNumOfSolutions;
let board;

let selectedCell;

main();

function initBoard() {
    board = [];
    for (let i = 0; i < boardSize; i++) {
        let tmp = [];
        for (let o = 0; o < boardSize; o++) {
            tmp.push(0);
        }
        board.push(tmp);
    }
}

function isSafe(i, o, value) {
    if (value == 0)
        return true;

    for (let a = 0; a < boardSize; a++) {
        if ( (value == board[a][o] && a!=i) ||
             (value == board[i][a] && a!=o) ) {
            return false;
        }
    }

    let clusterRow = i - i%3;
    let clusterCol = o - o%3;
    for (let a = 0; a < 3; a++) {
        for (let b = 0; b < 3; b++) {
            if (a + clusterRow == i && b + clusterCol == o)
                continue;

            if (board[a + clusterRow][b + clusterCol] == value) {
                return false;
            }
        }
    }

    return true;
}

function solve(i, o, maxNumOfSolutions) {
    if (i >= boardSize) {
        currentNumOfSolutions++;
        return true;
    }

    if (o >= boardSize) {
        return solve(i+1, 0, maxNumOfSolutions);
    }
    
    if (board[i][o]!=0) {
        return solve(i, o+1, maxNumOfSolutions);
    }

    for (let value = 1; value < boardSize+1; value++) {
        if (isSafe(i, o, value)) {

            board[i][o] = value;

            if (solve(i, o+1, maxNumOfSolutions) && currentNumOfSolutions>=maxNumOfSolutions) {
                return true;
            }

            board[i][o] = 0;
        }
    }

    return false;
}

function renderBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let o = 0; o < boardSize; o++) {
            let cell = document.querySelector("#cell" + (i*9+o+1));
            if (board[i][o] == 0) {
                cell.innerHTML = "";
            }
            else {
                cell.innerHTML = board[i][o];
            }
        }
    }
}

function solveBoard() {
    currentNumOfSolutions = 0;
    if (!solve(0, 0, 1)) {
        document.querySelector(".noSolution").classList.remove("notVisible");
    }
    else {
        document.querySelector(".noSolution").classList.add("notVisible");
    }
    checkBoard();
    renderBoard();
}

function createBoard() {
    solveBoard();

    let numOfCellsToRemove = 40;

    while (numOfCellsToRemove > 0) {
        let i = Math.floor(Math.random() * boardSize);
        let o = Math.floor(Math.random() * boardSize);

        if (board[i][o] != 0) {
            numOfCellsToRemove--;
            board[i][o] = 0;
        }
    }

    renderBoard();
}

function checkBoard() {
    let numOfMistakes = 0;

    for (let i = 0; i < boardSize; i++) {
        for (let o = 0; o < boardSize; o++) {
            if (!isSafe(i,o,board[i][o])) {
                document.getElementById(("cell"+(String)(i*boardSize+o+1))).classList.add("mistake");
                numOfMistakes++;
            }
            else {
                document.getElementById(("cell"+(String)(i*boardSize+o+1))).classList.remove("mistake");
            }
        }
    }

    if (numOfMistakes==0) {
        document.querySelector(".noSolution").classList.add("notVisible");
    }
}

function clearBoard() {
    board = [];
    for (let i = 0; i < boardSize; i++) {
        let tmp = [];
        for (let o = 0; o < boardSize; o++) {
            tmp.push(0);
        }
        board.push(tmp);
    }

    document.querySelector(".noSolution").classList.add("notVisible");

    checkBoard();
    renderBoard();
}

function selectCell(cell) {
    if (selectedCell)
        selectedCell.classList.toggle("selectedCell");
    cell.classList.toggle("selectedCell");
    selectedCell = cell;
}

function handleMouseInput(e) {
    selectCell(e.target);
}

function handleKeyboardInput(e) {
    if (!selectedCell)
        return;

    if (!isNaN(e.key)) {
        // selectedCell.innerHTML += e.key; // uncomment if more digits are required
        selectedCell.innerHTML = e.key;
        board[Math.floor((selectedCell.id.substring(4)-1)/9)][(selectedCell.id.substring(4)-1)%9] = e.key;
    }
    else {
        switch (e.key) {
            case "Backspace":
            case "Delete":
                selectedCell.innerHTML = "";
                board[Math.floor((selectedCell.id.substring(4)-1)/9)][(selectedCell.id.substring(4)-1)%9] = 0;
                break;

            case "ArrowUp":
                if ((Number)(selectedCell.id.substring(4))-9 >= 0) {
                    selectCell(document.getElementById(("cell"+(String)((Number)(selectedCell.id.substring(4))-9))));
                }
                break;

            case "ArrowRight":
                if (selectedCell.id.substring(4)%9!=0) {
                    selectCell(document.getElementById(("cell"+(String)((Number)(selectedCell.id.substring(4))+1))));
                }
                break;

            case "ArrowDown":
                if ((Number)(selectedCell.id.substring(4))+9 <= 81) {
                    selectCell(document.getElementById(("cell"+(String)((Number)(selectedCell.id.substring(4))+9))));
                }
                break;

            case "ArrowLeft":
                if (selectedCell.id.substring(4)%9!=1) {
                    selectCell(document.getElementById(("cell"+(String)((Number)(selectedCell.id.substring(4))-1))));
                }
                break;
        
            default:
                break;
        }
    }
}

function addEventListeners() {
    document.addEventListener("keydown", handleKeyboardInput);

    let cells = document.querySelectorAll(".cell");
    cells.forEach(element => {
        element.addEventListener("click", handleMouseInput);
    });

    document.querySelector("#solve").addEventListener("click", solveBoard);
    document.querySelector("#createUnsolved").addEventListener("click", createBoard);
    document.querySelector("#check").addEventListener("click", checkBoard);
    document.querySelector("#clear").addEventListener("click", clearBoard);
}

function main() {
    initBoard();
    addEventListeners();
    renderBoard();
}