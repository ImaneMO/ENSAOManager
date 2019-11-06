angular.module('app.selecttopic', ['smart-table'])
    .controller('selecttopicCtrl', function ($scope, $http, $document, $state, $location, $mdToast) {
        var id = sessionStorage.id;
        var login = localStorage.getItem('login');
        var niveau = localStorage.getItem("niveau");
        var security_mask = localStorage.getItem('security_mask');

        if (security_mask == undefined || security_mask == 'prof') {
            $state.go('signin');
        }

        $scope.topics = [];
        $scope.expiredQCM = [];
        $scope.validQCM = [];
        $scope.classQCM = [];

        var d = new Date();

        $scope.QCMPasser = [];
        $http.post('/findAllResults', { userID: id }).then(function (data) {
              for(var i=0; i<data.data.data.length; i++){
                  $scope.QCMPasser.push(data.data.data[i].quizTopic);
              }
        });


        $http.post('/getTopics').then(function (data) {
            $scope.topics = data.data.data;

            for (var k = 0; k < data.data.data.length; k++) {
                for (var j = 0; j < data.data.data[k].niveau.length; j++) {
                    if (data.data.data[k].niveau[j] == niveau) {
                        $scope.classQCM.push(data.data.data[k]);
                    }
                }
            }

            for (var i = 0; i < $scope.classQCM.length; i++) {
                if (d.getTime() >= new Date($scope.classQCM[i].startDate) && d.getTime() < new Date($scope.classQCM[i].endDate)) {
                    $scope.validQCM.push($scope.classQCM[i]);
                }
                else {
                    $scope.expiredQCM.push($scope.classQCM[i]);
                }
            }

        });


        $scope.selectTopic = function (id) {
            localStorage.setItem('topic', id);
            $state.go('getquestion');
        }
    })
