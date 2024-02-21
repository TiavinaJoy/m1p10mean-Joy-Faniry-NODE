var express = require('express');
var router = express.Router();
var horairePersonnelController = require("../src/controller/horairePersonnelController");
var { authenticateEmployeToken } = require("../src/middleware/employeMiddleware");

router.post('/horaire/:personnelId',authenticateEmployeToken, horairePersonnelController.addHoraire);

router.get('/horaire/:personnelId/search',authenticateEmployeToken, horairePersonnelController.listeHoraire);

module.exports = router;
