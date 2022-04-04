const SCALE = 5


module.exports = (w, h) => {
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

        const currState = model.lattice.nodes.map((node) => {
            //console.log(node.state, colorFromState(node.state))
           
            // show color of majority of neighbors rather than actual cell state
            const nCount = new Array(model.SPECIES.length).fill(0)
            node.neighbors.forEach((neighbor) => { nCount[neighbor.state]++ })

            let largest = 0
            let speciesIndex = 0
            nCount.forEach((numSpecies, i) => {
                if(i != 0 && numSpecies > largest) {
                    largest = numSpecies
                    speciesIndex = i
                }
            })
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