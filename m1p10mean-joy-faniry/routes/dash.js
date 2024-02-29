var express = require('express');
var router = express.Router();
var dashController = require("../src/controller/dashController");
const { body, validationResult, param } = require('express-validator');
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");
const { getExpressValidatorError } = require('../src/helper/error');
const { authenticateManagerToken } = require('../src/middleware/managerMiddleware');


router.get('/dash/rdvParMois',authenticateManagerToken, dashController.rdvMensuel );
router.get('/dash/rdvParJour',authenticateManagerToken, dashController.rdvJournalier );
router.get('/dash/avgWorkTime',authenticateManagerToken, dashController.avgTempsTravail );
router.get('/dash/caMensuel',authenticateManagerToken, dashController.CAMensuel );
router.get('/dash/caJournalier',authenticateManagerToken, dashController.CAJournalier );
router.get('/dash/profitMensuel',authenticateManagerToken, dashController.profiMensuel);
module.exports = router;
