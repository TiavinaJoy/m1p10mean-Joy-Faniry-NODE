var express = require('express');
var router = express.Router();
const depenseController = require('../src/controller/depenseController');
const { authenticateManagerToken } = require('../src/middleware/managerMiddleware');
/* GET home page. */
router.post('/depense', /* authenticateManagerToken, */depenseController.ajoutDepense);
router.get('/depense', /* authenticateManagerToken, */depenseController.listeDepense);

module.exports = router;
