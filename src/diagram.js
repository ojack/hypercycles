var world_width = 400
var world_height = 400

module.exports = ({ parent, x, y }) => {
    var origin = parent.append("g")
        .attr("class", "diagram")
        .attr("transform", "translate(" + x + "," + y + ")");
    // var origin = display
    let layer0, defector, defectorlink, defectorlinkhead, layer1

    const draw = (species) => {
        const speciesWithoutParasite = species.filter((s) => Object.keys(s.catalyticSupport).length > 0)
        origin.selectAll("*").remove()

        var L = 1
        var N = speciesWithoutParasite.length
        var R = 0.2
        var Q = N < 5 ? 0.4 : 0.65
        var phi = 1.4
        var knobsize = 4;

        var X = d3.scaleLinear().domain([-L, L]).range([-world_width / 2, world_width / 2]);
        var Y = d3.scaleLinear().domain([-L, L]).range([-world_height / 2, world_height / 2]);
        var line = d3.line().x(function (d) { return X(d.x); }).y(function (d) { return Y(d.y); });

        function z() {
            return R * (Math.cos(Q * Math.PI / N))
        }

        function noderadius() {
            return R * Math.sin(Q * Math.PI / N)
        }

        function A() {
            return R * Math.sin(Q * Math.PI / N) * Math.tan(phi / 2)
        }

        function D() {
            return Math.sqrt(R * Math.sin(Q * Math.PI / N) * R * Math.sin(Q * Math.PI / N) + A() * A())
        }

        var alpha = d3.range(Q * Math.PI / N, Math.PI / N * (2 - Q), (1 - Q) * 2 * Math.PI / N / 100);
        var beta = d3.range(-(Math.PI + phi) / 2, +(Math.PI + phi) / 2, (Math.PI + phi) / 200);
        var circ = alpha.map(function (a) { return { x: -R + z() * Math.cos(a), y: z() * Math.sin(a) } })
        var kopp = beta.map(function (b) { return { x: D() + A() * Math.cos(b), y: A() * Math.sin(b) } })

        var nodes = d3.range(N);

        var linkSource = { x: X(R), y: Y(noderadius()) }
        var linkTarget = {
            x: X(1.8 * R * Math.cos(Math.PI / 5)),
            y: Y(1.8 * R * Math.sin(Math.PI / 5) - noderadius())
        }

        var link = d3
            .linkVertical()
            .x(d => d.x)
            .y(d => d.y)({
                source: linkSource,
                target: linkTarget
            });



        layer0 = origin.selectAll(".kopp").data(nodes).enter().append("g").attr("class", "kopp")
            .attr("transform", function (d, i) {
                return "rotate(" + i * (360 / N) + ")translate(" + X(R) + ")"
            })

        layer1 = origin.selectAll(".node").data(nodes).enter().append("g").attr("class", "node")
            .attr("transform", function (d, i) {
                return "rotate(" + i * (360 / N) + ")translate(" + X(R) + ")"
            })


        defectorlink = origin.append('path').attr("class", "link")
            .attr('d', link)
            .style("stroke", "black")
            .attr('fill', 'none');

        defectorlinkhead = origin.append("circle").attr("class", "head")
            .attr("r", knobsize)
            .attr("cx", linkTarget.x)
            .attr("cy", linkTarget.y)

        defector = origin.append("g")
            .attr("transform", "translate(" + X(1.8 * R * Math.cos(Math.PI / 5)) + "," + Y(1.8 * R * Math.sin(Math.PI / 5)) + ")")

        defector.append("circle").attr("class", "head").attr("id", "defector")
            .attr("r", knobsize)
            .attr("cx", X(kopp[kopp.length - 1].x))
            .attr("cy", Y(kopp[kopp.length - 1].y))

        defector.append("circle").attr("class", "circle").attr("id", "defector")
            .attr("r", X(noderadius()))
            .attr("stroke", "rgb(100,100,100)")

        defector.append("path").datum(kopp).attr("d", line).attr("class", "link")
            .style("stroke", "black")
            .style("fill", "none")


        layer1.append("circle")
            .attr("class", "circle")
            .attr("r", X(noderadius()))
            .attr("cx", 0)
            .attr("cy", 0)
            // .style("fill", function (d, i) { return d3.interpolateRainbow(i / N) })
            .style("fill", (d, i) => {
                // if(speciesWithoutParasite[i].catalyticSupport[1]) return "#f00"
                // if(speciesWithoutParasite[i].index == 3) return "#0f0"
                return speciesWithoutParasite[i].color.hex
            })


        layer1.append("path").datum(circ).attr("d", line).attr("class", "link").attr("id", "link")
            .style("stroke", "black")
            .style("fill", "none")


        layer1.append("path").datum(kopp).attr("d", line).attr("class", "link").attr("id", "selflink")
            .style("stroke", "black")
            .style("fill", "none")


        layer0.append("circle").attr("class", "head").attr("id", "link")
            .attr("r", knobsize)
            .attr("cx", X(circ[circ.length - 1].x))
            .attr("cy", Y(circ[circ.length - 1].y))

        layer0.append("circle").attr("class", "head").attr("id", "selflink")
            .attr("r", knobsize)
            .attr("cx", X(kopp[kopp.length - 1].x))
            .attr("cy", Y(kopp[kopp.length - 1].y))

        // if (showdefector.value == true) {
        //     defector.style("opacity",1)
        //     defectorlink.style("opacity",1)
        //     defectorlinkhead.style("opacity",1)
        // } else {

       

    }

    const updateOpacity = (parasiteOpacity = 1, speciesOpacity = []) => {
        console.log('parasite', parasiteOpacity)
        defector.style("opacity", parasiteOpacity)
        defectorlink.style("opacity", parasiteOpacity)
        defectorlinkhead.style("opacity", parasiteOpacity)

      //  console.log(layer0, 'layer0')
        //  }
        // layer0._groups[0].style("opacity", 0)
        layer1.style("opacity", (d, i) => {
           // console.log(d, i)
            return 0.5
        })
    }

    return { draw, updateOpacity }
}