const createCanvas = require('./createCanvas.js')
const { createModel } = require('./model.js')
// const REPLICATION_PROBABILITY = 0.5
const SPEED = 50
const WIDTH = 101

const model = createModel((WIDTH - 1) / 2)
const canvas = createCanvas(WIDTH, WIDTH)
document.body.appendChild(canvas.canvas)

canvas.render(model)

setInterval(() => {
    model.update()
    canvas.render(model)
}, SPEED)


const controlbox_width = 400,
    controlbox_height = 400,
    n_grid_x = 12,
    n_grid_y = 12
margin = 10;

const controlDiv = document.createElement("div")
controlDiv.setAttribute("id", "cxpbox_swarmalators_controls")
controlDiv.setAttribute("class", "button")

document.body.appendChild(controlDiv)
var controls = d3.selectAll("#cxpbox_swarmalators_controls").append("svg")
    .attr("width", controlbox_width)
    .attr("height", controlbox_height)
    .attr("class", "explorable_widgets")
var reset = { id: "b3", name: "", actions: ["rewind"], value: 0 };

const resetButton = widget.button(reset).update((e) => {
    console.log('button was clicked', e)
    model.init()
})

//  const el =  widget.buttonElement(resetButton)
var g = widget.grid(controlbox_width, controlbox_height, n_grid_x, n_grid_y);
var buttonblock = g.block({ x0: 6, y0: 10, width: 2, height: 0 }).Nx(2);
//controls.append(g)
const buttons = [resetButton]
var bu = controls.selectAll(".button").data(buttons).enter().append(widget.buttonElement).attr("transform", function (d, i) { return "translate(" + buttonblock.x(i) + "," + buttonblock.y(0) + ")" });


//document.body.appendChild(el)
console.log('button', buttonblock, bu, resetButton, widget.buttonElement(resetButton))
//document.body.appendChild(resetButton)
