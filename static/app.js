var flaskAngularApp = angular.module("flaskAngularApp", [])
    .controller("ModelCtrl", function ModelCtrl($scope, $http) {
        $scope.features = {};
        $scope.domain = {
            'Sepal Width': [1.0, 5.0],
            'Sepal Length': [3.5, 8.5],
            'Petal Width': [0.0, 3.5],
            'Petal Length': [0.0, 7.5]
        };
        $scope.dimensions = Object.keys($scope.domain);
        for(var j=0; j < $scope.dimensions.length; j++){
            var key = $scope.dimensions[j];
            $scope.features[key] = 0.5 * ($scope.domain[key][0] + $scope.domain[key][1]);
        }

        $scope.probs = {};

        $scope.valMin = function(feature){
            return $scope.domain[feature][0];
        }

        $scope.valMax = function(feature){
            return $scope.domain[feature][1];
        }

        $scope.url = function() {
            return("/api/predict?" +
                "sepalLength=" + this.features['Sepal Length'] + "&" +
                "sepalWidth=" + this.features['Sepal Width'] + "&" +
                "petalLength=" + this.features['Petal Length'] + "&" +
                "petalWidth=" + this.features['Petal Width']);
        };

        $scope.updateProbs = function() {
            $http.get($scope.url()).success(function(data){
                $scope.probs = data.data;
            });
        };

        $scope.updateProbs();
    })
    .directive("irisBars", function(){
        return {
            restrict: "E",
            scope: {
                data: '='
            },
            link: function (scope) {
                var chart = barChart('barChart');
                scope.$watch("data", function (data) {
                    chart.render(data);
                });

            }
        }
    })
    .directive("irisScatter", function(){
        return {
            restrict: "EA",
            scope: {
                features: '=',
                domain: '=',
                xval: '@',
                yval: '@',
                id: '@',
                legend: '@'
            },
            link: function (scope) {
                var chart = scatterPlot(scope.id, scope.features, scope.domain, scope.xval, scope.yval, scope.legend);
                scope.$watch('features', function (data) {
                    chart.render(data);
                }, true);
            }
        }
    });
