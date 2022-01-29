const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const w = canvas.width
const h = canvas.height

var mouse = { x: 0, y: 0 };
var draw = false;
const cubeSize = 120
const cubeCount = 6
const animals = [
    {
        name: 'Олень',
        color: 'red',
        id: 0,
        path: []
    },
    {
        name: 'Волк',
        color: 'green',
        id: 1,
        path: []
    },
    {
        name: 'Птеродактель',
        color: 'blue',
        id: 2,
        path: []
    },
]
const posArr = []

const startGame = () => {
    for (i = 0; posArr.length < cubeCount; i++) {
        let xPos = Math.round(Math.random() * canvas.width)
        let yPos = Math.round(Math.random() * canvas.height)

        if (xPos > canvas.width - cubeSize) xPos -= cubeSize
        if (yPos > canvas.height - cubeSize) yPos -= cubeSize
        posArr.find(e => (Math.abs(e.x - xPos) < cubeSize) && (Math.abs(e.y - yPos) < cubeSize)) ? null :
            posArr.push({
                x: xPos,
                y: yPos
            })
    }

    posArr.map((e, i) => {
        if (i >= animals.length) i = i % animals.length
        e.color = animals[i].color
        e.animal = animals[i].name
    })

    posArr.map(e => {
        context.strokeStyle = e.color
        context.strokeRect(e.x, e.y, cubeSize, cubeSize)
        context.fillText(e.animal, e.x + 10, e.y + cubeSize / 2)
    })

    canvas.addEventListener("mousedown", function (e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        const currentElem = posArr.find(elem => ((Math.abs(elem.x - mouse.x) < cubeSize) && (Math.abs(elem.y - mouse.y) < cubeSize)))
        draw = true;
        context.beginPath()
        context.strokeStyle = currentElem.color
        context.moveTo(mouse.x, mouse.y)
        console.log(posArr);
    });

    canvas.addEventListener("mousemove", function (e) {
        if (draw == true) {

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            context.lineTo(mouse.x, mouse.y);
            context.lineWidth = 5;
            context.stroke();
        }
    });

    canvas.addEventListener("mouseup", function (e) {

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
        context.closePath();
        draw = false;
    });
}

startGame()