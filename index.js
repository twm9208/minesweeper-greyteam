var components = {
    num_of_rows : 12,
    num_of_cols : 20,
    num_of_bombs : 40,
    num_of_flags : 0,
    bomb : '💣',
    flag : '🚩',
    alive : true,
    placing : false,
    score : 0,
    colors : {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'grey'}
}

function startGame() {
    var code = window.prompt("Enter code or leave blank for random");
    if (code == ""){
        components.bombs = placeBombs();
    } else {
        components.bombs = loadCode(code);
    }
    document.getElementById('field').appendChild(createTable());
    // document.getElementById("score").innerHTML = "JSON.stringify(Math.ceil(components.score)) + "%"";
    document.getElementById("score").innerHTML = "0/100"
    document.getElementById("placing").innerHTML = JSON.stringify(components.placing);
    document.getElementById("bombs").innerHTML = JSON.stringify(components.num_of_bombs);
    document.getElementById("flags").innerHTML = JSON.stringify(components.num_of_flags);
}

function loadCode(code) {
    bombs = [];
    count = 0;
    index = 0;
    binaryString = decodeB64(code);
    for (i=0; i<components.num_of_rows; i++){
        bombs[i] = []
        for (j=0; j<components.num_of_cols; j++){
            bombs[i][j] = false;
            if (binaryString[index] == "1"){
                bombs[i][j] = true;
                count += 1;
            } 
            index += 1;
        }
    }
    components.num_of_bombs = count;
    return bombs;
}

function generateCode() {
    var string = ""
    for (i=0; i<components.num_of_rows; i++){
        for (j=0; j<components.num_of_cols; j++){
            var cell = components.bombs[i][j];
            if (cell == true){
                string += 1;
            } else {
                string += 0;
            }
        }
    }
    var code = encodeB64(string)
    document.getElementById("code").innerHTML = JSON.stringify(code);
}

function decodeB64(base64String) {
    const binaryData = atob(base64String).split('').map(char => char.charCodeAt(0));
    const binaryString = binaryData.map(byte => byte.toString(2).padStart(8, '0')).join('');
    return binaryString

}

function encodeB64(binaryString) {
    const binaryData = new Uint8Array(binaryString.length / 8);
    for (i = 0; i < binaryString.length; i += 8) {
        binaryData[i / 8] = parseInt(binaryString.substr(i, 8), 2);
    }
    const base64Data = btoa(String.fromCharCode.apply(null, binaryData));
    const base64String = String(base64Data);
    return base64String;
}

function togglePlacing() {
    if (components.placing == true){
        components.placing = false;
        hideBombs();
    } 
    else {
        components.placing = true;
        showBombs();
    }
    document.getElementById("placing").innerHTML = JSON.stringify(components.placing);
}

function getTable() {
    var field = document.getElementById("field");
    var table = field.getElementsByTagName('table')[0];
    return table;
}

function showBombs() {
    var table = getTable();

    for (i = 0; i < components.num_of_rows; i++){
        for (j = 0; j < components.num_of_cols; j++){
            cell = table.rows[i].cells[j]
            if (components.bombs[i][j]){
                cell.textContent = components.bomb;
                cell.bomb = true;
            }
        }
    }
}


function hideBombs() {
    var table = getTable();

    for (i = 0; i < components.num_of_rows; i++){
        for (j = 0; j < components.num_of_cols; j++){
            cell = table.rows[i].cells[j]
            if (components.bombs[i][j] && cell.textContent != components.flag){
                cell.textContent = ""
            }
        }
    }
}


function placeBombs() {
    var i, j, rows = [];
    
    for (i=0; i<components.num_of_rows; i++) {
        rows[i] = []
        for (j=0; j<components.num_of_cols; j++){
            rows[i][j] = false;
        }
    }

    for (i=0; i<components.num_of_bombs; i++) {
        placeSingleBomb(rows);

    }
    return rows;
} 


function placeSingleBomb(bombs) {

    var nrow, ncol, row, col;
    nrow = Math.floor(Math.random() * components.num_of_rows);
    ncol = Math.floor(Math.random() * components.num_of_cols);
    row = bombs[nrow];
    
    if (!row) {
        row = [];
        bombs[nrow] = row;
    }
    
    col = row[ncol];
    
    if (!col) {
        row[ncol] = true;
        return
    } 
    else {
        placeSingleBomb(bombs);
    }
}

function cellID(i, j) {
    return 'cell-' + i + '-' + j;
}

