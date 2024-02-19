var express = require('express');
var router = express.Router();
var clientController = require("../src/controller/clientController");
var roleController = require("../src/controller/roleController");
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/role',roleController.listeRoles);

router.post('/client', clientController.register);

router.post('/client/login', clientController.login);

router.get('/clientTest', authenticateClientToken, function(req,res){
  res.status(200).send({
      data:'Lien client test avec middleware'
  })
});

module.exports = router;
