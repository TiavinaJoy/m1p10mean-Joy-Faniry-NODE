var express = require('express');
var router = express.Router();
var clientController = require("../src/controller/clientController");

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/client', clientController.register);

router.post('/client/login', clientController.login);

module.exports = router;
