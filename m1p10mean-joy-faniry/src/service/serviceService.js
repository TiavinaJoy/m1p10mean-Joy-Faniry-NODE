const service = require("../model/service");
const serviceCategorie = require("../model/serviceCategorie");
const { mongoose } = require("../configuration/database");
const {findById} = require("./serviceCategorieService");
const { ObjectId } = require("mongodb");
const {filtreValidation, toBoolean} = require('../helper/validation');

async function lesServices() {
    const retour = {};
    try{
        const services = await service.find({});
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

async function listeService(query) {
    const retour = {};
    try{

        var filtre = {};
        if(filtreValidation(query.prixMin) || filtreValidation(query.prixMax)){
            if(filtreValidation(query.prixMin) && filtreValidation(query.prixMax)) filtre.prix ={
                $gte: query.prixMin, 
                $lte: query.prixMax
            }
            else if (filtreValidation(query.prixMin) && !filtreValidation(query.prixMax)) filtre.prix = {$gte: query.prixMin}
            else if (!filtreValidation(query.prixMin) && filtreValidation(query.prixMax)) filtre.prix = {$lte: query.prixMax}
        }
        if(filtreValidation(query.comMin) || filtreValidation(query.comMax)){
            if(filtreValidation(query.comMin) && filtreValidation(query.comMax)) filtre.commission ={
                $gte: query.comMin, 
                $lte: query.comMax
            }
            else if (filtreValidation(query.comMin) && !filtreValidation(query.comMax)) filtre.commission = {$gte: query.comMin}
            else if (!filtreValidation(query.comMin) && filtreValidation(query.comMax)) filtre.commission = {$lte: query.comMax}
        }
        if(filtreValidation(query.dureeMin) || filtreValidation(query.dureeMax)){
            if(filtreValidation(query.dureeMin) && filtreValidation(query.dureeMax)) filtre.duree ={
                $gte: query.dureeMin, 
                $lte: query.dureeMax
            }
            else if (filtreValidation(query.dureeMin) && !filtreValidation(query.dureeMax)) filtre.duree = {$gte: query.dureeMin}
            else if (!filtreValidation(query.dureeMin) && filtreValidation(query.dureeMax)) filtre.duree = {$lte: query.dureeMax}
        }
        if(filtreValidation(query.nom)) filtre.nom = {$regex: query.nom , '$options' : 'i'}
        if(filtreValidation(query.description)) filtre.description = {$regex: query.description , '$options' : 'i'}
        if(filtreValidation(query.statut) ) filtre.statut = toBoolean(query.statut)
        if(filtreValidation(query.categorie) ) filtre["categorie._id"] = query.categorie;
        console.log(filtre);
       
        const perPage = query.perPage ?? 10;
        const page = query.page ?? 0;

        const services = await service.paginate(
            filtre,
            { 
                offset: perPage * page , 
                limit: perPage
            }
        ).then({});
        retour.status = 200;
        retour.message = "OK";
        retour.data = services;
        return retour;
    }catch(error){
        console.log(error);
        throw error;
     }finally{
         mongoose.connection.close;
     } 
}

/*async function listeService(query) {
    const retour = {};
    try{
        var stat = false;
        
        if(query.statut == 1) {
            stat = true;
        }
        else if(query.statut == 0) {
            stat = false;
        } 
        else {
            stat = ''
        }

        var queries = {
            $or: [
                {
                    prix:{ $gte: query.prixMin, $lte: query.prixMax }
                },
                {
                    commission:{ $gte: query.comMin , $lte: query.comMax  }
                },
                {
                    duree:{ $gte: query.dureeMin , $lte: query.dureeMax  }
                },
                {
                    statut: stat
                },
                {
                    nom:  { $regex: query.nom } 
                },
                {
                    description:  { $regex: query.description } 
                }
            ]
        }

        if (query.categorie !== '') {
            queries.$or.push({ 'categorie._id': new ObjectId(query.categorie) });
        }

        const services = await service.paginate(
            queries,
            { 
                offset: query.perPage * query.page, 
                limit: query.perPage
            }
        ).then({});
        retour.status = 200;
        retour.message = "OK";
        retour.data = services;
        return retour;
    }catch(error){
        console.log(error);
        throw error;
     }finally{
         mongoose.connection.close;
     } 
}*/

async function createService(data) {
    const retour = {};
    try{
        const newService = new service(data);
        const categorieId = data.categorie
        const categorie = await findById(categorieId);
        newService.categorie = categorie;
        console.log(categorie)
        console.log(newService);
        newService.statut = 1;

        await newService.save();
        retour.status = 201;
        retour.message = "Service créé.";
        retour.data = {
            service: newService
        };
        return retour;
    }catch(error){
       throw error;
    }finally{
        mongoose.connection.close
    }    
}

async function modifyService(params, data){
    const retour = data;
    try {
        const filtre = {_id: new ObjectId (params.serviceId)};
        const newData = {$set:{
            nom: data.nom,
            prix: data.prix,
            commission: data.commission,
            duree: data.duree,
            statut: data.statut ?? 1, /* misy statut ve ???? */
            description: data.description,
            categorie: await findById(data.categorie)
        }}
        const updateService = await service.updateOne(filtre, newData);
        retour.status = 200;
        retour.message = "Service mis à jour.";
        retour.data = {
            service: updateService
        };
        return retour
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    }
}

async function modifierStatutService(params, query){
    try {
        const updateService = await service.updateOne({_id: new ObjectId(params.serviceId)}, {$set:{statut: query.statut}});

        return {
            status : 200,
            message : "Service mis à jour eeee.",
            data:{
                service:updateService
            }
        }
    } catch (error) {
        throw error;   
    }finally{
        mongoose.connection.close
    }
}

async function detailService(params){
    const retour = {};
    try {
        const id = params;
        const findService = await service.find({_id: new ObjectId(params.serviceId)});
        if(findService.length == 1) {
            retour.status = 200;
            retour.message = "";
            retour.data = {
                service: findService[0]
            };
            return retour;
        };
        throw new Error('Service introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}


module.exports = {
    listeService, createService, modifyService, modifierStatutService, detailService,lesServices
};