var app = angular.module('app.dash', ['smart-table']);
app.controller('dashCtrl', function ($scope, $document, $http, $state, $rootScope) {
    var that = this;
    $scope.myOrderBy = 'quizTopic';
    $scope.orderByMe = function (x) {
        $scope.myOrderBy = x;
    }
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

        that.users = true;
        that.userResults = false;
        $http.post('/findAllUsers').then(function (data) {
            that.users = data.data.data;
            that.users = that.users.filter(x => x.security_mask != 'prof');
            that.userID = data.data.data;
        }, function (err) {

        })

        that.back2users = function () {
            that.errShow = false;
            that.users = true;
            that.userResults = false;
            $http.post('/findAllUsers').then(function (data) {

                that.users = data.data.data;
                that.users = that.users.filter(x => x.security_mask != 'prof');
            });

        }
        $scope.showUserResult = function (userID) {
            that.users = false;
            that.userResults = true;

            $http.post('/findAllResults', { userID: userID }).then(function (data) {


                if (data.data.data == "") {
                    that.users = false;
                    that.userResults = false;
                    that.errShow = true;
                    that.showError = "Il n'y a pas de résultat à afficher";
                }
                else {
                    that.userResult = data.data.data;
                    that.users = false;
                    that.userResults = true;
                    that.errShow = false;

                }
            }, function (err) {

            })

        }

        $scope.getDateString = function (str) {
            var tempDate = new Date(str);
            return tempDate.toISOString().slice(0, 16);
        }
    });
});