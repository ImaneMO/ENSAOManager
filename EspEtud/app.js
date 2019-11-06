var app = angular.module('myApp',[]);
app.controller('genererCtrl',function($scope,$http,$interval) {
    $scope.parametres = {
        time: 60,
        nbQuestion: 10
    }
    $scope.isPar = false
    $scope.score = 0
    $scope.isQuiz = false
    $scope.quiz = []
    $scope.listGen = []
    $interval(function(){ $scope.timerFct()}, 1000);
    $scope.addToList = function(elmt){
        objet = {
            _id: elmt._id,
            intitulee: elmt.intitulee           
        }
        $scope.listGen.push(objet)
        $scope.searchElmtList = {}
        $scope.keySearch = ""
    }    
    $scope.suppList = function(elmt){
        $scope.listGen.splice($scope.listGen.indexOf(elmt), 1);
    }
    $scope.searchElmt = function(){
        $scope.searchElmtList = {}
        $http.get('/api/eModuleQuizs/searchByIntitulee/'+$scope.keySearch).then(
            (response) => {
                if (response.data.success) {
                    $scope.searchElmtList = response.data.data;
                }
            }
        );
    }
    $scope.submit = function(){
        $scope.score = 0;
        for(var i=0;i<$scope.quiz.length;i++){
            var que = $scope.quiz[i];
            var bon = true            
            if(que.type == "MultiChoix"){                
                for(var j=0;j<que.reponses.length && bon;j++){
                    if(que.reponses[j].isTrue != que.reponses[j].quizRep)bon = false
                }
                
            }
            else if(que.type == "Unique"){
                if(que.quizRep==-1 || !que.reponses[que.quizRep].isTrue)bon = false
            }
            else if(que.type == "Formule"){
                bon = false
                for(var j=0;j<que.reponses.length && !bon;j++){
                    if(que.reponses[j].reponse == que.quizRep)bon = true
                }
            }
            if(bon)$scope.score += 1;
        }
        $scope.score /=$scope.quiz.length
        $scope.score *=100
        $scope.score = Math.floor($scope.score) + "%"
        $scope.isQuiz = false
        $scope.quiz = []
    }
    $scope.showPar = function(){
        $scope.isPar = !$scope.isPar
    }
    $scope.generer = function(){
        for(var i=0; i<$scope.parametres.nbQuestion;i++){
            siz = $scope.listGen.length
            elmid = $scope.listGen[i%siz]._id
            $http.get('/api/questions/emodule/'+elmid).then(
                (response) => {
                    if (response.data.success) {
                        if(response.data.data.length>0){
                            var que = response.data.data[Math.floor(Math.random() * response.data.data.length)];
                            if(que.type != "Formule")que.quizRep = -1
                            else que.quizRep = ""
                            for(var i=0;i<que.reponses.length;i++){
                                que.reponses[i].quizRep = false
                            }                            
                            $scope.quiz.push(que)
                    
                        }
                    }
                }
            ); 
        }
        $scope.isQuiz = true
        $scope.timerSc = $scope.parametres.time * 60
    }
    $scope.timerFct = function() {        
        if($scope.isQuiz){
            $scope.timerSc -= 1
            var min = Math.floor($scope.timerSc/60);
            sc = $scope.timerSc - min*60
            $scope.timer = min + ":" + sc
            if($scope.timer == "0:0")$scope.submit()
        }   
    }
})