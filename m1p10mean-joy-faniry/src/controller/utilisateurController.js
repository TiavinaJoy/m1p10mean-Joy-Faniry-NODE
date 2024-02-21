const { inscription,connexion } = require("../service/utilisateurService.js");
const { getError } = require("../helper/error");

async function register( req , res ) {
    try{
        const registre = await inscription(req.body);
        res.status(registre.status).send({
            "status": registre.status,
            "message": registre.message,
            "data": registre.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

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
    register,
    login
}