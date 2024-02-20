var express = require('express');
var { authenticateClientToken } = require("../src/middleware/clientMiddleware");

var router = express.Router();
var clientServicePersFavorisController = require("../src/controller/clientServicePersFavorisController");

router.post('/favoris', authenticateClientToken, clientServicePersFavorisController.addClientServFav);

router.get('/favoris/:clientId', authenticateClientToken, clientServicePersFavorisController.listeFavClient);

router.put('/favoris/:favId/statut', authenticateClientToken, clientServicePersFavorisController.updateFavClient);

router.put('/favoris/:favId', authenticateClientToken, clientServicePersFavorisController.updateFavoris);


module.exports = router;
