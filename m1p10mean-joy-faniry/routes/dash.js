var express = require('express');
var router = express.Router();
var dashController = require("../src/controller/dashController");
const { body, validationResult, param } = require('express-validator');
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");
const { getExpressValidatorError } = require('../src/helper/error');


router.get('/dash/rdvParMois', dashController.rdvMensuel );
router.get('/dash/rdvParJour', dashController.rdvJournalier );
router.get('/dash/avgWorkTime', dashController.avgTempsTravail );
router.get('/dash/caMensuel', dashController.CAMensuel );
router.get('/dash/caJournalier', dashController.CAJournalier );
router.get('/dash/profitMensuel', dashController.profiMensuel);
module.exports = router;
