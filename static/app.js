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

  $scope.probs = $http.get(this.url()).success(function(data){
          return data;
      });

  $scope.getProbs = function(){
      return $scope.probs;
  };


  $scope.url = function() {
      return("/_model/" +
          this.features.sepalLength.toFixed(2) + "/" +
          this.features.sepalWidth.toFixed(2) + "/" +
          this.features.petalLength.toFixed(2) + "/" +
          this.features.petalWidth.toFixed(2));
  }
}