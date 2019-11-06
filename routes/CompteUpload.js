var express=require('express');
var path = require('path');
var router = express.Router();
var multer = require ('multer');
var notifier = require('node-notifier');




//-----models---------------
var User = require("../models/databaseModels").profs;

//pour l'upload
var storage =   multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/app/ComptesUpload/files/')//à partir du la racine
	},
	
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
  });

router.post('/api/exemple/upload',function(req,res){
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
		var data_json = XLSX.utils.sheet_to_json(worksheet,{raw:true});
		var longeur = data_json.length-1;
		var _idResp;
		var path_setting = '/app/#!/Settings';

		for (var i = 0 ; i<longeur ;i++)
		{		
				var user=new User({
				nom          :data_json[i]['nom'], // en majuscule en xlsx
				prenom       :data_json[i]['prenom'], // en majuscule en xlsx
				login        :data_json[i]['login'],
				tel          :data_json[i]['tel'],
				email        :data_json[i]['email'],
				grade        :data_json[i]['grade'],
				security_mask: data_json[i]['security_mask'],
				password     :data_json[i]['password'],
				specialite : data_json[i]['specialite'],
				filiere:	data_json[i]['filiere'],
				matieres     : [],
				modules      : []
				});
				
				User.findOneAndRemove({login: data_json[i]['login']}, function(err){
				if(err) console.log("erreur est survenue");
				else    console.log("le prof de login "+data_json[i]['login']+"a été supprimé avec succès");
				});

				user.save(function(err) {
				if (err) throw err;
				else console.log("le compte du prof a été bien crée.");
			
			});
			
			}
				res.redirect(path_setting);
				notifier.notify(
				{
				'title': 'Import Comptes réussi',
				'subtitle': 'Export Action',
				'message': 'Export réussi!',
				'icon':'img/favicon.ico',
				'contentImage': 'img/image.jpg',
				'sound': 'ding.mp3',
				'wait': true
				});

    });
});

module.exports=router;
