const { connexion, loginPersonnel, createPersonnel } = require("../service/personnelService");
const { getError } = require("../helper/error");


async function login(req, res) {
    try{
        const log = await loginPersonnel(req.body);
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

async function addPersonnel(req, res){
    try {
        const personnel = await createPersonnel(req.body);
        res.status(personnel.status).send({
            "status": personnel.status,
            "message": personnel.message,
            "data": personnel.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}
async function updatePersonnel(req, res){
    res.status(501).send()
}

async function changeServiceStatut(req, res){
    res.status(501).send()
}
module.exports = {
    login, addPersonnel, updatePersonnel, changeServiceStatut
}