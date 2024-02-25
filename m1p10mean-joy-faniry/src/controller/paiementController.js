const { getError } = require("../helper/error");
const { ajoutPaiement, getListePaiement } = require("../service/paiementService")

async function paiementFacture( req , res ) {
    try{
        const paiements = await ajoutPaiement(req.params);
        res.status(paiements.status).send({
            "status": paiements.status,
            "message": paiements.message,
            "data": paiements.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function listePaiement( req , res ) {
    try{
        const paiements = await getListePaiement(req.query);
        res.status(paiements.status).send({
            "status": paiements.status,
            "message": paiements.message,
            "data": paiements.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": ""
        });
    }
}

module.exports = {
    paiementFacture, listePaiement
};