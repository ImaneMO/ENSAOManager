angular.module('app.adminQuestions',['smart-table'])
.controller('adminQuestionsCtrl',function($scope,$http,$document,$state, $location,$mdToast,$mdDialog){
    var id = localStorage.getItem['id'];
    var login = localStorage.getItem('login');
    var security_mask = localStorage.getItem('security_mask');
    if(security_mask == undefined || security_mask !== 'prof'){  
        $state.go('signin');
        $scope.isAdmin = false;  
    }
    else{
        $scope.isAdmin = true;
    }
    getStringArray = function(str){
      
        return str.split(",");
    }

    toastShow = function(text){
        $mdToast.show(
            $mdToast.simple()
            .textContent(text)
            .position("bottom right")
            .hideDelay(500)
        );
    }
    $scope.active = true;
    $scope.active1 = true; 
    $scope.topics = [];
    $scope.topic = "All";
    $http.post('/getTopics').then(function(data){
        $scope.topics = data.data.data;
    });
    $scope.questions = [];
    $scope.sourceQuestions = [];
    $scope.flags = [];
    $scope.answers = null;
    $scope.selectedQuestion = -1;
    $scope.updateQuestion = null;
    $scope.topicNames = [];
    $scope.getQuizName = function(str){
        var selTopic = $scope.topics.filter(x => x._id == str);
        return selTopic[0].name;
    }

    fixWithQuestions = function(){
        $scope.flags = Array($scope.questions.length).fill(true);
        $scope.topicNames = [];
        $scope.questions.forEach(element => {  
            $scope.topicNames.push($scope.getQuizName(element.quizTopic));
        });
    }
    loadQuestions = function(){
        $http.post('/getQuestions').then(function(data){
            $scope.questions = data.data.data;
            $scope.sourceQuestions = JSON.parse(JSON.stringify( $scope.questions ));
            $scope.filterByTopic();
            
        });
    }
    validateQuestion = function(ques){
        if(ques.quizName == undefined || ques.quizName == "None"){
            toastShow("Veuillez sélectionner un QCM");
            return false;
        }
        if(ques.question == undefined || ques.question == ""){
            toastShow("Veuillez saisir une question");
            return false;
        }
        if((ques.questionType != "fill") && (ques.rightAnswer == undefined || ques.rightAnswer == "")){
            toastShow("Veuillez sélectionner la bonne réponse");
            return false;
        }

        var res = true;
        if(ques.questionType == "multiple"){
            ques.rightAnswer.forEach(element => {
                if(ques[element] == undefined || ques[element] == ""){
                    toastShow("Veuillez entrer des réponses alternatives");
                    res = false;
                }
            });
        }else{
            if((ques.questionType == "single") &&  ques[ques.rightAnswer] == undefined || ques[ques.rightAnswer] == ""){
                toastShow("Veuillez entrer des réponses alternatives");
                res = false;
            }else if(ques.questionType == "fill"){
                if(ques.question.indexOf('^[]^') < 0){
                    toastShow("S'il vous plaît écart d'entrée. (^[]^)");
                    res = false;
                }else{
                    if(ques['op1'] == undefined || ques['op1'] == ""){
                        toastShow("Veuillez entrer les réponses");
                        res = false;
                    }
                }

            }
        }
        
        return res;
    }
    loadQuestions();

    $scope.selectQuestion = function(index, ev){
        var status = $scope.flags[index];
        $scope.flags.fill(true, 0, $scope.flags.length);
        $scope.flags[index] = !status;
        if(!$scope.flags[index]){
            if($scope.selectedQuestion != index){

                $scope.selectedQuestion = index;
                $scope.updateQuestion = JSON.parse(JSON.stringify($scope.questions[$scope.selectedQuestion]));
                if($scope.updateQuestion.questionType != 'fill')
                    $scope.answers = getStringArray($scope.updateQuestion.rightAnswer);
               
            }
            
        }
    }
    $scope.addQuestion = function(){
        $state.go('addquestion');
    }
    $scope.removeQuestion = function(index, ev){
        $scope.collapseAll();
        var confirm = $mdDialog.confirm()
        .title('Voulez-vous supprimer la question?')
        .textContent('')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .cancel('Non')
        .ok('Oui');
        $mdDialog.show(confirm).then(function() {
            $http.post('/removeQuestion', $scope.questions[index]).then(function(data){
                if(data.data.success == false){
                    toastShow("Échec de la suppression");
                }
                else{
                        loadQuestions();
                        toastShow("Retiré avec succès");
                }
                },function(err){
                    toastShow("Échec de la suppression");
                });
        }, function() {
            
        });

        
    }
    $scope.searchQuestions = function(){

    }
    $scope.getTopicIdFromName = function(name){

        var selTopic = $scope.topics.filter(x => x.name == name);
        return selTopic[0]._id;
    }
    $scope.updateQuestionFunc = function(index){
        
        if($scope.updateQuestion.questionType == "multiple"){
            $scope.updateQuestion.rightAnswer = $scope.answers;
        }

         $scope.updateQuestion.quizName = $scope.getTopicIdFromName($scope.topicNames[index]);
        

        if(!validateQuestion($scope.updateQuestion))  return;
   
        $http.post('/updateQuestion', $scope.updateQuestion).then(function(data){
        if(data.data.success == false){
            toastShow("Échec de mise à jour");
        }
        else{
                loadQuestions();
                toastShow("Mis à jour avec succés");
        }
        },function(err){
            toastShow("Échec de mise à jour");
        });
        
    }
    $scope.collapseAll = function(){
        $scope.flags.fill(true, 0, $scope.flags.length);
    }
    $scope.filterByTopic = function(){   
        if($scope.topic == "All"){
            $scope.questions = JSON.parse(JSON.stringify( $scope.sourceQuestions));
        }else{
            var topicId = $scope.getTopicIdFromName($scope.topic);
            $scope.questions = JSON.parse(JSON.stringify( $scope.sourceQuestions.filter(x => x.quizTopic == topicId) ));
            
        }
        fixWithQuestions();
    }
}) 
 