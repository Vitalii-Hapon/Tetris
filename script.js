let main = document.querySelector('.main');

let playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
];

let gameSpeed = 150;
let newLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
let activeTetro = {
    x: 0,
    y: 0,
    shape: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
};

function removePrevTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
}

function addActiveTetro() {
    removePrevTetro();
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x]) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
}

function draw() {
    let mainInnerHTML = '';

    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            switch (playfield[y][x]) {
                case 1:
                    mainInnerHTML += '<div class="cell movingCell"></div>';
                    break;
                case 2:
                    mainInnerHTML += '<div class="cell fixedCell"></div>';
                    break;
                default:
                    mainInnerHTML += '<div class="cell"></div>';
            }
        }
    }
    main.innerHTML = mainInnerHTML;
}

// function canContinueGame() {
//     if (playfield[0].reduce(function (a, b) {
//         return a + b;
//     }) > 2) {
//         return false;
//     }
// }

function canMoveTetroDawn() {
    for (let y = playfield.length - 1; y >= 0; y--) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                if (y === playfield.length - 1 || playfield[y + 1][x] === 2) {
                    return false
                }
            }
        }
    }
    return true;
}

function moveTetroDown() {
    if (canMoveTetroDawn()) {
        for (let y = playfield.length - 1; y >= 0; y--) {
            for (let x = 0; x < playfield[y].length; x++) {
                if (playfield[y][x] === 1) {
                    playfield[y + 1][x] = 1;
                    playfield[y][x] = 0;
                }
            }
        }
    } else fixTetro();
}

function canMoveTetroLeft() {
    for (let y = playfield.length - 1; y >= 0; y--) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                if (x === 0 || playfield[y][x - 1] === 2) {
                    return false
                }
            }
        }
    }
    return true;
}

function moveTetroLeft() {
    if (canMoveTetroLeft()) {
        for (let y = playfield.length - 1; y >= 0; y--) {
            for (let x = 0; x < playfield[y].length; x++) {
                if (playfield[y][x] === 1) {
                    playfield[y][x - 1] = 1;
                    playfield[y][x] = 0;
                }
            }
        }
    }
}

function canMoveTetroRight() {
    for (let y = playfield.length - 1; y >= 0; y--) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                if (x === playfield[y].length - 1 || playfield[y][x + 1] === 2) {
                    return false;
                }
            }
        }
    }
    return true;
}

function moveTetroRight() {
    if (canMoveTetroRight()) {
        for (let y = playfield.length - 1; y >= 0; y--) {
            for (let x = playfield[y].length - 1; x >= 0; x--) {
                if (playfield[y][x] === 1) {
                    playfield[y][x + 1] = 1;
                    playfield[y][x] = 0;
                }
            }
        }
    }
}

function fixTetro() {
    for (let y = playfield.length - 1; y >= 0; y--) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 2;
            }
        }
    }

    removeFullLine();

    newTetro();
}

function removeFullLine() {
    let fullLine = true;
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                fullLine = false;
                break;
            }
        }
        if (fullLine) {
            playfield.splice(y, 1);
            playfield.splice(0, 0, newLine);
        }
        fullLine = true;
    }
}

function newTetro() {
    playfield[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
    playfield[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];

}

function playGame() {
    moveTetroDown();
    draw();
    startGame();
}

function startGame() {
    setTimeout(playGame, gameSpeed);
}

addActiveTetro();
draw();

// startGame();

function hasCollision() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (
                activeTetro.shape[y][x] &&
                (playfield[activeTetro.y + y] === undefined ||
                    playfield[activeTetro.y + y][activeTetro.x + x] === undefined)) {
                return true;
            }
        }
    }
    return false;
}

document.onkeydown = function (e) {
    switch (e.code) {
        case 'ArrowDown':
            activeTetro.y += 1;
            if (hasCollision()) {
                activeTetro.y -= 1;
            }
            break;
        case 'ArrowUp':
            console.log('Up');
            break;
        case 'ArrowRight':
            activeTetro.x += 1;
            if (hasCollision()) {
                activeTetro.x -= 1;
            }
            break;
        case 'ArrowLeft':
            activeTetro.x -= 1;
            if (hasCollision()) {
                activeTetro.x += 1;
            }
            break;
        default:
            return;
    }
    addActiveTetro();
    draw();
};




