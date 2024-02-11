const serviceCategorie = require("../model/serviceCategorie");
const { mongoose } = require("../configuration/database");

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



module.exports = {
    listeCategorie
};