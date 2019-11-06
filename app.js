// Import Packages
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var logger = require('morgan');



var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
var async = require('async');
var expSession = require('express-session');
var MongoStore = require('connect-mongo')(expSession);
var conEnsure = require('connect-ensure-login');
var fileUpload = require('express-fileupload');
var methodOverride = require('method-override');


// Import Routes
var index = require('./routes/index');
var database = require('./dataBase');


var prouter = require('./routes/prouter');
var resetpasswd = require('./routes/Updatepasswd');
var cfrouter = require('./routes/cfrouter');
var adminrouter = require('./routes/adminrouter');
var eModuleRouteHandler = require('./routes/eModuleRoute');
var moduleRouteHandler = require('./routes/moduleRoute');
var profRouteHandler = require('./routes/profRoute');
var filiereRouteHandler = require('./routes/filiereRoute');
var uploadComptes = require("./routes/CompteUpload");
var uploadFiliere = require("./routes/FiliereUpload");
var comptesDownload = require("./routes/CompteDownload");
var downloadFiliere = require("./routes/FiliereDownload");
var questions = require('./routes/questions');
var parties = require('./routes/parties');
var eModuleQuizs = require('./routes/eModuleQuizs');
var chargerouter = require('./routes/chargeRoute');
var charge = require('./routes/charge');

// Import Models
var User = require("./models/databaseModels").profs

var chargerouter = require('./routes/chargeRoute');
var charge = require('./routes/charge');

var chargeSchema = require("./models/charge").charge;
var archivesSchema= require("./models/charge").archive;

var Rat = require("./models/rattrappage");
var Matiere = require("./models/Matiere");
var Notes = require("./models/Notes");
var Module = require("./models/Module");

//------------------------ server.js-----------------------------------------------------


// Initialize app
var app = express();

//----------------------------QCM --------------------------------------------------------

//middleware functions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
//router.get('/',database.index)
var Ipublic = path.resolve(__dirname, 'public');
app.use(express.static(Ipublic));

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/registerUser', database.registerUser);
app.post('/loginUser', database.loginUser);
app.post('/addQuestion', database.addQuestion);
app.post('/getquizes', database.getquizes);
app.post("/saveResult", database.saveResult);
app.post('/showResult', database.showResult);
app.post('/showQCMResult', database.showQCMResult);
app.post('/userProfile/:uid', database.userProfile);
app.post('/findAllUsers', database.findAllUsers);
app.post('/findAllResults', database.findAllResults);
app.post('/emailSend', database.emailSend);
app.post('/getTopics', database.getTopics);
app.post('/addTopic', database.addTopic);
app.post('/updateTopic', database.updateTopic);
app.post('/removeTopic', database.removeTopic);
app.post('/getQuestions', database.getQuestions);
app.post('/removeQuestion', database.removeQuestion);
app.post('/updateQuestion', database.updateQuestion);
app.post('/getTopicById', database.getTopicById);
app.post('/uploadclass',database.uploadClasse);
app.post('/updatepass',database.updatePassword);


//-----------------------------------------------------------------------------------------



        // Hook up Passport.
        // Initialize passport
app.use(passport.initialize());

        // Hook up the HTTP logger.
app.use(logger('dev'));

        // Parse as urlencoded and json.
app.use(bodyParser.urlencoded({limit:128/*limiter la taille du body par securité*/,extended:true}));
app.use(bodyParser.json());

        // Set the static files location.
app.use('/', express.static(__dirname + "/public"));

        // Home route.
app.get('/', function (req, res) {
  console.log("user :"+req.user);

  req.logout();
  res.redirect('/login');
});


//---------------------------------------------------------------------------------------------



//var fileUpload = require('express-fileupload');

// Connect to Mongoose
var urlDb = 'mongodb://127.0.0.1:27017/dbApp'
mongoose.connect(urlDb).then(
  () => {
    console.log("La connexion à la base de données est reussite");
  },
  err => {
    console.log(err);
  }
);
var db = mongoose.connection;


// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


/**
 * A refaire Partie Front
 * Apres la realisation de partie front
 */

app.use('/app', express.static(__dirname + "/public/app"));
app.use('/bower_components', express.static(__dirname + "/public/bower_components"));
app.use('/js', express.static(__dirname + "/public/app/js"));
app.use('/css', express.static(__dirname + "/public/app/css"));
app.use('/dist', express.static(__dirname + "/public/bower_components/jquery/dist"));
app.use('/Gest-Charges', express.static(__dirname + "/public/app/Gest-Charges"));
app.use('/Gest-Delib', express.static(__dirname + "/public/app/Gest-Delib"));
app.use('/Settings', express.static(__dirname + "/public/app/Settings"));
app.use('/Gest-Filiere', express.static(__dirname + "/public/app/Gest-Filiere"));
app.use('/Gest-PFE', express.static(__dirname + "/public/app/Gest-PFE"));
app.use('/login', express.static(__dirname + "/public/app/login"));
app.use('/ChangPassword', express.static(__dirname + "/public/app/ChangPasswd"));
app.use('/userprofile', express.static(__dirname + "/public/app/userprofile"));
app.use('/selecttopic', express.static(__dirname + "/public/app/selecttopic"));
app.use('/showScores', express.static(__dirname + "/public/app/showScores"));
//safae start
app.use('/ComptesUpload', express.static(__dirname + "/public/app/ComptesUpload"));
app.use('/FiliereUpload', express.static(__dirname + "/public/app/FiliereUpload"));
app.use('/ComptesDownload', express.static(__dirname + "/public/app/ComptesDownload"));
app.use('/FiliereDownload', express.static(__dirname + "/public/app/FiliereDownload"));
//safae end
app.use('/insert', express.static(__dirname + "/public/app/Gest-Charges/importer"));

