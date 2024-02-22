const { getError } = require("../helper/error");
const { ajoutHoraire,listeHorairesEmp } = require("../service/horairePersonnelService");

async function addHoraire(req, res){
    try {
        const horaire = await ajoutHoraire(req.body,req.params);
        res.status(horaire.status).send({
            "status": horaire.status,
            "message": horaire.message,
            "data": horaire.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}

async function listeHoraire(req, res){
    try {
        const horaire = await listeHorairesEmp(req.params,req.query);
        res.status(horaire.status).send({
            "status": horaire.status,
            "message": horaire.message,
            "data": horaire.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}


module.exports = { addHoraire,listeHoraire }