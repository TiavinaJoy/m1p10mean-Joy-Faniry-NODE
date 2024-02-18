const { listeCategorie } = require("../service/serviceCategorieService");
const { getError } = require("../helper/error");


async function getCategorie( req , res ) {
    try{
        const categorie = await listeCategorie();
        res.status(categorie.status).send({
            "status": categorie.status,
            "message": categorie.message,
            "data": categorie.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body ?? req.params
        });
    }
}

module.exports = {
    getCategorie
}