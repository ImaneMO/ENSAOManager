var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var partieSchema = new Schema({
    partieText: { type: String, required: true },
    eModule: { type: Schema.Types.ObjectId, ref: "eModule", required: false },
    filiere: [{ type: Schema.Types.ObjectId, ref: "filiere" }],
    created_at: { type: Date, default: Date() },
});

const Partie = module.exports = mongoose.model('Partie', partieSchema);


module.exports.getAllParties = (callback, limit) => {
    Partie.find(callback).limit(limit);
}
module.exports.getPartie = (id, callback) => {
    Partie.findById(id, callback);
}
module.exports.getPartieByElmt = (id, callback) => {
    var query = { eModule: id };
    Partie.find(query, callback);
}
module.exports.getPartieByname = (id,name, callback) => {
    var query = { eModule: id,
        partieText: name };
    Partie.find(query, callback);
}
// Add Partie
module.exports.addPartie = (partie, callback) => {
    Partie.create(partie, callback);
}

// Update Partie
module.exports.updatePartie = (partie, options, callback) => {
    var query = { _id: partie._id };
    var update = {
        type: partie.type
    }
    Partie.findOneAndUpdate(query, update, options, callback);
}

// Delete Partie
module.exports.removePartie = (id, callback) => {
    var query = { _id: id };
    Partie.remove(query, callback);
}