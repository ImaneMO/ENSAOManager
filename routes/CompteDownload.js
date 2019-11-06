var express =require('express');
var path = require('path');
var router = express.Router();
var multer = require ('multer');
var mongoxlsx = require('mongo-xlsx');
var mongoose = require('mongoose');
var async = require('async');
var notifier = require('node-notifier');




//-----models---------------
var User = require("../models/databaseModels").profs;
var Filiere = require("../models/databaseModels").filiere;
var eModule = require("../models/databaseModels").eModules;
var Modules = require("../models/databaseModels").modules;

var path_settings='/app/#!/Settings';


var profExportSchema =  mongoose.Schema(
	{
		nom : { type : String,default : ''},
		prenom : { type : String,default : ''},
		tel : { type : String,default : '05-36-50-54-70/71'},
		grade : { type : String,default : ''},
		specialite : { type : String,default : ''},
		fax : { type : String,default : '0356505472'},
		email : { type : String,default : ''},
		password : String,
		login          :{type:String,required:true,unique:true},
		filiere        :{type:String}, //si l'user est un chef de filiere ===specifier la filiere
		type : { type : String,default : ''},
		active_semestre:Number
	}
);

		
router.get('/ComptesDownload/files',function(req,res)
{
	User.find({},{_id:false,security_mask:false,__v:false,firstlogin:false,fax:false,grade:false,specialite:false,type:false,notification:false,password:false})
	.exec(function(err, data) 
	{
		if(err)
		{
			console.log("erreur survenue");
		}
		else
		{
		
		var model = [
					 {displayName:'',access:'no',type:'string'},
					 {displayName:'Détails Professeurs : ',access:'titre',type:'string'},
					 {displayName:'Nom',access:'nom',type:'string'},
					 {displayName:'Prénom',access:'prenom',type:'string'},
					 {displayName:'Tél',access:'tel',type:'string'},
					 {displayName:'Identifiant',access:'login',type:'string'},
					 {displayName:'Email',access:'email',type:'string'}
					 
					];
					
			//var model= mongoxlsx.buildDynamicModel(data);
			
			mongoxlsx.mongoData2Xlsx(data,model, function(err, data) {
				if(err)
				{
				res.json(message);
				console.log('fichier excel généré');
				res.sendFile(data);
				}
				else
				{
				console.log(err);
				notifier.notify({
				'title': 'Export Comptes réussi',
				'subtitle': 'Export Action',
				'message': 'Export réussi!',
				'icon':'img/favicon.ico',
				'contentImage': 'img/image.jpg',
				'sound': 'ding.mp3',
				'wait': true
				});

				
				}
				
			});
			
		}

		res.redirect(path_settings);
		
				
				

		
	});
});

module.exports=router;

