const { getError } = require("../helper/error");
const { rdvParMois, rdvParJour, tempsMoyenTrav, chiffreAffaireParMois, chiffreAffaireParJour } = require("../service/dashService");

async function rdvMensuel( req , res ) {
    try{
        const dashs = await rdvParMois(req.query);
        res.status(dashs.status).send({
            "status": dashs.status,
            "message": dashs.message,
            "data": dashs.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}
async function rdvJournalier(req, res){
    try{
        const dashs = await rdvParJour(req.query);
        res.status(dashs.status).send({
            "status": dashs.status,
            "message": dashs.message,
            "data": dashs.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}
async function avgTempsTravail(req, res){
    try{
        const dashs = await tempsMoyenTrav(req.query);
        res.status(dashs.status).send({
            "status": dashs.status,
            "message": dashs.message,
            "data": dashs.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function CAMensuel(req, res){
    try{
        const dashs = await chiffreAffaireParMois(req.query);
        res.status(dashs.status).send({
            "status": dashs.status,
            "message": dashs.message,
            "data": dashs.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function CAJournalier(req, res){
    try{
        const dashs = await chiffreAffaireParJour(req.query);
        res.status(dashs.status).send({
            "status": dashs.status,
            "message": dashs.message,
            "data": dashs.data
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
    rdvMensuel, rdvJournalier, avgTempsTravail, CAMensuel, CAJournalier
};