const score = document.getElementById('score')
const restart = document.getElementById('restart')
const canvas = document.getElementById('canvas')
const resB = document.getElementById('resB')
const context = canvas.getContext('2d')
const w = canvas.width
const h = canvas.height
const modal = document.getElementById('modal')
const modalText = document.getElementById('modalText')
const closeModal = document.getElementById('closeModal')
const insideModal = document.getElementById('insideModal')
const winGames = document.getElementById('winGames')
const startBtn = document.getElementById('startGame')
const nameInput = document.getElementById('nameInput')
const saveName = document.getElementById('saveName')
const nameInp = document.getElementById('nameInp')
const table = document.getElementById('table')
const lidersList = document.getElementById('lidersList')
const changePlayer = document.getElementById('changePlayer')
const clearTable = document.getElementById('clearTable')

var menuImg = new Image()
menuImg.src = 'img/menu.jpg'
var img = new Image()
img.src = 'img/forest.jpg'
var mouse = { x: 0, y: 0 };
const cubeSize = 150
let winGamesCount = 0
let liders = JSON.parse(localStorage.getItem('liders')) || []
var audio = new Audio()

function playGame() {
    var draw = false;
    const animals = [
        {
            name: 'Олень',
            color: 'red',
            isReady: false,
            path: [],
            power: 0,
            img: 'img/olen.jpg',
            sound: 'sound/olen.mp3'
        },
        {
            name: 'Волк',
            color: 'yellow',
            isReady: false,
            path: [],
            power: 1,
            img: 'img/volk.jpg',
            sound: 'sound/volk.mp3'
        },
        {
            name: 'Ти рекс',
            color: '#8b00ff',
            isReady: false,
            path: [],
            power: 2,
            img: 'img/trex.jpg',
            sound: 'sound/trex.mp3'
        },
    ]
    const cubeCount = 2 * animals.length
    let posArr = []
    let currentElem = {}

    const restartGame = () => {
        if (nameInput.style.display = 'block') nameInput.style.display = 'none'
        if (table.style.display = 'block') table.style.display = 'none'
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
            closeModal.onclick = function () {
                modal.style.display = 'none'
                restartGame()
            }
        } else if (type === 'attention') {
            insideModal.classList.remove('success')
            insideModal.classList.add('warning')
            closeModal.onclick = function () {
                modal.style.display = 'none'
                restartGame()
            }
        } else {
            insideModal.classList.remove('success')
            insideModal.classList.add('warning')

            closeModal.onclick = function () {
                modal.style.display = 'none'
                canvas.removeEventListener("mousemove", mouseMove);
                canvas.removeEventListener("mousedown", mouseDown);
                canvas.removeEventListener("mouseup", mouseUp);
                printMenu()
                checkPlayer()
            }
        }
    }

    const checkPlayer = () => {
        document.body.style.cursor = 'auto';
        const playerName = localStorage.getItem('playerName')
        if (!playerName) {
            nameInput.style.display = 'block'
            saveName.onclick = function () {
                localStorage.setItem('playerName', nameInp.value)
                liders.push({
                    name: nameInp.value,
                    score: winGamesCount
                })
                checkPlayer()
            }
        } else {
            liders.map(e => { if (e.name === playerName && e.score < winGamesCount) e.score = winGamesCount })
            liders.sort(function (a, b) {
                return b.score - a.score
            })
            localStorage.setItem('liders', JSON.stringify(liders))
            printTable()
            changePlayer.onclick = function () {
                localStorage.removeItem('playerName')
                restartGame()
            }
            clearTable.onclick = function () {
                localStorage.removeItem('liders')
                localStorage.removeItem('playerName')
                liders = []
                printTable()
            }
            winGamesCount = 0
            winGames.innerHTML = winGamesCount
        }
    }

    const printTable = () => {
        if (nameInput.style.display = 'block') nameInput.style.display = 'none'
        table.style.display = 'block'
        lidersList.innerHTML = ''
        liders.map(e => {
            let h3 = document.createElement('h3')
            h3.innerText = e.name + ' : ' + e.score
            lidersList.appendChild(h3)
        })
    }

    const endGame = (text) => {
        draw = false;
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
            e.sound = animals[i].sound
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

        canvas.addEventListener("mousemove", mouseMove);

        canvas.addEventListener("mousedown", mouseDown);

        canvas.addEventListener("mouseup", mouseUp);
    }

    function mouseDown(e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        currentElem = posArr.find(elem => (
            ((mouse.x - elem.x) < cubeSize) && ((mouse.x - elem.x) > 0)
            && ((mouse.y - elem.y) < cubeSize) && (mouse.y - elem.y) > 0))
        draw = true;
        audio.src = currentElem.sound
        audio.play()
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
                        const remain = 1000 - winGamesCount
                        openModal('Ого, уже целых ' + winGamesCount + ' побед подряд, да ты молодец!! Ещё ' + remain + ' побед и мы покажем тебе мультфильм!', 'success')
                    }
                }
                score.innerText = animals.filter(e => e.isReady).length + '/' + animals.length
            }
        } else if (currentElem && !nextElem) {
            openModal('животное ' + currentElem.animal + ' заблудилось и его съели более сильные дикие звери')
        } else openModal('не делайте так', 'attention')
    }

    restart.onclick = restartGame
    startGame()
}

const printMenu = () => {
    context.drawImage(menuImg, 0, 0, w, h);
}

startBtn.onclick = function () {
    playGame()
    startBtn.style.display = 'none'
    resB.style.display = 'block'
}

menuImg.addEventListener("load", function () {
    printMenu()
});