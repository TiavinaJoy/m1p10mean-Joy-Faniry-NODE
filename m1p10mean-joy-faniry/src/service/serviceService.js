const service = require("../model/service");
const { mongoose } = require("../configuration/database");

async function listeService() {
    const retour = {};
    try{
        const services = await service.find({});
        retour.status = 200;
        retour.message = "OK";
        retour.data = services;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}

async function createService(data) {
    const retour = {};
    try{
        const newService = new service(data);
        newService.statut = 1;
        await newService.save();
        retour.status = 201;
        retour.message = "Service créé.";
        retour.data = {
            service: newService
        };
        return retour;
    }catch(error){
       throw error;
    }finally{
        mongoose.connection.close
    }    
}

module.exports = {
    listeService, createService
};