const { HSLToRGB, getOutcomeFromProbabilities } = require('./util.js')


const DECAY_PROBABILITY = 0.2
const REPLICATION_PROBABILITY = 1
const CATALYTIC_SUPPORT = 100

const CLAIM_EMPTY = 11
// const WIDTH = 51
//const WIDTH = 21

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

const EMPTY = 0



// colors and replication parameters for each species
const SPECIES = new Array(NUM_SPECIES + 1).fill(0).map((_, i) => {
    // initial state, catalyticSupport is an object containing the other species that this molecule will help catalyze
    const s = { index: i, catalyticSupport: {} }
    // first state is "EMPTY" state
    if (i === STATES.EMPTY) {
        s.color = { r: 255, g: 255, b: 255 }
        s.replication = 0
        s.initialProbability = 0.5
    // } else if (i === STATES.PARASITE) { // parasite state
    //     s.color = { r: 0, g: 0, b: 0 }
    //     s.replication = REPLICATION_PROBABILITY
    //     s.initialProbability = 0 // @todo fix
    } else {
        s.color = HSLToRGB(255 * (i - 1) / NUM_SPECIES, 100, 50)
        s.replication = REPLICATION_PROBABILITY
        s.initialProbability = 0.5 / NUM_SPECIES

        // choose one species that this species will catalyze
        const cs = i >= NUM_SPECIES ? 1 : i + 1
        s.catalyticSupport[cs] = CATALYTIC_SUPPORT // constant from plat A in paper

        // also give catalytic support to parasite if species 1
       // if ( i === 2) s.catalyticSupport[STATES.PARASITE] = CATALYTIC_SUPPORT*2
    }
    return s
})

console.log('species', SPECIES)

// [
//    { color: {r:255, g:255, b:255}, index: 0, replication: 0 },
//    { color: {r: 255, g: 0, b: 0}, replication: 0., index: 1 }, 
//    { color: {r: 0, g: 255, b: 0}, replication: 0., index: 2 }, 
//    { color: {r:0, g:0, b:255}, replication: 0., index: 3 }]


module.exports.createModel = (w = 50) => {
    const num_parasites = Math.floor(w/3)
    let l = lattice.square(w)
    function init() {

        // initialize node state
        l.nodes.forEach((node) => {
            // node.state = Math.floor(Math.random()*(SPECIES.length))
            node.state = getOutcomeFromProbabilities(SPECIES.map((s) => s.index), SPECIES.map((s) => s.initialProbability))
            //   console.log(node.state)
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

    function addRandomParasites (nParasites) {
        for(let i = 0; i < nParasites; i++) {
            let index = Math.floor(Math.random() * l.nodes.length)
            // add parasite at index
            l.nodes[index]
        }
    }

    init()

    const decay = (state) => Math.random() < DECAY_PROBABILITY ? EMPTY : state

    // from paper, c[x,y] is the catalytic support x gets from y (where does this come from?)
    // if x is empty, gets no catalytic support from neighbors
    const c = (x, y) => {
        const xS = SPECIES[x.state]
        // console.log(x, y)
        //  console.log(xS.catalyticSupport, y, xS.catalyticSupport[y.state])
        return xS.catalyticSupport[y.state] ? xS.catalyticSupport[y.state] : 0
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
            const cN = SPECIES[n.state].replication + c(n, ne) + c(n, nw) + c(n, w) + c(n, e)
            const cS = SPECIES[s.state].replication + c(s, se) + c(s, sw) + c(s, w) + c(s, e)
            const cE = SPECIES[e.state].replication + c(e, ne) + c(e, se) + c(e, n) + c(e, s)
            const cW = SPECIES[w.state].replication + c(w, nw) + c(w, sw) + c(w, n) + c(w, s)

            const cSum = cN + cS + cE + cW + CLAIM_EMPTY

            // calculate probabilities of next state based on claims from neighboring states
            const pEmpty = CLAIM_EMPTY / cSum
            const pN = cN / cSum
            const pS = cS / cSum
            const pE = cE / cSum
            const pW = cW / cSum

            const r = Math.random()

            newState = getOutcomeFromProbabilities([EMPTY, n.state, s.state, e.state, w.state], [pEmpty, pN, pS, pE, pW])
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
            // console.log('claims', cN, cS, cE, cW, cSum)
            // console.log('probs', pEmpty, pN, pS, pE, pW)

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
            if (state !== EMPTY) {
                newState = decay(state)
            } else {
                newState = replicate(node)
            }
            newNodeState[i] = newState
        })

        l.nodes.forEach((node, i) => {
            node.state = newNodeState[i]
        })
    }

    return {
        lattice: l,
        update: update,
        SPECIES: SPECIES,
        init: init
    }

}


