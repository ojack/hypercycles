const controlbox_width = 400,
    controlbox_height = 400,
    n_grid_x = 12,
    n_grid_y = 12
margin = 10;

const sliders = {
    decay: { id: "decay-slider", default: 0.2, range: [0, 1] },
    replication: { id: "replication-slider", default: 1, range: [0, 8] },
    catalyticSupport: { id: "catalytic-support-slider", range: [0, 300], default: 100 }
}


module.exports = ({ reset, runpause } = {}) => {

    //document.body.appendChild(controlDiv)
    var controls = d3.select("#controls-container").append("svg")
        .attr("width", controlbox_width)
        .attr("height", controlbox_height)
        .attr("class", "explorable_widgets")

    var g = widget.grid(controlbox_width, controlbox_height, n_grid_x, n_grid_y);

    var playblock = g.block({ x0: 2, y0: 10, width: 0, height: 0 });
    var buttonblock = g.block({ x0: 6, y0: 10, width: 2, height: 0 }).Nx(2);
    var sliderblock = g.block({ x0: 5.5, y0: 1, width: 6, height: 10 }).Ny(8);

    // buttons
    var playpause = { id: "b1", name: "", actions: ["play", "pause"], value: 0 };

    var playbutton = [
        widget.button(playpause).size(g.x(3)).symbolSize(0.6 * g.x(3)).update(runpause)
    ]

    var buttons = [
        widget.button({ id: "b2", name: "", actions: ["back"], value: 0 }).update(reset),
        widget.button({ id: "b3", name: "", actions: ["rewind"], value: 0 }).update(resetControls)
    ]

    var sliderwidth = sliderblock.w(),
        handleSize = 12,
        trackSize = 8;

    Object.entries(sliders).forEach(([name, slider]) => {
        slider.name = name
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

    var bu = controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement).attr("transform", function (d, i) { return "translate(" + buttonblock.x(i) + "," + buttonblock.y(0) + ")" });

    var spsl = controls.selectAll(".slider").data(Object.values(sliders).map((s) => s.el)).enter().append(widget.sliderElement)
        .attr("transform", function (d, i) { return "translate(" + sliderblock.x(0) + "," + sliderblock.y(i) + ")" })

    return {
        sliders: sliders,
        buttons: buttons
    }
}