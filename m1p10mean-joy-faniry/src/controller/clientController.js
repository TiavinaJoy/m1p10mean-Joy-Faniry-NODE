const { inscription,connexion } = require("../service/clientService");
const { getError } = require("../helper/validation");

async function register( req , res ) {
    try{
        const registre = await inscription(req.body);
        res.status(registre.status).send({
            "message": registre.message,
            "data": registre.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function login(req, res) {
    try{
        const log = await connexion(req.body);
        res.status(log.status).send({
            "message": log.message,
            "data": log.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "message": getError(error).message,
            "data": req.body
        });
    }
}
module.exports = {
    register,
    login
}