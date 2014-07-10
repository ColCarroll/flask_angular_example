/**
 * Created by colinc on 6/25/14.
 */
function ModelCtrl($scope, $http) {
  $scope.features = {
    sepalLength : 1.1,
    sepalWidth : 1.1,
    petalLength : 1.1,
    petalWidth : 1.2
  };

  $scope.getGraph = function() {

    return "hello";
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
        $scope.probs = data;
    });
  };

  $scope.getProbs = function(){
      return $scope.probs;
  };

  $scope.callIt();


}
