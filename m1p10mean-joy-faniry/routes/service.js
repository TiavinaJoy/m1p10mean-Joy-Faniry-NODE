var express = require('express');
var router = express.Router();
var serviceController = require("../src/controller/serviceController");

router.get('/service', serviceController.getServices);

router.post('/service', serviceController.createService)


module.exports = router;
