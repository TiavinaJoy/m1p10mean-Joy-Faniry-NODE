const { getError } = require("../helper/error");
const { rdvParMois } = require("../service/dash");
const { listeRole } = require("../service/roleService")

async function rdvMensuel( req , res ) {
    try{
        const roles = await rdvParMois(req.query);
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
    rdvMensuel
};