//Quiz
app.use('/Quiz', express.static(__dirname + "/public/app/Quiz"));



/**
 * Midlewares
 * Midleware est une fonction qui peut Filtrer/Modifier/Traiter la requette
 */
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Initialise La session
app.use(expSession({
  secret: '$zxyz-banana-0987choco',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: urlDb })
}));


//l'implementation de la session dans passport
app.use(passport.session());

//mettre en place la strategie d'authentification passport
passport.use('local', new LocalStrategy(/*passReqToCallback:true*/{
                        usernameField: 'login',
                        passwordField: 'password'
                      },
                      function (username, password, done) {
                        User.findOne({ login: username, password: password }, function (err, user) {
                          if (err) { return done(err); }
                          else if (!user)
                            return done(null, false, { message: 'Incorrect username or password.' });
                          else if (user.password != password)
                            return done(null, false, { message: 'Incorrect password.' });
                          else {
                            return done(null, user);
                          }
                        });
                      })
);

//sauvgarde des infos d'user authentifié dans le session-store (connect-mongo)
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

//recupère les infos(id+login+security_mask) d'un à partir de la session
passport.deserializeUser(function (id, done) {
  User.findById(id, '_id login security_mask filiere active_semestre nom prenom', function (err, user) {
    if (!err) done(null, user);
  });

});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));




app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Affecter les routes
//app.use('/', index); // just for test app

app.use('/', prouter);
app.use('/', cfrouter);
app.use('/', adminrouter);
app.use('/', resetpasswd);
//safae start
app.use('/', uploadComptes);
app.use('/', uploadFiliere);
app.use('/', comptesDownload);
app.use('/', downloadFiliere);
//safae end
app.use(fileUpload());

app.use('/',chargerouter);
app.use('/gestionfiliere/eModules', eModuleRouteHandler);
app.use('/gestionfiliere/modules', moduleRouteHandler);
app.use('/gestionfiliere/profs', profRouteHandler);
app.use('/gestionfiliere/filiere', filiereRouteHandler);
// Back quiz
app.use('/api/questions', questions);
app.use('/api/parties', parties);
app.use('/api/eModuleQuizs', eModuleQuizs);
//charge route
//app.use(fileUpload());
app.use('/', charge);
/**
 * Cette Partie jusqu'à "Fin Partie" il faut des fichiers dans routes"
 */

// login_
app.get('/login_', function (req, res) {
  //  my code
  res.status(200).json({ info: "non_auto" });
});
app.post('/login', function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      res.status(404).json(err);
      return;
    }
    else if (!user) {
      res.status(401).json({ err: info });
    } else {
      req.logIn(user, function (err) {
        if (err) next(err);
        else if (!user.firstlogin) {
          res.status(200).json({ ok: "firstlogin" });
        } else {
          res.status(200).json({ ok: "success" });
        }
      });

    }
  })(req, res);
});

// Page Static
app.get('/ChangPassword/:admin', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/public/app/ChangPasswd' });
});
app.get('/ChangPassword/:etudiant', function(req, res){
  res.sendFile('index.html', { root: __dirname + '/public/app/ChangPasswd' });
});

// Changer Password
app.post('/ChangPassword/:admin', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ login: req.user.login }, function (err, user) {
        if (!user) {
          res.status(401).json({ err: 'username invalid' });
        }
        user.password = req.body.password;
        user.firstlogin = 1;

        user.save(function (err) {
          req.logIn(user, function (err) {
            done(err, user);
          });
        });
      });
    }
  ], function (err) {
    res.status(200).json({ ok: "success" });
  });
});

///safae start
//Creation des comptes
app.get('/ComptesUpload', function (req, res) {
  //  here je redirige vers la page de la creation des comptes
  res.sendFile('index.html', { root: __dirname + '/public/app/ComptesUpload' });
});

//Import des filières
app.get('/FiliereUpload', function (req, res) {
  //  here je redirige vers la page de l'import des comptes
  res.sendFile('index.html', { root: __dirname + '/public/app/FiliereUpload' });
});
//Export des filières
app.get('/FiliereDownload', function (req, res) {
  //  here je redirige vers la page de l'import des comptes
  res.sendFile('index.html', { root: __dirname + '/public/app/FiliereDownload' });
});
//safae end

// Deconnexion
app.get('/logout', function (req, res) {
  console.log("user :"+req.user);
  req.logout();
  res.redirect('/login');
});


/**
 * Fin Partie
 */


//outil: js global trim
var white = new RegExp(/(\s|[^A-Za-z0-9_-]|[\n\r])/g);
String.prototype.gtrim = function () {
  return this.replace(white, '');
};


// Front-End Route
app.get("*", function (req, res) {
  res.sendFile("/public/app/index.html", { root: __dirname });
});


// check the database if its empty
User.find({}, function (err, users) {
  if (err) throw err;
  if (users.length == 0) {
    console.log("database empty");
    var admin = new User({
      nom: 'admin',
      prenom: 'admin',
      password: 'admin',
      login: 'admin',
      security_mask: 8,
      email: 'belhadj.gi@gmail.com',
    });

    var etudiant = new User({
      nom: 'etudiant',
      prenom: 'etudiant',
      password: 'etudiant',
      login: 'etudiant',
      security_mask: 8,
      email: 'e@e.com',
    });

    admin.save(function (err) {
      if (err) throw err;
      console.log('compte admin created successfully!');
    });

    etudiant.save(function (err) {
      if (err) throw err;
      console.log('compte etudiant created successfully!');
    });

  };
});


// Gestion des Erreurs
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
