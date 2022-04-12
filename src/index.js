const createCanvas = require('./canvas.js')
const { createModel } = require('./model.js')
const createControls = require('./controls.js')

// const REPLICATION_PROBABILITY = 0.5
const SPEED = 50
// const SPEED = 300
const WIDTH = 101
// const WIDTH = 11

const controlbox_width = 400,
    controlbox_height = 400,
    n_grid_x = 12,
    n_grid_y = 12
margin = 10;

const controls = createControls({
    runpause: runpause,
    reset: reset,
    addRandomParasites: addRandomParasites,
    render: render
})
const model = createModel((WIDTH - 1) / 2, controls)
const canvas = createCanvas(WIDTH, WIDTH, controls)


document.getElementById("display-container").appendChild(canvas.canvas)

canvas.render(model)

let interval

function addRandomParasites() {
    model.addRandomParasites(10)
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
        }, SPEED)
    } else {
        clearInterval(interval)
    }
}

function reset(e) {
    model.init()
    canvas.render(model)
}




