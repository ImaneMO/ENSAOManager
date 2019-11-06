angular.module('app.adminTopic', ['smart-table'])
    .controller('adminTopicCtrl', function ($rootScope, $scope, $mdDialog, $http, $document, $state, $location, $mdToast) {
        var id = localStorage.getItem['id'];
        var login = localStorage.getItem('login');
        var security_mask = localStorage.getItem('security_mask');
        $scope.topics = [];
        $scope.newTopic = "";


        updateTable = function () {
            $scope.niveaux = [];
            $scope.qcms = [];

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            };

            $http.post('/findAllUsers').then(function (data) {
                for (var i = 0; i < data.data.data.length; i++) {
                    data.data.data = data.data.data.filter(x => x.security_mask != 'prof');
                    $scope.niveaux.push(data.data.data[i].niveau);
                }
                $scope.niveaux = $scope.niveaux.filter(onlyUnique);
            });
            $http.post('/getTopics').then(function (data) {
                $scope.topics = data.data.data;
            });
        };

        toastShow = function (text) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position("bottom right")
                    .hideDelay(500)
            );
        }
        $document.ready(function () {
            if (security_mask == undefined || security_mask !== 'prof') {
                $state.go('signin');
                $scope.isAdmin = false;
            }
            else {
                $scope.isAdmin = true;
            }

            updateTable();


            $scope.addTopic = function (ev) {
                $mdDialog.show({
                    controller: AddTopicController,
                    templateUrl: './Quiz/adminTopic/addTopic.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false
                })
                .then(function (answer) {

                 }, function () {

                 });
            };

            $scope.removeTopic = function (index, ev) {
                var confirm = $mdDialog.confirm()
                    .title('Voulez-vous supprimer cet examen QCM ?')
                    .textContent('Toutes les questions de ce QCM seront supprimées.')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .cancel('Non')
                    .ok('Oui');
                $mdDialog.show(confirm).then(function () {
                    var selTopic = $scope.topics.filter(x => x._id == index);
                    $http.post('/removeTopic', selTopic[0]).then(function (data) {
                        if (data.data.success == false) {
                            toastShow("Échec de la suppression");
                        }
                        else {
                            updateTable();
                            toastShow("Retiré avec succès");
                        }
                    }, function (err) {
                        toastShow("Échec de la suppression");
                    });
                }, function () {

                });

            }
            $scope.updateTopic = function (index) {
                var selTopic = $scope.topics.filter(x => x._id == index);
                $http.post('/updateTopic', selTopic[0]).then(function (data) {
                    if (data.data.success == false) {
                        toastShow("Échec de mise à jour");
                    }
                    else {
                        updateTable();
                        toastShow("Mis à jour avec succés");
                    }
                }, function (err) {
                    toastShow("Échec de mise à jour");
                });
            };
        })

        function AddTopicController($scope, $mdDialog) {
            $scope.niveaux = [];

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            $http.post('/findAllUsers').then(function (data) {
               data.data.data = data.data.data.filter(x => x.security_mask != 'prof');
              for (var i = 0; i < data.data.data.length; i++) {
                  $scope.niveaux.push(data.data.data[i].niveau);
                }
                $scope.niveaux = $scope.niveaux.filter(onlyUnique);
            });

            $scope.topic = {};
            $scope.submit = function () {
                if ($scope.topic.name != undefined && $scope.topic.time != undefined && $scope.topic.count != undefined && $scope.topic.startDate != undefined && $scope.topic.endDate != undefined && $scope.topic.niveau != undefined) {
                    $scope.topic.createdBy = login;
                    $http.post('/addTopic', $scope.topic).then(function (data) {

                        if (data.data.success == false) {
                            toastShow("Même QCM existant");
                        }
                        else {
                            updateTable();
                            toastShow("Ajouté avec succès");
                            $scope.topic = {};
                            $mdDialog.hide();
                        }
                    }, function (err) {
                        toastShow("Échec de l'ajout");
                    });
                }
            }
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }
    })
