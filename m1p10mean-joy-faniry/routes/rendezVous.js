var express = require('express');
var router = express.Router();
var rendezvousController = require("../src/controller/rendezvousController");
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");

router.post('/rendezVous', rendezvousController.addRendezVous);



module.exports = router;
