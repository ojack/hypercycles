module.exports = ({ width, scale }, controls) => {
  //  const showMajority = controls.toggles[0]
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = width

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
          if(i === 0) {
            numEmpty = numSpecies
          } else if (numSpecies > largest) {
         // if (numSpecies > largest) { // include empty state within color by majority
            largest = numSpecies
            speciesIndex = i
          }
        })
      }
      return Object.assign({}, colorFromState(speciesIndex), { a: 255 * (8 - numEmpty)/8})
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