const { getOutcomeFromProbabilities } = require('./util.js')
const { fadeSpeed } = require('./config.js')
const { speciesColor, parasiteColor, emptyColor } = require('./colormaps.js')
const CLAIM_EMPTY = 11

const STATES = {
    EMPTY: 0,
    PARASITE: 1
}
const speciesStartIndex = 2



module.exports.createModel = (w = 50, controls) => {
    const { initialDensity, speed: updateProbability, replication: replicationAmount, catalyticSupport: catalyticSupportAmount, decay: decayAmount, diffusionSteps, /*diffusion: diffusionAmount*/ } = controls.sliders
    console.log('sliders', controls.sliders, updateProbability)
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
            s.color = emptyColor
            s.replication = 0
            s.initialProbability = 0.1
        } else if (i === STATES.PARASITE) { // parasite state
            s.color = parasiteColor
            s.replication = 1
            s.initialProbability = 0
        } else {
            // generate species color from colormap
            // const index = () / (numSpecies)
            s.color = speciesColor(i - speciesStartIndex, numSpecies)
            s.replication = 1
            s.initialProbability = initialDensity.value / numSpecies

            // choose one species that this species will catalyze
            const cs = i >= numSpecies + speciesStartIndex - 1 ? speciesStartIndex : i + 1
            s.catalyticSupport[cs] = 1

            // also give catalytic support to parasite if species 1
            if (i === 2) s.catalyticSupport[STATES.PARASITE] = 1 * 2
        }
      //  s.colorHSL = RGBToHSL(s.color)
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
           
            node.prevState = STATES.EMPTY
            node.fade = 0 // amount to fade out
            node.fadeState = 0 // last color showing before fade
            if(distanceFromCenter < n/3) {
                node.state = getOutcomeFromProbabilities(outcomes, probabilities)
            } else {
                node.state = STATES.EMPTY
            }
        })

        controls.updateDiagram(SPECIES.filter((s) => s.index !== STATES.EMPTY))
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
            node.prevState = node.state
            node.state = n.state

            n.prevState = n.state
            n.state = newState
         }
        }
    }

    const replicate = (node) => {
        let newState = node.state
        let replication = replicationAmount.value
        if (node.neighborsObject) {
            const { n, nw, ne, w, e, sw, s, se } = node.neighborsObject
            const cN = SPECIES[n.state].replication * replication + c(n, ne) + c(n, nw) + c(n, w) + c(n, e)
            const cS = SPECIES[s.state].replication * replication + c(s, se) + c(s, sw) + c(s, w) + c(s, e)
            const cE = SPECIES[e.state].replication * replication + c(e, ne) + c(e, se) + c(e, n) + c(e, s)
            const cW = SPECIES[w.state].replication * replication + c(w, nw) + c(w, sw) + c(w, n) + c(w, s)

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
        const updateProb = 1 - updateProbability.value
        const empty = STATES.EMPTY
        // const newNodeState = new Array(l.nodes.length)
        l.nodes.forEach((node, i) => {
            const { state } = node
            let newState = state
          //  if(Math.random() > (1 - UPDATE_PROBABILITY)) {
            if(Math.random() > updateProb) {
                if (state !== empty) {
                    newState = decay(state)
                } else {
                    newState = replicate(node)
                }
            }
          //  newNodeState[i] = newState
            node.prevState = node.state
            node.state = newState
        })

        // l.nodes.forEach((node, i) => {
           
        // })

        for (let i = 0; i < numDiffusionSteps; i++) {
            l.nodes.forEach((node, i) => {
                diffusion(node)
            })
        }

        l.nodes.forEach((node, i) => {
           // if transtitioning to empty, start fade
           if(node.prevState !== STATES.EMPTY && node.state === STATES.EMPTY) {
            node.fade = 1
            node.fadeState = node.prevState
           } else if (node.fade > 0) {
            node.fade -= fadeSpeed
           }
        })
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


