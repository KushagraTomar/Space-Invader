const grid = document.querySelector('.grid')
const result = document.querySelector('.result')
let currShooterPos = 202
let width = 15
let direction = 1
let invaderId
let removed = []
let results = 0
for(let i=0;i<225;i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw() {
    for(let i=0;i<alienInvaders.length;i++) {
        if(!removed.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}
draw()

function remove() {
    for(let i=0;i<alienInvaders.length;i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

squares[currShooterPos].classList.add('shooter')

function moveShooter(e) {
    squares[currShooterPos].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft':
            if (currShooterPos % width != 0) currShooterPos -= 1
            break
        case 'ArrowRight':
            if (currShooterPos % width < width - 1) currShooterPos += 1
            break
    }
    squares[currShooterPos].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

let goingRight = true

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width == 0
    const rightEdge = alienInvaders[alienInvaders.length-1] % width == width - 1
    remove()

    if(rightEdge && goingRight) {
        for(let i=0;i<alienInvaders.length;i++) {
            alienInvaders[i] += width+1
            direction = -1
            goingRight = false
        }
    }
    if(leftEdge && !goingRight) {
        for(let i=0;i<alienInvaders.length;i++) {
            alienInvaders[i] += width-1
            direction = 1
            goingRight = true
        }
    }

    for(let i=0;i<alienInvaders.length;i++) {
        alienInvaders[i] += direction
    }
    draw()

    if(squares[currShooterPos].classList.contains('invader','shooter')) {
        result.innerHTML = 'GAME OVER!'
        clearInterval(invaderId)
    }

    // if invaders goes beyond the shooter
    for(let i=0;i<alienInvaders.length;i++) {
        if(alienInvaders[i] > (squares.length)) {
            result.innerHTML = 'GAME OVER!'
            clearInterval(invaderId)
        }
    }
    if(alienInvaders.length == removed.length) {
        result.innerHTML = 'YOU WON!'
        clearInterval(invaderId)
    }
}
invaderId = setInterval(moveInvaders,500)

function toShoot(e) {
    let laserId
    let currLaserPos = currShooterPos
    function moveLaser() {
        squares[currLaserPos].classList.remove('laser')
        currLaserPos -= width
        squares[currLaserPos].classList.add('laser')

        if(squares[currLaserPos].classList.contains('invader')) {
            squares[currLaserPos].classList.remove('laser')
            squares[currLaserPos].classList.remove('invader')
            squares[currLaserPos].classList.add('boom')

            setTimeout(()=> squares[currLaserPos].classList.remove('boom'),300)
            clearInterval(laserId)

            const alienRemove = alienInvaders.indexOf(currLaserPos)
            removed.push(alienRemove)
            results++
            result.innerHTML = results
        }

    }
    switch(e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser,100)
    }
}
document.addEventListener('keydown', toShoot)