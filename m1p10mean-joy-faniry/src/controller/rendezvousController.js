const { getError } = require("../helper/error");
const { ajoutRendezVous } = require("../service/rendezvousService")

async function addRendezVous( req , res ) {
    try{
        const roles = await ajoutRendezVous(req.params, req.body);
        res.status(roles.status).send({
            "status": roles.status,
            "message": roles.message,
            "data": roles.data
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
    addRendezVous
};