//<reference path="../typings/tsd.d.ts" />
var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');
var nodemailer = require('nodemailer');
var multer = require('multer');
var path = require('path');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var config = require('./config');
mongoose.connect(config.database);
mongoose.connection.on('connected', function () { console.log('Connected ' + config.database); });
mongoose.connection.on('error', (err) => {
});
var userSchema_qcm = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    login: { type: String, required: true, index: true, unique: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    niveau: { type: String, required: true },
    security_mask: { type: String, required: true },
    Date: { type: String, default: Date.now() }
});
var topicSchema_qcm = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true },
    time: { type: Number },
    count: { type: Number },
    Date: { type: String, default: Date.now() },
    startDate: { type: Date },
    endDate: { type: Date },
    niveau: [{ type: String, required: true }],
    createdBy: { type: String, required: true }
});
var questionSchema_qcm = new mongoose.Schema({
    question: { type: String, unique: true },
    op1: String,
    op2: String,
    op3: String,
    op4: String,
    rightAnswer: String,
    questionType: String,
    quizTopic: { type: Schema.Types.ObjectId, ref: 'Topic_qcm' },
    CreatedAt: { type: String, default: Date.now() },
    case: Boolean
});
var resultSchema_qcm = new mongoose.Schema({
    userID: String,
    nom: String,
    prenom: String,
    login: String,
    email: String,
    niveau: String,
    quizTopic: String,
    userResult: String,
    date: { type: String, default: Date.now() }
});



userSchema_qcm.plugin(validator);
var User_qcm = mongoose.model('Users_qcm', userSchema_qcm);
var Question_qcm = mongoose.model('Questions_qcm', questionSchema_qcm);
var Result_qcm = mongoose.model('Results_qcm', resultSchema_qcm);
var Topic_qcm = mongoose.model('Topics_qcm', topicSchema_qcm);


exports.registerUser = function (req, res) {
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var login = req.body.login;
    var email = req.body.email;
    var password = req.body.password;
    var niveau = 'Admin';
    var security_mask = 'prof'; //security_mask equal 7 for Profs

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            var userInfo = new User_qcm({
                nom: nom,
                prenom: prenom,
                login: login,
                email: email,
                niveau: niveau,
                password: password,
                security_mask: security_mask
            });
            userInfo.save(function (err, data) {
                if (err) {
                    res.json({ success: false, 'message': "Cant register to this user Name", err: err });

                }
                else {
                    res.json({ success: true, "message": "Registered", 'data is': data });
                }
            });
        });
    });

};
exports.loginUser = function (req, res) {
    var login = req.body.login;
    //let email = req.body.email;
    var password = req.body.password;
    User_qcm.findOne({ login: login }, function (err, data) {
        if (err) {
            res.send('An error has occurred' + err);
        }
        else {
            if (!data) {

                res.json({ success: false, "message": "User not found" });
            }
            else {
                bcrypt.compare(password, data.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) res.json({ success: true, "data": data });
                    else res.json({ success: false, "message": "Password is wrong" });

                });

            } //else  for data forward
        } //Main else
    }); //FindOne funtionx
};
exports.addQuestion = function (req, res) {
    var data = req.body;
    var question_info = new Question_qcm({
        question: data.ques,
        op1: data.op1,
        op2: data.op2,
        op3: data.op3,
        op4: data.op4,
        case: data.case,
        rightAnswer: data.rightAnswer,
        questionType: data.questionType,
        quizTopic: data.quizName
    });


    Question_qcm.findOne({ question: req.body.ques }, function (err, data) {
        if (!data) {
            question_info.save(function (err, success) {
                if (err) {

                    res.json({ success: false, data: err });
                }
                else {

                    res.json({ success: true, data: success });
                }
            });
        }
        else {

            res.json({ success: false, "msg": "This Question Already Exists.." });
        }
    });
};
exports.getquizes = function (req, res) {

    Question_qcm.find({ quizTopic: req.body.paper }, function (err, data) {

        if (err) {
            res.json({ result: false, data: null });
        }
        else {

            res.json({ result: true, data: data });
        }
    });

};
exports.saveResult = function (req, res) {
    var user_result = req.body.riteans_perc;
    var userID = req.body.userID;
    var quizTopic = req.body.quizTopic;
    var login = req.body.login;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var niveau = req.body.niveau;

    var myDate = new Date();
    var result_info = new Result_qcm({
        userID: userID,
        quizTopic: quizTopic,
        nom: nom,
        prenom: prenom,
        niveau: niveau,
        login: login,
        userResult: user_result,
        date: myDate
    });
    result_info.save(function (err, data) {
        if (err) {

            res.json({ success: false, data: err });
        }
        else {

            res.json({ success: true, data: data });
        }

        //res.send("Result Recived.")
    });
};
exports.showResult = function (req, res) {
    var userID = req.body.userID;
    Result_qcm.find({ userID: userID }, function (err, data) {
        if (err) {
            res.json({ success: false, data: err });
        }
        else {
            if (!data) {
                res.json({ success: false, data: "Record not Found" });
            }
            else {
                res.json({ success: true, data: data });
            }
        }
    });
};
exports.userProfile = function (req, res) {
    var UserID = req.params.uid;
    User_qcm.findById(UserID, function (err, data) {
        if (err) {
            res.json({ success: false, "Error": err });
        }
        else {
            res.json({ success: true, "Data": data });
        }
    });
};
exports.findAllUsers = function (req, res) {
    User_qcm.find(function (err, data) {
        if (err) {

            res.json({ success: false, "data": err });
        }
        else {
            res.json({ success: true, "data": data });
        }
    });
};

