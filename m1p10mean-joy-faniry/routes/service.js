var express = require('express');
var { authenticateManagerToken } = require("../src/middleware/managerMiddleware");

var router = express.Router();
var serviceController = require("../src/controller/serviceController");


router.get('/service', serviceController.getServices);

router.get('/service/:serviceId', serviceController.getServiceDetail)

router.post('/service', /* authenticateManagerToken, */ serviceController.addService)

router.put('/service/:serviceId', /* authenticateManagerToken, */ serviceController.updateService)

router.put('/service/:serviceId/statut', /* authenticateManagerToken, */ serviceController.changeServiceStatut)
// /service/statut?id&statut -- tokony asiana validator

module.exports = router;
