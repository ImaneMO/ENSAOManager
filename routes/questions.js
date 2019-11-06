var express = require('express');
var router = express.Router();
var Question = require('../models/Question');
var eModule = require("../models/databaseModels").eModules

/* GET questions listing. */
router.get('/', (req, res, next) => {
    Question.getAllQuestions((err, questions) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: questions });
    });
});
/* GET question by id listing. */
router.get('/:id', (req, res, next) => {
    Question.getQuestion(req.params.id, (err, question) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: question });
    });
});
/* GET question by id element listing. */
router.get('/emodule/:id', (req, res, next) => {
    Question.getQuestionByElmt(req.params.id, (err, question) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: question });
    });
});
/* POST question listing. */
router.post('/', (req, res, next) => {
    var question = req.body;
    question.created_by = req.user._id
    Question.addQuestion(question, (err, question) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: question });
    })
});

/* PUT question listing. */
router.put('/:id', (req, res, next) => {
    var question = req.body;
    Question.updateQuestion(question, {}, (err, book) => {
      if (err) {
        res.json({ success: false, data: err });
      }
      res.json({ success: true, data: question });
    });
  });
/* Delete qyestion listing. */
router.delete('/:id', (req, res, next) => {
    var id = req.params.id;
    Question.removeQuestion(id, (err) => {
      if (err) {
        res.json({ success: false, data: err });
      }
      res.json({ success: true });
    })
  });
module.exports = router;