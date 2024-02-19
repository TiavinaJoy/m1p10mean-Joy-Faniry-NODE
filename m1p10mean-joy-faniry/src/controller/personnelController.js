const { connexion, loginPersonnel, createPersonnel, changeStatutPersonnel , modificationPersonnel,modificationInfoEmploye} = require("../service/personnelService");
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
    try {
        const personnel = await modificationPersonnel(req.params, req.body);
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

async function changePersonnelStatut(req, res){
    try {
        const personnel = await changeStatutPersonnel(req.params, req.query);
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

async function detailPersonnel(req, res){
    try {
        const personnel = await getDetailPersonnel(req.params);
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

async function updateInfoEmploye(req, res){
    try {
        const personnel = await modificationInfoEmploye(req.params, req.body);
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
module.exports = {
    login, addPersonnel, updatePersonnel, changePersonnelStatut, detailPersonnel, updateInfoEmploye
}