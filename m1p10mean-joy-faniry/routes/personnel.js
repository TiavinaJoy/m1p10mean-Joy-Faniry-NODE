var express = require('express');
var router = express.Router();
var personnelController = require("../src/controller/personnelController");
var { authenticateEmployeToken } = require("../src/middleware/employeMiddleware");
var { authenticateManagerToken } = require("../src/middleware/managerMiddleware");
const { body, validationResult, query } = require('express-validator');
const { getExpressValidatorError } = require("../src/helper/error");


router.post('/personnel/auth', personnelController.login);

router.post ('/personnel' /*,authenticateManagerToken*/,
    [
        body('nom').notEmpty().trim().escape().withMessage("Le nom est obligatoire"),
        body('prenom').isString().notEmpty().trim().escape().withMessage("Le prénom est obligatoire"),
        body('mail').isString().notEmpty().trim().escape().withMessage("Le mail est obligatoire"),
        body('role').isString().notEmpty().trim().escape().withMessage("Le role est obligatoire"),
    ], async (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(getExpressValidatorError(errors));
        }
        await personnelController.addPersonnel(req, res);
    });

router.put('/personnel/:personnelId', /*authenticateEmployeToken,*/ personnelController.updatePersonnel)

router.put('/personnel/:personnelId/statut', /*authenticateManagerToken,*/
    [
        query('statut').notEmpty().isNumeric().withMessage("statut invalide")
    ], async (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(getExpressValidatorError(errors));
        }
        await personnelController.changePersonnelStatut(req, res);
});

router.get('/managerTest', authenticateManagerToken, function(req,res){
    res.status(200).send({
        data:'Lien manager test avec middleware'
    })
});

router.get('/employeTest', authenticateEmployeToken, function(req,res){
    res.status(200).send({
        data:'Lien employe test avec middleware'
    })
});


module.exports = router;
