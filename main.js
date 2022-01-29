const score = document.getElementById('score')
const restart = document.getElementById('restart')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const w = canvas.width
const h = canvas.height


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
        path: []
    },
    {
        name: 'Волк',
        color: 'black',
        isReady: false,
        path: []
    },
    {
        name: 'Птеродактель',
        color: 'blue',
        isReady: false,
        path: []
    },
]
const cubeCount = 2 * animals.length
let posArr = []
let currentElem = {}

const restartGame = () => {
    animals.map(e => e.isReady = false)
    posArr = []
    currentElem = {}
    score.innerText = 0
    context.lineWidth = 2;
    startGame()
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
    })

    context.drawImage(img, 0, 0, w, h);
    // context.clearRect(0,0,w,h)

    posArr.map(e => {
        context.lineWidth = 3;
        context.strokeStyle = e.color
        context.strokeRect(e.x, e.y, cubeSize, cubeSize)
        context.fillStyle = "#fff";
        context.font = "22px Muller";
        context.fillText(e.animal, e.x, e.y + cubeSize / 2)
    })
}

canvas.addEventListener("mousedown", function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    currentElem = posArr.find(elem => (
        ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
        && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))
    draw = true;
    context.beginPath()
    context.strokeStyle = currentElem && currentElem.color
    context.moveTo(mouse.x, mouse.y)
});

canvas.addEventListener("mousemove", function (e) {
    if (draw == true) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        context.lineWidth = 5;
        context.stroke();

        // const animal = animals.find(elem => elem.name === currentElem.animal)
        // animal.path.push([mouse.x, mouse.y])

        const nextElem = posArr.find(elem => (
            ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
            && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))
        if (nextElem && currentElem && nextElem.animal !== currentElem.animal) {
            context.closePath();
            draw = false;
            alert('ИгРа ОконЧЕНа =)))')
        }
    }
});

canvas.addEventListener("mouseup", function (e) {
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
            animals.every(e => e.isReady) && alert('you win')
            score.innerText = animals.filter(e => e.isReady).length + '/' + animals.length
        }
    } else alert('Хули творишь')
});

restart.addEventListener('click', restartGame)



img.addEventListener("load", function() {
    startGame()
});