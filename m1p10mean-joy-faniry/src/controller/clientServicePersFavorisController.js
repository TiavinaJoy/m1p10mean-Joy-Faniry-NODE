const { createClientPreference,listeFavorisClient,updateStatutServiceFav,modificationFavoris } = require("../service/clientServicePersonnelFavorisService");
const { getError } = require("../helper/error");

async function addClientServFav(req, res){
    try {
        const favoris = await createClientPreference(req.body);
        res.status(favoris.status).send({
            "status": favoris.status,
            "message": favoris.message,
            "data": favoris.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}

async function listeFavClient(req, res){
    try {
        const favoris = await listeFavorisClient(req.params);
        res.status(favoris.status).send({
            "status": favoris.status,
            "message": favoris.message,
            "data": favoris.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.params
        });  
    }
}

async function updateFavClient(req, res){
    try {
        const favoris = await updateStatutServiceFav(req.params,req.query);
        res.status(favoris.status).send({
            "status": favoris.status,
            "message": favoris.message,
            "data": favoris.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.params
        });  
    }
}

async function updateFavoris(req, res){
    try {
        const favoris = await modificationFavoris(req.params,req.body);
        res.status(favoris.status).send({
            "status": favoris.status,
            "message": favoris.message,
            "data": favoris.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}

module.exports = {addClientServFav,listeFavClient,updateFavClient, updateFavoris}