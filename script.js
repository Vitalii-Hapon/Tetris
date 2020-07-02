const gameScore = document.getElementById('score');
const gameLevel = document.getElementById('level');

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

let score = 0,
    currentLevel = 1,
    possibleLevels = {
        1: {
            scorePerLine: 10,
            speed: 400,
            nextLevelScore: 10
        },
        2: {
            scorePerLine: 15,
            speed: 300,
            nextLevelScore: 20
        },
        3: {
            scorePerLine: 20,
            speed: 200,
            nextLevelScore: 30
        },
        4: {
            scorePerLine: 30,
            speed: 100,
            nextLevelScore: 40,
        },
        5: {
            scorePerLine: 50,
            speed: 50,
            nextLevelScore: Infinity,
        },
    },
    figures = {
        O: [
            [1, 1],
            [1, 1],
        ],
        I: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        S: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        Z: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        L: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        J: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        T: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0],
        ],
    };

let activeTetro = {
    x: 0,
    y: 0,
    shape: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
};

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

function removePrevTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
}

function getNewTetro() {
    const possibleFigures = "IOLJTSZ";
    const rand = Math.floor(Math.random() * 7);
    const newTetro = figures[possibleFigures[rand]];

    return {
        x: Math.floor((playfield[0].length - activeTetro.shape[0].length) / 2),
        y: 0,
        shape: newTetro
    }
}

// function canContinueGame() {
//     if (playfield[0].reduce(function (a, b) {
//         return a + b;
//     }) > 2) {
//         return false;
//     }
// }

function moveTetroDown() {
    activeTetro.y += 1;
    if (hasCollision()) {
        activeTetro.y -= 1;
        fixTetro();
        removeFullLine();
        activeTetro = getNewTetro();
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
    activeTetro.y = 0;
}

function rotateTetro() {
    const prevTetroState = activeTetro.shape;
    activeTetro.shape = activeTetro.shape[0].map((value, index) =>
        activeTetro.shape.map((row) => row[index]).reverse()
    );
    if (hasCollision()) {
        activeTetro.shape = prevTetroState;
    }
}

function hasCollision() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (
                activeTetro.shape[y][x] &&
                (playfield[activeTetro.y + y] === undefined ||
                    playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
                    playfield[activeTetro.y + y][activeTetro.x + x] === 2)) {
                return true;
            }
        }
    }
    return false;
}

function removeFullLine() {
    let newLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        fullLine = true,
        filledLines = 0;
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
            filledLines += 1;
            switch (filledLines) {
                case 1:
                    score += 10;
                    break;
                case 2:
                    score += 10 * 3;
                    break;
                case 3:
                    score += 10 * 6;
                    break;
                default:
                    score += 10 * 12;
                    break;
            }
            gameScore.innerHTML = score;

            if (score >= possibleLevels[currentLevel].nextLevelScore) {
                currentLevel ++;
                gameLevel.innerHTML = currentLevel;
            }
        }
        fullLine = true;
    }
}

document.onkeydown = function (e) {
    switch (e.code) {
        case 'ArrowDown':
            moveTetroDown();
            break;
        case 'ArrowUp':
            rotateTetro();
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

gameLevel.innerHTML = currentLevel;

function playGame() {
    moveTetroDown();
    addActiveTetro();
    draw();
    startGame();
}

function startGame() {
    setTimeout(playGame, possibleLevels[currentLevel].speed);
}

addActiveTetro();
draw();

startGame();




