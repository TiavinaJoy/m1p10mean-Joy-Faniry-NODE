var express = require('express');
var router = express.Router();
var rendezvousController = require("../src/controller/rendezvousController");
const { body, validationResult, param } = require('express-validator');
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");

router.post('/rendezVous', authenticateClientToken,
[
    param('utilisateurId').notEmpty().trim().escape().withMessage("L'utilisateur est obligatoire"),
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



module.exports = router;
