/**
 * Created by colinc on 6/25/14.
 */

var flaskAngularApp = angular.module("flaskAngularApp", []);

flaskAngularApp.controller("ModelCtrl", function ModelCtrl($scope, $http) {
    $scope.features = {
        sepalLength : 4.1,
        sepalWidth : 5.0,
        petalLength : 2.5,
        petalWidth : 3
    };

    $scope.url = function() {
        return("/api/predict?" +
            "sepal_length=" + this.features.sepalLength.toFixed(1) + "&" +
            "sepal_width=" + this.features.sepalWidth.toFixed(1) + "&" +
            "petal_length=" + this.features.petalLength.toFixed(1) + "&" +
            "petal_width=" + this.features.petalWidth.toFixed(1));
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
        width = 450 - margin,
        height = 300,
        yScale = d3.scale.linear()
            .domain([0, 1])
            .range([0, height]),
        barPadding = 3,
        duration = 500;

    return {
        restrict: "E",
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {

            // set up initial svg object
            var svg = d3.select(element[0])
                .append("svg")
                .style("width", width)
                .attr("height", height + margin + 100);

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
                    .attr("height", function(d){return yScale(d.prob)})
                    .attr("y", function(d) {return height - Math.round(margin / 2) - yScale(d.prob)});

                text
                    .text(function(d) {return (100 * d.prob).toFixed(1) + "%";})
                    .transition()
                    .duration(duration)
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
                    .transition()
                    .duration(duration)
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