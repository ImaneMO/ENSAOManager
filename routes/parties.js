var express = require('express');
var router = express.Router();
var Partie = require('../models/Partie');

/* GET parties listing. */
router.get('/', (req, res, next) => {
    Partie.getAllParties((err, parties) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: parties });
    });
});
/* GET partie by id listing. */
router.get('/:id', (req, res, next) => {
    Partie.getPartie(req.params.id, (err, partie) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: partie });
    });
});
/* GET partie by id element listing. */
router.get('/emodule/:id', (req, res, next) => {
    Partie.getPartieByElmt(req.params.id, (err, partie) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: partie });
    });
});
router.get('/emodule/:id/name/:name', (req, res, next) => {
    Partie.getPartieByname(req.params.id,req.params.name, (err, partie) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: partie });
    });
});
/* POST partie listing. */
router.post('/', (req, res, next) => {
    var partie = req.body;
    Partie.addPartie(partie, (err, partie) => {
        if (err) {
            res.json({ success: false, data: err });
        }
        res.json({ success: true, data: partie });
    })
});
/* Delete qyestion listing. */
router.delete('/:id', (req, res, next) => {
    var id = req.params.id;
    Partie.removePartie(id, (err) => {
      if (err) {
        res.json({ success: false, data: err });
      }
      res.json({ success: true });
    })
  });

module.exports = router;