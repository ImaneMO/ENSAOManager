var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var questionSchema = new Schema({
    type: { type: String, enum: ['Unique', 'MultiChoix', 'Image', 'Formule'], required: true }, //Unique,MultiChoix,Image
    questionText: { type: String, required: true },
    reponses: [{
        reponse: { type: String, required: true },
        isTrue: { type: Boolean, default: false }
    }],
    created_by: { type: Schema.Types.ObjectId, ref: "prof", required: true },
    partie: {  type: Schema.Types.ObjectId, ref: "Partie", required: false },
    eModule: { type: Schema.Types.ObjectId, ref: "eModule", required: false },
    filiere: [{ type: Schema.Types.ObjectId, ref: "filiere" }],
    nb_use: { type: Number, default:0},
    nb_true: { type: Number, default:0},
    created_at: { type: Date, default: Date() },
});

const Question = module.exports = mongoose.model('Question', questionSchema);


module.exports.getAllQuestions = (callback, limit) => {
    Question.find(callback).limit(limit);
}
module.exports.getQuestion = (id, callback) => {
    Question.findById(id, callback);
}
module.exports.getQuestionByElmt = (id, callback) => {
    var query = { eModule: id };
    Question.find(query, callback);
}
// Add Question
module.exports.addQuestion = (question, callback) => {
    Question.create(question, callback);
}

// Update Question
module.exports.updateQuestion = (question, options, callback) => {
    var query = { _id: question._id };
    Question.findOneAndUpdate(query, question, options, callback);
}

// Delete Question
module.exports.removeQuestion = (id, callback) => {
    var query = { _id: id };
    Question.remove(query, callback);
}