const { mongoose } = require("../configuration/database");
const  horairePersonnel  = require("../model/horairePersonnel");
const employe = require("../model/utilisateur");
const { ObjectId,ISODate } = require("mongodb");
const {filtreValidation,disableIndex} = require('../helper/validation');

async function ajoutHoraire(data,params) {
    const retour = {};
    try{
        disableIndex(horairePersonnel,{'personnel.mail':1});

        const personnel = await employe.findById(params.personnelId);

        const horaireExistant = await horairePersonnel.find(
            {
                'personnel._id': personnel._id,
                dateDebut: data.dateDebut,
                dateFin: data.dateFin

            }
        );
        
        if(horaireExistant.length > 0) throw new Error("Cet horaire est enregistré");

        data.personnel = personnel;
        const horaire = new horairePersonnel(data);
        await horaire.save();

        retour.data = horaire;
        retour.status = 201;
        retour.message = "Horaire ajoutée";
        return retour;
    }catch(error){
        console.log(error)
        throw error;
    }finally {
        mongoose.connection.close
    }
}
//{dateDebut: {$gte: ISODate('2024-02-22T05:00:00.000Z')} }
async function listeHorairesEmp(params,query) {
    const retour = {};
    try{
        var filtre = {};
        var dateIso = '';
console.log(new Date(query.dateDebutMin).toISOString());
        if(filtreValidation(query.dateDebutMin) || filtreValidation(query.dateDebutMax)){
            if(filtreValidation(query.dateDebutMin) && filtreValidation(query.dateDebutMax)) filtre.dateDebut ={

                $gte: ISODate(new Date(query.dateDebutMin).toISOString()), 
                $lte: ISODate(new Date(query.dateDebutMax).toISOString())
                
            }
            else if (filtreValidation(query.dateDebutMin) && !filtreValidation(query.dateDebutMax)) {

                dateIso = new Date(query.dateDebutMin)
                filtre.dateDebut = {$gte:  new Date(query.dateDebutMin)}

                console.log("DateDebutMin uniquement")
            }  
            else if (!filtreValidation(query.dateDebutMin) && filtreValidation(query.dateDebutMax)) { 
                filtre.dateDebut = {$lte: ISODate(new Date(query.dateDebutMax).toISOString())} 
                console.log("DateDebutMax uniquement")
            }
        }
        if(filtreValidation(query.dateFinMax) || filtreValidation(query.dateFinMin)){
            if(filtreValidation(query.dateFinMin) && filtreValidation(query.dateFinMax)) filtre.dateFin ={

                $gte: ISODate(new Date(query.dateFinMin).toISOString()), 
                $lte: ISODate(new Date(query.dateFinMax).toISOString())

            }
            else if (filtreValidation(query.dateFinMin) && !filtreValidation(query.dateFinMax)) {

                filtre.dateFin = {$gte: ISODate(new Date(query.dateFinMin).toISOString())}
                console.log("DateFinMin uniquement")

            }
            else if (!filtreValidation(query.dateFinMin) && filtreValidation(query.dateFinMax)) {

                filtre.dateFin = {$lte: ISODate(new Date(query.dateFinMax).toISOString()) }
                console.log("DateFinMax uniquement")

            }
        }
        //filtre['personnel._id'] = {_id:new ObjectId(params.personnelId)}
        console.log(filtre);
        const horaire = await horairePersonnel.find(filtre);

        retour.data = horaire;
        retour.status = 200;
        retour.message = "Ok";
        return retour;
    }catch(error){
        console.log(error)
        throw error;
    }finally {
        mongoose.connection.close
    }
}

module.exports = { ajoutHoraire,listeHorairesEmp }