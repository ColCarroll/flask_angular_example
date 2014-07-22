/**
 * Created by colinc on 6/25/14.
 */

String.prototype.toCamel = function() {
    return this.toLowerCase().replace(/([ -]+)([a-zA-Z0-9])/g, function (a, b, c) {
        return c.toUpperCase();
    });
};

var flaskAngularApp = angular.module("flaskAngularApp", []);

flaskAngularApp.controller("ModelCtrl", function ModelCtrl($scope, $http) {
    $scope.features = {
        sepalLength : 5.0,
        sepalWidth : 2.8,
        petalLength : 2.4,
        petalWidth : 1.6
    };

    $scope.url = function() {
        return("/api/predict?" +
            "sepal_length=" + this.features.sepalLength.toFixed(2) + "&" +
            "sepal_width=" + this.features.sepalWidth.toFixed(2) + "&" +
            "petal_length=" + this.features.petalLength.toFixed(2) + "&" +
            "petal_width=" + this.features.petalWidth.toFixed(2));
    };

    $scope.probs = {};

    $scope.callIt = function() {
        $http({
            method: 'GET',
            url: $scope.url()
        }).success(function(data){
            $scope.probs = data.data;
        });
    };

    $scope.getProbs = function(){
        return $scope.probs;
    };

    $scope.callIt();


});

flaskAngularApp.directive("irisBars", function(){

    // constants
    var margin = 20,
        barPadding = 2,
        ease='linear',
        duration = 300,
        height = 300;

    return {
        restrict: "E",
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {

            // set up initial svg object
            var svg = d3.select(element[0])
                    .append("svg")
                    .style("width", "100%"),
                width=svg[0][0].clientWidth - margin,
                yScale = d3.scale.linear()
                    .domain([0, 1])
                    .range([0, height]);
            svg.attr('viewBox','0 0 '+(Math.max(width,height) + margin)+' '+(Math.max(width,height) + margin))
                .attr('preserveAspectRatio','xMinYMin')
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            scope.$watch("data", function (data) {
                scope.render(data);
            });

            scope.render = function(newData){
                if (!newData || isNaN(newData.length)) return;

                var bars = svg.selectAll("rect")
                    .data(newData, function(d) { return d.label; });

                var text = svg.selectAll("text")
                    .data(newData, function(d) { return d.label; });

                var barWidth = width / newData.length;

                bars
                    .transition()
                    .duration(duration)
                    .ease(ease)
                    .attr("height", function(d){return yScale(d.prob)})
                    .attr("y", function(d) {return height - Math.round(margin / 2) - yScale(d.prob)});

                text
                    .text(function(d) {return (100 * d.prob).toFixed(1) + "%";})
                    .transition()
                    .duration(duration)
                    .ease(ease)
                    .attr("y", function(d) {return height - Math.round(margin / 2) - yScale(d.prob)});

                bars
                    .enter()
                    .append('rect')
                    .attr("width", barWidth)
                    .attr("fill", "steelblue")
                    .attr("x", function(d, i) { return i * (barWidth + barPadding) })
                    .data(newData)
                    .transition()
                    .duration(duration)
                    .ease(ease)
                    .attr("height", function(d){return yScale(d.prob)})
                    .attr("y", function(d) {return height - Math.round(margin / 2) - yScale(d.prob)});

                text
                    .enter()
                    .append("text")
                    .attr("x", function(d, i) { return (i + 1) * (barWidth + barPadding) })
                    .attr("dx", -barWidth/2)
                    .attr("dy", "1.2em")
                    .attr("text-anchor", "middle")
                    .text(function(d) {return (100 * d.prob).toFixed(1) + "%";})
                    .attr("fill", "white")
                    .attr("y", function(d) {return height - Math.round(margin / 2) - yScale(d.prob)});

                text
                    .enter()
                    .append("text")
                    .attr("y", height)
                    .attr("x", function(d, i) { return (i + 1) * (barWidth + barPadding) })
                    .attr("dx", -barWidth/2)
                    .attr("text-anchor", "middle")
                    .attr("fill", "black")
                    .text(function(d) { return d.label;});

            };


        }
    }
});

flaskAngularApp.directive("irisScatter", function(){

    // constants
    var margin = {top: 20, right: 20, bottom: 30, left: 40};

    return {
        restrict: "EA",
        scope: {
            features: '=',
            xval: '@',
            yval: '@'
        },
        link: function (scope, element, attrs) {

            var svg = d3.select(element[0]).append("svg")
                .style("width", "100%")
                .style("height", "100%");

            var width=svg[0][0].clientWidth - margin.left - margin.right,
                height=svg[0][0].clientHeight - margin.top - margin.bottom,
                xValue = function(d) { return d[scope.xval];}, // data -> value
                xScale = d3.scale.linear().range([0, width]), // value -> display
                xMap = function(d) { return xScale(xValue(d));}, // data -> display
                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

            var yValue = function(d) { return d[scope.yval];}, // data -> value
                yScale = d3.scale.linear().range([height, 0]), // value -> display
                yMap = function(d) { return yScale(yValue(d));}, // data -> display
                yAxis = d3.svg.axis().scale(yScale).orient("right");

            var cValue = function(d) { return d.Species;},
                color = d3.scale.category10();

            svg.attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // load data
            d3.csv('/static/iris.csv', function(error, data) {

              data.forEach(function(d) {
                d[scope.xval] = +d[scope.xval];
                d[scope.yval] = +d[scope.yval];
              });

              scope.features[scope.xval] = +scope.features[scope.xval.toCamel()];
              scope.features[scope.yval] = +scope.features[scope.yval.toCamel()];

              // don't want dots overlapping axis, so add in buffer to data domain
              xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
              yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

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
                  .text(scope.xval);

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
                  .text(scope.yval);

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

                svg.selectAll(".position")
                    .data([scope.features])
                    .enter().append("circle")
                    .attr("class", "position")
                    .attr("r", 2.5)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .style("fill", "black");


              // draw legend
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
            });

            scope.$watch('features', function (newData, oldData) {
                scope.render(newData);
            }, true);

            scope.render = function(newData){
                if (!newData) return;
                newData[scope.xval] = +newData[scope.xval.toCamel()];
                newData[scope.yval] = +newData[scope.yval.toCamel()];

                svg.selectAll(".position")
                    .data([newData])
                    .attr("class", "position")
                    .attr("r", 2.5)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .style("fill", "black");

            };



        }
    }
});
