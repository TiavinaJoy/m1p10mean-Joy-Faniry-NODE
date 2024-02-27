var express = require('express');
var router = express.Router();
var dashController = require("../src/controller/dashController");
const { body, validationResult, param } = require('express-validator');
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");
const { getExpressValidatorError } = require('../src/helper/error');


router.get('/dash/rdvParMois', dashController.rdvMensuel );

module.exports = router;
