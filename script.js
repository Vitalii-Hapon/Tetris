const gameScore = document.getElementById('score'),
    gameLevel = document.getElementById('level'),
    nextTetroElem = document.getElementById("next-tetro"),
    startBtn = document.getElementById("start"),
    pauseBtn = document.getElementById("pause"),
    gameOver = document.getElementById("game-over");

let main = document.querySelector('.main'),
    // newLine = new Array(10).fill(0),
    // playfield = Array(20).fill(newLine),
    playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    score = 0,
    currentLevel = 1,
    isPaused = true,
    gameTimerID,
    possibleLevels = {
        1: {
            scorePerLine: 10,
            speed: 450,
            nextLevelScore: 40
        },
        2: {
            scorePerLine: 15,
            speed: 400,
            nextLevelScore: 100
        },
        3: {
            scorePerLine: 20,
            speed: 350,
            nextLevelScore: 200
        },
        4: {
            scorePerLine: 30,
            speed: 300,
            nextLevelScore: 400,
        },
        5: {
            scorePerLine: 40,
            speed: 250,
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
    },
    activeTetro = getNewTetro(),
    nextTetro = getNewTetro();

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

function drawNextTetro() {
    let nextTetroInnerHTML = "";
    for (let y = 0; y < nextTetro.shape.length; y++) {
        for (let x = 0; x < nextTetro.shape[y].length; x++) {
            if (nextTetro.shape[y][x]) {
                nextTetroInnerHTML += '<div class="cell movingCell"></div>';
            } else {
                nextTetroInnerHTML += '<div class="cell"></div>';
            }
        }
        nextTetroInnerHTML += "<br/>";
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML;
}

function getNewTetro() {
    const possibleFigures = "IOLJTSZ";
    const rand = Math.floor(Math.random() * 7);
    const newTetro = figures[possibleFigures[rand]];

    return {
        x: Math.floor((playfield[0].length - newTetro.length) / 2),
        y: 0,
        shape: newTetro
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

function addActiveTetro() {
    removePrevTetro();
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] === 1) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
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
        }
        fullLine = true;
    }
    switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine * 2;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 4;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 4;
            break;
    }

    gameScore.innerHTML = score;

    if (score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        gameLevel.innerHTML = currentLevel;
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
}

function moveTetroDown() {
    activeTetro.y += 1;
    if (hasCollision()) {
        activeTetro.y -= 1;
        fixTetro();
        removeFullLine();
        activeTetro = nextTetro;
        if (hasCollision()) {
            reset();
        }
        nextTetro = getNewTetro();
    }
}

function dropTetro() {
    for (let y = activeTetro.y; y < playfield.length; y++) {
        activeTetro.y += 1;
        if (hasCollision()) {
            activeTetro.y -= 1;
            break;
        }
    }
    // debugger;
}

function reset() {
    isPaused = true;
    clearTimeout(gameTimerID);
    playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    draw();
    gameOver.style.display = "block";
    newGame = false;
}

document.onkeydown = function (e) {
    if (!isPaused) {
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
            case 'Space':
                dropTetro();
                break;
        }

        updateGameState();
    }
};

pauseBtn.addEventListener("click", (e) => {
    document.getElementById('pause').blur();
    if (e.target.innerHTML === "Pause") {
        e.target.innerHTML = "Keep Playing...";
        clearTimeout(gameTimerID);
    } else {
        e.target.innerHTML = "Pause";
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
    isPaused = !isPaused;
});

startBtn.addEventListener("click", (e) => {
    document.getElementById('start').blur();
    e.target.innerHTML = "Start again";
    isPaused = false;
    gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    gameOver.style.display = "none";
});

function updateGameState() {

    if (!isPaused) {
        addActiveTetro();
        draw();
        drawNextTetro();
    }
}

function startGame() {
    updateGameState();
    moveTetroDown();
    if (!isPaused) {
        updateGameState();
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
}

gameScore.innerHTML = score;
gameLevel.innerHTML = currentLevel;
draw();





