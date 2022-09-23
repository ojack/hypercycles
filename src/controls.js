const sliders = {
    decay: { id: "decay-slider", default: 0.2, range: [0, 1] },
    replication: { id: "replication-slider", default: 1, range: [0, 4] },
    catalyticSupport: { id: "catalytic-support-slider", name: "catalytic support", range: [0, 300], default: 100 },
    // diffusion: { id: 'diffusion-probability-slider', name: "diffusion probability", range: [0, 1], default: 0.4 },
    diffusionSteps: { id: 'diffusion-steps-slider', name: "diffusion", range: [0, 22], default: 0 },
    initialDensity: { id: 'density-slider', name: 'initial density', range: [0.005, 0.7], default: 0.5}
}

module.exports = ({ reset, runpause, render, addRandomParasites, addParasitesToCenter } = {}, { width, scale }) => {
    const controlbox_width = 400,
        controlbox_height = width * scale,
        n_grid_x = 12,
        n_grid_y = 14,
        margin = 10;

    const controls = d3.select("#cxpbox_hypercycles_controls").append("svg")
        .attr("width", controlbox_width)
        .attr("height", controlbox_height)
        .attr("class", "explorable_widgets")

    const g = widget.grid(controlbox_width, controlbox_height, n_grid_x, n_grid_y);

    const playblock = g.block({ x0: 2, y0: 11.5, width: 0, height: 0 });

    const buttonblock = g.block({ x0: 1, y0: 9, width: 2, height: 0 }).Nx(2);
    const sliderblock = g.block({ x0: 0.5, y0: 1, width: 4, height: 2.8 }).Ny(3);
    const switchblock = g.block({ x0: 6.5, y0: 8.5, width: 3, height: 3.5 }).Ny(3);
    const radioblock = g.block({x0:8,y0:0.5,width:0,height:6});


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
        widget.button({ id: "b5", name: "add parasites to center", actions: ["record"], value: 0 }).label("right").update(addParasitesToCenter),
        widget.button({ id: "b4", name: "add parasites randomly", actions: ["record"], value: 0 }).label("right").update(addRandomParasites)
    ]

    const toggles = [
        widget.toggle({ id: "t1", name: "color by majority", value: true }).update(render).label("right").size(10)
    ]

    const radioData =  [3, 6, 9].map((v) => ({label: `${v} species`, val: v}))
    const radioOptions = { id: "c1", name: "Select number of species", choices: radioData.map((v) => v.label), value: 5}

    const radios = [
        widget.radio(radioOptions).size(radioblock.h()).label("right").shape("rect").update((e) => {
            reset(radioData[radioOptions.value].val)
            // console.log('radio updated', e.value, radioOptions.value)
        })
    ]

    const sliderwidth = sliderblock.w(),
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

    const pb = controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement).attr("transform", function (d, i) { return "translate(" + playblock.x(0) + "," + playblock.y(i) + ")" });

    const bu = controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement).attr("transform", function (d, i) {
        return "translate(" + buttonblock.x(i) + "," + buttonblock.y(0) + ")"
    });

    const bu1 = controls.selectAll(".button .others1").data(parasiteButton).enter().append(widget.buttonElement).attr("transform", function (d, i) {
        return "translate(" + switchblock.x(0) + "," + switchblock.y(i + 1) + ")"
    });

    const spsl = controls.selectAll(".slider").data(Object.values(sliders).map((s) => s.el).reverse()).enter().append(widget.sliderElement)
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