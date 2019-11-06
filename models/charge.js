var mongoose = require("mongoose");
// var Schema=mongoose.Schema;
var moment = require('moment');


var chargesSchema = mongoose.Schema({

  Semestre			:{type:String},
  // anneescolaire:{ 
        // Semestre      :{type:String},
        // },
		
		
  niveau    :{type:String},
  IntutileModule: { type: String },
  ElementdeModule: { type: String },
  Coordinnateur: { type: String, uppercase: true },

  Departement: { type: String },

  totalfinalCRs: { type: String, default: 0 },
  totalinitialCRs: { type: String, default: 0 },
  CRs: {
    NbreSceance: { type: String, default: 1 },
    NbreGroupe: { type: String, default: 1 },
    NbreOccurence: { type: String, default: 1 }
 			 
  },
 
  totalfinalTD: { type: String, default: 0 },

  totalinitialTD: { type: String, default: 0 },
  TD: {

    NbreSceance: { type: String, default: 1 },
    NbreGroupe: { type: String, default: 1 },
    NbreOccurence: { type: String, default: 1 }
			 
  },

  totalfinalTP: { type: String, default: 0 },
  totalinitialTP: { type: String, default: 0 },
  TP: {

    NbreSceance: { type: String, default: 1 },
    NbreGroupe: { type: String, default: 1 },
    NbreOccurence: { type: String, default: 1 }
				 
  },
  total: { type: String },
  active: { type: Boolean, default: "false" },
  filiere: { type: String },
  intervenantrole: { type: String, default: "permanent" },
  annee: {
    type: String,
    default: moment(new Date()).format("YYYY")
  }
});
var archiveSchema =mongoose.Schema({ 
    Semestre     :{type:String},

        niveau            :{type:String},
  IntutileModule  :{type:String},
  ElementdeModule :{type:String},
  Coordinnateur   :{type: String, uppercase: true },
  
  Departement     :{type:String},
  // CRs        :{type:String,default : 0},
     totalfinalCRs: {type:String,default : 0},
   totalinitialCRs:{type:String ,default : 0},
   CRs :{
             NbreSceance:{type:String,default : 1},
           NbreGroupe:{type:String,default : 1},
       NbreOccurence:{type:String,default : 1}
             // totalinitialcour:{type:String}
             // intervenantCour: {type:String},
             // type:{type:String}       
    },
  // TD       :{type:String,default : 0},
  totalfinalTD: {type:String,default : 0},

    totalinitialTD:{type:String ,default : 0},
  TD :{
             
            NbreSceance:{type:String,default : 1},
           NbreGroupe:{type:String,default : 1},
       NbreOccurence:{type:String,default : 1}
             // totalinitialTD:{type:String}
             // intervenantTD: {type:String},
             // type:{type:String}         
    },
  // TP       :{type:String,default : 0},
  totalfinalTP: {type:String,default : 0},
  totalinitialTP:{type:String ,default : 0},
   TP :{
             
           NbreSceance:{type:String,default : 1},
           NbreGroupe:{type:String,default : 1},
       NbreOccurence:{type:String,default : 1}
             // totalinitialTP:{type:String}
             // intervenantTP: {type:String},
             // type:{type:String}         
    },
  total     :{type:String},
  filiere     :{type:String},
  intervenantrole: {type:String},

   annee:{type:String},
  // annee :{type:String},
});
var EnseignantSchema = mongoose.Schema({

  Coordinnateur: { type: String, uppercase: true },
  Departement: { type: String },
  totale: { type: String,default: 0 },
  intervenantrole: { type: String, default: "permanent" },
  annee: {
    type: String,
    default: moment(new Date()).format("YYYY")
  }
});
module.exports = {
charge: mongoose.model('charge',chargesSchema),
archive:mongoose.model('archive',archiveSchema),
enseignant:mongoose.model('enseignant',EnseignantSchema)
};


