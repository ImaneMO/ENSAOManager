var express    =require('express');
var chargerouter=express.Router();
var async     =require('async');
var conEnsure =require('connect-ensure-login');
var chargeSchema = require('../models/charge').charge;
var fs = require('fs');
var XLSX = require('xlsx');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var multer = require ('multer');
var upload = multer({ dest: './public/app/Gest-Charges/uploads/' })

//importfile excel
chargerouter.post('/insert', urlencodedParser, function(req, res,next) {
if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = './public/app/Gest-Charges/uploads/' + name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
      var workbook = XLSX.readFile(uploadpath);
console.log("ok i'm here");
var data_json;
for (var i = 0; i < workbook.SheetNames.length; i++) {
var sheet = workbook.Sheets[workbook.SheetNames[i]];
 data_json = XLSX.utils.sheet_to_json(sheet,{raw:true});
for (var j = 0 ; j<data_json.length ;j++)
		{
			
				var charge = new chargeSchema();
			    charge.niveau=data_json[j]['niveau'];
                charge.Semestre=data_json[j]['Semestre'];				
				charge.IntutileModule=data_json[j]['IntutileModule'];
				charge.ElementdeModule=data_json[j]['ElementdeModule'];
				charge.Coordinnateur=data_json[j]['Coordinnateur'];
				charge.Departement=	data_json[j]['Departement'];
				charge.totalinitialCRs=data_json[j]['CRs'];
				charge.totalinitialTD=data_json[j]['TD'];
                charge.totalinitialTP=data_json[j]['TP'];
			    charge.filiere=data_json[j]['filiere'];
				charge.total=data_json[j]['total'];			
				//charge.annee=data_json[j]['annee'];

				//charge.annee=data_json[j]['annee'];

			charge.save(function(err) {
			if (err) throw err;
						  console.log("le semestre est  : "+charge.Semestre+" "+charge.ElementdeModule+" a ete bien cree.");
			});
			for (var item in data_json[j])
			{
				console.log("valeur ["+j+"-"+item+"] du tableau : "+ data_json[j][item]);
			}
  
			}}

					res.redirect('/app/#!/Gest-Charges/liste');
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
});




module.exports=chargerouter;