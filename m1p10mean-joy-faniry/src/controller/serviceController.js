const { listeService, createService, modifyService, modifierStatutService, detailService} = require("../service/serviceService");
const { getError } = require("../helper/error");

async function getServices( req , res ) {
    try{
        const services = await listeService(req.query);
        res.status(services.status).send({
            "status": services.status,
            "message": services.message,
            "data": services.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body ?? req.params
        });
    }
}

async function addService(req , res) {
    try {
        const service = await createService(req.body);
        res.status(service.status).send({
            "status": service.status,
            "message": service.message,
            "data": service.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}

async function updateService(req, res) {
    try {
        const service = await modifyService(req.params,req.body);
        res.status(service.status).send({
            "status": service.status,
            "message": service.message,
            "data": service.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });  
    }
}

async function changeServiceStatut(req, res) {
    try {
        const data = req.query;
        const service = await modifierStatutService(req.params, req.query); 
        res.status(service.status).send({
            "status": service.status,
            "message": service.message,
            "data": service.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        }); 
    }
}

async function getServiceDetail(req,res) {
    try {
        const data = req.query;
        const service = await detailService(req.params); 
        res.status(service.status).send({
            "status": service.status,
            "message": service.message,
            "data": service.data
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
    getServices, addService, updateService, changeServiceStatut, getServiceDetail
}