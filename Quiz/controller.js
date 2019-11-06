app.controller('questionsElmt',function($scope,$stateParams,$http) {
    $scope.test = []
    $scope.reponses = []
    $scope.orderby = {
        "filtre": '',
        "asc": true
    }
    $scope.ind = 1
    $scope.reponse = null
    $scope.question = {"type":"Unique","eModule":$stateParams.id_elmt}
    $scope.partie = {"eModule":$stateParams.id_elmt}
    $scope.isShow = null;
    $scope.currentPage = 0;
    $scope.pageSize = "5";
    getQuestions()
    getParties()
    getElmtModule()
    $scope.numberOfPages=function(){
        return Math.ceil($scope.questions.length/$scope.pageSize);                
    }
    $scope.setcurrentPage=function(pg){
        $scope.currentPage = pg;
    }
    
    $scope.annuler = function(){
        $scope.question = {"type":"Unique","eModule":$stateParams.id_elmt}
        $scope.isShow = null;        
        $scope.reponses = []
    }    
    $scope.trier = function(filtree){
        if($scope.orderby.filtre == filtree)$scope.orderby.asc = !$scope.orderby.asc
        if($scope.orderby.filtre != filtree){
            $scope.orderby.asc = false
            $scope.orderby.filtre = filtree
        }
    }
    $scope.selectedCls = function(column) {
        if(column == $scope.orderby.filtre){
            return ('fa fa-sort-' + (($scope.orderby.asc) ? 'desc' : 'asc'));
        }
        else{            
            return'fa fa-sort' 
        } 
    };
    $scope.showAdd = function(){
        $scope.question = {"type":"Unique","eModule":$stateParams.id_elmt}
        $scope.isShow = "add";        
        $scope.reponses = []
    }
    $scope.submit = function(){
        if($scope.question.type == "Unique") $scope.question.reponses[$scope.question.isTrue].isTrue = true
        if($scope.question.type == "Formule") {
            for(var i=0;i< $scope.question.reponses.length ; i++){
                $scope.question.reponses[i].isTrue = true
            }
        }
        $http.post('/api/questions',$scope.question).then(function success(res){
            if(res.data.success){
                $scope.isShow = null;
                getQuestions()                
            }
            else alert(JSON.stringify(res.data.err));
        })
    }
    $scope.AjouterPartie = function(){
        var testEx = true
        $scope.parties.forEach(element => {
            if(element.partieText == $scope.partie.partieText){
                testEx = false
                $scope.partie = {"eModule":$stateParams.id_elmt}
                $scope.question.partie = element._id
            }
        });
        if(testEx){
            $http.post("/api/parties/", $scope.partie).then(function success(res) {
                if (res.data.success) {
                    $scope.partie = {"eModule":$stateParams.id_elmt}
                    $scope.question.partie = res.data.data._id
                    getParties()
                }
                else alert(JSON.stringify(res.data.err));
            });
        }
    }
    $scope.updateQuestion = (id) => {
        if($scope.question.type == "Unique") $scope.question.reponses[$scope.question.isTrue].isTrue = true
        if($scope.question.type == "Formule") {
            for(var i=0;i< $scope.question.reponses.length ; i++){
                $scope.question.reponses[i].isTrue = true
            }
        }
        $http.put('/api/questions/' + id, $scope.question).then(function success(res) {
            if (res.data.success) {
                $scope.isShow = null;
                $scope.question = {}
                getQuestions()
            }
            else alert(JSON.stringify(res.data.err));
        });
    }
    $scope.deleteQuestion = (idQuestion) => {
        $http.delete("/api/questions/" + idQuestion).then(function success(res) {
            if (res.data.success) {
                getQuestions()
            }
            else alert(JSON.stringify(res.data.err));
        });
    }
    $scope.updateQuestionShow = (index) => {
        $scope.question = $scope.questions[index]
        $scope.reponses = $scope.question.reponses 
        if($scope.question.type == "Unique"){
            for(var i=0; i<$scope.question.reponses.length ; i++ ) {
                if($scope.question.reponses[i].isTrue)$scope.question.isTrue = i
            };
        }
        $scope.isShow = "edit";        
    }
    $scope.AjouterRep = () => {
        $scope.reponses.push({
            reponse: $scope.question.reponse,
            isTrue: false
        })
        $scope.question.reponse=null
        $scope.question.reponses = $scope.reponses
    }
    $scope.deleteRep = (index) => {
        $scope.reponses.splice(index, 1)
        $scope.question.reponses = $scope.reponses
    }    
    $scope.getPartieName = (id) => {
        for(var i=0;i< $scope.parties.length ; i++){
            if($scope.parties[i]._id == id) return $scope.parties[i].partieText
        }

    }
    function getQuestions() {
        $http.get('/api/questions/emodule/'+$stateParams.id_elmt).then(
            (response) => {
                if (response.data.success) {
                    $scope.questions = response.data.data;
                }
            }
        );
    }
    function getParties() {
        $http.get('/api/parties/emodule/'+$stateParams.id_elmt).then(
            (response) => {
                if (response.data.success) {
                    $scope.parties = response.data.data;
                }
            }
        );
    }
    function getElmtModule(){
        $http.get('/api/eModuleQuizs/'+$stateParams.id_elmt).then(
            (response) => {
                if (response.data.success) {
                    $scope.elmtMo = response.data.data;
                }
            }
        );
    }
})
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});