exports.getTopics = function (req, res) {
    Topic_qcm.find(function (err, data) {
        if (err) {
            res.json({ success: false, "data": err });
        }
        else {

            res.json({ success: true, "data": data });
        }
    });
};
exports.getTopicById = function (req, res) {
    Topic_qcm.findOne({ _id: req.body.id }, function (err, data) {
        if (err) {
            res.json({ success: false, "data": err });
        }
        else {
            res.json({ success: true, "data": data });
        }
    });
};
exports.getQuestions = function (req, res) {
    Question_qcm.find(function (err, data) {
        if (err) {
            res.json({ success: false, "data": err });
        }
        else {

            res.json({ success: true, "data": data });
        }
    });
};
exports.addTopic = function (req, res) {

    var newTopic = new Topic_qcm({ name: req.body.name, time: req.body.time, count: req.body.count, niveau: req.body.niveau, startDate: req.body.startDate, endDate: req.body.endDate, createdBy: req.body.createdBy });
    newTopic.save(function (err, data) {
        if (err) {
            res.json({ success: false, 'message': "Can't add topic", err: err });
        }
        else {
            res.json({ success: true, data: data });
        }

    });
}
exports.updateTopic = function (req, res) {
    Topic_qcm.update({ _id: req.body._id }, { name: req.body.name, time: req.body.time, count: req.body.count, niveau: req.body.niveau, startDate: req.body.startDate, endDate: req.body.endDate }, function (err, data) {
        if (err) {
            res.json({ success: false, 'message': "Can't update topic", err: err });
        }
        else {
            res.json({ success: true, data: data });
        }

    });
}
exports.updateQuestion = function (req, res) {
    Question_qcm.update({ _id: req.body._id }, {
        question: req.body.question,
        op1: req.body.op1,
        op2: req.body.op2,
        op3: req.body.op3,
        op4: req.body.op4,
        rightAnswer: req.body.rightAnswer,
        questionType: req.body.questionType,
        case: req.body.case,
        quizTopic: req.body.quizName
    }, function (err, data) {
        if (err) {
            res.json({ success: false, 'message': "Can't update topic", err: err });
        }
        else {
            res.json({ success: true, data: data });
        }

    });
}
exports.removeTopic = function (req, res) {
    Topic_qcm.remove({ _id: req.body._id }, function (err) {
        if (err) {
            res.json({ success: false, 'message': "Can't remove topic", err: err });
        }
        else {
            Question_qcm.remove({ quizTopic: req.body._id }, function (err) {
                if (err) res.json({ success: false });
                else res.json({ success: true });
            });

        }

    });
}
exports.removeQuestion = function (req, res) {
    Question_qcm.remove({ _id: req.body._id }, function (err) {
        if (err) {
            res.json({ success: false, 'message': "Can't remove topic", err: err });
        }
        else {
            res.json({ success: true });
        }

    });
}
exports.emailSend = function (req, res) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "majidelfarkouki@gmail.com",
            pass: "codevirtual"
        }
    });
    // setup e-mail data with unicode symbols
    var mailOptions = {
        // from: req.body.from, // sender address
        to: "majidelfarkouki@gmail.com",
        subject: req.body.emailSubject,
        text: req.body.senderName,
        html: req.body.htmlCode // html body
    };
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {

            res.json({ success: false, "msg": "Some thing went wrong", error: error });
        }
        else {

            res.json({ success: true, "msg": "Message Sent", response: response });
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};
exports.findAllResults = function (req, res) {
    var userID = req.body.userID;

    Result_qcm.find({ userID: userID }, function (err, data) {
        if (err) {

            res.json({ success: false, data: err });
        }
        else {

        }
        res.json({ success: true, data: data });
    });
};

