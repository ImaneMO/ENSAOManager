//--------- dependences ------------
var express    = require('express');
var path 	   = require('path');
var router     = express.Router();
var multer     = require ('multer');
var alert = require('alert-node');
var notifier = require('node-notifier');




//--------- models---------------
var Filiere = require("../models/databaseModels").filiere;
var Prof    = require("../models/databaseModels").profs;
var Module  = require("../models/databaseModels").modules;
var eModule = require("../models/databaseModels").eModules;

//pour le chargement  du fichier
var storage =   multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/app/ComptesUpload/files/')//a partir du la racine
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

router.post('/api/upload',function(req,res){
    var upload = multer(
	{
		storage : storage,
		//verification de xslx
		fileFilter: function (req, file, callback) {
			var ext = path.extname(file.originalname);
			if(ext !== '.xlsx' && ext !== '.xls') {
				return callback(new Error('Only Excel files are allowed'))
			}
			callback(null, true)
		}
	}).single('myFile');
	
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file or not Excel files are uploaded.");
        }
		if(typeof require !== 'undefined') XLSX = require('xlsx');
		var workbook = XLSX.readFile(req.file.path);

		/* DO SOMETHING WITH workbook HERE */

		var first_sheet_name = workbook.SheetNames[0];
		/* Get worksheet */
		var worksheet = workbook.Sheets[first_sheet_name];
		var data = XLSX.utils.sheet_to_json(worksheet,{raw:true});
		console.log("Longeur du tableau : "+ data[0]['nom']);
		//var row = data_json[0].length;
		var longeur = data.length-1;
		var ids_module=[];
		var id_admin=req.user._id;
		
		var nomRes= data[0]['responsableNom'];//en majuscule
		var prenomRes=data[0]['responsablePrenom'];//en majuscule
		var loginRes = nomRes+prenomRes;

		var responsable = new Prof({
                  nom:nomRes,
                  prenom:prenomRes,
                  login:loginRes,
                  grade:"PA",
                  security_mask:2,
                  password:password
                 });
				 
      var respo_id=responsable._id;

      Prof.findOneAndRemove({login: loginRes}, function(err){
        if(err) console.log("erreur est survenue");
        else   console.log("le prof de login a été supprimé avec succès");
    });
       responsable.save(function (err) {
            if (err)
            {
            console.log("responsable non sauvegardé");
            }
            else
            {
            console.log('responsable saved');

            }
          });
		
		for (var i = 0 ; i<longeur ;i++)
		{

       //le coordinateur
       var nom    = data[i]['nomCoordinateur'];
       var prenom = data[i]['prenomCoordinateur'];
       var login  = (prenom+nom);
       var password = "password"

      /* var prof = new Prof({
                  nom:nom,
                  prenom:prenom,
                  login:login,
                  grade:"PA",
                  security_mask:2,
                  password:password
                 });
      var prof_id=prof._id;

	  

      Prof.findOneAndRemove({login: login}, function(err){
        if(err) console.log("erreur est survenue");
        else   console.log("le prof de login a été supprimé avec succès");
    });
       prof.save(function (err) {
            if (err)
            {
            console.log("prof non sauvegardé");
            }
            else
            {
            console.log('prof saved');

            }
          });*/
		  
      //les elements de modules
       var emod1 = new eModule({
         intitulee : data[i]['eModule1'],
         createdBy : id_admin,
         updatedBy :id_admin,
         /*sendTo : [{
            _id :prof_id,
            permision : 'w'
        
           }]*/
       }) ;
	   
       //eModule.findOneAndRemove({intitulee: emod1.intitulee}, function(err){
		eModule.findOneAndRemove({intitulee:  emod1.intitulee}, function(err){
        if(err) console.log("erreur est survenue");
        else   console.log("le eModule1 de l'intitulee a été supprimé avec succès");
		});
		
	   if(emod1.intitulee){
       emod1.save(function(err)
      {
          if(!err){console.log('eModul1 saved');}
      });
		}
       emod1_id=emod1._id;

       var emod2 = new eModule({
         intitulee : data[i]['eModule2'],
         createdBy : id_admin,
         /*sendTo : [{
            _id :prof_id,
            permision : 'w'
           }]*/
       }) ;
       eModule.findOneAndRemove({intitulee: emod2.intitulee}, function(err){
        if(err) console.log("erreur est survenue");
        else   console.log("le eModule2 de l'intitulee a été supprimé avec succès");
    });
	
	  if(emod2.intitulee){
       emod2.save(function(err)
       {
           if(!err){console.log('eModul2 saved');}
       });
		}

       emod2_id=emod2._id;

          //le module

          var module=new Module({
            intitulee:data[i]['module'],
			filiere: data[0]['filiere'],
			respoFiliere: prenomRes+' '+nomRes,
            departement:data[i]['departement'],
            //coordonnateur:prof_id,
            eModules:[emod1_id,emod2_id],
            createdBy :id_admin,
            updatedBy :id_admin
        });
        Module.findOneAndRemove({intitulee: module.intitulee}, function(err){
            if(err) console.log("erreur est survenue");
            else   console.log("le module de l'intitulee  a été supprimé avec succès");
        });
        module.save(function(err)
          {
            if(err) console.log('module non sauvegardé');
            else console.log('module saved');
        });
			ids_module.push(module._id);
		
		}
		
	
	
		
    var intitulee=data[0]['filiere'];
	
		  
    var filiere=new Filiere({
      intitulee:intitulee,
	  responsable:respo_id,
      createdBy:id_admin,
	  annee1 : {
              s1 : [ids_module[0],ids_module[1],ids_module[2],ids_module[3],ids_module[4],ids_module[5] ],
			  s2 : [ids_module[6],ids_module[7],ids_module[8],ids_module[9],ids_module[10],ids_module[11] ]
                },
         annee2 : {
             s1 : [ids_module[12],ids_module[13],ids_module[14],ids_module[15],ids_module[16],ids_module[17] ],
             s2 : [ids_module[18],ids_module[19],ids_module[20],ids_module[21],ids_module[22],ids_module[23] ]
                },
         annee3 : {
             s1 : [ids_module[24],ids_module[25],ids_module[26],ids_module[27],ids_module[28],ids_module[29] ],
             s2 : [ids_module[30]]
         }
    });
    Filiere.findOneAndRemove({intitulee:filiere.intitulee}, function(err){
        if(err) console.log("erreur est survenue");
        else   console.log("la filiere de l'intitulee  a été supprimé avec succès");
    });
    filiere.save(function(err)
      {
        if(err) console.log('filiere non sauvegardé');
        else 
			//alert('import de filière fait avec succès !');
			console.log('filiere saved');
			notifier.notify({
				'title': 'Import de '+intitulee+' a réussi',
				'subtitle':'Export Action',
				'message': 'Export réussi!',
				'icon':'img/favicon.ico',
				'contentImage': 'img/image.jpg',
				'sound': 'ding.mp3',
				'wait': true
				});
		
    });
	
		//eModule.findOne({intitulee:''}).remove().exec();
    res.redirect('/app/#!/Gest-Filiere/filiere');
	
	


    });
});
module.exports=router;
