var app = angular.module('Quiz.adminclass', ['smart-table']);
app.controller('showClassesCtrl', function ($scope, $document, $http, $state, $rootScope) {

    var that = this;
    var id = sessionStorage.id;
    var login = localStorage.getItem('login');
    var security_mask = localStorage.getItem('security_mask');

    that.isAdmin = false;
    $document.ready(function () {

        if (security_mask == undefined || security_mask !== 'prof') {
            $state.go('signin');
        } else {
            that.isAdmin = true;
        }

        $scope.listeclasses = true;
        $scope.detailclasses = false;
        $scope.errShow = false;

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        $scope.classes = [];
        $scope.niveaux = [];
        $http.post('/findAllUsers').then(function (data) {
            $scope.users = data.data.data;
            $scope.users = $scope.users.filter(x => x.security_mask != 'prof');

            for (var i = 0; i < $scope.users.length; i++) {
                $scope.classes.push($scope.users[i].niveau);
            }
            $scope.classes = $scope.classes.filter(onlyUnique);

            for (var j = 0; j < $scope.classes.length; j++) {
                var nb = 0;
                for (var k = 0; k < $scope.users.length; k++) {
                    if ($scope.classes[j] == $scope.users[k].niveau) {
                        nb++;
                    }
                }
                var detailniveau = { niveau: $scope.classes[j], nombre: nb };

                $scope.niveaux.push(detailniveau);
            }
        });

        $scope.back2classes = function () {
            $scope.listeclasses = true;
            $scope.detailclasses = false;
            $scope.errShow = false;

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            $scope.classes = [];
            $scope.niveaux = [];
            $http.post('/findAllUsers').then(function (data) {
                $scope.users = data.data.data;
                $scope.users = $scope.users.filter(x => x.security_mask != 'prof');

                for (var i = 0; i < $scope.users.length; i++) {
                    $scope.classes.push($scope.users[i].niveau);
                }
                $scope.classes = $scope.classes.filter(onlyUnique);

                for (var j = 0; j < $scope.classes.length; j++) {
                    var nb = 0;
                    for (var k = 0; k < $scope.users.length; k++) {
                        if ($scope.classes[j] == $scope.users[k].niveau) {
                            nb++;
                        }
                    }
                    var detailniveau = { niveau: $scope.classes[j], nombre: nb };

                    $scope.niveaux.push(detailniveau);
                }
            });
        };

        $scope.showListStudents = function (classe) {
            $scope.listeclasses = false;
            $scope.detailclasses = true;
            //$scope.detailclasses = true;
            $scope.errShow = false;


            $scope.niveau = classe;

            $scope.etudiants = [];
            $http.post('/findAllUsers').then(function (data) {
                data.data.data = data.data.data.filter(x => x.security_mask != 'prof');
                for (var i = 0; i < data.data.data.length; i++) {
                    if (data.data.data[i].niveau == $scope.niveau) {
                        $scope.etudiants.push(data.data.data[i]);
                    }
                }

                if ($scope.etudiants == "") {
                    $scope.listeclasses = false;
                    $scope.detailclasses = false;
                    $scope.errShow = true;
                    $scope.showError = "Il n'y a pas d'étudiants à afficher";
                }
            });
        }
    });
});