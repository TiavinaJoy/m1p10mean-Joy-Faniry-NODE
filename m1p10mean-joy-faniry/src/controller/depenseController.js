const { getError } = require("../helper/error");
const { addDepense, getDepense } = require("../service/depenseService")

async function ajoutDepense( req , res ) {
    try{
        const depenses = await addDepense(req.body);
        res.status(depenses.status).send({
            "status": depenses.status,
            "message": depenses.message,
            "data": depenses.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}
async function listeDepense( req , res ) {
    try{
        const depenses = await getDepense(req.query);
        res.status(depenses.status).send({
            "status": depenses.status,
            "message": depenses.message,
            "data": depenses.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

module.exports = {
    ajoutDepense, listeDepense
};