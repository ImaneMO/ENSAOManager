var express =require('express');
var path = require('path');
var router = express.Router();
var multer = require ('multer');
var mongoxlsx = require('mongo-xlsx');
var mongoose = require('mongoose');
var async = require('async');
var alert = require('alert-node');
var notifier = require('node-notifier');

 



//-----models---------------
var User = require("../models/databaseModels").profs;
var Filiere = require("../models/databaseModels").filiere;
var eModule = require("../models/databaseModels").eModules;
var Modules = require("../models/databaseModels").modules;

//------------Message----------
var message="L'import de filière a réussi !";


		
router.get('/FiliereDownload/files',function(req,res)
{
	/*Filiere.find({},{_id:false,creationDate:false,__v:false,lastUpdate:false})
	.populate({path:'responsable', select:{'nom':1,'prenom':1,'_id':0}})
	//.populate({path:'createdBy'  , select:{'nom':1,'prenom':1,'_id':0}})

	.populate([
		
		{path  : 'annee1.s1',select : {'intitulee':1,'coordonnateur':1,'eModules':1,'_id':0}},
		{path  : 'annee1.s2',select : {'intitulee':1,'coordonnateur':1,'eModules':1,'_id':0}},
		{path  : 'annee2.s1',select : {'intitulee':1,'coordonnateur':1,'eModules':1,'_id':0}},
		{path  : 'annee2.s2',select : {'intitulee':1,'coordonnateur':1,'eModules':1,'_id':0}},
		{path  : 'annee3.s1',select : {'intitulee':1,'coordonnateur':1,'eModules':1,'_id':0}},
		{path  : 'annee3.s2',select : {'intitulee':1,'coordonnateur':1,'eModules':1,'_id':0}}
		])*/
	
	Modules.find({},{_id:false,universite:false,etablissement:false,
				     prerequis:false,objectif:false,didactique:false,
					 modalitee_evaluation:false,note:false,note_minimal:false,
					 createdBy:false,sendTo:false,creationDate:false,lastUpdate:false,
					 updatedBy:false,status:false,__v:false,eModules:false})
			.populate({path:'coordonnateur', select:{'nom':1,'prenom':1,'_id':0}})
			//.populate({path:'eModules',select:{'intitulee':1,'_id':0,'volume_horaire':1}})

	
	/*eModule.find({})
		//.populate({path:'sendTo',select:{'_id':1,'permision':0,'convention':0}})
		  .populate({path:'eModules',select:{'intitulee':1,'_id':0,'volume_horaire':1}})*/
		  
	
	.exec(function(err, data) 
	{
		if(err)
		{
			console.log("erreur retrouver la filiere");
		}
		else{
			//res.json(data);

			//var model= mongoxlsx.buildDynamicModel(data);
			
			
			
			var model=[
				{displayName:'Détail de Filière : ',access:'hh',type:'string'},
			    {displayName:'Filiere',access:'filiere',type:'string'},
				{displayName:'Responsable de filière ',access:'respoFiliere',type:'string'},
				{displayName:'Module',access:'intitulee',type:'string'},
				//{displayName:'Coordinateur ',access:'coordonnateur',type:'string'},
				{displayName:'Département',access:'departement',type:'string'},
				//{displayName:'volume horaire',access:'volume_horaire',type:'string'},
				//{displayName:'element de modules',access:'eModules',type:'string'},
				//{displayName:'volume horaire',access:'volume_horaire',type:'string'}
				];
			 
				/*var model=[
			    {displayName:'element de modules',access:'intitulee',type:'string'},
				//{displayName:'Responsable de filière ',access:'respoFiliere',type:'string'},
				//{displayName:'Module',access:'intitulee',type:'string'},
				//{displayName:'Coordinateur ',access:'coordonnateur',type:'string'},
				//{displayName:'Département',access:'departement',type:'string'},
				  {displayName:'volume horaire',access:'volume_horaire',type:'string'},
				];*/
			
				//console.log(model);
			mongoxlsx.mongoData2Xlsx(data,model, function(err, data) {
				if(err)
				{
				//res.json(message);
				console.log("fichier excel n'est pas généré");
				res.sendFile(data);
			}
				else
				{
				//alert('export de filère fait avec succès !');
				console.log("le fichier excel est  genere");
				notifier.notify({
				'title': 'Export Filières réussi',
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
		
		
		res.redirect('/app/#!/Gest-Filiere/filiere');

	});
});


module.exports=router;


