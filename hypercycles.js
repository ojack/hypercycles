(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = ({ width, scale }, controls) => {
  //  const showMajority = controls.toggles[0]
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = width

  canvas.style.backgroundColor = "#dfceaa"
  canvas.style.width = `${width * scale}px`
  canvas.style.height = `${width * scale}px`
  canvas.style.imageRendering = 'pixelated'
  canvas.setAttribute("class", 'explorable_display')

  const ctx = canvas.getContext('2d')

  // function that receives a model and renders it to the canvas
  const render = (model) => {
    const SPECIES = model.SPECIES()
    const colorFromState = (state) => SPECIES[state].color

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const showMajority = controls.toggles[0].value()
    const currState = model.lattice.nodes.map((node) => {


      let speciesIndex = node.state
      let numEmpty = 0
      // show color of majority of neighbors rather than actual cell state
      if (showMajority === true) {
        const nCount = new Array(SPECIES.length).fill(0)
        node.neighbors.forEach((neighbor) => { nCount[neighbor.state]++ })
        nCount[node.state]++

        let largest = 0
        speciesIndex = 0
        nCount.forEach((numSpecies, i) => {
          if (i === 0) {
            numEmpty = numSpecies
          } else if (numSpecies > largest) {
            // if (numSpecies > largest) { // include empty state within color by majority
            largest = numSpecies
            speciesIndex = i
          }
        })
      } else {
        numEmpty = node.state === 0? 12 :0 
      }
      return Object.assign({}, colorFromState(speciesIndex),
        { a: node.state == 0? 255 * (12 - numEmpty) / 12: 255 })
    })

    for (var i = 0; i < data.length; i += 4) {
      data[i] = currState[i / 4].r     // red
      data[i + 1] = currState[i / 4].g // Math.random()*255; // green
      data[i + 2] = currState[i / 4].b// Math.random()*255; // blue
      // data[i + 3] = 255 // alpha
      // use numEmpty in neighborhood to determine alpha
      data[i + 3] = currState[i / 4].a
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return { render: render, canvas: canvas }
}
},{}],2:[function(require,module,exports){
const sliders = {
    decay: { id: "decay-slider", default: 0.2, range: [0, 1] },
    replication: { id: "replication-slider", default: 1, range: [0, 4] },
    catalyticSupport: { id: "catalytic-support-slider", name: "catalytic support", range: [0, 300], default: 100 },
    // diffusion: { id: 'diffusion-probability-slider', name: "diffusion probability", range: [0, 1], default: 0.4 },
    diffusionSteps: { id: 'diffusion-steps-slider', name: "diffusion", range: [0, 4], default: 0 },
    initialDensity: { id: 'density-slider', name: 'initial density', range: [0.005, 0.7], default: 0.6, value: 0.6}
}

const visibleSliders = [ 'decay', 'replication', 'catalyticSupport', 'diffusionSteps' ]

module.exports = ({ reset, runpause, render, addRandomParasites, addParasitesToCenter } = {}, { width, scale }) => {
    const controlbox_width = 400,
        // controlbox_height = width * scale,
        controlbox_height = 400,
        n_grid_x = 12,
        n_grid_y = 14,
        margin = 10;

    const controls = d3.select("#cxpbox_hypercycles_controls").append("svg")
        .attr("width", controlbox_width)
        .attr("height", controlbox_height)
        .attr("class", "explorable_widgets")

    const g = widget.grid(controlbox_width, controlbox_height, n_grid_x, n_grid_y);

    const playblock = g.block({ x0: 2, y0: 11.5, width: 0, height: 0 });

    // old layout
    // const buttonblock = g.block({ x0: 1, y0: 8.5, width: 2, height: 0 }).Nx(2);
    // const sliderblock = g.block({ x0: 0.5, y0: 1, width: 5, height: 3 }).Ny(3);
    // const switchblock = g.block({ x0: 6.5, y0: 8.5, width: 3, height: 3.5 }).Ny(3);
    // const radioblock = g.block({x0:8,y0:0.5,width:0,height:6});
// 
    const buttonblock = g.block({ x0: 1, y0: 8.5, width: 2, height: 0 }).Nx(2);
    const sliderblock = g.block({ x0: 5.5, y0: 6.5, width: 5, height: 3.5 }).Ny(3);
    const triggerblock = g.block({ x0: 2, y0: 3, width: 3, height: 4.5 }).Ny(3);
    const switchblock = g.block({ x0: 1.75, y0: 2.5, width: 3, height: 2.5 }).Ny(2);
    const radioblock = g.block({x0:6,y0:1,width:0,height:3.5}).Ny(2);


    // buttons
    const playpause = { id: "b1", name: "", actions: ["play", "pause"], value: 0 };

    const playbutton = [
        widget.button(playpause).size(g.x(3)).symbolSize(0.6 * g.x(3)).update(runpause)
    ]

    const buttons = [
        widget.button({ id: "b2", name: "", actions: ["back"], value: 0 }).update(() => { reset(radioData[radioOptions.value].val)}),
        widget.button({ id: "b3", name: "", actions: ["rewind"], value: 0 }).update(resetControls),
    ]

    const parasiteButton = [
        // widget.button({ id: "b5", name: "add parasites to center", actions: ["record"], value: 0 }).label("right").update(addParasitesToCenter),
        widget.button({ id: "b4", name: "add parasites", actions: ["record"], value: 0 }).label("bottom").update(addRandomParasites)
    ]

    const toggles = [
        widget.toggle({ id: "t1", name: "color by majority", value: true }).update(render).label("bottom").size(10)
    ]

    const radioData =  [3, 6, 9].map((v) => ({label: `${v} species`, val: v}))
    const radioOptions = { id: "c1", name: "Select number of species", choices: radioData.map((v) => v.label), value: 2}

    const radios = [
        widget.radio(radioOptions).size(radioblock.h()).label("right").shape("rect").update((e) => {
            reset(radioData[radioOptions.value].val)
            // console.log('radio updated', e.value, radioOptions.value)
        })
    ]

    const sliderwidth = sliderblock.w(),
        handleSize = 12,
        trackSize = 8;

    // Object.entries(sliders).forEach(([name, slider]) => {

    visibleSliders.forEach((name) => {
        const slider = sliders[name]
        console.log(name, slider)
        !('name' in slider) && (slider.name = name)
        slider.value = slider.default
        slider.el = widget.slider(slider).width(sliderwidth).trackSize(trackSize).handleSize(handleSize)
    })

    function resetControls() {
        visibleSliders.forEach((name) =>  {
            slider = sliders[name]
            slider.el.click(slider.default)
        })
    }

    const pb = controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement).attr("transform", function (d, i) { return "translate(" + playblock.x(0) + "," + playblock.y(i) + ")" });

    const bu = controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement).attr("transform", function (d, i) {
        return "translate(" + buttonblock.x(i) + "," + buttonblock.y(0) + ")"
    });

    const bu1 = controls.selectAll(".button .others1").data(parasiteButton).enter().append(widget.buttonElement).attr("transform", function (d, i) {
        return "translate(" + triggerblock.x(0) + "," + triggerblock.y(i + 1) + ")"
    });

    const spsl = controls.selectAll(".slider").data(visibleSliders.map((name) => sliders[name]).map((s) => s.el).reverse()).enter().append(widget.sliderElement)
        .attr("transform", function (d, i) {
            return "translate(" + sliderblock.x(0) + "," + sliderblock.y(i) + ")"
        })

    const tg = controls.selectAll(".toggle").data(toggles).enter().append(widget.toggleElement)
        .attr("transform", function (d, i) { return "translate(" + switchblock.x(0) + "," + switchblock.y(0) + ")" });

        var rad = controls.selectAll(".radio .input").data(radios).enter().append(widget.radioElement)
        .attr("transform",function(d,i){return "translate("+radioblock.x(0)+","+radioblock.y(0)+")"});	
    return {
        sliders: sliders,
        buttons: buttons,
        toggles: toggles
    }
}
},{}],3:[function(require,module,exports){
const createCanvas = require('./canvas.js')
const { createModel } = require('./model.js')
const createControls = require('./controls.js')


const config = {
    speed: 50,
    width: 161,
    scale: 400/161,
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
    model.addRandomParasites(30)
    canvas.render(model)
}

function addParasitesToCenter() {
    model.addParasitesToCenter(30)
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

function reset(numSpecies = 9) {
    model.init(numSpecies)
    canvas.render(model)
}





},{"./canvas.js":1,"./controls.js":2,"./model.js":4}],4:[function(require,module,exports){
const { HSLToRGB, RGBToHSL, getOutcomeFromProbabilities } = require('./util.js')

const CLAIM_EMPTY = 11

const UPDATE_PROBABILITY = 1 // overall probability that an event will happen

const STATES = {
    EMPTY: 0,
    PARASITE: 1
}
const speciesStartIndex = 2



module.exports.createModel = (w = 50, controls) => {
    const { initialDensity, replication: replicationAmount, catalyticSupport: catalyticSupportAmount, decay: decayAmount, diffusionSteps, /*diffusion: diffusionAmount*/ } = controls.sliders
    const diffusionAmount = { value: 0.4 }
    const num_parasites = Math.floor(w / 3)
    let l = lattice.square(w).boundary("periodic")
    let SPECIES

    // colors and replication parameters for each species
    const createSpeciesArray = (numSpecies = 9) => new Array(numSpecies + speciesStartIndex).fill(0).map((_, i) => {
        // initial state, catalyticSupport is an object containing the other species that this molecule will help catalyze
        const s = { index: i, catalyticSupport: {} }
        // first state is "EMPTY" state
        if (i === STATES.EMPTY) {
            s.color = { r: 255, g: 255, b: 255 }
            s.replication = 0
            s.initialProbability = 0.5
        } else if (i === STATES.PARASITE) { // parasite state
            s.color = { r: 0, g: 0, b: 0 }
            s.replication = 1
            s.initialProbability = 0
        } else {
            // s.color = HSLToRGB(255 * (i - speciesStartIndex) / numSpecies, 100, 50)
            const index = (i - speciesStartIndex) / (numSpecies)
            const color = d3.interpolateRainbow(index)
            const c = color.replace('rgb(', '').replace(')', '').split(',').map((s) => parseFloat(s))
            s.color = { r: c[0], g: c[1], b: c[2] }

      //      s.color = HSLToRGB(255 * (i - speciesStartIndex) / numSpecies, 50, 50)
          //  console.log('color', s.color, c, index)
            s.replication = 1
            s.initialProbability = initialDensity.value / numSpecies

            // choose one species that this species will catalyze
            const cs = i >= numSpecies + speciesStartIndex - 1 ? speciesStartIndex : i + 1
            s.catalyticSupport[cs] = 1

            // also give catalytic support to parasite if species 1
            if (i === 2) s.catalyticSupport[STATES.PARASITE] = 1 * 2
        }
        s.colorHSL = RGBToHSL(s.color)
        return s
    })

    window.lattice = l
     /* 
        Given row x and y, calculate node index
    */
        const indexFromCoords = (x, y, n) => y * n + x;

        const coordsFromIndex = (i, n) => ({
            x: i%n, 
            y: Math.floor(i/n)
        })

    function init(numSpecies = 9) {
        SPECIES = createSpeciesArray(numSpecies)
      //  console.log('initing with', numSpecies, SPECIES)

        const outcomes = SPECIES.map((s) => s.index)
        const probabilities = SPECIES.map((s) => s.initialProbability)

        const n = l.L * 2 + 1 // width / height of lattice
        const center = n / 2 // center assuming square lattice

        // initialize node state
        l.nodes.forEach((node, i) => {
            const { x, y } = coordsFromIndex(i, n)
            //const i2 = indexFromCoords(x, y, n)
            const a = x - center
            const b = y - center
            const distanceFromCenter = Math.sqrt(a*a + b*b)
           
            if(distanceFromCenter < n/3) {
                node.state = getOutcomeFromProbabilities(outcomes, probabilities)
            } else {
                node.state = STATES.EMPTY
            }
        })
    }

    function addParasite(index) {
        l.nodes[index].state = STATES.PARASITE
    }

    function addRandomParasites(nParasites = 50) {
        for (let i = 0; i < nParasites; i++) {
            let index = Math.floor(Math.random() * l.nodes.length)
            // add parasite at index
            l.nodes[index].state = STATES.PARASITE
        }
    }

   
    /* 
        Add N parasites to the center of the lattice.
    */
    function addParasitesToCenter(nParasites = 50) {
        const n = l.L * 2 + 1
        const w = Math.floor(Math.sqrt(nParasites))
        const center = n / 2
        const corner = center - w / 2
        for (let i = 0; i < nParasites; i++) {
            const x = corner + (i % w)
            const y = corner + Math.floor(i / w)
            const index = indexFromCoords(x, y, n)
            l.nodes[index].state = STATES.PARASITE
        }
    }

    init()

    const decay = (state) => Math.random() < decayAmount.value ? STATES.EMPTY : state

    // from paper, c[x,y] is the catalytic support x gets from y 
    // if x is empty, gets no catalytic support from neighbors
    const c = (x, y) => {
        const yS = SPECIES[y.state]
        return yS.catalyticSupport[x.state] ? yS.catalyticSupport[x.state] * catalyticSupportAmount.value : 0
    }

    // swap positions with a random neighbor
    const diffusion = (node) => {
       if(node.state === STATES.EMPTY) {
         if (Math.random() < diffusionAmount.value) {
            const n = node.neighbors[Math.floor(Math.random() * node.neighbors.length)]
            const newState = node.state
            node.state = n.state
            n.state = newState
         }
        }
    }

    const replicate = (node) => {
        let newState = node.state
        if (node.neighborsObject) {
            const { n, nw, ne, w, e, sw, s, se } = node.neighborsObject
            const cN = SPECIES[n.state].replication * replicationAmount.value + c(n, ne) + c(n, nw) + c(n, w) + c(n, e)
            const cS = SPECIES[s.state].replication * replicationAmount.value + c(s, se) + c(s, sw) + c(s, w) + c(s, e)
            const cE = SPECIES[e.state].replication * replicationAmount.value + c(e, ne) + c(e, se) + c(e, n) + c(e, s)
            const cW = SPECIES[w.state].replication * replicationAmount.value + c(w, nw) + c(w, sw) + c(w, n) + c(w, s)

            const cSum = cN + cS + cE + cW + CLAIM_EMPTY

            // calculate probabilities of next state based on claims from neighboring states
            const pEmpty = CLAIM_EMPTY / cSum
            const pN = cN / cSum
            const pS = cS / cSum
            const pE = cE / cSum
            const pW = cW / cSum

            const r = Math.random()

            newState = getOutcomeFromProbabilities([STATES.EMPTY, n.state, s.state, e.state, w.state], [pEmpty, pN, pS, pE, pW])
        }
        return newState
    }

    const update = () => {
        const numDiffusionSteps = Math.round(diffusionSteps.value)
        const newNodeState = new Array(l.nodes.length)
        l.nodes.forEach((node, i) => {
            const { state } = node
            let newState = state
            if(Math.random() > (1 - UPDATE_PROBABILITY)) {
                if (state !== STATES.EMPTY) {
                    newState = decay(state)
                } else {
                    newState = replicate(node)
                }
            }
            newNodeState[i] = newState
        })

        l.nodes.forEach((node, i) => {
            node.state = newNodeState[i]
        })

        for (let i = 0; i < numDiffusionSteps; i++) {
            l.nodes.forEach((node, i) => {
                diffusion(node)
            })
        }
    }

    return {
        lattice: l,
        update: update,
        SPECIES: () => SPECIES,
        init: init,
        addRandomParasites: addRandomParasites,
        addParasitesToCenter: addParasitesToCenter
    }

}



},{"./util.js":5}],5:[function(require,module,exports){
module.exports.HSLToRGB = ( h,s,l) => {
    // Must be fractions of 1
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;  
          } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
          } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
          } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
          } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
          } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
          }
          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          b = Math.round((b + m) * 255);
    return { r, g, b }
  }

module.exports.RGBToHSL = ({r, g, b} = {}) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return {
      h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
      s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      l: (100 * (2 * l - s)) / 2
    };
  }

  // function that accepts an array of possible outcomes, and a set of probabilites for each outcome
module.exports.getOutcomeFromProbabilities = (outcomes = [], probabilities = []) => {
    const sum = probabilities.reduce((a, b) => a + b, 0)
    const scaledProbs = probabilities.map((p) => p/sum)
    const r = Math.random()
    let index = outcomes.length - 1
    let thresh = 0
    scaledProbs.forEach((p, i) => {
        if( r < p + thresh && i < index) {
            index = i
        }
        thresh += p
    })
    return outcomes[index]
}
},{}]},{},[3]);
