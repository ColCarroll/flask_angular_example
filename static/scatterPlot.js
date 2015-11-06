var scatterPlot = function(divName, center, domain, xVal, yVal, drawLegend){
    // constants
    var divId = '#' + divName,
        margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom,
        x = function(d) { return d[xVal]; },
        y = function(d) { return d[yVal]; },
        cValue = function(d) { return d.Species;},
        color = d3.scale.category10();

    var xScale = d3.scale.linear()
        .domain(domain[xVal])
        .range([0, width]),
        xMap = function(d) { return xScale(x(d));},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yScale = d3.scale.linear()
        .domain(domain[yVal])
        .range([height, 0]),
        yMap = function(d) { return yScale(y(d));},
        yAxis = d3.svg.axis().scale(yScale).orient("right");

    var svg = d3.select(divId)
            .append('div')
            .append("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // load data
    d3.csv('/static/iris.csv', function(data) {

        data.forEach(function(d) {
            d[xVal] = +d[xVal];
            d[yVal] = +d[yVal];
        });
        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width - 5)
            .attr("y", -2)
            .style("text-anchor", "end")
            .text(xVal);

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ", 0)")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.2em")
            .style("text-anchor", "end")
            .text(yVal);

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 2.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("opacity", 0.6)
            .style("fill", function(d) { return color(cValue(d));});

        // draw legend
        if (drawLegend == 'true'){
            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 13 + ")"; });

            legend.append("rect")
                .attr("x", 10)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", color);

            legend.append("text")
                .attr("x", 24)
                .attr("y", 5)
                .attr("dy", ".25em")
                .style("text-anchor", "begin")
                .text(function(d) { return d;})
        }

        svg.selectAll(".position")
            .data([center])
            .enter().append("circle")
            .attr("class", "position")
            .attr("r", 2.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "black");

    });

    return {
        render : function(data){
            data[xVal] = +data[xVal];
            data[yVal] = +data[yVal];
            svg.selectAll(".position")
                .data([data])
                .attr("class", "position")
                .attr("r", 2.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", "black");
        }

    };
}
