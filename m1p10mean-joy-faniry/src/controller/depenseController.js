const { getError } = require("../helper/error");
const { addDepense } = require("../service/depenseService")

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

module.exports = {
    ajoutDepense
};