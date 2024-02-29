const serviceCategorie = require("../model/serviceCategorie");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");


async function listeCategorie() {
    const retour = {};
    try{
        const categorie = await serviceCategorie.find({});
        retour.status = 200;
        retour.message = "OK";
        retour.data = categorie;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}

async function findById(id){
    console.log(id);
    const filtre = {_id: new ObjectId(id)}; 
    console.log(filtre)
    try {
        const categorie = await serviceCategorie.findOne(filtre);
        console.log(categorie == null);
        if(categorie != null) return categorie;
        throw new Error('Categorie introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}


module.exports = {
    listeCategorie, findById
}