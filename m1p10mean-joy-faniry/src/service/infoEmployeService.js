const infoEmploye = require("../model/infoEmploye");
const service = require("../model/service");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");



async function findById(id){
    try {
        const categorie = await infoEmploye.find({_id: new ObjectId(id)});
        if(categorie.length == 1) return categorie[0];
        throw new Error('information employé introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}

async function createInfoEmploye(data){
    const retour = {};
    try {
        // tadiavina daholo le service
        var listeIdService = [];
        data.service.forEach(service => {
            listeIdService.append(new ObjectId(service))
        });
        const filtre = {_id:{$in:listeIdService}};
        const services = await service.find(filtre);
        data.service = services;
        const  newInfoEmploye =  new infoEmploye(data);
        await newInfoEmploye.save()
        retour.status = 201;
        retour.message = "Information enregistré";
        retour.data = {
            infoEmploye: newInfoEmploye,
            user: newClient
        };
        return retour;
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}


module.exports = {
    createInfoEmploye, findById
};