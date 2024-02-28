var express = require('express');
var { authenticateManagerToken } = require("../src/middleware/managerMiddleware");

var router = express.Router();
var offreSpecialController = require("../src/controller/offreSpecialController");
var serviceCategorieController = require("../src/controller/serviceCategorieController");
const { body, validationResult } = require('express-validator');
const { getExpressValidatorError } = require('../src/helper/error');


router.get('/offre', offreSpecialController.getOffres);

router.get('/offres', offreSpecialController.getLesOffres);

router.get('/offre/:serviceId',offreSpecialController.getOffreDetail)



router.post('/offre', /* authenticateManagerToken, */[
    body('oldPrix').notEmpty().trim().escape().isNumeric().withMessage("Le prix original est obligatoire"),
    body('prix').notEmpty().trim().escape().isNumeric().withMessage("Le prix promotionnel est obligatoire"),
    body('finOffre').notEmpty().trim().escape().withMessage("La date de fin de l'offre est obligatoire"),  
], async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(getExpressValidatorError(errors));
    }
    await offreSpecialController.addOffre(req, res);
});

router.put('/offre/:serviceId', authenticateManagerToken, offreSpecialController.updateOffre)

router.put('/offre/:serviceId/statut', authenticateManagerToken, offreSpecialController.changeOffreStatut)
// /offre/statut?id&statut -- tokony asiana validator

router.get('/categorie', serviceCategorieController.getCategorie);

module.exports = router;
