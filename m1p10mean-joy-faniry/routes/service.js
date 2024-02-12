var express = require('express');
var { authenticateManagerToken } = require("../src/middleware/managerMiddleware");

var router = express.Router();
var serviceController = require("../src/controller/serviceController");


router.get('/service', serviceController.getServices);

router.post('/service', /* authenticateManagerToken, */ serviceController.addService)

router.put('/service', /* authenticateManagerToken, */ serviceController.updateService)

module.exports = router;
