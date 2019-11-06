

angular.module("quizApp")
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider.state('home', {
            url: "/",
            templateUrl: "../components/home/home.html",
            controller: "quizCtrl"
        }
        )
            .state('signin', {
                url: "/signin",
                templateUrl: "../components/login/login.html",
                controller: "loginCtrl"

            }
            )
            .state('signup', {
                url: "/signup",
                templateUrl: "../components/signup/signup.html",
                controller: "signupCtrl"
            }
            )


            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "../components/dashboard/dash.html",
                controller: "dashCtrl",
                controllerAs: "dash",
                loginCompulsory: true
            }
            )
            .state('getquestion', {
                url: "/getquestion",
                templateUrl: "../components/getQuestion/getquestion.html",
                controller: "getQuizCtrl",
                loginCompulsory: true
            }
            )
            .state('showScores', {
                url: "/showScores",
                templateUrl: "../components/showScores/showScores.html",
                controller: "showScoresCtrl",
                loginCompulsory: true
            }
            )
            .state('addquestion', {
                url: "/addquestion",
                templateUrl: "../components/addQuestion/addQuestion.html",
                controller: "addQuestionCtrl",
                loginCompulsory: true
            }
            )

            .state('contact', {
                url: "/contact",
                templateUrl: "../components/contact/contact.html",
                controller: "contactCtrl",
                loginCompulosry: true
            }
            )
            .state('adminTopic', {
                url: "/topic",
                templateUrl: "../components/adminTopic/adminTopic.html",
                controller: "adminTopicCtrl",
                loginCompulosry: true
            }
            )
            .state('selecttopic', {
                url: "/selecttopic",
                templateUrl: "../components/selecttopic/selecttopic.html",
                controller: "selecttopicCtrl",
                loginCompulosry: true
            }
            )
            .state('adminQuestions', {
                url: "/questions",
                templateUrl: "../components/adminQuestions/adminQuestions.html",
                controller: "adminQuestionsCtrl",
                loginCompulosry: true
            }
            )
            .state('userprofile', {
                url: "/userprofile",
                templateUrl: "../components/userprofile/userprofile.html",
                controller: "userprofileCtrl",
                loginCompulosry: true
            }
            )
            .state('adminClass', {
                url: "/classes",
                templateUrl: "../components/adminClass/adminclass.html",
                controller: "showClassesCtrl",
                loginCompulosry: true
            }
            )
            .state('addclass', {
                url: "/ulpoadclasses",
                templateUrl: "../components/adminClass/addclass.html",
                loginCompulosry: true
            }
            )
            .state('statisticspanel', {
                url: "/statisticspanel",
                templateUrl: "../components/statistics/statisticspanel.html",
                controller: "statisticsCtrl",
                loginCompulosry: true
            }
            )
            
            .state('updatepassword', {
                url: "/updatepass",
                templateUrl: "../components/userprofile/updatepass.html",
                controller: "updatepassCtrl",
                loginCompulosry: true
            }
            );

        $urlRouterProvider.otherwise('/')
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });


    })

    .constant('heroku', 'http://localhost:8080')

    .run(function ($rootScope, $state) {
        $rootScope.$on("$stateChangeStart", function (event, toState) {
            // var token = localStorage.getItem('id');
            var session = sessionStorage.id;
            if (toState.loginCompulsory && session) {
                event.preventDefault();
                $state.go('signin');
            }
        })

    })

