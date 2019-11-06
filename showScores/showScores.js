var app = angular.module('app.showScores', ['smart-table']);
app.controller('showScoresCtrl', function ($scope, $document, $http, $state, $rootScope) {
    var id = localStorage.getItem('id');
    var login = localStorage.getItem('login');
    var security_mask = localStorage.getItem('security_mask');
    if (security_mask == undefined || security_mask == 'prof') {
        $state.go('signin');
    }
    $scope.results = [];
    $scope.showResults;
    $scope.errShow;
    $http.post('/showResult', { userID: id }).then(function (data) {
        $scope.results = data.data.data;
        if ($scope.results == "") {
            $scope.showError = "Il n'y a pas de résultat à afficher";
            $scope.showResults = false;
            $scope.errShow = true;
        }
        else {
            $scope.showResults = true;
            $scope.errShow = false;
        }
    });
});