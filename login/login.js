var app = angular.module('app.signin', [])
app.controller('loginCtrl', function ($scope, $mdToast, $http, $location, $document, $state, $rootScope) {
    $scope.firstConnection = true;
    $http.post('/findAllUsers').then(function (data) {
        $scope.users = data.data.data;
         for(var i=0; i<$scope.users.length; i++){
             if ($scope.users[i].security_mask == 'prof'){
                 $scope.firstConnection = false;
             }
         }
    }, function (err) {  });
    $scope.login = function () {
        if (($scope.user2.login == null) || $scope.user2.password == null) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent('S\'il vous plaît remplir tous les champs...')
                    .position("bottom right")
                    .hideDelay(2000)
            );
            $rootScope.isLogin = false;
        }
        else {
            $http.post('/loginUser', $scope.user2).then(function (data) {

                if (data.data.success == false) {

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.data.message)
                            .position("bottom right")
                            .hideDelay(2000)
                    );
                }
                else {
                    var jsonstr = JSON.stringify(data.data.data._id);

                    var data1 = data.data;
                    var userID = data1.data._id;
                    var login = data1.data.login;
                    var nom = data1.data.nom;
                    var prenom = data1.data.prenom;
                    var niveau = data1.data.niveau;
                    var security_mask = data1.data.security_mask;

                    localStorage.setItem("id", userID);
                    localStorage.setItem("login", login);

                    localStorage.setItem("nom", nom);
                    localStorage.setItem("prenom", prenom);
                    localStorage.setItem("niveau", niveau);
                    localStorage.setItem("security_mask", security_mask);

                    sessionStorage.setItem("id", userID);
                    console.log(localStorage.getItem('login'));
                    if (security_mask == 'prof') {
                        $state.go('home');
                        $scope.isAdmin = true;
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Bienvenue ' + nom + ' ' + prenom)
                                .position("bottom right")
                                .hideDelay(2000)
                        );

                    }
                    else {
                        $state.go('home');
                        $scope.isAdmin = true;
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Bienvenue ' + nom + ' ' + prenom)
                                .position("bottom right")
                                .hideDelay(2000)
                        );
                    }
                }

            }, function (err) {
                // alert("login or password not Found..");
                $scope.user2 = "";

            })

        }
    }

    $rootScope.signOut = function () {
        $rootScope.isLogin = false;
        localStorage.clear();
        sessionStorage.clear();
        $state.go('signin');
    }

})
