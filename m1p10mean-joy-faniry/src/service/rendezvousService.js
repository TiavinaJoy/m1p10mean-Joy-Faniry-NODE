const rendezVous = require("../model/rendezVous");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const utilisateur = require("../model/utilisateur");
const { filtreValidation } = require("../helper/validation");
const service = require("../model/service");
const { disableIndex } = require("../helper/removeIndex");
const { timezoneDateTime } = require("../helper/DateHelper");
const { checkHoraireRdv } = require("./horairePersonnelService");
const { createFactureFromRdv } = require("./factureService");


async function ajoutRendezVous(params, data) {
    const retour = {};
    const session =await mongoose.startSession();
    session.startTransaction();
    try{
        disableIndex(rendezVous, {'client.mail':1});
        disableIndex(rendezVous, {'personnel.mail':1});
        disableIndex(rendezVous, {'client._id':1});
        const dateRdv = timezoneDateTime(data.dateRendezVous)
        const dateFinRdv = dateRdv;
        const client = await utilisateur.findOne({_id: new ObjectId(params.utilisateurId)});
        const personnel = await utilisateur.findOne({_id: new ObjectId(data.personnel)});
        const services = await service.findOne({_id: new ObjectId(data.service)});
        dateFinRdv.setMinutes(dateFinRdv.getMinutes() + services.duree);
        const checkHorraire = await checkHoraireRdv(dateRdv, dateFinRdv, data.personnel);
        const checkChevauchement = await trouverCheuvauchement(dateRdv, dateFinRdv, params.utilisateurId, data.personnel);
        if( checkHorraire && !checkChevauchement ){
            const rdv = {
                client: client,
                personnel: personnel,
                service: services,
                dateRendezVous: dateRdv,
                dateFin: dateFinRdv
            }
            const newRdv = new rendezVous(rdv);
            // newRdv.collection.getIndexes((err, indexes) => {
            //     if (err) {
            //     //   console.error('Error retrieving indexes:', err);
            //     } else {
            //     //   console.log('Indexes:', indexes);
            //     }
            //   });

              console.log('---------------------')
            const createdRdv= await newRdv.save({session});
            const factures = await createFactureFromRdv(createdRdv, client, services.prix, session);
            retour.status = 201;
            retour.message = "Rendez-vous plannifié.";
            retour.data = {
                rendezVous: rdv,
                facture : factures.data
            };
            await session.commitTransaction()
            session.endSession()
            return retour;
        }else{
            throw new Error("Personnel indisponible");
        }
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        throw error;
     }finally{
         mongoose.connection.close
     } 
}

async function getDetailRendezVous(params){
    const retour = {};
    try{
        const rdv = await rendezVous.findOne({_id: new ObjectId(params.rendezVousId)});
        rdv.client.mdp = "";
        if(rdv === null) throw new Error("Rendez-vous introuvable.");
        retour.status = 200;
        retour.message = "";
        retour.data = createdRdv;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}

async function getPersonnelRendezVous(params, query){
    const retour = {};
    try{
        const filtre = {};
        filtre["personnel._id"] = new ObjectId(params.personnelId);
        if(filtreValidation(query.dateRendezVous))filtre.dateRendezVous = query.dateRendezVous;
        if(filtreValidation(query.dateRendezVousMin) || filtreValidation(query.dateRendezVousMax)){
            if(filtreValidation(query.dateRendezVousMin) && filtreValidation(query.dateRendezVousMax)) filtre.dateRendezVous ={
                $gte: query.dateRendezVousMin, 
                $lte: query.dateRendezVousMax
            }
            else if (filtreValidation(query.dateRendezVousMin) && !filtreValidation(query.dateRendezVousMax)) filtre.dateRendezVous = {$gte: timezoneDateTime(query.dateRendezVousMin).toISOString()}
            else if (!filtreValidation(query.dateRendezVousMin) && filtreValidation(query.dateRendezVousMax)) filtre.dateRendezVous = {$lte: query.dateRendezVousMax}
        }
        const rdv = await rendezVous.find(filtre);
        rdv.forEach(element => {
            delete element.client.mdp;
            delete element.personnel.mdp;
        });
        retour.status = 200;
        retour.message = "";
        retour.data = rdv;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     }
}

async function getClientRendezVous(params, query){
    const retour = {};
    try{
        const filtre = {};
        filtre["client._id"] = new ObjectId(params.clientId);
        if(filtreValidation(query.dateRendezVous))filtre.dateRendezVous = query.dateRendezVous;
        if(filtreValidation(query.dateRendezVousMin) || filtreValidation(query.dateRendezVousMax)){
            if(filtreValidation(query.dateRendezVousMin) && filtreValidation(query.dateRendezVousMax)) filtre.dateRendezVous ={
                $gte: query.dateRendezVousMin, 
                $lte: query.dateRendezVousMax
            }
            else if (filtreValidation(query.dateRendezVousMin) && !filtreValidation(query.dateRendezVousMax)) filtre.dateRendezVous = {$gte: timezoneDateTime(query.dateRendezVousMin).toISOString()}
            else if (!filtreValidation(query.dateRendezVousMin) && filtreValidation(query.dateRendezVousMax)) filtre.dateRendezVous = {$lte: query.dateRendezVousMax}
        }
        const rdv = await rendezVous.find(filtre);
        rdv.forEach(element => {
            delete element.client.mdp;
            delete element.personnel.mdp;
        });
        retour.status = 200;
        retour.message = "";
        retour.data = rdv;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     }
}

async function trouverCheuvauchement(dateDebut, dateFin, client, personnel){
    try {
        const chevauchement = await rendezVous.find(
            {
            $or: [
                { $and: [{"personnel._id": new ObjectId(personnel)} ,{ "client._id":new ObjectId(client)},{ dateRendezVous: { $lte: dateDebut.toISOString() } }, { dateFin: { $gte: dateDebut.toISOString() } }] },
                { $and: [{"personnel._id": new ObjectId(personnel)} ,{ "client._id":new ObjectId(client)},{ dateRendezVous: { $lte: dateFin.toISOString() } }, { dateFin: { $gte: dateFin.toISOString() } }] },
                { $and: [{"personnel._id": new ObjectId(personnel)} ,{ "client._id":new ObjectId(client)},{ dateRendezVous: { $gte: dateDebut.toISOString() } }, { dateFin: { $lte: dateFin.toISOString() } }] }
            ]
          });
          return chevauchement.length != 0;
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}
module.exports = {
    ajoutRendezVous, getDetailRendezVous, getPersonnelRendezVous, getClientRendezVous, trouverCheuvauchement
};