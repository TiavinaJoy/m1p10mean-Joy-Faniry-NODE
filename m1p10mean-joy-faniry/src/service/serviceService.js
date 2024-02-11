const service = require("../model/service");
const serviceCategorie = require("../model/serviceCategorie");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");

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
        // Mila alaina any am base ilay categorie
        const categorieId = data.categorie
        const categorie = await serviceCategorie.find(new ObjectId(categorieId));
        if(categorie.length != 1) throw new Error('Categorie introuvable.');
        newService.categorie = categorie[0];
        console.log(categorie)
        console.log(newService);
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