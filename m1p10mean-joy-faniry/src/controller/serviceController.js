const { listeService, createService } = require("../service/serviceService");
const { getError } = require("../helper/error");

async function getServices( req , res ) {
    try{
        const services = await listeService();
        res.status(services.status).send({
            "status": services.status,
            "message": services.message,
            "data": services.data
        });
    }catch(error){
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function createService(req,res) {
    try {
        const service = await createService(req.body);
        res.status(service.status).send({
            "status": service.status,
            "message": serviceservice.message,
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


module.exports = {
    getServices, createService
}