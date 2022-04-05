(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const SCALE = 5


module.exports = (w, h, controls) => {
  //  const showMajority = controls.toggles[0]
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h

    canvas.style.width = `${w*SCALE}px`
    canvas.style.height = `${w*SCALE}px`
    canvas.style.imageRendering = 'pixelated'
    canvas.setAttribute("class", 'explorable_display')

    const ctx = canvas.getContext('2d')

    // function that receives a model and renders it to the canvas
    const render = (model) => {
      //  console.log('rendering', model, SPECIES)
        const colorFromState = (state) => model.SPECIES[state].color

        const imageData = ctx.getImageData(0, 0, w, h)
        const data = imageData.data
      //  console.log(showMajority.value())
        const showMajority = controls.toggles[0].value()
        console.log(showMajority)
        const currState = model.lattice.nodes.map((node) => {
            //console.log(node.state, colorFromState(node.state))
            
            let speciesIndex = node.state
            // show color of majority of neighbors rather than actual cell state
            if(showMajority === true) {
                const nCount = new Array(model.SPECIES.length).fill(0)
                node.neighbors.forEach((neighbor) => { nCount[neighbor.state]++ })
                nCount[node.state]++
                
                let largest = 0
                speciesIndex = 0
                nCount.forEach((numSpecies, i) => {
                    if(i != 0 && numSpecies > largest) {
                        largest = numSpecies
                        speciesIndex = i
                    }
                })
            }
           // console.log(nCount)
            return colorFromState(speciesIndex)
            //return colorFromState(node.state)
        })

       // console.log('state', currState)
        for(var i = 0; i < data.length; i += 4) {
            data[i]     = currState[i/4].r     // red
            data[i + 1] = currState[i/4].g // Math.random()*255; // green
            data[i + 2] = currState[i/4].b// Math.random()*255; // blue
            data[i + 3] = 255 // alpha
        }
        ctx.putImageData(imageData, 0, 0);
    }

    return { render: render, canvas: canvas }
}
},{}],2:[function(require,module,exports){
const controlbox_width = 400,
    controlbox_height = 400,
    n_grid_x = 12,
    n_grid_y = 12
margin = 10;

const sliders = {
    decay: { id: "decay-slider", default: 0.2, range: [0, 1] },
    replication: { id: "replication-slider", default: 1, range: [0, 4] },
    catalyticSupport: { id: "catalytic-support-slider", name: "catalytic support", range: [0, 300], default: 100 }
}


module.exports = ({ reset, runpause, render, addRandomParasites } = {}) => {

    //document.body.appendChild(controlDiv)
    var controls = d3.select("#controls-container").append("svg")
        .attr("width", controlbox_width)
        .attr("height", controlbox_height)
        .attr("class", "explorable_widgets")

    var g = widget.grid(controlbox_width, controlbox_height, n_grid_x, n_grid_y);

    var playblock = g.block({ x0: 2, y0: 10, width: 0, height: 0 });
    var buttonblock = g.block({x0:1,y0:7.5,width:2,height:0}).Nx(2);
    var sliderblock = g.block({ x0: 5.5, y0: 5, width: 6, height: 3 }).Ny(3);
    var switchblock = g.block({x0:6.5,y0:11,width:3,height:0}).Nx(2);

    // buttons
    var playpause = { id: "b1", name: "", actions: ["play", "pause"], value: 0 };

    var playbutton = [
        widget.button(playpause).size(g.x(3)).symbolSize(0.6 * g.x(3)).update(runpause)
    ]

    var buttons = [
        widget.button({ id: "b2", name: "", actions: ["back"], value: 0 }).update(reset),
        widget.button({ id: "b3", name: "", actions: ["rewind"], value: 0 }).update(resetControls),
    ]

    var parasiteButton = [
        widget.button( { id:"b4", name:"add parasites", actions: ["record"], value: 0}).update(addRandomParasites),
    ]

    var toggles = [
        widget.toggle({id:"t1", name: "color by majority",  value: false}).update(render).label("bottom").size(10)
    ]

    var sliderwidth = sliderblock.w(),
        handleSize = 12,
        trackSize = 8;

    Object.entries(sliders).forEach(([name, slider]) => {
        !('name' in slider) && (slider.name = name)
        slider.value = slider.default
        slider.el = widget.slider(slider).width(sliderwidth).trackSize(trackSize).handleSize(handleSize)
    })

    function resetControls() {
        Object.values(sliders).forEach((slider) => {
            slider.el.click(slider.default)
        })
    }

    console.log(sliders)
  

    var pb = controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement).attr("transform", function (d, i) { return "translate(" + playblock.x(0) + "," + playblock.y(i) + ")" });

    var bu = controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement).attr("transform", function (d, i) { 
        console.log('button position', buttonblock.x(i), buttonblock.y(0), d, i)
        return "translate(" + buttonblock.x(i) + "," + buttonblock.y(0) + ")" 
    });

    var bu1 = controls.selectAll(".button .others1").data(parasiteButton).enter().append(widget.buttonElement).attr("transform", function (d, i) { 
        console.log('button position', buttonblock.x(i), buttonblock.y(0), d, i)
        return "translate(" + switchblock.x(0) + "," + switchblock.y(0) + ")" 
    });

    var spsl = controls.selectAll(".slider").data(Object.values(sliders).map((s) => s.el).reverse()).enter().append(widget.sliderElement)
        .attr("transform", function (d, i) { 
            console.log('slider position', sliderblock.x(0), sliderblock.y(i), d, i)

            return "translate(" + sliderblock.x(0) + "," + sliderblock.y(i) + ")" })
    
    var tg = controls.selectAll(".toggle").data(toggles).enter().append(widget.toggleElement)
         .attr("transform",function(d,i){return "translate("+switchblock.x(1)+","+switchblock.y(0)+")"});

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

// const REPLICATION_PROBABILITY = 0.5
const SPEED = 50
// const SPEED = 300
const WIDTH = 101
// const WIDTH = 30

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





},{"./canvas.js":1,"./controls.js":2,"./model.js":4}],4:[function(require,module,exports){
const { HSLToRGB, getOutcomeFromProbabilities } = require('./util.js')

const CLAIM_EMPTY = 11

const NUM_SPECIES = 9

const STATES = {
    EMPTY: 0,
    PARASITE: 1
}
 // when replication is the same for all species

// TO DO:
// 1. program different starting states based on paper
// 2. deal with edge cases
// 3. restart button
// 4. configurable parameters: empty probability at start, replication amount
// - add controls based on explorable styles
// - add diffusion

// QUESTIONS:
// - how to determine amount of catalytic support? where does claim empty come from? (see results states)

// const EMPTY = 0

const speciesStartIndex = 2

// colors and replication parameters for each species
const SPECIES = new Array(NUM_SPECIES + speciesStartIndex).fill(0).map((_, i) => {
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
        s.color = HSLToRGB(255 * (i - speciesStartIndex) / NUM_SPECIES, 100, 50)
        s.replication = 1
        s.initialProbability = 0.5 / NUM_SPECIES

        // choose one species that this species will catalyze
        const cs = i >= NUM_SPECIES + speciesStartIndex - 1 ? speciesStartIndex : i + 1
        s.catalyticSupport[cs] = 1 

        // also give catalytic support to parasite if species 1
       if ( i === 2) s.catalyticSupport[STATES.PARASITE] = 1*2
    }
    console.log(s)
    return s
})

console.log('species', SPECIES)

// [
//    { color: {r:255, g:255, b:255}, index: 0, replication: 0 },
//    { color: {r: 255, g: 0, b: 0}, replication: 0., index: 1 }, 
//    { color: {r: 0, g: 255, b: 0}, replication: 0., index: 2 }, 
//    { color: {r:0, g:0, b:255}, replication: 0., index: 3 }]


module.exports.createModel = (w = 50, controls) => {
    const { replication : replicationAmount, catalyticSupport: catalyticSupportAmount, decay : decayAmount } = controls.sliders
    const num_parasites = Math.floor(w/3)
    let l = lattice.square(w)
    function init() {
        const outcomes = SPECIES.map((s) => s.index)
        const probabilities = SPECIES.map((s) => s.initialProbability)
        // initialize node state
        l.nodes.forEach((node) => {
            // node.state = Math.floor(Math.random()*(SPECIES.length))
            
            node.state = getOutcomeFromProbabilities(outcomes, probabilities)
           // console.log(outcomes, probabilities, node.state)
            // store refences to neighbors in an object
            // m = row and n = column
            // for now, only calculate if node as all 8 neighbors
            // @todo deal with edge cases
            const neighbors = node.neighbors
            if (neighbors.length >= 8) {
                node.neighborsObject = {
                    nw: neighbors.filter((_nb) => _nb.m == node.m - 1 && _nb.n == node.n - 1)[0],
                    n: neighbors.filter((_nb) => _nb.m == node.m - 1 && _nb.n == node.n)[0],
                    ne: neighbors.filter((_nb) => _nb.m == node.m - 1 && _nb.n == node.n + 1)[0],
                    w: neighbors.filter((_nb) => _nb.m == node.m && _nb.n == node.n - 1)[0],
                    e: neighbors.filter((_nb) => _nb.m == node.m && _nb.n == node.n + 1)[0],
                    sw: neighbors.filter((_nb) => _nb.m == node.m + 1 && _nb.n == node.n - 1)[0],
                    s: neighbors.filter((_nb) => _nb.m == node.m + 1 && _nb.n == node.n)[0],
                    se: neighbors.filter((_nb) => _nb.m == node.m + 1 && _nb.n == node.n + 1)[0],
                }
            }
        })
    }

    function addParasite(index) {
        l.nodes[index].state = STATES.PARASITE
    }

    function addRandomParasites (nParasites = 50) {
        for(let i = 0; i < nParasites; i++) {
            let index = Math.floor(Math.random() * l.nodes.length)
            // add parasite at index
            l.nodes[index].state = STATES.PARASITE
        }
    }

    init()

    const decay = (state) => Math.random() < decayAmount.value ? STATES.EMPTY : state

    // from paper, c[x,y] is the catalytic support x gets from y 
    // if x is empty, gets no catalytic support from neighbors
    const c = (x, y) => {
      //  const xS = SPECIES[x.state]
        const yS = SPECIES[y.state]
        // console.log(x, y)
      //   console.log(xS.catalyticSupport, y, xS.catalyticSupport[y.state])
      return yS.catalyticSupport[x.state] ? yS.catalyticSupport[x.state] * catalyticSupportAmount.value : 0

       // return xS.catalyticSupport[y.state] ? xS.catalyticSupport[y.state] * catalyticSupportAmount.value : 0
    }
    // use "c" to refer to claims parameters as defined in paper
    /* If the cell is empty:
     p(empty) = Claim .,,,,/L p(N) = Claim N/Z Claims; p(S) = Claim& Claims; p(W) = Claim,/X Claims; p(E) = Claim n/Z Claims;
     Claims (no replication);
        In which:
     C Claims = Claim,,,,,+ClaimN+Claims+Claimw+Claim,;
     Claim. =self[N]+c[N,NE]+c[N,NW]+c[N,E]+c[N,WI; Claims = self [S] + c[S,SE] + c[S,SW] + $3, E] + c[S,WI;
     Claim w = self [W] + c[W, NW] + c[W, SW] + c[W, N] + c[W, S]; Claim n = self [El + c[E, NE] + c[E, SE] + c[E, N] + c[E, S];
      */

    const replicate = (node) => {
        let newState = node.state
        if (node.neighborsObject) {
            const { n, nw, ne, w, e, sw, s, se } = node.neighborsObject
            const cN = SPECIES[n.state].replication * replicationAmount.value + c(n, ne) + c(n, nw) + c(n, w) + c(n, e)
            const cS = SPECIES[s.state].replication * replicationAmount.value  + c(s, se) + c(s, sw) + c(s, w) + c(s, e)
            const cE = SPECIES[e.state].replication * replicationAmount.value  + c(e, ne) + c(e, se) + c(e, n) + c(e, s)
            const cW = SPECIES[w.state].replication * replicationAmount.value  + c(w, nw) + c(w, sw) + c(w, n) + c(w, s)

            const cSum = cN + cS + cE + cW + CLAIM_EMPTY

            // calculate probabilities of next state based on claims from neighboring states
            const pEmpty = CLAIM_EMPTY / cSum
            const pN = cN / cSum
            const pS = cS / cSum
            const pE = cE / cSum
            const pW = cW / cSum

            const r = Math.random()

            newState = getOutcomeFromProbabilities([STATES.EMPTY, n.state, s.state, e.state, w.state], [pEmpty, pN, pS, pE, pW])
            // if(r < pEmpty) {
            //     newState = EMPTY
            // } else if ( r < pEmpty + pN ) {
            //     // north neighbor replicates into this cell
            //     newState = n.state
            // } else if ( r < pEmpty + pN + pS ) {
            //     newState = s.state
            // } else if ( r < pEmpty + pN + pS + pE ) {
            //     newState = e.state
            // } else {
            //     newState = w.state
            // }
            //console.log('claims', cN, cS, cE, cW, cSum)
           //  console.log('probs', pEmpty, pN, pS, pE, pW)

        }
        return newState
        // const sumClaims = 
        // const pEmpty = 
    }

    const update = () => {
        const newNodeState = new Array(l.nodes.length)
        l.nodes.forEach((node, i) => {
            const { state } = node
            let newState = state
            if (state !== STATES.EMPTY) {
                newState = decay(state)
            } else {
                newState = replicate(node)
            }
            newNodeState[i] = newState
           //console.log(state, newState)

        })

        l.nodes.forEach((node, i) => {
            node.state = newNodeState[i]
        })
    }

    return {
        lattice: l,
        update: update,
        SPECIES: SPECIES,
        init: init,
        addRandomParasites: addRandomParasites
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
