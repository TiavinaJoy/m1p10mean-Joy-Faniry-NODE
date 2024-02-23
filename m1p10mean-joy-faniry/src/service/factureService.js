const facture = require("../model/facture");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const utilisateur = require("../model/utilisateur");
const rendezVous = require("../model/rendezVous");


async function listefacture() {
    const retour = {};
    try{
        const factures = await facture.find({});
        retour.status = 200;
        retour.message = "OK";
        retour.data =   factures;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}

async function createFactureFromId(idRdv, idClient, prix){
    const retour = {};
    try{
        const client = utilisateur.findOne({_id: new ObjectId(idClient)});
        const rdv = rendezVous.findOne({_id:new ObjectId(idRdv)});
        if(  client === null || rdv === null) throw new Error(client === null ? "Client introuvable" : "Rendez-vous introuvable");
        return createFactureFromRdv(rdv, client, prix);
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}
async function createFactureFromRdv(rdv, client, prix){
    const retour = {};
    try{
        const factureToAdd = new facture({
            rendezVous: rdv,
            client: client,
            prix: prix
        });
        const facture = await factureToAdd.save();
        retour.status = 200;
        retour.message = "Facture enregistrée.";
        retour.data =   facture;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}
async function findById(id){
    const retour = id;
    try {
        const factureFound = await facture.find({_id: new ObjectId(id)});
        if(factureFound.length == 1) return factureFound[0];
        throw new Error('Rôle introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}


module.exports = {
    listefacture, findById, createFactureFromRdv, createFactureFromId
};