const score = document.getElementById('score')
const restart = document.getElementById('restart')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const w = canvas.width
const h = canvas.height
const modal = document.getElementById('modal')
const modalText = document.getElementById('modalText')
const closeModal = document.getElementById('closeModal')
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
    },
    {
        name: 'Волк',
        color: 'yellow',
        isReady: false,
        path: [],
        power: 1,
    },
    {
        name: 'Птеродактель',
        color: 'orange',
        isReady: false,
        path: [],
        power: 2,
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

const openModal = (text) => {
    modal.style.display = 'flex'
    modalText.innerText = text
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
    })

    context.drawImage(img, 0, 0, w, h);

    posArr.map(e => {
        context.lineWidth = 3;
        context.strokeStyle = e.color
        context.strokeRect(e.x, e.y, cubeSize, cubeSize)
        context.fillStyle = "#fff";
        context.font = "22px Muller";
        context.fillText(e.animal, e.x, e.y + cubeSize / 2)
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
            draw = false;
            openModal('Вы вышли за рамки')
        }

        const nextElem = posArr.find(elem => (
            ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
            && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))
        if (nextElem && currentElem && nextElem.animal !== currentElem.animal) {
            context.closePath();
            draw = false;
            openModal(currentElem.animal + (currentElem.power > nextElem.power ? ' съел животное ' : ' был съеден животным ') + nextElem.animal)
        }

        let cross = animals.find(e => e.name !== currentElem.animal && e.path.find(elem => ((Math.abs(elem[0] - mouse.x) < 13) && (Math.abs(elem[1] - mouse.y) < 13))))
        if (cross) {
            openModal(currentElem.animal + (currentElem.power > cross.power ? ' съел животное ' : ' был съеден животным ') + cross.name)
            draw = false
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
                openModal('Победа!!! :))')
                winGamesCount ++
                winGames.innerText = winGamesCount
            }
            score.innerText = animals.filter(e => e.isReady).length + '/' + animals.length
        }
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