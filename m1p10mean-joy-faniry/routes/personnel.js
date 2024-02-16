var express = require('express');
var router = express.Router();
var personnelController = require("../src/controller/personnelController");
var { authenticateEmployeToken } = require("../src/middleware/employeMiddleware");
var { authenticateManagerToken } = require("../src/middleware/managerMiddleware");

router.post('/personnel/auth', personnelController.login);

router.post ('/personnel' /*,authenticateManagerToken*/, personnelController.addPersonnel)

router.put('/personnel/:personnelId', authenticateEmployeToken, personnelController.updatePersonnel)

router.put('/personnel/:personnelId/statut',authenticateManagerToken, personnelController.changeServiceStatut)

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
