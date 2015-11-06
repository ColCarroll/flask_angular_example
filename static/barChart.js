/* globals d3 */
/* exported barChart */
var barChart = function(divName) {
    var divId = '#' + divName,
        margin = {top: 0, right: 20, bottom: 30, left: 40},
        width = 450- margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        barPadding = 2,
        ease='linear',
        duration = 300,
        label = function(d) { return d.label;},
        colorScale = d3.scale.category10(),
        color = function(d) { return colorScale(label(d))},
        yScale = d3.scale.linear()
            .domain([0, 1])
            .range([0, height]);

    // set up initial svg object
    var svg = d3.select(divId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g");

    return {
        render : function(data){
            if (!data || isNaN(data.length)) return;

            var bars = svg.selectAll("rect")
                .data(data, label);

            var text = svg.selectAll("text")
                .data(data, label);

            var barWidth = width / data.length,
                yHeight = function(d) {return height - yScale(d.prob)};

            bars
                .enter()
                .append('rect')
                .attr("width", barWidth)
                .attr("fill", color)
                .attr("x", function(d, i) { return i * (barWidth + barPadding) })
                .data(data)
                .transition()
                .duration(duration)
                .ease(ease)
                .attr("height", function(d){return yScale(d.prob)})
                .attr("y", yHeight);

            bars
                .transition()
                .duration(duration)
                .ease(ease)
                .attr("height", function(d) {return yScale(d.prob)})
                .attr("y", yHeight);

            text
                .text(function(d) {return (100 * d.prob).toFixed(1) + "%";})
                .transition()
                .duration(duration)
                .ease(ease)
                .attr("y", yHeight);

            text
                .enter()
                .append("text")
                .attr("x", function(d, i) { return (i + 1) * (barWidth + barPadding) })
                .attr("dx", -barWidth/2)
                .attr("dy", "1.2em")
                .attr("text-anchor", "middle")
                .text(function(d) {return (100 * d.prob).toFixed(1) + "%";})
                .attr("fill", "white")
                .attr("y", yHeight);

            text
                .enter()
                .append("text")
                .attr("y", 10 + height)
                .attr("x", function(d, i) { return (i + 1) * (barWidth + barPadding) })
                .attr("dx", -barWidth/2)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(function(d) { return d.label;});
        }
    };
};
