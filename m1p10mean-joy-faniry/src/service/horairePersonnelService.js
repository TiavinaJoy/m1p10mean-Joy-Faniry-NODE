const { mongoose } = require("../configuration/database");
const  horairePersonnel  = require("../model/horairePersonnel");
const employe = require("../model/utilisateur");
const { ObjectId,ISODate } = require("mongodb");
const {filtreValidation,disableIndex} = require('../helper/validation');
const { timezoneDateTime } = require("../helper/DateHelper");

async function ajoutHoraire(data,params) {
    const retour = {};
    try{
        disableIndex(horairePersonnel,{'personnel.mail':1});

        const personnel = await employe.findById(params.personnelId);

        const debut = new Date(data.dateDebut);
        debut.setHours(debut.getHours() + 3);
        const fin = new Date(data.dateFin);
        fin.setHours(fin.getHours() + 3);

        const heureAlreadyIn = await horairePersonnel.find(
            {
                $or: [
                  { $and: [ {"personnel._id":params.personnelId },{ dateDebut: { $lte: timezoneDateTime(data.dateDebut).toISOString() } }, { dateFin: { $gte: timezoneDateTime(data.dateDebut).toISOString() } }] },
                  { $and: [ {"personnel._id":params.personnelId },{ dateDebut: { $lte: timezoneDateTime(data.dateFin).toISOString() } }, { dateFin: { $gte: timezoneDateTime(data.dateFin).toISOString() } }] },
                  { $and: [ {"personnel._id":params.personnelId },{ dateDebut: { $gte: timezoneDateTime(data.dateDebut).toISOString() } }, { dateFin: { $lte: timezoneDateTime(data.dateFin).toISOString() } }] }
                ]
              }
        );
        if(heureAlreadyIn.length != 0) throw new Error("Il y a un chevauchement d'heure, heure déjà incluse dans une autre ou qui s'écrase");
        /*{
            var debutUpdate = heureAlreadyIn[0].dateDebut >= timezoneDateTime(data.dateDebut).toISOString() ? debut : heureAlreadyIn[0].dateDebut ;
            var finUpdate = heureAlreadyIn[0].dateFin >= timezoneDateTime(data.dateFin).toISOString() ?  heureAlreadyIn[0].dateFin : fin;
           
            //problème sur la dateFin,tsy ilay maxindray no alainy
            const updateHorairePersonnel = await horairePersonnel.updateOne(
                {
                    _id: new ObjectId(heureAlreadyIn[0]._id),
                    'personnel._id': new ObjectId(params.personnelId)
                }, 
                {
                    $set:{
                        dateDebut: debutUpdate,
                        dateFin: finUpdate
                    }
                }
            );
            retour.data = updateHorairePersonnel;
            retour.message = "Horaire modifiée";

        }else {
            const horaireExistant = await horairePersonnel.find(
                {
                    'personnel._id': personnel._id,
                    dateDebut: timezoneDateTime(data.dateDebut).toISOString(),
                    dateFin: timezoneDateTime(data.dateFin).toISOString()

                }
            );
            if(horaireExistant.length > 0) throw new Error("Cet horaire est enregistré");

        }    */ 
        data.personnel = personnel;
        data.dateDebut  = debut;
        data.dateFin = fin;
        const horaire = new horairePersonnel(data);
        await horaire.save();

        retour.data = horaire;
        retour.message = "Horaire ajoutée";   
        retour.status = 200;

        return retour;
    }catch(error){
        console.log(error)
        throw error;
    }finally {
        mongoose.connection.close
    }
}

async function listeHorairesEmp(params,query) {
    const retour = {};
    try{
        var filtre = {};
        if(filtreValidation(query.dateDebutMin) || filtreValidation(query.dateDebutMax)){
            if(filtreValidation(query.dateDebutMin) && filtreValidation(query.dateDebutMax)) filtre.dateDebut ={

                $gte: timezoneDateTime(query.dateDebutMin).toISOString(), 
                $lte: timezoneDateTime(query.dateDebutMax).toISOString(),
                
            }
            else if (filtreValidation(query.dateDebutMin) && !filtreValidation(query.dateDebutMax)) {
                filtre.dateDebut = {$gte:  timezoneDateTime(query.dateDebutMin).toISOString()}
            }  
            else if (!filtreValidation(query.dateDebutMin) && filtreValidation(query.dateDebutMax)) { 
                filtre.dateDebut = {$lte: timezoneDateTime(query.dateDebutMax).toISOString()} 
            }
        }
        if(filtreValidation(query.dateFinMax) || filtreValidation(query.dateFinMin)){
            if(filtreValidation(query.dateFinMin) && filtreValidation(query.dateFinMax)) filtre.dateFin ={

                $gte: timezoneDateTime(query.dateFinMin).toISOString(), 
                $lte: timezoneDateTime(query.dateFinMax).toISOString()

            }
            else if (filtreValidation(query.dateFinMin) && !filtreValidation(query.dateFinMax)) {

                filtre.dateFin = {$gte: timezoneDateTime(query.dateFinMin).toISOString()}
            }
            else if (!filtreValidation(query.dateFinMin) && filtreValidation(query.dateFinMax)) {

                filtre.dateFin = {$lte: timezoneDateTime(query.dateFinMax).toISOString() }
            }
        }
        filtre["personnel._id"] = new ObjectId(params.personnelId) 
        var page = query.page ??  0;
        var perPage = query.perPage ?? 10;
        //const horaire = await horairePersonnel.find(filtre);
        const horaire = await horairePersonnel.paginate(
            filtre,
            { 
                offset: perPage * page, 
                limit: perPage
            }
        );

        retour.data = horaire;
        retour.status = 200;
        retour.message = "Ok";
        return retour;
    }catch(error){
        throw error;
    }finally {
        mongoose.connection.close
    }
}

async function checkHoraireRdv(dateRdv, finRdv, employeId) {
    try{
        const filtre = {
            'personnel._id': new ObjectId(employeId),
            dateDebut: { $lte: dateRdv.toISOString() },
            dateFin: { $gte: finRdv.toISOString() }
        }
        const getHoraires = await horairePersonnel.find(filtre);
        if(getHoraires.length > 0) return true; 
        else return false;
    }catch(error){
        throw error;
    }finally{
        mongoose.connection.close;
    }
}
module.exports = { ajoutHoraire,listeHorairesEmp,checkHoraireRdv }