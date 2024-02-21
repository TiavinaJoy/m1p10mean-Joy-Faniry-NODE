const rendezVous = require("../model/rendezVous");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");


async function ajoutRendezVous(data) {
    const retour = {};
    try{
        // const roles = await role.find({intitule: {$ne: 'Client'}});
        // if()
        retour.status = 200;
        retour.message = "OK";
        retour.data = roles;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}



module.exports = {
    ajoutRendezVous
};