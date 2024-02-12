const serviceCategorie = require("../model/serviceCategorie");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");


async function listeCategorie() {
    const retour = {};
    try{
        const serviceCategorie = await serviceCategorie.find({});
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

async function findById(id){
    const retour = id;
    try {
        const categorie = await serviceCategorie.find({_id: new ObjectId(id)});
        if(categorie.length == 1) return categorie[0];
        throw new Error('Categorie introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}



module.exports = {
    listeCategorie, findById
};