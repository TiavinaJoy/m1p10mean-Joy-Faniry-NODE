var express = require('express');
var router = express.Router();
var personnelController = require("../src/controller/personnelController");

router.post('/personnel', personnelController.login);

module.exports = router;
