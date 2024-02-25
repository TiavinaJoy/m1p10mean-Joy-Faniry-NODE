var express = require('express');
var router = express.Router();
var paiementController = require("../src/controller/paiementController");
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");
const { param, validationResult } = require('express-validator');
const { getExpressValidatorError } = require('../src/helper/error');


router.post('/paiement/facture/:factureId/client/:clientId', [
    param('factureId').notEmpty().trim().escape().withMessage("La facture est obligatoire"),
    param('clientId').notEmpty().trim().escape().withMessage("Le payeur(débiteur) est obligatoire"),  
], async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(getExpressValidatorError(errors));
    }
    await paiementController.paiementFacture(req, res);
});

router.get('/paiement', paiementController.listePaiement);

module.exports = router;
