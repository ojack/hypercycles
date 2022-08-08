const createCanvas = require('./canvas.js')
const { createModel } = require('./model.js')
const createControls = require('./controls.js')


const config = {
    speed: 50,
    width: 161,
    scale: 3,
    numParasites: 60,
    controlbox: {
        width: 400,
        height: 400,
        gridX: 12,
        gridY: 12,
        margin: 10
    }
}

// const config = {
//     speed: 300,
//     width: 40,
//     scale: 10,
//     numParasites: 60,
//     controlbox: {
//         width: 400,
//         height: 400,
//         gridX: 12,
//         gridY: 12,
//         margin: 10
//     }
// }


const controls = createControls({
    runpause: runpause,
    reset: reset,
    addRandomParasites: addRandomParasites,
    addParasitesToCenter: addParasitesToCenter,
    render: render
}, config)
const model = createModel((config.width - 1) / 2, controls)
const canvas = createCanvas(config, controls)


document.getElementById("cxpbox_hypercycles_display").appendChild(canvas.canvas)

canvas.render(model)

let interval

function addRandomParasites() {
    model.addRandomParasites(60)
    canvas.render(model)
}

function addParasitesToCenter() {
    model.addParasitesToCenter(60)
    canvas.render(model)
}

function render() {
    canvas.render(model)
}

function runpause(d) {
    if (d.value == 1) {
        interval = setInterval(() => {
            model.update()
            canvas.render(model)
        }, config.speed)
    } else {
        clearInterval(interval)
    }
}

function reset(e) {
    model.init()
    canvas.render(model)
}




