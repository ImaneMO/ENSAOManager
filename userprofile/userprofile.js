var userprofile = angular.module('app.userprofile', [])
userprofile.controller('userprofileCtrl', function ($scope, $http, $rootScope, $document, $state) {
    var Data;

    var id = sessionStorage.id;
    $scope.id = sessionStorage.id;
    $document.ready(function () {
        if (id == null) {
            $rootScope.isLogin = false;
            //$state.go('home'); 
        }
        else {
            $rootScope.isLogin = true;
        }
    });

    $scope.uid = id;

    $http.post('/userProfile/' + id).then(function (data) {
        Data = data.data.Data;
        $rootScope.dData = Data;

    }, function (err) { });
});

userprofile.controller('updatepassCtrl', function ($scope, $http, $state, $document, $rootScope, $mdToast) {
    var Data;
    var id = sessionStorage.id;
    $http.post('/userProfile/' + id).then(function (data) {
        Data = data.data.Data;
    }, function (err) { });
    $scope.submit = function () {
        if ($scope.password1 != $scope.password2) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('La combinaison du mot de passe a échoué.')
                    .position("bottom right")
                    .hideDelay(2000)
            );
        }
        else {
            Data.password = $scope.password1;
            $http.post('/updatepass', Data).then(function (data) {
                if (data.data.success == false) {
                    //toastShow("Échec de mise à jour");
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Échec de mise à jour')
                            .position("bottom right")
                            .hideDelay(2000)
                    );
                }
                else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Mis à jour avec succés')
                            .position("bottom right")
                            .hideDelay(1000)
                    );
                    $state.go('userprofile');
                }
            }, function (err) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Mis à jour avec succés')
                        .position("bottom right")
                        .hideDelay(1000)
                );
            });
        }
    };
});