exports.showQCMResult = function (req, res) {
    var quizTopic = req.body.quizTopic;
    Result_qcm.find({ quizTopic: quizTopic }, function (err, data) {
        if (err) {

            res.json({ success: false, data: err });
        }
        else {

        }
        res.json({ success: true, data: data });
    });
};


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './classesuploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + Date.now())
    }
});
exports.uploadClasse = function (req, res) {
    var upload = multer(
        {
            storage: storage,
            //verification de xslx
            fileFilter: function (req, file, callback) {
                var ext = path.extname(file.originalname);
                if (ext !== '.xlsx' && ext !== '.xls') {
                    return callback(new Error('Only Excel files are allowed'))
                }
                callback(null, true)
            }

        }).single('myFile');
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file or not Excel files are uploaded.");
        }
        if (typeof require !== 'undefined') XLSX = require('xlsx');
        var workbook = XLSX.readFile(req.file.path);

        /* DO SOMETHING WITH workbook HERE */

        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        var data_json = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log("longueur de tableau : " + data_json.length);
        var longeur = data_json.length;


        var hashpassword = String(data_json[0]['password']);
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(hashpassword, salt, (err, hash) => {
                if (err) throw err;
                for (var i = 0; i < longeur; i++) {
                    var user = new User_qcm({
                        nom: data_json[i]['nom'],
                        prenom: data_json[i]['prenom'],
                        login: data_json[i]['login'],
                        email: data_json[i]['email'],
                        password: hash,
                        niveau: data_json[i]['niveau'],
                        security_mask: 'etudiant'
                    });

                    User_qcm.findOneAndRemove({ login: data_json[i]['login'] }, function (err) {
                        if (err) console.log("erreur est survenue");
                        else console.log("l'étudiant est supprimé avec succès");
                    });

                    /*Result.findOneAndRemove({ login: data_json[i]['login'] }, function (err) {
                        if (err) console.log("erreur est survenue");
                        else console.log("les résultats ont été supprimé avec succès");
                    });*/

                    user.save(function (err) {
                        if (err) throw err;
                        else console.log("le compte étudiant : " + user.login[i] + " a été bien créé.");
                    });
                    //console.log("le compte étudiant : " + data_json[i]['login'] + " a été bien créé.");
                }
            });
        });
        res.redirect('/classes');
    });
};

exports.updatePassword = function (req, res) {
    var id = req.body._id;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var login = req.body.login;
    var email = req.body.email;
    var password = req.body.password;
    var niveau = req.body.niveau;
    console.log(password);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            User_qcm.update({ _id: id }, { password: password }, function (err, data) {
                if (err) {
                    res.json({ success: false, 'message': "Can't update password", err: err });
                }
                else {
                    res.json({ success: true, data: data });
                }

            });
        });
    });
};
