'use strict'

const MINE = '✸';
const FLAG = '🚩';
const NUM = '';

var gSafeCount = 3;
var gLiveCount = 3;
var gFlagCount = 0;
var gClickCount = 0;
var gIsWin = false;
var gIsGameOver = false;
var gIntervalId;
var gTime = 0;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
};



function initGame() {
    gIsGameOver = false;
    gIsWin = false;
    clearInterval(gIntervalId);
    gTime = 0;
    document.querySelector('h3').innerText = gTime;
    resetBoard()
}

function resetBoard() {
    document.querySelector('.safebutton').innerText = 'SAFE: 3';
    document.querySelector('.smileybtn').innerText = '🙂';
    gClickCount = 0;
    gLiveCount = 3;
    gSafeCount = 3;
    gFlagCount = gLevel.mines;
    document.querySelector('.lives').innerText = 'Lives: 👾👾👾';
    document.querySelector('.flagcount').innerText = gFlagCount;
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    buildCell(gBoard);
}



function isWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMarked && cell.isMine) continue;
            else if (cell.isShown) continue;
            else return;
        }
    }
    clearInterval(gIntervalId);
    gIsWin = true;
    document.querySelector('.smileybtn').innerText = '😎'
}

function gameOver() {
    gIsGameOver = true;
    document.querySelector('.smileybtn').innerHTML = '🤯'
    clearInterval(gIntervalId);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) renderCell(cell.location, MINE);
        }
    }

}

function rightClicked(i, j) {
    var cell = gBoard[i][j];
    if (gIsGameOver) return;
    if (gIsWin) return;
    clearInterval(gIntervalId);
    gIntervalId = setInterval(function () {
        gTime += 1
        document.querySelector('.timer').innerText = gTime;
    }, 1000);
    if (cell.isShown) return;
    gFlagCount--;
    document.querySelector('.flagcount').innerText = gFlagCount;
    if (cell.isMarked) {
        renderCell(cell.location, '');
        cell.isMarked = false;
        gFlagCount += 2;
        document.querySelector('.flagcount').innerText = gFlagCount;
        return;
    }
    renderCell(cell.location, FLAG);
    cell.isMarked = true;
    isWin();
}

function cellClicked(i, j) {
    var cell = gBoard[i][j];
    gClickCount++;
    if (gIsGameOver) return;
    if (gIsWin) return;
    if (cell.isMarked) return;
    if (cell.isShown) return;
    cell.isShown = true;
    if (!cell.isMine) expandShown(cell);
    if (cell.isMine) {
        if (gClickCount === 1) {
            resetBoard();
            cellClicked(cell.location.i, cell.location.j)
            gLiveCount++;
        }
        gLiveCount--;
        if (gLiveCount === 2) document.querySelector('.lives').innerText = 'Lives: 👾👾';
        if (gLiveCount === 1) document.querySelector('.lives').innerText = 'Lives: 👾';
        if (gLiveCount === 0) document.querySelector('.lives').innerText = '🤯🤯🤯';
        if (gLiveCount) {
            cell.isShown = false;
            return;
        }
        gameOver();
        var mineCell = document.querySelector(`.cell${i}-${j}`);
        mineCell.style.backgroundColor = 'red';
        return;
    }
    clearInterval(gIntervalId);
    gIntervalId = setInterval(function () {
        gTime += 1;
        document.querySelector('.timer').innerText = gTime;
    }, 1000);
    if (cell.isMine) renderCell(cell.location, MINE);
    if (!cell.isMine) renderCell(cell.location, cell.minesAroundCount);
    if (cell.minesAroundCount === 0) {
        var elCell = document.querySelector(`.cell${cell.location.i}-${cell.location.j}`)
        renderCell(cell.location, '')
        elCell.classList.add(`markedcell`);
    }
    isWin();
}

function expandShown(cell) {
    var count = setMinesNegsCount(gBoard, cell);
    if (count === 0) {
        for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) continue;
            for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
                if (j < 0 || j > gBoard[0].length - 1) continue;
                if (i === cell.location.i && j === cell.location.j) continue;
                var curCell = gBoard[i][j];
                if (cell.minesAroundCount === 0) {
                    var elCell = document.querySelector(`.cell${cell.location.i}-${cell.location.j}`)
                    renderCell(cell.location, '')
                    elCell.classList.add(`markedcell`);
                }
                if (curCell.isShown) continue;
                curCell.isShown = true;
                renderCell(curCell.location, curCell.minesAroundCount);
                expandShown(curCell);
            }
        }

    }

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
                location: { i: i, j: j },
            };
            locations.push(cell);
        }
    }
    var minesCount = 0;
    while (minesCount < gLevel.mines) {
        var mineIdx = getRandomIntInclusive(0, locations.length - 1);
        var curCell = locations[mineIdx];
        if (!curCell.isMine) {
            curCell.isMine = true;
            minesCount++;
        }
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
            if (i === cell.location.i && j === cell.location.j) continue;
            if (mat[i][j].isMine === true) count++;
        }
    }
    return count;
}

function showSafeCell() {
    if (gIsGameOver) {
        document.querySelector('.safebutton').innerText = 'Game Over';
        return;
    }
    if (!gSafeCount) return;
    gSafeCount--;
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isShown && !cell.isMine) emptyCells.push(cell);
        }
    }
    var safeCellIdx = getRandomIntInclusive(0, emptyCells.length - 1);
    var safeCell = emptyCells[safeCellIdx];
    var elCell = document.querySelector(`.cell${safeCell.location.i}-${safeCell.location.j}`);
    elCell.classList.add('safecell');
    setTimeout(function () {
        elCell.classList.remove('safecell')
    }, 1000);
    if (gSafeCount === 2) document.querySelector('.safebutton').innerText = 'SAFE: 2'
    if (gSafeCount === 1) document.querySelector('.safebutton').innerText = 'SAFE: 1'
    if (gSafeCount === 0) document.querySelector('.safebutton').innerText = 'No More'

}

function removeSafeCell(elCell) {
    elCell.classList.remove('safecell')
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