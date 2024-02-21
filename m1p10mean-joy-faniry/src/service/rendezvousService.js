const rendezVous = require("../model/rendezVous");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const utilisateur = require("../model/utilisateur");


async function ajoutRendezVous(params, data) {
    const retour = {};
    try{
        const client = await utilisateur.findOne({_id: params.utilisateurId});
        const personnel = await utilisateur.findOne({_id: data.personnel});
        const service = await service.find({_id: data.service});
        // check horraire personnel
        // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||-------------
        // =============================================================
        if(true){
            const rdv = {
                client: client,
                personnel: personnel,
                service: service,
                dateRendezVous: data.dateRendezVous
            }
            const newRdv = new rendezVous(rdv);
            const createdRdv= await newRdv.save();
            retour.status = 201;
            retour.message = "Rendez-vous plannifié.";
            retour.data = createdRdv;
            return retour;
        }else{
            throw new Error("Personnel indisponible");
        }
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}




module.exports = {
    ajoutRendezVous
};