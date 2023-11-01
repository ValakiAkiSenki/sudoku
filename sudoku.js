let boardSize = 9;
let difficulty;
let numOfCellsToRemove;

let currentNumOfSolutions;
let board = [];
let diffButtons = [];

let selectedCell;

function initBoard() {
    board = []
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
    checkForMistakes();
    toggleNoSolution();
    renderBoard();
}

function createBoard() {
    let shuffleAmount = 5;

    clearBoard();
    solveBoard();

    for (let s = 0; s < shuffleAmount; s++) {
        // shuffle 3x3 rows
        let randAX = Math.floor(Math.random()*3);
        let randBX = Math.floor(Math.random()*3);

        for (let i = 0; i < 3; i++) {
            let tmp = board[randAX*3+i];
            board[randAX*3+i] = board[randBX*3+i];
            board[randBX*3+i] = tmp;
        }


        // shuffle 3x3 columns
        let randAY = Math.floor(Math.random()*3);
        let randBY = Math.floor(Math.random()*3);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let tmp = board[i][randAY*3+j];
                board[i][randAY*3+j] = board[i][randBY*3+j];
                board[i][randBY*3+j] = tmp;
            }
        }
    }

    for (let s = 0; s < shuffleAmount; s++) {
        // shuffle 1x1 rows in every 3x3 row
        for (let i = 0; i < 3; i++) {
            let randA = Math.floor(Math.random()*3);
            let randB = Math.floor(Math.random()*3);
    
            let tmp = board[i*3+randA];
            board[i*3+randA] = board[i*3+randB];
            board[i*3+randB] = tmp;
        }


        // shuffle 1x1 rows in every 3x3 row
        for (let j = 0; j < 3; j++) {
            let randA = Math.floor(Math.random()*3);
            let randB = Math.floor(Math.random()*3);
    
            for (let i = 0; i < 9; i++) {
                let tmp = board[i][j*3+randA];
                board[i][j*3+randA] = board[i][j*3+randB];
                board[i][j*3+randB] = tmp;
            }
        }
    }

    let attemts = 100;              // makes sure it won't run forever
    let nr = numOfCellsToRemove;
    while (nr > 0 && attemts > 0) {
        let i = Math.floor(Math.random() * boardSize);
        let o = Math.floor(Math.random() * boardSize);

        if (difficulty == 2) {      // hard allows non unique solutions
            if (board[i][o] != 0) {
                nr--;
                board[i][o] = 0;
            }
        }
        else {
            let asd;
            if (board[i][o] != 0) {
                // removes one cell
                nr--;
                asd = board[i][o];
                board[i][o] = 0;

                // if there is no unique solution undoes the previous
                if (!isUnique()) {
                    nr++;
                    board[i][o] = asd;
                }
            }
        }

        attemts--;
    }

    renderBoard();
}

function isUnique() {
    let tmp = [];
    currentNumOfSolutions = 0;

    for (let i = 0; i < boardSize; i++) {
        let a = [];
        for (let o = 0; o < boardSize; o++) {
            a.push(board[i][o]);
        }
        tmp.push(a);
    }

    solve(0,0,2);

    board = tmp;

    return currentNumOfSolutions == 1;
}

function checkForMistakes() {
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
}

function checkBoard() {
    checkForMistakes();
    toggleNoSolution();
}

function toggleNoSolution() {
    if (currentNumOfSolutions > 0) {
        document.querySelector(".noSolution").classList.add("notVisible");
    }
    else {
        document.querySelector(".noSolution").classList.remove("notVisible");
    }
}

function removeMistakeMarkers() {
    for (let i = 0; i < boardSize; i++) {
        for (let o = 0; o < boardSize; o++) {
            document.getElementById(("cell"+(String)(i*boardSize+o+1))).classList.remove("mistake");
        }
    }
}

function clearBoard() {
    initBoard();

    document.querySelector(".noSolution").classList.add("notVisible");

    removeMistakeMarkers();
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

    if (!board.includes(0)) {
        // checkForMistakes()
    }
}

function setDifficultyEasy() {
    diffButtons.forEach(element => {
        element.classList.remove("selectedButton");
    });
    difficulty = 0;
    numOfCellsToRemove = 30;
    diffButtons[difficulty].classList.add("selectedButton");
}

function setDifficultyMedium() {
    diffButtons.forEach(element => {
        element.classList.remove("selectedButton");
    });
    difficulty = 1;
    numOfCellsToRemove = 40;
    diffButtons[difficulty].classList.add("selectedButton");
}

function setDifficultyHard() {
    diffButtons.forEach(element => {
        element.classList.remove("selectedButton");
    });
    difficulty = 2;
    numOfCellsToRemove = 50;
    diffButtons[difficulty].classList.add("selectedButton");
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
    
    diffButtons.push(document.querySelector("#easyDifficulty"));
    diffButtons.push(document.querySelector("#mediumDifficulty"));
    diffButtons.push(document.querySelector("#hardDifficulty"));
    diffButtons[0].addEventListener("click", setDifficultyEasy);
    diffButtons[1].addEventListener("click", setDifficultyMedium);
    diffButtons[2].addEventListener("click", setDifficultyHard);
}

function main() {
    initBoard();
    addEventListeners();
    setDifficultyEasy();
    renderBoard();
}