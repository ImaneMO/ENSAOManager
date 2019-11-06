var express = require('express');
var router = express.Router();
var eModule = require("../models/databaseModels").eModules
router.get('/:id',(req, res, next) => {
  var id = req.params.id;
  var query = { _id: id };
  eModule.find(query, (err, elmt) => {
      if (err) {
        res.json({ success: false, data: err });
      }
      res.json({ success: true, data: elmt });
    });
})
router.get('/searchByIntitulee/:value',(req, res, next) => {
  var value = req.params.value;
  var query = { intitulee:  { $regex: /S/, $options: value } };
  eModule.find({ intitulee: {$regex: ".*" + value + ".*"}} , (err, elmt) => {
      if (err) {
        res.json({ success: false, data: err });
      }
      res.json({ success: true, data: elmt });
    });
})
module.exports = router;