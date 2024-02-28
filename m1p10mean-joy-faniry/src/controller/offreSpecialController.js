const { listeOffre, createOffre, modifyOffre, modifierStatutOffre, detailOffre,lesOffres} = require("../service/offreSpecialService");
const { getError } = require("../helper/error");

async function getLesOffres( req , res ) {
    try{
        const offres = await lesOffres();
        res.status(offres.status).send({
            "status": offres.status,
            "message": offres.message,
            "data": offres.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function getOffres( req , res ) {
    try{
        const offres = await listeOffre(req.query);
        res.status(offres.status).send({
            "status": offres.status,
            "message": offres.message,
            "data": offres.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body ?? req.params
        });
    }
}

async function addOffre(req , res) {
    try {
        const offre = await createOffre(req.body);
        res.status(offre.status).send({
            "status": offre.status,
            "message": offre.message,
            "data": offre.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}

async function updateOffre(req, res) {
    try {
        const offre = await modifyOffre(req.params,req.body);
        res.status(offre.status).send({
            "status": offre.status,
            "message": offre.message,
            "data": offre.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}

async function changeOffreStatut(req, res) {
    try {
        const data = req.query;
        const offre = await modifierStatutOffre(req.params, req.query); 
        res.status(offre.status).send({
            "status": offre.status,
            "message": offre.message,
            "data": offre.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        }); 
    }
}

async function getOffreDetail(req,res) {
    try {
        const data = req.query;
        const offre = await detailOffre(req.params); 
        res.status(offre.status).send({
            "status": offre.status,
            "message": offre.message,
            "data": offre.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        }); 
    }
}
module.exports = {
    getOffres, addOffre, updateOffre, changeOffreStatut, getOffreDetail,getLesOffres
}