function createTable() {
    var table, row, td, i, j;
    table = document.createElement('table');
    var starter = true
    for (i=0; i<components.num_of_rows; i++) {
        row = document.createElement('tr');
        for (j=0; j<components.num_of_cols; j++) {
            td = document.createElement('td');
            td.id = cellID(i, j);
            row.appendChild(td);
            addCellListeners(td, i, j);
            if (starter === true && adjacentBombs(i,j) == 0 && i > 1 && j > 1){
                td.style.backgroundColor = 'green';
                starter = false;
            }
        }
        table.appendChild(row);
    }
    return table;
}

function addCellListeners(td, i, j) {
    td.addEventListener('mousedown', function(event) {
        if (!components.alive) {
            return;
        }
        components.mousewhiches += event.which;
        if (event.which === 3) {
            return;
        }
        if (this.flagged) {
            return;
        }
    });

    td.addEventListener('mouseup', function(event) {
      
        if (!components.alive) {
            return;
        }

        if (this.clicked && components.mousewhiches == 2) {
            performMassClick(this, i, j);
            return;
        }

        components.mousewhiches = 0;
        
        if (event.which === 3) {
            if (components.placing == false){
                if (this.clicked) {
                    return;
                }
                if (this.flagged) {
                    this.flagged = false;
                    components.num_of_flags -= 1;
                    document.getElementById("flags").innerHTML = JSON.stringify(components.num_of_flags);
                    this.textContent = '';
                } else {
                    this.flagged = true;
                    components.num_of_flags += 1;
                    document.getElementById("flags").innerHTML = JSON.stringify(components.num_of_flags);
                    this.textContent = components.flag;
                }

                event.preventDefault();
                event.stopPropagation();
            
                return false;
            } else {
                if (this.bomb) {
                    this.bomb = false;
                    components.num_of_bombs -= 1;
                    document.getElementById("bombs").innerHTML = JSON.stringify(components.num_of_bombs);
                    components.bombs[i][j] = false;
                    this.textContent = '';
                } else {
                    this.bomb = true;
                    components.num_of_bombs += 1;
                    document.getElementById("bombs").innerHTML = JSON.stringify(components.num_of_bombs);
                    components.bombs[i][j] = true;
                    this.textContent = components.bomb;
                }

                event.preventDefault();
                event.stopPropagation();
                generateCode();
                return false;
            }
        } 
        else {
            if (!this.clicked && !this.flagged){
                document.getElementById("placing-button").style.display="none";
                if (components.placing){
                    togglePlacing();
                }
                handleCellClick(this, i, j);
            }
        }
    });

    td.oncontextmenu = function() { 
        return false; 
    };
}

function handleCellClick(cell, i, j) {
    if (!components.alive) {
        return;
    }

    cell.clicked = true;

    if (components.bombs[i][j]) {
        cell.style.color = 'red';
        cell.textContent = components.bomb;
        showBombs();
        gameOver();
        
    }
    else {
        cell.style.backgroundColor = 'lightGrey';
        num_of_bombs = adjacentBombs(i, j);
        updateScore();
        if (num_of_bombs) {
            cell.style.color = components.colors[num_of_bombs];
            cell.textContent = num_of_bombs;
        } 
        else {
            clickAdjacentBombs(i, j);
        }
    }
}

function updateScore(){
    total_cells = components.num_of_cols*components.num_of_rows-components.num_of_bombs
    components.score += 1;

    strCells = JSON.stringify(total_cells);
    strEmpty = JSON.stringify(components.score);


    //document.getElementById("score").innerHTML = JSON.stringify(Math.ceil(100*components.score/total_cells)) + "%    (" + strEmpty + "/" + strCells + ")"
    document.getElementById("score").innerHTML =strEmpty + "/" + strCells    
}

function adjacentBombs(row, col) {
    var i, j, num_of_bombs;
    num_of_bombs = 0;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (components.bombs[row + i] && components.bombs[row + i][col + j]) {
                num_of_bombs++;
            }
        }
    }
    return num_of_bombs;
}

function adjacentFlags(row, col) {
    var i, j, num_flags;
    num_flags = 0;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            cell = document.getElementById(cellID(row + i, col + j));
            if (!!cell && cell.flagged) {
                num_flags++;
            }
        }
    }
    return num_flags;
}

function clickAdjacentBombs(row, col) {
    var i, j, cell;
    
    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            cell = document.getElementById(cellID(row + i, col + j));
            if (!!cell && !cell.clicked && !cell.flagged) {
                handleCellClick(cell, row + i, col + j);
            }
        }
    }
}

function performMassClick(cell, row, col) {
    if (adjacentFlags(row, col) === adjacentBombs(row, col)) {
        clickAdjacentBombs(row, col);
    }
}

function gameOver() {
    components.alive = false;
    document.getElementById('lost').style.display="block";
    
}

function reload(){
    window.location.reload();
}

window.addEventListener('load', function() {
    document.getElementById('lost').style.display="none";
    startGame();
});
