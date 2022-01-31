const score = document.getElementById('score')
const restart = document.getElementById('restart')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const w = canvas.width
const h = canvas.height
const modal = document.getElementById('modal')
const modalText = document.getElementById('modalText')
const closeModal = document.getElementById('closeModal')
const insideModal = document.getElementById('insideModal')
const winGames = document.getElementById('winGames')


var img = new Image()
img.src = 'img/forest.jpg'
var mouse = { x: 0, y: 0 };
var draw = false;
const cubeSize = 150
const animals = [
    {
        name: 'Олень',
        color: 'red',
        isReady: false,
        path: [],
        power: 0,
        img: 'img/olen.jpg'
    },
    {
        name: 'Волк',
        color: 'yellow',
        isReady: false,
        path: [],
        power: 1,
        img: 'img/volk.jpg'
    },
    {
        name: 'Ти рекс',
        color: '#8b00ff',
        isReady: false,
        path: [],
        power: 2,
        img: 'img/trex.jpg'
    },
]
const cubeCount = 2 * animals.length
let posArr = []
let currentElem = {}
let winGamesCount = 0

const restartGame = () => {
    animals.map(e => {
        e.isReady = false
        e.path = []
    })
    posArr = []
    currentElem = {}
    score.innerText = 0
    context.lineWidth = 2;
    startGame()
}

const openModal = (text, type) => {
    modal.style.display = 'flex'
    modalText.innerText = text
    if (type === 'success') {
        insideModal.classList.remove('warning')
        insideModal.classList.add('success')
    } else {
        insideModal.classList.remove('success')
        insideModal.classList.add('warning')
    }
}

const endGame = (text) => {
    draw = false;
    winGamesCount = 0
    winGames.innerText = winGamesCount
    openModal(text)
}

const startGame = () => {
    for (i = 0; posArr.length < cubeCount; i++) {
        let xPos = Math.round(Math.random() * canvas.width)
        let yPos = Math.round(Math.random() * canvas.height)

        if (xPos > canvas.width - cubeSize) xPos -= cubeSize
        if (yPos > canvas.height - cubeSize) yPos -= cubeSize
        posArr.find(e => (Math.abs(e.x - xPos) < cubeSize) && (Math.abs(e.y - yPos) < cubeSize)) ? null :
            posArr.push({
                x: xPos,
                y: yPos,
                path: []
            })
    }

    posArr.map((e, i) => {
        if (i >= animals.length) i = i % animals.length
        e.color = animals[i].color
        e.animal = animals[i].name
        e.power = animals[i].power
        e.img = animals[i].img
    })

    context.drawImage(img, 0, 0, w, h);

    posArr.map(e => {
        context.lineWidth = 3;
        context.strokeStyle = e.color
        context.strokeRect(e.x, e.y, cubeSize, cubeSize)
        let animalImg = new Image()
        animalImg.src = e.img
        animalImg.onload = () => context.drawImage(animalImg, e.x, e.y, cubeSize, cubeSize)
    })
}

function mouseDown(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    currentElem = posArr.find(elem => (
        ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
        && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))
    draw = true;
    context.beginPath()
    context.strokeStyle = currentElem && currentElem.color
    context.moveTo(mouse.x, mouse.y)
}

function mouseMove(e) {
    if (draw == true) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        context.lineWidth = 5;
        context.stroke();

        const animal = animals.find(elem => elem.name === currentElem.animal)
        animal.path.push([mouse.x, mouse.y])

        if (w - mouse.x <= 5 || h - mouse.y <= 5 || mouse.x <= 5 || mouse.y <= 5) {
            endGame('Вы вышли за рамки')
        }

        const nextElem = posArr.find(elem => (
            ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
            && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))
        if (nextElem && currentElem && nextElem.animal !== currentElem.animal) {
            context.closePath();
            endGame(currentElem.animal + (currentElem.power > nextElem.power ? ' съел животное ' : ' был съеден животным ') + nextElem.animal + ' ((')
        }

        let cross = animals.find(e => e.name !== currentElem.animal && e.path.find(elem => ((Math.abs(elem[0] - mouse.x) < 13) && (Math.abs(elem[1] - mouse.y) < 13))))
        if (cross) {
            endGame(currentElem.animal + (currentElem.power > cross.power ? ' съел животное ' : ' был съеден животным ') + cross.name + ' ((')
        }
    } else {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        currentElem = posArr.find(elem => (
            ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
            && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))
        if (currentElem) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    }
}

function mouseUp(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    let nextElem = posArr.find(elem => (
        ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
        && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))

    context.lineTo(mouse.x, mouse.y);
    context.stroke();
    context.closePath();
    draw = false;
    if (currentElem && nextElem && currentElem.animal === nextElem.animal && currentElem.x !== nextElem.x) {
        const animal = animals.find(e => e.name === currentElem.animal)
        if (animal) {
            animal.isReady = true
            if (animals.every(e => e.isReady)) {
                openModal('Победа!!! :))', 'success')
                winGamesCount++
                winGames.innerText = winGamesCount
                if (winGamesCount % 5 === 0 && winGamesCount !== 0) {
                    const remain = 1000-winGamesCount
                    openModal('Ого, уже целых ' + winGamesCount + ' побед подряд, да ты молодец!! Ещё ' + remain + ' побед и мы покажем тебе мультфильм!', 'success')
                }
            }
            score.innerText = animals.filter(e => e.isReady).length + '/' + animals.length
        }
    } else if (currentElem && !nextElem) {
        openModal('животное ' + currentElem.animal + ' заблудилось и его съели более сильные дикие звери')
    } else openModal('не делайте так')
}

canvas.addEventListener("mousemove", mouseMove);

canvas.addEventListener("mousedown", mouseDown);

canvas.addEventListener("mouseup", mouseUp);

closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
    restartGame()
})

restart.addEventListener('click', restartGame)

img.addEventListener("load", function () {
    startGame()
});