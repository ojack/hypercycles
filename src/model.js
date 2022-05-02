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
    // console.log(s)
    return s
})

// console.log('species', SPECIES)

// [
//    { color: {r:255, g:255, b:255}, index: 0, replication: 0 },
//    { color: {r: 255, g: 0, b: 0}, replication: 0., index: 1 }, 
//    { color: {r: 0, g: 255, b: 0}, replication: 0., index: 2 }, 
//    { color: {r:0, g:0, b:255}, replication: 0., index: 3 }]


module.exports.createModel = (w = 50, controls) => {
    const { replication : replicationAmount, catalyticSupport: catalyticSupportAmount, decay : decayAmount, diffusionSteps, diffusion: diffusionAmount } = controls.sliders
    const num_parasites = Math.floor(w/3)
    // console.log('lattice width', w)
    let l = lattice.square(w).boundary("periodic")
    window.lattice = l
    function init() {
        const outcomes = SPECIES.map((s) => s.index)
        const probabilities = SPECIES.map((s) => s.initialProbability)
    //    console.log("lattice", l)
        // initialize node state
        l.nodes.forEach((node) => {
            node.state = getOutcomeFromProbabilities(outcomes, probabilities)
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

    /* 
        Given row x and y, calculate node index
    */
    const indexFromCoords = (x, y, n) => y *n + x;

    /* 
        Add N parasites to the center of the lattice.
    */
    function addParasitesToCenter (nParasites = 50) {
        const n = l.L*2 + 1
        const w = Math.floor(Math.sqrt(nParasites))
        const center = n/2
        const corner = center - w/2 
        for(let i = 0; i < nParasites; i++) {
            const x = corner + (i % w)
            const y = corner + Math.floor(i / w)
            const index = indexFromCoords(x, y, n)
           
            // console.log('x+ y', x, y, i, index, l.nodes[index])
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

    // swap positions with a random neighbor
    const diffusion = (node) => {
       /// const diffusionProbability = 0.5
        if(Math.random() < diffusionAmount.value) {
            const n = node.neighbors[Math.floor(Math.random()*node.neighbors.length)]

            const newState = node.state
            node.state = n.state
            n.state = newState
        }

    }

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
        const numDiffusionSteps = Math.round(diffusionSteps.value)
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

        for(let i = 0; i < numDiffusionSteps; i ++) {
            l.nodes.forEach((node, i) => {            
                diffusion(node)
            })
        }
    }

    return {
        lattice: l,
        update: update,
        SPECIES: SPECIES,
        init: init,
        addRandomParasites: addRandomParasites,
        addParasitesToCenter: addParasitesToCenter
    }

}


