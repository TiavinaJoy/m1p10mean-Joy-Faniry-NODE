var express = require('express');
var router = express.Router();
var rendezvousController = require("../src/controller/rendezvousController");
const { body, validationResult, param } = require('express-validator');
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");
const { getExpressValidatorError } = require('../src/helper/error');

router.post('/rendezVous/:utilisateurId', /*authenticateClientToken, */
[
    param('utilisateurId').notEmpty().trim().escape().withMessage("Le client est obligatoire"),
    body('personnel').isString().notEmpty().trim().escape().withMessage("Le personnel est obligatoire"),
    body('dateRendezVous').isString().notEmpty().trim().escape().withMessage("La date du rendez-vous est obligatoire"),
    body('service').notEmpty().withMessage("un service est requis pour un rendez-vous.")
], async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(getExpressValidatorError(errors));
    }
    await rendezvousController.addRendezVous(req, res);
});

router.get('/rendezVous/:rendezVousId', rendezvousController.detailRendezVous);
router.get('/rendezVous/personnel/:personnelId', rendezvousController.personnelRendezVous);
router.get('/rendezVous/client/:clientId', rendezvousController.clientRendezVous);
router.get('/rendezVous/transitions/all', rendezvousController.rendezVousStatut);
router.put('/rendezVous/:rendezVousId/transition/:statutId', rendezvousController.changerStatutService);

module.exports = router;
