const { connexion } = require("../service/personnelService");
const { getError } = require("../helper/error");


async function login(req, res) {
    try{
        const log = await connexion(req.body);
        res.status(log.status).send({
            "status": log.status,
            "message": log.message,
            "data": log.data
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
    login
}