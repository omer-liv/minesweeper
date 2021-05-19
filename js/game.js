'use strict'

const MINE = '💣';
const FLAG = '🚩';
const NUM = '';

var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
};



function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    buildCell(gBoard);

}

function setEasy() {
    gLevel.size = 4;
    gLevel.mines = 2;
    initGame();
}

function setMedium() {
    gLevel.size = 8;
    gLevel.mines = 12;
    initGame();
}

function setHard() {
    gLevel.size = 12;
    gLevel.mines = 30;
    initGame();
}

function cellClicked(i, j) {
    var cell = gBoard[i][j]
    cell.isShown = true;
    if (cell.isMine) renderCell(cell.location, MINE)
    if (!cell.isMine) renderCell(cell.location, cell.minesAroundCount)
}

function buildBoard() {
    var size = gLevel.size;
    var board = [];
    var locations = [];

    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i: i, j: j }
            };
            locations.push(cell);
        }
    }
    for(var k = 0; k < gLevel.mines; k++) {
        var mineIdx = getRandomIntInclusive(0, locations.length)
       locations[mineIdx].isMine = true;
    }

    return board;
}
function buildCell(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue;
            var count = setMinesNegsCount(board, board[i][j]);
            board[i][j].minesAroundCount = count;

        }
    }
}


function setMinesNegsCount(mat, cell) {
    var count = 0;
    for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === cell.i && j === cell.j) continue;
            if (mat[i][j].isMine === true) count++;
        }
    }
    return count;
}


