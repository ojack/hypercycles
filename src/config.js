module.exports = {
    speed: 5,
    width: 161,
    scale: 400/161,
    numParasites: 60,
    fadeSpeed: 0.01, // higher is faster
    colors: {
        speciesColorMap: {
            type: 'd3',
            id: 'interpolateRainbow'
        },
        // speciesColorMap: {
        //     type: 'crameri',
        //     id: 'romaO'
        // },
        parasite: '#000',
        // empty:  "#dfceaa"
        empty: 'rgb(240, 240, 240)'
    },
    controlbox: {
        width: 400,
        height: 400,
        gridX: 12,
        gridY: 12,
        margin: 10
    }
}
