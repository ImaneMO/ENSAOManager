var app = angular.module('app.statisticspanel', ['smart-table']);
app.controller('statisticsCtrl', function ($scope, $document, $http, $state, $rootScope) {
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

        $scope.nivqcms = true;
        $scope.statsqcm = false;
        $scope.errShow = false;

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        $scope.classes = [];
        $http.post('/findAllUsers').then(function (data) {
            $scope.users = data.data.data;
            $scope.users = $scope.users.filter(x => x.security_mask != 'prof');

            for (var i = 0; i < $scope.users.length; i++) {
                $scope.classes.push($scope.users[i].niveau);
            }
            $scope.classes = $scope.classes.filter(onlyUnique);
        });

        $scope.qcms = [];
        $scope.mjrqcms = [];
        $http.post('/getTopics').then(function (data) {
            $scope.qcms = data.data.data;
            for (var i = 0; i < $scope.classes.length; i++) {
                $scope.listqcms = [];
                for (var j = 0; j < data.data.data.length; j++) {
                    for (var k = 0; k < data.data.data[j].niveau.length; k++) {
                        if ($scope.classes[i] == data.data.data[j].niveau[k]) {
                            $scope.listqcms.push(data.data.data[j].name);
                        }
                    }
                }
                var detailqcm = { classe: $scope.classes[i], qcms: $scope.listqcms };
                $scope.mjrqcms.push({ classe: $scope.classes[i], qcms: $scope.listqcms });
            }
        });

        $scope.back2classes = function () {
            $scope.nivqcms = true;
            $scope.statsqcm = false;
            $scope.errShow = false;
            $scope.classes = [];
            $http.post('/findAllUsers').then(function (data) {
                $scope.users = data.data.data;
                $scope.users = $scope.users.filter(x => x.security_mask != 'prof');

                for (var i = 0; i < $scope.users.length; i++) {
                    $scope.classes.push($scope.users[i].niveau);
                }
                $scope.classes = $scope.classes.filter(onlyUnique);
            });

            $scope.qcms = [];
            $scope.mjrqcms = [];
            $http.post('/getTopics').then(function (data) {
                $scope.qcms = data.data.data;
                for (var i = 0; i < $scope.classes.length; i++) {
                    $scope.listqcms = [];
                    for (var j = 0; j < data.data.data.length; j++) {
                        for (var k = 0; k < data.data.data[j].niveau.length; k++) {
                            if ($scope.classes[i] == data.data.data[j].niveau[k]) {
                                $scope.listqcms.push(data.data.data[j].name);
                            }
                        }
                    }
                    var detailqcm = { classe: $scope.classes[i], qcms: $scope.listqcms };
                    $scope.mjrqcms.push({ classe: $scope.classes[i], qcms: $scope.listqcms });
                }
            });

        }

        $scope.showQCMStatistics = function (classe, qcm) {
            $scope.nivqcms = false;
            $scope.statsqcm = true;

            $scope.classe = classe;
            $scope.qcm = qcm;

            $scope.QCMResult = [];

            $http.post('/showQCMResult', { quizTopic: qcm }).then(function (data) {

                if (data.data.data == "") {
                    $scope.nivqcms = false;
                    $scope.statsqcm = false;
                    $scope.errShow = true;
                    $scope.showError = "Il n'y a pas de résultat à afficher";
                }
                else {
                    for (var i = 0; i < data.data.data.length; i++) {
                        if (data.data.data[i].niveau == classe) {
                            $scope.QCMResult.push(data.data.data[i]);
                        }
                    }
                    //$scope.statsqcm = $scope.QCMResult;
                    if ($scope.QCMResult == "") {
                        $scope.nivqcms = false;
                        $scope.statsqcm = false;
                        $scope.errShow = true;
                        $scope.showError = "Il n'y a pas de résultat à afficher";
                    }
                    else {
                        $scope.nivqcms = false;
                        $scope.statsqcm = true;
                        $scope.errShow = false;

                        $scope.nbrP = $scope.QCMResult.length;

                        var maxVal = parseInt($scope.QCMResult[0].userResult, 10);
                        var minVal = parseInt($scope.QCMResult[0].userResult, 10);

                        for (i = 0; i < $scope.QCMResult.length; i++) {
                            if (parseInt($scope.QCMResult[i].userResult, 10) > maxVal)
                                maxVal = parseInt($scope.QCMResult[i].userResult, 10);
                            if (parseInt($scope.QCMResult[i].userResult, 10) < minVal)
                                minVal = parseInt($scope.QCMResult[i].userResult, 10);
                        }

                        $scope.scoreMax = maxVal;
                        $scope.scoreMin = minVal;

                        var sum = 0;
                        for (var i = 0; i < $scope.QCMResult.length; i++) {
                            sum += parseInt($scope.QCMResult[i].userResult, 10);
                        }
                        $scope.ScoreAvg = Math.round(sum / $scope.QCMResult.length);
                    }
                }
            }, function (err) {

            })

        }

    });
});