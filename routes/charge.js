var express    =require('express');
var Chargeroute=express.Router();
var async = require('async');
var conEnsure =require('connect-ensure-login');
var Chargesc = require('../models/charge').charge;
var archivesSchema=require('../models/charge').archive;
var enseignantSchema=require('../models/charge').enseignant;


var errorMessage = function(code,message){
    return {code : code,message : message}
}

var okMessage = function(code,message,data){
    return {code : code,message : message , data : data}
}


//listecharge
Chargeroute.get('/getCharge',function(req,res){
        Chargesc.find(function(err, charges){
		console.log(charges);
		if(err)
			res.send(err);
		res.json(charges);
	});
});

Chargeroute.get('/getCharge/:id',function(req,res){	
     console.log("I'm here hhhhhh");
	Chargesc.findOne({_id:req.params.id}, function(err, charge){
		if(err)
			res.send(err);
		res.json(charge);
	});
});

Chargeroute.post('/api/charges', function(req, res){
	
async.waterfall([
            function (callback) {
                Chargesc.find({Coordinnateur: req.body.Coordinnateur},{ElementdeModule: req.body.ElementdeModule}, function (err, doc) {
                    if (err) return callback({code: '002', message: "database problem!", data: err})
                    if (doc.length > 0) return callback({code: '003', message: "ce nom d'enseignant existe déja  !!"});
                    callback(null);
                });
            },
			 function (callback) {
                Chargesc.find({Coordinnateur: req.body.Coordinnateur},{ElementdeModule: req.body.ElementdeModule}, function (err, doc) {
                    if (err) return callback({code: '002', message: "database problem!", data: err})
                    if (doc.length > 0) return callback({code: '003', message: "ce nom d'enseignant existe déja  !!"});
                    callback(null);
                });
            },
            function (callback) {
                var newChar = new Chargesc({
					Semestre: req.body.Semestre,
					niveau: req.body.niveau,
					IntutileModule: req.body.IntutileModule,
					ElementdeModule: req.body.ElementdeModule,
					Departement: req.body.Departement,
					totalfinalCRs: req.body.totalfinalCRs,
                    totalfinalTD: req.body.totalfinalTD,
                    totalfinalTP: req.body.totalfinalTP,
                    filiere: req.body.filiere,
					totale: req.body.totale,
					intervenantrole: req.body.intervenantrole,   
                });
                newChar.save(function (err) {
                    if (err) return callback({code: '002', message: "database problem!"});
                    callback(null);
                });
            },
        ],
		function (err, data) {
            if (err) {
                res.send(JSON.stringify(err, null, '\t'));
                console.log(JSON.stringify(err, null, '\t'))
            }
            else {
                res.send(JSON.stringify({code: "200", message: "", data: data}, null, '\t'));
                console.log(JSON.stringify({code: "200", message: "", data: data}, null, '\t'))
            }


        }
		 )
	
	
	
	
	Chargesc.create( req.body, function(err, charges){
		if(err)
			res.send(err);
		res.json(charges);
	});
});

Chargeroute.delete('/getCharge/:id', function(req, res){
	Chargesc.findOneAndRemove({_id:req.params.id}, function(err, charge){
		if(err)
			res.send(err);
		res.json(charge);
	});
});


// inline update1

  Chargeroute.put('/api/charges/:id', function(req, res){
	  console.log("ok i'm here");
	 var query = {
		Semestre:req.body.Semestre,		
		Coordinnateur :req.body.Coordinnateur ,
		IntutileModule:req.body.IntutileModule,
		ElementdeModule:req.body.ElementdeModule,
		Departement:req.body.Departement,	
        CRs:req.body.CRs,
		TD:req.body.TD,
		TP:req.body.TP,
		totalinitialCRs:req.body.totalinitialCRs,
		totalinitialTD:req.body.totalinitialTD,
		totalinitialTP:req.body.totalinitialTP,
		totalfinalCRs:req.body.totalfinalCRs,
		totalfinalTD:req.body.totalfinalTD,
		totalfinalTP:req.body.totalfinalTP,
		filiere:req.body.filiere,
		niveau:req.body.niveau,
		active: req.body.active	
		
		
 };	 
	 Chargesc.findOneAndUpdate({_id:req.params.id}, query, function(err, charge){
		 if(err)
			 res.send(err);
		 res.json(charge);
		 console.log("ok i'llllll finish");
	});
	// }
 });
/////////////////////////////////archive ////////////////////////

