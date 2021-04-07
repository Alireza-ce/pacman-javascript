import {
    layout
} from './layout.js';

const width = 28;
var score = Number(document.querySelector('.score').innerHTML)
var pacmanCurrentIndex = 490;
var gameIsStarted = false;

var squares = []

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');

    function InitialLayout() {
        layout.forEach((element, index) => {
            const square = document.createElement('div');
            grid.appendChild(square);
            squares.push(square);
            if (element === 0) {
                squares[index].classList.add('pac-dot')
            } else if (element === 1) {
                squares[index].classList.add('wall')
            } else if (element === 3) {
                squares[index].classList.add('power-pellet')
            }
        });
    }

    InitialLayout();



    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.interval = this.speed;
        }
    }
    squares[pacmanCurrentIndex].classList.add('pac-man')
    document.addEventListener('keyup', movePacman);
    var ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
    ]
    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.add(ghost.className)
        squares[ghost.currentIndex].classList.add('ghost')
    })

    document.getElementById("startButton").addEventListener("click", function () {
        startGame(ghosts)
    });
    document.getElementById("stopButton").addEventListener("click", function () {
        stopGame(ghosts);
    });
})

function stopGame(ghosts) {
    if (gameIsStarted) {
        gameIsStarted = false;
        ghosts.forEach(ghost => {
            clearInterval(ghost.interval)
        })
    }
}

function startGame(ghosts) {
    if (!gameIsStarted) {
        gameIsStarted = true
        ghosts.forEach(ghost => {
            moveGhost(ghost, ghosts)
        })
    }
}

function movePacman(e) {
    if (!gameIsStarted) {
        return
    }
    squares[pacmanCurrentIndex].classList.remove('pac-man')
    squares[pacmanCurrentIndex].classList.remove('to-right')
    squares[pacmanCurrentIndex].classList.remove('to-left')
    squares[pacmanCurrentIndex].classList.remove('to-down')
    squares[pacmanCurrentIndex].classList.remove('to-up')
    switch (e.keyCode) {
        case 37:
            if (
                pacmanCurrentIndex % width !== 0 &&
                !squares[pacmanCurrentIndex - 1].classList.contains('wall') &&
                !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair')
            )
                pacmanCurrentIndex -= 1
            squares[pacmanCurrentIndex].classList.add('to-left')
            if (squares[pacmanCurrentIndex - 1] === squares[363]) {
                pacmanCurrentIndex = 391
            }
            break
        case 38:
            if (
                pacmanCurrentIndex - width >= 0 &&
                !squares[pacmanCurrentIndex - width].classList.contains('wall') &&
                !squares[pacmanCurrentIndex - width].classList.contains('ghost-lair')
            )
                pacmanCurrentIndex -= width
            squares[pacmanCurrentIndex].classList.add('to-up')
            break
        case 39:
            if (
                pacmanCurrentIndex % width < width - 1 &&
                !squares[pacmanCurrentIndex + 1].classList.contains('wall') &&
                !squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair')
            )
                pacmanCurrentIndex += 1
            squares[pacmanCurrentIndex].classList.add('to-right')
            if (squares[pacmanCurrentIndex + 1] === squares[392]) {
                pacmanCurrentIndex = 364
            }
            break
        case 40:
            if (
                pacmanCurrentIndex + width < width * width &&
                !squares[pacmanCurrentIndex + width].classList.contains('wall') &&
                !squares[pacmanCurrentIndex + width].classList.contains('ghost-lair')
            )
                pacmanCurrentIndex += width
            squares[pacmanCurrentIndex].classList.add('to-down')
            break
    }
    squares[pacmanCurrentIndex].classList.add('pac-man')
    pacDotEaten()
    //checkForWin()
}

function pacDotEaten() {
    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
        score += 1
        document.querySelector('.score').innerHTML = score;
        squares[pacmanCurrentIndex].classList.remove('pac-dot')
    } else if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
        score += 3;
        document.querySelector('.score').innerHTML = score;
        squares[pacmanCurrentIndex].classList.remove('power-pellet')
    }
}



function moveGhost(ghost, ghosts) {
    if (!gameIsStarted) {
        return
    }
    let directions = [1, -1, width, -width]
    let ghostNextMove = Math.floor(Math.random() * directions.length);
    ghost.interval = setInterval(() => {
        checkForGameOver(ghost, ghosts)
        if (!squares[ghost.currentIndex + directions[ghostNextMove]].classList.contains('ghost') &&
            !squares[ghost.currentIndex + directions[ghostNextMove]].classList.contains('wall')) {
            squares[ghost.currentIndex].classList.remove(ghost.className)
            squares[ghost.currentIndex].classList.remove('ghost')
            ghost.currentIndex += directions[ghostNextMove]
            squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
        } else {
            ghostNextMove = Math.floor(Math.random() * directions.length);
        }
    }, ghost.speed)

}

function checkForGameOver(ghost, ghosts) {
    if (ghost.currentIndex == pacmanCurrentIndex) {
        alert('You can continue')
    }
}