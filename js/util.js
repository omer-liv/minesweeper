'use strict'

function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var className = 'cell cell' + i + '-' + j;
            strHTML += '<td class="' + className + '" onclick="cellClicked(' + i + ',' + j + ')" oncontextmenu="rightClicked(' + i + ',' + j + ')"></td>'
        }
            strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elBorad = document.querySelector(selector);
    elBorad.innerHTML = strHTML;


}

  function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}