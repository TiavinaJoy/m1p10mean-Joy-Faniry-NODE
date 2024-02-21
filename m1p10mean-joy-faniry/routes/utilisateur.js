var express = require('express');
var router = express.Router();
var roleController = require("../src/controller/roleController");
var utilisateurController = require("../src/controller/utilisateurController");
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/role',roleController.listeRoles);

router.post('/utilisateur/register', utilisateurController.register);

router.post('/utilisateur/auth', utilisateurController.login);


module.exports = router;
