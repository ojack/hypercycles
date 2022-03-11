const DECAY_PROBABILITY = 0.1
const REPLICATION_PROBABILITY = 0.5
const CLAIM_EMPTY = 11
const WIDTH = 101

const colorFromState = (state) => (state === 'FILLED' ? { r: 255, g: 0, b: 0 } : { r: 0, g: 0, b: 0 })

const createModel = (w = 50) => {
    var l = lattice.square(w)

    // initialize node state
    l.nodes.forEach((node) => {
        node.state = Math.random() > 0.5 ? 'FILLED' : 'EMPTY'
    })

    const decay = (state) => Math.random() < DECAY_PROBABILITY ? 'EMPTY' : state

    const update = () => {
        l.nodes.forEach((node) => {
            const { state } = node
            let newState = state
            if(state === 'FILLED') {
                newState = decay(state)
            } else {
                
            }
            node.state = newState
        })
    }
    console.log('created lattice', l)

    return {
        lattice: l,
        update: update
    }

}

const createCanvas = (w, h, mult = 4) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h

    canvas.style.width = `${w*mult}px`
    canvas.style.height = `${w*mult}px`
    canvas.style.imageRendering = 'pixelated'

    const ctx = canvas.getContext('2d')

    const render = (model) => {
        const imageData = ctx.getImageData(0, 0, w, h)
        const data = imageData.data

        const currState = model.lattice.nodes.map((node) => {
            return colorFromState(node.state)
        })

        console.log(model.lattice.nodes, currState)
        for(var i = 0; i < data.length; i += 4) {
            data[i]     = currState[i/4].r     // red
            // data[i + 1] =  Math.random()*255; // green
            // data[i + 2] =  Math.random()*255; // blue
            data[i + 3] = 255 // alpha
        }
        ctx.putImageData(imageData, 0, 0);
    }

    return { render: render, canvas: canvas }
}


const model = createModel((WIDTH - 1) / 2)
const canvas = createCanvas(WIDTH, WIDTH)
document.body.appendChild(canvas.canvas)

canvas.render(model)

setInterval(() => {
    model.update()
    canvas.render(model)
}, 200)