Chargeroute.get('/charge/:id',function(req,res){	
     console.log("I'm here hhhhhh");
	Chargesc.find({annee:req.params.id}, function(err, charge){

		if(err)
			res.send(err);
		res.json(charge);
	});
});
Chargeroute.get('/archive',function(req,res){
        archivesSchema.find(function(err, charges){
		console.log(charges);
		if(err)
			res.send(err);
		res.json(charges);
	});
});
//insert charge dans archive
Chargeroute.put('/api/archive/:id', function(req, res){
	  var data=JSON.parse(req.params.id);
var archi;
for (var j = 0 ; j<data.length ;j++)
{
	  			archi = new archivesSchema();
	  			archi.niveau=data[j]['niveau'];
                archi.Semestre=data[j]['Semestre'];		
				archi.IntutileModule=data[j]['IntutileModule'];
				archi.ElementdeModule=data[j]['ElementdeModule'];
				archi.Coordinnateur=data[j]['Coordinnateur'];
				archi.Departement=	data[j]['Departement'];			
				archi.CRs.type=data[j]['type'];
				archi.total=data[j]['total'];
				archi.filiere=data[j]['filiere'];
				archi.annee=data[j]['annee'];

archi.save(function(err) {
			if (err) throw err;
						 console.log("le semestre est  : "+archi.Semestre+" "+archi.ElementdeModule+" a ete bien cree.");
			});
}			
		});
	 
	 Chargeroute.delete('/getChargeremove/:id', function(req, res){
	console.log("remove");
	Chargesc.remove({annee:req.params.id}, function(err, charge){
		if(err)
			res.send(err);
		res.json(charge);
	});
});

///////////////////////////////Desarchivage ///////////////////////////////////


Chargeroute.get('/Desarchivage/:id',function(req,res){	
     console.log("I'm here hhhhhh");
	archivesSchema.find({annee:req.params.id}, function(err, charge){

		if(err)
			res.send(err);
		res.json(charge);
	});
});

//insert charge dans archive
Chargeroute.put('/arc/:id', function(req, res){
	  var data=JSON.parse(req.params.id);
var charge;
for (var j = 0 ; j<data.length ;j++)
{
	  			charge = new Chargesc();
	  			charge.niveau=data[j]['niveau'];
                charge.Semestre=data[j]['Semestre'];
		
				charge.IntutileModule=data[j]['IntutileModule'];
				charge.ElementdeModule=data[j]['ElementdeModule'];
				charge.Coordinnateur=data[j]['Coordinnateur'];
				charge.Departement=	data[j]['Departement'];
			
				charge.CRs.type=data[j]['type'];
				charge.total=data[j]['total'];
				charge.filiere=data[j]['filiere'];
				charge.annee=data[j]['annee'];

charge.save(function(err) {
			if (err) throw err;
						 console.log("le semestre est  : "+charge.Semestre+" "+charge.ElementdeModule+" a ete bien cree.");
			});
}			
		});
	 
	 Chargeroute.delete('/removearchive/:id', function(req, res){
	console.log("removearchive");
	archivesSchema.remove({annee:req.params.id}, function(err, charge){
		if(err)
			res.send(err);
		res.json(charge);
	});
});
/////////////////////////desarchivage niveau //////////////////////////////////////
Chargeroute.get('/Desarchivage/:id1/:id2',function(req,res){	
     console.log("I'm here hhhhhh");
	var query={$and:[{annee:req.params.id1},{niveau:req.params.id2}]};
	archivesSchema.find(query, function(err, charge){

		if(err)
			res.send(err);
		res.json(charge);
	});
});

//insert charge dans archive

	 
	 Chargeroute.delete('/removearchive/:id1/:id2', function(req, res){
	console.log("remove");
	archivesSchema.remove({annee:req.params.id1,anneescolaire:req.params.id2}, function(err, charge){
		if(err)
			res.send(err);
		res.json(charge);
	});
});
Chargeroute.get('/enseignant',function(req,res){
        enseignatSchema.find(function(err, enseignant){	
		if(err)
			res.send(err);
		
	});
});

Chargeroute.post('/api/enseignant', function(req, res){
    async.waterfall([
            function (callback) {
                enseignantSchema.find({Coordinnateur: req.body.Coordinnateur},{totale: req.body.totale}, function (err, doc) {
                    if (err) return callback({code: '002', message: "database problem!", data: err})
                    if (doc.length > 0) return callback({code: '003', message: "ce nom d'enseignant existe déja  !!"});
                    callback(null);
                });
            },
            function (callback) {
                var newEnsei = new enseignantSchema({
                    Coordinnateur: req.body.Coordinnateur,
                    Departement: req.body.Departement,
                    totale: req.body.totale,
                    
                });
                newEnsei.save(function (err) {
                    if (err) return callback({code: '002', message: "database problem!"});
                    callback(null, module._id);
                });
            },
        ],
		function (err, data) {
            if (err) {
                res.send(JSON.stringify(err, null, '\t'));
                console.log(JSON.stringify(err, null, '\t'))
            }
            else {
                res.send(JSON.stringify({code: "200", message: "", data: data}, null, '\t'));
                console.log(JSON.stringify({code: "200", message: "", data: data}, null, '\t'))
            }


        }
		 )
		 
});
Chargeroute.get('/getEnseigant',function(req,res){
        enseignantSchema.find(function(err, charges){
		console.log(charges);
		if(err)
			res.send(err);
		res.json(charges);
	});
});
module.exports=Chargeroute;